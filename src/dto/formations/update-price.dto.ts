import { IsNumber, Min } from 'class-validator';

export class UpdatePriceDto {
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price!: number;
}
