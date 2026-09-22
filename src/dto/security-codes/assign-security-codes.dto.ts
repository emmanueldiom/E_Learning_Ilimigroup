import { ArrayMinSize, IsArray, IsMongoId } from 'class-validator';

export class AssignSecurityCodesDto {
	@IsArray()
	@ArrayMinSize(1)
	@IsMongoId({ each: true })
	codeIds!: string[];

	@IsMongoId()
	commercialId!: string;
}