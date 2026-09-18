import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ContentStatus {
	BROUILLON = 'brouillon',
	PUBLIE = 'publié',
	ARCHIVE = 'archivé',
}

export type DisciplineDocument = HydratedDocument<Discipline>;

@Schema({ timestamps: true })
export class Discipline {
	@Prop({ required: true, trim: true })
	title!: string;

	@Prop({ required: true, trim: true })
	description!: string;

	@Prop({ type: Types.ObjectId, ref: 'Formation', required: true })
	formationId!: Types.ObjectId;

	@Prop({ type: Number, required: true, default: 1 })
	order!: number;

	@Prop({
		type: String,
		enum: ContentStatus,
		default: ContentStatus.BROUILLON,
	})
	status!: ContentStatus;

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	createdBy!: Types.ObjectId;
}

export const DisciplineSchema = SchemaFactory.createForClass(Discipline);
DisciplineSchema.index({ formationId: 1, order: 1 });
