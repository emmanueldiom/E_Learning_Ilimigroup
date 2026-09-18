import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	description!: string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	order?: number;
}
