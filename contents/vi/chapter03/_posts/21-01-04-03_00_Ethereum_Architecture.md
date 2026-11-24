---
layout: post
title: "Lecture 03.00: Ethereum Architecture - World Computer Platform"
chapter: '03'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
---

# Bài giảng: Kiến trúc Ethereum — Nền tảng máy tính phi tập trung

Nếu Bitcoin là một chiếc máy tính bỏ túi chuyên dụng chỉ làm đúng một việc cực kỳ xuất sắc — chuyển giá trị an toàn không cần trung gian — thì năm 2013, chàng lập trình viên 19 tuổi **Vitalik Buterin** đặt một câu hỏi làm thay đổi hoàn toàn lịch sử blockchain: *thay vì mỗi ứng dụng mới (tên miền phi tập trung, sàn giao dịch, cho vay, bảo hiểm) lại phải tự xây một blockchain riêng từ con số 0, tại sao không xây dựng **một chiếc máy tính toàn cầu dùng chung** nơi bất kỳ ai cũng có thể tải mã chương trình lên và để cả mạng lưới cùng thực thi một cách tất định?*

Câu trả lời đó là **Ethereum**. Để biến blockchain từ "sổ cái giao dịch" thành **máy chuyển trạng thái toàn cầu (World State Machine)**, Ethereum từ bỏ mô hình UTXO của Bitcoin để chuyển sang **mô hình Tài khoản (Account Model)**, trang bị cây lưu trữ **Merkle Patricia Trie (MPT)** và đặt ra cơ chế **Gas** để giải quyết bài toán dừng (Halting Problem) của Alan Turing.

---

## Bản đồ kiến thức nền: Kiến trúc Ethereum đứng trên ba trụ cột khoa học máy tính nào?

### 1. Máy chuyển trạng thái tất định (Deterministic State Machine)
Về mặt toán học, toàn bộ mạng Ethereum chỉ là một hàm chuyển trạng thái thuần túy:

$$
\sigma_{t+1} = \Upsilon(\sigma_t,\ T),
$$

trong đó $$\sigma_t$$ là **Trạng thái Thế giới (World State)** hiện tại (bảng ánh xạ mọi địa chỉ 20 byte tới bộ 4 thông tin: `nonce`, `balance`, `storageRoot`, `codeHash`) và $$T$$ là một giao dịch hợp lệ. Mọi nút trên Trái Đất bắt đầu từ cùng $$\sigma_t$$ và chạy cùng $$T$$ phải ra **đúng y hệt từng bit** của $$\sigma_{t+1}$$!

### 2. Mô hình Tài khoản (EOA vs. Contract Account) và Cơ chế Nonce
Ethereum có hai loại tài khoản cùng chung không gian địa chỉ: **EOA (Externally Owned Account)** do khóa bí mật điều khiển (có thể chủ động khởi phát giao dịch), và **Contract Account** do mã bytecode điều khiển (chỉ chạy khi được gọi). Mỗi tài khoản có một bộ đếm tuần tự gọi là **`nonce`**: giao dịch gửi đi từ một EOA bắt buộc phải đánh số `nonce` tăng dần liên tiếp $$0, 1, 2, \dots$$ — chỉ bằng một số nguyên duy nhất, Ethereum chặn đứng hoàn toàn **tấn công phát lại (replay attack)**!

### 3. Cây Merkle Patricia Biến đổi (Modified Merkle Patricia Trie — MPT)
Mỗi tiêu đề khối Ethereum không chỉ chứa 1 gốc Merkle như Bitcoin, mà chứa **3 gốc cây MPT riêng biệt**: `stateRoot` (chụp toàn bộ số dư và bộ nhớ mọi hợp đồng), `transactionsRoot` (danh sách giao dịch), và `receiptsRoot` (nhật ký sự kiện và gas thực tiêu). Nhờ cấu trúc cây tiền tố (Radix Trie) kết hợp băm Merkle, các nút nhẹ có thể kiểm chứng ngay lập tức số dư hoặc biến lưu trữ của bất kỳ hợp đồng nào chỉ từ 32 byte `stateRoot`!

