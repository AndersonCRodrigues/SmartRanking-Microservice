import { Injectable, Logger } from '@nestjs/common';
import { IPlayer } from './interfaces/players.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import CreatePlayerDto from './dtos/create_player.dto';
import UpdatePlayerDto from './dtos/update-player.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<IPlayer>,
  ) {}

  private async findPlayerBYEmail(email: string) {
    return this.playerModel.findOne({ email });
  }

  async getAll(): Promise<IPlayer[]> {
    try {
      return this.playerModel.find();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async getById(_id: string): Promise<IPlayer> {
    try {
      const player = await this.playerModel.findById(_id);

      if (!player) {
        throw new RpcException('Player not found');
      }
      return player;
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    try {
      await this.getById(_id);
      await this.playerModel.findByIdAndUpdate(_id, updatePlayerDto);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    try {
      if (await this.findPlayerBYEmail(createPlayerDto.email)) {
        throw new RpcException('E-mail already registered');
      }
      const player = new this.playerModel(createPlayerDto);
      return player.save();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async deletePlayer(_id: string): Promise<any> {
    try {
      await this.getById(_id);
      return this.playerModel.findByIdAndDelete(_id);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }
}
