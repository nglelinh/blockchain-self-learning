---
layout: post
title: "Lecture 00.03: Digital Signatures và Public-Key Cryptography"
chapter: '00'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Digital Signatures và Public-Key Cryptography

## 1. Tổng quan về khái niệm

Trong bài giảng trước, chúng ta đã học về hash functions - công cụ để verify integrity của data. Nhưng hash functions alone không thể chứng minh **authenticity** - làm thế nào để biết ai đã tạo ra message đó? Đây là lúc **digital signatures** xuất hiện.

Digital signatures trong blockchain đóng vai trò tương tự như chữ ký tay trong thế giới vật lý, nhưng với nhiều tính năng vượt trội:

**Chữ ký tay (Analog)**:
- Dễ giả mạo (với kỹ năng)
- Có thể copy từ tài liệu này sang tài liệu khác
- Không thể verify automatically
- Cùng một chữ ký cho mọi document

**Digital Signature**:
- Cực kỳ khó giả mạo (computationally infeasible)
- Unique cho mỗi message (không thể copy sang message khác)
- Có thể verify tự động bởi bất kỳ ai
- Based on mathematical guarantees

Digital signatures trong blockchain giải quyết ba vấn đề cơ bản:

**1. Authentication (Xác thực)**: Chứng minh rằng message được tạo bởi người sở hữu private key tương ứng

**2. Non-repudiation (Không thể chối bỏ)**: Người ký không thể deny rằng họ đã ký message

**3. Integrity (Toàn vẹn)**: Message không bị thay đổi sau khi được ký

Trong Bitcoin và hầu hết blockchains, digital signatures được sử dụng để:
- **Authorize transactions**: Chứng minh bạn có quyền spend coins
- **Prove ownership**: Address derives từ public key
- **Prevent double-spending**: Mỗi transaction có unique signature
- **Enable smart contracts**: Signatures trigger contract execution

Blockchain sử dụng **public-key cryptography** (hay asymmetric cryptography) - một trong những phát minh vĩ đại nhất của cryptography hiện đại. Được giới thiệu bởi Whitfield Diffie và Martin Hellman năm 1976, công nghệ này revolutionized secure communication.

**Symmetric Cryptography** (cũ):
- Cùng một key để encrypt và decrypt
- Vấn đề: Làm sao share key securely?

```
Alice ─────[shared key]────► Encrypt ────► Internet ────► Decrypt ─────[shared key]────► Bob
```

**Asymmetric Cryptography** (mới):
- Two keys: Public key (ai cũng biết) và Private key (chỉ mình biết)
- Encrypt với public key, decrypt với private key
- Sign với private key, verify với public key

```
Alice                                                                     Bob
┌───────────────┐                                              ┌───────────────┐
│ Private Key A │                                              │ Private Key B │
│ Public Key A  │                                              │ Public Key B  │
└───────────────┘                                              └───────────────┘
      │                                                                │
      │ Sign with Private Key A                                       │
      └──► Message + Signature ───────► Internet ───────────────────► │
                                                                       │
                                              Verify with Public Key A ◄┘
                                              ✓ Authentic!
```

Bitcoin primarily sử dụng **ECDSA** (Elliptic Curve Digital Signature Algorithm) trên curve **secp256k1**. Ethereum cũng sử dụng ECDSA nhưng với một số modifications. Các blockchain mới hơn exploring alternatives như Schnorr signatures (Bitcoin Taproot) và EdDSA (Ed25519 trong Cardano, Polkadot).

---

## 2. Hiểu biết trực quan

### 2.1. The Key Pair Analogy

Hãy tưởng tượng public/private key pair như một **mailbox với unique mechanism**:

**Public Key = Địa chỉ nhà và khe thả thư**:
- Ai cũng có thể biết địa chỉ của bạn
- Ai cũng có thể gửi thư cho bạn (qua khe thả thư)
- Nhưng họ không thể lấy thư ra từ mailbox

**Private Key = Chìa khóa duy nhất mở mailbox**:
- Chỉ bạn có chìa khóa này
- Chỉ bạn có thể mở mailbox và đọc thư
- Mất chìa khóa = mất access to all mail forever

**Digital Signature = Wax seal với coat of arms duy nhất của bạn**:
- Trong thời trung cổ, letters quan trọng được seal với wax và stamped với coat of arms
- Ai cũng có thể verify seal (public verification)
- Nhưng chỉ bạn có thể tạo ra authentic seal (private signing)
- Tampering với letter sẽ break the seal

### 2.2. How Digital Signatures Work (Simplified)

**Signing Process**:
```
Message: "Alice sends 10 BTC to Bob"
                    ↓
              [Hash Function]
                    ↓
              Message Digest
                    ↓
        [Sign with Alice's Private Key]
                    ↓
              Digital Signature
```

