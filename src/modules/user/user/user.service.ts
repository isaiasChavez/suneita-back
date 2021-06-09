
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "./user.entity";
import { Token } from "../token/token.entity";
import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
// import { Target } from "../../trivia/target/target.entity";
import { Sesion } from "../sesion/sesion.entity";
import {
    InviteUserDTO,
    CreateUserDTO,
    ConfirmUserPassword,
    PasswordRecovery,
    CreateSuperAdminDTO,
    UpdateUserDTO,
    CreateAdminDTO,
    UpdateUserAdminDTO,
    DeleteAdminUserDTO,
    DeleteUserDTO
} from "./user.dto";
import { MailerService } from "@nestjs-modules/mailer";
const jwt = require("jsonwebtoken");
import * as bcrypt from "bcrypt";
import * as moment from "moment";
import { ADMIN, USER_NORMAL, Roles, Types, SUPER_ADMIN } from "src/types";
import { SuperAdmin } from "./superadmin.entity";
import { Admin } from "./admin.entity";
import { Suscription } from "src/modules/suscription/suscription.entity";
// import { SuscriptionService } from "src/modules/suscription/suscription.service";
import { UpdateSuscriptionDTO } from "src/modules/suscription/suscription.dto";
import { Asset } from "src/modules/asset/asset.entity";

type UserRes = {
    name: string;
    avatar: string;
    lastname: string;
    email: string;
    uuid: string;
    suscription
}

@Injectable()
export class UserService {
    constructor(
        private readonly mailerService: MailerService,
        // private readonly suscriptionService: SuscriptionService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Suscription) private suscripctionRepository: Repository<Suscription>,
        @InjectRepository(SuperAdmin) private superAdminRepository: Repository<SuperAdmin>,
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        @InjectRepository(Type) private typeRepository: Repository<Type>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,



    ) {
        this.roles = {
            SUPERADMIN: "SUPERADMIN",
            ADMIN: "ADMIN",
            USER: "USER",
        }
        this.types = {
            SUPERADMIN: "SUPERADMIN",
            ADMIN: "ADMIN",
            USER: "USER",
        }

    }
    roles: Roles
    types: Types

