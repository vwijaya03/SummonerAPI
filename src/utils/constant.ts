export const API_KEY = process.env.RIOT_API_KEY || '';
export const API = {
  GET_SUMMONER_BY_NAME: '/lol/summoner/v4/summoners/by-name/',
  GET_MATCH_IDS_BY_PUUID: '/lol/match/v5/matches/by-puuid/{puuid}/ids',
  GET_DETAIL_MATCH: '/lol/match/v5/matches/',
  GET_LEAGUE_ENTRIES_ALL_QUEUE: '/lol/league/v4/entries/by-summoner/',
};
export const ROUTING = {
  NA1: {
    platform: 'na1.api.riotgames.com',
    region: 'americas.api.riotgames.com',
  },
  BR1: {
    platform: 'br1.api.riotgames.com',
    region: 'americas.api.riotgames.com',
  },
  LA1: {
    platform: 'la1.api.riotgames.com',
    region: 'americas.api.riotgames.com',
  },
  LA2: {
    platform: 'la2.api.riotgames.com',
    region: 'americas.api.riotgames.com',
  },
  JP1: {
    platform: 'jp1.api.riotgames.com',
    region: 'asia.api.riotgames.com',
  },
  KR: {
    platform: 'kr.api.riotgames.com',
    region: 'asia.api.riotgames.com',
  },
  EUN1: {
    platform: 'eun1.api.riotgames.com',
    region: 'europe.api.riotgames.com',
  },
  EUW1: {
    platform: 'euw1.api.riotgames.com',
    region: 'europe.api.riotgames.com',
  },
  TR1: {
    platform: 'tr1.api.riotgames.com',
    region: 'europe.api.riotgames.com',
  },
  RU: {
    platform: 'ru.api.riotgames.com',
    region: 'europe.api.riotgames.com',
  },
  OC1: {
    platform: 'oc1.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
  PH2: {
    platform: 'ph2.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
  SG2: {
    platform: 'sg2.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
  TH2: {
    platform: 'th2.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
  TW2: {
    platform: 'tw2.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
  VN2: {
    platform: 'vn2.api.riotgames.com',
    region: 'sea.api.riotgames.com',
  },
};
export const QUEUE_TYPES = {
  ALL: 0,
  ARAM: 450,
  RANKED_SOLO_5x5: 420,
  RANKED_FLEX_SR: 440,
  NORMAL_BLIND_PICK: 430,
  NORMAL_DRAFT_PICK: 400,
};
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
