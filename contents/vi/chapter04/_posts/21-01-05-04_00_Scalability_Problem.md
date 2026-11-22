---
layout: post
title: "Lecture 04.00: Blockchain Scalability - The Trilemma và Solutions"
chapter: '04'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter04
---

# Bài giảng: Khả năng mở rộng Blockchain — Bộ ba bất khả thi và các giải pháp

## 1. Tổng quan về khái niệm

**Khả năng mở rộng (Scalability)** là một trong những thách thức lớn nhất của công nghệ blockchain. Trong khi các hệ thống thanh toán truyền thống như Visa xử lý khoảng 24.000 giao dịch mỗi giây (TPS), Bitcoin chỉ đạt khoảng 7 TPS và Ethereum đạt khoảng 15–30 TPS. Khoảng cách chênh lệch theo cấp độ lớn này là nút thắt cốt lõi khi đưa blockchain vào ứng dụng rộng rãi.

**Bộ ba bất khả thi của Blockchain (Blockchain Trilemma)**:

Khái niệm do **Vitalik Buterin** nêu ra chỉ ra rằng một hệ thống blockchain khó tối ưu đồng thời cả ba thuộc tính và thường phải ưu tiên tối đa hai trong ba yếu tố sau:

**1. Tính phi tập trung (Decentralization)**:
- Số lượng nút tham gia mạng lưới lớn.
- Không tồn tại điểm kiểm soát tập trung.
- Bất kỳ ai cũng có thể tham gia xác thực.

**2. Tính bảo mật (Security)**:
- Khả năng chống lại các cuộc tấn công.
- Chi phí kinh tế để phá hoại mạng lưới cao.
- Đảm bảo chịu lỗi Byzantine.

**3. Khả năng mở rộng (Scalability)**:
- Thông lượng giao dịch (TPS) cao.
- Độ trễ xác nhận thấp.
- Chi phí trên mỗi giao dịch thấp.

```
        Decentralization
             /  \
            /    \
           /  ⚠️  \
          /________\
    Security        Scalability
    
You can only have 2 of 3!

Bitcoin: Decentralization + Security → Low Scalability
Private chains: Security + Scalability → Low Decentralization
Some altcoins: Scalability + Decentralization → Questionable Security
```

**Nguyên nhân tồn tại của bộ ba bất khả thi**:

Các giới hạn vật lý cơ bản của mạng ngang hàng:

1. **Băng thông (Bandwidth)**: Mỗi nút đầy đủ cần nhận toàn bộ giao dịch:
   \[
   \text{Bandwidth Required} = \text{TPS} \times \text{Avg TX Size} \times 8 \text{ bits/byte}
   \]
   
   Với 10.000 TPS:
   \[
   10000 \times 250 \text{ bytes} \times 8 = 20 \text{ Mbps minimum}
   \]

2. **Lưu trữ (Storage)**: Mỗi nút đầy đủ lưu giữ toàn bộ lịch sử chuỗi:
   \[
   \text{Growth Rate} = \text{TPS} \times \text{Avg TX Size} \times 86400 \text{ seconds/day}
   \]
   
   Với 10.000 TPS:
   \[
   10000 \times 250 \times 86400 = 216 \text{ GB/day!}
   \]

3. **Tính toán (Computation)**: Mỗi nút phải xác thực toàn bộ giao dịch:
   \[
   \text{CPU Required} \propto \text{TPS} \times \text{Validation Cost}
   \]

**Các giai đoạn tìm kiếm giải pháp mở rộng**:

**2015–2017: Tranh luận về kích thước khối (The Block Size Wars — Bitcoin)**
```
Small blocks (1 MB):
✓ More nodes can participate (decentralization)
✓ Easier to verify (security)
✗ Only ~7 TPS (scalability)

Big blocks (8+ MB):
✓ More TPS (~56+) (scalability)
✗ Fewer can run full nodes (centralization)
✗ Longer validation time

Result: Bitcoin Cash hard fork (2017)
        Bitcoin kept 1MB base, added SegWit
        BCH went to 8MB → 32MB → 128MB
```

**2017–2020: Sự ra đời của các giải pháp Layer 2**
```
Lightning Network (Bitcoin):
- Off-chain payment channels
- Instant, cheap transactions
- Sacrifice some decentralization

Plasma, State Channels (Ethereum):
- Various Layer 2 approaches
- Different trust assumptions
```

