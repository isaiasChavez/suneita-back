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
export declare class ReuestSesionLogOutDTO {
    readonly email: string;
}
export declare class SesionTokenDTO {
    usuario: {
        uuid: string;
        type: number;
    };
}
