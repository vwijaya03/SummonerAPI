import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';

@Controller('api/summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get()
  getSummoner(
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
      return this.summonerService.findSummoner(summonerName, region);
    } catch (error: any) {
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
