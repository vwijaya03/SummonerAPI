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

export class CreateSummaryDto {}

export class SummaryQueryParams {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  summonerName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  queueId?: string;
}

export class LeagueDTO {
  summonerId: string;
  queueId: number;
  leaguePoints: number;
}

export class LeagueResponseExample {
  @ApiProperty({ example: 'league id' })
  leagueId: string;

  @ApiProperty({ example: 'RANKED_SOLO_5x5' })
  queueType: string;

  @ApiProperty({ example: 'CHALLENGER' })
  tier: string;

  @ApiProperty({ example: 'I' })
  rank: string;

  @ApiProperty({ example: 'summoner id' })
  summonerId: string;

  @ApiProperty({ example: 'ARMAO' })
  summonerName: string;

  @ApiProperty({ example: 1787 })
  leaguePoints: number;

  @ApiProperty({ example: 355 })
  wins: number;

  @ApiProperty({ example: 292 })
  losses: number;

  @ApiProperty({ example: true })
  veteran: boolean;

  @ApiProperty({ example: false })
  inactive: boolean;

  @ApiProperty({ example: false })
  freshBlood: boolean;

  @ApiProperty({ example: false })
  hotStreak: boolean;

  @ApiProperty({ example: 2.184 })
  average_cs_perminute: number;

  @ApiProperty({ example: 21.4 })
  average_vision_score: number;

  @ApiProperty({ example: 3.476 })
  average_kda: number;
}

export class SummaryResponseExample {
  @ApiProperty({ example: 'ARMAO' })
  name: string;

  @ApiProperty({
    example:
      'https://ddragon.leagueoflegends.com/cdn/13.22.1/img/profileicon/6296.png',
  })
  profileImage: string;

  @ApiProperty({ type: [LeagueResponseExample] })
  leagues: LeagueResponseExample[];
}
