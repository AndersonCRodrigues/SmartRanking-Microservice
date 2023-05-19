import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PlayerService } from './player.service';
import CreatePlayerDto from './dtos/create_player.dto';
import { IPlayer } from './interfaces/players.interface';

const ackErrors = ['E1100'];
@Controller()
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @MessagePattern('create-player')
  async createPlayer(
    @Payload() createPlayerDto: CreatePlayerDto,
    @Ctx() context: RmqContext,
  ): Promise<IPlayer> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      return await this.playerService.createPlayer(createPlayerDto);
    } catch (e) {
      error = e;
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
    } finally {
      await this.updateAck(channel, originalMsg, error);
    }
  }

  @MessagePattern('get-players')
  async getPlayers(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<IPlayer[] | IPlayer> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (id) {
        return this.playerService.getById(id);
      }
      return this.playerService.getAll();
    } finally {
      await this.updateAck(channel, originalMsg);
    }
  }

  @MessagePattern('update-player')
  async updatePlayer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { id } = data;
      const player: IPlayer = data.player;
      this.playerService.updatePlayer(id, player);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @MessagePattern('delete-player')
  async deletePlayer(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.playerService.deletePlayer(id);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @MessagePattern('update-image-player')
  async updatePlayerImage(
    @Payload() param: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(param);
      this.playerService.updatePlayerImage(param);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      await this.updateAck(channel, originalMsg, e);
    }
  }

  private async updateAck(
    channel: any,
    originalMsg: any,
    e?: any,
  ): Promise<void> {
    if (e) {
      ackErrors.forEach(async (ackError) => {
        if (e.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    } else {
      await channel.ack(originalMsg);
    }
  }
}
