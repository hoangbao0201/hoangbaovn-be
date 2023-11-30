import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File, width?: number, height?: number): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'HOANGBAOVN/blog',
                    transformation: [{ width: +width || 1200, height: +height || 1200, crop: 'limit' }]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);

            readableStream.pipe(uploadStream);
        });
    }
    // uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    //     return new Promise<CloudinaryResponse>((resolve, reject) => {
    //         const uploadStream = cloudinary.uploader.upload_stream(
    //             (error, result) => {
    //                 if (error) return reject(error);
    //                 resolve(result);
    //             },
    //         );

    //         streamifier.createReadStream(file.buffer).pipe(uploadStream);
    //     });
    // }
}
