---
tags:
  - blog
  - maida
  - philosophy
  - decision-log
  - constitutional-reasoning
status: draft
source: claude-code
lang: zh-TW
backup_of: bright-raven/world/blog/src/zh/why-not-reflection-in-maida.md
related:
  - "[[G-01-maida-not-a-recommender.zh]]"
  - "[[G-02-space-key-disabled.zh]]"
  - "[[19a_reflection-rejected]]"
created: 2026-05-16
---

# 為什麼我沒把反思層做進 Maida

最近做完一輪關於選擇焦慮的研究，挖了四層深度，發現一個明確的市場機會：**多數使用者缺乏後設認知反思工具**。研究有實證、有競品分析、有市場 size 估算。

接著做產品對齊盤點，找到 Maida 跟這個機會的對齊度極高。Maida 服務的就是「選不出來」的痛點，加一個週反思層讓使用者看到自己的決策 pattern，似乎是順理成章的延伸。

我寫了一份 spec，13 個區塊，涵蓋為什麼存在、UX 規格、資料模型、i18n、紅線一致性檢核。

然後我認真讀了 Maida 自己的憲法。

讀完之後我把這份 spec 標記成 `status: rejected`。

這篇是這個決策的記錄。

## 我寫的東西違反了我自己訂的規矩

Maida 的 `02_constitution.md` 有一條叫「Five Immutable Rules」。我寫 spec 之前我以為自己記得這五條，所以 spec 第 11 區塊還做了「紅線一致性檢核」表，每條紅線打勾「Compatible」。

那個表是錯的。我來重做一次，這次認真讀憲法本體。

**Rule III**：

> Ma does not measure users. No scoring of user behavior. No tracking of play time. No analysis of user patterns. No telling you whether you're "getting better" or "getting worse".

我 spec 的核心是「系統觀察使用者上週做了什麼，提出一個對應的問題」。即使是純計數（「上週你拜訪 Subnautica 三次」），這就是 pattern analysis。憲法明文禁止。

**Rule IV**：

> Ma does not tell people what to do. AI must not persuade. Must not explain "why this suits you". Must not predict your state. Must not make decisions for you.

我 spec 的 Triggered Actions 設計：如果使用者反思時選「這款不適合」，系統會加速這款遊戲的 decay。這意味著反思結果**直接改變未來遊戲出現的機率**。

憲法 Part 5 有條 One-Sentence Test：「Does this allow a world to become more likely (or less likely) without TRY, NOT NOW, or time passing?」

我那個設計的答案是 YES。違反。

**Rule V**：

> Ma's presence must be extremely low. No push notifications. No reminders.

我 spec 設計每週日 19:30 自動彈出反思 modal。這就是 reminder，即使只在 app 內。違反「extremely low presence」。

**Part 3 的 Whitelist**：

> This system only allows:
> 1. Present one game
> 2. Provide one prescription (when idle)
> 3. Wait for user decision
>
> Everything else is suspicious.

反思 modal 不屬於這三項任一。違反 whitelist。

**Part 7 的 Self-Destruct Clause**：

> If one day, this thing becomes "very smart," "very considerate," "very understanding," that's not success — that's deviation.

反思層作為「很體貼、很理解你」的功能，被憲法本身明文認定為 deviation。

五處違反。我寫 spec 時都沒看到。

## 為什麼這五處不能修

我第一個反應是「surgical edit」。先請 AI 做了一輪 plan agent，agent 抓到 Rules 3 跟 4 的衝突，建議移除 Triggered Actions，把 observation 限縮成純計數。

我接著想自己再修一輪：把週期改成需要使用者主動觸發（解 Rule V）、把 observation 移除（解 Rule III）、不存 reflection data 給系統讀（避免間接違規）。

砍到一半發現一件事：**砍完之後剩下的東西已經不是反思層了，是個空殼**。

具體的：

- 不能主動 prompting → 沒有「每週提醒你反思」這層
- 不能系統生成 observation → 沒有「給你看你的決策 pattern」這層
- 不能儲存 reflection 給系統讀 → 沒有「累積成長軌跡」這層
- 不能根據 reflection 改變遊戲分數 → 沒有「反思影響未來」這層

研究找到的「後設認知反思」的價值核心，**這四件事至少要有一件**。一件都沒有的話，那不叫反思層，叫「打開一個空 markdown 檔案寫字」。

這個發現很重要：**不是設計沒做好。是 Maida 不是裝載這個功能的容器**。

