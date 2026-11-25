---
layout: post
title: "Lecture 02.00: Proof-of-Stake - Consensus qua Economic Stake"
chapter: '02'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter02
---

# Bài giảng: Proof-of-Stake — Đồng thuận dựa trên tài sản đặt cọc

Tháng 9 năm 2022, lịch sử công nghệ chứng kiến một ca "thay động cơ máy bay ngay giữa bầu trời" chưa từng có tiền lệ: mạng lưới Ethereum đang bảo vệ hàng trăm tỷ đô la tài sản đã tắt hoàn toàn hệ thống đào Proof-of-Work tiêu thụ điện ngang một quốc gia cỡ trung bình, chuyển sang **Proof-of-Stake (PoS)** — cắt giảm ngay lập tức **hơn 99.95% lượng điện năng tiêu thụ** mà không bỏ lỡ một khối giao dịch nào!

Nhưng đằng sau bước nhảy ngoạn mục ấy là hàng loạt câu hỏi hóc búa mà cộng đồng mật mã học mất gần một thập kỷ để giải quyết: nếu tạo khối mới gần như không tốn điện, điều gì ngăn một validator ký đồng thời lên *mọi* nhánh phân nhánh để ăn thưởng cả hai đầu (**vấn đề Nothing-at-Stake**)? Và nếu một kẻ tấn công mua lại khóa bí mật của các validator cũ từ năm 2020 rồi âm thầm viết lại cả lịch sử (**tấn công tầm xa — Long-Range Attack**), một nút mới tham gia mạng làm sao phân biệt được chuỗi thật?

---

## Kiến thức cần nhớ: Proof-of-Stake đứng trên ba trụ cột toán học – kinh tế nào?

### 1. Chọn validator có trọng số cổ phần và Ngẫu nhiên phân tán (RANDAO / VRF)
Trong PoS, xác suất được chọn đề xuất khối tỉ lệ trực tiếp với lượng tài sản khóa đặt cọc $$s_i / S$$. Thách thức mật mã học là phải tạo ra **nguồn ngẫu nhiên công bằng không thể thao túng** (như cơ chế trộn băm **RANDAO** của Ethereum hay hàm ngẫu nhiên kiểm chứng được **VRF** của Algorand/Cardano) để không ai biết trước quá xa hoặc cố tình bỏ lượt nhằm lái kết quả xổ số về phía mình.

### 2. Kinh tế học răn đe: Trừng phạt Slashing và Giải quyết Nothing-at-Stake
PoS giải quyết bài toán *Nothing-at-Stake* bằng một vũ khí mà PoW không thể có ở tầng giao thức: **Slashing** (tịch thu và đốt bỏ tài sản đặt cọc). Nếu một validator ký hai khối mâu thuẫn ở cùng một độ cao (equivocation), chính hai chữ ký số hợp lệ đó tạo thành **bằng chứng gian lận không thể chối cãi**; bất kỳ ai gửi hai chữ ký ấy lên chuỗi đều khiến tài sản đặt cọc của kẻ gian bị cắt phạt ngay lập tức!

### 3. Tính chốt khối kinh tế và Tính chủ quan yếu (Weak Subjectivity)
Trong các giao thức PoS lai BFT (như Casper FFG của Ethereum), khi một checkpoint gom đủ $$\ge 2/3$$ cổ phần chứng thực, nó đạt **tính chốt khối (finality)** — muốn đảo ngược nó, ít nhất $$1/3$$ tổng cổ phần toàn mạng buộc phải ký mâu thuẫn và bị đốt sạch! Tuy nhiên, vì khóa cũ đã rút hết tiền không còn gì để phạt, một nút mới tham gia mạng lần đầu cần tin vào một "điểm mốc chủ quan gần đây" (weak subjectivity checkpoint) trong vài tuần đổ lại để chống tấn công tầm xa.

---

### Giải thích: tự tay tính xác suất đề xuất khối và chi phí đốt cọc (Slashing) trong Ethereum PoS

Hãy kiểm tra cơ chế kinh tế của Ethereum PoS bằng những con số sát thực tế:

1. **Tần suất đề xuất khối của một validator đặt cọc 32 ETH:**
   - Giả sử toàn mạng có $$S = 32\,000\,000\text{ ETH}$$ đang đặt cọc, chia đều thành $$N = \frac{32\,000\,000}{32} = 1\,000\,000$$ validator.
   - Mỗi slot dài đúng $$12\text{ giây}$$, nên một năm có $$\frac{365 \times 86\,400}{12} = 2\,628\,000\text{ slot}$$.
   - Với xác suất được chọn ở mỗi slot là $$p = \frac{1}{1\,000\,000} = 10^{-6}$$, kỳ vọng số lần validator của bạn được đề xuất khối trong một năm là:
     $$
     \mathbb{E}[\text{khối/năm}] = 2\,628\,000 \times 10^{-6} \approx \mathbf{2.63\text{ khối/năm}}
     $$
     (phần lớn thu nhập ổn định hằng ngày thực ra đến từ nhiệm vụ ký chứng thực *attestation* mỗi 6.4 phút, không chỉ từ đề xuất khối!).
