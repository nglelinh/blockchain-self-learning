---
layout: post
title: "Lecture 05.03: Formal Verification - Proving Smart Contract Correctness"
chapter: '05'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Lecture: Formal Verification - Proving Smart Contract Correctness Mathematically

## 1. Concept Overview

Formal verification represents rigorous mathematical approach to ensuring software correctness, particularly critical for smart contracts where bugs lead to irreversible financial losses. Unlike traditional testing verifying program works correctly for specific inputs, formal verification proves program behaves correctly for ALL possible inputs mathematically. This distinction crucial trong blockchain context - smart contracts control billions of dollars, deployed immutably, facing adversaries với huge economic incentives to find và exploit vulnerabilities.

Traditional software development relies primarily on testing - running programs với various inputs, checking outputs match expectations. Testing discovers bugs but cannot prove absence của bugs. Famous computer scientist **Edsger Dijkstra** stated: "Program testing can be used to show presence of bugs, but never to show their absence." For typical applications, this acceptable - bugs fixed through patches, damage limited. Smart contracts different fundamentally - cannot be patched post-deployment, bugs exploitable permanently, và financial stakes enormous.

Formal verification emerged from academic computer science, tracing back to **Tony Hoare's** work on program correctness trong 1960s-1970s. Hoare introduced **axiomatic semantics** và **Hoare logic** - mathematical framework for reasoning about programs. Given precondition \(P\), program \(S\), và postcondition \(Q\), Hoare triple \(\{P\} S \{Q\}\) states: if \(P\) holds before executing \(S\), then \(Q\) holds afterward. Proving program correct reduces to proving all relevant Hoare triples valid.

Applying formal verification to smart contracts gained urgency after The DAO hack năm 2016. **$50 million stolen** through reentrancy vulnerability demonstrated testing insufficient for high-stakes smart contracts. Research community responded with tools và techniques specifically targeting smart contract verification. **Runtime Verification** created **K Framework** enabling formal semantics for EVM. **Certora** developed **Certora Prover** for Solidity verification. **Trail of Bits** built **Manticore** for symbolic execution. Academic projects like **Why3**, **Isabelle/HOL**, và **Coq** applied to blockchain.

Different verification approaches offer varying guarantees và trade-offs. **Model checking** exhaustively explores state space, practical chỉ cho small contracts. **Theorem proving** requires manual proof construction, providing strongest guarantees nhưng demanding expertise substantial. **Symbolic execution** analyzes paths through code symbolically, finding violations of specified properties. **Runtime verification** monitors execution, detecting violations dynamically. Each technique appropriate for different verification goals và resource constraints.

Standards emerging around verified smart contracts. **ERC-20 token security** became focus - formal specifications define expected behaviors (transfer preserves total supply, approve không affect balances, etc.). Tools verify implementations match specifications automatically. **DeFi protocols** increasingly undergo formal verification before launch - Aave, Compound, MakerDAO all utilized formal methods to varying degrees. Insurance protocols like **Nexus Mutual** offer coverage but require audits including formal verification for premium rates best.

Integration into development workflow remains challenge. Formal verification requires specifications written precisely, properties stated formally, và verification toolchains complex. Developer education insufficient - most blockchain developers lack formal methods background. Cost-benefit analysis difficult - verification expensive (weeks to months), benefits hard quantify until breach occurs. Despite challenges, high-value protocols increasingly view formal verification như necessary investment rather than optional luxury.

---

## 2. Intuitive Understanding

Để comprehend formal verification intuitively, contrast với traditional testing through concrete example. Imagine function adding two numbers. Testing approach: try various inputs (1+2=3, 10+5=15, 100+200=300), verify outputs correct. After 1000 tests passing, reasonable confidence function works. However, cannot test all possible inputs - với 256-bit integers, có \(2^{512}\) possible input pairs, far more than atoms trong universe. Hidden bug could lurk trong untested combination.

Formal verification proves function correct for ALL inputs mathematically. Specification states: "Function returns sum của inputs." Proof demonstrates: given any inputs \(a\) và \(b\), function returns \(a+b\). No testing required - mathematical proof covers infinite input space completely. For simple addition, proof trivial. For complex smart contracts với intricate state machines, proofs challenging but provide certainty unattainable through testing alone.

