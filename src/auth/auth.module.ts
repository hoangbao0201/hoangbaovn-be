import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwrStratega } from '../stratega/jwt.stratega';

@Module({
  imports: [
    JwtModule.register({})
  ],
  providers: [AuthService, JwrStratega],
  controllers: [AuthController]
})
export class AuthModule {}