---

### Khung giải thích: tự tay chạy hàm chuyển trạng thái $$\Upsilon(\sigma_t, T)$$ kèm cơ chế phí EIP-1559 (nên đọc chậm)

Hãy đóng vai một nút Ethereum cập nhật trạng thái thế giới cho một giao dịch chuyển ETH chuẩn sau nâng cấp EIP-1559:

1. **Trạng thái ban đầu $$\sigma_t$$:**
   - Alice (EOA): `nonce = 5`, `balance = 2.000000 ETH`.
   - Bob (EOA): `nonce = 0`, `balance = 1.000000 ETH`.
   - Phí nền của khối hiện tại: `baseFee = 15 gwei` ($$1\text{ gwei} = 10^{-9}\text{ ETH}$$).
2. **Giao dịch $$T$$ do Alice ký:** `nonce = 5`, `to = Bob`, `value = 0.400000 ETH`, `gasLimit = 21 000` (mức chuẩn cho chuyển ETH thường), `maxFeePerGas = 20 gwei`, `maxPriorityFeePerGas = 2 gwei`.
3. **Tính phí gas thực tế và chia dòng tiền:**
   - Giá gas hiệu lực: $$\text{effectiveGasPrice} = \min(20,\ 15 + 2) = \mathbf{17\text{ gwei}}$$.
   - Tổng phí Alice phải trả: $$21\,000 \times 17\text{ gwei} = 357\,000\text{ gwei} = \mathbf{0.000357\text{ ETH}}$$.
   - Theo EIP-1559, phần phí nền $$21\,000 \times 15 = 315\,000\text{ gwei}$$ bị **đốt vĩnh viễn** khỏi tổng cung ETH (giảm áp lực lạm phát); chỉ phần tiền boa $$21\,000 \times 2 = 42\,000\text{ gwei}$$ được cộng cho validator đề xuất khối!
4. **Trạng thái mới $$\sigma_{t+1} = \Upsilon(\sigma_t, T)$$:**
   - Alice: `balance` $$= 2.000000 - 0.400000 - 0.000357 = \mathbf{1.599643\text{ ETH}}$$, và `nonce` tăng từ `5` lên **`6`**.
   - Bob: `balance` $$= 1.000000 + 0.400000 = \mathbf{1.400000\text{ ETH}}$$.
   - Nếu kẻ xấu bắt lấy nguyên gói tin giao dịch $$T$$ và phát lại lần thứ hai để rút thêm 0.4 ETH của Alice, mọi nút kiểm tra thấy `T.nonce (5) != Alice.nonce (6)` và loại bỏ ngay lập tức!

---

## 1. Tổng quan về khái niệm

**Ethereum** không chỉ là một đồng tiền mã hóa mà còn là một **máy tính phi tập trung toàn cầu (decentralized world computer)**, cho phép bất kỳ ai triển khai và vận hành **hợp đồng thông minh (smart contract)** — các chương trình tự động thực thi trên mạng lưới phân tán. Nếu Bitcoin thường được ví như "vàng kỹ thuật số" hay "tiền mặt ngang hàng", thì Ethereum hướng tới mô hình "tiền có thể lập trình" và nền tảng cho ứng dụng phi tập trung (dApp).

**Tầm nhìn của Vitalik Buterin**:

Năm 2013, **Vitalik Buterin** — khi đó là một lập trình viên 19 tuổi tham gia cộng đồng Bitcoin — nhận thấy ngôn ngữ Script của Bitcoin có giới hạn rõ rệt: nó chỉ xử lý được các điều kiện đơn giản mà không hỗ trợ tính toán phức tạp. Đề xuất tích hợp một ngôn ngữ lập trình đầy đủ Turing (Turing-complete) vào Bitcoin không được chấp nhận.

