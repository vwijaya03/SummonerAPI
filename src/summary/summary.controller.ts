import { readFile } from 'fs/promises';
import { Controller, Get, Query, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto, SummaryQueryParams } from './dto/summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { MatchService } from '../match/match.service';
import { SummonerService } from '../summoner/summoner.service';

@Controller('api/summary')
export class SummaryController {
  constructor(
    private readonly matchService: MatchService,
    private readonly summonerService: SummonerService,
  ) {}

  @Get()
  async getSummary(@Query() query: SummaryQueryParams) {
    const { summonerName, region } = query;
    const versionRaw = await readFile(
      __dirname + '/../../assets/versions.json',
      'utf8',
    );
    const version = JSON.parse(versionRaw);
    const summoner = await this.summonerService.findSummoner(
      summonerName,
      region,
    );

    const response = {
      name: summoner.name,
      profileImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${summoner.profileIconId}.png`,
    };

    return response;
  }
}
