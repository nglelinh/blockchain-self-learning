---
layout: post
title: "Lecture 00.01: Distributed Systems và Consensus Theory"
chapter: '00'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Distributed Systems và Consensus Theory

## 1. Tổng quan về khái niệm

Để hiểu sâu về blockchain, chúng ta phải hiểu về **distributed systems** (hệ thống phân tán) - nền tảng lý thuyết mà blockchain được xây dựng trên đó. Một hệ thống phân tán là một tập hợp các máy tính độc lập kết nối qua mạng, làm việc cùng nhau để đạt được một mục tiêu chung, nhưng với người dùng cuối, chúng trông như một hệ thống duy nhất.

Vấn đề cốt lõi trong distributed systems là **consensus** (sự đồng thuận): làm thế nào để nhiều máy tính độc lập, có thể fail bất cứ lúc nào, có thể bị delay về network, hoặc thậm chí có thể hành động maliciously, có thể đồng ý về một giá trị hoặc trạng thái duy nhất?

Vấn đề này không hề đơn giản. Trong năm 1985, hai nhà khoa học máy tính Fisher, Lynch và Paterson đã chứng minh một kết quả nổi tiếng được gọi là **FLP Impossibility Result**: trong một mạng asynchronous (không có bounds về message delay), chỉ cần một node có thể fail, không thể có một consensus algorithm deterministic nào đảm bảo terminate trong finite time. Đây là một kết quả profound, cho thấy rằng perfect consensus trong môi trường distributed thực sự là impossible!

Nhưng trong thực tế, hệ thống phân tán vẫn hoạt động. Tại sao? Bởi vì chúng ta **relaxing một số assumptions**:
- Chấp nhận probabilistic guarantees thay vì deterministic
- Giả định network có weak synchrony (không phải hoàn toàn asynchronous)
- Giới hạn số lượng faulty nodes
- Chấp nhận eventual consistency thay vì immediate consistency

Blockchain là một distributed system đặc biệt với những đặc tính:
1. **No central authority**: Không có coordinator
2. **Byzantine environment**: Nodes có thể hành động arbitrarily maliciously
3. **Open membership**: Bất kỳ ai cũng có thể tham gia hoặc rời khỏi (trong public blockchains)
4. **Incentive-driven**: Sử dụng economic incentives để encourage honest behavior

Consensus trong blockchain không chỉ là vấn đề kỹ thuật, mà còn là **kết hợp của cryptography, game theory, và distributed systems theory**. Bitcoin giải quyết vấn đề này thông qua Proof-of-Work - một breakthrough không chỉ về mặt kỹ thuật mà còn về conceptual, bởi vì nó transform computational resources thành votes, và economic incentives thành security guarantees.

---

## 2. Hiểu biết trực quan

### 2.1. The Consensus Problem

Tưởng tượng bạn và 9 người bạn đang ở 10 thành phố khác nhau, và các bạn muốn quyết định xem nên đi ăn trưa ở đâu vào ngày mai. Các bạn chỉ có thể giao tiếp qua tin nhắn văn bản:

**Scenario 1: Centralized (có leader)**
- Alice là leader, cô ấy quyết định: "Pizza!"
- Mọi người follow Alice
- ✅ Simple, fast
- ❌ Nhưng nếu Alice's phone die thì sao? Nếu Alice bị hack thì sao?

**Scenario 2: Distributed Voting (không có leader)**
- Mọi người gửi vote của mình cho tất cả mọi người khác
- Mỗi người đếm votes và chọn option có nhiều votes nhất
- ✅ No single point of failure
- ❌ Nhưng các messages có thể bị delay hoặc lost. Bob có thể nhận votes theo thứ tự khác với Charlie. Làm sao đảm bảo mọi người đếm đến cùng kết quả?

**Scenario 3: Byzantine Voting (có người gian lận)**
- Eve là một hacker, cô ấy gửi "Pizza" cho một nửa nhóm và "Sushi" cho nửa còn lại
- Một nửa nhóm nghĩ majority là Pizza, nửa còn lại nghĩ là Sushi
- Split decision → system fails!

Đây chính xác là **Byzantine Generals Problem**: Làm thế nào để một nhóm generals (nodes) có thể đồng ý về một plan of attack, khi một số generals có thể là traitors (Byzantine/malicious nodes), và communication có thể bị intercepted hoặc delayed?

### 2.2. Blockchain's Solution

Blockchain giải quyết vấn đề này bằng cách:

