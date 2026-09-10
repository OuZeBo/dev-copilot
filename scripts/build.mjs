import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').trim();

const frontmatter = read(path.join(root, 'src', 'frontmatter.yaml'));
const version = (frontmatter.match(/^version:\s*(.+)$/m) || [])[1]?.trim();
if (!version) {
  console.error('src/frontmatter.yaml 缺少 version 字段');
  process.exit(1);
}

const chaptersDir = path.join(root, 'src', 'chapters');
const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith('.md')).sort();
const positioning = read(path.join(chaptersDir, '00-positioning.md'));
const chapters = files.filter((f) => f !== '00-positioning.md').map((f) => read(path.join(chaptersDir, f)));
const outputIdx = chapters.findIndex((c) => c.startsWith('## 输出规范'));
if (outputIdx === -1) {
  console.error('缺少输出规范章节（14-output.md）');
  process.exit(1);
}
const outputChapter = chapters.splice(outputIdx, 1)[0];
const versionIntro = read(path.join(root, 'src', 'template-only', '00-version-intro.md'));
const acceptance = read(path.join(root, 'src', 'template-only', '90-acceptance.md'));

const skill = [
  '---',
  frontmatter,
  '---',
  '',
  '# 项目研发全局技能',
  '',
  '架构定位：' + positioning,
  '',
  ...chapters,
  outputChapter.replace('## 输出规范', '## 十四、输出规范'),
  '',
].join('\n');
fs.writeFileSync(path.join(root, 'skills', 'dev-copilot', 'SKILL.md'), skill);

const template = [
  `# 项目技能模板 V${version}`,
  '',
  '## 版本定位',
  '',
  versionIntro,
  '',
  positioning,
  '',
  '生成 `SKILL.md` 时，以下元数据只写入 frontmatter，正文不得重复这些字段：',
  '',
  '```yaml',
  '---',
  frontmatter,
  '---',
  '```',
  '',
  ...chapters,
  acceptance.replace('## 生成产物验收规则', '## 十四、生成产物验收规则'),
  outputChapter.replace('## 输出规范', '## 十五、输出规范'),
  '',
].join('\n');
fs.writeFileSync(path.join(root, `项目技能模板V${version}.md`), template);

console.log(`构建完成：skills/dev-copilot/SKILL.md、项目技能模板V${version}.md`);
