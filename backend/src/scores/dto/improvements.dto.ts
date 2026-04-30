import { IsInt, Max, Min } from 'class-validator';

export const MAX_IMPROVEMENT_PURCHASES = 5;

export class ImprovementsDto {
  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  '5S'!: number;

  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  Kanban!: number;

  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  'Poka-Yoke'!: number;

  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  TPM!: number;

  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  Andon!: number;

  @IsInt()
  @Min(0)
  @Max(MAX_IMPROVEMENT_PURCHASES)
  Heijunka!: number;
}
