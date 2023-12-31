import { MigrationInterface, QueryRunner } from 'typeorm';

export class Summoners1700143419682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS summoners (
          summoner_id SERIAL PRIMARY KEY,
          id VARCHAR(255) NOT NULL,
          account_id VARCHAR(255) NOT NULL,
          puuid VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          profile_icon_id INT NOT NULL,
          revision_date BIGINT NOT NULL,
          summoner_level INT NOT NULL,
          region VARCHAR(30) NOT NULL,
          league_points DECIMAL(10, 2),
          max_league_points DECIMAL(10, 2),
          level VARCHAR(30)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE summoners;');
  }
}
