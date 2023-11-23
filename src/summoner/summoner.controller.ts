import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { SummonerResponseExample } from './dto/summoner.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Summoner } from './entities/summoner.entity';

@ApiTags('API List')
@Controller('api/summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({
    summary: 'Get Detail Of Summoner',
    description: 'Get the detail information of a summoner from leaderboards',
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
  @ApiOkResponse({ type: SummonerResponseExample })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the detail of summoner',
  })
  
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
