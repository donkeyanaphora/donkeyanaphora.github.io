---
title: "Extra-Ordinary Language"
description: "An exploration of literary and creative intelligence and things I wish language models did better."
slug: "article3"
date: "2026-01-11"
draft: false
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# 🎭 Extra-Ordinary Language 

**COLLINS WESTNEDGE**  
*JAN 11, 2026*

## Introduction

I've been thinking about a conversation I had with a former colleague about language that defies ordinary usage. More specifically, expressions that push back against the core tenet of [distributional hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics) (i.e., similar usage ≈ similar meaning) and yet carry high degrees of intentionality and depth.

When Kafka wrote "A cage went in search of a bird," he created something that on the surface seems impossible and yet expresses a profound and insidious truth. Current AI systems, for all their linguistic sophistication, rarely produce such language spontaneously. They excel at coherent, informative prose but struggle with the kind of intentional violations that define great literature.

In this post, I'm dog-earing these thoughts to revisit later. The aim here is to understand what makes these expressions work and more critically, the mechanisms by which models may surface or suppress them.

## Literary Examples

> So they lov'd, as love in twain  
> Had the essence but in one;  
> Two distincts, division none:  
> Number there in love was slain.  
>   
> Hearts remote, yet not asunder;  
> Distance and no space was seen  
> Twixt this Turtle and his queen  
>   
> — *Shakespeare, **The Phoenix and the Turtle***

> A cage went in search of a bird.  
>   
> — *Kafka, **Aphorisms***

> You must go on. I can't go on. I'll go on.
>
> — *Beckett, **The Unnamable***

> Merry and tragical! Tedious and brief!  
> That is, hot ice and wondrous strange snow.  
> How shall we find the concord of this discord?  
>   
> — *Shakespeare, **A Midsummer Night’s Dream***


### Core Characteristics

Because of their intentionality and depth, I’m going to call these violations of “ordinary use” **extra-ordinary use**, or **ExO language**. They don’t obscure meaning; instead, they elucidate by way of contradiction or violated expectation. These literary examples share a unifying feature: they present a **literal semantic breakdown** in one domain that creates insightful or profound resonance in another (metaphorical, allegorical, or abstract).

As David Foster Wallace said, “we all know there’s no quicker way to empty a joke of its peculiar magic than to explain it,” and the same is true for figurative language. Still, it’s worth illustrating how these expressions *may* resolve through a figurative interpretation, albeit with some loss of “magic”:

* "Two distincts, division none" - two bodies, one soul
* "A cage went in search of a bird" - oppression seeks freedom
* "You must go on. I can't go on. I'll go on." - I don't choose to continue; it’s compulsory

In each case, the reader encounters a jarring violation of expectation that is only resolved through a figurative reinterpretation. One way to capture that pattern is:

$$
\text{⟦φ⟧}_{\text{literal}} = \text{⊘} \quad ; \quad \text{⟦φ⟧}_{\text{figurative}} = \psi
$$

Here, ⟦φ⟧ denotes the interpretation of expression φ, ⊘ indicates a semantic anomaly (a violation of expectation), and ψ the emergent or resolved meaning. Framed this way, two of ExO language’s core properties are built directly into the notation above:

