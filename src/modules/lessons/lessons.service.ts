import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLessonDto } from '../../dto/lessons/create-lesson.dto';
import { UpdateLessonDto } from '../../dto/lessons/update-lesson.dto';
import { ContentStatus } from '../../schemas/discipline.schema';
import { Lesson, LessonDocument } from '../../schemas/lesson.schema';
import { LearningModule, LearningModuleDocument } from '../../schemas/module.schema';
import { Resource, ResourceDocument } from '../../schemas/resource.schema';

@Injectable()
export class LessonsService {
	constructor(
		@InjectModel(Lesson.name)
		private readonly lessonModel: Model<LessonDocument>,
		@InjectModel(LearningModule.name)
		private readonly moduleModel: Model<LearningModuleDocument>,
		@InjectModel(Resource.name)
		private readonly resourceModel: Model<ResourceDocument>,
	) {}

	async findByModule(moduleId: string): Promise<LessonDocument[]> {
		return this.lessonModel
			.find({ moduleId: this.toObjectId(moduleId) })
			.sort({ order: 1, createdAt: -1 })
			.exec();
	}

	async findOne(id: string): Promise<LessonDocument> {
		return this.findOrFail(id);
	}

	async create(
		moduleId: string,
		dto: CreateLessonDto,
		createdBy: string,
	): Promise<LessonDocument> {
		if (!Types.ObjectId.isValid(moduleId)) {
			throw new BadRequestException('Identifiant de module invalide');
		}

		const module = await this.moduleModel.findById(moduleId).exec();
		if (!module) {
			throw new NotFoundException('Module introuvable');
		}

		const order = await this.lessonModel.countDocuments({ moduleId }) + 1;

		return this.lessonModel.create({
			...dto,
			moduleId: new Types.ObjectId(moduleId),
			createdBy: new Types.ObjectId(createdBy),
			status: ContentStatus.BROUILLON,
			order,
		});
	}

	async update(id: string, dto: UpdateLessonDto): Promise<LessonDocument> {
		const lesson = await this.findOrFail(id);
		if (dto.title !== undefined) lesson.title = dto.title;
		if (dto.description !== undefined) lesson.description = dto.description;
		if (dto.content !== undefined) lesson.content = dto.content;
		if (dto.videoUrl !== undefined) lesson.videoUrl = dto.videoUrl;
		return lesson.save();
	}

	async remove(id: string): Promise<{ message: string }> {
		const lesson = await this.findOrFail(id);
		const resourceCount = await this.resourceModel.countDocuments({ lessonId: lesson._id });
		if (resourceCount > 0) {
			throw new ConflictException(
				'Impossible de supprimer une leçon qui contient des ressources',
			);
		}

		await this.lessonModel.deleteOne({ _id: lesson._id }).exec();
		return { message: 'Leçon supprimée' };
	}

	async publish(id: string): Promise<LessonDocument> {
		const lesson = await this.findOrFail(id);
		lesson.status = ContentStatus.PUBLIE;
		return lesson.save();
	}

	async archive(id: string): Promise<LessonDocument> {
		const lesson = await this.findOrFail(id);
		lesson.status = ContentStatus.ARCHIVE;
		return lesson.save();
	}

	private async findOrFail(id: string): Promise<LessonDocument> {
		const lesson = await this.lessonModel.findById(this.toObjectId(id)).exec();
		if (!lesson) {
			throw new NotFoundException('Leçon introuvable');
		}
		return lesson;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}
