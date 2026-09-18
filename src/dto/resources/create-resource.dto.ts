import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';
import { ResourceType } from '../../schemas/resource.schema';

export class CreateResourceDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title!: string;

	@IsString()
	@IsNotEmpty()
	url!: string;

	@IsEnum(ResourceType)
	type!: ResourceType;

	@IsOptional()
	@IsInt()
	@IsPositive()
	order?: number;
}
