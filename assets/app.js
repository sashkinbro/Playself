import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyAMeUqjmCQQxdVWksORIpCzxTANBkm89fI",
    authDomain: "playself-6c910.firebaseapp.com",
    projectId: "playself-6c910",
    storageBucket: "playself-6c910.firebasestorage.app",
    messagingSenderId: "579805140721",
    appId: "1:579805140721:web:cc2d4be0d84f9ff41bbb50"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// TRANSLATIONS
const i18n = {
    uk: {
        navAll:"Всі ігри", navFav:"Улюблені", navBack:"Планую", navComp:"Пройдено", navStats:"Статистика",
        searchPlace:"Пошук...", sortRatingDesc:"⭐ Рейтинг: більше → менше",
        sortRatingAsc:"⭐ Рейтинг: менше → більше", sortNew:"📅 Нові", sortOld:"📅 Старі",
        allGenres:"Всі жанри", allPlatforms:"Всі платформи", allYears:"Всі роки",
        allSteam:"Всі ігри", steamSyncedOnly:"Steam", steamNotSyncedOnly:"Без Steam",
        steamSyncBtn:"Синхронізація Steam", steamSyncTitle:"Синхронізація Steam",
        
        // ОНОВЛЕНО:
        steamIdLabel:"SteamID64", steamIdHint:"Введи SteamID64 (17 цифр). Збережеться у твоєму акаунті.",
        steamPrivacyNote: "Примітка: SteamID прив’язується до твого профілю. Ми використовуємо лише відкриті дані Steam.",
        
        steamSyncRun:"Синхронізувати", steamSyncClear:"Очистити",
        steamLastSync:"Остання синхронізація", steamGamesMatched:"Зіставлено ігор", steamTotalHours:"Всього годин",
        loading:"Завантаження...",
        empty:"Нічого не знайдено", about:"ПРО ГРУ", noDesc:"Опис відсутній.",
        editionsTitle:"Видання",
        statsTitle:"Статистика", statsNoSteam:"Щоб бачити статистику по годинах — зроби синхронізацію Steam.",
        statsTop:"Топ ігор за годинами", statsHours:"Годин", statsSyncedGames:"Синхронізовано зі Steam",
        statsFav:"Улюблені", statsComp:"Пройдено",
        errSteamId:"Невірний SteamID64. Має бути 17 цифр.", errNetwork:"Мережна помилка.",
        syncStepConnect:"Підключаюсь…", syncStepDownload:"Завантажую список ігор…", syncStepMatch:"Зіставляю з бібліотекою…", syncDone:"Готово ✅",
        loadErrFile:"Помилка завантаження: {f}",
        loadErrHint:"Перевір: назву файлу, шлях data/, та валідність JSON.",
        loginBtn: "Увійти через Google",
        logoutBtn: "Вийти з акаунту",
        loginError: "Помилка входу"
    },
    en: {
        navAll:"All Games", navFav:"Favorites", navBack:"Backlog", navComp:"Completed", navStats:"Stats",
        searchPlace:"Search...", sortRatingDesc:"⭐ Rating: high → low",
        sortRatingAsc:"⭐ Rating: low → high", sortNew:"📅 Newest", sortOld:"📅 Oldest",
        allGenres:"All Genres", allPlatforms:"All Platforms", allYears:"All Years",
        allSteam:"All games", steamSyncedOnly:"Steam", steamNotSyncedOnly:"No Steam",
        steamSyncBtn:"Steam Sync", steamSyncTitle:"Steam Sync",
        
        // ОНОВЛЕНО:
        steamIdLabel:"SteamID64", steamIdHint:"Enter SteamID64 (17 digits). Saved to your account.",
        steamPrivacyNote: "Note: SteamID is linked to your profile. We only use public data from Steam.",
        
        steamSyncRun:"Sync", steamSyncClear:"Clear",
        steamLastSync:"Last sync", steamGamesMatched:"Games matched", steamTotalHours:"Total hours",
        loading:"Loading...",
        empty:"No results found", about:"ABOUT", noDesc:"No description.",
        editionsTitle:"Editions",
        statsTitle:"Stats", statsNoSteam:"To see hour stats, run Steam sync.",
        statsTop:"Top games by hours", statsHours:"Hours", statsSyncedGames:"Synced with Steam",
        statsFav:"Favorites", statsComp:"Completed",
        errSteamId:"Invalid SteamID64. It must be 17 digits.", errNetwork:"Network error.",
        syncStepConnect:"Connecting…", syncStepDownload:"Downloading owned games…", syncStepMatch:"Matching to library…", syncDone:"Done ✅",
        loadErrFile:"Failed to load: {f}",
        loadErrHint:"Check: filename, data/ path, and valid JSON.",
        loginBtn: "Sign in with Google",
        logoutBtn: "Sign out",
        loginError: "Login error"
    },
    ru: {
        navAll:"Все игры", navFav:"Избранное", navBack:"Планирую", navComp:"Прошел", navStats:"Статистика",
        searchPlace:"Поиск...", sortRatingDesc:"⭐ Рейтинг: больше → меньше",
        sortRatingAsc:"⭐ Рейтинг: меньше → больше", sortNew:"📅 Новые", sortOld:"📅 Старые",
        allGenres:"Все жанры", allPlatforms:"Все платформы", allYears:"Все годы",
        allSteam:"Все игры", steamSyncedOnly:"Steam", steamNotSyncedOnly:"Без Steam",
        steamSyncBtn:"Синхронизация Steam", steamSyncTitle:"Синхронизация Steam",
        
        // ОНОВЛЕНО:
        steamIdLabel:"SteamID64", steamIdHint:"Введи SteamID64 (17 цифр). Сохранится в твоем аккаунте.",
        steamPrivacyNote: "Примечание: SteamID привязывается к твоему профилю. Мы используем только открытые данные Steam.",
        
        steamSyncRun:"Синхронизировать", steamSyncClear:"Очистить",
        steamLastSync:"Последняя синхронизация", steamGamesMatched:"Сопоставлено игр", steamTotalHours:"Всего часов",
        loading:"Загрузка...",
        empty:"Ничего не найдено", about:"ОБ ИГРЕ", noDesc:"Описание отсутствует.",
        editionsTitle:"Издания",
        statsTitle:"Статистика", statsNoSteam:"Чтобы видеть статистику по часам — сделай синхронизацию Steam.",
        statsTop:"Топ игр по часам", statsHours:"Часов", statsSyncedGames:"Синхронизировано со Steam",
        statsFav:"Избранное", statsComp:"Прошел",
        errSteamId:"Неверный SteamID64. Должно быть 17 цифр.", errNetwork:"Сетевая ошибка.",
        syncStepConnect:"Подключаюсь…", syncStepDownload:"Загружаю список игр…", syncStepMatch:"Сопоставляю с библиотекой…", syncDone:"Готово ✅",
        loadErrFile:"Ошибка загрузки: {f}",
        loadErrHint:"Проверь: имя файла, путь data/, валидность JSON.",
        loginBtn: "Войти через Google",
        logoutBtn: "Выйти из аккаунта",
        loginError: "Ошибка входа"
    }
};

