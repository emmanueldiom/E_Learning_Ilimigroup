import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ResourceType } from '../../schemas/resource.schema';

type ResourceUploadFile = {
	buffer?: Buffer;
	originalname?: string;
	mimetype?: string;
};

export class CreateResourceDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	title!: string;

	@IsOptional()
	@IsString()
	url?: string;

	@IsOptional()
	@IsEnum(ResourceType)
	type?: ResourceType;

	@IsOptional()
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	@Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
	order?: number;
}
