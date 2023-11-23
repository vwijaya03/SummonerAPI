import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from './summoner.service';
import { Summoner } from './entities/summoner.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SummonerController } from './summoner.controller';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};
let app: INestApplication;

describe('LeaderboardController', () => {
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
        TypeOrmModule.forFeature([Summoner]),
      ],
      controllers: [SummonerController],
      providers: [
        SummonerService,
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

  xit('should have same keys between body and summoner service', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const summoner = await summonerService.findSummoner(summonerName, region);

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/api/summoner')
      .query({ summonerName: 'yourSummonerName', region: 'yourRegion' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Object.keys(body)).toEqual(
      expect.arrayContaining(Object.keys(summoner)),
    );
  });
});
