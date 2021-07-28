import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import { ReuestSesionDTO, ReuestSesionLogOutDTO, PasswordRecovery, CreateAdminDTO, CreateUserDTO } from './sesion.dto';
import { Types, Roles } from '../../../types';
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
export declare class SesionService {
    private readonly mailerService;
    private sesionRepository;
    private typeRepository;
    private userRepository;
    private suscriptionRepository;
    private adminRepository;
    private roleRepository;
    private assetRepository;
    private superAdminRepository;
    private tokenRepository;
    private invitationRepository;
    constructor(mailerService: MailerService, sesionRepository: Repository<Sesion>, typeRepository: Repository<Type>, userRepository: Repository<User>, suscriptionRepository: Repository<Suscription>, adminRepository: Repository<Admin>, roleRepository: Repository<Role>, assetRepository: Repository<Asset>, superAdminRepository: Repository<SuperAdmin>, tokenRepository: Repository<Token>, invitationRepository: Repository<Invitation>);
    types: Types;
    roles: Roles;
    jwtService: any;
    token: string;
    RequesLogin(requestDTO: ReuestSesionDTO): Promise<any>;
    RequesLoginFromApp(requestDTO: ReuestSesionDTO): Promise<any>;
    RequesLogout(reuestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
    decifreToken(email: string): Promise<any>;
    passwordRecovery(requestDTO: PasswordRecovery): Promise<any>;
    requestPasswordReset(requestEmail: string): Promise<any>;
    createAdmin(createAdminDTO: CreateAdminDTO): Promise<any>;
    create(createUserDTO: CreateUserDTO): Promise<any>;
}
