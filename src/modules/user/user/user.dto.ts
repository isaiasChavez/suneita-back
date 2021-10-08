import { Optional } from '@nestjs/common'

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
} from 'class-validator'

export class UserDTO {
  constructor ({ email, uuid, name, avatar, isActive, lastname, status }) {
    this.email = email
    this.avatar = avatar
    this.isActive = isActive
    this.name = name
    this.uuid = uuid
    this.lastname = lastname
    this.status = status.id
  }
  isActive: boolean
  lastname: string
  avatar: string
  name: string
  uuid: string
  email: string
  status: number
}

export interface ResponseProfile {
  id: number
  name: string
  uuid: string
  lastname: string
  thumbnail: string
  email: string
  type: number
  roomImage: string
  lastSuscription: {
    invitations: number
  }
}

export class InviteAdminDTO {
  constructor ({ email, type }) {
    this.email = email
    this.type = type
  }
  @IsUUID()
  @IsNotEmpty()
  superAdminUuid: number
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsNumber()
  @IsNotEmpty()
  type: number
}
export class SimpleRequest {
  constructor ({ adminUuid, superAdminUuid, userUuid, type }) {
    this.adminUuid = adminUuid
    this.superAdminUuid = superAdminUuid
    this.userUuid = userUuid
    this.type = type
  }

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuid: string
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  userUuid: string
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  superAdminUuid: string
  @IsNumber()
  @IsNotEmpty()
  type: number
}

export class InviteUserDTO extends SimpleRequest {
  constructor ({
    userUuid,
    adminUuid,
    superAdminUuid,
    type,
    company,
    name,
    invitations,
    cost,
    startedAt,
    finishedAt,
    email,
    typeToInvite,
  }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.company = company
    this.email = email
    this.name = name
    this.invitations = parseInt(invitations)
    this.cost = parseFloat(cost)
    this.startedAt = startedAt
    this.finishedAt = finishedAt
    this.typeToInvite = typeToInvite
  }
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  @MaxLength(250)
  company: string
  @MaxLength(250)
  @IsOptional()
  @IsString()
  name: string
  @IsOptional()
  @IsNumber()
  invitations: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost: number

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  startedAt: string

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  finishedAt: string

  @IsNumber()
  @IsNotEmpty()
  typeToInvite: number
}

export class FindUserChildrens {
  constructor ({ adminUuid, superAdminUuid, type }) {
    this.adminUuid = adminUuid
    this.superAdminUuid = superAdminUuid
    this.type = type
  }

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuid: string
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  superAdminUuid: string
  @IsNumber()
  @IsNotEmpty()
  type: number
}

export class ChangeName extends SimpleRequest {
  constructor ({ adminUuid, superAdminUuid, userUuid, type, name }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.name = name
  }
  @IsNotEmpty()
  @IsString()
  name: string
}
export class ConfirmUserPassword {
  constructor ({ email, password }) {
    this.email = email
    this.password = password
  }
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string
}

export class SetSesionAppId extends SimpleRequest {
  constructor ({ adminUuid, superAdminUuid, userUuid, type, playerId }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.playerId = playerId
  }
  @IsString()
  @IsNotEmpty()
  playerId: string
}

export class CreateSuperAdminDTO {
  constructor ({ name, lastname, email, password, passwordmaster }) {
    this.name = name
    this.lastname = lastname
    this.email = email
    this.passwordmaster = passwordmaster
    this.password = password
  }
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  passwordmaster: string
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string
}
export class UpdateUserAdminDTO extends SimpleRequest {
  constructor ({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    name,
    lastname,
    startedAt,
    finishedAt,
    cost,
    business,
    adminUuidToUpdate,
  }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.name = name ? name : null
    this.lastname = lastname ? lastname : null
    this.startedAt = startedAt ? startedAt : null
    this.finishedAt = finishedAt ? finishedAt : null
    this.cost = cost ? cost : null
    this.business = business ? business : null
    this.adminUuidToUpdate = adminUuidToUpdate
  }
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string | null