2. **Toán học của Phạt tương quan (Correlated Slashing) chống tấn công 1/3:**
   - Nếu chỉ 1 validator vô tình cấu hình lỗi ký đúp (lỗi kỹ thuật đơn lẻ), hình phạt tương quan gần như bằng 0 (chỉ mất khoản phạt khởi điểm nhỏ khoảng $$1/32$$ cọc) — tránh đẩy người dùng lương thiện phá sản vì sự cố phần mềm.
   - Ngược lại, trong một cuộc tấn công có tổ chức, giả sử tỉ lệ $$\alpha$$ tổng số validator cùng ký mâu thuẫn trong cửa sổ 36 ngày. Công thức phạt tương quan của Ethereum cắt tỉ lệ $$\min(1,\ 3\alpha)$$ số dư đặt cọc!
   - Để phá vỡ tính chốt khối (chốt 2 chuỗi đối nghịch), giao nhau của hai tập đại biểu $$2/3$$ buộc ít nhất **$$\alpha = \frac{1}{3}$$** tổng cổ phần phải ký đúp. Thay $$\alpha = \frac{1}{3}$$ vào công thức phạt:
     $$
     \text{Tỉ lệ bị đốt} = \min\!\Bigl(1,\ 3 \times \frac{1}{3}\Bigr) = \mathbf{100\%}!
     $$
     Toàn bộ **$$\approx 10.67\text{ triệu ETH}$$** của kẻ tấn công lập tức bốc hơi vĩnh viễn!

---

## 1. Tổng quan về khái niệm

**Proof-of-Stake (PoS)** là cơ chế đồng thuận thay thế cho Proof-of-Work (PoW), trong đó các validator được chọn để đề xuất khối dựa trên lượng tiền mã hóa mà họ đặt cọc (stake), thay vì dựa trên năng lực tính toán. Cơ chế này khắc phục nhiều hạn chế của PoW trong khi vẫn duy trì các đảm bảo an ninh cho mạng lưới.

**Ý tưởng cốt lõi — Tài sản đặt cọc làm cơ sở bảo mật**:

Trong PoW, bảo mật dựa trên đầu tư vật lý (phần cứng và điện năng). Trong PoS, bảo mật dựa trên đầu tư kinh tế (lượng tiền mã hóa đặt cọc). Nguyên tắc cơ bản là:

> "Nếu bạn sở hữu 1% tổng lượng tài sản đặt cọc, bạn có xác suất xác thực khoảng 1% số khối và nhận khoảng 1% phần thưởng tương ứng. Nếu bạn tấn công mạng lưới, bạn có nguy cơ mất chính phần tài sản đặt cọc của mình."

**Lịch sử phát triển**:

Khái niệm PoS được đề xuất lần đầu năm **2011** trên diễn đàn Bitcointalk bởi QuantumMechanic. Năm 2012, **Peercoin** trở thành đồng tiền mã hóa đầu tiên triển khai PoS theo mô hình lai PoW/PoS. Từ đó, nhiều biến thể đã ra đời:

- **2012**: Peercoin (lai PoW/PoS)
- **2014**: NXT (PoS thuần túy)
- **2017**: Cardano (giao thức Ouroboros)
- **2020**: Ra mắt Ethereum 2.0 Beacon Chain
- **2022**: Sự kiện "The Merge" của Ethereum — chuyển đổi từ PoW sang PoS

**Vì sao cần Proof-of-Stake?**

PoS giải quyết ba hạn chế chính của PoW:

**1. Hiệu quả năng lượng**:
```
Bitcoin PoW: ~150 TWh/year
Ethereum PoS: ~0.01 TWh/year (~99.95% reduction!)

Environmental impact dramatically reduced
```

**2. Khả năng tiếp cận**:
```
PoW: Need expensive ASIC hardware ($thousands to millions)
PoS: Need only cryptocurrency (can stake from regular computer)

Lower barriers to entry → more decentralization potential
```

**3. Bảo mật kinh tế**:
```
PoW: Attack cost = Hardware + Electricity (can resell hardware)
PoS: Attack cost = Stake (gets slashed/destroyed if caught)

Economic penalty directly hits attacker
```

**Quá trình chuyển đổi — The Merge của Ethereum**:

Việc Ethereum chuyển đổi từ PoW sang PoS vào tháng 9 năm 2022 là một dấu mốc kỹ thuật đáng chú ý trong lĩnh vực blockchain:

- Giá trị mạng lưới: trên 200 tỷ USD
- Chuyển đổi không gián đoạn hoạt động
- Mức tiêu thụ năng lượng giảm 99,95%
- Duy trì tính bảo mật và phi tập trung

Kết quả này cho thấy PoS có thể vận hành ổn định ở quy mô lớn.

**Thay đổi trong mô hình bảo mật**:

Mô hình bảo mật của PoW:
```
Cost to attack = Cost to acquire 51% hash power
Attacker can: Censor transactions, double-spend
Attacker cannot: Steal funds, change protocol rules
```

Mô hình bảo mật của PoS:
```
Cost to attack = Cost to acquire 33-51% of total stake
Attacker can: Censor transactions (temporarily)
Attacker cannot: Steal funds, change rules
Additional penalty: Stake gets slashed (destroyed)
```

