---
layout: post
title: "Lecture 02.01: Byzantine Fault Tolerant Consensus - PBFT, Tendermint, HotStuff"
chapter: '02'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter02
---

# Bài giảng: Đồng thuận chịu lỗi Byzantine — PBFT, Tendermint, HotStuff

Nếu Bitcoin chấp nhận đợi 60 phút (6 khối) để giao dịch "gần như chắc chắn không bị đảo ngược", thì một sàn giao dịch tài chính hay một chuỗi liên kết như Cosmos lại đòi hỏi điều hoàn toàn khác: **khi khối đã được chốt là chốt vĩnh viễn ngay trong 1–3 giây**, không có khái niệm "chuỗi dài hơn quay lại viết đè quá khứ". Đó chính là thế giới của **đồng thuận chịu lỗi Byzantine cổ điển (BFT)** — dòng họ thuật toán nối dài từ **PBFT (1999)** của Castro–Liskov, qua **Tendermint / CometBFT (2014)**, tới **HotStuff (2019)** (nền tảng của Aptos, Sui và nhiều mạng hiệu năng cao ngày nay).

Sức hấp dẫn của BFT nằm ở **tính chốt khối tất định (deterministic finality)**, nhưng cái giá phải trả lại ẩn trong một bài toán tổ hợp rất thực tế: khi số lượng validator tăng từ 10 lên 1.000, lưu lượng tin nhắn bỏ phiếu chéo giữa các nút phình to theo bình phương $$O(n^2)$$. Cuộc tiến hóa từ PBFT sang HotStuff chính là câu chuyện kỹ thuật tuyệt đẹp về cách kéo độ phức tạp truyền tin từ $$O(n^2)$$ xuống tuyến tính $$O(n)$$.

---

## Bản đồ kiến thức nền: Giao thức đồng thuận BFT đứng trên ba trụ cột nào?

### 1. Tập đại biểu (Quorum) $$2f + 1$$ và Khóa an toàn hai vòng (Two-Phase Locking)
Tại sao các giao thức BFT như PBFT và Tendermint không chỉ bỏ phiếu 1 vòng mà bắt buộc phải bỏ phiếu **2 vòng liên tiếp** (Prepare/Prevote rồi Commit/Precommit)? Vòng 1 bảo đảm mọi nút biết rằng một khối cụ thể đã đạt quá $$2/3$$ ủng hộ ở vòng hiện tại; vòng 2 bảo đảm rằng **đa số các nút trung thực đều biết rằng các nút khác cũng đã biết điều đó** — tạo thành "khóa" (lock) ngăn không cho vòng sau (View Change) vô tình đề xuất một khối mâu thuẫn!

### 2. Chuyển đổi Lãnh đạo (View Change) và Đảm bảo Liveness
Trong mọi giao thức BFT có Leader đề xuất khối, điều gì xảy ra nếu Leader hiện tại bị sập nguồn hoặc cố tình im lặng? Đồng hồ đếm ngược (timeout) sẽ kích hoạt pha **View Change** để bầu Leader kế tiếp. Điểm khó nhất của PBFT là pha View Change có độ phức tạp truyền tin lên tới $$O(n^3)$$ — và chính **HotStuff** đã bổ sung thêm một pha bỏ phiếu gọn nhẹ (3 pha nối tiếp) để biến cả quy trình bình thường lẫn View Change về cùng độ phức tạp tuyến tính $$O(n)$$!

### 3. Chữ ký ngưỡng (Threshold Signatures) và Đường ống (Pipelining)
Thay vì để từng nút phát tán chữ ký của mình tới toàn bộ $$n - 1$$ nút còn lại (tạo ra $$n(n-1)$$ gói tin), các giao thức BFT hiện đại gom $$2f + 1$$ phiếu tại Leader thành một **Chứng chỉ Đại biểu (Quorum Certificate — QC)** có kích thước hằng số $$O(1)$$ bằng chữ ký gộp BLS/ngưỡng, đồng thời chạy gối đầu các khối theo kiểu đường ống (pipeline) giống CPU hiện đại!

---

### Khung giải thích: tự tay so sánh lưu lượng thông điệp giữa PBFT ($$O(n^2)$$) và HotStuff ($$O(n)$$) (nên đọc chậm)

Hãy tính trực tiếp số gói tin cần truyền đi để chốt **đúng 1 khối** khi mạng có $$n = 100$$ và $$n = 1\,000$$ validator:

1. **Trường hợp PBFT (kiến trúc phát tán toàn mạng — all-to-all):**
   - Pha *Pre-Prepare*: Leader gửi khối tới $$n - 1$$ nút → tốn $$n - 1$$ tin.
   - Pha *Prepare*: Mỗi nút trong $$n$$ nút phát tán phiếu `PREPARE` tới $$n - 1$$ nút kia → tốn $$n(n - 1)$$ tin.
   - Pha *Commit*: Mỗi nút trong $$n$$ nút phát tán phiếu `COMMIT` tới $$n - 1$$ nút kia → tốn $$n(n - 1)$$ tin.
   - **Tổng số thông điệp/khối:** $$M_{\text{PBFT}}(n) = (n - 1) + 2n(n - 1) = (2n + 1)(n - 1)$$.
     - Với $$n = 100$$: $$M_{\text{PBFT}}(100) = 201 \times 99 = \mathbf{19\,899\text{ tin}}$$.
     - Với $$n = 1\,000$$: $$M_{\text{PBFT}}(1\,000) = 2\,001 \times 999 = \mathbf{1\,998\,999\text{ tin}}$$ (gần 2 triệu gói tin chỉ để chốt 1 khối!).
