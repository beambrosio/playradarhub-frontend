import platformIcons, { getPlatformIcon } from "../utils/platformIcons";

export default function PlatformIcon({
  platform,
  size = 20,
  className = "",
  alt = "",
}) {
  const [failed, setFailed] = useState(false);
  if (!platform || failed) return null;

  // prefer named export if available
  const resolver =
    typeof getPlatformIcon === "function" ? getPlatformIcon : platformIcons;
  const src = resolver(platform);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || platform}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      onError={() => setFailed(true)}
    />
  );
}
