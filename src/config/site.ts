/**
 * Central site configuration for Cloud9 SaaS (operated by Str3am State LLC).
 * 
 * IMPORTANT: To keep the business honest and credible:
 * - Legal entity name (`Str3am State LLC`) is strictly separated from public brand (`Cloud9 SaaS`).
 * - Do not represent `Cloud9 SaaS` as a state-registered DBA until formal assumed-name registration is confirmed.
 * - If a value is empty (e.g., contactEmail, phone, fiverrUrl), it will NOT be displayed publicly.
 * - The primary contact method is the working Netlify inquiry form on the /contact page.
 */

export interface SiteConfig {
  businessName: string;
  legalEntityName: string;
  registeredAddress: string;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  serviceArea: string;
  canonicalUrl: string;
  ownerName: string;
  ownerTitle: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  phoneRaw: string;
  smsConsentEndpoint: string;
  smsDisclosureVersion: string;
  githubUrl: string;
  fiverrUrl: string;
  linkedInUrl: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  googleSearchConsoleVerification: string;
  ownerLoginUrl: string;
}

function isPrivateOrLocalHostname(hostname: string): boolean {
  const h = (hostname || '').toLowerCase().trim();
  if (
    !h ||
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '0.0.0.0' ||
    h === '::1' ||
    h === '[::1]' ||
    h.endsWith('.local') ||
    h.endsWith('.internal') ||
    !h.includes('.')
  ) {
    return true;
  }
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  return false;
}

export function resolveVerifiedOwnerLoginUrl(
  rawUrlOverride?: string,
  previewModeOverride?: boolean
): string {
  const isPreviewMode =
    typeof previewModeOverride === 'boolean'
      ? previewModeOverride
      : import.meta.env.PUBLIC_JENKINS_HQ_PREVIEW_MODE === 'true' ||
      (typeof process !== 'undefined' &&
        Boolean(process.env) &&
        process.env.PUBLIC_JENKINS_HQ_PREVIEW_MODE === 'true');
  const envVal =
    typeof rawUrlOverride === 'string'
      ? rawUrlOverride
      : import.meta.env.PUBLIC_JENKINS_HQ_OWNER_LOGIN_URL ||
      (typeof process !== 'undefined' && process.env
        ? process.env.PUBLIC_JENKINS_HQ_OWNER_LOGIN_URL
        : '') ||
      '';
  const raw = String(envVal).trim();
  if (!raw || raw.includes('<') || raw.includes('>')) {
    return '';
  }
  try {
    const parsed = new URL(raw);
    // Never expose credentials, query tokens/keys, or fragments in the public bundle
    if (parsed.username || parsed.password || parsed.search || parsed.hash) {
      return '';
    }
    if (!parsed.pathname.startsWith('/login')) {
      return '';
    }
    // Production requires an authorized public HTTPS endpoint with no custom/local backend port
    if (parsed.protocol === 'https:') {
      if (parsed.port !== '' || isPrivateOrLocalHostname(parsed.hostname)) {
        return '';
      }
      return `${parsed.origin}${parsed.pathname}`;
    }
    // Local preview runner explicitly passes PUBLIC_JENKINS_HQ_PREVIEW_MODE=true
    if (
      isPreviewMode &&
      parsed.protocol === 'http:' &&
      (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost')
    ) {
      return `${parsed.origin}${parsed.pathname}`;
    }
  } catch {
    return '';
  }
  return '';
}

export const siteConfig: SiteConfig = {
  businessName: 'Cloud9 SaaS',
  legalEntityName: 'Str3am State LLC',
  registeredAddress: '1016 Manor Road, Staten Island, NY 10314',
  tagline: 'Professional software engineering and SaaS solutions at practical, accessible pricing.',
  heroHeadline: 'Software Engineering for Businesses That Need Things to Work',
  heroSubhead:
    'Cloud9 SaaS builds websites, custom software, automations, integrations, internal tools, and AI-assisted solutions for local and remote clients.',
  serviceArea: 'Based in Staten Island, NY • Serving NYC & remote clients nationwide.',
  canonicalUrl: 'https://cloud9saas.com',
  ownerName: 'Jeremi M. Jenkins',
  ownerTitle: 'Software Engineer',
  contactEmail: 'contact@cloud9saas.com',
  supportEmail: 'contact@cloud9saas.com',
  // Dedicated SignalWire business phone only (private owner mobile is NEVER published here)
  phone: '(315) 502-2862',
  phoneRaw: '+13155022862',
  smsConsentEndpoint: 'https://vps-32f425d8.vps.ovh.us/api/public/sms-consent',
  smsDisclosureVersion: 'cloud9saas-signalwire-v3-2026-11-23',
  githubUrl: 'https://github.com/Jayj3nks',
  fiverrUrl: '',
  linkedInUrl: '',
  socialLinks: [],
  googleSearchConsoleVerification: '',
  ownerLoginUrl: resolveVerifiedOwnerLoginUrl(),
};

export const hasEmail = Boolean(siteConfig.contactEmail && siteConfig.contactEmail.trim() !== '');
export const hasPhone = Boolean(siteConfig.phone && siteConfig.phone.trim() !== '');
export const hasFiverr = Boolean(siteConfig.fiverrUrl && siteConfig.fiverrUrl.trim() !== '');
export const hasGitHub = Boolean(siteConfig.githubUrl && siteConfig.githubUrl.trim() !== '');
export const hasLinkedIn = Boolean(siteConfig.linkedInUrl && siteConfig.linkedInUrl.trim() !== '');
export const hasOwnerLogin = Boolean(siteConfig.ownerLoginUrl && siteConfig.ownerLoginUrl.trim() !== '');
