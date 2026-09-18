import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
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

	@Post('lesson/:lessonId')
	@Roles(Role.ADMIN_CONTENU)
	create(
		@Param('lessonId') lessonId: string,
		@Body() dto: CreateResourceDto,
		@CurrentUser('sub') userId: string,
	) {
		return this.resourcesService.create(lessonId, dto, userId);
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
