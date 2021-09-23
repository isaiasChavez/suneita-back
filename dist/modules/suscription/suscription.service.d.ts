import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { User } from '../user/user/user.entity';
import { AddNewSuscriptionSuscriptionDTO, UpdateSuscriptionDTO } from './suscription.dto';
import { Suscription } from './suscription.entity';
interface CanAddMoreSuscriptions {
    suscription: Suscription;
    admin: Admin;
}
export declare class SuscriptionService {
    private adminRepository;
    private userRepository;
    private suscriptionRepository;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, suscriptionRepository: Repository<Suscription>);
    update(suscription: Suscription, updateSuscriptionDTO: UpdateSuscriptionDTO, user: Admin | User, isAdmin: boolean, isGuest: boolean): Promise<any>;
    delete(userId: number): Promise<any>;
    getStatusSuscription({ suscription }: {
        suscription: Suscription;
    }): Promise<{
        isExpired: boolean;
    }>;
    canAddMoreSuscriptions({ suscription, admin }: CanAddMoreSuscriptions): Promise<{
        canAdd: boolean;
    }>;
    add(newSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any>;
}
export {};