2. **Trường hợp HotStuff (kiến trúc hình sao với Chứng chỉ Đại biểu QC):**
   - Ở mỗi pha (Prepare, Pre-Commit, Commit): Leader gửi 1 gói QC tới $$n - 1$$ nút, rồi $$n - 1$$ nút gửi phiếu ký ngược về Leader → mỗi pha tốn đúng $$2(n - 1)$$ tin!
   - **Tổng số thông điệp/khối (3 pha):** $$M_{\text{HotStuff}}(n) = 6(n - 1)$$.
     - Với $$n = 100$$: $$M_{\text{HotStuff}}(100) = 6 \times 99 = \mathbf{594\text{ tin}}$$ (nhẹ hơn PBFT **33 lần**!).
     - Với $$n = 1\,000$$: $$M_{\text{HotStuff}}(1\,000) = 6 \times 999 = \mathbf{5\,994\text{ tin}}$$ (nhẹ hơn PBFT **hơn 333 lần**!).
3. **Đánh đổi cần nhớ:** HotStuff tiết kiệm băng thông ngoạn mục nhưng đổi lại tăng thêm 1 chặng khứ hồi mạng (độ trễ thêm 1 vòng) và đặt tải tổng hợp lên Leader — đó là lý do các hệ thống thực tế chạy HotStuff theo kiểu *pipelining* (khối $$k+1$$ đồng thời mang chứng chỉ xác nhận cho khối $$k$$) để vừa đạt băng thông tuyến tính vừa giữ thông lượng cao!

---

## 1. Tổng quan về khái niệm

**Đồng thuận chịu lỗi Byzantine (Byzantine Fault Tolerant — BFT)** là một nhóm giao thức cho phép hệ thống phân tán đạt được sự thống nhất ngay cả khi một số nút gặp lỗi tùy ý hoặc hành động gian lận. Đây là nền tảng cho nhiều cơ chế đồng thuận blockchain hiện đại, đặc biệt trong các mạng có cấp phép (permissioned) và các mạng hiệu năng cao.

**Bài toán các vị tướng Byzantine**:

Bài toán được **Leslie Lamport, Robert Shostak và Marshall Pease** hình thức hóa vào năm 1982 qua kịch bản sau:

> Một nhóm tướng lĩnh Byzantine bao vây một thành phố và phải thống nhất quyết định tấn công hay rút lui. Họ liên lạc với nhau thông qua các sứ giả. Một số tướng có thể là kẻ phản bội và gửi những thông điệp mâu thuẫn nhau. Làm thế nào để các tướng trung thành vẫn đạt được cùng một quyết định?

**Phát biểu hình thức**:
- Gồm \( n \) tiến trình (các vị tướng).
- Tối đa \( f \) tiến trình có thể là Byzantine (kẻ phản bội).
- Mỗi tiến trình có một giá trị đầu vào.
- Mục tiêu: mọi tiến trình trung thực đều thống nhất trên cùng một giá trị đầu ra.

**Điều kiện cần**: Bài toán chỉ có lời giải khi:

\[
n \geq 3f + 1
\]

Nói cách khác, mạng lưới cần ít nhất 2/3 số nút trung thực.

**Ý nghĩa đối với blockchain**:

Trong bối cảnh blockchain:
- **Các nút = Các vị tướng**: Các validator hoặc thợ đào phân tán.
- **Nút Byzantine = Kẻ tấn công**: Các validator gian lận tìm cách phá hoại mạng.
- **Thống nhất = Đồng thuận**: Mọi nút trung thực đồng ý về cùng một thứ tự giao dịch.
- **Thông điệp = Khối và phiếu bầu**: Dữ liệu trao đổi giữa các nút.

Các giao thức BFT cung cấp **tính hoàn tất tất định** (khác với tính hoàn tất xác suất của PoW) và **thông lượng cao** (hàng nghìn giao dịch mỗi giây), phù hợp với blockchain doanh nghiệp và nhiều mạng công khai hiệu năng cao.

**Quá trình phát triển của các giao thức BFT**:

- **1982**: Hình thức hóa bài toán các vị tướng Byzantine.
- **1999**: **PBFT (Practical Byzantine Fault Tolerance)** — thuật toán BFT thực tế đầu tiên.
- **2014**: **Tendermint** — đưa BFT vào blockchain công khai.
- **2018**: **HotStuff** — đơn giản hóa BFT với độ phức tạp truyền thông tuyến tính.
- **2019**: **LibraBFT** (sau đổi tên thành DiemBFT) — cơ chế đồng thuận blockchain do Facebook đề xuất.
- **Từ 2020 trở đi**: Tiếp tục có nhiều cải tiến và tối ưu hóa về độ trễ và băng thông.

**So sánh với PoW và PoS**:

| Đặc điểm | PoW | PoS | BFT |
|---------|-----|-----|-----|
| Tính hoàn tất | Xác suất | Xác suất/Tuyệt đối | Tuyệt đối |
| Thông lượng | Thấp (~7 TPS) | Trung bình (~1000 TPS) | Cao (~10k TPS) |
| Năng lượng | Rất cao | Thấp | Thấp |
| Độ trễ | Vài phút | Vài giây | Dưới 1 giây |
| Cấp phép (Permissioned) | Không | Không | Có/Không |
| Ngưỡng chịu lỗi | 51% | 33% | 33% |

BFT đặc biệt phù hợp trong các hệ thống cần:
- **Hoàn tất nhanh**: Tính bằng giây thay vì phút.
- **Thông lượng cao**: Hàng nghìn TPS.
- **Tính hoàn tất tất định**: Không xảy ra tổ chức lại chuỗi (chain reorganization).
- **Tập validator xác định**: Các mạng doanh nghiệp hoặc liên minh (consortium).

---

## 2. Hiểu biết trực quan

### 2.1. Minh họa bài toán các vị tướng Byzantine

Xét 4 vị tướng cùng bao vây một pháo đài:

```
        General A (Commander)
              |
    ----------+-----------
    |         |          |
General B  General C  General D
              
Commander's order: "ATTACK at dawn!"
```

