import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { SummonerService } from '../summoner/summoner.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('api/recent-match')
export class MatchController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly matchService: MatchService,
  ) {}

  @Get()
  async getRecentMatch(
    @Query('summonerName') summonerName: string,
    @Query('region') region: string,
  ) {
    try {
      if (!summonerName || !region) {
        throw new HttpException(
          'parameter summonerName or region is empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      const summoner = await this.summonerService.findSummoner(
        summonerName,
        region,
      );
      const match = await this.matchService.getRecentMatch(
        summoner.puuid,
        region,
      );

      return match;
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }
  }
}
