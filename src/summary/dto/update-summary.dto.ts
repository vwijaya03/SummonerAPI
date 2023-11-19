import { PartialType } from '@nestjs/mapped-types';
import { CreateSummaryDto } from './summary.dto';

export class UpdateSummaryDto extends PartialType(CreateSummaryDto) {}
