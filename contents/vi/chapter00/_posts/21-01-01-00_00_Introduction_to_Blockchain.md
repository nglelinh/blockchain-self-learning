---
layout: post
title: "Lecture 00.00: Giới thiệu về Blockchain và Distributed Ledgers"
chapter: '00'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Giới thiệu về Blockchain và Distributed Ledgers

## 1. Tổng quan về khái niệm

Blockchain là một trong những công nghệ đột phá nhất của thế kỷ 21, được sinh ra từ nhu cầu tạo ra một hệ thống thanh toán điện tử ngang hàng (peer-to-peer) không cần bên trung gian tin cậy. Khái niệm này lần đầu tiên được giới thiệu vào năm 2008 bởi một cá nhân hoặc nhóm người ẩn danh dưới bút danh **Satoshi Nakamoto** trong bài báo mang tính cách mạng "Bitcoin: A Peer-to-Peer Electronic Cash System".

Trước khi Bitcoin ra đời, các hệ thống thanh toán điện tử đều phải đối mặt với một vấn đề cơ bản được gọi là **vấn đề chi tiêu gấp đôi (double-spending problem)**. Trong thế giới vật lý, khi bạn đưa một tờ tiền giấy cho ai đó, bạn không còn sở hữu nó nữa - đó là tính chất vật lý tự nhiên. Nhưng với dữ liệu số, một file có thể được sao chép vô hạn lần. Làm thế nào để đảm bảo rằng một đồng tiền điện tử không thể được "chi tiêu" nhiều lần bởi cùng một người?

Giải pháp truyền thống là dựa vào một bên trung gian đáng tin cậy - như ngân hàng, PayPal, hay Visa - để theo dõi ai sở hữu bao nhiêu tiền và ai đã chuyển cho ai. Nhưng điều này tạo ra nhiều vấn đề: phí giao dịch cao, thời gian xử lý chậm, rủi ro về quyền riêng tư, và quan trọng nhất là **single point of failure** - nếu bên trung gian này bị tấn công, phá sản, hoặc hành động không trung thực, toàn bộ hệ thống sẽ sụp đổ.

Blockchain giải quyết vấn đề này một cách triệt để bằng cách thay thế bên trung gian tin cậy bằng một **cơ chế đồng thuận phân tán (distributed consensus mechanism)**. Thay vì một ngân hàng duy nhất lưu trữ sổ cái, hàng nghìn (hoặc hàng triệu) máy tính độc lập trên toàn thế giới cùng lưu trữ và xác thực cùng một bản sao của sổ cái. Mỗi giao dịch mới phải được đa số mạng lưới xác nhận trước khi được ghi vào sổ cái vĩnh viễn. Điều này tạo ra một hệ thống:

- **Phi tập trung (Decentralized)**: Không có một thực thể duy nhất kiểm soát
- **Minh bạch (Transparent)**: Mọi người đều có thể kiểm tra lịch sử giao dịch
- **Bất biến (Immutable)**: Một khi đã ghi vào blockchain, dữ liệu gần như không thể thay đổi
- **An toàn (Secure)**: Được bảo vệ bởi mật mã học và cơ chế đồng thuận

Blockchain không chỉ là công nghệ đằng sau Bitcoin. Nó là một **paradigm mới về cách lưu trữ và xác thực dữ liệu trong môi trường không tin cậy**. Từ các hợp đồng thông minh (smart contracts) trên Ethereum đến quản lý chuỗi cung ứng, từ hệ thống bỏ phiếu điện tử đến quản lý danh tính số, blockchain đang mở ra vô số ứng dụng tiềm năng.

Để hiểu sâu về blockchain, chúng ta cần nắm vững ba trụ cột chính:
1. **Mật mã học (Cryptography)**: Hash functions, digital signatures, public-key cryptography
2. **Cấu trúc dữ liệu phân tán (Distributed Data Structures)**: Merkle trees, blocks, chains
3. **Cơ chế đồng thuận (Consensus Mechanisms)**: Proof-of-Work, Proof-of-Stake, Byzantine Fault Tolerance

