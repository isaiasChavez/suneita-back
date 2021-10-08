import {
  Injectable,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,In } from 'typeorm';

const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import {
  Roles,
  Types,
  TypesNumbers,
  Statuses,
} from 'src/types';

@Injectable()
export class UserService {
  constructor () {
    this.roles = {
      SUPERADMIN: 'SUPERADMIN',
      ADMIN: 'ADMIN',
      USER: 'USER',
    };
    this.types = {
      SUPERADMIN: 'SUPERADMIN',
      ADMIN: 'ADMIN',
      USER: 'USER',
    };
    this.typesNumbers = {
      SUPERADMIN: 1,
      ADMIN: 2,
      USER: 3,
    };
    this.statusNumbers = {
      ACTIVE: 1,
      INACTIVE: 2,
      EXPIRED: 3,
    };
  }
  roles: Roles;
  types: Types;
  statusNumbers: Statuses;
  typesNumbers: TypesNumbers;
  

  async createProduct(uuid: number): Promise<any> {
    try {
      

    } catch (err) {

      console.log('UserService - createUser: ',err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating product',
        },
        500,
      );
    }
  }

}
