import { t } from './i18n';

const DESCRIPTION_FIELD = {
    zh: 'descriptionZh',
    ja: 'descriptionJa',
    ko: 'descriptionKo',
};

const GAME_TITLES = {
    'Hollow Knight': { zh: '空洞骑士', ja: 'Hollow Knight', ko: '할로우 나이트' },
    'Stardew Valley': { zh: '星露谷物语', ja: 'Stardew Valley', ko: '스타듀 밸리' },
    'Hades': { zh: '哈迪斯', ja: 'Hades', ko: '하데스' },
    'Subnautica': { zh: '深海迷航', ja: 'Subnautica', ko: '서브노티카' },
    'Black Myth: Wukong': { zh: '黑神话：悟空', ja: '黒神話：悟空', ko: '검은 신화: 오공' },
    'Cyberpunk 2077': { zh: '赛博朋克 2077', ja: 'サイバーパンク 2077', ko: '사이버펑크 2077' },
    'Elden Ring': { zh: '艾尔登法环', ja: 'エルデンリング', ko: '엘든 링' },
    'Baldur\'s Gate 3': { zh: '博德之门 3', ja: 'バルダーズ・ゲート3', ko: '발더스 게이트 3' },
    'Red Dead Redemption 2': { zh: '荒野大镖客：救赎 2', ja: 'レッド・デッド・リデンプション2', ko: '레드 데드 리뎀션 2' },
    'Grand Theft Auto V': { zh: '侠盗猎车手 V', ja: 'グランド・セフト・オートV', ko: '그랜드 테프트 오토 V' },
    'Portal 2': { zh: '传送门 2', ja: 'ポータル 2', ko: '포탈 2' },
    'Forza Horizon 5': { zh: '极限竞速：地平线 5', ja: 'Forza Horizon 5', ko: '포르자 호라이즌 5' },
    'Sid Meier’s Civilization® VI': { zh: '文明 VI', ja: 'シヴィライゼーション VI', ko: '문명 VI' },
    'Sid Meier\'s Civilization VI': { zh: '文明 VI', ja: 'シヴィライゼーション VI', ko: '문명 VI' },
};

export const getLocalizedGameTitle = (game, locale = 'zh') => {
    if (!game) return '';
    const title = game.title || game.name || '';
    if (locale === 'en') return title;
    const entry = GAME_TITLES[title] || GAME_TITLES[title.replace(/®|™/g, '').trim()];
    if (entry) {
        return entry[locale] || entry.zh || title;
    }
    return title;
};

export const getLocalizedDescription = (game, locale = 'zh', overrideText) => {
    if (!game) return '';
    if (overrideText) return overrideText;
    if (locale === 'en') {
        return game.shortDescription || game.description || '';
    }
    const field = DESCRIPTION_FIELD[locale];
    const localized = field ? game[field] : '';
    return localized || game.descriptionZh || game.description || game.shortDescription || '';
};

export const getPriceLabel = (game, currency = '¥', locale = 'zh') => {
    if (!game) return `${currency}0.00`;
    if (game.price === 0) return t('free', locale);
    const effective = game.sale_price != null && game.sale_price < game.price ? game.sale_price : game.price;
    if (effective === null || effective === undefined) return t('no_price', locale);
    return `${currency}${(effective / 100).toFixed(2)}`;
};

export const getOriginalPriceLabel = (game, currency = '¥') => {
    if (!game) return null;
    if (game.sale_price != null && game.sale_price < game.price) {
        return `${currency}${(game.price / 100).toFixed(2)}`;
    }
    if (game.originalPrice === null || game.originalPrice === undefined) return null;
    if (game.originalPrice <= 0 || game.originalPrice === game.price) return null;
    return `${currency}${(game.originalPrice / 100).toFixed(2)}`;
};

export const getDiscountLabel = (game) => {
    if (!game) return null;
    if (game.sale_price != null && game.sale_price < game.price) {
        const pct = Math.round((1 - game.sale_price / game.price) * 100);
        return `-${pct}%`;
    }
    if (!game.discount) return null;
    return `-${game.discount}%`;
};

export const getTitleCardImage = (game) => {
    if (!game) return null;
    const images = Object.values(game.gameImages || {});
    return images.find((image) => image.img_type === 'title-card') || null;
};

export const getScreenshotImages = (game, limit) => {
    if (!game) return [];
    const images = Object.values(game.gameImages || {}).filter((image) => image.img_type === 'screenshot');
    const sliced = typeof limit === 'number' ? images.slice(0, limit) : images;

    if (sliced.length > 0) {
        return sliced;
    }

    const fallback = getTitleCardImage(game);
    return fallback ? [fallback] : [];
};

export const getGalleryImages = (game) => {
    const screenshots = getScreenshotImages(game);
    if (screenshots.length > 0) {
        return screenshots;
    }

    const fallback = getTitleCardImage(game);
    return fallback ? [fallback] : [];
};

