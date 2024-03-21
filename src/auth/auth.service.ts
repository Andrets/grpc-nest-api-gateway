import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ValidateRequest,
  ValidateResponse,
} from './auth.pb';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private service: AuthServiceClient,
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validateUser(token: ValidateRequest): Promise<ValidateResponse> {
    return firstValueFrom(this.service.validate({ token: token.token }));
  }
}