## 「容器錯了」這件事該怎麼處理

研究確認的需求是真的。Maida 不能裝這個需求也是真的。兩件事都對。

第一個誘惑是把容器邊界往外推：「那我就改寫 Maida 憲法。」這聽起來合理但實際上是 self-destruct clause 在描述的事情——讓 Maida 變得「very considerate」就是把 Maida 殺掉。

第二個誘惑是放棄需求：「那這個需求不做了。」但研究是真的，使用者痛點是真的，市場機會也是真的。放棄等於浪費那四層研究。

正確的答案是第三條：**換容器**。需求住到 Maida 之外。

這給我一個新的設計選項清單：

- 做進 Asagiri（我另一個 idea generation 工具）裡，加一個 reflection mode
- 做成獨立 Obsidian plugin
- 做成完全獨立的新產品

每個選項都有自己的 trade-off。最後選的路徑是**三層 horizon**：

1. 短期（這幾天）：用 Obsidian 既有的 plugin（Templater + Periodic Notes）組合出最輕量的反思流程，先驗證我自己用得起來不
2. 中期（幾個月）：如果驗證成功，把它升級到 Asagiri 裡作為一個新 mode
3. 長期（一年後）：如果中期也成功，再做獨立產品

每一層都用上一層的驗證數據決定要不要做。**最快的可能停在第一層，永遠不需要第二、第三層**。

## 為什麼我覺得這段紀錄值得寫出來

兩個原因。

第一個原因：產品文化界很流行一個說法叫「研究找到需求就該補上去」。這條規則對的部分是「先驗證需求再做」，但有一個被忽略的條件——**驗證的需求要由對的產品來補**。

如果你有一個哲學上嚴謹的產品（Maida 的「不替使用者決定」），它的市場範圍會被自己的哲學限定住。在那個範圍外的真實需求，正確的反應是承認「這在我的範圍外」，不是「我要把範圍往外擴張來包進去」。

範圍擴張是緩慢的自殺。Maida 加一個反思層，下次再加一個 mood tracker，再下次加一個社群分享，三年後它就變成 Notion-for-gamers，失去原本的可辨識性。

第二個原因：寫憲法不是為了在 PR review 時打勾，是為了在自己手上產生產品擴張的衝動時當作緊急煞車。**這次的煞車真的踩下來了**——而且踩煞車的不是別人，是過去的自己。

`02_constitution.md` 寫於 2025 年初，我寫 spec 寫於 2026 年 5 月，中間隔了一年多。一年前的我訂的規矩，一年後的我想違反，結果是一年前的我贏了。這就是憲法該長的樣子。

## 寫的時候不痛苦

我以為廢掉自己寫的 spec 會很挫折，但實際感覺反而是清爽的。原因可能是這個過程沒有人爭論、沒有 reviewer push back、沒有商業壓力，只有「規矩」跟「我」之間的對齊。發現不對齊，調整方向。

那份被廢掉的 spec 我保留下來，標記 `status: rejected`，旁邊放一份 `19a_reflection-rejected.md` 記錄為什麼。**保留錯誤的設計**有意義：未來想加類似功能時，這份失敗 spec 是現成的反 pattern 範例。

說起來，產品文件最有價值的部分常常不是「我們做了什麼」，是「我們考慮過但拒絕做什麼」。後者比前者難寫，因為要承認失敗思路，但讀的時候資訊密度高很多。

## 結語：研究的成果不一定要由現有產品兌現

這趟下來最重要的學到的事，是把「研究找到的需求」跟「應該由 X 產品滿足」這兩件事**分開**思考。

研究產出是市場面的東西：有人需要什麼、有多少人、付多少錢。產品判斷是哲學面的東西：我們是誰、我們守什麼、我們不做什麼。

兩個都對，但對不一定要相交。當研究找到的需求不能用現有任何產品滿足時，正確答案是**做新的**，不是**改現有的**。

Maida 守住了自己。反思的需求改去別的容器找。下一篇我會寫那個別的容器長什麼樣。

---

*Maida 是免費的、開源的桌面工具，幫你決定今晚玩什麼。[下載連結](https://github.com/devBrightRaven/maida/releases/latest)，[原始碼](https://github.com/devBrightRaven/maida)，MIT 授權。*

*Bright Raven 寫的是關於決策疲勞、能動性、跟遊戲。沒有電子報，用 RSS 訂閱，或想到再回來。*