Vì vậy, trong năm 2013, ông đã công bố **Sách trắng Ethereum (Ethereum Whitepaper)** với tiêu đề "A Next-Generation Smart Contract and Decentralized Application Platform". Ý tưởng cốt lõi là:

> "What blockchain needs is a built-in Turing-complete programming language that allows anyone to write smart contracts and decentralized applications where they can create their own arbitrary rules for ownership, transaction formats and state transition functions."

**Hợp đồng thông minh — Trọng tâm của Ethereum**:

Thuật ngữ "hợp đồng thông minh" (smart contract) được **Nick Szabo** đề xuất từ năm 1994, nhưng Ethereum là nền tảng đầu tiên triển khai rộng rãi mô hình này:

```
Traditional Contract:
- Written in legal language
- Enforced by legal system
- Requires trusted intermediaries
- Slow, expensive, subjective interpretation

Smart Contract:
- Written in programming language (Solidity, Vyper)
- Enforced by blockchain consensus
- No intermediaries needed
- Instant, cheap, deterministic execution
```

**Ví dụ minh họa — Máy bán hàng tự động**:

Phép so sánh quen thuộc của Nick Szabo ví hợp đồng thông minh như một máy bán hàng tự động:

```
Traditional Purchase:
1. Go to store
2. Find clerk
3. Ask for item
4. Clerk gets item
5. Pay clerk
6. Clerk gives item
(Requires trust in clerk)

Vending Machine (Smart Contract):
1. Insert money
2. Press button
3. Get item automatically
(No trust needed - machine enforces rules)
```

Ethereum mở rộng nguyên lý này: mọi quy tắc có thể biểu diễn bằng chương trình đều có thể được thực thi tự động theo cách tương tự.

**Các mốc phát triển của Ethereum**:

- **2013**: Công bố Sách trắng Ethereum.
- **2014**: Đợt gọi vốn cộng đồng huy động 18 triệu USD (tương đương 31.000 BTC).
- **30/07/2015**: Khối khởi thủy (ra mắt phiên bản Frontier).
- **2016**: Sự cố tấn công The DAO dẫn đến phân tách thành Ethereum và Ethereum Classic.
- **2017**: Làn sóng gọi vốn ICO với hàng trăm dự án triển khai trên Ethereum.
- **2020**: Giai đoạn tăng trưởng mạnh của DeFi (Uniswap, Aave, Compound).
- **2021**: Làn sóng NFT (CryptoPunks, Bored Apes).
- **09/2022**: "The Merge" — chuyển đổi cơ chế đồng thuận từ PoW sang PoS.
- **2023–2024**: Phát triển các giải pháp mở rộng Layer 2 (Arbitrum, Optimism, zkSync).

**Điểm khác biệt chính so với Bitcoin**:

| Khía cạnh | Bitcoin | Ethereum |
|--------|---------|----------|
| **Mục đích** | Tiền tệ kỹ thuật số | Nền tảng lập trình ứng dụng |
| **Ngôn ngữ kịch bản** | Hạn chế (Script) | Đầy đủ Turing (Solidity) |
| **Mô hình trạng thái** | Mô hình UTXO | Mô hình tài khoản (Account) |
| **Thời gian tạo khối** | ~10 phút | ~12 giây |
| **Cơ chế đồng thuận** | PoW (SHA-256) | PoS (Gasper) |
| **Nguồn cung** | Giới hạn 21 triệu | Không có trần cứng (lạm phát thấp) |
| **Ứng dụng chính** | Lưu trữ giá trị, thanh toán | DeFi, NFT, DAO, dApp |

**Triết lý thiết kế kiến trúc Ethereum**:

Ethereum được thiết kế dựa trên sáu nguyên tắc:

