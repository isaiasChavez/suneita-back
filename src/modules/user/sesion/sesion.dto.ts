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


export class ReuestSesionLogOutDTO {
    readonly email: string;
}

export class SesionTokenDTO {
    usuario: {
        uuid: string;
        type: number;
    }
}
