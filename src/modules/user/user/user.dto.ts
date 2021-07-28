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

export class UserDTO {
  constructor({ email,uuid, name,avatar,isActive,lastname }) {
    this.email = email;
    this.avatar = avatar;
    this.isActive = isActive;
    this.name = name
    this.uuid=uuid
    this.lastname = lastname
  }
  isActive:boolean
  lastname: string
  avatar: string
  name: string
  uuid: string
  email: string;
}


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

export class FindUserChildrens {
  constructor({
    adminUuid,
    superAdminUuid,
    type
  }) {
    this.adminUuid = adminUuid;
    this.superAdminUuid = superAdminUuid;
    this.type = type
  }

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuid: string;
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  superAdminUuid: string;
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
export class SimpleRequest {
  constructor({
    adminUuid,
    superAdminUuid,
    type
  }) {
    this.adminUuid = adminUuid;
    this.superAdminUuid = superAdminUuid;
    this.type = type
  }

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuid: string;
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  superAdminUuid: string;
  @IsNumber()
  @IsNotEmpty()
  type: number;
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

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  superAdminUuid: string;

  @IsString()
  @MaxLength(100)
  name: string;
  @IsString()
  @MaxLength(150)
  avatar: string;
  
  @IsString()
  @MaxLength(150)
  thumbnail: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string;
}

export class DeleteAdminUserDTO {
  constructor({ superAdminUuid, adminUuidToStop, status }) {
    this.superAdminUuid = superAdminUuid;
    this.adminUuidToStop = adminUuidToStop;
    this.status = status;
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  superAdminUuid: number;
  
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuidToStop: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;

}

export class DeleteUserDTO {
  constructor({ adminUuid,superAdminUuid,type, userUuidToChange,status }) {
    this.userUuidToChange = userUuidToChange;
    this.adminUuid = adminUuid;
    this.status = status;
    this.type=type
    this.superAdminUuid=superAdminUuid
  }
  @IsUUID()
  @IsOptional()
  @IsString()
  superAdminUuid: number;
  @IsUUID()
  @IsOptional()
  @IsString()
  adminUuid: number;
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userUuidToChange: number;
  @IsOptional()
  @IsBoolean()
  status: boolean;
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
