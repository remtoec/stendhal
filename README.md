# 愛，如何誕生

一本放在口袋裡的繁體中文紙藝立體書，寫給讀書會的朋友。沿着花束與字條，讀司湯達筆下蒂娜（原名 Ernestine）愛上一個人的七個階段；每一步有一張旁注，最後一章跟着 Irving Singer 細看「結晶」這個比喻：愛是看錯了人，還是珍惜一個人？

**網站：** https://remtoec.github.io/stendhal/  
**完整文字版：** https://remtoec.github.io/stendhal/read.html

這是故事節述與哲學導讀，並非逐句全譯。七階段是司湯達的文學與心理分析，不是科學量表或人人必經的戀愛流程。

## 第三版

- **文字與網站分開。** 全書文字只在 [`content/book.md`](content/book.md)，介面短句在 `content/ui.json`。改字、增刪章節不必改程式，寫法見 [`content/README.md`](content/README.md)。
- **為手機而設。** 一章一個畫面，直向捲動閱讀；橫向輕掃、底部按鈕或鍵盤左右鍵換章。底部七顆紙晶隨階段亮起，點按即是目錄。
- **新的改編。** 以七個階段為章：序（下雨天的故事）、一至七、插敘（菲利普的一邊）、尾聲、回顧、故事以外。樹洞裡的字條以紙條呈現；每章末有一張摺起來的旁注，全書只留幾個可以聊下去的問題。
- **回顧。** 故事之後有一頁重溫七個階段和各自的場面，再由司湯達自己用鹽礦的樹枝解釋「結晶」。
- **為一般讀者而寫。** 只點名司湯達和 Irving Singer（保留英文，方便搜尋），用平常的話談內容；讀完即完整，沒有要動筆的練習。
- **「結晶」的比喻。** 讀者先親手令鹽礦裡的樹枝長出晶體；最後一章跟着 Irving Singer 換一種看法：晶體蓋住了樹枝，還是仍然看得見它。
- 紙藝場景在捲到眼前時立起；白玫瑰的手帕、結晶的推想、被拿走的花束和結尾，由讀者自己揭開。
- 可調文字大小與動態；無 JavaScript 時有完整文字版。閱讀位置和設定只存在本機。

## 來源

- 司湯達〈Ernestine, ou la naissance de l’amour〉，法文文本：[Wikisource](https://fr.wikisource.org/wiki/Stendhal_-_De_l%E2%80%99amour,_II,_1927,_%C3%A9d._Martineau/Ernestine)；情節與對白依據一份繁體中文全譯本。
- 司湯達《論愛情》第二章：[De la naissance de l’amour](https://fr.wikisource.org/wiki/De_l%E2%80%99Amour/II._De_la_naissance_de_l%E2%80%99amour)。
- Irving Singer, *The Nature of Love*, vol. 2, *Courtly and Romantic*, ch. 11。依據該章的中文譯稿節述；原章不隨網站重刊。
- 全譯本、Singer 章節的譯稿與七階段改編草稿是編寫時的參考資料，不隨原始碼公開。

男主角與其他人物的中文譯名沿用全譯本；女主角簡稱蒂娜（Tina）。插畫及紙藝素材以 AI 輔助製作（見 `docs/paper-art.md`）。司湯達與 Irving Singer 的同場對談是想像場景，並非歷史事件。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `content/book.md` | 全書文字 |
| `content/ui.json` | 介面短句 |
| `book-format.js` | 讀懂 `book.md`、檢查格式、轉成網頁；瀏覽器與建置共用 |
| `scenes.js` | 紙藝場景：紙片的位置，以及哪些紙片隨讀者的動作出現 |
| `reader-model.js` | 連結定位、本機儲存資料的驗證 |
| `reader.js` | 閱讀介面：換章、場景、目錄 |
| `style.css` | 版面與紙藝樣式，手機優先 |
| `scripts/build.js` | 產生 `_site/`：加上版本識別的網站，以及 `read.html` |
| `tests/book.test.js` | 格式、內容完整性、連結、儲存資料、完整文字版 |

## 本機預覽

不需要安裝套件或 API 金鑰。網站直接讀取 `content/book.md`，改完重新整理即可：

```sh
python3 -m http.server 8000
```

開啟 `http://localhost:8000`。`preview.html` 可用 320、390、768、1280 px 寬度並排檢查。

檢查與建置（推送 `main` 後，GitHub Actions 會自動做同樣的事並部署）：

```sh
node --test tests/book.test.js
node scripts/build.js
```

`_site/` 是建置結果，不納入版本控制：樣式與腳本連結帶有內容雜湊，避免部署後混用瀏覽器快取的舊檔；`read.html` 也在這裡產生。

字體經 Google Fonts 載入（霞鶩文楷、思源宋體、Cormorant Garamond）；刪去 `index.html` 裡標明的三行，就會改用裝置內建字體。`localStorage` 被停用時，閱讀照常，只是不會記住讀到哪裡。
