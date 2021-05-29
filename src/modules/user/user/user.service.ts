
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
} from "./user.dto";
import { MailerService } from "@nestjs-modules/mailer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as moment from "moment";

@Injectable()
export class UserService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(User) private userRepository: Repository<User>,
        // @InjectRepository(Target) private targetRepository: Repository<Target>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        @InjectRepository(Type) private typeRepository: Repository<Type>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
        // @InjectRepository(Configuration)
        // private configurationRepository: Repository<Configuration>
    ) { }

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
                    lastName: user.lastName,
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

    async create(createUserDTO: CreateUserDTO): Promise<any> {
        try {
            const userPassword = await bcrypt.hash(createUserDTO.password, 12);
            let newUser = await this.userRepository.create({
                name: createUserDTO.name,
                lastName: createUserDTO.lastName,
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


    async deleteUser(requestEmail: string): Promise<any> {
        try {
            let userToDelete = await this.userRepository.findOne({
                where: { email: requestEmail },
            });

            userToDelete.isActive = false;

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
