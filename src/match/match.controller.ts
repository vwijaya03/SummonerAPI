import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { SummonerService } from '../summoner/summoner.service';
import { RecentMatchQueryParams, RecentMatchResponseExample } from './dto/match.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QUEUE_TYPES } from '../utils/constant';

@ApiTags('API List')
@Controller('api/recent-match')
export class MatchController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly matchService: MatchService,
  ) {}

  @ApiOperation({
    summary: 'Get Recent Matches Of Summoner',
    description: 'Get recent matches of summoner',
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
    name: 'page',
    description: 'page of list recent matches summoner',
    required: true,
  })
  @ApiQuery({
    name: 'size',
    description: 'size of data recent matches of summoner',
    required: true,
  })
  @ApiQuery({
    name: 'queueId',
    description: 'Queue Id / types of matches',
    enum: Object.keys(QUEUE_TYPES),
    required: false,
  })
  @ApiOkResponse({ type: RecentMatchResponseExample })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the recent matches of summoner',
  })
  @Get()
  async getRecentMatch(
    @Query(new ValidationPipe()) query: RecentMatchQueryParams,
  ) {
    try {
      if (!query.page) query.page = 1;
      if (!query.size) query.size = 10;
      if (!query.queueId) query.queueId = 'RANKED_SOLO_5x5';
      // console.log('Received queryParams:', query);
      const { summonerName, region, queueId, page, size } = query;
      const summoner = await this.summonerService.findSummoner(
        summonerName,
        region,
      );
      const match = await this.matchService.getRecentMatch(
        summoner,
        region,
        queueId,
        page,
        size,
        0,
      );

      return match;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
