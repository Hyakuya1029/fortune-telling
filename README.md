# 星签 · STELLAR ORACLE

星签是一个每日一签网站：以 `Asia/Shanghai` 时区为基准，每天生成一支原创星签，提供签诗、解签、宜忌与行动提示。

生产地址：<https://fortune.hyakuya.cc.cd>

## 概览

- 每日一签：同一天内所有访问者获得同一支签，零点轮换
- 36 支原创签文：签诗、解签、行动提示、宜忌、关键词、幸运色、数字、五行
- 抽签仪式：卡片摇动、翻转、自动滚动到解签
- 本地记录：今日签写入浏览器 `localStorage`，刷新或回访后仍可查看
- 分享：支持系统分享，不支持时复制签文
- 签文录：支持等级筛选、展开详情、筛选后定位结果
- 响应式布局：覆盖桌面、平板与 320px 起的手机视口
- SEO：metadata、Canonical、`robots.txt`、`sitemap.xml`、Open Graph 分享图与 404 页面
- 无登录、无数据库依赖

> 内容为原创，仅供自我观照与娱乐，不构成任何决策建议。

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript
- 原生 CSS，无 UI 框架
- GitHub + Vercel
- Supabase 未启用

## 项目结构

```text
src/
  app/
    fortunes/page.tsx     签文录
    globals.css           全站视觉、响应式与动效
    layout.tsx            根布局与站点 metadata
    page.tsx              首页（每日签）
    not-found.tsx         404
    robots.ts
    sitemap.ts
  components/
    CelestialDial.tsx     首页星盘
    FortuneArchive.tsx    签文录筛选与展开
    FortuneExperience.tsx 抽签、解签、分享
    SiteFooter.tsx
    SiteHeader.tsx
    StarField.tsx         星空背景
  data/
    fortunes.ts           36 支签文
  lib/
    daily.ts              日期、每日签、存储 key、分享文案
```

## 本地开发

要求 Node.js `>= 20.9`。

```bash
npm install
npm run dev
```

默认地址为 <http://localhost:3000>。

其他命令：

```bash
npm run build      # 生产构建
npm start          # 运行生产构建
npm run typecheck  # TypeScript 检查
```

## 构建与部署

项目使用 Vercel 部署，构建配置保持默认的 Next.js 设置：

- Build Command：`npm run build`
- Output：Next.js 默认输出
- Node.js：20.9 及以上

生产环境变量：

```text
NEXT_PUBLIC_SITE_URL=https://fortune.hyakuya.cc.cd
```

该变量用于生成 metadata、Canonical、`sitemap.xml`、`robots.txt` 与分享链接。

## 域名与 DNS

生产域名：

```text
fortune.hyakuya.cc.cd
```

域名由 Cloudflare 管理 DNS，通过 CNAME 指向 Vercel：

```text
fortune → Vercel 提供的 CNAME 目标
```

Cloudflare 代理在首次绑定和证书签发阶段保持 DNS only；如需开启代理，SSL/TLS 模式应使用 Full (strict)，避免重定向循环。HTTPS 证书由 Vercel 自动签发。

## 每日签规则

- 时区固定为 `Asia/Shanghai`
- 以当天日期计算 0–35 的索引，同一天返回同一支签
- 签文按 `id` 稳定引用，调整数组顺序不会影响已保存的今日签
- `localStorage` key 格式为 `stellar-oracle:draw:YYYY-MM-DD`
- 抽签记录只保存在当前浏览器，不包含身份信息

## 数据维护

签文集中在 `src/data/fortunes.ts`。每支签包含：

```ts
interface Fortune {
  id: number;
  level: "上上" | "上吉" | "中吉" | "小吉" | "平";
  title: string;
  english: string;
  poem: [string, string, string, string];
  interpretation: string;
  guidance: string;
  yi: string[];
  ji: string[];
  keyword: string;
  element: "木" | "火" | "土" | "金" | "水";
  color: { name: string; hex: string };
  luckyNumber: number;
}
```

每日轮换依赖 `id`，已有签文的 `id` 应保持稳定。

## 隐私

当前版本不收集账号、邮箱或设备身份。抽签结果仅保存在浏览器本地；没有服务端用户数据，也没有跨设备同步。

## Supabase

当前版本没有接入 Supabase。现有需求不涉及登录、跨设备历史或全站统计，因此不引入数据库依赖。

后续如需扩展，可在 Supabase 中增加用户、抽签历史和匿名统计表，并通过服务端 Route Handler 写入；`service_role` key 不应暴露到浏览器。

## 内容说明

36 支签为原创文本，不使用传统庙签的固定签诗，也不输出“必然吉凶”的断言。等级分为：上上、上吉、中吉、小吉、平。

## 许可

本项目仅用于个人站点展示。签文与视觉内容保留所有权利；第三方依赖遵循各自许可证。
