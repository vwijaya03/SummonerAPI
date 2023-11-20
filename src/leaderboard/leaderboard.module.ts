import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { SummaryService } from '../summary/summary.service';
import { Summoner } from '../summoner/entities/summoner.entity';
import { Match } from '../match/entities/match.entity';
import { SummonerService } from '../summoner/summoner.service';
import { MatchService } from '../match/match.service';
import { League } from '../summary/entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, League, Summoner])],
  controllers: [LeaderboardController],
  providers: [
    LeaderboardService,
    MatchService,
    SummaryService,
    SummonerService,
  ],
})
export class LeaderboardModule {}
