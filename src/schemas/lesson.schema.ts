import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ContentStatus } from './discipline.schema';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
export class Lesson {
	@Prop({ required: true, trim: true })
	title!: string;

	@Prop({ required: true, trim: true })
	description!: string;

	@Prop({ required: true, trim: true })
	content!: string;

	@Prop({ type: Types.ObjectId, ref: 'LearningModule', required: true })
	moduleId!: Types.ObjectId;

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

	@Prop({ type: String, default: null })
	videoUrl?: string | null;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
LessonSchema.index({ moduleId: 1, order: 1 });