Điểm khác biệt chính là kẻ tấn công sẽ bị mất trực tiếp phần vốn đặt cọc nếu hành vi gian lận bị phát hiện.

---

## 2. Hiểu biết trực quan

### 2.1. PoS tương tự cơ chế biểu quyết của cổ đông

Có thể hình dung một blockchain PoS giống như một công ty có các cổ đông:

**Công ty truyền thống**:
```
Own 10% shares → 10% voting power
Company profitable → Receive 10% of dividends
Make bad decisions → Share value decreases
```

**Blockchain PoS**:
```
Stake 10% of tokens → 10% chance to propose next block
Network active → Earn ~10% of transaction fees + rewards
Attack network → Stake destroyed (shareholders lose money!)
```

**Điểm cốt lõi**: Lợi ích kinh tế của validator gắn liền với sự ổn định của mạng lưới; tấn công mạng lưới đồng nghĩa với việc tự làm thiệt hại tài sản của chính mình.

### 2.2. Lựa chọn validator — Xổ số theo trọng số

**Đào khối PoW** (xổ số bằng năng lực tính toán):
```
More hash power = More lottery tickets
Physical resource (electricity) consumed per attempt
Winner: Whoever solves puzzle first
```

**Xác thực PoS** (xổ số theo tài sản đặt cọc):
```
More stake = Higher probability of selection
No physical resource consumed
Winner: Pseudo-randomly selected proportional to stake
```

**Ví dụ**:
```
Total staked: 1,000,000 ETH

Alice stakes: 100,000 ETH (10%)
Bob stakes: 50,000 ETH (5%)
Charlie stakes: 10,000 ETH (1%)

Probability of being selected per slot:
Alice: ~10%
Bob: ~5%
Charlie: ~1%

Over 100 slots:
Alice validates: ~10 blocks
Bob validates: ~5 blocks
Charlie validates: ~1 block
```

Cách phân bổ này tương ứng trực tiếp với mức độ cam kết kinh tế của từng validator.

### 2.3. Slashing — Cơ chế xử phạt

**Vấn đề**: Trong PoS, validator không tiêu tốn tài nguyên vật lý cho mỗi lần tạo khối, nên cần cơ chế ngăn chặn việc thử đồng thời nhiều nhánh gian lận.

**Giải pháp — Slashing**: Cắt giảm hoặc tịch thu tài sản đặt cọc của validator có hành vi gian lận.

```
Good Validator Behavior:
└─ Propose valid blocks
└─ Vote honestly
└─ Stay online
└─ Reward: Earn staking rewards

Bad Validator Behavior:
└─ Double-signing (propose two blocks at same height)
└─ Voting contradictory attestations
└─ Extended downtime
└─ Penalty: Lose portion or all of stake!

Example Penalties (Ethereum):
Minor offense (short downtime): Lose ~0.5% stake
Major offense (double-signing): Lose up to 100% stake
Correlated attack (many validators): Extra penalties!
```

**Liên hệ thực tế**: Cơ chế này tương tự tiền đặt cọc bảo đảm:
- Thực hiện đúng nghĩa vụ sẽ nhận lại tiền cọc kèm phần thưởng.
- Vi phạm quy định sẽ bị khấu trừ hoặc mất toàn bộ tiền cọc.

### 2.4. Vấn đề Nothing-at-Stake

**Vấn đề lý thuyết**:

Trong PoW, thợ đào phải chọn một nhánh duy nhất để khai thác vì mỗi phép thử đều tiêu tốn điện năng. Trong các thiết kế PoS ban đầu, validator có thể biểu quyết đồng thời cho nhiều nhánh mà không tốn thêm chi phí:

```
Chain A: Block at height 100a
         /
Height 99
         \
Chain B: Block at height 100b

PoW Miner: Must choose A or B (electricity cost)
PoS Validator: Why not vote for both? (no cost!)
```

**Giải pháp**:

**1. Slashing đối với hành vi mâu thuẫn (equivocation)**:
```
Vote for multiple chains → Stake destroyed
Makes multi-voting costly
```

**2. Cơ chế tính hoàn tất (finality)**:
```
Once block finalized → Cannot revert
Validators committing to different chains get slashed
```

**3. Tính chủ quan yếu (weak subjectivity)**:
```
New nodes must get recent checkpoint from social consensus
Prevents very long-range attacks
```

Nhờ kết hợp các biện pháp này, vấn đề nothing-at-stake đã được kiểm soát trong các giao thức PoS hiện đại.

---

## 3. Nền tảng kỹ thuật

### 3.1. Đồng thuận Ethereum 2.0 — Gasper (Casper FFG + LMD GHOST)

Ethereum sử dụng **Gasper**, kết hợp hai giao thức:

**Casper FFG (Friendly Finality Gadget)**:
- Cung cấp tính hoàn tất tuyệt đối (không thể đảo ngược).
- Sau mỗi 64–100 slot (khoảng 6–12 phút), các validator bỏ phiếu cho các checkpoint.
- Khi đạt ngưỡng siêu đa số 2/3, checkpoint được hoàn tất (finalized).

