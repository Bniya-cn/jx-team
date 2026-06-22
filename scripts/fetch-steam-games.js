#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_PATH = path.resolve(__dirname, '../src/mock/games.json');
const SEARCH_ENDPOINT = 'https://store.steampowered.com/api/storesearch/';
const DETAILS_ENDPOINT = 'https://store.steampowered.com/api/appdetails';
const FEATURED_CATEGORIES_ENDPOINT = 'https://store.steampowered.com/api/featuredcategories';
const FEATURED_ENDPOINT = 'https://store.steampowered.com/api/featured/';
const DEFAULT_TARGET_COUNT = 170;
const EXCLUDED_NAME_PATTERN =
    /\b(demo|soundtrack|telemetry|starter pack|shortcut kit|bundle|dlc|ost|editor|dedicated server|playtest)\b/i;
const APPID_OVERRIDES = {
    'Civilization VI': 289070,
};

const GAME_NAMES = [
    'Black Myth: Wukong',
    'Stardew Valley',
    'Cyberpunk 2077',
    'Elden Ring',
    'Hollow Knight',
    'Baldur\'s Gate 3',
    'Red Dead Redemption 2',
    'Grand Theft Auto V',
    'The Witcher 3: Wild Hunt',
    'Sekiro: Shadows Die Twice',
    'Hades',
    'Celeste',
    'Dead Cells',
    'Terraria',
    'Valheim',
    'It Takes Two',
    'Portal 2',
    'Left 4 Dead 2',
    'Divinity: Original Sin 2',
    'Slay the Spire',
    'Dave the Diver',
    'Disco Elysium',
    'Monster Hunter: World',
    'Monster Hunter Rise',
    'No Man\'s Sky',
    'Forza Horizon 5',
    'Resident Evil 4',
    'Resident Evil Village',
    'Persona 5 Royal',
    'Persona 3 Reload',
    'Yakuza: Like a Dragon',
    'Like a Dragon: Infinite Wealth',
    'NieR:Automata',
    'Final Fantasy VII Remake Intergrade',
    'Final Fantasy XV Windows Edition',
    'Final Fantasy XVI',
    'Lies of P',
    'Armored Core VI Fires of Rubicon',
    'Lethal Company',
    'Helldivers 2',
    'Palworld',
    'Vampire Survivors',
    'Risk of Rain 2',
    'The Binding of Isaac: Rebirth',
    'RimWorld',
    'Factorio',
    'Satisfactory',
    'Cities: Skylines',
    'Cities: Skylines II',
    'Crusader Kings III',
    'Europa Universalis IV',
    'Hearts of Iron IV',
    'Total War: WARHAMMER III',
    'Age of Empires II: Definitive Edition',
    'Age of Empires IV: Anniversary Edition',
    'Civilization VI',
    'Sid Meier\'s Civilization VII',
    'Warframe',
    'Destiny 2',
    'Apex Legends',
    'PUBG: BATTLEGROUNDS',
    'Tom Clancy\'s Rainbow Six Siege',
    'Counter-Strike 2',
    'Dota 2',
    'Team Fortress 2',
    'Overcooked! 2',
    'Cuphead',
    'Ori and the Will of the Wisps',
    'Ori and the Blind Forest: Definitive Edition',
    'Sea of Stars',
    'Octopath Traveler II',
    'Chrono Trigger',
    'Undertale',
    'Omori',
    'The Sims 4',
    'House Flipper',
    'PowerWash Simulator',
    'Euro Truck Simulator 2',
    'American Truck Simulator',
    'Phasmophobia',
    'Project Zomboid',
    'Don\'t Starve Together',
    'Rust',
    'ARK: Survival Evolved',
    'ARK: Survival Ascended',
    'Subnautica',
    'Subnautica: Below Zero',
    'The Forest',
    'Sons Of The Forest',
    'Dying Light 2 Stay Human',
    'Dragon\'s Dogma 2',
    'Dragon Age: Inquisition',
    'Mass Effect Legendary Edition',
    'The Elder Scrolls V: Skyrim Special Edition',
    'Fallout 4',
    'Fallout: New Vegas',
    'Starfield',
    'Control Ultimate Edition',
    'Alan Wake 2',
    'Death Stranding Director\'s Cut',
    'Ghost of Tsushima DIRECTOR\'S CUT',
    'God of War',
    'Marvel\'s Spider-Man Remastered',
    'Marvel\'s Spider-Man: Miles Morales',
    'Horizon Zero Dawn Complete Edition',
    'Days Gone',
    'Uncharted: Legacy of Thieves Collection',
    'Ratchet & Clank: Rift Apart',
    'Street Fighter 6',
    'TEKKEN 8',
    'Guilty Gear -Strive-',
    'EA SPORTS FC 25',
    'NBA 2K25',
    'F1 24',
    'Need for Speed Heat',
    'Need for Speed Unbound',
    'Battlefield 1',
    'Battlefield V',
    'Battlefield 2042',
    'Deep Rock Galactic',
    'Warhammer 40,000: Darktide',
    'Path of Exile',
    'Diablo IV',
    'Borderlands 3',
    'Tiny Tina\'s Wonderlands',
    'Dark Souls III',
    'DARK SOULS: REMASTERED',
    'Nioh 2 - The Complete Edition',
    'The Last of Us Part I',
    'Metaphor: ReFantazio',
    'Clair Obscur: Expedition 33',
    'Dragon Quest XI S: Echoes of an Elusive Age',
    'Dead by Daylight',
    'Sea of Thieves',
    'Grounded',
    'Core Keeper',
    'Hunt: Showdown 1896',
    'Ready or Not',
    'Escape Simulator',
    'Sifu',
    'Lords of the Fallen',
    'Remnant II',
    'XCOM 2',
    'Anno 1800',
    'Football Manager 2024',
    'Balatro',
    'THE FINALS',
    'The Talos Principle 2',
    'Manor Lords',
    'Frostpunk 2',
    'Against the Storm',
    'The First Descendant',
    'Black Desert',
    'War Thunder',
    'Mount & Blade II: Bannerlord',
    'Deep Rock Galactic: Survivor',
    'The Outlast Trials',
    'Returnal',
    'SILENT HILL 2',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeText = (text) => {
    return String(text || '')
        .toLowerCase()
        .replace(/[:：'".,!?()[\]{}]/g, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const extractSpecialTokens = (text) => {
    return normalizeText(text).match(/\b(?:\d+|i|ii|iii|iv|v|vi|vii|viii|ix|x)\b/g) || [];
};

const scoreSearchResult = (query, itemName) => {
    const normalizedQuery = normalizeText(query);
    const normalizedName = normalizeText(itemName);
    const querySpecialTokens = extractSpecialTokens(query);
    const nameSpecialTokens = extractSpecialTokens(itemName);

    if (EXCLUDED_NAME_PATTERN.test(itemName)) return -1000;

    let score = 0;

    if (normalizedQuery === normalizedName) score += 100;
    else if (normalizedName.startsWith(normalizedQuery)) score += 90;
    else if (normalizedName.includes(normalizedQuery)) score += 75;
    else if (normalizedQuery.includes(normalizedName)) score += 60;

    const queryTokens = normalizedQuery.split(' ');
    const matchedTokens = queryTokens.filter((token) => normalizedName.includes(token)).length;
    score += matchedTokens * 10;

    querySpecialTokens.forEach((token) => {
        if (nameSpecialTokens.includes(token)) score += 15;
        else score -= 40;
    });

    nameSpecialTokens.forEach((token) => {
        if (!querySpecialTokens.includes(token)) score -= 10;
    });

    return score;
};

const requestJson = (url) => {
    return new Promise((resolve, reject) => {
        https
            .get(
                url,
                {
                    headers: {
                        'User-Agent': 'jx-team-steam-importer/2.0',
                        Accept: 'application/json',
                    },
                },
                (response) => {
                    const chunks = [];

                    response.on('data', (chunk) => chunks.push(chunk));
                    response.on('end', () => {
                        const body = Buffer.concat(chunks).toString('utf8');

                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(new Error(`Request failed: ${response.statusCode} ${url}`));
                            return;
                        }

                        try {
                            resolve(JSON.parse(body));
                        } catch (error) {
                            reject(new Error(`Invalid JSON from ${url}: ${error.message}`));
                        }
                    });
                }
            )
            .on('error', reject);
    });
};

const parseReleaseDate = (rawDate) => {
    if (!rawDate) return '';

    const sanitized = rawDate.replace(/,/g, '').trim();
    const directDate = new Date(sanitized);
    if (!Number.isNaN(directDate.getTime())) {
        return directDate.toISOString().slice(0, 10);
    }

    const dayMonthYear = sanitized.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
    if (dayMonthYear) {
        const retryDate = new Date(`${dayMonthYear[2]} ${dayMonthYear[1]}, ${dayMonthYear[3]}`);
        if (!Number.isNaN(retryDate.getTime())) {
            return retryDate.toISOString().slice(0, 10);
        }
    }

    return '';
};

const getSearchResults = async (gameName) => {
    const url = `${SEARCH_ENDPOINT}?term=${encodeURIComponent(gameName)}&l=english&cc=us`;
    const payload = await requestJson(url);
    return Array.isArray(payload.items) ? payload.items : [];
};

const findBestSearchMatch = async (gameName) => {
    const results = await getSearchResults(gameName);
    if (results.length === 0) return null;

    const ranked = results
        .map((item) => ({
            item,
            score: scoreSearchResult(gameName, item.name),
        }))
        .sort((a, b) => b.score - a.score);

    return ranked[0].score >= 20 ? ranked[0].item : null;
};

const getAppDetails = async (appid) => {
    const url = `${DETAILS_ENDPOINT}?appids=${appid}&l=english&cc=us`;
    const payload = await requestJson(url);
    const details = payload && payload[appid];

    if (!details || !details.success || !details.data) {
        throw new Error(`Steam details missing for appid ${appid}`);
    }

    return details.data;
};

const getFeaturedCandidates = async () => {
    const [featuredCategories, featured] = await Promise.all([
        requestJson(`${FEATURED_CATEGORIES_ENDPOINT}?cc=us&l=english`),
        requestJson(`${FEATURED_ENDPOINT}?cc=us&l=english`),
    ]);

    const pools = [];

    Object.values(featuredCategories).forEach((section) => {
        if (section && Array.isArray(section.items)) {
            pools.push(...section.items);
        }
    });

    ['featured_win', 'featured_mac', 'featured_linux', 'large_capsules'].forEach((key) => {
        if (Array.isArray(featured[key])) pools.push(...featured[key]);
    });

    const seen = new Set();

    return pools.reduce((acc, item) => {
        if (!item || !item.id || !item.name || EXCLUDED_NAME_PATTERN.test(item.name)) return acc;
        if (seen.has(item.id)) return acc;

        seen.add(item.id);
        acc.push({
            id: item.id,
            name: item.name,
            large_capsule_image: item.large_capsule_image || '',
            tiny_image: item.header_image || item.small_capsule_image || '',
            controller_support: item.controller_support || null,
        });
        return acc;
    }, []);
};

const resolveSearchMatch = async (gameName) => {
    const overrideAppid = APPID_OVERRIDES[gameName];

    if (overrideAppid) {
        const overrideDetails = await getAppDetails(overrideAppid);
        return {
            id: overrideAppid,
            name: overrideDetails.name || gameName,
            large_capsule_image: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${overrideAppid}/capsule_616x353.jpg`,
            tiny_image: overrideDetails.header_image || '',
        };
    }

    return findBestSearchMatch(gameName);
};

const resolveCandidate = async (candidate) => {
    if (candidate.id) {
        return {
            id: candidate.id,
            name: candidate.name,
            large_capsule_image: candidate.large_capsule_image || '',
            tiny_image: candidate.tiny_image || '',
            controller_support: candidate.controller_support || null,
        };
    }

    return resolveSearchMatch(candidate.query);
};

const resolveCategories = (detailData) => {
    return (detailData.categories || [])
        .map((category) => category.description)
        .filter(Boolean);
};

const resolveGenres = (detailData) => {
    const genres = new Set((detailData.genres || []).map((genre) => genre.description).filter(Boolean));
    const categories = resolveCategories(detailData);
    if (categories.some((name) => /vr/i.test(name))) {
        genres.add('VR');
    }

    return Array.from(genres);
};

const resolveControllerSupport = (detailData, searchMatch) => {
    if (searchMatch && searchMatch.controller_support != null) {
        return Number(searchMatch.controller_support) > 0;
    }

    return resolveCategories(detailData).some((name) => /controller/i.test(name));
};

const buildGameRecord = (searchMatch, detailData, index) => {
    const priceOverview = detailData.price_overview;
    const isFree = Boolean(detailData.is_free);
    const hasPrice = Boolean(priceOverview && typeof priceOverview.final === 'number');
    const price = hasPrice ? priceOverview.final : isFree ? 0 : null;
    const originalPrice = hasPrice ? priceOverview.initial : isFree ? 0 : null;
    const discount = hasPrice ? priceOverview.discount_percent || 0 : 0;
    const screenshots = (detailData.screenshots || [])
        .slice(0, 4)
        .map((shot) => shot.path_full || shot.path_thumbnail)
        .filter(Boolean);
    const headerImage = detailData.header_image || searchMatch.large_capsule_image || searchMatch.tiny_image || '';
    const capsuleImage = searchMatch.large_capsule_image || searchMatch.tiny_image || headerImage;
    const developers = (detailData.developers || []).filter(Boolean);
    const publishers = (detailData.publishers || []).filter(Boolean);
    const releaseDate = detailData.release_date && detailData.release_date.date ? detailData.release_date.date : '';

    return {
        id: detailData.steam_appid,
        appid: detailData.steam_appid,
        name: detailData.name || searchMatch.name,
        price,
        originalPrice,
        discount,
        shortDescription: detailData.short_description || '',
        headerImage,
        capsuleImage,
        screenshots: screenshots.length > 0 ? screenshots : headerImage ? [headerImage] : [],
        genres: resolveGenres(detailData),
        categories: resolveCategories(detailData),
        developers,
        publishers,
        controllerSupport: resolveControllerSupport(detailData, searchMatch),
        releaseDate,
        releaseDateISO: parseReleaseDate(releaseDate),
        featured: index < 8,
    };
};

const ensureOutputDir = () => {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
};

const dedupeCandidates = (candidates) => {
    const seenQueries = new Set();
    const seenIds = new Set();

    return candidates.filter((candidate) => {
        if (candidate.id) {
            if (seenIds.has(candidate.id)) return false;
            seenIds.add(candidate.id);
            return true;
        }

        const queryKey = normalizeText(candidate.query);
        if (seenQueries.has(queryKey)) return false;
        seenQueries.add(queryKey);
        return true;
    });
};

const main = async () => {
    ensureOutputDir();

    const autoExpand = process.env.STEAM_DISABLE_AUTO_EXPAND !== '1';
    const requestedTarget = Number(process.env.STEAM_TARGET_COUNT || DEFAULT_TARGET_COUNT);
    const targetCount = Math.max(requestedTarget, GAME_NAMES.length);
    const manualCandidates = GAME_NAMES.map((query) => ({ query }));
    const featuredCandidates = autoExpand ? await getFeaturedCandidates() : [];
    const candidates = dedupeCandidates([...manualCandidates, ...featuredCandidates]);
    const importedGames = [];
    const importedIds = new Set();

    console.log(`Starting Steam import for ${candidates.length} candidates, target ${targetCount} games...`);

    for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        const label = candidate.query || candidate.name || String(candidate.id);

        if (importedGames.length >= targetCount && index >= manualCandidates.length) {
            break;
        }

        try {
            console.log(`[${index + 1}/${candidates.length}] Importing: ${label}`);
            const searchMatch = await resolveCandidate(candidate);

            if (!searchMatch) {
                console.warn(`warning: Unable to find Steam app for "${label}", skipping.`);
                continue;
            }

            const detailData = await getAppDetails(searchMatch.id);
            if (importedIds.has(detailData.steam_appid)) continue;

            const record = buildGameRecord(searchMatch, detailData, importedGames.length);
            importedGames.push(record);
            importedIds.add(record.appid);

            console.log(`  imported: ${record.name} (${record.appid})`);
            await sleep(200);
        } catch (error) {
            console.warn(`warning: Failed to import "${label}": ${error.message}`);
        }
    }

    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(importedGames, null, 2)}\n`, 'utf8');
    console.log(`Finished. Saved ${importedGames.length} games to ${OUTPUT_PATH}`);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
