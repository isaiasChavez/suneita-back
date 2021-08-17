import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import { ReuestSesionDTO, ReuestSesionLogOutDTO, PasswordRecovery, CreateAdminDTO, CreateUserDTO } from './sesion.dto';
import { Types, Roles, TypesNumbers } from '../../../types';
import { Type } from '../type/type.entity';
import { User } from '../user/user.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { Token } from '../token/token.entity';
import { Invitation } from '../invitation/invitation.entity';
import { Role } from '../role/role.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Asset } from 'src/modules/asset/asset.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { Status } from '../status/status.entity';
export declare class SesionService {
    private readonly mailerService;
    private readonly userService;
    private sesionRepository;
    private typeRepository;
    private userRepository;
    private suscriptionRepository;
    private adminRepository;
    private roleRepository;
    private statusRepository;
    private assetRepository;
    private superAdminRepository;
    private tokenRepository;
    private invitationRepository;
    constructor(mailerService: MailerService, userService: UserService, sesionRepository: Repository<Sesion>, typeRepository: Repository<Type>, userRepository: Repository<User>, suscriptionRepository: Repository<Suscription>, adminRepository: Repository<Admin>, roleRepository: Repository<Role>, statusRepository: Repository<Status>, assetRepository: Repository<Asset>, superAdminRepository: Repository<SuperAdmin>, tokenRepository: Repository<Token>, invitationRepository: Repository<Invitation>);
    types: Types;
    typesNumbers: TypesNumbers;
    roles: Roles;
    jwtService: any;
    token: string;
    RequesLogin(requestDTO: ReuestSesionDTO): Promise<any>;
    RequesLoginFromApp(requestDTO: ReuestSesionDTO): Promise<any>;
    RequesLogout(reuestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
    decifreToken(token: string): Promise<any>;
    validateIfExistToken(token: string): Promise<any>;
    passwordRecovery(requestDTO: PasswordRecovery): Promise<any>;
    requestPasswordReset(requestEmail: string): Promise<any>;
    getWhoIsRequesting(email: string): Promise<{
        isAdmin: boolean;
        isSuperAdmin: boolean;
        isGuest: boolean;
        user: SuperAdmin | Admin | User;
    }>;
    checkExpiredSuscriptions(user: Admin | User | SuperAdmin, isAdmin: boolean, isGuest: boolean): Promise<{
        hasSuscriptionActiveExpired: boolean;
        currentSuscriptionActive: Suscription;
        currentSuscriptionWaiting: Suscription | null;
    }>;
    createAdmin(createAdminDTO: CreateAdminDTO): Promise<any>;
    createGuest(createUserDTO: CreateUserDTO): Promise<any>;
}
