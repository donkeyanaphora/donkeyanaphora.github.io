## 🎭 Extra-Ordinary Language

I’ve been revisiting a conversation with a former colleague about language that deliberately flies in the face of ordinary usage e.g. expressions that violate the statistical expectations of language itself and yet still carry high degrees of intentionality and philosophical weight. Expressions like "A cage went in search of a bird" epitomizes this and when Kafka wrote this, he created something that contemporary AI rarely produces, a semantic impossibility that somehow makes perfect sense. 

<!-- I call this phenomenon **extra-ordinary language**. -->

In this post, I'm dog-earing these thoughts to revisit later. The aim here is to understand what makes these expressions work, and understand how they maintain coherence through contradiction or linguistic violation and more critically, why this matters for how we think about intelligence. Along the way, I'll attempt some preliminary formalizations and speculate about why current AI systems struggle with this capacity.

<!-- In this post, I'm dog-earing these thoughts to revisit later. The aim here is to examine these linguistic anomalies more closely and ask a question that's been nagging at me: if this type of expression represents a distinct form of intelligence, why don't we have any benchmarks for it? -->

### Literary Examples

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

### Pseudo-Formalizations

Because of their intentionality and depth I'm going to call these violations of “ordinary use” **extra-ordinary use** (a bit gimmicky).  
They don't obscure meaning but instead elucidate by way of contradiction or a violation of expectations. Now the question is can we formalize some of them and what does it say about what makes these instances special?

| Passage | Logical sketch | English |
|---------|---------------|---------|
| *“Two distincts, division none”* | $\Box_{\,\mathrm{p}}\,\text{Distinct}(a,b) \;\land\; \Box_{\,\mathrm{m}}\,\lnot\text{Distinct}(a,b)$ | $\text{Bodies: two + Souls: one}$ |
| *“Hearts remote, yet not asunder”* | $\Box_{\,\mathrm{p}}\,\text{Remote}(a,b) \;\land\; \Box_{\,\mathrm{m}}\,\lnot\text{Remote}(a,b)$ | $\text{Spatially apart + Spiritually united}$ |
| *“Hot ice / wondrous strange snow”*[^1] | $\Box_{\,\mathrm{p}}\,\lnot(\text{Ice}\land\text{Hot}) \;\land\; \Diamond_{\,\mathrm{m}}\,(\text{Ice}\land\text{Hot})$ | $\text{Physically impossible → imaginatively possible}$ |
| *“A cage went in search of a bird”* | $\text{Search}(e,\text{cage},\text{bird}) \;\land\; \text{ReqAnim}(\text{cage})$<br> $\;\land\; \lnot\text{Animate}(\text{cage}) \;\vdash\; \bot$<br><br>$\text{allegory} \;\to\; \text{Search}(e,\text{oppression},\text{freedom})$ | $\text{Oppression pursues freedom}$ |


It seems like these literary devices can be described as any utterance whose **literal semantic model fails in the physical world yet remains interpretable (and often profound) once we flip modality, type, or world-knowledge layer.**

ExO($\varphi$) $\;\equiv\;$ MC($\varphi$) $\;\lor\;$ MP($\varphi$) $\;\lor\;$ TC($\varphi$)

where  

* **MC(ϕ)** $:= \Box_{\,\mathrm{p}}\,ϕ \;\land\; \Box_{\,\mathrm{m}}\,\lnot ϕ$ — *Modal Contradiction*  
* **MP(ϕ)** $:= \Box_{\,\mathrm{p}}\,\lnot ϕ \;\land\; \Diamond_{\,\mathrm{m}}\,ϕ$ — *Modal Projection*  
* **TC(ϕ)** $:= (\,ϕ \land \text{Presup}(ϕ)\,) \;\vdash\; \bot$ — *Type Clash*

$\Box$, $\Diamond$ — necessity / possibility  
$\Box_{\,\mathrm{p}}$, $\Diamond_{\,\mathrm{p}}$ — physical-world modality  
$\Box_{\,\mathrm{m}}$, $\Diamond_{\,\mathrm{m}}$ — metaphysical / allegorical modality

### Why Might Current AI Struggle Here?
This is more of a fan theory at this point but it feels like examples of profound language may have surfaced in the models pretraining google books though by definition of novel writing it is likely under represented, additionally from a causal language model base training perspective this is less about encoding the abstract concepts or deep intentionality these examples are made up of and more so about emulation of style and prose at this point in the training. Sure larger models like GPT-3 especially with sufficient examples of this type of text may begin to exhibit some few shot behavior or ability to encode more abstract concepts about this sort of language, but overall I would be surprised if the casual base training paradigm gets us the level of reasoning and intelligence necessary to truly exhibit novel prose. 

