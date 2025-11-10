---
layout: post
title: "Lecture 05.04: Post-Quantum Cryptography - Preparing for Quantum Computing Era"
chapter: '05'
order: 5
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Lecture: Post-Quantum Cryptography - Preparing for Quantum Computing Era

## 1. Concept Overview

Quantum computing represents existential threat to current cryptographic foundations của blockchain technology. While classical computers process bits (0 hoặc 1), quantum computers leverage quantum mechanical phenomena - superposition và entanglement - để process quantum bits (qubits) existing in multiple states simultaneously. This enables quantum algorithms solving certain mathematical problems exponentially faster than best known classical algorithms, directly threatening cryptographic schemes securing billions of dollars trong blockchain ecosystems worldwide.

Threat materialized through specific quantum algorithms fundamentally undermining cryptographic assumptions. **Shor's algorithm**, discovered by Peter Shor năm 1994, solves integer factorization và discrete logarithm problems in polynomial time on quantum computers. These problems form security basis cho RSA (factoring) và ECDSA (discrete log) - cryptographic schemes securing essentially all blockchain signatures today. Bitcoin, Ethereum, và virtually every blockchain rely on ECDSA for transaction authorization. Sufficiently powerful quantum computer could derive private keys from public keys, enabling attacker steal funds from any address whose public key revealed.

Timeline estimates for "quantum supremacy" threatening blockchain vary widely. Conservative estimates suggest 10-15 years before quantum computers powerful enough breaking 256-bit ECDSA exist. Optimistic (from cryptographic security perspective) estimates extend to 20-30 years. Recent progress accelerating concerns - Google achieved "quantum supremacy" năm 2019 với 53-qubit Sycamore processor, IBM unveiled 433-qubit Osprey năm 2022, và atom Computing demonstrated 1,225-qubit system năm 2023. While these systems far from cryptographically relevant (~4,000 logical qubits estimated for breaking ECDSA), progress trajectory alarming.

Blockchain community response includes both research into post-quantum cryptography và practical preparation for migration. **NIST (National Institute of Standards and Technology)** conducted multi-year competition evaluating post-quantum cryptographic schemes, announcing winners August 2024. Selected algorithms include lattice-based schemes (CRYSTALS-Kyber for encryption, CRYSTALS-Dilithium for signatures), hash-based signatures (SPHINCS+), và code-based encryption. These algorithms resist known quantum attacks, providing foundation for quantum-safe blockchains.

Migration challenges substantial. Cannot simply swap ECDSA for post-quantum signatures - many post-quantum schemes have significantly larger key sizes, signature sizes, và verification times. Blockchain bandwidth và storage constraints amplified. Moreover, migration requires coordinated hard fork across entire network, politically và technically complex. Early preparation essential - developing post-quantum schemes, testing implementation, planning migration strategy - ensuring blockchain survives quantum transition.

Research into quantum-resistant blockchain designs ongoing. **Quantum Key Distribution (QKD)** explored for consensus communication security. **Quantum-resistant hash functions** analyzed for mining. **Hybrid schemes** combining classical và post-quantum cryptography provide defense-in-depth during transition period. Some projects like **QRL (Quantum Resistant Ledger)** designed from inception with post-quantum signatures, demonstrating feasibility though adoption limited.

---

## 2. Intuitive Understanding

Để grasp quantum threat intuitively, consider classical cryptography như combination lock với astronomical number of combinations. Modern 256-bit keys provide \(2^{256}\) possibilities - trying each combination sequentially requires longer than universe age even với all computers on Earth. Security relies on sheer number của possibilities making brute force infeasible. Quantum computers don't try combinations sequentially - they exist in superposition of all states simultaneously, collapsing to answer through quantum interference, exponentially accelerating search.