const DATA_FILES = [
    "Nintendo_Switch.json",
    "Nintendo_WiiU.json",
    "PC.json",
    "PS_Vita.json",
    "PS1.json",
    "PS2.json",
    "PS3.json",
    "PS4.json",
    "PS5.json",
    "PSP.json"
];

// RAW games (editions)
let allGames = [];

// Canonical games (ONE CARD)
let canonicalGames = [];
let canonicalById = new Map();

let displayedGames = [], loadedCount = 0, modalGameId = null;
let currentLang = 'uk', currentTab = 'all';
const BATCH_SIZE = 30;

// Storage (Local default, Firebase overwrite)
const safeLoad = (key) => { try { return new Set(JSON.parse(localStorage.getItem(key)) || []); } catch { return new Set(); } };
const lists = { favorite: safeLoad('ps_fav'), backlog: safeLoad('ps_back'), completed: safeLoad('ps_comp') };

// CLOUD SAVE FUNCTION
async function saveToCloud() {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, "users", currentUser.uid), {
            lists: {
                favorite: [...lists.favorite],
                backlog: [...lists.backlog],
                completed: [...lists.completed]
            },
            steamId: steamId || null,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Saved to cloud.");
    } catch (e) {
        console.error("Cloud save failed:", e);
    }
}

// Steam cache
const STEAM = {
    workerUrl: 'https://playshelf.sashabro1997.workers.dev/sync/light',
    idKey: 'ps_steam_id',
    dataKey: 'ps_steam_light',
    atKey: 'ps_steam_synced_at'
};

let steamId = '';
let steamLight = null;

let steamMapByAppId = new Map();
let steamMapByNameYear = new Map();
let steamMatchedCount = 0;

try { currentLang = localStorage.getItem('ps_lang') || 'uk'; } catch {}

const els = {
    grid: document.getElementById('gamesGrid'),
    loader: document.getElementById('loader'),
    empty: document.getElementById('emptyState'),
    stats: document.getElementById('statsView'),
    trigger: document.getElementById('loadTrigger'),
    search: document.getElementById('searchInput'),
    filters: {
        genre: document.getElementById('genreFilter'),
        sort: document.getElementById('sortFilter'),
        platform: document.getElementById('platformFilter'),
        year: document.getElementById('yearFilter'),
        steam: document.getElementById('steamFilter')
    }
};

// Spinner only
function setLoaderText(_) { return; }

function tpl(s, vars) {
    return String(s || '').replace(/\{(\w+)\}/g, (_, k) => (vars && k in vars) ? String(vars[k]) : `{${k}}`);
}

function makeGlobalId(platformKey, localId) {
    return `${String(platformKey)}:${String(localId)}`;
}

function platformKeyFromFilename(filename) {
    return String(filename || '').replace(/\.json$/i, '');
}

/** ---------------- Title cleanup & canonicalization ---------------- */

function normalizeTitle(s) {
    let t = String(s || '').toLowerCase();
    t = t.replace(/&/g, ' and ');
    t = t.replace(/[:\-–—]/g, ' ');
    t = t.replace(/[’']/g, '');
    t = t.replace(/[®™]/g, '');
    t = t.replace(/\([^)]*\)/g, ' ');
    t = t.replace(/\[[^\]]*\]/g, ' ');
    t = t.replace(/[^a-z0-9\u0400-\u04FF\s]/g, ' ');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
}

// Strong remove editions words for grouping
function canonicalTitle(name) {
    let t = normalizeTitle(name);

    const kill = [
        'ultimate edition','definitive edition','deluxe edition','gold edition','complete edition','anniversary edition',
        'enhanced edition',"director s cut",'director cut','game of the year','goty',
        'ultimate','definitive','deluxe','gold','complete','anniversary','enhanced','remastered','remaster',
        'bundle','pack'
    ];
    for (const w of kill) {
        t = t.replace(new RegExp(`\\b${w}\\b`, 'g'), ' ');
    }
    t = t.replace(/\s+/g, ' ').trim();
    t = t.replace(/\bedition\b/g, ' ').replace(/\s+/g, ' ').trim();
    return t;
}

