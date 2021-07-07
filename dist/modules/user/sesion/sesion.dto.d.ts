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
export declare class ReuestSesionLogOutDTO {
    readonly email: string;
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
