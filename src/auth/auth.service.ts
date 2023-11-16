import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

import * as argon from "argon2"
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';


@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    async register(authDTO: RegisterDTO) {
        
        try {
            const hashPassword = await argon.hash(authDTO.password);

            const user = await this.prismaService.user.create({
                data: {
                    name: authDTO.name,
                    username: authDTO.username,
                    email: authDTO.email,
                    password: hashPassword,
                    roleId: 3
                },
                select: {
                    name: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false
                }
            })

            return {
                message: `Regiter user successfully`,
                users: user
            }
        } catch (error) {
            if(error.code === "P2002") {
                // throw new ForbiddenException(error.message);
                // throw new ForbiddenException("Error in credentials");
                return {
                    success: false,
                    message: "Error in credentials"
                }
            }
            return {
                success: false,
                error: error
            }
        }
    }

    async login(authDTO: LoginDTO) {

        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: authDTO.email
                },
                select: {
                    userId: true,
                    email: true,
                    password: true
                }
            });
            if(!user) {
                return {
                    success: false,
                    message: "Incorrect account or password"
                }
            }
    
            // Check password
            const checkPassword = await argon.verify(user.password, authDTO.password);
            if(!checkPassword) {
                return {
                    success: false,
                    message: "Incorrect account or password"
                }
            }
    
            // JWT
            delete user.password
    
            return await this.signJwtToken(user.userId, authDTO.email);

        } catch (error) {
            return {
                success: false,
                error: error
            }
        }

    }

    //now convert to an object, not string
    async signJwtToken(userId: number, email: string): Promise<{success: boolean, accessToken: string}>{
        const payload = {
            sub: userId,
            email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: this.configService.get('TOKEN_SETCRET')
        })
        return {
            success: true,
            accessToken: jwtString,
        }
    }
}
