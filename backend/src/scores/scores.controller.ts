import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { GetPlayerRankDto } from './dto/get-player-rank.dto';
import { GetTopScoresDto } from './dto/get-top-scores.dto';
import { ScoresService } from './scores.service';
import { PlayerRankResult, SaveScoreResult, ScoreRecord } from './scores.types';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  saveScore(@Body() createScoreDto: CreateScoreDto): Promise<SaveScoreResult> {
    return this.scoresService.saveScore(createScoreDto);
  }

  @Get('top')
  getTopScores(@Query() query: GetTopScoresDto): Promise<ScoreRecord[]> {
    return this.scoresService.getTopScores(query.limit);
  }

  @Get('me')
  getPlayerRank(@Query() query: GetPlayerRankDto): Promise<PlayerRankResult> {
    return this.scoresService.getPlayerRank(query.playerName);
  }
}