**LMD GHOST (Latest Message Driven Greedy Heaviest Observed SubTree)**:
- Chọn chuỗi chính tắc giữa các checkpoint.
- Đi theo cây con có tổng lượng stake biểu quyết cao nhất.

**Cấu trúc thời gian**:
```
Slot: 12 seconds
Epoch: 32 slots = 6.4 minutes

Timeline:
Slot 0 → Slot 1 → ... → Slot 31 (Epoch 0)
Slot 32 → Slot 33 → ... → Slot 63 (Epoch 1)
...

Each slot:
1. One validator selected as proposer
2. Committee of validators attest
3. Block added to chain
```

**Nhiệm vụ của validator**:

**Đề xuất khối** (1 validator mỗi slot):
```python
def propose_block(slot):
    if selected_as_proposer(slot):
        # Collect transactions from mempool
        transactions = select_transactions()
        
        # Create block
        block = Block(
            slot=slot,
            parent_root=get_head(),  # LMD GHOST
            transactions=transactions,
            attestations=collect_attestations()
        )
        
        # Sign and broadcast
        signed_block = sign(block, validator_key)
        broadcast(signed_block)
```

**Chứng thực (Attestation)** (tất cả validator trong ủy ban):
```python
def attest(slot):
    # LMD GHOST vote
    head_vote = get_head()  # Current chain head
    
    # FFG vote
    source_checkpoint = get_justified_checkpoint()
    target_checkpoint = current_epoch_checkpoint()
    
    attestation = Attestation(
        slot=slot,
        head_vote=head_vote,
        source=source_checkpoint,
        target=target_checkpoint
    )
    
    signed = sign(attestation, validator_key)
    broadcast(signed)
```

### 3.2. Thuật toán chọn validator

**Chọn ngẫu nhiên bằng hàm ngẫu nhiên có thể kiểm chứng (VRF)**:

\[
\text{Selected}_{\text{proposer}}(slot, seed) = \text{validators}[\text{VRF}(slot, seed) \mod N]
\]

**Cơ chế RANDAO của Ethereum**:
```python
def compute_randao_mix(epoch):
    """Generate random seed for validator selection"""
    mix = get_randao_mix(epoch - 1)
    
    for slot in range(epoch * 32, (epoch + 1) * 32):
        proposer = get_proposer(slot)
        reveal = get_reveal(proposer, slot)
        mix = hash(mix + reveal)
    
    return mix

def select_proposer(slot, seed):
    """Select block proposer for slot"""
    active_validators = get_active_validators()
    
    # Weighted by effective balance
    total_balance = sum(v.balance for v in active_validators)
    
    random_value = hash(seed + slot) % total_balance
    cumulative = 0
    
    for validator in active_validators:
        cumulative += validator.balance
        if random_value < cumulative:
            return validator
    
    return active_validators[-1]
```

**Các tính chất**:
- **Khó dự đoán trước**: Người đề xuất khối trong tương lai chỉ được xác định sau khi các giá trị RANDAO được công bố.
- **Công bằng**: Xác suất được chọn tỷ lệ thuận với lượng stake hiệu dụng.
- **Kiểm chứng được**: Bất kỳ nút nào cũng có thể kiểm tra tính hợp lệ của kết quả lựa chọn.

### 3.3. Tính hoàn tất — Casper FFG

**Hệ thống checkpoint**:

```
Epoch 0      Epoch 1      Epoch 2      Epoch 3
   C0  --->     C1   --->    C2   --->    C3
   
C0 = Genesis (finalized)
C1 = Justified (2/3 voted)
C2 = Justified
C3 = Not yet justified
```

**Điều kiện hợp thức hóa (Justification)**:
\[
\text{Justified} \iff \frac{\sum \text{Stake voting for checkpoint}}{\text{Total active stake}} \geq \frac{2}{3}
\]

**Điều kiện hoàn tất (Finalization)**:
\[
\text{Finalized}(C_k) \iff \text{Justified}(C_k) \land \text{Justified}(C_{k+1})
\]

**Các điều kiện slashing**:

**1. Biểu quyết kép (Double voting)**:
\[
\text{Slash if: } \exists \text{ two attestations } A_1, A_2 \text{ from same validator where:}
\]
\[
A_1.\text{target} \neq A_2.\text{target} \land A_1.\text{epoch} = A_2.\text{epoch}
\]

**2. Biểu quyết bao trùm (Surround voting)**:
\[
\text{Slash if: } (A_1.\text{source} < A_2.\text{source} < A_2.\text{target} < A_1.\text{target})
\]

**Tính toán mức phạt slashing**:
```python
def calculate_slashing_penalty(validator):
    """Calculate penalty for slashed validator"""
    
    # Base penalty
    base_penalty = validator.effective_balance // 32  # ~3.125%
    
    # Correlation penalty (if many slashed simultaneously)
    total_slashed = sum(v.effective_balance for v in slashed_validators)
    total_balance = sum(v.effective_balance for v in all_validators)
    
    correlation_penalty = (
        validator.effective_balance * 
        total_slashed // total_balance
    )
    
    total_penalty = base_penalty + correlation_penalty
    
    # Maximum: entire stake
    return min(total_penalty, validator.effective_balance)
```

