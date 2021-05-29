import { Controller, Post, Req, Res, Param } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {

    constructor(private readonly uploadService: UploadService) { }

    @Post(':folder')
    async create(@Param('folder') folder, @Req() request, @Res() response) {
        try {
            await this.uploadService.fileupload(request, response, folder);
        } catch (error) {
            return response
                .status(500)
                .json(`Failed to upload image file: ${error.message}`);
        }
    }
}
