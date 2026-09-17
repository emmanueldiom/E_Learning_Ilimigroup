import { IsInt, IsPositive } from 'class-validator';

export class UpdateInstallmentsDto {
	@IsInt({ each: true })
	@IsPositive({ each: true })
	allowedInstallments!: number[];
}
