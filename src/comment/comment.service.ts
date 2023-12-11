import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}
  
    async createComment(userId: number, createCommentDto: CreateCommentDto) {
        const {
            blogId,
            commentText
        } = createCommentDto;
        try {
            const comment = await this.prismaService.comment.create({
              data: {
                senderId: userId,
                blogId: +blogId,
                commentText: commentText,
              }
            })
            return {
                success: true,
                comment: comment
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async getComments(options: {
      blogId: number;
      take?: number;
      skip?: number;
      // sort?: 'desc' | 'asc';
  }) {
      const { blogId, take = 10, skip = 0 } = options;
      try {
        const comments = await this.prismaService.comment.findMany({
          skip: +skip,
          take: +take,
          where: {
            blogId: +blogId,
          },
          select: {
            sender: {
              select: {
                userId: true,
                name: true,
                username: true,
                rank: true,
                role: true,
                avatarUrl: true,
              }
            }
          },
        });

        return {
          success: true,
          comments: comments
        };
      } catch (error) {
        return {
          success: false,
          error: error,
        };
      }
    }

    // findAll() {
    //   return `This action returns all comment`;
    // }

    // findOne(id: number) {
    //   return `This action returns a #${id} comment`;
    // }

    // update(id: number, updateCommentDto: UpdateCommentDto) {
    //   return `This action updates a #${id} comment`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} comment`;
    // }
}
