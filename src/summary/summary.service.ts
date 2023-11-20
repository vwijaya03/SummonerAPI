import { Injectable } from '@nestjs/common';
import { LeagueDTO } from './dto/summary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
  ) {}

  async save(leagues: LeagueDTO[]) {
    await this.leagueRepository
      .createQueryBuilder()
      .insert()
      .into(League)
      .values(leagues)
      .onConflict(
        `("summoner_id", "queue_id") DO UPDATE SET "league_points" = EXCLUDED."league_points"`,
      )
      .execute();
    return 'This action adds a new summary';
  }
}
