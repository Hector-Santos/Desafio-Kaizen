import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImprovementsDto } from './improvements.dto';

export class CreateScoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  playerName!: string;

  @IsInt()
  @Min(0)
  score!: number;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImprovementsDto)
  improvements!: ImprovementsDto;

  @IsInt()
  @Min(1)
  @Max(60 * 60 * 24)
  elapsedSeconds!: number;
}
