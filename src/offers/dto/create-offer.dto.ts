import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsUrl,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsString,
  IsOptional,
  MinLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateOfferDto {
  itemId: number;

  @Min(1)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
