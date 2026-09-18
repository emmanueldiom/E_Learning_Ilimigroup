import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateLessonDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	title?: string;

	@IsOptional()
	@IsString()
	@MinLength(20)
	description?: string;

	@IsOptional()
	@IsString()
	@MinLength(20)
	content?: string;

	@IsOptional()
	@IsString()
	videoUrl?: string;
}