**Phạt tương quan (Correlated Slashing)**: Khi nhiều validator bị phát hiện vi phạm cùng lúc (dấu hiệu tấn công có phối hợp), mức phạt bổ sung sẽ tăng theo tỷ lệ lượng stake bị phạt.

### 3.4. Phần thưởng và hình phạt

**Cấu trúc phần thưởng**:

\[
\text{Base Reward} = \frac{\text{Effective Balance} \times \text{Base Reward Factor}}{\sqrt{\text{Total Active Balance}}}
\]

**Phần thưởng của validator theo mỗi epoch**:
```python
def calculate_rewards(validator, epoch):
    rewards = 0
    
    # 1. Attestation rewards
    if made_timely_attestation():
        rewards += base_reward() * TIMELY_TARGET_WEIGHT
    
    if voted_correct_head():
        rewards += base_reward() * TIMELY_HEAD_WEIGHT
    
    if voted_correct_source():
        rewards += base_reward() * TIMELY_SOURCE_WEIGHT
    
    # 2. Block proposal rewards
    if proposed_block():
        rewards += sum(attestation_rewards_in_block)
    
    # 3. Sync committee rewards (if selected)
    if in_sync_committee():
        rewards += sync_committee_reward()
    
    return rewards
```

**Hình phạt**:
```python
def calculate_penalties(validator, epoch):
    penalties = 0
    
    # 1. Missed attestation
    if not_attested():
        penalties += base_reward() * (TIMELY_TARGET_WEIGHT + 
                                      TIMELY_HEAD_WEIGHT +
                                      TIMELY_SOURCE_WEIGHT)
    
    # 2. Incorrect votes
    if voted_wrong_target():
        penalties += base_reward() * TIMELY_TARGET_WEIGHT
    
    # 3. Inactivity leak (if not finalizing)
    if not finalizing():
        penalties += inactivity_penalty()
    
    return penalties
```

**Tỷ suất lợi nhuận năm (APR)**:

\[
\text{APR} \approx \frac{0.26}{\sqrt{\text{Total Staked ETH (millions)}}} \times 100\%
\]

**Ví dụ**:
```
Total staked: 25 million ETH
APR ≈ 0.26 / √25 × 100% = 0.26 / 5 × 100% = 5.2% per year

Validator with 32 ETH:
Annual reward: 32 × 0.052 = 1.664 ETH
```

### 3.5. Tính chủ quan yếu (Weak Subjectivity)

**Vấn đề**: Tấn công tầm xa (long-range attack).

Kẻ tấn công nắm giữ các khóa validator cũ (từ nhiều tháng hoặc nhiều năm trước) có thể tạo ra một chuỗi giả song song bắt đầu từ khối khởi thủy (genesis):

```
Actual History:
Genesis → ... → Current (Height 1,000,000)

Fake History (attacker's):
Genesis → ... → Fake Current (Height 1,000,000)

New node joining: Which is real?
```

**Giải pháp — Checkpoint chủ quan yếu**:

Các nút mới tham gia mạng lưới cần lấy một checkpoint gần đây thông qua đồng thuận xã hội hoặc nguồn đáng tin cậy:

```python
class WeakSubjectivityCheckpoint:
    def __init__(self):
        self.block_root = "0xabc..."
        self.epoch = 12345
        self.finalized = True
    
    def is_valid_chain(self, chain):
        """Verify chain includes checkpoint"""
        checkpoint_block = chain.get_block(self.epoch)
        
        if checkpoint_block.root != self.block_root:
            return False
        
        if not checkpoint_block.finalized:
            return False
        
        return True
```

**Chu kỳ chủ quan yếu (Weak Subjectivity Period)**:

\[
\text{WS Period} = \frac{\text{MIN\_VALIDATOR\_WITHDRAWABILITY\_DELAY}}{2}
\]

Trên Ethereum, khoảng thời gian này kéo dài khoảng 4–5 tháng. Các nút cần đồng bộ trong phạm vi chu kỳ này, hoặc sử dụng checkpoint từ nguồn tin cậy nếu ngoại tuyến lâu hơn.

---

## 4. Công thức toán học và mật mã học

### 4.1. Ngưỡng bảo mật BFT

Các hệ thống PoS áp dụng cơ chế BFT đạt ngưỡng bảo mật khi:

\[
f < \frac{n}{3}
\]

Trong đó:
- \( n \) là tổng lượng stake.
- \( f \) là lượng stake do tác nhân gian lận kiểm soát.

**Với Ethereum (ngưỡng 2/3)**:

\[
\text{Attack requires: } > \frac{1}{3} \text{ of total stake}
\]

**Ước tính chi phí kinh tế** (năm 2024):
```
Total staked: ~30 million ETH
1/3 stake: ~10 million ETH
ETH price: ~$2,500

Cost to acquire: 10M × $2,500 = $25 billion

Plus: If attack detected, stake gets slashed (destroyed)

Result: Attack economically irrational!
```

### 4.2. Xác suất hoàn tất khối

Xác suất hoàn tất checkpoint phụ thuộc vào tỷ lệ tham gia của các validator:

\[
P(\text{finalize}) = P\left(\sum_{i=1}^{N} X_i \geq \frac{2N}{3}\right)
\]

