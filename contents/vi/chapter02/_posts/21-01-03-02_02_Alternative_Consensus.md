---
layout: post
title: "Lecture 02.02: Hybrid và Alternative Consensus Mechanisms"
chapter: '02'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter02
---

# Bài giảng: Các cơ chế đồng thuận lai và thay thế

Sau khi chứng kiến ba "gã khổng lồ" PoW, PoS và BFT, một câu hỏi tự nhiên nảy ra: *liệu thế giới đồng thuận phân tán chỉ có ba con đường đó thôi sao?* Trong một thập kỷ qua, giới nghiên cứu hệ phân tán đã mở ra hàng loạt hướng đi táo bạo phá vỡ cả những khuôn mẫu tưởng như bất di bất dịch: thay vì bắt mọi nút nói chuyện với nhau như PBFT, **Avalanche** chỉ lấy mẫu ngẫu nhiên một nhóm nhỏ hàng xóm rồi để mạng tự hội tụ như quả cầu tuyết; thay vì đốt điện liên tục như Bitcoin, **Chia** chứng minh dung lượng ổ cứng lưu trữ (**Proof-of-Space-Time**); còn **Solana** dùng một chiếc "đồng hồ mật mã tuần tự" (**Proof-of-History**) để đóng dấu thời gian trước khi các nút phải tranh cãi về thứ tự giao dịch!

---

## Bản đồ kiến thức nền: Các cơ chế đồng thuận thay thế đổi mới ở ba trục nào?

### 1. Đồng thuận xác suất kiểu Lấy mẫu lặp (Metastable / Avalanche)
Khác với BFT cổ điển cần biết chính xác danh sách toàn bộ $$n$$ validator và thu gom đủ $$2/3$$ chữ ký toàn mạng, họ giao thức **Snow/Avalanche** khai thác **tính không ổn định kép (metastability)** của các hệ xác suất: mỗi nút chỉ cần hỏi ngẫu nhiên $$k$$ nút (ví dụ $$k = 20$$) bất kể toàn mạng có 1.000 hay 100.000 nút! Nếu mạng đang cân bằng 50–50, chỉ một dao động ngẫu nhiên nhỏ cũng đủ kích hoạt phản hồi dương khiến toàn mạng đổ dồn về một lựa chọn duy nhất trong thời gian $$O(\log n)$$.

### 2. Đồng thuận dựa trên Tài nguyên & Đồng hồ mật mã (PoSpace, VDF / PoH)
Thay vì băm lặp vô tận (tốn năng lượng), **Hàm trễ kiểm chứng được (VDF)** và **Proof-of-History (PoH)** tạo ra một chuỗi băm tuần tự $$h_{i+1} = \text{SHA256}(h_i)$$ không thể tính song song — dù bạn có 10.000 GPU cũng không chạy nhanh hơn 1 lõi đơn, nhưng lại kiểm chứng song song siêu tốc trên hàng nghìn lõi GPU! Trong khi đó, **Proof-of-Space-Time (Chia)** thay công suất điện bằng dung lượng ổ cứng trống đã ghi sẵn bảng băm.

### 3. Kiến trúc Đồ thị không chu trình (DAG — Narwhal & Bullshark)
Trong blockchain cổ điển, việc *truyền dữ liệu giao dịch* và *sắp xếp thứ tự đồng thuận* bị trói chặt vào cùng một Leader duy nhất, tạo cổ chai băng thông. Các giao thức dựa trên **DAG** tách đôi hai việc đó: mọi validator cùng lúc phát tán lô giao dịch song song tạo thành một đồ thị DAG dày đặc, rồi thuật toán đồng thuận nhẹ ở tầng trên chỉ việc đọc đồ thị đó để chốt thứ tự mà không cần gửi thêm gói tin phụ!

---

### Khung giải thích: tự tay tính hiệu ứng "quả cầu tuyết" trong lấy mẫu Avalanche (nên đọc chậm)

Tại sao chỉ hỏi đúng $$k = 20$$ hàng xóm ngẫu nhiên trong một mạng lưới $$n = 10\,000$$ nút lại đủ để cả mạng thống nhất gần như tuyệt đối? Hãy tự kiểm tra bằng phân phối nhị thức cơ bản:

1. **Thiết lập kịch bản:** Mạng đang tranh luận giữa hai khối mâu thuẫn **Đỏ** và **Xanh**. Quy tắc Avalanche đặt cỡ mẫu $$k = 20$$ và ngưỡng đồng thuận cục bộ $$\alpha = 14$$ (tức phải có ít nhất $$14/20 = 70\%$$ mẫu trả lời cùng một màu thì nút mới nghiêng sang màu đó).
2. **Giả sử mạng vừa hơi nghiêng $$60\%$$ về Đỏ ($$p = 0.6$$) và $$40\%$$ về Xanh ($$1 - p = 0.4$$):**
   - Xác suất để một nút lấy mẫu 20 hàng xóm nhận được **$$\ge 14$$ phiếu Đỏ** là:
     $$
     P(X_{\text{Đỏ}} \ge 14) = \sum_{j=14}^{20} \binom{20}{j} (0.6)^j (0.4)^{20-j} \approx \mathbf{25.0\%}.
     $$
   - Ngược lại, xác suất nhận được **$$\ge 14$$ phiếu Xanh** là:
     $$
     P(X_{\text{Xanh}} \ge 14) = \sum_{j=14}^{20} \binom{20}{j} (0.4)^j (0.6)^{20-j} \approx \mathbf{0.65\%}!
     $$
