import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum SecurityCodeStatus {
	AVAILABLE = 'available',
	ASSIGNED = 'assigned',
	USED = 'used',
	EXPIRED = 'expired',
}

@Schema({ _id: false })
export class StudentTrace {
	@Prop({ type: String, trim: true, default: null })
	nom!: string | null;

	@Prop({ type: String, trim: true, default: null })
	telephone!: string | null;
}

export type SecurityCodeDocument = HydratedDocument<SecurityCode>;

@Schema({ timestamps: true })
export class SecurityCode {
	@Prop({ type: Types.ObjectId, ref: 'Formation', required: true })
	formationId!: Types.ObjectId;

	@Prop({ type: Number, required: true, min: 1 })
	installmentNumber!: number;

	@Prop({ type: Number, required: true, min: 0 })
	amount!: number;

	@Prop({ type: String, required: true, unique: true, select: false })
	codeHash!: string;

	@Prop({ type: String, required: true, trim: true })
	codePrefix!: string;

	@Prop({
		type: String,
		enum: SecurityCodeStatus,
		default: SecurityCodeStatus.AVAILABLE,
	})
	status!: SecurityCodeStatus;

	@Prop({ type: Types.ObjectId, ref: 'User', default: null })
	commercialId!: Types.ObjectId | null;

	@Prop({ type: StudentTrace, default: null })
	studentTrace!: StudentTrace | null;

	@Prop({ type: Date, required: true })
	expiresAt!: Date;

	@Prop({ type: Date, default: null })
	usedAt!: Date | null;

	@Prop({ type: Types.ObjectId, ref: 'User', default: null })
	studentId!: Types.ObjectId | null;
}

export const SecurityCodeSchema = SchemaFactory.createForClass(SecurityCode);
SecurityCodeSchema.index({ formationId: 1, installmentNumber: 1, status: 1 });
SecurityCodeSchema.index({ commercialId: 1, status: 1 });
SecurityCodeSchema.index({ expiresAt: 1, status: 1 });