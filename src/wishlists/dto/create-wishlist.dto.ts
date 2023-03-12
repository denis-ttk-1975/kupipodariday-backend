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
