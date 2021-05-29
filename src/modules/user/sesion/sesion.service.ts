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

@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        // @InjectRepository(User) private userRepository: Repository<User>,
        // @InjectRepository(Configuration)
        // private configurationRepository: Repository<Configuration>,

    ) { }

    async RequesLogin(requestDTO: ReuestSesionDTO): Promise<any> {
        // try {
        //     let response = null;
        //     let user = await this.userRepository.findOne({
        //         relations: [
        //             "type",
        //             "chain",
        //             "clinic",
        //             "business",
        //             "city",
        //             "delegation",
        //             "position",
        //         ],
        //         where: { email: requestDTO.email, isActive: true },
        //     });
        //     if (user) {

        //         const match = await bcrypt.compare(requestDTO.password, user.password);

        //         if (match) {
        //             const sesionExist = await this.sesionRepository.findOne({
        //                 where: { user: user },
        //             });

        //             if (sesionExist) {
        //                 await this.sesionRepository.remove(sesionExist);
        //             }

        //             const sesion = this.sesionRepository.create({
        //                 user: user,
        //             });

        //             // const userNotifications = await this.notificationRepository
        //             //     .createQueryBuilder("not")
        //             //     .select(["not.id"])
        //             //     .innerJoin("not.user", "user", "user.email = :email", {
        //             //         email: requestDTO.email,
        //             //     })
        //             //     .orderBy("not.id", "DESC")
        //             //     .limit(10)
        //             //     .getMany();

        //             const loggedUser = await this.sesionRepository.save(sesion);
        //             // const generalConfiguration = await this.configurationRepository.findOne(
        //             //     1
        //             // );
        //             response = {
        //                 profile: {
        //                     token: loggedUser.id,
        //                     name: user.name,
        //                     lastName: user.lastName,
        //                     email: user.email,
        //                     type: user.type.id,
        //                 },
        //             };
        //         } else {
        //             response = { status: 2 };
        //         }
        //     } else {
        //         response = { status: 1 };
        //     }

        //     return response;
        // } catch (err) {
        //     console.log("SesionService - RequesLogin: ", err);

        //     throw new HttpException(
        //         {
        //             status: HttpStatus.INTERNAL_SERVER_ERROR,
        //             error: "Error requesting login",
        //         },
        //         500
        //     );
        // }
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

    async RequesLoginAdmin(requestDTO: ReuestSesionDTO): Promise<any> {
        // try {
        //     let response = null;
        //     const user = await this.userRepository.findOne({
        //         // relations: ["role"],
        //         select: ["id", "email", "password", "name", "lastName"],
        //         where: { email: requestDTO.email, role: 1 },
        //     });

        //     if (user) {
        //         const match = await bcrypt.compare(requestDTO.password, user.password);

        //         if (match) {
        //             const sesionExist = await this.sesionRepository.findOne({
        //                 where: { user: user },
        //             });

        //             if (sesionExist) {
        //                 await this.sesionRepository.remove(sesionExist);
        //             }

        //             const sesion = this.sesionRepository.create({
        //                 user: user,
        //             });

        //             const loggedUser = await this.sesionRepository.save(sesion);
        //             const completeName =
        //                 user.name.split(" ")[0] + " " + user.lastName.split(" ")[0];

        //             response = {
        //                 profile: {
        //                     token: loggedUser.id,
        //                     name: completeName,
        //                     email: user.email,
        //                 },
        //             };
        //         } else {
        //             response = { status: 2 };
        //         }
        //     } else {
        //         response = { status: 1 };
        //     }

        //     return response;
        // } catch (err) {
        //     console.log("SesionService - RequesLoginAdmin: ", err);

        //     throw new HttpException(
        //         {
        //             status: HttpStatus.INTERNAL_SERVER_ERROR,
        //             error: "Error requesting login",
        //         },
        //         500
        //     );
        // }
    }

}
