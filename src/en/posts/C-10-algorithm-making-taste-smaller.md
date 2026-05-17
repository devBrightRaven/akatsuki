---
tags:
  - blog
  - maida
  - gaming
  - recommendation-systems
  - philosophy
status: draft
source: claude-code
order: 10
series: C
---

# 10 · The Algorithm Is Making Your Taste Smaller

Recommendation systems are good at finding things you'll click on. That sounds like the same thing as finding things you'll like. It's not.

The optimization target of every modern recommendation engine, including Steam's, is probability of engagement in the next session. The engine looks at what you played recently and finds adjacent things. If you played a roguelike, you'll see more roguelikes. If you played at 11pm, you'll see more games people played at 11pm.

Each of these recommendations is plausible. None of them are surprising.

---

## What surprise does for taste

Taste is built by exposure to things at the edges of what you currently like. The fifth roguelike teaches you less than a strategy game you'd never have picked. The second turn-based JRPG narrows you. A documentary, a movie, a conversation that nudges you toward something unexpected expands you.

Recommendation engines don't optimize for expansion. They optimize for not losing you. The two are related but not the same. A user who never sees anything outside their cluster has high engagement and zero growth.

After two years of letting an algorithm choose, your taste has been quietly funneled. You don't notice because each individual recommendation felt right. The shape of the funnel is invisible from inside.

---

## How this shows up

You start to feel like new games are all the same. They're not. You're being shown a narrow slice.

You feel like you've outgrown a genre, when actually you've just exhausted the slice the algorithm thinks you want.

You buy something on a friend's recommendation and find you love it, in a way nothing the algorithm showed you has hit in months. That's the algorithm hiding things from you.

You scroll your library and realize you don't remember why you have the games at the bottom of the list, the ones you bought before the algorithm started filtering. Those were the ones you were curious about. The newer ones were optimized for click probability.

---

## What works

Curate against the algorithm intentionally. Once a month, pick a game from a genre you don't usually play. Let yourself dislike it. That's a real data point. Sometimes you'll find a category you didn't know you wanted.

Use recommendation sources that aren't trying to keep you on a platform. A friend, a podcast, a forum, a magazine. Their interests bleed into yours, which is a different kind of recommendation than "users like you also bought."

Remember that "I don't like JRPGs" was probably formed five years ago based on three games. Your taste then is not your taste now. Test it occasionally.

---

## One more thing

Maida doesn't try to recommend. It picks from your installed library based on your past behavior, but it doesn't know which games are similar to which. There's no "users like you also played" hiding in the engine. If you installed it, it's eligible. The randomness is the feature.

This isn't accidentally true. The whole product was built on the conviction that algorithm-recommended is the wrong default for entertainment. [Maida is free, here](https://brightraven.world).
