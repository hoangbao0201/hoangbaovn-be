import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";



@Injectable({})
export class JwrStratega extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        public prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('TOKEN_SETCRET')
        })
    }

    async validate(payload: { sub: number, email: string }) {        
        const user = await this.prismaService.user.findUnique({
            where: {
                userId: payload.sub,
                email: payload.email
            }
        })

        delete user.password;

        return user;
    }
}