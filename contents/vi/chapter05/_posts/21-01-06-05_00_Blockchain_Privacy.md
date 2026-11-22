---
layout: post
title: "Lecture 05.00: Blockchain Privacy - Beyond Pseudonymity"
chapter: '05'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Bài giảng 05.00: Quyền riêng tư trên Blockchain — Vượt qua tính ẩn danh giả

## 1. Tổng quan về khái niệm

Một trong những hiểu lầm phổ biến nhất về blockchain là cho rằng công nghệ này có tính "ẩn danh" (anonymous). Trên thực tế, Bitcoin và phần lớn các blockchain chỉ mang tính **ẩn danh giả (pseudonymous)**: các giao dịch được gắn với địa chỉ ví thay vì tên thật, nhưng toàn bộ lịch sử giao dịch đều hoàn toàn **công khai và có thể truy vết**.

**So sánh Ẩn danh giả (Pseudonymity) và Ẩn danh thực sự (Anonymity)**:

```
Pseudonymous (Bitcoin, Ethereum):
- Addresses không chứa real name
- Nhưng: All transactions public
- Nhưng: Addresses can be linked
- Nhưng: Chain analysis reveals patterns

Example:
Address 0x123...abc receives 10 BTC from exchange (KYC'd)
→ Identity potentially linked
→ All future transactions traceable
→ Not truly anonymous!

Anonymous (Ideal):
- Transactions cannot be traced to individual
- No linking between transactions
- Cannot determine sender/receiver
```

**Bài toán quyền riêng tư**:

Tính minh bạch — một trong những đặc tính cốt lõi của blockchain — đồng thời cũng là thách thức lớn nhất đối với quyền riêng tư.

**Lợi ích của tính minh bạch**:
- Bất kỳ ai cũng có thể xác minh giao dịch.
- Nhật ký kiểm toán được lưu trữ vĩnh viễn.
- Không thể xảy ra lạm phát ẩn.
- Niềm tin được xây dựng thông qua khả năng kiểm chứng.

**Hạn chế của tính minh bạch**:
- Có thể bị giám sát tài chính.
- Thói quen chi tiêu bị lộ.
- Số dư tài sản bị công khai.
- Thông tin kinh doanh nhạy cảm có nguy cơ bị rò rỉ.

**Ví dụ thực tế**:

```
Scenario: Company pays employee in Bitcoin

Public blockchain reveals:
- Company wallet address
- Employee wallet address  
- Exact salary amount
- Payment schedule (monthly)
- All employee purchases afterward

Competitors can:
- Analyze company cash flow
- Identify employees
- Track business operations

This is NOT acceptable for enterprise/personal finance!
```

**Bối cảnh lịch sử**:

Quyền riêng tư trong lĩnh vực tiền mã hóa đã phát triển qua nhiều giai đoạn:

- **2009–2013 (Bitcoin được cho là ẩn danh)**: Người dùng thời kỳ đầu tin rằng sử dụng địa chỉ ví đồng nghĩa với có quyền riêng tư. Tuy nhiên, các công ty phân tích chuỗi (chain analysis) nhanh chóng xuất hiện và chứng minh điều ngược lại.
- **2014–2016 (Sự ra đời của các đồng tiền riêng tư)**: **Monero (2014)** ứng dụng chữ ký vòng (ring signatures) và địa chỉ ẩn (stealth addresses); **Zcash (2016)** triển khai chứng minh không tiết lộ thông tin (zk-SNARKs); **Dash** tích hợp cơ chế trộn giao dịch kiểu CoinJoin.
- **2017–2020 (Các công cụ riêng tư trưởng thành)**: Các giải pháp triển khai CoinJoin (như Wasabi, Samourai), công cụ trộn giao dịch trên Ethereum (Tornado Cash) và nhiều giao thức bảo vệ quyền riêng tư khác phát triển mạnh.
- **2020–2024 (Sự giám sát chặt chẽ từ cơ quan quản lý)**: Nhiều sàn giao dịch hủy niêm yết các đồng tiền riêng tư, Tornado Cash bị đưa vào danh sách trừng phạt (2022), làm dấy lên cuộc tranh luận sâu rộng giữa quyền riêng tư và yêu cầu tuân thủ pháp lý.