  @IsOptional()
  @MaxLength(100)
  @IsString()
  lastname: string | null

  @IsOptional()
  @IsString()
  @MaxLength(200)
  business: string | null

  @IsOptional()
  @IsDateString()
  @IsString()
  startedAt: string | null

  @IsOptional()
  @IsString()
  @IsDateString()
  finishedAt: string | null

  @IsOptional()
  @IsNumber()
  cost: number

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuidToUpdate: string
}
export class UpdateGuestDTO extends SimpleRequest {
  constructor ({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    name,
    lastname,
    startedAt,
    finishedAt,
    cost,
    userUuidToUpdate,
  }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.name = name
    this.lastname = lastname
    this.startedAt = startedAt
    this.finishedAt = finishedAt
    this.cost = parseFloat(cost)
    this.userUuidToUpdate = userUuidToUpdate
  }
  @IsOptional()
  @IsString()
  name: string
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastname: string
  @IsOptional()
  @IsDateString()
  @IsString()
  startedAt: string | null
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  finishedAt: string
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost: number
  @IsUUID()
  @IsNotEmpty()
  userUuidToUpdate: string
}
export class UpdateUserDTO extends SimpleRequest {
  constructor ({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    name,
    avatar,
    thumbnail,
    roomImage,
  }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.name = name
    this.avatar = avatar
    this.thumbnail = thumbnail
    this.roomImage = roomImage
  }
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  avatar: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  thumbnail: string
  @IsOptional()
  @IsString()
  roomImage: string
}


export class CreatePublicationDTO extends SimpleRequest {
  constructor ({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    name,
    avatar,
    thumbnail,
    roomImage,
  }) {
    super({ adminUuid, superAdminUuid, userUuid, type })
    this.name = name
    this.avatar = avatar
    this.thumbnail = thumbnail
    this.roomImage = roomImage
  }
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  avatar: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  thumbnail: string
  @IsOptional()
  @IsString()
  roomImage: string
}



export class DeleteAdminUserDTO {
  constructor ({ superAdminUuid, adminUuidToStop, status }) {
    this.superAdminUuid = superAdminUuid
    this.adminUuidToStop = adminUuidToStop
    this.status = status
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  superAdminUuid: number

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuidToStop: number

  @IsOptional()
  @IsBoolean()
  status: boolean
}
export class GetUserDetailDTO {
  constructor ({ adminUuid, superAdminUuid, type, userUuidToGet }) {
    this.adminUuid = adminUuid
    this.userUuidToGet = userUuidToGet
    this.type = type
    this.superAdminUuid = superAdminUuid
  }
  @IsUUID()
  @IsOptional()
  @IsString()
  superAdminUuid: number
  @IsUUID()
  @IsOptional()
  @IsString()
  adminUuid: number
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userUuidToGet: number
  @IsNumber()
  @IsNotEmpty()
  type: number
}

export class GetAdminDetailDTO {
  constructor ({ adminUuid, superAdminUuid, type, adminUuidToGet }) {
    this.superAdminUuid = superAdminUuid
    this.adminUuid = adminUuid
    this.adminUuidToGet = adminUuidToGet
    this.type = type
  }
  @IsUUID()
  @IsOptional()
  @IsString()
  superAdminUuid: number
  @IsUUID()
  @IsOptional()
  @IsString()
  adminUuid: number
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  adminUuidToGet: number
  @IsNumber()
  @IsNotEmpty()
  type: number
}

export class DeleteUserDTO extends SimpleRequest {
  constructor ({
    adminUuid,
    superAdminUuid,
    userUuid,
    type,
    userUuidToChange,
    status,
  }) {
    super({ adminUuid, superAdminUuid, type, userUuid })
    this.userUuidToChange = userUuidToChange
    this.status = status
  }
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userUuidToChange: number
  @IsOptional()
  @IsBoolean()
  status: boolean
}
