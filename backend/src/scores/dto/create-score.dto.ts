import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateScoreDto {
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @IsInt()
  @Min(0)
  score: number;

  @IsObject()
  improvements: Record<string, number>;

  @IsInt()
  @Min(1)
  @Max(60 * 60 * 24)
  elapsedSeconds: number;
}
