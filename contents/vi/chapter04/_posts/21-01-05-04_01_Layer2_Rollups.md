---
layout: post
title: "Lecture 04.01: Layer 2 Solutions - Rollups Deep Dive"
chapter: '04'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter04
---

# Bài giảng: Giải pháp Layer 2 — Phân tích chuyên sâu về Rollups

## 1. Tổng quan về khái niệm

**Rollups** đã trở thành **giải pháp mở rộng chủ đạo** của Ethereum trong lộ trình lấy rollup làm trung tâm (rollup-centric roadmap) do Vitalik Buterin đề xuất. Rollup thực thi giao dịch ngoài chuỗi (off-chain) nhưng đăng dữ liệu giao dịch lên Layer 1, qua đó kế thừa tính bảo mật của Ethereum trong khi tăng thông lượng lên khoảng 10–100 lần.

**Nguyên lý cốt lõi**:

Thay vì thực thi từng giao dịch trực tiếp trên mạng chính Ethereum với chi phí cao và tốc độ chậm, rollup thực hiện bốn bước:

1. **Thực thi ngoài chuỗi**: Xử lý hàng nghìn giao dịch bên ngoài Ethereum L1.
2. **Gom lô (Batching)**: Gộp nhiều giao dịch thành một lô duy nhất.
3. **Đăng dữ liệu lên L1**: Gửi dữ liệu đã nén cùng bằng chứng (hoặc gốc trạng thái) lên Ethereum.
4. **Kế thừa bảo mật**: Dựa vào cơ chế đồng thuận của Ethereum để đảm bảo tính toàn vẹn và khả dụng dữ liệu.

**Mục tiêu của Rollup**:

\[
\text{Security(Rollup)} = \text{Security(Ethereum L1)}
\]
\[
\text{TPS(Rollup)} = \text{TPS(Ethereum)} \times 10\text{–}100
\]
\[
\text{Cost(Rollup)} = \frac{\text{Cost(Ethereum)}}{10\text{–}100}
\]

**Hai loại Rollup chính**:

**Optimistic Rollups**:
- Mặc định coi các giao dịch trong lô là hợp lệ (lạc quan).
- Cho phép gửi bằng chứng gian lận (fraud proof) nếu phát hiện sai lệch.
- Thời gian chờ rút tài sản về L1 thường là 7 ngày.
- Ví dụ: Arbitrum, Optimism.

**ZK-Rollups**:
- Tạo bằng chứng hợp lệ bằng mật mã học (validity proof).
- Tính đúng đắn của lô giao dịch được chứng minh bằng toán học trước khi cập nhật trạng thái.
- Rút tài sản về L1 nhanh chóng sau khi bằng chứng được xác minh.
- Ví dụ: zkSync, StarkNet, Polygon zkEVM.

**Lịch sử phát triển**:

- **2014**: Đề xuất khái niệm Plasma (Vitalik Buterin và Joseph Poon).
- **2018**: Đề xuất mô hình Optimistic Rollup.
- **2019**: Định hình kiến trúc ZK-Rollup.
- **2020**: Các rollup đầu tiên chạy trên mạng thử nghiệm (testnet).
- **2021**: Các rollup triển khai trên mainnet (Arbitrum, Optimism).
- **2022**: Sự ra đời của các zkEVM rollup (zkSync 2.0, Polygon zkEVM).
- **2023–2024**: Hệ sinh thái rollup mở rộng mạnh và cạnh tranh về hiệu năng, chi phí.

**Vì sao Rollups trở thành hướng đi chủ đạo?**

Các giải pháp mở rộng khác gặp những giới hạn riêng:
- **State channels**: Trải nghiệm người dùng phức tạp, đòi hỏi khóa thanh khoản trước.
- **Plasma**: Gặp bài toán về tính khả dụng dữ liệu (data availability).
- **Sidechains**: Có tập validator và giả định bảo mật riêng, không kế thừa hoàn toàn L1.
- **Sharding tầng thực thi**: Độ phức tạp triển khai rất lớn.

Trong khi đó, rollup có các ưu điểm rõ rệt:
- ✅ Kế thừa bảo mật từ L1 mà không cần dựng tập validator độc lập.
- ✅ Kiến trúc khả thi hơn cho triển khai thực tế.
- ✅ Hỗ trợ tương thích EVM.
- ✅ Có cơ sở lý thuyết vững chắc.

