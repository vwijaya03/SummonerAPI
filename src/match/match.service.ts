import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';
import { API, API_KEY } from '../utils/constant';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  async getRecentMatch(puuid: string, region: string): Promise<any> {
    try {
      const endpoint = API.GET_MATCH_IDS_BY_PUUID.replace('{puuid}', puuid);
      const axiosConfig: AxiosRequestConfig = {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      };
      const routing = buildApiUrl(region, endpoint);
      const apiResponse = await axios.get(routing.regionUrl, axiosConfig);
      const matchIds = apiResponse.data;

      return matchIds;
    } catch (error: any) {
      throw new HttpException(
        `Whoops something went wrong while finding recent match, ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
