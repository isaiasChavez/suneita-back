export class InviteUserDTO {
    readonly email: string;
    readonly type: number;
}


export class ResetPassword {
    readonly email: string;
}

export class ConfirmUserPassword {
    readonly email: string;
    readonly password: string;
}

export class PasswordRecovery {
    readonly email: string;
    readonly password: string;
    readonly token: string;
}

export class CreateUserDTO {
    readonly type: number;
    readonly name: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly gender: boolean;
    readonly email: string;
    readonly photo: string;
    readonly birthDate: string;
    readonly password: string;
    readonly phone: string;
    readonly postalCode: string;

    readonly state: number; //Estado
    readonly city: number; //Municipio
    readonly street: string; //Calle
    readonly inner_number: number; //número interior
    readonly outdoor_number: number;//número exterior
    readonly mayoralty: string; //Colonia
    readonly userToken: string;
}
export class UpdateUserDTO {

    readonly userId: number;
    readonly name: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly gender: boolean;
    readonly email: string;
    readonly photo: string;
    readonly birthDate: string;
    readonly password: string;
    readonly postalCode: string;
    readonly phone: string;

    readonly state: number; //Estado
    readonly city: number; //Municipio
    readonly street: string; //Calle
    readonly inner_number: number; //número interior
    readonly outdoor_number: number;//número exterior
    readonly mayoralty: string; //Colonia

    readonly userToken: string;
}









