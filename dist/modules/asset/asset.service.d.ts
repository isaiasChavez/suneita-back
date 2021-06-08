import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { Asset } from './asset.entity';
export declare class AssetService {
    private adminRepository;
    private assetRepository;
    constructor(adminRepository: Repository<Admin>, assetRepository: Repository<Asset>);
    getAllAssetsByAdmin(uuid: any): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDto: DeleteAssetDto): Promise<any>;
}
