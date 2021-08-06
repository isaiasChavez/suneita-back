import { Injectable, Res, Req } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import s3Storage = require('multer-sharp-s3');
import { Configuration } from '../config/config.keys';
import { ConfigService } from 'src/config/config.service';


@Injectable()
export class UploadService {
  constructor(private readonly _configService: ConfigService) {

    this._configService.get=this._configService.get.bind(this)
  }

  s3=new AWS.S3({
    endpoint: this._configService.get(Configuration.S3_ENDPOINT),
    accessKeyId: this._configService.get(Configuration.AWS_ACCESS_KEY),
    secretAccessKey: this._configService.get(Configuration.AWS_SECRET_ACCESS_KEY),
  });

  async fileupload(@Req() req, @Res() res, folder: string) {
    try {
      switch (folder) {
        case '1':
          this.uploadImage(req, res,  (error)=> {
            if (error) {
              console.log(error);
              return res
                .status(404)
                .json(`Failed to upload pdf file: ${error}`);
            }
            let urlToReturn = req.files[0].location;
            urlToReturn = urlToReturn.substring(
              urlToReturn.indexOf('/image/'),
              urlToReturn.lenght,
            );
            return res
              .status(201)
              .json(
                'https://ocupath.fra1.digitaloceanspaces.com' +
                  urlToReturn,
              );
          });
          break;
        case '2':
          this.uploadImage360(req, res,  (error)=> {
            if (error) {
              console.log(error);
              return res
                .status(404)
                .json(`Failed to upload image file: ${error}`);
            }
            let urlToReturn = req.files[0].location;
            urlToReturn = urlToReturn.substring(
              urlToReturn.indexOf('/image360/'),
              urlToReturn.lenght,
            );
            return res
              .status(201)
              .json(
                'https://ocupath.fra1.digitaloceanspaces.com' +
                  urlToReturn,
              );
          });
          break;
        case '3':
          this.uploadVideo(req, res,  (error)=> {
            if (error) {
              console.log(error);
              return res
                .status(404)
                .json(`Failed to upload image file: ${error}`);
            }
            let urlToReturn = req.files[0].location;
            urlToReturn = urlToReturn.substring(
              urlToReturn.indexOf('/video/'),
              urlToReturn.lenght,
            );
            return res
              .status(201)
              .json(
                'https://ocupath.fra1.digitaloceanspaces.com' +
                  urlToReturn,
              );
          });
          break;
        case '4':
          this.uploadVideo360(req, res,  (error)=> {
            if (error) {
              console.log('req.files:', req.files);
              console.log('Multer Error:', error);
              return res
                .status(404)
                .json(`Failed to upload image file: ${error}`);
            }

            let urlToReturn = req.files[0].location;
            urlToReturn = urlToReturn.substring(
              urlToReturn.indexOf('/video360/'),
              urlToReturn.lenght,
            );
            return res
              .status(201)
              .json(
                'https://ocupath.fra1.digitaloceanspaces.com' +
                  urlToReturn,
              );
          });
          break;
        case '5':
          this.uploadUser(req, res,  (error)=> {
            if (error) {
              console.log(error);
              return res
                .status(404)
                .json(`Failed to upload image file: ${error}`);
            }
            // console.log("ASSETS: ", req.files);
            let urlToReturn = req.files[0].Location;
            urlToReturn = urlToReturn.substring(
              urlToReturn.indexOf('/users/'),
              urlToReturn.lenght,
            );
            return res
              .status(201)
              .json(
                'https://ocupath.fra1.digitaloceanspaces.com' +
                  urlToReturn,
              );
          });
          break;
        default:
          console.log('default');
          break;
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  uploadImage = multer({
    storage: multerS3({
      s3: this.s3,
      bucket: this._configService.get(Configuration.BUCKET_NAME),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(
          null,
          `image/${Date.now().toString()}-${file.originalname.replace(
            /\s+/g,
            '',
          )}`,
        );
      },
    }),
  }).array('upload', 1);

  uploadImage360 = multer({
    storage: multerS3({
      s3: this.s3,
      bucket: this._configService.get(Configuration.BUCKET_NAME),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(
          null,
          `image360/${Date.now().toString()}-${file.originalname.replace(
            /\s+/g,
            '',
          )}`,
        );
      },
    }),
  }).array('upload', 1);

  uploadVideo = multer({
    storage: multerS3({
      s3: this.s3,
      bucket: this._configService.get(Configuration.BUCKET_NAME),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(
          null,
          `video/${Date.now().toString()}-${file.originalname.replace(
            /\s+/g,
            '',
          )}`,
        );
      },
    }),
  }).array('upload', 1);

  uploadVideo360 = multer({
    storage: multerS3({
      s3: this.s3,
      bucket: this._configService.get(Configuration.BUCKET_NAME),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(
          null,
          `video360/${Date.now().toString()}-${file.originalname.replace(
            /\s+/g,
            '',
          )}`,
        );
      },
    }),
  }).array('upload');

  uploadUser = multer({
    storage: s3Storage({
      s3: this.s3,
      Bucket: this._configService.get(Configuration.BUCKET_NAME),
      // contentType: multerS3.AUTO_CONTENT_TYPE,
      ACL: 'public-read',
      Key: function (request, file, cb) {
        cb(
          null,
          `users/${Date.now().toString()}-${file.originalname.replace(
            /\s+/g,
            '',
          )}`,
        );
      },
      resize: {
        width: 200,
        height: 200,
      },
    }),
  }).array('upload', 1);
}