As the models are further optimized on higher level tasks such as instruction following there is probably an absence of task types that push the model to learn this behavior and to be quite frankly from a later RLHF perspective I doubt anyone wants to do a full blown Harold bloom literary analysis of the models output to give a preference rating so I wouldnt be surprised if this step as well beats any sort of literary device capabilities out of the model. In short I dont think many people would favor a Joycean take on XYZ topic over an accessible and informative wikipedia style entry on the matter. Anyway this is all hearsay. 

The more I examine instances of impactful prose e.g. utterances packed with intentionality and metaphysical depth and try to formally capture their distinctive features, the more convinced I become that modeling such language necessitates a type of fluid literary intelligence. Ultimately, this exploration leads to deeper epistemic questions: what precisely constitutes literary novelty, and how can we recognize and evaluate it computationally, and lastly are there no benchmarks on par with ARC that touch on this axis of intelligence? 

Also, if we had 20 Harold blooms doing RLHF or composing benchmarks made up of curated instances of ExO language then I truly believe we could optimize models to exhibit this type of intelligence. And RL scales if we got from GPT3 to ChatGPT with 10,000 samples maybe we can just have a handful of Harold Bloom for models. Also could this not generalize to other creative tasks as well? AND historically I believe reasoning tasks/benchmarks have too heavily focused on verifiable tasks such as coding and mathematical reasoning. 

### Some Probabilistic Approaches

Here as some resources on controllable generation these could offer a good starting point in terms of guiding models to emulate instances or traces of extra-ordinary language they could even help showcase whether such latent reprentations even exist for the task in these models, but I think to truly address this task there will be a need to address deeper epistemic questions, questions about creativity, novelty, fluid intelligence, and in machine learning terms adaptive generalization to out of distribution tasks (hence the Francois Chollet paper). 

- [On the Measure of Intelligence](https://arxiv.org/abs/1911.01547)
- [ActAdd](https://arxiv.org/pdf/2308.10248)  
- [Contrastive Activation Steering](https://arxiv.org/pdf/2312.06681)  
- [Classifier-based guidance for discrete diffusion](https://arxiv.org/pdf/2412.10193)  
- [TRACE](https://arxiv.org/pdf/2504.18535)  
- [Constrained Generation (Ctrl-G)](https://arxiv.org/pdf/2406.13892)  


### Open Problems

1. **Refinement:** Can we formally bound the space of ExO language? Our current modal framework offers a logical sketch but most likely lacks sufficient coverage or the rigidity needed for identification, representation and evaluation. We need clearer boundaries: When does poetic contradiction become noise and what is the true scope of these instances of linguistic novelty. 

2. **Epistemic Requirements:** What cognitive capacities underlie ExO understanding and can models develop analogues of them and critically, will this require efforts that extend beyond emulation and pattern matching, toward fluid intelligence, e.g. adaptive generalization to out of distribution tasks. Additionally, what role does ExO language play in the broader arc of intelligence? Could it serve as a diagnostic for flexible reasoning or abstract linguistic intelligence?

3. **Evaluation:** Can we develop metrics that reward semantic dissonance under control e.g. language that violates expectations but remains interpretable and meaningful? Effective evaluation depends on a rigorous definition of ExO. Without clearly defined formal properties semantic, modal, etc we cannot design benchmarks that identify interpretive tension, modality shifts, or allegorical coherence as measurable features. 

4. **Generation Control:** How do we tune a model along an anomaly-coherence axis and in a more critical sense can we capture the generative faculty behind ExO language?


### Closing Thoughts

It's hard not to think of Wittgenstein's elucidation of private pain or propositions like  
“what can be said at all can be said clearly, and what we cannot talk about we must pass over in silence.”  
Hand-wavey metaphysical insights aside, maybe we can define these extra-ordinary utterances in purely distributional terms.  
The J. L. Austin brute-force approach: **want to understand a linguistic phenomenon? Read through countless examples and then formalize.**

Ultimately, the hope is to improve generation so we can guide it toward extra-ordinary usage, language that is *“wondrous strange snow.”*

---

[^1]: *Theseus sets up an open contradiction **hot** + **ice** only to “resolve” it with the sneering flourish “wondrous strange snow.”  
      The oxymoron stays physically impossible, but the new name lets the audience picture it for a moment as an imaginable marvel.  
      I think this imaginative license would still make it a Modal-Projection (MP).*

*Shout-out to my good friend Joshua for the stimulating convo and amazing **Midsummer** example. And shout-out to Henry too for the great convos and thoughts on diffusion-based approaches.*
