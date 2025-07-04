---
title: "AI Integration Beyond the Buzz: A Technical Exploration through Shallow Fusion"
author: "Collins Westnedge"
date: "2025-04-16"
description: "A minor rant about 'AI adoption' and exploration of shallow fusion as a method to address data scarcity and integration in specialized domains."
slug: "article1"
---

# AI Integration Beyond the Buzz: A Technical Exploration through Shallow Fusion  

**COLLINS WESTNEDGE**  
*APRIL 16, 2025*

## Introduction
AI adoption and integration have become focal points in seemingly every earnings call, linkedin post, townhall and industry keynote. However, most of these conversations exist to highlight revenue potential, promote products and services, or bolster positive consumer sentiment, which is likely why they tend to gloss over or abstract away the technical challenges that stand in the way of effective adoption. One of the fundamental challenges is the gap between available data and the data needed for a domain-specific task. 

Consider for example applying a large generalist model to a highly specialized task that barely surfaces in its pretraining data if at all. For the generalist model to succeed, it must first grasp dense company prospectuses, specialized jargon, and the nuances of the business problem itself. To address this gap companies often resort to standard recipes e.g. “exciting” the right activations through few-shot examples, dumping streams of internal documents into the model's context, or ambitious attempts at fine-tuning on small internal datasets. However, with these approaches there’s often no optimization signal or gradient to move against and progress if there's any to be had involves a good deal of guesswork, trial, and error. 

**Automatic Speech Recongition (ASR)** exemplifies this challenge. Many domains, such as medicine, law, financial services, etc contain specialized terminology that is typically outside the distribution or under-represented in the pretraining for general purpose models. A model trained on everyday speech will struggle with phrases like "othostatic tachycardia" or domain specific acronyms. Traditional solutions to this issue involve collecting domain-specific audio and ground truth transcriptions (often hand labeled) which can be cost prohibitive. Open source datasets on specialized domains are becoming more common but their volume and variety remain too limited, keeping them out-of-distribution for many business use cases.

This distribution gap motivated me to explore the concept of **shallow fusion**: combining general-purpose ASR model with domain-specific language models during inference. Rather than requiring extensive retraining, shallow fusion leverages existing domain expertise during inference from an external language model. The questions I would like to explore in this article are: Can a language model trained on domain-specific text meaningfully improve speech-to-text transcription accuracy within an adjacent domain? And critically, what are the failure modes associated with this type of integration?

<!-- In contrast to the popular narrative, my day-to-day experience has shown me that these discussions routinely overlook the many technical challenges mentioned above. As someone stuck in the generalist specialist divide, it's hard not to feel frustration when leaders boast an AI integration victory that is nothing more than an API call. This disconnect motivated me to develop a case study leveraging **shallow fusion** in order to mitigate data-distribution shifts and the shortage of structured training data in Automatic Speech Recognition (ASR). In this write-up, I introduce shallow fusion and ask: Can a language model trained on a domain-specific corpus meaningfully improve speech-to-text transcription within that domain and to what extent can the text be detached? -->


## A Formal Example: Shallow Fusion

But first, what is shallow fusion? Consider for example, a person listening to audio of a phone call with a customer and customer service agent at an insurance claims calls center. The sole function of this person is to transcribe what they hear into text. The caveat, however, is that they only know very little about the domain and the types of technical issues and medical terminology e.g. (procedures diagnoses etc) that representatives and customers are mentioning. Now consider a second person who has worked in this industry for many years and has a deep understanding of the domain, but is hard of hearing. 

Shallow fusion can be thought of as a process of integrating each person's expertise to offset the errors of one another and bridge modalities the other does not have access to. With this analogy we can now formally describe this process. In the example below think of $P_{\text{ASR}}$ as the person listening to the audio and $P_{\text{LM}}$ as the domain expert that is hard of hearing but deeply understands the context. 

#### Mathematical Formulation

At each decoding step for some audio input, we select the most probable token $y_{t}$ using information from the Automatic Speech Recognition model (ASR) and the Language Model (LM)

$$
y^* = \arg\max_{y_t}\;
\left[
\log P_{\text{ASR}}\!\bigl(y_t \mid x,\, y_{\lt t}\bigr)
\;+\;
\lambda\,\log P_{\text{LM}}\!\bigl(y_t \mid y_{\lt t}\bigr)
\right]
$$

where:  
- $t$ is the decoding step (0-based).  
- $y_t$ is the chosen token at step $t$ and $y_{\lt  t}$ are previously generated tokens.  
- $x$ represents the acoustic features (e.g. raw audio input).  
- $P_{\text{ASR}}$ depends on both $x$ and $y_{\lt  t}$, while $P_{\text{LM}}$ depends on $y_{\lt  t}$ only.  
- $\lambda$ is the weighting factor to determine the language model's influence.

The idea is that the ASR model understands phonetics and language in a general sense while the LM model understands the specialized domain in its written form, but has no access to the audio signal. Just like in the analogy from earlier by fusing their predictions, we combine phonetic understand with domain expertise, leading to more accurate transcriptions for our domain. Without careful integration or synergy between the two, both models carry major limitations.