---

## 2. Hiểu biết trực quan

### 2.1. Rollup như cơ chế xử lý theo lô

**Xử lý từng giao dịch riêng lẻ** (Ethereum L1):
```
Customer Service Center:
- 1000 customers
- Each gets individual appointment
- Each takes 10 minutes
- Total time: 10,000 minutes (7 days!)
- Cost: $50 per customer = $50,000

Slow, expensive, but every case handled personally
```

**Xử lý theo lô** (Rollup):
```
Batch Service:
- Same 1000 customers
- Group into batches of 100
- Process batch together
- Each batch: 30 minutes
- Total time: 300 minutes (5 hours!)
- Cost: $5 per customer = $5,000

10× faster, 10× cheaper!
```

**Liên hệ với giao dịch trên Ethereum**:
```
L1: Each transaction processed individually on Ethereum
    └─ Gas: ~21,000 per simple transfer
    └─ Cost: $5-50 depending on congestion

Rollup: Batch 100 transactions
    └─ Gas on L1: ~100,000 total (amortized)
    └─ Gas per TX: ~1,000
    └─ Cost: $0.50-5 per transaction
    
10× improvement!
```

### 2.2. Optimistic và ZK — "Tin trước kiểm sau" so với "Chứng minh ngay"

**Optimistic Rollup** hoạt động theo cơ chế **"tin tưởng mặc định và kiểm tra khi có khiếu nại"**:
```
Tax Return Analogy:

You submit tax return:
└─ Government assumes correct (optimistic)
└─ Don't verify immediately (save resources)
└─ Anyone can challenge within timeframe (7 days)
└─ If challenged: Audit happens
└─ If fraud found: Penalties!

Most returns honest → System efficient!
```

**ZK-Rollup** hoạt động theo cơ chế **"chứng minh mật mã ngay từ đầu"**:
```
Airport Security Analogy:

You go through security:
└─ X-ray scan (proof)
└─ Proves: "No weapons" without opening every bag
└─ Mathematical guarantee
└─ No trust needed
└─ Instant verification

Every passenger verified → System secure!
```

**So sánh nhanh**:
```
Optimistic:
✓ Simpler to implement
✓ Full EVM compatibility
✗ 7-day withdrawal delay
✗ Fraud proof complexity

ZK:
✓ Instant finality
✓ Higher throughput
✗ Complex cryptography
✗ Limited EVM compatibility (improving)
```

### 2.3. Tính khả dụng dữ liệu (Data Availability) — Bài toán hóa đơn

**Vấn đề**:

```
Rollup posts to L1:
"I processed 1000 transactions, new state root: 0xABC..."

But if transaction data not available:
└─ Cannot verify state transition
└─ Cannot reconstruct state
└─ Cannot withdraw funds!

Like: Restaurant gives you receipt
     But receipt illegible
     Can't prove what you ordered!
```

**Giải pháp**: Đăng toàn bộ dữ liệu giao dịch lên L1 dưới dạng **calldata** (hoặc blob sau EIP-4844):

```
Calldata:
✓ Permanent (stored on Ethereum forever)
✓ Cheaper than storage (~16 gas/byte vs 20,000/slot)
✓ Anyone can download
✓ Can reconstruct full state

Trade-off: Still costs gas (limits compression)
```

### 2.4. Bằng chứng gian lận (Fraud Proofs) — Hệ thống khiếu nại

**Cơ chế tranh chấp trong Optimistic Rollup**:

```
Normal flow:
1. Sequencer posts batch
2. Validators assume valid
3. Wait 7 days
4. If no challenge → Finalize

Challenge flow:
1. Validator detects invalid state transition
2. Submits fraud proof to L1
3. L1 re-executes disputed transaction
4. If fraud proven:
   → Sequencer slashed
   → State reverted
   → Challenger rewarded

Incentive: Profitable to catch fraud!
```

**Động lực kinh tế (Lý thuyết trò chơi)**:

```
Sequencer decision:
- Honest: Earn fees
- Cheat: Lose stake (>fees earned)

Rational choice: Be honest!

Validator decision:
- Monitor: Earn bounty if find fraud
- Ignore: Miss reward opportunity

Rational choice: Monitor actively!
```

### 2.5. Bằng chứng hợp lệ (Validity Proofs) — Đảm bảo toán học

