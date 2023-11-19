import { MigrationInterface, QueryRunner } from 'typeorm';

export class Matches1700376027938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS matches (
          match_id SERIAL PRIMARY KEY,
          riot_match_id VARCHAR(255) UNIQUE NOT NULL,
          puuid VARCHAR(255) NOT NULL,
          assists INT NOT NULL,
          champion_id INT NOT NULL,
          champion_name VARCHAR(100) NOT NULL,
          cs_perminute DECIMAL(10, 2) NOT NULL,
          deaths INT NOT NULL,
          kda DECIMAL(10, 2) NOT NULL,
          kills INT NOT NULL,
          win BOOL NOT NULL,
          vision_score DECIMAL(10, 2) NOT NULL,
          summoner_id VARCHAR(255) NOT NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE matches;');
  }
}