1. **Ordered Log of Events**: Thay vì vote về một decision duy nhất, tạo một log chronological của tất cả decisions (transactions)

2. **Proof-of-Work Lottery**: Thay vì mọi người vote cùng lúc, randomly chọn một người (miner) để propose block tiếp theo. "Random" selection dựa trên computational work (giải puzzle mật mã).

3. **Longest Chain Rule**: Nếu có conflicts (hai blocks được propose cùng lúc), follow chain dài nhất (có most accumulated work). Eventually, một chain sẽ become dominant.

4. **Economic Incentives**: Người được chọn để propose block nhận reward (block reward + transaction fees). Điều này makes it expensive to attack và profitable to be honest.

Giống như trong voting example: thay vì mọi người vote về "Pizza vs Sushi", blockchain tạo một ordered list: "Transaction 1: Alice → Bob, Transaction 2: Bob → Charlie, ...". Và thay vì everyone agreeing immediately, agreement emerges gradually as more blocks are added.

---

## 3. Nền tảng kỹ thuật

### 3.1. Properties of Distributed Systems

Một distributed system phải đảm bảo các tính chất:

**Safety**: "Nothing bad happens"
- Consistency: All nodes see the same data
- Agreement: All correct nodes agree on the same value

**Liveness**: "Something good eventually happens"
- Termination: Algorithm eventually completes
- Progress: System makes forward progress

**Fault Tolerance**:
- **Crash faults**: Node stops responding
- **Omission faults**: Messages are dropped
- **Byzantine faults**: Arbitrary malicious behavior

### 3.2. CAP Theorem

Eric Brewer's CAP theorem (2000) states that trong một distributed system, bạn chỉ có thể đạt được maximum 2 trong 3 tính chất sau:

**Consistency (C)**: Mọi read nhận về most recent write
**Availability (A)**: Mọi request nhận về response (không có error)
**Partition Tolerance (P)**: System tiếp tục hoạt động khi network bị phân mảnh

```
         C (Consistency)
         /  \
        /    \
       /  CA  \
      /________\
    A           P
(Availability) (Partition Tolerance)

CP Systems: Consistency + Partition Tolerance
  → May become unavailable during network partition
  → Bitcoin, Ethereum (prioritize consistency)

AP Systems: Availability + Partition Tolerance
  → May return stale data during partition
  → DNS, Cassandra (eventual consistency)

CA Systems: Consistency + Availability
  → No partition tolerance
  → Traditional RDBMS in single datacenter
```

Blockchains thường là **CP systems**: ưu tiên consistency (all nodes agree on chain) hơn availability (có thể temporary unavailable during chain reorganization).

### 3.3. Consensus Models

**State Machine Replication (SMR)**:

Consensus trong distributed systems thường được implement thông qua state machine replication:
- Mỗi node chạy một deterministic state machine
- Tất cả nodes bắt đầu từ cùng initial state
- Nodes nhận cùng sequence of commands trong cùng order
- Deterministic execution → tất cả nodes đến cùng final state

```
Node 1:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3
Node 2:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3
Node 3:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3

Consensus = Agreement on sequence of commands
```

Blockchain áp dụng SMR:
- State = account balances, smart contract storage
- Commands = transactions
- Consensus = agreement on order of transactions (blocks)

### 3.4. Types of Consensus Algorithms

**Classical Consensus (CFT - Crash Fault Tolerant)**:

1. **Paxos** (Leslie Lamport, 1989):
   - Tolerates crash failures
   - Requires majority quorum: \( \lfloor n/2 \rfloor + 1 \)
   - Used in Google Chubby, Apache ZooKeeper

2. **Raft** (Diego Ongaro, 2014):
   - Simpler alternative to Paxos
   - Leader-based, easier to understand
   - Used in etcd, Consul

**Byzantine Fault Tolerant (BFT) Consensus**:

1. **PBFT** (Practical Byzantine Fault Tolerance, 1999):
   - Tolerates \( f \) Byzantine faults với \( n \geq 3f + 1 \) nodes
   - Three-phase protocol: pre-prepare, prepare, commit
   - O(n²) message complexity
   - Used in Hyperledger Fabric, Zilliqa

2. **Nakamoto Consensus (Proof-of-Work)**:
   - Bitcoin's innovation (2008)
   - Probabilistic finality
   - Open membership (permissionless)
   - Sybil resistance through computational work

3. **Proof-of-Stake**:
   - Validators stake cryptocurrency
   - Selection based on stake weight
   - Ethereum 2.0, Cardano, Polkadot

