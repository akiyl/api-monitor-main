import { randomBytes } from "crypto";

export function generateApiKey() {
  return `ak_${randomBytes(32).toString("hex")}`;
}