3. **Hiệu ứng khuếch đại (Quả cầu tuyết):** Chỉ cần một độ lệch ban đầu khiêm tốn $$60/40$$, tỉ lệ nút chuyển sang Đỏ đã lớn gấp **gần 40 lần** tỉ lệ nút chuyển sang Xanh! Ngay ở vòng kế tiếp, tỉ lệ Đỏ vọt lên $$> 70\%$$, khiến xác suất ra $$\ge 14$$ Đỏ tăng lên $$> 60\%$$ trong khi Xanh rớt xuống dưới $$0.03\%$$!
4. **Độ chắc chắn cuối cùng:** Nếu một nút thấy cùng một màu thắng liên tiếp $$\beta = 20$$ vòng liền, nút đó chốt khối vĩnh viễn. Tổng số gói tin mỗi nút chỉ là $$O(k\log n)$$ — độc lập gần hoàn toàn với kích thước khổng lồ của mạng lưới!

---

## 1. Tổng quan về khái niệm

Trong các bài trước, chúng ta đã tìm hiểu ba họ đồng thuận chính: **Proof-of-Work** (dựa trên tính toán), **Proof-of-Stake** (dựa trên tài sản đặt cọc) và **BFT** (dựa trên biểu quyết). Quá trình phát triển của blockchain còn tạo ra nhiều cơ chế đồng thuận khác bằng cách kết hợp các hướng tiếp cận sẵn có hoặc đề xuất mô hình bảo mật mới.

**Vì sao cần các cơ chế đồng thuận thay thế?**

Mỗi cơ chế đều tồn tại sự đánh đổi:
- **PoW**: Bảo mật cao nhưng tiêu thụ nhiều năng lượng và tốc độ chậm.
- **PoS**: Tiết kiệm năng lượng nhưng tiềm ẩn rủi ro tập trung hóa tài sản.
- **BFT**: Nhanh nhưng thường yêu cầu tập validator xác định trước.

Các cơ chế đồng thuận thay thế nhằm:
1. **Tối ưu hóa cho từng bài toán cụ thể** (chuỗi riêng tư, thiết bị IoT, lưu trữ dữ liệu).
2. **Kết hợp ưu điểm của nhiều cơ chế** (đồng thuận lai).
3. **Đề xuất mô hình bảo mật dựa trên tài nguyên khác** (dung lượng lưu trữ, băng thông).
4. **Cải thiện các chỉ số mục tiêu** (thông lượng, thời gian hoàn tất, mức độ phi tập trung).

**Phân loại các cơ chế đồng thuận thay thế**:

**1. Cơ chế lai (Hybrid Mechanisms)**:
- Kết hợp PoW + PoS (Decred)
- Kết hợp BFT + PoS (Ethereum 2.0 Gasper)
- Đồng thuận đa tầng (Polkadot)

**2. Bằng chứng dựa trên tài nguyên (Resource-Based Proofs)**:
- Proof-of-Space (Chia, Spacemesh)
- Proof-of-Capacity (Burstcoin)
- Proof-of-Bandwidth
- Proof-of-Replication (Filecoin)

**3. Cơ chế ủy quyền (Delegated Mechanisms)**:
- Delegated Proof-of-Stake (EOS, Tron)
- Liquid Proof-of-Stake (Tezos)
- Nominated Proof-of-Stake (Polkadot)

**4. Dựa trên thẩm quyền (Authority-Based)**:
- Proof-of-Authority (VeChain, xDai)
- Proof-of-Reputation
- Federated Byzantine Agreement (Stellar)

**5. Các hướng tiếp cận mới (Novel Approaches)**:
- Proof-of-History (Solana)
- Proof-of-Elapsed-Time (Hyperledger Sawtooth)
- Avalanche Consensus
- Hashgraph

**Bối cảnh lịch sử**:

Sự ra đời của các cơ chế đồng thuận gắn liền với việc giải quyết những hạn chế cụ thể ở từng giai đoạn:

```
2009: PoW (Bitcoin) - Solves double-spending
         ↓
Problem: Energy consumption, scalability
         ↓
2012: Hybrid PoW/PoS (Peercoin)
2013: Pure PoS proposals
         ↓
Problem: Nothing-at-stake
         ↓
2014: DPoS (BitShares) - Improve throughput
         ↓
Problem: Centralization concerns
         ↓
2015: PoSpace (Chia proposal) - Reduce energy
2016: PoAuth (Private chains) - Known validators
         ↓
Problem: Need different tradeoffs
         ↓
2018: Novel mechanisms (Avalanche, Hashgraph, Solana)
         ↓
Present: Specialization for use cases
```

**Bộ ba bất khả thi của Blockchain (Blockchain Trilemma)**:

Theo nhận định của Vitalik Buterin, một hệ thống blockchain khó tối ưu đồng thời cả ba yếu tố và thường phải ưu tiên hai trong ba:
- **Tính phi tập trung (Decentralization)**
- **Tính bảo mật (Security)**
- **Khả năng mở rộng (Scalability)**

Các cơ chế đồng thuận thay thế thường đưa ra lựa chọn ưu tiên rõ ràng:

```
PoW (Bitcoin):     High Decentralization + Security → Low Scalability
DPoS (EOS):        High Scalability + Security → Lower Decentralization
PoAuth (Private):  High Scalability + Security → No Public Decentralization
Novel (Solana):    High Scalability + Decentralization → Different Security Model
```

---

## 2. Hiểu biết trực quan

### 2.1. Đồng thuận lai PoW/PoS — Bảo mật hai lớp

