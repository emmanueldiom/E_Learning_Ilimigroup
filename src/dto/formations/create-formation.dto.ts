import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateFormationDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	description!: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price!: number;

	@IsInt()
	@IsPositive()
	durationDays!: number;

	@IsOptional()
	@IsInt({ each: true })
	@IsPositive({ each: true })
	allowedInstallments?: number[];
}
