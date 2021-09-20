import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    create(folder: any, request: any, response: any): Promise<any>;
}