**Verification Process**:
```
Message + Signature
        ↓
[Hash the Message] ──────────► Digest 1
        
Signature
        ↓
[Decrypt with Alice's Public Key] ──► Digest 2
        
Compare: Digest 1 == Digest 2?
    ✓ Yes → Signature valid, message authentic
    ✗ No  → Signature invalid or message tampered
```

**Key Insight**: Bạn sign the hash, không phải entire message. Tại sao?
1. **Efficiency**: Signature size không phụ thuộc vào message size
2. **Security**: Hash provides fixed-size input cho signature algorithm

### 2.3. Bitcoin Transaction Analogy

Hãy nghĩ về Bitcoin transaction như một **séc (check)**:

**Paper Check**:
```
Pay to: Bob
Amount: $100
From: Alice
Signature: [Alice's handwritten signature]
```

**Bitcoin Transaction**:
```
Pay to: Bob's address (derived from his public key)
Amount: 10 BTC
From: UTXO controlled by Alice's address
Signature: Digital signature created với Alice's private key
```

**Differences**:
- Paper check: Bank verifies signature bằng so sánh với signature on file
- Bitcoin: Any node có thể verify signature bằng toán học (public key)
- Paper check: Có thể cash same check nhiều lần (if lucky)
- Bitcoin: Double-spend impossible (transaction includes reference to specific UTXO)

---

## 3. Nền tảng kỹ thuật

### 3.1. Public-Key Cryptography Fundamentals

**Key Generation**:
Tạo một cặp keys (public, private) sao cho:
1. Không thể derive private key từ public key (one-way function)
2. Hai keys có mathematical relationship

**Mathematical Foundation**:

Dựa trên **trapdoor functions** - functions dễ compute một chiều, nhưng cực khó reverse trừ khi biết "trapdoor" (secret info).

**Example: RSA Trapdoor**:
- Easy: Nhân hai số nguyên tố lớn: \( N = p \times q \)
- Hard: Factorize \( N \) thành \( p \) và \( q \) (if N is large)
- Trapdoor: Knowing \( p \) and \( q \)

**Example: Elliptic Curve Trapdoor**:
- Easy: Scalar multiplication: \( Q = k \times G \) (Q = point, k = scalar, G = generator)
- Hard: Discrete logarithm: Given \( Q \) and \( G \), find \( k \)
- Trapdoor: Knowing \( k \) (private key)

### 3.2. Elliptic Curve Cryptography (ECC)

Bitcoin và Ethereum sử dụng **Elliptic Curve Digital Signature Algorithm (ECDSA)**.

**Why Elliptic Curves?**
- Shorter keys cho cùng security level vs RSA
- Faster computation
- Less bandwidth

**Security Comparison**:
| Symmetric | RSA | ECC | Security Level |
|-----------|-----|-----|----------------|
| 80 bits | 1024 bits | 160 bits | Weak (broken) |
| 128 bits | 3072 bits | 256 bits | Strong |
| 256 bits | 15360 bits | 512 bits | Very Strong |

**Elliptic Curve Definition**:

Một elliptic curve over finite field \( \mathbb{F}_p \) có dạng:

\[
y^2 \equiv x^3 + ax + b \pmod{p}
\]

Với điều kiện: \( 4a^3 + 27b^2 \not\equiv 0 \pmod{p} \) (non-singular)

**Bitcoin's secp256k1 Parameters**:
```
Equation: y² = x³ + 7  (a=0, b=7)
Prime: p = 2²⁵⁶ - 2³² - 2⁹ - 2⁸ - 2⁷ - 2⁶ - 2⁴ - 1
       = FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF 
         FFFFFFFF FFFFFFFF FFFFFFFE FFFFFC2F (hex)

Generator Point G:
  Gx = 79BE667E F9DCBBAC 55A06295 CE870B07
       029BFCDB 2DCE28D9 59F2815B 16F81798
  Gy = 483ADA77 26A3C465 5DA4FBFC 0E1108A8
       FD17B448 A6855419 9C47D08F FB10D4B8

Order (number of points): 
  n = FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE
      BAAEDCE6 AF48A03B BFD25E8C D0364141
```

**Point Addition** (Geometric):

Trên elliptic curve, chúng ta có thể "add" points:
- Given points P and Q
- Draw line through P and Q
- Line intersects curve tại third point R'
- Reflect R' across x-axis → R = P + Q

```
       y
       │
       │    Q
       │   /│\
       │  / │ \
       │ /  │  \
       │/   │   \
  ─────┼────┼────┼───── x
       │\   P   /
       │ \     /R'
       │  \   /
       │   \ /
       │    R (reflected)
```

**Scalar Multiplication**:

\[
Q = k \times G = \underbrace{G + G + \cdots + G}_{k \text{ times}}
\]

Efficient algorithm: **Double-and-add** (similar to binary exponentiation)

**Example** (toy numbers):
```
Private key: k = 7
Public key:  Q = 7×G = G + G + G + G + G + G + G

Using double-and-add:
7 = 111₂ (binary)
Q = 2²×G + 2¹×G + 2⁰×G = 4G + 2G + G
```