// Rank: choose representative title/photo
function editionRank(name) {
    const n = String(name || '').toLowerCase();
    const hasAny = /(definitive|ultimate|deluxe|gold|complete|goty|game of the year|anniversary|enhanced|remaster|director|bundle|pack)/i.test(n);
    if (!hasAny) return 0;
    if (/(definitive|complete|goty|game of the year)/i.test(n)) return 1;
    if (/(deluxe|anniversary|enhanced|remaster|director)/i.test(n)) return 2;
    if (/(gold|ultimate)/i.test(n)) return 3;
    if (/(bundle|pack)/i.test(n)) return 4;
    return 5;
}

const YEAR_CLUSTER_THRESHOLD = 12;

function clusterByYear(games) {
    const arr = [...games].sort((a,b) => (Number(a.year)||0) - (Number(b.year)||0));
    const clusters = [];
    for (const g of arr) {
        const y = Number(g.year) || 0;
        if (clusters.length === 0) {
            clusters.push([g]);
            continue;
        }
        const lastCluster = clusters[clusters.length - 1];
        const clusterYears = lastCluster.map(x => Number(x.year)||0).filter(v => v > 0);
        const clusterMin = clusterYears.length ? Math.min(...clusterYears) : 0;
        const clusterMax = clusterYears.length ? Math.max(...clusterYears) : 0;

        if (y === 0 || clusterMin === 0 || clusterMax === 0) {
            lastCluster.push(g);
            continue;
        }
        const tooFar = (Math.abs(y - clusterMin) > YEAR_CLUSTER_THRESHOLD) && (Math.abs(y - clusterMax) > YEAR_CLUSTER_THRESHOLD);
        if (!tooFar) lastCluster.push(g);
        else clusters.push([g]);
    }
    return clusters;
}

function unionGenres(games) {
    const set = new Set();
    for (const g of games) {
        if (!g.genre) continue;
        String(g.genre).split(',').map(x => x.trim()).filter(Boolean).forEach(x => set.add(x));
    }
    return [...set].join(', ');
}

function pickBestPhoto(games) {
    for (const g of games) {
        if (g.photo_url && String(g.photo_url).trim()) return g.photo_url;
    }
    return '';
}

function pickBestDesc(games) {
    for (const g of games) {
        if (g.description && (g.description.uk || g.description.en || g.description.ru)) return g.description;
    }
    return null;
}

function representativeGame(games) {
    let rep = games[0];
    for (let i = 1; i < games.length; i++) {
        const a = rep, b = games[i];
        const ra = editionRank(a.name);
        const rb = editionRank(b.name);
        if (rb < ra) { rep = b; continue; }
        if (rb === ra) {
            if ((Number(b.rating_ign)||0) > (Number(a.rating_ign)||0)) { rep = b; continue; }
            if ((!a.photo_url || !String(a.photo_url).trim()) && (b.photo_url && String(b.photo_url).trim())) { rep = b; continue; }
        }
    }
    return rep;
}

function makeCanonicalId(platform, titleKey, clusterIndex) {
    return `c::${String(platform).toLowerCase()}::${titleKey}::${clusterIndex}`;
}

function buildCanonicalGames() {
    canonicalGames = [];
    canonicalById = new Map();

    const groups = new Map();
    for (const g of allGames) {
        const platform = String(g.platform || '').trim().toLowerCase();
        const titleKey = canonicalTitle(g.name);
        const key = `${platform}::${titleKey}`;
        const arr = groups.get(key) || [];
        arr.push(g);
        groups.set(key, arr);
        g._canonicalTitleKey = titleKey;
        g._platformKeyLower = platform;
    }

    for (const [key, arr] of groups.entries()) {
        const platform = key.split('::')[0];
        const titleKey = key.slice(platform.length + 2);
        const clusters = clusterByYear(arr);

        clusters.forEach((clusterGames, idx) => {
            const rep = representativeGame(clusterGames);
            const years = clusterGames.map(x => Number(x.year)||0).filter(v => v>0);
            const canonicalYear = years.length ? Math.min(...years) : (Number(rep.year)||0);
            const editions = clusterGames
                .map(x => ({
                    id: x.id,
                    name: x.name,
                    year: Number(x.year)||0,
                    platform: x.platform || '',
                    rank: editionRank(x.name)
                }))
                .sort((a,b) => a.rank - b.rank || a.name.localeCompare(b.name));

            const canonicalObj = {
                id: makeCanonicalId(platform, titleKey, idx),
                name: rep.name,
                year: canonicalYear,
                platform: rep.platform || '',
                rating_ign: Number(rep.rating_ign)||0,
                photo_url: pickBestPhoto(clusterGames) || rep.photo_url || '',
                description: pickBestDesc(clusterGames) || rep.description || null,
                genre: unionGenres(clusterGames) || rep.genre || '',
                editions,
                raw: clusterGames,
                steam: { synced: false, playtimeMinutes: 0, appId: null, steamName: '' }
            };

            canonicalGames.push(canonicalObj);
            canonicalById.set(canonicalObj.id, canonicalObj);
        });
    }
}

/** ---------------- Data loading ---------------- */

