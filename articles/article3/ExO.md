---
title: "Extra-Ordinary Language"
description: "An exploration of literary and creative intelligence and things I wish language models did better."
slug: "article3"
date: "2025-07-02"
draft: false
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# 🎭 Extra-Ordinary Language 

**COLLINS WESTNEDGE**  
*JULY 2, 2025*

## Introduction

I've been thinking about a conversation I had with a former colleague about language that defies ordinary usage. More specifically expressions that violate the [distributional hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics) of language and yet carry high degrees of intentionality and depth. 

When Kafka wrote "A cage went in search of a bird," he created something that on the surface seems impossible and yet expresses a profound and insidious truth. Current AI systems, for all their linguistic sophistication, rarely produce such language. They excel at coherent, informative prose but struggle with the kind of intentional violations that define great literature.

In this post, I'm dog-earing these thoughts to revisit later. The aim here is to understand what makes these expressions work and more critically, the implications this has on how we measure and evaluate model intelligence. 

<!-- Along the way, I'll attempt some preliminary formalizations and speculate about why current AI systems struggle with this capacity. -->

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

> I can't go on. I'll go on.
>
> — *Beckett, **The Unnamable***

> Merry and tragical! Tedious and brief!  
> That is, hot ice and wondrous strange snow.  
> How shall we find the concord of this discord?  
>   
> — *Shakespeare, **A Midsummer Night’s Dream*** [^1]


### Core Characteristics

Because of their intentionality and depth I'm going to call these violations of “ordinary use” **extra-ordinary use** or **ExO language**. They don't obscure meaning but instead elucidate by way of contradiction or a violation of expectations. 

These literary examples share a unifying feature: they present a **literal semantic failure** in one domain that creates insightful or profound resonance in another domain (metaphorical, allegorical, or abstract). 

As DFW said "we all know there's no quicker way to empty a joke of its particular magic than to explain it" and the same is true for figurative language. However, at the risk of literary blasphemy here is one way to illustrate the ways in which these expressions *may* resolve through a figurative interpretation:

- "Two distincts, division none" - two bodies, one soul
- "A cage went in search of a bird" - oppression seeks freedom
- "I can't go on, I'll go on" - continuation is not a choice, it's compulsory

In each case, the reader encounters a jarring violation of expectation that is only resolved through a figurative reinterpretation:

<!-- - ⟦φ⟧<sub>lit</sub> = ⊥ ; ⟦φ⟧<sub>fig</sub> = ψ.  -->
$$
\text{⟦φ⟧}_{\text{lit}} = \bot \quad ; \quad \text{⟦φ⟧}_{\text{fig}} = \psi
$$

Here, ⟦φ⟧ denotes the interpretation of expression φ, ⊥ indicates contradiction, and ψ the emergent or resolved meaning.

Ultimately, these examples illustrate how expressions can fracture under a literal reading yet resolve in an imaginative one. Making that fracture or violation explicit clarifies how objectives rooted in the distributional hypothesis e.g. next-token prediction or RLHF tuned for coherence and readability could steer models away from ExO language. If we want systems that embrace deliberate, meaningful rule-bending, we’ll need benchmarks that more actively reward it.  

## Why Might Current AI Struggle Here?
Current language models face several systematic barriers to producing ExO language; at this point many of these are my own thoughts or fan theory rather than concrete fact, but nevertheless here they are: 

**Data Scarcity in Pretraining**: Though profound literature exists in pretraining corpora (Google Books, etc.), it's statistically underrepresented. By definition, novel writing is rare, and easily-licensed conventional text dominates the training mix. Even within Pulitzer Prize winning articles/books etc the instances of truly profound prose/ExO language (as impactful as they may be) are few and far between. 

**Objective Mismatch**: From a causal language modeling perspective, next token prediction is less about encoding the abstract concepts or deep intentionality these examples are made up of and more so about emulation of style and prose. At this phase models learn to reproduce surface features without encoding the abstract concepts that necessarily drive literary innovation. Even though large causal models like GPT-3 begin to exhibit some few-shot behavior with sufficient examples, it seems unlikely that the causal training paradigm alone gets us the abstract associative power necessary for truly novel language.

