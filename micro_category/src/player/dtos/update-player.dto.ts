import { IsNotEmpty } from 'class-validator';

export default class UpdatePlayerDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;
}