**Bộ ba đánh đổi về quyền riêng tư (The Privacy Trilemma)**:

Tương tự bộ ba bất khả thi của blockchain, bài toán quyền riêng tư cũng tồn tại sự đánh đổi giữa ba yếu tố:

```
        Privacy
         /  \
        /    \
       /      \
      /________\
Compliance   Usability

Monero: High privacy → Low compliance
Bitcoin: High compliance → Low privacy
Zcash: Balance attempt (shielded + transparent pools)
```

---

## 2. Hiểu biết trực quan

### 2.1. Phân tích chuỗi (Chain Analysis) — "Lần theo dấu vết dòng tiền"

**Tiền mặt truyền thống**:
```
Alice pays Bob $100 (physical cash)
└─ No record (private)
└─ Bob spends at store
└─ No link to Alice (untraceable)

Perfect privacy!
```

**Bitcoin (sử dụng theo cách thông thường)**:
```
Alice sends to Bob: Tx 0xABC
└─ Public record forever
└─ Bob sends to Charlie: Tx 0xDEF
└─ Linked! (same address)
└─ Charlie sends to store: Tx 0x123
└─ Full trail visible!

Transaction graph reveals everything!
```

**Phân tích đồ thị giao dịch (Graph Analysis)**:
```
         Exchange (KYC)
              ↓
         Alice_Addr_1 ────→ Bob_Addr_1
              ↓                  ↓
         Alice_Addr_2      Bob_Addr_2
              ↓                  ↓
         Merchant_A         Merchant_B
         
Chain analysis can:
- Cluster addresses (belong to same entity)
- De-anonymize users (via exchange KYC)
- Track fund flow
- Identify business relationships
```

### 2.2. CoinJoin — "Trộn giao dịch"

**Khi không dùng CoinJoin**:
```
Alice → Bob:    Tx1 (traceable)
Charlie → Dave: Tx2 (traceable)

Clear mapping: Input → Output
```

**Khi dùng CoinJoin**:
```
Combined Transaction:
Inputs:  [Alice, Charlie]
Outputs: [Bob, Dave]

Ambiguity: Which input → which output?
- Alice → Bob?
- Alice → Dave?
- Charlie → Bob?
- Charlie → Dave?

Cannot determine without additional info!
```

**Càng nhiều người tham gia, tính riêng tư càng cao**:
```
100 people CoinJoin:
└─ 100 inputs
└─ 100 outputs
└─ 100! possible mappings (10^157 combinations!)

Effectively untraceable!
```

### 2.3. Chữ ký vòng (Ring Signatures) — "Ký thay mặt một nhóm"

**Chữ ký số thông thường**:
```
Alice signs message
→ Proves: "Alice signed this"
→ Everyone knows Alice signed

No ambiguity!
```

**Chữ ký vòng (Monero)**:
```
Ring: [Alice, Bob, Charlie, Dave, Eve]

One person signs (say Alice)
→ Proves: "Someone in ring signed this"
→ Cannot tell who!

Plausible deniability for everyone!
```

**Phép ẩn dụ (Bỏ phiếu kín)**:
```
5 people vote
Only know: "Someone voted YES"
Don't know: Who specifically

Ring signature similar!
```

### 2.4. Chứng minh không tiết lộ thông tin (Zero-Knowledge Proofs) — "Chứng minh mà không tiết lộ bí mật"

**Cách chứng minh thông thường**:
```
Prove you know password:
→ Reveal password
→ Verifier checks
→ Privacy lost!
```

