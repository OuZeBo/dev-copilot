import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(root, 'skills');
const target = path.resolve(process.argv[2] || path.join(os.homedir(), '.codex', 'skills'));
const frontmatter = fs.readFileSync(path.join(root, 'src', 'frontmatter.yaml'), 'utf8');
const deps = [...frontmatter.matchAll(/^-\s*(\S+)$/gm)].map((m) => m[1]);
const entries = ['dev-copilot', ...deps];

if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

for (const entryName of entries) {
  const src = path.join(skillsDir, entryName);
  const dest = path.join(target, entryName);
  if (!fs.existsSync(src)) {
    console.error(`缺少技能副本：${entryName}`);
    process.exit(1);
  }
  if (entryName === 'dev-copilot') {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`已更新 ${entryName}（覆盖旧版）`);
  } else if (fs.existsSync(dest)) {
    console.log(`跳过 ${entryName}（目标已存在，避免覆盖可能更新的版本）`);
  } else {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`已安装 ${entryName}`);
  }
}
console.log(`\n目标目录：${target}`);
console.log('完成。若跳过的依赖版本过旧，请手动更新后重跑。');
