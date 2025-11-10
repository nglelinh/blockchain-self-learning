---
layout: post
title: "Lecture 00.02: Cryptographic Hash Functions - Nền tảng của Blockchain"
chapter: '00'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Cryptographic Hash Functions - Nền tảng của Blockchain

## 1. Tổng quan về khái niệm

Nếu blockchain là một tòa nhà, thì **cryptographic hash functions** chính là những viên gạch cơ bản nhất xây nên nền móng của nó. Mọi aspect của blockchain - từ linking blocks lại với nhau, đến verifying transactions, đến mining new blocks - đều dựa trên hash functions.

Một **hash function** là một thuật toán toán học nhận input có độ dài bất kỳ và tạo ra output có độ dài cố định, được gọi là **hash**, **digest**, hoặc **fingerprint**. Ví dụ, SHA-256 (Secure Hash Algorithm 256-bit) - hash function được Bitcoin sử dụng - luôn tạo ra output 256 bits (32 bytes), bất kể input là 1 byte hay 1 gigabyte.

Tuy nhiên, không phải hash function nào cũng là **cryptographic** hash function. Để được coi là cryptographic, một hash function phải thỏa mãn ba tính chất bảo mật quan trọng:

**1. Pre-image Resistance (One-wayness)**:
Cho hash value \( h \), cực kỳ khó (computational infeasible) tìm ra bất kỳ message \( m \) nào sao cho \( H(m) = h \).

Đây là tính chất "một chiều" - dễ dàng tính hash từ message, nhưng không thể reverse để tìm message từ hash. Giống như việc pha một cốc cà phê sữa - dễ pha, nhưng không thể tách riêng cà phê và sữa ra sau khi đã trộn.

**2. Second Pre-image Resistance (Weak Collision Resistance)**:
Cho một message \( m_1 \), cực kỳ khó tìm một message khác \( m_2 \neq m_1 \) sao cho \( H(m_1) = H(m_2) \).

Điều này đảm bảo rằng không ai có thể tạo ra một document giả mạo có cùng hash với document gốc.

**3. Collision Resistance (Strong Collision Resistance)**:
Cực kỳ khó tìm bất kỳ hai messages khác nhau \( m_1 \neq m_2 \) nào sao cho \( H(m_1) = H(m_2) \).

Điều này mạnh hơn second pre-image resistance vì attacker có quyền chọn cả hai messages.

Tại sao những tính chất này quan trọng cho blockchain?

- **Integrity**: Pre-image resistance đảm bảo hash có thể được dùng làm commitment - một khi hash được publish, bạn không thể thay đổi data mà không bị phát hiện

- **Uniqueness**: Collision resistance đảm bảo mỗi block có một "digital fingerprint" duy nhất

- **Chain Linking**: Mỗi block chứa hash của block trước nó. Thay đổi bất kỳ block nào sẽ thay đổi hash của nó, phá vỡ chain

- **Proof-of-Work**: Mining process yêu cầu tìm input sao cho hash output thỏa mãn điều kiện nhất định (ví dụ: bắt đầu với N số 0)

**Lịch sử và Evolution**:

Hash functions đã evolve qua nhiều thế hệ:

- **MD5** (1991): 128-bit output, bị broken - collisions được tìm ra trong vài giây
- **SHA-1** (1995): 160-bit output, deprecated - collision attack thực tế từ 2017
- **SHA-2 family** (2001): SHA-224, SHA-256, SHA-384, SHA-512 - hiện tại được sử dụng rộng rãi
- **SHA-3** (2015): Based on Keccak, alternative to SHA-2 (không phải vì SHA-2 broken)
- **BLAKE2, BLAKE3**: Modern, faster alternatives

Bitcoin sử dụng **SHA-256**, Ethereum ban đầu dùng **Keccak-256** (variant của SHA-3) cho hầu hết operations, và **Ethash** (memory-hard function based on Keccak) cho mining.

---

## 2. Hiểu biết trực quan

### 2.1. Hash như "Digital Fingerprint"

Hãy tưởng tượng hash function như một cỗ máy magic:

```
Input (any size)          Hash Function         Output (fixed size)
================         ==============        ===================
"Hello"          ──────►   SHA-256    ──────►  2cf24dba5fb0a30e...
"Hello!"         ──────►   SHA-256    ──────►  8cd02f4e3e55da54...
[Entire Harry    ──────►   SHA-256    ──────►  a7b38c29e4f15c83...
 Potter book]
```

Quan sát:
1. Output luôn có độ dài 256 bits (64 ký tự hex), bất kể input
2. Thay đổi một ký tự trong input → output thay đổi hoàn toàn (avalanche effect)
3. Không thể đoán input từ output

