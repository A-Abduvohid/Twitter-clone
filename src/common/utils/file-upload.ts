import { HttpException, HttpStatus } from '@nestjs/common';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const multerOptions = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', '..', 'uploads'),

    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
      callback(null, filename);
    },
  }),

  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(
        new HttpException(
          "Fayl turi qo'llab-quvvatlanmaydi!",
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  },
};
