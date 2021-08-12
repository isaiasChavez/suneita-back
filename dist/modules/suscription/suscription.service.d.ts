import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { User } from '../user/user/user.entity';
import { AddNewSuscriptionSuscriptionDTO, UpdateSuscriptionDTO } from './suscription.dto';
import { Suscription } from './suscription.entity';
export declare class SuscriptionService {
    private adminRepository;
    private suscriptionRepository;
    constructor(adminRepository: Repository<Admin>, suscriptionRepository: Repository<Suscription>);
    update(suscription: Suscription, updateSuscriptionDTO: UpdateSuscriptionDTO, user: Admin | User, isAdmin: boolean, isGuest: boolean): Promise<any>;
    delete(userId: number): Promise<any>;
    add(newSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any>;
}
