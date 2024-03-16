import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.pb';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private service: AuthServiceClient,
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  private async register(
    @Body() registerDto: RegisterRequest,
  ): Promise<Observable<RegisterResponse>> {
    return this.service.register(registerDto);
  }

  @Post('login')
  private async login(
    @Body() loginDto: LoginRequest,
  ): Promise<Observable<LoginResponse>> {
    return this.service.login(loginDto);
  }
}