* **Surface-level anomaly**: under a literal reading, expectations are violated, i.e., ( $\text{⟦φ⟧}_{\text{lit}}=\text{⊘}$ ) (a cage can't search, ice can't be hot, distincts can't lack division etc).
* **Recoverability**: despite that violation or collapse, a coherent reading exists, i.e., there is some ($\psi$) such that ($\text{⟦φ⟧}_{\text{fig}}=\psi$).

However, in practice, strong ExO lines also tend to carry:

* **Intent signal**: the violation feels deliberate and motivated within the larger context.
* **Irreducibility**: paraphrase diminishes the associative effects (the deviation is doing semantic work that a literal restatement can’t).

Ultimately, these examples illustrate how expressions can fracture under a literal reading yet resolve in an imaginative one. The purpose of the notation is not to serve as a definition, but to make that fracture/violation explicit thus clarifying how base model objectives rooted in next token prediction or post training strategies optimized on user preferences (helpfulness, coherence, etc.) could steer models away from ExO language. If we want systems that embrace deliberate, meaningful rule-bending, we’ll need objectives, benchmarks, or sampling techniques that more actively encourage it.

## Why Might Current AI Struggle Here?
Current language models face several systematic barriers to producing ExO language; at this point many of these are my own thoughts or fan theory rather than concrete fact, but nevertheless here they are: 

### Base Training
Though profound literature and instances of ExO exist in pretraining corpora (Project Gutenberg, Books1-3, etc), against which many base models like GPT and Llama have been tuned, it's statistically underrepresented. By definition, semantic violations are rare. Even within Pulitzer Prize winning articles, books, etc the instances of profound subversions of meaning and use (as impactful as they may be) are few and far between. That being said even if a model encountered notable instances of ExO language they are by definition violations of *ordinary usage*, the very pattern the model is optimizing *towards*. Given the prefix "That is, hot" the continuation " ice" is unlikely, lying on the tail end of the distribution for the proposed words to come. From a decoding perspective sequences like "hot ice" are absolutely possible, but not probable, so then what sort of sampling strategy could surface them? [^1].

At this point the easiest way to turn the improbable into probable (in the case of "hot ice" or "I can't go on, I'll go on") is to condition the model on the exact instances in which they have *already* occurred. Insofar as we care about seeing ExO on the page our job here is done, but if we care about the generation of *new* forms of ExO, new intentional rule breaking, e.g., the meaningful violations that extend beyond imitation, we have made 0 progress. 

ExO sequences are in fact hiding somewhere in the set of possible generations, but the question remains what objectives or sampling techniques could possibly surface them? This might be as good a time as any to question the very foundation, the model architecture, and at the very least consider whether next token prediction is even the right framework for ExO language. For example, does it make sense to say that we cogitate left to right one word at a time, and then make some sort of value judgement accept/reject on the final form these sequential trajectories? [^2]. 

### Post-training
From a post training perspective there are likely a few culprits or rather one culprit that hurts in different ways, preventing the emergence of ExO. The first of which is as simple as task absence, e.g., the under-representation of ExO demonstrations in the instruction/demonstration datasets upon which the base models we discussed earlier are further optimized. I mean honestly what sort of standalone questions would even elicit a demonstration of intentional semantic rule breaking "please reshape my perspective of X?" 

My gut tells me that ExO emerges from a very different kind of language game, one that is culturally and historically situated and doesn't cleanly fit into the box of *instruction following* (a game whose economic utility maps more directly to an ROI). To further this point I would argue that Kafka (or any writer, poet, activist) for that matter was not following an instruction. The aim was to subvert meaning, to reshape the linguistic pathways through which we talk and *think* about the world. Though you could argue that someone probably instructed Kafka to "write more of XYZ" or that speech writers are instructed to put some idea into the form of compelling rhetoric, but even so it's very hard to imagine these instructions stripped of the socio-political landscape by which they are motivated and dropped into some instruction/demonstration dataset. [^3] [^4]

Just to be clear this isn't to say there's some irreducibly human or non-optimizable part of ExO, as I mentioned before these are just my ramblings. Before moving onto the next topic in post-training it's worth reiterating our point from earlier about ExO expressions like "hot ice" surfacing as our prior gets closer to the original instance in which it occurred:

| Context | P("ice") |
|---------|----------|
| "That is, hot ___" | ▪○○○○ |
| "Tedious and brief! That is, hot ___" | ▪▪▪○○ |
| [Full Shakespeare]... "hot ___" | ▪▪▪▪▪ |
<br>
The model is only ever looking a single word ahead but as that prior increases and more closely resembles the excerpt in which our target word occurred the probability increases. This is why I mentioned sampling techniques earlier because they offer an alternative to building up that prior, instead focusing on strategies to leverage the information we have about the distribution to pick words that may not be the most likely. 

However, the question remains how would we sample for ExO, and what recipe could we concoct (based on token probability masses) to reliably produce instances of it. Overall, these strategies can't encode "take a low probability path here, because it *will* conceptually or rhetorically pay off later" because as the table illustrates there is no notion of later. But what if we could learn one? 

This brings us to RLHF (and preference optimization more broadly) a strategy by which we aren't just conditioning on some previously seen ExO prior, but incorporating information about where individual token choices *may* take us. It's important to disclose that the shift is not that the model stops being a next-token predictor, it's that we train it using feedback that is defined over the entire sequence. 

The reward model has seen complete sequences and encodes information about how these trajectories resolve. But the base model still has to learn which token-level decisions lead to this reward. The effect feels like pruning a tree, until the probability mass for a given token is concentrated around tokens that take us in directions humans prefer. 

This seems like an interesting way to overcome the hurdles we discussed earlier, however, there remains one major issue: we are still playing the wrong language game. As interesting as optimization toward something as ineffable as human preference may be it's still rooted in a context that doesn't quite fit ExO, primarily because it's the context in which preferences map to coherence, rule following, legibility, helpfulness, etc. 

## Closing Thoughts

Just because models can exhibit surprisal or violate semantic expectations doesn't always mean they possess the ability to do so meaningfully. Ultimately, the goal is to understand whether machines can develop the kind of novel, conceptual re-framings that define ExO language and to build evaluation frameworks that recognize this kind of rhetorical force when it emerges. In short, we need benchmarks and optimization strategies that do not suppress, but instead reward "wondrous strange snow." [^5]

## Key Resources

**Philosophy of Language & Logic**

* ⭐ [Richard Rorty, *Contingency, Irony, and Solidarity* (1989)](https://sites.pitt.edu/~rbrandom/Courses/Antirepresentationalism%20(2020)/Texts/rorty-contingency-irony-and-solidarity-1989.pdf) — PDF

* [Marta Abrusán, *Semantic Anomaly, Pragmatic Infelicity and Ungrammaticality* (2019)](https://hal.science/hal-02381339/file/Abrusan.SemanticAnomaly.Ungrammaticality.pdf) — PDF

* [Metaphor](https://plato.stanford.edu/entries/metaphor/) - *Stanford Encyclopedia of Philosophy*
* [Contradiction](https://plato.stanford.edu/entries/contradiction/) - *Stanford Encyclopedia of Philosophy*
* [Catachresis](https://en.wikipedia.org/wiki/Catachresis) - Wikipedia
* [Chiasmus](https://en.wikipedia.org/wiki/Chiasmus) - Wikipedia
* [Category Mistake](https://en.wikipedia.org/wiki/Category_mistake) - Wikipedia
* [Exformation](https://en.wikiversity.org/wiki/Information) - Wikiversity

**RLHF & Output Diversity**

* ⭐️ [Aligning language models to follow instructions](https://openai.com/index/instruction-following/) - *OpenAI*
* ⭐️ [Understanding the Effects of RLHF on LLM Generalisation and Diversity](https://openreview.net/pdf?id=PXD3FAVHJT) - *ICLR / OpenReview* 
* ⭐️ [One fish, two fish, but not the whole sea: Alignment reduces language models’ conceptual diversity](https://aclanthology.org/2025.naacl-long.561.pdf) - *NAACL 2025*

**Fluid/Intelligence Reasoning**

* ⭐️ [On the Measure of Intelligence](https://arxiv.org/abs/1911.01547) - *arXiv* (Chollet, 2019)
* [Towards Benchmarking LLM Diversity & Creativity](https://gwern.net/creative-benchmark) - *Gwern.net*

**Sampling, Diversity & Generation Mechanics**

* ⭐️ [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751) - *arXiv* (Holtzman et al., 2019)
  *(Introduces nucleus / top-p sampling)*

**Diffusion Based Approaches**

* [COMING SOON]

[^1]: Holtzman et al.'s *The Curious Case of Neural Text Degeneration* (2019) explores this problem and introduces nucleus sampling as one approach.

[^2]: Diffusion-based text generation offers an alternative to autoregressive prediction, see resources section (coming soon).

[^3]: **Sociological Influence:** How do we account for the way social and historical contexts shape judgments of novelty and creativity and is it a moving target?<br><br>
Novelty and creativity are often historically and socially situated. A good deal of what constitutes creativity and novelty is dependent on the historical context in which artistic expressions are judged. Citizen Kane, for example, is often cited as one of the greatest films of all time due to its innovative cinematography and storytelling. However, the cinematic innovations that define this film, such as Toland's use of depth of field, is now a staple in most introductory film courses. Fashion often follows a similar arc, innovative and fresh designs that mark the runway one season saturate the shelves of fast-fashion retailers the next.<br><br>
Though judgments about creativity and artistic merit are heavily influenced by the social and historical factors there is still a sense in which great works are able to stand the test of time. When evaluating creative intelligence, we must consider how social and historical contexts shape our aesthetic judgments and distinguish between those that are fleeting and those that endure.

[^4]: Rorty's *Contingency, Irony, and Solidarity* (1989) develops this idea at length, arguing that genuinely novel metaphors create new language games rather than play within existing ones.

[^5]: ⭐ *Shoutout to my good friend Joshua for the stimulating convo, the amazing Shakespeare examples and great resources on literary devices + Richard Rorty. And shout-out to Henry too for the great convos on AGI/ARC and thoughts on diffusion-based and RL approaches. And last but not least shoutout to Noel for her core contributions on aesthetics and philosophical insights on creativity and intelligence*