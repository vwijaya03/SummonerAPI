import { Module } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { SummonerController } from './summoner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summoner } from './entities/summoner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Summoner])],
  controllers: [SummonerController],
  providers: [SummonerService],
})
export class SummonerModule {}