---

## 2. Hiểu biết trực quan

Hãy tưởng tượng blockchain như một **cuốn sổ kế toán công khai mà ai cũng có thể xem, nhưng không ai có thể xóa hay chỉnh sửa**.

Trong một ngôi làng nhỏ, thay vì có một ngân hàng trung tâm ghi lại tất cả các giao dịch, mọi người trong làng đều giữ một bản sao của sổ kế toán. Khi Alice muốn chuyển 10 đồng xu cho Bob, cô ấy thông báo cho cả làng:

> "Tôi, Alice, muốn chuyển 10 đồng xu cho Bob. Đây là chữ ký số của tôi để chứng minh đây là tôi."

Mọi người trong làng kiểm tra:
- Alice có thực sự đủ 10 đồng xu không? (bằng cách xem lại lịch sử giao dịch)
- Chữ ký có thực sự của Alice không?
- Giao dịch này có hợp lệ không?

Nếu đa số mọi người đồng ý giao dịch là hợp lệ, họ ghi nó vào sổ cái của mình. Nhưng thay vì ghi từng giao dịch riêng lẻ, họ thu thập nhiều giao dịch lại thành một **"trang"** (block). Mỗi trang mới được **"dán chặt"** vào trang trước bằng một **"con dấu mật mã"** đặc biệt (cryptographic hash), tạo thành một chuỗi các trang không thể tách rời.

Nếu ai đó cố gắng gian lận - ví dụ, Charlie muốn thay đổi một giao dịch cũ để lấy thêm tiền - anh ta sẽ phải:
1. Thay đổi trang đó trong sổ của mình
2. Nhưng điều này sẽ phá vỡ "con dấu mật mã" liên kết với trang tiếp theo
3. Vậy anh ta phải tính lại con dấu cho trang đó và TẤT CẢ các trang sau đó
4. Làm điều này nhanh hơn phần còn lại của làng (chiếm hơn 50% sức mạnh tính toán)

Trong thực tế, với hàng nghìn máy tính tham gia, việc này gần như không thể thực hiện.

**Analogy khác**: Blockchain giống như **một blockchain vật lý** (chuỗi khối thực sự):
- Mỗi khối chứa dữ liệu (giao dịch)
- Mỗi khối được liên kết với khối trước nó bằng một "móc khóa" mật mã
- Nếu bạn muốn thay đổi một khối ở giữa chuỗi, bạn phải "cắt đứt" và "hàn lại" tất cả các khối sau nó
- Nhưng mọi người khác trong mạng đều giữ bản sao của chuỗi nguyên gốc, nên họ sẽ từ chối phiên bản đã bị thay đổi của bạn

Hiểu theo cách này, blockchain về cơ bản là:
- **Một cơ sở dữ liệu phân tán** mà không có một bên nào kiểm soát
- **Chỉ có thể thêm vào** (append-only) - bạn có thể thêm dữ liệu mới nhưng không thể xóa dữ liệu cũ
- **Được bảo vệ bằng mật mã** để ngăn chặn gian lận
- **Được đồng bộ hóa** thông qua cơ chế đồng thuận giữa nhiều node

---

## 3. Nền tảng kỹ thuật

### 3.1. Cấu trúc của một Block

Một block trong blockchain chứa ba thành phần chính:

**Block Header (Phần đầu khối)**:
- **Previous Block Hash**: Hash của block trước đó, tạo ra chuỗi liên kết
- **Timestamp**: Thời gian block được tạo ra
- **Nonce**: Một số được sử dụng trong quá trình mining (Proof-of-Work)
- **Merkle Root**: Hash tổng hợp của tất cả các giao dịch trong block
- **Difficulty Target**: Mức độ khó của bài toán mật mã cần giải

**Transaction List (Danh sách giao dịch)**:
- Chứa tất cả các giao dịch được đóng gói trong block này
- Mỗi giao dịch bao gồm: sender, receiver, amount, signature

**Metadata**:
- Block number/height
- Size of block
- Number of transactions

