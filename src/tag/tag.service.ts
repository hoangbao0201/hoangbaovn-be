import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService {
    constructor(private prismaService: PrismaService) {}

    create(createTagDto: CreateTagDto) {
        return 'This action adds a new tag';
    }

    async findAll(options: {
        q?: string;
        tag?: string;
        take?: number;
        skip?: number;
        sort?: 'desc' | 'asc';
    }) {
        const { q, tag, take = 10, skip = 0, sort = 'desc' } = options;

        let where: Prisma.TagWhereInput = {};
        if (q) {
            where = {
                name: {
                    contains: q,
                },
            };
        }

        try {
            const tags = await this.prismaService.tag.findMany({
                skip: +skip,
                take: +take,
                orderBy: {
                    blogTags: {
                        _count: sort,
                    },
                },
                where: where,
                select: {
                    tagId: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            blogTags: true,
                        },
                    },
                },
            });
            return {
                success: true,
                tags: tags,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} tag`;
    }

    update(id: number, updateTagDto: UpdateTagDto) {
        return `This action updates a #${id} tag`;
    }

    async remove(userId: number, blogId: number, tagId: number) {
        try {
            const tag = await this.prismaService.blogTag.delete({
                where: {
                    blogId_tagId: {
                        blogId: blogId,
                        tagId: tagId
                    },
                    blog: {
                        author: {
                            userId: userId
                        }
                    }
                },
            });

            return {
                success: true,
                tag: tag,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async findAllSEO() {
        try {
            const tags = await this.prismaService.tag.findMany({
                select: {
                    tagId: true,
                    slug: true,
                    name: true,
                },
            });
            return {
                success: true,
                tags: tags || [],
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }
}
