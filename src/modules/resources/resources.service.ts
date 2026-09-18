import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateResourceDto } from '../../dto/resources/create-resource.dto';
import { UpdateResourceDto } from '../../dto/resources/update-resource.dto';
import { ContentStatus } from '../../schemas/discipline.schema';
import { Lesson, LessonDocument } from '../../schemas/lesson.schema';
import { Resource, ResourceDocument } from '../../schemas/resource.schema';

@Injectable()
export class ResourcesService {
	constructor(
		@InjectModel(Resource.name)
		private readonly resourceModel: Model<ResourceDocument>,
		@InjectModel(Lesson.name)
		private readonly lessonModel: Model<LessonDocument>,
	) {}

	async findByLesson(lessonId: string): Promise<ResourceDocument[]> {
		return this.resourceModel
			.find({ lessonId: this.toObjectId(lessonId) })
			.sort({ order: 1, createdAt: -1 })
			.exec();
	}

	async findOne(id: string): Promise<ResourceDocument> {
		return this.findOrFail(id);
	}

	async create(
		lessonId: string,
		dto: CreateResourceDto,
		createdBy: string,
	): Promise<ResourceDocument> {
		if (!Types.ObjectId.isValid(lessonId)) {
			throw new BadRequestException('Identifiant de leçon invalide');
		}

		const lesson = await this.lessonModel.findById(lessonId).exec();
		if (!lesson) {
			throw new NotFoundException('Leçon introuvable');
		}

		const order = dto.order ?? (await this.resourceModel.countDocuments({ lessonId }) + 1);

		return this.resourceModel.create({
			...dto,
			lessonId: new Types.ObjectId(lessonId),
			createdBy: new Types.ObjectId(createdBy),
			status: ContentStatus.BROUILLON,
			order,
		});
	}

	async update(id: string, dto: UpdateResourceDto): Promise<ResourceDocument> {
		const resource = await this.findOrFail(id);
		if (dto.title !== undefined) resource.title = dto.title;
		if (dto.url !== undefined) resource.url = dto.url;
		if (dto.type !== undefined) resource.type = dto.type;
		return resource.save();
	}

	async remove(id: string): Promise<{ message: string }> {
		const resource = await this.findOrFail(id);
		await this.resourceModel.deleteOne({ _id: resource._id }).exec();
		return { message: 'Ressource supprimée' };
	}

	async publish(id: string): Promise<ResourceDocument> {
		const resource = await this.findOrFail(id);
		resource.status = ContentStatus.PUBLIE;
		return resource.save();
	}

	async archive(id: string): Promise<ResourceDocument> {
		const resource = await this.findOrFail(id);
		resource.status = ContentStatus.ARCHIVE;
		return resource.save();
	}

	private async findOrFail(id: string): Promise<ResourceDocument> {
		const resource = await this.resourceModel.findById(this.toObjectId(id)).exec();
		if (!resource) {
			throw new NotFoundException('Ressource introuvable');
		}
		return resource;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}
