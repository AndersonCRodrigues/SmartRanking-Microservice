import { IsNotEmpty, IsOptional } from 'class-validator';

export default class UpdatePlayerDto {
  @IsNotEmpty()
  @IsOptional()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsOptional()
  readonly name: string;
}