1. **Đơn giản (Simplicity)**: Giữ giao thức nền tảng gọn nhất có thể.
2. **Tổng quát (Universality)**: Cung cấp ngôn ngữ lập trình đầy đủ Turing.
3. **Mô-đun hóa (Modularity)**: Tách biệt tầng đồng thuận với tầng thực thi.
4. **Linh hoạt (Agility)**: Cho phép nâng cấp giao thức khi cần thiết.
5. **Không thiên vị (Non-discrimination)**: Không gắn cứng ứng dụng cụ thể ở tầng giao thức.
6. **Chống kiểm duyệt (Non-censorship)**: Không kiểm duyệt giao dịch hợp lệ.

---

## 2. Hiểu biết trực quan

### 2.1. Ethereum như một "máy tính toàn cầu"

Có thể hình dung Ethereum như một hệ thống máy tính dùng chung vận hành trên phạm vi toàn cầu:

```
Traditional Cloud Computing:
- Run app on AWS, Google Cloud, etc.
- Trust company to not shut down
- Company can censor, change rules
- Centralized control

Ethereum "World Computer":
- Run app on thousands of nodes globally
- Cannot be shut down (decentralized)
- Rules enforced by code, not company
- Censorship-resistant
```

**Các thành phần tương đương**:
```
Hardware: Thousands of Ethereum nodes (computers running client)
CPU: EVM (Ethereum Virtual Machine) processes transactions
RAM: State (account balances, contract storage)
Hard Drive: Blockchain (permanent history)
Operating System: Ethereum protocol rules
Programs: Smart contracts
Users: External accounts sending transactions
```

**Mô hình chi phí**:
```
AWS: Pay per hour/month for resources
Ethereum: Pay per computation (Gas fees)

Example:
- Store 32 bytes: ~20,000 gas (~$0.50 at 50 gwei)
- Complex computation: 100,000 gas (~$2.50)
- Simple transfer: 21,000 gas (~$0.50)
```

### 2.2. Mô hình tài khoản so với UTXO — Tài khoản ngân hàng và tiền mặt

**Mô hình UTXO của Bitcoin (tương tự tiền mặt)**:
```
Alice has:
- $50 bill
- $20 bill
- $10 bill
Total: $80

To pay Bob $60:
- Use $50 + $20 bills
- Bob gets $60 in new bills
- Alice gets $10 change
- Old bills destroyed

Advantages: Privacy, parallel processing
Disadvantages: Complex to track "balance"
```

**Mô hình tài khoản của Ethereum (tương tự tài khoản ngân hàng)**:
```
Alice's account: $80
Bob's account: $40

To pay Bob $60:
- Alice account: $80 → $20
- Bob account: $40 → $100
- Simple deduction/addition

Advantages: Simple, intuitive, easy to track balance
Disadvantages: Less privacy, sequential processing
```

### 2.3. Hợp đồng thông minh minh họa qua chiến dịch gọi vốn

**Ví dụ khái niệm về hợp đồng thông minh**:

```
Contract: CrowdfundingCampaign
State:
  - Goal: 100 ETH
  - Deadline: Dec 31, 2024
  - Total raised: 0 ETH
  - Contributors: {}

Functions:
  contribute():
    - Accept ETH from sender
    - Add to total raised
    - Record contributor

  checkGoal():
    - If deadline passed:
      - If goal reached:
        → Send all ETH to project owner
      - If goal not reached:
        → Refund everyone automatically

No human intervention needed!
Rules enforced by code!
```

**So sánh với nền tảng truyền thống**:
```
Traditional Crowdfunding (Kickstarter):
- Platform takes 5% fee
- Can freeze/cancel campaign
- Refunds manual, slow
- Geographic restrictions

Smart Contract Crowdfunding:
- No platform fee (only gas)
- Cannot be censored
- Refunds automatic, instant
- Global, permissionless
```

### 2.4. Hệ thống Gas — "Tem bưu chính" cho tính toán

**Vấn đề**: Nếu tính toán trên mạng hoàn toàn miễn phí, kẻ tấn công có thể gửi các vòng lặp vô hạn để làm tắc nghẽn mạng lưới.

