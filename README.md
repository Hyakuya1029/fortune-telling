# 星签 · STELLAR ORACLE

一个每天只抽一次的现代星签网站。深色宇宙风、原创中文签文、抽签仪式与解签页面，面向 `fortune.hyakuya.cc.cd`。

## 当前版本

- 每日一签：按 `Asia/Shanghai` 日期决定当天签文，同一天所有人一致
- 36 支原创星签：签诗、解签、行动提示、宜忌、关键词、幸运色、数字、五行
- 抽签动效：卡片摇动、翻转、自动滚动到解签
- 今日已抽记录：保存在浏览器 `localStorage`，刷新后仍可查看
- 分享：优先调用系统分享，不支持时复制签文
- 签文录：36 支签的筛选、展开与详情
- 响应式：桌面、平板、手机
- SEO：metadata、Canonical、`robots.txt`、`sitemap.xml`、404 页面
- 无登录、无数据库依赖，部署即可用

> 内容为原创，仅供自我观照与娱乐，不构成任何决策建议。

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript
- 原生 CSS（无 UI 框架）
- GitHub + Vercel
- Supabase 暂未启用。当前版本没有账号与跨设备数据需求，所以不引入数据库；后续可接匿名统计、登录历史或收藏。

## 本地运行

要求 Node.js `>= 20.9`。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

生产构建：

```bash
npm run build
npm start
```

类型检查：

```bash
npm run typecheck
```

## 目录

```text
src/
  app/
    fortunes/page.tsx   签文录
    globals.css         全部视觉样式
    layout.tsx          根布局与站点 metadata
    page.tsx            首页（每日签）
    not-found.tsx       404
    robots.ts
    sitemap.ts
  components/
    CelestialDial.tsx   首页星盘
    FortuneArchive.tsx  签文录筛选与展开
    FortuneExperience.tsx 抽签、解签、分享
    SiteFooter.tsx
    SiteHeader.tsx
    StarField.tsx       星空背景
  data/
    fortunes.ts         36 支签文
  lib/
    daily.ts            日期、每日签、存储 key、分享文案
```

## 部署到 Vercel

1. 在 GitHub 新建仓库，例如 `fortune-telling`。
2. 在项目目录初始化并推送：

```bash
git init
git add .
git commit -m "feat: initial stellar oracle"
git branch -M main
git remote add origin https://github.com/<你的用户名>/fortune-telling.git
git push -u origin main
```

3. 在 Vercel 选择 **Add New → Project**，导入该仓库。
4. Framework Preset 会自动识别为 Next.js；Build Command 保持 `npm run build`。
5. 在 Vercel 项目的 **Settings → Environment Variables** 添加：

```text
NEXT_PUBLIC_SITE_URL=https://fortune.hyakuya.cc.cd
```

6. 点击 Deploy。首次部署完成后会得到 `*.vercel.app` 地址，先确认页面正常。

## 绑定 `fortune.hyakuya.cc.cd`

可以做到，且不需要把整个个人网站迁走。你的 `hyakuya.cc.cd` 在 Cloudflare 管理 DNS，按下面做：

1. 打开 Vercel 项目 → **Settings → Domains**。
2. 输入 `fortune.hyakuya.cc.cd`，选择 **Add**，绑定到当前项目。
3. Vercel 会给出需要配置的 DNS 目标，通常是 `cname.vercel-dns.com`。
4. 打开 Cloudflare → 选择 `hyakuya.cc.cd` 对应的站点 → **DNS → Records → Add record**：
   - Type：`CNAME`
   - Name：`fortune`
   - Target：`cname.vercel-dns.com`
   - Proxy status：先选 **DNS only**（灰色云朵）
   - TTL：`Auto`
5. 回到 Vercel，等待域名状态变成 **Valid**，HTTPS 证书会自动签发。
6. 打开 `https://fortune.hyakuya.cc.cd` 验证。

### 注意事项

- **先关掉 Cloudflare 代理**。橙色云朵会让 Vercel 的域名验证和证书签发更容易出问题；验证通过后如果想开启代理，SSL/TLS 模式必须设为 **Full (strict)**，否则可能出现重定向循环。
- 如果 Cloudflare 里已经有 `*` 泛解析 CNAME，显式添加 `fortune` 仍然更清晰，避免以后被泛解析改坏。
- 如果 Vercel 显示 `Invalid Configuration`，优先检查 CNAME 的 Name 是否只填了 `fortune`，不要填完整域名。
- 如果访问出现 Cloudflare `522` 或 `Too many redirects`，先切回 DNS only，再检查 SSL/TLS 模式。
- Supabase 不需要绑定这个子域名；以后如果做 OAuth 回调，再在 Supabase Auth 的 Redirect URLs 里加入正式域名。

## Supabase 预留说明

这一版刻意没有接数据库：

- 不收集身份信息
- 今日签只存在浏览器
- 没有登录、跨设备同步或全站统计

如果后续要做以下任一功能，再引入 Supabase：

- 邮箱 / 第三方登录
- 跨设备保存历史与收藏
- 全站匿名抽签次数
- 后台录入或修改签文

建议到时候新增 `profiles`、`draw_history`、`draw_events` 表，并开启 RLS；匿名统计通过服务端 Route Handler 写入，不把 service role key 暴露到浏览器。

## 内容与文案

36 支签为原创文本，不使用传统庙签的固定签诗，也不输出“必然吉凶”的断言。等级分为：上上、上吉、中吉、小吉、平。

如需替换签文，编辑 `src/data/fortunes.ts` 即可；每支签的 `id` 会被用于每日轮换和本地记录，尽量不要改已有 `id`。
