import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { IPlayer } from 'src/player/interfaces/player.interface';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateHourChallenge: Date;

  @IsNotEmpty()
  requester: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: IPlayer[];
}
