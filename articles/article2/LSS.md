# Using Linear Models in Modern Applications

**COLLINS WESTNEDGE**  
*MAY 16, 2025*

## Introduction
I've been really busy so this will be a little informal but **STILL WORTH THE READ** because in the day to day landscape of people talking agentic AI, RAG systems, vector databases etc things like least squares regression and linear models tend to feel like dusty sklearn imports or the stuff of technical coding interviews. Despite the heavy focus on foundation model integration classic linear tools like ordinary least squares regression and its projection formula corrolary remain surprisingly powerful. By framing modern tasks like semantic filtering and bias removal as geometric problems, it becomes clear why simple formulas like 
$$
X(X^{\mathsf T}X)^{+}X^{\mathsf T}
$$ 
work so well. The focus of this article is show how ordinary least squares offers insights as well as stable and theoretically grounded solution to semantic filtering in modern search and retrieval systems. 

## Linalg Recap

*lorem ipsum*

### Key Formulas

| Formula                                | Intuitive Role                                                                                   | Visual Cue                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| $X^{+} = (X^{\!\top}X)^{-1}X^{\!\top}$ | **Recipe for weights.** Solves $\min_\beta\|y - X\beta\|_2^2$.                                   | “How much of each arrow do I need?”  |
| $\hat{\beta}=X^{+}y$                   | **Coordinates along the arrows.** Scalar steps to reach the closest point.                       | Labels on the subspace axes.         |
| $P_X = X\,X^{+}$                       | **Snap-to-span operator.** Orthogonal projector: symmetric, idempotent.                          | Elevator lowering you to the sheet.  |
| $\hat y = P_X\,y = X\hat{\beta}$       | **Foot of the perpendicular.** Unique point in $\mathrm{span}\{X\}$ minimizing $\|y - \hat y\|$. | Black dot where the plumb-line hits. |
| $r = y-\hat y = (I-P_X)\,y$            | **Residual vector.** Always orthogonal to every column of $X$ ($X^{\!\top}r=0$).                 | Red straight-down arrow.             |

### Theorems

**Best Approximation Theorem**
Let $W$ be a subspace of $\mathbb{R}^n$, $y\in\mathbb{R}^n$, and $\widehat y = \mathrm{proj}_W(y)$ its orthogonal projection onto $W$. Then

$$
\|y - \widehat{y}\|_2 \;<\; \|y - v\|_2
\quad\text{for all }v\in W,\;v\neq \widehat{y}.
$$

> *From this it follows that the “remainder” $y - \widehat{y}$ lies in $W^\perp$ and is the closest point in that orthogonal complement to $y$.*

### Takeaway Corollary

If $\mathbf{u}_{\text{proj}} = \mathrm{proj}_V(\mathbf{u})$, then

$$
\mathbf{u}_{\mathrm{new}}
\;=\;\mathbf{u} - \mathbf{u}_{\text{proj}}
\;\in\;V^\perp
$$

is the closest-possible embedding to $\mathbf{u}$ that’s perfectly orthogonal to $V$.

#### TLDR

Define

$$
\mathbf{u}_{\mathrm{new}}
\;=\;\arg\min_{w\in V^\perp}\|\mathbf{u}-w\|
\;=\;\mathrm{proj}_{V^\perp}(\mathbf{u}).
$$

1. **Minimal distortion**
   $\mathbf{u}_{\mathrm{new}}\in V^\perp$ is the closest vector in $V^\perp$ to $\mathbf{u}$.
2. **Guaranteed orthogonality**
   $\langle \mathbf{u}_{\mathrm{new}},\,v\rangle = 0$ for every $v\in V$.


## Visual Intuition
## Mean Subtraction vs. Projection Residuals
## Examples
## Conclusion