**Giải pháp — Gas**: Yêu cầu người gửi trả phí tương ứng với lượng tài nguyên tính toán tiêu thụ.

```
Analogy: Postage stamps
- Want to send letter? Buy stamp
- Heavier letter? More stamps
- More complex computation? More gas

Gas Pricing:
Operation          Gas Cost
---------------------------------
ADD two numbers    3 gas
MULTIPLY           5 gas
Store 32 bytes     20,000 gas
Create contract    32,000 gas
Transfer ETH       21,000 gas

User sets:
- Gas Limit: Max gas willing to spend
- Gas Price: How much per gas (in gwei)

Total Fee = Gas Used × Gas Price
```

**Ví dụ giao dịch**:
```
Send 1 ETH to friend:
- Gas used: 21,000
- Gas price: 50 gwei (0.00000005 ETH)
- Fee: 21,000 × 50 = 1,050,000 gwei = 0.00105 ETH

At $2,000/ETH: Fee = $2.10
```

### 2.5. EVM — Môi trường thực thi cô lập

**Máy ảo Ethereum (Ethereum Virtual Machine — EVM)** hoạt động như một máy tính chạy trong hộp cát (sandbox) dùng chung trên toàn mạng:

```
Sandbox Properties:
✓ Deterministic: Same input → Same output (always)
✓ Isolated: Cannot access external world directly
✓ Metered: Every operation costs gas
✓ Reversible: Failed transactions rollback completely

Why Sandbox?
- Security: Malicious code can't harm nodes
- Consensus: All nodes compute same result
- Fairness: No one gets free computation
```

**Kiến trúc máy ngăn xếp (Stack Machine)**:
```
EVM operates like calculator with stack:

Example: Compute 2 + 3 × 4

Stack operations:
1. PUSH 2    → [2]
2. PUSH 3    → [2, 3]
3. PUSH 4    → [2, 3, 4]
4. MUL       → [2, 12]      (3 × 4)
5. ADD       → [14]          (2 + 12)

Result: 14
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Mô hình tài khoản của Ethereum

**Hai loại tài khoản**:

**1. Tài khoản sở hữu bên ngoài (Externally Owned Accounts — EOA)**:
```python
class EOA:
    """User accounts controlled by private keys"""
    def __init__(self, private_key):
        self.address = derive_address(private_key)
        self.balance = 0  # ETH balance in wei
        self.nonce = 0    # Transaction counter
        
        # No code
        # No storage
```

**2. Tài khoản hợp đồng (Contract Accounts)**:
```python
class ContractAccount:
    """Smart contract accounts"""
    def __init__(self, creator):
        self.address = create_contract_address(creator)
        self.balance = 0      # Can hold ETH
        self.nonce = 1        # Always 1 for contracts
        self.code = b''       # EVM bytecode
        self.storage = {}     # Persistent storage (key → value)
```

**Cấu trúc trạng thái tài khoản**:
```
Account = {
    nonce: uint64,           // Transaction count (EOA) or 1 (contract)
    balance: uint256,        // Wei balance
    storageRoot: bytes32,    // Merkle root of storage trie
    codeHash: bytes32        // Hash of EVM code (empty for EOA)
}
```

**Cây trạng thái (State Trie)**:

Ethereum sử dụng **Patricia Merkle Trie** để lưu trữ toàn bộ trạng thái tài khoản:

```
                    State Root
                         |
        ┌───────────────┼───────────────┐
        |                               |
   Account 1                       Account 2
   ├─ nonce: 5                    ├─ nonce: 1
   ├─ balance: 10 ETH             ├─ balance: 0 ETH
   ├─ storageRoot: 0x...          ├─ storageRoot: 0x...
   └─ codeHash: 0x...             └─ codeHash: 0x...