### 3.2. Cryptographic Hash Functions

Hash function là trái tim của blockchain. Một hash function \( H \) là một hàm toán học nhận đầu vào có độ dài bất kỳ và tạo ra đầu ra có độ dài cố định:

\[
H: \{0,1\}^* \rightarrow \{0,1\}^n
\]

Trong Bitcoin, sử dụng **SHA-256** (Secure Hash Algorithm 256-bit), tạo ra output 256 bit.

**Tính chất quan trọng của cryptographic hash function**:

1. **Deterministic**: Cùng input luôn cho cùng output
   \[
   H(x) = y \implies H(x) = y \text{ (luôn luôn)}
   \]

2. **Pre-image Resistance**: Từ hash \( h \), cực kỳ khó tìm input \( x \) sao cho \( H(x) = h \)
   - Khó khăn tính toán: \( O(2^n) \) với n = 256

3. **Collision Resistance**: Cực kỳ khó tìm hai input khác nhau \( x_1 \neq x_2 \) sao cho \( H(x_1) = H(x_2) \)
   - Birthday paradox: cần khoảng \( 2^{n/2} \) phép thử, tức \( 2^{128} \) cho SHA-256

4. **Avalanche Effect**: Thay đổi một bit trong input sẽ thay đổi trung bình 50% các bit trong output

**Ví dụ thực tế với SHA-256**:
```
Input: "Hello, Blockchain!"
Output: 4d5a5e0b7c8d3f8e9a2c1b0d6f3e7a9c5b4d2e1f8a7b6c5d4e3f2a1b0c9d8e7f6

Input: "Hello, Blockchain?" (chỉ thay ! bằng ?)
Output: 8f7e6d5c4b3a2918d7c6b5a493827160f9e8d7c6b5a4938271605f4e3d2c1b0a
```

Thay đổi nhỏ → thay đổi hoàn toàn output.

### 3.3. Cấu trúc chuỗi (Chain Structure)

Blockchain được hình thành bằng cách mỗi block chứa hash của block trước đó:

```
Block 0 (Genesis)          Block 1                Block 2                Block 3
┌──────────────┐          ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Prev: 0x000  │          │ Prev: 0xABC  │       │ Prev: 0xDEF  │       │ Prev: 0x123  │
│ Data: ...    │──────────│ Data: ...    │───────│ Data: ...    │───────│ Data: ...    │
│ Hash: 0xABC  │          │ Hash: 0xDEF  │       │ Hash: 0x123  │       │ Hash: 0x456  │
└──────────────┘          └──────────────┘       └──────────────┘       └──────────────┘
```

Tính bất biến (Immutability) đến từ đây:
- Nếu thay đổi data trong Block 1
- Hash của Block 1 thay đổi
- Previous hash trong Block 2 không còn khớp
- Toàn bộ chain từ Block 2 trở đi trở nên invalid

### 3.4. Merkle Tree (Hash Tree)

Để tổ chức hiệu quả hàng nghìn giao dịch trong một block, blockchain sử dụng **Merkle Tree** - một cấu trúc dữ liệu dạng cây nhị phân trong đó:
- Các leaf node chứa hash của từng giao dịch
- Các internal node chứa hash của concatenation hai node con

```
                    Merkle Root
                   /            \
                Hash01          Hash23
               /     \         /      \
            Hash0   Hash1   Hash2   Hash3
              |       |       |       |
             Tx0     Tx1     Tx2     Tx3
```

**Lợi ích**:
1. **Efficient Verification**: Có thể verify một giao dịch có trong block không chỉ với \( O(\log n) \) hash values
2. **Compact Representation**: Block header chỉ cần lưu Merkle root (32 bytes) thay vì toàn bộ transactions (có thể hàng MB)
3. **Simplified Payment Verification (SPV)**: Light clients có thể verify transactions mà không cần tải toàn bộ blockchain

### 3.5. Distributed Ledger Technology (DLT)

Blockchain là một dạng của Distributed Ledger Technology. Một distributed ledger có các đặc điểm:

