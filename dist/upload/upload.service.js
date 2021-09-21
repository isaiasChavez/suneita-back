"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3Storage = require("multer-sharp-s3");
const config_keys_1 = require("../config/config.keys");
const config_service_1 = require("../config/config.service");
let UploadService = class UploadService {
    constructor(_configService) {
        this._configService = _configService;
        this.s3 = new AWS.S3({
            endpoint: this._configService.get(config_keys_1.Configuration.S3_ENDPOINT),
            accessKeyId: this._configService.get(config_keys_1.Configuration.AWS_ACCESS_KEY),
            secretAccessKey: this._configService.get(config_keys_1.Configuration.AWS_SECRET_ACCESS_KEY),
        });
        this.uploadImage = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `image/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadImage360 = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `image360/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadVideo = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `video/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadVideo360 = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `video360/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload');
        this.uploadUser = multer({
            storage: s3Storage({
                s3: this.s3,
                Bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                ACL: 'public-read',
                Key: function (request, file, cb) {
                    cb(null, `users/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
                resize: {
                    width: 200,
                    height: 200,
                },
            }),
        }).array('upload', 1);
        this.uploadRoom = multer({
            storage: s3Storage({
                s3: this.s3,
                Bucket: this._configService.get(config_keys_1.Configuration.BUCKET_NAME),
                ACL: 'public-read',
                Key: function (request, file, cb) {
                    cb(null, `rooms/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
                resize: {
                    width: 200,
                    height: 200,
                },
            }),
        }).array('upload', 1);
        this._configService.get = this._configService.get.bind(this);
    }
    async fileupload(req, res, folder) {
        try {
            switch (folder) {
                case '1':
                    this.uploadImage(req, res, (error) => {
                        if (error) {
                            console.log(error);
                            return res
                                .status(404)
                                .json(`Failed to upload pdf file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/image/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                case '2':
                    this.uploadImage360(req, res, (error) => {
                        if (error) {
                            console.log(error);
                            return res
                                .status(404)
                                .json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/image360/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                case '3':
                    this.uploadVideo(req, res, (error) => {
                        if (error) {
                            console.log(error);
                            return res
                                .status(404)
                                .json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/video/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                case '4':
                    this.uploadVideo360(req, res, (error) => {
                        if (error) {
                            console.log('req.files:', req.files);
                            console.log('Multer Error:', error);
                            return res
                                .status(404)
                                .json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/video360/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                case '5':
                    this.uploadUser(req, res, (error) => {
                        if (error) {
                            console.log(error);
                            return res
                                .status(404)
                                .json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].Location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/users/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                case '6':
                    this.uploadRoom(req, res, (error) => {
                        if (error) {
                            console.log(error);
                            return res
                                .status(404)
                                .json(`Failed to upload room file: ${error}`);
                        }
                        let urlToReturn = req.files[0].Location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf('/rooms/'), urlToReturn.lenght);
                        return res
                            .status(201)
                            .json('https://ocupath.fra1.digitaloceanspaces.com' +
                            urlToReturn);
                    });
                    break;
                default:
                    console.log('default');
                    break;
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }
};
__decorate([
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UploadService.prototype, "fileupload", null);
UploadService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map