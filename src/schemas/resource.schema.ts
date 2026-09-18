import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ContentStatus } from './discipline.schema';

export enum ResourceType {
	PDF = 'pdf',
	VIDEO = 'video',
	LIEN = 'lien',
	ARCHIVE = 'archive',
	DOCUMENT = 'document',
}

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({ timestamps: true })
export class Resource {
	@Prop({ required: true, trim: true })
	title!: string;

	@Prop({ required: true, trim: true })
	url!: string;

	@Prop({
		type: String,
		enum: ResourceType,
		required: true,
	})
	type!: ResourceType;

	@Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
	lessonId!: Types.ObjectId;

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

export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ lessonId: 1, order: 1 });
