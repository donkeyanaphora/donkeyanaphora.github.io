---
title: "Closed-Form Logit Steering"
description: "Minimal derivation: the smallest change to x so a sigmoid model outputs a chosen probability p."
slug: "logit-steering"
date: "2025-05-16"
draft: true
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# Closed-Form Logit Steering

**COLLINS WESTNEDGE**  
*OCT 8, 2025*

---

## Problem

For a binary classifier with a sigmoid activation, show the relationship between input $x$ and an augmented input $x'$ that achieves a desired probability $p$, and derive a closed-form solution.

---

## Identities & Intuition

### Model components
- **Sigmoid:** $\sigma(z)=\dfrac{1}{1+e^{-z}}$  
  score $\to$ probability (e.g., $z=0 \Rightarrow p=0.5$)

- **Score:** $z=w^\top x + b$  
  linear combination of features plus bias term

- **Logit (log-odds):** $\operatorname{logit}(p)=\ln\!\left(\dfrac{p}{1-p}\right)$  
  probability $\to$ linear score (inverse of $\sigma$)

### Geometry
- $H=\{\,x\in\mathbb{R}^n:\; w^\top x + b = 0\,\}$ — decision boundary ($p=0.5$)  
- $w \perp H$ — $w$ is normal to $H$

### Goal
Move $x$ along $w$ by some $\lambda$:
$$
x' = x + \lambda w
$$
with
$$
\operatorname{logit}(p) = w^\top x' + b.
$$

---

## Derivation

1. **Plug in $x'$ (use $w^\top w=\|w\|^2$):**
$$
\begin{aligned}
\operatorname{logit}(p)
&= w^\top(x+\lambda w)+b \\
&= w^\top x + \lambda\, w^\top w + b \\
&= w^\top x + \lambda\|w\|^{2} + b.
\end{aligned}
$$

2. **Solve for $\lambda$:**
$$
\lambda
= \frac{\operatorname{logit}(p) - (w^\top x + b)}{\|w\|^{2}}.
$$

3. **Substitute $\lambda$ into $x' = x + \lambda w$:**
$$
x' = x + \frac{\operatorname{logit}(p) - (w^\top x + b)}{\|w\|^{2}}\,w.
$$

---

## Final Formula

$$
\boxed{
x' = x + \frac{\operatorname{logit}(p) - (w^\top x + b)}{\|w\|^{2}}\,w
}
$$

*Where $x' = x + \lambda w$ achieves the target probability $p$.*

---

## Applications

- counterfactual creation ?  
- debiasing / concept erasure ✓  
- hard negative mining ✓