**Kịch bản 1: Không có kẻ phản bội** ✓
```
A sends: ATTACK → B, C, D
B receives: ATTACK, forwards to C, D
C receives: ATTACK, forwards to B, D  
D receives: ATTACK, forwards to B, C

All see: 4 votes for ATTACK
Decision: ATTACK unanimously
```

**Kịch bản 2: Chỉ huy là kẻ phản bội** ✗
```
A sends: ATTACK → B
A sends: RETREAT → C
A sends: ATTACK → D

B, C, D exchange messages:
- B and D heard: ATTACK
- C heard: RETREAT

Without BFT protocol: Conflict! Some attack, some retreat
With BFT protocol: Detect inconsistency, use backup plan
```

**Kịch bản 3: Một cấp dưới là kẻ phản bội** ✗
```
A sends: ATTACK → B, C, D (honest)

B (traitor) forwards:
- To C: "A said RETREAT"
- To D: "A said ATTACK"

C and D confused!

Solution (PBFT approach):
- Require 2f+1 matching messages
- With 4 generals (n=4), tolerate f=1
- Need 3 matching messages
- A's original + D's forward + C's forward = 3 ATTACK
- B's lie isolated → ATTACK decided
```

### 2.2. Giao thức 3 pha của PBFT — Ví dụ nhà hàng

Có thể hình dung PBFT giống như việc gọi món trong một nhà hàng mà một số nhân viên phục vụ có thể không đáng tin cậy:

**Pha 1: PRE-PREPARE (Nhận đơn)**
```
Head waiter (primary): Takes customer order
Announces to all waiters: "Table 5 wants Pizza"
Other waiters hear the order
```

**Pha 2: PREPARE (Xác nhận)**
```
Each waiter confirms they heard: "I confirm: Table 5 wants Pizza"
Broadcast confirmation to all other waiters
Need 2f+1 confirmations to proceed (quorum)

Why? Some waiters might be lying!
With enough confirmations, truth emerges
```

**Pha 3: COMMIT (Thực thi)**
```
Once 2f+1 confirmations received:
Each waiter commits: "I will deliver Pizza to Table 5"
Broadcast commit message
Once 2f+1 commits received: Actually deliver pizza

Why second round? Ensure everyone knows everyone else knows
(Common knowledge problem)
```

Nhờ hai vòng xác nhận này, khách hàng vẫn nhận đúng món ngay cả khi có một số nhân viên gian dối.

### 2.3. Chuyển đổi góc nhìn (View Change) — Luân chuyển nút chính

**Vấn đề**: Điều gì xảy ra nếu nút chính (primary) gặp sự cố hoặc hành động gian lận?

**Giải pháp — View Change**: Luân chuyển vai trò nút chính sang một nút khác.

```
Normal Operation (View 0):
Primary = Node 0
  0 → 1, 2, 3 (PRE-PREPARE)
  All nodes exchange PREPARE
  All nodes exchange COMMIT
  ✓ Block committed

Primary Fails (View 0):
Primary = Node 0 (crashes!)
  0 → X (no PRE-PREPARE)
  Timeout!
  
View Change (View 1):
Nodes detect timeout
New primary = Node 1 (round-robin)
  Resume from last checkpoint
  Continue operation
```

**Liên hệ thực tế**: Tương tự một cuộc họp khi chủ tọa vắng mặt, phó chủ tọa sẽ tiếp quản để cuộc họp tiếp tục mà không có điểm lỗi đơn lẻ.

### 2.4. Giao nhau của các tập quorum — Nguyên lý cốt lõi

**Vì sao cần \( 2f + 1 \) phiếu thay vì đa số quá bán thông thường?**

**Tính chất cốt lõi**: Hai tập quorum bất kỳ luôn giao nhau tại ít nhất \( f + 1 \) nút.

```
Total nodes: n = 3f + 1 = 10 (f = 3)
Quorum size: 2f + 1 = 7

Quorum 1: Nodes {0,1,2,3,4,5,6}
Quorum 2: Nodes {3,4,5,6,7,8,9}

Intersection: {3,4,5,6} = 4 nodes

At least 1 node (4 - 3 = 1) must be honest!
```

**Đảm bảo**: Không thể tồn tại hai quyết định mâu thuẫn nhau mà cả hai đều đạt đủ số phiếu quorum:

```
Decision A gets 7 votes (Quorum 1)
Decision B gets 7 votes (Quorum 2)

Impossible! They share 4 nodes.
If one is honest, it can't vote for both.
Contradiction!
```

Tính chất toán học này đảm bảo **tính an toàn (safety)** — không xảy ra hai lần cam kết mâu thuẫn ở cùng một vị trí.

---

## 3. Nền tảng kỹ thuật

### 3.1. Thuật toán PBFT — Chi tiết giao thức

**Mô hình hệ thống**:
- Gồm \( n = 3f + 1 \) bản sao (replica).
- Mạng bất đồng bộ nhưng thông điệp cuối cùng sẽ được truyền tới đích (eventual delivery).
- Máy khách (client) gửi yêu cầu tới nút chính (primary).
- Nút chính phát tán yêu cầu tới tất cả các bản sao còn lại.

**Các loại thông điệp**:

1. **REQUEST**: Client → Primary
   ```
   <REQUEST, operation, timestamp, client_id>
   ```

2. **PRE-PREPARE**: Primary → Replicas
   ```
   <PRE-PREPARE, view, sequence, digest(request)>_primary_sig
   ```

3. **PREPARE**: Replica → Tất cả Replicas
   ```
   <PREPARE, view, sequence, digest, replica_id>_replica_sig
   ```

4. **COMMIT**: Replica → Tất cả Replicas
   ```
   <COMMIT, view, sequence, digest, replica_id>_replica_sig
   ```

5. **REPLY**: Replicas → Client
   ```
   <REPLY, view, timestamp, client_id, replica_id, result>_replica_sig
   ```

**Luồng xử lý của giao thức**:

**Pha 0: Yêu cầu (Request)**
```python
client.send_request(operation):
    request = REQUEST(operation, timestamp, client_id)
    send_to_primary(request)
```

