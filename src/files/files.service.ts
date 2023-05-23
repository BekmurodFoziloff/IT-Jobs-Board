import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import moment from 'moment';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fieldNameImages = ['avatar', 'logo', 'image', 'image1', 'image2'];
const fieldNameApplications = ['resume', 'attachedFile'];

export class FilesService {
  readonly upload: Multer;
  constructor() {
    const storage = multer.diskStorage({
      destination(req: Request, file: Express.Multer.File, callback: DestinationCallback): void {
        if (fieldNameImages.includes(file.fieldname)) {
          callback(null, path.join(__dirname, '../upload/images'));
        } else if (fieldNameApplications.includes(file.fieldname)) {
          callback(null, path.join(__dirname, '../upload/applications'));
        }
      },
      filename(req: Request, file: Express.Multer.File, callback: FileNameCallback): void {
        if (fieldNameImages.includes(file.fieldname)) {
          callback(
            null,
            file.fieldname + '_' + moment(Date.now()).format('YYYYMMDD_HHmmss') + path.extname(file.originalname)
          );
        } else if (fieldNameApplications.includes(file.fieldname)) {
          callback(
            null,
            file.fieldname + '_' + moment(Date.now()).format('YYYYMMDD_HHmmss') + path.extname(file.originalname)
          );
        }
      }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
      if (fieldNameImages.includes(file.fieldname)) {
        const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      } else if (fieldNameApplications.includes(file.fieldname)) {
        if (file.mimetype === 'application/pdf') {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    };

    this.upload = multer({
      storage,
      fileFilter
    });
  }
}
