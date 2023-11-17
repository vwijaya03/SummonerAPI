import { ROUTING } from './constant';

export function buildApiUrl(region: string, endpoint: string): any {
  const routing = ROUTING[region] || ROUTING['NA1'];

  const platformUrl = `https://${routing.platform}${endpoint}`;
  const regionUrl = `https://${routing.region}${endpoint}`;

  return { platformUrl, regionUrl };
}
