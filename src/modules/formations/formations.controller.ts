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
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AssignTutorDto } from '../../dto/formations/assign-tutor.dto';
import { CreateFormationDto } from '../../dto/formations/create-formation.dto';
import { UnpublishFormationDto } from '../../dto/formations/unpublish-formation.dto';
import { UpdateDurationDto } from '../../dto/formations/update-duration.dto';
import { UpdateFormationDto } from '../../dto/formations/update-formation.dto';
import { UpdateInstallmentsDto } from '../../dto/formations/update-installments.dto';
import { UpdatePriceDto } from '../../dto/formations/update-price.dto';
import { FormationsService } from './formations.service';

@Controller('formations')
export class FormationsController {
	constructor(private readonly formationsService: FormationsService) {}

	@Get()
	@Public()
	findPublic() {
		return this.formationsService.findPublic();
	}

	@Get('accessible')
	@Roles(Role.ETUDIANT)
	findAccessible(@CurrentUser('sub') studentId: string) {
		return this.formationsService.findAccessibleByStudent(studentId);
	}

	@Get('manage/:id')
	@Roles(Role.ADMIN_CONTENU, Role.ADMINISTRATEUR)
	findOne(@Param('id') id: string) {
		return this.formationsService.findOne(id);
	}

	@Get(':id')
	@Public()
	findPublicOne(@Param('id') id: string) {
		return this.formationsService.findPublicOne(id);
	}

	@Post()
	@Roles(Role.ADMIN_CONTENU)
	create(@Body() dto: CreateFormationDto, @CurrentUser('sub') userId: string) {
		return this.formationsService.create(dto, userId);
	}

	@Patch(':id')
	@Roles(Role.ADMIN_CONTENU)
	update(@Param('id') id: string, @Body() dto: UpdateFormationDto) {
		return this.formationsService.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN_CONTENU)
	remove(@Param('id') id: string) {
		return this.formationsService.remove(id);
	}

	@Post(':id/publish')
	@Roles(Role.ADMIN_CONTENU)
	publish(@Param('id') id: string) {
		return this.formationsService.publish(id);
	}

	@Post(':id/unpublish')
	@Roles(Role.ADMIN_CONTENU)
	unpublish(@Param('id') id: string, @Body() dto: UnpublishFormationDto) {
		return this.formationsService.unpublish(id, dto);
	}

	@Post(':id/archive')
	@Roles(Role.ADMIN_CONTENU)
	archive(@Param('id') id: string) {
		return this.formationsService.archive(id);
	}

	@Patch(':id/price')
	@Roles(Role.ADMIN_CONTENU)
	updatePrice(@Param('id') id: string, @Body() dto: UpdatePriceDto) {
		return this.formationsService.updatePrice(id, dto);
	}

	@Patch(':id/duration')
	@Roles(Role.ADMIN_CONTENU)
	updateDuration(@Param('id') id: string, @Body() dto: UpdateDurationDto) {
		return this.formationsService.updateDuration(id, dto);
	}

	@Patch(':id/installments')
	@Roles(Role.ADMIN_CONTENU)
	updateInstallments(
		@Param('id') id: string,
		@Body() dto: UpdateInstallmentsDto,
	) {
		return this.formationsService.updateInstallments(id, dto);
	}

	@Patch(':id/tutor')
	@Roles(Role.ADMINISTRATEUR)
	assignTutor(@Param('id') id: string, @Body() dto: AssignTutorDto) {
		return this.formationsService.assignTutor(id, dto);
	}
}
