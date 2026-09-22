import {
	Body,
	Controller,
	Delete,
	Get,
	BadRequestException,
	Param,
	Patch,
	Post,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateResourceDto } from '../../dto/resources/create-resource.dto';
import { UpdateResourceDto } from '../../dto/resources/update-resource.dto';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
	constructor(private readonly resourcesService: ResourcesService) {}

	@Get('lesson/:lessonId')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findByLesson(@Param('lessonId') lessonId: string) {
		return this.resourcesService.findByLesson(lessonId);
	}

	@Get(':id')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findOne(@Param('id') id: string) {
		return this.resourcesService.findOne(id);
	}

	@Get(':id/file')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	async download(@Param('id') id: string): Promise<StreamableFile> {
		const file = await this.resourcesService.getUploadedFile(id);
		return new StreamableFile(file.stream, {
			type: file.mimetype,
			 disposition: `attachment; filename="${file.filename}"`,
		});
	}

	@Post('lesson/:lessonId')
	@UseInterceptors(
		FileInterceptor('file', {
			limits: { fileSize: 50 * 1024 * 1024 },
			fileFilter: (_request: Request, file, callback) => {
				const allowedMimeTypes = new Set([
					'application/pdf',
					'application/zip',
					'application/x-zip-compressed',
					'application/vnd.rar',
					'application/x-rar-compressed',
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'text/plain',
					'video/mp4',
					'video/webm',
					'video/quicktime',
				]);

				if (!allowedMimeTypes.has(file.mimetype)) {
					callback(new BadRequestException('Type de fichier non autorise'), false);
					return;
				}

				callback(null, true);
			},
		}),
	)
	@Roles(Role.ADMIN_CONTENU)
	async create(
		@Param('lessonId') lessonId: string,
		@Body() dto: CreateResourceDto,
		@CurrentUser('sub') userId: string,
		@UploadedFile() file: { buffer?: Buffer; originalname?: string; mimetype?: string } | undefined,
	) {
		if (!file && !dto.url) {
			throw new BadRequestException('Un fichier ou une URL est requis');
		}

		return this.resourcesService.create(lessonId, dto, userId, file);
	}

	@Patch(':id')
	@Roles(Role.ADMIN_CONTENU)
	update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
		return this.resourcesService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN_CONTENU)
	remove(@Param('id') id: string) {
		return this.resourcesService.remove(id);
	}

	@Post(':id/publish')
	@Roles(Role.ADMIN_CONTENU)
	publish(@Param('id') id: string) {
		return this.resourcesService.publish(id);
	}

	@Post(':id/archive')
	@Roles(Role.ADMIN_CONTENU)
	archive(@Param('id') id: string) {
		return this.resourcesService.archive(id);
	}
}
