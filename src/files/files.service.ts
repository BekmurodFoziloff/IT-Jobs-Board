import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import moment from 'moment';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, callback: DestinationCallback): void {
        callback(null, path.join(__dirname, '../upload/images'));
    },
    filename(req: Request, file: Express.Multer.File, callback: FileNameCallback): void {
        callback(null, moment(Date.now()).format('YYYYMMDD_HHmmss') + path.extname(file.originalname));
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg']
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

export const upload = multer({
    storage, fileFilter
})