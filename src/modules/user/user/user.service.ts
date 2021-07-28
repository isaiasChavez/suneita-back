import {
  Injectable,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Token } from '../token/token.entity';
import { Type } from '../type/type.entity';
import { Role } from '../role/role.entity';
// import { Target } from "../../trivia/target/target.entity";
import { Sesion } from '../sesion/sesion.entity';
import {
  InviteUserDTO,
  ConfirmUserPassword,
  CreateSuperAdminDTO,
  UpdateUserDTO,
  UpdateUserAdminDTO,
  DeleteAdminUserDTO,
  FindUserChildrens,
  DeleteUserDTO,
  UserDTO,
  SimpleRequest,
} from './user.dto';
import { MailerService } from '@nestjs-modules/mailer';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import {
  ADMIN,
  USER_NORMAL,
  Roles,
  Types,
  SUPER_ADMIN,
  TypesNumbers,
} from 'src/types';
import { SuperAdmin } from './superadmin.entity';
import { Admin } from './admin.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
// import { SuscriptionService } from "src/modules/suscription/suscription.service";
import { UpdateSuscriptionDTO } from 'src/modules/suscription/suscription.dto';
import { Asset } from 'src/modules/asset/asset.entity';
import { Invitation } from '../invitation/invitation.entity';

type UserRes = {
  name: string;
  avatar: string;
  lastname: string;
  email: string;
  uuid: string;
  suscription;
};

