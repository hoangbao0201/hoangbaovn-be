import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
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
    
    async uploadImageBlog(file: Express.Multer.File, width?: number, height?: number, blogId?: number): Promise<CloudinaryResponse> {
        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'HOANGBAOVN/blog/images',
                        transformation: [{ width: +width || 1200, height: +height || 1200, crop: 'limit' }]
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
            });

            await this.prismaService.blogImage.create({
                data: {
                    blogId: 11,
                    urlImage: result.url
                }
            });

            return { success: true, image: result };
        } catch (error) {
            return { success: false, error };
        }
    }
}

