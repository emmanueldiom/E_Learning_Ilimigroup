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
import { CreateModuleDto } from '../../dto/modules/create-module.dto';
import { UpdateModuleDto } from '../../dto/modules/update-module.dto';
import { ModulesService } from './modules.service';

@Controller('modules')
export class ModulesController {
	constructor(private readonly modulesService: ModulesService) {}

	@Get('discipline/:disciplineId')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findByDiscipline(@Param('disciplineId') disciplineId: string) {
		return this.modulesService.findByDiscipline(disciplineId);
	}

	@Get(':id')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findOne(@Param('id') id: string) {
		return this.modulesService.findOne(id);
	}

	@Post('discipline/:disciplineId')
	@Roles(Role.ADMIN_CONTENU)
	create(
		@Param('disciplineId') disciplineId: string,
		@Body() dto: CreateModuleDto,
		@CurrentUser('sub') userId: string,
	) {
		return this.modulesService.create(disciplineId, dto, userId);
	}

	@Patch(':id')
	@Roles(Role.ADMIN_CONTENU)
	update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
		return this.modulesService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN_CONTENU)
	remove(@Param('id') id: string) {
		return this.modulesService.remove(id);
	}

	@Post(':id/publish')
	@Roles(Role.ADMIN_CONTENU)
	publish(@Param('id') id: string) {
		return this.modulesService.publish(id);
	}

	@Post(':id/archive')
	@Roles(Role.ADMIN_CONTENU)
	archive(@Param('id') id: string) {
		return this.modulesService.archive(id);
	}
}