**Replication**: Mỗi node trong mạng lưu trữ một bản sao đầy đủ (hoặc một phần) của ledger

**Consensus**: Các node phải đồng ý về trạng thái hiện tại của ledger thông qua consensus protocol

**Validation**: Mỗi node độc lập validate các transactions trước khi accept

**Synchronization**: Các node liên tục đồng bộ để duy trì consistency

**Fault Tolerance**: Hệ thống tiếp tục hoạt động ngay cả khi một số node fail hoặc hành động maliciously

---

## 4. Công thức toán học và mật mã học

### 4.1. Hash Function - Định nghĩa chính thác

Cho \( H: \{0,1\}^* \rightarrow \{0,1\}^{256} \) là SHA-256 hash function.

**Computational Hardness Assumptions**:

1. **Pre-image Resistance** (One-wayness):
   \[
   \Pr[\text{Adversary finds } x \text{ given } H(x)] < \frac{1}{2^{256}}
   \]

2. **Second Pre-image Resistance**:
   \[
   \text{Given } x_1, \text{ find } x_2 \neq x_1 \text{ such that } H(x_1) = H(x_2)
   \]
   Probability of success: \( < 2^{-256} \)

3. **Collision Resistance**:
   \[
   \text{Find any } x_1 \neq x_2 \text{ such that } H(x_1) = H(x_2)
   \]
   By birthday paradox, requires approximately \( 2^{128} \) attempts.

### 4.2. Chain Integrity

Tính toàn vẹn của blockchain được đảm bảo bởi liên kết hash:

Cho blockchain \( B = [B_0, B_1, ..., B_n] \) với mỗi block \( B_i \) có:
- Data: \( D_i \)
- Previous hash: \( h_{i-1} = H(B_{i-1}) \)
- Current hash: \( h_i = H(B_i) = H(D_i || h_{i-1} || \text{metadata}_i) \)

Để thay đổi block \( B_k \) mà không bị phát hiện, attacker phải:
1. Compute new \( h_k' = H(D_k' || h_{k-1} || ...) \)
2. Recompute \( h_{k+1}' = H(D_{k+1} || h_k' || ...) \)
3. Repeat for all blocks \( B_{k+2}, ..., B_n \)
4. Catch up with the honest chain (if PoW is used)

**Computational Cost**:
\[
\text{Cost} = \sum_{i=k}^{n} \text{Work}(B_i) 
\]

Trong Proof-of-Work, \( \text{Work}(B_i) \) yêu cầu tìm nonce thỏa mãn:
\[
H(\text{block\_header}_i) < \text{Target}_i
\]

### 4.3. Merkle Proof

Để chứng minh transaction \( T_x \) có trong block với Merkle root \( M_R \):

Verifier cần:
- Transaction \( T_x \)
- Authentication path: \( [h_1, h_2, ..., h_{\log_2 n}] \)

Verification:
\[
\begin{align}
h_0 &= H(T_x) \\
h_1' &= H(h_0 || h_1) \\
h_2' &= H(h_1' || h_2) \\
&\vdots \\
h_{\log_2 n}' &= M_R
\end{align}
\]

