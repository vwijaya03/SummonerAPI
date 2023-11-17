import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'summoners' })
export class Summoner {
  @PrimaryGeneratedColumn()
  summoner_id: number;

  @Column()
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column()
  puuid: string;

  @Column()
  name: string;

  @Column({ name: 'profile_icon_id' })
  profileIconId: number;

  @Column({ name: 'revision_date', type: 'bigint' })
  revisionDate: bigint;

  @Column({ name: 'summoner_level' })
  summonerLevel: number;

  @Column()
  region: string;
}
