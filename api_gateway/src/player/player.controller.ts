import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IPlayer } from './interfaces/player.interface';
import CreatePlayerDto from './dtos/create_player.dto';
import UpdatePlayerDto from './dtos/update-player.dto';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerService } from './player.service';

@Controller('api/v1/players')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get()
  async getPlayer(
    @Query('id') id: string,
  ): Promise<Observable<IPlayer[] | IPlayer>> {
    return this.playerService.getPlayers(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id') id: string,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.updateImagePlayer(id, file);
  }

  @Delete('/:id')
  async deletePlayer(@Param('id') id: string): Promise<Observable<void>> {
    return this.playerService.deletePlayer(id);
  }
}
