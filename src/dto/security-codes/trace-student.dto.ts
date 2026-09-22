import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TraceStudentDto {
	@IsString()
	@IsNotEmpty()
	nom!: string;

	@IsOptional()
	@IsString()
	telephone?: string;
}