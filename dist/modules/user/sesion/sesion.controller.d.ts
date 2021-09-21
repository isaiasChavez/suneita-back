import { SesionService } from './sesion.service';
import { CreateAdminDTO, CreateUserDTO, PasswordRecovery, ReuestSesionDTO, ReuestSesionLogOutDTO, SendEmailInfo } from './sesion.dto';
export declare class SesionController {
    private sesionService;
    constructor(sesionService: SesionService);
    Login(reuestSesionDTO: ReuestSesionDTO): Promise<any>;
    LoginFromApp(reuestSesionDTO: ReuestSesionDTO): Promise<any>;
    validating(token: string): Promise<any>;
    recoveryPassword(passwordRecovery: PasswordRecovery): Promise<any>;
    requestPasswordReset(email: any): Promise<any>;
    sendInformationForm(sendEmailInfo: SendEmailInfo): Promise<any>;
    Logout(requestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
    Decifring(email: string): Promise<any>;
    createAdmin(createAdminDTO: CreateAdminDTO): Promise<any>;
    createUser(createUserDTO: CreateUserDTO): Promise<any>;
}
