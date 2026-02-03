export default function platformIcons(platformName) {
  if (!platformName) return null;

  // accept objects like { name: "Android" }
  if (
    typeof platformName === "object" &&
    platformName !== null &&
    platformName.name
  ) {
    platformName = platformName.name;
  }

  const input = String(platformName).trim();
  const lower = input.toLowerCase();

  const ICON_MAP = {
    android: "android.svg",
    ios: "ios.svg",
    mobile: "mobile.svg",
    pc: "pc.svg",
    windows: "pc.svg",
    "microsoft windows": "pc.svg",
    "pc (microsoft windows)": "pc.svg",
    mac: "mac.svg",
    linux: "linux.svg",
    playstation: "playstation.svg",
    "playstation 5": "playstation.svg",
    ps5: "playstation.svg",
    ps4: "playstation.svg",
    xbox: "xbox.svg",
    xsx: "xbox.svg",
    xboxseries: "xbox.svg",
    switch: "switch.svg",
    nintendo: "switch.svg",
    stadia: "stadia.svg",
  };

  const sanitize = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");

  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith("/icons/")) return input;
  if (ICON_MAP[lower]) return `/icons/${ICON_MAP[lower]}`;

  for (const key of Object.keys(ICON_MAP)) {
    if (lower.includes(key)) return `/icons/${ICON_MAP[key]}`;
  }

  if (/\.(svg|png|jpg|jpeg|webp)$/i.test(input)) {
    if (input.includes("/")) return input;
    return `/icons/${sanitize(input)}`;
  }

  return `/icons/${sanitize(lower)}.svg`;
}

// named export for compatibility
export const getPlatformIcon = platformIcons;
