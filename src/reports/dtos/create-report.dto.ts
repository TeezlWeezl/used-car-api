import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDTO {
  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number;

  @IsString()
  make: string; // like Honda, VW

  @IsString()
  model: string;

  @Min(1930)
  @Max(2050)
  @IsNumber()
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