### 3.3. ECDSA Signature Scheme

**Key Generation**:
1. Choose random private key: \( d_A \in [1, n-1] \)
2. Compute public key: \( Q_A = d_A \times G \)

**Signing** (message \( m \)):
1. Compute message hash: \( e = \text{HASH}(m) \)
2. Choose random nonce: \( k \in [1, n-1] \) (MUST be unique per signature!)
3. Compute point: \( (x_1, y_1) = k \times G \)
4. Compute \( r = x_1 \mod n \). If \( r = 0 \), goto step 2
5. Compute \( s = k^{-1}(e + rd_A) \mod n \). If \( s = 0 \), goto step 2
6. Signature: \( (r, s) \)

**Verification** (message \( m \), signature \( (r,s) \), public key \( Q_A \)):
1. Verify \( r, s \in [1, n-1] \)
2. Compute message hash: \( e = \text{HASH}(m) \)
3. Compute \( w = s^{-1} \mod n \)
4. Compute \( u_1 = ew \mod n \) and \( u_2 = rw \mod n \)
5. Compute point: \( (x_1, y_1) = u_1 \times G + u_2 \times Q_A \)
6. Valid if \( r \equiv x_1 \pmod{n} \)

**Why This Works** (mathematical proof sketch):

From signing:
\[
s = k^{-1}(e + rd_A) \implies k = s^{-1}(e + rd_A)
\]

From verification:
\[
\begin{align}
u_1 \times G + u_2 \times Q_A &= ew \times G + rw \times Q_A \\
&= es^{-1} \times G + rs^{-1} \times d_A \times G \\
&= s^{-1}(e + rd_A) \times G \\
&= k \times G
\end{align}
\]

Since \( k \times G = (x_1, y_1) \) (from signing), và verification computes cùng point, nên \( r = x_1 \) ✓

### 3.4. Bitcoin Address Generation

Bitcoin address không phải là public key directly, mà derived từ public key:

**Process**:
```
Private Key (256 bits random)
      ↓
   [ECDSA secp256k1]
      ↓
Public Key (uncompressed: 65 bytes)
      ↓
   [SHA-256]
      ↓
   [RIPEMD-160]
      ↓
Public Key Hash (20 bytes)
      ↓
   [Add version byte (0x00 for mainnet)]
      ↓
   [Double SHA-256 for checksum (first 4 bytes)]
      ↓
   [Base58 encoding]
      ↓
Bitcoin Address (starts with '1' for P2PKH)
```

**Example**:
```
Private Key: 
  18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725

Public Key (uncompressed):
  04 50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
     2cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6

Public Key Hash (RIPEMD-160 of SHA-256):
  010966776006953d5567439e5e39f86a0d273bee

Bitcoin Address:
  16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM
```

**Why hashing public key?**
1. **Shorter addresses**: 160 bits vs 256 bits
2. **Quantum resistance**: Even if ECDSA broken, attacker needs to break hash too
3. **Flexibility**: Can use different signature schemes với same address format

---

## 4. Công thức toán học và mật mã học

### 4.1. ECDSA Security Analysis

**Discrete Logarithm Problem (DLP)**:

Given \( Q = k \times G \), find \( k \).

**Best Known Attacks**:
- **Pollard's rho**: \( O(\sqrt{n}) \) operations
- For 256-bit curve: \( O(2^{128}) \) operations

**Security Level**: 
Bitcoin's secp256k1 provides ~128 bits security (half of key size due to birthday paradox).

\[
\text{Security bits} = \frac{\text{Key size}}{2} = \frac{256}{2} = 128
\]

**Comparison**:
- AES-128: 128-bit security
- RSA-2048: ~112-bit security
- Secp256k1: ~128-bit security

### 4.2. Nonce Reuse Attack

**Critical Security Rule**: NEVER reuse nonce \( k \)!

**Attack Scenario**:

Suppose attacker has two signatures với same \( k \):
- Signature 1: \( (r, s_1) \) for message \( m_1 \)
- Signature 2: \( (r, s_2) \) for message \( m_2 \) (same \( r \) means same \( k \)!)

From signature equations:
\[
\begin{align}
s_1 &= k^{-1}(e_1 + rd_A) \mod n \\
s_2 &= k^{-1}(e_2 + rd_A) \mod n
\end{align}
\]

Subtract:
\[
s_1 - s_2 = k^{-1}(e_1 - e_2) \mod n
\]

Solve for \( k \):
\[
k = \frac{e_1 - e_2}{s_1 - s_2} \mod n
\]

Once attacker knows \( k \), họ có thể recover private key:
\[
d_A = \frac{sk - e}{r} \mod n
\]

**Real-World Example**: Sony PlayStation 3 hack (2010)
- Sony reused same \( k \) for all PS3 firmware signatures
- Hackers recovered Sony's private key
- Could sign arbitrary code → complete security breach

