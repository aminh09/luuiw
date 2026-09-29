export interface SocialLink {
  label: string
  url: string
  icon: 'facebook' | 'message' | 'zalo' | 'instagram' | 'mail'
}

export const siteConfig = {
  brand: 'Luuiw',
  owner: 'Anh Minh',
  email: 'le1420445@gmail.com',
  responseHours: '8:00–24:00',
  githubUrl: 'https://github.com/aminh09',
  repositoryName: 'luuiw',
  facebookUrl:
    'https://www.facebook.com/share/1DvhyxmkCJ/?mibextid=wwXIfr',
  messengerUrl:
    'https://m.me/aqeoiterz3.006?hash=FQAsR-lEo32TAhrV&source_id=8585216',
  zaloUrl: 'https://zalo.me/0986876541',
  instagramUrl: 'https://www.instagram.com/_aqueooo.iterz3/',
  appsScriptUrl: (import.meta.env.VITE_APPS_SCRIPT_URL ?? '').trim(),
} as const

function isValidPublicUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'mailto:'
  } catch {
    return false
  }
}

const candidateSocialLinks: SocialLink[] = [
  { label: 'Zalo', url: siteConfig.zaloUrl, icon: 'zalo' },
  { label: 'Messenger', url: siteConfig.messengerUrl, icon: 'message' },
  { label: 'Facebook', url: siteConfig.facebookUrl, icon: 'facebook' },
  { label: 'Instagram', url: siteConfig.instagramUrl, icon: 'instagram' },
  {
    label: 'Email',
    url: `mailto:${siteConfig.email}`,
    icon: 'mail',
  },
]

export const socialLinks = candidateSocialLinks.filter((link) =>
  isValidPublicUrl(link.url),
)