### 3.5. Synchrony Assumptions

Consensus algorithms depend on assumptions về network timing:

**Synchronous**:
- Message delay bounded: \( \Delta \) (known upper bound)
- Process execution speed bounded
- Strong assumption, rarely holds in practice

**Asynchronous**:
- No bounds on message delay
- FLP impossibility: no deterministic consensus possible
- Weakest assumption, most realistic

**Partially Synchronous**:
- Network is eventually synchronous (after GST - Global Stabilization Time)
- Before GST: asynchronous (messages can be delayed arbitrarily)
- After GST: synchronous (messages delivered within \( \Delta \))
- Most practical consensus algorithms assume partial synchrony

Bitcoin assumes **weak synchrony**: network delays exist but blocks propagate reasonably fast (< 10 minutes typically).

---

## 4. Công thức toán học và mật mã học

### 4.1. Byzantine Fault Tolerance Bound

**Theorem**: Trong một distributed system with \( n \) nodes, nếu có \( f \) nodes là Byzantine (malicious), consensus chỉ có thể đạt được nếu:

\[
n \geq 3f + 1
\]

Hay nói cách khác:

\[
f < \frac{n}{3}
\]

**Intuitive Proof**:

Giả sử chúng ta có \( n \) nodes và muốn tolerate \( f \) Byzantine nodes.

1. Trong worst case, \( f \) Byzantine nodes có thể không respond
2. Vậy chúng ta chỉ nghe được từ \( n - f \) nodes
3. Nhưng trong số \( n - f \) nodes này, worst case là \( f \) trong số đó là Byzantine nodes đang lying
4. Vậy số honest responses tối thiểu là: \( (n - f) - f = n - 2f \)
5. Để có majority của honest nodes:
   \[
   n - 2f > f \implies n > 3f \implies n \geq 3f + 1
   \]

**Example**:
- \( n = 4 \), \( f = 1 \): \( 4 \geq 3(1) + 1 = 4 \) ✅ (just enough)
- \( n = 3 \), \( f = 1 \): \( 3 \geq 3(1) + 1 = 4 \) ❌ (not enough)
- \( n = 10 \), \( f = 3 \): \( 10 \geq 3(3) + 1 = 10 \) ✅ (just enough)

### 4.2. Nakamoto Consensus Security

Trong Proof-of-Work, một attacker với fraction \( q \) của total hash power cố gắng overtake honest chain với fraction \( p = 1 - q \).

**Probability of Attacker Success**:

Cho \( z \) = số confirmations (blocks ahead của honest chain)

Xác suất attacker catch up từ \( z \) blocks behind:

\[
P_{\text{catch-up}}(q, z) = 
\begin{cases}
1 & \text{if } q \geq 0.5 \\
\left(\frac{q}{p}\right)^z & \text{if } q < 0.5
\end{cases}
\]

**Derivation** (simplified):

Mô hình như random walk:
- Mỗi block, attacker có prob \( q \) of winning, honest có prob \( p \)
- Attacker cần win \( z \) more times than honest để catch up
- Probability: \( \sum_{k=0}^{\infty} P(\text{attacker } z+k, \text{ honest } k) \)

