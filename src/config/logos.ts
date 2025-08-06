// Logo configuration - Update all logo paths from here
// Use this file to manage all logo assets across the platform

export const LOGO_PATHS = {
  // League Official Logos
  league: {
    main: '/logos/league/league-main.png',
    icon: '/logos/league/league-icon.png',
    // Fallback placeholder (keep until real logos are added)
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDAiIHgxPSIwIiB5MT0iMCIgeDI9IjQwIiB5Mj0iNDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q2MjAyNyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMTc0NDQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
  },

  // Federation Official Logos  
  federation: {
    main: '/logos/federation/federation-main.png',
    // North African Union logo
    northAfrica: '/logos/federation/north-african-union.png',
    // African Union logo
    africa: '/logos/federation/african-union.png',
    // International Federation
    jjif: '/logos/federation/jjif-logo.png',
    // Fallback placeholder (keep until real logos are added)
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAxNzQ0NCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GRTwvdGV4dD4KPC9zdmc+Cg=='
  },

  // Admin/Login Specific
  admin: {
    login: '/logos/admin/admin-login.png',
    dashboard: '/logos/admin/admin-dashboard.png',
    // Fallback placeholder
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8cGF0aCBkPSJNMjAgMTBMMjQgMTZIMTZMMjAgMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMjJIMjhWMjZIMTJWMjJaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDAiIHgxPSIwIiB5MT0iMCIgeDI9IjQwIiB5Mj0iNDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q2MjAyNyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMTc0NDQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
  }
} as const;

// Cloudinary configuration for user-uploaded images
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'lrcsjj-uploads',
  
  // Cloudinary transformation presets for different image types
  transformations: {
    // User profile avatars
    avatar: {
      small: 'w_64,h_64,c_fill,g_face,r_max,q_auto,f_auto',
      medium: 'w_128,h_128,c_fill,g_face,r_max,q_auto,f_auto', 
      large: 'w_256,h_256,c_fill,g_face,r_max,q_auto,f_auto'
    },
    
    // Club logos
    clubLogo: {
      small: 'w_64,h_64,c_fit,q_auto,f_auto',
      medium: 'w_128,h_128,c_fit,q_auto,f_auto',
      large: 'w_256,h_256,c_fit,q_auto,f_auto'
    },
    
    // Event/tournament images
    event: {
      thumbnail: 'w_300,h_200,c_fill,q_auto,f_auto',
      banner: 'w_1200,h_400,c_fill,q_auto,f_auto'
    },
    
    // News/article images
    news: {
      thumbnail: 'w_300,h_200,c_fill,q_auto,f_auto',
      featured: 'w_800,h_400,c_fill,q_auto,f_auto'
    }
  }
} as const;

// Helper function to build Cloudinary URLs
export function buildCloudinaryUrl(
  publicId: string, 
  transformation?: string
): string {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  
  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
}

// Helper function to get user avatar URL
export function getUserAvatarUrl(
  publicId: string | null | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!publicId) {
    // Return default avatar placeholder
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzllYTNiYSIvPgo8cGF0aCBkPSJNMzIgMzJjMC02LjYyNy01LjM3My0xMi0xMi0xMnMtMTIgNS4zNzMtMTIgMTIiIGZpbGw9IiM5ZWEzYmEiLz4KPC9zdmc+Cg==`;
  }
  
  const transformation = CLOUDINARY_CONFIG.transformations.avatar[size];
  return buildCloudinaryUrl(publicId, transformation);
}

// Helper function to get club logo URL
export function getClubLogoUrl(
  publicId: string | null | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!publicId) {
    // Return default club logo placeholder
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI2QxZDVkYiIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM2Yjc0ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNMVUI8L3RleHQ+Cjwvc3ZnPgo=`;
  }
  
  const transformation = CLOUDINARY_CONFIG.transformations.clubLogo[size];
  return buildCloudinaryUrl(publicId, transformation);
}

// Logo size configurations
export const LOGO_SIZES = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 }
} as const;

// Color schemes for different elements
export const COLOR_SCHEMES = {
  red: {
    primary: '#d62027',
    secondary: '#b91c1c',
    text: '#ffffff'
  },
  green: {
    primary: '#017444', 
    secondary: '#059669',
    text: '#ffffff'
  },
  gold: {
    primary: '#fbbf24',
    secondary: '#f59e0b', 
    text: '#000000'
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    text: '#ffffff'
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    text: '#ffffff'
  }
} as const;

// Logo usage guidelines
export const LOGO_GUIDELINES = {
  // When to use each logo type
  usage: {
    leagueMain: 'Primary branding in headers, landing pages, official documents',
    leagueIcon: 'Small spaces, favicons, navigation bars, mobile headers',
    federationMain: 'Footer recognition, about pages, partnership sections',
    federationBadge: 'Certifications, official seals, document headers',
    adminLogin: 'Admin authentication pages, secure areas',
    userAvatar: 'Profile pictures, team rosters, comment sections'
  },
  
  // Minimum sizes to maintain readability
  minSizes: {
    withText: 48, // Minimum size when logo includes text
    iconOnly: 24,  // Minimum size for icon-only logos
    avatar: 32     // Minimum size for user avatars
  }
} as const;
