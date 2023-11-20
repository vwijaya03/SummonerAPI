import { Injectable } from '@nestjs/common';
import { Match } from '../match/entities/match.entity';
import { League } from '../summary/entities/league.entity';
import { Summoner } from '../summoner/entities/summoner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QUEUE_TYPES } from '../utils/constant';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,

    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getLeaderboard(summoner: Summoner) {
    const winLeaderboardQuery = `
      WITH win_rate_cte AS (
        SELECT
          summoner_id,
          COUNT(*) FILTER (WHERE win = true) AS total_wins,
          COUNT(*) AS total_games,
          (COUNT(*) FILTER (WHERE win = true) * 100.0 / NULLIF(COUNT(*), 0)) AS win_rate
        FROM "public"."matches"
        GROUP BY summoner_id
      ), result_cte AS (
        SELECT
          summoner_id, win_rate,
          RANK() OVER (ORDER BY win_rate DESC) AS rank
        FROM win_rate_cte
        ORDER BY win_rate DESC
      )
      SELECT *
      FROM result_cte
      WHERE summoner_id = $1
    `;
    const leagueLeaderboardQuery = `
      WITH ranked_leagues AS (
        SELECT
          league_points,
          summoner_id,
          RANK() OVER (ORDER BY league_points DESC) AS rank
        FROM
          "public".leagues
        WHERE
          queue_id = $1
      )
      SELECT
        league_points,
        summoner_id,
        rank
      FROM ranked_leagues
      WHERE summoner_id = $2
    `;
    const winLeaderboard = await this.matchRepository.query(
      winLeaderboardQuery,
      [summoner.id],
    );
    const leaguePointLeaderboard = await this.leagueRepository.query(
      leagueLeaderboardQuery,
      [QUEUE_TYPES['RANKED_SOLO_5x5'], summoner.id],
    );

    const response = { winLeaderboard, leaguePointLeaderboard };
    return response;
  }
}
