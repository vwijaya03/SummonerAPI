import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateSummaryDto {}

export class SummaryQueryParams {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  summonerName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  queueId?: string;
}

export class LeagueDTO {
  summonerId: string;
  queueId: number;
  leaguePoints: number;
}
