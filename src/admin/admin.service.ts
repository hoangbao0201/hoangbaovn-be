import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async findAllUser(user: { userId: number, username: string }) {
    try {
      if(user.username !== "admin") {
          throw new UnauthorizedException();
      }

      const users = await this.prismaService.user.findMany({
          select: {
              userId: true,
              name: true,
              username: true,
              email: true,
              password: true,
              description: true,
              rank: true,
              candy: true,
              createdAt: true
          },
          orderBy: {
              createdAt: "desc"
          }
      });

      return {
          success: true,
          users: users,
      };
  } catch (error) {
      return {
          success: false,
          error: error
      }
  }
  }
}
