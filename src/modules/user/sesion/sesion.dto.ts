import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { SimpleRequest } from '../user/user.dto';

export class ReuestSesionDTO {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
export class ResetPassword {
  constructor({ email }) {
    this.email = email;
  }
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}



export interface SendEmailInfoProps {
  surname: string;
  name:string,
  email: string;
  company: string;
  phone: string;
};

export class SendEmailInfo implements SendEmailInfoProps{
  constructor({name,surname,company,email,phone}:SendEmailInfoProps) {
    this.name= name
    this.surname = surname
    this.company = company
    this.email = email
    this.phone = phone
  } 

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly surname: string;
  @IsString()
  @IsNotEmpty()
  readonly company: string;
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}


export class PasswordRecovery {
  constructor({ password, token }) {
    this.password = password;
    this.token = token;
  }

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ReuestSesionLogOutDTO extends SimpleRequest {
  constructor({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    isFromCMS,
  }) {
    super({adminUuid,
      superAdminUuid,
      userUuid,
      type})
    this.isFromCMS = isFromCMS;
    
  }
  readonly email: string;
  readonly isFromCMS: boolean;
}

export class SesionTokenDTO {
  usuario: {
    uuid: string;
    type: number;
  };
}

export class CreateAdminDTO {
  constructor({
    name,
    lastname,
    email,
    password,
  }) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}

export class CreateUserDTO {
  constructor({ name, lastname, email, password }) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(100)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}