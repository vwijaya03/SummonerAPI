import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { SummonerService } from '../summoner/summoner.service';
import { RecentMatchQueryParams } from './dto/match.dto';

@Controller('api/recent-match')
export class MatchController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly matchService: MatchService,
  ) {}

  @Get()
  async getRecentMatch(@Query() query: RecentMatchQueryParams) {
    try {
      if (!query.page) query.page = 1;
      if (!query.size) query.size = 20;
      if (!query.queueId) query.queueId = 'RANKED_SOLO_5x5';

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
      );

      return match;
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }
  }
}
