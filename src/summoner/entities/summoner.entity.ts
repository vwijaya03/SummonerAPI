import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Summoner {
  @PrimaryGeneratedColumn()
  summoner_id: number;

  @Column()
  id: string;

  @Column()
  account_id: string;

  @Column()
  puuid: string;

  @Column()
  name: string;

  @Column()
  profile_icon_id: number;

  @Column()
  revision_date: number;

  @Column()
  summoner_level: number;
}