async function loadAllDataFiles() {
    const t = i18n[currentLang] || i18n.en;
    const result = [];

    for (let i = 0; i < DATA_FILES.length; i++) {
        const file = DATA_FILES[i];
        const path = `data/${file}`;
        const pKey = platformKeyFromFilename(file);
        let res;
        try { res = await fetch(path); }
        catch (e) { throw new Error(`${tpl(t.loadErrFile, { f: path })}\n${t.loadErrHint}`); }

        if (!res.ok) throw new Error(`${tpl(t.loadErrFile, { f: path })} (HTTP ${res.status})\n${t.loadErrHint}`);

        let arr;
        try { arr = await res.json(); }
        catch (e) { throw new Error(`${tpl(t.loadErrFile, { f: path })} (invalid JSON)\n${t.loadErrHint}`); }

        if (!Array.isArray(arr)) throw new Error(`${tpl(t.loadErrFile, { f: path })} (expected JSON array)\n${t.loadErrHint}`);

        for (const g of arr) {
            const localId = (g && g.id != null) ? String(g.id) : '';
            const globalId = makeGlobalId(pKey, localId);
            g.local_id = localId;
            g.id = globalId;
            if (!g.platform || !String(g.platform).trim()) g.platform = pKey;
            g.year = parseInt(g.year) || 0;
            g.rating_ign = parseFloat(g.rating_ign) || 0;
        }
        for (let j = 0; j < arr.length; j++) result.push(arr[j]);
        document.getElementById('loadPercent').innerText = Math.round(((i + 1) / DATA_FILES.length) * 100) + '%';
    }
    return result;
}

/** ---------------- Language ---------------- */

window.setLang = (lang) => {
    currentLang = lang;
    try { localStorage.setItem('ps_lang', lang); } catch {}
    applyLanguage(lang);
    runFilter();
};

function applyLanguage(lang) {
    const t = i18n[lang] || i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if(t[k]) el.textContent=t[k];
    });
    if(els.search) els.search.placeholder = t.searchPlace;
    const mobLang = document.getElementById('mobileLang');
    if(mobLang) mobLang.value = lang;
}

function getLocalizedDesc(g) {
    // Якщо опису немає — повертаємо стандартний текст "Немає опису"
    if (!g.description) {
        return (i18n[currentLang] || i18n.en).noDesc;
    }
    
    // Оскільки ми все оновили, опис — це завжди просто текст. Повертаємо його.
    return g.description;
}

/** ---------------- Steam ---------------- */

function getSteamYear(obj) {
    const y = Number(obj?.year ?? obj?.releaseYear ?? obj?.released ?? obj?.release_year ?? 0);
    return Number.isFinite(y) && y > 0 ? y : 0;
}

function fmtHoursFromMinutes(mins) {
    const h = (Number(mins) || 0) / 60;
    if (h >= 100) return String(Math.round(h));
    if (h >= 10) return h.toFixed(1);
    return h.toFixed(2);
}

function getLocalSteamAppIdFromRawGame(game) {
    const v = game?.steamAppId ?? game?.steam_appid ?? game?.steamAppID ?? game?.appid ?? game?.appId ?? game?.steam?.appId ?? game?.steam?.appid ?? null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? String(n) : null;
}

function loadSteamCache() {
    try { steamId = localStorage.getItem(STEAM.idKey) || ''; } catch { steamId = ''; }
    try { steamLight = JSON.parse(localStorage.getItem(STEAM.dataKey) || 'null'); } catch { steamLight = null; }
    rebuildSteamMaps();
    updateSteamModalSummary();
}

function rebuildSteamMaps() {
    steamMapByAppId = new Map();
    steamMapByNameYear = new Map();
    const arr = steamLight && steamLight.ok === true && Array.isArray(steamLight.games) ? steamLight.games : [];
    for (const g of arr) {
        const appIdNum = Number(g.appId || 0);
        const name = String(g.name || '').trim();
        const playtimeMinutes = Number(g.playtimeMinutes) || 0;
        if (!appIdNum || !name) continue;
        const year = getSteamYear(g);
        const obj = { appId: appIdNum, name, playtimeMinutes, year };
        steamMapByAppId.set(String(appIdNum), obj);
        if (year > 0) {
            const key = `${normalizeTitle(name)}::${year}`;
            steamMapByNameYear.set(key, obj);
        }
    }
}

function enrichCanonicalGamesWithSteam() {
    steamMatchedCount = 0;
    const steamByName = new Map();
    const arr = (steamLight && steamLight.ok === true && Array.isArray(steamLight.games)) ? steamLight.games : [];

    for (const g of arr) {
        const appIdNum = Number(g?.appId || 0);
        const name = String(g?.name || '').trim();
        if (!appIdNum || !name) continue;
        const playtimeMinutes = Number(g?.playtimeMinutes) || 0;
        const year = getSteamYear(g);
        const obj = { appId: appIdNum, name, playtimeMinutes, year };
        const key = normalizeTitle(name);
        if (!key) continue;
        const prev = steamByName.get(key);
        if (!prev || (Number(obj.playtimeMinutes) || 0) >= (Number(prev.playtimeMinutes) || 0)) {
            steamByName.set(key, obj);
        }
    }

    for (const c of canonicalGames) {
        const isPc = String(c.platform || '').trim().toLowerCase() === 'pc';
        if (!isPc) {
            c.steam = { synced: false, playtimeMinutes: 0, appId: null, steamName: '' };
            continue;
        }
        let s = null;
        for (const raw of (c.raw || [])) {
            const appId = getLocalSteamAppIdFromRawGame(raw);
            if (appId && steamMapByAppId.has(String(appId))) {
                s = steamMapByAppId.get(String(appId));
                break;
            }
        }
        if (!s) {
            const localNameKey = normalizeTitle(canonicalTitle(c.name));
            const cand = steamByName.get(localNameKey) || null;
            if (cand) {
                const localYear = Number(c.year) || 0;
                const steamYear = Number(cand.year) || 0;
                if (localYear > 0 && steamYear > 0 && localYear !== steamYear) { /* year mismatch */ } else { s = cand; }
            }
        }
        if (s) {
            steamMatchedCount++;
            c.steam = { synced: true, playtimeMinutes: s.playtimeMinutes, appId: s.appId, steamName: s.name };
        } else {
            c.steam = { synced: false, playtimeMinutes: 0, appId: null, steamName: '' };
        }
    }
}

