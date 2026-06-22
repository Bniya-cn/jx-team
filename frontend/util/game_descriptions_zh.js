// 与 game_descriptions.cjs 数据同步，供 webpack 打包
import {
    DESCRIPTIONS_BY_APPID,
    getDescriptionLocalized,
    getDescriptionZh,
} from './game_descriptions.cjs';

export { DESCRIPTIONS_BY_APPID, getDescriptionLocalized, getDescriptionZh };
