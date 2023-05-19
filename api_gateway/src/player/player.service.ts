import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { S3Service } from 'src/s3/s3.service';
import CreatePlayerDto from './dtos/create_player.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { IPlayer } from './interfaces/player.interface';

@Injectable()
export class PlayerService {
  constructor(
    private clientProxy: ClientProxySmartRanking,
    private s3Service: S3Service,
    private categoryService: CategoryService,
  ) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  async createPlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Observable<IPlayer>> {
    this.categoryService.getCategories(createPlayerDto.category);
    return lastValueFrom(
      this.clienteAdminBackend.send('create-player', createPlayerDto),
    );
  }

  async getPlayers(id: string) {
    const player = await lastValueFrom(
      this.clienteAdminBackend.send('get-players', id || ''),
    );

    if (!player) {
      throw new NotFoundException('Player not found!');
    }
    return player;
  }

  async updateImagePlayer(
    id: string,
    file: Express.Multer.File,
  ): Promise<Observable<IPlayer>> {
    await this.getPlayers(id);
    const image = await this.s3Service.uploadFile(id, file);
    return lastValueFrom(
      this.clienteAdminBackend.send('update-image-player', { id, image }),
    );
  }

  async updatePlayer(id: string, updatePlayerDto) {
    await this.getPlayers(id);
    return lastValueFrom(
      this.clienteAdminBackend.send('update-player', {
        id,
        player: updatePlayerDto,
      }),
    );
  }

  async deletePlayer(id: string) {
    await this.getPlayers(id);
    return this.clienteAdminBackend.emit('delete-player', id);
  }
}
