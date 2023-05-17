import { IsNotEmpty } from 'class-validator';
import { IResult } from '../interfaces/challenge.interface';
import { IPlayer } from 'src/player/interfaces/player.interface';

export class AddChallengeMatchDto {
  @IsNotEmpty()
  def: IPlayer;

  @IsNotEmpty()
  result: IResult[];
}
