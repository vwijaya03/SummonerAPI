import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { SummonerService } from '../summoner/summoner.service';
import { SummaryService } from '../summary/summary.service';
import { MatchService } from '../match/match.service';
import { Summoner } from '../summoner/entities/summoner.entity';
import { League } from '../summary/entities/league.entity';
import { Match } from '../match/entities/match.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LeaderboardController } from './leaderboard.controller';
import { SummaryController } from '../summary/summary.controller';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};
let app: INestApplication;

describe('Leaderboard Integration Test', () => {
  let summonerService: SummonerService;

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
      controllers: [LeaderboardController],
      providers: [
        LeaderboardService,
        SummaryService,
        MatchService,
        SummonerService,
        SummaryController,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    summonerService = module.get<SummonerService>(SummonerService);
  });

  afterEach(async () => {
    await app.close();
  });

  xit('should have win rate and league point rank', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get('/api/leaderboard/Amazo/NA1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    console.log(body);
    expect(body).toEqual(
      expect.objectContaining({
        leaguePoints: expect.objectContaining({
          top: expect.any(Number),
        }),
        winRate: expect.objectContaining({
          top: expect.any(Number),
        }),
      }),
    );
  });
});
