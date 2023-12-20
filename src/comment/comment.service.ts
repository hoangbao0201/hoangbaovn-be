import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReplyCommentDto } from './dto/create-replycomment.dto';

@Injectable()
export class CommentService {
    constructor(private prismaService: PrismaService) {}

    async createComment(userId: number, createCommentDto: CreateCommentDto) {
        const { blogId, commentText } = createCommentDto;
        try {
            const comment = await this.prismaService.comment.create({
                data: {
                    senderId: +userId,
                    blogId: +blogId,
                    commentText: commentText,
                },
            });
            return {
                success: true,
                comment: comment,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async createReplyComment(
        userId: number,
        createCommentDto: CreateReplyCommentDto,
    ) {
        const { blogId, parentId, receiverId, commentText } = createCommentDto;
        try {
            const comment = await this.prismaService.comment.create({
                data: {
                    senderId: +userId,
                    blogId: +blogId,
                    parentId: +parentId,
                    receiverId: +receiverId,
                    commentText: commentText,
                },
            });
            return {
                success: true,
                comment: comment,
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
                orderBy: {
                    createdAt: "desc"
                },
                where: {
                    blogId: +blogId,
                    parentId: null,
                },
                select: {
                    blogId: true,
                    commentId: true,
                    commentText: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            replyComments: true,
                        },
                    },
                    sender: {
                        select: {
                            userId: true,
                            name: true,
                            username: true,
                            rank: true,
                            role: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            return {
                success: true,
                comments: comments,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async getReplyComments(options: {
        blogId: number;
        parentId: number;
        take?: number;
        skip?: number;
        // sort?: 'desc' | 'asc';
    }) {
        const { blogId, parentId, take = 10, skip = 0 } = options;
        try {
            const comments = await this.prismaService.comment.findMany({
                skip: +skip,
                take: +take,
                orderBy: {
                    createdAt: "asc"
                },
                where: {
                    blogId: +blogId,
                    parentId: +parentId,
                },
                select: {
                    blogId: true,
                    commentId: true,
                    commentText: true,
                    createdAt: true,
                    updatedAt: true,
                    sender: {
                        select: {
                            userId: true,
                            name: true,
                            username: true,
                            rank: true,
                            role: true,
                            avatarUrl: true,
                        },
                    },
                    receiver: {
                      select: {
                        userId: true,
                        name: true,
                        username: true,
                      },
                    }
                },
            });

            return {
                success: true,
                comments: comments,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async deleteComment({ userId, commentId }: {
        userId: number,
        commentId: number,
    }) {

        try {
            const comment = await this.prismaService.comment.delete({
                where: {
                    sender: {
                        userId: +userId
                    },
                    commentId: +commentId
                },
            });
            return {
                success: true,
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
