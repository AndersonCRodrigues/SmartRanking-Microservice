import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PlayerService } from './player.service';
import CreatePlayerDto from './dtos/create_player.dto';
import { IPlayer } from './interfaces/players.interface';
import UpdatePlayerDto from './dtos/update-player.dto';

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
    let error: any | null;
    try {
      if (id) {
        return this.playerService.getById(id);
      }
      return this.playerService.getAll();
    } catch (e) {
      error = e;
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
    } finally {
      await this.updateAck(channel, originalMsg, error);
    }
  }

  @MessagePattern('update-player')
  async updatePlayer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<IPlayer> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      const { id } = data;
      const player: UpdatePlayerDto = data.player;
      return this.playerService.updatePlayer(id, player);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      error = e;
    } finally {
      await this.updateAck(channel, originalMsg, error);
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
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
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

  @MessagePattern('get-player-by-email')
  async getPlayerByEmail(
    @Payload() email: string,
    @Ctx() context: RmqContext,
  ): Promise<IPlayer> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      return this.playerService.findPlayerBYEmail(email);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      error = e;
    } finally {
      await this.updateAck(channel, originalMsg, error);
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
