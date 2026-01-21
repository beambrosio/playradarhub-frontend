// javascript
// file: `src/utils/platformIcons.js`
export default function platformIcons(platformName) {
  if (!platformName) return null;

  // accept objects like { name: "Android" }
  if (typeof platformName === 'object' && platformName !== null && platformName.name) {
    platformName = platformName.name;
  }

  const input = String(platformName).trim();
  const lower = input.toLowerCase();

  // map keys must be lowercase and values are filenames only (no leading /icons/)
  const ICON_MAP = {
    android: 'mobile.svg',
    ios: 'mobile.svg',
    mobile: 'mobile.svg',
    pc: 'pc.svg',
    windows: 'pc.svg',
    'microsoft windows': 'pc.svg',
    'pc (microsoft windows)': 'pc.svg',
    mac: 'pc.svg',
    linux: 'pc.svg',
    playstation: 'playstation.svg',
    'playstation 5': 'playstation.svg',
    ps5: 'playstation.svg',
    ps4: 'playstation.svg',
    xbox: 'xbox.svg',
    xsx: 'xbox.svg',
    xboxseries: 'xbox.svg',
    switch: 'switch.svg',
    nintendo: 'switch.svg',
    stadia: 'stadia.svg',
  };

  const sanitize = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-') // replace invalid chars with dashes
      .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
      .replace(/-+/g, '-'); // collapse multiple dashes

  // full URL -> return as-is
  if (/^https?:\/\//i.test(input)) return input;

  // already a path under /icons/ -> return as-is
  if (input.startsWith('/icons/')) return input;

  // exact map lookup (use lower-case keys)
  if (ICON_MAP[lower]) return `/icons/${ICON_MAP[lower]}`;

  // contains-based lookup (e.g., "playstation 5" includes "playstation")
  for (const key of Object.keys(ICON_MAP)) {
    if (lower.includes(key)) return `/icons/${ICON_MAP[key]}`;
  }

  // if a filename (with extension) was passed
  if (/\.(svg|png|jpg|jpeg|webp)$/i.test(input)) {
    // if it contains a path, return as-is; otherwise point to public/icons
    if (input.includes('/')) return input;
    return `/icons/${sanitize(input)}`;
  }

  // fallback: sanitize the platform name and assume `.svg` in public/icons
  return `/icons/${sanitize(lower)}.svg`;
}

// named export for compatibility
export const getPlatformIcon = platformIcons;
