import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string; // like Honda, VW

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @Min(1930)
  @Max(2050)
  @IsNumber()
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