Trong đó \( X_i \) là biến chỉ thị cho biết validator \( i \) có tham gia biểu quyết hay không.

**Giả sử các validator tham gia độc lập** với xác suất \( p \):

\[
P(\text{finalize}) \approx \Phi\left(\frac{p - 2/3}{\sqrt{p(1-p)/N}}\right)
\]

Trong đó \( \Phi \) là hàm phân phối tích lũy (CDF) của phân phối chuẩn tắc.

**Ví dụ**:
```
N = 500,000 validators
p = 95% participation

P(finalize) ≈ Φ((0.95 - 0.667) / √(0.95 × 0.05 / 500000))
            ≈ Φ(916.5)
            ≈ 0.999999... (essentially certain!)
```

**Cơ chế rò rỉ do không hoạt động (Inactivity Leak)**: Nếu mạng lưới không thể hoàn tất sau 4 epoch liên tiếp:

\[
\text{Penalty per epoch} = k \times \text{Base Reward} \times \frac{\text{Epochs since finality}}{2^{INACTIVITY\_PENALTY\_QUOTIENT}}
\]

Các validator ngừng hoạt động sẽ dần bị khấu trừ stake cho đến khi nhóm validator đang hoạt động lấy lại ngưỡng siêu đa số 2/3.

### 4.3. Phân tích chiến lược tấn công tối ưu

**Bài toán tối ưu của kẻ tấn công**:

\[
\max_{\text{strategy}} \quad E[\text{Profit}] = P(\text{success}) \times \text{Gain} - P(\text{caught}) \times \text{Stake Lost}
\]

Giả sử kẻ tấn công kiểm soát tỷ lệ \( \alpha \) tổng lượng stake trên Ethereum:

**1. Tấn công kiểm duyệt (Censorship Attack)** (chặn một số giao dịch cụ thể):
```
Cost: Opportunity cost of not including transactions
Benefit: Can censor ~α × 100% of blocks

Example: α = 10%
- Can censor ~10% of slots
- Transaction delayed, not prevented (others will include)
- Gain: Minimal
- Cost: Reputation damage, possible slashing
```

**2. Tấn công tổ chức lại chuỗi (Reorg Attack)** (đảo ngược các khối gần đây):
```
Probability of success (simple model):
P(reorg of k blocks) ≈ (α / (1-α))^k

Example: α = 40%, k = 5 blocks
P ≈ (0.4 / 0.6)^5 = 0.131 = 13.1%

If caught: Lose stake
Expected value: 0.131 × Gain - 0.869 × Stake

Typically negative!
```

**3. Tấn công cản trở tính hoàn tất (Finality Attack)**:
```
Requires: α > 1/3 to prevent finality
Cost: Inactivity leak reduces attacker stake over time
Eventually: Attacker stake < 1/3 → Attack fails
```

Xét về mặt kinh tế, cả ba dạng tấn công trên đều gây bất lợi cho tác nhân duy lý.

### 4.4. Kinh tế học của việc đặt cọc (Staking)

**Lợi nhuận kỳ vọng**:

\[
E[\text{Return}] = \text{APR} \times \text{Staked Amount} \times (1 - \text{Penalty Risk})
\]

**Lợi nhuận điều chỉnh theo rủi ro**:

\[
\text{Sharpe Ratio} = \frac{E[\text{Return}] - \text{Risk-Free Rate}}{\sigma(\text{Return})}
\]

**Các yếu tố ảnh hưởng đến lợi nhuận**:

1. **Tổng lượng stake**: Khi tổng lượng stake tăng, APR giảm dần theo quy luật pha loãng:
   \[
   \text{APR} \propto \frac{1}{\sqrt{\text{Total Staked}}}
   \]

2. **Thời gian hoạt động (Uptime)**: Thời gian ngoại tuyến kéo theo hình phạt, làm giảm APR thực tế:
   \[
   \text{Effective APR} = \text{Base APR} \times \text{Uptime \%}
   \]

3. **Rủi ro slashing**: Xác suất xảy ra thấp nhưng tổn thất lớn:
   \[
   E[\text{Loss from slashing}] = P(\text{slash}) \times \text{Stake}
   \]

**Điều kiện quyết định đặt cọc tối ưu**:

\[
\text{Stake if: } E[\text{Staking Return}] > \text{Opportunity Cost (DeFi yield, etc.)}
\]

### 4.5. Động học của tập validator

**Hàng đợi tham gia và rút khỏi mạng (Entry/Exit Queues)**:

Số lượng validator tối đa được kích hoạt trong mỗi epoch:
\[
\text{Max Activations} = \max\left(5, \frac{\text{Total Active Validators}}{65536}\right)
\]

**Thời gian chờ kích hoạt**:
\[
\text{Activation Wait (epochs)} = \frac{\text{Validators in Queue}}{\text{Max Activations per Epoch}}
\]

**Ví dụ**:
```
Current validators: 500,000
Max activations/epoch: max(5, 500000/65536) ≈ 7

Queue: 1000 validators
Wait time: 1000 / 7 ≈ 143 epochs ≈ 15 hours
```

**Phân tích trạng thái cân bằng**:

Ở trạng thái cân bằng, tốc độ tham gia bằng tốc độ rút khỏi mạng:

