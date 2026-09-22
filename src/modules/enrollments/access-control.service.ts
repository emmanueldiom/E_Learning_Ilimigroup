import { ForbiddenException, Injectable } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Injectable()
export class AccessControlService {
	constructor(private readonly enrollmentsService: EnrollmentsService) {}

	async grantAccess(
		studentId: string,
		formationId: string,
		nextInstallmentDueAt?: Date,
	) {
		return this.enrollmentsService.enroll(
			studentId,
			formationId,
			nextInstallmentDueAt,
		);
	}

	async assertAccess(studentId: string, formationId: string): Promise<void> {
		const hasAccess = await this.enrollmentsService.hasActiveAccess(studentId, formationId);
		if (!hasAccess) {
			throw new ForbiddenException('Accès à cette formation non autorisé');
		}
	}

	async suspend(enrollmentId: string) {
		return this.enrollmentsService.suspend(enrollmentId);
	}

	async restore(enrollmentId: string) {
		return this.enrollmentsService.restore(enrollmentId);
	}
}