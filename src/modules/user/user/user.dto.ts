
import { IsEmail, IsNotEmpty, IsNumber, IsString, isUUID, IsUUID, MaxLength } from 'class-validator';

export class InviteUserDTO {
    constructor({ email, type }) {
        this.email = email
        this.type = type
    }
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNumber()
    @IsNotEmpty()
    type: number;
}


export class ResetPassword {
    constructor({ email }) {
        this.email = email
    }
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ConfirmUserPassword {
    constructor({ email, password }) {
        this.email = email
        this.password = password
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

export class PasswordRecovery {
    constructor({ email, password, token }) {
        this.email = email
        this.password = password
        this.token = token
    }
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string;
    @IsString()
    @IsNotEmpty()
    token: string;

}
export class CreateSuperAdminDTO {
    constructor({ name, lastname, email, password }) {
        this.name = name;
        this.lastname = lastname
        this.email = email
        this.password = password
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
    @MaxLength(100)
    email: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string;
}

export class CreateAdminDTO {
    constructor({ type, superAdmin, name, lastname, email, password }) {
        this.type = type
        this.superAdminUuid = superAdmin
        this.name = name;
        this.lastname = lastname
        this.email = email
        this.password = password
    }
    @IsUUID()
    @IsNotEmpty()
    superAdminUuid: number;
    @IsNumber()
    @IsNotEmpty()
    type: number;
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
    constructor({ type, adminUuid, name, lastname, email, password }) {
        this.type = type
        this.adminUuid = adminUuid
        this.name = name;
        this.lastname = lastname
        this.email = email
        this.password = password
    }

    @IsUUID()
    @IsNotEmpty()
    adminUuid: number;
    @IsNumber()
    @IsNotEmpty()
    type: number;
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

export class UpdateUserAdminDTO {
    constructor({ adminUuid, name, lastname, email, password }) {
        this.adminUuid = adminUuid
        this.name = name;
        this.lastname = lastname
        this.email = email
        this.password = password
    }

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: number;
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




export class UpdateUserDTO {
    constructor({ userUuid, adminUuid, name, lastname, email, password }) {
        this.userUuid = userUuid
        this.adminUuid = adminUuid
        this.name = name;
        this.lastname = lastname
        this.email = email
        this.password = password
    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    userUuid: number;
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: number;
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



export class DeleteAdminUserDTO {
    constructor({ superAdminUuid, adminUuid }) {
        this.superAdminUuid = superAdminUuid
        this.adminUuid = adminUuid
    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    superAdminUuid: number;
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: number;

}

export class DeleteUserDTO {
    constructor({ adminUuid, userUuid }) {
        this.userUuid = userUuid
        this.adminUuid = adminUuid
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








