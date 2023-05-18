import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { CreateChallengeDto } from './dtos/create_challenge.dto';
import { UpdateChallengeDto } from './dtos/update_challenge';
import { lastValueFrom } from 'rxjs';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';

@Injectable()
export class ChallengeService {
  constructor(private clientProxy: ClientProxySmartRanking) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  createChallenge(createChallengeDto: CreateChallengeDto) {
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
    this.clienteAdminBackend.emit('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  async addChallengeMatch(
    id: string,
    addChallengeMatchDto: AddChallengeMatchDto,
  ) {
    await this.getChallenges(id);
    this.clienteAdminBackend.emit('add-challenge-match', {
      id,
      addChallengeMatchDto,
    });
  }

  async deleteChallenge(id: string) {
    await this.getChallenges(id);
    this.clienteAdminBackend.emit('delete-challenge', id);
  }
}
