---
title: "Using Linear Models in Modern Applications"
description: "A closer look at how using least squares projection can offer a stable alternative to semantic filtering."
slug: "article2"
date: "2025-05-16"
draft: true
image: "https://donkeyanaphora.github.io/assets/images/thumbnail.png"
---

# 📐 Using Linear Models in Modern Applications

**COLLINS WESTNEDGE**  
*MAY 16, 2025*

## Introduction
I've been really busy so this will be a little informal but **STILL WORTH THE READ** because in the day to day landscape of people talking agentic AI, RAG systems, vector databases etc things like least squares regression and linear models tend to feel like dusty sklearn imports or the stuff of technical coding interviews. Despite the heavy focus on foundation model integration classic linear tools like ordinary least squares regression and its projection formula corrolary remain surprisingly powerful. By framing modern tasks like semantic filtering and bias removal as geometric problems, it becomes clear why simple formulas like

$$
X\,(X^{\!\top}X)^{+}X^{\!\top}
$$

work so well. The focus of this article is show how ordinary least squares offers insights as well as stable and theoretically grounded solution to semantic filtering in modern search and retrieval systems. 


## Linalg Recap

*lorem ipsum*

### Key Formulas

| Formula | Intuitive role | Visual cue |
| --- | --- | --- |
| $X^{+} = (X^{\!\top}X)^{-1}X^{\!\top}$ | Recipe for weights. Solves $\displaystyle\min_{\beta}\,\lVert y - X\beta\rVert_2^{\,2}$. | How much of each arrow do I need? |
| $\hat{\beta}=X^{+}y$ | Coordinates along the arrows (scalar steps to reach the closest point). | Labels on the sub-space axes. |
| $P_X = X\,X^{+}$ | Snap-to-span operator (orthogonal projector: symmetric, idempotent). | Elevator lowering you to the sheet. |
| $\hat{y}=P_Xy = X\hat{\beta}$ | Foot of the perpendicular — the unique point in $\operatorname{span}(X)$ minimizing $\lVert y-\hat{y}\rVert_2$. | Black dot where the plumb-line hits. |
| $r = y-\hat{y} = (I-P_X)\,y$ | Residual, orthogonal to every column of $X$ ($X^{\!\top}r=0$). | Red straight-down arrow. |

### Theorems

**Best Approximation Theorem**

Let $W\subseteq\mathbb{R}^{n}$, $y\in\mathbb{R}^{n}$, and $\widehat{y}=\operatorname{proj}_{W}(y)$. Then
$$
\lVert y-\widehat{y}\rVert_2 \;<\; \lVert y-v\rVert_2,
\qquad\forall\,v\in W,\;v\neq\widehat{y}.
$$
Hence $y-\widehat{y}\in W^{\perp}$ and is the closest vector in $W^{\perp}$ to $y$.

### Take-away Corollary

If $\mathbf{u}_{\mathrm{proj}}=\operatorname{proj}_{V}(\mathbf{u})$, then
$$
\mathbf{u}_{\mathrm{new}}
=\mathbf{u}-\mathbf{u}_{\mathrm{proj}}
\in V^{\perp}.
$$
Thus $\mathbf{u}_{\mathrm{new}}$ is the closest-possible embedding to $\mathbf{u}$ that is perfectly orthogonal to $V$.

#### TL;DR

Define
$$
\mathbf{u}_{\mathrm{new}}
=\arg\min_{w\in V^{\perp}}\lVert\mathbf{u}-w\rVert
=\operatorname{proj}_{V^{\perp}}(\mathbf{u}).
$$

1. **Minimal distortion** — $\mathbf{u}_{\mathrm{new}}$ is the closest vector in $V^{\perp}$ to $\mathbf{u}$.  
2. **Guaranteed orthogonality** — $\langle\mathbf{u}_{\mathrm{new}}, v\rangle = 0$ for every $v\in V$.

## Visual Intuition
## Mean Subtraction vs. Projection Residuals
## Examples
## Conclusion
