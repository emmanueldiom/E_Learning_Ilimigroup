import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
import { AssignTutorDto } from '../../dto/formations/assign-tutor.dto';
import { CreateFormationDto } from '../../dto/formations/create-formation.dto';
import { UnpublishFormationDto } from '../../dto/formations/unpublish-formation.dto';
import { UpdateDurationDto } from '../../dto/formations/update-duration.dto';
import { UpdateFormationDto } from '../../dto/formations/update-formation.dto';
import { UpdateInstallmentsDto } from '../../dto/formations/update-installments.dto';
import { UpdatePriceDto } from '../../dto/formations/update-price.dto';
import {
	Formation,
	FormationDocument,
	FormationStatus,
} from '../../schemas/formation.schema';
import { User, UserDocument } from '../../schemas/user.schema';

export const calculateMaxInstallments = (durationDays: number): number =>
	Math.floor(durationDays / 30) + 1;

@Injectable()
export class FormationsService {
	constructor(
		@InjectModel(Formation.name)
	private readonly formationModel: Model<FormationDocument>,
		@InjectModel(User.name)
	private readonly userModel: Model<UserDocument>,
		@InjectConnection()
	private readonly connection: Connection,
	) {}

	async create(dto: CreateFormationDto, createdBy: string): Promise<FormationDocument> {
		const maxInstallments = calculateMaxInstallments(dto.durationDays);
		const allowedInstallments = dto.allowedInstallments ?? [1];
		this.validateInstallments(allowedInstallments, maxInstallments);

		return this.formationModel.create({
			...dto,
			maxInstallments,
			allowedInstallments,
			createdBy: this.toObjectId(createdBy),
			tutorId: null,
			status: FormationStatus.BROUILLON,
			unpublishReason: null,
		});
	}

	async update(id: string, dto: UpdateFormationDto): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		const durationDays = dto.durationDays ?? formation.durationDays;
		const maxInstallments = calculateMaxInstallments(durationDays);
		const allowedInstallments = dto.allowedInstallments ?? formation.allowedInstallments;
		this.validateInstallments(allowedInstallments, maxInstallments);

		Object.assign(formation, {
			...dto,
			maxInstallments,
			allowedInstallments,
		});
		return formation.save();
	}

	async findOne(id: string): Promise<FormationDocument> {
		return this.findOrFail(id);
	}

	async findPublic(): Promise<FormationDocument[]> {
		return this.formationModel
			.find({ status: FormationStatus.PUBLIE })
			.sort({ createdAt: -1 })
			.exec();
	}

	async findPublicOne(id: string): Promise<FormationDocument> {
		const objectId = this.toObjectId(id);
		const formation = await this.formationModel
			.findOne({ _id: objectId, status: FormationStatus.PUBLIE })
			.exec();

		if (!formation) {
			throw new NotFoundException('Formation publique introuvable');
		}
		return formation;
	}

	async findAccessibleByStudent(studentId: string): Promise<FormationDocument[]> {
		const enrollments = await this.connection
			.collection('enrollments')
			.find({
				studentId: this.toObjectId(studentId),
				status: { $in: ['active', 'actif', 'en_cours'] },
			})
			.project({ formationId: 1 })
			.toArray();
		const formationIds = enrollments
			.map((enrollment) => enrollment.formationId)
			.filter((formationId): formationId is Types.ObjectId =>
				formationId instanceof Types.ObjectId,
			);

		if (!formationIds.length) {
			return [];
		}

		return this.formationModel
			.find({ _id: { $in: formationIds }, status: FormationStatus.PUBLIE })
			.sort({ createdAt: -1 })
			.exec();
	}

	async remove(id: string): Promise<{ message: string }> {
		const objectId = this.toObjectId(id);
		const enrollmentCount = await this.connection
			.collection('enrollments')
			.countDocuments({ formationId: objectId });

		if (enrollmentCount > 0) {
			throw new ConflictException(
				'Une formation avec des étudiants inscrits ne peut pas être supprimée',
			);
		}

		const result = await this.formationModel.deleteOne({ _id: objectId }).exec();
		if (!result.deletedCount) {
			throw new NotFoundException('Formation introuvable');
		}
		return { message: 'Formation supprimée' };
	}

	async publish(id: string): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		formation.status = FormationStatus.PUBLIE;
		formation.unpublishReason = null;
		return formation.save();
	}

	async unpublish(
		id: string,
		dto: UnpublishFormationDto,
	): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		formation.status = FormationStatus.BROUILLON;
		formation.unpublishReason = dto.reason;
		return formation.save();
	}

	async archive(id: string): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		formation.status = FormationStatus.ARCHIVE;
		return formation.save();
	}

	async updatePrice(id: string, dto: UpdatePriceDto): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		formation.price = dto.price;
		return formation.save();
	}

	async updateDuration(id: string, dto: UpdateDurationDto): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		const maxInstallments = calculateMaxInstallments(dto.durationDays);
		this.validateInstallments(formation.allowedInstallments, maxInstallments);
		formation.durationDays = dto.durationDays;
		formation.maxInstallments = maxInstallments;
		return formation.save();
	}

	async updateInstallments(
		id: string,
		dto: UpdateInstallmentsDto,
	): Promise<FormationDocument> {
		const formation = await this.findOrFail(id);
		this.validateInstallments(dto.allowedInstallments, formation.maxInstallments);
		formation.allowedInstallments = dto.allowedInstallments;
		return formation.save();
	}

	async assignTutor(id: string, dto: AssignTutorDto): Promise<FormationDocument> {
		const tutor = await this.userModel
			.findOne({
				_id: this.toObjectId(dto.tutorId),
				role: Role.FORMATEUR,
				isActive: true,
			})
			.exec();
		if (!tutor) {
			throw new BadRequestException(
				'L’utilisateur doit être un Formateur actif',
			);
		}

		const formation = await this.findOrFail(id);
		formation.tutorId = tutor._id;
		return formation.save();
	}

	private async findOrFail(id: string): Promise<FormationDocument> {
		const formation = await this.formationModel
			.findById(this.toObjectId(id))
			.exec();
		if (!formation) {
			throw new NotFoundException('Formation introuvable');
		}
		return formation;
	}

	private validateInstallments(allowedInstallments: number[], maxInstallments: number): void {
		const hasDuplicates = new Set(allowedInstallments).size !== allowedInstallments.length;
		const invalidValue = allowedInstallments.some(
			(value) => value < 1 || value > maxInstallments,
		);
		if (!allowedInstallments.length || hasDuplicates || invalidValue) {
			throw new BadRequestException(
				`Les versements autorisés doivent être compris entre 1 et ${maxInstallments}, sans doublon`,
			);
		}
	}

	private toObjectId(id: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Identifiant de formation invalide');
		}
		return new Types.ObjectId(id);
	}
}