**Chứng minh không tiết lộ thông tin**:
```
Prove you know password:
→ Don't reveal password
→ Mathematical proof instead
→ Verifier convinced
→ Password stays secret!

Example (Zcash):
Prove: "I have 10 ZEC and right to spend"
Without revealing: Which coins, who sent them, amounts
```

**Phép ẩn dụ cánh cửa bí mật**:
```
You know secret code to open magic door
Want to prove: "I know code"
Without revealing: The actual code

Method:
1. Go through door (only possible if you know code)
2. Verifier sees you emerged on other side
3. Verifier convinced: "You must know code!"
4. But verifier doesn't learn the code!

This is zero-knowledge: Proved knowledge without revealing it!
```

### 2.5. Địa chỉ ẩn (Stealth Addresses) — "Địa chỉ dùng một lần"

**Tái sử dụng địa chỉ (bất lợi cho quyền riêng tư)**:
```
Alice's address: 0x123...abc

Receives from:
- Bob
- Charlie  
- Dave
- Employer
- Exchange

Everyone can see:
- Total balance
- All transaction history
- Spending patterns

No privacy!
```

**Địa chỉ ẩn (Monero)**:
```
Alice has: One public address (published)

But each payment goes to:
- Unique one-time address (derived from public address)
- Not linkable to other payments
- Only Alice can detect (with private view key)

Bob, Charlie, Dave send to Alice
→ Each goes to different address
→ Looks like different recipients
→ Only Alice knows they're all hers!

Privacy preserved!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Cài đặt mô phỏng CoinJoin

```python
import hashlib
from typing import List, Tuple

class CoinJoin:
    """Simplified CoinJoin mixing protocol"""
    
    def __init__(self):
        self.participants = []
        self.inputs = []
        self.outputs = []
    
    def register_participant(self, address, input_amount, output_address):
        """Participant registers for mixing"""
        participant = {
            'input_address': address,
            'input_amount': input_amount,
            'output_address': output_address,
            'signature': None
        }
        
        self.participants.append(participant)
        
        print(f"Participant registered: {address[:10]}...")
        print(f"  Input: {input_amount} BTC")
        print(f"  Output address: {output_address[:10]}...")
    
    def create_coinjoin_tx(self):
        """Create combined CoinJoin transaction"""
        
        # Verify all amounts equal (important for privacy!)
        amounts = [p['input_amount'] for p in self.participants]
        if len(set(amounts)) != 1:
            raise Exception("All amounts must be equal for best privacy")
        
        amount = amounts[0]
        
        # Create combined transaction
        tx = {
            'inputs': [],
            'outputs': [],
            'coinjoin': True
        }
        
        # Collect inputs
        for p in self.participants:
            tx['inputs'].append({
                'address': p['input_address'],
                'amount': amount
            })
        
        # Shuffle outputs (critical for privacy!)
        import random
        output_addresses = [p['output_address'] for p in self.participants]
        random.shuffle(output_addresses)
        
        # Add shuffled outputs
        for addr in output_addresses:
            tx['outputs'].append({
                'address': addr,
                'amount': amount
            })
        
        print(f"\n✓ CoinJoin transaction created:")
        print(f"  Participants: {len(self.participants)}")
        print(f"  Total mixed: {amount * len(self.participants)} BTC")
        print(f"  Anonymity set: 1 in {len(self.participants)}")
        
        return tx
    
    def sign_transaction(self, tx, participant_idx, private_key):
        """Participant signs their input"""
        # Each participant signs only their input
        # Cannot determine output mapping without all signatures!
        
        input_data = tx['inputs'][participant_idx]
        signature = self.sign_input(input_data, private_key)
        
        self.participants[participant_idx]['signature'] = signature
        
        return signature
    
    def verify_all_signed(self):
        """Verify all participants signed"""
        for p in self.participants:
            if p['signature'] is None:
                return False
        return True
    
    @staticmethod
    def sign_input(input_data, private_key):
        """Sign input (simplified)"""
        data_str = str(input_data)
        return hashlib.sha256((data_str + private_key).encode()).hexdigest()

