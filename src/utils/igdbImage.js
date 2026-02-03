// javascript
// file: `src/utils/igdbImage.js`

export function getHighResImage(url, size = "t_1080p") {
  if (!url) return "";
  try {
    return url.replace(/t_[^/]+/i, size);
  } catch (e) {
    return url;
  }
}

function buildFromId(id, sizeToken = "t_cover_big") {
  if (!id) return "";
  if (/^https?:\/\//i.test(id)) return id;
  if (id.startsWith("//")) return "https:" + id;
  if (/^[a-z0-9_]+$/i.test(id)) {
    return `https://images.igdb.com/igdb/image/upload/${sizeToken}/${id}.jpg`;
  }
  return id;
}

function normalizeSize(size) {
  if (!size) return "t_cover_big";
  // allow passing friendly names like "cover_big" or raw tokens like "t_1080p"
  if (/^t_/i.test(size)) return size;
  return `t_${size.replace(/^t_/, "")}`;
}

export default function getIgdbImage(input, options = {}) {
  if (!input) return "";

  const sizeToken = normalizeSize(
    options.size || options?.type || "t_cover_big",
  );

  // If a game-like object was passed, try common fields
  if (typeof input === "object") {
    // If object has cover, prefer that
    if (input.cover) {
      // cover can be an object or string
      const cover = input.cover;
      if (typeof cover === "string") return buildFromId(cover, sizeToken);
      if (cover.image_id) return buildFromId(cover.image_id, sizeToken);
      if (cover.url) {
        let u = cover.url;
        if (u.startsWith("//")) u = "https:" + u;
        try {
          u = u.replace(/t_thumb/gi, sizeToken);
        } catch (e) {}
        return u;
      }
    }

    // Other possible fields
    const candidates = [
      input.image,
      input.url,
      input.background_image,
      input.thumbnail,
      input.image_id,
      input.screenshots && input.screenshots[0] && input.screenshots[0].url,
      input.screenshots &&
        input.screenshots[0] &&
        input.screenshots[0].image_id,
    ];

    for (const cand of candidates) {
      if (!cand) continue;
      if (typeof cand === "string") {
        let u = cand;
        if (u.startsWith("//")) u = "https:" + u;
        if (!/^https?:\/\//i.test(u) && /^[a-z0-9_]+$/i.test(u))
          u = buildFromId(u, sizeToken);
        try {
          u = u.replace(/t_thumb/gi, sizeToken);
        } catch (e) {}
        if (u) return u;
      } else if (typeof cand === "object") {
        const possible = cand.url || cand.src || cand.image_id || cand.id || "";
        if (!possible) continue;
        let u = possible;
        if (u.startsWith("//")) u = "https:" + u;
        if (!/^https?:\/\//i.test(u) && /^[a-z0-9_]+$/i.test(u))
          u = buildFromId(u, sizeToken);
        try {
          u = u.replace(/t_thumb/gi, sizeToken);
        } catch (e) {}
        if (u) return u;
      }
    }

    return "";
  }

  // If input is a string (url or image id)
  if (typeof input === "string") {
    let u = input;
    if (u.startsWith("//")) u = "https:" + u;
    if (!/^https?:\/\//i.test(u) && /^[a-z0-9_]+$/i.test(u))
      u = buildFromId(u, sizeToken);
    try {
      u = u.replace(/t_thumb/gi, sizeToken);
    } catch (e) {}
    return u;
  }

  return "";
}
