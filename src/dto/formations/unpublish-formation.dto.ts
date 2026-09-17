import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UnpublishFormationDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	reason!: string;
}
