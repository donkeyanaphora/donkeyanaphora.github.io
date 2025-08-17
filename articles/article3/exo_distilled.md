### Premises
1. RHLF reduces diversity of model generations, effectively squishing probability masses for next token prediction
2. RHLF improves generalization and robustness on many benchmark tasks
3. RHLF may reduce squish probability mass even within the space of valid solutions
4. Fluid intelligence = efficient generalization
5. fluid intelligence produces uniform probablity mass across all valid solutions and low masses across invalid ones

### Questions
1. Solution Space Constraint: For verifiable tasks that admit many correct answers, does RHLF reduce entropy across valid solutions? (do models converge on fewer, more conventional answers, if so for what task types?)
2. Creativity Correlation: Does reduced entropy within valid solution spaces correlate with diminished creative reasoning?

### Illustrative Examples
Pre-RHLF behavior (Base Model):
- what primes sum to 20,000 -> broad proability spread over many valid primes
- what is 2+2? -> narrow probability peak at 4 or generations leading to 4
- Define prime numbers -> broad probability spread across valid definitions
- list some primes -> broad probability spread across many primes

Post-RHLF behavior (Base Model):
- what primes sum to 20,000 -> Probability sharply concentrated on one canon primes/solutions.
- what is 2+2? -> narrow probability peak at “4” (unchanged).
- Define prime numbers -> probability concentrated on a single canonical definition.
- list some primes -> Probability concentrated on obvious or popular primes.

### Relationship to ARC: 
Following Francois Chollet's work on ARC and fluid intelligence is marked by efficient skill acquisition, or generalization from exposure to few examples. efficient generalization requires uniform probability mass (equally likely) across all valid solutions, given minimal exposure. 
- If a model is shown a single instance of "find primes that sum to 20,000" its generalization power should be marked by a uniform probability mass across all valid primes that produce this sum
- Outside the valid solution space, the model's probability mass should be near zero. 

Thus, a hallmark of fluid intelligence is selective entropy: wide distribution across correct solutions, narrow distribution against incorrect ones. RLHF may interfere with this balance by collapsing entropy within the valid space.