Consider smart contract managing token balances với transfer function. Testing verifies transfers work correctly for sample scenarios - Alice transfers 10 tokens to Bob, Charlie transfers 100 to David, etc. Formal verification proves stronger properties universally: "Transfer never creates tokens from nothing" (conservation), "Transfer from Alice to Bob decreases Alice's balance và increases Bob's by same amount" (correct state transition), "Total supply constant across all transfers" (invariant preservation). These properties hold for every possible transfer, every possible initial state, proven mathematically.

Analogy với building bridges illuminates value proposition. Testing bridge như having trucks drive across, measuring stress, checking for problems. This discovers obvious flaws but cannot guarantee bridge safe under all conditions - unusual load combinations, rare weather patterns, material degradation over time. Engineering calculations prove bridge withstands maximum specified loads using physics equations và material properties. Similarly, formal verification proves smart contracts handle all scenarios using logic và mathematics, providing assurance beyond empirical testing.

Verification workflow comparable to peer review trong academic publishing. Researcher submits paper claiming theorem proven. Reviewers check proof rigorously, verifying each logical step follows from axioms và previous steps. If proof valid, theorem accepted as established fact. Formal verification similar - developer claims contract satisfies properties, verification tool checks proof automatically, if valid then properties mathematically guaranteed. Difference: verification automated, eliminating human error trong proof checking.

Types của properties verified fall into categories. **Safety properties** assert "nothing bad happens" - no reentrancy, no overflow, no unauthorized access. **Liveness properties** ensure "something good eventually happens" - functions eventually terminate, legitimate transactions eventually process. **Functional correctness** proves implementation matches specification precisely. **Economic properties** verify incentive mechanisms game-theoretically sound. Each property type requires different verification techniques và tooling.

---

## 3. Technical Foundation

Formal verification foundations rest on formal semantics - precise mathematical definition của programming language meaning. EVM semantics define exactly what each opcode does, how state changes, how gas consumed. Without formal semantics, cannot reason about programs rigorously. **KEVM** project formalized EVM semantics using K Framework, creating executable formal specification serving both as documentation và verification basis.

Hoare logic provides core framework for reasoning about imperative programs. Hoare triple \(\{P\} S \{Q\}\) asserts: if precondition \(P\) holds before executing statement \(S\), postcondition \(Q\) holds after. Rules compose triples to reason about larger programs:

**Sequential composition**:
\[
\frac{\{P\} S_1 \{Q\}, \quad \{Q\} S_2 \{R\}}{\{P\} S_1; S_2 \{R\}}
\]

**Conditional**:
\[
\frac{\{P \land B\} S_1 \{Q\}, \quad \{P \land \neg B\} S_2 \{Q\}}{\{P\} \text{if } B \text{ then } S_1 \text{ else } S_2 \{Q\}}
\]

**Loop invariant**:
\[
\frac{\{I \land B\} S \{I\}}{\{I\} \text{while } B \text{ do } S \{I \land \neg B\}}
\]

Where \(I\) loop invariant - property remaining true each iteration.

Applying to Solidity, consider simple transfer:

```solidity
function transfer(address to, uint amount) public {
    require(balances[msg.sender] >= amount);  // Precondition
    balances[msg.sender] -= amount;
    balances[to] += amount;
    // Postcondition: balances preserved
}
```

Formal specification:
\[
\begin{align}
P: & \quad \text{balances}[sender] \geq amount \\
Q: & \quad \text{balances}'[sender] = \text{balances}[sender] - amount \\
   & \quad \land \text{balances}'[to] = \text{balances}[to] + amount \\
   & \quad \land \sum \text{balances}' = \sum \text{balances}
\end{align}
\]

Proof obligations verify each line preserves stated relationships.

Symbolic execution explores program paths symbolically rather than concretely. Variables represented as symbols (\(x\), \(y\)) rather than concrete values (5, 10). Path conditions accumulated as symbolic constraints. At end của path, constraint solver (SMT solver) determines if unsafe states reachable. If solver finds satisfying assignment reaching error state, bug found; if proves no assignment possible, path safe.

```python
def symbolic_execution_example():
    """Illustrate symbolic execution concept"""
    
    # Concrete execution:
    x = 5
    if x > 3:
        y = x * 2  # y = 10
    else:
        y = x + 1
    assert y < 15  # Passes
    
    # Symbolic execution:
    x = Symbol('x')  # x is symbolic variable
    
    # Path 1: x > 3
    path1_condition = (x > 3)
    path1_y = x * 2
    path1_assertion = (path1_y < 15)
    # Combine: (x > 3) ∧ (x * 2 < 15)
    # Simplify: (x > 3) ∧ (x < 7.5)
    # Satisfiable: x ∈ (3, 7.5) - PATH SAFE
    
    # Path 2: x ≤ 3
    path2_condition = (x <= 3)
    path2_y = x + 1
    path2_assertion = (path2_y < 15)
    # Combine: (x ≤ 3) ∧ (x + 1 < 15)
    # Simplify: (x ≤ 3) ∧ (x < 14)
    # Satisfiable: x ≤ 3 - PATH SAFE
    
    # Both paths safe → Function verified!
```

