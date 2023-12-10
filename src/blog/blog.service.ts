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
            title,
            slug,
            summary,
            published,
            content,
            thumbnailUrl,
            blogTags,
        } = createBlogDto;
        try {
            const blog = await this.prismaService.blog.create({
                data: {
                    authorId: userId,
                    title: title,
                    slug: slug,
                    summary: summary,
                    content: content,
                    published: true,
                    thumbnailUrl: thumbnailUrl,
                    blogTags: {
                        create: blogTags.map((tag) => ({
                            tags: {
                                connectOrCreate: {
                                    where: {
                                        slug: tag.slug,
                                    },
                                    create: {
                                        name: tag.name,
                                        slug: tag.slug,
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
        search?: string;
        byu?: string;
        tag?: string;
        take?: number;
        skip?: number;
        sort?: 'desc' | 'asc';
    }) {
        const {
            search = '',
            byu = '',
            tag,
            take = 10,
            skip = 0,
            sort = 'desc',
        } = options;

        try {
            let where: Prisma.BlogWhereInput = {};
            if (tag != "") {
                where = {
                    ...where,
                    blogTags: {
                        some: {
                            tags: {
                                slug: tag
                            }
                        }
                    }
                };
            }
            if (search != "") {
                where = {
                    ...where,
                    title: {
                        contains: search,
                    },
                };
            }
            if (byu != "") {
                where = {
                    ...where,
                    author: {
                        username: byu
                    }
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
                blogs: blogs || null,
            };
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async searchBlogs(options: {
        search?: string;
        tag?: string;
        take?: number;
        skip?: number;
        sort?: 'desc' | 'asc';
    }) {
        const {
            search = '',
            tag,
            take = 10,
            skip = 0,
            sort = 'desc',
        } = options;

        try {
            const blogs = await this.prismaService.blog.findMany({
                skip: +skip,
                take: +take,
                where: {
                    title: {
                        contains: search,
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
            const cvSlug = slug.substring(0, slug.lastIndexOf('-'));
            const cvBlogId = slug.substring(slug.lastIndexOf('-') + 1);

            const blog = await this.prismaService.blog.findUnique({
                where: {
                    blogId: Number(cvBlogId),
                    slug: cvSlug,
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
                            urlImage: true
                        }
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
                    blogId: Number(blogId),
                    author: {
                        userId: userId
                    }
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
                            urlImage: true
                        }
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

    async updateEditBlog(userId: number, blogId: number, updateBlogDto: UpdateBlogDto) {
        const {
            title,
            summary,
            published,
            content,
            thumbnailUrl,
        } = updateBlogDto;

        try {
            const blog = await this.prismaService.blog.update({
                where: {
                    blogId: Number(blogId),
                    author: {
                        userId: userId
                    }
                },
                data: {
                    title,
                    summary,
                    published,
                    content,
                    thumbnailUrl,
                }
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

    remove(id: number) {
        return `This action removes a #${id} blog`;
    }

    async increaseViews(id: number, ip, request: Request) {
        try {
            if (!id) {
                const increaseView = await this.prismaService.userView.create({
                    data: {
                        userId: 1,
                        blogId: id,
                        address: ip,
                        deviceBrand: request.headers['user-agent'],
                    },
                });
                return {
                    success: true,
                };
            } else {
                const increaseView = await this.prismaService.userView.create({
                    data: {
                        userId: 1,
                        blogId: id,
                        address: ip,
                        deviceBrand: request.headers['user-agent'],
                    },
                });
                return {
                    success: true,
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }
}
