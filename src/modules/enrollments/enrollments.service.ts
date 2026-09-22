import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
import {
	Enrollment,
	EnrollmentDocument,
	EnrollmentStatus,
} from '../../schemas/enrollment.schema';
import { Formation, FormationDocument, FormationStatus } from '../../schemas/formation.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class EnrollmentsService {
	constructor(
		@InjectModel(Enrollment.name)
		private readonly enrollmentModel: Model<EnrollmentDocument>,
		@InjectModel(Formation.name)
		private readonly formationModel: Model<FormationDocument>,
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
	) {}

	async enroll(studentId: string, formationId: string, nextInstallmentDueAt?: Date) {
		const studentObjectId = this.toObjectId(studentId);
		const formationObjectId = this.toObjectId(formationId);
		const [student, formation, existing] = await Promise.all([
			this.userModel.findOne({ _id: studentObjectId, role: Role.ETUDIANT, isActive: true }).exec(),
			this.formationModel.findOne({ _id: formationObjectId, status: FormationStatus.PUBLIE }).exec(),
			this.enrollmentModel.findOne({ studentId: studentObjectId, formationId: formationObjectId }).exec(),
		]);

		if (!student) throw new ForbiddenException('Seul un étudiant actif peut être inscrit');
		if (!formation) throw new NotFoundException('Formation publiée introuvable');
		if (existing) throw new ConflictException('Cet étudiant est déjà inscrit à cette formation');

		return this.enrollmentModel.create({
			studentId: studentObjectId,
			formationId: formationObjectId,
			nextInstallmentDueAt: nextInstallmentDueAt ?? null,
			status: EnrollmentStatus.ACTIVE,
		});
	}

	async hasActiveAccess(studentId: string, formationId: string): Promise<boolean> {
		const enrollment = await this.enrollmentModel.findOne({
			studentId: this.toObjectId(studentId),
			formationId: this.toObjectId(formationId),
			status: EnrollmentStatus.ACTIVE,
		}).select('_id').lean().exec();
		return Boolean(enrollment);
	}

	async findByStudent(studentId: string) {
		return this.enrollmentModel
			.find({ studentId: this.toObjectId(studentId) })
			.populate('formationId')
			.sort({ createdAt: -1 })
			.exec();
	}

	async findByFormation(formationId: string) {
		return this.enrollmentModel
			.find({ formationId: this.toObjectId(formationId) })
			.populate('studentId', '-password')
			.sort({ createdAt: -1 })
			.exec();
	}

	async suspend(id: string) {
		const enrollment = await this.findOrFail(id);
		enrollment.status = EnrollmentStatus.SUSPENDED;
		enrollment.accessSuspendedAt = new Date();
		return enrollment.save();
	}

	async restore(id: string) {
		const enrollment = await this.findOrFail(id);
		enrollment.status = EnrollmentStatus.ACTIVE;
		enrollment.accessSuspendedAt = null;
		return enrollment.save();
	}

	private async findOrFail(id: string): Promise<EnrollmentDocument> {
		const enrollment = await this.enrollmentModel.findById(this.toObjectId(id)).exec();
		if (!enrollment) throw new NotFoundException('Inscription introuvable');
		return enrollment;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}