import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateModuleDto } from '../../dto/modules/create-module.dto';
import { UpdateModuleDto } from '../../dto/modules/update-module.dto';
import {
	ContentStatus,
	Discipline,
	DisciplineDocument,
} from '../../schemas/discipline.schema';
import {
	LearningModule,
	LearningModuleDocument,
} from '../../schemas/module.schema';
import { Lesson, LessonDocument } from '../../schemas/lesson.schema';

@Injectable()
export class ModulesService {
	constructor(
		@InjectModel(LearningModule.name)
		private readonly moduleModel: Model<LearningModuleDocument>,
		@InjectModel(Discipline.name)
		private readonly disciplineModel: Model<DisciplineDocument>,
		@InjectModel(Lesson.name)
		private readonly lessonModel: Model<LessonDocument>,
	) {}

	async findByDiscipline(disciplineId: string): Promise<LearningModuleDocument[]> {
		return this.moduleModel
			.find({ disciplineId: this.toObjectId(disciplineId) })
			.sort({ order: 1, createdAt: -1 })
			.exec();
	}

	async findOne(id: string): Promise<LearningModuleDocument> {
		return this.findOrFail(id);
	}

	async create(
		disciplineId: string,
		dto: CreateModuleDto,
		createdBy: string,
	): Promise<LearningModuleDocument> {
		if (!Types.ObjectId.isValid(disciplineId)) {
			throw new BadRequestException('Identifiant de discipline invalide');
		}

		const discipline = await this.disciplineModel.findById(disciplineId).exec();
		if (!discipline) {
			throw new NotFoundException('Discipline introuvable');
		}

		const order = dto.order ?? (await this.moduleModel.countDocuments({ disciplineId }) + 1);

		return this.moduleModel.create({
			...dto,
			disciplineId: new Types.ObjectId(disciplineId),
			createdBy: new Types.ObjectId(createdBy),
			status: ContentStatus.BROUILLON,
			order,
		});
	}

	async update(id: string, dto: UpdateModuleDto): Promise<LearningModuleDocument> {
		const module = await this.findOrFail(id);
		if (dto.order !== undefined) module.order = dto.order;
		if (dto.title !== undefined) module.title = dto.title;
		if (dto.description !== undefined) module.description = dto.description;
		return module.save();
	}

	async remove(id: string): Promise<{ message: string }> {
		const module = await this.findOrFail(id);
		const lessonCount = await this.lessonModel.countDocuments({ moduleId: module._id });
		if (lessonCount > 0) {
			throw new ConflictException(
				'Impossible de supprimer un module qui contient des leçons',
			);
		}

		await this.moduleModel.deleteOne({ _id: module._id }).exec();
		return { message: 'Module supprimé' };
	}

	async publish(id: string): Promise<LearningModuleDocument> {
		const module = await this.findOrFail(id);
		module.status = ContentStatus.PUBLIE;
		return module.save();
	}

	async archive(id: string): Promise<LearningModuleDocument> {
		const module = await this.findOrFail(id);
		module.status = ContentStatus.ARCHIVE;
		return module.save();
	}

	private async findOrFail(id: string): Promise<LearningModuleDocument> {
		const module = await this.moduleModel.findById(this.toObjectId(id)).exec();
		if (!module) {
			throw new NotFoundException('Module introuvable');
		}
		return module;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}
