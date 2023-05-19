import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create_challenge.dto';
import { ChallengeStatusValidation } from './pipes/challenge.satus.pipe';
import { UpdateChallengeDto } from './dtos/update_challenge';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';
import { ChallengeService } from './challenge.service';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  getChallenges(@Query('idPlayer') id: string) {
    return this.challengeService.getChallenges(id);
  }

  @Patch('/:id')
  updateChallenge(
    @Param('id') id: string,
    @Body(ChallengeStatusValidation) updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengeService.updateChallenge(id, updateChallengeDto);
  }

  @Post('/:id/match')
  addChallengeMatch(
    @Body(ValidationPipe) addChallengeMatchDto: AddChallengeMatchDto,
    @Param('id') id: string,
  ) {
    return this.challengeService.addChallengeMatch(id, addChallengeMatchDto);
  }

  @Delete('/challenge')
  deleteChallenge(@Param('challenge') id: string) {
    return this.challengeService.deleteChallenge(id);
  }
}
