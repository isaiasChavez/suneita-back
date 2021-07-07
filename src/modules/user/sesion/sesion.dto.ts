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

export class ReuestSesionLogOutDTO {
  readonly email: string;
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