**Bằng chứng ZK-SNARK**:

```
Claim: "These 1000 transactions are valid"

Without ZK:
└─ Must re-execute all 1000 TX
└─ Takes significant time/gas
└─ Must trust executor

With ZK:
└─ Generate proof (off-chain): "Execution correct"
└─ Proof size: ~128 bytes
└─ Verify proof (on-chain): ~1ms, minimal gas
└─ Mathematical guarantee: Cannot fake proof

Like: Professor grades 1000 exams
     Provides summary + cryptographic proof
     You verify proof in seconds (don't re-grade!)
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Kiến trúc Optimistic Rollup

**Các thành phần chính**:

```
┌─────────────────────────────────────┐
│         Optimistic Rollup            │
├─────────────────────────────────────┤
│  Sequencer (Operator)               │
│  - Orders transactions               │
│  - Executes state transitions        │
│  - Posts batches to L1              │
├─────────────────────────────────────┤
│  State                               │
│  - Account balances                  │
│  - Contract storage                  │
│  - Maintained off-chain             │
├─────────────────────────────────────┤
│  L1 Contract (Ethereum)             │
│  - Stores state root                │
│  - Accepts batches                   │
│  - Handles withdrawals              │
│  - Processes fraud proofs           │
├─────────────────────────────────────┤
│  Validators (Watchers)              │
│  - Monitor batches                   │
│  - Detect fraud                      │
│  - Submit fraud proofs              │
└─────────────────────────────────────┘
```

**Cơ chế bằng chứng gian lận**:

```solidity
contract OptimisticRollup {
    struct StateRoot {
        bytes32 root;
        uint256 timestamp;
        bool challenged;
        bool finalized;
    }
    
    mapping(uint256 => StateRoot) public stateRoots;
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public latestBatchId;
    
    event BatchSubmitted(uint256 indexed batchId, bytes32 stateRoot);
    event FraudProven(uint256 indexed batchId, address challenger);
    
    /**
     * @dev Sequencer submits batch
     */
    function submitBatch(
        bytes32 newStateRoot,
        bytes calldata transactions
    ) external {
        latestBatchId++;
        
        stateRoots[latestBatchId] = StateRoot({
            root: newStateRoot,
            timestamp: block.timestamp,
            challenged: false,
            finalized: false
        });
        
        // Store transaction data (calldata - cheap but permanent)
        // This ensures data availability!
        
        emit BatchSubmitted(latestBatchId, newStateRoot);
    }
    
    /**
     * @dev Challenge invalid batch with fraud proof
     */
    function challengeBatch(
        uint256 batchId,
        bytes calldata fraudProof
    ) external {
        StateRoot storage batch = stateRoots[batchId];
        
        require(!batch.finalized, "Already finalized");
        require(block.timestamp <= batch.timestamp + CHALLENGE_PERIOD, "Challenge period over");
        
        // Verify fraud proof
        // Proof contains:
        // - Pre-state
        // - Transaction
        // - Post-state (claimed by sequencer)
        // - Actual post-state (computed on-chain)
        
        (bool isFraud, bytes32 correctStateRoot) = verifyFraudProof(fraudProof);
        
        if (isFraud) {
            batch.challenged = true;
            
            // Slash sequencer
            slashSequencer();
            
            // Reward challenger
            rewardChallenger(msg.sender);
            
            // Revert state
            // In production: Revert all subsequent batches too
            
            emit FraudProven(batchId, msg.sender);
        }
    }
    
    /**
     * @dev Finalize batch after challenge period
     */
    function finalizeBatch(uint256 batchId) external {
        StateRoot storage batch = stateRoots[batchId];
        
        require(!batch.challenged, "Batch was challenged");
        require(!batch.finalized, "Already finalized");
        require(block.timestamp > batch.timestamp + CHALLENGE_PERIOD, "Challenge period active");
        
        batch.finalized = true;
    }
    
    /**
     * @dev Verify fraud proof (re-execute transaction on-chain)
     */
    function verifyFraudProof(bytes calldata proof) internal returns (bool isFraud, bytes32 correctRoot) {
        // Decode proof
        (
            bytes32 preState,
            bytes memory transaction,
            bytes32 claimedPostState
        ) = abi.decode(proof, (bytes32, bytes, bytes32));
        
        // Re-execute transaction on-chain
        bytes32 actualPostState = executeTransaction(preState, transaction);
        
        // Compare
        if (actualPostState != claimedPostState) {
            return (true, actualPostState);  // Fraud!
        }
        
        return (false, claimedPostState);  // Valid
    }
    
    /**
     * @dev Execute single transaction (simplified)
     */
    function executeTransaction(bytes32 preState, bytes memory tx) internal pure returns (bytes32) {
        // In production: Full EVM execution
        // For now: Simplified state transition
        return keccak256(abi.encodePacked(preState, tx));
    }
    
    function slashSequencer() internal {
        // Burn sequencer's stake
    }
    
    function rewardChallenger(address challenger) internal {
        // Give portion of slashed stake to challenger
    }
}
```

### 3.2. Kiến trúc ZK-Rollup

**Hệ thống bằng chứng hợp lệ**:

```solidity
contract ZKRollup {
    bytes32 public stateRoot;
    uint256 public batchCounter;
    
    // Verification key (from trusted setup)
    bytes32 public verificationKey;
    
    event BatchProcessed(uint256 indexed batchId, bytes32 newStateRoot, uint256 numTransactions);
    
    /**
     * @dev Submit batch with validity proof
     */
    function submitBatch(
        bytes32 newStateRoot,
        bytes calldata compressedTransactions,
        bytes calldata zkProof
    ) external {
        // Verify ZK proof
        require(
            verifyZKProof(
                stateRoot,        // Old state
                newStateRoot,     // New state
                compressedTransactions,
                zkProof
            ),
            "Invalid ZK proof"
        );
        
        // Update state immediately (no challenge period!)
        stateRoot = newStateRoot;
        batchCounter++;
        
        emit BatchProcessed(batchCounter, newStateRoot, getNumTx(compressedTransactions));
    }
    
    /**
     * @dev Verify zero-knowledge proof
     */
    function verifyZKProof(
        bytes32 oldState,
        bytes32 newState,
        bytes calldata transactions,
        bytes calldata proof
    ) internal view returns (bool) {
        // In production: Use zk-SNARK verifier contract
        // Verifies: "Executing these TXs on oldState produces newState"
        
        // Public inputs to proof
        uint256[] memory publicInputs = new uint256[](3);
        publicInputs[0] = uint256(oldState);
        publicInputs[1] = uint256(newState);
        publicInputs[2] = uint256(keccak256(transactions));
        
        // Verify proof (Groth16, PLONK, or other scheme)
        return zkVerifier.verify(publicInputs, proof);
    }
    
    function getNumTx(bytes calldata data) internal pure returns (uint256) {
        // Decode number of transactions from compressed data
        return data.length / 12;  // Simplified: 12 bytes per TX
    }
}
```

**So sánh chi tiết**:

| Khía cạnh | Optimistic Rollup | ZK-Rollup |
|--------|-----------|-----------|
| **Mô hình tin cậy** | Mặc định hợp lệ, tranh chấp khi sai | Chứng minh hợp lệ bằng mật mã học |
| **Tính hoàn tất** | 7 ngày (thời gian tranh chấp) | Tức thì sau khi xác minh trên L1 |
| **Rút tài sản về L1** | Chậm (chờ 7 ngày) | Nhanh (vài phút) |
| **Tạo bằng chứng** | Không cần tạo trước (chi phí thấp) | Tốn tài nguyên tính toán lớn |
| **Xác minh bằng chứng** | Chỉ khi có tranh chấp | Mọi lô đều phải xác minh trên L1 |
| **Tương thích EVM** | Đầy đủ (Arbitrum, Optimism) | Phức tạp hơn nhưng đang cải thiện (zkEVM) |
| **Dữ liệu đăng lên L1** | Dữ liệu giao dịch (đã nén) | Gọn hơn (có thể chỉ cần chênh lệch trạng thái) |

---

## 4. Công thức toán học và phân tích

### 4.1. Tính toán thông lượng

**Thông lượng trên Ethereum L1**:

\[
\text{TPS}_{\text{L1}} = \frac{\text{Block Gas Limit}}{\text{Gas per TX} \times \text{Block Time}} = \frac{30M}{21000 \times 12} \approx 119 \text{ TPS}
\]

Trong thực tế, thông lượng chỉ vào khoảng 15–30 TPS do phần lớn giao dịch phức tạp hơn lệnh chuyển ETH đơn giản.

**Thông lượng của một Rollup dùng calldata**:

\[
\text{TPS}_{\text{rollup}} = \frac{\text{Block Gas Limit} / n}{\text{Calldata Gas per TX} \times \text{Block Time}}
\]

Trong đó \( n \) là số lượng rollup cùng chia sẻ không gian khối L1.

**Ví dụ (Optimistic Rollup)**:
```
Assume 1 rollup uses full block:
- TX data: 12 bytes per TX (compressed)
- Calldata cost: 16 gas per byte
- Gas per TX: 12 × 16 = 192 gas

