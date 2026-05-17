---
tags:
  - blog
  - maida
  - product-story
status: draft
source: claude-code
order: 22
series: F
lang: zh-TW
---

# 22 · 為什麼我做了一個沒有 library view 的遊戲啟動器

對 Maida 最常見的反應是：library view 在哪？

每個其他的遊戲啟動器都有一個。Steam 的庫存是中心畫面。Playnite、GOG Galaxy、EA App、Epic。它們都把你的收藏顯示成 grid 或 list。你滑、你排序、你過濾、你點。

Maida 沒有這個。你不能在 Maida 裡面瀏覽你的庫存。沒有 grid，沒有 list，沒有排序。介面一次給你看一個遊戲，問你今晚要不要試。

這是一個刻意的限制。原因如下。

---

## Library View 實際上造成什麼

Library view 是 decision paralysis 發生的地方。你帶著要玩的意圖打開它。你看到一百個遊戲。你開始評估。你不 commit。你離開。

Library view 被當作方便選擇的方法賣。實際上，它是阻止選擇的摩擦。你看到越多，越難挑。

這不是一個你可以靠加更好的 filter 解決的 UI 問題。Filter 邊際幫助。根本問題是人類不擅長從大的、未排序的集合裡選。加排序選項把問題推到下一層，沒有溶解它。

---

## 移除 library view 做了什麼

如果你不能瀏覽，你不能比較。如果你不能比較，你不能糾結。如果你不能糾結，你只能玩或不玩。決策空間 collapse 成二元。

第一次用 Maida，這感覺錯。你期待一個清單。沒有清單感覺像工具壞了或不夠。第三或第四個 session 之後，沒有清單開始感覺像鬆了一口氣。

Library view 是 bottleneck。移除它移除 bottleneck。

---

## 反對：「但是我想選」

這是最常見的反對。人們覺得沒有 library view 是剝奪了他們的能動性。他們想從庫存挑，刻意地。

兩個回答。

第一：實際上，多數人在 library view 前做的事不是刻意選擇。他們滑到某個東西感覺對，然後再次猜疑、看別的東西。「選擇」大部分是漂流。移除 library view 不是拿走選擇，是拿走漂流。

第二：當你真的想刻意選的時候，Kamae（一個分開的 view）在那裡。Kamae 是給 curate 的，不是給今晚的選擇。兩個活動是不同的，分開有好處。

---

## 你放棄什麼

你放棄看到你收藏的視覺愉悅。看到一面牆的封面有某種滿足。Maida 不提供。

你放棄方便的參考：「我又有什麼了？」Maida 假設你可以用 Steam 查那個，這是公平的。

你放棄對什麼會出現的細粒控制。引擎挑。你可以透過 Kamae 限制，但你不是每次從選單挑。

對某些人這些是 deal-breaker。他們想要那面牆和控制。對他們來說 Maida 不適合。

對其他人，移除這些就是整個重點。

---

## 順帶一提

排除 library view 的決定是 Maida 的奠基決定。其他一切都從它下游。如果你把那個決定拿掉，你有一個不同的產品，那種產品已經存在很多次了。

[Maida 免費](https://brightraven.world)。Library view 的不存在不是失蹤的 feature，是 feature。
