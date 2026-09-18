import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLessonDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(20)
	description!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(20)
	content!: string;

	@IsOptional()
	@IsString()
	videoUrl?: string;
}
