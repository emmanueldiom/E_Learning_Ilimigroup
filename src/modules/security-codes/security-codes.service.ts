import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';
import { Role } from '../../common/enums/role.enum';
import { AssignSecurityCodeDto } from '../../dto/security-codes/assign-security-code.dto';
import { AssignSecurityCodesDto } from '../../dto/security-codes/assign-security-codes.dto';
import { GenerateSecurityCodesDto } from '../../dto/security-codes/generate-security-codes.dto';
import { TraceStudentDto } from '../../dto/security-codes/trace-student.dto';
import { RequestSecurityCodesDto } from '../../dto/security-codes/request-security-codes.dto';
import {
	SecurityCode,
	SecurityCodeDocument,
	SecurityCodeStatus,
} from '../../schemas/security-code.schema';
import { Formation, FormationDocument } from '../../schemas/formation.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import {
	SecurityCodeRequest,
	SecurityCodeRequestDocument,
	SecurityCodeRequestStatus,
} from '../../schemas/security-code-request.schema';

export const SECURITY_CODE_EXPIRY_DAYS = 90;

@Injectable()
export class SecurityCodesService {
	constructor(
		@InjectModel(SecurityCode.name)
		private readonly securityCodeModel: Model<SecurityCodeDocument>,
		@InjectModel(Formation.name)
		private readonly formationModel: Model<FormationDocument>,
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		@InjectModel(SecurityCodeRequest.name)
		private readonly requestModel: Model<SecurityCodeRequestDocument>,
	) {}

	async generate(dto: GenerateSecurityCodesDto) {
		const formation = await this.formationModel.findById(dto.formationId).exec();
		if (!formation) throw new NotFoundException('Formation introuvable');
		if (!formation.allowedInstallments.includes(dto.installmentNumber)) {
			throw new BadRequestException('Ce numéro de versement n’est pas autorisé pour la formation');
		}

		const amount = this.calculateInstallmentAmount(formation.price, dto.installmentNumber);
		const expiresAt = new Date(Date.now() + SECURITY_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
		const generatedCodes = Array.from({ length: dto.quantity }, () => this.createCode());

		await this.securityCodeModel.insertMany(
			generatedCodes.map(({ plainCode, codeHash, codePrefix }) => ({
				formationId: formation._id,
				installmentNumber: dto.installmentNumber,
				amount,
				codeHash,
				codePrefix,
				status: SecurityCodeStatus.AVAILABLE,
				expiresAt,
			})),
		);

		return {
			formationId: formation._id,
			installmentNumber: dto.installmentNumber,
			amount,
			expiresAt,
			codes: generatedCodes.map(({ plainCode }) => plainCode),
		};
	}

	async assign(id: string, dto: AssignSecurityCodeDto) {
		const commercial = await this.userModel.findOne({
			_id: this.toObjectId(dto.commercialId),
			role: Role.COMMERCIAL,
			isActive: true,
		}).select('_id').exec();
		if (!commercial) throw new BadRequestException('Le Commercial est introuvable ou inactif');

		const code = await this.findOrFail(id);
		if (code.status === SecurityCodeStatus.USED || code.status === SecurityCodeStatus.EXPIRED) {
			throw new ConflictException('Ce code ne peut plus être attribué');
		}

		code.commercialId = commercial._id;
		code.status = SecurityCodeStatus.ASSIGNED;
		return code.save();
	}

	async assignBatch(dto: AssignSecurityCodesDto) {
		const assignments = await Promise.all(
			dto.codeIds.map((codeId) =>
				this.assign(codeId, { commercialId: dto.commercialId }),
			),
		);
		return { count: assignments.length, codes: assignments };
	}

	async findMine(commercialId: string) {
		return this.securityCodeModel.find({ commercialId: this.toObjectId(commercialId) })
			.sort({ createdAt: -1 }).exec();
	}

	async findAll() {
		return this.securityCodeModel.find().sort({ createdAt: -1 }).exec();
	}

	async requestMore(dto: RequestSecurityCodesDto, commercialId: string) {
		const formation = await this.formationModel.findById(dto.formationId).select('_id').exec();
		if (!formation) throw new NotFoundException('Formation introuvable');

		return this.requestModel.create({
			commercialId: this.toObjectId(commercialId),
			formationId: formation._id,
			quantity: dto.quantity,
			message: dto.message ?? null,
			status: SecurityCodeRequestStatus.PENDING,
		});
	}

	@Cron('0 0 * * *')
	async expireUnusedCodes(): Promise<void> {
		await this.securityCodeModel.updateMany(
			{
				status: { $in: [SecurityCodeStatus.AVAILABLE, SecurityCodeStatus.ASSIGNED] },
				expiresAt: { $lte: new Date() },
			},
			{ $set: { status: SecurityCodeStatus.EXPIRED } },
		).exec();
	}

	async traceStudent(id: string, dto: TraceStudentDto, commercialId: string) {
		const code = await this.securityCodeModel.findOne({
			_id: this.toObjectId(id),
			commercialId: this.toObjectId(commercialId),
		}).exec();
		if (!code) throw new NotFoundException('Code introuvable dans votre lot');
		if (code.status === SecurityCodeStatus.USED || code.status === SecurityCodeStatus.EXPIRED) {
			throw new ConflictException('La traçabilité ne peut plus être modifiée pour ce code');
		}

		code.studentTrace = { nom: dto.nom, telephone: dto.telephone ?? null };
		return code.save();
	}

	private calculateInstallmentAmount(price: number, installmentNumber: number): number {
		return Number((price / installmentNumber).toFixed(2));
	}

	private createCode() {
		const plainCode = `ILIMI-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
		return {
			plainCode,
			codeHash: crypto.createHash('sha256').update(plainCode).digest('hex'),
			codePrefix: plainCode.slice(0, 10),
		};
	}

	private async findOrFail(id: string): Promise<SecurityCodeDocument> {
		const code = await this.securityCodeModel.findById(this.toObjectId(id)).exec();
		if (!code) throw new NotFoundException('Code introuvable');
		return code;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) throw new BadRequestException('Identifiant invalide');
		return new Types.ObjectId(value);
	}
}