TPS = 30M / (192 × 12) = 13,020 TPS

Improvement: 13,020 / 15 ≈ 868× better!
```

**Khi sử dụng EIP-4844 (Proto-Danksharding)**:

\[
\text{TPS}_{\text{blob}} = \frac{\text{Blob Space}}{\text{Bytes per TX} \times \text{Block Time}}
\]

```
1 blob (~125 KB per block), Block time = 12s:
TPS ≈ 125,000 / (12 × 12) ≈ 868 TPS (shared across rollups using 1 blob)

With 3–6 blobs/block (EIP-4844): ~2,600–5,200 TPS total across L2s
With future full Danksharding (e.g., 64+ blobs): tens of thousands of TPS!
```

### 4.2. Phân tích chi phí

**Chi phí giao dịch trên L1**:

\[
\text{Cost}_{\text{L1}} = \text{Gas} \times \text{Gas Price} \times \text{ETH Price}
\]

```
Simple transfer:
= 21,000 × 50 gwei × $2000
= 21,000 × 50 × 10^-9 × 2000
= $2.10
```

**Chi phí giao dịch trên Rollup**:

\[
\text{Cost}_{\text{rollup}} = \frac{\text{Batch Posting Cost}}{\text{Num TX in Batch}}
\]

**Optimistic Rollup**:
```
Batch: 1000 transactions
Calldata: 1000 × 12 bytes = 12,000 bytes
Gas: 12,000 × 16 = 192,000 gas
Cost: 192,000 × 50 gwei × $2000 = $19.20

