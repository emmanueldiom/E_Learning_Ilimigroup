import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { Model, Types } from 'mongoose';
import { CreateResourceDto } from '../../dto/resources/create-resource.dto';
import { UpdateResourceDto } from '../../dto/resources/update-resource.dto';
import { ContentStatus } from '../../schemas/discipline.schema';
import { Lesson, LessonDocument } from '../../schemas/lesson.schema';
import { Resource, ResourceDocument, ResourceType } from '../../schemas/resource.schema';

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

	async getUploadedFile(id: string): Promise<{
		stream: fs.ReadStream;
		filename: string;
		mimetype: string;
	}> {
		const resource = await this.findOrFail(id);
		const filePath = this.localFilePath(resource.url);
		const stats = await fs.promises.stat(filePath).catch(() => undefined);
		if (!stats?.isFile()) {
			throw new NotFoundException('Fichier introuvable');
		}

		return {
			stream: fs.createReadStream(filePath),
			filename: basename(filePath),
			mimetype: this.mimeTypeForExtension(extname(filePath)),
		};
	}

	async create(
		lessonId: string,
		dto: CreateResourceDto,
		createdBy: string,
		file?: { buffer?: Buffer; originalname?: string; mimetype?: string },
	): Promise<ResourceDocument> {
		if (!Types.ObjectId.isValid(lessonId)) {
			throw new BadRequestException('Identifiant de leçon invalide');
		}

		const lesson = await this.lessonModel.findById(lessonId).exec();
		if (!lesson) {
			throw new NotFoundException('Leçon introuvable');
		}

		let finalUrl = dto.url;
		let finalType = dto.type;
		let uploadedFileUrl: string | undefined;

		if (file) {
			this.validateUploadedFile(file);
			finalUrl = await this.saveUploadedFile(file);
			uploadedFileUrl = finalUrl;
			finalType = dto.type ?? this.inferTypeFromMime(file.mimetype);
		}

		if (!finalUrl) {
			throw new BadRequestException('Une URL ou un fichier est requis pour la ressource');
		}

		const order = dto.order ?? (await this.resourceModel.countDocuments({ lessonId }) + 1);

		try {
			return await this.resourceModel.create({
				title: dto.title,
				url: finalUrl,
				type: finalType ?? ResourceType.DOCUMENT,
				lessonId: new Types.ObjectId(lessonId),
				createdBy: new Types.ObjectId(createdBy),
				status: ContentStatus.BROUILLON,
				order,
			});
		} catch (error) {
			if (uploadedFileUrl) {
				await this.deleteUploadedFile(uploadedFileUrl);
			}
			throw error;
		}
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
		await this.deleteUploadedFile(resource.url);
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

	private async saveUploadedFile(file: {
		buffer?: Buffer;
		originalname?: string;
		mimetype?: string;
	}): Promise<string> {
		const uploadDir = join(process.cwd(), 'uploads', 'resources');
		await fs.promises.mkdir(uploadDir, { recursive: true });

		const extension = this.extensionForMime(file.mimetype);
		const filename = `${randomUUID()}${extension}`;
		const filePath = join(uploadDir, filename);

		await fs.promises.writeFile(filePath, file.buffer as Buffer, { flag: 'wx' });

		return `/uploads/resources/${filename}`;
	}

	private validateUploadedFile(file: {
		buffer?: Buffer;
		originalname?: string;
		mimetype?: string;
	}): void {
		const buffer = file.buffer;
		if (!buffer || buffer.length === 0) {
			throw new BadRequestException('Le fichier est vide');
		}

		if (!file.mimetype || !this.hasValidSignature(buffer, file.mimetype)) {
			throw new BadRequestException('Le contenu du fichier est invalide');
		}
	}

	private hasValidSignature(buffer: Buffer, mimetype: string): boolean {
		if (mimetype === 'application/pdf') {
			return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
		}

		if (
			[
				'application/zip',
				'application/x-zip-compressed',
				'application/vnd.rar',
				'application/x-rar-compressed',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			].includes(mimetype)
		) {
			return (
				buffer.subarray(0, 4).toString('ascii') === 'PK\u0003\u0004' ||
				buffer.subarray(0, 7).toString('ascii') === 'Rar!\u001a\u0007'
			);
		}

		if (mimetype === 'application/msword') {
			return buffer.subarray(0, 8).equals(Buffer.from('D0CF11E0A1B11AE1', 'hex'));
		}

		if (mimetype === 'video/mp4' || mimetype === 'video/quicktime') {
			return buffer.subarray(4, 12).toString('ascii').includes('ftyp');
		}

		if (mimetype === 'video/webm') {
			return buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
		}

		if (mimetype === 'text/plain') {
			return !buffer.includes(0);
		}

		return false;
	}

	private extensionForMime(mimetype?: string): string {
		const extensions: Record<string, string> = {
			'application/pdf': '.pdf',
			'application/zip': '.zip',
			'application/x-zip-compressed': '.zip',
			'application/vnd.rar': '.rar',
			'application/x-rar-compressed': '.rar',
			'application/msword': '.doc',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
			'text/plain': '.txt',
			'video/mp4': '.mp4',
			'video/webm': '.webm',
			'video/quicktime': '.mov',
		};
		return extensions[mimetype ?? ''] ?? extname('file');
	}

	private async deleteUploadedFile(url: string): Promise<void> {
		const uploadDir = resolve(process.cwd(), 'uploads', 'resources');
		const filePath = this.localFilePath(url);
		const relativePath = relative(uploadDir, filePath);

		if (!relativePath || relativePath.startsWith('..') || relativePath.includes('/')) {
			return;
		}

		await fs.promises.unlink(filePath).catch((error: NodeJS.ErrnoException) => {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		});
	}

	private localFilePath(url: string): string {
		const uploadDir = resolve(process.cwd(), 'uploads', 'resources');
		const filePath = resolve(process.cwd(), url.replace(/^\//, ''));
		const relativePath = relative(uploadDir, filePath);
		if (!relativePath || relativePath.startsWith('..') || relativePath.includes('/')) {
			throw new BadRequestException('Chemin de fichier invalide');
		}
		return filePath;
	}

	private mimeTypeForExtension(extension: string): string {
		const mimeTypes: Record<string, string> = {
			'.pdf': 'application/pdf',
			'.zip': 'application/zip',
			'.rar': 'application/vnd.rar',
			'.doc': 'application/msword',
			'.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'.txt': 'text/plain',
			'.mp4': 'video/mp4',
			'.webm': 'video/webm',
			'.mov': 'video/quicktime',
		};
		return mimeTypes[extension.toLowerCase()] ?? 'application/octet-stream';
	}

	private inferTypeFromMime(mimetype?: string): ResourceType {
		if (!mimetype) {
			return ResourceType.DOCUMENT;
		}

		if (mimetype.startsWith('video/')) {
			return ResourceType.VIDEO;
		}

		if (mimetype.includes('pdf')) {
			return ResourceType.PDF;
		}

		if (mimetype.includes('zip') || mimetype.includes('rar')) {
			return ResourceType.ARCHIVE;
		}

		return ResourceType.DOCUMENT;
	}

	private toObjectId(value: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Identifiant invalide');
		}
		return new Types.ObjectId(value);
	}
}