**Mô hình Decred** sử dụng đồng thời cả PoW và PoS như một hệ thống bảo mật kép:

```
Block Creation:
1. PoW miners find block (like Bitcoin)
2. PoS voters must approve block
3. Need both to confirm

Analogy: Nuclear launch system
- Officer 1 has launch code (PoW miner)
- Officer 2 must turn key (PoS voters)
- Both required → launch (block confirmed)

Security: Attacker needs control both systems!
```

**Quy trình biểu quyết**:
```
PoW Miner mines block:
└─ Block header includes 5 random tickets
└─ Ticket holders (PoS stakers) vote YES/NO
└─ Need ≥3/5 votes to approve
└─ If approved: Miner gets reward, voters get reward
└─ If rejected: Block orphaned

Result: Miners must produce valid blocks or waste work!
```

### 2.2. DPoS — Cơ chế đại diện

**Delegated Proof-of-Stake (DPoS)** vận hành tương tự mô hình dân chủ đại diện:

```
Traditional PoS (Direct Democracy):
└─ Everyone votes on every decision
└─ Slow, high communication overhead

DPoS (Representative Democracy):
└─ Token holders elect delegates/witnesses
└─ Delegates take turns producing blocks
└─ Fast, efficient
└─ Can vote out bad delegates

Example (EOS):
- 21 active block producers
- Elected by token holders
- Each produces blocks in turn
- 0.5 second block time!
```

**Quy trình bầu chọn**:
```
Token Holders:
Alice (1000 tokens) → votes for Producer A
Bob (500 tokens)    → votes for Producer B
Charlie (2000 tokens) → votes for Producer A

Top 21 candidates by vote weight become producers

Producer A: 3000 votes (Alice + Charlie)
Producer B: 500 votes (Bob)
...

Result: A becomes active, B is standby
```

### 2.3. Proof-of-Space — Khai thác bằng dung lượng lưu trữ

Thay vì tiêu tốn điện năng cho tính toán liên tục, cơ chế này sử dụng không gian lưu trữ trên ổ cứng:

```
PoW (Bitcoin):
└─ Buy expensive ASICs
└─ Consume massive electricity
└─ Solve hash puzzles

PoSpace (Chia):
└─ Buy hard drives (much cheaper)
└─ Minimal electricity
└─ Prove you're storing data

Analogy: Library membership
- PoW: Solve puzzle every time you want book
- PoSpace: Prove you have shelf space allocated
```

**Cách hoạt động**:
```
Setup Phase (once):
1. Fill hard drive with "plots" (cryptographic tables)
2. Takes hours to compute, uses CPU
3. Stored permanently

Mining Phase (ongoing):
1. Network broadcasts challenge
2. Check if you have matching entry in plots
3. Fastest response wins
4. Almost no electricity consumed!

Result: "Green" mining using storage instead of compute
```

### 2.4. Proof-of-Authority — Validator được định danh

**Proof-of-Authority (PoA)** hoạt động tương tự một hội đồng quản trị gồm các tổ chức đã biết rõ danh tính:

```
Public Blockchain (PoW/PoS):
└─ Anyone can participate
└─ Trust based on economic/computational cost
└─ Pseudonymous validators

Private/Consortium (PoA):
└─ Known, trusted entities as validators
└─ Trust based on reputation/identity
└─ e.g., Banks, universities, government agencies

Example (VeChain):
- 101 Authority Masternodes
- Real-world identity verified
- Reputation at stake
- Fast (10s blocks)
```

**Tiêu chí lựa chọn validator**:
```
Criteria:
✓ Known legal identity
✓ Reputation in industry
✓ Technical capability
✓ Geographic distribution

Validators:
- University of Oxford
- PwC
- DNV GL
- BMW
etc.

Misbehavior: Lose reputation + legal consequences!
```

### 2.5. Đồng thuận Avalanche — Lấy mẫu ngẫu nhiên lặp

Avalanche tiếp cận bài toán đồng thuận bằng cách lấy mẫu ngẫu nhiên lặp lại thay vì phát tán thông điệp tới toàn mạng:

```
Traditional BFT:
└─ Broadcast to all nodes (O(n²) messages)
└─ Wait for 2/3 agreement
└─ Deterministic outcome

Avalanche:
└─ Randomly sample k nodes (k << n)
└─ If majority agrees, strengthen confidence
└─ Repeat many times
└─ Probabilistic convergence

Analogy: Opinion polling
- Don't ask everyone (expensive)
- Sample random subset (cheap)
- Repeat many times
- Converge on consensus
```

**Quy trình biểu quyết**:
```
Node wants to decide on transaction validity:

Round 1: Sample 20 random nodes
└─ 15 say YES, 5 say NO
└─ Majority YES → confidence +1

Round 2: Sample another 20 nodes
└─ 18 say YES, 2 say NO
└─ Majority YES → confidence +1

...

Round N: Confidence reaches threshold
└─ Accept transaction as finalized

Result: Fast convergence without O(n²) communication!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Delegated Proof-of-Stake (DPoS)

**Kiến trúc hệ thống**:

```
Components:
1. Token Holders - vote for delegates
2. Delegates/Witnesses - produce blocks
3. Standby Delegates - backup producers

