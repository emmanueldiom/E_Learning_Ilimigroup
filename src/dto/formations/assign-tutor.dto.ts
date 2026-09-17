import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AssignTutorDto {
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	tutorId!: string;
}
