import { PartialType } from '@nestjs/swagger';
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

import { CreateOfferDto } from './create-offer.dto';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  itemId: number;

  @IsOptional()
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
