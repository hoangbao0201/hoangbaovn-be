import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { isEmail } from 'class-validator';

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

    async findByAccout(accout: string) {
        let where: Prisma.UserWhereUniqueInput;
        if(isEmail(accout)) {
            where = {
                email: accout
            }
        }
        else {
            where = {
                username: accout
            }
        }
        return await this.prismaService.user.findUnique({
            where: where,
            include: {
                role: true
            }
        });
    }

    async findAllSEO() {
        try {
            const users = await this.prismaService.user.findMany({
                select: {
                    userId: true,
                    name: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                success: true,
                users: users || [],
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }
}
