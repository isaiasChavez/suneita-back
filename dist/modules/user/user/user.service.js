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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const token_entity_1 = require("../token/token.entity");
const type_entity_1 = require("../type/type.entity");
const role_entity_1 = require("../role/role.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const user_dto_1 = require("./user.dto");
const mailer_1 = require("@nestjs-modules/mailer");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const moment = require("moment");
const types_1 = require("../../../types");
const superadmin_entity_1 = require("./superadmin.entity");
const admin_entity_1 = require("./admin.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const suscription_dto_1 = require("../../suscription/suscription.dto");
const asset_entity_1 = require("../../asset/asset.entity");
const invitation_entity_1 = require("../invitation/invitation.entity");
const suscription_service_1 = require("../../suscription/suscription.service");
const templates_1 = require("../../../templates/templates");
const status_entity_1 = require("../status/status.entity");
let UserService = class UserService {
    constructor(mailerService, suscriptionService, userRepository, suscripctionRepository, superAdminRepository, adminRepository, tokenRepository, assetRepository, typeRepository, roleRepository, statusRepository, invitationRepository, sesionRepository, suscriptionRepository) {
        this.mailerService = mailerService;
        this.suscriptionService = suscriptionService;
        this.userRepository = userRepository;
        this.suscripctionRepository = suscripctionRepository;
        this.superAdminRepository = superAdminRepository;
        this.adminRepository = adminRepository;
        this.tokenRepository = tokenRepository;
        this.assetRepository = assetRepository;
        this.typeRepository = typeRepository;
        this.roleRepository = roleRepository;
        this.statusRepository = statusRepository;
        this.invitationRepository = invitationRepository;
        this.sesionRepository = sesionRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.roles = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER',
        };
        this.types = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER',
        };
        this.typesNumbers = {
            SUPERADMIN: 1,
            ADMIN: 2,
            USER: 3,
        };
        this.statusNumbers = {
            ACTIVE: 1,
            INACTIVE: 2,
            EXPIRED: 3,
        };
    }
    async invite(request) {
        try {
            let status = 0;
            let invitationToSign = '';
            let jwtToken = null;
            const userExistInDB = await this.userRepository.findOne({
                where: {
                    email: request.email,
                    isDeleted: false,
                },
            });
            let adminExistInDB;
            if (!userExistInDB) {
                adminExistInDB = await this.adminRepository.findOne({
                    where: { email: request.email, isDeleted: false },
                });
            }
            if (!userExistInDB && !adminExistInDB) {
                const invitation = await this.invitationRepository.findOne({
                    where: { email: request.email },
                });
                let registerToken;
                if (!invitation) {
                    const { isAdmin, isSuperAdmin, user } = await this.getWhoIsRequesting(request);
                    if (!user) {
                        return {
                            status: 5,
                        };
                    }
                    let yesterday = moment(new Date()).add(-1, 'days');
                    console.log({ yesterday });
                    if (moment(request.startedAt).isBefore(yesterday)) {
                        return {
                            status: 6,
                        };
                    }
                    let typeToInvite;
                    if (request.typeToInvite === this.typesNumbers.ADMIN) {
                        typeToInvite = await this.typeRepository.findOne(types_1.ADMIN);
                    }
                    if (request.typeToInvite === this.typesNumbers.USER) {
                        typeToInvite = await this.typeRepository.findOne(types_1.USER_NORMAL);
                    }
                    const invitationBase = {
                        email: request.email,
                        cost: 0,
                        finishedAt: new Date(request.finishedAt),
                        startedAt: new Date(request.startedAt),
                        admin: isAdmin ? user : null,
                        superAdmin: isSuperAdmin ? user : null,
                        type: typeToInvite,
                        company: null,
                        invitations: null,
                        name: null,
                    };
                    if (typeToInvite.id === this.typesNumbers.ADMIN) {
                        invitationBase.company = request.company;
                        invitationBase.invitations = request.invitations;
                        invitationBase.cost = request.cost;
                    }
                    if (typeToInvite.id === this.typesNumbers.USER) {
                        if (isAdmin) {
                            const dateFinishAdmin = await this.suscripctionRepository.findOne({
                                where: {
                                    admin: user,
                                    isActive: true,
                                }
                            });
                            invitationBase.finishedAt = dateFinishAdmin.finishedAt;
                        }
                        invitationBase.name = request.name;
                        invitationBase.cost = request.cost;
                    }
                    const newInvitation = this.invitationRepository.create(Object.assign({}, invitationBase));
                    console.log({ newInvitation });
                    registerToken = await this.invitationRepository.save(newInvitation);
                    invitationToSign = registerToken.id;
                }
                else {
                    invitationToSign = invitation.id;
                }
                jwtToken = await jwt.sign({ token: invitationToSign }, process.env.TOKEN_SECRET);
                console.log({ jwtToken });
                console.log("Enviando ...");
                try {
                    if (!invitation) {
                        const responseEmail = await this.mailerService.sendMail({
                            to: request.email,
                            from: 'noreply@ocupath.com',
                            subject: 'Has sido invitado a Ocupath.',
                            text: 'Your new id',
                            html: templates_1.newInvitationTemplate({
                                token: jwtToken,
                                cost: registerToken.cost,
                                finish: moment(registerToken.finishedAt).calendar(),
                                invitations: registerToken.invitations,
                                start: moment(registerToken.startedAt).calendar()
                            }),
                        });
                        console.log({ responseEmail });
                        return {
                            status: 0
                        };
                    }
                    else {
                        const responseEmail = await this.mailerService.sendMail({
                            to: request.email,
                            from: 'noreply@ocupath.com',
                            subject: 'Has sido invitado a Ocupath.',
                            text: 'Your new id',
                            html: templates_1.newInvitationTemplate({
                                token: jwtToken,
                                cost: invitation.cost,
                                finish: moment(invitation.finishedAt).calendar(),
                                invitations: invitation.invitations,
                                start: moment(invitation.startedAt).calendar()
                            }),
                        });
                        console.log({ responseEmail });
                        return {
                            status: 8
                        };
                    }
                }
                catch (error) {
                    console.log({ error });
                    return {
                        status: 3, msg: 'There is not a email whith this address'
                    };
                }
            }
            else {
                if ((userExistInDB && userExistInDB.isActive) ||
                    (adminExistInDB && adminExistInDB.isActive)) {
                    status = 9;
                }
                else {
                    status = 8;
                }
            }
            return { status };
        }
        catch (err) {
            console.log('UserService - invite: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error invitins user',
            }, 500);
        }
    }
    async findAllUsers(uuid) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid,
                },
            });
            const users = await this.userRepository.find({
                select: ['id', 'name', 'email'],
                relations: ['type'],
                where: {
                    isActive: true,
                    admin,
                },
            });
            return { users };
        }
        catch (err) {
            console.log('UserService - findAll: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting users list',
            }, 500);
        }
    }
    async createPublication(createPublication) {
        try {
        }
        catch (err) {
            console.log('UserService - create publication: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error creating publication',
            }, 500);
        }
    }
    async setSesionOfApp(requestDTO) {
        try {
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(requestDTO);
            if (!user) {
                return { status: 1, msg: 'User does not exist' };
            }
            const sesionExist = await this.sesionRepository.findOne({
                where: {
                    admin: isAdmin ? user : null,
                    user: isGuest ? user : null,
                    isFromCMS: false,
                },
            });
            if (!sesionExist) {
                return { status: 2, msg: 'sesion does not exist' };
            }
            sesionExist.playerId = requestDTO.playerId;
            await this.sesionRepository.save(sesionExist);
            console.log(templates_1.newIdSession(requestDTO.playerId));
            try {
                const response = await this.mailerService.sendMail({
                    to: user.email,
                    from: 'noreply@ocupath.com',
                    subject: 'Tu nuevo ID Ocupath.',
                    text: 'Your new id',
                    html: templates_1.newIdSession(requestDTO.playerId),
                });
                console.log({ response });
            }
            catch (error) {
                return {
                    status: 3,
                    msg: 'Email has not been sended, but sesion has been saved',
                };
            }
            return { status: 0 };
        }
        catch (err) {
            console.log('UserService - confirmPassword: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error confirming user password',
            }, 500);
        }
    }
    async confirmPassword(requestDTO) {
        try {
            let response = { status: 0 };
            const userExist = await this.userRepository.findOne({
                where: { email: requestDTO.email },
                select: ['id', 'name', 'email', 'password'],
            });
            if (userExist) {
                const match = await bcrypt.compare(requestDTO.password, userExist.password);
                if (!match) {
                    response = { status: 2 };
                }
            }
            else {
                response = { status: 1 };
            }
            return response;
        }
        catch (err) {
            console.log('UserService - confirmPassword: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error confirming user password',
            }, 500);
        }
    }
    async findUserDetail(requestDetailDTO, res) {
        try {
            const { user, isAdmin, isGuest, isSuperAdmin } = await this.getWhoIsRequesting(requestDetailDTO);
            if (!user) {
                return res.status(404);
            }
            let lastSuscription;
            if (!isSuperAdmin) {
                lastSuscription =
                    await this.suscriptionRepository.findOne({
                        select: ['invitations'],
                        where: {
                            admin: isAdmin ? user : null,
                            user: isGuest ? user : null,
                            isActive: true,
                        },
                    });
            }
            const profile = {
                id: parseInt(user.id),
                name: user.name,
                uuid: user.uuid,
                lastname: user.lastname,
                thumbnail: user.thumbnail,
                email: user.email,
                type: user.type.id,
                roomImage: user.roomImage,
                lastSuscription: {
                    invitations: !isSuperAdmin ? lastSuscription.invitations : 0
                }
            };
            return res.status(201).json({
                status: 0,
                profile
            });
        }
        catch (err) {
            console.log('UserService - findUserDetail: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting user',
            }, 500);
        }
    }
    async getAdminDetail(getAdminDetailDTO) {
        try {
            const admin = await this.adminRepository.findOne({
                relations: ['type', 'suscriptions'],
                where: {
                    uuid: getAdminDetailDTO.adminUuidToGet,
                },
            });
            const suscriptions = admin.suscriptions.map((suscription) => {
                return {
                    cost: suscription.cost,
                    createdAt: suscription.createdAt,
                    finishedAt: suscription.finishedAt,
                    isActive: suscription.isActive,
                    isDeleted: suscription.isDeleted,
                    startedAt: suscription.startedAt,
                    isWaiting: suscription.isWaiting,
                };
            });
            const lastSuscription = admin.suscriptions.find((suscription) => suscription.isActive);
            const statusSuscription = await this.getStatusSuscription(lastSuscription);
            if (!statusSuscription.isExpired && admin.isActive) {
                const statusExpired = await this.statusRepository.findOne(this.statusNumbers.ACTIVE);
                admin.status = statusExpired;
                await this.adminRepository.save(admin);
            }
            const suscriptionWaiting = admin.suscriptions.find((suscription) => suscription.isWaiting);
            let cost;
            let costWaiting = 0;
            if (suscriptionWaiting) {
                cost = suscriptionWaiting.cost;
                costWaiting = parseInt(cost);
            }
            let totalCost = (lastSuscription.cost * 1) + (costWaiting * 1);
            console.log({ totalCost });
            return {
                status: 0,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    lastname: admin.lastname,
                    thumbnail: admin.thumbnail,
                    uuid: admin.uuid,
                    email: admin.email,
                    type: admin.type.id,
                    lastSuscription,
                    suscriptionWaiting: suscriptionWaiting ? suscriptionWaiting : null,
                    totalCost
                },
            };
        }
        catch (err) {
            console.log('UserService - getAdminDetail: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting user',
            }, 500);
        }
    }
    async getUserDetail(getUserDetailDTO) {
        try {
            console.log({ getUserDetailDTO });
            const user = await this.userRepository.findOne({
                relations: ['type', 'suscriptions'],
                where: {
                    uuid: getUserDetailDTO.userUuidToGet,
                },
            });
            const suscriptions = user.suscriptions.map((suscription) => {
                return {
                    cost: suscription.cost,
                    createdAt: suscription.createdAt,
                    finishedAt: suscription.finishedAt,
                    isActive: suscription.isActive,
                    isDeleted: suscription.isDeleted,
                    startedAt: suscription.startedAt,
                };
            });
            const lastSuscription = user.suscriptions.find((suscription) => suscription.isActive);
            const status = this.getStatusSuscription(lastSuscription);
            console.log({ status });
            const suscriptionWaiting = user.suscriptions.find((suscription) => suscription.isWaiting);
            let cost;
            let costWaiting = 0;
            if (suscriptionWaiting) {
                cost = suscriptionWaiting.cost;
                costWaiting = parseInt(cost);
            }
            let totalCost = (lastSuscription.cost * 1) + (costWaiting * 1);
            return {
                status: 0,
                user: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    uuid: user.uuid,
                    email: user.email,
                    thumbnail: user.thumbnail,
                    type: user.type.id,
                    lastSuscription,
                    suscriptionWaiting,
                    totalCost
                },
            };
        }
        catch (err) {
            console.log('UserService - getUserDetail: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting user',
            }, 500);
        }
    }
    async getStatusSuscription(suscription) {
        try {
            let isExpired = false;
            if (moment(suscription.finishedAt).isAfter(new Date())) {
                isExpired = true;
            }
            return {
                isExpired: false
            };
        }
        catch (err) {
            console.log('UserService - getStatusSuscription: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting Status Suscription ',
            }, 500);
        }
    }
    async findUserChildrens(findUserChildrensDTO) {
        try {
            const dataChildrens = {
                admins: [],
                users: [],
            };
            const { user, isAdmin, isSuperAdmin } = await this.getWhoIsRequesting(findUserChildrensDTO);
            if (!user) {
                return {
                    status: 1,
                    msg: 'User not found',
                };
            }
            await this.clearSuscriptionsExpired();
            if (isSuperAdmin) {
                try {
                    dataChildrens.admins = await this.adminRepository.find({
                        select: [
                            'name',
                            'email',
                            'lastname',
                            'avatar',
                            'uuid',
                            'isActive',
                            'email',
                        ],
                        relations: ['suscriptions', 'status'],
                        where: {
                            superadmin: user,
                            isDeleted: false,
                        },
                    });
                }
                catch (error) {
                    console.log('Error en el query');
                    console.log({ error });
                }
                dataChildrens.users = await this.userRepository.find({
                    select: ['name', 'email', 'lastname', 'avatar', 'uuid', 'isActive'],
                    relations: ['suscriptions', 'status'],
                    where: {
                        superadmin: user,
                        isDeleted: false,
                    },
                });
            }
            if (isAdmin) {
                dataChildrens.users = await this.userRepository.find({
                    select: ['name', 'lastname', 'email', 'avatar', 'uuid', 'isActive'],
                    relations: ['suscriptions', 'status'],
                    where: {
                        admin: user,
                        isDeleted: false,
                    },
                });
            }
            const childrens = {
                admins: [],
                users: [],
            };
            if (dataChildrens.admins.length === 0 && dataChildrens.users.length === 0) {
                return { status: 2, msg: 'User has not data' };
            }
            const filterDataSuscription = (suscription) => {
                return {
                    cost: suscription.cost,
                    invitations: suscription.invitations,
                    createdAt: suscription.createdAt,
                    finishedAt: suscription.finishedAt,
                    isActive: suscription.isActive,
                    isDeleted: suscription.isDeleted,
                    startedAt: suscription.startedAt,
                };
            };
            const filterUsers = (child) => {
                const dataToSend = {
                    avatar: child.avatar,
                    email: child.email,
                    isActive: child.isActive,
                    uuid: child.uuid,
                    lastname: child.lastname,
                    name: child.name,
                    lastSuscription: null,
                    suscriptionWaiting: null,
                    status: child.status.id,
                };
                const lastSuscription = child.suscriptions.find((suscription) => suscription.isActive);
                const suscriptionWaiting = child.suscriptions.find((suscription) => suscription.isWaiting);
                dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
                if (suscriptionWaiting) {
                    dataToSend.suscriptionWaiting =
                        filterDataSuscription(suscriptionWaiting);
                }
                return dataToSend;
            };
            if (isSuperAdmin) {
                if (dataChildrens.admins.length > 0) {
                    console.log("1");
                    childrens.admins = dataChildrens.admins.map((child, i) => {
                        const dataToSend = {
                            avatar: child.avatar,
                            email: child.email,
                            isActive: child.isActive,
                            lastname: child.lastname,
                            uuid: child.uuid,
                            name: child.name,
                            lastSuscription: null,
                            suscriptionWaiting: null,
                            status: child.status.id,
                        };
                        const lastSuscription = child.suscriptions.find((suscription) => suscription.isActive);
                        const suscriptionWaiting = child.suscriptions.find((suscription) => suscription.isWaiting);
                        dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
                        if (suscriptionWaiting) {
                            dataToSend.suscriptionWaiting =
                                filterDataSuscription(suscriptionWaiting);
                        }
                        return dataToSend;
                    });
                    console.log({ childrens });
                }
                if (dataChildrens.users.length > 0) {
                    childrens.users = dataChildrens.users.map(filterUsers);
                }
            }
            else {
                if (dataChildrens.users.length > 0) {
                    childrens.users = dataChildrens.users.map(filterUsers);
                }
            }
            return {
                status: 0,
                profile: {
                    id: user.id,
                    name: user.name,
                    thumbnail: user.thumbnail,
                    uuid: user.uuid,
                    lastname: user.lastname,
                    email: user.email,
                    type: user.type.id,
                    roomImage: user.roomImage
                },
                childrens,
            };
        }
        catch (err) {
            console.log('UserService - findUserChildrens: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error getting user',
            }, 500);
        }
    }
    async clearSuscriptionsExpired() {
        try {
            const querySuscriptionsExpired = (type) => `suscription.finishedAt < :date AND suscription.isActive = true AND ${type}.isActive = true`;
            const querySuscriptionsWaiting = (type) => ` suscription.isWaiting = true AND ${type}.isActive = true AND ${type}.id IN (:...${type}sExpiredIds)`;
            const adminsExpired = await this.suscriptionRepository
                .createQueryBuilder('suscription')
                .innerJoinAndSelect('suscription.admin', 'admin')
                .select('suscription.id', 'suscriptionId')
                .addSelect('admin.id', 'adminId')
                .where(querySuscriptionsExpired('admin'), { date: new Date() })
                .execute();
            const guestExpired = await this.suscriptionRepository
                .createQueryBuilder('suscription')
                .innerJoinAndSelect('suscription.user', 'user')
                .select('suscription.id', 'suscriptionId')
                .addSelect('user.id', 'userId')
                .where(querySuscriptionsExpired('user'), { date: new Date() })
                .execute();
            let expiredStatus;
            const hasAdminsExpired = adminsExpired.length > 0;
            const hasGuestExpired = guestExpired.length > 0;
            if (hasAdminsExpired || hasGuestExpired) {
                expiredStatus = await this.statusRepository.findOne(this.statusNumbers.EXPIRED);
            }
            if (hasAdminsExpired) {
                const adminsExpiredIds = adminsExpired.map((suscription) => suscription.adminId);
                const sucriptionsAdminWaiting = await this.suscriptionRepository
                    .createQueryBuilder('suscription')
                    .innerJoinAndSelect('suscription.admin', 'admin')
                    .select('suscription.id', 'suscriptionId')
                    .addSelect('admin.id', 'adminId')
                    .where(querySuscriptionsWaiting('admin'), { adminsExpiredIds })
                    .execute();
                const adminsWithSuscriptionsWaitingIds = sucriptionsAdminWaiting.map((suscription) => suscription.adminId);
                const adminsWithNotSuscWaitingButExpiredIds = adminsExpiredIds.filter((adminId) => {
                    if (!adminsWithSuscriptionsWaitingIds.includes(adminId)) {
                        return adminId;
                    }
                });
                if (adminsWithNotSuscWaitingButExpiredIds.length > 0) {
                    await this.adminRepository
                        .createQueryBuilder()
                        .update()
                        .set({
                        status: expiredStatus,
                    })
                        .where('id IN (:...adminsWithNotSuscWaitingButExpiredIds)', {
                        adminsWithNotSuscWaitingButExpiredIds,
                    })
                        .execute();
                }
                console.log({ adminsWithSuscriptionsWaitingIds, adminsWithNotSuscWaitingButExpiredIds });
                if (adminsWithSuscriptionsWaitingIds.length > 0) {
                    const responseUpdateSuscriptionAdmin = await this.suscriptionRepository
                        .createQueryBuilder('suscription')
                        .innerJoin('suscription.admin', 'admin')
                        .update()
                        .set({
                        isActive: false,
                    })
                        .where('isActive = true AND admin.id IN (:...adminsWithSuscriptionsWaitingIds)', { adminsWithSuscriptionsWaitingIds })
                        .execute();
                    const responseUpdateSuscriptionNAdmin = await this.suscriptionRepository
                        .createQueryBuilder('suscription')
                        .innerJoin('suscription.admin', 'admin')
                        .update()
                        .set({
                        isActive: true,
                        isWaiting: false,
                    })
                        .where('isWaiting = true AND admin.id IN (:...adminsWithSuscriptionsWaitingIds)', { adminsWithSuscriptionsWaitingIds })
                        .execute();
                    console.log({
                        responseUpdateSuscriptionNAdmin,
                        responseUpdateSuscriptionAdmin,
                    });
                }
            }
            if (hasGuestExpired) {
                const usersExpiredIds = guestExpired.map((suscription) => suscription.userId);
                const sucriptionsUserWaiting = await this.suscriptionRepository
                    .createQueryBuilder('suscription')
                    .innerJoinAndSelect('suscription.user', 'user')
                    .select('suscription.id', 'suscriptionId')
                    .addSelect('user.id', 'userId')
                    .where(querySuscriptionsWaiting('user'), { usersExpiredIds })
                    .execute();
                const usersWithSuscriptionsWaitingIds = sucriptionsUserWaiting.map((suscription) => suscription.userId);
                const usersWithNotSuscWaitingButExpiredIds = usersExpiredIds.filter((userId) => {
                    if (!usersWithSuscriptionsWaitingIds.includes(userId)) {
                        return userId;
                    }
                });
                if (usersWithNotSuscWaitingButExpiredIds.length > 0) {
                    await this.userRepository
                        .createQueryBuilder()
                        .update()
                        .set({
                        status: expiredStatus,
                    })
                        .where('id IN (:...usersWithNotSuscWaitingButExpiredIds)', {
                        usersWithNotSuscWaitingButExpiredIds,
                    })
                        .execute();
                }
                if (usersWithSuscriptionsWaitingIds.length > 0) {
                    const responseUpdateSuscriptionUser = await this.suscriptionRepository
                        .createQueryBuilder('suscription')
                        .innerJoin('suscription.user', 'user')
                        .update()
                        .set({
                        isActive: false,
                    })
                        .where('isActive = true AND user.id IN (:...usersWithSuscriptionsWaitingIds)', { usersWithSuscriptionsWaitingIds })
                        .execute();
                    const responseUpdateSuscriptionNUser = await this.suscriptionRepository
                        .createQueryBuilder('suscription')
                        .innerJoin('suscription.user', 'user')
                        .update()
                        .set({
                        isActive: true,
                        isWaiting: false,
                    })
                        .where('isWaiting = true AND user.id IN (:...usersWithSuscriptionsWaitingIds)', { usersWithSuscriptionsWaitingIds })
                        .execute();
                    console.log({
                        responseUpdateSuscriptionUser,
                        responseUpdateSuscriptionNUser,
                    });
                }
            }
            return { status: 0 };
        }
        catch (err) {
            console.log('UserService - clearSuscriptionsExpired: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error cleaning Suscriptions Expired ',
            }, 500);
        }
    }
    async createSuperAdmin(createSuperAdminDTO) {
        if (createSuperAdminDTO.passwordmaster !== process.env.MASTER_PASS) {
            return {
                status: 1,
            };
        }
        const existSuperAdmin = await this.adminRepository.findOne({
            where: {
                email: createSuperAdminDTO.email,
                isDeleted: false,
            },
        });
        if (existSuperAdmin) {
            return {
                status: 2,
            };
        }
        const superAdminRole = await this.roleRepository.findOne({
            where: {
                name: this.roles.SUPERADMIN,
            },
        });
        const superAdminType = await this.roleRepository.findOne({
            where: {
                name: this.types.SUPERADMIN,
            },
        });
        try {
            const userPassword = await bcrypt.hash(createSuperAdminDTO.password, 12);
            const newUser = this.superAdminRepository.create({
                role: superAdminRole,
                type: superAdminType,
                name: createSuperAdminDTO.name,
                lastname: createSuperAdminDTO.lastname,
                email: createSuperAdminDTO.email,
                password: userPassword,
            });
            await this.superAdminRepository.save(newUser);
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
    async updateGuest(updateGuestDTO) {
        try {
            let response = {};
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(updateGuestDTO);
            if (!user) {
                return { status: 1, msg: 'user requesting not found' };
            }
            const guest = await this.userRepository.findOne({
                relations: ['admin', 'superadmin'],
                where: {
                    uuid: updateGuestDTO.userUuidToUpdate,
                    isActive: true,
                    admin: isAdmin ? user : null,
                    superadmin: isSuperAdmin ? user : null,
                },
            });
            if (!guest) {
                response = { status: 1, msg: 'user not found' };
            }
            if (updateGuestDTO.name) {
                user.name = updateGuestDTO.name;
            }
            if (updateGuestDTO.lastname) {
                user.lastname = updateGuestDTO.lastname;
            }
            await this.userRepository.save(user);
            response = {
                user: {
                    name: guest.name,
                    lastname: guest.lastname,
                },
            };
        }
        catch (err) {
            console.log('UserService - updateAdmin: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating  user',
            }, 500);
        }
    }
    async updateAdmin(updateUserAdminDTO) {
        try {
            let response = {};
            const { user: superadmin, isAdmin, isGuest, } = await this.getWhoIsRequesting(updateUserAdminDTO);
            if (!superadmin) {
                return { status: 1, msg: 'supadmin not found' };
            }
            const admin = await this.adminRepository.findOne({
                relations: ['superadmin'],
                where: {
                    uuid: updateUserAdminDTO.adminUuidToUpdate,
                    superadmin,
                },
            });
            if (!admin) {
                return { status: 1, msg: 'user not found' };
            }
            const updateSuscriptionDTO = {
                business: updateUserAdminDTO.business,
                cost: updateUserAdminDTO.cost,
                finishedAt: updateUserAdminDTO.finishedAt,
                startedAt: updateUserAdminDTO.startedAt,
                adminUuid: admin.uuid,
            };
            const lastSuscription = await this.suscriptionRepository.findOne({
                select: ['cost', 'startedAt', 'finishedAt', 'isActive'],
                where: {
                    admin,
                    user: null,
                    isActive: true,
                },
            });
            if (!lastSuscription) {
                return {
                    status: 1,
                };
            }
            this.suscriptionService.update(lastSuscription, updateSuscriptionDTO, admin, isAdmin, isGuest);
            await this.adminRepository.save(admin);
            response = {
                status: 0,
                user: {},
            };
            return response;
        }
        catch (err) {
            console.log('UserService - updateAdmin: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating  user',
            }, 500);
        }
    }
    async addNewPeriod(addNewSuscription) {
        try {
            let response = {};
            const { user, isAdmin, isSuperAdmin } = await this.getWhoIsRequesting(addNewSuscription);
            if (!isSuperAdmin && !isAdmin) {
                return { status: 1, msg: 'not allowed' };
            }
            const userToUpdateIsAdmin = addNewSuscription.typeToUpdate === this.typesNumbers.ADMIN;
            const userToUpdateIsGuest = addNewSuscription.typeToUpdate === this.typesNumbers.USER;
            let userToUpdate;
            let lastSuscription;
            let hasSuscriptionWaiting;
            if (userToUpdateIsAdmin) {
                userToUpdate = await this.adminRepository.findOne({
                    where: {
                        uuid: addNewSuscription.adminUuidToUpdate,
                        superadmin: user,
                    },
                    relations: ['status'],
                });
            }
            if (userToUpdateIsGuest) {
                userToUpdate = await this.userRepository.findOne({
                    where: {
                        uuid: addNewSuscription.guestUuidToUpdate,
                        admin: isAdmin ? user : null,
                        superadmin: isSuperAdmin ? user : null,
                    },
                    relations: ['status'],
                });
            }
            if (!userToUpdate) {
                return { status: 1, msg: 'user not found' };
            }
            if (!userToUpdate.isActive) {
                return { status: 500, msg: 'You cannot edit an inactive user' };
            }
            lastSuscription = await this.suscriptionRepository.findOne({
                where: {
                    admin: userToUpdateIsAdmin ? userToUpdate : null,
                    user: userToUpdateIsGuest ? userToUpdate : null,
                    isActive: true,
                    isWaiting: false,
                },
            });
            hasSuscriptionWaiting = await this.suscriptionRepository.findOne({
                where: {
                    admin: userToUpdateIsAdmin ? userToUpdate : null,
                    user: userToUpdateIsGuest ? userToUpdate : null,
                    isWaiting: true,
                    isActive: false,
                },
            });
            if (hasSuscriptionWaiting) {
                return { status: 3, msg: 'There is already a subscription waiting' };
            }
            const newSuscription = this.suscripctionRepository.create({
                admin: userToUpdateIsAdmin ? userToUpdate : null,
                user: userToUpdateIsGuest ? userToUpdate : null,
                cost: addNewSuscription.cost,
                startedAt: new Date(addNewSuscription.startedAt),
                finishedAt: new Date(addNewSuscription.finishedAt),
                invitations: addNewSuscription.invitations,
            });
            const statusLastSuscription = await this.getStatusSuscription(lastSuscription);
            const statusActive = await this.statusRepository.findOne(this.statusNumbers.ACTIVE);
            if (statusLastSuscription.isExpired) {
                lastSuscription.isActive = false;
                lastSuscription.isWaiting = false;
                newSuscription.isActive = true;
                newSuscription.isWaiting = false;
                await this.suscripctionRepository.save(lastSuscription);
                if (userToUpdateIsGuest) {
                    await this.userRepository
                        .createQueryBuilder()
                        .update()
                        .set({
                        status: statusActive
                    })
                        .where("id = :id", { id: user.id })
                        .execute();
                }
                if (userToUpdateIsAdmin) {
                    await this.adminRepository
                        .createQueryBuilder()
                        .update()
                        .set({
                        status: statusActive
                    })
                        .where("id = :id", { id: user.id })
                        .execute();
                }
            }
            if (!statusLastSuscription.isExpired) {
                lastSuscription.isActive = true;
                newSuscription.isActive = false;
                newSuscription.isWaiting = true;
                await this.suscripctionRepository.save(lastSuscription);
            }
            await this.suscripctionRepository.save(newSuscription);
            response = {
                status: 0,
                lastSuscription,
            };
            return response;
        }
        catch (err) {
            console.log('UserService - addNewPeriod: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating  user',
            }, 500);
        }
    }
    async getWhoIsRequesting(request) {
        try {
            let user;
            const isSuperAdmin = request.type === this.typesNumbers.SUPERADMIN;
            const isAdmin = request.type === this.typesNumbers.ADMIN;
            const isGuest = request.type === this.typesNumbers.USER;
            if (isAdmin) {
                user = await this.adminRepository.findOne({
                    relations: ['type', 'users'],
                    where: {
                        uuid: request.adminUuid,
                    },
                });
            }
            if (isSuperAdmin) {
                user = await this.superAdminRepository.findOne({
                    relations: ['type', 'users', 'admins'],
                    where: {
                        uuid: request.superAdminUuid,
                    },
                });
            }
            if (isGuest) {
                user = await this.userRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: request.userUuid,
                    },
                });
            }
            return { isAdmin, isSuperAdmin, isGuest, user };
        }
        catch (err) {
            console.log('UserService - getWhoIsRequesting: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error Changing Name  user',
            }, 500);
        }
    }
    async updateName(changeNameDto) {
        try {
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(changeNameDto);
            if (!user) {
                return { status: 1 };
            }
            user.name = changeNameDto.name;
            if (isAdmin) {
                await this.adminRepository.save(user);
            }
            if (isSuperAdmin) {
                await this.superAdminRepository.save(user);
            }
            if (isGuest) {
                await this.userRepository.save(user);
            }
            return {
                status: 0,
            };
        }
        catch (err) {
            console.log('UserService - ChangeName: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error Changing Name  user',
            }, 500);
        }
    }
    async updateUser(updateUserDTO) {
        try {
            console.log({ updateUserDTO });
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(updateUserDTO);
            if (!user) {
                return { status: 1 };
            }
            if (updateUserDTO.name) {
                console.log('Ha actualizado el nombre');
                user.name = updateUserDTO.name;
            }
            if (updateUserDTO.roomImage) {
                console.log('Ha actualizado el nombre');
                user.roomImage = updateUserDTO.roomImage;
            }
            if (updateUserDTO.avatar) {
                console.log('Ha actualizado el avatar');
                user.avatar = updateUserDTO.avatar;
                user.thumbnail = updateUserDTO.thumbnail;
            }
            if (isAdmin) {
                await this.adminRepository.save(user);
            }
            if (isSuperAdmin) {
                await this.superAdminRepository.save(user);
            }
            if (isGuest) {
                await this.userRepository.save(user);
            }
            return {
                status: 0,
                user: {
                    avatar: user.avatar,
                    thumbnail: user.thumbnail,
                    name: user.name,
                    roomImage: user.roomImage
                },
            };
        }
        catch (err) {
            console.log('UserService - updateAdmin: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating  user',
            }, 500);
        }
    }
    async getTypeAndUser(type, adminUuid, superAdminUuid) {
        try {
            let userRequesting;
            const isSuperAdmin = type === this.typesNumbers.SUPERADMIN;
            const isAdmin = type === this.typesNumbers.ADMIN;
            if (isAdmin) {
                userRequesting = await this.adminRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: adminUuid,
                    },
                });
            }
            if (isSuperAdmin) {
                userRequesting = await this.superAdminRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: superAdminUuid,
                    },
                });
            }
            if (!userRequesting) {
                return { status: 1 };
            }
            return {
                status: 0,
                user: userRequesting,
                isSuperAdmin,
                isAdmin,
            };
        }
        catch (err) {
            console.log('UserService - deleteUser: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting user',
            }, 500);
        }
    }
    async deleteUserAdmin(deleteAdminUserDTO) {
        try {
            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: deleteAdminUserDTO.superAdminUuid,
                },
            });
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            const admin = await this.adminRepository.findOne({
                relations: ['users', 'assets'],
                where: { uuid: deleteAdminUserDTO.adminUuidToStop },
            });
            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            await this.updateArrayUsers(admin.users, {
                isActive: false,
                isDeleted: true,
            }, {
                isActive: false,
                isDeleted: true,
            }, {
                isActive: false,
                isDeleted: true,
            });
            const assetsAdmin = await this.assetRepository.find({
                where: {
                    admin,
                },
            });
            const assetsAdminIds = assetsAdmin.map((asset) => asset.id);
            if (assetsAdminIds.length > 0) {
                await this.assetRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                    isActive: false,
                    isDeleted: true,
                })
                    .where('id IN (:...assetsAdminIds)', {
                    assetsAdminIds,
                })
                    .execute();
            }
            admin.isActive = false;
            admin.isDeleted = true;
            await this.adminRepository.save(admin);
            const userDTO = new user_dto_1.UserDTO(admin);
            return { status: 0, admin: userDTO };
        }
        catch (err) {
            console.log('UserService - deleteUser: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting user',
            }, 500);
        }
    }
    async deleteUser(deleteUserDTO) {
        try {
            let userRequesting;
            const isSuperAdmin = deleteUserDTO.type === this.typesNumbers.SUPERADMIN;
            const isAdmin = deleteUserDTO.type === this.typesNumbers.ADMIN;
            if (isAdmin) {
                userRequesting = await this.adminRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: deleteUserDTO.adminUuid,
                    },
                });
            }
            if (isSuperAdmin) {
                userRequesting = await this.superAdminRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: deleteUserDTO.superAdminUuid,
                    },
                });
            }
            if (!userRequesting) {
                return { status: 1 };
            }
            const userToDelete = await this.userRepository.findOne({
                relations: ['admin'],
                where: {
                    uuid: deleteUserDTO.userUuidToChange,
                    superadmin: isSuperAdmin ? userRequesting : null,
                    admin: isAdmin ? userRequesting : null,
                },
            });
            if (!userToDelete) {
                return { status: 2, msg: 'user not found' };
            }
            userToDelete.isActive = false;
            userToDelete.isDeleted = true;
            await this.userRepository.save(userToDelete);
            await this.suscriptionRepository
                .createQueryBuilder()
                .update()
                .set({
                isActive: false,
                isDeleted: true,
            })
                .where(`userId = ${userToDelete.id}`)
                .execute();
            const userDTO = new user_dto_1.UserDTO(userToDelete);
            return {
                status: 0,
                user: userDTO,
            };
        }
        catch (err) {
            console.log('UserService - deleteUser: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting user',
            }, 500);
        }
    }
    async updateArrayUsers(users, statusUser, statusSuscription, statusAsset) {
        const usersIds = users.map((user) => user.id);
        let assetsIds = [];
        if (usersIds.length !== 0) {
            await this.userRepository
                .createQueryBuilder()
                .update()
                .set(statusUser)
                .where('id IN (:...usersIds)', {
                usersIds,
            })
                .execute();
            if (statusSuscription) {
                const suscriptions = await this.suscripctionRepository.find({
                    where: {
                        user: typeorm_2.In(usersIds),
                    },
                });
                const suscriptionsIds = suscriptions.map((suscription) => suscription.id);
                await this.suscriptionRepository
                    .createQueryBuilder()
                    .update()
                    .set(statusSuscription)
                    .where('id IN (:...suscriptionsIds)', {
                    suscriptionsIds,
                })
                    .execute();
            }
            const assetsChildrens = await this.assetRepository.find({
                where: {
                    user: typeorm_2.In(usersIds),
                },
            });
            assetsIds = assetsChildrens.map((asset) => asset.id);
            if (assetsIds.length > 0) {
                await this.assetRepository
                    .createQueryBuilder()
                    .update()
                    .set(statusAsset)
                    .where('id IN (:...assetsIds)', {
                    assetsIds,
                })
                    .execute();
            }
        }
    }
    async suspendUserAdmin(pauseAdminUserDTO) {
        try {
            console.log({ pauseAdminUserDTO });
            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: pauseAdminUserDTO.superAdminUuid,
                },
            });
            console.log({ superAdmin });
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            const admin = await this.adminRepository.findOne({
                relations: ['users'],
                where: {
                    uuid: pauseAdminUserDTO.adminUuidToStop,
                    superadmin: superAdmin
                },
            });
            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            if (pauseAdminUserDTO.status) {
                const activeSuscription = await this.suscripctionRepository.findOne({
                    where: {
                        isActive: true,
                        admin
                    }
                });
                const statusSuscription = await this.getStatusSuscription(activeSuscription);
                if (statusSuscription.isExpired) {
                    const statusExpired = await this.statusRepository.findOne(this.statusNumbers.EXPIRED);
                    admin.status = statusExpired;
                }
                else {
                    const statusActive = await this.statusRepository.findOne(this.statusNumbers.ACTIVE);
                    admin.status = statusActive;
                }
            }
            else {
                const statusInactive = await this.statusRepository.findOne(this.statusNumbers.INACTIVE);
                admin.status = statusInactive;
            }
            await this.updateArrayUsers(admin.users, {
                isActive: pauseAdminUserDTO.status,
                isDeleted: false,
            }, null, { isActive: pauseAdminUserDTO.status, isDeleted: false });
            admin.isActive = pauseAdminUserDTO.status;
            await this.adminRepository.save(admin);
            const userDTO = new user_dto_1.UserDTO(admin);
            return { status: 0, admin: userDTO };
        }
        catch (err) {
            console.log('UserService - pauseUser: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error pausing user',
            }, 500);
        }
    }
    async suspendUser(pauseUserDTO) {
        try {
            console.log({ pauseUserDTO });
            const { isAdmin, isSuperAdmin, user } = await this.getWhoIsRequesting(pauseUserDTO);
            if (!user) {
                return { status: 1, msg: 'admin not found' };
            }
            const userToUpdate = await this.userRepository.findOne({
                relations: ['admin'],
                where: {
                    uuid: pauseUserDTO.userUuidToChange,
                    admin: isAdmin ? user : null,
                    superadmin: isSuperAdmin ? user : null
                },
            });
            console.log({ userToUpdate });
            if (!userToUpdate) {
                return { status: 2, msg: 'user not found' };
            }
            if (pauseUserDTO.status) {
                const activeSuscription = await this.suscripctionRepository.findOne({
                    where: {
                        isActive: true,
                        user: userToUpdate
                    }
                });
                const statusSuscription = await this.getStatusSuscription(activeSuscription);
                if (statusSuscription.isExpired) {
                    const statusExpired = await this.statusRepository.findOne(this.statusNumbers.EXPIRED);
                    userToUpdate.status = statusExpired;
                }
                else {
                    const statusActive = await this.statusRepository.findOne(this.statusNumbers.ACTIVE);
                    userToUpdate.status = statusActive;
                }
            }
            else {
                const statusInactive = await this.statusRepository.findOne(this.statusNumbers.INACTIVE);
                userToUpdate.status = statusInactive;
            }
            userToUpdate.isActive = pauseUserDTO.status;
            await this.userRepository.save(userToUpdate);
            const userDTO = new user_dto_1.UserDTO(userToUpdate);
            return { status: 0, user: userDTO };
        }
        catch (err) {
            console.log('UserService - pause user: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error pausing user',
            }, 500);
        }
    }
    async RequesLogout(reuestSesionLogOutDTO) {
        try {
            console.log({ reuestSesionLogOutDTO });
            const { isFromCMS } = reuestSesionLogOutDTO;
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(reuestSesionLogOutDTO);
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
};
__decorate([
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SimpleRequest, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "findUserDetail", null);
UserService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __param(4, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
    __param(5, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(6, typeorm_1.InjectRepository(token_entity_1.Token)),
    __param(7, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __param(8, typeorm_1.InjectRepository(type_entity_1.Type)),
    __param(9, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(10, typeorm_1.InjectRepository(status_entity_1.Status)),
    __param(11, typeorm_1.InjectRepository(invitation_entity_1.Invitation)),
    __param(12, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(13, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        suscription_service_1.SuscriptionService,
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
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map