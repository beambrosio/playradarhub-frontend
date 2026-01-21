export function formatDate(unixTimestamp) {
  if (!unixTimestamp) return "";
  const date = new Date(unixTimestamp * 1000);
  const options = { month: "short", day: "numeric", year: "numeric" };
  // Format: May, 25 2025
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day} ${year}`;
}