**Từ 2020 đến nay: Lộ trình lấy Rollup làm trung tâm (Rollup-Centric Roadmap)**
```
Ethereum's strategy:
- Layer 1: Security and decentralization
- Layer 2: Scalability (rollups)
- Best of both worlds?
```

---

## 2. Hiểu biết trực quan

### 2.1. Bài toán mở rộng — Phép so sánh với đường cao tốc

**Bitcoin / Ethereum** tương tự **tuyến đường hẹp nhưng mở cho mọi người**:

```
Highway Capacity:
- Lanes: 1 (block size)
- Cars per minute: 7 (TPS)
- Everyone sees all cars (transparency)
- Very secure road (attack-resistant)

During rush hour:
- Huge traffic jam!
- Wait hours to get on highway
- Expensive toll (high fees)
- But very safe, anyone can use
```

**Visa** tương tự **đường cao tốc tư nhân nhiều làn**:

```
Highway Capacity:
- Lanes: 1000 (centralized servers)
- Cars per minute: 24,000 (TPS)
- Only Visa sees traffic (no transparency)
- Single company controls

Benefits:
- No traffic jams
- Instant processing
- Cheap tolls

Drawbacks:
- Visa can block you
- Single point of failure
- Must trust Visa
```

Câu hỏi đặt ra là làm thế nào để xây dựng một hệ thống vừa phi tập trung, vừa đạt thông lượng cao.

### 2.2. Layer 2 như các "làn đường cao tốc trên cao"

**Layer 1** (Chuỗi chính) đóng vai trò **trục đường nền**:
```
Slow but secure
Everyone can verify
Expensive
Permanent record
```

**Layer 2** (Rollups, Lightning) đóng vai trò **làn chạy nhanh phía trên**:
```
Fast transactions
Still secured by main highway
Cheap
Periodic checkpoints to main chain
```

**Liên hệ trực quan**:
```
Main Highway (Layer 1):
- Every car recorded individually
- Full security checks
- Slow but thorough

Express Lane (Layer 2):
- Bundle 100 cars → 1 record on main highway
- Fast processing
- Still protected by main highway security
- Checkpoints ensure safety
```

### 2.3. Kênh trạng thái (State Channels) — Cơ chế ghi sổ thanh toán cuối phiên

**Lightning Network** hoạt động tương tự việc mở sổ ghi nợ tại quán rồi thanh toán một lần lúc rời đi:

```
Traditional (On-chain):
Every beer purchase:
- Transaction on blockchain
- Wait for confirmation
- Pay fee
Total: 10 beers = 10 transactions = 10 fees

Lightning (State Channel):
1. Open tab (on-chain): Lock $100
2. Buy 10 beers (off-chain): Instant, free
3. Close tab (on-chain): Final settlement
Total: 10 beers = 2 on-chain transactions only!

Savings: 80% less blockchain usage!
```

**Cách vận hành**:
```
Alice ←→ Bob (payment channel)

Open channel:
- Both deposit funds in 2-of-2 multisig
- On-chain transaction

Transact (off-chain):
- Update channel balance
- Sign new state
- Can go back and forth unlimited times
- Instant, no fees

Close channel:
- Broadcast final state
- On-chain transaction
- Both receive final balances
```

### 2.4. Rollups — Xử lý giao dịch theo lô

**Optimistic Rollups** tương tự **sao kê thẻ tín dụng định kỳ**:

```
Individual Transactions (Layer 1):
- Every purchase separately verified
- Slow, expensive

Credit Card Statement (Rollup):
- Batch 1000 purchases
- Assume valid (optimistic)
- Publish summary to blockchain
- Challenge period: Can dispute if wrong

Result: 1000 transactions → 1 blockchain entry!
```

**ZK-Rollups** sử dụng **bằng chứng toán học cho cả lô giao dịch**:

```
Batch 1000 transactions
Generate cryptographic proof: "These 1000 TXs are valid"
Post proof + summary to blockchain
Blockchain verifies proof (fast!)

No need to check each transaction!
Proof guarantees validity!
```

### 2.5. Sharding — Phân mảnh dữ liệu

**Sharding** tương tự kỹ thuật phân mảnh cơ sở dữ liệu trên nhiều máy chủ:

