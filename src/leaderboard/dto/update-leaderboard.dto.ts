import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderboardDto } from './leaderboard.dto';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {}