**Bitcoin Protection**:
- Deterministic nonces (RFC 6979): \( k = \text{HMAC-SHA256}(d_A, e) \)
- Ensures \( k \) is unique per message, but deterministic (no randomness failure)

### 4.3. Signature Malleability

ECDSA signatures có property: Cho valid signature \( (r, s) \), signature \( (r, -s \mod n) \) cũng valid!

**Why?**

Verification checks:
\[
r \stackrel{?}{=} x_1 \text{ where } (x_1, y_1) = u_1 G + u_2 Q_A
\]

Since elliptic curves symmetric về x-axis:
- Point \( (x, y) \) and \( (x, -y) \) cả hai đều on curve
- Both give same \( x \)-coordinate

**Problem**:
- Same transaction có thể have different transaction IDs (TXID = hash of transaction)
- Attacker có thể modify signature → change TXID
- Not theft, but can confuse wallets

**Bitcoin's Solution (BIP 62, BIP 66)**:
- Require "low S" values: \( s \leq n/2 \)
- Reject high S signatures
- Ensures canonical signature

**Better Solution: Schnorr Signatures** (Bitcoin Taproot):
- Not malleable
- Smaller signatures
- Batch verification
- More privacy

### 4.4. Quantum Computing Threat to ECDSA

**Shor's Algorithm**: Quantum algorithm có thể solve discrete logarithm in polynomial time.

\[
\text{Classical: } O(\sqrt{n}) \quad \text{vs} \quad \text{Quantum: } O((\log n)^3)
\]

**Implications**:
- Sufficiently large quantum computer có thể break ECDSA
- Can derive private key từ public key

**Timeline**:
- Current quantum computers: ~100 qubits
- Needed to break 256-bit ECDSA: ~1500-3000 logical qubits (millions of physical qubits)
- Estimate: 10-30 years until practical threat

**Bitcoin's Partial Protection**:
- Public keys không reveal until first spend
- If never spent from address: public key không known
- Attacker chỉ có public key hash (RIPEMD-160)
- Must break hash function first, then ECDSA

**Post-Quantum Alternatives**:
- **Hash-based signatures**: SPHINCS+, XMSS
- **Lattice-based**: Dilithium, Falcon
- **Code-based**: Classic McEliece

### 4.5. Threshold Signatures và Multi-Signatures

**Multi-Signature (MultiSig)**:

Require \( m \)-of-\( n \) signatures:
- Example: 2-of-3 multisig (2 out of 3 people must sign)

**Bitcoin Implementation**:
```
OP_2                           // Require 2 signatures
<PubKey1> <PubKey2> <PubKey3>  // 3 public keys
OP_3                           // From 3 total
OP_CHECKMULTISIG               // Verify
```

**Drawbacks**:
- Large transaction size (multiple signatures + public keys)
- High fees
- Privacy leak (reveals m-of-n structure)

**Threshold Signatures (TSS)**:

Cryptographic protocol tạo single signature from \( m \)-of-\( n \) parties:
- Output looks like normal single signature
- Smaller size
- Better privacy
- More complex protocol

**Example: Schnorr Threshold Signature**:

Parties jointly compute:
\[
s = k + H(R, P, m) \cdot x
\]

Where:
- \( k \): Aggregate nonce (from all parties)
- \( P \): Aggregate public key
- \( x \): Aggregate private key (no single party knows this!)

Verifier sees normal signature, không biết it's threshold!

---

## 5. Implementation Insight

### 5.1. ECDSA Implementation (Python)

