import { rmSync } from "node:fs";

rmSync(".next", { recursive: true, force: true });
console.log("Removed .next cache");