**Pha 1: Pre-Prepare**
```python
primary.receive_request(request):
    if is_valid(request):
        sequence = next_sequence_number()
        digest = hash(request)
        
        pre_prepare = PRE_PREPARE(view, sequence, digest)
        sign(pre_prepare, primary_key)
        
        broadcast_to_replicas(pre_prepare)
        log(pre_prepare)
```

**Pha 2: Prepare**
```python
replica.receive_pre_prepare(pre_prepare):
    if is_valid(pre_prepare) and not_duplicate(pre_prepare):
        prepare = PREPARE(view, sequence, digest, replica_id)
        sign(prepare, replica_key)
        
        broadcast_to_replicas(prepare)
        log(prepare)
        
        # Wait for 2f matching PREPARE messages
        if count_matching_prepares() >= 2*f:
            enter_prepared_state(sequence)
```

**Pha 3: Commit**
```python
replica.enter_prepared_state(sequence):
    commit = COMMIT(view, sequence, digest, replica_id)
    sign(commit, replica_key)
    
    broadcast_to_replicas(commit)
    log(commit)
    
    # Wait for 2f+1 matching COMMIT messages
    if count_matching_commits() >= 2*f + 1:
        execute_operation(sequence)
        send_reply_to_client()
```

**Chứng chỉ đã chuẩn bị (Prepared Certificate)**:

Một bản sao chuyển sang trạng thái "prepared" khi thu thập đủ:
- 1 thông điệp PRE-PREPARE hợp lệ từ nút chính.
- \( 2f \) thông điệp PREPARE khớp nhau từ các bản sao khác nhau.

**Chứng chỉ đã cam kết (Committed Certificate)**:

Một bản sao chuyển sang trạng thái "committed" khi có:
- Chứng chỉ Prepared, cộng thêm
- \( 2f + 1 \) thông điệp COMMIT khớp nhau.

**Các đảm bảo đúng đắn**:

- **Tính an toàn (Safety)**: Nếu một bản sao trung thực cam kết thao tác ở số thứ tự \( n \), không có bản sao trung thực nào khác cam kết một thao tác khác ở cùng số thứ tự \( n \).
- **Tính sống (Liveness)**: Mọi yêu cầu hợp lệ từ máy khách trung thực cuối cùng đều được thực thi.

### 3.2. Đồng thuận Tendermint

**Tendermint** (2014, Jae Kwon) điều chỉnh mô hình BFT cho blockchain công khai với cơ chế **luân chuyển người đề xuất** và **tính hoàn tất tức thì**.

**Các điểm cải tiến chính**:
1. **Biểu quyết theo trọng số**: Các validator có quyền biểu quyết khác nhau dựa trên lượng stake (PoS).
2. **Hoàn tất tức thì**: Khối được hoàn tất ngay sau khi cam kết, không cần chờ xác suất như PoW.
3. **Tách biệt tầng ứng dụng**: Tầng đồng thuận hoạt động độc lập với logic ứng dụng.

**Các vòng đồng thuận**:

```
Round Structure:
1. PROPOSE: Proposer broadcasts block
2. PREVOTE: Validators vote on proposal
3. PRECOMMIT: Validators commit to vote
4. COMMIT: Block finalized if 2/3+ precommit
```

**Máy trạng thái**:

```
        NewHeight
            ↓
         Propose ←──────┐
            ↓           │
         Prevote        │
            ↓           │
    (wait for 2/3)     │
            ↓           │
        Precommit      │
            ↓           │
    (wait for 2/3)     │
            ↓           │
         Commit         │
            ↓           │
            └───────────┘
```

**Thuật toán chi tiết**:

```python
class TendermintConsensus:
    def __init__(self, validators):
        self.validators = validators  # Weighted validator set
        self.height = 0
        self.round = 0
        self.step = "propose"
        self.locked_value = None
        self.locked_round = -1
        self.valid_value = None
        self.valid_round = -1
    
    def propose_step(self):
        """Proposer broadcasts block proposal"""
        if is_proposer(self.height, self.round):
            proposal = create_proposal(
                height=self.height,
                round=self.round,
                value=self.valid_value or select_value(),
                valid_round=self.valid_round
            )
            broadcast(proposal)
        
        schedule_timeout(TimeoutPropose)
        self.step = "prevote"
    
    def prevote_step(self):
        """Validators prevote on proposal"""
        proposal = get_proposal(self.height, self.round)
        
        if proposal and is_valid(proposal):
            if self.locked_value is None or \
               self.locked_value == proposal.value or \
               proposal.valid_round > self.locked_round:
                prevote = create_prevote(
                    height=self.height,
                    round=self.round,
                    value=proposal.value
                )
            else:
                # Locked on different value
                prevote = create_prevote(nil)
        else:
            prevote = create_prevote(nil)
        
        broadcast(prevote)
        schedule_timeout(TimeoutPrevote)
        self.step = "precommit"
    
    def precommit_step(self):
        """Validators precommit if 2/3+ prevoted"""
        prevotes = get_prevotes(self.height, self.round)
        
        if has_supermajority(prevotes, value):
            # Received 2/3+ prevotes for same value
            if self.locked_round < self.round:
                self.locked_value = value
                self.locked_round = self.round
            
            self.valid_value = value
            self.valid_round = self.round
            
            precommit = create_precommit(
                height=self.height,
                round=self.round,
                value=value
            )
        else:
            precommit = create_precommit(nil)
        
        broadcast(precommit)
        schedule_timeout(TimeoutPrecommit)
    
    def commit_step(self):
        """Commit if 2/3+ precommitted same value"""
        precommits = get_precommits(self.height, self.round)
        
        if has_supermajority(precommits, value):
            # Finalize block
            finalize_block(value)
            
            # Move to next height
            self.height += 1
            self.round = 0
            self.locked_value = None
            self.locked_round = -1
            self.valid_value = None
            self.valid_round = -1
            
            self.step = "propose"
            self.propose_step()
    
    def timeout_propose(self):
        """Timeout waiting for proposal"""
        prevote = create_prevote(nil)
        broadcast(prevote)
        self.step = "prevote"
    
    def timeout_prevote(self):
        """Timeout waiting for prevotes"""
        precommit = create_precommit(nil)
        broadcast(precommit)
        self.step = "precommit"
    
    def timeout_precommit(self):
        """Timeout waiting for precommits - go to next round"""
        self.round += 1
        self.step = "propose"
        self.propose_step()
```

