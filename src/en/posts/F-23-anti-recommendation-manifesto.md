---
tags:
  - blog
  - maida
  - manifesto
  - philosophy
status: draft
source: claude-code
order: 23
series: F
---

# 23 · Anti-Recommendation: A Manifesto

Most of the software you use is in the business of recommending things. Spotify recommends songs. Netflix recommends shows. YouTube recommends videos. Amazon recommends products. Steam recommends games.

The pattern is so universal that we've stopped questioning it. Recommendation is the default mode of how content reaches us.

But recommendation is not neutral. It does specific things to your taste, your attention, and your relationship to choosing. Some of those things are bad. Most users have stopped noticing because the alternative is invisible.

This is a case for noticing.

---

## What recommendation optimizes for

Every recommendation system has a target. The target is usually some version of "engagement" or "click-through" or "session length." These are proxies for "the user found this useful," but they are not the same thing.

A user who clicks every recommendation has high engagement. They might also be on a slow drift away from their own preferences, toward the platform's preferences. The system can't tell the difference between productive engagement and addictive engagement. Both look the same in the metrics.

Over years, recommendation systems shape users in their image. Not maliciously. The system is doing what it was built to do. The shaping is a side effect.

---

## What you lose

You lose the experience of choosing. Choosing is a small act of self-definition. When the algorithm chooses, you don't perform that act. You consume what's offered. The thing you got might be excellent, but you didn't pick it. Over time, this changes who you are.

You lose taste at the edges. The system narrows you toward your cluster. Things outside the cluster don't get surfaced. Your sense of what you like contracts to what the system has decided you'll click on.

You lose the muscle of evaluation. If something is always pre-selected, you stop developing the ability to evaluate things yourself. The work has been outsourced. The capacity atrophies.

You lose serendipity. The unrecommended thing, the random discovery, the friend's strange suggestion: these don't appear in algorithmic feeds. The algorithm prefers safe matches.

---

## The conviction

The conviction behind Maida is that for some categories of activity, recommendation is the wrong default. Specifically: leisure activities where the act of choosing is part of the value, where taste is supposed to expand over time, where personal agency matters more than efficiency.

Gaming is one of these categories. So is reading. So is music, sometimes. So is, arguably, most of how we spend our discretionary time.

Recommendation is great for utility. Finding the cheapest flight, the best route home, the right product for a known need. For those, optimize freely.

For leisure, recommendation is corrosive. It replaces the part of the experience where you decide what you want with a system that decides for you. The decision is the thing. Removing it removes the experience.

---

## What anti-recommendation looks like in practice

Anti-recommendation is not "no surfacing." That would be too much friction. Some surfacing is necessary; users can't navigate raw libraries.

Anti-recommendation is surfacing without preference. Maida shows you a game. The game is not picked because you'll like it. It's picked from the pool of installed games with mild behavioral weighting. The system is not trying to predict your preferences. It's offering options without judgment.

The user does the work of deciding. Try this tonight, or not now. If not now, see another. The system never says "but this one is better, look at it again." The user remains the source of preference.

This is slower than algorithmic recommendation. It's also fundamentally different in what it produces. The user develops their own taste through the act of choosing. They don't outsource the development to a system that has goals other than theirs.

---

## What this requires of the user

Anti-recommendation requires more from the user than recommendation does. You have to decide. You have to know yourself enough to evaluate. You have to tolerate the friction of choosing.

This is a feature. The friction is what builds the taste. The decision is what reinforces the agency. The user who has done this work has something the user who hasn't doesn't have: a relationship to their own preferences that's their own, not borrowed from a system.

---

## One more thing

Maida is a small, partial implementation of this idea. It only addresses one slice: choosing what to play tonight from already-installed games. It doesn't try to fix the whole problem.

But the principle scales. Wherever you find yourself reaching for a recommendation system, you can ask: would I rather be served, or would I rather choose? For some categories the answer is "served." For others, "choose" is what you actually want, and you've been forgetting.

[Maida is here](https://brightraven.world). It's a tool that respects you enough to let you choose.
