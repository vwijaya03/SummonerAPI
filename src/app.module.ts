import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonerModule } from './summoner/summoner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchModule } from './match/match.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/redis';
import typeorm from './config/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SummaryModule } from './summary/summary.module';

@Module({
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
    CacheModule.registerAsync(RedisOptions),
    SummonerModule,
    MatchModule,
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR, // Binding the interceptor globally
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
