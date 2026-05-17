---
tags:
  - blog
  - maida
  - philosophy
  - friction
  - design
status: draft
source: claude-code
lang: zh-TW
backup_of: bright-raven/world/blog/src/zh/friction-is-protection.md
related:
  - "[[G-01-maida-not-a-recommender.zh]]"
  - "[[G-02-space-key-disabled.zh]]"
  - "[[G-03-why-not-reflection-in-maida.zh]]"
created: 2026-05-16
---

# Friction is protection：摩擦不是 bug

UX 設計圈有條約定俗成的規矩：摩擦是要清除的雜質。少一個 click、少一個 form field、少一次 confirm dialog 都是進步。Steve Krug 的「Don't Make Me Think」是這條規矩的 manifesto。

這條規矩 80% 的時候是對的。**問題出在剩下 20%**。

那 20% 的摩擦不是雜質，是產品本身的價值。砍掉等於把產品的靈魂砍掉。但因為它跟「真雜質」長得一模一樣（都讓使用者多按一次鍵），所以**會被善意的 UX 設計師當成 bug 修掉**。

這篇是關於那 20% 怎麼辨認、怎麼守。

## 一個具體例子：Maida 的長按 3 秒

Maida 是個 Steam 遊戲庫工具，一次秀一款遊戲，玩或跳過。介面上的按鈕（試試看 / 先跳過）有個刻意的設計：**短按 300 毫秒觸發、長按 3 秒觸發另一個動作**。

300 毫秒短按是「拜訪」（看詳情）。3 秒長按是「啟動遊戲」或「鎖定到型」。

3 秒。**整整 3 秒**。

任何一個有 UX sense 的設計師看到這條第一反應都是「這太久了，砍到 800ms」。Maida 的程式碼裡明文擋掉這條善意修改：

> tapThreshold = 300ms (short press)
> anchorThreshold = 3000ms (TRY hold = anchor / Kamae remove commit)
>
> These are the friction layer that protects the user from accidental state changes. Don't shorten to "improve UX." Lengthening requires product discussion.

理由是啟動一個 Steam 遊戲是個**有後果的動作**。Steam client 開、Tauri 視窗失焦、注意力中斷。萬一誤觸，沒有「Esc 取消」可以回。所以摩擦要設計在「決定要不要啟動」這步，事後補不到。

加上 Maida 的使用情境經常在掌機（ROG Ally、Steam Deck），手把搖桿被推到、放下手把時誤壓很常見。3 秒長按是個簡單可靠的防誤觸。

把這 3 秒砍掉，介面變得「順手」，**同時開始有誤觸啟動遊戲的情況**。從 UX metric 上看，砍掉之後「按鈕回應速度」進步，「session 平均長度」延長（因為使用者要花時間 alt-tab 出來），看起來像勝利。實際上是慢性的傷害。

這個 3 秒是**保護**，不是 bug。

## 怎麼分辨保護性摩擦跟懲罰性摩擦

我寫過一條哲學叫「friction is protection」，但這條太絕對，會被誤解成「所有摩擦都不能砍」。實際的判斷規則是這條：

> 如果移除這個摩擦會降低**決策品質**（不只是降低決策成本），這個摩擦是保護性的。
> 如果只是降低決策成本沒影響品質，這個摩擦是懲罰性的。

兩個摩擦看起來像，但內裡完全不同。

**懲罰性摩擦範例**：

- 註冊要求重複輸入 email 兩次
- 取消訂閱前要看 5 個挽留頁面
- 表單分 4 頁，每頁只有兩個欄位
- 設定深埋在 3 層選單下

砍掉這些不會讓使用者做更壞的決定，只是讓事情快一點。砍。

**保護性摩擦範例**：

- 銀行轉帳超過 NT$30,000 要二次驗證
- 刪除整個資料夾要打字輸入「DELETE」
- Maida 啟動遊戲要長按 3 秒
- Git commit 時跳出 editor 讓你寫訊息（vs 強制 `-m "msg"`）

砍掉這些會讓使用者做出他們**後悔的決定**。決策品質下降。這些是價值，不是雜質。

## 一個測試：「如果這條 UX 改了，使用者會更快還是會更後悔」

我在 review 任何「砍摩擦」的提案時用這個測試：

- 改了之後使用者**更快達成目標** → 砍
- 改了之後使用者**會做出他 5 分鐘後想撤回的動作** → 保留

第二種情況的關鍵指標是**後悔率**，不是滿意度。NPS 測不到後悔，因為使用者自己常常意識不到「啊我剛剛是因為這 UX 太順手才誤觸的」。

這也是為什麼純看 metric 的產品團隊容易把保護性摩擦修掉——metric 看到 click 數下降、session 長度延長，這些都看起來像進步，但反映的是「使用者陷進去出不來」，不是「使用者得到他想要的」。

## 一個哲學工具：價值寫成 couplet 形式