\[
\lambda_{\text{entry}} = \lambda_{\text{exit}}
\]

Số lượng validator ổn định khi:
\[
\text{APR} \approx \text{Opportunity Cost} + \text{Operational Costs}
\]

---

## 5. Góc nhìn triển khai

### 5.1. Mô phỏng validator PoS đơn giản

```python
import hashlib
import random
import time
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Validator:
    """Proof-of-Stake validator"""
    pubkey: str
    stake: int  # Amount staked
    balance: int  # Current balance
    active: bool = True
    slashed: bool = False
    
    def effective_balance(self) -> int:
        """Effective balance for rewards (capped at 32 ETH)"""
        return min(self.balance, 32 * 10**9)  # 32 ETH in Gwei

@dataclass
class Attestation:
    """Validator attestation (vote)"""
    slot: int
    validator_index: int
    head_vote: str  # Block hash
    source_checkpoint: int
    target_checkpoint: int
    signature: str

@dataclass
class Block:
    """Proof-of-Stake block"""
    slot: int
    proposer_index: int
    parent_root: str
    state_root: str
    transactions: List[Dict]
    attestations: List[Attestation]
    randao_reveal: str
    
    def hash(self) -> str:
        data = f"{self.slot}{self.proposer_index}{self.parent_root}{self.state_root}"
        return hashlib.sha256(data.encode()).hexdigest()

class ProofOfStakeConsensus:
    """Simplified Proof-of-Stake consensus implementation"""
    
    def __init__(self, genesis_validators: List[Validator]):
        self.validators = genesis_validators
        self.chain: List[Block] = []
        self.current_slot = 0
        self.justified_checkpoint = 0
        self.finalized_checkpoint = 0
        
        # Create genesis block
        genesis = Block(
            slot=0,
            proposer_index=0,
            parent_root="0" * 64,
            state_root=self.compute_state_root(),
            transactions=[],
            attestations=[],
            randao_reveal=self.generate_randao()
        )
        self.chain.append(genesis)
    
    def compute_state_root(self) -> str:
        """Compute Merkle root of current state"""
        state_data = "".join(
            f"{v.pubkey}{v.balance}" 
            for v in self.validators if v.active
        )
        return hashlib.sha256(state_data.encode()).hexdigest()
    
    def generate_randao(self) -> str:
        """Generate RANDAO reveal"""
        return hashlib.sha256(
            f"{self.current_slot}{random.random()}".encode()
        ).hexdigest()
    
    def get_total_active_stake(self) -> int:
        """Calculate total stake of active validators"""
        return sum(
            v.effective_balance() 
            for v in self.validators 
            if v.active and not v.slashed
        )
    
    def select_proposer(self, slot: int) -> int:
        """Select block proposer for slot using weighted random selection"""
        active_validators = [
            (i, v) for i, v in enumerate(self.validators)
            if v.active and not v.slashed
        ]
        
        if not active_validators:
            return 0
        
        # Weighted random selection based on stake
        total_stake = sum(v.effective_balance() for _, v in active_validators)
        
        # Pseudo-random selection (deterministic from slot)
        seed = int(hashlib.sha256(f"slot{slot}".encode()).hexdigest(), 16)
        random_value = seed % total_stake
        
        cumulative = 0
        for idx, validator in active_validators:
            cumulative += validator.effective_balance()
            if random_value < cumulative:
                return idx
        
        return active_validators[-1][0]
    
    def create_block(self, slot: int, transactions: List[Dict]) -> Optional[Block]:
        """Create new block for slot"""
        proposer_idx = self.select_proposer(slot)
        proposer = self.validators[proposer_idx]
        
        if not proposer.active or proposer.slashed:
            return None
        
        # Collect recent attestations
        attestations = self.collect_attestations(slot)
        
        block = Block(
            slot=slot,
            proposer_index=proposer_idx,
            parent_root=self.chain[-1].hash(),
            state_root=self.compute_state_root(),
            transactions=transactions,
            attestations=attestations,
            randao_reveal=self.generate_randao()
        )
        
        return block
    
    def collect_attestations(self, slot: int) -> List[Attestation]:
        """Collect attestations from validators"""
        attestations = []
        
        # Each active validator attests
        for idx, validator in enumerate(self.validators):
            if not validator.active or validator.slashed:
                continue
            
            # Simulate attestation with some probability
            if random.random() < 0.95:  # 95% participation
                attestation = Attestation(
                    slot=slot,
                    validator_index=idx,
                    head_vote=self.chain[-1].hash(),
                    source_checkpoint=self.justified_checkpoint,
                    target_checkpoint=slot // 32,  # Epoch
                    signature=f"sig_{idx}_{slot}"
                )
                attestations.append(attestation)
        
        return attestations
    
    def check_finality(self) -> bool:
        """Check if we can finalize checkpoint"""
        current_epoch = self.current_slot // 32
        
        if current_epoch < 2:
            return False
        
        # Count attestations for current epoch
        epoch_attestations = [
            att for block in self.chain
            for att in block.attestations
            if att.target_checkpoint == current_epoch
        ]
        
        # Calculate voting stake
        voting_stake = sum(
            self.validators[att.validator_index].effective_balance()
            for att in epoch_attestations
            if not self.validators[att.validator_index].slashed
        )
        
        total_stake = self.get_total_active_stake()
        
        # Check 2/3 threshold
        if voting_stake >= (2 * total_stake // 3):
            # Justify current epoch
            self.justified_checkpoint = current_epoch
            
            # Finalize previous epoch if it was justified
            if self.justified_checkpoint > self.finalized_checkpoint:
                self.finalized_checkpoint = self.justified_checkpoint - 1
                return True
        
        return False
    
    def advance_slot(self, transactions: List[Dict] = None):
        """Advance blockchain by one slot"""
        self.current_slot += 1
        
        # Create and add new block
        transactions = transactions or []
        block = self.create_block(self.current_slot, transactions)
        
        if block:
            self.chain.append(block)
            
            # Check finality every epoch
            if self.current_slot % 32 == 0:
                finalized = self.check_finality()
                if finalized:
                    print(f"✓ Checkpoint {self.finalized_checkpoint} FINALIZED")
        
        return block
    
    def calculate_rewards(self, validator_idx: int) -> int:
        """Calculate rewards for validator"""
        validator = self.validators[validator_idx]
        
        if not validator.active or validator.slashed:
            return 0
        
        # Base reward (simplified)
        base_reward = validator.effective_balance() // 64  # ~1.56% per year
        
        # Check attestation participation
        recent_attestations = [
            att for block in self.chain[-32:]  # Last epoch
            for att in block.attestations
            if att.validator_index == validator_idx
        ]
        
        # Reward for participation
        if len(recent_attestations) > 0:
            return base_reward
        else:
            return -base_reward // 4  # Penalty for inactivity
    
    def slash_validator(self, validator_idx: int, reason: str):
        """Slash validator for malicious behavior"""
        validator = self.validators[validator_idx]
        
        if validator.slashed:
            return
        
        print(f"⚠️  SLASHING validator {validator_idx}: {reason}")
        
        # Mark as slashed
        validator.slashed = True
        validator.active = False
        
        # Calculate penalty
        base_penalty = validator.effective_balance() // 32  # ~3%
        
        # Correlation penalty (if many slashed)
        total_slashed_stake = sum(
            v.effective_balance()
            for v in self.validators
            if v.slashed
        )
        correlation_penalty = (
            validator.effective_balance() * 
            total_slashed_stake // 
            self.get_total_active_stake()
        )
        
        total_penalty = min(
            base_penalty + correlation_penalty,
            validator.balance
        )
        
        # Deduct from balance
        validator.balance -= total_penalty
        
        print(f"   Penalty: {total_penalty / 10**9:.4f} ETH")
        print(f"   Remaining: {validator.balance / 10**9:.4f} ETH")

# Example usage
if __name__ == "__main__":
    print("=== Proof-of-Stake Simulation ===\n")
    
    # Create validators
    validators = [
        Validator(f"validator_{i}", stake=32*10**9, balance=32*10**9)
        for i in range(100)
    ]
    
    # Initialize PoS consensus
    pos = ProofOfStakeConsensus(validators)
    
    print(f"Total validators: {len(validators)}")
    print(f"Total staked: {pos.get_total_active_stake() / 10**9:.0f} ETH\n")
    
    # Simulate blocks
    print("Simulating blockchain...")
    for i in range(100):  # ~3 epochs
        block = pos.advance_slot()
        
        if block and i % 10 == 0:
            print(f"Slot {block.slot:3d}: "
                  f"Proposer {block.proposer_index:3d}, "
                  f"Attestations: {len(block.attestations):3d}")
    
    print(f"\n=== Final State ===")
    print(f"Chain length: {len(pos.chain)} blocks")
    print(f"Finalized checkpoint: Epoch {pos.finalized_checkpoint}")
    print(f"Justified checkpoint: Epoch {pos.justified_checkpoint}")
    
    # Show some validator rewards
    print(f"\n=== Validator Rewards (sample) ===")
    for i in range(5):
        reward = pos.calculate_rewards(i)
        print(f"Validator {i}: {reward / 10**9:.6f} ETH")
```

---

## Video tham khảo

- **Xem trước:** [Proof of Stake and The Merge: Why, What, How, Wen? - Ethereum Foundation](https://www.youtube.com/watch?v=2xhAGQsF-Ss) — ETHBarcelona, tiếng Anh. Skyler Weaver (Ethereum Foundation) so sánh PoW và PoS, bao gồm cả weak subjectivity; nên xem trước khi đọc phần stake và slashing.
- [POS Nothing At Stake Visually Explained | Episode 15](https://www.youtube.com/watch?v=giHReNiIKZ8) — EatTheBlocks, tiếng Anh. Minh họa trực quan vấn đề nothing-at-stake — lỗ hổng kinh tế dẫn đến cơ chế slashing.
- [\[Updated\] Ethereum PoS: Casper FFG In Depth](https://www.youtube.com/watch?v=uQ3IqLDf-oo) — karl.tech, tiếng Anh. Phân tích sâu Casper FFG, phù hợp khi liên hệ PoS với cơ chế hoàn tất theo checkpoint của Ethereum.
