import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
// import { CloudinaryResponse } from './cloudinary-response';
import { Readable } from 'stream';

type CloudinaryResponse = {
    success: boolean;
    image?: UploadApiResponse;
    error?: UploadApiErrorResponse;
};


@Injectable()
export class CloudinaryService {
    async uploadImageBlog(file: Express.Multer.File, width?: number, height?: number): Promise<CloudinaryResponse> {
        return await new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'HOANGBAOVN/blog/images',
                    transformation: [{ width: +width || 1000, height: +height || 1000, crop: 'limit' }]
                },
                (error, result) => {
                    if (error) {
                        reject({ success: false, error });
                    } else {
                        resolve({ success: true, image: result });
                    }
                },
            );

            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);

            readableStream.pipe(uploadStream);
        });
    }
}

