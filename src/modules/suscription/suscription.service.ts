import { HttpException,HttpStatus,Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { User } from '../user/user/user.entity';
import { AddNewSuscriptionSuscriptionDTO,UpdateSuscriptionDTO } from './suscription.dto';
import { Suscription } from './suscription.entity';
import * as moment from 'moment';


interface CanAddMoreSuscriptions {
    suscription: Suscription,
    admin: Admin
}

@Injectable()
export class SuscriptionService {
    constructor (

        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,
    ) {
    }
    async update(suscription: Suscription,updateSuscriptionDTO: UpdateSuscriptionDTO,user: Admin | User,isAdmin: boolean,isGuest: boolean): Promise<any> {
        try {

            if (!suscription) {
                suscription = await this.suscriptionRepository.findOne({
                    where: {
                        admin: isAdmin ? user : null,
                        user: isGuest ? user : null
                    }
                })
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
            console.log("SuscriptionService - update: ",err);
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
            console.log("SuscriptionService - delete: ",err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error deleting suscription",
                },
                500
            );
        }
    }
    async getStatusSuscription({ suscription }: { suscription: Suscription }): Promise<{ isExpired: boolean }> {
        try {

            let isExpired = false

            const today= new Date()
            if (moment(today).isAfter(suscription.finishedAt)) {
                isExpired = true
            }

            return {
                isExpired
            }

        } catch (err) {
            console.log('SuscriptionService - getStatusSuscription: ',err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error getting Status Suscription ',
                },
                500,
            );
        }
    }

    async canAddMoreSuscriptions({ suscription,admin }: CanAddMoreSuscriptions): Promise<{ canAdd: boolean }> {
        try {
            let canAdd = true
            const maxAvailableInvitations = suscription.invitations

            const { usersActives } = await this.userRepository
                .createQueryBuilder("user")
                .select("COUNT(user)","usersActives")
                .innerJoinAndSelect('user.admin','admin')
                .where(" user.isDeleted = false and admin.id = :id",{ id: admin.id })
                .groupBy("admin.id")
                .getRawOne();
            console.log({ usersActives })
            console.log(usersActives)

            const numberActives:number =  parseInt(usersActives)

            if (numberActives >= maxAvailableInvitations) {
                canAdd = false
            }
            console.log({ canAdd,usersActives,numberActives,admin })


            return {
                canAdd
            }



        } catch (err) {
            console.log('SuscriptionService - canAddMoreSuscriptions: ',err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error getting Status Suscription ',
                },
                500,
            );
        }
    }

    async add(newSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any> {
        try {

            // const suscription: Suscription = await this.suscriptionRepository.findOne({
            //     where: {
            //         admin
            //     }
            // })
            // if (!suscription) {
            //     return {
            //         status: 1
            //     }
            // }
            // const susTemp = this.suscriptionRepository.create({});
            // suscription.isActive = false
            // suscription.isDeleted = true
            // suscription.finishedAt = susTemp.createdAt
            // this.suscriptionRepository.save(suscription)

        } catch (err) {
            console.log("SuscriptionService - delete: ",err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error adding  suscription",
                },
                500
            );
        }
    }

}
