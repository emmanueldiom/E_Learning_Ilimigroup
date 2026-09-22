import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AssignSecurityCodeDto } from '../../dto/security-codes/assign-security-code.dto';
import { AssignSecurityCodesDto } from '../../dto/security-codes/assign-security-codes.dto';
import { GenerateSecurityCodesDto } from '../../dto/security-codes/generate-security-codes.dto';
import { TraceStudentDto } from '../../dto/security-codes/trace-student.dto';
import { RequestSecurityCodesDto } from '../../dto/security-codes/request-security-codes.dto';
import { SecurityCodesService } from './security-codes.service';

@Controller('security-codes')
export class SecurityCodesController {
	constructor(private readonly securityCodesService: SecurityCodesService) {}

	@Post('generate')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	generate(@Body() dto: GenerateSecurityCodesDto) {
		return this.securityCodesService.generate(dto);
	}

	@Patch(':id/assign')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	assign(@Param('id') id: string, @Body() dto: AssignSecurityCodeDto) {
		return this.securityCodesService.assign(id, dto);
	}

	@Post('assign-batch')
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	assignBatch(@Body() dto: AssignSecurityCodesDto) {
		return this.securityCodesService.assignBatch(dto);
	}

	@Get('mine')
	@Roles(Role.COMMERCIAL)
	findMine(@CurrentUser('sub') commercialId: string) {
		return this.securityCodesService.findMine(commercialId);
	}

	@Get()
	@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
	findAll() {
		return this.securityCodesService.findAll();
	}

	@Post('request')
	@Roles(Role.COMMERCIAL)
	requestMore(
		@Body() dto: RequestSecurityCodesDto,
		@CurrentUser('sub') commercialId: string,
	) {
		return this.securityCodesService.requestMore(dto, commercialId);
	}

	@Patch(':id/trace-student')
	@Roles(Role.COMMERCIAL)
	traceStudent(
		@Param('id') id: string,
		@Body() dto: TraceStudentDto,
		@CurrentUser('sub') commercialId: string,
	) {
		return this.securityCodesService.traceStudent(id, dto, commercialId);
	}
}