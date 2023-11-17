import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Summoner } from './entities/summoner.entity';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';
import { API, API_KEY } from '../utils/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CreateSummonerDto } from './dto/create-summoner.dto';
// import { UpdateSummonerDto } from './dto/update-summoner.dto';

@Injectable()
export class SummonerService {
  constructor(
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
  ) {}

  async findSummoner(summonerName: string, region: string) {
    try {
      const endpoint = API.GET_SUMMONER_BY_NAME + summonerName;
      const axiosConfig: AxiosRequestConfig = {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      };

      let existingSummoner = await this.summonerRepository.findOne({
        where: { name: summonerName, region: region },
      });

      if (!existingSummoner) {
        const routing = buildApiUrl(region, endpoint);
        const apiResponse = await axios.get(routing.platformUrl, axiosConfig);
        const summonerResponse: Summoner = apiResponse.data;
        summonerResponse.region = region;

        await this.summonerRepository.save(summonerResponse);
        existingSummoner = summonerResponse;
      }

      console.log(existingSummoner);
      return existingSummoner;
    } catch (error: any) {
      throw new HttpException(
        `Whoops something went wrong while finding summoner, ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
