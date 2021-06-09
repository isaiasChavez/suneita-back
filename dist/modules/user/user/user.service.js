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
const mailer_1 = require("@nestjs-modules/mailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const types_1 = require("../../../types");
const superadmin_entity_1 = require("./superadmin.entity");
const admin_entity_1 = require("./admin.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const suscription_dto_1 = require("../../suscription/suscription.dto");
const asset_entity_1 = require("../../asset/asset.entity");
let UserService = class UserService {
    constructor(mailerService, userRepository, suscripctionRepository, superAdminRepository, adminRepository, tokenRepository, typeRepository, roleRepository, sesionRepository, suscriptionRepository) {
        this.mailerService = mailerService;
        this.userRepository = userRepository;
        this.suscripctionRepository = suscripctionRepository;
        this.superAdminRepository = superAdminRepository;
        this.adminRepository = adminRepository;
        this.tokenRepository = tokenRepository;
        this.typeRepository = typeRepository;
        this.roleRepository = roleRepository;
        this.sesionRepository = sesionRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.roles = {
            SUPERADMIN: "SUPERADMIN",
            ADMIN: "ADMIN",
            USER: "USER",
        };
        this.types = {
            SUPERADMIN: "SUPERADMIN",
            ADMIN: "ADMIN",
            USER: "USER",
        };
    }
    async invite(request) {
        try {
            console.log("***", { request }, "***");
            let status = 0;
            let tokenToSign = "";
            let userExist = await this.userRepository.findOne({
                where: { email: request.email },
            });
            let adminExist = await this.adminRepository.findOne({
                where: { email: request.email },
            });
            if (!userExist && !adminExist) {
                const token = await this.tokenRepository.findOne({
                    where: { email: request.email },
                });
                if (!token) {
                    const user = await this.typeRepository.findOne(request.type);
                    let admin = null;
                    let superAdmin = null;
                    let userType;
                    if (user.id === types_1.ADMIN) {
                        userType = await this.typeRepository.findOne(types_1.USER_NORMAL);
                        admin = await this.adminRepository.findOne({
                            where: {
                                uuid: request.adminUuid
                            }
                        });
                    }
                    if (user.id === types_1.SUPER_ADMIN) {
                        userType = await this.typeRepository.findOne(types_1.ADMIN);
                        superAdmin = await this.superAdminRepository.findOne({
                            where: {
                                uuid: request.superAdminUuid
                            }
                        });
                    }
                    if (!admin && !superAdmin) {
                        return {
                            status: 5
                        };
                    }
                    let newToken = this.tokenRepository.create({
                        email: request.email,
                        type: userType,
                        admin,
                        superAdmin
                    });
                    console.log({ newToken });
                    const registerToken = await this.tokenRepository.save(newToken);
                    tokenToSign = registerToken.id;
                }
                else {
                    tokenToSign = token.id;
                }
                const jwtToken = await jwt.sign({ token: tokenToSign }, process.env.TOKEN_SECRET);
                console.log({ jwtToken });
                await this.mailerService.sendMail({
                    to: request.email,
                    subject: "Has sido invitado a Ocupath.",
                    template: 'https://bioderma-space.sfo2.digitaloceanspaces.com/assetsapp/templates/invitacion.hbs',
                    context: {
                        url: jwtToken,
                        type: request.type,
                        email: request.email,
                    },
                });
            }
            else {
                if (userExist.isActive || adminExist.isActive) {
                    status = 9;
                }
                else {
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
        }
        catch (err) {
            console.log("UserService - invite: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error invitins user",
            }, 500);
        }
    }
    async findAllUsers(uuid) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid
                }
            });
            const users = await this.userRepository.find({
                select: ["id", "name", "email"],
                relations: ["type"],
                where: {
                    isActive: true,
                    admin
                },
            });
            return { users };
        }
        catch (err) {
            console.log("UserService - findAll: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting users list",
            }, 500);
        }
    }
    async confirmPassword(requestDTO) {
        try {
            let response = { status: 0 };
            const userExist = await this.userRepository.findOne({
                where: { email: requestDTO.email },
                select: ["id", "name", "email", "password"],
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
            console.log("UserService - confirmPassword: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error confirming user password",
            }, 500);
        }
    }
    async findUserDetail(requestEmail) {
        console.log("findUserDetail");
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
        }
        catch (err) {
            console.log("UserService - findUserDetail: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting user",
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
                isDeleted: false
            }
        });
        if (existSuperAdmin) {
            return {
                status: 2
            };
        }
        const superAdminRole = await this.roleRepository.findOne({
            where: {
                name: this.roles.SUPERADMIN
            }
        });
        const superAdminType = await this.roleRepository.findOne({
            where: {
                name: this.types.SUPERADMIN
            }
        });
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
        }
        catch (err) {
            console.log("UserService - create: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error creting users",
            }, 500);
        }
    }
    async createAdmin(createAdminDTO) {
        try {
            const token = await this.tokenRepository.findOne({
                where: {
                    email: createAdminDTO.email
                }
            });
            if (!token) {
                return {
                    status: 10,
                    error: "No hay un token para este usuario",
                };
            }
            const superadmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: createAdminDTO.superAdminUuid
                }
            });
            if (!superadmin) {
                return {
                    status: 1,
                    error: "No existe el superusuario"
                };
            }
            const existUser = await this.adminRepository.findOne({
                where: {
                    email: createAdminDTO.email,
                    isDeleted: false
                }
            });
            if (existUser) {
                return {
                    status: 2,
                    error: "Este email ya existe",
                    existUser
                };
            }
            const adminRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.ADMIN
                }
            });
            const adminType = await this.roleRepository.findOne({
                where: {
                    name: this.types.ADMIN
                }
            });
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
            });
            const userSuscription = this.suscriptionRepository.create({
                admin: newAdmin,
                cost: createAdminDTO.cost,
                startedAt: new Date(createAdminDTO.startedAt),
                finishedAt: new Date(createAdminDTO.finishedAt),
            });
            await this.suscriptionRepository.save(userSuscription);
            return { status: 0 };
        }
        catch (err) {
            console.log("UserService - create: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error creting users",
            }, 500);
        }
    }
    async create(createUserDTO) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: createUserDTO.adminUuid
                }
            });
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                };
            }
            const existUser = await this.userRepository.findOne({
                where: {
                    email: createUserDTO.email,
                    isDeleted: false
                }
            });
            if (existUser) {
                return {
                    status: 2,
                    error: "Este email ya existe"
                };
            }
            const userRole = await this.roleRepository.findOne({
                where: {
                    name: this.roles.ADMIN
                }
            });
            const userType = await this.roleRepository.findOne({
                where: {
                    name: this.types.SUPERADMIN
                }
            });
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
        }
        catch (err) {
            console.log("UserService - create: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting users",
            }, 500);
        }
    }
    async updateAdminUser(updateUserAdminDTO) {
        try {
            let response = {};
            const superadmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: updateUserAdminDTO.superAdminUuid
                }
            });
            console.log({ superadmin });
            if (!superadmin) {
                return { status: 1, msg: 'supadmin not found' };
            }
            let user = await this.adminRepository.findOne({
                relations: ["superadmin"],
                where: { uuid: updateUserAdminDTO.adminUuid },
            });
            console.log({ user });
            if (!user) {
                response = { status: 1, msg: 'user not found' };
            }
            else {
                if (updateUserAdminDTO.name) {
                    user.name = updateUserAdminDTO.name;
                }
                if (updateUserAdminDTO.lastname) {
                    user.lastname = updateUserAdminDTO.lastname;
                }
                if (updateUserAdminDTO.avatar) {
                    user.avatar = updateUserAdminDTO.avatar;
                }
                let suscription;
                if (updateUserAdminDTO.startedAt || updateUserAdminDTO.finishedAt || updateUserAdminDTO.cost || updateUserAdminDTO.business) {
                    const updateSuscriptionDTO = {
                        business: updateUserAdminDTO.business,
                        cost: updateUserAdminDTO.cost,
                        finishedAt: updateUserAdminDTO.finishedAt,
                        startedAt: updateUserAdminDTO.startedAt,
                        adminUuid: user.uuid
                    };
                    suscription = await this.suscriptionRepository.findOne({
                        select: ["cost", "startedAt", "finishedAt", "isActive"],
                        where: {
                            admin: user
                        }
                    });
                    console.log({ suscription });
                    if (!suscription) {
                        return {
                            status: 1
                        };
                    }
                    if (updateSuscriptionDTO.finishedAt) {
                        suscription.finishedAt = new Date(updateSuscriptionDTO.finishedAt);
                    }
                    if (updateSuscriptionDTO.startedAt) {
                        suscription.startedAt = new Date(updateSuscriptionDTO.startedAt);
                    }
                    if (updateSuscriptionDTO.cost && updateSuscriptionDTO.cost > 0) {
                        suscription.cost = updateSuscriptionDTO.cost;
                    }
                    this.suscriptionRepository.save(suscription);
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
        }
        catch (err) {
            console.log("UserService - updateAdmin: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error updating  user",
            }, 500);
        }
    }
    async updateUser(updateUserDTO) {
        try {
            let response = {};
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: updateUserDTO.adminUuid
                }
            });
            console.log("pasó", { admin });
            if (!admin) {
                return { status: 1, msg: 'admin not found' };
            }
            let user = await this.userRepository.findOne({
                relations: ["admin"],
                where: { uuid: updateUserDTO.userUuid },
            });
            console.log({ user });
            if (!user) {
                response = { status: 1, msg: 'user not found' };
            }
            else {
                if (user.admin.id !== admin.id) {
                    return {
                        status: 5,
                        msg: "Unauthorized"
                    };
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
                console.log({ user });
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
        }
        catch (err) {
            console.log("UserService - updateAdmin: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error updating  user",
            }, 500);
        }
    }
    async deleteUserAdmin(deleteAdminUserDTO) {
        try {
            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: deleteAdminUserDTO.superAdminUuid
                }
            });
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            const admin = await this.adminRepository.findOne({
                relations: ["users", "assets"],
                where: { uuid: deleteAdminUserDTO.adminUuid },
            });
            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            console.log("admin.users", admin.users);
            await Promise.all(admin.users.map(async (user) => {
                console.log({ user });
                user.isActive = false;
                user.isDeleted = true;
                await this.userRepository.save(user);
            }));
            await Promise.all(admin.assets.map(async (asset) => {
                asset.isActive = false;
                asset.isDeleted = true;
                await this.userRepository.save(asset);
            }));
            const suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            });
            if (suscription) {
                suscription.isActive = false;
                suscription.isDeleted = true;
                const temtSusp = this.suscriptionRepository.create({});
                suscription.finishedAt = temtSusp.createdAt;
                await this.suscriptionRepository.save(suscription);
            }
            admin.isActive = false;
            admin.isDeleted = true;
            await this.adminRepository.save(admin);
            return { status: 0 };
        }
        catch (err) {
            console.log("UserService - deleteUser: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error deleting user",
            }, 500);
        }
    }
    async deleteUser(deleteUserDTO) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: deleteUserDTO.adminUuid
                }
            });
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
            userToDelete.isActive = false;
            userToDelete.isDeleted = true;
            await this.userRepository.save(userToDelete);
            return { status: 0 };
        }
        catch (err) {
            console.log("UserService - deleteUser: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error deleting user",
            }, 500);
        }
    }
    async suspendUserAdmin(pauseAdminUserDTO) {
        try {
            const superAdmin = await this.superAdminRepository.findOne({
                where: {
                    uuid: pauseAdminUserDTO.superAdminUuid
                }
            });
            if (!superAdmin) {
                return { status: 1, msg: 'super not found' };
            }
            let admin = await this.adminRepository.findOne({
                relations: ["users"],
                where: { uuid: pauseAdminUserDTO.adminUuid },
            });
            if (!admin) {
                return { status: 2, msg: 'admin not found' };
            }
            await Promise.all(admin.users.map(async (user) => {
                if (!user.isDeleted) {
                    user.isActive = pauseAdminUserDTO.status;
                    await this.userRepository.save(user);
                }
            }));
            const suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            });
            if (suscription) {
                suscription.isActive = pauseAdminUserDTO.status;
                await this.suscriptionRepository.save(suscription);
            }
            admin.isActive = pauseAdminUserDTO.status;
            await this.adminRepository.save(admin);
            return { status: 0 };
        }
        catch (err) {
            console.log("UserService - pauseUser: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error pausing user",
            }, 500);
        }
    }
    async pauseUser(pauseUserDTO) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: pauseUserDTO.adminUuid
                }
            });
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
                };
            }
            user.isActive = false;
            await this.userRepository.save(user);
            return { status: 0 };
        }
        catch (err) {
            console.log("UserService - pause user: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error pausing user",
            }, 500);
        }
    }
    async requestPasswordReset(requestEmail) {
        try {
            console.log("***", { requestEmail }, "***");
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
                const jwtToken = await jwt.sign({ token: registerToken.id }, "Bi0d3rmaTokenJWT.");
                await this.mailerService.sendMail({
                    to: requestEmail,
                    subject: "Recuperacion de contraseña.",
                    template: "./recovery.hbs",
                    context: {
                        url: jwtToken,
                        email: requestEmail,
                    },
                });
            }
            else {
                response = { status: 1 };
            }
            return response;
        }
        catch (err) {
            console.log("UserService - requestPasswordReset: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error requesting password reset",
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
                const tokenExist = await this.tokenRepository.findOne(jwtDecoded.token);
                if (tokenExist) {
                    const passwordHashed = await bcrypt.hash(requestDTO.password, 12);
                    let userToUpdate = await this.userRepository.findOne({
                        where: { email: requestDTO.email },
                    });
                    userToUpdate.password = passwordHashed;
                    await this.userRepository.save(userToUpdate);
                    await this.tokenRepository.remove(tokenExist);
                }
                else {
                    response = { status: 10 };
                }
            }
            return response;
        }
        catch (err) {
            console.log("UserService - passwordRecovery: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error ressetign password",
            }, 500);
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(2, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __param(3, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
    __param(4, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(5, typeorm_1.InjectRepository(token_entity_1.Token)),
    __param(6, typeorm_1.InjectRepository(type_entity_1.Type)),
    __param(7, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(8, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(9, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
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