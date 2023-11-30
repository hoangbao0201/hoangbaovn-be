import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async userDetail(username: string): Promise<any> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    username: username,
                },
                select: {
                    userId: true,
                    username: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    createdAt: true,
                    description: true,
                    rank: true,
                    role: true,
                    _count: {
                        select: {
                            blogs: true,
                            userSaves: true,
                        },
                    },
                },
            });
    
            return {
                success: true,
                user: user,
            };
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }

    //
    async findById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                userId: id,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
    }
}
