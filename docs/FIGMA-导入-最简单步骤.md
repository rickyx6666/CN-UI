# Figma 导入 — 最简单 3 步（给完全不会用的）

> 目标：把充币详情页放进 CoinNova Figma 文件

---

## 方法一：拖 `.h2d` 文件（你有这个文件就用这个）

**你已经有的文件：**
```
/Users/run/Downloads/127_0_0_1_5173_figma_app_records_deposit-detail_390w_default.h2d
```

### 第 1 步 — 打开 Figma
1. 打开 **Figma 桌面 App**（Dock 里彩色 F 图标，不要用浏览器）
2. 打开文件 **CoinNova**

### 第 2 步 — 打开插件
1. 在画布**空白处**点一下
2. 顶部菜单点 **Plugins**（插件）
3. 点 **html.to.design**

→ 会弹出一个小窗口（可能有 Capture 按钮，**没关系**）

### 第 3 步 — 拖文件进去
1. 打开 **访达 Finder** → **下载** 文件夹
2. 找到文件 `127_0_0_1_5173_figma_app_records_deposit-detail_390w_default.h2d`
3. **用鼠标拖着这个文件**，放到 Figma 里那个 **html.to.design 小窗口的正中间**
4. **松手**，等 10～30 秒

### 第 4 步 — 找到导入的页面
1. 看 Figma **左边 Layers（图层）列表最上面**有没有新出现的一层
2. **点一下**那一层
3. 键盘按 **Shift + 2**（画面会缩放到那一页）
4. 把这一页拖到右边空白处
5. 重命名：`APP/yellow-black/records/deposit-detail`

---

## 方法二：粘贴链接（不用 .h2d 文件）

**先确认**：终端里 `npm run dev` 在跑，浏览器能打开  
http://127.0.0.1:5173/figma/app/records/deposit-detail

### 第 1～2 步
同上：Figma 打开 CoinNova → Plugins → html.to.design

### 第 3 步 — 找 URL 输入框
插件窗口**顶部**找这些字之一：
- **Import from URL**
- **URL**
- 或一个可以粘贴链接的输入框

（如果只有 Capture 按钮，用**方法一**拖 .h2d）

### 第 4 步
1. 粘贴：`http://127.0.0.1:5173/figma/app/records/deposit-detail`
2. 宽度填：**390**
3. 点 **Import** / **导入**
4. 等完成后 Shift+2 定位

---

## 还是不行？

| 现象 | 怎么办 |
|------|--------|
| 拖 .h2d 没反应 | 关掉插件重新开，再拖一次；或重启 Figma |
| 找不到新图层 | Layers 最上面往下翻，找带网址名字的 Frame |
| 插件只有 Capture | **只用方法一**，直接拖 .h2d 进插件窗口 |
| localhost 链接失败 | 先运行 `npm run dev` |

---

## 其他页面链接（同样方法）

```
充币详情（确认中） http://127.0.0.1:5173/figma/app/records/deposit-detail-pending
保存成功           http://127.0.0.1:5173/figma/app/wallet/deposit-save-success
资产页（三按钮）   http://127.0.0.1:5173/figma/app/assets/logged-in
划转页             http://127.0.0.1:5173/figma/app/wallet/transfer
```

全部链接目录：http://127.0.0.1:5173/figma