```

**Cách tạo địa chỉ**:

**Địa chỉ EOA** (từ khóa công khai):
```python
def derive_eoa_address(public_key):
    """Derive Ethereum address from public key"""
    # Keccak-256 hash of public key (65 bytes)
    hash_result = keccak256(public_key)
    
    # Take last 20 bytes
    address = hash_result[-20:]
    
    # Add 0x prefix and checksum
    return to_checksum_address(address)
```

**Địa chỉ hợp đồng (CREATE)** (xác định từ người gửi và nonce):
```python
def create_contract_address(sender, nonce):
    """Compute contract address from sender and nonce"""
    # RLP encode [sender_address, nonce]
    rlp_encoded = rlp.encode([sender, nonce])
    
    # Keccak-256 hash
    hash_result = keccak256(rlp_encoded)
    
    # Take last 20 bytes
    return hash_result[-20:]
```

**Địa chỉ CREATE2** (xác định từ giá trị salt và mã khởi tạo):
```python
def create2_address(sender, salt, init_code):
    """Compute CREATE2 contract address"""
    # 0xff + sender + salt + keccak256(init_code)
    data = b'\xff' + sender + salt + keccak256(init_code)
    
    hash_result = keccak256(data)
    return hash_result[-20:]
```

### 3.2. Cấu trúc giao dịch

**Các trường trong giao dịch**:

```python
class Transaction:
    """Ethereum transaction"""
    def __init__(self):
        self.nonce = 0           # Sender's transaction count
        self.gas_price = 0       # Wei per gas (legacy)
        self.gas_limit = 0       # Max gas allowed
        self.to = None           # Recipient (None for contract creation)
        self.value = 0           # Wei to send
        self.data = b''          # Contract call data or init code
        self.v, self.r, self.s = 0, 0, 0  # ECDSA signature
        
        # EIP-1559 (post-London fork)
        self.max_fee_per_gas = 0              # Max total fee
        self.max_priority_fee_per_gas = 0    # Tip to miner
        self.chain_id = 1                     # Network ID
```

**Các loại giao dịch**:

**Loại 0: Legacy**
```
Fields: nonce, gasPrice, gasLimit, to, value, data, v, r, s
Fee: gasPrice × gasUsed
```

**Loại 1: EIP-2930 (Access List)**
```
Additional: accessList (pre-declare accessed addresses/storage)
Benefit: Gas savings for known access patterns
```

**Loại 2: EIP-1559 (Phí động — Dynamic Fee)**
```
Instead of gasPrice:
- maxFeePerGas: Maximum total willing to pay
- maxPriorityFeePerGas: Tip for validator

Actual fee: baseFee + min(maxPriorityFee, maxFee - baseFee)
```

**Vòng đời xử lý giao dịch**:

```python
def process_transaction(tx, state):
    """Process transaction through EVM"""
    
    # 1. Validation
    if tx.nonce != state.get_nonce(tx.sender):
        return "Invalid nonce"
    
    if state.get_balance(tx.sender) < tx.value + tx.gas_limit * tx.gas_price:
        return "Insufficient balance"
    
    # 2. Increment nonce
    state.increment_nonce(tx.sender)
    
    # 3. Deduct gas prepay
    gas_cost = tx.gas_limit * tx.gas_price
    state.deduct_balance(tx.sender, gas_cost)
    
    # 4. Execute
    if tx.to is None:
        # Contract creation
        result = create_contract(tx.data, tx.value, tx.gas_limit)
    else:
        # Call contract or transfer
        result = execute_call(tx.to, tx.data, tx.value, tx.gas_limit)
    
    # 5. Refund unused gas
    gas_refund = (tx.gas_limit - result.gas_used) * tx.gas_price
    state.add_balance(tx.sender, gas_refund)
    
    # 6. Pay validator
    validator_fee = result.gas_used * tx.gas_price
    state.add_balance(validator, validator_fee)
    
    return result