```
Traditional Blockchain:
All nodes process ALL transactions
└─ Node 1: TX 1, 2, 3, 4, 5...
└─ Node 2: TX 1, 2, 3, 4, 5...
└─ Node 3: TX 1, 2, 3, 4, 5...

Sharded Blockchain:
Nodes specialized per shard
└─ Shard A nodes: TX 1, 3, 5...
└─ Shard B nodes: TX 2, 4, 6...
└─ Beacon chain: Coordinates shards

Throughput: 2× with 2 shards, 64× with 64 shards!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Phân tích thông lượng

**Giới hạn xử lý giao dịch**:

\[
\text{TPS}_{\max} = \frac{\text{Block Size}}{\text{Avg TX Size} \times \text{Block Time}}
\]

**Bitcoin**:
\[
\text{TPS} = \frac{1 \text{ MB}}{250 \text{ bytes} \times 600 \text{ s}} = \frac{1,000,000}{150,000} \approx 7 \text{ TPS}
\]

**Ethereum** (trước The Merge):
\[
\text{TPS} = \frac{15M \text{ gas}}{21000 \text{ gas/TX} \times 13 \text{ s}} \approx 55 \text{ TPS}
\]

Trong thực tế, thông lượng chỉ đạt khoảng 15–30 TPS do nhiều giao dịch tương tác hợp đồng thông minh tiêu thụ lượng gas cao hơn mức 21.000 gas cơ bản.

**Các chỉ số đánh giá khả năng mở rộng**:

| Chỉ số | Định nghĩa | Ý nghĩa |
|--------|---------|------------|
| **TPS** | Số giao dịch mỗi giây | Thông lượng mạng |
| **Tính hoàn tất (Finality)** | Thời gian đạt trạng thái không thể đảo ngược | Trải nghiệm người dùng |
| **Chi phí** | Phí trên mỗi giao dịch | Mức độ dễ tiếp cận |
| **Số lượng nút** | Số nút đầy đủ đang hoạt động | Mức độ phi tập trung |
| **Tốc độ tăng lưu trữ** | Dung lượng tăng thêm mỗi ngày (GB) | Tính bền vững lâu dài |

### 3.2. Kiến trúc Lightning Network

**Vòng đời của một kênh thanh toán**:

**1. Mở kênh** (trên chuỗi — on-chain):
```solidity
function openChannel(address party1, address party2) public payable {
    require(msg.value > 0, "Must fund channel");
    
    Channel storage channel = channels[channelId];
    channel.party1 = party1;
    channel.party2 = party2;
    channel.balance1 = msg.value / 2;
    channel.balance2 = msg.value / 2;
    channel.nonce = 0;
    channel.open = true;
    
    emit ChannelOpened(channelId, party1, party2, msg.value);
}
```

**2. Cập nhật trạng thái** (ngoài chuỗi — off-chain):
```python
class ChannelState:
    def __init__(self, balance1, balance2, nonce=0):
        self.balance1 = balance1
        self.balance2 = balance2
        self.nonce = nonce
    
    def update(self, amount, from_party1_to_party2):
        """Create new state after payment"""
        if from_party1_to_party2:
            new_balance1 = self.balance1 - amount
            new_balance2 = self.balance2 + amount
        else:
            new_balance1 = self.balance1 + amount
            new_balance2 = self.balance2 - amount
        
        # Validate
        if new_balance1 < 0 or new_balance2 < 0:
            raise Exception("Insufficient balance")
        
        return ChannelState(new_balance1, new_balance2, self.nonce + 1)
    
    def sign(self, private_key):
        """Sign state"""
        state_hash = hash(f"{self.balance1}{self.balance2}{self.nonce}")
        return ecdsa_sign(state_hash, private_key)
    
    def verify(self, signature, public_key):
        """Verify signed state"""
        state_hash = hash(f"{self.balance1}{self.balance2}{self.nonce}")
        return ecdsa_verify(state_hash, signature, public_key)
