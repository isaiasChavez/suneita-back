import { IsEmail, IsNotEmpty, isNumber, IsNumber, IsString, IsUUID, MaxLength } from "class-validator";

export class ReuestSesionDTO {
    constructor({ email, password, type }) {
        this.email = email
        this.password = password
        this.type = type
    }
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string;
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

export class PasswordRecovery {
    constructor({ password, token }) {
        this.password = password
        this.token = token
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
    }
}
