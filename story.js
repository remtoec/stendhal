'use strict';
const section = (title, body) => `<section class="story-section">${title ? `<h2>${title}</h2>` : ''}${body}</section>`;
const note = (title, body) => `<details class="reading-note"><summary>${title}</summary><div class="note-body">${body}</div></details>`;
const stages = ['欣賞','欲望萌芽','希望','愛的誕生','第一次結晶','懷疑','第二次結晶'];
const pages = [
  {
    title:'欣賞', kicker:'第一階段', image:1, caption:'湖的另一邊，有一個她還不認識的人。', deck:'一眼，讓平淡的世界有了不同。',
    alt:'清爽的兒童紙本立體書，Ernestine 在城堡露台望向湖對岸的獵人 Philippe，山林由分隔的紙層構成',
    body:section('湖對岸的陌生人', `<p>Ernestine 與年老的叔父住在 Dauphiné 山區一座古老、偏僻的城堡。她生活富裕，日子卻極其單調：同樣的時間、同樣的僕人、同樣的談話，身邊的老人總在批評世界。</p><p>一天，她偶然看見湖對岸樹林裡的一個年輕獵人。他「看起來高貴」。兩人沒有說過一句話，可是他的形象，此後不時浮上她的心頭。</p><p>幾天後的黃昏，她又從窗前看見他。這次，他拿着一束花，先親吻花束，再帶着近乎虔敬的姿態，把花放進湖邊一棵巨大老橡樹的樹洞裡。</p><blockquote>這是給我的嗎？</blockquote><p>她整晚幾乎睡不着。那棵本來只是散步途中普通的老樹，忽然成了一個充滿意義的地方。</p>`)+note('展開閱讀線索：欣賞從哪裡開始？', `<p>司湯達把第一階段稱為「欣賞」（admiration）：某個外貌、特質或姿態，使我們覺得這個人值得注目。這時還未認識對方，也未必有愛；眼前的人，已開始與其他人不同。</p><p>橡樹與花束讓故事推向下一步。這裡的七幕是一組閱讀線索，心理變化未必整齊地只發生在某一幕。</p>`)
  },
  {
    title:'欲望萌芽', kicker:'第二階段', image:2, caption:'她望向窗外，心裡已經有了等待。', deck:'還未承認愛，生活已被他改變。',
    alt:'紙本立體書中的 Ernestine 坐在開啟的窗邊等待，燭光旁有一本未讀的書，遠處是湖與橡樹，淡色人像象徵她的想像',
    body:section('樹洞裡的花與字條', `<p>獵人一次又一次留下花。Ernestine 想走到橡樹旁看看，又覺得自己不應該去。她每天躲在城堡高處，從百葉窗後望着湖對岸。</p><p>終於，她在一束非常新鮮的花上發現字條。男人說，他已經每天送花一個月，不知道今天這束，能否終於被她看見。</p><p>這明明已近乎一封情書，她卻仍替自己找理由：「它又沒有封口……」彷彿只要這不是一封正式的信，閱讀它就不算越界。</p><p>她甚至開始撒謊，掩飾自己的反應。司湯達特意提醒我們：十五天前，她根本不會想到撒謊。</p><p>她還沒有說「我愛他」。可是等待、偷看、解釋和隱瞞，已經在重新安排她的每一天。</p>`)+note('展開閱讀線索：想靠近的心', `<p>司湯達的第二階段，是想到親吻對方、也被對方親吻的愉悅：欲望開始朝着某一個人集中。窗前等待，是故事中較含蓄的視覺對照，並不等於原文對這個階段的完整定義。</p><p>插畫中淡淡的人影，是她反覆想起獵人的比喻；他並沒有真的站在房間裡。</p>`)
  },
  {
    title:'希望', kicker:'第三階段', image:3, caption:'薄手帕裡的一朵白玫瑰，令世界亮了起來。', deck:'「他真的可能愛我。」',
    alt:'Ernestine 紙偶小心捧着薄手帕包裹的白玫瑰，橡樹樹洞裡有花束，淡黃與湖藍紙層帶出希望',
    body:section('被人愛着，原來這麼甜美', `<p>因為道德上的顧慮，Ernestine 停止回應。獵人以為自己被拒絕，留下帶黑色斑紋的玫瑰，說他太痛苦，必須永遠離開。</p><p>讀完字條，她靠着橡樹哭了。第二天，她親眼看見他把花束丟進湖裡，轉身離去。她以為一切都完了。</p><p>可是，後來樹洞裡竟又出現一束花，中間是一朵白玫瑰。字條請她：如果稍有憐憫，就把這朵白玫瑰取走。</p><p>她幾乎在自己還未察覺的時候，已伸手摘下了它。</p><p>她用薄薄的手帕包着玫瑰，一路小心帶回房間。白色的花瓣透過布料露出來。她把花放進水晶杯，望着它流淚。</p><blockquote>被人愛着，原來這麼甜美。</blockquote><p>她仍未真正了解這個男人，卻已開始相信：自己可能在某個人心裡，佔有特殊的位置。</p>`)+note('展開閱讀線索：「被愛」的可能', `<p>希望（hope）使欲望不再只是自己的想像：對方也許會回應。司湯達指出，這種信念有時只需要很小的鼓勵。</p><p>玫瑰不只是花。取走它成了一個訊號，而帶着它回家，也讓「有人可能愛我」變成可以捧在手裡的事。</p>`)
  },
  {
    title:'愛的誕生', kicker:'第四階段', image:4, caption:'祈禱書落地的瞬間，她開始在意他眼中的自己。', deck:'他的目光，也成了她看自己的目光。',
    alt:'簡潔兒童立體紙書裡的村莊教堂，Ernestine 彎身伸手向掉下的祈禱書，Philippe 在對面溫柔注視她',
    body:section('教堂裡的第一次近看', `<p>獵人再留下訊息：如果她取走指定的山茶花，他星期日便會到她村裡的教堂。</p><p>她去了。眼前是一個衣着極其樸素、約三十五歲、甚至有點禿的男人。他整場彌撒幾乎一直望着她。</p><p>Ernestine 緊張得在離開座位時把祈禱書掉在地上，差點連自己也跌倒。她立即想到：「他一定覺得我很笨拙，再也不喜歡我。」</p><p>她故意說自己遺下了手帕，讓僕人返回教堂，藉此拖延離開，希望可以再看見他。但他沒有出現。</p><p>回家後，她崩潰了。她對着鏡子研究自己的眼神，是不是「太傲慢、令人討厭」。晚飯時，叔父無心笑她說話有點傲慢，她竟立即流淚，離席而去。</p><blockquote>他會怎樣看我？</blockquote><p>愛開始後，對方想像中的目光，也能改變我們對自己的判斷。</p>`)+note('展開閱讀線索：愛與回應', `<p>司湯達在第四階段把愛描述為：以各種感官、盡可能親近地看見、觸及和感受一個可愛而且愛着我們的人，並從中得到快樂。</p><p>Singer 認為這個定義本身很不充分，但它點出兩件事：激情之愛帶有身體性，也重視相互回應。這一幕的焦慮讓我們看到，她已無法把他當成無關緊要的陌生人。</p>`)
  },
  {
    title:'第一次結晶', kicker:'第五階段', image:5, caption:'她手裡是兩束花，心裡卻已有一個完整的戀人。', deck:'未知之處，被想像填成了優點。',
    alt:'Ernestine 捧着兩束花與信，想像中的 Philippe 紙偶被黃色摺紙晶體環繞，桌上有帳簿與被放下的首飾',
    body:section('他竟然肯愛我', `<p>兩天後，她在橡樹找到兩束花和兩封信。</p><p>第一封解釋，他在教堂後沒有現身，是怕別人從他的眼中看出愛意。第二封卻以為她不拿信，是因為已愛着別人，於是向她永別。</p><p>Ernestine 讀到他承認自己的激情，幸福得跪在聖母畫像前。她想到的不是「我得到他了」，而是：「他竟然肯愛我！」</p>`)+section('一個想像中的 Philippe', `<p>她知道他約三十五歲，卻開始說服自己：</p><blockquote>我從來就不可能愛一個四十歲以下的男人。</blockquote><p>他衣着樸素，也許很窮。這念頭非但沒有令她失望，反而讓她覺得：「天啊，如果他真的窮，那我的幸福就甚麼也不缺了！」</p><p>她起身查自己的財產，幻想收入足夠兩個人生活。翌日，她認為「四十歲男人的愛人不應穿得像小女孩」，便故意打扮得老成。早餐時，叔父等人看見她，全部笑了出來。</p><p>剛收到的昂貴金飾，她也忽然不喜歡了。在她的想像裡，這個高貴而貧窮的男人，一定會鄙視奢侈。</p><p><strong>成熟、聰明、嚴肅、貧窮、高尚、不重物質，還對她有極高的道德要求。</strong>她幾乎不認識 Philippe，卻已為他建立了一整個性格。</p><p>這些不是他告訴她的。是她的愛，替他填了進去。</p>`)+note('展開閱讀線索：「結晶」是發現，還是創造？', `<p>結晶（crystallization）是心靈隨着事情發展，不斷在所愛的人身上找到新優點的過程。但 Singer 提醒我們：這些「發現」往往其實是創造。戀人把價值賦予對方，未必只是客觀地辨認原有特質。</p><p>插畫的摺紙晶體象徵這種美化。對方的真實性格，仍有大片未知。</p>`)
  },
  {
    title:'懷疑', kicker:'第六階段', image:6, caption:'同一棵橡樹，一度承載幸福，此刻卻承載崩塌。', deck:'一個名字，擊碎了她的整座世界。',
    alt:'Ernestine 在橡樹根旁昏倒，情書落在手邊，零散摺紙晶體象徵想像破裂，湖與山變成偏冷色的紙層',
    body:section('Philippe Astézan', `<p>她再次來到橡樹旁，看到一封長信。她第一件事，是跳到末尾看署名。</p><blockquote>Philippe Astézan。</blockquote><p>她瞬間僵住。這名字她聽過：Philippe 是附近一位漂亮、富有、年輕寡婦 Mme Dayssin 公開的情人。Dayssin 甚至完全可以嫁給他。</p><p>她想到：「他只是拿我來消遣。也許還會把這個小女孩的事，回去講給 Dayssin 聽。而我竟已想到嫁給他！」</p><p>最痛的不只是失戀，還有羞辱。她覺得自己愚蠢，在那棵曾承載幸福的橡樹旁昏倒。</p><p>醒來後，信掉在腳邊。她立刻踩住它，怕別人看見。回城堡後，整封信除了署名之外，她一個字也不讀，直接扔進火裡。之後寄來的兩封信，她同樣不拆就燒掉。</p>`)+section('換一雙眼睛看故事', `<p>到這裡，司湯達才讓我們知道 Philippe 那邊發生過甚麼。</p><p>他最初聽說，有一個漂亮、有思想的女孩，被困在沉悶的城堡裡。他只是出於好玩，以及一點自以為是的「慈善心」，想給她一些浪漫刺激，甚至懶得正式登門認識她。</p><p>最初的花束，並不是激情之愛。</p><p>可是到了教堂，他真正看見 Ernestine，覺得她漂亮、單純、高貴。尤其當她緊張得掉下祈禱書，他第一次想到：也許她對我有意思。</p><p>他開始躲在樹林裡觀察她。她划船過湖，到橡樹旁找不到花，明顯失望。他反覆猜想：「她是因為沒有我的花而失望？還是只因虛榮心未得到滿足？」</p><p>後來，他用望遠鏡看見她找到兩束花，竟抱着花束飛奔回城堡。這個微小動作，把他完全征服了。</p><blockquote>她因為他的花而動心；<br>他因為她珍惜那些花而動心。</blockquote><p>兩人都需要先相信：自己在對方心裡，也許有特殊的位置。</p>`)+section('他的三十三日', `<p>Philippe 躲着，看見 Ernestine 讀到署名後倒地，卻不知道原因。</p><p>他每天到湖邊等待，連續三十三日幾乎見不到她。她不再到教堂。他甚至易服接近城堡，只為偶爾看她一眼。</p><p>她消瘦、蒼白。他卻可以把她每一個表情解釋成十種可能。一個平日理智的三十五歲男人，如今彷彿能為她一次昏倒，寫出十卷 Richardson 式小說。</p><p>想像能築起美好的世界，也能在資訊不足時，讓兩個人各自困在自己的故事裡。</p>`)+note('展開閱讀線索：她與他的「懷疑」', `<p>她懷疑他的真心；他懷疑自己是否曾被愛。兩人掌握的線索不同，又無法直接知道對方的內心。</p><p>司湯達的第六階段主要涉及「對方是否愛我」的不確定。故事的逆轉讓這種不確定同時包含嫉妒、羞辱、誤讀和自我保護。懷疑並不表示愛已消失。</p>`)
  },
  {
    title:'第二次結晶', kicker:'第七階段', image:7, caption:'他跪在她面前。幸福重新燃起，戒心卻尚未退去。', deck:'希望回來了，誤會仍在兩人之間。',
    alt:'實體摺紙立體書中的城堡臥室，Philippe 單膝跪下求婚，Ernestine 站在床旁感動又猶豫，窗邊三枚紙晶體象徵希望復甦',
    body:section('橡樹下，一動不動的人', `<p>約六星期後，Ernestine 乘船經過湖邊。起初，她以為橡樹上的一塊灰色只是樹皮。兩小時後回程，才發現那是 Philippe。</p><p>他已在樹根上坐了整整兩小時，一動不動，像死了一樣。她心裡甚至閃過一個荒唐念頭：如果他死了，她便可以毫無罪惡感地繼續愛他。</p><p>翌日，她無意中聽神父說，Mme Dayssin 十五天前已離開，返回巴黎。可是 Philippe 沒有跟她走。他仍留在這裡。</p><p>Ernestine 六星期以來第一次笑了。之前，她甚至把「可能快要病死」當成安慰；如今忽然想到，天氣冷了，自己應該添衣。</p><p>希望一回來，求生的心也回來了。</p>`)+section('不要叫出來', `<p>Saint-Hubert 年度大宴前，她在鋼琴鍵上發現一張紙：「看到我時，不要叫出來。」</p><p>宴會當日，她四處尋找，終於在對面看見一個醜陋、年紀不小的農民僕役。再望一次：是 Philippe。</p><p>他把自己化裝得幾乎認不出來，只為進城堡看她。這個成熟、世故的男人，竟做出了完全不合身份、甚至有點可笑的事。</p>`)+section('你願意讓我成為你的丈夫嗎？', `<p>Ernestine 因為臉紅得太厲害，只好離席回房。兩分鐘後，門忽然打開。Philippe 出現，直接跪在她腳下。</p><blockquote>你願意讓我成為你的丈夫嗎？</blockquote><p>她內心一下到達幸福的最高點：「他向我求婚了。那我就再不用怕 Mme Dayssin。」兩個月的痛苦，彷彿在一秒裡消失。</p><p>偏偏女管家在此時進來。Philippe 只好躲到床與牆之間。女管家逗留時，Ernestine 漸漸從幸福的震撼中恢復理智。</p><p>待他再次出現，她已重新戴上高貴、嚴肅、自尊的面具，冷冷地說：</p><blockquote>你這樣是在毀我的名譽。</blockquote><p>Philippe 以為，自己之前所有希望都是幻覺，她根本不愛他。他的神情變成絕望。</p><p>她看見這份絕望，幾乎被打動到崩潰，卻仍把他趕走。兩人明明相愛，仍只能從對方表面的行為猜測內心。</p>`)+section('他沒有回到她身邊', `<p>Philippe 承諾不會離開 Dauphiné，也永遠不再返回從前與 Mme Dayssin 同住的城堡。他繼續留下花與信；Ernestine 已差不多要回信。</p><p>可是 Dayssin 突然從巴黎回來。Ernestine 立即陷入恐慌。</p><p>後來村裡傳出消息：Dayssin 是因嫉妒而回來找 Philippe；他卻一直住在 Crossey 荒僻的山區，過着近乎修道士的生活，甚至拒絕見她。Dayssin 最終憤怒地回到巴黎。</p><p>Ernestine 終於知道：Philippe 真的選擇了她。</p><p>可是他不知道她已得知此事。他只看見一次又一次冷淡的拒絕，仍相信她不愛他。他兩次啟程回巴黎，又兩次走了二十多里便掉頭，回到山間的小屋。其他娛樂，已失去意義。</p>`)+note('展開閱讀線索：第二次結晶為甚麼更深？', `<p>Singer 說，第一次結晶把所愛的人看成完美；第二次結晶則讓戀人相信，這個特別的人也會回應自己的愛。懷疑使想像繼續活動，新的希望又重新賦予對方價值。</p><p>這份相互回應的信念，未必等於兩人已坦白溝通，更不保證能共同生活。故事中的希望和不安，仍在反覆交替。</p>`)
  },
  {
    title:'愛已誕生，故事卻沒有成婚', kicker:'尾聲', image:7, caption:'這次求婚沒有通往婚禮。', deck:'相愛，並沒有讓他們走到一起。',
    alt:'回望房內求婚的立體紙書插畫，這個充滿希望的時刻最終沒有帶來婚姻',
    body:section('沒有結合的結局', `<p>敘事者最後明確告訴我們：Ernestine 愛上了 Philippe；Philippe 也愛她。她終於得到「自己的愛被回應」的狂喜。</p><p>但故事沒有讓他們結婚。他們未曾共享肉體的歡愉，Philippe 最終也沒有得到 Ernestine。</p><p>翌年，她嫁給一個年老、非常富有、勳章滿身的將軍。Philippe 留在痛苦的激情之愛裡。</p><p>敘事者再添上一個奇怪而殘酷的道德註腳：這算是他拋棄 Mme Dayssin 的懲罰。</p><hr class="end-rule"><p>在 Singer 的概括中，Ernestine 不能原諒 Philippe 為她拋棄舊情人，因而拒絕了真正所愛的人；翌年，她嫁給一個自己不愛的富有貴族。</p><p>故事讓「愛正在誕生」走到極致，卻在「共同生活」開始前停筆。</p><blockquote>為甚麼讓兩個相愛的人，<br>停在幸福的門外？</blockquote>`)+note('先收起答案：你會怎樣讀這個結局？', `<p>是作者刻意折磨人物？是對拋棄舊情人的道德懲罰？還是故事真正想呈現的，原本就是愛的追尋本身？</p><p>下一頁會展開 Singer 的辯護。他理解司湯達的選擇，卻沒有因此把他的愛情哲學當成完整答案。</p>`)
  },
  {
    title:'翻到故事以外', kicker:'讀後，想一想', image:5, caption:'那些晶體，照亮的是對方，也照亮了戀人的想像。', deck:'Singer 為甚麼辯護？又留下了甚麼問題？',
    alt:'回看第一次結晶的摺紙插畫，戀人與金黃色紙晶體成為思考想像、價值和愛的線索',
    body:`<div class="discussion"><p>先不要急着把悲劇改成幸福結局。Singer 問的是：司湯達為甚麼選擇在這裡停下？他的選擇，照亮了愛的哪一部分？</p><div class="label">先選一個最接近你直覺的讀法</div><div class="choice-list" role="group" aria-label="你怎樣理解結局"><button type="button" data-choice="cruel" aria-pressed="false">作者太殘忍了</button><button type="button" data-choice="search" aria-pressed="false">追尋本身就是幸福</button><button type="button" data-choice="missing" aria-pressed="false">故事還欠共同生活這一章</button></div><div id="choice-response" class="choice-response" aria-live="polite" hidden></div><h2>Singer 的辯護</h2><p>逐項展開，看看他如何回應對司湯達的批評。</p><details><summary>一、他只是故意不讓戀人幸福嗎？</summary><div class="fold-body"><span class="note-tag">Singer 的回答：不能只把這視為任性或惡意。</span><p>他把這篇故事看成一則寓言，突出司湯達最理解、也最想理想化的人性潛能：人會為追尋本身的振奮而追尋，並在尋找幸福的想像活動中，得到最強烈的幸福。</p><p>愛情的不確定，讓每件事都充滿可能。若把筆墨大量轉向婚後生活，便可能削弱先前追求的壯麗。這並不表示司湯達所有戀人都無法結合；Singer 特別指出，有些人物確實能長久在一起。</p><p>他的辯護說明了這個結局的藝術目的，並沒有證明「不能在一起」是現實愛情的理想。</p></div></details><details><summary>二、戀人是否在放棄愛的歡愉？</summary><div class="fold-body"><span class="note-tag">Singer 的回答：司湯達並不是以禁慾超越激情。</span><p>有批評把司湯達讀成放棄享樂的人。Singer 不同意：他不像盧梭那樣，要把激情之愛轉向更高的善；對他而言，激情本身已帶來人生最高的歡愉。</p><p>人物也許放棄了安穩婚姻、體面生活和社會的舒適，卻緊抓住激情。他們最後受苦，並非因為一開始就決心拒絕愛的快樂，而是找不到延續快樂的方法。</p></div></details><details><summary>三、愛為甚麼令生命值得活？</summary><div class="fold-body"><span class="note-tag">Singer 的解讀：關鍵在激情中的想像創造力。</span><p>司湯達筆下的日常現實，往往令人失望：「就只有這樣嗎？」激情之愛卻讓經驗變得熾熱、鮮活、不可預料。</p><p>幸福與危險都未定，生命因此充滿強度。這解釋了他為甚麼如此專注於愛的誕生和成長：對他來說，這份強度本身已足以肯定愛。</p></div></details><h2>辯護以後，問題仍在</h2><p>Singer 同時指出：司湯達幾乎沒有說明幸福的婚姻會是甚麼樣子，也沒有解釋激情如何在共同生活的日常中延續。以下是沿着這個局限提出的討論題。</p><details><summary>如果對方不再難以得到，愛還能怎樣生長？</summary><div class="fold-body"><p>花束、等待與誤會，給想像留下大量空間。相處愈久，對方的習慣和缺點卻會愈清楚。</p><div class="reflection-prompt"><p>你如何分辨：愛正在消失，還是愛正在改變形態？</p></div><p>這正碰到 Singer 指出的空白：求愛時的激情，如何成為日常中的持續關係？不必假定婚姻一定使愛枯竭，也不必假定結合便自動解決問題。</p></div></details><details><summary>我們愛的是他，還是自己替他寫的故事？</summary><div class="fold-body"><p>Ernestine 從衣着樸素，推到貧窮、高尚、不重物質。這些推論並非全都來自事實，卻使她的愛變得鮮明。</p><div class="reflection-prompt"><p>想像賦予一個人價值，甚麼時候又會妨礙我們認識這個人？</p></div><p>「結晶」不宜簡單等同欺騙。問題是：賦予對方價值的創造力，能否同時容納對方與想像不同的地方？</p></div></details><details><summary>相愛，是否已等於一段好的關係？</summary><div class="fold-body"><p>她最幸福的一刻，外表卻是拒絕；他最勇敢的一次求婚，得到的似乎是否定。強烈的內心感受，並沒有讓彼此真正明白。</p><div class="reflection-prompt"><p>除了「我愛你、你也愛我」，共同生活還需要甚麼？</p></div><p>可以從坦誠、信任、對舊關係的責任，以及回應對方的能力開始想。這些是故事引出的討論方向，並非本段 Singer 原文列出的條件。</p></div></details><details><summary>生命的強度，足以成為愛的全部理由嗎？</summary><div class="fold-body"><p>司湯達珍惜那種令世界發亮的強度。但如果一段關係必須靠等待、猜疑或痛苦維持振奮，強度本身是否足以證成它？</p><div class="reflection-prompt"><p>回想白玫瑰與橡樹下的昏倒：你會用甚麼標準判斷這份愛的價值？</p></div><p>Singer 的辯護幫助我們理解激情的價值；他對共同生活的追問，也讓我們看到，理解激情並不等於已完整解釋愛。</p></div></details><div class="reflection-prompt"><p>他解釋得極好，人如何墜入愛河。<br>那麼，人如何長久地愛一個已經得到的人？</p></div><span class="note-tag">上句為本故事書的導讀提問，並非 Singer 的直接引文。</span></div>`
  }
];
const responses = {
  cruel:'你看到的是人物失去共同生活的可能。Singer 不否認他們的痛苦，但他認為，這個結局有意把追尋的振奮放到最強的位置。展開第一項辯護，再看看這是否足以說服你。',
  search:'這很接近 Singer 對司湯達的解讀：幸福也存在於追尋幸福的想像活動中。但「最強烈的幸福」是否就等於愛的全部？可以接着讀他的辯護，再展開最後一個問題。',
  missing:'這正接近 Singer 指出的理論局限：司湯達沒有充分說明幸福的共同生活，也沒有解釋激情在日常裡如何延續。你可以同時肯定前面七幕，也認為故事還需要另一章。'
};
const $ = id => document.getElementById(id);
let current = 0;
const hashFor = i => i < 7 ? `stage-${i+1}` : i === 7 ? 'ending' : 'reflection';
const parseHash = () => {const hash=location.hash.slice(1);if(hash==='ending')return 7;if(hash==='reflection')return 8;const m=hash.match(/^stage-([1-7])$/);return m ? Number(m[1])-1 : 0;};
const numbers=['一','二','三','四','五','六','七'];
$('stage-track').innerHTML=stages.map((s,i)=>`<button type="button" data-goto="${i}" aria-label="第${numbers[i]}階段：${s}"><span class="stage-index">${i+1}</span><span class="stage-name">${s}</span></button>`).join('');
$('contents').innerHTML=pages.map((p,i)=>`<button type="button" data-goto="${i}">${i<7?`${numbers[i]} · `:''}${p.title}</button>`).join('');
function closeContents(){ $('contents').hidden=true;$('contents-button').setAttribute('aria-expanded','false');$('contents-button').querySelector('span').textContent='＋'; }
function render(i, userAction=false){
  current=Math.min(pages.length-1,Math.max(0,i));const page=pages[current];
  $('scene-image').src=`assets/stage-${page.image}.webp`;$('scene-image').alt=page.alt;
  $('picture-number').textContent=current<7?`第${numbers[current]}幕`:current===7?'回望那次求婚':'把故事留在心裡';
  $('picture-caption').textContent=page.caption;$('page-kicker').textContent=page.kicker;
  $('page-count').textContent=`${String(current+1).padStart(2,'0')} / 09`;
  $('page-title').textContent=page.title;$('page-deck').textContent=page.deck;$('page-body').innerHTML=page.body;
  $('section-label').textContent=current<7?'七個階段':current===7?'故事的尾聲':'Singer 的辯護與追問';
  $('footer-location').textContent=current<7?stages[current]:current===7?'尾聲':'讀後，想一想';
  $('previous').disabled=current===0;$('next').disabled=current===8;$('next').textContent=current===6?'讀結局':current===7?'讀後，想一想':current===8?'全書讀畢':'下一頁';
  $('progress-fill').style.width=`${(current+1)/pages.length*100}%`;
  document.querySelector('.progress').setAttribute('aria-valuenow',String(current+1));
  document.querySelectorAll('[data-goto]').forEach(btn=>{const dest=Number(btn.dataset.goto);let active=dest===current;if(btn.closest('.top-nav'))active=dest===0?current<7:dest===current;btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
  document.title=`${page.title}｜愛，如何誕生`;closeContents();
  if(userAction){$('spread').classList.remove('turning');void $('spread').offsetWidth;$('spread').classList.add('turning');$('book').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('reading').focus({preventScroll:true});}
  if(current<6){const prefetch=new Image();prefetch.src=`assets/stage-${current+2}.webp`;}
}
function go(i){i=Math.min(pages.length-1,Math.max(0,i));if(i===current){closeContents();return;}history.pushState(null,'',`#${hashFor(i)}`);render(i,true);}
document.addEventListener('click',e=>{const btn=e.target.closest('[data-goto]');if(btn)go(Number(btn.dataset.goto));const choice=e.target.closest('[data-choice]');if(choice){document.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));$('choice-response').textContent=responses[choice.dataset.choice];$('choice-response').hidden=false;}if(!$('contents').hidden&&!e.target.closest('#contents')&&!e.target.closest('#contents-button'))closeContents();});
$('previous').addEventListener('click',()=>go(current-1));$('next').addEventListener('click',()=>go(current+1));
$('contents-button').addEventListener('click',()=>{const open=$('contents').hidden;$('contents').hidden=!open;$('contents-button').setAttribute('aria-expanded',String(open));$('contents-button').querySelector('span').textContent=open?'−':'＋';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeContents();return;}if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}});
let touchStart=null;
$('image-wrap').addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
$('image-wrap').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.6)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
$('image-wrap').addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
window.addEventListener('popstate',()=>render(parseHash(),true));window.addEventListener('hashchange',()=>{const dest=parseHash();if(dest!==current)render(dest,true);});
render(parseHash());
