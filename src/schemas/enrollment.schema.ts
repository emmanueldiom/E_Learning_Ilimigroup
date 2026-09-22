import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum EnrollmentStatus {
	ACTIVE = 'active',
	SUSPENDED = 'suspended',
	COMPLETED = 'completed',
}

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	studentId!: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'Formation', required: true })
	formationId!: Types.ObjectId;

	@Prop({ type: Number, min: 0, max: 100, default: 0 })
	progress!: number;

	@Prop({
		type: String,
		enum: EnrollmentStatus,
		default: EnrollmentStatus.ACTIVE,
	})
	status!: EnrollmentStatus;

	@Prop({ type: String, trim: true, default: null })
	marker!: string | null;

	@Prop({ type: Date, default: null })
	nextInstallmentDueAt!: Date | null;

	@Prop({ type: Date, default: null })
	accessSuspendedAt!: Date | null;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
EnrollmentSchema.index({ studentId: 1, formationId: 1 }, { unique: true });
EnrollmentSchema.index({ formationId: 1, status: 1 });
EnrollmentSchema.index({ studentId: 1, status: 1 });