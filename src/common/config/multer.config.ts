import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageUploadConfig = {
    storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `product-${uniqueSuffix}${ext}`);
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
    limits: { fileSize: 5 * 1024 * 1024 },
};