```

### 3.3. Cơ chế Gas

**Chi phí gas của một số phép toán cơ bản** (minh họa trước EIP-1559):

| Thao tác | Chi phí gas | Mô tả |
|-----------|----------|-------------|
| ADD, SUB | 3 | Phép cộng, trừ |
| MUL | 5 | Phép nhân |
| DIV, MOD | 5 | Phép chia, chia lấy dư |
| SHA3 | 30 + 6/word | Hàm băm Keccak-256 |
| BALANCE | 400 | Đọc số dư tài khoản |
| SLOAD | 800 | Đọc từ storage |
| SSTORE | 20,000 / 5,000 | Ghi vào storage (ô mới / ô đã có giá trị) |
| CALL | 700 + | Gọi hợp đồng khác |
| CREATE | 32,000 | Tạo hợp đồng mới |
| SELFDESTRUCT | 5,000 | Hủy hợp đồng |

**Thị trường phí EIP-1559**:

```python
def calculate_eip1559_fee(block, tx):
    """Calculate transaction fee under EIP-1559"""
    
    # Base fee (burned)
    base_fee = block.base_fee_per_gas
    
    # Priority fee (tip to validator)
    priority_fee = min(
        tx.max_priority_fee_per_gas,
        tx.max_fee_per_gas - base_fee
    )
    
    # Total fee per gas
    effective_gas_price = base_fee + priority_fee
    
    # Total fee
    total_fee = tx.gas_used * effective_gas_price
    
    # Distribution
    burned = tx.gas_used * base_fee
    validator_reward = tx.gas_used * priority_fee
    
    return {
        'total_fee': total_fee,
        'burned': burned,
        'validator_reward': validator_reward
    }
```

**Cơ chế điều chỉnh phí cơ sở (Base Fee)**:

```python
def update_base_fee(parent_block, current_block):
    """Update base fee based on block fullness"""
    
    TARGET_GAS = 15_000_000  # Target gas per block
    MAX_GAS = 30_000_000     # Max gas per block
    BASE_FEE_MAX_CHANGE_DENOMINATOR = 8
    
    parent_gas_used = parent_block.gas_used
    parent_base_fee = parent_block.base_fee
    
    if parent_gas_used == TARGET_GAS:
        # On target - no change
        return parent_base_fee
    
    elif parent_gas_used > TARGET_GAS:
        # Above target - increase fee
        gas_used_delta = parent_gas_used - TARGET_GAS
        base_fee_delta = max(
            parent_base_fee * gas_used_delta // TARGET_GAS // BASE_FEE_MAX_CHANGE_DENOMINATOR,
            1
        )
        return parent_base_fee + base_fee_delta
    
    else:
        # Below target - decrease fee
        gas_used_delta = TARGET_GAS - parent_gas_used
        base_fee_delta = parent_base_fee * gas_used_delta // TARGET_GAS // BASE_FEE_MAX_CHANGE_DENOMINATOR
        return max(parent_base_fee - base_fee_delta, 0)
```

### 3.4. Cấu trúc khối

**Cấu trúc khối Ethereum**:

```python
class EthereumBlock:
    """Ethereum block structure"""
    def __init__(self):
        # Header
        self.parent_hash = b''       # Hash of parent block
        self.uncle_hash = b''        # Hash of uncle headers (pre-Merge)
        self.coinbase = b''          # Validator address
        self.state_root = b''        # State trie root
        self.transactions_root = b'' # Transaction trie root
        self.receipts_root = b''     # Receipt trie root
        self.logs_bloom = b''        # Bloom filter for logs
        self.difficulty = 0          # PoW difficulty (0 post-Merge)
        self.number = 0              # Block number
        self.gas_limit = 0           # Max gas for block
        self.gas_used = 0            # Actual gas used
        self.timestamp = 0           # Unix timestamp
        self.extra_data = b''        # Arbitrary data (max 32 bytes)
        self.mix_hash = b''          # PoW mix hash (pre-Merge)
        self.nonce = 0               # PoW nonce (pre-Merge)
        self.base_fee_per_gas = 0    # EIP-1559 base fee
        
        # Body
        self.transactions = []       # List of transactions
        self.uncles = []            # Uncle headers (pre-Merge, max 2)
