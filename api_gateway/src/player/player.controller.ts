import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IPlayer } from './interfaces/player.interface';
import CreatePlayerDto from './dtos/create_player.dto';
import UpdatePlayerDto from './dtos/update-player.dto';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';

@Controller('api/v1/players')
export class PlayerController {
  constructor(private clientProxy: ClientProxySmartRanking) {}
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

  @Patch('/:_id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id') id: string,
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
}
