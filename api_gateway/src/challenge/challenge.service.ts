import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { CreateChallengeDto } from './dtos/create_challenge.dto';
import { UpdateChallengeDto } from './dtos/update_challenge';
import { lastValueFrom } from 'rxjs';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';
import { CategoryService } from 'src/category/category.service';
import { PlayerService } from 'src/player/player.service';
import { IPlayer } from 'src/player/interfaces/player.interface';

@Injectable()
export class ChallengeService {
  constructor(
    private clientProxy: ClientProxySmartRanking,
    private readonly categoryService: CategoryService,
    private readonly playerService: PlayerService,
  ) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    const players: IPlayer[] | any = createChallengeDto.players.map(
      async (player): Promise<IPlayer[] | any> => {
        await this.playerService.getPlayers(player._id);
      },
    );
    const checkCategory = players.every(
      (player: { category: string }) =>
        player.category === createChallengeDto.category,
    );

    if (!checkCategory) {
      throw new BadRequestException(
        'Players are not part of the informed category',
      );
    }

    if (
      !players.some(
        (player: { _id: string }) =>
          player._id === createChallengeDto.requester,
      )
    ) {
      throw new BadRequestException(
        'The challenging player must be part of the challenge',
      );
    }

    await this.categoryService.getCategories(createChallengeDto.category);

    this.clienteAdminBackend.emit('create-challenge', createChallengeDto);
  }

  async getChallenges(id: string) {
    const challenge = await lastValueFrom(
      this.clienteAdminBackend.send('get-challenges', id || ''),
    );
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
  }

  async updateChallenge(id: string, updateChallengeDto: UpdateChallengeDto) {
    await this.getChallenges(id);
    this.clienteAdminBackend.send('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  async addChallengeMatch(
    id: string,
    addChallengeMatchDto: AddChallengeMatchDto,
  ) {
    await this.getChallenges(id);
    this.clienteAdminBackend.send('add-challenge-match', {
      id,
      addChallengeMatchDto,
    });
  }

  async deleteChallenge(id: string) {
    await this.getChallenges(id);
    this.clienteAdminBackend.send('delete-challenge', id);
  }
}