### 2.2. Avalanche Effect

Đây là property quan trọng nhất của cryptographic hash functions - một thay đổi nhỏ trong input gây ra thay đổi lớn, không predictable trong output:

```
Input:  "The quick brown fox jumps over the lazy dog"
SHA256: d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592

Input:  "The quick brown fox jumps over the lazy dag"  (dog → dag)
SHA256: 78fb6e83e84ca651a75de8e17c3e0f8afffe3dc71a7fe0dd8e5bff7f4b2f8e29
```

Chỉ thay đổi 1 chữ cái, nhưng hash hoàn toàn khác! Không có pattern nào giữa hai hashes.

### 2.3. One-Way Street Analogy

Hash function giống như một **one-way street**:

```
Message ─────[Hash Function]────► Hash Value
             ═══════════════
              Easy this way
                    
Message ◄────[Reverse?????]────── Hash Value
             ═══════════════
            Impossible this way
```

Với SHA-256, để "reverse" một hash, bạn phải thử trung bình \( 2^{256} \) messages khác nhau. Con số này lớn đến mức:

\[
2^{256} \approx 10^{77}
\]

So sánh:
- Số nguyên tử trong observable universe: \( \approx 10^{80} \)
- Số giây kể từ Big Bang: \( \approx 4.3 \times 10^{17} \)

Ngay cả khi bạn có tất cả computers trên Trái Đất, mất hàng tỷ năm cũng không thể brute-force một SHA-256 hash.

### 2.4. Pigeonhole Principle và Collisions

Về mặt lý thuyết, collisions **must exist**. Tại sao?

**Pigeonhole Principle**: Nếu bạn có nhiều items hơn số containers, ít nhất một container phải chứa nhiều hơn một item.

- Input space: infinite (messages có thể có bất kỳ độ dài nào)
- Output space: \( 2^{256} \) possible hashes
- Infinite > \( 2^{256} \) → must have collisions!

Nhưng tìm ra một collision trong practice là cực kỳ khó. Theo **Birthday Paradox**, cần khoảng \( 2^{128} \) random hashes trước khi có 50% chance tìm ra collision cho SHA-256.

\[
2^{128} \approx 3.4 \times 10^{38}
\]

Với current computing power, điều này vẫn là impossible.

---

## 3. Nền tảng kỹ thuật

### 3.1. SHA-256 Algorithm Structure

SHA-256 thuộc **Merkle-Damgård construction**, work theo các bước:

**Step 1: Preprocessing (Padding)**

Message được pad để độ dài chia hết cho 512 bits:
- Append bit '1'
- Append k bits '0' where \( k \) thỏa mãn: \( (\text{message length} + 1 + k) \equiv 448 \pmod{512} \)
- Append 64-bit representation của original message length

**Example**:
```
Original message: "abc" = 01100001 01100010 01100011 (24 bits)

After padding:
01100001 01100010 01100011 1 0000...0000 (423 bits) 0000...011000 (64 bits)
|-------- abc --------| ^ |---- k zeros ----| |--- length = 24 ---|
                       |
                    append 1
Total: 512 bits (one block)
```

**Step 2: Initialize Hash Values**

SHA-256 sử dụng 8 initial hash values (H₀ - H₇), each 32 bits:
```
H₀ = 0x6a09e667    (first 32 bits of fractional parts of √2)
H₁ = 0xbb67ae85    (√3)
H₂ = 0x3c6ef372    (√5)
...
H₇ = 0x5be0cd19    (√19)
```

Những số này không random - chúng là fractional parts của square roots của first 8 primes, để prove không có backdoors.

**Step 3: Process Message in 512-bit Blocks**

Mỗi block đi qua 64 rounds của operations:

**Round Function Components**:
1. **Ch(x,y,z)**: Choose function
   \[
   \text{Ch}(x, y, z) = (x \land y) \oplus (\neg x \land z)
   \]
   "If x then y else z"

2. **Maj(x,y,z)**: Majority function
   \[
   \text{Maj}(x, y, z) = (x \land y) \oplus (x \land z) \oplus (y \land z)
   \]
   "Majority vote of three bits"

3. **Σ₀(x), Σ₁(x)**: Rotation functions
   \[
   \begin{align}
   \Sigma_0(x) &= \text{ROTR}^2(x) \oplus \text{ROTR}^{13}(x) \oplus \text{ROTR}^{22}(x) \\
   \Sigma_1(x) &= \text{ROTR}^6(x) \oplus \text{ROTR}^{11}(x) \oplus \text{ROTR}^{25}(x)
   \end{align}
   \]

