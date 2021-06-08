import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { UpdateSuscriptionDTO } from './suscription.dto';
import { Suscription } from './suscription.entity';

@Injectable()
export class SuscriptionService {
    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,
    ) {
    }

    async update(updateSuscriptionDTO: UpdateSuscriptionDTO): Promise<any> {
        try {
            let admin: Admin = await this.adminRepository.findOne({
                where: {
                    uuid: updateSuscriptionDTO.adminUuid
                }
            })
            console.log({ admin })
            if (!admin) {
                return {
                    status: 1
                }
            }
            const suscription: Suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            })
            console.log({ suscription })
            if (!suscription) {
                return {
                    status: 1
                }
            }
            if (updateSuscriptionDTO.finishedAt) {
                suscription.finishedAt = new Date(updateSuscriptionDTO.finishedAt)
            }
            if (updateSuscriptionDTO.startedAt) {
                suscription.startedAt = new Date(updateSuscriptionDTO.startedAt)
            }
            if (updateSuscriptionDTO.cost) {
                suscription.cost = updateSuscriptionDTO.cost;
            }
            this.suscriptionRepository.save(suscription)


        } catch (err) {
            console.log("SuscriptionService - update: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error updating suscription",
                },
                500
            );
        }
    }
    async delete(userId: number): Promise<any> {
        try {
            let admin: Admin = await this.adminRepository.findOne(userId)
            if (!admin) {
                return {
                    status: 1
                }
            }
            const suscription: Suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            })
            if (!suscription) {
                return {
                    status: 1
                }
            }
            const susTemp = this.suscriptionRepository.create({});
            suscription.isActive = false
            suscription.isDeleted = true
            suscription.finishedAt = susTemp.createdAt
            this.suscriptionRepository.save(suscription)

        } catch (err) {
            console.log("SuscriptionService - delete: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error deleting suscription",
                },
                500
            );
        }
    }


}
