# Expense Tracker

**[English](README.md) | 繁體中文**

一個輕量級的個人預算管理應用程式，幫助使用者記錄日常收入和支出、追蹤消費類別，並查看財務報表。所有數據都存儲在本地瀏覽器中，支援多種視圖和分析功能。

[Demo](https://expense.cg01app.app/overview)

## 專案特色

### 核心功能

-   **交易管理**：記錄收入和支出交易，包含金額、類別、日期和描述
-   **分類系統**：預設 15 種分類（10 種支出 + 5 種收入），支援自訂分類
-   **智能過濾**：按類型、分類、日期範圍、金額範圍進行交易篩選
-   **即時搜尋**：快速搜尋交易描述內容
-   **財務概覽**：儀表板顯示本月收支、當前餘額、今日消費等關鍵指標
-   **數據分析**：
    -   收入與支出趨勢圖表
    -   分類支出圓餅圖
    -   6 個月支出趨勢折線圖
    -   分類詳細統計表格

### 多語言支援

-   **雙語系統**：完整支援英文 (English) 和繁體中文
-   **動態切換**：即時切換語言，無需重新載入頁面
-   **智能翻譯**：預設分類名稱隨語言自動翻譯
-   **本地化持久化**：語言偏好自動保存到本地存儲

### 主題與外觀

-   **深色/淺色模式**：支援明亮和暗黑主題
-   **系統跟隨**：可自動跟隨系統主題設定
-   **響應式設計**：完美適配桌面、平板和手機螢幕
-   **現代化 UI**：基於 Radix UI 和 Tailwind CSS 的精美界面

### 數據管理

-   **本地存儲**：所有數據存儲在瀏覽器 localStorage，無需後端服務
-   **數據導出**：支援匯出 CSV 格式數據
-   **數據清除**：提供一鍵清除所有數據功能
-   **分類管理**：
    -   新增自訂分類（圖標、顏色、名稱）
    -   編輯和刪除自訂分類
    -   重置為預設分類

## 技術架構

### 前端框架

-   **React 19.2.0**：使用最新的 React 版本構建
-   **TypeScript 5.9.3**：完整的類型安全保障
-   **Vite 7.2.4**：快速的開發構建工具

### UI 組件庫

-   **Radix UI**：無障礙、可自訂的無樣式組件
    -   Dialog、Select、Popover、Tabs 等完整組件
-   **Tailwind CSS 4.1.17**：實用優先的 CSS 框架
-   **Lucide React**：美觀的圖標庫
-   **Recharts 2.15.4**：強大的數據可視化圖表

### 狀態管理與路由

-   **React Context API**：全局狀態管理（交易、分類、語言、主題）
-   **React Router 7.9.6**：單頁應用路由系統
-   **React Hook Form 7.66.1**：高效能表單處理
-   **Zod 4.1.13**：類型安全的表單驗證

### 國際化

-   **i18next 25.7.1**：強大的國際化框架
-   **react-i18next 16.4.0**：React 專用的 i18n Hook
-   **動態分類翻譯**：使用 Template Pattern 實現分類名稱動態翻譯

### 工具與輔助

-   **date-fns 4.1.0**：現代化的日期處理庫
-   **next-themes 0.4.6**：主題切換管理
-   **clsx + tailwind-merge**：條件樣式類名管理
-   **Sonner 2.0.7**：優雅的 Toast 通知系統

## 專案結構

```
expense-tracker/
├── public/              # 靜態資源
├── src/
│   ├── components/      # React 組件
│   │   ├── common/      # 通用組件（圖標、導航等）
│   │   ├── features/    # 功能組件（交易表單、過濾器、統計卡等）
│   │   └── ui/          # UI 基礎組件（按鈕、輸入框、對話框等）
│   ├── context/         # React Context 狀態管理
│   │   ├── CategoriesContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── TransactionContext.tsx
│   ├── data/            # 靜態數據
│   │   └── defaultCategories.ts
│   ├── hooks/           # 自訂 React Hooks
│   │   ├── useCategories.ts
│   │   └── useLocalStorage.ts
│   ├── i18n/            # 國際化配置
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── zh-TW.json
│   ├── pages/           # 頁面組件
│   │   ├── AddTransaction.tsx
│   │   ├── Analytics.tsx
│   │   ├── Overview.tsx
│   │   ├── Settings.tsx
│   │   └── Transactions.tsx
│   ├── types/           # TypeScript 類型定義
│   │   ├── category.ts
│   │   └── transaction.ts
│   ├── utils/           # 工具函數
│   │   ├── calculateStats.ts
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── validation.ts
│   ├── App.tsx          # 應用主組件
│   └── main.tsx         # 應用入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 快速開始

### 環境需求

-   Node.js 18.0.0 或更高版本
-   npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**

```bash
git clone https://github.com/wefor/expense-tracker
cd expense-tracker
```

2. **安裝依賴**

```bash
npm install
```

3. **啟動開發伺服器**

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

4. **構建生產版本**

```bash
npm run build
```

構建產物將輸出到 `dist/` 目錄

5. **預覽生產構建**

```bash
npm run preview
```

### 可用指令

-   `npm run dev` - 啟動開發伺服器（支援熱重載）
-   `npm run build` - 構建生產版本（TypeScript 編譯 + Vite 打包）
-   `npm run lint` - 執行 ESLint 程式碼檢查
-   `npm run preview` - 預覽生產構建結果

## 使用指南

### 新增交易

1. 點擊右上角的 **「+ 新增交易」** 按鈕
2. 選擇交易類型（收入或支出）
3. 輸入金額
4. 選擇分類
5. 選擇日期
6. 選填描述（選填）
7. 點擊「儲存交易」

### 篩選交易

1. 前往「交易」頁面
2. 使用搜尋框快速搜尋交易描述
3. 點擊「過濾器」按鈕展開進階篩選
4. 設定篩選條件：
    - 類型：全部 / 支出 / 收入
    - 分類：多選分類
    - 日期範圍：選擇起始和結束日期
    - 金額範圍：拖動滑桿設定金額區間
5. 點擊「套用」查看結果

### 管理分類

1. 前往「設定」頁面
2. 找到「分類管理」區塊
3. **新增分類**：
    - 點擊「新增分類」按鈕
    - 選擇圖標和顏色
    - 輸入分類名稱
    - 選擇類型（收入或支出）
    - 點擊「儲存」
4. **編輯分類**：點擊分類卡片上的編輯圖標
5. **刪除分類**：點擊分類卡片上的刪除圖標
6. **重置為預設**：點擊「重置為預設」按鈕恢復原始分類

### 切換語言

1. 前往「設定」頁面
2. 找到「語言」設定區塊
3. 從下拉選單中選擇語言：
    - English（英文）
    - 繁體中文
4. 語言將立即切換，所有界面文字和預設分類名稱都會更新

### 切換主題

1. 前往「設定」頁面
2. 找到「外觀」設定區塊
3. 選擇主題：
    - 淺色模式
    - 深色模式
    - 跟隨系統

### 導出數據

1. 前往「設定」頁面
2. 找到「數據管理」區塊
3. 點擊「導出數據」按鈕
4. 系統將下載包含所有交易的 CSV 檔案

## 核心設計特點

### 多語言架構

專案採用先進的國際化架構設計：

1. **分離結構與內容**：使用 `CategoryTemplate` 介面，分離分類結構（ID、圖標、顏色）與翻譯內容（nameKey）
2. **動態生成**：預設分類在運行時根據當前語言動態生成，使用 `useMemo` 優化效能
3. **雙層分類系統**：
    - 預設分類：基於模板動態翻譯，不可編輯或刪除
    - 自訂分類：使用者創建，僅存儲在 localStorage
4. **完整覆蓋**：170+ 翻譯鍵值，涵蓋所有 UI 文字、表單驗證訊息和分類名稱

### 響應式設計

-   使用 Tailwind CSS 的響應式工具類
-   桌面版：多欄佈局、寬敞的卡片間距
-   平板版：彈性的網格系統
-   手機版：單欄佈局、觸控友善的按鈕尺寸

### 效能優化

-   使用 `useMemo` 和 `useCallback` 避免不必要的重新計算
-   延遲載入大型組件
-   虛擬化長列表（交易列表）
-   代碼分割和樹搖優化

## 瀏覽器支援

-   Chrome/Edge 90+
-   Firefox 88+
-   Safari 14+
-   支援現代瀏覽器的所有功能

## 開發規範

### 程式碼風格

-   使用 ESLint 進行程式碼檢查
-   遵循 React Hooks 規則
-   TypeScript 嚴格模式
-   Prettier 自動格式化（建議配置）

### 組件設計原則

-   單一職責原則
-   Props 類型安全
-   可重用性優先
-   適當的狀態提升

### 命名規範

-   組件：PascalCase（例如：`TransactionForm`）
-   檔案：kebab-case 或 PascalCase（例如：`transaction-form.tsx` 或 `TransactionForm.tsx`）
-   函數：camelCase（例如：`formatCurrency`）
-   常數：UPPER_SNAKE_CASE（例如：`CATEGORY_TEMPLATES`）

## 授權

此專案為個人學習和使用目的開發。

## 貢獻

歡迎提交問題 (Issues) 和拉取請求 (Pull Requests)！

## 聯絡方式

如有任何問題或建議，歡迎透過 GitHub Issues 聯繫。