# Example usage
if __name__ == "__main__":
    print("=== CoinJoin Mixing Example ===\n")
    
    coinjoin = CoinJoin()
    
    # 5 participants want to mix 1 BTC each
    participants = [
        ('Alice_Input', 1.0, 'Alice_Output_X'),
        ('Bob_Input', 1.0, 'Bob_Output_Y'),
        ('Charlie_Input', 1.0, 'Charlie_Output_Z'),
        ('Dave_Input', 1.0, 'Dave_Output_W'),
        ('Eve_Input', 1.0, 'Eve_Output_V')
    ]
    
    for input_addr, amount, output_addr in participants:
        coinjoin.register_participant(input_addr, amount, output_addr)
    
    # Create mixed transaction
    tx = coinjoin.create_coinjoin_tx()
    
    print(f"\nInput → Output mapping obscured!")
    print(f"Privacy achieved through ambiguity!")
```

### 3.2. Chữ ký vòng (theo mô hình Monero)

```python
import hashlib
from typing import List

class RingSignature:
    """Simplified ring signature implementation"""
    
    def __init__(self, ring_members: List[str]):
        """
        Initialize ring signature
        
        Args:
            ring_members: List of public keys in ring
        """
        self.ring_members = ring_members
        self.ring_size = len(ring_members)
    
    def sign(self, message: str, signer_index: int, private_key: str) -> dict:
        """
        Create ring signature
        
        Args:
            message: Message to sign
            signer_index: Index of actual signer in ring
            private_key: Actual signer's private key
            
        Returns:
            Ring signature (contains no info about signer_index!)
        """
        # Simplified ring signature scheme
        
        # 1. Generate random values for other ring members
        random_values = []
        for i in range(self.ring_size):
            if i == signer_index:
                random_values.append(None)  # Will compute last
            else:
                # Random value for decoy
                random_values.append(
                    int(hashlib.sha256(f"random_{i}".encode()).hexdigest(), 16)
                )
        
        # 2. Compute ring
        c = []
        for i in range(self.ring_size):
            if i == signer_index:
                c.append(None)  # Compute in next step
            else:
                # Hash commitment for decoy
                data = f"{self.ring_members[i]}{random_values[i]}{message}"
                c.append(hashlib.sha256(data.encode()).hexdigest())
        
        # 3. Close the ring (compute actual signer's values)
        # In real implementation, uses elliptic curve operations
        signer_random = self._compute_closing_value(c, private_key, message)
        random_values[signer_index] = signer_random
        
        c_value = hashlib.sha256(
            f"{self.ring_members[signer_index]}{signer_random}{message}".encode()
        ).hexdigest()
        c[signer_index] = c_value
        
        signature = {
            'ring': self.ring_members,
            'c_values': c,
            'random_values': random_values,
            'message': message
        }
        
        print(f"✓ Ring signature created")
        print(f"  Ring size: {self.ring_size}")
        print(f"  Actual signer: Hidden among {self.ring_size} members")
        
        return signature
    
    def verify(self, signature: dict) -> bool:
        """
        Verify ring signature
        
        Returns:
            True if valid (proves someone in ring signed)
            Does NOT reveal who!
        """
        ring = signature['ring']
        c_values = signature['c_values']
        random_values = signature['random_values']
        message = signature['message']
        
        # Verify ring closure
        for i in range(len(ring)):
            expected = hashlib.sha256(
                f"{ring[i]}{random_values[i]}{message}".encode()
            ).hexdigest()
            
            if c_values[i] != expected:
                return False
        
        print(f"✓ Ring signature VALID")
        print(f"  Proved: Someone in ring signed")
        print(f"  Hidden: Actual signer identity")
        
        return True
    
    @staticmethod
    def _compute_closing_value(c_values, private_key, message):
        """Compute closing value to complete ring (simplified)"""
        # In real implementation: Complex elliptic curve math
        combined = "".join(str(c) for c in c_values if c is not None)
        return int(hashlib.sha256(
            f"{combined}{private_key}{message}".encode()
        ).hexdigest(), 16)

