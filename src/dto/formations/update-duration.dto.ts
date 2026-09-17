import { IsInt, IsPositive } from 'class-validator';

export class UpdateDurationDto {
	@IsInt()
	@IsPositive()
	durationDays!: number;
}
