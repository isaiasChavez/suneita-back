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
import { Sesion } from '../sesion/sesion.entity';
import {
  InviteUserDTO,
  ConfirmUserPassword,
  CreateSuperAdminDTO,
  UpdateUserDTO,
  UpdateUserAdminDTO,
  DeleteAdminUserDTO,
  DeleteUserDTO,
  UserDTO,
  SimpleRequest,
  GetAdminDetailDTO,
  GetUserDetailDTO,
  ChangeName,
  UpdateGuestDTO,
  SetSesionAppId,
  ResponseProfile,
} from './user.dto';
import { Configuration } from '../../../config/config.keys';

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
  Statuses,
} from 'src/types';
import { SuperAdmin } from './superadmin.entity';
import { Admin } from './admin.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import {
  AddNewSuscriptionSuscriptionDTO,
  DeleteSuscriptionSuscriptionDTO,
  UpdateSuscriptionDTO,
} from 'src/modules/suscription/suscription.dto';
import { Asset } from 'src/modules/asset/asset.entity';
import { Invitation } from '../invitation/invitation.entity';
import { SuscriptionService } from 'src/modules/suscription/suscription.service';
import { error } from 'console';
import {
  newIdSession,
  newInvitationGuestTemplate,
  newInvitationTemplate,
} from 'src/templates/templates';
import { ReuestSesionLogOutDTO } from '../sesion/sesion.dto';
import { Status } from '../status/status.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly suscriptionService: SuscriptionService,
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
    @InjectRepository(Status) private statusRepository: Repository<Status>,
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
    this.statusNumbers = {
      ACTIVE: 1,
      INACTIVE: 2,
      EXPIRED: 3,
    };
  }
  roles: Roles;
  types: Types;
  statusNumbers: Statuses;
  typesNumbers: TypesNumbers;
  async invite(request: InviteUserDTO): Promise<any> {
    try {
      let status = 0;
      let invitationToSign = '';
      let jwtToken = null;

      const { isAdmin, isSuperAdmin, user } = await this.getWhoIsRequesting(
        request,
      );

      if (isAdmin) {
        console.log('ES ADMIN');
        const activeSuscription: Suscription = await this.suscripctionRepository.findOne(
          {
            where: {
              isActive: true,
              admin: user,
            },
          },
        );

        const statusActiveSuscription = await this.suscriptionService.getStatusSuscription(
          { suscription: activeSuscription },
        );
        console.log({ statusActiveSuscription });
        if (statusActiveSuscription.isExpired) {
          return {
            status: 405,
          };
        }

        const canAddMore = await this.suscriptionService.canAddMoreSuscriptions(
          { admin: user as Admin, suscription: activeSuscription },
        );

        if (!canAddMore.canAdd) {
          return {
            status: 405,
          };
        }
      }

      // Se verifica si el usuario ya cuenta con una invitacion enviada
      const hasGuestWithThisEmail: User = await this.userRepository.findOne({
        where: {
          email: request.email,
          isDeleted: false,
        },
      });

      let hasAdminWithThisEmail: Admin;
      if (!hasGuestWithThisEmail) {
        hasAdminWithThisEmail = await this.adminRepository.findOne({
          where: { email: request.email, isDeleted: false },
        });
      }

      if (!hasGuestWithThisEmail && !hasAdminWithThisEmail) {
        // Se verifica si el usuario ya cuenta con una invitacion enviada
        const hasAnInvitation = await this.invitationRepository.findOne({
          where: { email: request.email },
          relations: ['type'],
        });
        let registerToken: Invitation;
        let isAdminInvitingGuest: boolean;

        if (!hasAnInvitation) {
          // Se obtiene el tipo de usuario de la persona que está solicitando la invitación

          if (!user) {
            return {
              status: 5,
            };
          }

          let yesterday = moment(new Date()).add(-1, 'days');

          if (moment(request.startedAt).isBefore(yesterday)) {
            return {
              status: 6,
            };
          }

          let typeToInvite: Type;
          if (request.typeToInvite === this.typesNumbers.ADMIN) {
            typeToInvite = await this.typeRepository.findOne(ADMIN);
          }

          if (request.typeToInvite === this.typesNumbers.USER) {
            typeToInvite = await this.typeRepository.findOne(USER_NORMAL);
          }

          // Se crea nuevo token asociado al email del nuevo usuario
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

          //Hay que tener en cuenta que el usuario y el super usuario pueden enviar invitaciones.
          //Y hay que diferenciar las del super, hay que hacer dos diferenciaciones.

          if (typeToInvite.id === this.typesNumbers.ADMIN) {
            invitationBase.company = request.company;
            invitationBase.invitations = request.invitations;
            invitationBase.cost = request.cost;
          }
          const typeToInviteIsGuest =
            typeToInvite.id === this.typesNumbers.USER;
          isAdminInvitingGuest = isAdmin && typeToInviteIsGuest;
          console.log({ isAdmin, typeToInviteIsGuest, isAdminInvitingGuest });
          if (typeToInvite.id === this.typesNumbers.USER) {
            if (isAdmin) {
              const dateFinishAdmin: Suscription = await this.suscripctionRepository.findOne(
                {
                  where: {
                    admin: user,
                    isActive: true,
                  },
                },
              );
              invitationBase.finishedAt = dateFinishAdmin.finishedAt;
            }
            invitationBase.name = request.name;
            invitationBase.cost = request.cost;
          }

          const newInvitation: Invitation = this.invitationRepository.create({
            ...invitationBase,
          });

          console.log({ newInvitation });
          // Se registra token
          registerToken = await this.invitationRepository.save(newInvitation);
          invitationToSign = registerToken.id;
        } else {
          invitationToSign = hasAnInvitation.id;
        }

        // Se genera jwt para enviar por correo
        jwtToken = await jwt.sign(
          { token: invitationToSign },
          process.env.TOKEN_SECRET,
        );
        // Se envia correo
        console.log({ jwtToken });
        try {
          console.log({ isAdminInvitingGuest });
          if (!hasAnInvitation) {
            const responseEmail = await this.mailerService.sendMail({
              to: request.email,
              from: 'noreply@multivrsity.com', // sender address
              subject: 'Multivrsity has sent you an invitation.',
              text: 'Multivrsity has sent you an invitation', // plaintext body
              html: isAdminInvitingGuest
                ? newInvitationGuestTemplate({
                    token: jwtToken,
                  })
                : newInvitationTemplate({
                    token: jwtToken,
                    cost: registerToken.cost,
                    finish: moment(registerToken.finishedAt).calendar(),
                    invitations: registerToken.invitations,
                    start: moment(registerToken.startedAt).calendar(),
                  }),
            });
            console.log({ responseEmail });
            return {
              status: 0,
            };
          } else {
            isAdminInvitingGuest =
              isAdmin && hasAnInvitation.type.id === this.typesNumbers.USER;
            console.log({ isAdminInvitingGuest });

            const responseEmail = await this.mailerService.sendMail({
              to: request.email,
              from: 'noreply@multivrsity.com', // sender address
              subject: 'Multivrsity has sent you an invitation.',
              text: 'Multivrsity has sent you an invitation', // plaintext body
              html: isAdminInvitingGuest
                ? newInvitationGuestTemplate({
                    token: jwtToken,
                  })
                : newInvitationTemplate({
                    token: jwtToken,
                    cost: hasAnInvitation.cost,
                    finish: moment(hasAnInvitation.finishedAt).calendar(),
                    invitations: hasAnInvitation.invitations,
                    start: moment(hasAnInvitation.startedAt).calendar(),
                  }), // HTML body content
            });

            console.log({ responseEmail });
            return {
              status: 8,
            };
          }
        } catch (error) {
          console.log({ error });
          return {
            status: 3,
            msg: 'There is not a email whith this address',
          };
        }
      } else {
        if (
          (hasGuestWithThisEmail && hasGuestWithThisEmail.isActive) ||
          (hasAdminWithThisEmail && hasAdminWithThisEmail.isActive)
        ) {
          status = 9;
        } else {
          status = 8;
        }
      }
      return { status };
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

  async setSesionOfApp(requestDTO: SetSesionAppId): Promise<any> {
    try {
      const { isAdmin, isGuest, user } = await this.getWhoIsRequesting(
        requestDTO,
      );
      console.log({ requestDTO, isAdmin, isGuest, user });
      if (!user) {
        return { status: 1, msg: 'User does not exist' };
      }

      const sesionExist: Sesion = await this.sesionRepository.findOne({
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

      console.log(newIdSession({ id: requestDTO.playerId, name: user.name }));

      try {
        const response = await this.mailerService.sendMail({
          to: user.email,
          from: 'noreply@multivrsity.com', // sender address
          subject: 'Your new room id.',
          text: 'Your new room id Multivrsity.', // plaintext body
          html: newIdSession({ id: requestDTO.playerId, name: user.name }), // HTML body content
        });
        console.log({ response });
      } catch (error) {
        console.log({error})
        return {
          status: 3,
          msg: 'Email has not been sended, but sesion has been saved',
        };
      }

      return { status: 0 };
    } catch (err) {
      console.log('UserService - sesion id: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error setting id',
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

  //Información del usuario logueado
  async findUserDetail(
    requestDetailDTO: SimpleRequest,
    @Res() res,
  ): Promise<any> {
    try {
      const {
        user,
        isAdmin,
        isGuest,
        isSuperAdmin,
      } = await this.getWhoIsRequesting(requestDetailDTO);
      if (!user) {
        return res.status(404);
      }
      let lastSuscription: Suscription;
      if (!isSuperAdmin) {
        lastSuscription = await this.suscriptionRepository.findOne({
          select: ['invitations'],
          where: {
            admin: isAdmin ? user : null,
            user: isGuest ? user : null,
            isActive: true,
          },
        });
      }

      const profile: ResponseProfile = {
        id: parseInt(user.id),
        name: user.name,
        uuid: user.uuid,
        lastname: user.lastname,
        thumbnail: user.thumbnail,
        email: user.email,
        type: user.type.id,
        roomImage: user.roomImage,
        lastSuscription: {
          invitations: !isSuperAdmin ? lastSuscription.invitations : 0,
        },
      };
      return res.status(201).json({
        status: 0,
        profile,
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

  async getAdminDetail(getAdminDetailDTO: GetAdminDetailDTO): Promise<any> {
    try {
      const admin = await this.adminRepository.findOne({
        relations: ['type', 'suscriptions'],
        where: {
          uuid: getAdminDetailDTO.adminUuidToGet,
        },
      });
      const suscriptions = admin.suscriptions.map(
        (suscription: Suscription) => {
          return {
            cost: suscription.cost,
            createdAt: suscription.createdAt,
            finishedAt: suscription.finishedAt,
            isActive: suscription.isActive,
            isDeleted: suscription.isDeleted,
            startedAt: suscription.startedAt,
            isWaiting: suscription.isWaiting,
          };
        },
      );
      const lastSuscription = admin.suscriptions.find(
        (suscription: Suscription) => suscription.isActive,
      );
      const { isExpired } = await this.suscriptionService.getStatusSuscription({
        suscription: lastSuscription,
      });
      if (!isExpired && admin.isActive) {
        const statusExpired: Status = await this.statusRepository.findOne(
          this.statusNumbers.ACTIVE,
        );
        admin.status = statusExpired;
        await this.adminRepository.save(admin);
      }

      const suscriptionWaiting = admin.suscriptions.find(
        (suscription: Suscription) => suscription.isWaiting,
      );

      let cost;
      let costWaiting: number = 0;
      if (suscriptionWaiting) {
        cost = (suscriptionWaiting.cost as unknown) as string;
        costWaiting = parseInt(cost);
      }

      let totalCost: number = lastSuscription.cost * 1 + costWaiting * 1;
      // + costWaiting
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
          totalCost,
        },
      };
    } catch (err) {
      console.log('UserService - getAdminDetail: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting user',
        },
        500,
      );
    }
  }

  async getUserDetail(getUserDetailDTO: GetUserDetailDTO): Promise<any> {
    try {
      console.log({ getUserDetailDTO });

      const user = await this.userRepository.findOne({
        relations: ['type', 'suscriptions'],
        where: {
          uuid: getUserDetailDTO.userUuidToGet,
        },
      });

      const lastSuscription = user.suscriptions.find(
        (suscription: Suscription) => suscription.isActive,
      );

      const suscriptionWaiting = user.suscriptions.find(
        (suscription: Suscription) => suscription.isWaiting,
      );
      let cost;
      let costWaiting: number = 0;
      if (suscriptionWaiting) {
        cost = (suscriptionWaiting.cost as unknown) as string;
        costWaiting = parseInt(cost);
      }

      let totalCost: number = lastSuscription.cost * 1 + costWaiting * 1;

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
          totalCost,
        },
      };
    } catch (err) {
      console.log('UserService - getUserDetail: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting user',
        },
        500,
      );
    }
  }

  async findUserChildrens(findUserChildrensDTO: SimpleRequest): Promise<any> {
    try {
      const dataChildrens: { admins: Admin[]; users: User[] } = {
        admins: [],
        users: [],
      };
      const { user, isAdmin, isSuperAdmin } = await this.getWhoIsRequesting(
        findUserChildrensDTO,
      );

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
        } catch (error) {
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

      if (
        dataChildrens.admins.length === 0 &&
        dataChildrens.users.length === 0
      ) {
        return { status: 2, msg: 'User has not data' };
      }

      const filterDataSuscription = (suscription: Suscription) => {
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
      const filterUsers = (child: User) => {
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
        const lastSuscription: Suscription = child.suscriptions.find(
          (suscription: Suscription) => suscription.isActive,
        );
        const suscriptionWaiting: Suscription = child.suscriptions.find(
          (suscription: Suscription) => suscription.isWaiting,
        );

        dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
        if (suscriptionWaiting) {
          dataToSend.suscriptionWaiting = filterDataSuscription(
            suscriptionWaiting,
          );
        }
        return dataToSend;
      };
      if (isSuperAdmin) {
        if (dataChildrens.admins.length > 0) {
          console.log('1');

          childrens.admins = dataChildrens.admins.map((child: Admin, i) => {
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

            const lastSuscription: Suscription = child.suscriptions.find(
              (suscription: Suscription) => suscription.isActive,
            );
            const suscriptionWaiting: Suscription = child.suscriptions.find(
              (suscription: Suscription) => suscription.isWaiting,
            );

            dataToSend.lastSuscription = filterDataSuscription(lastSuscription);
            if (suscriptionWaiting) {
              dataToSend.suscriptionWaiting = filterDataSuscription(
                suscriptionWaiting,
              );
            }

            return dataToSend;
          });
          console.log({ childrens });
        }
        if (dataChildrens.users.length > 0) {
          childrens.users = dataChildrens.users.map(filterUsers);
        }
      } else {
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
          roomImage: user.roomImage,
        },
        childrens,
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

  async clearSuscriptionsExpired(): Promise<any> {
    try {
      const querySuscriptionsExpired = (type: string) =>
        `suscription.finishedAt < :date AND suscription.isActive = true AND ${type}.isActive = true`;
      const querySuscriptionsWaiting = (type: string) =>
        ` suscription.isWaiting = true AND ${type}.isActive = true AND ${type}.id IN (:...${type}sExpiredIds)`;

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

      let expiredStatus: Status;

      const hasAdminsExpired = adminsExpired.length > 0;
      const hasGuestExpired = guestExpired.length > 0;
      if (hasAdminsExpired || hasGuestExpired) {
        expiredStatus = await this.statusRepository.findOne(
          this.statusNumbers.EXPIRED,
        );
      }

      if (hasAdminsExpired) {
        const adminsExpiredIds = adminsExpired.map(
          (suscription) => suscription.adminId,
        );

        const sucriptionsAdminWaiting = await this.suscriptionRepository
          .createQueryBuilder('suscription')
          .innerJoinAndSelect('suscription.admin', 'admin')
          .select('suscription.id', 'suscriptionId')
          .addSelect('admin.id', 'adminId')
          .where(querySuscriptionsWaiting('admin'), { adminsExpiredIds })
          .execute();

        const adminsWithSuscriptionsWaitingIds = sucriptionsAdminWaiting.map(
          (suscription) => suscription.adminId,
        );

        const adminsWithNotSuscWaitingButExpiredIds = adminsExpiredIds.filter(
          (adminId) => {
            if (!adminsWithSuscriptionsWaitingIds.includes(adminId)) {
              return adminId;
            }
          },
        );
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

        console.log({
          adminsWithSuscriptionsWaitingIds,
          adminsWithNotSuscWaitingButExpiredIds,
        });

        if (adminsWithSuscriptionsWaitingIds.length > 0) {
          const responseUpdateSuscriptionAdmin = await this.suscriptionRepository
            .createQueryBuilder('suscription')
            .innerJoin('suscription.admin', 'admin')
            .update()
            .set({
              isActive: false,
            })
            .where(
              'isActive = true AND admin.id IN (:...adminsWithSuscriptionsWaitingIds)',
              { adminsWithSuscriptionsWaitingIds },
            )
            .execute();

          const responseUpdateSuscriptionNAdmin = await this.suscriptionRepository
            .createQueryBuilder('suscription')
            .innerJoin('suscription.admin', 'admin')
            .update()
            .set({
              isActive: true,
              isWaiting: false,
            })
            .where(
              'isWaiting = true AND admin.id IN (:...adminsWithSuscriptionsWaitingIds)',
              { adminsWithSuscriptionsWaitingIds },
            )
            .execute();
          console.log({
            responseUpdateSuscriptionNAdmin,
            responseUpdateSuscriptionAdmin,
          });
        }
      }
      if (hasGuestExpired) {
        const usersExpiredIds = guestExpired.map(
          (suscription) => suscription.userId,
        );
        const sucriptionsUserWaiting = await this.suscriptionRepository
          .createQueryBuilder('suscription')
          .innerJoinAndSelect('suscription.user', 'user')
          .select('suscription.id', 'suscriptionId')
          .addSelect('user.id', 'userId')
          .where(querySuscriptionsWaiting('user'), { usersExpiredIds })
          .execute();
        const usersWithSuscriptionsWaitingIds = sucriptionsUserWaiting.map(
          (suscription) => suscription.userId,
        );
        const usersWithNotSuscWaitingButExpiredIds = usersExpiredIds.filter(
          (userId) => {
            if (!usersWithSuscriptionsWaitingIds.includes(userId)) {
              return userId;
            }
          },
        );

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
            .where(
              'isActive = true AND user.id IN (:...usersWithSuscriptionsWaitingIds)',
              { usersWithSuscriptionsWaitingIds },
            )
            .execute();
          const responseUpdateSuscriptionNUser = await this.suscriptionRepository
            .createQueryBuilder('suscription')
            .innerJoin('suscription.user', 'user')
            .update()
            .set({
              isActive: true,
              isWaiting: false,
            })
            .where(
              'isWaiting = true AND user.id IN (:...usersWithSuscriptionsWaitingIds)',
              { usersWithSuscriptionsWaitingIds },
            )
            .execute();
          console.log({
            responseUpdateSuscriptionUser,
            responseUpdateSuscriptionNUser,
          });
        }
      }

      // const suscriptionsAdminExpiredIds = adminsExpired.map(
      //   (suscription) => suscription.suscriptionId,
      // );
      // const suscriptionsGuestExpiredIds = guestExpired.map(
      //   (suscription) => suscription.suscriptionId,
      // );
      return { status: 0 };
    } catch (err) {
      console.log('UserService - clearSuscriptionsExpired: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error cleaning Suscriptions Expired ',
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

  async updateGuest(updateGuestDTO: UpdateGuestDTO): Promise<any> {
    try {
      let response = {};

      const {
        isAdmin,
        isSuperAdmin,
        isGuest,
        user,
      } = await this.getWhoIsRequesting(updateGuestDTO);

      if (!user) {
        return { status: 1, msg: 'user requesting not found' };
      }

      const guest: User = await this.userRepository.findOne({
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

      //TODO: Actualizar el periodo

      await this.userRepository.save(user);

      response = {
        user: {
          name: guest.name,
          lastname: guest.lastname,
        },
      };

      // return response;
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

  async updateAdmin(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any> {
    try {
      let response = {};
      const {
        user: superadmin,
        isAdmin,
        isGuest,
      } = await this.getWhoIsRequesting(updateUserAdminDTO);

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

      const updateSuscriptionDTO: UpdateSuscriptionDTO = {
        business: updateUserAdminDTO.business,
        cost: updateUserAdminDTO.cost,
        finishedAt: updateUserAdminDTO.finishedAt,
        startedAt: updateUserAdminDTO.startedAt,
        adminUuid: admin.uuid,
      };

      const lastSuscription: Suscription = await this.suscriptionRepository.findOne(
        {
          select: ['cost', 'startedAt', 'finishedAt', 'isActive'],
          where: {
            admin,
            user: null,
            isActive: true,
          },
        },
      );

      if (!lastSuscription) {
        return {
          status: 1,
        };
      }
      this.suscriptionService.update(
        lastSuscription,
        updateSuscriptionDTO,
        admin,
        isAdmin,
        isGuest,
      );

      await this.adminRepository.save(admin);
      response = {
        status: 0,
        user: {},
      };

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

  async addNewPeriod(
    addNewSuscription: AddNewSuscriptionSuscriptionDTO,
  ): Promise<any> {
    try {
      let response = {};

      const { user, isAdmin, isSuperAdmin } = await this.getWhoIsRequesting(
        addNewSuscription,
      );

      if (!isSuperAdmin && !isAdmin) {
        return { status: 1, msg: 'not allowed' };
      }

      const userToUpdateIsAdmin: boolean =
        addNewSuscription.typeToUpdate === this.typesNumbers.ADMIN;
      const userToUpdateIsGuest: boolean =
        addNewSuscription.typeToUpdate === this.typesNumbers.USER;

      let userToUpdate: Admin | User;
      let lastSuscription: Suscription;
      let hasSuscriptionWaiting: Suscription;

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

      //inactivo
      //Expirado

      //Activo
      //pausado

      const statusLastSuscription = await this.suscriptionService.getStatusSuscription(
        { suscription: lastSuscription },
      );
      const statusActive: Status = await this.statusRepository.findOne(
        this.statusNumbers.ACTIVE,
      );

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
              status: statusActive,
            })
            .where('id = :id', { id: user.id })
            .execute();
        }
        if (userToUpdateIsAdmin) {
          await this.adminRepository
            .createQueryBuilder()
            .update()
            .set({
              status: statusActive,
            })
            .where('id = :id', { id: user.id })
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
    } catch (err) {
      console.log('UserService - addNewPeriod: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating  user',
        },
        500,
      );
    }
  }

  async deleteperiod(request: DeleteSuscriptionSuscriptionDTO): Promise<{ status: number,msg:string }> {
    try {
      const {
        isAdmin,
        isSuperAdmin,
        isGuest,
        user,
      } = await this.getWhoIsRequesting(request);

      if (!isSuperAdmin && !isAdmin) {
        return { status: 1, msg: 'not allowed' };
      }
      let userToUpdate: Admin | User;

      const userToUpdateIsAdmin: boolean = request.typeToUpdate === this.typesNumbers.ADMIN;
      const userToUpdateIsGuest: boolean = request.typeToUpdate === this.typesNumbers.USER;

      if (userToUpdateIsAdmin) {
        userToUpdate = await this.adminRepository.findOne({
          where: {
            uuid: request.adminUuidToUpdate,
            superadmin: user,
          },
          relations: ['status'],
        });
      }
      if (userToUpdateIsGuest) {
        userToUpdate = await this.userRepository.findOne({
          where: {
            uuid: request.guestUuidToUpdate,
            admin: isAdmin ? user : null,
            superadmin: isSuperAdmin ? user : null,
          },
          relations: ['status'],
        });
      }
      const suscriptionWaiting = await this.suscriptionRepository.findOne({
        where: {
          admin: userToUpdateIsAdmin ? userToUpdate : null,
          user: userToUpdateIsGuest ? userToUpdate : null,
          isDeleted:false,
          isWaiting: true,
          isActive: false,
        },
      });

      if (!suscriptionWaiting) {
        return { status: 401,msg:'not allowed' };
      }

      await this.suscripctionRepository.remove(suscriptionWaiting)

      console.log('Deleting period: ',{suscriptionWaiting});

      return { status: 0,msg:'ok' };
    } catch (err) {
      console.log('UserService - deleteperiod: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting period  user',
        },
        500,
      );
    }
  }

  async getWhoIsRequesting(
    request: SimpleRequest,
  ): Promise<{
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isGuest: boolean;
    user: SuperAdmin | Admin | User;
  }> {
    try {
      let user: SuperAdmin | Admin | User;
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
    } catch (err) {
      console.log('UserService - getWhoIsRequesting: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error Changing Name  user',
        },
        500,
      );
    }
  }

  //Actualiza el usuario loggeado
  async updateUser(updateUserDTO: UpdateUserDTO): Promise<any> {
    try {
      const {
        isAdmin,
        isSuperAdmin,
        isGuest,
        user,
      } = await this.getWhoIsRequesting(updateUserDTO);
      if (!user) {
        return { status: 1 };
      }
      if (updateUserDTO.name) {
        user.name = updateUserDTO.name;
      }
      if (updateUserDTO.roomImage) {
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
          roomImage: user.roomImage,
        },
      };
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
      await this.updateArrayUsers(
        admin.users,
        {
          isActive: false,
          isDeleted: true,
        },
        {
          isActive: false,
          isDeleted: true,
        },
        {
          isActive: false,
          isDeleted: true,
        },
      );

      const assetsAdmin: Asset[] = await this.assetRepository.find({
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

      await this.suscriptionRepository
        .createQueryBuilder()
        .update()
        .set({
          isActive: false,
          isDeleted: true,
        })
        .where(`userId = ${userToDelete.id}`)
        .execute();
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
  async updateArrayUsers(
    users: User[],
    statusUser: { isActive: boolean; isDeleted: boolean },
    statusSuscription: { isActive: boolean; isDeleted: boolean },
    statusAsset: { isActive: boolean; isDeleted: boolean },
  ): Promise<any> {
    //Eliminar assets invitados administrador
    //Eliminar suscripciones invitados administrador
    const usersIds = users.map((user) => user.id);
    let assetsIds: string[] = [];
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
        const suscriptions: Suscription[] = await this.suscripctionRepository.find(
          {
            where: {
              user: In(usersIds),
            },
          },
        );
        const suscriptionsIds = suscriptions.map(
          (suscription) => suscription.id,
        );
        await this.suscriptionRepository
          .createQueryBuilder()
          .update()
          .set(statusSuscription)
          .where('id IN (:...suscriptionsIds)', {
            suscriptionsIds,
          })
          .execute();
      }
      const assetsChildrens: Asset[] = await this.assetRepository.find({
        where: {
          user: In(usersIds),
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

  async suspendUserAdmin(pauseAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
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
      const admin: Admin = await this.adminRepository.findOne({
        relations: ['users'],
        where: {
          uuid: pauseAdminUserDTO.adminUuidToStop,
          superadmin: superAdmin,
        },
      });
      if (!admin) {
        return { status: 2, msg: 'admin not found' };
      }

      if (pauseAdminUserDTO.status) {
        const activeSuscription: Suscription = await this.suscripctionRepository.findOne(
          {
            where: {
              isActive: true,
              admin,
            },
          },
        );
        const statusSuscription = await this.suscriptionService.getStatusSuscription(
          { suscription: activeSuscription },
        );
        if (statusSuscription.isExpired) {
          const statusExpired: Status = await this.statusRepository.findOne(
            this.statusNumbers.EXPIRED,
          );
          admin.status = statusExpired;
        } else {
          const statusActive: Status = await this.statusRepository.findOne(
            this.statusNumbers.ACTIVE,
          );
          admin.status = statusActive;
        }
      } else {
        const statusInactive: Status = await this.statusRepository.findOne(
          this.statusNumbers.INACTIVE,
        );
        admin.status = statusInactive;
      }

      await this.updateArrayUsers(
        admin.users,
        {
          isActive: pauseAdminUserDTO.status,
          isDeleted: false,
        },
        null,
        { isActive: pauseAdminUserDTO.status, isDeleted: false },
      );
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
      const { isAdmin, isSuperAdmin, user } = await this.getWhoIsRequesting(
        pauseUserDTO,
      );

      if (!user) {
        return { status: 1, msg: 'admin not found' };
      }

      const userToUpdate = await this.userRepository.findOne({
        relations: ['admin'],
        where: {
          uuid: pauseUserDTO.userUuidToChange,
          admin: isAdmin ? user : null,
          superadmin: isSuperAdmin ? user : null,
        },
      });

      if (!userToUpdate) {
        return { status: 2, msg: 'user not found' };
      }
      if (pauseUserDTO.status) {
        const activeSuscription: Suscription = await this.suscripctionRepository.findOne(
          {
            where: {
              isActive: true,
              user: userToUpdate,
            },
          },
        );
        const statusSuscription = await this.suscriptionService.getStatusSuscription(
          { suscription: activeSuscription },
        );
        if (statusSuscription.isExpired) {
          const statusExpired: Status = await this.statusRepository.findOne(
            this.statusNumbers.EXPIRED,
          );
          userToUpdate.status = statusExpired;
        } else {
          const statusActive: Status = await this.statusRepository.findOne(
            this.statusNumbers.ACTIVE,
          );
          userToUpdate.status = statusActive;
        }
      } else {
        const statusInactive: Status = await this.statusRepository.findOne(
          this.statusNumbers.INACTIVE,
        );
        userToUpdate.status = statusInactive;
      }

      userToUpdate.isActive = pauseUserDTO.status;
      await this.userRepository.save(userToUpdate);
      const userDTO = new UserDTO(userToUpdate);

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

  async RequesLogout(
    reuestSesionLogOutDTO: ReuestSesionLogOutDTO,
  ): Promise<any> {
    try {
      console.log({ reuestSesionLogOutDTO });
      const { isFromCMS } = reuestSesionLogOutDTO;
      const {
        isAdmin,
        isSuperAdmin,
        isGuest,
        user,
      } = await this.getWhoIsRequesting(reuestSesionLogOutDTO);
      let response = null;
      let actualSesion: Sesion;
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
    } catch (err) {
      console.log('SesionService - RequesLogout: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error requesting logout',
        },
        500,
      );
    }
  }
}
