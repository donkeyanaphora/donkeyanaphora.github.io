---
title: "Extra-Ordinary Language"
description: "An exploration of literary and creative intelligence and things I wish language models did better."
slug: "article3"
date: "2025-07-02"
draft: true
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# 🎭 Extra-Ordinary Language 

**COLLINS WESTNEDGE**  
*JULY 2, 2025*

## Introduction

I've been thinking about a conversation I had with a former colleague about language that defies ordinary usage. More specifically expressions that violate the [distributional hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics) of language and yet cary high degrees of intentionality and depth. 

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

> Merry and tragical! Tedious and brief!  
> That is, hot ice and wondrous strange snow.  
> How shall we find the concord of this discord?  
>   
> — *Shakespeare, **A Midsummer Night’s Dream***


## Pseudo Formalizations

Literary language often achieves its most profound effects through deliberate violations of ordinary usage. These violations don't obscure meaning—they illuminate through contradiction and violated expectations. I call this phenomenon **extra-ordinary use**.

To explore how these linguistic violations work, I'll borrow notation from formal logic as a thinking tool. This isn't meant as rigorous formalization, but rather as a way to highlight patterns in creative language use.

### Two Models of Interpretation

Consider how statements behave across two interpretive models:

- **M<sub>phys</sub>**: Physical/literal interpretation (common sense, ordinary meaning)
- **M<sub>interp</sub>**: Creative interpretation (metaphor, allegory, imagination)

The tension between these models reveals what makes certain utterances feel "extra-ordinary."

### Examples and Analysis

| Passage | Formal Notation | Plain English |
|---------|----------------|---------------|
| *"Two distincts, division none"* | M<sub>phys</sub> ⊨ Distinct(a,b) **and**<br>M<sub>interp</sub> ⊨ ¬Distinct(a,b) | Two bodies, one soul |
| *"Hearts remote, yet not asunder"* | M<sub>phys</sub> ⊨ Remote(a,b) **and**<br>M<sub>interp</sub> ⊨ ¬Remote(a,b) | Spatially apart, spiritually united |
| *"Hot ice / wondrous strange snow"*¹ | M<sub>phys</sub> ⊨ ¬(Ice ∧ Hot) **and**<br>M<sub>interp</sub> ⊨ (Ice ∧ Hot) | Physically impossible → imaginatively vivid |
| *“A cage went in search of a bird”* | M<sub>phys</sub> ⊨ ¬Animate(cage) ∧ Search(e, cage, bird) ⇒ ⊥<br><br>M<sub>interp</sub> ⊨ Search(e, oppression, freedom) | An inanimate **cage** can’t be a seeker (type clash); metaphorically, oppression pursues freedom. |




### Core Characteristics
These literary examples share a unifying feature: they present a **literal semantic failure in one domain that creates insightful or profound resonance in another domain (metaphorical, allegorical, or abstract)**. We can identify three rough patterns in how extra-ordinary language creates its effects:

$$
\text{ExO}(\varphi) \equiv \text{MC}(\varphi) \lor \text{MP}(\varphi) \lor \text{TC}(\varphi)
$$

Where:
<br><br>

| Pattern | Formal Sketch | Intuition |
|---------|--------------|-----------|
| Modal Clash **(MC)** | M<sub>phys</sub> ⊨ ¬φ **and** M<sub>interp</sub> ⊨ φ | Statement fails in physical model but holds in interpretive model |
| Modal Projection **(MP)** | M<sub>phys</sub> ⊭ φ **but** M<sub>interp</sub> renders φ conceivable | Physical world disallows φ; imagination projects consistent scenario |
| Type Clash **(TC)** | φ forces type contradiction in M<sub>phys</sub> | Category mismatch (e.g., animate actions for inanimate objects) resolved through reinterpretation |

### Implications

Extra-ordinary language achieves its power through strategic semantic failure—statements that break in one domain to create meaning in another. This framework helps us understand:

1. Why certain literary expressions feel profound despite (or because of) their logical impossibility
2. How creative language exploits the gap between literal and interpretive models
3. What distinguishes truly innovative language from mere semantic errors

### Scope and Purpose

This framework is exploratory, not definitive. It's not meant to reduce literary creativity to logical formulas, but rather to:

- Illuminate patterns in creative language use
- Provide tools for thinking about linguistic innovation
- Probe why current AI models, despite their fluency, rarely generate such profound violations spontaneously

Understanding these patterns may help us develop better evaluation methods that emphasize the creative dimension of linguistic intelligence methods that recognize not just grammatical correctness or semantic coherence, but the deliberate, meaningful violation of ordinary use that characterizes compelling literary expressions.


## Why Might Current AI Struggle Here?
Current language models face several systematic barriers to producing ExO language; at this point many of these are my own speculation or fan theory than concrete fact, but nevertheless here they are: 