# Example
if __name__ == "__main__":
    print("=== Ring Signature Example ===\n")
    
    # Create ring of 5 public keys
    ring = [f"pubkey_{i}" for i in range(5)]
    
    print("Ring members:")
    for i, pubkey in enumerate(ring):
        print(f"  {i}. {pubkey}")
    
    # Alice (index 2) wants to sign
    ring_sig = RingSignature(ring)
    
    print(f"\nAlice (index 2) signing message...")
    signature = ring_sig.sign(
        message="Transfer 10 XMR",
        signer_index=2,
        private_key="alice_private_key"
    )
    
    # Verify
    print(f"\nVerifying signature...")
    valid = ring_sig.verify(signature)
    
    if valid:
        print(f"\n✓ Signature proves:")
        print(f"  - Message is authentic")
        print(f"  - Someone in ring signed it")
        print(f"  - But impossible to tell who!")
```

### 3.3. Địa chỉ ẩn (Monero)

```python
class StealthAddress:
    """Monero-style stealth address system"""
    
    def __init__(self):
        self.view_key_private = None
        self.spend_key_private = None
        self.view_key_public = None
        self.spend_key_public = None
    
    def generate_keys(self):
        """Generate key pair for stealth addresses"""
        # In production: Use proper elliptic curve
        import secrets
        
        # View key (for detecting payments)
        self.view_key_private = secrets.token_hex(32)
        self.view_key_public = hashlib.sha256(
            self.view_key_private.encode()
        ).hexdigest()
        
        # Spend key (for spending funds)
        self.spend_key_private = secrets.token_hex(32)
        self.spend_key_public = hashlib.sha256(
            self.spend_key_private.encode()
        ).hexdigest()
        
        # Published address = (view_pub, spend_pub)
        return (self.view_key_public, self.spend_key_public)
    
    def create_one_time_address(self, recipient_view_pub, recipient_spend_pub):
        """
        Sender creates one-time address for recipient
        
        Args:
            recipient_view_pub: Recipient's public view key
            recipient_spend_pub: Recipient's public spend key
            
        Returns:
            One-time stealth address
        """
        import secrets
        
        # Generate random value
        r = secrets.token_hex(32)
        
        # Compute shared secret
        shared_secret = hashlib.sha256(
            (r + recipient_view_pub).encode()
        ).hexdigest()
        
        # Derive one-time address
        # In production: Elliptic curve point addition
        one_time_address = hashlib.sha256(
            (shared_secret + recipient_spend_pub).encode()
        ).hexdigest()
        
        # Public transaction data
        tx_public_key = hashlib.sha256(r.encode()).hexdigest()
        
        print(f"✓ One-time address created:")
        print(f"  Address: {one_time_address[:20]}...")
        print(f"  TX public key: {tx_public_key[:20]}...")
        
        return {
            'one_time_address': one_time_address,
            'tx_public_key': tx_public_key
        }
    
    def scan_for_payments(self, tx_public_key, one_time_address):
        """
        Recipient scans blockchain for payments to them
        
        Args:
            tx_public_key: Public key from transaction
            one_time_address: Address that received funds
            
        Returns:
            True if payment is for us
        """
        # Compute shared secret using private view key
        shared_secret = hashlib.sha256(
            (self.view_key_private + tx_public_key).encode()
        ).hexdigest()
        
        # Derive expected one-time address
        expected_address = hashlib.sha256(
            (shared_secret + self.spend_key_public).encode()
        ).hexdigest()
        
        if expected_address == one_time_address:
            print(f"✓ Payment detected!")
            print(f"  This payment is for us")
            return True
        
        return False