```python
import hashlib
import secrets
from typing import Tuple

# Secp256k1 parameters
P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
G = (Gx, Gy)

def modinv(a: int, m: int) -> int:
    """Modular multiplicative inverse using Extended Euclidean Algorithm"""
    if a < 0:
        a = (a % m + m) % m
    g, x, _ = extended_gcd(a, m)
    if g != 1:
        raise Exception('Modular inverse does not exist')
    return x % m

def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """Extended Euclidean Algorithm"""
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y

def point_add(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
    """Add two points on elliptic curve"""
    if p1 is None:  # Identity element
        return p2
    if p2 is None:
        return p1
    
    x1, y1 = p1
    x2, y2 = p2
    
    if x1 == x2:
        if y1 == y2:
            # Point doubling
            s = (3 * x1 * x1 * modinv(2 * y1, P)) % P
        else:
            # Points are inverse of each other
            return None
    else:
        # Point addition
        s = ((y2 - y1) * modinv(x2 - x1, P)) % P
    
    x3 = (s * s - x1 - x2) % P
    y3 = (s * (x1 - x3) - y1) % P
    
    return (x3, y3)

def point_multiply(k: int, point: Tuple[int, int]) -> Tuple[int, int]:
    """Scalar multiplication using double-and-add algorithm"""
    if k == 0:
        return None
    if k == 1:
        return point
    
    result = None
    addend = point
    
    while k:
        if k & 1:
            result = point_add(result, addend)
        addend = point_add(addend, addend)
        k >>= 1
    
    return result

class ECDSA:
    @staticmethod
    def generate_keypair() -> Tuple[int, Tuple[int, int]]:
        """Generate private/public key pair"""
        # Private key: random number in [1, n-1]
        private_key = secrets.randbelow(N - 1) + 1
        
        # Public key: private_key * G
        public_key = point_multiply(private_key, G)
        
        return private_key, public_key
    
    @staticmethod
    def sign(message: bytes, private_key: int) -> Tuple[int, int]:
        """Sign message with private key"""
        # Hash message
        e = int.from_bytes(hashlib.sha256(message).digest(), 'big')
        
        while True:
            # Generate deterministic nonce (simplified RFC 6979)
            k = int.from_bytes(
                hashlib.sha256(
                    private_key.to_bytes(32, 'big') + message
                ).digest(),
                'big'
            ) % (N - 1) + 1
            
            # Compute r = (k * G).x mod n
            point = point_multiply(k, G)
            if point is None:
                continue
            r = point[0] % N
            if r == 0:
                continue
            
            # Compute s = k^(-1) * (e + r * private_key) mod n
            s = (modinv(k, N) * (e + r * private_key)) % N
            if s == 0:
                continue
            
            # Ensure low S (BIP 62)
            if s > N // 2:
                s = N - s
            
            return (r, s)
    
    @staticmethod
    def verify(message: bytes, signature: Tuple[int, int], 
               public_key: Tuple[int, int]) -> bool:
        """Verify signature"""
        r, s = signature
        
        # Check signature bounds
        if not (1 <= r < N and 1 <= s < N):
            return False
        
        # Hash message
        e = int.from_bytes(hashlib.sha256(message).digest(), 'big')
        
        # Compute w = s^(-1) mod n
        w = modinv(s, N)
        
        # Compute u1 = e * w mod n and u2 = r * w mod n
        u1 = (e * w) % N
        u2 = (r * w) % N
        
        # Compute point = u1 * G + u2 * public_key
        point1 = point_multiply(u1, G)
        point2 = point_multiply(u2, public_key)
        point = point_add(point1, point2)
        
        if point is None:
            return False
        
        # Verify r == point.x mod n
        return r == point[0] % N

# Example usage
if __name__ == "__main__":
    print("=== ECDSA Example ===\n")
    
    # Generate keys
    print("1. Generating key pair...")
    private_key, public_key = ECDSA.generate_keypair()
    print(f"Private key: {hex(private_key)[:70]}...")
    print(f"Public key:  ({hex(public_key[0])[:50]}...,")
    print(f"              {hex(public_key[1])[:50]}...)\n")
    
    # Sign message
    message = b"Alice sends 10 BTC to Bob"
    print(f"2. Signing message: {message.decode()}")
    signature = ECDSA.sign(message, private_key)
    print(f"Signature (r, s):")
    print(f"  r = {hex(signature[0])[:70]}...")
    print(f"  s = {hex(signature[1])[:70]}...\n")
    
    # Verify signature
    print("3. Verifying signature...")
    is_valid = ECDSA.verify(message, signature, public_key)
    print(f"Verification result: {'✓ Valid' if is_valid else '✗ Invalid'}\n")
    
    # Try tampering with message
    tampered_message = b"Alice sends 100 BTC to Bob"
    print(f"4. Verifying tampered message: {tampered_message.decode()}")
    is_valid_tampered = ECDSA.verify(tampered_message, signature, public_key)
    print(f"Verification result: {'✓ Valid' if is_valid_tampered else '✗ Invalid (Expected!)'}\n")
    
    # Demonstrate signature size
    print("5. Signature properties:")
    print(f"Message size: {len(message)} bytes")
    print(f"Signature size: 64 bytes (r: 32 bytes, s: 32 bytes)")
    print(f"Public key size: 64 bytes (uncompressed)")
    print(f"Compression: Can compress public key to 33 bytes")
```

### 5.2. Bitcoin Transaction Signing

