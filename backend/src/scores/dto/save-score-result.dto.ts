import { ScoreRecordDto } from './score-record.dto';

export class SaveScoreResultDto {
  saved!: boolean;
  score!: ScoreRecordDto;
}
