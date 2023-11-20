import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'leagues' })
@Unique(['summonerId', 'queueId'])
export class League {
  @PrimaryGeneratedColumn()
  league_id: number;

  @Column({ name: 'summoner_id' })
  summonerId: string;

  @Column({ name: 'queue_id' })
  queueId: number;

  @Column({ name: 'league_points' })
  leaguePoints: number;
}
