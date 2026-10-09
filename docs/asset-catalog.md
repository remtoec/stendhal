# 新增插圖索引

## 獨立新素材（2026-10）

新增 21 幅獨立素材，供下一輪場景分層、互動和章節配圖使用。切圖為 1024 × 1024 透明底 PNG；完整章節圖為 1200 × 1200 PNG；分享卡為 1200 × 630 PNG。全部圖片均沒有畫入文字。現行 `scenes.js` 仍使用上方三張素材表；新切圖尚未取代現行場景配置。分享卡已設為 `og:image`。

| 類別 | 路徑 | 內容 |
| --- | --- | --- |
| 人物 | `assets/paper/cutouts/philippe-hunter.png`, `philippe-disguise.png`, `philippe-seated.png`, `philippe-spyglass.png` | 菲利普四種場面 |
| 人物 | `assets/paper/cutouts/madame-dayssin.png`, `old-count.png`, `storyteller.png` | 達辛夫人、老伯爵、講故事的女士 |
| 物件 | `assets/paper/cutouts/black-spotted-roses.png`, `piano-note.png`, `rowing-boat.png`, `burning-letter.png`, `dressing-mirror.png`, `bare-twig.png` | 六件獨立道具 |
| 紙晶 | `assets/paper/cutouts/crystal-a.png`, `crystal-b.png`, `crystal-c.png` | 三種不同輪廓，可交錯放在樹枝上 |
| 章節圖 | `assets/chapters/prologue.png`, `philippe-side.png`, `epilogue.png`, `salt-mine.png` | 雨天開場、菲利普視角、尾聲、鹽礦 |
| 分享卡 | `assets/share-cover.png` | 湖、古堡與橡樹，右側留白供另加標題 |

風格提示：以 `assets/paper/characters.webp`、`assets/paper/objects.webp` 和 `assets/stage-1.webp` 為參照；兒童立體紙書，紙纖維與厚度、奶油色切邊、輕微陰影；米白、灰藍、苔綠、暖棕、淡金。人物約佔切圖八成，底部靠近畫布邊緣；每幅圖獨立成像，沒有底景或字。

## 使用備註

- PNG 保留原尺寸和透明度；不要把有透明底的切圖轉為不透明格式。
- 四張章節圖本身已包含完整打開的立體書，適合靜態章節插圖。若用於現有互動舞台，請改用獨立切圖逐層組合。
- 分享卡右側預留標題位置；圖片本身沒有文字。網站首頁的 Open Graph 預覽已引用它。
