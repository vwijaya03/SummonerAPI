import { PartialType } from '@nestjs/mapped-types';
import { CreateSummonerDto } from './summoner.dto';

export class UpdateSummonerDto extends PartialType(CreateSummonerDto) {}
