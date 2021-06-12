export declare class ReuestSesionDTO {
    constructor({ email, password, type }: {
        email: any;
        password: any;
        type: any;
    });
    email: string;
    password: string;
    type: number;
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