function openSteamModal() {
    const o = document.getElementById('steamModalOverlay');
    if (!o) return;
    const inp = document.getElementById('steamIdInput');
    if (inp) inp.value = steamId || '';
    updateSteamModalSummary();
    o.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
window.openSteamModal = openSteamModal;

window.closeSteamModal = (e, force) => {
    const o = document.getElementById('steamModalOverlay');
    if (!o) return;
    if (force || (e && e.target && e.target.id === 'steamModalOverlay')) {
        o.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

function setSteamStatus(show, percent, text) {
    const wrap = document.getElementById('steamSyncStatus');
    const bar = document.getElementById('steamSyncBar');
    const t = document.getElementById('steamSyncText');
    if (!wrap || !bar || !t) return;
    wrap.classList.toggle('hidden', !show);
    bar.style.width = Math.max(0, Math.min(100, Number(percent) || 0)) + '%';
    t.textContent = text || '';
}

function updateSteamModalSummary() {
    const last = document.getElementById('steamLastSyncValue');
    const matched = document.getElementById('steamMatchedValue');
    const total = document.getElementById('steamTotalHoursValue');
    const atRaw = (() => { try { return localStorage.getItem(STEAM.atKey) || ''; } catch { return ''; } })();
    if (last) last.textContent = atRaw ? new Date(atRaw).toLocaleString() : '—';
    if (matched) matched.textContent = String(steamMatchedCount || 0);
    let mins = 0;
    if (steamLight && steamLight.ok === true && Array.isArray(steamLight.games)) {
        mins = steamLight.games.reduce((a, g) => a + (Number(g.playtimeMinutes) || 0), 0);
    }
    if (total) total.textContent = fmtHoursFromMinutes(mins);
}

async function runSteamSyncFlow() {
    const t = i18n[currentLang] || i18n.en;
    const inp = document.getElementById('steamIdInput');
    const id = String(inp && inp.value ? inp.value : '').trim();

    if (!/^\d{17}$/.test(id)) {
        setSteamStatus(true, 0, t.errSteamId);
        return;
    }
    steamId = id;
    try { localStorage.setItem(STEAM.idKey, steamId); } catch {}
    
    // Save SteamID to Cloud
    saveToCloud();

    setSteamStatus(true, 15, t.syncStepConnect);

    let res;
    try {
        res = await fetch(STEAM.workerUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ steamId })
        });
    } catch (e) {
        console.error(e);
        setSteamStatus(true, 100, t.errNetwork);
        return;
    }

    setSteamStatus(true, 55, t.syncStepDownload);

    let data;
    try { data = await res.json(); } catch { data = null; }

    if (!res.ok || !data || data.ok !== true) {
        const msg = (data && data.error) ? data.error : ('HTTP ' + res.status);
        setSteamStatus(true, 100, msg);
        return;
    }

    setSteamStatus(true, 85, t.syncStepMatch);

    steamLight = data;
    try {
        localStorage.setItem(STEAM.dataKey, JSON.stringify(steamLight));
        localStorage.setItem(STEAM.atKey, new Date().toISOString());
    } catch {}

    rebuildSteamMaps();
    enrichCanonicalGamesWithSteam();
    updateSteamModalSummary();

    if (currentTab === 'stats') renderStats();
    else runFilter();

    setSteamStatus(true, 100, t.syncDone);
}

function clearSteamSync() {
    steamId = '';
    steamLight = null;
    steamMapByAppId = new Map();
    steamMapByNameYear = new Map();
    steamMatchedCount = 0;

    try {
        localStorage.removeItem(STEAM.idKey);
        localStorage.removeItem(STEAM.dataKey);
        localStorage.removeItem(STEAM.atKey);
    } catch {}

    enrichCanonicalGamesWithSteam();
    updateSteamModalSummary();
    if (currentTab === 'stats') renderStats();
    else runFilter();
    setSteamStatus(false, 0, '');
}

/** ---------------- Filters ---------------- */

function populateFilters() {
    const gSet = new Set(), pSet = new Set(), ySet = new Set();
    canonicalGames.forEach(g => {
        if(g.genre) g.genre.split(',').forEach(x => gSet.add(x.trim()));
        if(g.platform) pSet.add(g.platform);
        if(g.year > 0) ySet.add(g.year);
    });
    if (els.filters.genre) Array.from(gSet).sort().forEach(x => els.filters.genre.add(new Option(x, x)));
    if (els.filters.platform) Array.from(pSet).sort().forEach(x => els.filters.platform.add(new Option(x, x)));
    if (els.filters.year) Array.from(ySet).sort().reverse().forEach(x => els.filters.year.add(new Option(x, x)));

    Object.values(els.filters).forEach(s => { if (s) s.onchange = runFilter; });
    if (els.search) els.search.oninput = () => { clearTimeout(window.t); window.t = setTimeout(runFilter, 300); };
}