# Example
if __name__ == "__main__":
    print("=== Stealth Address Example ===\n")
    
    # Alice generates her stealth address keys
    alice = StealthAddress()
    view_pub, spend_pub = alice.generate_keys()
    
    print("Alice's published address:")
    print(f"  View key: {view_pub[:20]}...")
    print(f"  Spend key: {spend_pub[:20]}...")
    
    # Bob wants to send to Alice
    print(f"\nBob sending to Alice...")
    payment = alice.create_one_time_address(view_pub, spend_pub)
    
    # Alice scans blockchain
    print(f"\nAlice scanning blockchain...")
    is_for_alice = alice.scan_for_payments(
        payment['tx_public_key'],
        payment['one_time_address']
    )
    
    print(f"\n{'✓ Alice can spend these funds!' if is_for_alice else '✗ Not for Alice'}")
```

---

## 4. Công thức toán học và bảo mật

### 4.1. Kích thước tập ẩn danh (Anonymity Set Size)

**Tập ẩn danh (Anonymity Set)** là số lượng đối tượng có thể là người gửi hoặc người nhận của một giao dịch. Mức độ riêng tư (tính theo bit entropy) tỷ lệ với logarit cơ số 2 của kích thước tập này:

\[
\text{Privacy} \propto \log_2(\text{Anonymity Set Size})
\]

**Ví dụ minh họa**:

| Kỹ thuật | Kích thước tập ẩn danh | Mức độ riêng tư (bit) |
|----------|------------------------|-----------------------|
| Không trộn giao dịch | 1 | 0 bit |
| CoinJoin 2 bên | 2 | 1 bit |
| CoinJoin 10 bên | 10 | ~3,3 bit |
| CoinJoin 100 bên | 100 | ~6,6 bit |
| Chữ ký vòng (11 thành viên) | 11 | ~3,5 bit |
| Shielded pool của Zcash | ~100.000 | ~16,6 bit |

Tập ẩn danh càng lớn thì mức độ bảo vệ quyền riêng tư càng cao.

### 4.2. Xác suất thành công của phân tích chuỗi

Các công cụ phân tích chuỗi thường sử dụng các **quy tắc kinh nghiệm (heuristics)** để gom cụm địa chỉ:

**Quy tắc đồng sở hữu đầu vào (Common Input Ownership)**:
```
If transaction has inputs from A1 and A2:
P(A1 and A2 same owner) ≈ 0.9

Assumption: Different people unlikely to coordinate
```

**Quy tắc nhận diện địa chỉ tiền thối (Change Address Detection)**:
```
Transaction:
Input: 10 BTC from A
Outputs: 6 BTC to B, 4 BTC to C

