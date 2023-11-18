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
  queueId: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  size: number;
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
