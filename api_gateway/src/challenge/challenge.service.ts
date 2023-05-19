import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { CreateChallengeDto } from './dtos/create_challenge.dto';
import { UpdateChallengeDto } from './dtos/update_challenge';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';
import { CategoryService } from 'src/category/category.service';
import { PlayerService } from 'src/player/player.service';
import { IPlayer } from 'src/player/interfaces/player.interface';
import { IChallenge, IMatch } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge.status.enum';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChallengeService {
  constructor(
    private clientProxy: ClientProxySmartRanking,
    private readonly categoryService: CategoryService,
    private readonly playerService: PlayerService,
  ) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    await this.categoryService.getCategories(createChallengeDto.category);

    const players = createChallengeDto.players.filter(async (player) => {
      await this.playerService.getPlayers(player._id);
    }) as IPlayer[];

    if (
      !players.every(
        (player: { category: string }) =>
          player.category === createChallengeDto.category,
      )
    ) {
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

    this.clienteAdminBackend.send('create-challenge', createChallengeDto);
  }

  async getChallenges(id: string): Promise<IChallenge | IChallenge[]> {
    await this.playerService.getPlayers(id);
    const challenge = await lastValueFrom(
      this.clienteAdminBackend.send('get-challenges', id || ''),
    );
    if (!challenge) {
      throw new NotFoundException('Challenge not found!');
    }
    return challenge;
  }

  async updateChallenge(id: string, updateChallengeDto: UpdateChallengeDto) {
    const challenge = (await this.getChallenges(id)) as IChallenge;

    if (challenge.status !== ChallengeStatus.PENDING) {
      throw new BadRequestException(
        'Only challenges with PENDING status can be updated!',
      );
    }
    this.clienteAdminBackend.send('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  async addChallengeMatch(
    id: string,
    addChallengeMatchDto: AddChallengeMatchDto,
  ) {
    const challenge = (await this.getChallenges(id)) as IChallenge;

    if (challenge.status === ChallengeStatus.DONE) {
      throw new BadRequestException(`Challenge already accomplished!`);
    }

    if (challenge.status !== ChallengeStatus.ACCEPT) {
      throw new BadRequestException(
        `Matches can only be launched in challenges accepted by opponents!`,
      );
    }

    if (!challenge.players.includes(addChallengeMatchDto.def)) {
      throw new BadRequestException(
        'The winning player of the match must take part in the challenge!',
      );
    }
    const match: IMatch = {
      category: challenge.category,
      def: addChallengeMatchDto.def,
      challenge: id,
      players: challenge.players,
      result: addChallengeMatchDto.result,
    };

    return this.clienteAdminBackend.send('add-challenge-match', match);
  }

  async deleteChallenge(id: string) {
    await this.getChallenges(id);
    return this.clienteAdminBackend.emit('delete-challenge', id);
  }
}
