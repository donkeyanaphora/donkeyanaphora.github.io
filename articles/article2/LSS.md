# Using Linear Models in Modern Applications

**COLLINS WESTNEDGE**  
*MAY 16, 2025*

## Introduction
I've been really busy so this will be a little informal but **STILL WORTH THE READ** because in the day to day landscape of people talking agentic AI, RAG systems, vector databases etc things like least squares regression and linear models tend to feel like dusty sklearn imports or the stuff of technical coding interviews. Despite the heavy focus on foundation model integration classic linear tools like ordinary least squares regression and its projection formula corrolary remain surprisingly powerful. By framing modern tasks like semantic filtering and bias removal as geometric problems, it becomes clear why simple formulas like $X(X^{\mathsf T}X)^{+}X^{\mathsf T}$ work so well. The focus of this article is show how ordinary least squares offers insights as well as stable and theoretically grounded solution to semantic filtering in modern search and retrieval systems. 

## Linalg Recap
lorem ipsum

### Formulas:

| Formula                                                                                                 | Intuitive role                                                                                                                                          | Visual cue                                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| $X^{+} = (X^{\!\top}X)^{-1}X^{\!\top}$ | **Recipe for weights.** Turns a target $y$ into the coefficient vector that minimises $\lVert y-X\beta\rVert_2^2$.                                      | “How much of each arrow do I need?”                     |
| $\hat{\beta}=X^{+}y$                                                                                    | **Coordinates along the arrows.** These scalars say how far to travel in each predictor direction to land at the closest point.                         | Labels on the sub-space axes.                           |
| $P_X = X\,X^{+}$                                                                                        | **Snap-to-span operator.** Orthogonally drops any vector onto the span of $X$; symmetric + idempotent ⇒ unmistakably an orthogonal projector.           | Transparent elevator lowering you to the sheet.         |
| $\hat y = P_X\,y = X\hat{\beta}$                                                                        | **Foot of the perpendicular.** The unique point in the sub-space that minimises $\lVert y-\hat y\rVert_2$; numerically, it’s the regression prediction. | Black dot where the plumb line from $y$ hits the sheet. |
| $r = y-\hat y = (I-P_X)\,y$                                                                             | **Residual vector.** Connects $y$ to its foot; always orthogonal to every column of $X$ ($X^{\!\top}r=0$).                                                  | Red straight-down arrow.                                |

### Theorems:
**The Best Approximation Theorem:**

Let $W$ be a subspace of $\mathbb{R}^{n}$, let $y \in \mathbb{R}^{n}$, and let 
$\widehat{y} = \operatorname{proj}_{W} y$ be the orthogonal projection of $y$ onto $W$.
Then $\widehat{y}$ is the closest point in $W$ to $y$; in the sense that
$$
  \|\,y - \widehat{y}\,\|_2 
  \;<\; 
  \|\,y - v\,\|_2 
  \quad\text{for all } v \in W,\; v \neq \widehat{y}.
$$

(pg 394)

**Other Theorem Placeholder (TODO)**:
well I guess from the best approximation theorem we get that u_proj is the closest point in V from u but then we have to prove the corollary that u-uproj is the closest point to u in Vperp (pathagreas?)
### Takeaways:

$$
u_{\text{new}} = u-u_{\text{proj}}
$$
is *the* closest-possible embedding to the original query **while being perfectly orthogonal to the undesirable sub-space**.

That’s the mathematical backing for the two benefits you listed:

1. **Minimal distortion** (distance from $u$ is the smallest achievable).
2. **Guaranteed orthogonality** to every filter direction in $V$.

## Visual Intuition
## Mean Subtraction vs. Projection Residuals
## Examples
## Conclusion