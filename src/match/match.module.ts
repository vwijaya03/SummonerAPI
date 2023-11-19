import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { SummonerService } from '../summoner/summoner.service';
import { MatchController } from './match.controller';
import { Summoner } from '../summoner/entities/summoner.entity';
import { Match } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Summoner])],
  controllers: [MatchController],
  providers: [MatchService, SummonerService],
})
export class MatchModule {}
