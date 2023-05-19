import { IsOptional } from 'class-validator';

export default class UpdatePlayerDto {
  @IsOptional()
  readonly phoneNumber: string;

  @IsOptional()
  readonly name: string;

  @IsOptional()
  category: string;

  @IsOptional()
  urlImagePalyer: string;
}
