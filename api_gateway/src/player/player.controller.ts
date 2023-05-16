import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { config } from 'dotenv';
import { IPlayer } from './interfaces/player.interface';
import CreatePlayerDto from './dtos/create_player.dto';
import UpdatePlayerDto from './dtos/update-player.dto';

config();

const { RABBITMQ_URL } = process.env;
@Controller('api/v1/players')
export class PlayerController {
  private clienteAdminBackend: ClientProxy;

  constructor() {
    this.clienteAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: 'admin-backend',
        noAck: false,
      },
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): void {
    this.clienteAdminBackend.emit('create-player', createPlayerDto);
  }

  @Patch('/:_id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id') id: string,
  ): void {
    this.clienteAdminBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
  }
}
