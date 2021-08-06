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
const types_1 = require("../../../types");
const superadmin_entity_1 = require("./superadmin.entity");
const admin_entity_1 = require("./admin.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const suscription_dto_1 = require("../../suscription/suscription.dto");
const asset_entity_1 = require("../../asset/asset.entity");
const invitation_entity_1 = require("../invitation/invitation.entity");
const suscription_service_1 = require("../../suscription/suscription.service");
let UserService = class UserService {
    constructor(mailerService, suscriptionService, userRepository, suscripctionRepository, superAdminRepository, adminRepository, tokenRepository, assetRepository, typeRepository, roleRepository, invitationRepository, sesionRepository, suscriptionRepository) {
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
                console.log({ invitation });
                if (!invitation) {
                    let typeUserRequesting;
                    let admin = null;
                    let superAdmin = null;
                    if (request.adminUuid) {
                        typeUserRequesting = types_1.ADMIN;
                        admin = await this.adminRepository.findOne({
                            where: {
                                uuid: request.adminUuid,
                            },
                        });
                    }
                    if (request.superAdminUuid) {
                        typeUserRequesting = types_1.SUPER_ADMIN;
                        superAdmin = await this.superAdminRepository.findOne({
                            where: {
                                uuid: request.superAdminUuid,
                            },
                        });
                    }
                    if (!admin && !superAdmin) {
                        return {
                            status: 5,
                        };
                    }
                    let typeToInvite;
                    if (request.typeToInvite === types_1.ADMIN) {
                        typeToInvite = await this.typeRepository.findOne(types_1.ADMIN);
                    }
                    if (request.typeToInvite === types_1.USER_NORMAL) {
                        typeToInvite = await this.typeRepository.findOne(types_1.USER_NORMAL);
                    }
                    const invitationBase = {
                        email: request.email,
                        cost: 0,
                        finishedAt: new Date(request.finishedAt),
                        startedAt: new Date(request.startedAt),
                        admin,
                        superAdmin,
                        type: typeToInvite,
                        company: null,
                        invitations: null,
                        name: null,
                    };
                    if (typeToInvite.id === types_1.ADMIN) {
                        invitationBase.company = request.company;
                        invitationBase.invitations = request.invitations;
                        invitationBase.cost = request.cost;
                    }
                    if (typeToInvite.id === types_1.USER_NORMAL) {
                        invitationBase.name = request.name;
                        invitationBase.cost = request.cost;
                    }
                    const newInvitation = this.invitationRepository.create(Object.assign({}, invitationBase));
                    console.log({ newInvitation });
                    const registerToken = await this.invitationRepository.save(newInvitation);
                    invitationToSign = registerToken.id;
                }
                else {
                    invitationToSign = invitation.id;
                }
                jwtToken = await jwt.sign({ token: invitationToSign }, process.env.TOKEN_SECRET);
                console.log({ jwtToken });
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
            return { status, token: jwtToken };
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
    async setSesionOfApp(requestDTO) {
        try {
            const { isAdmin, isSuperAdmin, isGuest, user } = await this.getWhoIsRequesting(requestDTO);
            if (!user) {
                return { status: 1, msg: "User does not exist" };
            }
            const sesionExist = await this.sesionRepository.findOne({
                where: {
                    admin: isAdmin ? user : null,
                    user: isGuest ? user : null,
                    isFromCMS: false,
                }
            });
            if (!sesionExist) {
                return { status: 2, msg: "sesion does not exist" };
            }
            sesionExist.playerId = requestDTO.playerId;
            await this.sesionRepository.save(sesionExist);
            try {
            }
            catch (error) {
                return { status: 3, msg: "Email has not been sended, but sesion has been saved" };
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
            const { user } = await this.getWhoIsRequesting(requestDetailDTO);
            if (!user) {
                return res.status(404);
            }
            return res.status(201).json({
                status: 0,
                profile: {
                    id: user.id,
                    name: user.name,
                    uuid: user.uuid,
                    lastname: user.lastname,
                    thumbnail: user.thumbnail,
                    email: user.email,
                    type: user.type.id,
                },
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
                };
            });
            const lastSuscription = suscriptions.length > 0 ? suscriptions[0] : null;
            return {
                admin: {
                    id: admin.id,
                    name: admin.name,
                    lastname: admin.lastname,
                    uuid: admin.uuid,
                    email: admin.email,
                    type: admin.type.id,
                    lastSuscription,
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
            const user = await this.adminRepository.findOne({
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
            const lastSuscription = suscriptions.length > 0 ? suscriptions[0] : null;
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    uuid: user.uuid,
                    email: user.email,
                    type: user.type.id,
                    lastSuscription,
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
            if (isSuperAdmin) {
                dataChildrens.admins = await this.adminRepository.find({
                    select: ['name', 'lastname', 'avatar', 'uuid', 'isActive', 'email'],
                    relations: ['suscriptions', 'status'],
                    where: {
                        superadmin: user,
                        isDeleted: false,
                    },
                });
                console.log(dataChildrens.admins);
                dataChildrens.users = await this.userRepository.find({
                    select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                    relations: ['suscriptions', 'status'],
                    where: {
                        superadmin: user,
                        isDeleted: false,
                    },
                });
            }
            if (isAdmin) {
                console.log({ isAdmin });
                dataChildrens.users = await this.userRepository.find({
                    select: ['name', 'lastname', 'email', 'avatar', 'uuid', 'isActive'],
                    relations: ['suscriptions', 'status'],
                    where: {
                        admin: user,
                        isDeleted: false,
                    },
                });
            }
            console.log(dataChildrens.admins);
            console.log(dataChildrens.users);
            const childrens = {
                admins: [],
                users: [],
            };
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
                    status: child.status.id
                };
                const lastSuscription = child.suscriptions.find((suscription) => suscription.isActive);
                dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
                return dataToSend;
            };
            if (isSuperAdmin) {
                childrens.admins = dataChildrens.admins.map((child) => {
                    const dataToSend = {
                        avatar: child.avatar,
                        email: child.email,
                        isActive: child.isActive,
                        lastname: child.lastname,
                        uuid: child.uuid,
                        name: child.name,
                        lastSuscription: null,
                        status: child.status.id
                    };
                    const lastSuscription = child.suscriptions.find((suscription) => suscription.isActive);
                    dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
                    return dataToSend;
                });
                childrens.users = dataChildrens.users.map(filterUsers);
            }
            else {
                childrens.users = dataChildrens.users.map(filterUsers);
            }
            return {
                profile: {
                    id: user.id,
                    name: user.name,
                    uuid: user.uuid,
                    lastname: user.lastname,
                    email: user.email,
                    type: user.type.id,
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
    async getWhoIsRequesting(request) {
        try {
            let user;
            const isSuperAdmin = request.type === this.typesNumbers.SUPERADMIN;
            const isAdmin = request.type === this.typesNumbers.ADMIN;
            const isGuest = request.type === this.typesNumbers.USER;
            if (isAdmin) {
                user = await this.adminRepository.findOne({
                    relations: ['type'],
                    where: {
                        uuid: request.adminUuid,
                    },
                });
            }
            if (isSuperAdmin) {
                user = await this.superAdminRepository.findOne({
                    relations: ['type'],
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
    async updateArrayUsers(users, status) {
        const usersIds = users.map((user) => user.id);
        let assetsIds = [];
        if (usersIds.length !== 0) {
            await this.userRepository
                .createQueryBuilder()
                .update()
                .set(status)
                .where('id IN (:...usersIds)', {
                usersIds,
            })
                .execute();
            const suscriptions = await this.suscripctionRepository.find({
                where: {
                    user: typeorm_2.In(usersIds),
                },
            });
            const suscriptionsIds = suscriptions.map((suscription) => suscription.id);
            await this.suscriptionRepository
                .createQueryBuilder()
                .update()
                .set(status)
                .where('id IN (:...suscriptionsIds)', {
                suscriptionsIds,
            })
                .execute();
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
                    .set(status)
                    .where('id IN (:...allAssetsIds)', {
                    assetsIds,
                })
                    .execute();
            }
        }
    }
    async suspendUserAdmin(pauseAdminUserDTO) {
        try {
            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: pauseAdminUserDTO.superAdminUuid,
                },
            });
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            const admin = await this.adminRepository.findOne({
                relations: ['users'],
                where: { uuid: pauseAdminUserDTO.adminUuidToStop },
            });
            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            await this.updateArrayUsers(admin.users, {
                isActive: pauseAdminUserDTO.status,
                isDeleted: false,
            });
            const suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin,
                },
            });
            if (suscription) {
                suscription.isActive = pauseAdminUserDTO.status;
                await this.suscriptionRepository.save(suscription);
            }
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
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: pauseUserDTO.adminUuid,
                },
            });
            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }
            const user = await this.userRepository.findOne({
                relations: ['admin'],
                where: { uuid: pauseUserDTO.userUuidToChange, admin },
            });
            if (!user) {
                return { status: 2, msg: 'user not found' };
            }
            const suscription = await this.suscriptionRepository.findOne({
                where: {
                    user,
                },
            });
            user.isActive = pauseUserDTO.status;
            await this.userRepository.save(user);
            const userDTO = new user_dto_1.UserDTO(user);
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
    __param(10, typeorm_1.InjectRepository(invitation_entity_1.Invitation)),
    __param(11, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(12, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
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
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map