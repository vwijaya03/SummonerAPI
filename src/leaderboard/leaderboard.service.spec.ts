import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { SummonerService } from '../summoner/summoner.service';
import { Summoner } from '../summoner/entities/summoner.entity';
import { League } from '../summary/entities/league.entity';
import { Match } from '../match/entities/match.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('Leaderboard Unit Test', () => {
  let summonerService: SummonerService;
  let leaderboardService: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [typeorm],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            configService.get('typeorm'),
        }),
        TypeOrmModule.forFeature([Summoner, Match, League]),
      ],
      controllers: [],
      providers: [
        SummonerService,
        LeaderboardService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    summonerService = module.get<SummonerService>(SummonerService);
    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  xit('should have leaderboard', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const summoner = await summonerService.findSummoner(summonerName, region);
    const leaderboard = await leaderboardService.getLeaderboard(summoner);

    expect(leaderboard).toBeDefined();
  });
});
