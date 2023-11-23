import { ApiProperty } from '@nestjs/swagger';

export class CreateSummonerDto {}

export class SummonerResponseExample {
  @ApiProperty({ example: 1 })
  summoner_id: number;

  @ApiProperty({ example: 'summoner_id' })
  id: string;

  @ApiProperty({ example: 'summoner_account_id' })
  accountId: string;

  @ApiProperty({ example: 'summoner_puuid' })
  puuid: string;

  @ApiProperty({ example: 'ARMAO' })
  name: string;

  @ApiProperty({ example: 200 })
  profileIconId: number;

  @ApiProperty({ example: 1700672539385 })
  revisionDate: number;

  @ApiProperty({ example: 50 })
  summonerLevel: number;

  @ApiProperty({ example: 'NA1' })
  region: string;
}
