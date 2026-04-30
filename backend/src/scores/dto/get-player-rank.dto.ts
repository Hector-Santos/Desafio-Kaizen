import { IsNotEmpty, IsString } from 'class-validator';

export class GetPlayerRankDto {
  @IsString()
  @IsNotEmpty()
  playerName: string;
}
