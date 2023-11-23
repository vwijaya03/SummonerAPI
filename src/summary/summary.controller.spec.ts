import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from '../summoner/summoner.service';
import { Summoner } from '../summoner/entities/summoner.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SummaryController } from './summary.controller';
import { MatchService } from '../match/match.service';
import { Match } from '../match/entities/match.entity';
import { SummaryService } from './summary.service';
import { Summary } from './entities/summary.entity';
import { League } from './entities/league.entity';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};
let app: INestApplication;

describe('LeaderboardController', () => {
  let summonerService: SummonerService;
  let matchService: MatchService;
  let summaryService: SummaryService;

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
        TypeOrmModule.forFeature([Match, Summoner, Summary, League]),
      ],
      controllers: [SummaryController],
      providers: [
        MatchService,
        SummonerService,
        SummaryService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    matchService = module.get<MatchService>(MatchService);
    summonerService = module.get<SummonerService>(SummonerService);
    summaryService = module.get<SummaryService>(SummaryService);
  });

  afterEach(async () => {
    await app.close();
  });

  xit('should get summary and spesific keys', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/api/summary')
      .query({
        summonerName,
        region,
        queueId: 'RANKED_SOLO_5x5',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        profileImage: expect.any(String),
        leagues: expect.arrayContaining([
          expect.objectContaining({
            wins: expect.any(Number),
            losses: expect.any(Number),
            leaguePoints: expect.any(Number),
            average_cs_perminute: expect.any(Number),
            average_vision_score: expect.any(Number),
            average_kda: expect.any(Number),
          }),
        ]),
      })
    );
  }, 10000);
});
