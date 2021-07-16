import { Injectable, Res, Req } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import s3Storage = require("multer-sharp-s3");

const AWS_S3_BUCKET_NAME = 'bioderma-space'; // process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
    endpoint: 'sfo2.digitaloceanspaces.com', accessKeyId: 'ZSBKUIMMILMJDX65O7UX', //process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: 'eK1JtgpKaFgCYUU7H3/aiRf0eNfJ+ijUrZCfTuwGdn0' //process.env.AWS_SECRET_ACCESS_KEY, 
});

@Injectable()
export class UploadService {

    constructor() { }

    async fileupload(@Req() req, @Res() res, folder: string) {
        console.log({req,res,folder})
        try {
            switch (folder) {
                case '1':
                    this.upload(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload pdf file: ${error}`);
                        }
                        let urlToReturn = req.files[0].location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/capacitacion/"), urlToReturn.lenght)
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
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/productos/"), urlToReturn.lenght)
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
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/campanas/"), urlToReturn.lenght)
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
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/blog/"), urlToReturn.lenght)
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                case '5':
                    this.uploadUser(req, res, function (error) {
                        if (error) {
                            console.log(error);
                            return res.status(404).json(`Failed to upload image file: ${error}`);
                        }
                        // console.log("ASSETS: ", req.files);
                        let urlToReturn = req.files[0].Location;
                        urlToReturn = urlToReturn.substring(urlToReturn.indexOf("/users/"), urlToReturn.lenght)
                        return res.status(201).json("https://bioderma-space.sfo2.cdn.digitaloceanspaces.com" + urlToReturn);
                    });
                    break;
                default:
                    console.log("default");
                    break;
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }

    upload = multer({
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

    uploadProduct = multer({
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

    uploadCampaing = multer({
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

    uploadBlog = multer({
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

    uploadUser = multer({
        storage: s3Storage({
            s3: s3,
            Bucket: AWS_S3_BUCKET_NAME,
            // contentType: multerS3.AUTO_CONTENT_TYPE,
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
