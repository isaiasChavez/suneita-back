import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sesion } from "./sesion.entity";
// import { User } from "../user/user.model";
// import { Configuration } from "../configuration/configuration.entity";
import {
    ReuestSesionDTO,
    UpdatePlayerID,
    ReuestSesionLogOutDTO,
} from "./sesion.dto";
import * as bcrypt from "bcrypt";
import * as moment from "moment";
import { Types } from '../../../types'
import { Type } from "../type/type.entity";
import { User } from "../user/user.entity";
import { Admin } from "../user/admin.entity";
import { SuperAdmin } from "../user/superadmin.entity";
@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        @InjectRepository(Type) private typeRepository: Repository<Type>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(SuperAdmin) private superAdminRepository: Repository<SuperAdmin>,
        // @InjectRepository(Configuration)
        // private configurationRepository: Repository<Configuration>,

    ) {
        this.types = {
            ADMIN: "ADMIN",
            SUPERADMIN: "SUPERADMIN",
            USER: "USER"
        }
    }
    types: Types

    async RequesLogin(requestDTO: ReuestSesionDTO): Promise<any> {
        try {
            let response = null;

            let user: Admin | SuperAdmin
            const type = await this.typeRepository.findOne(requestDTO.type)
            if (type.name === this.types.ADMIN) {
                user = await this.adminRepository.findOne({
                    relations: [
                        "type", 'users'
                    ],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
            if (type.name === this.types.SUPERADMIN) {
                user = await this.superAdminRepository.findOne({
                    relations: [
                        "type", 'admins'
                    ],
                    where: { email: requestDTO.email, isActive: true },
                });
            }

            if (!user) {
                return {
                    status: 1,
                    msg: "user does't exist"
                }
            }

            const match = await bcrypt.compare(requestDTO.password, user.password);

            if (match) {
                let sesionExist: Sesion
                if (type.name === this.types.ADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { admin: user },
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { superadmin: user },
                    });
                }


                if (sesionExist) {
                    await this.sesionRepository.remove(sesionExist);
                }

                let sesion
                if (type.name === this.types.ADMIN) {
                    sesion = this.sesionRepository.create({
                        admin: user,
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    sesion = this.sesionRepository.create({
                        superadmin: user,
                    });
                }


                let childrens: User[] | Admin[]

                if (type.name === this.types.ADMIN) {
                    childrens = await this.userRepository.find({
                        select: ["name", "lastname", "avatar", "uuid", "isActive"],
                        where: {
                            admin: user,
                            isActive: true
                        },
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    childrens = await this.adminRepository.find({
                        select: ["name", "lastname", "avatar", "uuid", "isActive"],
                        where: {
                            superadmin: user
                        },
                    });
                }

                const loggedUser = await this.sesionRepository.save(sesion);

                response = {
                    profile: {
                        token: loggedUser.id,
                        name: user.name,
                        lastname: user.lastname,
                        email: user.email,
                        type: user.type.id,
                        uuid: user.uuid,
                        childrens,
                    },
                    status: 0
                };
            } else {
                response = { status: 2, msg: "pass doesn't match" };
            }

            return response;
        } catch (err) {
            console.log("SesionService - RequesLogin: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error requesting login",
                },
                500
            );
        }
    }


    async RequesLogout(
        reuestSesionLogOutDTO: ReuestSesionLogOutDTO
    ): Promise<any> {
        // try {
        //     let response = null;
        //     const user = await this.userRepository.findOne({
        //         where: { email: reuestSesionLogOutDTO.email },
        //     });

        //     if (user) {
        //         let actualSesion = await this.sesionRepository.findOne({
        //             where: { user: user },
        //         });

        //         await this.sesionRepository.remove(actualSesion);

        //         response = { status: 0 };
        //     } else {
        //         response = { status: 1 };
        //     }

        //     return response;
        // } catch (err) {
        //     console.log("SesionService - RequesLogout: ", err);

        //     throw new HttpException(
        //         {
        //             status: HttpStatus.INTERNAL_SERVER_ERROR,
        //             error: "Error requesting logout",
        //         },
        //         500
        //     );
        // }
    }



}
