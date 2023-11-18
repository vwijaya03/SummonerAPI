import { PartialType } from '@nestjs/mapped-types';
import { RecentMatchQueryParams } from './match.dto';

export class UpdateMatchDto extends PartialType(RecentMatchQueryParams) {}
