import { IsMongoId } from 'class-validator';

export class AssignSecurityCodeDto {
	@IsMongoId()
	commercialId!: string;
}