Kết quả cuối cùng (Gambler's Ruin problem):

\[
P_{\text{catch-up}} = \left(\frac{q}{p}\right)^z = \left(\frac{q}{1-q}\right)^z
\]

**Numerical Examples**:

| Attacker Power \( q \) | Confirmations \( z \) | Probability \( P \) |
|------------------------|----------------------|---------------------|
| 0.1 (10%)              | 1                    | 0.111 (11.1%)       |
| 0.1 (10%)              | 6                    | 0.000164 (0.016%)   |
| 0.3 (30%)              | 1                    | 0.429 (42.9%)       |
| 0.3 (30%)              | 6                    | 0.0078 (0.78%)      |
| 0.4 (40%)              | 6                    | 0.088 (8.8%)        |
| 0.45 (45%)             | 10                   | 0.267 (26.7%)       |

**Insight**: Ngay cả với 40% hash power, sau 6 confirmations chỉ có ~9% cơ hội thành công. Với 10% hash power, 6 confirmations cho ~0.02% cơ hội - extremely safe.

### 4.3. FLP Impossibility Result

**Theorem** (Fisher, Lynch, Paterson, 1985):

Trong một asynchronous distributed system, không tồn tại một deterministic consensus protocol có thể guarantee termination nếu ngay cả một process có thể fail (crash).

**Formal Statement**:

Cho:
- System model: asynchronous (no timing assumptions)
- Failure model: at most 1 crash failure
- Safety: agreement và validity
- Liveness: termination

Kết luận: Không thể simultaneously guarantee tất cả properties trên.

**Implications**:

1. **Blockchain's workaround**: Sử dụng probabilistic/eventual termination thay vì guaranteed termination
2. **Bitcoin không terminate**: luôn có khả năng chain reorganization
3. **Proof-of-Stake with finality**: thêm synchrony assumptions để avoid FLP

### 4.4. Consistency Models

**Strong Consistency** (Linearizability):

Cho operations \( op_1, op_2, ..., op_n \) with real-time ordering \( \prec \):

\[
op_i \prec op_j \implies \text{system executes } op_i \text{ before } op_j
\]

**Eventual Consistency**:

\[
\forall \text{ nodes } n_i, n_j: \quad \lim_{t \to \infty} \text{state}(n_i, t) = \text{state}(n_j, t)
\]

Blockchains achieve **eventual consistency**: sau khi không có new transactions, tất cả nodes eventually agree.

### 4.5. Network Partition and Quorum

Trong PBFT-style consensus với \( n = 3f + 1 \) nodes:

**Quorum size**:
\[
Q = 2f + 1 = \frac{2n + 1}{3}
\]

Tại sao? Hai quorums bất kỳ phải overlap trong ít nhất \( f + 1 \) nodes (đảm bảo ít nhất 1 honest node):

\[
Q_1 \cap Q_2 \geq 2Q - n = 2(2f+1) - (3f+1) = f + 1
\]

---

## 5. Implementation Insight

### 5.1. Simplified PBFT Implementation

```python
from enum import Enum
from typing import Dict, List, Set
import hashlib
import json

class MessageType(Enum):
    PRE_PREPARE = "pre-prepare"
    PREPARE = "prepare"
    COMMIT = "commit"

class Message:
    def __init__(self, msg_type: MessageType, view: int, 
                 sequence: int, digest: str, node_id: int):
        self.msg_type = msg_type
        self.view = view          # Current view number
        self.sequence = sequence  # Sequence number of request
        self.digest = digest      # Digest of request
        self.node_id = node_id    # Sender's ID
    
    def __hash__(self):
        return hash((self.msg_type, self.view, self.sequence, 
                     self.digest, self.node_id))
    
    def __eq__(self, other):
        return (self.msg_type == other.msg_type and 
                self.view == other.view and
                self.sequence == other.sequence and
                self.digest == other.digest)

class PBFTNode:
    def __init__(self, node_id: int, total_nodes: int):
        self.node_id = node_id
        self.n = total_nodes
        self.f = (total_nodes - 1) // 3  # Max Byzantine nodes
        
        self.view = 0  # Current view
        self.sequence = 0  # Current sequence number
        
        # Message logs
        self.pre_prepare_log: Dict[int, Message] = {}
        self.prepare_log: Dict[int, Set[Message]] = {}
        self.commit_log: Dict[int, Set[Message]] = {}
        
        # State
        self.prepared: Set[int] = set()  # Prepared requests
        self.committed: Set[int] = set()  # Committed requests
    
    def is_primary(self) -> bool:
        """Check if this node is primary for current view"""
        return self.view % self.n == self.node_id
    
    def request(self, request_data: str) -> Message:
        """Client request - primary creates PRE-PREPARE"""
        if not self.is_primary():
            raise Exception("Only primary can create pre-prepare")
        
        self.sequence += 1
        digest = hashlib.sha256(request_data.encode()).hexdigest()
        
        msg = Message(
            MessageType.PRE_PREPARE,
            self.view,
            self.sequence,
            digest,
            self.node_id
        )
        
        self.pre_prepare_log[self.sequence] = msg
        return msg
    
    def receive_pre_prepare(self, msg: Message, request_data: str):
        """Backup receives PRE-PREPARE from primary"""
        # Verify message
        expected_digest = hashlib.sha256(request_data.encode()).hexdigest()
        if msg.digest != expected_digest:
            raise Exception("Invalid digest")
        
        if msg.view != self.view:
            raise Exception("Wrong view")
        
        # Accept and send PREPARE
        self.pre_prepare_log[msg.sequence] = msg
        
        prepare_msg = Message(
            MessageType.PREPARE,
            self.view,
            msg.sequence,
            msg.digest,
            self.node_id
        )
        
        # Add own prepare message
        if msg.sequence not in self.prepare_log:
            self.prepare_log[msg.sequence] = set()
        self.prepare_log[msg.sequence].add(prepare_msg)
        
        return prepare_msg
    
    def receive_prepare(self, msg: Message):
        """Receive PREPARE from other nodes"""
        if msg.sequence not in self.prepare_log:
            self.prepare_log[msg.sequence] = set()
        
        self.prepare_log[msg.sequence].add(msg)
        
        # Check if prepared (received 2f PREPARE messages)
        if (msg.sequence not in self.prepared and 
            len(self.prepare_log[msg.sequence]) >= 2 * self.f):
            self.prepared.add(msg.sequence)
            
            # Send COMMIT
            commit_msg = Message(
                MessageType.COMMIT,
                self.view,
                msg.sequence,
                msg.digest,
                self.node_id
            )
            
            if msg.sequence not in self.commit_log:
                self.commit_log[msg.sequence] = set()
            self.commit_log[msg.sequence].add(commit_msg)
            
            return commit_msg
        
        return None
    
    def receive_commit(self, msg: Message):
        """Receive COMMIT from other nodes"""
        if msg.sequence not in self.commit_log:
            self.commit_log[msg.sequence] = set()
        
        self.commit_log[msg.sequence].add(msg)
        
        # Check if committed (received 2f+1 COMMIT messages)
        if (msg.sequence not in self.committed and
            len(self.commit_log[msg.sequence]) >= 2 * self.f + 1):
            self.committed.add(msg.sequence)
            return True  # Request is committed!
        
        return False

# Example usage
if __name__ == "__main__":
    # Create 4 nodes (f=1, tolerates 1 Byzantine)
    nodes = [PBFTNode(i, 4) for i in range(4)]
    
    print("=== PBFT Consensus Example ===")
    print(f"Total nodes: {nodes[0].n}")
    print(f"Max Byzantine faults: {nodes[0].f}")
    print(f"Required PREPARE messages: {2 * nodes[0].f}")
    print(f"Required COMMIT messages: {2 * nodes[0].f + 1}\n")
    
    # Client sends request to primary (node 0)
    request = "Transfer 100 BTC from Alice to Bob"
    print(f"Client request: {request}")
    
    # Phase 1: PRE-PREPARE (primary broadcasts)
    print("\n--- Phase 1: PRE-PREPARE ---")
    pre_prepare = nodes[0].request(request)
    print(f"Node 0 (primary) creates PRE-PREPARE: seq={pre_prepare.sequence}")
    
    # Phase 2: PREPARE (backups send PREPARE)
    print("\n--- Phase 2: PREPARE ---")
    prepare_messages = []
    for i in range(1, 4):  # Nodes 1, 2, 3
        prepare = nodes[i].receive_pre_prepare(pre_prepare, request)
        prepare_messages.append((i, prepare))
        print(f"Node {i} sends PREPARE")
    
    # Broadcast PREPARE messages to all nodes
    commit_messages = []
    for node in nodes:
        for sender_id, prepare in prepare_messages:
            commit = node.receive_prepare(prepare)
            if commit:
                commit_messages.append((node.node_id, commit))
                print(f"Node {node.node_id} enters PREPARED state, sends COMMIT")
    
    # Phase 3: COMMIT
    print("\n--- Phase 3: COMMIT ---")
    for node in nodes:
        for sender_id, commit in commit_messages:
            if node.node_id != sender_id:
                committed = node.receive_commit(commit)
                if committed:
                    print(f"Node {node.node_id} COMMITTED request!")
    
    print("\n=== Consensus Reached! ===")
    print(f"All honest nodes agreed on: {request}")
```

### 5.2. Bitcoin's Consensus (Simplified)

```python
import hashlib
import time
from typing import List, Optional

class BitcoinBlock:
    def __init__(self, index: int, transactions: List[str], 
                 previous_hash: str, difficulty: int):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.difficulty = difficulty
        self.nonce = 0
        self.hash = ""
    
    def mine(self):
        """Proof-of-Work: find nonce such that hash < target"""
        target = "0" * self.difficulty
        attempts = 0
        
        start_time = time.time()
        while True:
            self.hash = self.calculate_hash()
            attempts += 1
            
            if self.hash.startswith(target):
                elapsed = time.time() - start_time
                print(f"Block mined! Nonce: {self.nonce}, "
                      f"Attempts: {attempts}, Time: {elapsed:.2f}s")
                return
            
            self.nonce += 1
    
    def calculate_hash(self) -> str:
        block_data = (f"{self.index}{self.timestamp}"
                     f"{self.transactions}{self.previous_hash}{self.nonce}")
        return hashlib.sha256(block_data.encode()).hexdigest()

class BitcoinBlockchain:
    def __init__(self, difficulty: int = 4):
        self.chain: List[BitcoinBlock] = []
        self.difficulty = difficulty
        self.pending_transactions: List[str] = []
        
        # Create genesis block
        genesis = BitcoinBlock(0, ["Genesis"], "0", difficulty)
        genesis.mine()
        self.chain.append(genesis)
    
    def add_transaction(self, transaction: str):
        self.pending_transactions.append(transaction)
    
    def mine_block(self) -> BitcoinBlock:
        """Simulate mining a new block"""
        if not self.pending_transactions:
            return None
        
        new_block = BitcoinBlock(
            len(self.chain),
            self.pending_transactions.copy(),
            self.chain[-1].hash,
            self.difficulty
        )
        
        print(f"\nMining block {new_block.index}...")
        new_block.mine()
        
        self.chain.append(new_block)
        self.pending_transactions = []
        
        return new_block
    
    def is_valid(self) -> bool:
        """Verify blockchain integrity"""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            
            # Check hash
            if current.hash != current.calculate_hash():
                return False
            
            # Check previous hash link
            if current.previous_hash != previous.hash:
                return False
            
            # Check PoW difficulty
            if not current.hash.startswith("0" * self.difficulty):
                return False
        
        return True
    
    def resolve_fork(self, other_chain: 'BitcoinBlockchain') -> bool:
        """Longest chain rule: replace if other chain is longer and valid"""
        if len(other_chain.chain) > len(self.chain) and other_chain.is_valid():
            self.chain = other_chain.chain.copy()
            return True
        return False

# Example: Simulating network consensus
if __name__ == "__main__":
    print("=== Bitcoin Consensus Simulation ===\n")
    
    # Two miners competing
    blockchain_A = BitcoinBlockchain(difficulty=4)
    blockchain_B = BitcoinBlockchain(difficulty=4)
    
    # Both receive same transactions
    blockchain_A.add_transaction("Alice -> Bob: 5 BTC")
    blockchain_A.add_transaction("Bob -> Charlie: 2 BTC")
    
    blockchain_B.add_transaction("Alice -> Bob: 5 BTC")
    blockchain_B.add_transaction("Bob -> Charlie: 2 BTC")
    
    print("Miner A mining...")
    blockchain_A.mine_block()
    
    print("\nMiner B mining...")
    blockchain_B.mine_block()
    
    # Simulate: Miner A mines another block first
    blockchain_A.add_transaction("Charlie -> Alice: 1 BTC")
    print("\nMiner A mines block 2...")
    blockchain_A.mine_block()
    
    # Miner B receives A's longer chain
    print(f"\nMiner B chain length: {len(blockchain_B.chain)}")
    print(f"Miner A chain length: {len(blockchain_A.chain)}")
    
    if blockchain_B.resolve_fork(blockchain_A):
        print("Miner B adopted Miner A's longer chain!")
        print("CONSENSUS REACHED - Both miners on same chain")
    
    print(f"\nFinal blockchain length: {len(blockchain_A.chain)}")
    print(f"Blockchain valid: {blockchain_A.is_valid()}")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Nothing-at-Stake Problem (Proof-of-Stake)

Trong PoS, khi có fork, validators có thể vote cho cả hai chains mà không tốn cost gì (không như PoW phải spend electricity).

```
      Block 3a
      /
Block 2
      \
      Block 3b

PoW: Miner must choose one chain (can't mine both simultaneously)
PoS: Validator can sign both chains at no cost!
```

**Solutions**:
- **Slashing**: Phạt validators vote cho multiple chains
- **Finality Gadgets**: Casper FFG, Tendermint - absolute finality sau certain conditions

### 6.2. Long-Range Attacks (PoS)

Attacker có thể mua old private keys của validators và rewrite history từ đầu.

**Solution**:
- **Checkpoints**: Clients hardcode recent block hashes
- **Weak subjectivity**: Require social consensus for very old history

### 6.3. Selfish Mining

Miners có thể giữ blocks họ mine được private, release strategically để gain unfair advantage.

**Example Strategy**:
1. Mine block B1, keep private
2. If another miner mines B1', release your B1 immediately
3. Race condition → sometimes your block wins
4. Can profit with <50% hash power (minimum ~25%)

**Impact**: Lowers security threshold từ 50% xuống ~33%

### 6.4. Network Partitions

Nếu network bị split thành hai partitions:

```
Partition A (60% nodes)    |    Partition B (40% nodes)
   Chain A continues       |       Chain B continues
        ...                |            ...
        
When partition heals:
- Longest chain wins (A)
- Transactions on chain B get reverted (!)
- Users on B experienced "false confirmations"
```

**Mitigation**:
- Wait for more confirmations
- Monitor network health
- Use finality gadgets

### 6.5. Sybil Attacks

Attacker tạo nhiều fake identities để gain control.

**PoW Defense**: One CPU = one vote → can't create fake identities without hardware
**PoS Defense**: One coin = one vote → expensive to acquire enough stake
**PBFT Defense**: Permissioned network, identity verified

---

## 7. Các khái niệm liên quan

### 7.1. Paxos vs Bitcoin Consensus

| Feature | Paxos | Bitcoin |
|---------|-------|---------|
| Environment | Permissioned, CFT | Permissionless, BFT |
| Fault Model | Crash faults | Byzantine faults |
| Membership | Fixed, known | Dynamic, unknown |
| Finality | Strong (immediate) | Probabilistic (gradual) |
| Performance | High throughput | Low throughput |
| Sybil Resistance | Identity-based | Resource-based (PoW) |

### 7.2. Consistency vs Consensus

**Consistency**: Property của data - all replicas have same value
**Consensus**: Protocol to achieve consistency - how replicas agree

```
Consensus Algorithm → Achieves → Data Consistency
     (PBFT)                        (Linearizability)
     (Raft)                        (Sequential)
     (Nakamoto)                    (Eventual)
```

### 7.3. Synchronous vs Asynchronous vs Partial Synchrony

| Model | Assumption | Consensus Possible? | Examples |
|-------|-----------|---------------------|----------|
| Synchronous | Known message delay bound Δ | Yes (trivial) | Theoretical only |
| Asynchronous | No timing assumptions | No (FLP) | Realistic Internet |
| Partial Synchrony | Eventually synchronous (after GST) | Yes (practical) | PBFT, Tendermint, Ethereum 2.0 |

### 7.4. Permissioned vs Permissionless

**Permissioned** (Hyperledger, Corda):
- Known participants
- Faster consensus (no PoW needed)
- Higher throughput
- Lower decentralization

**Permissionless** (Bitcoin, Ethereum):
- Open participation
- Slower consensus (need Sybil resistance)
- Lower throughput
- Maximum decentralization

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"Impossibility of Distributed Consensus with One Faulty Process"** | 1985 | Fischer, Lynch, Paterson | FLP impossibility result - fundamental limit of consensus |
| **"The Byzantine Generals Problem"** | 1982 | Lamport, Shostak, Pease | Defined Byzantine fault tolerance |
| **"Practical Byzantine Fault Tolerance"** | 1999 | Castro, Liskov | First practical BFT algorithm, O(n²) complexity |
| **"Paxos Made Simple"** | 2001 | Leslie Lamport | Simplified explanation of Paxos consensus |
| **"In Search of an Understandable Consensus Algorithm (Raft)"** | 2014 | Ongaro, Ousterhout | More understandable alternative to Paxos |
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Nakamoto consensus - probabilistic BFT |
| **"The Bitcoin Backbone Protocol"** | 2015 | Garay, Kiayias, Leonardos | Formal analysis of Bitcoin's consensus security |
| **"Consensus in the Age of Blockchains"** | 2017 | Cachin, Vukolić | Survey of blockchain consensus mechanisms |
| **"Tendermint: Consensus without Mining"** | 2014 | Jae Kwon | BFT consensus for public blockchains |
| **"Casper the Friendly Finality Gadget"** | 2017 | Buterin, Griffith | Ethereum's PoS finality mechanism |

**Reading Path**:
1. Start: Byzantine Generals Problem (understand the challenge)
2. Classical: Paxos/Raft (CFT consensus)
3. BFT: PBFT paper (permissioned BFT)
4. Blockchain: Bitcoin whitepaper + Backbone Protocol (permissionless BFT)
5. Modern: Tendermint, Casper (modern approaches)

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Description | Source | Notes |
|-------------|--------|-------|
| **Byzantine Generals illustration** | [The Byzantine Generals Problem (Lamport et al.)](https://lamport.azurewebsites.net/pubs/byz.pdf) | Original paper with diagrams |
| **PBFT protocol flow** | [PBFT paper (Castro & Liskov)](http://pmg.csail.mit.edu/papers/osdi99.pdf) | Three-phase commit visualization |
| **CAP Theorem Venn diagram** | [Visual Guide to NoSQL Systems](http://blog.nahurst.com/visual-guide-to-nosql-systems) | Simple visualization |
| **Nakamoto consensus** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/block_chain.html) | Chain selection and forks |
| **State machine replication** | [Raft visualization](https://raft.github.io/) | Interactive animation |
| **FLP impossibility intuition** | [The Morning Paper - FLP](https://blog.acolyer.org/2015/03/01/impossibility-of-distributed-consensus-with-one-faulty-process/) | Accessible explanation |

**Interactive Tools**:
- [Raft Consensus Simulator](https://raft.github.io/raftscope/index.html) - visualize leader election
- [PBFT Simulator](http://www.pbft.org/) - understand three-phase commit
- [Bitcoin Fork Simulator](https://anders.com/blockchain/blockchain.html) - see how forks resolve

---

## 10. Tóm tắt và điểm chính

**Core Concepts**:
1. Consensus in distributed systems là fundamentally hard (FLP impossibility)
2. Byzantine fault tolerance requires \( n \geq 3f + 1 \) nodes
3. Blockchain sử dụng probabilistic consensus với economic incentives
4. Trade-off giữa strong consistency vs availability (CAP theorem)

**Consensus Types**:
- **Classical (Paxos, Raft)**: Permissioned, CFT, strong finality
- **BFT (PBFT)**: Permissioned, Byzantine-tolerant, O(n²) communication
- **Nakamoto (PoW)**: Permissionless, probabilistic finality, Sybil-resistant
- **Modern (PoS, Tendermint)**: Combining BFT với open participation

**Key Insights**:
- Blockchain trades immediate finality for openness
- Security comes from economic cost (PoW) or economic stake (PoS)
- Network assumptions matter: synchrony vs asynchrony
- Perfect consensus impossible; practical consensus với reasonable assumptions

**Mathematical Foundations**:
- BFT bound: \( f < n/3 \)
- PoW security: exponentially decreasing với confirmations
- Quorum intersection: \( |Q_1 \cap Q_2| \geq f + 1 \)

---

✅ **End of Lecture 00.01**

**Next**: Lecture 00.02 - Cryptographic Hash Functions Deep Dive

---

## Video tham khảo

- **Xem trước:** [Distributed Systems 2.2: The Byzantine generals problem](https://www.youtube.com/watch?v=LoGx_ldRBU0) — Martin Kleppmann, tiếng Anh. Martin Kleppmann dựng bài toán các tướng Byzantine; xem trước khi đọc định nghĩa lỗi Byzantine và ngưỡng một phần ba.
- [Impossibility of Consensus](https://www.youtube.com/watch?v=2fnS-f-mwIo) — Computational Thinking, tiếng Anh. Bài nói về tính bất khả của đồng thuận, đúng chỗ bài gắn FLP với mô hình đồng bộ một phần.
- [\[CS198.2x Week 1\] Practical Byzantine Fault Tolerance](https://www.youtube.com/watch?v=IafgKJN3nwU) — Blockchain at BerkeleyX, tiếng Anh. Buổi học BerkeleyX đi qua Practical Byzantine Fault Tolerance, thuật toán mà mục kỹ thuật của bài lấy làm nền.

## References

1. Fischer, M. J., Lynch, N. A., & Paterson, M. S. (1985). Impossibility of distributed consensus with one faulty process. *Journal of the ACM*, 32(2), 374-382.
2. Lamport, L., Shostak, R., & Pease, M. (1982). The Byzantine generals problem. *ACM Transactions on Programming Languages and Systems*, 4(3), 382-401.
3. Castro, M., & Liskov, B. (1999). Practical Byzantine fault tolerance. *OSDI*, 99, 173-186.
4. Nakamoto, S. (2008). Bitcoin: A peer-to-peer electronic cash system.
5. Garay, J., Kiayias, A., & Leonardos, N. (2015). The bitcoin backbone protocol: Analysis and applications. *EUROCRYPT 2015*.
6. Cachin, C., & Vukolić, M. (2017). Blockchain consensus protocols in the wild. *arXiv:1707.01873*.