Per TX: $19.20 / 1000 = $0.0192 (~2 cents)

Savings: $2.10 / $0.0192 = 109× cheaper!
```

**ZK-Rollup** (nén dữ liệu tốt hơn):
```
Batch: 1000 transactions
Calldata: 1000 × 5 bytes = 5,000 bytes (better compression!)
Proof verification: ~500,000 gas (one-time)
Gas: 5,000 × 16 + 500,000 = 580,000 gas
Cost: 580,000 × 50 gwei × $2000 = $58

Per TX: $58 / 1000 = $0.058 (~6 cents)

Still 36× cheaper than L1!
```

### 4.3. Phân tích bảo mật

**Bảo mật của Optimistic Rollup**:

Giả định có ít nhất 1 validator trung thực giám sát mạng (mô hình 1-of-N):

\[
P(\text{fraud succeeds}) = P(\text{no honest validator}) = (1 - p)^n
\]

Trong đó:
- \( p \) là xác suất một validator hành động trung thực.
- \( n \) là số lượng validator giám sát.

**Ví dụ**:
```
p = 0.99 (99% honest)
n = 10 validators

P(fraud) = (0.01)^10 = 10^-20 (virtually impossible!)
```

Chỉ cần một nút giám sát trung thực là đủ để phát hiện và ngăn chặn lô giao dịch gian lận.

**Bảo mật của ZK-Rollup**:

Dựa trực tiếp vào độ an toàn mật mã học thay vì giả định giám sát:

\[
P(\text{fake proof}) \approx 2^{-128} \quad \text{(soundness error)}
\]

Về mặt tính toán, việc giả mạo một bằng chứng hợp lệ là bất khả thi.

### 4.4. Phân tích thời gian rút tài sản

**Optimistic Rollup**:

\[
T_{\text{withdraw}} = T_{\text{challenge}} + T_{\text{L1 confirm}}
\]

```
Challenge period: 7 days
L1 confirmation: ~15 minutes

Total: ~7 days

Why so long? Must allow time for fraud challenges!
```

**ZK-Rollup**:

\[
T_{\text{withdraw}} = T_{\text{proof gen}} + T_{\text{L1 confirm}}
\]

```
Proof generation: ~minutes (off-chain)
L1 confirmation: ~15 minutes

