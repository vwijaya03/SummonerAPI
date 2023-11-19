import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class RecentMatchQueryParams {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  summonerName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  queueId: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  @Max(20)
  @Type(() => Number)
  size?: number;
}

export class Rune {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
}

export class Slot {
  runes: Rune[];
}

export class Style {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Slot[];
}

export class DataPerk {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export class SelectedStyle {
  description: string;
  selections: DataPerk[];
  style: number;
}
