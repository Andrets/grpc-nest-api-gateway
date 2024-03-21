import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GetUserByJWTResponse,
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from './auth.pb';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { RegisterRequestDto } from './dto/registerRequest.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private service: AuthServiceClient,
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly authService: AuthService,
  ) {}

  public onModuleInit() {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.service.register(registerDto);
  }

  @Post('login')
  private async login(
    @Body() loginDto: LoginRequestDto,
    @Req() req: FastifyRequest,
  ): Promise<Observable<LoginResponse> | Observable<GetUserByJWTResponse>> {
    const token = req.headers['authorization']
      ? req.headers['authorization']
      : '';
    if (token.length > 0) {
      const result = await this.authService.validateUser({ token: token });
      if (result.valid != true) {
        throw new UnauthorizedException('Invalid token, please login again');
      }
      return this.service.getUserByJwt({ jwtToken: token });
    }
    return this.service.login(loginDto);
  }

  @Get('validate')
  private async validate(
    @Req() req: FastifyRequest,
  ): Promise<ValidateResponse> {
    const token = req.headers['authorization']
      ? req.headers['authorization']
      : '';
    if (token.length == 0) {
      throw new UnauthorizedException('Invalid token, please login again');
    }
    return this.authService.validateUser({ token: token });
  }
}