```

**3. Đóng kênh** (trên chuỗi — on-chain):
```solidity
function closeChannel(
    uint256 channelId,
    uint256 balance1,
    uint256 balance2,
    uint256 nonce,
    bytes memory sig1,
    bytes memory sig2
) public {
    Channel storage channel = channels[channelId];
    require(channel.open, "Channel not open");
    
    // Verify signatures from both parties
    bytes32 stateHash = keccak256(abi.encodePacked(balance1, balance2, nonce));
    require(verify(stateHash, sig1, channel.party1), "Invalid sig1");
    require(verify(stateHash, sig2, channel.party2), "Invalid sig2");
    
    // Must be latest state
    require(nonce >= channel.nonce, "Old state");
    
    // Payout
    payable(channel.party1).transfer(balance1);
    payable(channel.party2).transfer(balance2);
    
    channel.open = false;
    
    emit ChannelClosed(channelId, balance1, balance2);
}
```

**Định tuyến nhiều chặng (Multi-Hop Routing với HTLC)**:

```
Alice wants to pay David, but no direct channel

Route: Alice → Bob → Charlie → David

1. David creates secret preimage: R, hash H = hash(R)
2. David sends H to Alice
3. Alice → Bob: "I'll pay 10 if you show R within 24h"
4. Bob → Charlie: "I'll pay 10 if you show R within 12h"
5. Charlie → David: "I'll pay 10 if you show R within 6h"
6. David reveals R to Charlie (gets 10)
7. Charlie reveals R to Bob (gets 10)
8. Bob reveals R to Alice (gets 10)
9. Alice verifies R matches H ✓

Atomicity: Either all succeed or all fail!
```

### 3.3. Optimistic Rollups

**Nguyên lý cốt lõi**: Mặc định coi lô giao dịch là hợp lệ và mở khoảng thời gian tranh chấp để phát hiện gian lận.

```python
class OptimisticRollup:
    """Simplified Optimistic Rollup"""
    
    def __init__(self):
        self.state_root = "0x00"
        self.batches = []
        self.challenge_period = 7 * 24 * 3600  # 7 days
    
    def submit_batch(self, transactions, new_state_root):
        """Sequencer submits batch"""
        batch = {
            'id': len(self.batches),
            'transactions': transactions,
            'old_state_root': self.state_root,
            'new_state_root': new_state_root,
            'timestamp': time.time(),
            'challenged': False,
            'finalized': False
        }
        
        self.batches.append(batch)
        
        print(f"Batch {batch['id']} submitted:")
        print(f"  Transactions: {len(transactions)}")
        print(f"  New state root: {new_state_root[:16]}...")
        
        return batch['id']
    
    def challenge_batch(self, batch_id, fraud_proof):
        """Validator challenges invalid batch"""
        batch = self.batches[batch_id]
        
        # Check challenge period
        if time.time() > batch['timestamp'] + self.challenge_period:
            return False, "Challenge period expired"
        
        # Verify fraud proof
        if self.verify_fraud_proof(batch, fraud_proof):
            batch['challenged'] = True
            
            # Slash sequencer
            self.slash_sequencer(batch)
            
            # Revert state
            self.state_root = batch['old_state_root']
            
            print(f"⚠️  Batch {batch_id} CHALLENGED successfully!")
            print(f"   Sequencer slashed")
            print(f"   State reverted")
            
            return True, "Challenge successful"
        
        return False, "Invalid fraud proof"
    
    def finalize_batch(self, batch_id):
        """Finalize batch after challenge period"""
        batch = self.batches[batch_id]
        
        # Check challenge period passed
        if time.time() < batch['timestamp'] + self.challenge_period:
            return False, "Challenge period not over"
        
        if batch['challenged']:
            return False, "Batch was challenged"
        
        # Finalize
        batch['finalized'] = True
        self.state_root = batch['new_state_root']
        
        print(f"✓ Batch {batch_id} FINALIZED")
        
        return True, "Batch finalized"
    
    def verify_fraud_proof(self, batch, fraud_proof):
        """Verify fraud proof (simplified)"""
        # In production: Re-execute transaction
        # Compare result with claimed state transition
        # If different → fraud proven
        
        # Simplified for demo
        return fraud_proof.get('is_fraud', False)
    
    def slash_sequencer(self, batch):
        """Penalize dishonest sequencer"""
        # In production: Burn sequencer's stake
        print("Sequencer stake slashed!")