Analogy with maze solving illustrates quantum advantage. Classical computer explores maze by trying paths sequentially - left corridor, dead end, backtrack, try right corridor, etc. Large maze requires exponential time exploring all branches. Quantum computer explores all paths simultaneously through superposition, measuring interference patterns revealing correct path directly. For cryptographic "maze" finding private key from public key, quantum computer's parallel exploration catastrophic for classical security assumptions.

Shor's algorithm specifically targets mathematical structure của discrete logarithm problem. Problem: given \(y = g^x \mod p\), find \(x\). Classical algorithms (baby-step giant-step, Pollard's rho) require \(O(\sqrt{p})\) operations. For 256-bit curves, \(\sqrt{2^{256}} = 2^{128}\) operations - infeasible classically. Shor's algorithm uses quantum Fourier transform finding period của modular exponentiation, solving in polynomial time \(O((\log p)^3)\). Game-changer for cryptography.

Post-quantum cryptographic schemes rely on mathematical problems believed hard even for quantum computers. **Lattice problems** involve finding shortest vector trong high-dimensional lattice - no known quantum algorithm providing exponential speedup. **Hash-based signatures** rely solely on collision resistance của cryptographic hash functions, resistant to Grover's algorithm providing only quadratic speedup. **Code-based cryptography** uses error-correcting codes, believed quantum-resistant. These alternatives provide foundations for quantum-safe blockchain future.

Migration analogy: transitioning infrastructure before old infrastructure fails. Like replacing bridge before it collapses, blockchain must migrate cryptography before quantum computers break current schemes. Waiting until quantum threat immediate risks catastrophic failure - private keys exposed suddenly, funds stolen en masse. Proactive migration enables gradual transition, testing, và fallback if issues arise.

Hybrid cryptography during transition comparable to wearing belt AND suspenders. Use both classical (ECDSA) và post-quantum signatures simultaneously. Transaction valid only if both signatures verify. Provides security even if one scheme compromised. Doubles signature size temporarily but ensures continuous security throughout migration period. Once quantum threat materializes, drop classical component, having tested post-quantum thoroughly.

---

## 3. Technical Foundation

Quantum algorithm threat analysis begins with **Shor's algorithm** complexity. For integer \(N\) with \(n\) bits, Shor's algorithm factors \(N\) or solves discrete log in time:

\[
O(n^3) \text{ quantum operations}
\]

Classical best algorithms require:
\[
O(e^{1.9(\ln N)^{1/3}(\ln \ln N)^{2/3}}) \approx O(e^{n^{1/3}})
\]

Exponential vs polynomial - dramatic difference. For 256-bit elliptic curve discrete log:

Classical: \(O(2^{128})\) operations (infeasible)
Quantum: \(O(256^3) = 16,777,216\) operations (feasible!)

**Grover's algorithm** provides quadratic speedup for unstructured search. Finding preimage của hash function:

Classical: \(O(2^n)\) for n-bit hash
Quantum: \(O(2^{n/2})\) using Grover

For SHA-256:
- Classical: \(2^{256}\) operations (impossible)
- Quantum: \(2^{128}\) operations (still hard, but concerning)

Security effectively halved! 256-bit hash provides only 128-bit quantum security.

Post-quantum signature schemes offer quantum resistance với trade-offs:

**CRYSTALS-Dilithium** (lattice-based):
```python
class DilithiumSignature:
    """Simplified Dilithium signature scheme"""
    
    # Parameters
    PUBLIC_KEY_SIZE = 1312 bytes  # Much larger than ECDSA (33 bytes)
    SIGNATURE_SIZE = 2420 bytes   # Much larger than ECDSA (64 bytes)
    
    def keygen(self):
        """Generate key pair"""
        # Lattice-based key generation
        # Private: short vectors in lattice
        # Public: random matrix + public vector
        pass
    
    def sign(self, message, private_key):
        """Create signature"""
        # Rejection sampling over lattice
        # Output: (z, c) where z is response, c is challenge
        pass
    
    def verify(self, message, signature, public_key):
        """Verify signature"""
        # Check lattice relation holds
        # Significantly slower than ECDSA (~10x)
        pass
```

