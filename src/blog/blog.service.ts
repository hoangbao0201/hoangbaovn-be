import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ViewBlogDto } from './dto/view-blog.dto';

@Injectable()
export class BlogService {
    constructor(private prismaService: PrismaService) {}

    async create(userId: number, createBlogDto: CreateBlogDto) {
        const {
            title = '',
            slug = '',
            summary = '',
            content = '',
            published = false,
            thumbnailUrl = '',
            blogTags = [],
        } = createBlogDto;
        try {
            const blog = await this.prismaService.blog.create({
                data: {
                    authorId: userId,
                    title: title,
                    slug: slug,
                    content: content,
                    summary: summary,
                    // published: published,
                    // thumbnailUrl: thumbnailUrl,
                    // blogTags: {
                    //     create: blogTags.map((tag) => ({
                    //         tags: {
                    //             connectOrCreate: {
                    //                 where: {
                    //                     slug: tag.slug,
                    //                 },
                    //                 create: {
                    //                     name: tag.name,
                    //                     slug: tag.slug,
                    //                 },
                    //             },
                    //         },
                    //     })),
                    // },
                },
            });
            return {
                success: true,
                blog: blog,
                userId: userId || 'Không có',
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async findAll(options: {
        q?: string;
        byu?: string;
        tags?: string;
        take?: number;
        skip?: number;
        sort?: 'desc' | 'asc';
        otherId?: number
    }) {
        const {
            q = '',
            byu = '',
            tags = '',
            take = 10,
            skip = 0,
            sort = 'desc',
            otherId
        } = options;
        const listTag = tags ? tags.split(",") : [];

        try {
            let where: Prisma.BlogWhereInput = {};
            if(otherId) {
                where = {
                    ...where,
                    NOT: {
                        blogId: +otherId
                    }
                }
            }
            if (listTag.length > 0) {
                where = {
                    ...where,
                    blogTags: {
                        some: {
                            tags: {
                                OR: listTag.map((tag) => ({
                                    slug: tag
                                })),
                            }
                        }
                    }
                };
            }
            if (q != '') {
                where = {
                    ...where,
                    title: {
                        contains: q,
                    },
                };
            }
            if (byu != '') {
                where = {
                    ...where,
                    author: {
                        username: byu,
                    },
                };
            }

            const blogs = await this.prismaService.blog.findMany({
                skip: +skip,
                take: +take,
                where: where,
                select: {
                    blogId: true,
                    slug: true,
                    title: true,
                    summary: true,
                    thumbnailUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    blogTags: {
                        select: {
                            tags: {
                                select: {
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    author: {
                        select: {
                            role: true,
                            userId: true,
                            name: true,
                            username: true,
                            email: true,
                            rank: true,
                        },
                    },
                    _count: {
                        select: {
                            userViews: true,
                            userLikes: true,
                            userSaves: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: sort,
                },
            });
            return {
                success: true, 
                blogs: blogs || [],
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
            const blogs = await this.prismaService.blog.findMany({
                select: {
                    blogId: true,
                    slug: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                success: true,
                blogs: blogs || [],
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async searchBlogs(options: {
        q?: string;
        tags?: string;
        take?: number;
        skip?: number;
        sort?: 'desc' | 'asc';
    }) {
        const { q = '', tags = '', take = 10, skip = 0, sort = 'desc' } = options;
        const listTag = tags ? tags.split(",") : [];

        try {
            let where: Prisma.BlogWhereInput = {};
            if (tags.length > 0) {
                where = {
                    ...where,
                    blogTags: {
                        some: {
                            tags: {
                                OR: listTag.map((tag) => ({
                                    slug: tag
                                }))
                            }
                        }
                    }
                };
            }

            const blogs = await this.prismaService.blog.findMany({
                skip: +skip,
                take: +take,
                where: {
                    title: {
                        contains: q,
                    },
                },
                select: {
                    blogId: true,
                    slug: true,
                    title: true,
                    thumbnailUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    blogTags: {
                        select: {
                            tags: {
                                select: {
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    author: {
                        select: {
                            role: true,
                            userId: true,
                            name: true,
                            username: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: sort,
                },
            });
            return {
                success: true,
                blogs: blogs || null,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async findOne(slug?: string) {
        try {
            // const cvSlug = slug.substring(0, slug.lastIndexOf('-'));
            const cvBlogId = slug.substring(slug.lastIndexOf('-') + 1);

            const blog = await this.prismaService.blog.findUnique({
                where: {
                    blogId: +cvBlogId,
                },
                select: {
                    blogId: true,
                    slug: true,
                    title: true,
                    summary: true,
                    content: true,
                    thumbnailUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    blogTags: {
                        select: {
                            tags: {
                                select: {
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    blogImages: {
                        select: {
                            blogImageId: true,
                            urlImage: true,
                        },
                    },
                    author: {
                        select: {
                            role: true,
                            userId: true,
                            name: true,
                            username: true,
                            email: true,
                            rank: true,
                        },
                    },
                    _count: {
                        select: {
                            userViews: true,
                            userLikes: true,
                            userSaves: true,
                        },
                    },
                },
            });

            return {
                success: true,
                blog: blog,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async getEditBlog(userId: number, blogId: number) {
        try {
            const blog = await this.prismaService.blog.findUnique({
                where: {
                    blogId: +blogId,
                    author: {
                        userId: userId,
                    },
                },
                select: {
                    blogId: true,
                    slug: true,
                    title: true,
                    summary: true,
                    content: true,
                    thumbnailUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    published: true,
                    blogTags: {
                        select: {
                            tags: {
                                select: {
                                    tagId: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    blogImages: {
                        select: {
                            blogImageId: true,
                            urlImage: true,
                        },
                    },
                    author: {
                        select: {
                            role: true,
                            userId: true,
                            name: true,
                            username: true,
                            email: true,
                            rank: true,
                        },
                    },
                    _count: {
                        select: {
                            userViews: true,
                            userLikes: true,
                            userSaves: true,
                        },
                    },
                },
            });

            return {
                success: true,
                blog: blog,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async updateEditBlog(
        userId: number,
        blogId: number,
        updateBlogDto: UpdateBlogDto,
    ) {
        const {
            slug = '',
            title = '',
            summary = '',
            published = false,
            blogTags = [],
            content = '',
            thumbnailUrl = '',
        } = updateBlogDto;

        try {
            const blog = await this.prismaService.blog.update({
                where: {
                    blogId: +blogId,
                    author: {
                        userId: userId,
                    },
                },
                data: {
                    title,
                    slug,
                    summary,
                    published,
                    content,
                    thumbnailUrl,
                    blogTags: {
                        deleteMany: {},
                        create: blogTags.map((tag) => ({
                            tags: {
                                connectOrCreate: {
                                    where: {
                                        slug: tag.tags.slug,
                                    },
                                    create: {
                                        name: tag.tags.name,
                                        slug: tag.tags.slug,
                                    },
                                },
                            },
                        })),
                    },
                },
            });

            return {
                success: true,
                blog: blog,
                blogTags: blogTags,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async remove(blogId: number, userId: number) {
        try {
            const blog = await this.prismaService.blog.delete({
                where: {
                    blogId: +blogId,
                    author: {
                        userId: +userId,
                    },
                },
            });

            return {
                success: true,
                blog: blog,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async increaseViews(userId: number, blogId: number) {
        try {
            const increaseView = await this.prismaService.userView.create({
                data: {
                    userId: +userId,
                    blogId: +blogId,
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
}
