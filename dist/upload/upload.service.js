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
const AWS_S3_BUCKET_NAME = 'bioderma-space';
const s3 = new AWS.S3({
    endpoint: 'sfo2.digitaloceanspaces.com', accessKeyId: 'ZSBKUIMMILMJDX65O7UX',
    secretAccessKey: 'eK1JtgpKaFgCYUU7H3/aiRf0eNfJ+ijUrZCfTuwGdn0'
});
let UploadService = class UploadService {
    constructor() {
        this.upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: AWS_S3_BUCKET_NAME,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `capacitacion/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadProduct = multer({
            storage: multerS3({
                s3: s3,
                bucket: AWS_S3_BUCKET_NAME,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `productos/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadCampaing = multer({
            storage: multerS3({
                s3: s3,
                bucket: AWS_S3_BUCKET_NAME,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `campanas/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadBlog = multer({
            storage: multerS3({
                s3: s3,
                bucket: AWS_S3_BUCKET_NAME,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `blog/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
            }),
        }).array('upload', 1);
        this.uploadUser = multer({
            storage: s3Storage({
                s3: s3,
                Bucket: AWS_S3_BUCKET_NAME,
                ACL: 'public-read',
                Key: function (request, file, cb) {
                    cb(null, `users/${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`);
                },
                resize: {
                    width: 200,
                    height: 200,
                }
            }),
        }).array('upload', 1);
    }
    async fileupload(req, res, folder) {
        try {
            switch (folder) {
                case '1':
                    this.upload(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload pdf file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/capacitacion/"), urlToReturn.lenght);
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                case '2':
                    this.uploadProduct(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/productos/"), urlToReturn.lenght);
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                case '3':
                    this.uploadCampaing(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/campanas/"), urlToReturn.lenght);
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                case '4':
                    this.uploadBlog(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/blog/"), urlToReturn.lenght);
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                case '5':
                    this.uploadUser(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload image file: ${error}`);
                        }
                        let urlToReturn = req.files[0].Location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/users/"), urlToReturn.lenght);
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                default:
                    console.log("default");
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
    __metadata("design:paramtypes", [])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map