Nếu \( h_{\log_2 n}' = M_R \), transaction được verify.

**Complexity**: \( O(\log n) \) thay vì \( O(n) \)

### 4.4. Byzantine Fault Tolerance

Trong mạng phân tán với \( n \) nodes, trong đó có \( f \) nodes là Byzantine (malicious hoặc faulty), consensus có thể đạt được nếu:

\[
n \geq 3f + 1
\]

Tức là cần ít nhất 2/3 + 1 nodes là honest.

**Intuition**: 
- \( f \) Byzantine nodes có thể gửi conflicting messages
- Cần \( f + 1 \) honest nodes để form majority
- Cần thêm \( f \) honest nodes để overcome worst case where \( f \) Byzantine nodes align
- Total: \( 2f + 1 \) honest + \( f \) Byzantine = \( 3f + 1 \)

---

## 5. Implementation Insight

### 5.1. Simplified Block Structure (Python)

```python
import hashlib
import json
import time
from typing import List, Dict, Any

class Transaction:
    def __init__(self, sender: str, receiver: str, amount: float):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.timestamp = time.time()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'sender': self.sender,
            'receiver': self.receiver,
            'amount': self.amount,
            'timestamp': self.timestamp
        }
    
    def hash(self) -> str:
        tx_string = json.dumps(self.to_dict(), sort_keys=True)
        return hashlib.sha256(tx_string.encode()).hexdigest()

class Block:
    def __init__(self, index: int, transactions: List[Transaction], 
                 previous_hash: str, timestamp: float = None):
        self.index = index
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.timestamp = timestamp or time.time()
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Tính hash của block"""
        block_data = {
            'index': self.index,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash,
            'timestamp': self.timestamp,
            'nonce': self.nonce
        }
        block_string = json.dumps(block_data, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int):
        """Proof-of-Work: tìm nonce sao cho hash bắt đầu với 'difficulty' số 0"""
        target = "0" * difficulty
        while not self.hash.startswith(target):
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"Block mined: {self.hash}")

class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.difficulty = 4
        self.pending_transactions: List[Transaction] = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """Tạo block đầu tiên (Genesis Block)"""
        genesis_block = Block(0, [], "0")
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        return self.chain[-1]
    
    def add_transaction(self, transaction: Transaction):
        """Thêm transaction vào pending pool"""
        self.pending_transactions.append(transaction)
    
    def mine_pending_transactions(self):
        """Mine một block mới chứa tất cả pending transactions"""
        if not self.pending_transactions:
            return
        
        new_block = Block(
            index=len(self.chain),
            transactions=self.pending_transactions,
            previous_hash=self.get_latest_block().hash
        )
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)
        
        # Clear pending transactions
        self.pending_transactions = []
    
    def is_chain_valid(self) -> bool:
        """Verify tính toàn vẹn của blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Verify hash của current block
            if current_block.hash != current_block.calculate_hash():
                print(f"Block {i} has been tampered with!")
                return False
            
            # Verify liên kết với previous block
            if current_block.previous_hash != previous_block.hash:
                print(f"Block {i} is not linked to previous block!")
                return False
        
        return True

# Example usage
if __name__ == "__main__":
    # Tạo blockchain
    blockchain = Blockchain()
    
    # Thêm transactions
    tx1 = Transaction("Alice", "Bob", 50)
    tx2 = Transaction("Bob", "Charlie", 25)
    
    blockchain.add_transaction(tx1)
    blockchain.add_transaction(tx2)
    
    # Mine block
    print("Mining block 1...")
    blockchain.mine_pending_transactions()
    
    # Thêm thêm transactions
    tx3 = Transaction("Charlie", "Alice", 10)
    blockchain.add_transaction(tx3)
    
    print("Mining block 2...")
    blockchain.mine_pending_transactions()
    
    # Verify blockchain
    print(f"\nBlockchain is valid: {blockchain.is_chain_valid()}")
    
    # Print blockchain
    for block in blockchain.chain:
        print(f"\nBlock {block.index}:")
        print(f"  Timestamp: {block.timestamp}")
        print(f"  Previous Hash: {block.previous_hash[:16]}...")
        print(f"  Hash: {block.hash[:16]}...")
        print(f"  Nonce: {block.nonce}")
        print(f"  Transactions: {len(block.transactions)}")
```

### 5.2. Bitcoin Implementation (C++)

Bitcoin Core implementation sử dụng cấu trúc tương tự nhưng phức tạp hơn:

```cpp
// Simplified Bitcoin block header structure
class CBlockHeader {
public:
    int32_t nVersion;           // Block version
    uint256 hashPrevBlock;      // Hash of previous block
    uint256 hashMerkleRoot;     // Merkle root of transactions
    uint32_t nTime;             // Timestamp
    uint32_t nBits;             // Difficulty target
    uint32_t nNonce;            // Nonce for PoW
    
    uint256 GetHash() const {
        return SerializeHash(*this);
    }
};
```

### 5.3. Ethereum Block Structure

Ethereum có cấu trúc phức tạp hơn với state transitions:

```javascript
// Simplified Ethereum block structure
interface Block {
    number: number;                    // Block number
    hash: string;                      // Block hash
    parentHash: string;                // Previous block hash
    nonce: string;                     // PoW nonce
    sha3Uncles: string;               // Hash of uncle blocks
    logsBloom: string;                // Bloom filter for logs
    transactionsRoot: string;         // Merkle root of transactions
    stateRoot: string;                // State trie root
    receiptsRoot: string;             // Receipts trie root
    miner: string;                    // Miner address
    difficulty: bigint;               // Mining difficulty
    totalDifficulty: bigint;          // Cumulative difficulty
    extraData: string;                // Extra data
    size: number;                     // Block size
    gasLimit: bigint;                 // Gas limit
    gasUsed: bigint;                  // Gas used
    timestamp: number;                // Timestamp
    transactions: Transaction[];       // List of transactions
    uncles: string[];                 // Uncle block hashes
}
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Blockchain Trilemma

Vitalik Buterin đã mô tả "Blockchain Trilemma" - sự đánh đổi giữa ba thuộc tính:

1. **Decentralization (Phi tập trung)**: Số lượng nodes tham gia
2. **Security (Bảo mật)**: Khó khăn để attack
3. **Scalability (Khả năng mở rộng)**: Throughput và latency

Không thể tối ưu hóa cả ba cùng lúc:

```
         Decentralization
              /  \
             /    \
            /      \
           /        \
    Security -------- Scalability
    
Bitcoin: High Decentralization + Security, Low Scalability
Visa: High Scalability + Security, No Decentralization
Private Chains: High Scalability, Low Decentralization
```

**Ví dụ cụ thể**:
- **Bitcoin**: ~7 transactions/second (TPS)
- **Ethereum**: ~15-30 TPS
- **Visa**: ~24,000 TPS
- **PayPal**: ~193 TPS

### 6.2. Storage Requirements

Blockchain size tăng liên tục:
- Bitcoin blockchain: ~500 GB (tính đến 2024)
- Ethereum blockchain: ~1 TB+ (full archive node)

Điều này tạo ra **centralization pressure**: chỉ những entities có resources mới có thể chạy full node.

**Solutions**:
- **Light clients**: Chỉ lưu block headers, verify bằng SPV
- **Pruning**: Xóa old state data, chỉ giữ recent
- **Sharding**: Chia blockchain thành multiple shards

### 6.3. 51% Attack

Nếu một attacker kiểm soát >50% mining power (PoW) hoặc stake (PoS), họ có thể:
- Double-spend coins
- Censor transactions
- Reverse transactions

**Probability of successful attack** (PoW):

Cho attacker có tỷ lệ hash power \( q \), honest miners có \( p = 1 - q \).

Xác suất attacker bắt kịp honest chain sau \( z \) blocks:

\[
P_{\text{catch-up}} = \begin{cases}
1 & \text{if } q \geq p \\
\left(\frac{q}{p}\right)^z & \text{if } q < p
\end{cases}
\]

Với \( q = 0.4 \) (40% hash power), sau 6 confirmations:
\[
P_{\text{catch-up}} = \left(\frac{0.4}{0.6}\right)^6 \approx 0.088 = 8.8\%
\]

**Defense**: Wait for more confirmations. Bitcoin thường đợi 6 confirmations (~1 giờ).

### 6.4. Finality Problem

Trong PoW blockchains, không có **absolute finality**. Luôn có khả năng một chain reorganization xảy ra.

**Types of Finality**:
- **Probabilistic Finality** (Bitcoin, PoW Ethereum): Finality increases với số confirmations
- **Absolute Finality** (PoS Ethereum, Tendermint): Blocks are finalized after certain conditions

### 6.5. Energy Consumption

Bitcoin PoW tiêu thụ ~150 TWh/năm (tương đương Argentina).

**Environmental concerns**:
- Carbon footprint
- E-waste from mining hardware

**Solutions**:
- Proof-of-Stake (giảm 99.95% energy)
- Green mining (renewable energy)
- Alternative consensus (PoA, DPoS)

### 6.6. Privacy Concerns

Blockchain là **pseudonymous**, không phải anonymous:
- Tất cả transactions đều public
- Địa chỉ có thể được link với real-world identity
- Transaction graph analysis

**Solutions**:
- **Zero-Knowledge Proofs** (ZK-SNARKs, ZK-STARKs)
- **Ring Signatures** (Monero)
- **Mixing Services** (CoinJoin)

---

## 7. Các khái niệm liên quan

### 7.1. Blockchain vs Traditional Database

| Feature | Blockchain | Traditional DB |
|---------|-----------|----------------|
| Control | Decentralized | Centralized |
| Trust Model | Trustless | Trusted admin |
| Transparency | Public (or permissioned) | Private |
| Immutability | High | Low (can edit/delete) |
| Performance | Low (consensus overhead) | High |
| Cost | High (redundancy) | Low |
| ACID Properties | Eventual consistency | Strong consistency |

### 7.2. Public vs Private Blockchains

**Public (Permissionless)**:
- Anyone can join
- Full transparency
- Token incentives
- Examples: Bitcoin, Ethereum

**Private (Permissioned)**:
- Restricted access
- Controlled transparency
- No token needed
- Examples: Hyperledger Fabric, R3 Corda

**Consortium**:
- Semi-decentralized
- Multiple organizations control
- Example: Energy Web Chain

### 7.3. Blockchain vs DAG (Directed Acyclic Graph)

**DAG-based systems** (IOTA, Nano, Hedera):
- Không có blocks, mỗi transaction reference trước đó
- Potentially higher throughput
- Different security model

```
Blockchain:      DAG:
  B3               Tx5 ──┐
  ↑                ↑     ↓
  B2             Tx3   Tx6
  ↑              ↑ ↑    
  B1            Tx1 Tx2
  ↑               ↑
  B0             Tx0
```

### 7.4. Layer 1 vs Layer 2

**Layer 1**: Base blockchain protocol (Bitcoin, Ethereum)

**Layer 2**: Solutions built on top để improve scalability:
- **State Channels** (Lightning Network)
- **Sidechains** (Polygon)
- **Rollups** (Optimistic, ZK-Rollups)

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Giới thiệu blockchain và Proof-of-Work consensus, giải quyết double-spending problem |
| **"Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform"** | 2014 | Vitalik Buterin | Mở rộng blockchain thành nền tảng lập trình với smart contracts |
| **"Practical Byzantine Fault Tolerance"** | 1999 | Miguel Castro, Barbara Liskov | Nền tảng cho modern consensus algorithms (PBFT) |
| **"The Byzantine Generals Problem"** | 1982 | Leslie Lamport, Robert Shostak, Marshall Pease | Định nghĩa Byzantine fault tolerance problem |
| **"Merkle Tree"** (concept) | 1979 | Ralph Merkle | Cấu trúc dữ liệu hiệu quả cho verification |
| **"Secure Hash Standard (SHS)"** | 2015 | NIST FIPS 180-4 | SHA-256 specification |
| **"Majority is not Enough: Bitcoin Mining is Vulnerable"** | 2013 | Ittay Eyal, Emin Gün Sirer | Phân tích selfish mining attack |
| **"The Bitcoin Lightning Network"** | 2016 | Joseph Poon, Thaddeus Dryja | Layer 2 scaling solution |
| **"Chainlink: A Decentralized Oracle Network"** | 2017 | Steve Ellis et al. | Kết nối blockchain với real-world data |

**Recommended Reading Order**:
1. Satoshi's Bitcoin whitepaper (8 pages, accessible)
2. Ethereum whitepaper (technical but readable)
3. Byzantine Generals Problem (understand consensus challenges)
4. PBFT paper (modern consensus mechanisms)

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Description | Source | Notes |
|-------------|--------|-------|
| **Blockchain structure diagram** | [Mastering Bitcoin - Chapter 7](https://github.com/bitcoinbook/bitcoinbook) by Andreas Antonopoulos | Open-source educational material, shows block linking |
| **Hash function visualization** | [Khan Academy - Cryptographic Hash Functions](https://www.khanacademy.org/computing/computer-science/cryptography) | Excellent for understanding one-way property |
| **Bitcoin transaction flow** | [Bitcoin.org - How Bitcoin Works](https://bitcoin.org/en/how-it-works) | Official Bitcoin documentation |
| **Merkle tree illustration** | [Ethereum.org - Merkle Proofs](https://ethereum.org/en/developers/tutorials/merkle-proofs-for-offline-data-integrity/) | Shows efficient verification |
| **Distributed ledger concept** | [IBM Blockchain Docs](https://www.ibm.com/blockchain/what-is-blockchain) | Enterprise perspective on DLT |
| **Byzantine Generals visualization** | [Martin Kleppmann's Blog](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) | Distributed systems concepts |
| **Blockchain trilemma diagram** | [Vitalik Buterin's Blog](https://vitalik.ca) | Scalability-security-decentralization tradeoff |

**Interactive Tools**:
- [Blockchain Demo](https://andersbrownworth.com/blockchain/) - Interactive visualization by Anders Brownworth
- [3D Blockchain Visualizer](https://www.blockchain.com/explorer) - Real-time Bitcoin blockchain explorer
- [Ethereum Virtual Machine Illustrated](https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf) - EVM internals

---

## 10. Tóm tắt và điểm chính

**Core Concepts**:
1. Blockchain là distributed ledger giải quyết double-spending không cần bên thứ ba
2. Sử dụng cryptographic hash functions để tạo immutability
3. Consensus mechanisms đảm bảo agreement trong environment không tin cậy
4. Trade-off giữa decentralization, security, và scalability

**Technical Foundation**:
- Hash functions: SHA-256, collision resistance, pre-image resistance
- Block structure: header, transactions, previous hash
- Merkle trees: efficient verification
- Chain linking: tamper-evident structure

**Applications**:
- Cryptocurrency (Bitcoin, Ethereum)
- Smart contracts
- Supply chain management
- Digital identity
- Decentralized finance (DeFi)

**Challenges**:
- Scalability limitations
- Energy consumption (PoW)
- Privacy concerns
- Finality vs speed tradeoffs
- Storage requirements

---

✅ **End of Lecture 00.00**

**Next**: Lecture 00.01 - Distributed Systems and Consensus Theory

---

## Video tham khảo

- **Xem trước:** [But how does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4) — 3Blue1Brown, tiếng Anh. Đi từ sổ cái chung và chữ ký số tới câu đố proof-of-work; trực giác cho phần tổng quan và chuỗi hash của bài.
- [How does a blockchain work - Simply Explained](https://www.youtube.com/watch?v=SSo_EIwHSd4) — Simply Explained, tiếng Anh. Xem cách một block được nối với block trước bằng hash, đúng mô hình notebook công khai ở phần hiểu biết trực quan.
- [Introduction to Bitcoin: what is bitcoin and why does it matter?](https://www.youtube.com/watch?v=l1si5ZWLgy0) — aantonop, tiếng Anh. Antonopoulos đặt Bitcoin vào bài toán truyền giá trị không cần trung gian, bối cảnh lịch sử mà mục 1 của bài mở ra.

## References

1. Nakamoto, S. (2008). Bitcoin: A peer-to-peer electronic cash system.
2. Buterin, V. (2014). Ethereum whitepaper: A next-generation smart contract and decentralized application platform.
3. Antonopoulos, A. M. (2017). *Mastering Bitcoin: Programming the Open Blockchain*. O'Reilly Media.
4. Narayanan, A., Bonneau, J., Felten, E., Miller, A., & Goldfeder, S. (2016). *Bitcoin and Cryptocurrency Technologies*. Princeton University Press.
5. Castro, M., & Liskov, B. (1999). Practical byzantine fault tolerance. OSDI, 99, 173-186.

