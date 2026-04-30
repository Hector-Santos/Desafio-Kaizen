import { ImprovementsDto } from './improvements.dto';

export class ScoreRecordDto {
  id!: string;
  playerName!: string;
  score!: number;
  improvements!: ImprovementsDto;
  elapsedSeconds!: number;
  createdAt!: string;
  updatedAt!: string;
}
