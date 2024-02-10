import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, GoogleCallbackParameters, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService) {
        super(
            {
                clientID: configService.get('GOOGLE_CLIENT_ID'),
                clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
                callbackURL: `${configService.get('MAIN_URL')}/api/auth/google/callback`,
                scope: ['email', 'profile', 'openid'],
            },
            async (
                accessToken: string,
                refreshToken: string,
                params: GoogleCallbackParameters,
                profile: Profile,
                done: VerifyCallback,
            ) => {
                const { expires_in, id_token } = params;
                const {
                    id,
                    name,
                    emails,
                    photos,
                    _json: { email_verified },
                } = profile;
                const user = {
                    providerAccountId: id,
                    email: emails[0].value,
                    email_verified,
                    firstName: name.givenName,
                    lastName: name.familyName,
                    picture: photos[0].value,
                    accessToken,
                    refreshToken,
                    id_token,
                    expires_in,
                };
                done(null, user);
            },
        );
    }
}
