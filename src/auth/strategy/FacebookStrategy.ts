import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('FACEBOOK_CLIENT_ID'),
            clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
            callbackURL: `${configService.get('MAIN_URL')}/api/auth/facebook/callback`,
            scope: ["profile"],
        });
    }

    async validate(
        accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        return profile;
    }
}



