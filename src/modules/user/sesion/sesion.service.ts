import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sesion } from "./sesion.entity";
// import { User } from "../user/user.model";
// import { Configuration } from "../configuration/configuration.entity";
import {
    ReuestSesionDTO,
    ReuestSesionLogOutDTO,
    PasswordRecovery
} from "./sesion.dto";
import * as bcrypt from "bcrypt";
import * as moment from "moment";
import { ADMIN, Types, USER_NORMAL } from '../../../types'
import { Type } from "../type/type.entity";
import { User } from "../user/user.entity";
import { Admin } from "../user/admin.entity";
import { SuperAdmin } from "../user/superadmin.entity";
import { Token } from "../token/token.entity";
const jwt = require('jsonwebtoken')
@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        @InjectRepository(Type) private typeRepository: Repository<Type>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(SuperAdmin) private superAdminRepository: Repository<SuperAdmin>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        // @InjectRepository(Configuration)
        // private configurationRepository: Repository<Configuration>,

    ) {
        this.types = {
            ADMIN: "ADMIN",
            SUPERADMIN: "SUPERADMIN",
            USER: "USER"
        }
        console.log({ jwt })
        this.jwtService = jwt
    }
    types: Types
    jwtService
    token: string
    async RequesLogin(requestDTO: ReuestSesionDTO): Promise<any> {
        try {
            console.log({ requestDTO })
            let response = null;

            let user: Admin | SuperAdmin

            const type = await this.typeRepository.findOne(requestDTO.type)
            console.log({ type })
            if (type.name === this.types.ADMIN) {
                console.log("Admin")
                user = await this.adminRepository.findOne({
                    relations: [
                        "type", 'users'
                    ],
                    where: { email: requestDTO.email, isActive: true },
                });
            }

            if (type.name === this.types.SUPERADMIN) {
                console.log("Es super admin")
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
                    msg: `${type.name.toLowerCase()} does't exist`
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

                const payload = {
                    usuario: {
                        uuid: user.uuid,
                        type: user.type.id
                    },
                };

                let token = await this.jwtService.sign(
                    payload,
                    process.env.SECRETA,
                    {
                        expiresIn: 36000000,
                    }
                );
                response = {
                    profile: {
                        id: loggedUser.id,
                        token,
                        name: user.name,
                        lastname: user.lastname,
                        email: user.email,
                        childrens,
                    },
                    status: 0
                };
                return response


            } else {
                response = { status: 2, msg: "pass doesn't match" };
            }
            return response

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
        try {
            let response = null;

            const user = await this.userRepository.findOne({
                where: { email: reuestSesionLogOutDTO.email },
            });

            if (user) {
                let actualSesion = await this.sesionRepository.findOne({
                    where: { user: user },
                });

                await this.sesionRepository.remove(actualSesion);

                response = { status: 0 };
            } else {
                response = { status: 1 };
            }

            return response;
        } catch (err) {
            console.log("SesionService - RequesLogout: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error requesting logout",
                },
                500
            );
        }
    }
    async decifreToken(
        token: string
    ): Promise<string> {
        try {

            const jwtDecoded = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            );
            if (jwtDecoded.email) {
                return jwtDecoded.email;
            }
        } catch (err) {
            console.log("SesionService - Decifre: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error decifring ",
                },
                500
            );
        }
    }
    async passwordRecovery(requestDTO: PasswordRecovery): Promise<any> {
        try {
            let response = { status: 0 };

            const jwtDecoded = jwt.verify(
                requestDTO.token,
                process.env.TOKEN_SECRET
            );
            console.log({ jwtDecoded })
            if (!jwtDecoded.token) {
                response = { status: 10 };
            } else {

                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.token, {
                    relations: ["type", "user", "admin"],
                });
                console.log({ tokenExist })
                if (tokenExist) {

                    const passwordHashed = await bcrypt.hash(requestDTO.password, 12);
                    let userToUpdate: Admin | User = null
                    if (tokenExist.user) {
                        userToUpdate = await this.userRepository.findOne(tokenExist.user.id, {
                            where: {
                                isActive: true,
                            }
                        })
                    }
                    if (tokenExist.admin) {
                        userToUpdate = await this.adminRepository.findOne(tokenExist.admin.id, {
                            where: {
                                isActive: true
                            }
                        })
                    }
                    console.log({ userToUpdate })
                    if (!userToUpdate) {
                        return {
                            status: 5,
                            msg: "Ah ocurrido un  error"
                        }
                    }

                    userToUpdate.password = passwordHashed;
                    // Se actualiza password del usuario
                    if (tokenExist.type.id === USER_NORMAL) {
                        await this.userRepository.save(userToUpdate);
                    }

                    if (tokenExist.type.id === ADMIN) {
                        await this.adminRepository.save(userToUpdate);
                    }
                    // Se elimina el token de la base de datos
                    await this.tokenRepository.remove(tokenExist);
                } else {
                    response = { status: 10 };
                }
            }

            return response;
        } catch (err) {
            console.log("UserService - passwordRecovery: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error ressetign password",
                },
                500
            );
        }
    }

    async requestPasswordReset(requestEmail: string): Promise<any> {
        try {
            console.log("***", { requestEmail }, "***")


            let response = { status: 0 };

            const user: User = await this.userRepository.findOne({
                relations: ["type"],
                where: { email: requestEmail },
            });

            const admin: Admin = await this.adminRepository.findOne({
                relations: ["type"],
                where: { email: requestEmail },
            });



            if (user || admin) {
                let pettioner: User | Admin = user ? user : admin
                if (user && admin) {
                    return {
                        status: 5,
                        msg: "No es posible"
                    }
                }

                //Verificar si ya existe un token antes que este

                const existToken = await this.tokenRepository.findOne({
                    relations: ["admin", "user"],
                    where: {
                        user: user ? user : null,
                        admin: admin ? admin : null
                    }
                });
                if (existToken) {
                    console.log({ existToken })
                    await this.tokenRepository.remove(existToken)
                }

                let newToken = this.tokenRepository.create({
                    email: requestEmail,
                    type: pettioner.type,
                    user: user ? user : null,
                    admin: admin ? admin : null,
                    superAdmin: null,
                });




                const registerToken = await this.tokenRepository.save(newToken);
                const token = await jwt.sign(
                    { token: registerToken.id },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: 7200,
                    }
                );


                // Se envia correo
                // await this.mailerService.sendMail({
                //     to: requestEmail,
                //     subject: "Recuperacion de contraseña.",
                //     template: "./recovery.hbs",
                //     context: {
                //         url: jwtToken,
                //         email: requestEmail,
                //     },
                // });
                return {
                    token,
                    status: 0
                }

            } else {
                response = { status: 1 };
            }
            return response;
        } catch (err) {
            console.log("UserService - requestPasswordReset: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error requesting password reset",
                },
                500
            );
        }
    }



}
