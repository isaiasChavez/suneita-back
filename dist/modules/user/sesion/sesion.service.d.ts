import { Repository } from "typeorm";
import { Sesion } from "./sesion.entity";
import { ReuestSesionDTO, ReuestSesionLogOutDTO } from "./sesion.dto";
import { Types } from '../../../types';
import { Type } from "../type/type.entity";
import { User } from "../user/user.entity";
import { Admin } from "../user/admin.entity";
import { SuperAdmin } from "../user/superadmin.entity";
export declare class SesionService {
    private sesionRepository;
    private typeRepository;
    private userRepository;
    private adminRepository;
    private superAdminRepository;
    constructor(sesionRepository: Repository<Sesion>, typeRepository: Repository<Type>, userRepository: Repository<User>, adminRepository: Repository<Admin>, superAdminRepository: Repository<SuperAdmin>);
    types: Types;
    jwtService: any;
    token: string;
    RequesLogin(requestDTO: ReuestSesionDTO): Promise<any>;
    RequesLogout(reuestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
}
