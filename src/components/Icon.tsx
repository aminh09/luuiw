import type { IconName } from '../types'
import type { ReactNode } from 'react'

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

const paths: Record<IconName, ReactNode> = {
  'arrow-right': <path d="m9 18 6-6-6-6M3 12h12" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5m0-15v15M8 7h8m-8 4h6" />,
  briefcase: <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-11 4h16m-8 0v2M4 7h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />,
  database: <path d="M20 6c0 1.7-3.6 3-8 3S4 7.7 4 6s3.6-3 8-3 8 1.3 8 3Zm0 0v6c0 1.7-3.6 3-8 3s-8-1.3-8-3V6m16 6v6c0 1.7-3.6 3-8 3s-8-1.3-8-3v-6" />,
  document: <path d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h5m-5 4h5" />,
  external: <path d="M14 4h6v6m0-6-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />,
  facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />,
  filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  mail: <path d="M3 6h18v12H3V6Zm0 1 9 7 9-7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  message: <path d="M21 11.5a8.5 8.5 0 0 1-10.6 8.2L4 21l1.3-5.1A8.5 8.5 0 1 1 21 11.5Z" />,
  palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3.5A5.5 5.5 0 0 0 21 8.5C21 5.5 17 3 12 3ZM7.5 10h.01M9 6.5h.01M14 6h.01M17.5 9h.01" />,
  search: <path d="m20 20-4.5-4.5M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />,
  send: <path d="m3 11 18-8-8 18-2-8-8-2Zm8 2 4-4" />,
  shield: <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Zm-3-10 2 2 4-5" />,
  sparkle: <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />,
  table: <path d="M4 4h16v16H4V4Zm0 5h16M9 4v16m6-11v11" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
  zalo: <path d="M5 6h14v12H9l-4 3v-3H3V8a2 2 0 0 1 2-2Zm2 4h4l-4 4h4m2 0v-4h3v4m-3-2h3" />,
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}
