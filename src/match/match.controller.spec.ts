import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from '../summoner/summoner.service';
import { Summoner } from '../summoner/entities/summoner.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';

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
        TypeOrmModule.forFeature([Match, Summoner]),
      ],
      controllers: [MatchController],
      providers: [
        MatchService,
        SummonerService,
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
  });

  afterEach(async () => {
    await app.close();
  });

  xit('should have matches with info kill, death, assist', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/api/recent-match')
      .query({
        summonerName,
        region,
        page: 1,
        size: 5,
        queueId: 'RANKED_SOLO_5x5',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toBeDefined();
    expect(body).toHaveProperty('matches');
    expect(Array.isArray(body.matches)).toBe(true);

    body.matches.forEach((match) => {
      expect(match).toHaveProperty('info');
      expect(typeof match.info).toBe('object');
      expect(match.info).toHaveProperty('kills', expect.any(Number));
      expect(match.info).toHaveProperty('deaths', expect.any(Number));
      expect(match.info).toHaveProperty('assists', expect.any(Number));
    });
  }, 10000);
});