**SPHINCS+** (hash-based):
```python
class SPHINCS_Plus:
    """Hash-based signature (quantum-safe)"""
    
    PUBLIC_KEY_SIZE = 32 bytes    # Reasonable
    SIGNATURE_SIZE = 7856 bytes   # VERY large!
    
    # Security relies only on hash function collision resistance
    # Grover only gives quadratic speedup
    # Use SHA-256 → 128-bit quantum security
    # Or SHA-512 → 256-bit quantum security
```

Trade-off comparison:

| Scheme | Public Key | Signature | Speed | Quantum Safe? |
|--------|-----------|-----------|-------|---------------|
| ECDSA | 33 bytes | 64 bytes | Fast | ❌ No |
| Dilithium | 1312 bytes | 2420 bytes | Medium | ✅ Yes |
| SPHINCS+ | 32 bytes | 7856 bytes | Slow | ✅ Yes |
| Falcon | 897 bytes | 666 bytes | Fast | ✅ Yes |

---

## 4. Mathematical / Cryptographic Formulation

Lattice problems foundation cho many post-quantum schemes. **Shortest Vector Problem (SVP)**: Given lattice \(L\), find shortest non-zero vector.

Lattice defined by basis vectors:
\[
L = \{\sum_{i=1}^{n} a_i \mathbf{b}_i : a_i \in \mathbb{Z}\}
\]

Best classical algorithm (BKZ): \(O(2^{n})\)
Best quantum algorithm: \(O(2^{n})\) (no exponential speedup!)

Quantum resistance stems from no known quantum algorithm efficiently solving lattice problems.

**Learning With Errors (LWE)** problem: Given samples \((a_i, b_i)\) where:
\[
b_i = \langle a_i, s \rangle + e_i \mod q
\]

Find secret \(s\). Small error \(e_i\) makes problem hard classically AND quantumly.

**Grover impact on hash functions**:

Classical collision search: \(O(2^{n/2})\) (birthday paradox)
Quantum collision search: \(O(2^{n/3})\) (Grover-accelerated birthday)

For SHA-256 (n=256):
- Classical security: 128 bits
- Quantum security: ~85 bits

Still secure but margin reduced. SHA-512 recommended for post-quantum: ~170-bit quantum security.

---

## 5. Implementation Insight

```python
# Post-quantum migration strategy simulation

class QuantumResistantBlockchain:
    """Blockchain with hybrid classical + post-quantum crypto"""
    
    def __init__(self):
        self.accounts = {}
        self.quantum_era = False  # Switch when quantum threat real
    
    def create_hybrid_address(self):
        """Generate address with both ECDSA and post-quantum keys"""
        
        # Classical key (ECDSA)
        classical_private = generate_ecdsa_key()
        classical_public = derive_public_key(classical_private)
        
        # Post-quantum key (Dilithium)
        pq_private = generate_dilithium_key()
        pq_public = derive_pq_public(pq_private)
        
        # Hybrid address = hash(classical_pub + pq_pub)
        address = hash(classical_public + pq_public)
        
        return {
            'address': address,
            'classical_key': classical_private,
            'pq_key': pq_private,
            'type': 'hybrid'
        }
    
    def verify_transaction(self, tx):
        """Verify transaction with hybrid signatures"""
        
        if self.quantum_era:
            # Post-quantum era: only check PQ signature
            return verify_dilithium(tx['pq_signature'], tx['pq_pubkey'])
        else:
            # Pre-quantum: check both (belt + suspenders)
            classical_valid = verify_ecdsa(tx['ecdsa_signature'])
            pq_valid = verify_dilithium(tx['pq_signature'])
            
            return classical_valid and pq_valid
```

---

## 6. Common Challenges / Attacks / Trade-offs

