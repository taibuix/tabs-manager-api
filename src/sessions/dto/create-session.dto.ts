import { IsString, IsUUID } from 'class-validator';
import { type UUID } from 'crypto';

export class CreateSessionDto {
  @IsUUID()
  userId!: string;

  @IsString()
  name?: string;
}