**Cơ chế khóa (Locking)**:

Tendermint sử dụng cơ chế khóa để ngăn vi phạm tính an toàn:
- Validator khóa vào một giá trị sau khi thấy siêu đa số 2/3 prevote cho giá trị đó.
- Validator không thể prevote cho giá trị khác trừ khi xuất hiện một vòng hợp lệ (valid round) cao hơn.
- Cơ chế này ngăn validator dao động qua lại giữa các khối mâu thuẫn nhau.

**Khả năng quy trách nhiệm (Accountability)**:

Tendermint hỗ trợ truy vết phân nhánh (fork accountability): nếu từ 1/3 validator trở lên gian lận gây phân nhánh, mạng lưới có bằng chứng mật mã để xác định các bên vi phạm.

### 3.3. HotStuff — Độ phức tạp truyền thông tuyến tính

**HotStuff** (2018, VMware Research) đơn giản hóa BFT và giảm độ phức tạp thông điệp xuống tuyến tính \( O(n) \) thay vì \( O(n^2) \).

**Điểm cốt lõi — Quy tắc cam kết chuỗi 3 khối (Three-Chain Commit Rule)**:

```
Block chain:
b1 ← b2 ← b3 ← b4

Commit rule:
If b1, b2, b3 consecutive và each has 2/3+ votes
→ b1 is committed (finalized)

Three-phase commit compressed into chain structure!
```

**Các pha của giao thức**:

**Pha 1: PREPARE**
```
Leader proposes block b
Replicas vote: PREPARE(b)
If 2/3+ votes → QC(PREPARE, b)
```

**Pha 2: PRE-COMMIT**
```
Leader broadcasts QC(PREPARE, b)
Replicas vote: PRE-COMMIT(b)
If 2/3+ votes → QC(PRE-COMMIT, b)
```

**Pha 3: COMMIT**
```
Leader broadcasts QC(PRE-COMMIT, b)
Replicas vote: COMMIT(b)
If 2/3+ votes → QC(COMMIT, b)
```

**Pha 4: DECIDE**
```
Leader broadcasts QC(COMMIT, b)
Replicas finalize b
```

**Tối ưu hóa Chained HotStuff**:

Thay vì tách rời 4 pha tường minh cho mỗi khối, Chained HotStuff lồng ghép các pha trên chuỗi khối liên tiếp:

```
Block k:     PREPARE phase for k, PRE-COMMIT for k-1
Block k+1:   PREPARE for k+1, PRE-COMMIT for k, COMMIT for k-1
Block k+2:   PREPARE for k+2, PRE-COMMIT for k+1, COMMIT for k, DECIDE k-1

Result: Block k-1 finalized when k+2 produced!
3-block latency for finality
```

**Thuật toán**:

```python
class HotStuffConsensus:
    def __init__(self, replicas, id):
        self.replicas = replicas
        self.id = id
        self.view = 0
        self.vheight = 0  # Highest voted height
        self.bexec = None  # Last executed block
        self.block = None  # Locked block
        self.qc_high = None  # Highest QC seen
    
    def on_propose(self, block, qc):
        """Receive proposal from leader"""
        if not self.is_safe(block, qc):
            return
        
        # Vote for block
        vote = Vote(
            view=self.view,
            block=block.hash,
            replica=self.id
        )
        sign(vote, self.private_key)
        
        send_to_leader(vote)
        
        # Update state
        self.vheight = max(self.vheight, block.height)
        
        # Check for commit
        self.update(qc)
    
    def is_safe(self, block, qc):
        """Safety predicate - can we vote?"""
        # Block extends from qc_high
        return (block.parent == qc.block and
                qc.view >= self.qc_high.view)
    
    def update(self, qc):
        """Update state based on QC"""
        if qc.view > self.qc_high.view:
            self.qc_high = qc
            self.block = qc.block
        
        # Three-chain commit rule
        b1 = qc.block
        b2 = b1.parent
        b3 = b2.parent
        
        if b1.height > b2.height > b3.height and \
           consecutive(b1, b2, b3):
            # Commit b3 and all ancestors
            self.commit(b3)
    
    def commit(self, block):
        """Finalize block"""
        if block.height > self.bexec.height:
            # Commit all blocks from bexec to block
            path = get_path(self.bexec, block)
            for b in path:
                execute(b)
            self.bexec = block
    
    def as_leader(self):
        """Leader proposes new block"""
        # Create block extending from qc_high
        block = Block(
            parent=self.qc_high.block,
            height=self.qc_high.block.height + 1,
            qc=self.qc_high,
            transactions=select_transactions()
        )
        
        # Broadcast proposal
        for replica in self.replicas:
            send(replica, Proposal(block, self.qc_high))
        
        # Collect votes
        votes = collect_votes(timeout=DELTA)
        
        if len(votes) >= 2*f + 1:
            # Form QC
            qc = QuorumCertificate(
                view=self.view,
                block=block.hash,
                votes=votes
            )
            
            # Continue to next view
            self.view += 1
            self.as_leader()
```

**Độ phức tạp thông điệp**:

| Giao thức | Số thông điệp cho mỗi quyết định |
|----------|----------------------------------|
| PBFT | \( O(n^2) \) — trao đổi toàn bộ (all-to-all) |
| Tendermint | \( O(n^2) \) — trao đổi toàn bộ (all-to-all) |
| HotStuff | \( O(n) \) — gom qua nút dẫn đầu (all-to-leader) |

