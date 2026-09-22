import { Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
	constructor(private readonly enrollmentsService: EnrollmentsService) {}

	@Get('me')
	@Roles(Role.ETUDIANT)
	findMine(@CurrentUser('sub') studentId: string) {
		return this.enrollmentsService.findByStudent(studentId);
	}

	@Get('formation/:formationId')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR, Role.FORMATEUR)
	findByFormation(@Param('formationId') formationId: string) {
		return this.enrollmentsService.findByFormation(formationId);
	}

	@Patch(':id/suspend')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	suspend(@Param('id') id: string) {
		return this.enrollmentsService.suspend(id);
	}

	@Patch(':id/restore')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	restore(@Param('id') id: string) {
		return this.enrollmentsService.restore(id);
	}
}