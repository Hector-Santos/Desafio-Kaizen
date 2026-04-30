import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetPlayerRankDto } from './dto/get-player-rank.dto';
import { GetTopScoresDto } from './dto/get-top-scores.dto';
import { PlayerRankResultDto } from './dto/player-rank-result.dto';
import { SaveScoreResultDto } from './dto/save-score-result.dto';
import { ScoreRecordDto } from './dto/score-record.dto';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  saveScore(
    @Body() createScoreDto: CreateScoreDto,
  ): Promise<SaveScoreResultDto> {
    return this.scoresService.saveScore(createScoreDto);
  }

  @Get('top')
  getTopScores(@Query() query: GetTopScoresDto): Promise<ScoreRecordDto[]> {
    return this.scoresService.getTopScores(query.limit);
  }

  @Get('me')
  getPlayerRank(
    @Query() query: GetPlayerRankDto,
  ): Promise<PlayerRankResultDto> {
    return this.scoresService.getPlayerRank(query.playerName);
  }
}
