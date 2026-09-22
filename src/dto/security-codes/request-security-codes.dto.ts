import { IsInt, IsMongoId, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class RequestSecurityCodesDto {
	@IsMongoId()
	formationId!: string;

	@IsInt()
	@IsPositive()
	quantity!: number;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	message?: string;
}