4. **σ₀(x), σ₁(x)**: Shift and rotation
   \[
   \begin{align}
   \sigma_0(x) &= \text{ROTR}^7(x) \oplus \text{ROTR}^{18}(x) \oplus \text{SHR}^3(x) \\
   \sigma_1(x) &= \text{ROTR}^{17}(x) \oplus \text{ROTR}^{19}(x) \oplus \text{SHR}^{10}(x)
   \end{align}
   \]

**Main Loop** (64 rounds):
```
For t = 0 to 63:
    T₁ = h + Σ₁(e) + Ch(e,f,g) + Kₜ + Wₜ
    T₂ = Σ₀(a) + Maj(a,b,c)
    h = g
    g = f
    f = e
    e = d + T₁
    d = c
    c = b
    b = a
    a = T₁ + T₂
```

Where:
- a, b, c, d, e, f, g, h: Eight 32-bit working variables
- Kₜ: Round constants (first 32 bits of fractional parts of cube roots of first 64 primes)
- Wₜ: Message schedule (derived from input block)

**Step 4: Output**

Final hash = concatenation of H₀ + H₁ + ... + H₇ (256 bits total)

### 3.2. Message Schedule (W Array)

W array được tạo từ 512-bit block:

```python
# First 16 words: directly from message block
W[0..15] = message_block[0..15]  # Each word is 32 bits

# Remaining 48 words: derived from previous words
for t in range(16, 64):
    W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]
```

Việc này ensures rằng mỗi bit của input ảnh hưởng đến nhiều bits của output (diffusion).

### 3.3. Properties Analysis

**Deterministic**:
\[
\forall m: H(m) \text{ always produces same output}
\]

**Uniform Distribution**:
Cho random input, mỗi bit trong output có probability ≈ 0.5 là 0 hoặc 1.

**Avalanche Effect** (strict avalanche criterion):
Flip one input bit → on average 50% output bits flip.

Đo lường:
\[
\text{Avalanche} = \frac{\text{Number of flipped bits in output}}{256} \times 100\%
\]

For good hash: Avalanche ≈ 50% ± small variance

**Compression**:
\[
|H(m)| = 256 \text{ bits, regardless of } |m|
\]

---

## 4. Công thức toán học và mật mã học

### 4.1. Collision Resistance - Mathematical Analysis

**Birthday Paradox** application:

Trong một set có \( N \) possible values, probability của finding collision sau \( k \) random samples:

\[
P(\text{collision}) \approx 1 - e^{-k(k-1)/(2N)}
\]

For 50% probability:
\[
k \approx \sqrt{\frac{N \cdot \ln 2}{2}} \approx 1.17\sqrt{N}
\]

For SHA-256 with \( N = 2^{256} \):
\[
k \approx 1.17 \times 2^{128} \approx 3.99 \times 10^{38}
\]

**Time to find collision** (brute force):

Giả sử computational power: \( C \) hashes/second

\[
\text{Time} = \frac{k}{C}
\]

**Example calculation**:
- Assume entire Bitcoin network: \( C \approx 600 \times 10^{18} \) hashes/sec (600 EH/s)
- Time to 50% collision probability:
  \[
  T = \frac{3.99 \times 10^{38}}{600 \times 10^{18}} \approx 6.65 \times 10^{17} \text{ seconds}
  \]
  \[
  T \approx 2.1 \times 10^{10} \text{ years} = 21 \text{ billion years}
  \]

Universe age: ~13.8 billion years. Even with entire Bitcoin network, would take longer than universe age!

### 4.2. Pre-image Resistance

Probability của finding pre-image (brute force):

For hash output \( h \), try random inputs until finding \( m \) where \( H(m) = h \).

Average attempts needed:
\[
E[\text{attempts}] = \frac{2^{256}}{2} = 2^{255}
\]

**Comparison with physical processes**:

Landauer's principle: minimum energy to flip one bit at temperature T:
\[
E_{\text{min}} = kT \ln 2
\]

At T = 300K (room temperature):
\[
E_{\text{min}} \approx 2.87 \times 10^{-21} \text{ joules}
\]

Energy to compute \( 2^{256} \) hashes:
\[
E_{\text{total}} = 2^{256} \times 2.87 \times 10^{-21} \approx 3.3 \times 10^{56} \text{ joules}
\]

**Mass-energy equivalence** (\( E = mc^2 \)):
\[
m = \frac{E}{c^2} \approx \frac{3.3 \times 10^{56}}{9 \times 10^{16}} \approx 3.7 \times 10^{39} \text{ kg}
\]

