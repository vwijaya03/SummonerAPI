import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'matches' })
@Unique(['riot_match_id'])
export class Match {
  @PrimaryGeneratedColumn()
  match_id: number;

  @Column({ unique: true })
  riot_match_id: string;

  @Column()
  puuid: string;

  @Column()
  assists: number;

  @Column({ name: 'champion_id' })
  championId: number;

  @Column({ name: 'champion_name' })
  championName: string;

  @Column({ name: 'cs_perminute', type: 'decimal', precision: 10, scale: 2 })
  csPerminute: number;

  @Column()
  deaths: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  kda: number;

  @Column()
  kills: number;

  @Column()
  win: boolean;

  @Column({ name: 'vision_score', type: 'decimal', precision: 10, scale: 2 })
  visionScore: number;

  @Column({ name: 'summoner_id' })
  summonerId: string;
}
