import { readFile } from 'fs/promises';
import * as Bluebird from 'bluebird';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';
import { API, API_KEY } from '../utils/constant';
import { Summoner } from 'src/summoner/entities/summoner.entity';
import { Rune, Style } from './dto/match.dto';

@Injectable()
export class MatchService {
  async getRecentMatch(
    summoner: Summoner,
    region: string,
    queueId: number,
    page = 1,
    size = 25,
  ): Promise<any> {
    try {
      const versionRaw = await readFile(
        __dirname + '/../../assets/versions.json',
        'utf8',
      );
      const perksRaw = await readFile(
        __dirname + '/../../assets/runesReforged.json',
        'utf8',
      );
      const version = JSON.parse(versionRaw);
      const perks = JSON.parse(perksRaw);
      const endpoint = API.GET_MATCH_IDS_BY_PUUID.replace(
        '{puuid}',
        summoner.puuid,
      );
      const axiosConfig: AxiosRequestConfig = {
        headers: {
          'X-Riot-Token': API_KEY,
        },
        params: {
          start: page,
          count: size,
          queue: queueId,
        },
      };
      const routing = buildApiUrl(region, endpoint);
      const apiResponse = await axios.get(routing.regionUrl, axiosConfig);
      const matchIds = apiResponse.data;
      const out = {
        name: summoner.name,
        puuid: summoner.puuid,
        profileImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${summoner.profileIconId}.png`,
      };

      // console.log('url', routing.regionUrl, axiosConfig);
      const resourceStylesMap: Map<number, Style> = new Map();
      const runesMap: Map<number, Rune> = new Map();

      perks.forEach((style) => {
        resourceStylesMap.set(style.id, style);
      });
      perks.forEach((style) => {
        style.slots.forEach((slot) => {
          slot.runes.forEach((rune) => {
            runesMap.set(rune.id, rune);
          });
        });
      });

      const matches = await Bluebird.map(matchIds, async (matchId) => {
        const endpointDetailMatch = API.GET_DETAIL_MATCH + matchId;
        const routingDetailMatch = buildApiUrl(region, endpointDetailMatch);
        const { data: detailMatchResponse } = await axios.get(
          routingDetailMatch.regionUrl,
          axiosConfig,
        );
        const gameCreationTimestamp =
          detailMatchResponse?.info?.gameCreation ?? -1;
        const gameEndTimestamp =
          detailMatchResponse?.info?.gameEndTimestamp ?? -1;
        const durationInMilliseconds = gameEndTimestamp - gameCreationTimestamp;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);
        const participantsMetaInfo =
          detailMatchResponse?.metadata?.participants ?? [];
        const participantsGameInfo = detailMatchResponse?.info?.participants;
        const currentPlayer =
          participantsGameInfo?.length > 0
            ? participantsGameInfo.find((p) => p.puuid === summoner.puuid)
            : {};
        const totalMinionsKilled = currentPlayer?.totalMinionsKilled ?? -10;
        const selectedPerkStyles = currentPlayer?.perks?.styles ?? [];
        const selectedPrimaryStyles = selectedPerkStyles.filter(
          (s) => s.description === 'primaryStyle',
        );

        const processedPrimaryStyles = selectedPrimaryStyles.flatMap((item) => {
          // Find the style in the resource array
          const style = resourceStylesMap.get(item.style);

          return style
            ? item.selections
                .map((selection) => {
                  /*
                    flatMap to transform
                    [ { "runes": [{id: 1}] }, { "runes": [{id: 2}] } ] to [ { id: 1 }, { id: 2 } ]
                  */
                  const matchingRune = style.slots
                    .flatMap((slot) => slot.runes)
                    .find((rune) => rune.id === selection.perk);

                  return matchingRune
                    ? {
                        perk: matchingRune.id,
                        name: matchingRune.name,
                        shortDescription: matchingRune.shortDesc,
                        var1: selection.var1,
                        var2: selection.var2,
                        var3: selection.var3,
                      }
                    : null; // Use null instead of undefined
                })
                .filter(Boolean) // Filter out null values
            : [];
        });

        // console.log();
        // console.log('processedPrimaryStyles', JSON.stringify(processedPrimaryStyles, null, 2));
        // console.log();

        const matchResponse = {
          info: {
            gameCreation: detailMatchResponse?.info?.gameCreation ?? -1,
            gameDuration: detailMatchResponse?.info?.gameDuration ?? -1,
            gameEndTimestamp: detailMatchResponse?.info?.gameEndTimestamp ?? '',
            gameMode: detailMatchResponse?.info?.gameMode ?? '',
            gameName: detailMatchResponse?.info?.gameName ?? '',
            kills: currentPlayer?.kills ?? -1,
            deaths: currentPlayer?.deaths ?? -1,
            assists: currentPlayer?.assists ?? -1,
            kda: currentPlayer?.challenges?.kda ?? -1,
            championName: currentPlayer?.championName ?? 'not found',
            championId: currentPlayer?.championId ?? 'not found',
            championImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/champion/${currentPlayer?.championName}.png`,
            csPerminute: totalMinionsKilled / durationInMinutes ?? 0,
            primaryRunes: processedPrimaryStyles,
          },
          participants:
            participantsMetaInfo?.length > 0 ? participantsMetaInfo : [],
        };

        // console.log();
        // console.log('detailMatchResponse', JSON.stringify(detailMatchResponse, null, 2));
        // console.log('selectedPrimaryStyles', JSON.stringify(selectedPrimaryStyles, null, 2));
        // console.log();
        return matchResponse;
      });

      // console.log();
      // console.log('isi matches', JSON.stringify(matches, null, 2));
      // console.log();

      out['matches'] = matches;

      return out;
    } catch (error: any) {
      throw new HttpException(
        `Whoops something went wrong while finding recent match, ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