For comparison:
- Mass of Earth: \( 5.97 \times 10^{24} \) kg
- Mass of Sun: \( 1.99 \times 10^{30} \) kg
- Our number: \( 3.7 \times 10^{39} \) kg ≈ 1.8 billion suns!

Breaking SHA-256 by brute force would require converting mass equivalent to 1.8 billion suns into energy - **thermodynamically impossible**.

### 4.3. Second Pre-image Resistance

Harder to break than collision resistance:

Given \( m_1 \), find \( m_2 \neq m_1 \) where \( H(m_1) = H(m_2) \).

Cannot use birthday attack (requires choosing both messages).

Must brute-force search:
\[
\text{Expected attempts} = 2^{256}
\]

**Generic attack complexity**:
- Collision resistance: \( O(2^{n/2}) \) where n = hash length
- Pre-image resistance: \( O(2^n) \)
- Second pre-image resistance: \( O(2^n) \)

For SHA-256 (n=256):
- Finding collision: \( 2^{128} \) operations (still infeasible)
- Finding pre-image: \( 2^{256} \) operations (absolutely infeasible)

### 4.4. Length Extension Attack (và cách SHA-256 vulnerable)

SHA-256 (và SHA-1, MD5) sử dụng Merkle-Damgård construction, vulnerable to length extension:

