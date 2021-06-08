import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { AssetService } from './asset.service';
export declare class AssetController {
    private assetService;
    constructor(assetService: AssetService);
    getAllAssetsByAdmin(uuid: any): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDTO: DeleteAssetDto): Promise<any>;
}