Migration timing represents critical challenge. Migrate too early: waste resources on unnecessary overhead (larger signatures, slower verification). Migrate too late: quantum computers break existing cryptography before migration complete. Monitoring quantum computing progress essential, but predicting breakthrough difficult - advances may occur suddenly.

**Signature size bloat** impacts blockchain scalability severely. Post-quantum signatures 10-100× larger than ECDSA. Block size limits mean fewer transactions per block. Options: increase block size (centralization concerns), compress signatures (partially possible), accept lower throughput. No perfect solution - fundamental trade-off between quantum security và efficiency.

---

## 7. Related Concepts

**Quantum Key Distribution (QKD)** provides information-theoretic security for communication but requires specialized hardware (fiber optic cables, quantum repeaters). Not practical for blockchain's decentralized nature. Post-quantum cryptography based on mathematical hardness preferred - works on classical hardware, practical deployment.

**Hash-based signatures** like SPHINCS+ fascinating because security reduces solely to hash function collision resistance. No structured problem (factoring, discrete log, lattices) involved. Using SHA-256, Grover provides only quadratic speedup, maintaining substantial security. Drawback: enormous signature sizes (7-8 KB per signature vs 64 bytes for ECDSA).

---

## 8. ⭐ Fundamental Papers / Whitepapers

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer"** | 1994 | Peter Shor | Shor's algorithm - breaks RSA/ECDSA |
| **"A Fast Quantum Mechanical Algorithm for Database Search"** | 1996 | Lov Grover | Grover's algorithm - weakens hash functions |
| **"CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme"** | 2018 | Ducas et al. | NIST PQC winner |
| **"SPHINCS+: Stateless Hash-Based Signatures"** | 2019 | Bernstein et al. | Hash-based PQC signatures |
| **"Quantum Resource Estimates for Computing Elliptic Curve Discrete Logarithms"** | 2017 | Roetteler et al. | Estimates qubits needed break ECDSA |

---

## 9. 🎨 Illustrations & Visual References

### Quantum Threat Timeline
```
2019: Google Quantum Supremacy (53 qubits)
2022: IBM Osprey (433 qubits)
2023: Atom Computing (1,225 qubits)

Needed to break ECDSA-256: ~4,000 logical qubits
(Millions of physical qubits with error correction)

Timeline: 10-30 years (uncertain!)
```

*Source: [NIST Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)*

### Signature Size Comparison
| Algorithm | Public Key | Signature | Quantum Safe |
|-----------|-----------|-----------|--------------|
| ECDSA | 33 bytes | 64 bytes | ❌ |
| Dilithium | 1,312 bytes | 2,420 bytes | ✅ |
| Falcon | 897 bytes | 666 bytes | ✅ |
| SPHINCS+ | 32 bytes | 7,856 bytes | ✅ |

---

## 10. Summary

Post-quantum cryptography essential for long-term blockchain security as quantum computing advances. Shor's algorithm threatens current ECDSA signatures, requiring migration to quantum-resistant schemes based on lattice problems, hash functions, hoặc error-correcting codes. While quantum computers capable của breaking blockchain cryptography estimated 10-30 years away, proactive preparation necessary given migration complexity và stakes involved.

NIST standardization provides quantum-safe algorithms ready for deployment. Challenge lies trong managing trade-offs - larger signatures, slower verification, increased bandwidth requirements - while ensuring smooth migration without disrupting existing ecosystems. Understanding post-quantum cryptography fundamentals enables informed participation in blockchain's quantum transition planning.

---

✅ **End of Lecture**

Next: Lecture 05.05 - Advanced Privacy Techniques

---

## References

1. Shor, P. W. (1994). *Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer*. FOCS 1994.
2. NIST. (2024). *Post-Quantum Cryptography Standardization*. https://csrc.nist.gov/projects/post-quantum-cryptography
3. Roetteler, M., et al. (2017). *Quantum resource estimates for computing elliptic curve discrete logarithms*. ASIACRYPT 2017.