Parameters (EOS example):
- Active producers: 21
- Standby producers: ~100
- Block time: 0.5 seconds
- Blocks per producer per round: 12
- Round length: 21 × 12 × 0.5s = 126 seconds
```

**Cơ chế bầu chọn**:

```python
class DPoS:
    def __init__(self, num_active_producers=21):
        self.num_active = num_active_producers
        self.candidates = {}  # candidate_id → votes
        self.active_producers = []
        self.current_producer = 0
        self.block_height = 0
    
    def vote(self, voter_stake, candidate_id):
        """Token holder votes for candidate"""
        if candidate_id not in self.candidates:
            self.candidates[candidate_id] = 0
        
        self.candidates[candidate_id] += voter_stake
    
    def elect_producers(self):
        """Elect top N candidates as active producers"""
        # Sort by vote weight
        sorted_candidates = sorted(
            self.candidates.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Top N become active
        self.active_producers = [
            candidate_id 
            for candidate_id, votes in sorted_candidates[:self.num_active]
        ]
        
        print(f"Elected {len(self.active_producers)} producers:")
        for i, producer in enumerate(self.active_producers):
            votes = self.candidates[producer]
            print(f"  {i+1}. Producer {producer}: {votes:,} votes")
    
    def produce_block(self):
        """Current producer creates block"""
        producer = self.active_producers[self.current_producer]
        
        block = {
            'height': self.block_height,
            'producer': producer,
            'timestamp': time.time()
        }
        
        self.block_height += 1
        
        # Round-robin: next producer
        self.current_producer = (self.current_producer + 1) % self.num_active
        
        return block
    
    def get_producer_schedule(self, num_blocks):
        """Get upcoming producer schedule"""
        schedule = []
        current = self.current_producer
        
        for i in range(num_blocks):
            producer = self.active_producers[current]
            schedule.append((self.block_height + i, producer))
            current = (current + 1) % self.num_active
        
        return schedule
```

**Lịch sản xuất khối**:

```
Schedule (21 producers, each gets 12 consecutive blocks):

Producer 0:  Blocks 0-11
Producer 1:  Blocks 12-23
Producer 2:  Blocks 24-35
...
Producer 20: Blocks 240-251
Producer 0:  Blocks 252-263 (new round)
...

Advantages:
✓ Predictable schedule
✓ Fast block time (0.5s)
✓ No mining competition waste

Disadvantages:
✗ Only 21 active producers (centralization)
✗ Potential for collusion
✗ Requires governance layer
```

**Xử lý vi phạm hiệu năng**:

```python
def check_producer_performance(producer_id, recent_blocks):
    """Check if producer is fulfilling duties"""
    expected_blocks = count_scheduled_blocks(producer_id)
    produced_blocks = count_produced_blocks(producer_id, recent_blocks)
    
    miss_rate = 1 - (produced_blocks / expected_blocks)
    
    if miss_rate > 0.5:  # Missing >50% of blocks
        # Remove from active producers
        kick_producer(producer_id)
        # Voters can re-elect or choose new candidate
```

### 3.2. Proof-of-Space (PoSpace)

**Khái niệm cốt lõi**: Chứng minh quyền sở hữu không gian lưu trữ đã được phân bổ.

**Giao thức hai pha**:

**Pha 1: Tạo plot (Plotting — thiết lập ban đầu)**

```python
def create_plot(plot_size_gb, plot_id):
    """Create plot file (done once)"""
    
    # Number of hashes to compute
    num_hashes = plot_size_gb * 1024**3 // 32  # 32 bytes per hash
    
    plot_table = {}
    
    for i in range(num_hashes):
        # Compute hash based on plot_id and index
        hash_input = f"{plot_id}:{i}"
        hash_value = hashlib.sha256(hash_input.encode()).digest()
        
        # Store in table (hash → index mapping)
        plot_table[hash_value[:16]] = i  # First 16 bytes as key
    
    # Write to disk
    save_plot(plot_id, plot_table)
    
    print(f"Plot {plot_id} created: {plot_size_gb} GB, "
          f"{num_hashes:,} hashes")
    
    return plot_table
```

**Pha 2: Khai thác (Farming)**

```python
def check_plot_for_challenge(plot_table, challenge):
    """Check if plot has valid response to challenge"""
    
    # Look for hash matching challenge
    challenge_prefix = challenge[:16]
    
    if challenge_prefix in plot_table:
        # Found match!
        proof_index = plot_table[challenge_prefix]
        
        # Compute full proof
        proof = generate_proof_of_space(proof_index, challenge)
        
        return proof
    
    return None

def farm_block(plots, challenge):
    """Check all plots for valid response"""
    best_proof = None
    best_quality = 0
    
    for plot_id, plot_table in plots.items():
        proof = check_plot_for_challenge(plot_table, challenge)
        
        if proof:
            quality = compute_quality(proof)
            
            if quality > best_quality:
                best_quality = quality
                best_proof = proof
    
    return best_proof, best_quality
```

**Proof-of-Space-and-Time của Chia**:

Chia kết hợp PoSpace với **Hàm trễ có thể kiểm chứng (Verifiable Delay Function — VDF)**:

```
Block creation:
1. Farmer finds PoSpace proof (fast lookup)
2. VDF computes time-proof (takes T seconds, cannot parallelize)
3. Block valid only if both proofs present

Security:
- PoSpace: Must have storage allocated
- VDF: Must wait T seconds (prevents grinding)
- Combined: Hard to game system
```

**Hiệu quả lưu trữ và năng lượng**:

```
Plot sizes:
- k=32: ~100 GB per plot
- k=33: ~200 GB per plot
- k=34: ~400 GB per plot

Farming (per TB):
- Power: ~10W (idle hard drive)
- Cost: ~$20/TB (one-time)

Compare to PoW:
- Bitcoin: ~150 TWh/year
- Chia: ~0.3 TWh/year (500x less!)
```

### 3.3. Proof-of-Authority (PoA)

**Lựa chọn và quản lý nút có thẩm quyền**:

```python
class ProofOfAuthority:
    def __init__(self):
        self.authorities = {}  # address → authority_info
        self.active_authorities = []
        self.block_time = 5  # seconds
    
    def register_authority(self, address, identity):
        """Register new authority (requires governance approval)"""
        authority = {
            'address': address,
            'identity': identity,  # Real-world identity
            'reputation_score': 100,
            'blocks_produced': 0,
            'blocks_missed': 0,
            'violations': 0
        }
        
        self.authorities[address] = authority
        self.active_authorities.append(address)
        
        print(f"Authority registered: {identity['name']}")
    
    def select_block_producer(self, block_number):
        """Select authority to produce block (round-robin or random)"""
        # Round-robin
        index = block_number % len(self.active_authorities)
        return self.active_authorities[index]
    
    def produce_block(self, block_number, producer_address):
        """Authority produces block"""
        if producer_address not in self.authorities:
            return None
        
        authority = self.authorities[producer_address]
        
        block = {
            'number': block_number,
            'producer': producer_address,
            'identity': authority['identity']['name'],
            'timestamp': time.time(),
            'transactions': []  # Would include transactions
        }
        
        # Sign block with authority's private key
        block['signature'] = sign_block(block, producer_address)
        
        # Update stats
        authority['blocks_produced'] += 1
        
        return block
    
    def verify_block(self, block):
        """Verify block produced by authorized authority"""
        producer = block['producer']
        
        if producer not in self.authorities:
            return False, "Unknown authority"
        
        # Verify signature
        if not verify_signature(block, block['signature'], producer):
            return False, "Invalid signature"
        
        # Verify correct turn
        expected_producer = self.select_block_producer(block['number'])
        if producer != expected_producer:
            return False, "Not producer's turn"
        
        return True, "Valid"
    
    def slash_authority(self, address, reason):
        """Penalize misbehaving authority"""
        if address not in self.authorities:
            return
        
        authority = self.authorities[address]
        authority['violations'] += 1
        authority['reputation_score'] -= 20
        
        print(f"⚠️  Authority {authority['identity']['name']} slashed: {reason}")
        print(f"   Reputation: {authority['reputation_score']}")
        
        # Remove if reputation too low
        if authority['reputation_score'] < 50:
            self.active_authorities.remove(address)
            print(f"   Authority REMOVED from active set")
```

**Ứng dụng và đặc điểm**:

```
Private/Consortium Chains:
✓ Supply chain tracking (VeChain)
✓ Interbank settlement
✓ Government records
✓ Enterprise blockchain

Advantages:
✓ Very fast (sub-second blocks)
✓ High throughput (1000s TPS)
✓ Low energy consumption
✓ Regulatory compliant (known validators)

Disadvantages:
✗ Not permissionless
✗ Requires trust in authorities
✗ Centralization (small validator set)
```

### 3.4. Đồng thuận Avalanche

**Giao thức lấy mẫu ngẫu nhiên lặp**:

```python
import random
from typing import Set, Dict

class AvalancheConsensus:
    def __init__(self, node_id, all_nodes, k=20, alpha=0.8, beta=20):
        self.node_id = node_id
        self.all_nodes = all_nodes
        
        # Parameters
        self.k = k  # Sample size
        self.alpha = alpha  # Threshold (as fraction)
        self.beta = beta  # Confidence threshold
        
        # State
        self.preferred = {}  # tx_id → value
        self.confidence = {}  # tx_id → confidence counter
        self.decided = set()  # Finalized transactions
    
    def query_sample(self, tx_id, value):
        """Query random sample of k nodes"""
        # Random sample (excluding self)
        sample = random.sample(
            [n for n in self.all_nodes if n != self.node_id],
            min(self.k, len(self.all_nodes) - 1)
        )
        
        # Query each node
        responses = []
        for node in sample:
            response = node.get_preference(tx_id)
            responses.append(response)
        
        # Count responses
        votes_for_value = sum(1 for r in responses if r == value)
        
        return votes_for_value
    
    def update_preference(self, tx_id, new_value):
        """Update preferred value for transaction"""
        old_value = self.preferred.get(tx_id)
        
        if old_value != new_value:
            # Preference changed, reset confidence
            self.confidence[tx_id] = 0
        
        self.preferred[tx_id] = new_value
    
    def process_transaction(self, tx_id, initial_value):
        """Process transaction until decided"""
        self.preferred[tx_id] = initial_value
        self.confidence[tx_id] = 0
        
        consecutive_success = 0
        
        while tx_id not in self.decided:
            # Query random sample
            votes = self.query_sample(tx_id, self.preferred[tx_id])
            
            # Check if threshold met
            if votes >= self.k * self.alpha:
                # Majority agrees
                consecutive_success += 1
                
                # Increase confidence
                self.confidence[tx_id] += 1
                
                print(f"Node {self.node_id}: Round {consecutive_success}, "
                      f"Confidence {self.confidence[tx_id]}, "
                      f"Votes {votes}/{self.k}")
                
                # Check finality
                if self.confidence[tx_id] >= self.beta:
                    # Decided!
                    self.decided.add(tx_id)
                    print(f"Node {self.node_id}: ✓ Transaction {tx_id} "
                          f"DECIDED as {self.preferred[tx_id]}")
                    return self.preferred[tx_id]
            else:
                # Threshold not met, might flip
                consecutive_success = 0
                
                # In real implementation, might query what majority prefers
                # and switch to that value
        
        return self.preferred[tx_id]
    
    def get_preference(self, tx_id):
        """Return current preference for transaction"""
        return self.preferred.get(tx_id)
```

**Các tính chất**:

```
Message Complexity: O(k·n) per round
- Each node queries k others
- n nodes total
- Much less than O(n²) for traditional BFT

Convergence: O(log n) rounds expected
- Exponentially fast convergence
- Probabilistic guarantee

Throughput: Very high
- Parallel decision on many transactions
- No leader bottleneck
- Can decide thousands of TXs simultaneously
```

### 3.5. Proof-of-History (Solana)

**Ý tưởng cốt lõi**: Tạo bằng chứng mật mã chứng minh khoảng thời gian đã trôi qua.

**Vấn đề**: Trong hệ thống phân tán, các nút khó thống nhất về thứ tự thời gian của các sự kiện.

**Giải pháp**: Xây dựng chuỗi băm tuần tự để làm đồng hồ mật mã.

```python
def proof_of_history_sequence(num_iterations):
    """Generate PoH sequence"""
    
    # Start with seed
    state = hashlib.sha256(b"seed").digest()
    
    sequence = []
    
    for i in range(num_iterations):
        # Hash of previous state
        state = hashlib.sha256(state).digest()
        
        sequence.append({
            'index': i,
            'hash': state.hex(),
            'timestamp': time.time()
        })
        
        # This takes time - cannot parallelize!
        # Hash must be computed sequentially
    
    return sequence

def insert_event_in_poh(sequence, event):
    """Insert event into PoH sequence"""
    
    # Hash event data
    event_hash = hashlib.sha256(event.encode()).digest()
    
    # Get current PoH state
    current_state = sequence[-1]['hash']
    
    # Mix event into PoH
    new_state = hashlib.sha256(
        bytes.fromhex(current_state) + event_hash
    ).digest()
    
    sequence.append({
        'index': len(sequence),
        'hash': new_state.hex(),
        'event': event,
        'timestamp': time.time()
    })
    
    return sequence
```

**Cách Solana sử dụng PoH**:

```
1. Leader generates PoH sequence continuously
   └─ Cryptographic clock ticking
   └─ ~400ms per PoH slot

2. Transactions get inserted into PoH
   └─ Hash(previous_state + transaction)
   └─ Creates ordering proof

3. Validators verify PoH sequence
   └─ Can verify in parallel (forward direction)
   └─ Much faster than generation

4. Consensus achieved quickly
   └─ PoH provides ordering
   └─ Tower BFT votes on validity
   └─ Sub-second finality

Result: 50,000+ TPS throughput!
```

---

## 4. Công thức toán học và lý thuyết trò chơi

### 4.1. Phân tích quyền biểu quyết trong DPoS

**Phân bổ trọng số phiếu bầu**:

Gọi \( s_i \) là lượng stake của cử tri \( i \) bỏ phiếu cho ứng viên \( c \). Tổng số phiếu của ứng viên \( c \) là:
\[
V_c = \sum_{i \in \text{voters for } c} s_i
\]

**Lựa chọn Top-N**:

Các ứng viên được xếp hạng theo \( V_c \), và \( N \) ứng viên đứng đầu được bầu làm nhà sản xuất khối hoạt động.

**Hệ số Nakamoto** (thước đo mức độ phi tập trung):

Số lượng thực thể tối thiểu cùng nắm giữ trên 1/3 (hoặc trên 50%) quyền kiểm soát mạng lưới:

\[
NC = \min\{k : \sum_{i=1}^{k} V_i > \frac{1}{3} \sum_{j=1}^{N} V_j\}
\]

**Ví dụ** (EOS với 21 nhà sản xuất khối):
```
If top 7 producers control >33% voting power:
NC = 7 (relatively centralized)

If need 15 producers for 33%:
NC = 15 (more decentralized)
```

**Vấn đề thờ ơ của cử tri (Voter Apathy)**:

Trên thực tế, nhiều người nắm giữ token không tham gia bỏ phiếu:

\[
\text{Participation Rate} = \frac{\text{Votes Cast}}{\text{Total Stake}} 
\]

Khi tỷ lệ tham gia thấp, một nhóm nhỏ nắm giữ stake lớn có thể chi phối việc quản trị mạng.

### 4.2. Phân tích bảo mật của Proof-of-Space

**Chi phí tạo plot**:

\[
\text{Cost} = \text{Storage Cost} + \text{Energy for Plotting}
\]

**Chi phí tấn công** (tấn công 51%):

Để kiểm soát hơn 50% dung lượng lưu trữ của mạng:

\[
\text{Attack Cost} = 0.51 \times \text{Network Size (TB)} \times \text{Storage Cost per TB}
\]

**Ví dụ**:
```
Network size: 20 Exabytes (20 million TB)
Storage cost: $20/TB

Attack cost: 0.51 × 20,000,000 × $20 = $204 million

Compare to Bitcoin:
- Hardware: ~$8 billion
- Plus ongoing electricity: $millions/month

PoSpace: Much cheaper to attack!
But: Less profitable to attack (price crashes)
```

**Vấn đề tương tự Nothing-at-Stake**:

Trong PoSpace, người khai thác có thể sử dụng cùng bộ plot để khai thác song song trên nhiều nhánh.

**Giải pháp**:
1. **VDF (Verifiable Delay Function)**: Bắt buộc chờ khoảng thời gian \( T \) giây cho mỗi khối.
2. **Xử phạt**: Phát hiện khai thác đồng thời nhiều nhánh có thể dẫn đến mất phần thưởng hoặc vô hiệu hóa plot.
3. **Độ khó thích ứng**: Điều chỉnh độ khó mạng tương tự PoW.

### 4.3. Xác suất hội tụ của Avalanche

**Xác suất đạt ngưỡng trong một mẫu**:

Cho:
- \( n \) là tổng số nút.
- \( f \) là số nút Byzantine.
- \( k \) là kích thước mẫu ngẫu nhiên.
- \( \alpha k \) là ngưỡng đồng thuận trong mẫu.

Xác suất mẫu chứa ít nhất \( \lceil \alpha k \rceil \) nút trung thực (khi chọn có hoàn lại hoặc \( k \ll n \)):

\[
P(\text{honest quorum}) = \sum_{i=\lceil \alpha k \rceil}^{k} \binom{k}{i} \left(\frac{n-f}{n}\right)^i \left(\frac{f}{n}\right)^{k-i}
\]

**Với \( f < n/5 \) (tối đa 20% nút Byzantine)** và \( k = 20 \):

- Nếu xét ngưỡng đa số đơn giản (\( i \geq 11 \)), xác suất mẫu có đa số nút trung thực đạt:
\[
P(\text{honest majority}) > 0.99
\]
- Nếu xét ngưỡng \( \alpha = 0.8 \) (\( i \geq 16 \)), xác suất đạt ngưỡng trong một vòng là \( \approx 0.63 \).

**Thời gian hội tụ**:

Số vòng kỳ vọng để đạt ngưỡng tin cậy \( \beta \):

\[
E[\text{rounds}] \approx \beta \quad \text{(with high probability)}
\]

Với \( \beta = 20 \):
```
20 rounds × ~200ms per round = 4 seconds to finality
```

Cách tiếp cận này giúp giảm độ trễ hội tụ so với việc trao đổi thông điệp toàn mạng trong BFT cổ điển.

### 4.4. Lý thuyết trò chơi trong PoA

**Bảo mật dựa trên danh tiếng**:

Hàm lợi ích của một nút có thẩm quyền:

\[
U_i = \text{Rewards} - \text{Cost} - P(\text{caught}) \times \text{Reputation Loss}
\]

**Trạng thái cân bằng**:

Các tổ chức thẩm quyền hành động trung thực khi:

\[
\text{Honest Reward} > \text{Attack Gain} - \text{Expected Reputation Loss}
\]

**Hệ quả thực tế**:
```
Reputation Loss:
- Legal consequences (known identity)
- Business relationships damaged
- Industry standing destroyed

For established entities:
Reputation value >> Short-term gain from attack

Result: Strong disincentive to misbehave
```

### 4.5. Hiệu ứng kết hợp trong cơ chế lai

**Phân tích mô hình Decred**:

Để tấn công thành công, kẻ tấn công phải đồng thời vượt qua cả hai lớp bảo mật:

\[
P(\text{attack success}) = P(\text{PoW attack}) \times P(\text{PoS attack})
\]

**Ví dụ**:
```
PoW alone: Need 51% hash rate
P(PoW attack) ≈ Cost / $X billion

PoS alone: Need 51% stake
P(PoS attack) ≈ Cost / $Y million

Hybrid: Need BOTH
P(hybrid attack) = P(PoW) × P(PoS) ≈ Cost / $(X billion × Y million)

Dramatically more secure!
```

**So sánh chi phí**:
\[
\text{Hybrid Attack Cost} \geq \text{PoW Cost} + \text{PoS Cost}
\]

Nhờ yêu cầu vượt qua cả hai lớp, tổng chi phí tấn công tăng lên so với việc chỉ dùng riêng một cơ chế.

---

## 5. Góc nhìn triển khai

### 5.1. Cài đặt mô phỏng DPoS đơn giản

```python
import time
from typing import Dict, List
from collections import defaultdict

class DPoSBlockchain:
    """Delegated Proof-of-Stake implementation"""
    
    def __init__(self, num_active_producers=21, block_time=0.5):
        self.num_active = num_active_producers
        self.block_time = block_time
        
        # Voting state
        self.token_holders = {}  # address → balance
        self.votes = defaultdict(lambda: defaultdict(int))  # voter → candidate → weight
        self.candidates = set()
        
        # Producer state
        self.active_producers = []
        self.producer_stats = defaultdict(lambda: {'produced': 0, 'missed': 0})
        
        # Blockchain
        self.chain = []
        self.current_producer_index = 0
    
    def register_token_holder(self, address, balance):
        """Register token holder"""
        self.token_holders[address] = balance
        print(f"Registered: {address} with {balance:,} tokens")
    
    def register_candidate(self, address):
        """Register block producer candidate"""
        self.candidates.add(address)
        print(f"Candidate registered: {address}")
    
    def vote(self, voter_address, candidate_address):
        """Token holder votes for candidate"""
        if voter_address not in self.token_holders:
            print(f"Error: {voter_address} not a token holder")
            return False
        
        if candidate_address not in self.candidates:
            print(f"Error: {candidate_address} not a candidate")
            return False
        
        # Vote weight = token balance
        weight = self.token_holders[voter_address]
        self.votes[voter_address][candidate_address] = weight
        
        print(f"{voter_address} voted for {candidate_address} "
              f"with weight {weight:,}")
        return True
    
    def tally_votes(self):
        """Count all votes and elect producers"""
        candidate_votes = defaultdict(int)
        
        # Sum votes for each candidate
        for voter, votes_cast in self.votes.items():
            for candidate, weight in votes_cast.items():
                candidate_votes[candidate] += weight
        
        # Sort by vote count
        sorted_candidates = sorted(
            candidate_votes.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Elect top N
        self.active_producers = [
            candidate 
            for candidate, votes in sorted_candidates[:self.num_active]
        ]
        
        print(f"\n=== Election Results ===")
        print(f"Active Producers ({len(self.active_producers)}):")
        for i, producer in enumerate(self.active_producers):
            votes = candidate_votes[producer]
            print(f"  {i+1}. {producer}: {votes:,} votes")
        
        return self.active_producers
    
    def get_scheduled_producer(self, block_num):
        """Get producer scheduled for block number"""
        if not self.active_producers:
            return None
        
        # Each producer gets consecutive blocks
        blocks_per_producer = 12
        producer_index = (block_num // blocks_per_producer) % len(self.active_producers)
        
        return self.active_producers[producer_index]
    
    def produce_block(self, producer_address, transactions=None):
        """Producer creates block"""
        if producer_address not in self.active_producers:
            print(f"Error: {producer_address} not an active producer")
            return None
        
        block_num = len(self.chain)
        expected_producer = self.get_scheduled_producer(block_num)
        
        if producer_address != expected_producer:
            print(f"Error: Not {producer_address}'s turn "
                  f"(expected {expected_producer})")
            self.producer_stats[producer_address]['missed'] += 1
            return None
        
        # Create block
        block = {
            'number': block_num,
            'producer': producer_address,
            'timestamp': time.time(),
            'transactions': transactions or [],
            'previous_hash': self.chain[-1]['hash'] if self.chain else '0' * 64
        }
        
        # Hash block
        block_str = str(sorted(block.items()))
        block['hash'] = hashlib.sha256(block_str.encode()).hexdigest()
        
        # Add to chain
        self.chain.append(block)
        self.producer_stats[producer_address]['produced'] += 1
        
        print(f"Block {block_num} produced by {producer_address}")
        
        return block
    
    def simulate_rounds(self, num_rounds=3):
        """Simulate block production rounds"""
        blocks_per_round = self.num_active * 12  # Each producer gets 12 blocks
        total_blocks = num_rounds * blocks_per_round
        
        print(f"\n=== Simulating {num_rounds} rounds ({total_blocks} blocks) ===")
        
        for block_num in range(total_blocks):
            producer = self.get_scheduled_producer(block_num)
            
            # Simulate occasional missed blocks
            if random.random() < 0.95:  # 95% uptime
                self.produce_block(producer)
            else:
                print(f"Block {block_num}: {producer} MISSED")
                self.producer_stats[producer]['missed'] += 1
            
            # Sleep to simulate block time
            time.sleep(0.01)  # Shortened for demo
        
        print(f"\nSimulation complete: {len(self.chain)} blocks produced")
    
    def get_producer_performance(self):
        """Get performance stats for all producers"""
        print(f"\n=== Producer Performance ===")
        
        for producer in self.active_producers:
            stats = self.producer_stats[producer]
            total = stats['produced'] + stats['missed']
            uptime = (stats['produced'] / total * 100) if total > 0 else 0
            
            print(f"{producer}:")
            print(f"  Produced: {stats['produced']}")
            print(f"  Missed: {stats['missed']}")
            print(f"  Uptime: {uptime:.1f}%")

# Example usage
if __name__ == "__main__":
    print("=== DPoS Blockchain Simulation ===\n")
    
    # Initialize
    dpos = DPoSBlockchain(num_active_producers=5, block_time=0.5)
    
    # Register token holders
    holders = [
        ('Alice', 10000),
        ('Bob', 5000),
        ('Charlie', 8000),
        ('David', 12000),
        ('Eve', 3000)
    ]
    
    for address, balance in holders:
        dpos.register_token_holder(address, balance)
    
    print()
    
    # Register candidates
    candidates = ['Producer_A', 'Producer_B', 'Producer_C', 
                  'Producer_D', 'Producer_E', 'Producer_F']
    
    for candidate in candidates:
        dpos.register_candidate(candidate)
    
    print()
    
    # Voting
    print("=== Voting Phase ===")
    dpos.vote('Alice', 'Producer_A')
    dpos.vote('Bob', 'Producer_B')
    dpos.vote('Charlie', 'Producer_A')  # Same as Alice
    dpos.vote('David', 'Producer_C')
    dpos.vote('Eve', 'Producer_B')
    
    # Tally and elect
    dpos.tally_votes()
    
    # Simulate block production
    dpos.simulate_rounds(num_rounds=2)
    
    # Show performance
    dpos.get_producer_performance()
```

---

## Video tham khảo

- **Xem trước:** [Avalanche Consensus Simply Explained](https://www.youtube.com/watch?v=3TAgLJHTYRg) — Decentralized Thought, tiếng Anh. Giải thích cơ chế lấy mẫu ngẫu nhiên lặp của Avalanche; nên xem trước nhóm cơ chế đồng thuận mới trong bài.
- [The Stellar Consensus Protocol | David Mazières | Talks at Google](https://www.youtube.com/watch?v=vmwnhZmEZjc) — Talks at Google, tiếng Anh. David Mazières trình bày về Stellar Consensus Protocol; đối chiếu với mục Federated Byzantine Agreement.
- [How Proof of History Works on Solana](https://www.youtube.com/watch?v=GU4igNeYr-Q) — base256, tiếng Anh. Giải thích cách Proof-of-History tạo đồng hồ mật mã trước bước biểu quyết, tương ứng với phần Solana trong bài.