**Data Scarcity in Pretraining**: Though profound literature exists in pretraining corpora (Google Books, etc.), it's statistically underrepresented. By definition, novel writing is rare, and easily-licensed conventional text dominates the training mix. Even within Pulitzer Prize winning articles/books etc the instances of truly profound prose/ExO language (as impactful as they may be) are few and far between. 

**Objective Mismatch**: From a causal language modeling perspective, next token prediction is less about encoding the abstract concepts or deep intentionality these examples are made up of and more so about emulation of style and prose. At this phase models learn to reproduce surface features without encoding the abstract concepts that necessarily drive literary innovation. Even though large causal models like GPT-3 begin to exhibit some few-shot behavior with sufficient examples, it seems unlikely that the causal training paradigm alone gets us the reasoning necessary for truly novel language.

**Task Absence During Fine-tuning**: When models are optimized for instruction following, there's likely an absence of tasks that push them to not just learn ExO behavior, but more importantly exhibit it. The training emphasizes practical capabilities over creative linguistic reasoning. Though literary analysis and reading comprehension are a big part of this phase they are somewhat distinct from the task of exhibiting and producing novel prose. In short, there are more analyses of great works than great works, and the reading comprehension/literary analysis task itself aligns more intuitively with how we quantify intelligence in school.

**RLHF Optimization Pressure**: This one is fun to think about. From a preference learning perspective, I doubt anyone wants to do full-blown Harold Bloom literary analysis to rate model outputs. Most annotators would favor accessible, Wikipedia-style entries over Joycean explorations of any topic. This optimization pressure likely eliminates whatever literary capabilities emerge during pretraining.

**The Deeper Issue: Fluid Literary Intelligence**: The more I examine instances of impactful prose packed with intentionality and metaphysical depth, the more convinced I am that modeling such language requires what I'd call fluid literary intelligence. This goes beyond pattern matching toward adaptive generalization on out-of-distribution linguistic tasks.

**Missing Benchmarks**: This leads to deeper questions: What constitutes literary novelty computationally? Why are there no benchmarks on par with ARC that touch this axis of intelligence? Current reasoning evaluation has heavily favored verifiable tasks (coding, math) over creative reasoning. 

**There is Hope**: Even if this does require some deeper literary understanding, if we had 20 Harold Blooms doing RLHF or composing benchmarks of curated ExO instances, I believe we could optimize models toward this intelligence. Reinforcement learning scales. If we went from GPT-3 to ChatGPT with thousands of samples, maybe we need just a handful of literary experts. Additionaly, this approach could even generalize to other creative domains.


<!-- This is more of a fan theory at this point but it feels like examples of profound language may have surfaced in the models pretraining google books though by definition of novel writing it is likely under represented, additionally from a causal language model base training perspective this is less about encoding the abstract concepts or deep intentionality these examples are made up of and more so about emulation of style and prose at this point in the training. Sure larger models like GPT-3 especially with sufficient examples of this type of text may begin to exhibit some few shot behavior or ability to encode more abstract concepts about this sort of language, but overall I would be surprised if the casual base training paradigm gets us the level of reasoning and intelligence necessary to truly exhibit novel prose. 

As the models are further optimized on higher level tasks such as instruction following there is probably an absence of task types that push the model to learn this behavior and to be quite frankly from a later RLHF perspective I doubt anyone wants to do a full blown Harold bloom literary analysis of the models output to give a preference rating so I wouldnt be surprised if this step as well beats any sort of literary device capabilities out of the model. In short I dont think many people would favor a Joycean take on XYZ topic over an accessible and informative wikipedia style entry on the matter. Anyway this is all hearsay. 

The more I examine instances of impactful prose e.g. utterances packed with intentionality and metaphysical depth and try to formally capture their distinctive features, the more convinced I become that modeling such language necessitates a type of fluid literary intelligence. Ultimately, this exploration leads to deeper epistemic questions: what precisely constitutes literary novelty, and how can we recognize and evaluate it computationally, and lastly are there no benchmarks on par with ARC that touch on this axis of intelligence? 

Also, if we had 20 Harold blooms doing RLHF or composing benchmarks made up of curated instances of ExO language then I truly believe we could optimize models to exhibit this type of intelligence. And RL scales if we got from GPT3 to ChatGPT with 10,000 samples maybe we can just have a handful of Harold Bloom for models. Also could this not generalize to other creative tasks as well? AND historically I believe reasoning tasks/benchmarks have too heavily focused on verifiable tasks such as coding and mathematical reasoning.  -->

## Some Probabilistic Approaches

Here as some resources on controllable generation. These could offer a good starting point in terms of guiding models to emulate instances or traces of extra-ordinary language they could even help showcase whether such latent reprentations even exist within the model. However, I think to truly address the difficulty of producing ExO language there will be a need to address deeper epistemic questions, questions about creativity, novelty, fluid intelligence, and in machine learning terms adaptive generalization to out-of-distribution tasks (hence the Francois Chollet paper). 

