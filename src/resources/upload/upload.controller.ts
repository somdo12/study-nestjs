import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Get,
    Param,
    Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import type { Response } from 'express';  // ← เปลี่ยนตรงนี้
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {

    @Post('image')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/images',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    const filename = `image-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(
                        new BadRequestException('Only image files are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadImage(@UploadedFile() file) {
        if (!file) {
            throw new BadRequestException('Please upload an image file');
        }

        return {
            message: 'Image uploaded successfully',
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            path: file.path,
            url: `http://localhost:8081/upload/image/${file.filename}`,
        };
    }

    @Get('image/:filename')
    getImage(@Param('filename') filename: string, @Res() res: Response) {
        return res.sendFile(filename, { root: './uploads/images' });
    }
}