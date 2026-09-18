import {
	IsEnum,
	IsInt,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';
import { ResourceType } from '../../schemas/resource.schema';

export class UpdateResourceDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	title?: string;

	@IsOptional()
	@IsString()
	url?: string;

	@IsOptional()
	@IsEnum(ResourceType)
	type?: ResourceType;

	@IsOptional()
	@IsInt()
	@IsPositive()
	order?: number;
}
