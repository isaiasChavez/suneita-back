import { SimpleRequest } from '../user/user.dto';
export declare class ReuestSesionDTO {
    constructor({ email, password }: {
        email: any;
        password: any;
    });
    email: string;
    password: string;
}
export declare class ResetPassword {
    constructor({ email }: {
        email: any;
    });
    email: string;
}
export declare class PasswordRecovery {
    constructor({ password, token }: {
        password: any;
        token: any;
    });
    password: string;
    token: string;
}
export declare class ReuestSesionLogOutDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, email, isFromCMS, }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        email: any;
        isFromCMS: any;
    });
    readonly email: string;
    readonly isFromCMS: boolean;
}
export declare class SesionTokenDTO {
    usuario: {
        uuid: string;
        type: number;
    };
}
export declare class CreateAdminDTO {
    constructor({ name, lastname, email, password, }: {
        name: any;
        lastname: any;
        email: any;
        password: any;
    });
    name: string;
    lastname: string;
    email: string;
    password: string;
}
export declare class CreateUserDTO {
    constructor({ name, lastname, email, password }: {
        name: any;
        lastname: any;
        email: any;
        password: any;
    });
    name: string;
    lastname: string;
    email: string;
    password: string;
}
