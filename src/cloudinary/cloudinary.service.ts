import { Injectable } from '@nestjs/common';
import {
    UploadApiErrorResponse,
    UploadApiResponse,
    v2 as cloudinary,
} from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
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

            const checkBlog = await this.prismaService.blog.findUnique({
                where: { blogId: +blogId, author: { userId: +userId } },
                select: { blogId: true, thumbnailUrl: true },
            });
            if (!checkBlog) {
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
                let dataDeleteImage = null;
                if(checkBlog.thumbnailUrl.length > 0) {
                    const splitUrl = checkBlog.thumbnailUrl.split("/");
                    dataDeleteImage = await this.deleteImageBlog({ imageId: "HOANGBAOVN/blog/thumbnail/" + splitUrl[splitUrl.length - 1].split(".")[0] })
                }
                return {
                    success: true,
                    blogImage: {
                        urlImage: result?.url,
                        result: result
                    },
                    dataDeleteImage: dataDeleteImage
                }
            }
            
            const blogImage = await this.prismaService.blogImage.create({
                data: {
                    blogId: checkBlog.blogId,
                    urlImage: result.url,
                },
            });
            
            return {
                success: true,
                blogImage: blogImage,
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async deleteImageBlog({
        imageId
    }: {
        imageId: string;
    }) {
        try {
            const uploadStream = cloudinary.uploader.destroy(imageId);
            
            return {
                success: true,
                uploadStream: uploadStream,
                imageId: imageId
            };
        } catch (error) {
            return { success: false, error };
        }
    }
}
