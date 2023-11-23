import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardDTO } from './dto/leaderboard.dto';
import { SummonerService } from '../summoner/summoner.service';
import { SummaryController } from '../summary/summary.controller';
import { Summoner } from '../summoner/entities/summoner.entity';

@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly summonerService: SummonerService,
    private readonly summaryController: SummaryController,
  ) {}

  @Get(':summonerName/:region')
  async getLeaderboard(@Param() params: LeaderboardDTO) {
    const { summonerName, region } = params;
    const summoner = await this.summonerService.findSummoner(
      summonerName,
      region,
    );
    const leaderboardResult =
      await this.leaderboardService.getLeaderboard(summoner);
    let leaguePointRank =
      leaderboardResult?.leaguePointLeaderboard?.[0]?.rank ?? -1;
    let winRateRank = leaderboardResult?.winLeaderboard?.[0]?.rank ?? -1;

    if (leaguePointRank < 0) {
      const { refreshedLeaguePointRank, refreshedWinRateRank } =
        await this.refreshDataSummoner(params, summoner);
      leaguePointRank = refreshedLeaguePointRank;
      winRateRank = refreshedWinRateRank;
    }
    const out = {
      leaguePoints: { top: Number(leaguePointRank) },
      winRate: { top: Number(winRateRank) },
    };

    return out;
  }

  async refreshDataSummoner(params: LeaderboardDTO, summoner: Summoner) {
    await this.summaryController.getSummary(params);

    const leaderboardResult =
      await this.leaderboardService.getLeaderboard(summoner);
    const leaguePointRank =
      leaderboardResult?.leaguePointLeaderboard?.[0]?.rank ?? -1;
    const winRateRank = leaderboardResult?.winLeaderboard?.[0]?.rank ?? -1;

    return {
      refreshedLeaguePointRank: Number(leaguePointRank),
      refreshedWinRateRank: Number(winRateRank),
    };
  }
}