Model checking approach explores state space exhaustively. Smart contract modeled as finite state machine, properties expressed as temporal logic formulas. Model checker systematically explores reachable states, verifying properties hold trong all states và transitions. Technique effective for protocol-level verification nhưng faces state explosion - number of states grows exponentially với variables. Abstraction techniques mitigate này by grouping similar states, trading precision for tractability.

Theorem proving requires encoding program và properties trong proof assistant (Coq, Isabelle, Lean), then constructing formal proof interactively. Proof assistant checks each step, ensuring logical soundness. Approach provides strongest guarantees - fully mechanized mathematical proof - nhưng demands significant expertise. Successes include **CompCert** (verified C compiler) và **seL4** (verified microkernel). Smart contract theorem proving emerging - **Ether** project verified ERC-20 properties using Coq.

---

## 4. Mathematical / Cryptographic Formulation

Formal specification requires precise mathematical statement của intended behavior. For ERC-20 token, fundamental invariant:

\[
\forall t: \quad \sum_{a \in \text{addresses}} \text{balanceOf}(a, t) = \text{totalSupply}
\]

This states total supply constant across all times. Transfer function must preserve này:

\[
\{B_1 + B_2 = S\} \quad \text{transfer}(from, to, v) \quad \{B_1' + B_2' = S\}
\]

Where \(B_1 = \text{balanceOf}(from)\), \(B_2 = \text{balanceOf}(to)\), \(S = \text{totalSupply}\).

Expanding:
\[
\begin{align}
B_1' &= B_1 - v \\
B_2' &= B_2 + v \\
B_1' + B_2' &= (B_1 - v) + (B_2 + v) = B_1 + B_2 = S \quad \checkmark
\end{align}
\]

Invariant preserved!

Reentrancy verification requires proving state updates occur before external calls. Using Hoare logic:

```
{balances[sender] = B}
balances[sender] -= amount;
{balances[sender] = B - amount}  // State updated
(bool success,) = recipient.call{value: amount}("");
{balances[sender] = B - amount}  // Still holds - no reentry possible
```

Versus vulnerable code:
```
{balances[sender] = B}
recipient.call{value: amount}("");
// Reentry possible! balances[sender] still B
balances[sender] -= amount;
```

Formal proof shows second version allows multiple withdrawals before state update, violating invariant.

---

## 5. Implementation Insight

```python
from z3 import *

def verify_transfer_preserves_total():
    """
    Use Z3 SMT solver to verify transfer preserves total supply
    """
    
    # Define symbolic variables
    balance_from = Int('balance_from')
    balance_to = Int('balance_to')
    amount = Int('amount')
    
    # Define solver
    solver = Solver()
    
    # Preconditions
    solver.add(balance_from >= amount)  # Sufficient balance
    solver.add(balance_from >= 0)
    solver.add(balance_to >= 0)
    solver.add(amount >= 0)
    
    # Compute new balances
    new_balance_from = balance_from - amount
    new_balance_to = balance_to + amount
    
    # Property to verify: Total preserved
    total_before = balance_from + balance_to
    total_after = new_balance_from + new_balance_to
    
    # Check if total can differ (should be UNSAT - impossible)
    solver.add(total_before != total_after)
    
    result = solver.check()
    
    if result == unsat:
        print("✓ VERIFIED: Transfer always preserves total supply")
        print("  Mathematical proof complete")
    elif result == sat:
        print("✗ VIOLATION FOUND:")
        model = solver.model()
        print(f"  balance_from: {model[balance_from]}")
        print(f"  balance_to: {model[balance_to]}")
        print(f"  amount: {model[amount]}")
    else:
        print("? Unknown (solver timeout)")

if __name__ == "__main__":
    print("=== Formal Verification Example ===\n")
    verify_transfer_preserves_total()
```

Real-world formal verification tools include:

