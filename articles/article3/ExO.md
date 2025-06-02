## 🎭 Extra-Ordinary Language

I've been thinking a lot about a chat I had with a former colleague about language that breaks semantic expectations.  
The conversation then veered into causal language models and their various generation parameters like temperature.  
What interests me in particular is unexpected or anomalous usage with clear intention where semantic violations in the form of absurdities or paradoxes are packed with metaphysical depth.

In this post, I'm dog-earing these thoughts to revisit later.  
The aim here is to examine the specific forms these expressions take and explore how we might capture their tension and their coherence in a computational framework.

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
They don't obscure meaning but instead elucidate by way of contradiction. Now the question is: **how to formalize them?**

| Passage | Logical sketch | English |
|---------|---------------|---------|
| *“Two distincts, division none”* | $\Box_{\,\mathrm{p}}\,\text{Distinct}(a,b) \;\land\; \Box_{\,\mathrm{m}}\,\lnot\text{Distinct}(a,b)$ | $\text{Bodies: two + Souls: one}$ |
| *“Hearts remote, yet not asunder”* | $\Box_{\,\mathrm{p}}\,\text{Remote}(a,b) \;\land\; \Box_{\,\mathrm{m}}\,\lnot\text{Remote}(a,b)$ | $\text{Spatially apart + Spiritually united}$ |
| *“Hot ice / wondrous strange snow”*[^1] | $\Box_{\,\mathrm{p}}\,\lnot(\text{Ice}\land\text{Hot}) \;\land\; \Diamond_{\,\mathrm{m}}\,(\text{Ice}\land\text{Hot})$ | $\text{Physically impossible → imaginatively possible}$ |
| *“A cage went in search of a bird”* | $\text{Search}(e,\text{cage},\text{bird}) \;\land\; \text{ReqAnim}(\text{cage}) \;\land\; \lnot\text{Animate}(\text{cage}) \;\vdash\; \bot$<br><br>$\text{allegory} \;\to\; \text{Search}(e,\text{oppression},\text{freedom})$ | $\text{Oppression pursues freedom}$ |


It seems like these literary devices can be described as any utterance whose **literal semantic model fails in the physical world yet remains interpretable (and often profound) once we flip modality, type, or world-knowledge layer.**

ExO($\varphi$) $\;\equiv\;$ MC($\varphi$) $\;\lor\;$ MP($\varphi$) $\;\lor\;$ TC($\varphi$)

where  

* **MC(ϕ)** $:= \Box_{\,\mathrm{p}}\,ϕ \;\land\; \Box_{\,\mathrm{m}}\,\lnot ϕ$ — *Modal Contradiction*  
* **MP(ϕ)** $:= \Box_{\,\mathrm{p}}\,\lnot ϕ \;\land\; \Diamond_{\,\mathrm{m}}\,ϕ$ — *Modal Projection*  
* **TC(ϕ)** $:= (\,ϕ \land \text{Presup}(ϕ)\,) \;\vdash\; \bot$ — *Type Clash*

$\Box$, $\Diamond$ — necessity / possibility  
$\Box_{\,\mathrm{p}}$, $\Diamond_{\,\mathrm{p}}$ — physical-world modality  
$\Box_{\,\mathrm{m}}$, $\Diamond_{\,\mathrm{m}}$ — metaphysical / allegorical modality


### Some Probabilistic Approaches

- [ActAdd](https://arxiv.org/pdf/2308.10248)  
- [Contrastive Activation Steering](https://arxiv.org/pdf/2312.06681)  
- [Classifier-based guidance for discrete diffusion](https://arxiv.org/pdf/2412.10193)  
- [TRACE](https://arxiv.org/pdf/2504.18535)  
- [Constrained Generation (Ctrl-G)](https://arxiv.org/pdf/2406.13892)  

### Open Problems

1. **Detection.** Can we learn a reliable anomaly-coherence metric from corpora annotated for ExO instances?  
2. **Evaluation.** What rubric separates these contradictions from plain nonsense and where is the cutoff?  
3. **Generation control.** Beyond temperature, how do we tune a model along an anomaly-coherence axis?  

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
