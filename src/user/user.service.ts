import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async userDetail(id: number): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: {
                userId: id,
            },
        });

        return {
            user: user,
        };
    }

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
