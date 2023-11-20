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
import { RecentMatchQueryParams } from './dto/match.dto';

@Controller('api/recent-match')
export class MatchController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly matchService: MatchService,
  ) {}

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
