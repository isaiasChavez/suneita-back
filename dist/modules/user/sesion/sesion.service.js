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
const jwt = require('jsonwebtoken');
let SesionService = class SesionService {
    constructor(sesionRepository, typeRepository, userRepository, suscriptionRepository, adminRepository, roleRepository, assetRepository, superAdminRepository, tokenRepository, invitationRepository) {
        this.sesionRepository = sesionRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
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
        console.log({ jwt });
        this.jwtService = jwt;
    }
    async RequesLogin(requestDTO) {
        try {
            console.log('Entra');
            let response = null;
            let user;
            let type;
            user = await this.superAdminRepository.findOne({
                relations: ['type', 'admins'],
                where: { email: requestDTO.email, isActive: true },
            });
            if (!user) {
                user = await this.adminRepository.findOne({
                    relations: ['type', 'users'],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
            if (!user) {
                user = await this.userRepository.findOne({
                    relations: ['type'],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
            if (!user) {
                return {
                    status: 1,
                    msg: `email does't exist`,
                };
            }
            else {
                console.log({ user });
                type = user.type;
            }
            const match = await bcrypt.compare(requestDTO.password, user.password);
            if (match) {
                let sesionExist;
                if (type.name === this.types.SUPERADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { superadmin: user },
                    });
                }
                if (type.name === this.types.ADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { admin: user },
                    });
                }
                if (type.name === this.types.USER) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { user },
                    });
                }
                console.log({ sesionExist });
                if (sesionExist) {
                    console.log('Existe una sesion');
                    await this.sesionRepository.remove(sesionExist);
                }
                let sesion;
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
                console.log(type.name);
                if (type.name === this.types.USER) {
                    console.log('Creando');
                    sesion = this.sesionRepository.create({
                        user,
                    });
                }
                let dataChildrens = {
                    admins: [], users: [],
                };
                if (type.name === this.types.SUPERADMIN) {
                    dataChildrens.admins = await this.adminRepository.find({
                        select: ['name', 'lastname', 'avatar', 'uuid', 'isActive', 'email'],
                        relations: ['suscriptions'],
                        where: {
                            superadmin: user,
                        },
                    });
                    dataChildrens.users = await this.userRepository.find({
                        select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                        relations: ['suscriptions'],
                        where: {
                            superadmin: user,
                        },
                    });
                }
                if (type.name === this.types.ADMIN) {
                    dataChildrens.users = await this.userRepository.find({
                        select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                        where: {
                            admin: user,
                        },
                    });
                }
                console.log({ dataChildrens });
                const childrens = {
                    admins: [], users: []
                };
                if (type.name === this.types.SUPERADMIN) {
                    childrens.admins = dataChildrens.admins.map((child) => {
                        const dataToSend = {
                            avatar: child.avatar,
                            email: child.email,
                            isActive: child.isActive,
                            lastname: child.lastname,
                            name: child.name,
                            suscriptions: null,
                            lastSuscription: null
                        };
                        dataToSend.suscriptions = child.suscriptions.map((suscription) => {
                            return {
                                cost: suscription.cost,
                                invitations: suscription.invitations,
                                createdAt: suscription.createdAt,
                                finishedAt: suscription.finishedAt,
                                isActive: suscription.isActive,
                                isDeleted: suscription.isDeleted,
                                startedAt: suscription.startedAt,
                            };
                        });
                        dataToSend.lastSuscription = dataToSend.suscriptions[0];
                        return dataToSend;
                    });
                    childrens.users = dataChildrens.users.map((child) => {
                        const dataToSend = {
                            avatar: child.avatar,
                            email: child.email,
                            isActive: child.isActive,
                            lastname: child.lastname,
                            name: child.name,
                            suscriptions: null,
                            lastSuscription: null
                        };
                        dataToSend.suscriptions = child.suscriptions.map((suscription) => {
                            return {
                                cost: suscription.cost,
                                createdAt: suscription.createdAt,
                                finishedAt: suscription.finishedAt,
                                isActive: suscription.isActive,
                                isDeleted: suscription.isDeleted,
                                startedAt: suscription.startedAt,
                            };
                        });
                        dataToSend.lastSuscription = dataToSend.suscriptions[0] ? dataToSend.suscriptions[0] : null;
                        return dataToSend;
                    });
                }
                else {
                    childrens.users = dataChildrens.users;
                }
                const loggedUser = await this.sesionRepository.save(sesion);
                console.log({ loggedUser });
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
                        email: user.email,
                        childrens,
                        type: type.id,
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
            console.log({ requestDTO });
            let response = null;
            let user;
            let type;
            user = await this.adminRepository.findOne({
                relations: ['type', 'users'],
                where: { email: requestDTO.email, isActive: true },
            });
            if (!user) {
                user = await this.userRepository.findOne({
                    relations: ['type'],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
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
                    token,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    avatar: user.avatar,
                    assets: [
                        {
                            url: 'https://spacegeneral.sfo2.digitaloceanspaces.com/ocupath/ocupath/jimmy-dean-DyQiNSgrM58-unsplash.jpg',
                            type: 1
                        },
                        {
                            url: 'https://spacegeneral.sfo2.digitaloceanspaces.com/ocupath/ocupath/bretana_rg_360_final.jpg',
                            type: 2
                        },
                        {
                            url: 'https://spacegeneral.sfo2.digitaloceanspaces.com/ocupath/ocupath/video%20del%20mar%20congelado-sin%20copyright-%5Bvisual%20freedom%5D.mp4',
                            type: 3
                        },
                        {
                            url: 'https://spacegeneral.sfo2.digitaloceanspaces.com/ocupath/ocupath/Ayutthaya%20-%20Easy%20Tripod%20Paint%20_%20360_VR%20Master%20Series%20_%20Free%20Download.mp4',
                            type: 4
                        }
                    ],
                    type: user.type.id,
                },
                status: 0,
            };
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
            let response = null;
            const user = await this.userRepository.findOne({
                where: { email: reuestSesionLogOutDTO.email },
            });
            if (user) {
                const actualSesion = await this.sesionRepository.findOne({
                    where: { user: user },
                });
                await this.sesionRepository.remove(actualSesion);
                response = { status: 0 };
            }
            else {
                response = { status: 1 };
            }
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
            console.log({ email });
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
    async passwordRecovery(requestDTO) {
        try {
            let response = { status: 0 };
            const jwtDecoded = jwt.verify(requestDTO.token, process.env.TOKEN_SECRET);
            if (!jwtDecoded.token) {
                response = { status: 10 };
            }
            else {
                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.token, {
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
                    console.log({ userToUpdate });
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
                    response = { status: 10 };
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
            console.log('***', { requestEmail }, '***');
            let response = { status: 0 };
            const user = await this.userRepository.findOne({
                relations: ['type'],
                where: { email: requestEmail },
            });
            const admin = await this.adminRepository.findOne({
                relations: ['type'],
                where: { email: requestEmail },
            });
            if (user || admin) {
                const pettioner = user ? user : admin;
                if (user && admin) {
                    return {
                        status: 5,
                        msg: 'No es posible',
                    };
                }
                const existToken = await this.tokenRepository.findOne({
                    relations: ['admin', 'user'],
                    where: {
                        user: user ? user : null,
                        admin: admin ? admin : null,
                    },
                });
                if (existToken) {
                    console.log({ existToken });
                    await this.tokenRepository.remove(existToken);
                }
                const newToken = this.tokenRepository.create({
                    email: requestEmail,
                    type: pettioner.type,
                    user: user ? user : null,
                    admin: admin ? admin : null,
                    superAdmin: null,
                });
                const registerToken = await this.tokenRepository.save(newToken);
                const token = await jwt.sign({ token: registerToken.id }, process.env.TOKEN_SECRET, {
                    expiresIn: 7200,
                });
                return {
                    token,
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
            const admin = this.adminRepository.create({
                superadmin: invitation.superAdmin,
                role: adminRole,
                type: adminType,
                name: createAdminDTO.name,
                lastname: createAdminDTO.lastname,
                email: createAdminDTO.email,
                password: userPassword,
                business: invitation.company,
            });
            await this.adminRepository.save(admin);
            const newAdmin = await this.adminRepository.findOne({
                where: {
                    email: admin.email,
                },
            });
            const userSuscription = this.suscriptionRepository.create({
                admin: newAdmin,
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
    async create(createUserDTO) {
        try {
            console.log("Creando nuevo usuario");
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
            const user = this.userRepository.create({
                admin: invitation.admin,
                superadmin: invitation.superAdmin,
                role: userRole,
                type: userType,
                name: createUserDTO.name,
                lastname: createUserDTO.lastname,
                email: createUserDTO.email,
                password: userPassword,
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
            console.log({ user });
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
    __param(0, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(1, typeorm_1.InjectRepository(type_entity_1.Type)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __param(4, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(5, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(6, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __param(7, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
    __param(8, typeorm_1.InjectRepository(token_entity_1.Token)),
    __param(9, typeorm_1.InjectRepository(invitation_entity_1.Invitation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
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