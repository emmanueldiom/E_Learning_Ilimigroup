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
import { CreateDisciplineDto } from '../../dto/disciplines/create-discipline.dto';
import { UpdateDisciplineDto } from '../../dto/disciplines/update-discipline.dto';
import { DisciplinesService } from './disciplines.service';

@Controller('disciplines')
export class DisciplinesController {
	constructor(private readonly disciplinesService: DisciplinesService) {}

	@Get('formation/:formationId')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findByFormation(@Param('formationId') formationId: string) {
		return this.disciplinesService.findByFormation(formationId);
	}

	@Get(':id')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findOne(@Param('id') id: string) {
		return this.disciplinesService.findOne(id);
	}

	@Post('formation/:formationId')
	@Roles(Role.ADMIN_CONTENU)
	create(
		@Param('formationId') formationId: string,
		@Body() dto: CreateDisciplineDto,
		@CurrentUser('sub') userId: string,
	) {
		return this.disciplinesService.create(formationId, dto, userId);
	}

	@Patch(':id')
	@Roles(Role.ADMIN_CONTENU)
	update(@Param('id') id: string, @Body() dto: UpdateDisciplineDto) {
		return this.disciplinesService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN_CONTENU)
	remove(@Param('id') id: string) {
		return this.disciplinesService.remove(id);
	}

	@Post(':id/publish')
	@Roles(Role.ADMIN_CONTENU)
	publish(@Param('id') id: string) {
		return this.disciplinesService.publish(id);
	}

	@Post(':id/archive')
	@Roles(Role.ADMIN_CONTENU)
	archive(@Param('id') id: string) {
		return this.disciplinesService.archive(id);
	}
}
