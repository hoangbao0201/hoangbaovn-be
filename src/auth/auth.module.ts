import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { GithubStrategy } from './strategy/GithubStrategy';
import { GoogleStrategy } from './strategy/GoogleStrategy';
import { FacebookStrategy } from './strategy/FacebookStrategy';

@Module({
    imports: [JwtModule.register({})],
    providers: [AuthService, UserService, GithubStrategy, GoogleStrategy, FacebookStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
