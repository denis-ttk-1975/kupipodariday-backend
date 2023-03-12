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
} from 'class-validator';

export class FindQueryUsersDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  query: string;
}
