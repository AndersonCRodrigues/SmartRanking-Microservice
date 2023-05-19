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
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { PlayerService } from './player.service';

@Controller('api/v1/players')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  constructor(
    private clientProxy: ClientProxySmartRanking,
    private s3Service: S3Service,
    private readonly playerService: PlayerService,
  ) {}

  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get()
  async getPlayer(@Query('id') id: string): Promise<Observable<IPlayer>> {
    return this.clienteAdminBackend.send('get-players', id || '');
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id') id: string,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Delete('/:id')
  async deletePlayer(@Param('id') id: string): Promise<Observable<void>> {
    return this.playerService.deletePlayer(id);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Observable<IPlayer>> {
    return this.playerService.updateImagePlayer(id, file);
  }
}
