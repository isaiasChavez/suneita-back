
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
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as moment from "moment";
import { Roles, Types } from "src/types";
import { SuperAdmin } from "./superadmin.entity";
import { Admin } from "./admin.entity";

@Injectable()
export class UserService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(SuperAdmin) private superAdminRepository: Repository<SuperAdmin>,
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        // @InjectRepository(Target) private targetRepository: Repository<Target>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        @InjectRepository(Type) private typeRepository: Repository<Type>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        // @InjectRepository(Configuration)
        // private configurationRepository: Repository<Configuration>
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

    async invite(request: InviteUserDTO): Promise<number> {
        try {
            let status = 0;
            let tokenToSign = "";
            // Se verifica si el usuario ya cuenta con una invitacion enviada
            let userExist = await this.userRepository.findOne({
                where: { email: request.email },
            });

            if (!userExist) {
                // Se verifica si el usuario ya cuenta con una invitacion enviada
                const token = await this.tokenRepository.findOne({
                    where: { email: request.email },
                });

                if (!token) {
                    // Se obtiene el tipo de usuario
                    const userType = await this.typeRepository.findOne(request.type);
                    // Se crea nuevo token asociado al email del usuario
                    let newToken = this.tokenRepository.create({
                        email: request.email,
                        type: userType,
                    });
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
                    subject: "Has sido invitado a Bioderma.",
                    template: "./invitacion.hbs",
                    context: {
                        url: jwtToken,
                        type: request.type,
                        email: request.email,
                    },
                });
            } else {
                if (userExist.isActive) {
                    status = 9;
                } else {
                    status = 8;
                    userExist.isActive = true;
                    await this.userRepository.save(userExist);
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

    async findAll(): Promise<any> {
        try {
            const usersList = await this.userRepository.find({
                select: ["id", "name", "email"],
                relations: ["type"],
                where: { isActive: true },
            });
            return { users: usersList };
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
        console.log({ createSuperAdminDTO })

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


        //Verificar que el superadministrador exista

        const superAdmin = this.superAdminRepository.findOne({
            where: {
                uuid: createAdminDTO.superAdminUuid
            }
        })

        if (!superAdmin) {
            return {
                status: 1,
                error: "No existe el superusuario"
            }
        }
        const existUser = this.adminRepository.findOne({
            where: {
                email: createAdminDTO.email
            }
        })
        if (existUser) {
            return {
                status: 2,
                error: "Este email ya existe"
            }
        }

        const adminRole = await this.roleRepository.findOne({
            where: {
                name: this.roles.ADMIN
            }
        })
        const adminType = await this.roleRepository.findOne({
            where: {
                name: this.types.SUPERADMIN
            }
        })
        try {
            const userPassword = await bcrypt.hash(createAdminDTO.password, 12);
            let newUser = this.adminRepository.create({
                role: adminRole,
                type: adminType,
                name: createAdminDTO.name,
                lastname: createAdminDTO.lastname,
                email: createAdminDTO.email,
                password: userPassword,
            });
            await this.adminRepository.save(newUser);

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
            const admin = this.adminRepository.findOne({
                where: {
                    uuid: createUserDTO.adminUuid
                }
            })

            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el usuario"
                }
            }

            const existUser = this.adminRepository.findOne({
                where: {
                    email: createUserDTO.email
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

            let user = await this.userRepository.findOne({
                where: { uuid: updateUserAdminDTO.adminUuid },
            });

            if (!user) {
                response = { status: 1, msg: 'user not found' };
            } else {
                if (updateUserAdminDTO.name) {
                    user.name = updateUserAdminDTO.name;
                }
                if (updateUserAdminDTO.lastname) {
                    user.lastname = updateUserAdminDTO.lastname;
                }
                user.isActive = true;

                await this.adminRepository.save(user);

                const userToReturn = await this.userRepository.findOne({
                    relations: [
                        "type",
                    ],
                    where: { uuid: user.uuid },
                });

                const loggedUser = await this.sesionRepository.findOne({
                    where: { user: userToReturn },
                });

                response = {
                    user: {
                        token: loggedUser.id,
                        name: userToReturn.name,
                        lastname: userToReturn.lastname,
                        email: userToReturn.email,
                        type: userToReturn.type.id,
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

            const admin = this.adminRepository.findOne({
                where: {
                    uuid: updateUserDTO.adminUuid
                }
            })

            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }

            let user = await this.userRepository.findOne({
                where: { email: updateUserDTO.email },
            });

            if (!user) {
                response = { status: 1, msg: 'user not found' };
            } else {
                if (updateUserDTO.name) {
                    user.name = updateUserDTO.name;
                }
                if (updateUserDTO.lastname) {
                    user.lastname = updateUserDTO.lastname;
                }
                user.isActive = true;

                await this.userRepository.save(user);

                const userToReturn = await this.userRepository.findOne({
                    relations: [
                        "type",
                    ],
                    where: { uuid: user.uuid },
                });

                const loggedUser = await this.sesionRepository.findOne({
                    where: { user: userToReturn },
                });

                response = {
                    user: {
                        token: loggedUser.id,
                        name: userToReturn.name,
                        lastname: userToReturn.lastname,
                        email: userToReturn.email,
                        type: userToReturn.type.id,
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

            const superAdmin = this.superAdminRepository.findOne({
                where: {
                    uuid: deleteAdminUserDTO.superAdminUuid
                }
            })
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            let userToDelete = await this.adminRepository.findOne({
                where: { uuid: deleteAdminUserDTO.adminUuid },
            });

            if (!userToDelete) {
                return { status: 2, msg: 'admin not found' };
            }

            userToDelete.isActive = false;
            //TODO: Cambiar .save por .remove 
            await this.adminRepository.save(userToDelete);

            // TODO: Eliminar todas los assets relacionados


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
            const admin = this.adminRepository.findOne({
                where: {
                    uuid: deleteUserDTO.adminUuid
                }
            })
            if (!admin) {
                return { status: 1, msg: 'super not found' };
            }

            let userToDelete = await this.userRepository.findOne({
                where: { uuid: deleteUserDTO.userUuid },
            });

            if (!userToDelete) {
                return { status: 2, msg: 'user not found' };
            }

            await this.userRepository.remove(userToDelete);
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

    async requestPasswordReset(requestEmail: string): Promise<any> {
        try {
            let response = { status: 0 };

            const user = await this.userRepository.findOne({
                where: { email: requestEmail },
            });

            if (user) {
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

            const jwtDecoded = await jwt.verify(
                requestDTO.token,
                "Bi0d3rmaTokenJWT."
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
