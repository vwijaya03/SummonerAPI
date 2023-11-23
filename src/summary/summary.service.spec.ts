import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from './summary.service';
import { League } from './entities/league.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';
import { LeagueDTO } from './dto/summary.dto';

describe('Summary Unit Test', () => {
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
        TypeOrmModule.forFeature([League]),
      ],
      controllers: [],
      providers: [SummaryService],
    }).compile();

    summaryService = module.get<SummaryService>(SummaryService);
  });

  xit('should save leagues successfully', async () => {
    const leagues: LeagueDTO[] = [
      {
        summonerId: '3Qh_4XsbkVglL50avQZ2I-CiUOBMb4FCPwrMOMpv1N6EVvE',
        queueId: 420,
        leaguePoints: 1900,
      },
    ];

    await expect(summaryService.save(leagues)).resolves.toBeTruthy();
  }, 10000);
});