Nhờ gom phiếu qua nút dẫn đầu, HotStuff giảm đáng kể yêu cầu về băng thông mạng.

---

## 4. Công thức toán học và mật mã học

### 4.1. Định lý bất khả thi FLP (Byzantine Agreement Impossibility)

**Kết quả bất khả thi Fischer–Lynch–Paterson (FLP)** (1985):

Trong một hệ thống bất đồng bộ có dù chỉ một tiến trình gặp lỗi (crash), không tồn tại thuật toán tất định nào đảm bảo luôn đạt được đồng thuận.

**Phát biểu hình thức**:

- Hệ thống: \( n \) tiến trình, tối đa \( f = 1 \) tiến trình có thể gặp sự cố.
- Mạng: Bất đồng bộ (không có cận trên cho độ trễ truyền tin).
- Yêu cầu kết thúc (Termination): Mọi tiến trình đúng cuối cùng phải đưa ra quyết định.

<div class="textbook-theorem" markdown="1">
**Định lý**: Không tồn tại thuật toán tất định nào đồng thời đảm bảo cả tính an toàn và tính kết thúc trong mạng bất đồng bộ hoàn toàn.
</div>

**Phác thảo chứng minh**:

1. Giả sử tồn tại thuật toán \( A \) thỏa mãn cả tính an toàn và tính kết thúc.
2. Xét cấu hình ban đầu \( C_0 \) khi các tiến trình chưa đưa ra quyết định.
3. Xét hai giá trị quyết định có thể là 0 và 1.
4. Phải tồn tại một cấu hình "lưỡng trị" (bivalent), từ đó cả hai kết quả đều có thể xảy ra.
5. Chứng minh rằng mọi cấu hình lưỡng trị đều có một cấu hình kế tiếp cũng lưỡng trị.
6. Thuật toán có thể duy trì ở trạng thái lưỡng trị vô hạn và không bao giờ kết thúc.

**Hệ quả đối với BFT**:

Các giao thức BFT vượt qua giới hạn FLP bằng một hoặc kết hợp các cách sau:
1. **Nới lỏng giả định bất đồng bộ**: Giả định tính đồng bộ từng phần (partial synchrony — sau một thời điểm nào đó độ trễ mạng có cận trên).
2. **Ngẫu nhiên hóa**: Đảm bảo kết thúc theo xác suất.
3. **Bộ phát hiện lỗi**: Sử dụng cơ chế hết giờ (timeout) để nghi ngờ nút gặp sự cố.

### 4.2. Chứng minh tính giao nhau của quorum

<div class="textbook-theorem" markdown="1">
**Định lý**: Với \( n = 3f + 1 \) nút và kích thước quorum \( Q = 2f + 1 \), hai tập quorum bất kỳ luôn giao nhau tại ít nhất \( f + 1 \) nút.
</div>

**Chứng minh**:

Gọi \( Q_1, Q_2 \) là hai tập quorum bất kỳ.

\[
\begin{align}
|Q_1 \cap Q_2| &= |Q_1| + |Q_2| - |Q_1 \cup Q_2| \\
&\geq |Q_1| + |Q_2| - n \\
&= (2f + 1) + (2f + 1) - (3f + 1) \\
&= 4f + 2 - 3f - 1 \\
&= f + 1
\end{align}
\]

Vì có tối đa \( f \) nút Byzantine:

\[
\text{Honest nodes in intersection} \geq (f + 1) - f = 1
\]

Như vậy, phần giao luôn chứa ít nhất một nút trung thực.

**Hệ quả về tính an toàn**:

Không thể tồn tại hai lần cam kết mâu thuẫn:
- Quorum \( Q_1 \) cam kết giá trị \( v_1 \).
- Quorum \( Q_2 \) cam kết giá trị \( v_2 \neq v_1 \).

Điều này dẫn đến mâu thuẫn vì nút trung thực nằm trong phần giao không thể bỏ phiếu cho cả hai giá trị khác nhau.

### 4.3. Phân tích độ phức tạp của PBFT

**Độ phức tạp thông điệp cho mỗi yêu cầu**:

| Pha | Thông điệp | Tổng số |
|-------|----------|-------|
| REQUEST | 1 (client → primary) | 1 |
| PRE-PREPARE | 1 (primary → \( n-1 \)) | \( n-1 \) |
| PREPARE | \( n \times (n-1) \) | \( n(n-1) \) |
| COMMIT | \( n \times (n-1) \) | \( n(n-1) \) |
| REPLY | \( n \) (replicas → client) | \( n \) |

**Tổng cộng**: \( O(n^2) \) thông điệp.

**Độ phức tạp tính toán**:

Mỗi thông điệp cần được xác minh chữ ký số:
- Xác minh một chữ ký số: \( O(1) \) trên mỗi thông điệp.
- Tổng số lượt xác minh: \( O(n^2) \).

**Độ trễ**:

Giả sử độ trễ truyền mạng một chiều là \( \delta \):

\[
\text{Latency} = 4\delta + \text{processing time}
\]

- PRE-PREPARE: \( \delta \)
- PREPARE: \( \delta \)
- COMMIT: \( \delta \)
- REPLY: \( \delta \)

**Thông lượng**:

Khi áp dụng kỹ thuật đường ống (pipelining):

\[
\text{Throughput} \approx \frac{1}{\text{processing time per request}}
\]

Trên phần cứng hiện đại, PBFT có thể xử lý khoảng 10.000 yêu cầu mỗi giây.

### 4.4. Phân tích tính an toàn của Tendermint

**Tính chất an toàn**: Nếu tập validator có tổng quyền biểu quyết là \( V \) và nhóm validator Byzantine nắm giữ quyền biểu quyết \( B < V/3 \), tính an toàn được đảm bảo.

**Phác thảo chứng minh**:

