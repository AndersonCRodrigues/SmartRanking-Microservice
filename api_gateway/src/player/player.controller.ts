import {
  BadRequestException,
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

@Controller('api/v1/players')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  constructor(
    private clientProxy: ClientProxySmartRanking,
    private s3Service: S3Service,
  ) {}

  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Observable<void> {
    return this.clienteAdminBackend.emit('create-player', createPlayerDto);
  }

  @Get()
  getPlayer(@Query('id') id: string): Observable<IPlayer> {
    return this.clienteAdminBackend.send('get-players', id || '');
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id') id: string,
  ): Observable<void> {
    return this.clienteAdminBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
  }

  @Delete('/:id')
  deletePlayer(@Param('id') id: string): Observable<void> {
    return this.clienteAdminBackend.emit('delete-player', id);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    if (!this.clienteAdminBackend.send('get-players', id)) {
      throw new BadRequestException('Player not found');
    }
    const image = await this.s3Service.uploadFile(id, file);
    this.clienteAdminBackend.emit('update-image-player', { id, image });
  }
}
