import { Injectable } from '@nestjs/common';
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
    const endpoint = API.GET_SUMMONER_BY_NAME + summonerName;
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'X-Riot-Token': API_KEY,
      },
    };

    const url = buildApiUrl(region, endpoint);
    const apiResponse = await axios.get(url, axiosConfig);
    const summonerResponse: Summoner = apiResponse.data;

    const existingSummoner = await this.summonerRepository.findOne({
      where: { puuid: summonerResponse.puuid },
    });

    if (!existingSummoner) {
      await this.summonerRepository.save(summonerResponse);
    }

    console.log(summonerResponse);
    return summonerResponse;
  }
}