```python
import hashlib
from typing import List, Tuple

class BitcoinTransaction:
    def __init__(self):
        self.version = 1
        self.inputs: List[dict] = []
        self.outputs: List[dict] = []
        self.locktime = 0
    
    def add_input(self, prev_tx: str, prev_index: int, script_pubkey: bytes):
        """Add input to transaction"""
        self.inputs.append({
            'prev_tx': bytes.fromhex(prev_tx),
            'prev_index': prev_index,
            'script_pubkey': script_pubkey,  # For signing
            'script_sig': b'',  # Will be filled with signature
            'sequence': 0xFFFFFFFF
        })
    
    def add_output(self, amount: int, script_pubkey: bytes):
        """Add output to transaction"""
        self.outputs.append({
            'amount': amount,
            'script_pubkey': script_pubkey
        })
    
    def serialize_for_signature(self, input_index: int) -> bytes:
        """Serialize transaction for signing (SIGHASH_ALL)"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Number of inputs
        result += len(self.inputs).to_bytes(1, 'little')
        
        # Inputs
        for i, inp in enumerate(self.inputs):
            # Previous output
            result += inp['prev_tx'][::-1]  # Reverse for little-endian
            result += inp['prev_index'].to_bytes(4, 'little')
            
            # Script
            if i == input_index:
                # Include script_pubkey for the input being signed
                script = inp['script_pubkey']
                result += len(script).to_bytes(1, 'little')
                result += script
            else:
                # Empty script for other inputs
                result += b'\x00'
            
            # Sequence
            result += inp['sequence'].to_bytes(4, 'little')
        
        # Number of outputs
        result += len(self.outputs).to_bytes(1, 'little')
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            script = out['script_pubkey']
            result += len(script).to_bytes(1, 'little')
            result += script
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        # Hash type (SIGHASH_ALL)
        result += (1).to_bytes(4, 'little')
        
        return result
    
    def sign_input(self, input_index: int, private_key: int):
        """Sign specific input"""
        # Serialize for signing
        preimage = self.serialize_for_signature(input_index)
        
        # Double SHA-256
        sighash = hashlib.sha256(hashlib.sha256(preimage).digest()).digest()
        
        # Sign
        signature = ECDSA.sign(sighash, private_key)
        
        # Create DER-encoded signature + SIGHASH type
        signature_der = self.der_encode_signature(signature) + b'\x01'  # SIGHASH_ALL
        
        # Create scriptSig (signature + public key)
        public_key = point_multiply(private_key, G)
        pubkey_bytes = self.serialize_public_key(public_key)
        
        script_sig = (
            len(signature_der).to_bytes(1, 'little') + signature_der +
            len(pubkey_bytes).to_bytes(1, 'little') + pubkey_bytes
        )
        
        self.inputs[input_index]['script_sig'] = script_sig
    
    @staticmethod
    def der_encode_signature(signature: Tuple[int, int]) -> bytes:
        """DER encode ECDSA signature"""
        r, s = signature
        
        # Encode r
        r_bytes = r.to_bytes((r.bit_length() + 7) // 8, 'big')
        if r_bytes[0] & 0x80:  # Add 0x00 if high bit set
            r_bytes = b'\x00' + r_bytes
        
        # Encode s
        s_bytes = s.to_bytes((s.bit_length() + 7) // 8, 'big')
        if s_bytes[0] & 0x80:
            s_bytes = b'\x00' + s_bytes
        
        # DER structure: 0x30 [total-length] 0x02 [r-length] [r] 0x02 [s-length] [s]
        result = (
            b'\x02' + len(r_bytes).to_bytes(1, 'little') + r_bytes +
            b'\x02' + len(s_bytes).to_bytes(1, 'little') + s_bytes
        )
        result = b'\x30' + len(result).to_bytes(1, 'little') + result
        
        return result
    
    @staticmethod
    def serialize_public_key(public_key: Tuple[int, int], compressed=True) -> bytes:
        """Serialize public key"""
        x, y = public_key
        
        if compressed:
            # Compressed: 0x02 or 0x03 (depending on y parity) + x
            prefix = b'\x02' if y % 2 == 0 else b'\x03'
            return prefix + x.to_bytes(32, 'big')
        else:
            # Uncompressed: 0x04 + x + y
            return b'\x04' + x.to_bytes(32, 'big') + y.to_bytes(32, 'big')

# Example
if __name__ == "__main__":
    print("=== Bitcoin Transaction Signing Example ===\n")
    
    # Create transaction
    tx = BitcoinTransaction()
    
    # Add input (spending previous output)
    prev_tx_id = "a1b2c3d4" * 16  # 32-byte transaction ID
    tx.add_input(prev_tx_id, 0, b'\x76\xa9\x14' + b'\x00' * 20 + b'\x88\xac')  # P2PKH
    
    # Add outputs
    tx.add_output(1000000, b'\x76\xa9\x14' + b'\x11' * 20 + b'\x88\xac')  # To Bob
    tx.add_output(500000, b'\x76\xa9\x14' + b'\x22' * 20 + b'\x88\xac')   # Change
    
    # Sign
    private_key, _ = ECDSA.generate_keypair()
    tx.sign_input(0, private_key)
    
    print("Transaction signed successfully!")
    print(f"Input 0 scriptSig length: {len(tx.inputs[0]['script_sig'])} bytes")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Key Management Challenges

**Problem**: Losing private key = losing all funds forever

**Statistics**:
- Estimated 3-4 million BTC lost forever (20% of total supply)
- Mostly from lost private keys

**Solutions**:
- **Hardware wallets**: Ledger, Trezor - dedicated secure devices
- **Multi-signature wallets**: Require multiple keys (family members, devices)
- **Social recovery**: Trusted contacts can help recover (Argent wallet)
- **Shamir's Secret Sharing**: Split key into n shares, need k to recover

**Trade-offs**:
```
Security ←────────────────────────────────────► Convenience