**Task Absence During Fine-tuning**: When models are optimized for instruction following, there's likely an absence of tasks that push them to not just learn ExO behavior, but more importantly exhibit it. The training emphasizes practical capabilities over creative linguistic reasoning. Though literary analysis and reading comprehension are a big part of this phase they are somewhat distinct from the task of exhibiting and producing novel prose. In short, there are more analyses of great works than great works, and the reading comprehension/literary analysis task itself aligns more intuitively with how we quantify intelligence in school.

**RLHF Optimization Pressure**: This one is fun to think about. From a preference learning perspective, I doubt anyone wants to do full-blown Harold Bloom literary analysis to rate model outputs. Most annotators would favor accessible, Wikipedia-style entries over Joycean explorations of any topic. This optimization pressure likely eliminates whatever literary capabilities emerge during pretraining. There are also many studies that suggest RLHF can reduce a model's output diversity, which can be found in the key readings section further down.

Studies indicate RLHF improves generalization on benchmark tasks at the cost of reduced output diversity, suggesting a tradeoff between the two. The interesting case is what happens within the set of valid solutions. For tasks that admit many correct answers, does RLHF collapse probability mass onto a narrow set of conventional solutions? If so, this would work directly against fluid intelligence, which, following Chollet, should exhibit uniform probability across equally valid outputs while suppressing invalid ones. ExO language is precisely the kind of output that's valid but unconventional: high on the "correct but rare" end of the distribution, and thus vulnerable to being optimized away.

**The Deeper Issue: Fluid Literary Intelligence**: The more I examine instances of impactful prose packed with intentionality and metaphysical depth, the more convinced I am that modeling such language requires what could be called fluid literary intelligence. This goes beyond pattern matching toward adaptive generalization on out-of-distribution linguistic tasks. An ability to traverse distant conceptual pathways, pathways that have not surfaced during pretraining. This likely overlaps with the intuition that scaling up inference time compute improves reasoning models by allowing them to perform a more exhaustive grid search of the solution space. However, as far as I can tell this strategy mostly applies to verifiable tasks and thus creative analogical reasoning in a literary or ExO capacity may remain a blindspot. 

In short, ExO language appears to depend on advanced, or at least highly creative, analogical reasoning. Its defining feature is the construction of meaningful and unexpected connections between disparate, and often seemingly contradictory, concepts, connections that resist literal validation but nonetheless produce insight.

**Missing Benchmarks**: This leads to deeper questions: What constitutes literary novelty computationally? Why are there no benchmarks on par with ARC that touch this axis of intelligence? Current reasoning evaluation has heavily favored verifiable tasks (coding, math) over creative reasoning. 


## Key Readings

These papers and essays collectively help explore **extra‑ordinary (ExO) language**: RLHF studies detail how reward shaping affects diversity, Chollet’s work addresses fluid intelligence and efficient generalization, lingustic/philosophical perspectives on metaphor, analogy, and contradiction concepts central to creativity and nuanced language use.

**RLHF, Mode Collapse & Output Diversity**