```

### 3.4. ZK-Rollups

**Hướng tiếp cận bằng chứng không tiết lộ thông tin (Zero-Knowledge Proof)**:

```python
class ZKRollup:
    """Simplified ZK-Rollup"""
    
    def __init__(self):
        self.state_root = "0x00"
        self.batches = []
    
    def submit_batch(self, transactions, new_state_root, zk_proof):
        """Submit batch with validity proof"""
        
        # Verify ZK proof (proves transactions valid)
        if not self.verify_zk_proof(
            old_state=self.state_root,
            new_state=new_state_root,
            transactions=transactions,
            proof=zk_proof
        ):
            return False, "Invalid ZK proof"
        
        # If proof valid, immediately update state
        batch = {
            'id': len(self.batches),
            'transactions': transactions,
            'new_state_root': new_state_root,
            'timestamp': time.time(),
            'finalized': True  # Immediately finalized!
        }
        
        self.batches.append(batch)
        self.state_root = new_state_root
        
        print(f"✓ Batch {batch['id']} submitted and FINALIZED")
        print(f"  Transactions: {len(transactions)}")
        print(f"  State root: {new_state_root[:16]}...")
        
        return True, "Batch accepted"
    
    def verify_zk_proof(self, old_state, new_state, transactions, proof):
        """Verify zero-knowledge proof"""
        # In production: Use zk-SNARK/zk-STARK verifier
        # Verifies: "If you execute these TXs on old_state,
        #            you get new_state"
        
        # Proof verification is MUCH faster than re-execution!
        # e.g., Verify 10,000 TXs in milliseconds
        
        # Simplified
        return proof.get('valid', True)
```

**So sánh Optimistic Rollup và ZK-Rollup**:

| Đặc điểm | Optimistic Rollup | ZK-Rollup |
|---------|------------------|-----------|
| **Tính hoàn tất** | 7 ngày (thời gian tranh chấp) | Tức thì sau khi xác minh bằng chứng |
| **Chi phí tạo bằng chứng** | Không tạo bằng chứng trước (chỉ khi tranh chấp) | Cao (chi phí tính toán bằng chứng ZK) |
| **Chi phí xác minh trên L1** | Thấp (chỉ xử lý khi có khiếu nại) | Cao hơn (luôn xác minh bằng chứng) |
| **Tương thích EVM** | Tương thích cao với EVM | Tương thích EVM phức tạp hơn |
| **Ví dụ** | Arbitrum, Optimism | zkSync, StarkNet |

---

## 4. Công thức toán học và phân tích

### 4.1. Các chỉ số khả năng mở rộng

**TPS tối đa theo lý thuyết**:

\[
\text{TPS}_{\max} = \frac{B_{\max}}{T_{\min} \times S_{\text{avg}}}
\]

Trong đó:
- \( B_{\max} \) là kích thước khối tối đa (byte).
- \( T_{\min} \) là thời gian tạo khối tối thiểu (giây).
- \( S_{\text{avg}} \) là kích thước trung bình một giao dịch (byte).

**Khi sử dụng Rollup**:

\[
\text{TPS}_{\text{rollup}} = \text{TPS}_{\text{L1}} \times \frac{S_{\text{L1 TX}}}{S_{\text{compressed}}}
\]

**Ví dụ**:
```
Ethereum L1: 15 TPS, 110 bytes/TX

Rollup compression: 10 bytes/TX (90% reduction)

TPS_rollup = 15 × (110 / 10) = 165 TPS

With multiple rollups: 165 × 100 = 16,500 TPS!
```

### 4.2. Năng lực của Lightning Network

**Dung lượng kênh**:

Với một kênh hai chiều trong đó mỗi bên nạp số dư \( B \):

\[
\text{Capacity} = 2B \quad \text{(bidirectional)}
\]

**Quy mô mạng lưới** (khi định tuyến):

Với mạng gồm \( n \) nút và trung bình \( c \) kênh trên mỗi nút:

\[
\text{Total Channels} \approx \frac{nc}{2}
\]

**Thông lượng** (không bị giới hạn bởi thời gian tạo khối):

\[
\text{TPS}_{\text{Lightning}} \approx \infty \quad \text{(limited only by network bandwidth)}
\]

**Các giới hạn thực tế**:
- Độ phức tạp tìm đường: \( O(|E| \log |V|) \) (thuật toán Dijkstra).
- Ràng buộc thanh khoản trên từng chặng.
- Yêu cầu các nút tham gia phải trực tuyến.

### 4.3. Tính khả dụng dữ liệu (Data Availability) của Rollup

**Lượng dữ liệu cần đăng lên L1** (Optimistic Rollup):

Với một lô gồm \( n \) giao dịch:

\[
\text{Data} = n \times (\text{Compressed TX}) + \text{State Root}
\]

**Ví dụ**:
```
1000 transactions
Compressed: 10 bytes each
State root: 32 bytes