**Certora Prover** - industry-leading tool using SMT solvers:
```
// Certora specification language (CVL)
invariant totalSupplyInvariant()
    to_mathint(totalSupply()) == sum(balances);

rule transferPreservesTotal(address from, address to, uint amount) {
    mathint totalBefore = totalSupply();
    
    transfer(from, to, amount);
    
    mathint totalAfter = totalSupply();
    
    assert totalBefore == totalAfter, "Total supply changed!";
}
```

---

## 6. Common Challenges / Attacks / Trade-offs

Formal verification faces **specification challenge** - properties must be stated correctly và completely. Incomplete specifications lead to false sense of security - contract verified against wrong properties. The DAO contract could have been verified correct relative to incomplete specification missing reentrancy constraints. Expertise required identifying relevant properties profound.

**State explosion** limits model checking applicability. Contract với \(n\) boolean variables has \(2^n\) possible states. With 256-bit integers, state space astronomical. Abstraction techniques помогают but may introduce imprecision - abstract model verified but concrete implementation may differ subtly.

**Cost-benefit analysis** difficult. Formal verification expensive - weeks to months of expert time, specialized tools, computational resources. Benefits unclear until breach occurs. For small contracts, cost may exceed reasonable risk. For billion-dollar protocols, verification obviously justified. Threshold unclear for intermediate cases.

---

## 7. Related Concepts

Formal verification connects to **program synthesis** - automatically generating provably correct code from specifications. Instead of writing code then verifying, specify desired behavior formally, synthesizer generates implementation guaranteed satisfying specification. Research active but production adoption limited - synthesis works для simple contracts, struggles với complex business logic.

**Runtime monitoring** complements static verification. Deploy contracts với runtime assertions checking invariants during execution. If invariant violation detected, halt execution, preventing damage. Trade-off: gas costs for checks, but provides defense-in-depth when static verification infeasible.

**Proof-carrying code** embeds proofs within deployments. Contract bytecode accompanied by machine-checkable proof of correctness. Validators verify proof before accepting deployment, ensuring only correct contracts deployed. Research concept, practical implementation challenging.

---

## 8. ⭐ Fundamental Papers / Whitepapers

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"An Axiomatic Basis for Computer Programming"** | 1969 | C.A.R. Hoare | Hoare logic foundations |
| **"KEVM: Semantics of EVM in K"** | 2018 | Everett Hildenbrandt et al. | Formal EVM semantics |
| **"Formal Verification of Smart Contracts"** | 2016 | Bhargavan et al. | Early smart contract verification |
| **"Certora Prover: Formal Verification for Solidity"** | 2020 | Certora team | Industrial verification tool |
| **"Runtime Verification of Ethereum Smart Contracts"** | 2018 | Joshua Ellul, Gordon Pace | Runtime monitoring approach |

---

## 9. 🎨 Illustrations & Visual References

### Hoare Logic Example
```
{x > 0}           // Precondition
y := x + 1
{y > 1}           // Postcondition

Proof: If x > 0, then x + 1 > 1 ✓
```

### Verification Workflow
```
Smart Contract
      ↓
  Specification (properties to verify)
      ↓
  Verification Tool (Z3, Certora, etc.)
      ↓
   Verified ✓ or Bug Found ✗
```

*Source: [Certora Documentation](https://docs.certora.com/)*

---

## 10. Summary

Formal verification provides mathematical guarantees về smart contract correctness unattainable through testing alone. Using techniques like Hoare logic, symbolic execution, model checking, và theorem proving, developers can prove contracts satisfy critical properties for all possible inputs và states. Despite challenges including specification difficulty, state explosion, và expertise requirements, formal verification increasingly essential for high-value protocols given immutability của deployed contracts và enormous financial stakes involved.

Tools like Certora Prover, K Framework, và Z3 make verification more accessible, though significant expertise still required. Future likely sees verification integrated earlier into development workflows, automated verification improving, và standards emerging around verified contract patterns. Understanding formal verification fundamentals enables both better security assessment của existing contracts và development của provably correct new protocols.

---

✅ **End of Lecture**

Next: Lecture 05.04 - Post-Quantum Cryptography

---

## References

1. Hoare, C. A. R. (1969). *An axiomatic basis for computer programming*. Communications of the ACM, 12(10), 576-580.
2. Hildenbrandt, E., et al. (2018). *KEVM: A complete formal semantics of the Ethereum Virtual Machine*. CSF 2018.
3. Certora. (2020). *Certora Prover Documentation*. https://docs.certora.com/
4. Runtime Verification. (2018). *K Framework*. https://kframework.org/

