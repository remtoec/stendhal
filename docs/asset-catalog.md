# 新增插圖索引

## 獨立新素材（2026-10）

21 幅獨立素材已用在書裡：獵人出現在封面與扔花的場面；喬裝、坐在樹下、望遠鏡、戴桑夫人、老伯爵和講故事的女士，各自進入晚宴、等待、對岸、歸來、古堡與回顧的場景。黑斑玫瑰、鋼琴、划船、壁爐與穿衣鏡配合相應情節；枯枝和三種紙晶用於鹽礦與兩種結晶的看法。四張完整插畫放在序章、插敘、尾聲與鹽礦一節。

PNG 原稿保留原尺寸，不改動、不部署；網站只載入旁邊的 WebP／JPEG 衍生圖。切圖先清除低於 26／255 的透明度，再以 LANCZOS 縮至 512 × 512，保留方形畫布與透明底，以 WebP 品質 85 儲存；章節圖保留 1200 × 1200，以 WebP 品質 80 儲存。

在專案根目錄執行 `python scripts/art.py`（Python 3 與 Pillow，須支援 WebP），可重製全部衍生圖，重跑也安全；衍生圖一併納入版本控制，CI 不需要圖片工具。分享卡衍生圖 `assets/share-card.jpg` 為 1200 × 630 的漸進式 JPEG，少於 300 KB，右側直排「愛，如何誕生」，使用 `C:\Windows\Fonts\NotoSerifTC-VF.ttf` 字重 600；PNG 原稿仍沒有文字。`og:image` 引用這張 JPEG。

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
- 分享卡 PNG 原稿右側預留標題位置，仍沒有文字；JPEG 衍生圖加上直排書名，供網站首頁的 Open Graph 預覽使用。