Giả sử có hai khối mâu thuẫn cùng được cam kết tại chiều cao \( h \):
- Khối \( b_1 \) được cam kết với hơn \( 2V/3 \) quyền biểu quyết.
- Khối \( b_2 \neq b_1 \) được cam kết với hơn \( 2V/3 \) quyền biểu quyết.

Phần giao của hai tập quorum có tổng quyền biểu quyết lớn hơn \( V/3 \).

Vì \( B < V/3 \), tổng quyền biểu quyết trung thực trong phần giao là:
\[
\text{Honest in intersection} > \frac{V}{3} - B > 0
\]

Điều đó có nghĩa ít nhất một validator trung thực đã bỏ phiếu cho cả hai khối, điều không thể xảy ra nhờ cơ chế khóa. Từ mâu thuẫn này suy ra tính an toàn được bảo toàn.

### 4.5. Chứng minh độ phức tạp tuyến tính của HotStuff

<div class="textbook-theorem" markdown="1">
**Định lý**: HotStuff đạt độ phức tạp thông điệp \( O(n) \) cho mỗi view.
</div>

**Chứng minh**:

Trong mỗi view:
- Nút dẫn đầu phát tán đề xuất: \( n-1 \) thông điệp.
- Các bản sao gửi phiếu bầu về nút dẫn đầu: \( n-1 \) thông điệp.
- Nút dẫn đầu phát tán chứng chỉ quorum (QC): \( n-1 \) thông điệp.

**Tổng cộng**: \( 3(n-1) = O(n) \).

**So sánh**:
- PBFT: Truyền tin toàn bộ → \( n(n-1) = O(n^2) \).
- HotStuff: Truyền tin qua nút dẫn đầu → \( 3(n-1) = O(n) \).

**Tỷ lệ giảm băng thông**:
\[
\text{Reduction Factor} = \frac{n(n-1)}{3(n-1)} = \frac{n}{3}
\]

Với \( n = 100 \), lượng thông điệp giảm khoảng 33 lần.

---

## 5. Góc nhìn triển khai

### 5.1. Cài đặt mô phỏng PBFT

