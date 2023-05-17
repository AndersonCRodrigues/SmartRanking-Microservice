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
import { IMatch } from './interfaces/challenge.interface';
import { Observable } from 'rxjs';
import { ChallengeStatusValidation } from './pipes/challenge.satus.pipe';
import { UpdateChallengeDto } from './dtos/update_challenge';
import { AddChallengeMatchDto } from './dtos/add_challenge_match.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private clientProxy: ClientProxySmartRanking) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  @Post()
  @UsePipes(ValidationPipe)
  createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Observable<void> {
    return this.clienteAdminBackend.emit(
      'create-challenge',
      createChallengeDto,
    );
  }

  @Get()
  getChallenges(@Query('id') id: string): Observable<IMatch[] | IMatch> {
    return this.clienteAdminBackend.send('get-challenges', id || '');
  }

  @Patch('/:id')
  updateChallenge(
    @Param('id') id: string,
    @Body(ChallengeStatusValidation) updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.clienteAdminBackend.emit('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  @Post('/:id/match')
  addChallengeMatch(
    @Body(ValidationPipe) addChallengeMatchDto: AddChallengeMatchDto,
    @Param('id') id: string,
  ): Observable<void> {
    return this.clienteAdminBackend.emit('add-challenge-match', {
      id,
      addChallengeMatchDto,
    });
  }

  @Delete('/challenge')
  deleteChallenge(@Param('challenge') id: string): Observable<void> {
    return this.clienteAdminBackend.emit('delete-challenge', id);
  }
}
