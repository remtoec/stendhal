# 愛，如何誕生

以七幕紙本立體書插畫閱讀司湯達〈Ernestine，或愛的誕生〉，並展開 Irving Singer 的辯護與延伸提問。

## 閱讀體驗

- 七個階段、故事結局、讀後討論，共九頁。
- 七幅兒童立體書風格插畫，配上繁體中文故事。
- 上一頁／下一頁、目錄跳轉、鍵盤左右鍵，以及插畫上的手機滑動翻頁。
- 可展開的閱讀線索、Singer 的三項辯護，以及四個延伸問題。
- 支援手機、桌面、減少動態效果設定、鍵盤操作與螢幕閱讀器標籤。

## 原始碼

這是純靜態網站，不需要安裝套件或執行建置。

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 網站結構與中繼資料 |
| `style.css` | 版面、紙書風格、響應式設計 |
| `story.js` | 九頁故事內容、翻頁和互動討論 |
| `assets/stage-1.webp` 至 `stage-7.webp` | 七幅網站插畫 |
| `favicon.svg` | 網站圖示 |
| `.nojekyll` | 停用 GitHub Pages 的 Jekyll 處理 |
| `.github/workflows/pages.yml` | GitHub Pages 自動發佈流程 |

在本機可於儲存庫目錄執行：

```sh
python3 -m http.server 8000
```

然後開啟 `http://localhost:8000`。修改故事文字時編輯 `story.js`；修改視覺時編輯 `style.css`。

## GitHub Pages

第一次設定：到儲存庫 **Settings → Pages → Build and deployment → Source**，選擇 **GitHub Actions**。之後每次推送至 `main`，發佈流程會自動更新網站。也可在 **Actions → Deploy storybook to GitHub Pages → Run workflow** 手動發佈。

GitHub Pages 預設網址：`https://remtoec.github.io/stendhal/`。此網址須待首次發佈成功後才可使用。

## 文字與插畫說明

故事依使用者提供的中文重述編排，並非小說原文的逐句翻譯。七幕對照是閱讀線索，並非 Singer 對各場景的正式分類。討論依據《The Nature of Love》第二卷第十一章；網站清楚區分 Singer 的論點、導讀解釋和延伸提問。

七幅插畫為本故事書生成，已轉為 WebP 供網頁使用。Google Fonts 屬可選的外部字型；無法載入時會使用系統字型。網站沒有後端、追蹤程式或資料收集。
