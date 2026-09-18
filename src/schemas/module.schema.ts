import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ContentStatus } from './discipline.schema';

export type LearningModuleDocument = HydratedDocument<LearningModule>;

@Schema({ timestamps: true })
export class LearningModule {
	@Prop({ required: true, trim: true })
	title!: string;

	@Prop({ required: true, trim: true })
	description!: string;

	@Prop({ type: Types.ObjectId, ref: 'Discipline', required: true })
	disciplineId!: Types.ObjectId;

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

export const ModuleSchema = SchemaFactory.createForClass(LearningModule);
ModuleSchema.index({ disciplineId: 1, order: 1 });
