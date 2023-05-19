import { ChallengeStatus } from './challenge.status.enum';
import { IPlayer } from 'src/player/interfaces/player.interface';

export interface IResult {
  set: string;
}

export interface IMatch {
  category: string;
  players: IPlayer[];
  def: IPlayer;
  result: IResult[];
}

export interface IChallenge {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requester: string;
  category: string;
  players: IPlayer[];
  match: IMatch;
}
