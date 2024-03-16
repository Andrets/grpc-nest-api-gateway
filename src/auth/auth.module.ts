import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './auth.pb';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: AUTH_SERVICE_NAME,
        useFactory: async (
          configService: ConfigService,
        ): Promise<GrpcOptions> => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('AUTH_GRPC_URL'),
            package: AUTH_PACKAGE_NAME,
            protoPath: 'node_modules/grpc-proto/proto/auth.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
