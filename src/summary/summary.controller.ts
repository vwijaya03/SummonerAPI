import { readFile } from 'fs/promises';
import { Controller, Get, Query, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto, SummaryQueryParams } from './dto/summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { MatchService } from '../match/match.service';
import { SummonerService } from '../summoner/summoner.service';
import { API, API_KEY, QUEUE_TYPES } from '../utils/constant';
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
    const queueIds =
      leaguesResponse?.map((lr) => QUEUE_TYPES[lr.queueType]) ?? [];
    const matchesAvgCalculation =
      await this.matchService.getMatchesAvgCalculation(queueIds, summoner.id);

    for (const mac of matchesAvgCalculation) {
      const matchingLeague = leaguesResponse.find((league) => {
        const matchingQueueKey = Object.keys(QUEUE_TYPES).find(
          (key) => QUEUE_TYPES[key] === mac.queue_id,
        );

        return league.queueType === matchingQueueKey;
      });

      // console.log('matchingLeague', matchingLeague);
      if (matchingLeague) {
        matchingLeague.average_cs_perminute = parseFloat(
          mac.average_cs_perminute,
        );
        matchingLeague.average_vision_score = parseFloat(
          mac.average_vision_score,
        );
      }
    }

    const response = {
      name: summoner.name,
      profileImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${summoner.profileIconId}.png`,
      leagues: leaguesResponse,
    };

    return response;
  }
}