- [On the Measure of Intelligence](https://arxiv.org/abs/1911.01547)
- [ActAdd](https://arxiv.org/pdf/2308.10248)  
- [Contrastive Activation Steering](https://arxiv.org/pdf/2312.06681)  
- [Classifier-based guidance for discrete diffusion](https://arxiv.org/pdf/2412.10193)  
- [TRACE](https://arxiv.org/pdf/2504.18535)  
- [Constrained Generation (Ctrl-G)](https://arxiv.org/pdf/2406.13892)  


## Open Problems

**Empirical Approach**: Can we just crank up the temperature and RLHF against literary critics? Is the solution as simple as generating more varied outputs and having 20 Harold Blooms rank them? Or does this require deeper architectural changes?

**Rules vs. Intuition**: Do models need to deeply formalize the rules of language to meaningfully break them? Or can expert preference data teach the patterns directly without explicit rule-learning? This gets at whether ExO generation is about systematic reasoning or learned aesthetic judgment.

**Sample Efficiency**: How many expert annotations would we actually need? If RLHF worked with 10K of samples for ChatGPT, maybe we only need hundreds of expert literary judgments to see significant improvement in creative output.

**A broken clock is right twice a day**: Is there a meaningful difference between "turning up randomness and filtering with experts" versus "genuine creative intelligence"? Could high-temperature generation coupled with expert filtering approximate the cognitive processes behind ExO language?

**Expert Agreement:** This one is common in business problems. Would literary critics even agree on what constitutes good ExO language? The subjectivity of literary judgment might make this approach messier than mathematical reasoning tasks. 

<!-- discuss francios chollets reliability rating as condition for measuring xyz -->

**Socialogical Influence**: How do we account for the way social and historical contexts shape judgments of novelty and creativity and is it a moving target?   

Novelty and creativity are often historically and socially situated. A good deal of what constitutes creatvity and novelty is dependent on the historical context in which artistic expressions are judged. Citizen Kane, for example, is often cited as one of the greatest films of all time due to its innovative cinematography and storytelling. However, the cinematic innovations that define this film, such as Toland's use of depth of field, is now a staple in most introductory film courses. Fashion often follows a similar arc, innovative and fresh designs that mark the runway one season saturate the shelves of fast-fashion retailers the next.

Though judgements about creativity and artistic merit are heavily influenced by the social and historical factors there is still a sense in which great works are able to stand the test of time. When evaluating creative intelligence, we must consider how social and historical contexts shape our aesthetic judgments and distinguish between those that are fleeting and those that endure.


**Generalization Limits**: If we optimize models toward specific critic preferences, do we get genuine creative capability or just better mimicry of those critics' tastes? I think of Wittgensteins example of mimicry and rule following. A pupil is learning a geometric series: The pupil has been tested on examples of counting by +2 up to 1000. The pupil is then asked to continue the task on numbers above 1000 and then writes 1000, 1004, 1008, 1012. The pupil claims they have been following the rule all along: “Up to 1000 I add 2; from 1000 onward I add 4.” Every step the pupil took in training was perfectly compatible with this alternative rule. Most intelligence tasks are about fluid and adaptive generalization.

<!-- "measuring skill at any given task falls short of measuring intelligence, because skill is heavily modulated by prior knowledge and experience" -->

<!-- As Wittgenstein states in PI "Must I understand an order before I can act on it? - Certainly, otherwise you wouldn't know what you had to do! - But from knowing to doing is surely a further step!" -->

<!-- 
A pupil is learning a geometric series the pupil has been tested on examples up to 1000 then they get the pupil to continue the series (+2) he writes 1000, 1004, 1008, 1012. The pupil claims he has been following the rule all along: “Up to 1000 I add 2; from 1000 onward I add 4.” Every step he took in training was perfectly compatible with this alternative rule. I think this relates to a deeper question posed by arc dataset and apple paper  -->


## Closing Thoughts

Just because anyone can write poetry doesn't mean they should. Similarly, just because models can exhibit surprisal or violate semantic expectations doesn't always mean they possess the ability to do so meaningfully. Ultimately, the goal is to understand whether machines can develop the kind of flexible, creative intelligence that ExO language represents—and to build evaluation frameworks that recognize this intelligence when it emerges. In short, we need benchmarks that reward "wondrous strange snow."

<!-- 
Ultimately, the hope is to improve generation so we can guide it toward extra-ordinary usage, language that is *“wondrous strange snow.”* -->

---

[^1]: *Theseus sets up an open contradiction **hot** + **ice** only to “resolve” it with the sneering flourish “wondrous strange snow.”  
      The oxymoron stays physically impossible, but the new name lets the audience picture it for a moment as an imaginable marvel.  
      I think this imaginative license would still make it a Modal-Projection (MP).*

*Shout-out to my good friend Joshua for the stimulating convo and amazing **Midsummer** example. And shout-out to Henry too for the great convos on AGI/ARC and thoughts on diffusion-based and RL approaches. And last but not least shoutout to Noel for her core contributions on aesthetics and philosophical insights on creativity and intelligence*
