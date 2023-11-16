import { REGION } from './constant';

export function buildApiUrl(region: string, endpoint: string): string {
  const mappedRegion = REGION[region] || 'na1';
  const url = `https://${mappedRegion}.api.riotgames.com${endpoint}`;

  return url;
}
