import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetPlayerRankDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  playerName!: string;
}
