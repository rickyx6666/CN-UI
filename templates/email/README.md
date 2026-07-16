# CoinNova 邮件模板

三套邮箱验证码模板，统一黄黑品牌风格（黑底 Header + `#FFCC00` 强调条）。

## 模板清单

| 模板 | 文件 | 场景 |
|------|------|------|
| **登录** | `verification-code-login.html` | 验证码登录、密码登录后的邮箱二次验证 |
| **注册** | `verification-code-register.html` | 新用户注册邮箱验证 |
| **通用** | `verification-code-general.html` | 提币、改密、绑定/解绑、注销等敏感操作 |

## 预览

三合一预览页（推荐）：

```
templates/email/index.preview.html
```

单页预览：

```
verification-code-login.preview.html
verification-code-register.preview.html
verification-code-general.preview.html
```

## 公共变量

| 变量 | 示例 | 说明 |
|------|------|------|
| `{{verification_code}}` | 847293 | 6 位验证码 |
| `{{recipient_email}}` | tr\*\*\*@example.com | 建议脱敏 |
| `{{valid_minutes}}` | 10 | 有效分钟数 |
| `{{sent_at}}` | 2026/07/10 21:14 (UTC+8) | 发送时间 |
| `{{support_email}}` | support@coinnova.app | 客服邮箱 |
| `{{year}}` | 2026 | 版权年份 |
| `{{anti_phishing_code}}` | 12NovaA | 用户防钓鱼码；**为空时不渲染页脚区块** |

## 各模板专属变量

### 登录 `verification-code-login.html`

| 变量 | 说明 |
|------|------|
| `{{login_scene}}` | 可选：`code`（默认）/ `email-2fa`。二次验证时启用注释块中的副文案 |

**主题行：** `【CoinNova】您的登录验证码：847293`

### 注册 `verification-code-register.html`

无额外变量，使用公共变量即可。

**主题行：** `【CoinNova】您的注册验证码：392816`

### 通用 `verification-code-general.html`

| 变量 | 示例 |
|------|------|
| `{{purpose_label}}` | 提币验证 / 修改密码 / 安全验证 |
| `{{action_description}}` | 提币 500 USDT 至外部地址（TRC20） |

**主题行：** `【CoinNova】提币验证：561204`

### 通用模板适用场景

| `purpose_label` | `action_description` 示例 |
|-----------------|---------------------------|
| 提币验证 | 提币 500 USDT 至外部地址（TRC20） |
| 修改密码 | 修改账户登录密码 |
| 绑定手机 | 绑定手机号 138\*\*\*\*1234 |
| 注销账户 | 申请永久注销 CoinNova 账户 |
| 邮箱二次验证 | 完成登录邮箱二次验证 |

## 设计差异

| | 登录 | 注册 | 通用 |
|--|------|------|------|
| 标题 | 登录 CoinNova | 欢迎注册 CoinNova | 安全验证 |
| 验证码标签 | Login Code | Register Code | Security Code |
| 特色区块 | — | — | 操作内容说明 |
| 安全提示 | 灰色常规 | 灰色常规 | 红色强调 |
| 防钓鱼码 | 页脚展示 | 页脚展示 | 页脚展示 |

## 防钓鱼码页脚

当 `anti_phishing_code` **有值**时，在版权区上方插入 `_partials/anti-phishing-block.html`；**为空则整段不输出**。

- **左侧**：核对提示文案
- **右侧**：黄色「防钓鱼码」标签 + 白底黑框码值
- **预览页**：`*.preview.html` 固定展示已设置示例（12NovaA），便于设计验收

## 上线检查

1. Logo 使用 CDN PNG（`https://coinlab088.github.io/coinlab/email/logo-48.png`）
2. 配置 SPF / DKIM / DMARC
3. Preheader 与主题行保持一致
