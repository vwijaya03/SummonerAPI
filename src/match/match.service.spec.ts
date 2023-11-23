import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { SummonerService } from '../summoner/summoner.service';
import { Match } from './entities/match.entity';
import { Summoner } from '../summoner/entities/summoner.entity';
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

describe('Match Unit Test', () => {
  let matchService: MatchService;
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
        TypeOrmModule.forFeature([Match, Summoner]),
      ],
      controllers: [],
      providers: [
        MatchService,
        SummonerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    summonerService = module.get<SummonerService>(SummonerService);
  });

  xit('should have at least 1 match', async () => {
    const summonerName = 'Amazo';
    const region = 'NA1';

    const summoner = await summonerService.findSummoner(summonerName, region);
    const result = await matchService.getRecentMatch(
      summoner,
      region,
      '',
      1,
      5,
      0,
    );

    expect(result.matches.length).toBeGreaterThan(0);
  }, 10000);
});