Total: ~20-30 minutes

Much faster! Proof guarantees validity immediately.
```

### 4.5. Tỷ lệ nén dữ liệu

**Dữ liệu một giao dịch đầy đủ trên Ethereum L1**:
```
Transaction fields:
- Nonce: 8 bytes
- Gas price: 8 bytes
- Gas limit: 8 bytes
- To: 20 bytes
- Value: 32 bytes
- Data: variable
- Signature (v,r,s): 65 bytes

Total: ~110 bytes minimum
```

**Dữ liệu sau khi nén trên Rollup**:

**Optimistic Rollup**:
```
Compressed TX:
- From: 4 bytes (index)
- To: 4 bytes (index)
- Amount: 3 bytes
- Nonce: 1 byte

Total: ~12 bytes

Compression: 110 / 12 = 9.2× smaller!
```

**ZK-Rollup**:
```
Even more compressed:
- From: 3 bytes
- To: 3 bytes
- Amount: 2 bytes

Total: ~8 bytes (some schemes even less!)

Compression: 110 / 8 = 13.75× smaller!
```

---

## 5. Góc nhìn triển khai

### 5.1. Mô phỏng Optimistic Rollup hoàn chỉnh

```python
import hashlib
import time
from typing import List, Dict, Optional

class OptimisticRollupChain:
    """Complete optimistic rollup implementation"""
    
    def __init__(self):
        # State
        self.state = {}  # address → balance
        self.state_root = self.compute_state_root()
        
        # Batches
        self.batches = []
        self.pending_batch = []
        
        # Challenge period
        self.CHALLENGE_PERIOD = 7 * 24 * 3600  # 7 days
        
        # Sequencer
        self.sequencer_stake = 1000  # ETH staked by sequencer
    
    def compute_state_root(self) -> str:
        """Compute Merkle root of state"""
        state_str = str(sorted(self.state.items()))
        return hashlib.sha256(state_str.encode()).hexdigest()
    
    def add_transaction(self, from_addr: str, to_addr: str, amount: int):
        """Add transaction to pending batch"""
        tx = {
            'from': from_addr,
            'to': to_addr,
            'amount': amount,
            'timestamp': time.time()
        }
        
        self.pending_batch.append(tx)
        
        print(f"TX added to pending batch: {from_addr} → {to_addr}: {amount}")
    
    def submit_batch(self) -> Dict:
        """Sequencer submits batch to L1"""
        if not self.pending_batch:
            return None
        
        # Execute transactions
        old_state_root = self.state_root
        
        for tx in self.pending_batch:
            self._execute_tx(tx)
        
        new_state_root = self.compute_state_root()
        
        # Create batch
        batch = {
            'id': len(self.batches),
            'transactions': self.pending_batch.copy(),
            'old_state_root': old_state_root,
            'new_state_root': new_state_root,
            'timestamp': time.time(),
            'challenged': False,
            'finalized': False
        }
        
        self.batches.append(batch)
        self.pending_batch = []
        
        print(f"\n✓ Batch {batch['id']} submitted to L1")
        print(f"  Transactions: {len(batch['transactions'])}")
        print(f"  Old state: {old_state_root[:16]}...")
        print(f"  New state: {new_state_root[:16]}...")
        print(f"  Challenge period: {self.CHALLENGE_PERIOD / 86400} days")
        
        return batch
    
    def _execute_tx(self, tx: Dict):
        """Execute transaction (update state)"""
        from_addr = tx['from']
        to_addr = tx['to']
        amount = tx['amount']
        
        # Ensure accounts exist
        if from_addr not in self.state:
            self.state[from_addr] = 0
        if to_addr not in self.state:
            self.state[to_addr] = 0
        
        # Transfer
        if self.state[from_addr] >= amount:
            self.state[from_addr] -= amount
            self.state[to_addr] += amount
    
    def challenge_batch(self, batch_id: int, fraud_tx_index: int) -> bool:
        """Challenge batch with fraud proof"""
        batch = self.batches[batch_id]
        
        # Check challenge period
        if time.time() > batch['timestamp'] + self.CHALLENGE_PERIOD:
            print(f"✗ Challenge period expired")
            return False
        
        if batch['finalized']:
            print(f"✗ Batch already finalized")
            return False
        
        # Re-execute to verify
        print(f"\n⚠️  Challenging batch {batch_id}...")
        print(f"  Re-executing {len(batch['transactions'])} transactions...")
        
        # Simulate re-execution on L1
        test_state = {}
        for tx in batch['transactions'][:fraud_tx_index + 1]:
            from_addr = tx['from']
            to_addr = tx['to']
            amount = tx['amount']
            
            if from_addr not in test_state:
                test_state[from_addr] = self.get_balance_at_state(from_addr, batch['old_state_root'])
            if to_addr not in test_state:
                test_state[to_addr] = self.get_balance_at_state(to_addr, batch['old_state_root'])
            
            # Check validity
            if test_state[from_addr] < amount:
                print(f"✓ FRAUD DETECTED at TX {fraud_tx_index}!")
                print(f"  {from_addr} has {test_state[from_addr]} but tried to send {amount}")
                
                # Slash sequencer
                self.sequencer_stake = 0
                batch['challenged'] = True
                
                print(f"  Sequencer SLASHED")
                print(f"  Batch REVERTED")
                
                return True
            
            test_state[from_addr] -= amount
            test_state[to_addr] += amount
        
        print(f"✗ No fraud found - challenge invalid")
        return False
    
    def finalize_batch(self, batch_id: int) -> bool:
        """Finalize batch after challenge period"""
        batch = self.batches[batch_id]
        
        if batch['challenged']:
            print(f"✗ Cannot finalize - batch was challenged")
            return False
        
        if batch['finalized']:
            print(f"✗ Already finalized")
            return False
        
        if time.time() < batch['timestamp'] + self.CHALLENGE_PERIOD:
            print(f"✗ Challenge period still active")
            return False
        
        batch['finalized'] = True
        print(f"✓ Batch {batch_id} FINALIZED")
        
        return True
    
    def get_balance_at_state(self, addr: str, state_root: str) -> int:
        """Get balance at specific state (simplified)"""
        # In production: Query state trie
        return self.state.get(addr, 0)