Hardware wallet        Software wallet        Exchange custodial
(Most secure)         (Medium)               (Least secure, most convenient)
```

### 6.2. Signature Schemes Comparison

| Scheme | Signature Size | Verification | Batch Verify | Linearity | Status |
|--------|---------------|--------------|--------------|-----------|--------|
| ECDSA | 64 bytes | Medium | No | No | Bitcoin (current) |
| Schnorr | 64 bytes | Fast | Yes | Yes | Bitcoin Taproot |
| EdDSA | 64 bytes | Fast | Yes | No | Ed25519 (other chains) |
| BLS | 48 bytes (G1) | Slow | Yes | Yes | Ethereum 2.0 |
| Aggregate | ~48-64 bytes for all | Fast | Built-in | Yes | Future |

**ECDSA Limitations**:
- Malleable signatures
- No batch verification
- Large multisig transactions

**Schnorr Advantages** (Bitcoin Taproot upgrade):
- Non-malleable
- Batch verification (verify multiple signatures at once)
- Key aggregation (n keys → 1 aggregate key)
- Better privacy (multisig looks like single-sig)

### 6.3. Side-Channel Attacks

**Timing Attacks**:
- Measure time taken for signature generation
- Can leak information about private key
- **Mitigation**: Constant-time implementations

**Power Analysis**:
- Measure power consumption during signing
- Can extract private key from hardware wallets
- **Mitigation**: Randomized algorithms, physical shielding

**Fault Attacks**:
- Induce hardware faults during signing (voltage glitching)
- Can reveal private key
- **Real example**: PS3 hack used fault to extract signing key

### 6.4. Nonce Generation Failures

**Biased Nonces**:
Android Bitcoin wallets (2013) used weak random number generation:
- Predictable nonces
- Private keys extracted
- Funds stolen

**Solution**: Deterministic nonces (RFC 6979)
```
k = HMAC-SHA256(private_key, message_hash)
```

Pro: No randomness needed, reproducible
Con: If hash function broken, could be problematic

### 6.5. Transaction Malleability (Historical Issue)

**Mt. Gox Incident** (partial cause):
- Attackers modified transaction signatures
- Changed transaction IDs
- Exchange software confused, thought transactions failed
- Sent funds again → double payment

**Fix**: SegWit (Segregated Witness)
- Separates signature data from transaction data
- TXID computed without signatures
- Malleability no longer affects TXID

---

## 7. Các khái niệm liên quan

### 7.1. Zero-Knowledge Proofs

Extension of digital signatures concept:

**Digital Signature**: Prove "I know private key" + message
**Zero-Knowledge Proof**: Prove "I know secret X" without revealing X

**Example: zk-SNARKs** (Zcash):
- Prove transaction valid without revealing amounts/addresses
- Uses elliptic curve pairings
- Much more complex than ECDSA

### 7.2. Ring Signatures (Monero)

**Concept**: Signature could be from any member of a "ring" of public keys

```
Ring: [Alice's key, Bob's key, Charlie's key]
Signature proves: "One of these three people signed"
But doesn't reveal which one!
```

**Privacy benefit**: Sender anonymity

**Trade-off**: Larger signatures (multiple keys)

### 7.3. Blind Signatures

Signer signs message without seeing its content:

**Process**:
1. Alice blinds message: \( m' = \text{blind}(m, r) \)
2. Signer signs: \( \sigma' = \text{sign}(m') \)
3. Alice unblinds: \( \sigma = \text{unblind}(\sigma', r) \)
4. \( \sigma \) is valid signature on \( m \)!

**Application**: E-cash (anonymous digital money)

### 7.4. Threshold Signatures vs Multi-Signatures

**Multi-Signature**:
- Each party signs independently
- Combine n signatures
- Size: \( O(n) \)

**Threshold Signature**:
- Parties run interactive protocol
- Generate single signature
- Size: \( O(1) \)

**Example**:
```
3-of-5 MultiSig: 3 full signatures + 5 public keys ≈ 450 bytes
3-of-5 Threshold: 1 signature + 1 aggregate public key ≈ 96 bytes
```

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"New Directions in Cryptography"** | 1976 | Diffie, Hellman | Invented public-key cryptography concept |
| **"A Method for Obtaining Digital Signatures"** | 1978 | Rivest, Shamir, Adelman | RSA algorithm - first practical PKC |
| **"A Digital Signature Based on a Conventional Encryption Function"** | 1987 | Ralph Merkle | Merkle signature scheme |
| **"Elliptic Curve Cryptosystems"** | 1985 | Neal Koblitz | ECC foundation |
| **"Elliptic Curve Discrete Logarithm Problem"** | 1985 | Victor Miller | ECC foundation |
| **"Digital Signature Standard (DSS)"** | 1994 | NIST FIPS 186 | ECDSA standardization |
| **"SEC 2: Recommended Elliptic Curve Domain Parameters"** | 2010 | SECG | secp256k1 specification (Bitcoin) |
| **"Deterministic Usage of DSA and ECDSA"** | 2013 | RFC 6979 | Deterministic nonce generation |
| **"Schnorr Signatures for Bitcoin"** | 2018 | Pieter Wuille (BIP 340) | Schnorr in Bitcoin |
| **"Compact Multi-Signatures for Smaller Blockchains"** | 2018 | Boneh et al. | BLS signatures |

**Essential Reading**:
1. Diffie-Hellman paper: Revolutionary PKC concept
2. NIST FIPS 186-4: Authoritative ECDSA spec
3. RFC 6979: How to safely generate nonces
4. BIP 340: Bitcoin's Schnorr implementation

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Description | Source | Notes |
|-------------|--------|-------|
| **Elliptic curve visualization** | [Andrea Corbellini's ECC Series](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/) | Best visual introduction to ECC |
| **ECDSA algorithm flow** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/transactions.html) | Practical implementation |
| **Key generation process** | [Mastering Bitcoin Ch4](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch04.asciidoc) | From private key to address |
| **Digital signature process** | [Practical Cryptography](http://www.crypto-it.net/eng/theory/digital-signature.html) | Step-by-step visualization |
| **secp256k1 curve plot** | [Desmos secp256k1](https://www.desmos.com/calculator/ialhd71we3) | Interactive curve exploration |

**Interactive Tools**:
- [Anders Brownworth - Public/Private Keys](https://andersbrownworth.com/blockchain/public-private-keys) - Visual demo
- [Bitcoin Address Generator](https://www.bitaddress.org) - See key generation live (USE OFFLINE!)
- [ECC Point Calculator](https://www.desmos.com/calculator/ialhd71we3) - Play with elliptic curves

---

## 10. Tóm tắt và điểm chính

**Core Concepts**:
1. Digital signatures provide authentication, non-repudiation, và integrity
2. Based on public-key cryptography với key pairs (public, private)
3. ECDSA on secp256k1 is Bitcoin's signature scheme
4. Security relies on hardness of elliptic curve discrete logarithm problem

**Technical Foundation**:
- Key generation: Private key (random), Public key = private × G
- Signing: \( (r, s) \) where \( s = k^{-1}(e + rd_A) \mod n \)
- Verification: Check \( r \stackrel{?}{=} (u_1 G + u_2 Q_A).x \mod n \)
- ~128-bit security level (256-bit keys)

**Blockchain Applications**:
- Transaction authorization: Prove you own coins
- Address generation: Hash of public key
- Smart contract interaction: Signatures trigger execution
- Multi-signature wallets: Multiple keys control funds

**Security Considerations**:
- NEVER reuse nonces (k) - leads to private key exposure
- Quantum computing threat (Shor's algorithm) - timeline: 10-30 years
- Key management critical - loss = permanent fund loss
- Side-channel attacks on hardware implementations

**Modern Improvements**:
- Schnorr signatures (Bitcoin Taproot): Better privacy, batch verification
- Deterministic nonces (RFC 6979): No randomness failures
- Threshold signatures: n-of-m without revealing structure
- BLS signatures (Ethereum 2.0): Signature aggregation

**Key Takeaway**: Digital signatures are the cryptographic primitive that enables decentralized ownership and control in blockchain - transforming "possession of private key" into "control of digital assets" through mathematical proofs.

---

✅ **End of Lecture 00.03**

**Next**: Chapter 01 - Bitcoin: Architecture và Proof-of-Work

---

## Video tham khảo

- **Xem trước:** [What are Digital Signatures? - Computerphile](https://www.youtube.com/watch?v=s22eJ1eVLTU) — Computerphile, tiếng Anh. Computerphile tách người ký và người xác minh, rồi ký trên hash của thông điệp; xem trước mục authenticity.
- [Elliptic Curves - Computerphile](https://www.youtube.com/watch?v=NF1pwjL9-DE) — Computerphile, tiếng Anh. Đường cong elliptic và bài toán logarit rời rạc; nền cho ECDSA trên secp256k1 ở phần toán.
- [Public Key Cryptography - Computerphile](https://www.youtube.com/watch?v=GSIDS_lvRv4) — Computerphile, tiếng Anh. Cặp khóa công khai và bí mật, đúng bước sinh khóa trước khi bài đi vào công thức ký và xác minh.

## References

1. Diffie, W., & Hellman, M. (1976). *New directions in cryptography*. IEEE transactions on Information Theory, 22(6), 644-654.
2. Koblitz, N. (1987). *Elliptic curve cryptosystems*. Mathematics of computation, 48(177), 203-209.
3. Johnson, D., Menezes, A., & Vanstone, S. (2001). *The elliptic curve digital signature algorithm (ECDSA)*. International journal of information security, 1(1), 36-63.
4. Pornin, T. (2013). *RFC 6979: Deterministic usage of the digital signature algorithm (DSA) and elliptic curve digital signature algorithm (ECDSA)*.
5. Wuille, P., Nick, J., & Ruffing, T. (2020). *BIP 340: Schnorr signatures for secp256k1*.
6. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.

