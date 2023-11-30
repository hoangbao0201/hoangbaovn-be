import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/images/cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('width') width?: number,
        @Query('height') height?: number,
    ) {
        return this.cloudinaryService.uploadFile(file, width, height);
    }
}