# Example usage
if __name__ == "__main__":
    print("=== Optimistic Rollup Simulation ===\n")
    
    rollup = OptimisticRollupChain()
    
    # Initialize accounts
    rollup.state['Alice'] = 100
    rollup.state['Bob'] = 50
    rollup.state['Charlie'] = 75
    
    print("Initial state:")
    for addr, balance in rollup.state.items():
        print(f"  {addr}: {balance}")
    
    # Add transactions to batch
    print(f"\n--- Building Batch ---")
    rollup.add_transaction('Alice', 'Bob', 10)
    rollup.add_transaction('Bob', 'Charlie', 5)
    rollup.add_transaction('Charlie', 'Alice', 15)
    
    # Sequencer submits batch
    batch = rollup.submit_batch()
    
    print(f"\nFinal state:")
    for addr, balance in rollup.state.items():
        print(f"  {addr}: {balance}")
    
    # Simulate: Validator challenges (no fraud in this case)
    print(f"\n--- Validator Monitoring ---")
    rollup.challenge_batch(batch['id'], fraud_tx_index=0)
    
    # Wait and finalize
    print(f"\n--- After 7 Days ---")
    rollup.batches[0]['timestamp'] = time.time() - (8 * 86400)  # Simulate 8 days passed
    rollup.finalize_batch(batch['id'])
```

---

## Video tham khảo

- **Xem trước:** [ROLLUPS - The Ultimate Ethereum Scaling Strategy? Arbitrum & Optimism Explained](https://www.youtube.com/watch?v=7pWxCklcNsU) — Finematics, tiếng Anh. Phân biệt Optimistic Rollup và ZK-Rollup cùng vai trò của dữ liệu đăng lên L1; nên xem trước phần định nghĩa rollup.
- [Peek a live code-walkthrough of the new OP Stack fault proof code!](https://www.youtube.com/watch?v=2n9qTmsdYbQ) — Optimism, tiếng Anh. Giới thiệu trực tiếp mã nguồn fault proof trên OP Stack, đối chiếu với cơ chế cửa sổ tranh chấp trong bài.
- [The Secrets of zkEVM: A Deep Dive into Zero-Knowledge Rollups](https://www.youtube.com/watch?v=LtDtCgVztg4) — James Bachini, tiếng Anh. Phân tích sâu về zkEVM, hỗ trợ phần so sánh validity proof với fraud proof.
