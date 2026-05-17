---
tags:
  - blog
  - maida
  - accessibility
  - friction
  - philosophy
  - red-line-7.3
status: draft
source: claude-code
lang: zh-TW
backup_of: bright-raven/world/blog/src/zh/space-key-disabled.md
related:
  - "[[G-01-maida-not-a-recommender.zh]]"
  - "[[F-23-anti-recommendation-manifesto.zh|F-23 反推薦：一篇宣言]]"
created: 2026-05-16
---

# 為什麼 Maida 按鈕的 Space 鍵被故意 disable

打開瀏覽器 DevTools，找一個 button，focus 它，按 Space。它會觸發。這是 HTML 標準行為。

Maida 違反這條。Maida 的按鈕 focus 之後按 Space 不會觸發任何事。寫在 AGENTS.md 紅線 7.3：

> Space key is intentionally blocked on buttons. `useGameInput` explicitly preventDefaults Space on `<button>`. Reason: NVDA browse mode converts Space into a synthetic click (detail=1, identical to mouse) which would bypass long-press friction and launch a game unintentionally. Enter stays fully keyboard-accessible (short press = visit, 3s hold = anchor). Do not "fix" Space back to default.

這是條反直覺的規則。多數 a11y 規範會說「鍵盤可達就是好」，按 Space 觸發按鈕是教科書答案。為什麼 Maida 故意違背？

值得拆給你看。

## 摩擦不是 bug

Maida 的按鈕有兩個觸發時序：

- **短按 300ms**：visit（拜訪這款遊戲）
- **長按 3 秒**：anchor（鎖定，或在 Kamae 模式下提交移除）

3 秒是刻意的長。設計上不希望你輕輕一碰就啟動遊戲。理由有兩個。

第一，**啟動 Steam 遊戲是個有後果的動作**。一旦啟動，Steam client 開、Tauri 視窗失焦、過程不可逆地中斷你當下的注意力。萬一誤觸了，你不能「按 Esc 取消」就回到瀏覽狀態。所以摩擦要設計在「決定要不要啟動」這步，不是事後補救。

第二，**Maida 是個遊戲庫工具，使用情境經常在掌機（ROG Ally、Steam Deck）**。掌機操作頻繁誤觸（搖桿被推到、手把放下時誤壓）。長按 3 秒是個簡單可靠的防誤觸機制，比複雜的「確認 dialog」UX 更不打擾。

長按 3 秒這層摩擦寫在紅線 7.4：

> These are the friction layer that protects the user from accidental state changes. Don't shorten to "improve UX." Lengthening requires product discussion.

摩擦是保護不是 bug。

## NVDA 的 Space 鍵會繞過摩擦

接下來是真正反直覺的部分。

如果你裝過 NVDA（Windows 上最普及的開源螢幕閱讀器）跟它的兩種模式，你會知道：

- **Focus mode**：鍵盤輸入直接送給網頁，跟一般鍵盤操作一樣。
- **Browse mode**（預設）：鍵盤輸入被 NVDA 攔截做為「閱讀網頁的導覽」用，例如 H 跳到下個標題、K 跳到下個連結。

Browse mode 對閱讀網頁很方便，但對「啟用控制項」這件事，NVDA 做了個特別的事：**當你在 browse mode 對 button focus 並按 Space，NVDA 不送 Space 給網頁，它送一個 synthetic click（合成的點擊事件）**。

這個 click 事件的 `detail` 屬性是 1（跟滑鼠單擊一樣），目標的網頁程式碼分不出它是真實滑鼠還是 NVDA 合成。對普通網頁無感，這正是 NVDA 設計這條的目的：讓螢幕閱讀器使用者「啟用按鈕」這個動作行為跟視覺使用者一致。

問題來了。Maida 的長按 3 秒摩擦**只攔截 keydown/keyup 事件**，它分不出「真實滑鼠點擊」跟「NVDA 送來的合成點擊」。如果 NVDA 使用者在 browse mode 按 Space，Maida 收到的是 click event，**長按摩擦完全被繞過**，遊戲直接啟動。

對視覺使用者來說 Space 觸發按鈕是 UX 進步。對 NVDA browse mode 使用者來說，**它會把保護摩擦變成觸發加速器，引發誤觸**。

紅線 7.3 的解法很直接：**在 button 上明確 preventDefault Space，從源頭擋掉這個路徑**。Space 完全不做事。

