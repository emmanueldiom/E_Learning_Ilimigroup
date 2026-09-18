import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Formation, FormationDocument } from '../../schemas/formation.schema';
import {
	Discipline,
	DisciplineDocument,
	ContentStatus,
} from '../../schemas/discipline.schema';
import {
	LearningModule,
	LearningModuleDocument,
} from '../../schemas/module.schema';
import { CreateDisciplineDto } from '../../dto/disciplines/create-discipline.dto';
import { UpdateDisciplineDto } from '../../dto/disciplines/update-discipline.dto';

@Injectable()
export class DisciplinesService {
	constructor(
		@InjectModel(Discipline.name)
		private readonly disciplineModel: Model<DisciplineDocument>,
		@InjectModel(Formation.name)
		private readonly formationModel: Model<FormationDocument>,
		@InjectModel(LearningModule.name)
		private readonly moduleModel: Model<LearningModuleDocument>,
	) {}

	async findByFormation(formationId: string): Promise<DisciplineDocument[]> {
		return this.disciplineModel
			.find({ formationId: this.toObjectId(formationId) })
			.sort({ order: 1, createdAt: -1 })
			.exec();
	}

	async findOne(id: string): Promise<DisciplineDocument> {
		return this.findOrFail(id);
	}

	async create(
		formationId: string,
		dto: CreateDisciplineDto,
		createdBy: string,
	): Promise<DisciplineDocument> {
		if (!Types.ObjectId.isValid(formationId)) {
			throw new BadRequestException('Identifiant de formation invalide');
		}

		const formation = await this.formationModel.findById(formationId).exec();
		if (!formation) {
			throw new NotFoundException('Formation introuvable');
		}

		const order = dto.order ?? (await this.disciplineModel.countDocuments({ formationId }) + 1);

		return this.disciplineModel.create({
			...dto,
			formationId: new Types.ObjectId(formationId),
			createdBy: new Types.ObjectId(createdBy),
			status: ContentStatus.BROUILLON,
			order,
		});
	}

	async update(id: string, dto: UpdateDisciplineDto): Promise<DisciplineDocument> {
		const discipline = await this.findOrFail(id);
		if (dto.order !== undefined) {
			discipline.order = dto.order;
		}
		if (dto.title !== undefined) discipline.title = dto.title;
		if (dto.description !== undefined) discipline.description = dto.description;
		return discipline.save();
	}

	async remove(id: string): Promise<{ message: string }> {
		const discipline = await this.findOrFail(id);
		const moduleCount = await this.moduleModel.countDocuments({ disciplineId: discipline._id });
		if (moduleCount > 0) {
			throw new ConflictException(
				'Impossible de supprimer une discipline qui contient des modules',
			);
		}

		await this.disciplineModel.deleteOne({ _id: discipline._id }).exec();
		return { message: 'Discipline supprimée' };
	}

	async publish(id: string): Promise<DisciplineDocument> {
		const discipline = await this.findOrFail(id);
		discipline.status = ContentStatus.PUBLIE;
		return discipline.save();
	}

	async archive(id: string): Promise<DisciplineDocument> {
		const discipline = await this.findOrFail(id);
		discipline.status = ContentStatus.ARCHIVE;
		return discipline.save();
	}

	private async findOrFail(id: string): Promise<DisciplineDocument> {
		const discipline = await this.disciplineModel.findById(this.toObjectId(id)).exec();
		if (!discipline) {
			throw new NotFoundException('Discipline introuvable');
		}
		return discipline;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}
