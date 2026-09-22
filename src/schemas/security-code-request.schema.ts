import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum SecurityCodeRequestStatus {
	PENDING = 'pending',
	FULFILLED = 'fulfilled',
	REJECTED = 'rejected',
}

export type SecurityCodeRequestDocument = HydratedDocument<SecurityCodeRequest>;

@Schema({ timestamps: true })
export class SecurityCodeRequest {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	commercialId!: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'Formation', required: true })
	formationId!: Types.ObjectId;

	@Prop({ type: Number, required: true, min: 1 })
	quantity!: number;

	@Prop({ type: String, trim: true, default: null })
	message!: string | null;

	@Prop({
		type: String,
		enum: SecurityCodeRequestStatus,
		default: SecurityCodeRequestStatus.PENDING,
	})
	status!: SecurityCodeRequestStatus;
}

export const SecurityCodeRequestSchema = SchemaFactory.createForClass(SecurityCodeRequest);
SecurityCodeRequestSchema.index({ commercialId: 1, status: 1, createdAt: -1 });