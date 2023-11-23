import { readFile } from 'fs/promises';
import { Controller, Get, Query } from '@nestjs/common';
import { SummaryService } from './summary.service';
import {
  LeagueDTO,
  SummaryQueryParams,
  SummaryResponseExample,
} from './dto/summary.dto';
import { MatchService } from '../match/match.service';
import { SummonerService } from '../summoner/summoner.service';
import { API, API_KEY, QUEUE_TYPES } from '../utils/constant';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';
import { Promise } from 'bluebird';
import { League } from './entities/league.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('API List')
@Controller('api/summary')
export class SummaryController {
  constructor(
    private readonly matchService: MatchService,
    private readonly summonerService: SummonerService,
    private readonly summaryService: SummaryService,
  ) {}

  @ApiOperation({
    summary: 'Get Summary Of Summoner',
    description: 'Get summoner name, profile images, and league points',
  })
  @ApiQuery({
    name: 'summonerName',
    description: 'Summoner name from leaderboards',
    required: true,
  })
  @ApiQuery({
    name: 'region',
    description: 'Region of summoner from leaderboards',
    required: true,
  })
  @ApiQuery({
    name: 'queueId',
    description: 'Queue Id / types of matches',
    enum: Object.keys(QUEUE_TYPES),
    required: false,
  })
  @ApiOkResponse({ type: SummaryResponseExample })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the summary of summoner',
  })
  @Get()
  async getSummary(@Query() query: SummaryQueryParams) {
    if (!query.queueId) query.queueId = '';

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
    let { data: leaguesResponse } = await axios.get(
      routing.platformUrl,
      axiosConfig,
    );
    const queueIds =
      leaguesResponse?.map((lr) => QUEUE_TYPES[lr.queueType]) ?? [];
    let matchesAvgCalculation =
      await this.matchService.getMatchesAvgCalculation(queueIds, summoner.id);

    if (matchesAvgCalculation.length < 1) {
      const matchesByQueueId = leaguesResponse.map(async (lr) => {
        await this.matchService.getRecentMatch(
          summoner,
          region,
          lr.queueType,
          1,
          5,
          0,
        );
      });
      await Promise.all(matchesByQueueId);
      matchesAvgCalculation = await this.matchService.getMatchesAvgCalculation(
        queueIds,
        summoner.id,
      );
    }

    const savedLeagueData: LeagueDTO[] = [];
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
        matchingLeague.average_kda = parseFloat(mac.average_kda);
      }

      savedLeagueData.push({
        summonerId: summoner.id,
        queueId: QUEUE_TYPES[matchingLeague.queueType],
        leaguePoints: matchingLeague.leaguePoints,
      });
    }

    if (queueId && queueId.length > 0 && queueId !== 'ALL') {
      leaguesResponse = leaguesResponse.filter(
        (lr) => lr.queueType === queueId,
      );
    }

    await this.summaryService.save(savedLeagueData);

    const response = {
      name: summoner.name,
      profileImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${summoner.profileIconId}.png`,
      leagues: leaguesResponse,
    };

    return response;
  }
}