Patagonia 跟 37signals 在他們的 internal 價值文件裡有個共同特徵：**核心價值不寫成單一句，寫成成對的句子**。

37signals 寫過：「Speed has value, AND friction has value too. The test is which decision is being made.」

Patagonia 寫過：「Quality, AND environmental impact. When they conflict, environmental impact wins.」

這個形式的關鍵是**承認張力**。單一句的價值（「我們追求極簡」）會在跟另一個價值衝突時崩潰（「但極簡跟功能完整衝突時怎麼辦？」）。Couplet 形式直接把張力寫進去，並指明在衝突時哪邊優先。

我把 Maida 的紅線 7.4（長按 3 秒）改寫成 couplet：

```
Speed has value, friction has value. When they conflict,
ask: does removing this friction reduce decision quality?
If yes, friction wins.
If no, speed wins.
```

這就是個可操作的判斷工具。下次有人提「砍 3 秒到 800ms」的 PR，這個 couplet 就是 review 時要打開的東西。砍 3 秒會不會降低決策品質？會（誤觸啟動遊戲是 5 分鐘無法撤回的後果）。所以 friction wins，PR 駁回。

## 為什麼這條規則跟主流 UX 思維反

主流 UX 的祖師爺 Don Norman 跟 Jakob Nielsen 強調「降低 cognitive load」「removing barriers」「making things invisible」。這些原則 80% 的場合是對的。

但這些原則隱含一個假設：**使用者知道自己要什麼，介面只是中間的橋**。如果橋愈順、使用者愈快達成目標，就是好設計。

問題在於，有一類產品的使用者**不確定自己要什麼**——他們是來搞清楚自己要什麼的。這類產品包括：

- 反思工具（你來這裡是因為不確定該怎麼想）
- 決策工具（你來這裡是因為不確定該選什麼）
- 學習工具（你來這裡是因為不知道該學什麼）
- 治療工具（你來這裡是因為不確定該感受什麼）

對這類使用者，「順手」就是危險。介面太順、使用者就照當下的衝動行動，繞過了他**來這裡的目的**——搞清楚自己想要什麼。

Maida 屬於這類。Maida 服務「選不出來」的使用者。如果 Maida 太順手，使用者按一下就啟動遊戲，那他根本沒「選」，是衝動。Maida 的價值就消失了。

所以 Maida 的長按 3 秒不是壞的 UX 設計，是**為這類使用者刻意設計的保護**。

## 把這條規則延伸到產品策略

「friction is protection」這條延伸出去，會推導出幾個非主流結論：

**1. 訂閱型 SaaS 的「無痛 onboarding」可能在傷害使用者**：

如果你的產品讓使用者 30 秒就上手，他可能 30 天後也離開——因為他沒投入過 cognitive load，沒形成 mental model，沒判斷過「這對我有用嗎」。**有些產品的 onboarding 摩擦是篩出對的使用者的機制**。

**2. 強制等待時間有時是好的**：

Amazon 一鍵下單方便，但**衝動消費率也高**。如果加 60 秒「review your cart」步驟，部分使用者會發現「啊我其實不需要這個」。對使用者好，對 Amazon 短期營收不好——所以 Amazon 不加。但如果你不是 Amazon，你可以加。

**3. 預設值勝過 toggle 開關**：

給使用者很多開關叫做 "user empowerment"，實際上是把判斷負擔推給使用者。**好的預設值是替使用者做了基本的判斷**，這是減少摩擦的正確版本。增加開關才是真正的摩擦（即使每個開關都「方便」單獨用）。

**4. 隱私設定的摩擦是必要的**：

「Sign in with Google」一鍵授權所有資料訪問，方便。但這個方便等於使用者放棄審慎判斷。如果改成「你要授權什麼？逐項勾選」，摩擦增加，**但每個勾選都是一個主動決定**，保護使用者免於日後被廣告 retargeting 才驚覺「我授權過這個？」

## 結語：摩擦的政治

把摩擦當雜質的 UX 思維有個沒講的政治立場：**使用者要快，平台要 engagement metrics 上升，沒人想要慢**。這個立場下，所有摩擦都是 bug。

但有些使用者是來慢的。他們希望 Spotify 不要 autoplay 下一首讓他可以好好聽完這首、希望 Netflix 不要倒數播下一集讓他可以決定要不要關掉、希望購物網站不要記住信用卡讓他每次都重新確認「真的要買嗎」。

對這群使用者，**摩擦不是要被 UX 設計師清除的對手，是他們花錢買的服務**。

Maida 的 3 秒長按是這群人會付錢買的東西。Patagonia 不打折是這群人會付錢買的東西。37signals 的 Basecamp 不加 AI 是這群人會付錢買的東西。

下次當你看到產品做了個你覺得「UX 怪怪的」決定，多想一秒：那個怪可能是有人替使用者想過的更深的保護。

---

*Bright Raven 寫的是關於決策疲勞、能動性、跟遊戲。沒有電子報，用 RSS 訂閱，或想到再回來。*
