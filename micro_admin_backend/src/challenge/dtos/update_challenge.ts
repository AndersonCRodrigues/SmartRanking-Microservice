import { IsDateString, IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge.status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  @IsDateString()
  dateHourChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;
}
