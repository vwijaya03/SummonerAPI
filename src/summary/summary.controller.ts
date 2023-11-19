import { readFile } from 'fs/promises';
import { Controller, Get, Query, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto, SummaryQueryParams } from './dto/summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { MatchService } from '../match/match.service';
import { SummonerService } from '../summoner/summoner.service';
import { API, API_KEY } from '../utils/constant';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';

@Controller('api/summary')
export class SummaryController {
  constructor(
    private readonly matchService: MatchService,
    private readonly summonerService: SummonerService,
  ) {}

  @Get()
  async getSummary(@Query() query: SummaryQueryParams) {
    if (!query.queueId) query.queueId = 'RANKED_SOLO_5x5';

    const { summonerName, region, queueId } = query;
    const versionRaw = await readFile(
      __dirname + '/../../assets/versions.json',
      'utf8',
    );
    const version = JSON.parse(versionRaw);
    const summoner = await this.summonerService.findSummoner(
      summonerName,
      region,
    );
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'X-Riot-Token': API_KEY,
      },
      params: {
        queue: queueId,
      },
    };
    const endpoint = API.GET_LEAGUE_ENTRIES_ALL_QUEUE + summoner.id;
    const routing = buildApiUrl(region, endpoint);
    const { data: leaguesResponse } = await axios.get(
      routing.platformUrl,
      axiosConfig,
    );

    const response = {
      name: summoner.name,
      profileImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${summoner.profileIconId}.png`,
      leagues: leaguesResponse,
    };

    return response;
  }
}
