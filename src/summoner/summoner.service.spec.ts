import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from './summoner.service';
import { Summoner } from './entities/summoner.entity';
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

describe('Summoner Unit Test', () => {
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
      controllers: [],
      providers: [
        SummonerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    summonerService = module.get<SummonerService>(SummonerService);
  });

  xit('should have spesified keys', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const summoner = await summonerService.findSummoner(summonerName, region);

    expect(summoner).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        profileIconId: expect.any(Number),
        puuid: expect.any(String),
      }),
    );
  });
});
