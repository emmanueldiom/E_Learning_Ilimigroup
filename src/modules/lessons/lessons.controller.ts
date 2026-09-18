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
import { CreateLessonDto } from '../../dto/lessons/create-lesson.dto';
import { UpdateLessonDto } from '../../dto/lessons/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Get('module/:moduleId')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findByModule(@Param('moduleId') moduleId: string) {
		return this.lessonsService.findByModule(moduleId);
	}

	@Get(':id')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findOne(@Param('id') id: string) {
		return this.lessonsService.findOne(id);
	}

	@Post('module/:moduleId')
	@Roles(Role.ADMIN_CONTENU)
	create(
		@Param('moduleId') moduleId: string,
		@Body() dto: CreateLessonDto,
		@CurrentUser('sub') userId: string,
	) {
		return this.lessonsService.create(moduleId, dto, userId);
	}

	@Patch(':id')
	@Roles(Role.ADMIN_CONTENU)
	update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
		return this.lessonsService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN_CONTENU)
	remove(@Param('id') id: string) {
		return this.lessonsService.remove(id);
	}

	@Post(':id/publish')
	@Roles(Role.ADMIN_CONTENU)
	publish(@Param('id') id: string) {
		return this.lessonsService.publish(id);
	}

	@Post(':id/archive')
	@Roles(Role.ADMIN_CONTENU)
	archive(@Param('id') id: string) {
		return this.lessonsService.archive(id);
	}
}
