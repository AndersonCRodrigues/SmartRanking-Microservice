import { Controller, Logger } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateChallengeDto } from './dtos/create_challenge.dto';
import { UpdateChallengeDto } from './dtos/update_challenge.dto';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';

const ackErrors = [
  'E1100',
  'Players must be different',
  'The requesting Player must be in the challenge',
  'Challenge not foud',
  'Player has no challenges',
  'Player is not part of this challenge',
];
@Controller('challenge')
export class ChallengeController {
  private readonly logger = new Logger(ChallengeController.name);
  constructor(private readonly challengeService: ChallengeService) {}

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() createChallengeDto: CreateChallengeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.challengeService.createChallenge(createChallengeDto);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @MessagePattern('get-challenges')
  async getChallenges(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (id) {
        return this.challengeService.getChallengeById(id);
      }
      return this.challengeService.getAllChallenges();
    } finally {
      await this.updateAck(channel, originalMsg);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const id: string = data.id;
      const updateChallengeDto: UpdateChallengeDto = data.updateChallengeDto;
      this.challengeService.updateChallenge(id, updateChallengeDto);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @EventPattern('add-challenge-match')
  async addChallengeMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const id: string = data.id;
      const addChallengeMatchDto: AddChallengeMatchDto =
        data.addChallengeMatchDto;
      this.challengeService.addChallengeMatch(id, addChallengeMatchDto);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.challengeService.deleteChallenge(id);
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