Cho \( H(m) \), attacker có thể tính \( H(m || m') \) mà không biết \( m \), chỉ biết \( H(m) \) và length của \( m \).

**Why?**
Final hash value IS the internal state. Attacker có thể:
1. Initialize hash state với \( H(m) \)
2. Continue hashing with \( m' \)
3. Get \( H(m || \text{padding}(m) || m') \)

**Example attack scenario**:
```
Legitimate: secret || message → HMAC
Attacker sees: H(secret || message)
Attacker computes: H(secret || message || padding || malicious_data)
```

**Mitigation**:
- Use HMAC (Hash-based Message Authentication Code):
  \[
  \text{HMAC}(K, m) = H((K \oplus \text{opad}) || H((K \oplus \text{ipad}) || m))
  \]
- Use SHA-3 (not vulnerable - uses sponge construction)

---

## 5. Implementation Insight

### 5.1. Pure Python Implementation của SHA-256

```python
import struct

def rotr(n, b, bits=32):
    """Rotate right"""
    return ((n >> b) | (n << (bits - b))) & ((1 << bits) - 1)

def shr(n, b):
    """Shift right"""
    return n >> b

class SHA256:
    # Initial hash values (first 32 bits of fractional parts of √primes)
    H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]
    
    # Round constants (first 32 bits of fractional parts of ∛primes)
    K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
    
    @staticmethod
    def Ch(x, y, z):
        """Choose: if x then y else z"""
        return (x & y) ^ (~x & z)
    
    @staticmethod
    def Maj(x, y, z):
        """Majority: vote of x, y, z"""
        return (x & y) ^ (x & z) ^ (y & z)
    
    @staticmethod
    def Sigma0(x):
        return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)
    
    @staticmethod
    def Sigma1(x):
        return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)
    
    @staticmethod
    def sigma0(x):
        return rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)
    
    @staticmethod
    def sigma1(x):
        return rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)
    
    @classmethod
    def hash(cls, message: bytes) -> str:
        """Compute SHA-256 hash of message"""
        # Preprocessing: Padding
        ml = len(message) * 8  # Message length in bits
        message += b'\x80'  # Append '1' bit
        
        # Append zeros until length ≡ 448 (mod 512)
        while (len(message) * 8) % 512 != 448:
            message += b'\x00'
        
        # Append original length as 64-bit big-endian integer
        message += struct.pack('>Q', ml)
        
        # Initialize hash values
        h0, h1, h2, h3, h4, h5, h6, h7 = cls.H
        
        # Process message in 512-bit chunks
        for chunk_start in range(0, len(message), 64):
            chunk = message[chunk_start:chunk_start + 64]
            
            # Create message schedule (W)
            w = list(struct.unpack('>16I', chunk)) + [0] * 48
            for i in range(16, 64):
                w[i] = (cls.sigma1(w[i-2]) + w[i-7] + 
                       cls.sigma0(w[i-15]) + w[i-16]) & 0xFFFFFFFF
            
            # Initialize working variables
            a, b, c, d, e, f, g, h = h0, h1, h2, h3, h4, h5, h6, h7
            
            # Main loop (64 rounds)
            for i in range(64):
                T1 = (h + cls.Sigma1(e) + cls.Ch(e, f, g) + 
                     cls.K[i] + w[i]) & 0xFFFFFFFF
                T2 = (cls.Sigma0(a) + cls.Maj(a, b, c)) & 0xFFFFFFFF
                
                h = g
                g = f
                f = e
                e = (d + T1) & 0xFFFFFFFF
                d = c
                c = b
                b = a
                a = (T1 + T2) & 0xFFFFFFFF
            
            # Add compressed chunk to hash values
            h0 = (h0 + a) & 0xFFFFFFFF
            h1 = (h1 + b) & 0xFFFFFFFF
            h2 = (h2 + c) & 0xFFFFFFFF
            h3 = (h3 + d) & 0xFFFFFFFF
            h4 = (h4 + e) & 0xFFFFFFFF
            h5 = (h5 + f) & 0xFFFFFFFF
            h6 = (h6 + g) & 0xFFFFFFFF
            h7 = (h7 + h) & 0xFFFFFFFF
        
        # Produce final hash value
        return ''.join(f'{h:08x}' for h in [h0, h1, h2, h3, h4, h5, h6, h7])

# Test
if __name__ == "__main__":
    test_vectors = [
        (b"", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
        (b"abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"),
        (b"The quick brown fox jumps over the lazy dog",
         "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"),
    ]
    
    print("=== SHA-256 Implementation Test ===\n")
    for message, expected in test_vectors:
        result = SHA256.hash(message)
        status = "✓" if result == expected else "✗"
        print(f"{status} Input: {message}")
        print(f"  Output: {result}")
        print(f"  Expect: {expected}\n")
```

### 5.2. Bitcoin's Double SHA-256

Bitcoin sử dụng **double hashing** để thêm security layer:

```python
import hashlib

def double_sha256(data: bytes) -> bytes:
    """Bitcoin's double SHA-256"""
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

def hash256(data: bytes) -> str:
    """Bitcoin hash (double SHA-256, hex output)"""
    return double_sha256(data).hex()

# Example: Bitcoin block hash
block_header = bytes.fromhex(
    "01000000" +  # Version
    "0000000000000000000000000000000000000000000000000000000000000000" +  # Previous hash
    "3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a" +  # Merkle root
    "29ab5f49" +  # Timestamp
    "ffff001d" +  # Bits (difficulty)
    "1dac2b7c"    # Nonce
)

block_hash = hash256(block_header)
print(f"Bitcoin Block Hash: {block_hash}")
# Output: 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
# This is Bitcoin's Genesis Block!
```

**Why double hashing?**
1. Protection against length extension attacks
2. Extra security margin (paranoia)
3. Makes certain theoretical attacks harder

### 5.3. Merkle Tree Implementation

```python
from typing import List
import hashlib

def sha256(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def merkle_tree(transactions: List[bytes]) -> bytes:
    """
    Build Merkle tree and return root hash
    
    Example tree:
             Root
            /    \
          AB      CD
         /  \    /  \
        A    B  C    D
    """
    if len(transactions) == 0:
        return sha256(b'')
    
    # Level 0: Hash all transactions
    current_level = [sha256(tx) for tx in transactions]
    
    # Build tree bottom-up
    while len(current_level) > 1:
        next_level = []
        
        # Pair up hashes
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            
            # If odd number, duplicate last hash
            if i + 1 < len(current_level):
                right = current_level[i + 1]
            else:
                right = current_level[i]
            
            # Hash concatenation
            parent = sha256(left + right)
            next_level.append(parent)
        
        current_level = next_level
    
    return current_level[0]

def merkle_proof(transactions: List[bytes], index: int) -> List[tuple]:
    """
    Generate Merkle proof for transaction at index
    Returns list of (hash, is_left) tuples
    """
    if index >= len(transactions):
        raise ValueError("Index out of range")
    
    proof = []
    current_level = [sha256(tx) for tx in transactions]
    current_index = index
    
    while len(current_level) > 1:
        next_level = []
        
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else current_level[i]
            
            # If current transaction is in this pair
            if i == current_index or i + 1 == current_index:
                if i == current_index:
                    # Our node is left, sibling is right
                    proof.append((right, False))  # Sibling is on right
                else:
                    # Our node is right, sibling is left
                    proof.append((left, True))   # Sibling is on left
            
            next_level.append(sha256(left + right))
        
        current_index = current_index // 2
        current_level = next_level
    
    return proof

def verify_merkle_proof(transaction: bytes, proof: List[tuple], root: bytes) -> bool:
    """Verify Merkle proof"""
    current_hash = sha256(transaction)
    
    for sibling_hash, is_left in proof:
        if is_left:
            # Sibling is on left
            current_hash = sha256(sibling_hash + current_hash)
        else:
            # Sibling is on right
            current_hash = sha256(current_hash + sibling_hash)
    
    return current_hash == root

# Example usage
if __name__ == "__main__":
    print("=== Merkle Tree Example ===\n")
    
    # Create transactions
    transactions = [
        b"Alice -> Bob: 10 BTC",
        b"Bob -> Charlie: 5 BTC",
        b"Charlie -> David: 3 BTC",
        b"David -> Alice: 2 BTC"
    ]
    
    # Build Merkle tree
    root = merkle_tree(transactions)
    print(f"Merkle Root: {root.hex()}\n")
    
    # Generate proof for transaction 1
    tx_index = 1
    proof = merkle_proof(transactions, tx_index)
    
    print(f"Merkle Proof for transaction {tx_index}:")
    print(f"Transaction: {transactions[tx_index]}")
    print(f"Proof path ({len(proof)} hashes):")
    for i, (h, is_left) in enumerate(proof):
        position = "left" if is_left else "right"
        print(f"  {i+1}. {h.hex()[:16]}... (sibling on {position})")
    
    # Verify proof
    is_valid = verify_merkle_proof(transactions[tx_index], proof, root)
    print(f"\nProof verification: {'✓ Valid' if is_valid else '✗ Invalid'}")
    
    # Demonstrate efficiency
    print(f"\n=== Efficiency Comparison ===")
    print(f"Total transactions: {len(transactions)}")
    print(f"Full download: {len(transactions)} hashes ({len(transactions) * 32} bytes)")
    print(f"Merkle proof: {len(proof)} hashes ({len(proof) * 32} bytes)")
    print(f"Savings: {(1 - len(proof)/len(transactions)) * 100:.1f}%")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Hash Collisions in Practice

Mặc dù collision resistance là mạnh về lý thuyết, đã có trường hợp hash functions bị break:

**MD5 Collision (2004)**:
```
Message 1: [binary data A]
Message 2: [binary data B] (different from A)
MD5(Message 1) = MD5(Message 2) = 79054025255fb1a26e4bc422aef54eb4
```

Attackers có thể tạo:
- Hai executables khác nhau với cùng MD5
- Hai PDF documents khác nhau với cùng MD5

**SHA-1 Collision (2017 - SHAttered)**:
Google researchers tạo ra hai different PDF files với cùng SHA-1 hash:
- Cost: ~$110,000 in computation
- 9 quintillion computations

**Implications for Blockchain**:
- Bitcoin (SHA-256): Still secure, no practical attacks
- If SHA-256 broken: catastrophic failure
  - Could create fake blocks
  - Could spend same coins multiple times
  - Entire blockchain would need migration

**Migration Strategy** (nếu SHA-256 compromised):
1. Hard fork to new hash function (SHA-3, BLAKE3)
2. All nodes upgrade
3. New blocks use new hash
4. Old blocks grandfathered in

### 6.2. Quantum Computing Threat

**Grover's Algorithm**: Quantum algorithm có thể search unsorted database in \( O(\sqrt{N}) \) time.

For hash inversion:
- Classical: \( O(2^{256}) \) operations
- Quantum (Grover): \( O(2^{128}) \) operations

**Analysis**:
\( 2^{128} \) vẫn là extremely large:
- \( 2^{128} \approx 3.4 \times 10^{38} \)
- Even with quantum computer, still infeasible

**Conclusion**: SHA-256 considered quantum-resistant for pre-image và second pre-image resistance.

Collision resistance bị reduced từ \( 2^{128} \) xuống \( 2^{64} \) - marginally concerning nhưng chưa practical threat.

**Future-proofing**:
- SHA-512: Even more quantum-resistant
- Post-quantum hash functions: Research ongoing

### 6.3. Hash Rate Centralization (Mining Context)

Trong PoW, finding valid block hash requires enormous hash rate:

**Bitcoin Mining Evolution**:
- 2009: CPU mining (~10 MH/s per computer)
- 2010: GPU mining (~100 MH/s)
- 2013: ASIC mining (~1000 GH/s)
- 2024: Modern ASICs (~100 TH/s)

**Centralization Concerns**:
- Top 4 mining pools control >50% hash rate
- Geographic concentration (China historically, now US/Kazakhstan)
- ASIC manufacturers have early access

**Trade-offs**:
- **SHA-256 pro**: Well-studied, fast verification
- **SHA-256 con**: ASIC-friendly, leads to centralization
- **Alternatives**: Memory-hard functions (Ethash, RandomX) - more ASIC-resistant

### 6.4. Performance vs Security

Different hash functions offer different trade-offs:

| Hash Function | Output Size | Speed (cycles/byte) | Security Level | Notes |
|---------------|-------------|---------------------|----------------|-------|
| MD5 | 128 bit | 4-5 | ⚠️ Broken | Collision found |
| SHA-1 | 160 bit | 6-7 | ⚠️ Deprecated | Collision found (SHAttered) |
| SHA-256 | 256 bit | 7-8 | ✅ Secure | Bitcoin standard |
| SHA-512 | 512 bit | 6-7 | ✅ Secure | Faster on 64-bit systems |
| SHA-3 (Keccak-256) | 256 bit | 9-10 | ✅ Secure | Ethereum, different construction |
| BLAKE2b | 512 bit | 3-4 | ✅ Secure | Faster than SHA-3 |
| BLAKE3 | 256 bit | 2-3 | ✅ Secure | Fastest, parallelizable |

**For Blockchain**:
- Verification speed matters (every node verifies)
- Security is paramount
- SHA-256: Good balance, mature, trusted

### 6.5. Merkle Tree Depth Trade-off

Merkle proof size grows with tree depth:

For \( n \) transactions:
- Tree depth: \( \log_2 n \)
- Proof size: \( \log_2 n \times 32 \) bytes (32 bytes per hash)

**Examples**:
- 1,000 transactions: ~10 hashes (320 bytes)
- 10,000 transactions: ~14 hashes (448 bytes)
- 1,000,000 transactions: ~20 hashes (640 bytes)

**Trade-off**:
- More transactions per block → longer proofs
- Affects SPV (Simplified Payment Verification) clients
- Bitcoin: ~2,000-3,000 tx/block → ~12 hashes per proof

---

## 7. Các khái niệm liên quan

### 7.1. Hash Functions vs Encryption

Common confusion - they are different!

| Feature | Hash Function | Encryption |
|---------|--------------|------------|
| Direction | One-way | Two-way (encrypt/decrypt) |
| Key | No key | Requires key |
| Output | Fixed size | Variable size |
| Purpose | Integrity, fingerprint | Confidentiality |
| Reversible | No | Yes (with key) |

**Example**:
```
Hash:      "password" → SHA256 → 5e88...9abc (can't reverse)
Encrypt:   "password" + key → AES → gH3k...2xYz (can decrypt với key)
```

### 7.2. Cryptographic Hash Functions vs Checksums

**Checksums** (CRC, Adler-32):
- Purpose: Detect accidental errors (corruption, transmission errors)
- Not cryptographically secure
- Faster
- Smaller output

**Cryptographic Hashes**:
- Purpose: Detect intentional tampering
- Resist deliberate collision attacks
- Slower
- Larger output

**Example**:
```
CRC-32("data") = 0x12345678 (32 bits)
SHA-256("data") = 3a6eb079... (256 bits)

Attacker can easily find different message with same CRC.
Attacker cannot find different message with same SHA-256.
```

### 7.3. HMAC (Hash-based Message Authentication Code)

Combining hash with secret key for authentication:

\[
\text{HMAC}(K, m) = H((K \oplus \text{opad}) || H((K \oplus \text{ipad}) || m))
\]

Where:
- \( K \): Secret key
- \( m \): Message
- \( \text{ipad} \): Inner padding (0x36 repeated)
- \( \text{opad} \): Outer padding (0x5c repeated)
- \( || \): Concatenation

**Properties**:
- Provides authenticity AND integrity
- Requires shared secret key
- Resistant to length extension attack

**Blockchain Use**:
- API authentication
- Wallet security
- Not directly in consensus (uses digital signatures instead)

### 7.4. Commitment Schemes

Hash functions enable **commitment schemes** - commit to a value without revealing it:

**Protocol**:
1. Alice commits: sends \( c = H(m || r) \) (m = message, r = random nonce)
2. Later, Alice reveals: sends \( m \) and \( r \)
3. Bob verifies: checks \( H(m || r) = c \)

**Properties**:
- **Hiding**: Cannot learn \( m \) from \( c \) (pre-image resistance)
- **Binding**: Cannot change \( m \) after committing (collision resistance)

**Blockchain Applications**:
- Commit-reveal voting
- Fair lotteries
- Atomic swaps

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"New Directions in Cryptography"** | 1976 | Diffie, Hellman | Foundational work in cryptography |
| **"A Method for Obtaining Digital Signatures and Public-Key Cryptosystems"** | 1978 | Rivest, Shamir, Adleman | RSA algorithm |
| **"One-Way Hash Functions"** | 1989 | Ralph Merkle | Formalized hash function properties |
| **"The MD5 Message-Digest Algorithm"** | 1992 | Ronald Rivest | MD5 specification (now broken) |
| **"Secure Hash Standard (SHS)"** | 2015 | NIST FIPS 180-4 | Official SHA-2 specification |
| **"The Keccak SHA-3 Submission"** | 2011 | Bertoni et al. | SHA-3 (Keccak) algorithm |
| **"BLAKE: A Hash Function"** | 2008 | Aumasson et al. | BLAKE hash family |
| **"Collisions for Hash Functions MD4, MD5, HAVAL-128 and RIPEMD"** | 2004 | Xiaoyun Wang et al. | First practical MD5 collision |
| **"The first collision for full SHA-1"** | 2017 | Stevens et al. | SHAttered attack |
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Hash functions in blockchain |

**Essential Reading**:
1. NIST FIPS 180-4: Authoritative SHA-2 specification
2. Keccak specification: Understand SHA-3 construction
3. SHAttered paper: See how hash functions are attacked
4. Bitcoin whitepaper Section 4-5: Merkle trees in practice

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Description | Source | Notes |
|-------------|--------|-------|
| **SHA-256 algorithm diagram** | [NIST FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf) | Official specification with diagrams |
| **Avalanche effect visualization** | [Interactive SHA-256](https://sha256algorithm.com/) | See how one bit changes output |
| **Merkle tree structure** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/block_chain.html) | Real Bitcoin implementation |
| **Hash function comparison** | [Crypto++ Benchmarks](https://www.cryptopp.com/benchmarks.html) | Performance comparison |
| **Collision attack visualization** | [SHAttered.io](https://shattered.io/) | SHA-1 collision demonstration |
| **Birthday paradox** | [Better Explained - Birthday Paradox](https://betterexplained.com/articles/understanding-the-birthday-paradox/) | Intuitive explanation |

**Interactive Tools**:
- [Anders Brownworth - Hash Demo](https://andersbrownworth.com/blockchain/hash) - See SHA-256 in action
- [SHA-256 Visualizer](https://sha256algorithm.com/) - Step-by-step SHA-256
- [Merkle Tree Visualizer](https://blockchain-academy.hs-mittweida.de/merkle-tree/) - Interactive Merkle tree builder

---

## 10. Tóm tắt và điểm chính

**Core Concepts**:
1. Hash functions là one-way transformations: easy to compute, impossible to reverse
2. Cryptographic hash functions thỏa mãn: pre-image resistance, collision resistance, avalanche effect
3. SHA-256 là backbone của Bitcoin và nhiều blockchains

**Technical Foundation**:
- SHA-256: Merkle-Damgård construction, 64 rounds, 256-bit output
- Collision resistance: Birthday paradox → need \( 2^{128} \) attempts
- Pre-image resistance: Need \( 2^{256} \) attempts → thermodynamically impossible
- Merkle trees: Efficient verification với \( O(\log n) \) proof size

**Blockchain Applications**:
- Block linking: Each block contains hash of previous block
- Transaction verification: Merkle trees enable SPV
- Proof-of-Work: Mining finds nonce such that hash < target
- Commitment schemes: Commit-reveal protocols

**Security Considerations**:
- SHA-256 remains secure despite attacks on MD5, SHA-1
- Quantum computing reduces security but doesn't break SHA-256
- Double hashing (Bitcoin) adds extra security margin
- Length extension attacks mitigated by proper construction

**Implementation Insights**:
- Pure software implementation possible (~7-8 cycles/byte)
- Hardware acceleration available (SHA extensions in modern CPUs)
- Merkle proofs enable light clients
- Performance vs security trade-offs in choice of hash function

**Key Takeaway**: Cryptographic hash functions are the "digital glue" that makes blockchain possible - providing integrity, immutability, and efficient verification in a trustless environment.

---

✅ **End of Lecture 00.02**

**Next**: Lecture 00.03 - Digital Signatures và Public-Key Cryptography

---

## References

1. National Institute of Standards and Technology (NIST). (2015). *FIPS 180-4: Secure Hash Standard (SHS)*.
2. Bertoni, G., Daemen, J., Peeters, M., & Van Assche, G. (2011). *The Keccak SHA-3 submission*.
3. Stevens, M., Bursztein, E., Karpman, P., Albertini, A., & Markov, Y. (2017). *The first collision for full SHA-1*. CRYPTO 2017.
4. Merkle, R. C. (1989). *One way hash functions and DES*. CRYPTO'89.
5. Aumasson, J. P., Henzen, L., Meier, W., & Phan, R. C. W. (2008). *SHA-3 proposal BLAKE*. Submission to NIST.
6. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.

