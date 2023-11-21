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

export class CreateLeaderboardDto {}

export class LeaderboardDTO {
  summonerName: string;
  region: string;
}
