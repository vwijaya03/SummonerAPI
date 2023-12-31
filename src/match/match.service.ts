import { readFile } from 'fs/promises';
import * as Bluebird from 'bluebird';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { buildApiUrl } from '../utils/helper';
import { API, API_KEY, QUEUE_TYPES } from '../utils/constant';
import { Summoner } from 'src/summoner/entities/summoner.entity';
import { Match } from './entities/match.entity';
import { Rune, Style } from './dto/match.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getRecentMatch(
    summoner: Summoner,
    region: string,
    queueId: string,
    page = 1,
    size = 5,
    retry = 0,
  ): Promise<any> {
    try {
      console.log('isi retry', retry, size);
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
          queue: QUEUE_TYPES[queueId],
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
      const savedMatchesData = [];

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

      await Bluebird.delay(2000);
      const matches = await Bluebird.map(
        matchIds,
        async (matchId) => {
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
          const championName = currentPlayer?.championName ?? 'not found';

          const processedPrimaryStyles = selectedPrimaryStyles.flatMap(
            (item) => {
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
          const urlSpellsRaw = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/en_US/champion/${championName}.json`;
          const championSpellsRes = await axios.get(urlSpellsRaw);
          const championSpells =
            championSpellsRes?.data?.data[championName]?.spells ?? [];
          const mappedChampionSpells = championSpells.map((spell) => ({
            id: spell.id,
            name: spell.name,
            description: spell.description,
          }));

          // console.log();
          // console.log('processedPrimaryStyles', JSON.stringify(processedPrimaryStyles, null, 2));
          // console.log('championSpells', mappedChampionSpells);
          // console.log();

          const matchResponse = {
            info: {
              assists: currentPlayer?.assists ?? -1,
              championId: currentPlayer?.championId ?? 'not found',
              championImage: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/champion/${currentPlayer?.championName}.png`,
              championName: championName,
              csPerminute: totalMinionsKilled / durationInMinutes ?? 0,
              deaths: currentPlayer?.deaths ?? -1,
              gameCreation: detailMatchResponse?.info?.gameCreation ?? -1,
              gameDuration: detailMatchResponse?.info?.gameDuration ?? -1,
              gameEndTimestamp: detailMatchResponse?.info?.gameEndTimestamp ?? '',
              gameMode: detailMatchResponse?.info?.gameMode ?? '',
              gameName: detailMatchResponse?.info?.gameName ?? '',
              kda: currentPlayer?.challenges?.kda ?? -1,
              kills: currentPlayer?.kills ?? -1,
              matchId: matchId ?? -1,
              primaryRunes: processedPrimaryStyles,
              queueId: detailMatchResponse?.info?.queueId ?? -1,
              spells: mappedChampionSpells,
              summonerId: currentPlayer?.summonerId ?? 'summonerId not found',
              visionScore: currentPlayer?.visionScore ?? -1,
              visionScorePerMinute:
                currentPlayer?.challenges?.visionScorePerMinute ?? -1,
              win: currentPlayer?.win ?? 'unknown',
            },
            participants:
              participantsMetaInfo?.length > 0 ? participantsMetaInfo : [],
          };

          savedMatchesData.push({
            riot_match_id: matchResponse.info.matchId.toString(),
            puuid: summoner.puuid,
            assists: matchResponse.info.assists,
            championId: matchResponse.info.championId,
            championName: matchResponse.info.championName,
            csPerminute: matchResponse.info.csPerminute,
            deaths: matchResponse.info.deaths,
            kda: matchResponse.info.kda,
            kills: matchResponse.info.kills,
            win: matchResponse.info.win,
            visionScore: matchResponse.info.visionScore,
            summonerId: matchResponse.info.summonerId,
            queueId: matchResponse.info.queueId,
          });

          // console.log();
          // console.log('currentPlayer', JSON.stringify(currentPlayer, null, 2));
          // console.log('detailMatchResponse', JSON.stringify(detailMatchResponse, null, 2));
          // console.log('selectedPrimaryStyles', JSON.stringify(selectedPrimaryStyles, null, 2));
          // console.log();
          return matchResponse;
        },
        { concurrency: 1 },
      );

      // console.log();
      // console.log('isi matches', JSON.stringify(matches, null, 2));
      // console.log();

      await this.matchRepository
        .createQueryBuilder()
        .insert()
        .into(Match)
        .values(savedMatchesData)
        .orIgnore()
        .execute();

      out['matches'] = matches;
      return out;
    } catch (error: any) {
      if (error.message.includes('429')) {
        if (retry > 2) {
          throw new HttpException(
            `rate limit exceeded please try again later`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        await Bluebird.delay(5000);
        await this.getRecentMatch(
          summoner,
          region,
          queueId,
          page,
          size,
          retry + 1,
        );
      } else {
        throw new HttpException(
          `Whoops something went wrong while finding recent match, ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getSummonerId(puuid: string) {
    const match = await this.matchRepository.findOne({ where: { puuid } });

    return match;
  }

  async getMatchesAvgCalculation(queueIds: number[], summonerId: string) {
    const result = this.matchRepository
      .createQueryBuilder('matches')
      .select([
        'ROUND(AVG(cs_perminute), 3) AS average_cs_perminute',
        'ROUND(AVG(vision_score), 3) AS average_vision_score',
        'ROUND(AVG(kda), 3) AS average_kda',
        'queue_id',
        'summoner_id',
      ])
      .where({
        queueId: In(queueIds),
        summonerId: summonerId,
      })
      .groupBy('queue_id, summoner_id')
      .execute();

    return result;
  }
}
