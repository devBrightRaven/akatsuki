---
tags:
  - blog
  - maida
  - product-story
status: draft
source: claude-code
order: 22
series: F
---

# 22 · Why I Built a Game Launcher with No Library View

The most common reaction to Maida is: where's the library view.

Every other game launcher has one. Steam's library is the central screen. Playnite, GOG Galaxy, EA App, Epic. They all show your collection as a grid or list. You scroll, you sort, you filter, you click.

Maida doesn't have this. You can't browse your library in Maida. There is no grid, no list, no sorting. The interface shows you one game at a time and asks if you want to try it tonight.

This is a deliberate constraint. Here's why.

---

## What the library view actually causes

The library view is the place where decision paralysis happens. You open it with the intention to play. You see a hundred games. You start evaluating. You don't commit. You leave.

The library view is sold as the convenient way to choose. In practice, it's the friction that prevents choosing. The more you see, the harder it is to pick.

This is not a UI problem you can solve by adding better filters. The filters help marginally. The fundamental issue is that human beings are not good at choosing from large, unsorted sets. Adding sort options moves the problem one layer deeper. It doesn't dissolve it.

---

## What removing the library view does

If you can't browse, you can't compare. If you can't compare, you can't agonize. If you can't agonize, you can either play or not play. The decision space collapses to binary.

The first time you use Maida, this feels wrong. You expect a list. The absence of a list feels like the tool is broken or insufficient. By the third or fourth session, the lack of a list starts feeling like relief.

The library view was the bottleneck. Removing it removes the bottleneck.

---

## The objection: "but I want to choose"

This is the most common objection. People feel that not having a library view denies them agency. They want to pick from their library, deliberately.

Two responses.

First: in practice, what most people do in front of a library view is not choose deliberately. They scroll until something feels right, then second-guess, then look at something else. The "choosing" is mostly drift. Removing the library view doesn't take away choosing; it takes away drifting.

Second: when you do want to choose deliberately, Kamae (a separate view) is there. Kamae is for curation, not for tonight's pick. The two activities are different and benefit from being separated.

---

## What you give up

You give up the visual pleasure of looking at your collection. There's something satisfying about seeing a wall of cover art. Maida doesn't offer that.

You give up the easy reference: "what do I own again?" Maida assumes you can use Steam for that, which is fair.

You give up granular control over what comes up. The engine picks. You can constrain via Kamae, but you don't pick from a menu each time.

For some people, these are deal-breakers. They want the wall of art and the control. For them, Maida isn't a fit.

For others, removing these things is the entire point.

---

## One more thing

The decision to exclude the library view was the founding decision of Maida. Everything else is downstream of it. If you take that decision out, you have a different product, one that already exists many times over.

[Maida is free](https://brightraven.world). The library view absence is not a missing feature. It's the feature.