function runFilter() {
    if (currentTab === 'stats') {
        renderStats();
        return;
    }

    const term = (els.search && els.search.value ? els.search.value : '').toLowerCase();
    const [fGenre, fPlat, fYear, fSteam, sortMode] = [
        els.filters.genre ? els.filters.genre.value : 'all',
        els.filters.platform ? els.filters.platform.value : 'all',
        els.filters.year ? els.filters.year.value : 'all',
        els.filters.steam ? els.filters.steam.value : 'all',
        els.filters.sort ? els.filters.sort.value : 'rating_desc'
    ];

    let source = currentTab === 'all'
        ? canonicalGames
        : canonicalGames.filter(g => lists[currentTab].has(g.id));

    displayedGames = source.filter(g => {
        const isSynced = !!(g.steam && g.steam.synced);
        const steamOk = (fSteam === 'all') || (fSteam === 'synced' && isSynced) || (fSteam === 'not_synced' && !isSynced);

        return (!term || g.name.toLowerCase().includes(term)) &&
               (fGenre === 'all' || (g.genre && g.genre.includes(fGenre))) &&
               (fPlat === 'all' || g.platform === fPlat) &&
               (fYear === 'all' || g.year == fYear) &&
               steamOk;
    });

    displayedGames.sort((a,b) => {
        if (sortMode === 'rating_desc') return (Number(b.rating_ign)||0) - (Number(a.rating_ign)||0);
        if (sortMode === 'rating_asc') return (Number(a.rating_ign)||0) - (Number(b.rating_ign)||0);
        if (sortMode === 'year_desc') return (Number(b.year)||0) - (Number(a.year)||0);
        if (sortMode === 'year_asc') return (Number(a.year)||0) - (Number(b.year)||0);
        return 0;
    });

    loadedCount = 0;
    if (els.grid) els.grid.innerHTML = '';

    if (els.stats) els.stats.classList.add('hidden');
    if (els.grid) els.grid.classList.remove('hidden');
    if (els.trigger) els.trigger.classList.remove('hidden');

    if (displayedGames.length === 0) {
        if (els.empty) els.empty.classList.remove('hidden');
        if (els.loader) els.loader.classList.add('hidden');
    } else {
        if (els.empty) els.empty.classList.add('hidden');
        if (els.loader) els.loader.classList.add('hidden');
        renderMore();
    }
}

function renderMore() {
    const batch = displayedGames.slice(loadedCount, loadedCount + BATCH_SIZE);
    if (batch.length === 0) return;
    const frag = document.createDocumentFragment();
    batch.forEach(g => frag.appendChild(createCard(g)));
    if (els.grid) els.grid.appendChild(frag);
    loadedCount += BATCH_SIZE;
}

/** ---------------- Cards / Modal ---------------- */

function createCard(g) {
    const d = document.createElement('div');
    d.className = "group relative bg-card rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-accent transition-all duration-300 cursor-pointer aspect-[2/3]";
    d.onclick = () => openModal(g);

    let dots = '';
    if(lists.favorite.has(g.id)) dots += '<span class="w-2 h-2 rounded-full bg-danger shadow-md"></span>';
    if(lists.backlog.has(g.id)) dots += '<span class="w-2 h-2 rounded-full bg-warning shadow-md"></span>';
    if(lists.completed.has(g.id)) dots += '<span class="w-2 h-2 rounded-full bg-success shadow-md"></span>';

    const isSynced = !!(g.steam && g.steam.synced);
    const steamPill = isSynced
        ? `<span class="steam-pill"><i class="fa-brands fa-steam-symbol text-accent"></i> ${fmtHoursFromMinutes(g.steam.playtimeMinutes)}h</span>`
        : '';

    const img = g.photo_url || 'https://placehold.co/400x600/1e293b/FFF?text=No+Image';
    const rate = g.rating_ign ? `<div class="absolute top-2 right-2 bg-black/80 backdrop-blur text-accent text-xs font-bold px-2 py-1 rounded border border-accent/30 flex items-center gap-1"><i class="fa-solid fa-star"></i> ${g.rating_ign}</div>` : '';

    d.innerHTML = `<img src="${img}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-50">${rate}
    <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent translate-y-2 group-hover:translate-y-0 transition">
        <h3 class="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base">${g.name}</h3>
        <div class="flex items-center gap-2 mt-2 opacity-80 text-xs text-slate-300">
            <span>${g.year||''}</span>
            ${steamPill}
            <span class="ml-auto flex gap-1">${dots}</span>
        </div>
    </div>`;
    return d;
}