#### Process Diagram:
![diagram](assets/viz.png)
Reference: [Kannan et al. 2017](https://arxiv.org/pdf/1712.01996)

#### In Practice
In the workflow that I dive into, token prediction is implemented in stages. Early on we rely solely on the ASR (the listening expert) model and then gradually introduce the language model (the domaine xpert) as more context becomes available. For example:

**Token Selection at Step \(t\)**

$$
\mathbf{F}(x,t)=
\begin{cases}
\displaystyle
\operatorname*{arg\,max}\limits_{y_t}\;
      \log P_{\text{ASR}}\!\left(y_t \mid x,\; y_{<t}\right),
      & t < \text{n-steps},\\[0.75em]
\displaystyle
\operatorname*{arg\,max}\limits_{y_t}\;
      \Bigl[
        \log P_{\text{ASR}}\!\left(y_t \mid x,\; y_{<t}\right)
        + \lambda\,\log P_{\text{LM}}\!\left(y_t \mid y_{<t}\right)
      \Bigr],
      & t \ge \text{n-steps}.
\end{cases}
$$

This piecewise approach allows the system to build confidence from the raw audio transcription initially before incorporating the domain expert corrections, namely because our starting point should be conditionalized on something observed e.g. we gotta start somewhere. 

## Case Study in Transcription: A Concrete Example
For our models let's take Whisper to be our listening expert and GTP2 to be our domain-language expert. In practice these models share a tokenizer making the process of integrating their predictions fairly seamless at least for the english version of Whisper ([Radford 2.2](https://arxiv.org/pdf/2212.04356)). Now let's consider a claims call center transcript where an ASR model misinterprets a specialized medical term. 

**Input Audio (Ground Truth):**  
"The procedure was medically necessary for the treatment of claimant's `melanoma`."✔️

**Whisper Initial Output:**  
"The procedure was medically necessary for the treatment of claimant's `diploma`."🚫

#### 1. **Whisper Initial Decoding:**

Whisper produces logits at each step:

- Token: "The" → high confidence  
- Token: "procedure" → high confidence  
- Token: "claimant" → high confidence  
- Token: "'s" → high confidence  
- At the final subword, Whisper may exhibit uncertainty, spreading probabilities across candidates: "diploma", "aroma", "melanoma"


#### 2. **Domain GPT-2 Predictions:**  
At this ambiguous decoding step, GPT-2 (the domain-adapted LM) produces logits based on the following context:

- "The procedure was medically necessary for the treatment of claimant's `_____`"

- GPT-2 which as been fine tuned on medical literature strongly favors the correct token (produces log probabilities closer to 0 for melanoma) while Whisper, which had minimal access to medical terminology, assigns it a much lower likelihood (log probabilities that are more negative).

| Next Token   | Whisper Log Probs | GPT-2 Log Probs |
|--------------|------------------|-----------------|
| **melanoma** | **–1.8**         | **–0.3**        |
| diploma      | –1.0             | –5.0            |
| aroma        | –3.5             | –3.8            |

#### 3. **Shallow Fusion (Combining Logits):**  
We combine each model's logits using a weighted sum in the following way:

$$
\log P_{\text{combined}}(y_t)=
\log P_{\text{Whisper}}\!\bigl(y_t \mid x,\, y_{\lt t}\bigr)
+\lambda\,\log P_{\text{GPT2}}\!\bigl(y_t \mid y_{\lt t}\bigr)
$$

| Next Token   | Whisper Score | GPT-2 Score | Combined Score (λ = 0.2)|
|--------------|--------------|-------------|----------------|
| **melanoma** | **–1.8**     | **–0.3**    | **–1.8 + 0.2 $\times$ (–0.3) = –1.86** |
| diploma      | –1.0         | –5.0        | –1.0 + 0.2 $\times$ (–5.0) = –2.0 |
| aroma        | –3.5         | –3.8        | –3.5 + 0.2 $\times$ (–3.8) = –4.26 |


> *Note: The numbers are illustrative. In practice additional context and scaling would favor the correct token "melanoma"; additionally, rare words are likely split into multiple tokens but the intuition remains the same.*

"melanoma" now has the highest combined score.

#### **Final Corrected Output:**  
"The procedure was medically necessary for the treatment of claimant's `melanoma`."✔️

#### Key Takeaway:

- **Without GPT-2:** The model misrecognized domain-specific terms.  
- **With shallow fusion:** The external domain LM (GPT-2) provided strong guidance toward the correct domain-specific vocabulary, correcting Whisper’s initial mistakes.

This demonstrates how **domain-aware shallow fusion** can significantly improve ASR output in specialized contexts.

## Overcoming the Data Wall
In the example above we demonstrated how the integration looks in practice, but we also assumed the language model (GPT-2) in our case has already been adapted to the appropriate domain. In practice we can fairly assume that out-of-the-box ASR models perform poorly on …

## Reflection and Future Directions
- learnable or dynamic $\lambda$  
- MoE  
- Cold Fusion  
- Deep Fusion  

## Conclusion
- articulate each model’s strength and weakness, emphasizing how each model hits its own data wall separately:  
  - Whisper (generalist): broadly trained acoustic-to-text model, struggles with specialized terminology.  
  - GPT-2 (specialist): trained in a self-supervised way solely on textual domain data, rich in domain-specific vocabulary but blind to acoustic signals.  
- dive into fusion related setbacks/metrics as well as possible future directions
- dive into fusion related improvements and qualitative benefits
- illustrate how this process extends or relates to broader trends within AI e.g. Ensemble Architectures like Mixture of Experts, multimodal integration, domain adaptation and evolution of fusion techniques (cold & deep).  

## Resources

* [Deep Shallow Fusion for RNN-T Personalization](https://research.facebook.com/file/551805355910423/Deep-Shallow-Fusion-for-RNN-T-Personalization.pdf)  
* [Analysis of Incorporating an External Language Model…](https://arxiv.org/pdf/1712.01996)  
* [Robust Speech Recognition via Large-Scale Weak Supervision](https://arxiv.org/pdf/2212.04356)  
* [On Using Monolingual Corpora in Neural Machine Translation](https://arxiv.org/pdf/1503.03535)  
* [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)  
* [Language Models are Few-Shot Learners](https://arxiv.org/pdf/2005.14165)  
