import { PartialType } from '@nestjs/swagger';
import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsNumber,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  // @IsOptional()
  // @IsString()
  // @Length(1, 250)
  // name: string;

  // @IsOptional()
  // @IsUrl()
  // link: string;

  // @IsOptional()
  // @IsUrl()
  // image: string;

  // @IsOptional()
  // @IsNumber({ maxDecimalPlaces: 2 })
  // @Min(1)
  // price: number;

  // @IsOptional()
  // @IsString()
  // @Length(1, 1024)
  // description: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;
}
