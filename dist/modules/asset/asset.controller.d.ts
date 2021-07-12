import { CreateAssetDTO, DeleteAssetDto, GetAssetDTO } from './asset.dto';
import { AssetService } from './asset.service';
export declare class AssetController {
    private assetService;
    constructor(assetService: AssetService);
    getAllAssetsByUser(getAssetDTO: GetAssetDTO): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDTO: DeleteAssetDto): Promise<any>;
}