window.openModal = (g) => {
    modalGameId = g.id;
    const m = document.getElementById('modalOverlay');
    document.getElementById('m-img').src = g.photo_url || '';
    document.getElementById('m-title').textContent = g.name;
    document.getElementById('m-year').querySelector('span').textContent = g.year || 'N/A';
    document.getElementById('m-platform').querySelector('span').textContent = g.platform || 'PC';
    document.getElementById('m-desc').textContent = getLocalizedDesc(g);

    const steamInfo = (g.steam && g.steam.synced)
        ? `<span class="steam-pill"><i class="fa-brands fa-steam-symbol text-accent"></i> ${fmtHoursFromMinutes(g.steam.playtimeMinutes)}h</span>`
        : '';

    document.getElementById('m-genres').innerHTML =
        (steamInfo ? steamInfo : '') +
        (g.genre ? g.genre.split(',').map(x => `<span class="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">${x.trim()}</span>`).join('') : '');

    const wrap = document.getElementById('m-editionsWrap');
    const list = document.getElementById('m-editions');
    if (wrap && list) {
        const editions = Array.isArray(g.editions) ? g.editions : [];
        if (editions.length > 1) {
            wrap.classList.remove('hidden');
            list.innerHTML = editions
                .map(e => `<span class="edition-pill"><i class="fa-solid fa-layer-group text-slate-400"></i> ${e.name}</span>`)
                .join('');
        } else {
            wrap.classList.add('hidden');
            list.innerHTML = '';
        }
    }

    const r = document.getElementById('m-rating');
    if(g.rating_ign) { r.innerHTML = `<i class="fa-solid fa-star"></i> ${g.rating_ign}`; r.classList.remove('hidden'); }
    else r.classList.add('hidden');

    updateModalButtons();
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeModal = (e,f) => {
    if(f || (e && e.target && e.target.id === 'modalOverlay')) {
        document.getElementById('modalOverlay').classList.add('hidden');
        document.body.style.overflow = '';
    }
};

window.toggleAction = (l) => {
    if(!modalGameId) return;

    const s = lists[l];
    if(s.has(modalGameId)) s.delete(modalGameId); else s.add(modalGameId);

    try {
        localStorage.setItem(l === 'favorite' ? 'ps_fav' : l === 'backlog' ? 'ps_back' : 'ps_comp', JSON.stringify([...s]));
    } catch {}
    
    // Save change to Cloud
    saveToCloud();

    updateModalButtons();
    updateBadges();
    if(currentTab === l) runFilter();
};

function updateModalButtons() {
    const chk = (l) => lists[l].has(modalGameId);
    const set = (id, l, c, i) => {
        const b = document.getElementById(id);
        const active = chk(l);
        b.className = `w-12 h-12 rounded-full border flex items-center justify-center text-xl transition hover:scale-110 cursor-pointer ${active ? 'bg-'+c+' border-'+c+' text-white' : 'bg-slate-800/80 border-slate-600 text-slate-300 hover:bg-'+c}`;
        b.querySelector('i').className = active ? `fa-solid ${i}` : `fa-regular ${i}`;
    };
    set('btn-fav', 'favorite', 'danger', 'fa-heart');
    set('btn-back', 'backlog', 'warning', 'fa-clock');
    set('btn-comp', 'completed', 'success', 'fa-circle-check');
}

window.switchTab = (t) => {
    currentTab = t;
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    const isStats = (t === 'stats');
    if (els.stats) els.stats.classList.toggle('hidden', !isStats);
    if (els.grid) els.grid.classList.toggle('hidden', isStats);
    if (els.trigger) els.trigger.classList.toggle('hidden', isStats);
    if (els.empty) els.empty.classList.add('hidden');
    if (els.loader) els.loader.classList.add('hidden');
    runFilter();
};

function updateBadges() {
    const u = (k, v) => {
        const el = document.getElementById(k);
        if(el) { el.innerText = v; el.classList.toggle('hidden', v===0); }
    };
    u('count-fav', lists.favorite.size); u('mob-count-fav', lists.favorite.size);
    u('count-back', lists.backlog.size); u('mob-count-back', lists.backlog.size);
    u('count-comp', lists.completed.size); u('mob-count-comp', lists.completed.size);
}

function renderStats() {
    const t = i18n[currentLang] || i18n.en;
    if (!els.stats) return;

    els.stats.classList.remove('hidden');
    if (els.grid) els.grid.classList.add('hidden');
    if (els.trigger) els.trigger.classList.add('hidden');
    if (els.empty) els.empty.classList.add('hidden');
    if (els.loader) els.loader.classList.add('hidden');

    const hasSteam = steamLight && steamLight.ok === true && Array.isArray(steamLight.games) && steamLight.games.length > 0;
    const fav = lists.favorite.size;
    const comp = lists.completed.size;

    let totalMins = 0;
    const steamArr = hasSteam ? steamLight.games : [];
    for (const g of steamArr) totalMins += (Number(g.playtimeMinutes) || 0);
    const totalHours = fmtHoursFromMinutes(totalMins);

    const topCanonical = canonicalGames
        .filter(g => String(g.platform || '').trim().toLowerCase() === 'pc' && g.steam && g.steam.synced)
        .sort((a,b) => (Number(b.steam.playtimeMinutes)||0) - (Number(a.steam.playtimeMinutes)||0))
        .slice(0, 12);

    const topHtml = topCanonical.length ? topCanonical.map(x => {
        const img = x.photo_url || 'https://placehold.co/400x600/1e293b/FFF?text=No+Image';
        const h = fmtHoursFromMinutes(x.steam.playtimeMinutes);
        return `
            <div class="bg-card rounded-xl overflow-hidden border border-slate-700/50 shadow-lg cursor-pointer" onclick="openModal(canonicalById.get('${x.id}'))">
                <div class="relative aspect-[2/3]">
                    <img src="${img}" loading="lazy" class="w-full h-full object-cover">
                    <div class="absolute top-2 left-2 steam-pill"><i class="fa-brands fa-steam-symbol text-accent"></i> ${h}h</div>
                </div>
                <div class="p-3">
                    <div class="text-white font-bold text-sm line-clamp-2">${x.name}</div>
                </div>
            </div>
        `;
    }).join('') : `<div class="text-slate-500 text-sm">${t.statsNoSteam}</div>`;

    els.stats.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl md:text-3xl font-black text-white">${t.statsTitle}</h2>
                <button class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white hover:border-accent hover:bg-slate-800/80 transition flex items-center gap-2" onclick="openSteamModal()">
                    <i class="fa-brands fa-steam-symbol text-accent"></i>
                    <span>${t.steamSyncBtn}</span>
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div class="kpi-card">
                    <div class="kpi-value">${hasSteam ? totalHours : '—'}</div>
                    <div class="kpi-label">${t.steamTotalHours}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">${hasSteam ? String(steamMatchedCount || 0) : '0'}</div>
                    <div class="kpi-label">${t.statsSyncedGames}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">${fav}</div>
                    <div class="kpi-label">${t.statsFav}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">${comp}</div>
                    <div class="kpi-label">${t.statsComp}</div>
                </div>
            </div>

            <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 md:p-5">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">${t.statsTop}</h3>
                    ${hasSteam ? `<span class="text-xs text-slate-500">${t.statsHours}</span>` : ``}
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${topHtml}
                </div>
            </div>

            <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 md:p-5">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">${t.statsSyncedGames}</h3>
                    <span class="text-xs text-slate-500">PC</span>
                </div>
                <div id="statsSyncedGrid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6"></div>
                <div id="statsSyncedEmpty" class="hidden text-slate-500 text-sm mt-2">${t.statsNoSteam}</div>
            </div>

            ${!hasSteam ? `<div class="text-slate-500 text-sm">${t.statsNoSteam}</div>` : ``}
        </div>
    `;

    const grid = document.getElementById('statsSyncedGrid');
    const empty = document.getElementById('statsSyncedEmpty');
    if (!grid) return;

    const syncedPc = canonicalGames
        .filter(g => String(g.platform || '').trim().toLowerCase() === 'pc' && !!(g.steam && g.steam.synced))
        .sort((a,b) => (Number(b.steam?.playtimeMinutes)||0) - (Number(a.steam?.playtimeMinutes)||0));

    if (syncedPc.length === 0) {
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (empty) empty.classList.add('hidden');
    const frag = document.createDocumentFragment();
    for (const g of syncedPc) frag.appendChild(createCard(g));
    grid.appendChild(frag);
}

async function init() {
    applyLanguage(currentLang);
    if (els.loader) { els.loader.classList.remove('hidden'); els.loader.classList.add('flex'); }

    // --- 1. КНОПКИ ВХОДУ (ДЕСКТОП) ---
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogin) btnLogin.onclick = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) { 
            console.error(e); 
            alert(i18n[currentLang].loginError); 
        }
    };

    if (btnLogout) btnLogout.onclick = async () => {
        await signOut(auth);
        window.location.reload();
    };

    // --- 2. КНОПКА ВХОДУ (МОБІЛЬНА) - ДОДАНО ---
    const mobBtn = document.getElementById('mobile-login-btn');
    if (mobBtn) mobBtn.onclick = async () => {
        if (currentUser) {
            // Якщо вже увійшов — питаємо чи вийти
            if (confirm(i18n[currentLang].logoutBtn + "?")) {
                await signOut(auth);
                window.location.reload();
            }
        } else {
            // Якщо гість — входимо
            try {
                await signInWithPopup(auth, new GoogleAuthProvider());
            } catch (e) { console.error(e); alert(i18n[currentLang].loginError); }
        }
    };

    // --- 3. СЛУХАЧ АВТОРИЗАЦІЇ ---
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        
        // Елементи десктоп
        const userSec = document.getElementById('user-section');
        const loginBtn = document.getElementById('btn-login');
        const nameEl = document.getElementById('user-name');
        
        // Елементи мобілка
        const mobAvatar = document.getElementById('mobile-avatar');
        const mobIcon = document.querySelector('#mobile-login-btn i');

        if (user) {
            // --- ДЕСКТОП: показуємо профіль ---
            if(userSec) {
                userSec.classList.remove('hidden');
                document.getElementById('user-avatar').src = user.photoURL;
                
                // Виправлення: пишемо ім'я і забороняємо його перекладати
                if (nameEl) {
                    nameEl.textContent = user.displayName;
                    nameEl.removeAttribute('data-i18n');
                }
            }
            if(loginBtn) loginBtn.classList.add('hidden');

            // --- МОБІЛКА: показуємо аватарку ---
            if(mobAvatar) {
                mobAvatar.src = user.photoURL;
                mobAvatar.classList.remove('hidden');
            }
            if(mobIcon) mobIcon.classList.add('hidden');

            // --- БАЗА ДАНИХ: завантажуємо дані ---
            try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.lists) {
                        lists.favorite = new Set(data.lists.favorite || []);
                        lists.backlog = new Set(data.lists.backlog || []);
                        lists.completed = new Set(data.lists.completed || []);
                    }
                    if(data.steamId && data.steamId !== steamId) {
                        steamId = data.steamId;
                        localStorage.setItem(STEAM.idKey, steamId);
                        if(!steamLight) runSteamSyncFlow(); 
                    }
                } else {
                    // Новий юзер: зберігаємо локальні дані в хмару
                    saveToCloud();
                }
            } catch (e) { console.error("Load error", e); }
        } else {
            // --- КОЛИ ВИЙШОВ ---
            
            // Десктоп
            if(userSec) userSec.classList.add('hidden');
            if(loginBtn) loginBtn.classList.remove('hidden');

            // Мобілка (ховаємо аватар, повертаємо іконку)
            if(mobAvatar) mobAvatar.classList.add('hidden');
            if(mobIcon) mobIcon.classList.remove('hidden');
        }
        
        updateBadges();
        if(currentTab !== 'all') runFilter();
    });

    // --- 4. ЗАВАНТАЖЕННЯ ІГОР (СТАНДАРТНЕ) ---
    try {
        allGames = await loadAllDataFiles();
        buildCanonicalGames();
        loadSteamCache();
        enrichCanonicalGamesWithSteam();
        populateFilters();
        updateBadges();
        runFilter();

        const syncBtn = document.getElementById('steamSyncBtn');
        if (syncBtn) syncBtn.onclick = openSteamModal;
        const runBtn = document.getElementById('steamSyncRunBtn');
        if (runBtn) runBtn.onclick = runSteamSyncFlow;
        const clearBtn = document.getElementById('steamSyncClearBtn');
        if (clearBtn) clearBtn.onclick = clearSteamSync;

        const obs = new IntersectionObserver(ent => { if(ent[0].isIntersecting) renderMore(); }, { rootMargin: '400px' });
        if(els.trigger) obs.observe(els.trigger);

        window.canonicalById = canonicalById;
        if (els.loader) { els.loader.classList.add('hidden'); els.loader.classList.remove('flex'); }

    } catch(e) {
        console.error(e);
        if (els.loader) {
            els.loader.innerHTML = `<p class="text-red-500 p-4 text-center">${String(e.message || e)}</p>`;
        }
    }
}

init();
