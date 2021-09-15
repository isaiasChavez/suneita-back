import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Admin } from '../user/user/admin.entity'
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto'
import { Asset } from './asset.entity'
import { User } from '../user/user/user.entity'
import { TypeAsset } from './type-asset/type-asset.entity'
import { UserService } from '../user/user/user.service'
import { SimpleRequest } from '../user/user/user.dto'
@Injectable()
export class AssetService {
  constructor (
    private readonly userService: UserService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(TypeAsset)
    private typeAssetRepository: Repository<TypeAsset>,
  ) {}
  types = {
    IMAGE: 1,
    IMAGE360: 2,
    VIDEO: 3,
    VIDEO360: 4,
  }

  async getAllAssetsByUser (getAssetDTO: SimpleRequest): Promise<any> {
    try {
      const {
        isAdmin,
        isGuest,
        user,
      } = await this.userService.getWhoIsRequesting(getAssetDTO)
      if (!user) {
        return {
          status: 1,
          error: 'No existe el usuario',
        }
      }
      let assets: Asset[]
      if (isGuest) {
        assets = await this.assetRepository.find({
          select: ['url', 'thumbnail', 'uuid'],
          relations: ['typeAsset'],
          where: {
            user,
          },
        })
      }
      if (isAdmin) {
        assets = await this.assetRepository.find({
          select: ['url', 'thumbnail', 'uuid'],
          relations: ['typeAsset'],
          where: {
            admin: user,
            isDeleted: false,
          },
        })
      }
      const images: Asset[] = assets.filter(
        asset => asset.typeAsset.id === this.types.IMAGE,
      )
      const images360: Asset[] = assets.filter(
        asset => asset.typeAsset.id === this.types.IMAGE360,
      )
      const videos: Asset[] = assets.filter(
        asset => asset.typeAsset.id === this.types.VIDEO,
      )
      const videos360: Asset[] = assets.filter(
        asset => asset.typeAsset.id === this.types.VIDEO360,
      )
      console.log({ images, videos360, videos, images360 })
      return {
        assets: { images, videos360, videos, images360 },
        status: 0,
      }
    } catch (err) {
      console.log('AssetService - get: ', err)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting assets',
        },
        500,
      )
    }
  }

  async create (createAssetDTO: CreateAssetDTO): Promise<any> {
    try {
      const {
        isAdmin,
        isGuest,
        user,
      } = await this.userService.getWhoIsRequesting(createAssetDTO)
      if (!user) {
        return {
          status: 1,
          error: 'No existe el usuario',
        }
      }
      const typeAsset = await this.typeAssetRepository.findOne(
        createAssetDTO.typeAsset,
      )
      if (!typeAsset) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'No permitido',
          },
          403,
        )
      }
      let asset: Asset
      if (isAdmin) {
        asset = this.assetRepository.create({
          user: null,
          admin: user,
          url: createAssetDTO.url,
          typeAsset,
        })
      }
      if (isGuest) {
        asset = this.assetRepository.create({
          user,
          admin: null,
          url: createAssetDTO.url,
          typeAsset,
        })
      }

      await this.assetRepository.save(asset)
      return {
        asset: {
          url: asset.url,
          thumbnail: asset.thumbnail,
          typeAsset,
        },
        status: 0,
      }
    } catch (err) {
      console.log('AssetService - create: ', err)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating asset',
        },
        500,
      )
    }
  }
  async delete (deleteAssetDto: DeleteAssetDto): Promise<any> {
    try {
      const {
        isAdmin,
        isGuest,
        user,
      } = await this.userService.getWhoIsRequesting(deleteAssetDto)

      if (!user) {
        return {
          status: 1,
          error: 'No existe el usuario',
        }
      }
      let asset: Asset
      if (isAdmin) {
        asset = await this.assetRepository.findOne({
          relations: ['admin','typeAsset'],
          where: {
            uuid: deleteAssetDto.uuid,
            admin: user,
          },
        })
      }
      if (isGuest) {
        asset = await this.assetRepository.findOne({
          relations: ['admin','typeAsset'],
          where: {
            uuid: deleteAssetDto.uuid,
            user,
          },
        })
      }
      if (!asset) {
        return { status: 2, msg: 'asset not found' }
      }

      await this.assetRepository.remove(asset)
      return {
        status: 0,
        asset,
      }
    } catch (err) {
      console.log('AssetService - invite: ', err)

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting asset',
        },
        500,
      )
    }
  }
}