Data = 1000 × 10 + 32 = 10,032 bytes

Posted to L1:
Cost = 10,032 bytes × 16 gas/byte = 160,512 gas
At 50 gwei: ~0.008 ETH (~$16 at $2000/ETH)

Cost per TX: $16 / 1000 = $0.016

Compare to L1: ~$5 per TX

Savings: 99.7%!
```

### 4.4. Phân tích bảo mật của Sharding

**Ngưỡng kiểm soát shard**:

Xét hệ thống có \( n \) shard, mỗi shard gồm \( m \) validator và kẻ tấn công kiểm soát tỷ lệ \( \alpha \) tổng lượng stake. Trong mô hình đơn giản xét xác suất kẻ tấn công kiểm soát toàn bộ \( m \) validator của ít nhất một shard:

\[
P(\text{corrupt}) = 1 - \left(1 - \alpha^{m}\right)^n
\]

Trong đó \( m \) là số validator trên mỗi shard (lưu ý rằng trong thực tế kẻ tấn công chỉ cần kiểm soát ngưỡng 2/3 số validator của một shard; xác suất khi đó được tính theo phân phối nhị thức).

**Ví dụ**:
```
Total validators: 10,000
Shards: 64
Validators per shard: 10,000 / 64 ≈ 156
Attacker stake: 10%

P(control 1 shard) = (0.1)^156 ≈ 10^-156 (virtually impossible)

But with random assignment:
Need 2/3 of shard validators
P(2/3 of 156) = ...calculating via binomial distribution...
```

**Đánh đổi bảo mật**: Càng chia nhiều shard thì thông lượng càng tăng, nhưng số validator mỗi shard giảm đi, đòi hỏi cơ chế phân bổ ngẫu nhiên chặt chẽ để giữ an toàn.

### 4.5. Mức tiết kiệm chi phí của Rollup

**Hệ số giảm chi phí**:

\[
R = \frac{\text{Cost}_{\text{L1}}}{\text{Cost}_{\text{L2}}} = \frac{S_{\text{L1 TX}}}{S_{\text{calldata}}}
\]

**Optimistic Rollup**:
```
L1 TX: ~110 bytes
Calldata: ~10 bytes (compressed)

R = 110 / 10 = 11× cheaper
```

**ZK-Rollup**:
```
L1 TX: ~110 bytes
Proof overhead: Amortized over batch
Calldata per TX: ~5 bytes

