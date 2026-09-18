import { IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateDisciplineDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	title?: string;

	@IsOptional()
	@IsString()
	@MinLength(10)
	description?: string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	order?: number;
}
