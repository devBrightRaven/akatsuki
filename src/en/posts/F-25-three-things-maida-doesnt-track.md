---
tags:
  - blog
  - maida
  - privacy
  - design-decisions
status: draft
source: claude-code
order: 25
series: F
---

# 25 · The Three Things Maida Doesn't Track (And Why)

Maida sends three pieces of telemetry, total, ever. They go out once per launch.

A random UUID (so I know unique installs vs the same person opening Maida ten times)
Days since first install (so I know if people stick around)
The app version (so I know which version is in the wild)

That's it. There's no session data. No game titles. No play duration. No device fingerprint. No locale. No IP-derived inference. No analytics SDK. No third-party trackers.

This is unusual for modern software. It's worth explaining why.

---

## What Maida doesn't track, listed explicitly

I'll go through the categories of data Maida doesn't collect, in order of how surprised people are when I tell them.

### What games you have

Maida reads your game library locally. It does not transmit any of it. Steam knows what games you own, because you bought them through Steam. Maida is a local tool that operates on data Steam has given your computer. That data stays on your computer.

There is no Maida server that has a list of your games. There is no leaderboard. There is no aggregate report. The list of games on your machine is between you and Steam.

### What games you play

When Maida shows you a card and you press TRY, that information stays in your local games.json file. It's used to calculate which game to surface next. It is never sent anywhere.

If you play a game for forty hours, Maida doesn't know. If you abandon it after five minutes, Maida doesn't know. The TRY signal is the only thing the system sees, and it sees it only locally.

### How long you use Maida

There's no session timer. There's no usage report. The "days since first install" telemetry is computed from the install date, not from active sessions. Whether you opened Maida once a month or ten times a day, the telemetry is the same.

This is one of the easier things to track in modern software, and many tools do it as a default. Maida doesn't.

### Anything about you specifically

No location. No device specs. No operating system version. No locale. No language settings. No system fingerprint.

If two people are using Maida from the same household, the only thing the telemetry can tell me is that there are two random UUIDs. I don't know they're in the same household. I don't know they're in any country. I don't know what hardware they have.

---

## Why so little

Most software collects more telemetry than it needs. The reasoning is usually: maybe we'll need it later. Maybe a new feature requires it. Maybe analytics will reveal something. Better to collect now than to have to instrument later.

I disagreed with this reasoning when I was building Maida. The reasoning treats the user's data as something to be extracted just-in-case. The user pays the cost (their data is collected, stored, exposed to breach risk) so that I can have optionality on possible future features.

The math is wrong. The user's privacy is a real cost. My future optionality is a hypothetical benefit. Asking the user to pay a real cost for a hypothetical benefit is not respectful.

The three fields I do collect are the minimum I needed to know whether the project was worth maintaining. Are people still using it? Is there a long tail of users? The three fields answer those questions and stop there.

---

## What the absence enables

The absence of telemetry is not just a privacy posture. It's a design constraint.

Because Maida doesn't know what you played, it can't make recommendations based on your play history. This is sometimes inconvenient. It also means the engine can't drift toward optimizing for engagement, because there's no engagement signal to optimize against.

Because Maida doesn't know how long you played, it can't gamify. There's no "you played 5 days in a row, keep your streak" mechanic. The features that exploit user attention require data Maida doesn't have, by design.

The three-field constraint is upstream of many decisions. If I'd chosen to collect more, I would have used more. The constraint protects the product from drifting toward extraction.

---

## What this asks of the user

Trust, partially. You can read the code (Maida is open source) and verify the telemetry claim. The transmission is auditable. But for users who don't read code, there's a small leap of trust.

The privacy posture is also part of the user experience. You don't get a "your year in gaming" wrap-up. You don't get insights about your habits. You don't get cross-device sync. These features depend on data Maida doesn't have.

For users who want those features, Maida is the wrong tool. For users who'd rather have a tool that doesn't watch them, this is the trade.

---

## One more thing

The three-field telemetry is documented in the privacy policy and visible in the code. It's not a marketing claim. The constraint is enforced by the small surface area of the network calls Maida makes.

If you've been used to software that quietly collects everything, [Maida is a different default](https://brightraven.world). The minimum needed to maintain the project, nothing else.