* [Creativity Has Left the Chat: The Price of Debiasing Language Models](https://arxiv.org/abs/2406.05587) - *arXiv* (2024)
* [Understanding the Effects of RLHF on LLM Generalisation and Diversity](https://openreview.net/pdf?id=PXD3FAVHJT) - *ICLR / OpenReview* ⭐️
* [Mysteries of Mode Collapse](https://www.lesswrong.com/posts/t9svvNPNmFf5Qa3TA/mysteries-of-mode-collapse) - *LessWrong essay*

**Exo-Language, Analogical & Fluid Reasoning**

* [On the Measure of Intelligence](https://arxiv.org/abs/1911.01547) - *arXiv* (Chollet, 2019) ⭐️
* [Metaphor Understanding Challenge Dataset for LLMs](https://arxiv.org/abs/2403.11810) - *arXiv* (2024)

* [One fish, two fish, but not the whole sea: Alignment reduces language models’ conceptual diversity](https://aclanthology.org/2025.naacl-long.561.pdf) - *NAACL 2025* ⭐️
* [Towards Benchmarking LLM Diversity & Creativity](https://gwern.net/creative-benchmark) - *Gwern.net*

**Creative Language & Literary Ability in LLMs**

* [Evaluating Large Language Model Creativity from a Literary Perspective](https://arxiv.org/abs/2312.03746) - *arXiv* (2023)
* [Rethinking Literary Creativity in the Digital Age: Human vs. AI Playwriting](https://www.nature.com/articles/s41599-025-04999-2) — *Humanities & Social Sciences Communications (Nature)* ⭐️
* [Large language models show both individual and collective creativity comparable to humans](https://www.sciencedirect.com/science/article/pii/S1871187125001191) - *ScienceDirect*

**Sampling, Diversity & Generation Mechanics**

* [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751) - *arXiv* (Holtzman et al., 2019) ⭐️
  *(Introduces nucleus / top-p sampling)*

**Philosophy of Language & Logic**

* [Metaphor](https://plato.stanford.edu/entries/metaphor/) - *Stanford Encyclopedia of Philosophy*
* [Contradiction](https://plato.stanford.edu/entries/contradiction/) - *Stanford Encyclopedia of Philosophy*
* [Catachresis](https://en.wikipedia.org/wiki/Catachresis) - Wikipedia
* [Exformation](https://en.wikiversity.org/wiki/Information?utm_source=chatgpt.com) - Wikiversity

## Closing Thoughts

**Sociological Influence**: How do we account for the way social and historical contexts shape judgements of novelty and creativity and is it a moving target?   

Novelty and creativity are often historically and socially situated. A good deal of what constitutes creativity and novelty is dependent on the historical context in which artistic expressions are judged. Citizen Kane, for example, is often cited as one of the greatest films of all time due to its innovative cinematography and storytelling. However, the cinematic innovations that define this film, such as Toland's use of depth of field, is now a staple in most introductory film courses. Fashion often follows a similar arc, innovative and fresh designs that mark the runway one season saturate the shelves of fast-fashion retailers the next.

Though judgements about creativity and artistic merit are heavily influenced by the social and historical factors there is still a sense in which great works are able to stand the test of time. When evaluating creative intelligence, we must consider how social and historical contexts shape our aesthetic judgements and distinguish between those that are fleeting and those that endure.

Just because models can exhibit surprisal or violate semantic expectations doesn't always mean they possess the ability to do so meaningfully. Ultimately, the goal is to understand whether machines can develop the kind of flexible, creative intelligence that ExO language represents—and to build evaluation frameworks that recognize this intelligence when it emerges. In short, we need benchmarks that reward "wondrous strange snow."

---

[^1]: *Theseus sets up an open contradiction **hot** + **ice** only to “resolve” it with the sneering flourish “wondrous strange snow.”  
      The oxymoron stays physically impossible, but the new name lets the audience picture it for a moment as an imaginable marvel.  
      I think this imaginative license would still make it a Modal-Projection (MP).*



*Shout-out to my good friend Joshua for the stimulating convo and amazing **Midsummer** example. And shout-out to Henry too for the great convos on AGI/ARC and thoughts on diffusion-based and RL approaches. And last but not least shoutout to Noel for her core contributions on aesthetics and philosophical insights on creativity and intelligence*


<!-- [^2]: The table below shows loosely how the literary ExO examples behave across two interpretive models:

- **M<sub>phys</sub>**: Physical/literal interpretation (common sense, ordinary meaning)
- **M<sub>interp</sub>**: Creative interpretation (metaphor, allegory, figurative readings)

| Passage | Pattern | Formal Notation | Plain English |
|---------|---------|-----------------|---------------|
| *"Two distincts, division none"* | Modal Clash | M<sub>phys</sub> ⊨ Distinct(a,b) ∧ M<sub>interp</sub> ⊨ ¬Distinct(a,b) | Two bodies, one soul |
| *"Hearts remote, yet not asunder"* | Modal Clash | M<sub>phys</sub> ⊨ Remote(a,b) ∧ M<sub>interp</sub> ⊨ ¬Remote(a,b) | Spatially apart, spiritually united |
| *"Hot ice / wondrous strange snow"* | Modal Projection | M<sub>phys</sub> ⊨ ¬(Ice ∧ Hot) ∧ M<sub>interp</sub> ⊭ ¬(Ice ∧ Hot) | Physically impossible, imaginatively conceivable |
| *"A cage went in search of a bird"* | Type Clash | M<sub>phys</sub>: ¬Animate(cage) ∧ Search(cage, bird) ⇒ ⊥ | Cages can't search; metaphorically, oppression pursues freedom |
| *"I can't go on. I'll go on."* | Modal Clash | M<sub>phys</sub> ⊨ ¬Able(x, continue) ∧ M<sub>interp</sub> ⊨ Continue(x) | Logical contradiction; existential persistence despite impossibility | -->
