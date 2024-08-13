import { PartialType } from '@nestjs/mapped-types';
import { CreateHashtegDto } from './create-hashteg.dto';

export class UpdateHashtegDto extends PartialType(CreateHashtegDto) {}