```python
import hashlib
import time
from typing import Dict, List, Set, Optional
from dataclasses import dataclass
from enum import Enum

class MessageType(Enum):
    REQUEST = "request"
    PRE_PREPARE = "pre_prepare"
    PREPARE = "prepare"
    COMMIT = "commit"
    REPLY = "reply"

@dataclass
class Message:
    msg_type: MessageType
    view: int
    sequence: int
    digest: str
    replica_id: int
    timestamp: float = None
    
    def __hash__(self):
        return hash((self.msg_type, self.view, self.sequence, 
                    self.digest, self.replica_id))

class PBFTReplica:
    """PBFT consensus replica"""
    
    def __init__(self, replica_id: int, num_replicas: int):
        self.replica_id = replica_id
        self.n = num_replicas
        self.f = (num_replicas - 1) // 3  # Max Byzantine faults
        
        # State
        self.view = 0
        self.sequence = 0
        self.primary_id = 0
        
        # Message logs
        self.pre_prepare_log: Dict[int, Message] = {}
        self.prepare_log: Dict[int, Set[Message]] = {}
        self.commit_log: Dict[int, Set[Message]] = {}
        
        # Checkpoints
        self.last_checkpoint = 0
        self.checkpoint_interval = 100
        
        # Execution state
        self.executed: Set[int] = set()
        self.prepared: Set[int] = set()
        self.committed_local: Set[int] = set()
    
    def is_primary(self) -> bool:
        """Check if this replica is primary for current view"""
        return self.view % self.n == self.replica_id
    
    def compute_digest(self, request: Dict) -> str:
        """Compute message digest"""
        request_str = str(sorted(request.items()))
        return hashlib.sha256(request_str.encode()).hexdigest()
    
    def receive_request(self, request: Dict) -> Optional[Message]:
        """Primary receives client request"""
        if not self.is_primary():
            return None
        
        # Assign sequence number
        self.sequence += 1
        seq = self.sequence
        
        # Compute digest
        digest = self.compute_digest(request)
        
        # Create PRE-PREPARE message
        pre_prepare = Message(
            msg_type=MessageType.PRE_PREPARE,
            view=self.view,
            sequence=seq,
            digest=digest,
            replica_id=self.replica_id,
            timestamp=time.time()
        )
        
        # Log PRE-PREPARE
        self.pre_prepare_log[seq] = pre_prepare
        
        print(f"Replica {self.replica_id} (PRIMARY): "
              f"PRE-PREPARE seq={seq}, digest={digest[:8]}...")
        
        return pre_prepare
    
    def receive_pre_prepare(self, pre_prepare: Message, 
                           request: Dict) -> Optional[Message]:
        """Backup receives PRE-PREPARE from primary"""
        seq = pre_prepare.sequence
        
        # Validate PRE-PREPARE
        if pre_prepare.view != self.view:
            print(f"Replica {self.replica_id}: "
                  f"PRE-PREPARE wrong view (got {pre_prepare.view}, "
                  f"expected {self.view})")
            return None
        
        if seq in self.pre_prepare_log:
            print(f"Replica {self.replica_id}: "
                  f"Duplicate PRE-PREPARE seq={seq}")
            return None
        
        # Verify digest
        expected_digest = self.compute_digest(request)
        if pre_prepare.digest != expected_digest:
            print(f"Replica {self.replica_id}: "
                  f"PRE-PREPARE digest mismatch")
            return None
        
        # Accept PRE-PREPARE
        self.pre_prepare_log[seq] = pre_prepare
        
        # Send PREPARE
        prepare = Message(
            msg_type=MessageType.PREPARE,
            view=self.view,
            sequence=seq,
            digest=pre_prepare.digest,
            replica_id=self.replica_id,
            timestamp=time.time()
        )
        
        # Log own PREPARE
        if seq not in self.prepare_log:
            self.prepare_log[seq] = set()
        self.prepare_log[seq].add(prepare)
        
        print(f"Replica {self.replica_id}: "
              f"PREPARE seq={seq}, digest={pre_prepare.digest[:8]}...")
        
        return prepare
    
    def receive_prepare(self, prepare: Message) -> Optional[Message]:
        """Receive PREPARE from other replicas"""
        seq = prepare.sequence
        
        # Validate
        if prepare.view != self.view:
            return None
        
        # Add to log
        if seq not in self.prepare_log:
            self.prepare_log[seq] = set()
        self.prepare_log[seq].add(prepare)
        
        # Check if prepared (2f matching PREPAREs + PRE-PREPARE)
        if seq not in self.prepared and \
           len(self.prepare_log[seq]) >= 2 * self.f and \
           seq in self.pre_prepare_log:
            
            self.prepared.add(seq)
            
            print(f"Replica {self.replica_id}: "
                  f"PREPARED seq={seq} "
                  f"({len(self.prepare_log[seq])} prepares)")
            
            # Send COMMIT
            commit = Message(
                msg_type=MessageType.COMMIT,
                view=self.view,
                sequence=seq,
                digest=prepare.digest,
                replica_id=self.replica_id,
                timestamp=time.time()
            )
            
            # Log own COMMIT
            if seq not in self.commit_log:
                self.commit_log[seq] = set()
            self.commit_log[seq].add(commit)
            
            print(f"Replica {self.replica_id}: "
                  f"COMMIT seq={seq}")
            
            return commit
        
        return None
    
    def receive_commit(self, commit: Message) -> bool:
        """Receive COMMIT from other replicas"""
        seq = commit.sequence
        
        # Validate
        if commit.view != self.view:
            return False
        
        # Add to log
        if seq not in self.commit_log:
            self.commit_log[seq] = set()
        self.commit_log[seq].add(commit)
        
        # Check if committed-local (2f+1 matching COMMITs)
        if seq not in self.committed_local and \
           seq in self.prepared and \
           len(self.commit_log[seq]) >= 2 * self.f + 1:
            
            self.committed_local.add(seq)
            
            print(f"Replica {self.replica_id}: "
                  f"COMMITTED-LOCAL seq={seq} "
                  f"({len(self.commit_log[seq])} commits)")
            
            # Execute if not already
            if seq not in self.executed:
                self.execute(seq)
                return True
        
        return False
    
    def execute(self, sequence: int):
        """Execute committed request"""
        if sequence in self.executed:
            return
        
        self.executed.add(sequence)
        
        print(f"Replica {self.replica_id}: "
              f"✓ EXECUTED seq={sequence}")
    
    def get_status(self) -> Dict:
        """Get replica status"""
        return {
            'replica_id': self.replica_id,
            'view': self.view,
            'sequence': self.sequence,
            'is_primary': self.is_primary(),
            'prepared': len(self.prepared),
            'committed': len(self.committed_local),
            'executed': len(self.executed)
        }

# Example usage - Simulating PBFT
if __name__ == "__main__":
    print("=== PBFT Consensus Simulation ===\n")
    
    # Create replicas (4 replicas, f=1)
    num_replicas = 4
    replicas = [PBFTReplica(i, num_replicas) for i in range(num_replicas)]
    
    print(f"Replicas: {num_replicas}")
    print(f"Fault tolerance: f={replicas[0].f}\n")
    
    # Client request
    request = {
        'operation': 'transfer',
        'from': 'Alice',
        'to': 'Bob',
        'amount': 100
    }
    
    print(f"Client request: {request}\n")
    
    # Phase 1: PRE-PREPARE (primary broadcasts)
    print("--- Phase 1: PRE-PREPARE ---")
    pre_prepare = replicas[0].receive_request(request)
    print()
    
    # Phase 2: PREPARE (backups respond)
    print("--- Phase 2: PREPARE ---")
    prepare_messages = []
    for i in range(1, num_replicas):
        prepare = replicas[i].receive_pre_prepare(pre_prepare, request)
        if prepare:
            prepare_messages.append(prepare)
    print()
    
    # Broadcast PREPARE messages to all replicas
    print("--- Broadcasting PREPARE messages ---")
    commit_messages = []
    for replica in replicas:
        for prepare in prepare_messages:
            commit = replica.receive_prepare(prepare)
            if commit:
                commit_messages.append(commit)
    print()
    
    # Phase 3: COMMIT
    print("--- Phase 3: COMMIT ---")
    print("--- Broadcasting COMMIT messages ---")
    for replica in replicas:
        for commit in commit_messages:
            if commit.replica_id != replica.replica_id:
                replica.receive_commit(commit)
    print()
    
    # Show final status
    print("=== Final Status ===")
    for replica in replicas:
        status = replica.get_status()
        print(f"Replica {status['replica_id']}: "
              f"Executed={status['executed']} operations")
    
    print("\n✓ Consensus achieved!")
```

---

## Video tham khảo

- **Xem trước:** [\[CS198.2x Week 1\] Practical Byzantine Fault Tolerance](https://www.youtube.com/watch?v=IafgKJN3nwU) — Blockchain at BerkeleyX, tiếng Anh. Bài giảng của BerkeleyX về PBFT: hai pha prepare và commit với quorum 2/3; nên xem trước mục thuật toán.
- [Tendermint - How the consensus mechanism works](https://www.youtube.com/watch?v=AFiLxS7f1Lo) — PONTON, tiếng Anh. Minh họa vòng đề xuất, prevote và precommit của Tendermint; đối chiếu trực tiếp với mục Tendermint trong bài.
- [Dr. Ted Yin: Consensus Mechanisms (HotStuff) | Gigabrains Blockchain Reading Group 2024](https://www.youtube.com/watch?v=RKRk-TpaVrg) — Nubit, tiếng Anh. Ted Yin, đồng tác giả HotStuff, trình bày cơ chế giảm độ phức tạp truyền thông so với PBFT.
