import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { SummonerService } from '../summoner/summoner.service';

@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly summonerService: SummonerService,
  ) {}

  @Get(':summonerName/:region')
  async getLeaderboard(
    @Param('summonerName') summonerName: string,
    @Param('region') region: string,
  ) {
    const summoner = await this.summonerService.findSummoner(
      summonerName,
      region,
    );
    console.log(summoner);
    const leaderboardResult =
      await this.leaderboardService.getLeaderboard(summoner);
    const leaguePointRank =
      leaderboardResult?.leaguePointLeaderboard?.[0]?.rank ?? -1;
    const winRateRank = leaderboardResult?.winLeaderboard?.[0]?.rank ?? -1;

    const out = {
      leaguePoints: { top: leaguePointRank },
      winRate: { top: winRateRank },
    };

    return out;
  }
}
