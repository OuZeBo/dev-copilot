import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(root, 'skills');
const target = path.resolve(process.argv[2] || path.join(os.homedir(), '.codex', 'skills'));

if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

const entries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory());
for (const entry of entries) {
  const src = path.join(skillsDir, entry.name);
  const dest = path.join(target, entry.name);
  if (entry.name === 'dev-copilot') {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`已更新 ${entry.name}（覆盖旧版）`);
  } else if (fs.existsSync(dest)) {
    console.log(`跳过 ${entry.name}（目标已存在，避免覆盖可能更新的版本）`);
  } else {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`已安装 ${entry.name}`);
  }
}
console.log(`\n目标目录：${target}`);
console.log('完成。若跳过的依赖版本过旧，请手动更新后重跑。');