@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    // private readonly suscriptionService: SuscriptionService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Suscription)
    private suscripctionRepository: Repository<Suscription>,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(Type) private typeRepository: Repository<Type>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,

    @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
    @InjectRepository(Suscription)
    private suscriptionRepository: Repository<Suscription>,
  ) {
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
  roles: Roles;
  types: Types;
  typesNumbers: TypesNumbers;
  async invite(request: InviteUserDTO): Promise<any> {
    try {
      console.log({request})
      let status = 0;
      let invitationToSign = '';
      let jwtToken = null;
      // Se verifica si el usuario ya cuenta con una invitacion enviada
      const userExist: User = await this.userRepository.findOne({
        where: { email: request.email },
      });

      let adminExist: Admin;

      if (!userExist) {
        adminExist = await this.adminRepository.findOne({
          where: { email: request.email },
        });
      }
      console.log({adminExist})

      if (!userExist && !adminExist) {
        // Se verifica si el usuario ya cuenta con una invitacion enviada
        const invitation = await this.invitationRepository.findOne({
          where: { email: request.email },
        });
        console.log({invitation})
        if (!invitation) {
          // Se obtiene el tipo de usuario de la persona que está solicitando la invitación
          let typeUserRequesting: number;
          let admin: Admin = null;
          let superAdmin: SuperAdmin = null;

          if (request.adminUuid) {
            typeUserRequesting = ADMIN;
            admin = await this.adminRepository.findOne({
              where: {
                uuid: request.adminUuid,
              },
            });
          }
          if (request.superAdminUuid) {
            typeUserRequesting = SUPER_ADMIN;
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

          let typeToInvite: Type;
          if (request.typeToInvite === ADMIN) {
            typeToInvite = await this.typeRepository.findOne(ADMIN);
          }
          if (request.typeToInvite === USER_NORMAL) {
            typeToInvite = await this.typeRepository.findOne(USER_NORMAL);
          }

          // Se crea nuevo token asociado al email del nuevo usuario
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

          //Hay que tener en cuenta que el usuario y el super usuario pueden enviar invitaciones.
          //Y hay que diferenciar las del super, hay que hacer dos diferenciaciones.

          if (typeToInvite.id === ADMIN) {
            invitationBase.company = request.company;
            invitationBase.invitations = request.invitations;
            invitationBase.cost = request.cost;
          }

          if (typeToInvite.id === USER_NORMAL) {
            invitationBase.name = request.name;
            invitationBase.cost = request.cost;
          }

          const newInvitation: Invitation = this.invitationRepository.create({
            ...invitationBase,
          });

          console.log({ newInvitation });
          // Se registra token
          const registerToken = await this.invitationRepository.save(
            newInvitation,
          );
          invitationToSign = registerToken.id;
        } else {
          invitationToSign = invitation.id;
        }

        // Se genera jwt para enviar por correo
        jwtToken = await jwt.sign(
          { token: invitationToSign },
          process.env.TOKEN_SECRET,
        );
        // Se envia correo

        console.log({jwtToken})

        const algo =await this.mailerService.sendMail({
          to: request.email,
          subject: 'Has sido invitado a Ocupath.',
          template: __dirname + '/invitacion.hbs',
          context: {
            url: jwtToken,
            type: request.type,
            email: request.email,
          },
        });
        console.log({algo})
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
      return { status, token: jwtToken };
    } catch (err) {
      console.log('UserService - invite: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error invitins user',
        },
        500,
      );
    }
  }

  async findAllUsers(uuid: number): Promise<any> {
    try {
      const admin: Admin = await this.adminRepository.findOne({
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
    } catch (err) {
      console.log('UserService - findAll: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting users list',
        },
        500,
      );
    }
  }

  async confirmPassword(requestDTO: ConfirmUserPassword): Promise<any> {
    try {
      let response = { status: 0 };

      const userExist = await this.userRepository.findOne({
        where: { email: requestDTO.email },
        select: ['id', 'name', 'email', 'password'],
      });

      if (userExist) {
        const match = await bcrypt.compare(
          requestDTO.password,
          userExist.password,
        );

        if (!match) {
          response = { status: 2 };
        }
      } else {
        response = { status: 1 };
      }

      return response;
    } catch (err) {
      console.log('UserService - confirmPassword: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error confirming user password',
        },
        500,
      );
    }
  }

  async findUserDetail(
    requestDetailDTO: SimpleRequest,
    @Res() res,
  ): Promise<any> {
    try {
      let user: SuperAdmin | Admin;

      const isSuperAdmin =
        requestDetailDTO.type === this.typesNumbers.SUPERADMIN;
      const isAdmin = requestDetailDTO.type === this.typesNumbers.ADMIN;
      if (isAdmin) {
        user = await this.adminRepository.findOne({
          relations: ['type'],
          where: {
            uuid: requestDetailDTO.adminUuid,
          },
        });
      }
      if (isSuperAdmin) {
        user = await this.superAdminRepository.findOne({
          relations: ['type'],
          where: {
            uuid: requestDetailDTO.superAdminUuid,
          },
        });
      }
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
          email: user.email,
          type: user.type.id,
        },
      });
    } catch (err) {
      console.log('UserService - findUserDetail: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting user',
        },
        500,
      );
    }
  }

  async findAdminDetail(requestEmail: string): Promise<any> {
    try {
      const user = await this.adminRepository.findOne({
        relations: ['type'],
        where: { email: requestEmail },
      });
      return {
        profile: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          uuid: user.uuid,
          email: user.email,
          type: user.type.id,
        },
      };
    } catch (err) {
      console.log('UserService - findUserDetail: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting user',
        },
        500,
      );
    }
  }
  async findUserChildrens(
    findUserChildrensDTO: FindUserChildrens,
  ): Promise<any> {
    try {
      let user: SuperAdmin | Admin;
      const dataChildrens: { admins: Admin[]; users: User[] } = {
        admins: [],
        users: [],
      };

      const isSuperAdmin =
        findUserChildrensDTO.type === this.typesNumbers.SUPERADMIN;
      const isAdmin = findUserChildrensDTO.type === this.typesNumbers.ADMIN;

      if (isAdmin) {
        user = await this.adminRepository.findOne({
          relations: ['type'],
          where: {
            uuid: findUserChildrensDTO.adminUuid,
            isActive: true,
            isDeleted: false,
          },
        });
      }
      if (isSuperAdmin) {
        user = await this.superAdminRepository.findOne({
          relations: ['type'],
          where: {
            uuid: findUserChildrensDTO.superAdminUuid,
            isActive: true,
          },
        });
      }
      if (!user) {
        return {
          status: 1,
          msg: 'User not found',
        };
      }
      if (isSuperAdmin) {
        dataChildrens.admins = await this.adminRepository.find({
          select: ['name', 'lastname', 'avatar', 'uuid', 'isActive', 'email'],
          relations: ['suscriptions'],
          where: {
            superadmin: user,
            isDeleted: false,
          },
        });
        dataChildrens.users = await this.userRepository.find({
          select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
          relations: ['suscriptions'],
          where: {
            superadmin: user,
            isDeleted: false,
          },
        });
      }
      if (isAdmin) {
        dataChildrens.users = await this.userRepository.find({
          select: ['name', 'lastname', 'email', 'avatar', 'uuid', 'isActive'],
          relations: ['suscriptions'],
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

      const filterUsers = (child) => {
        const dataToSend = {
          avatar: child.avatar,
          email: child.email,
          isActive: child.isActive,
          uuid: child.uuid,
          lastname: child.lastname,
          name: child.name,
          suscriptions: null,
          lastSuscription: null,
        };
        dataToSend.suscriptions = child.suscriptions.map(
          (suscription: Suscription) => {
            return {
              cost: suscription.cost,
              createdAt: suscription.createdAt,
              finishedAt: suscription.finishedAt,
              isActive: suscription.isActive,
              isDeleted: suscription.isDeleted,
              startedAt: suscription.startedAt,
            };
          },
        );
        dataToSend.lastSuscription = dataToSend.suscriptions[0]
          ? dataToSend.suscriptions[0]
          : null;
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
            suscriptions: null,
            lastSuscription: null,
          };
          dataToSend.suscriptions = child.suscriptions.map(
            (suscription: Suscription) => {
              return {
                cost: suscription.cost,
                invitations: suscription.invitations,
                createdAt: suscription.createdAt,
                finishedAt: suscription.finishedAt,
                isActive: suscription.isActive,
                isDeleted: suscription.isDeleted,
                startedAt: suscription.startedAt,
              };
            },
          );
          dataToSend.lastSuscription = dataToSend.suscriptions[0];
          return dataToSend;
        });
        childrens.users = dataChildrens.users.map(filterUsers);
      } else {
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
          childrens,
        },
      };
    } catch (err) {
      console.log('UserService - findUserChildrens: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting user',
        },
        500,
      );
    }
  }

  async createSuperAdmin(
    createSuperAdminDTO: CreateSuperAdminDTO,
  ): Promise<any> {
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
    } catch (err) {
      console.log('UserService - create: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creting users',
        },
        500,
      );
    }
  }

  async updateAdminUser(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any> {
    try {
      let response = {};
      const superadmin = await this.superAdminRepository.findOne({
        where: {
          uuid: updateUserAdminDTO.superAdminUuid,
        },
      });
      if (!superadmin) {
        return { status: 1, msg: 'supadmin not found' };
      }

      const user = await this.adminRepository.findOne({
        relations: ['superadmin'],
        where: { uuid: updateUserAdminDTO.adminUuid },
      });

      console.log({ user });

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
        let suscription: Suscription;
        if (
          updateUserAdminDTO.startedAt ||
          updateUserAdminDTO.finishedAt ||
          updateUserAdminDTO.cost ||
          updateUserAdminDTO.business
        ) {
          const updateSuscriptionDTO: UpdateSuscriptionDTO = {
            business: updateUserAdminDTO.business,
            cost: updateUserAdminDTO.cost,
            finishedAt: updateUserAdminDTO.finishedAt,
            startedAt: updateUserAdminDTO.startedAt,
            adminUuid: user.uuid,
          };
          suscription = await this.suscriptionRepository.findOne({
            select: ['cost', 'startedAt', 'finishedAt', 'isActive'],
            where: {
              admin: user,
            },
          });
          console.log({ suscription });

          if (!suscription) {
            return {
              status: 1,
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
          relations: ['type'],
          where: { uuid: user.uuid },
        });

        response = {
          user: {
            name: userToReturn.name,
            avatar: userToReturn.avatar,
            lastname: userToReturn.lastname,
            email: userToReturn.email,
            uuid: userToReturn.uuid,
            suscription,
          },
        };
      }

      return response;
    } catch (err) {
      console.log('UserService - updateAdmin: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating  user',
        },
        500,
      );
    }
  }
  async updateUser(updateUserDTO: UpdateUserDTO): Promise<any> {
    try {
      let response = {};

      const admin = await this.adminRepository.findOne({
        where: {
          uuid: updateUserDTO.adminUuid,
        },
      });
      console.log('pasó', { admin });

      if (!admin) {
        return { status: 1, msg: 'admin not found' };
      }

      const user = await this.userRepository.findOne({
        relations: ['admin'],
        where: { uuid: updateUserDTO.userUuid },
      });
      console.log({ user });

      if (!user) {
        response = { status: 1, msg: 'user not found' };
      } else {
        if (user.admin.id !== admin.id) {
          return {
            status: 5,
            msg: 'Unauthorized',
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
      console.log('UserService - updateAdmin: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating  user',
        },
        500,
      );
    }
  }

  async getTypeAndUser(
    type: number,
    adminUuid: string,
    superAdminUuid: string,
  ): Promise<any> {
    try {
      let userRequesting: SuperAdmin | Admin;
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
    } catch (err) {
      console.log('UserService - deleteUser: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting user',
        },
        500,
      );
    }
  }
  async deleteUserAdmin(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
    try {
      const superAdmin: SuperAdmin = await this.superAdminRepository.findOne({
        where: {
          uuid: deleteAdminUserDTO.superAdminUuid,
        },
      });

      if (!superAdmin) {
        return { status: 1, msg: 'super not found' };
      }

      const admin: Admin = await this.adminRepository.findOne({
        relations: ['users', 'assets'],
        where: { uuid: deleteAdminUserDTO.adminUuidToStop },
      });

      if (!admin) {
        return { status: 2, msg: 'admin not found' };
      }
      await this.updateArrayUsers(admin.users,{isActive:false,isDeleted:true})
      const assetsAdmin: Asset[] = await this.assetRepository.find({
        where: {
          admin,
        },
      });
      const assetsAdminIds = assetsAdmin.map((asset) => asset.id);
      if (assetsAdminIds.length>0) {
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
        admin.isActive = false
        admin.isDeleted = true
        await this.adminRepository.save(admin)

      const userDTO = new UserDTO(admin);

      return { status: 0, admin: userDTO };
    } catch (err) {
      console.log('UserService - deleteUser: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting user',
        },
        500,
      );
    }
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any> {
    try {
      let userRequesting: SuperAdmin | Admin;
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

      const userToDelete: User = await this.userRepository.findOne({
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
      const userDTO = new UserDTO(userToDelete);

      return {
        status: 0,
        user: userDTO,
      };
    } catch (err) {
      console.log('UserService - deleteUser: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting user',
        },
        500,
      );
    }
  }
  async updateArrayUsers(users:User[],status:{isActive:boolean,isDeleted:boolean}):Promise<any>{
      //Eliminar assets invitados administrador
      //Eliminar suscripciones invitados administrador
    const usersIds = users.map((user) => user.id);
      let assetsIds: string[] =[]
      if (usersIds.length!==0) {
        await this.userRepository
        .createQueryBuilder()
        .update()
        .set(status)
        .where('id IN (:...usersIds)', {
          usersIds,
        })
        .execute();
        const suscriptions: Suscription[] =
          await this.suscripctionRepository.find({
            where: {
              user: In(usersIds),
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
        const assetsChildrens: Asset[] = await this.assetRepository.find({
          where: {
            user: In(usersIds),
          },
        });
        assetsIds = assetsChildrens.map((asset) => asset.id);
        if (assetsIds.length>0) {
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

  async suspendUserAdmin(pauseAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
    try {
      const superAdmin = await this.superAdminRepository.findOne({
        where: {
          uuid: pauseAdminUserDTO.superAdminUuid,
        },
      });
      if (!superAdmin) {
        return { status: 1, msg: 'super not found' };
      }
      const admin: Admin = await this.adminRepository.findOne({
        relations: ['users'],
        where: { uuid: pauseAdminUserDTO.adminUuidToStop },
      });

      if (!admin) {
        return { status: 2, msg: 'admin not found' };
      }
      await this.updateArrayUsers(admin.users,{isActive:pauseAdminUserDTO.status,isDeleted:false})
      const suscription: Suscription = await this.suscriptionRepository.findOne(
        {
          where: {
            admin,
          },
        },
      );
      if (suscription) {
        suscription.isActive = pauseAdminUserDTO.status;
        await this.suscriptionRepository.save(suscription);
      }
      admin.isActive = pauseAdminUserDTO.status;
      await this.adminRepository.save(admin);
      const userDTO = new UserDTO(admin);

      return { status: 0, admin: userDTO };
    } catch (err) {
      console.log('UserService - pauseUser: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error pausing user',
        },
        500,
      );
    }
  }
  async suspendUser(pauseUserDTO: DeleteUserDTO): Promise<any> {
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
      const suscription: Suscription = await this.suscriptionRepository.findOne(
        {
          where: {
            user,
          },
        },
      );
      user.isActive = pauseUserDTO.status;
      await this.userRepository.save(user);
      // const assetsUser = await this.assetRepository.find({where: {
      //   user
      // }})
      const userDTO = new UserDTO(user);

      return { status: 0, user: userDTO };
    } catch (err) {
      console.log('UserService - pause user: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error pausing user',
        },
        500,
      );
    }
  }
}
