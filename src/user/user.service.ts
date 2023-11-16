import { Injectable } from '@nestjs/common';
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
}