```

**Xác thực khối**:

```python
def validate_block(block, parent_block, state):
    """Validate Ethereum block"""
    
    # 1. Check parent hash
    if block.parent_hash != parent_block.hash():
        return False, "Invalid parent hash"
    
    # 2. Check block number
    if block.number != parent_block.number + 1:
        return False, "Invalid block number"
    
    # 3. Check timestamp
    if block.timestamp <= parent_block.timestamp:
        return False, "Invalid timestamp"
    
    # 4. Check gas limit (can only change by 1/1024 per block)
    if abs(block.gas_limit - parent_block.gas_limit) > parent_block.gas_limit // 1024:
        return False, "Gas limit changed too much"
    
    # 5. Check gas used
    if block.gas_used > block.gas_limit:
        return False, "Gas used exceeds limit"
    
    # 6. Validate transactions
    for tx in block.transactions:
        result = validate_transaction(tx, state)
        if not result.valid:
            return False, f"Invalid transaction: {tx.hash}"
    
    # 7. Verify state root
    computed_state_root = compute_state_root(state)
    if block.state_root != computed_state_root:
        return False, "State root mismatch"
    
    # 8. Check base fee (EIP-1559)
    expected_base_fee = update_base_fee(parent_block, block)
    if block.base_fee_per_gas != expected_base_fee:
        return False, "Invalid base fee"
    
    return True, "Valid"
```

### 3.5. Hàm chuyển đổi trạng thái

**Hàm cốt lõi của Ethereum**:

```python
def apply_transaction(state, tx):
    """Apply transaction to state (simplified)"""
    
    # Create execution context
    context = ExecutionContext(
        sender=tx.sender,
        origin=tx.sender,  # Original sender
        gas_price=tx.gas_price,
        gas_limit=tx.gas_limit
    )
    
    # Initialize gas
    gas_remaining = tx.gas_limit
    
    # Intrinsic gas (minimum cost)
    intrinsic_gas = calculate_intrinsic_gas(tx)
    gas_remaining -= intrinsic_gas
    
    if gas_remaining < 0:
        return TransactionResult(success=False, reason="Out of gas")
    
    # Execute
    if tx.to is None:
        # Contract creation
        contract_address = create_contract_address(tx.sender, state.get_nonce(tx.sender))
        result = evm_create(
            state=state,
            sender=tx.sender,
            value=tx.value,
            init_code=tx.data,
            gas=gas_remaining,
            context=context
        )
        
    else:
        # Message call
        result = evm_call(
            state=state,
            sender=tx.sender,
            recipient=tx.to,
            value=tx.value,
            data=tx.data,
            gas=gas_remaining,
            context=context
        )
    
    # Update state if successful
    if result.success:
        state.apply_changes(result.state_changes)
    else:
        # Revert state changes (except nonce increment và gas payment)
        pass
    
    return result
```

---

## Video tham khảo

- **Xem trước:** [What is ETHEREUM? EXPLAINED For Beginners](https://www.youtube.com/watch?v=1Hu8lzoi0Tw) — CoinGecko, tiếng Anh. Giới thiệu tổng quan về Ethereum như nền tảng máy tính toàn cầu và hợp đồng thông minh; nên xem trước mục so sánh với Bitcoin.
- [Account Based vs. UTxO - Understanding Ethereum](https://www.youtube.com/watch?v=5Mhvk0U6zqE) — Unbounded Capital, tiếng Anh. So sánh mô hình sổ cái theo tài khoản với UTXO, tương ứng với phần mô hình trạng thái trong bài.
- [What is the EVM? Ethereum Virtual Machine - Explained with Animations](https://www.youtube.com/watch?v=sTOcqS4msoU) — Whiteboard Crypto, tiếng Anh. Minh họa trực quan cách EVM xử lý giao dịch và cập nhật trạng thái, làm bước đệm sang bài tiếp theo về bytecode và gas.
