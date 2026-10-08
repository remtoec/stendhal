# 愛，如何誕生

一本關於愛與想像的繁體中文紙藝立體書。按事件閱讀司湯達〈埃內斯蒂娜，或愛的誕生〉，再讀 Irving Singer 的辯護與批評。

**網站：** https://remtoec.github.io/stendhal/  
**完整文字版：** https://remtoec.github.io/stendhal/read.html

這是故事節述與哲學導讀，並非逐句全譯。七階段只作閱讀書籤，不是科學量表或人人必經的戀愛流程。

## 第二版

- 25 個短篇頁面：封面、18 頁故事、6 頁哲學導讀與討論。
- 以獨立透明紙片組合湖泊、古堡、橡樹、人物及物件；翻頁時景物先收合、紙頁轉動、新景物依次立起。
- 紙角可點按或拖曳；支援反向翻頁、回彈取消、鍵盤左右鍵、瀏覽器返回及片段連結。動畫期間不接受重複翻頁。
- 白玫瑰的手帕、結晶推想、被拿走的花束、人物的兩個視角及結尾紙瓣，均有相應的文字說明。
- 手機依序顯示標題、短景物、正文；一般直向捲動不會被翻頁手勢攔截。
- 跟隨系統的減少動態設定，也可自行選擇；提供較大字體及無 JavaScript 的完整文字版。
- 閱讀位置、展開狀態、選題和讀前／讀後筆記儲存於本機；無帳戶、無追蹤、無後端。筆記可下載，也可清除。
- 保留九幅原版插畫，可選擇展開觀看。結尾插畫在揭開最後紙瓣後才出現。

## 內容修訂

1. 恢復宴會之後的男方插敘，補回他刻意使她猜疑、搶先拿走花束的行動。
2. 修正求婚後台詞次序，區分被撞破的驚慌與稍後的冷峻回應。
3. 分清人物所想、敘述者的解釋、辛格的概括及本書的問題。結尾特別指出辛格概括與法文敘述之間的落差。
4. 統一中文姓名、稱謂與語氣；保留年齡的自我說服、敘述者的幽默及法國舊制距離的含混，避免誤譯。
5. 哲學導讀區分「誤認事實」與「賦予價值」，並補上坦誠與操控、真愛可消逝、長久共同生活的理論空白。
6. 說明身體親密與激情可以相容、互惠與平等的重要，以及鹽晶比喻的限制。

## 來源

- 司湯達〈Ernestine, ou la naissance de l’amour〉，法文文本：[Wikisource](https://fr.wikisource.org/wiki/Stendhal_-_De_l%E2%80%99amour,_II,_1927,_%C3%A9d._Martineau/Ernestine)。
- 司湯達《論愛情》第二章：[De la naissance de l’amour](https://fr.wikisource.org/wiki/De_l%E2%80%99Amour/II._De_la_naissance_de_l%E2%80%99amour)。
- Irving Singer, *The Nature of Love*, vol. 2, *Courtly and Romantic*, ch. 11。依據專案提供的章節文本節述；各頁註釋以段首定位。原章不隨網站重刊。

人物中文譯名為本版選擇。插畫及紙藝素材以 AI 輔助製作。司湯達與辛格的同場對談是想像場景，並非歷史事件。

## 本機預覽與檔案

不需要安裝套件、打包或 API 金鑰：

```sh
python3 -m http.server 8000
```

開啟 `http://localhost:8000`。`preview.html` 可在同一瀏覽器以 320、390、768、1280 px 寬度檢查版面；這是響應式排版預覽，不等於實體裝置測試。

| 檔案 | 用途 |
| --- | --- |
| `content.js` | 故事、註釋、來源、階段及討論題 |
| `scenes.js` | 分層素材對應與場景組合 |
| `reader-model.js` | 導航狀態、拖曳門檻、儲存資料驗證 |
| `story.js` | 閱讀介面、紙頁動畫、手勢、筆記 |
| `style.css` | 紙張、立體景物、響應式與無障礙樣式 |
| `assets/paper/` | 三張透明 3×2 WebP 素材表，合計約 0.70 MB |
| `read.html` | 完整靜態文字版，由內容檔產生 |
| `tests/reader.test.js` | 導航、取消、舊連結、資料完整性測試 |

修改內容後，同步產生文字版並測試：

```sh
node scripts/build-reading.js
node --test tests/reader.test.js
node --check story.js
```

推送 `main` 後，GitHub Actions 驗證並部署 GitHub Pages。圖片載入失敗時回退至原插畫，正文仍然可讀。`localStorage` 被停用時，閱讀照常，筆記會提示無法永久儲存。
