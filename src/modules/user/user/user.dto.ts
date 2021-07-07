import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  isDateString,
  IsEmail,
  IsEmpty,
  isEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  isUUID,
  IsUUID,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InviteAdminDTO {
  constructor({ email, type }) {
    this.email = email;
    this.type = type;
  }
  @IsUUID()
  @IsNotEmpty()
  superAdminUuid: number;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNumber()
  @IsNotEmpty()
  type: number;
}

export class InviteUserDTO {
  constructor({
    adminUuid,
    superAdminUuid,
    company,
    name,
    invitations,
    cost,
    startedAt,
    finishedAt,
    email,
    type,
    typeToInvite,
  }) {
    this.adminUuid = adminUuid;
    this.company = company;
    this.superAdminUuid = superAdminUuid;
    this.email = email;
    this.type = type;
    this.name = name;
    this.invitations = parseInt(invitations);
    this.cost = parseFloat(cost);
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.typeToInvite = typeToInvite;
  }

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuid: string;
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  superAdminUuid: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  company: string;
  @MaxLength(250)
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  invitations: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost: number;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  startedAt: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  finishedAt: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsNumber()
  @IsNotEmpty()
  typeToInvite: number;
}

export class ConfirmUserPassword {
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

export class CreateSuperAdminDTO {
  constructor({ name, lastname, email, password, passwordmaster }) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.passwordmaster = passwordmaster;
    this.password = password;
  }
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  passwordmaster: string;
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
  @MaxLength(100)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}



export class UpdateUserAdminDTO {
  constructor({
    superAdminUuid,
    adminUuid,
    name,
    lastname,
    avatar,
    startedAt,
    finishedAt,
    cost,
    business,
  }) {
    this.superAdminUuid = superAdminUuid;
    this.adminUuid = adminUuid;
    this.name = name;
    this.lastname = lastname;
    this.avatar = avatar;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.cost = cost;
    this.business = business;
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  superAdminUuid: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuid: string;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string | null;

  @IsOptional()
  @MaxLength(100)
  @IsString()
  lastname: string | null;

  @IsOptional()
  @MaxLength(200)
  avatar: string | null;

  @IsOptional()
  @IsDateString()
  @IsString()
  startedAt: string | null;

  @IsOptional()
  @IsString()
  @IsDateString()
  finishedAt: string | null;

  @IsOptional()
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  business: string | null;
}

export class UpdateUserDTO {
  constructor({ userUuid, adminUuid, name, lastname, avatar }) {
    this.userUuid = userUuid;
    this.adminUuid = adminUuid;
    this.name = name;
    this.lastname = lastname;
    this.avatar = avatar;
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userUuid: string;
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuid: string;
  @IsString()
  @MaxLength(100)
  name: string;
  @IsString()
  @MaxLength(150)
  avatar: string;
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string;
}

export class DeleteAdminUserDTO {
  constructor({ superAdminUuid, adminUuid, status }) {
    this.superAdminUuid = superAdminUuid;
    this.adminUuid = adminUuid;
    this.status = status;
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  superAdminUuid: number;
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuid: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class DeleteUserDTO {
  constructor({ adminUuid, userUuid }) {
    this.userUuid = userUuid;
    this.adminUuid = adminUuid;
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuid: number;
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userUuid: number;
}
