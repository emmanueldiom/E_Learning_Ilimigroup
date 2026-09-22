import { IsInt, IsMongoId, IsPositive } from 'class-validator';

export class GenerateSecurityCodesDto {
	@IsMongoId()
	formationId!: string;

	@IsInt()
	@IsPositive()
	installmentNumber!: number;

	@IsInt()
	@IsPositive()
	quantity!: number;
}