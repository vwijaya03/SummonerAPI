import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaderboardDto {}

export class LeaderboardDTO {
  summonerName: string;
  region: string;
}

export class LeaderboardResponseExample {
  @ApiProperty({
    example: {
      top: 3,
    },
  })
  leaguePoints: { top: number };

  @ApiProperty({
    example: {
      top: 3,
    },
  })
  winRate: { top: number };
}
