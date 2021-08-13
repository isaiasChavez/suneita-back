"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sesion_entity_1 = require("./sesion.entity");
const config_keys_1 = require("../../../config/config.keys");
const bcrypt = require("bcrypt");
const types_1 = require("../../../types");
const type_entity_1 = require("../type/type.entity");
const user_entity_1 = require("../user/user.entity");
const admin_entity_1 = require("../user/admin.entity");
const superadmin_entity_1 = require("../user/superadmin.entity");
const token_entity_1 = require("../token/token.entity");
const invitation_entity_1 = require("../invitation/invitation.entity");
const role_entity_1 = require("../role/role.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const asset_entity_1 = require("../../asset/asset.entity");
const mailer_1 = require("@nestjs-modules/mailer");
const user_service_1 = require("../user/user.service");
const templates_1 = require("../../../templates/templates");
const status_entity_1 = require("../status/status.entity");
const jwt = require('jsonwebtoken');
let SesionService = class SesionService {
    constructor(mailerService, userService, sesionRepository, typeRepository, userRepository, suscriptionRepository, adminRepository, roleRepository, statusRepository, assetRepository, superAdminRepository, tokenRepository, invitationRepository) {
        this.mailerService = mailerService;
        this.userService = userService;
        this.sesionRepository = sesionRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
        this.statusRepository = statusRepository;
        this.assetRepository = assetRepository;
        this.superAdminRepository = superAdminRepository;
        this.tokenRepository = tokenRepository;
        this.invitationRepository = invitationRepository;
        this.types = {
            ADMIN: 'ADMIN',
            SUPERADMIN: 'SUPERADMIN',
            USER: 'USER',
        };
        this.roles = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER',
        };
        this.typesNumbers = {
            SUPERADMIN: 1,
            ADMIN: 2,
            USER: 3,
        };
        console.log({ jwt });
        this.jwtService = jwt;
    }
    async RequesLogin(requestDTO) {
        try {
            let response = null;
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(requestDTO.email);
            if (!user) {
                return {
                    status: 1,
                    msg: `email does't exist`,
                };
            }
            const match = await bcrypt.compare(requestDTO.password, user.password);
            if (match) {
                if (isAdmin || isGuest) {
                    const statusSuscription = await this.checkExpiredSuscriptions(user, isAdmin, isGuest);
                    console.log({ statusSuscription });
                    if (statusSuscription.hasSuscriptionActiveExpired) {
                        return {
                            status: 3,
                            msg: "Suscription has expired"
                        };
                    }
                }
                let sesionExist;
                if (isSuperAdmin) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { superadmin: user },
                    });
                }
                if (isAdmin) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { admin: user },
                    });
                }
                if (isGuest) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { user },
                    });
                }
                if (sesionExist) {
                    await this.sesionRepository.remove(sesionExist);
                }
                let sesion;
                if (isAdmin) {
                    sesion = this.sesionRepository.create({
                        admin: user,
                        isFromCMS: true
                    });
                }
                if (isSuperAdmin) {
                    sesion = this.sesionRepository.create({
                        superadmin: user,
                        isFromCMS: true
                    });
                }
                if (isGuest) {
                    sesion = this.sesionRepository.create({
                        user,
                        isFromCMS: true
                    });
                }
                const loggedUser = await this.sesionRepository.save(sesion);
                const payload = {
                    usuario: {
                        uuid: user.uuid,
                        type: user.type.id,
                    },
                };
                const token = await this.jwtService.sign(payload, process.env.SECRETA, {
                    expiresIn: 36000000,
                });
                response = {
                    profile: {
                        id: loggedUser.id,
                        token,
                        name: user.name,
                        lastname: user.lastname,
                        thumbnail: user.thumbnail,
                        email: user.email,
                        type: user.type.id,
                    },
                    status: 0,
                };
                return response;
            }
            else {
                response = { status: 2, msg: "pass doesn't match" };
            }
            return response;
        }
        catch (err) {
            console.log('SesionService - RequesLogin: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error requesting login',
            }, 500);
        }
    }
    async RequesLoginFromApp(requestDTO) {
        try {
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(requestDTO.email);
            if (!user) {
                return {
                    status: 1,
                    msg: `email does't exist`,
                };
            }
            const match = await bcrypt.compare(requestDTO.password, user.password);
            let response;
            if (match) {
                let sesionExist;
                if (isSuperAdmin) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { superadmin: user },
                    });
                }
                if (isAdmin) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { admin: user },
                    });
                }
                if (isGuest) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { user },
                    });
                }
                if (sesionExist) {
                    await this.sesionRepository.remove(sesionExist);
                }
                let sesion;
                if (isAdmin) {
                    sesion = this.sesionRepository.create({
                        admin: user,
                        isFromCMS: false
                    });
                }
                if (isSuperAdmin) {
                    sesion = this.sesionRepository.create({
                        superadmin: user,
                        isFromCMS: false
                    });
                }
                if (isGuest) {
                    sesion = this.sesionRepository.create({
                        user,
                        isFromCMS: false
                    });
                }
                await this.sesionRepository.save(sesion);
                const payload = {
                    usuario: {
                        uuid: user.uuid,
                        type: user.type.id,
                    },
                };
                const token = await this.jwtService.sign(payload, process.env.SECRETA, {
                    expiresIn: 36000000000,
                });
                response = {
                    profile: {
                        token,
                        name: user.name,
                        lastname: user.lastname,
                        thumbnail: user.thumbnail,
                        email: user.email,
                        avatar: user.avatar,
                        type: user.type.id,
                    },
                    status: 0,
                };
                return response;
            }
            else {
                response = { status: 2, msg: "pass doesn't match" };
            }
            return response;
        }
        catch (err) {
            console.log('SesionService - RequesLogin: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error requesting login',
            }, 500);
        }
    }
    async RequesLogout(reuestSesionLogOutDTO) {
        try {
            console.log({ reuestSesionLogOutDTO });
            const { isFromCMS } = reuestSesionLogOutDTO;
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.userService.getWhoIsRequesting(reuestSesionLogOutDTO);
            let response = null;
            let actualSesion;
            if (!user) {
                return { status: 1, msg: 'user not found' };
            }
            if (isSuperAdmin) {
                actualSesion = await this.sesionRepository.findOne({
                    where: { superadmin: user, isFromCMS },
                });
            }
            if (isAdmin) {
                actualSesion = await this.sesionRepository.findOne({
                    where: { admin: user, isFromCMS },
                });
            }
            if (isGuest) {
                actualSesion = await this.sesionRepository.findOne({
                    where: { user, isFromCMS },
                });
            }
            if (!actualSesion) {
                return { status: 2, msg: 'sesion not found' };
            }
            await this.sesionRepository.remove(actualSesion);
            response = { status: 0 };
            return response;
        }
        catch (err) {
            console.log('SesionService - RequesLogout: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error requesting logout',
            }, 500);
        }
    }
    async decifreToken(email) {
        try {
            const dataInvitation = await this.invitationRepository.findOne({
                where: { email },
                relations: ['type'],
            });
            if (!dataInvitation) {
                return { status: 1 };
            }
            return {
                data: {
                    email: dataInvitation.email,
                    company: dataInvitation.company,
                    type: dataInvitation.type.id
                },
                status: 0,
            };
        }
        catch (err) {
            console.log('SesionService - Decifre: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error decifring ',
            }, 500);
        }
    }
    async validateIfExistToken(token) {
        try {
            console.log("validateIfExistToken");
            let jwtDecoded;
            try {
                jwtDecoded = jwt.verify(token, process.env.TOKEN_SECRET);
                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.tokenid);
                if (tokenExist) {
                    return { status: 0, msg: "Token valid" };
                }
                return { status: 3, msg: "Token does not exist" };
            }
            catch (error) {
                return { status: 1, msg: "Token invalid" };
            }
        }
        catch (err) {
            console.log('SesionService - validateIfExistToken: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error decifring ',
            }, 500);
        }
    }
    async passwordRecovery(requestDTO) {
        try {
            console.log("passwordRecovery");
            let response = { status: 0, msg: 'ok' };
            let jwtDecoded;
            try {
                jwtDecoded = jwt.verify(requestDTO.token, process.env.TOKEN_SECRET);
            }
            catch (error) {
                console.log({ error });
                return { status: 5, msg: "Token invalid" };
            }
            if (!jwtDecoded.tokenid) {
                response = { status: 10, msg: 'token does not exist' };
            }
            else {
                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.tokenid, {
                    relations: ['type', 'user', 'admin'],
                });
                if (tokenExist) {
                    const passwordHashed = await bcrypt.hash(requestDTO.password, 12);
                    let userToUpdate = null;
                    if (tokenExist.user) {
                        userToUpdate = await this.userRepository.findOne(tokenExist.user.id, {
                            where: {
                                isActive: true,
                            },
                        });
                    }
                    if (tokenExist.admin) {
                        userToUpdate = await this.adminRepository.findOne(tokenExist.admin.id, {
                            where: {
                                isActive: true,
                            },
                        });
                    }
                    if (!userToUpdate) {
                        return {
                            status: 5,
                            msg: 'Ah ocurrido un  error',
                        };
                    }
                    userToUpdate.password = passwordHashed;
                    if (tokenExist.type.id === types_1.USER_NORMAL) {
                        await this.userRepository.save(userToUpdate);
                    }
                    if (tokenExist.type.id === types_1.ADMIN) {
                        await this.adminRepository.save(userToUpdate);
                    }
                    await this.tokenRepository.remove(tokenExist);
                }
                else {
                    response = { status: 10, msg: 'token does not exist' };
                }
            }
            return response;
        }
        catch (err) {
            console.log('UserService - passwordRecovery: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error ressetign password',
            }, 500);
        }
    }
    async requestPasswordReset(requestEmail) {
        try {
            let response = { status: 0 };
            const { isAdmin, isGuest, user } = await this.getWhoIsRequesting(requestEmail);
            if (user) {
                let existToken;
                existToken = await this.tokenRepository.findOne({
                    relations: ['admin', 'user'],
                    where: {
                        user: isGuest ? user : null,
                        admin: isAdmin ? user : null
                    },
                });
                if (existToken) {
                    await this.tokenRepository.remove(existToken);
                }
                const newToken = this.tokenRepository.create({
                    email: requestEmail,
                    type: user.type,
                    user: isGuest ? user : null,
                    admin: isAdmin ? user : null,
                    superAdmin: null,
                });
                const registerToken = await this.tokenRepository.save(newToken);
                const token = await jwt.sign({ tokenid: registerToken.id }, process.env.TOKEN_SECRET, {
                    expiresIn: 7200000,
                });
                await this.mailerService.sendMail({
                    to: config_keys_1.Configuration.EMAIL_ETHEREAL,
                    from: 'noreply@ocupath.com',
                    subject: 'Nueva solicitud de recuperación de contraseña',
                    text: 'Has solicitado la recuperación de tu contraseña',
                    html: templates_1.newResetPassTemplate(token),
                });
                return {
                    status: 0,
                };
            }
            else {
                response = { status: 1 };
            }
            return response;
        }
        catch (err) {
            console.log('UserService - requestPasswordReset: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error requesting password reset',
            }, 500);
        }
    }
    async getWhoIsRequesting(email) {
        try {
            let user;
            user = await this.superAdminRepository.findOne({
                relations: ['type'],
                where: { email, isActive: true },
            });
            if (!user) {
                user = await this.adminRepository.findOne({
                    relations: ['type'],
                    where: { email, isActive: true },
                });
            }
            if (!user) {
                user = await this.userRepository.findOne({
                    relations: ['type'],
                    where: { email, isActive: true },
                });
            }
            const isSuperAdmin = user.type.id === this.typesNumbers.SUPERADMIN;
            const isAdmin = user.type.id === this.typesNumbers.ADMIN;
            const isGuest = user.type.id === this.typesNumbers.USER;
            return { isAdmin, isSuperAdmin, isGuest, user };
        }
        catch (err) {
            console.log('SesionService - getWhoIsRequesting: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error Changing Name  user',
            }, 500);
        }
    }
    async checkExpiredSuscriptions(user, isAdmin, isGuest) {
        try {
            let currentSuscriptionActive = null;
            let currentSuscriptionWaiting = null;
            const suscriptionActive = await this.suscriptionRepository.findOne({
                where: {
                    isActive: true,
                    admin: isAdmin ? user : null,
                    user: isGuest ? user : null
                }
            });
            const suscriptionWaiting = await this.suscriptionRepository.findOne({
                where: {
                    isActive: false,
                    isWaiting: true,
                    admin: isAdmin ? user : null,
                    user: isGuest ? user : null
                }
            });
            let hasSuscriptionActiveExpired = suscriptionActive.finishedAt < new Date();
            if (hasSuscriptionActiveExpired && suscriptionWaiting) {
                suscriptionActive.isActive = false;
                suscriptionWaiting.isActive = true;
                suscriptionWaiting.isWaiting = false;
                await this.superAdminRepository.save([suscriptionActive, suscriptionWaiting]);
                currentSuscriptionActive = suscriptionWaiting;
                hasSuscriptionActiveExpired = false;
            }
            else {
                currentSuscriptionActive = suscriptionActive;
                currentSuscriptionWaiting = suscriptionWaiting;
            }
            console.log({ currentSuscriptionActive, currentSuscriptionWaiting, hasSuscriptionActiveExpired });
            return {
                currentSuscriptionActive,
                currentSuscriptionWaiting,
                hasSuscriptionActiveExpired
            };
        }
        catch (err) {
            console.log('SesionService - checkExpiredSuscriptions: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error checking Expired Suscriptions  user',
            }, 500);
        }
    }
    async createAdmin(createAdminDTO) {
        try {
            const invitation = await this.invitationRepository.findOne({
                relations: ['superAdmin', 'admin'],
                where: {
                    email: createAdminDTO.email,
                },
            });
            if (!invitation) {
                return {
                    status: 10,
                    error: 'No hay una invitación para este usuario',
                };
            }
            const existUser = await this.adminRepository.findOne({
                where: {
                    email: createAdminDTO.email,
                    isDeleted: false,
                },
            });
            if (existUser) {
                await this.invitationRepository.remove(invitation);
                return {
                    status: 2,
                    error: 'Este email ya existe',
                    existUser,
                };
            }
            const adminRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.ADMIN,
                },
            });
            const adminType = await this.roleRepository.findOne({
                where: {
                    name: this.types.ADMIN,
                },
            });
            const userPassword = await bcrypt.hash(createAdminDTO.password, 12);
            const userStatus = await this.statusRepository.findOne(1);
            const admin = this.adminRepository.create({
                superadmin: invitation.superAdmin,
                role: adminRole,
                type: adminType,
                name: createAdminDTO.name,
                lastname: createAdminDTO.lastname,
                email: createAdminDTO.email,
                password: userPassword,
                business: invitation.company,
                status: userStatus
            });
            await this.adminRepository.save(admin);
            const newAdmin = await this.adminRepository.findOne({
                where: {
                    email: admin.email,
                },
            });
            const userSuscription = this.suscriptionRepository.create({
                admin: newAdmin,
                user: null,
                cost: invitation.cost,
                invitations: invitation.invitations,
                startedAt: new Date(invitation.startedAt),
                finishedAt: new Date(invitation.finishedAt),
            });
            await this.suscriptionRepository.save(userSuscription);
            await this.invitationRepository.remove(invitation);
            return { status: 0 };
        }
        catch (err) {
            console.log('UserService - create: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error creting users',
            }, 500);
        }
    }
    async createGuest(createUserDTO) {
        try {
            const invitation = await this.invitationRepository.findOne({
                relations: ['admin', 'superAdmin'],
                where: {
                    email: createUserDTO.email,
                },
            });
            if (!invitation) {
                return {
                    status: 1,
                    error: 'No existe una invitación',
                };
            }
            const existUser = await this.userRepository.findOne({
                where: {
                    email: createUserDTO.email,
                    isDeleted: false,
                },
            });
            if (existUser) {
                return {
                    status: 2,
                    error: 'Este email ya existe',
                };
            }
            const userRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.USER,
                },
            });
            const userType = await this.roleRepository.findOne({
                where: {
                    name: this.types.USER
                },
            });
            const userPassword = await bcrypt.hash(createUserDTO.password, 12);
            const userStatus = await this.statusRepository.findOne(1);
            const user = this.userRepository.create({
                admin: invitation.admin,
                superadmin: invitation.superAdmin,
                role: userRole,
                type: userType,
                name: createUserDTO.name,
                lastname: createUserDTO.lastname,
                email: createUserDTO.email,
                password: userPassword,
                status: userStatus
            });
            await this.userRepository.save(user);
            if (invitation.superAdmin) {
                const newUser = await this.userRepository.findOne({
                    where: {
                        email: user.email,
                    },
                });
                const userSuscription = this.suscriptionRepository.create({
                    user: newUser,
                    cost: invitation.cost,
                    invitations: 0,
                    startedAt: new Date(invitation.startedAt),
                    finishedAt: new Date(invitation.finishedAt),
                });
                await this.suscriptionRepository.save(userSuscription);
            }
            await this.invitationRepository.remove(invitation);
            return { status: 0 };
        }
        catch (err) {
            console.log('UserService - create: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting users',
            }, 500);
        }
    }
};
SesionService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(3, typeorm_1.InjectRepository(type_entity_1.Type)),
    __param(4, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(5, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __param(6, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(7, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(8, typeorm_1.InjectRepository(status_entity_1.Status)),
    __param(9, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __param(10, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
    __param(11, typeorm_1.InjectRepository(token_entity_1.Token)),
    __param(12, typeorm_1.InjectRepository(invitation_entity_1.Invitation)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        user_service_1.UserService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SesionService);
exports.SesionService = SesionService;
//# sourceMappingURL=sesion.service.js.map