Heuristic: C is change (round number to B)
P(C is sender's change) ≈ 0.7
```

**Độ chính xác gom cụm (thực nghiệm)**:

\[
P(\text{correct cluster}) \approx 0.7 - 0.9
\]

**Biện pháp phòng ngừa gom cụm địa chỉ**:
- Tránh tái sử dụng địa chỉ ví.
- Sử dụng CoinJoin.
- Tránh tạo số tiền thối dễ đoán.
- Áp dụng kỹ thuật kiểm soát đồng tiền (coin control).

### 4.3. Tính bảo mật của chữ ký vòng

- **Tính không thể giả mạo (Unforgeability)**: Kẻ tấn công không thể tạo chữ ký hợp lệ nếu không sở hữu ít nhất một khóa bí mật thuộc vòng. Giả định bảo mật dựa trên độ khó của bài toán logarit rời rạc (Discrete Logarithm Problem).
- **Tính ẩn danh (Anonymity)**:

\[
P(\text{identify signer | signature}) = \frac{1}{n}
\]

Trong đó \( n \) là kích thước của vòng.

- **Tính liên kết (Linkability)**: Nếu không có ảnh khóa (key image), kẻ tấn công không thể biết liệu hai chữ ký có xuất phát từ cùng một người ký hay không.

**Ảnh khóa (Key Image)** giúp ngăn chặn chi tiêu lặp (double-spending):

\[
I = x \cdot H_p(\text{PublicKey})
\]

Trong đó \( x \) là khóa bí mật. Ảnh khóa có ba tính chất quan trọng:
- Duy nhất cho mỗi khóa.
- Không tiết lộ thông tin về khóa bí mật.
- Cho phép mạng lưới phát hiện chi tiêu lặp (hai giao dịch có cùng ảnh khóa đồng nghĩa với việc cùng một đầu ra bị chi tiêu hai lần).

### 4.4. Kích thước của zk-SNARK

Kích thước bằng chứng không tiết lộ thông tin trong zk-SNARK là hằng số:

\[
|\text{Proof}| = O(1) \quad \text{(constant size!)}
\]

Với **Groth16** (lược đồ phổ biến nhất):
- Kích thước bằng chứng: 128 byte.
- Thời gian xác minh: \(O(1)\).
- Thiết lập ban đầu: yêu cầu quá trình thiết lập tin cậy (trusted setup).

**Bảng so sánh**:

| Phương pháp | Kích thước bằng chứng | Xác minh |
|-------------|-----------------------|----------|
| Giao dịch thông thường | ~250 byte | Thực thi lại toàn bộ |
| zk-SNARK (Groth16) | 128 byte | ~1 ms |
| zk-STARK | ~100 KB | ~10 ms |

**Chi phí phụ trội về kích thước (Privacy Overhead)**:

\[
\text{Overhead} = \frac{|\text{ZK proof}|}{|\text{Normal TX}|} \approx \frac{128}{250} \approx 0.5
\]

Như vậy, kích thước bằng chứng Groth16 thậm chí nhỏ hơn cả một giao dịch thông thường.

---

## 5. Góc nhìn triển khai

### 5.1. Tornado Cash (Công cụ trộn giao dịch trên Ethereum)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Simplified Tornado Cash Mixer
 * @dev Privacy through commitment scheme
 */
contract TornadoMixer {
    uint256 public constant DENOMINATION = 1 ether;
    uint256 public constant MERKLE_TREE_HEIGHT = 20;
    
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifiers;
    bytes32[] public commitmentTree;
    
    event Deposit(bytes32 indexed commitment, uint256 leafIndex);
    event Withdrawal(address to, bytes32 nullifier);
    
    /**
     * @dev Deposit funds (commit)
     */
    function deposit(bytes32 commitment) external payable {
        require(msg.value == DENOMINATION, "Must deposit exactly 1 ETH");
        require(!commitments[commitment], "Commitment already exists");
        
        // Store commitment
        commitments[commitment] = true;
        uint256 leafIndex = commitmentTree.length;
        commitmentTree.push(commitment);
        
        emit Deposit(commitment, leafIndex);
    }
    
    /**
     * @dev Withdraw funds (reveal nullifier, prove commitment)
     */
    function withdraw(
        address payable recipient,
        bytes32 nullifier,
        bytes32 root,
        bytes calldata proof
    ) external {
        require(!nullifiers[nullifier], "Note already spent");
        require(isKnownRoot(root), "Invalid root");
        
        // Verify zero-knowledge proof
        // Proves: "I know secret that hashes to commitment in tree"
        // Without revealing: Which commitment
        require(verifyProof(proof, nullifier, root, recipient), "Invalid proof");
        
        // Mark nullifier as used
        nullifiers[nullifier] = true;
        
        // Send funds
        recipient.transfer(DENOMINATION);
        
        emit Withdrawal(recipient, nullifier);
    }
    
    /**
     * @dev Verify ZK proof (simplified)
     */
    function verifyProof(
        bytes calldata proof,
        bytes32 nullifier,
        bytes32 root,
        address recipient
    ) internal view returns (bool) {
        // In production: Use zk-SNARK verifier (Groth16, PLONK, etc.)
        // Proof verifies:
        // 1. Commitment exists in Merkle tree with root
        // 2. Nullifier derived from same secret as commitment
        // 3. Recipient address is correct
        
        // Simplified verification
        return proof.length > 0;  // Placeholder
    }
    
    /**
     * @dev Check if root exists in history
     */
    function isKnownRoot(bytes32 root) public view returns (bool) {
        // Allow recent roots (prevents front-running)
        // Simplified
        return true;
    }
    
    /**
     * @dev Get current Merkle root
     */
    function getRoot() public view returns (bytes32) {
        return computeMerkleRoot(commitmentTree);
    }
    
    function computeMerkleRoot(bytes32[] memory leaves) internal pure returns (bytes32) {
        // Simplified Merkle root calculation
        if (leaves.length == 0) return bytes32(0);
        if (leaves.length == 1) return leaves[0];
        
        bytes32[] memory level = leaves;
        
        while (level.length > 1) {
            bytes32[] memory nextLevel = new bytes32[]((level.length + 1) / 2);
            
            for (uint i = 0; i < level.length; i += 2) {
                bytes32 left = level[i];
                bytes32 right = i + 1 < level.length ? level[i + 1] : level[i];
                nextLevel[i / 2] = keccak256(abi.encodePacked(left, right));
            }
            
            level = nextLevel;
        }
        
        return level[0];
    }
}

/**
 * @title User-side: Creating commitment and nullifier
 */
contract TornadoUser {
    /**
     * @dev Generate secret for deposit
     */
    function generateSecret() external view returns (bytes32 secret, bytes32 nullifier, bytes32 commitment) {
        // Generate random secret
        secret = keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty));
        
        // Derive nullifier (prevents double-spend)
        nullifier = keccak256(abi.encodePacked(secret, uint256(1)));
        
        // Derive commitment (what gets deposited)
        commitment = keccak256(abi.encodePacked(secret, nullifier));
        
        return (secret, nullifier, commitment);
    }
    
    /**
     * @dev Usage:
     * 1. Generate (secret, nullifier, commitment)
     * 2. Deposit commitment to mixer
     * 3. Wait (mix with other deposits)
     * 4. Withdraw using nullifier + ZK proof
     * 5. Link broken! (depositor ≠ withdrawer)
     */
}
```

**Cơ chế bảo vệ quyền riêng tư của Tornado Cash**:

```
Deposit Phase:
Alice → Generates secret
     → Computes commitment = hash(secret)
     → Deposits 1 ETH + commitment
     → Commitment added to Merkle tree

Mix Phase:
Bob → Deposits 1 ETH + his commitment
Charlie → Deposits 1 ETH + his commitment
...
100 people deposit 1 ETH each

Withdrawal Phase:
Alice → Generates ZK proof: "I know secret for commitment in tree"
     → Provides nullifier (derived from secret)
     → Withdraws to NEW address
     → Cannot link: New address ← Original deposit

Observer sees:
- 100 deposits
- 100 withdrawals
- Cannot tell which deposit → which withdrawal!

Anonymity set: 100
```

---

## Video tham khảo

- **Xem trước:** [LIGHTNING SESSION: CoinJoin Explained 🌀](https://www.youtube.com/watch?v=kOghnRgX9L4) — BTC Sessions, tiếng Anh. BTC Sessions giải thích CoinJoin; nên xem trước khi tìm hiểu về mixer và cơ chế làm mờ liên kết đầu vào.
- [Monero: Ring Signatures](https://www.youtube.com/watch?v=zHN_B_H_fCs) — Monero, tiếng Anh. Kênh Monero trình bày chữ ký vòng (ring signature) — cơ chế ẩn người gửi mà bài học đối chiếu với tính ẩn danh giả.
- [Zcash Shielded Transactions Explained](https://www.youtube.com/watch?v=bGmsx4XhV4g) — Chadwick Bailey, tiếng Anh. Giải thích giao dịch ẩn (shielded) của Zcash, minh họa hướng ẩn số lượng và địa chỉ bằng chứng minh không tiết lộ thông tin.
