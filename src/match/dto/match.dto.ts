import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RecentMatchQueryParams {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  summonerName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  queueId: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  @Max(20)
  @Type(() => Number)
  size?: number;
}

export class Rune {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
}

export class Slot {
  runes: Rune[];
}

export class Style {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Slot[];
}

export class DataPerk {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export class SelectedStyle {
  description: string;
  selections: DataPerk[];
  style: number;
}

class PrimaryRunesResponseExample {
  @ApiProperty({ example: 8128 })
  perk: number;

  @ApiProperty({ example: 'Dark Harvest' })
  name: string;

  @ApiProperty({
    example:
      'Damaging a low health champion inflicts <lol-uikit-tooltipped-keyword key="LinkTooltip_Description_AdaptiveDmg">adaptive damage</lol-uikit-tooltipped-keyword> and harvests a soul from the victim.',
  })
  shortDescription: string;

  @ApiProperty({ example: 267 })
  var1: number;

  @ApiProperty({ example: 6 })
  var2: number;

  @ApiProperty({ example: 0 })
  var3: number;
}

class SpellsResponseExample {
  @ApiProperty({ example: 'BrandQ' })
  id: string;

  @ApiProperty({ example: 'Sear' })
  name: string;

  @ApiProperty({
    example:
      'Brand launches a ball of fire forward that deals magic damage. If the target is ablaze, Sear will stun the target for 1.5 seconds.',
  })
  description: string;
}

class Participant {
  @ApiProperty({ example: 'summoner id 1' })
  summonerId: string;
}

class InfoResponseExample {
  @ApiProperty({ example: 3 })
  assists: number;

  @ApiProperty({ example: 63 })
  championId: number;

  @ApiProperty({
    example:
      'https://ddragon.leagueoflegends.com/cdn/13.22.1/img/champion/Brand.png',
  })
  championImage: string;

  @ApiProperty({ example: 'Brand' })
  championName: string;

  @ApiProperty({ example: 1.4327730925213225 })
  csPerminute: number;

  @ApiProperty({ example: 4 })
  deaths: number;

  @ApiProperty({ example: 1700582273943 })
  gameCreation: number;

  @ApiProperty({ example: 1236 })
  gameDuration: number;

  @ApiProperty({ example: 1236 })
  gameEndTimestamp: number;

  @ApiProperty({ example: 'CLASSIC' })
  gameMode: string;

  @ApiProperty({ example: 'teambuilder-match-4836385652' })
  gameName: string;

  @ApiProperty({ example: 1.5 })
  kda: number;

  @ApiProperty({ example: 3 })
  kills: number;

  @ApiProperty({ example: 'NA1_4836385652' })
  matchId: string;

  @ApiProperty({ type: [PrimaryRunesResponseExample] })
  primaryRunes: PrimaryRunesResponseExample[];

  @ApiProperty({ example: 420 })
  queueId: number;

  @ApiProperty({ type: [SpellsResponseExample] })
  spells: SpellsResponseExample[];

  @ApiProperty({ example: 'summoner id 1' })
  summonerId: string;

  @ApiProperty({ example: 10 })
  visionScore: number;

  @ApiProperty({ example: 0.570561 })
  visionScorePerMinute: number;

  @ApiProperty({ example: true })
  win: boolean;
}
class MatchResponseExample {
  @ApiProperty({ type: InfoResponseExample })
  info: InfoResponseExample;

  @ApiProperty({ type: [Participant] })
  participants: Participant[];
}

export class RecentMatchResponseExample {
  @ApiProperty({ example: 'Amazo' })
  name: string;

  @ApiProperty({
    example: 'puuid',
  })
  puuid: string;

  @ApiProperty({
    example:
      'https://ddragon.leagueoflegends.com/cdn/13.22.1/img/profileicon/5497.png',
  })
  profileImage: string;

  @ApiProperty({ type: [MatchResponseExample] })
  matches: MatchResponseExample[];
}
