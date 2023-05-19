import { IsNotEmpty, IsOptional } from 'class-validator';

export default class UpdatePlayerDto {
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  category: string;

  @IsNotEmpty()
  urlImagePalyer: string;
}
