/// <reference types="qs" />
/// <reference types="express" />
import * as AWS from 'aws-sdk';
import { ConfigService } from 'src/config/config.service';
export declare class UploadService {
    private readonly _configService;
    constructor(_configService: ConfigService);
    s3: AWS.S3;
    fileupload(req: any, res: any, folder: string): Promise<any>;
    uploadImage: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadImage360: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadVideo: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadVideo360: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadUser: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadRoom: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
