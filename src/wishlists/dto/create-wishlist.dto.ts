import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsString,
  IsOptional,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

import { Wish } from './../../wishes/entities/wish.entity';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(1, 1500)
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  items: number[];
}
