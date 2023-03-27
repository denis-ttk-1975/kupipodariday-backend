import { PartialType } from '@nestjs/swagger';
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

import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;
  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description: string;
  @IsOptional()
  @IsUrl()
  image: string;
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  items: number[];
}
