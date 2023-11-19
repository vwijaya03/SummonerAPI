import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { Summoner } from '../summoner/entities/summoner.entity';
import { Match } from '../match/entities/match.entity';
import { SummonerService } from '../summoner/summoner.service';
import { MatchService } from '../match/match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Summoner])],
  controllers: [SummaryController],
  providers: [MatchService, SummaryService, SummonerService],
})
export class SummaryModule {}