R = 110 / 5 = 22× cheaper (even better!)
```

**Chi phí thực tế tham khảo**:
```
Ethereum L1: $5-50 per transaction
Optimism: $0.50-5 per transaction (10× cheaper)
Arbitrum: $0.30-3 per transaction (15× cheaper)
zkSync: $0.10-1 per transaction (50× cheaper)
StarkNet: $0.05-0.50 per transaction (100× cheaper)
```

---

## 5. Góc nhìn triển khai

### 5.1. Cài đặt kênh thanh toán (Payment Channel)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Simple Payment Channel
 * @dev Bidirectional payment channel (Lightning-style)
 */
contract PaymentChannel {
    struct Channel {
        address party1;
        address party2;
        uint256 balance1;
        uint256 balance2;
        uint256 nonce;
        uint256 openedAt;
        bool open;
    }
    
    mapping(bytes32 => Channel) public channels;
    uint256 public constant CHALLENGE_PERIOD = 1 days;
    
    event ChannelOpened(bytes32 indexed channelId, address party1, address party2, uint256 totalDeposit);
    event ChannelClosed(bytes32 indexed channelId, uint256 balance1, uint256 balance2);
    event ChannelChallenged(bytes32 indexed channelId);
    
    /**
     * @dev Open payment channel
     */
    function openChannel(address party2) external payable returns (bytes32) {
        require(msg.value > 0, "Must deposit funds");
        require(party2 != address(0) && party2 != msg.sender, "Invalid party");
        
        bytes32 channelId = keccak256(abi.encodePacked(msg.sender, party2, block.timestamp));
        
        Channel storage channel = channels[channelId];
        channel.party1 = msg.sender;
        channel.party2 = party2;
        channel.balance1 = msg.value;
        channel.balance2 = 0;  // Party2 can deposit later
        channel.nonce = 0;
        channel.openedAt = block.timestamp;
        channel.open = true;
        
        emit ChannelOpened(channelId, msg.sender, party2, msg.value);
        
        return channelId;
    }
    
    /**
     * @dev Close channel cooperatively (both parties agree)
     */
    function closeChannelCooperative(
        bytes32 channelId,
        uint256 balance1,
        uint256 balance2,
        uint256 nonce,
        bytes memory sig1,
        bytes memory sig2
    ) external {
        Channel storage channel = channels[channelId];
        require(channel.open, "Channel not open");
        
        // Verify both signatures
        bytes32 stateHash = getStateHash(channelId, balance1, balance2, nonce);
        require(recoverSigner(stateHash, sig1) == channel.party1, "Invalid signature 1");
        require(recoverSigner(stateHash, sig2) == channel.party2, "Invalid signature 2");
        
        // Must be latest nonce
        require(nonce >= channel.nonce, "Old state");
        
        // Verify total balance
        require(balance1 + balance2 == channel.balance1 + channel.balance2, "Invalid balances");
        
        // Close and payout
        channel.open = false;
        
        if (balance1 > 0) payable(channel.party1).transfer(balance1);
        if (balance2 > 0) payable(channel.party2).transfer(balance2);
        
        emit ChannelClosed(channelId, balance1, balance2);
    }
    
    /**
     * @dev Close channel unilaterally (one party initiates)
     */
    function closeChannelUnilateral(
        bytes32 channelId,
        uint256 balance1,
        uint256 balance2,
        uint256 nonce,
        bytes memory sig
    ) external {
        Channel storage channel = channels[channelId];
        require(channel.open, "Channel not open");
        require(msg.sender == channel.party1 || msg.sender == channel.party2, "Not participant");
        
        // Verify signature from other party
        bytes32 stateHash = getStateHash(channelId, balance1, balance2, nonce);
        address otherParty = msg.sender == channel.party1 ? channel.party2 : channel.party1;
        require(recoverSigner(stateHash, sig) == otherParty, "Invalid signature");
        
        // Start challenge period
        channel.nonce = nonce;
        channel.balance1 = balance1;
        channel.balance2 = balance2;
        
        emit ChannelChallenged(channelId);
        
        // Must wait CHALLENGE_PERIOD before finalizing
        // (allows counterparty to submit newer state)
    }
    
    /**
     * @dev Finalize after challenge period
     */
    function finalizeClose(bytes32 channelId) external {
        Channel storage channel = channels[channelId];
        require(channel.open, "Channel not open");
        require(block.timestamp >= channel.openedAt + CHALLENGE_PERIOD, "Challenge period active");
        
        // Close and payout
        uint256 balance1 = channel.balance1;
        uint256 balance2 = channel.balance2;
        
        channel.open = false;
        
        if (balance1 > 0) payable(channel.party1).transfer(balance1);
        if (balance2 > 0) payable(channel.party2).transfer(balance2);
        
        emit ChannelClosed(channelId, balance1, balance2);
    }
    
    /**
     * @dev Helper: Get state hash for signing
     */
    function getStateHash(
        bytes32 channelId,
        uint256 balance1,
        uint256 balance2,
        uint256 nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(channelId, balance1, balance2, nonce));
    }
    
    /**
     * @dev Helper: Recover signer from signature
     */
    function recoverSigner(bytes32 hash, bytes memory signature) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        return ecrecover(hash, v, r, s);
    }
}
```

---

## Video tham khảo

- **Xem trước:** [The Blockchain Trilemma EXPLAINED](https://www.youtube.com/watch?v=F3b5C7AjZnk) — EatTheBlocks, tiếng Anh. Minh họa tam giác phi tập trung, bảo mật và thông lượng; nên xem trước mục bộ ba bất khả thi.
- [Bitcoin's Lightning Network, Simply Explained!](https://www.youtube.com/watch?v=rrr_zPmEiME) — Simply Explained, tiếng Anh. Giải thích cơ chế kênh thanh toán Lightning ngoài chuỗi, tương ứng với phần kênh trạng thái trong bài.
- [A Technical Introduction to The Lightning Network - We Are Developers 2020](https://www.youtube.com/watch?v=E1n3sKKPD_k) — aantonop, tiếng Anh. Andreas Antonopoulos phân tích sâu kỹ thuật của Lightning Network, kết nối giới hạn TPS tầng 1 với tầng kênh thanh toán.
