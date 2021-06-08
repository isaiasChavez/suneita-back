import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { UpdateSuscriptionDTO } from './suscription.dto';
import { Suscription } from './suscription.entity';
export declare class SuscriptionService {
    private adminRepository;
    private suscriptionRepository;
    constructor(adminRepository: Repository<Admin>, suscriptionRepository: Repository<Suscription>);
    update(updateSuscriptionDTO: UpdateSuscriptionDTO): Promise<any>;
    delete(userId: number): Promise<any>;
}
