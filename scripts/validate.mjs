import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failures += 1;
};

const skillPath = path.join(root, 'skills', 'dev-copilot', 'SKILL.md');
check(fs.existsSync(skillPath), 'skills/dev-copilot/SKILL.md 存在（先运行 node scripts/build.mjs）');
if (!fs.existsSync(skillPath)) process.exit(1);
const skill = read(skillPath);

const fmMatch = skill.match(/^---\n([\s\S]*?)\n---/);
check(!!fmMatch, 'frontmatter 存在');
const fm = fmMatch ? fmMatch[1] : '';
check(/^name:\s*dev-copilot$/m.test(fm), 'frontmatter name = dev-copilot');
const fmVersion = (fm.match(/^version:\s*(.+)$/m) || [])[1]?.trim();
const sourceVersion = (read(path.join(root, 'src', 'frontmatter.yaml')).match(/^version:\s*(.+)$/m) || [])[1]?.trim();
check(fmVersion === sourceVersion, `frontmatter version = ${sourceVersion}（实际 ${fmVersion || '缺失'}）`);
check(fm.trim() === read(path.join(root, 'src', 'frontmatter.yaml')).trim(), 'frontmatter 与 src/frontmatter.yaml 一致');

const required = ['提效优先原则', '分级读取表', '负向触发规则', '统一门禁判定表', '初始化扫描流程', '复杂需求协作分流', '原型产物规则', '模块归属判断', '自动记忆策略', '记忆体量控制', '子技能调度规则', '调度去重', '验证输出摘要', '声明式', 'Task Episode', 'configured', 'observed', 'verified', 'failed', 'unobserved', 'deferred', '只读审计', '重复问题发现', '反馈路由'];
for (const s of required) check(skill.includes(s), `必备规则：${s}`);

check((skill.match(/^version:/gm) || []).length === 1, 'version 只在 frontmatter 出现');
check((skill.match(/^dependencies:/gm) || []).length === 1, 'dependencies 只在 frontmatter 出现');
check(!/(mySkills|[A-Za-z]:\\|OuZeBo)/.test(skill), '项目中立（无本机路径或项目名）');
check(!skill.includes('2.0.1') && !skill.includes('2.0.2'), '无旧版本号残留');

const lines = skill.split('\n');
let expect = null;
let numberingOk = true;
let numberingMsg = '';
for (let i = 0; i < lines.length; i += 1) {
  const m = lines[i].match(/^(\d+)\.\s/);
  if (m) {
    const n = Number(m[1]);
    if (expect === null && n !== 1) {
      numberingOk = false;
      numberingMsg = `第 ${i + 1} 行列表未从 1 开始`;
      break;
    }
    if (expect !== null && n !== expect) {
      numberingOk = false;
      numberingMsg = `第 ${i + 1} 行编号 ${n}，期望 ${expect}`;
      break;
    }
    expect = n + 1;
  } else {
    expect = null;
  }
}
check(numberingOk, `有序列表编号连续${numberingOk ? '' : `（${numberingMsg}）`}`);

const deps = [...fm.matchAll(/^-\s*(\S+)$/gm)].map((m) => m[1]);
check(deps.length === 13, `dependencies 共 13 项（实际 ${deps.length}）`);
for (const dep of deps) {
  check(fs.existsSync(path.join(root, 'skills', dep, 'SKILL.md')), `依赖副本存在：${dep}`);
}
check(!deps.includes('grilling'), 'dependencies 未重复声明 grilling');
check(fs.existsSync(path.join(root, 'skills', 'grilling', 'SKILL.md')), '传递依赖 grilling 副本存在');

const yamlPath = path.join(root, 'skills', 'dev-copilot', 'agents', 'openai.yaml');
const yaml = fs.existsSync(yamlPath) ? read(yamlPath) : '';
check(yaml.includes('项目研发助手'), 'openai.yaml display_name 合规');
check(/allow_implicit_invocation:\s*true/.test(yaml), 'openai.yaml 允许隐式触发');

console.log(failures ? `\n${failures} 项未通过` : '\n全部通过');
process.exit(failures ? 1 : 0);