## Enter 鍵保留

那 NVDA 使用者怎麼啟用按鈕？

紅線 7.3 寫得很清楚：「Enter stays fully keyboard-accessible (short press = visit, 3s hold = anchor)」。

Enter 鍵 NVDA 不會做 synthetic click 那一套（這是 NVDA 的設計差異，Enter 走真實 keydown 事件）。所以：

- 視覺使用者：滑鼠點 / 觸控點 / Tab+Enter / 手把按鍵
- NVDA 使用者：Tab+Enter（短按 visit、長按 anchor）

兩條路徑功能完全一致，摩擦時序也完全一致。Space 這條被砍掉，但功能不損失，因為 Enter 完整保留。

這個取捨在無障礙哲學裡叫「**不同路徑，相同安全**」。Web 標準假設「相同 input 在不同輔助技術下行為一致」是 a11y 的目標。Maida 換了一個更深的目標：「**所有使用者，包括輔助技術使用者，都得到一樣的摩擦保護**」。

當這兩個目標衝突，Maida 選後者。

## 一個更廣的原則

紅線 7.3 是個具體案例，但它在示範一個更廣的原則：**無障礙不是「相同體驗」，是「對所有人都安全」**。

主流 a11y 標準（WCAG 2.1、ARIA Authoring Practices）多數時候講對齊：鍵盤可達、Space 跟 Enter 都要觸發、focus 順序要 reasonable、tab order 要可預測。這些都對。但它們有個盲點：**當「對齊」會把某類使用者推進更高的誤觸風險，盲目對齊就反過來傷害他們**。

Maida 紅線 7.3 處理的就是這個盲點。NVDA 的 synthetic click 是個善意設計（讓 SR 使用者啟用按鈕跟 UI 視覺使用者一樣），但它跟「長按摩擦保護」的設計目標衝突。盲目遵循「Space 也該觸發按鈕」會讓 SR 使用者拿到比視覺使用者更弱的保護。

正確答案不是「砍掉長按摩擦讓所有人一致」，是「找出讓 SR 使用者保留摩擦的路徑」。在 Maida 的情境，這個路徑是 Enter，所以 Space 被砍。

這個取捨會出現在任何「保護性摩擦 vs 標準 a11y 預設」衝突的地方。沒有通用解，每個案例要單獨想清楚：保護要保護什麼？標準預設假設了什麼？兩者衝突時誰優先？

對 Maida 來說，「保護使用者免於誤觸啟動遊戲」優先於「Space 觸發按鈕的標準預設」。對另一個產品可能反過來。沒有對錯，只有取捨可不可見、可不可辯護。

## 為什麼這條規則「不能 fix」

紅線 7.3 的最後一句是「Do not 'fix' Space back to default」。為什麼用「fix」加引號？

因為這條規則對沒見過 NVDA browse mode synthetic click 細節的工程師看起來像 bug。一個善意的 PR 標題可能寫「fix: Space key not triggering buttons (a11y regression)」。要是 review 者也沒見過這個機制，這個 PR 會被 merge，紅線會被「修復」掉。

紅線文件存在的目的之一就是擋這種 PR。每條紅線都附「為什麼這條約束、為什麼不能改、改了會壞什麼」，因為**約束不解釋就會被善意拆除**。這是 Patagonia 跟 37signals 在他們的價值文件裡反覆強調的：價值要寫成 couplet 形式，要描述張力，要說清楚哪條優先。否則組織會自然漂移。

## 結語

Maida 的 a11y 不是「能用 NVDA」這種勾選表式的合規，是「**保護機制對所有使用者一致**」這種更深的承諾。Space 鍵被砍是這個承諾的具體實作。違反 web 標準直覺、可能讓沒讀紅線的工程師困惑，但對螢幕閱讀器使用者而言這個取捨救了他們的遊戲歷程。

下次你看到一個產品做了個你覺得「a11y 設計怪怪的」的決定，多想一秒：那個怪可能是有人替你想過的更深的保護。

---

*Maida 是免費的、開源的桌面工具，幫你決定今晚玩什麼。[下載連結](https://github.com/devBrightRaven/maida/releases/latest)，[原始碼](https://github.com/devBrightRaven/maida)，MIT 授權，NVDA 跟 Orca 部分測試過。*

*Bright Raven 寫的是關於決策疲勞、能動性、跟遊戲。沒有電子報，用 RSS 訂閱，或想到再回來。*