export const getReleaseDateLabel = (game, locale = 'zh') => {
    if (!game) return '';
    if (game.releaseDate) return game.releaseDate;
    if (!game.release_date) return t('tbd', locale);

    const date = new Date(game.release_date);
    if (Number.isNaN(date.getTime())) return t('tbd', locale);

    const dateLocaleMap = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP', ko: 'ko-KR' };
    const dateLocale = dateLocaleMap[locale] || 'zh-CN';
    return date.toLocaleDateString(dateLocale, {
        timeZone: 'utc',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const MOCK_REQUIREMENTS = {
    367520: {
        zh: {
            minimum: { os: 'Windows 7 (64位)', cpu: 'Intel Core 2 Duo E8400', ram: '4 GB RAM', gpu: 'GeForce 9800 GTX+ (512MB)', dx: 'Version 10', storage: '9 GB 可用空间' },
            recommended: { os: 'Windows 10 (64位)', cpu: 'Intel Core i5', ram: '8 GB RAM', gpu: 'GeForce GTX 560', dx: 'Version 11', storage: '9 GB 可用空间' }
        },
        en: {
            minimum: { os: 'Windows 7 (64-bit)', cpu: 'Intel Core 2 Duo E8400', ram: '4 GB RAM', gpu: 'GeForce 9800 GTX+ (512MB)', dx: 'Version 10', storage: '9 GB available space' },
            recommended: { os: 'Windows 10 (64-bit)', cpu: 'Intel Core i5', ram: '8 GB RAM', gpu: 'GeForce GTX 560', dx: 'Version 11', storage: '9 GB available space' }
        }
    },
    1145360: {
        zh: {
            minimum: { os: 'Windows 7 SP1 (64位)', cpu: 'Dual Core 2.4 GHz', ram: '4 GB RAM', gpu: 'Intel HD 5300 或 GeForce GTS 450 (1GB)', dx: 'Version 10', storage: '15 GB 可用空间' },
            recommended: { os: 'Windows 10 (64位)', cpu: 'Dual Core 3.0 GHz+', ram: '8 GB RAM', gpu: 'GeForce GTX 650 或 Radeon HD 7750 (2GB)', dx: 'Version 10', storage: '15 GB 可用空间' }
        },
        en: {
            minimum: { os: 'Windows 7 SP1 (64-bit)', cpu: 'Dual Core 2.4 GHz', ram: '4 GB RAM', gpu: 'Intel HD 5300 or GeForce GTS 450 (1GB)', dx: 'Version 10', storage: '15 GB available space' },
            recommended: { os: 'Windows 10 (64-bit)', cpu: 'Dual Core 3.0 GHz+', ram: '8 GB RAM', gpu: 'GeForce GTX 650 or Radeon HD 7750 (2GB)', dx: 'Version 10', storage: '15 GB available space' }
        }
    },
    2358720: {
        zh: {
            minimum: { os: 'Windows 10 (64位)', cpu: 'Intel Core i5-8400 / AMD Ryzen 5 1600', ram: '16 GB RAM', gpu: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB', dx: 'Version 11', storage: '130 GB 可用空间 (固态硬盘)' },
            recommended: { os: 'Windows 10/11 (64位)', cpu: 'Intel Core i7-9700 / AMD Ryzen 5 5500', ram: '16 GB RAM', gpu: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT', dx: 'Version 12', storage: '130 GB 可用空间 (固态硬盘)' }
        },
        en: {
            minimum: { os: 'Windows 10 (64-bit)', cpu: 'Intel Core i5-8400 / AMD Ryzen 5 1600', ram: '16 GB RAM', gpu: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB', dx: 'Version 11', storage: '130 GB available space (SSD)' },
            recommended: { os: 'Windows 10/11 (64-bit)', cpu: 'Intel Core i7-9700 / AMD Ryzen 5 5500', ram: '16 GB RAM', gpu: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT', dx: 'Version 12', storage: '130 GB available space (SSD)' }
        }
    }
};

const DEFAULT_REQUIREMENTS = {
    zh: {
        minimum: { os: 'Windows 10 (64位)', cpu: 'Intel Core i5 或同等处理器', ram: '8 GB RAM', gpu: 'NVIDIA GTX 1050 或 AMD 同等显卡', dx: 'Version 11', storage: '20 GB 可用空间' },
        recommended: { os: 'Windows 10/11 (64位)', cpu: 'Intel Core i7 或同等处理器', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1660 / RTX 2060', dx: 'Version 12', storage: '20 GB 可用空间' }
    },
    en: {
        minimum: { os: 'Windows 10 (64-bit)', cpu: 'Intel Core i5 or equivalent', ram: '8 GB RAM', gpu: 'NVIDIA GTX 1050 or AMD equivalent', dx: 'Version 11', storage: '20 GB available space' },
        recommended: { os: 'Windows 10/11 (64-bit)', cpu: 'Intel Core i7 or equivalent', ram: '16 GB RAM', gpu: 'NVIDIA GTX 1660 / RTX 2060', dx: 'Version 12', storage: '20 GB available space' }
    }
};

export const getSystemRequirements = (game, locale = 'zh') => {
    if (!game) return DEFAULT_REQUIREMENTS[locale] || DEFAULT_REQUIREMENTS.zh;
    const req = MOCK_REQUIREMENTS[game.id];
    if (req) {
        return req[locale] || req.zh;
    }
    return DEFAULT_REQUIREMENTS[locale] || DEFAULT_REQUIREMENTS.zh;
};

