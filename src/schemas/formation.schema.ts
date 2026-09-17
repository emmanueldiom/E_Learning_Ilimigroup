import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum FormationStatus {
	BROUILLON = 'brouillon',
	PUBLIE = 'publié',
	ARCHIVE = 'archivé',
}

export type FormationDocument = HydratedDocument<Formation>;

@Schema({ timestamps: true })
export class Formation {
	@Prop({ required: true, trim: true })
	title!: string;

	@Prop({ required: true, trim: true })
	description!: string;

	@Prop({ required: true, min: 0 })
	price!: number;

	@Prop({ required: true, min: 1 })
	durationDays!: number;

	@Prop({
		type: String,
		enum: FormationStatus,
		default: FormationStatus.BROUILLON,
	})
	status!: FormationStatus;

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	createdBy!: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'User', default: null })
	tutorId!: Types.ObjectId | null;

	@Prop({ required: true, min: 1 })
	maxInstallments!: number;

	@Prop({ type: [Number], required: true, default: [1] })
	allowedInstallments!: number[];

	@Prop({ type: String, trim: true, default: null })
	unpublishReason!: string | null;
}

export const FormationSchema = SchemaFactory.createForClass(Formation);
FormationSchema.index({ status: 1, createdAt: -1 });
FormationSchema.index({ createdBy: 1 });
FormationSchema.index({ tutorId: 1 });
