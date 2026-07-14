# CoinLab 文档

项目说明、流程与协作文档目录。

## 目录用途

| 路径 | 说明 |
|------|------|
| [phase-1-scope.md](./phase-1-scope.md) | **一期功能范围**与首页原型映射 |
| [../references/figma/historical-pages.md](../references/figma/historical-pages.md) | **NXone 历史页面业务逻辑**（非 UI 参考） |
| [../design-system/MASTER.md](../design-system/MASTER.md) | 全局设计规范（Source of Truth） |
| [../references/](../references/) | 外部参考、竞品与规范链接 |
| [../src/](../src/) | React 移动端原型源码 |

## 原型预览

```bash
npm install
npm run dev
```

浏览器打开 **http://localhost:5173/**（固定端口；Cash Caw 项目用 **5175**）。保存后自动整页刷新。

## 文档约定

- **设计相关**：写入 `design-system/`，页面级 override 放 `design-system/pages/`
- **外部资料**：写入 `references/`，附来源与日期
- **项目流程 / ADR / 协作文档**：写入本目录 `docs/`