    async invite(request: InviteUserDTO): Promise<any> {
        try {
            console.log("***", { request }, "***")
            let status = 0;
            let tokenToSign = "";
            //Verificar que la persona que está invitando tenga permitido hacerlo

            // Se verifica si el usuario ya cuenta con una invitacion enviada
            let userExist = await this.userRepository.findOne({
                where: { email: request.email },
            });

            let adminExist = await this.adminRepository.findOne({
                where: { email: request.email },
            });

            if (!userExist && !adminExist) {
                // Se verifica si el usuario ya cuenta con una invitacion enviada
                const token = await this.tokenRepository.findOne({
                    where: { email: request.email },
                });
                if (!token) {
                    // Se obtiene el tipo de usuario de la persona que está solicitando la invitación 
                    const user: Type = await this.typeRepository.findOne(request.type);
                    let admin: Admin = null
                    let superAdmin: SuperAdmin = null

                    let userType: Type

                    if (user.id === ADMIN) {
                        userType = await this.typeRepository.findOne(USER_NORMAL);
                        admin = await this.adminRepository.findOne({
                            where: {
                                uuid: request.adminUuid
                            }
                        });
                    }
                    if (user.id === SUPER_ADMIN) {
                        userType = await this.typeRepository.findOne(ADMIN);
                        superAdmin = await this.superAdminRepository.findOne({
                            where: {
                                uuid: request.superAdminUuid
                            }
                        });
                    }
                    if (!admin && !superAdmin) {
                        return {
                            status: 5
                        }
                    }
                    // Se crea nuevo token asociado al email del nuevo usuario
                    let newToken = this.tokenRepository.create({
                        email: request.email,
                        type: userType,
                        admin,
                        superAdmin
                    });

                    console.log({ newToken })
                    // Se registra token
                    const registerToken = await this.tokenRepository.save(newToken);

                    tokenToSign = registerToken.id;
                } else {
                    tokenToSign = token.id;
                }

                // Se genera jwt para enviar por correo
                const jwtToken = await jwt.sign(
                    { token: tokenToSign },
                    process.env.TOKEN_SECRET
                );
                console.log({ jwtToken });
                // Se envia correo
                await this.mailerService.sendMail({
                    to: request.email,
                    subject: "Has sido invitado a Ocupath.",
                    template: __dirname + "/invitacion.hbs",
                    context: {
                        url: jwtToken,
                        type: request.type,
                        email: request.email,
                    },
                });
            } else {
                if (userExist.isActive || adminExist.isActive) {
                    status = 9;
                } else {
                    status = 8;
                    if (userExist) {
                        userExist.isActive = true;
                        await this.userRepository.save(userExist);
                    }
                    if (adminExist) {
                        adminExist.isActive = true;
                        await this.adminRepository.save(adminExist);
                    }
                }
            }
            return status;
        } catch (err) {
            console.log("UserService - invite: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error invitins user",
                },
                500
            );
        }
    }

    async findAllUsers(uuid: number): Promise<any> {
        try {
            const admin: Admin = await this.adminRepository.findOne({
                where: {
                    uuid
                }
            })
            const users = await this.userRepository.find({
                select: ["id", "name", "email"],
                relations: ["type"],
                where: {
                    isActive: true,
                    admin
                },
            });

            return { users };
        } catch (err) {
            console.log("UserService - findAll: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error getting users list",
                },
                500
            );
        }
    }

    async confirmPassword(requestDTO: ConfirmUserPassword): Promise<any> {
        try {
            let response = { status: 0 };

            const userExist = await this.userRepository.findOne({
                where: { email: requestDTO.email },
                select: ["id", "name", "email", "password"],
            });

            if (userExist) {
                const match = await bcrypt.compare(
                    requestDTO.password,
                    userExist.password
                );

                if (!match) {
                    response = { status: 2 };
                }
            } else {
                response = { status: 1 };
            }

            return response;
        } catch (err) {
            console.log("UserService - confirmPassword: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error confirming user password",
                },
                500
            );
        }
    }

    async findUserDetail(requestEmail: string): Promise<any> {
        console.log("findUserDetail")
        try {
            const user = await this.userRepository.findOne({
                relations: [
                    "type",
                ],
                where: { email: requestEmail },
            });
            return {
                profile: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    type: user.type.id,
                },
            };
        } catch (err) {
            console.log("UserService - findUserDetail: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error getting user",
                },
                500
            );
        }
    }


    async createSuperAdmin(createSuperAdminDTO: CreateSuperAdminDTO): Promise<any> {

        if (createSuperAdminDTO.passwordmaster !== process.env.MASTER_PASS) {
            return {
                status: 1,
            }
        }
        const existSuperAdmin = await this.adminRepository.findOne({
            where: {
                email: createSuperAdminDTO.email,
                isDeleted: false
            }
        })
        if (existSuperAdmin) {
            return {
                status: 2
            }
        }


        const superAdminRole = await this.roleRepository.findOne({
            where: {
                name: this.roles.SUPERADMIN
            }
        })

        const superAdminType = await this.roleRepository.findOne({
            where: {
                name: this.types.SUPERADMIN
            }
        })


        try {
            const userPassword = await bcrypt.hash(createSuperAdminDTO.password, 12);
            let newUser = this.superAdminRepository.create({
                role: superAdminRole,
                type: superAdminType,
                name: createSuperAdminDTO.name,
                lastname: createSuperAdminDTO.lastname,
                email: createSuperAdminDTO.email,
                password: userPassword,
            });
            await this.superAdminRepository.save(newUser);
            return { status: 0 };
        } catch (err) {
            console.log("UserService - create: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error creting users",
                },
                500
            );
        }
    }
    async createAdmin(createAdminDTO: CreateAdminDTO): Promise<any> {

        try {


            //Verificar que exista un token con el email asociado

            const token: Token = await this.tokenRepository.findOne({
                where: {
                    email: createAdminDTO.email
                }
            })

            if (!token) {
                return {
                    status: 10,
                    error: "No hay un token para este usuario",
                }
            }

            //Verificar que el superadministrador exista

            const superadmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: createAdminDTO.superAdminUuid
                }
            })

            if (!superadmin) {
                return {
                    status: 1,
                    error: "No existe el superusuario"
                }
            }
            const existUser = await this.adminRepository.findOne({
                where: {
                    email: createAdminDTO.email,
                    isDeleted: false
                }
            })
            if (existUser) {
                return {
                    status: 2,
                    error: "Este email ya existe",
                    existUser
                }
            }

            const adminRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.ADMIN
                }
            })
            const adminType = await this.roleRepository.findOne({
                where: {
                    name: this.types.ADMIN
                }
            })
            const userPassword = await bcrypt.hash(createAdminDTO.password, 12);



            const admin = this.adminRepository.create({
                superadmin,
                role: adminRole,
                type: adminType,
                name: createAdminDTO.name,
                lastname: createAdminDTO.lastname,
                email: createAdminDTO.email,
                password: userPassword,
            });

            await this.adminRepository.save(admin);
            let newAdmin = await this.adminRepository.findOne({
                where: {
                    email: admin.email
                }
            })
            const userSuscription = this.suscriptionRepository.create({
                admin: newAdmin,
                cost: createAdminDTO.cost,
                startedAt: new Date(createAdminDTO.startedAt),
                finishedAt: new Date(createAdminDTO.finishedAt),
            })
            await this.suscriptionRepository.save(userSuscription)



            return { status: 0 };
        } catch (err) {
            console.log("UserService - create: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error creting users",
                },
                500
            );
        }
    }

    async create(createUserDTO: CreateUserDTO): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: createUserDTO.adminUuid
                }
            })

            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                }
            }

            const existUser = await this.userRepository.findOne({
                where: {
                    email: createUserDTO.email,
                    isDeleted: false
                }
            })
            if (existUser) {
                return {
                    status: 2,
                    error: "Este email ya existe"
                }
            }

            const userRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.ADMIN
                }
            })
            const userType = await this.roleRepository.findOne({
                where: {
                    name: this.types.SUPERADMIN
                }
            })

            const userPassword = await bcrypt.hash(createUserDTO.password, 12);

            let newUser = this.userRepository.create({
                admin,
                role: userRole,
                type: userType,
                name: createUserDTO.name,
                lastname: createUserDTO.lastname,
                email: createUserDTO.email,
                password: userPassword,
            });

            await this.userRepository.save(newUser);

            return { status: 0 };
        } catch (err) {
            console.log("UserService - create: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error getting users",
                },
                500
            );
        }
    }

    async updateAdminUser(
        updateUserAdminDTO: UpdateUserAdminDTO
    ): Promise<any> {
        try {
            let response = {}
            const superadmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: updateUserAdminDTO.superAdminUuid
                }
            })


            console.log({ superadmin })

            if (!superadmin) {
                return { status: 1, msg: 'supadmin not found' };
            }

            let user = await this.adminRepository.findOne({
                relations: ["superadmin"],
                where: { uuid: updateUserAdminDTO.adminUuid },
            });

            console.log({ user })


            if (!user) {
                response = { status: 1, msg: 'user not found' };
            } else {
                if (updateUserAdminDTO.name) {
                    user.name = updateUserAdminDTO.name;
                }
                if (updateUserAdminDTO.lastname) {
                    user.lastname = updateUserAdminDTO.lastname;
                }
                if (updateUserAdminDTO.avatar) {
                    user.avatar = updateUserAdminDTO.avatar;
                }
                let suscription: Suscription
                if (updateUserAdminDTO.startedAt || updateUserAdminDTO.finishedAt || updateUserAdminDTO.cost || updateUserAdminDTO.business) {
                    const updateSuscriptionDTO: UpdateSuscriptionDTO = {
                        business: updateUserAdminDTO.business,
                        cost: updateUserAdminDTO.cost,
                        finishedAt: updateUserAdminDTO.finishedAt,
                        startedAt: updateUserAdminDTO.startedAt,
                        adminUuid: user.uuid
                    }
                    suscription = await this.suscriptionRepository.findOne({
                        select: ["cost", "startedAt", "finishedAt", "isActive"],
                        where: {
                            admin: user
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
                    if (updateSuscriptionDTO.cost && updateSuscriptionDTO.cost > 0) {
                        suscription.cost = updateSuscriptionDTO.cost;
                    }

                    this.suscriptionRepository.save(suscription)
                }
                user.isActive = true;

                await this.adminRepository.save(user);

                const userToReturn = await this.adminRepository.findOne({
                    relations: [
                        "type",
                    ],
                    where: { uuid: user.uuid },
                });


                response = {
                    user: {
                        name: userToReturn.name,
                        avatar: userToReturn.avatar,
                        lastname: userToReturn.lastname,
                        email: userToReturn.email,
                        uuid: userToReturn.uuid,
                        suscription
                    },
                };
            }

            return response;
        } catch (err) {
            console.log("UserService - updateAdmin: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error updating  user",
                },
                500
            );
        }
    }
    async updateUser(
        updateUserDTO: UpdateUserDTO
    ): Promise<any> {
        try {
            let response = {}

            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: updateUserDTO.adminUuid
                }
            })
            console.log("pasó", { admin })

            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }

            let user = await this.userRepository.findOne({
                relations: ["admin"],
                where: { uuid: updateUserDTO.userUuid },
            });
            console.log({ user })

            if (!user) {
                response = { status: 1, msg: 'user not found' };
            } else {
                if (user.admin.id !== admin.id) {
                    return {
                        status: 5,
                        msg: "Unauthorized"
                    }
                }


                if (updateUserDTO.name.length !== 0) {
                    user.name = updateUserDTO.name;
                }
                if (updateUserDTO.lastname.length !== 0) {
                    user.lastname = updateUserDTO.lastname;
                }

                if (updateUserDTO.avatar.length !== 0) {
                    user.avatar = updateUserDTO.avatar;
                }
                console.log({ user })
                user.isActive = true;
                await this.userRepository.save(user);

                const userToReturn = await this.userRepository.findOne({
                    where: { uuid: user.uuid },
                });


                response = {
                    user: {
                        avatar: userToReturn.avatar,
                        name: userToReturn.name,
                        lastname: userToReturn.lastname,
                        email: userToReturn.email,
                    },
                };
            }

            return response;
        } catch (err) {
            console.log("UserService - updateAdmin: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error updating  user",
                },
                500
            );
        }
    }


    async deleteUserAdmin(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
        try {

            const superAdmin: SuperAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: deleteAdminUserDTO.superAdminUuid
                }
            })

            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }

            const admin: Admin = await this.adminRepository.findOne({
                relations: ["users", "assets"],
                where: { uuid: deleteAdminUserDTO.adminUuid },
            });

            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            console.log("admin.users", admin.users)
            await Promise.all(admin.users.map(async (user) => {
                console.log({ user })
                user.isActive = false
                user.isDeleted = true
                await this.userRepository.save(user)
            }))

            await Promise.all(admin.assets.map(async (asset: Asset) => {
                asset.isActive = false
                asset.isDeleted = true
                await this.userRepository.save(asset)
            }))

            const suscription: Suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            })
            if (suscription) {
                suscription.isActive = false
                suscription.isDeleted = true
                const temtSusp: Suscription = this.suscriptionRepository.create({})
                suscription.finishedAt = temtSusp.createdAt
                await this.suscriptionRepository.save(suscription)
            }

            //TODO: Falta eliminar los assets del sistema de CDN

            admin.isActive = false;
            admin.isDeleted = true;
            await this.adminRepository.save(admin);



            return { status: 0 };
        } catch (err) {
            console.log("UserService - deleteUser: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error deleting user",
                },
                500
            );
        }
    }
    async deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: deleteUserDTO.adminUuid
                }
            })

            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }

            let userToDelete = await this.userRepository.findOne({
                relations: ["admin"],
                where: { uuid: deleteUserDTO.userUuid },
            });

            if (!userToDelete) {
                return { status: 2, msg: 'user not found' };
            }
            if (userToDelete.admin.id !== admin.id) {
                return { status: 5, msg: 'unauthorized' };
            }
            userToDelete.isActive = false
            userToDelete.isDeleted = true
            await this.userRepository.save(userToDelete);
            return { status: 0 };
        } catch (err) {
            console.log("UserService - deleteUser: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error deleting user",
                },
                500
            );
        }
    }
    async suspendUserAdmin(pauseAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
        try {

            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: pauseAdminUserDTO.superAdminUuid
                }
            })

            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }

            let admin: Admin = await this.adminRepository.findOne({
                relations: ["users"],
                where: { uuid: pauseAdminUserDTO.adminUuid },
            });

            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }

            await Promise.all(admin.users.map(async (user: User) => {
                if (!user.isDeleted) {
                    user.isActive = pauseAdminUserDTO.status
                    await this.userRepository.save(user)
                }
            }))
            const suscription: Suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            })
            if (suscription) {
                suscription.isActive = pauseAdminUserDTO.status
                await this.suscriptionRepository.save(suscription)
            }

            admin.isActive = pauseAdminUserDTO.status;
            await this.adminRepository.save(admin);
            return { status: 0 };
        } catch (err) {
            console.log("UserService - pauseUser: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error pausing user",
                },
                500
            );
        }
    }
    async pauseUser(pauseUserDTO: DeleteUserDTO): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: pauseUserDTO.adminUuid
                }
            })
            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }
            let user = await this.userRepository.findOne({
                relations: ['admin'],
                where: { uuid: pauseUserDTO.userUuid },
            });
            if (!user) {
                return { status: 2, msg: 'user not found' };
            }
            if (user.admin.id !== admin.id) {
                return {
                    status: 5,
                    msg: "Unauthorized"
                }
            }

            user.isActive = false;
            await this.userRepository.save(user);
            return { status: 0 };
        } catch (err) {
            console.log("UserService - pause user: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error pausing user",
                },
                500
            );
        }
    }






    async requestPasswordReset(requestEmail: string): Promise<any> {
        try {
            console.log("***", { requestEmail }, "***")
            let response = { status: 0 };
            const user = await this.userRepository.findOne({
                where: { email: requestEmail },
            });

            const admin = await this.adminRepository.findOne({
                where: { email: requestEmail },
            });
            if (user || admin) {

                let newToken = this.tokenRepository.create({
                    email: requestEmail,
                });

                const registerToken = await this.tokenRepository.save(newToken);
                const jwtToken = await jwt.sign(
                    { token: registerToken.id },
                    "Bi0d3rmaTokenJWT."
                );
                // Se envia correo
                await this.mailerService.sendMail({
                    to: requestEmail,
                    subject: "Recuperacion de contraseña.",
                    template: "./recovery.hbs",
                    context: {
                        url: jwtToken,
                        email: requestEmail,
                    },
                });
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

    async passwordRecovery(requestDTO: PasswordRecovery): Promise<any> {
        try {
            let response = { status: 0 };

            const jwtDecoded = jwt.verify(
                requestDTO.token,
                process.env.TOKEN_SECRET
            );

            if (!jwtDecoded.token) {
                response = { status: 10 };
            } else {

                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.token);
                if (tokenExist) {
                    const passwordHashed = await bcrypt.hash(requestDTO.password, 12);

                    let userToUpdate = await this.userRepository.findOne({
                        where: { email: requestDTO.email },
                    });

                    userToUpdate.password = passwordHashed;
                    // Se actualiza password del usuario
                    await this.userRepository.save(userToUpdate);
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


}
