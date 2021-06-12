import { SesionService } from './sesion.service';
import { PasswordRecovery, ReuestSesionDTO, ReuestSesionLogOutDTO } from './sesion.dto';
export declare class SesionController {
    private sesionService;
    constructor(sesionService: SesionService);
    Login(reuestSesionDTO: ReuestSesionDTO): Promise<any>;
    recoveryPassword(passwordRecovery: PasswordRecovery): Promise<any>;
    requestPasswordReset(email: any): Promise<any>;
    Logout(requestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
    Decifring(token: string): Promise<any>;
}
