import { ScoreRecordDto } from './score-record.dto';

export class PlayerRankResultDto {
  rank!: number | null;
  score!: ScoreRecordDto | null;
}
