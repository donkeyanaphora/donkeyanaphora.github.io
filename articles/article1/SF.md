---
title: "Shallow Fusion: Bridging Data Scarcity and AI Integration Challenges"
description: "A minor rant about 'AI adoption' and exploration of shallow fusion as a method to address data scarcity and integration in specialized domains"
slug: "article1"
date: "2025-04-16"
draft: true
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# 🔗 Shallow Fusion: Bridging Data Scarcity and AI Integration Challenges 

**COLLINS WESTNEDGE**  
*APRIL 16, 2025*

## Introduction
AI adoption and integration have become focal points in seemingly every earnings call, linkedin post, townhall and industry keynote. However, most of these conversations exist to highlight revenue potential, promote products and services, or bolster positive consumer sentiment, which is likely why they tend to gloss over or abstract away the technical challenges that stand in the way of effective adoption. One of the fundamental challenges is the gap between available data and the data needed for a domain-specific task. 

Consider for example applying a large generalist model to a highly specialized task that barely surfaces in its pretraining data if at all. For the generalist model to succeed, it must first grasp dense company prospectuses, specialized jargon, and the nuances of the business problem itself. To address this gap companies often resort to standard recipes e.g. "exciting" the right activations through few-shot examples, dumping streams of internal documents into the model's context, or ambitious attempts at fine-tuning on small internal datasets. However, with these approaches there's often no optimization signal or gradient to move against and progress if there's any to be had involves a good deal of guesswork, trial, and error. 

**Automatic Speech Recongition (ASR)** exemplifies this challenge. Many domains, such as medicine, law, financial services, etc contain specialized terminology that is typically outside the distribution or under-represented in the pretraining for general purpose models. A model trained on everyday speech will struggle with phrases like "othostatic tachycardia" or domain specific acronyms. Traditional solutions to this issue involve collecting domain-specific audio and ground truth transcriptions (often hand labeled) which can be cost prohibitive. Open source datasets on specialized domains are becoming more common but their volume and variety remain too limited, keeping them out-of-distribution for many business use cases.

<!-- this would be a good place to talk about the existing community and how others have done shallow fusion as a way to address this problem (not just me) -->

This distribution gap motivated me to explore the concept of **shallow fusion**: combining general-purpose ASR model with domain-specific language models during inference. Rather than requiring extensive retraining, shallow fusion leverages existing domain expertise during inference from an external language model. The questions I would like to explore in this article are: Can a language model trained on domain-specific text meaningfully improve speech-to-text transcription accuracy within an adjacent domain? And critically, what are the failure modes associated with this type of integration?

## Background & Existing Approaches
This section is about discussing how the community has used ASR to overcome domain mismatch in ASR

- Discuss problems current research has addressed
- Discuss types of fusion, cold, deep, shallow
- Discuss methodologies high level

## Shallow Fusion Explained

But first, what is shallow fusion? Consider for example, a person listening to audio of a phone call with a customer and customer service agent at an insurance claims calls center. The sole function of this person is to transcribe what they hear into text. The caveat, however, is that they only know very little about the domain and the types of technical issues and medical terminology e.g. (procedures diagnoses etc) that representatives and customers are mentioning. Now consider a second person who has worked in this industry for many years and has a deep understanding of the domain, but is hard of hearing. 

Shallow fusion can be thought of as a process of integrating each person's expertise to offset the errors of one another and bridge modalities the other does not have access to. With this analogy we can now formally describe this process. In the example below think of $P_{\text{ASR}}$ as the person listening to the audio and $P_{\text{LM}}$ as the domain expert that is hard of hearing but deeply understands the context. 

### Mathematical Formulation

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

The idea is that the ASR model understands phonetics and language in a general sense while the LM model understands the specialized domain in its written form, but has no access to the audio signal. Just like in the analogy from earlier by fusing their predictions, we combine phonetic understanding with domain expertise, leading to more accurate transcriptions for domain specific terms. Without careful integration or synergy between the two, both models can carry major limitations.

#### Process Diagram:
![diagram](assets/viz.png)
Reference: [Kannan et al. 2017](https://arxiv.org/pdf/1712.01996)

Consider an example where Whisper serves as our listening expert and GTP2 as our domain-language expert. In practice these models share a tokenizer making the process of integrating their predictions fairly seamless at least for the english version of Whisper ([Radford 2.2](https://arxiv.org/pdf/2212.04356)). Now let's consider a claims call center transcript where an ASR model misinterprets a specialized medical term. 

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
\log P_{\mathrm{combined}}\bigl(y_t\bigr)
  = \log P_{\mathrm{Whisper}}\bigl(y_t \mid x,\, y_{<t}\bigr)
  + \lambda\,\log P_{\mathrm{GPT2}}\bigl(y_t \mid y_{<t}\bigr)
$$

| Next Token   | Whisper Score | GPT-2 Score | Combined Score (λ = 0.2)|
|--------------|--------------|-------------|----------------|
| **melanoma** | **–1.8**     | **–0.3**    | **–1.8 + 0.2 $\times$ (–0.3) = –1.86** |
| diploma      | –1.0         | –5.0        | –1.0 + 0.2 $\times$ (–5.0) = –2.0 |
| aroma        | –3.5         | –3.8        | –3.5 + 0.2 $\times$ (–3.8) = –4.26 |

> *Note: The numbers are illustrative. In practice additional context and scaling would favor the correct token "melanoma"; additionally, rare words are likely split into multiple tokens but the intuition remains the same.*

"melanoma" now has the highest combined score.

**Final Corrected Output:**  
"The procedure was medically necessary for the treatment of claimant's `melanoma`."✔️

This demonstrates how **domain-aware shallow fusion** can significantly improve ASR output in specialized contexts.

## Our Methodology
- Fusing GPT2 and Whisper 
- Train GPT2 on PubMed (keep Whisper Tokenizer)
- Build Fusion Pipeline
- Evaluation Framework

## Findings

- WER increases explained by:
  - early terminations, 
  - stylistic domain mismatches (punctuation abbreviations centimeters -> cmm)
- Decreases WER on medical terminology
- Discuss gating mechanism/dynamic lambda and various generation params 

## Reflection and Future Directions
- Learnable or dynamic $\lambda$ 
- MoE  
- Cold Fusion  
- Deep Fusion  

## Conclusion
- articulate each model's strength and weakness, emphasizing how each model hits its own data wall separately:  
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