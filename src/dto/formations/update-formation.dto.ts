import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class UpdateFormationDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	description?: string;

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	durationDays?: number;

	@IsOptional()
	@IsInt({ each: true })
	@IsPositive({ each: true })
	allowedInstallments?: number[];
}
