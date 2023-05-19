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

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    try {
      const player = new this.playerModel(createPlayerDto);
      return player.save();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async findPlayerBYEmail(email: string) {
    try {
      return this.playerModel.findOne({ email });
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
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
      return await this.playerModel.findById(_id);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<IPlayer> {
    try {
      return await this.playerModel.findByIdAndUpdate(_id, updatePlayerDto);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async deletePlayer(_id: string): Promise<any> {
    try {
      return this.playerModel.findByIdAndDelete(_id);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async updatePlayerImage(param: any) {
    try {
      const myPlayer = await this.getById(param.id);
      myPlayer.urlImagePalyer = param.image;
      myPlayer.save();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }
}
