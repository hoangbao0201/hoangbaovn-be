import { Injectable } from '@nestjs/common';
import {
    UploadApiErrorResponse,
    UploadApiResponse,
    v2 as cloudinary,
} from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CloudinaryResponse } from './cloudinary-response';
import { Readable } from 'stream';

type CloudinaryResponse = {
    success: boolean;
    image?: UploadApiResponse;
    error?: UploadApiErrorResponse;
};

@Injectable()
export class CloudinaryService {
    constructor(private prismaService: PrismaService) {}

    async uploadImageBlog({
        userId,
        file,
        type,
        width,
        height,
        blogId,
    }: {
        userId: number;
        file: Express.Multer.File;
        type?: string;
        width?: number;
        height?: number;
        blogId?: number;
    }) {
        try {
            if (!blogId) {
                throw new Error('Blog id not found');
            }

            const author = await this.prismaService.blog.findUnique({
                where: { blogId: +blogId, author: { userId: +userId } },
                select: { blogId: true },
            });
            if (!author) {
                throw new Error('You do not have permission');
            }

            const result = await new Promise<UploadApiResponse>(
                (resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `HOANGBAOVN/blog/${type === "thumbnail" ? "thumbnail" : "images"}`,
                            transformation: [
                                {
                                    width: +width || 1200,
                                    height: +height || 1200,
                                    crop: 'limit',
                                },
                            ],
                        },
                        (error, result) => {
                            if (error) {
                                reject({ success: false, error });
                            } else {
                                resolve(result);
                            }
                        },
                    );

                    const readableStream = new Readable();
                    readableStream.push(file.buffer);
                    readableStream.push(null);

                    readableStream.pipe(uploadStream);
                },
            );

            if(type === "thumbnail") {
                const blogImageThumbnail = await this.prismaService.blog.update({
                    where: {
                        blogId: blogId,
                        author: {
                            userId: userId
                        }
                    },
                    data: {
                        thumbnailUrl: result.url
                    }
                });
                
                return {
                    success: true,
                    blogImageThumbnail: blogImageThumbnail,
                    urlImage: result.url,
                };
            }
            
            const blogImage = await this.prismaService.blogImage.create({
                data: {
                    blogId: author.blogId,
                    urlImage: result.url,
                },
            });
            
            return {
                success: true,
                blogImage: blogImage,
                urlImage: result.url,
            };
        } catch (error) {
            return { success: false, error };
        }
    }
}
