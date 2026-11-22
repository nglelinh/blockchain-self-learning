---
layout: post
title: "Lecture 01.01: Proof-of-Work Deep Dive - Mining, Security, và Economics"
chapter: '01'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter01
---

# Lecture: Proof-of-Work Deep Dive - Mining, Security, và Economics

## 1. Tổng quan về khái niệm

**Proof-of-Work (PoW)** là cơ chế đồng thuận cốt lõi của Bitcoin, cho phép hàng nghìn nút độc lập thống nhất về thứ tự giao dịch mà không cần tin cậy lẫn nhau. Ý tưởng nền tảng của PoW đã xuất hiện trước Bitcoin nhưng được Satoshi Nakamoto tích hợp theo một cách mới vào bài toán đồng thuận phân tán.

**Bối cảnh lịch sử**:

Khái niệm "bằng chứng công việc" (proof-of-work) được **Cynthia Dwork và Moni Naor** đề xuất lần đầu năm 1992 nhằm chống thư rác (email spam). Đến năm 1997, **Adam Back** phát triển **Hashcash** — một hệ thống PoW chống thư rác và tấn công từ chối dịch vụ (DoS) bằng cách buộc người gửi thực hiện một lượng tính toán nhỏ trước khi gửi thư: hầu như không đáng kể với người dùng bình thường nhưng rất tốn kém với kẻ gửi hàng triệu thư rác.

Satoshi Nakamoto điều chỉnh cơ chế này cho bài toán đồng thuận phân tán của Bitcoin với bốn chức năng chính:
1. **Chọn người đề xuất khối**: Phân bổ quyền tạo khối ngẫu nhiên theo tỷ lệ năng lực tính toán.
2. **Chống tấn công Sybil**: Kẻ tấn công không thể tạo hàng loạt danh tính giả để giành quyền kiểm soát nếu không bỏ ra phần cứng và điện năng thực.
3. **Điều tiết tốc độ tạo khối**: Duy trì thời gian tạo khối trung bình khoảng 10 phút.
4. **Tạo rào cản chi phí kinh tế**: Muốn tấn công mạng lưới, kẻ tấn công phải chi trả tài nguyên thực tương đương hoặc lớn hơn mạng trung thực.

**Nguyên lý cốt lõi**:

Các thợ đào (miners) cạnh tranh tìm một số gọi là **nonce** sao cho giá trị băm kép của phần đầu khối nhỏ hơn một ngưỡng mục tiêu (`Target`) cho trước:

\[
\text{SHA256}(\text{SHA256}(\text{Block Header with Nonce})) < \text{Target}
\]

Cơ chế này hiệu quả nhờ bốn đặc điểm:
- **Khó tìm**: Trung bình cần khoảng \( \text{Difficulty} \times 2^{32} \) phép thử băm để tìm ra một khối hợp lệ.
- **Dễ xác minh**: Các nút khác chỉ cần một phép băm kép duy nhất để kiểm tra tính hợp lệ.
- **Tự điều chỉnh độ khó**: Ngưỡng `Target` tự động thay đổi để ổn định thời gian tạo khối.
- **Không có đường tắt**: Nếu SHA-256 an toàn, không có thuật toán nào nhanh hơn cách thử vét cạn.

**Vì sao gọi là "Work" (Công việc)?**

PoW gắn trực tiếp với việc tiêu hao tài nguyên vật lý gồm phần cứng chuyên dụng (ASIC), điện năng (~150 TWh/năm trên toàn mạng Bitcoin), hệ thống làm mát và chi phí vận hành trung tâm dữ liệu. Khi kết hợp với **phần thưởng khối** và **phí giao dịch**, cơ chế này tạo ra trạng thái cân bằng kinh tế tự điều tiết:

```
Mining Cost = Hardware + Electricity + Operational Costs
Mining Revenue = Block Reward + Transaction Fees

If Revenue > Cost → More miners join → Difficulty increases
If Revenue < Cost → Miners leave → Difficulty decreases

Result: Self-regulating equilibrium!
```

Nhờ vòng phản hồi này, mức độ bảo mật của mạng lưới tự động điều chỉnh theo động lực kinh tế mà không cần cơ quan quản lý trung tâm.

---

## 2. Hiểu biết trực quan

### 2.1. Quá trình đào như một trò chơi xổ số gắn với công sức

Có thể so sánh quá trình đào Bitcoin với xổ số truyền thống:

- **Xổ số truyền thống**: Mua vé có sẵn số in; kết quả hoàn toàn ngẫu nhiên và không cần tính toán.
- **Xổ số đào Bitcoin**: Không có vé in sẵn — thợ đào phải tự tạo từng "tấm vé" bằng cách lấy dữ liệu phần đầu khối, thay một giá trị `nonce`, tính băm kép và kiểm tra xem giá trị băm có nhỏ hơn `Target` hay không. Mỗi phép thử băm tương ứng một tấm vé.

**Tính công bằng theo xác suất**: Năng lực tính toán càng lớn thì số vé thử mỗi giây càng nhiều, nhưng từng phép thử độc lập đều có xác suất trúng như nhau và không thể dự đoán trước phép thử nào sẽ thắng.

### 2.2. Độ khó như một "ổ khóa tự điều chỉnh"

Ngưỡng `Target` / độ khó hoạt động giống như một ổ khóa số tự điều chỉnh độ chặt:

**Độ khó thấp**:
```
Target: 0000FFFF... (many leading zeros not required)
Hash:   0003A5B2... ✓ Valid! (starts with few zeros)

Probability: High (1 in thousands)
Time: Seconds to find
```

**Độ khó cao**:
```
Target: 00000000000019... (many leading zeros required)
Hash:   000000000000A2... ✓ Valid! (many leading zeros)

Probability: Low (1 in trillions)
Time: ~10 minutes for entire network
```

**Cơ chế tự điều chỉnh**:
```
Many miners → Blocks found too fast → Lock becomes harder
Few miners → Blocks found too slow → Lock becomes easier

Goal: Always ~10 minutes per block
```

### 2.3. Quá trình tiến hóa phần cứng đào Bitcoin

**2009–2010: Kỷ nguyên CPU**
```
Your laptop: ~1 MH/s (million hashes/second)
Cost: $500
Power: 65W
Profitability: High (BTC = $0.001)
```

**2010–2013: Kỷ nguyên GPU**
```
Gaming GPU: ~100-500 MH/s
Cost: $200-500
Power: 150-250W
Profitability: Very high (BTC = $1-100)
Why better: Parallel processing (hundreds of cores)
```

**2013–2016: Bắt đầu kỷ nguyên ASIC**
```
First ASICs: ~5 GH/s (billion hashes/second)
Cost: $1,000-5,000
Power: 600W
Profitability: Initially very high
Why better: Specialized hardware for SHA-256 only
```

**2016–2024: Kỷ nguyên ASIC hiện đại**
```
Antminer S19 Pro: ~110 TH/s (trillion hashes/second)
Cost: $2,000-8,000
Power: 3,250W
Profitability: Moderate (competitive market)
Efficiency: 29.5 J/TH (joules per terahash)
```

**Tốc độ tăng trưởng hiệu năng**:
```
CPU → GPU:     100x improvement
GPU → ASIC:    1,000x improvement
Early ASIC → Modern ASIC: 20,000x improvement

Total: ~2,000,000x since 2009!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Cấu trúc phần đầu khối (Block Header — 80 byte)

Quá trình băm PoW chỉ thao tác trực tiếp trên **80 byte của phần đầu khối**, không băm lặp lại toàn bộ danh sách giao dịch:

```
Bytes 0-3:    Version (4 bytes)
Bytes 4-35:   Previous Block Hash (32 bytes)
Bytes 36-67:  Merkle Root (32 bytes)
Bytes 68-71:  Timestamp (4 bytes)
Bytes 72-75:  Bits/Target (4 bytes)
Bytes 76-79:  Nonce (4 bytes)
```

**Ví dụ phần đầu khối (Block 125552)**:
```
01000000    // Version 1
81cd02ab    // Previous block hash
7e867800    // (truncated for display)
...
e320b6c2    // Merkle root
...
047c2954    // Timestamp
1d00ffff    // Bits (difficulty)
bc192a6a    // Nonce (found by miner!)
```

**Vòng lặp băm cơ bản**:
```python
# Pseudocode
block_header = version + prev_hash + merkle_root + timestamp + bits + nonce
hash = SHA256(SHA256(block_header))

if hash < target:
    print("Valid block found!")
    broadcast_to_network()
else:
    nonce += 1  # Try again
```

### 3.2. Ngưỡng mục tiêu (Target) và Độ khó (Difficulty)

**Target** là một số nguyên 256-bit; giá trị băm của khối hợp lệ phải nhỏ hơn ngưỡng này. Trong phần đầu khối, `Target` được lưu dưới dạng nén 4 byte (trường `Bits`):

```
Bits = 0x1d00ffff

Decoding:
  Exponent = 0x1d (29 decimal)
  Coefficient = 0x00ffff

Target = Coefficient × 2^(8 × (Exponent - 3))
       = 0x00ffff × 2^(8 × (29 - 3))
       = 0x00ffff × 2^208
       = 0x00000000FFFF0000000000000000000000000000000000000000000000000000
```

**Độ khó (Difficulty)** biểu diễn tỷ số giữa ngưỡng tối đa (khi độ khó bằng 1 ở khối nguyên thủy) và ngưỡng hiện tại:
\[
\text{Difficulty} = \frac{\text{Max Target}}{\text{Current Target}}
\]

Với:
```
Max Target = 0x00000000FFFF0000000000000000000000000000000000000000000000000000
```

Ở mức độ khó tham khảo khoảng 60 nghìn tỷ (năm 2024):
```
Current Target = Max Target / 60,000,000,000,000
               ≈ 0x0000000000000000000429...
```
Điều này nghĩa là việc tìm một khối hợp lệ khó hơn khoảng 60 nghìn tỷ lần so với thời điểm ra mắt khối nguyên thủy.

### 3.3. Thuật toán điều chỉnh độ khó

Bitcoin điều chỉnh độ khó định kỳ sau mỗi 2.016 block (~2 tuần với tốc độ 10 phút/block):

\[
\text{New Difficulty} = \text{Old Difficulty} \times \frac{\text{Expected Time}}{\text{Actual Time}}
\]

Hay theo ngưỡng mục tiêu:
\[
\text{New Target} = \text{Old Target} \times \frac{\text{Actual Time (last 2016 blocks)}}{\text{20160 minutes}}
\]

**Giới hạn điều chỉnh**: Mỗi kỳ chỉ được tăng tối đa 4 lần hoặc giảm tối đa 4 lần (xuống 1/4) nhằm tránh biến động đột ngột.

**Cài đặt trong Bitcoin Core (C++)**:
```cpp
int64_t GetNextWorkRequired(const CBlockIndex* pindexLast) {
    // Find the first block in the adjustment period
    const CBlockIndex* pindexFirst = pindexLast;
    for (int i = 0; pindexFirst && i < 2015; i++)
        pindexFirst = pindexFirst->pprev;
    
    // Compute actual timespan
    int64_t nActualTimespan = pindexLast->GetBlockTime() - 
                               pindexFirst->GetBlockTime();
    
    // Constrain to [0.25x, 4x] range
    if (nActualTimespan < nTargetTimespan/4)
        nActualTimespan = nTargetTimespan/4;
    if (nActualTimespan > nTargetTimespan*4)
        nActualTimespan = nTargetTimespan*4;
    
    // Calculate new target
    CBigNum bnNew;
    bnNew.SetCompact(pindexLast->nBits);
    bnNew *= nActualTimespan;
    bnNew /= nTargetTimespan;
    
    // Ensure doesn't exceed max
    if (bnNew > bnProofOfWorkLimit)
        bnNew = bnProofOfWorkLimit;
    
    return bnNew.GetCompact();
}
```

**Ví dụ điều chỉnh (Block 630000 → 632016)**:
```
Old Difficulty: 15,138,043,247,082
Blocks took:    13.5 days (instead of 14)
Faster than expected!

New Difficulty = 15,138,043,247,082 × (20160 / 19440)
               = 15,138,043,247,082 × 1.037
               ≈ 15,700,000,000,000

Result: ~3.7% harder (within 4x constraint)
```

### 3.4. Sức mạnh băm (Hash Rate) và Bảo mật mạng

**Hash Rate** đo tổng năng lực tính băm của toàn mạng theo các đơn vị: H/s, KH/s (\(10^3\)), MH/s (\(10^6\)), GH/s (\(10^9\)), TH/s (\(10^{12}\)), PH/s (\(10^{15}\)) và EH/s (\(10^{18}\)). Tính đến năm 2024, tổng hash rate mạng Bitcoin đạt khoảng 600 EH/s (600 tỷ tỷ phép băm mỗi giây).

**Quan hệ với độ khó**:
\[
\text{Hash Rate} = \frac{\text{Difficulty} \times 2^{32}}{600 \text{ seconds}}
\]

Hash rate càng cao thì chi phí tấn công 51% càng lớn:
```
Required hash rate: 51% of 600 EH/s = 306 EH/s

Hardware cost:
- Modern ASIC: 110 TH/s, costs ~$3,000
- Need: 306 EH/s / 110 TH/s = 2.78 million ASICs
- Total: 2,780,000 × $3,000 = $8.3 billion

Electricity cost (ongoing):
- Power: 2,780,000 × 3,250W = 9 GW
- Cost: $0.05/kWh × 9,000,000 kW = $450,000/hour
- Per day: $10.8 million

Total to attack for 1 day: ~$8.3B + $10.8M ≈ $8.31 billion
And you'd likely crash BTC price, making your investment worthless!
```

### 3.5. Quy trình đào một khối theo từng bước

**Bước 1: Tạo mẫu khối (Block Template)**
```python
block_template = {
    'version': 0x20000000,
    'previousblockhash': get_best_block_hash(),
    'merkleroot': None,  # To be computed
    'time': current_timestamp(),
    'bits': get_current_difficulty_bits(),
    'nonce': 0
}
```

**Bước 2: Chọn giao dịch từ mempool (ưu tiên tỷ lệ phí/byte cao nhất)**
```python
# Select from mempool (ordered by fee/byte)
transactions = []
total_size = 0
total_fees = 0

for tx in mempool.sort_by_fee_rate():
    if total_size + tx.size > MAX_BLOCK_SIZE:
        break
    transactions.append(tx)
    total_size += tx.size
    total_fees += tx.fee
```

**Bước 3: Tạo giao dịch coinbase (phần thưởng khối + tổng phí)**
```python
coinbase = Transaction()
coinbase.add_input(
    txid='0' * 64,  # Null input
    vout=0xFFFFFFFF,
    scriptSig=encode_block_height() + arbitrary_data
)
coinbase.add_output(
    value=BLOCK_REWARD + total_fees,  # 6.25 BTC + fees
    scriptPubKey=miner_address
)

transactions.insert(0, coinbase)  # Coinbase is first tx
```

**Bước 4: Tính Merkle Root**
```python
def merkle_root(transactions):
    hashes = [sha256(sha256(tx)) for tx in transactions]
    
    while len(hashes) > 1:
        if len(hashes) % 2 == 1:
            hashes.append(hashes[-1])  # Duplicate last
        
        hashes = [
            sha256(sha256(hashes[i] + hashes[i+1]))
            for i in range(0, len(hashes), 2)
        ]
    
    return hashes[0]

block_template['merkleroot'] = merkle_root(transactions)
```

**Bước 5: Vòng lặp tìm Nonce hợp lệ**
```python
def mine_block(block_template):
    target = bits_to_target(block_template['bits'])
    nonce = 0
    max_nonce = 2**32  # 4 billion
    
    while nonce < max_nonce:
        block_template['nonce'] = nonce
        header = serialize_header(block_template)
        hash_result = sha256(sha256(header))
        
        if int.from_bytes(hash_result, 'big') < target:
            return nonce, hash_result  # Found!
        
        nonce += 1
        
        # Update timestamp every second
        if nonce % 1000000 == 0:
            block_template['time'] = current_timestamp()
    
    return None  # Nonce space exhausted, need new block
```

**Bước 6: Phát tán khối hợp lệ ra toàn mạng**
```python
if nonce is not None:
    complete_block = {
        'header': block_template,
        'transactions': transactions
    }
    broadcast_to_peers(complete_block)
```

---

## 4. Công thức toán học và mật mã học

### 4.1. Xác suất tìm thấy khối hợp lệ

**Với một phép thử băm đơn lẻ**:
\[
P(\text{success}) = \frac{\text{Target}}{2^{256}}
\]

**Ở mức độ khó khoảng 60 nghìn tỷ**:
\[
P(\text{success}) \approx \frac{1}{60 \times 10^{12} \times 2^{32}} \approx \frac{1}{2.58 \times 10^{23}}
\]

**Số phép thử kỳ vọng**:
\[
E[\text{attempts}] = \frac{1}{P(\text{success})} = \text{Difficulty} \times 2^{32}
\]

**Thời gian kỳ vọng với toàn mạng đạt 600 EH/s**:
\[
\begin{align}
\text{Attempts per second} &= 600 \times 10^{18} \\
\text{Expected time} &= \frac{\text{Difficulty} \times 2^{32}}{600 \times 10^{18}} \\
&= \frac{60 \times 10^{12} \times 4.295 \times 10^9}{600 \times 10^{18}} \\
&\approx 430 \text{ seconds} \approx 7.2 \text{ minutes}
\end{align}
\]
(Khi mạng duy trì ổn định ở mức 600 EH/s, thuật toán điều chỉnh độ khó sẽ tự động nâng độ khó lên khoảng \( 83.8 \times 10^{12} \) để đưa thời gian kỳ vọng về đúng 600 giây = 10 phút).

### 4.2. Quá trình đào theo phân phối Poisson

Do mỗi phép thử băm độc lập và có xác suất thành công rất nhỏ, sự kiện tìm thấy block tuân theo **phân phối Poisson** với tốc độ trung bình \( \lambda = 1/600 \) block/giây (1 block mỗi 10 phút):

\[
P(X = k) = \frac{(\lambda t)^k e^{-\lambda t}}{k!}
\]

- **Xác suất không có block nào trong 10 phút**:
  \[
  P(X = 0) = e^{-1} \approx 0.368 = 36.8\%
  \]
- **Xác suất xuất hiện từ 2 block trở lên trong 10 phút** (nguy cơ xung đột/orphan):
  \[
  P(X \geq 2) = 1 - P(X=0) - P(X=1) = 1 - e^{-1} - e^{-1} \approx 0.264 = 26.4\%
  \]
- **Thời gian kỳ vọng đến block kế tiếp**:
  \[
  E[T] = \frac{1}{\lambda} = 600 \text{ seconds}
  \]
- **Phương sai và độ lệch chuẩn**:
  \[
  \text{Var}(T) = \frac{1}{\lambda^2} = 360,000 \text{ seconds}^2, \qquad \sigma = 600 \text{ seconds} = 10 \text{ minutes}
  \]

Do độ lệch chuẩn bằng đúng giá trị trung bình, khoảng cách thực tế giữa hai block biến thiên rất mạnh: có khi chỉ 1 phút, có khi kéo dài tới 30 phút.

### 4.3. Phân tích tấn công đào ích kỷ (Selfish Mining)

Trong **đào trung thực**, mọi thợ đào công bố ngay block vừa tìm được và doanh thu kỳ vọng tỷ lệ thuận với phần trăm sức mạnh băm của họ.

Trong **đào ích kỷ** (Eyal & Sirer, 2014), giả sử nhóm tấn công nắm tỷ lệ sức mạnh băm \( q \), mạng trung thực nắm \( p = 1 - q \), và \( \gamma \) là tỷ lệ thợ đào trung thực chọn đào tiếp trên nhánh của kẻ tấn công khi hai nhánh hòa nhau.

**Tỷ trọng doanh thu tương đối của nhóm đào ích kỷ**:
\[
R_{\text{pool}} = \frac{q(1-q)^2\big(4q + \gamma(1-2q)\big) - q^3}{1 - q\big(1 + (2-q)q\big)}
\]

**Ngưỡng sinh lợi** (khi \( R_{\text{pool}} > q \)):
\[
q > \frac{1 - \gamma}{3 - 2\gamma}
\]

- **Trường hợp bất lợi nhất cho kẻ tấn công** (\( \gamma = 0 \), toàn bộ thợ đào trung thực bám chuỗi trung thực):
  \[
  q > \frac{1}{3} \approx 33.3\%
  \]
- **Trường hợp thuận lợi nhất cho kẻ tấn công** (\( \gamma = 1 \), toàn bộ chuyển sang nhánh của kẻ tấn công khi hòa):
  \[
  q > \frac{0}{1} = 0\% \text{ (luôn có lợi về mặt lý thuyết)}
  \]
- **Trường hợp thực tế** (\( \gamma \approx 0.5 \)):
  \[
  q > \frac{0.5}{2} = 25\%
  \]

Kết quả này cho thấy ngưỡng an toàn trước chiến lược ích kỷ nằm quanh 25%–33% sức mạnh băm, thấp hơn đáng kể so với mốc 51%.

### 4.4. Tấn công 51% — Xác suất chi tiêu gấp đôi

Kẻ tấn công nắm tỷ lệ \( q \) sức mạnh băm gửi giao dịch thanh toán cho người bán (người bán chờ \( z \) xác nhận), đồng thời bí mật đào một nhánh song song không chứa giao dịch đó. Theo bài toán bước đi ngẫu nhiên (Gambler's Ruin), xác suất đuổi kịp từ vị trí tụt lại \( z \) block là:

\[
P_{\text{catch-up}}(q, z) = \begin{cases}
\left(\frac{q}{1-q}\right)^z & \text{if } q < 0.5 \\
1 & \text{if } q \geq 0.5
\end{cases}
\]

**Bảng xác suất minh họa theo \( \left(\frac{q}{1-q}\right)^z \)**:

| \( q \) (% kẻ tấn công) | \( z=1 \) | \( z=2 \) | \( z=3 \) | \( z=6 \) | \( z=10 \) |
|----------------|-----|-----|-----|-----|------|
| 10% | 11.1% | 1.2% | 0.14% | 0.0002% | ~0% |
| 20% | 25.0% | 6.25% | 1.56% | 0.024% | ~0% |
| 30% | 42.9% | 18.4% | 7.9% | 0.62% | 0.021% |
| 40% | 66.7% | 44.4% | 29.6% | 8.8% | 1.73% |
| 45% | 81.8% | 66.9% | 54.8% | 30.0% | 13.4% |
| 49% | 96.1% | 92.3% | 88.7% | 78.7% | 67.0% |

Nhận xét: Với 10% sức mạnh băm, 6 xác nhận đưa xác suất đuổi kịp về gần bằng 0; với 40%, 6 xác nhận vẫn còn khoảng 8,8% rủi ro; và cần trên 50% để đảm bảo chắc chắn đuổi kịp.

### 4.5. Phương sai thu nhập và Kinh tế học của Mining Pool

Xét một thợ đào đơn lẻ (solo miner) sở hữu tốc độ băm \( h \) trong mạng lưới có tổng tốc độ \( H \) và thời gian khối \( T = 600\text{ s} \):

**Số block kỳ vọng mỗi ngày**:
\[
E[\text{blocks/day}] = \frac{h}{H} \times \frac{86400}{600} = \frac{144h}{H}
\]

**Ví dụ**: Một máy đào 100 TH/s hoạt động trong mạng lưới 600 EH/s:
\[
E[\text{blocks/day}] = \frac{144 \times 100 \times 10^{12}}{600 \times 10^{18}} = 0.000024 \text{ blocks/day}
\]

**Thời gian trung bình để tìm được 1 block**:
\[
\frac{1}{0.000024 \text{ days}} \approx 41,667 \text{ days} \approx 114 \text{ years}
\]

**Độ lệch chuẩn (theo Poisson) và hệ số biến thiên**:
\[
\sigma = \sqrt{E[\text{blocks/day}]} = \sqrt{0.000024} \approx 0.0049
\]
\[
CV = \frac{\sigma}{E} = \frac{1}{\sqrt{E}} = \frac{1}{\sqrt{0.000024}} \approx 204
\]

Phương sai thu nhập khi đào đơn lẻ cực kỳ lớn khiến dòng tiền gần như không thể dự đoán. **Nhóm đào (Mining Pools)** giải quyết vấn đề này bằng cách gom sức mạnh băm của \( N \) thợ đào lại với nhau, giúp giảm hệ số biến thiên thu nhập theo tỷ lệ \( \sqrt{N} \) với mức phí dịch vụ thường từ 1%–3%.

---

## 5. Minh họa triển khai

### 5.1. Cài đặt mô phỏng đào khối (Python)

```python
import hashlib
import struct
import time
from typing import Optional, Tuple

class BlockHeader:
    def __init__(self, version: int, prev_hash: bytes, merkle_root: bytes,
                 timestamp: int, bits: int, nonce: int = 0):
        self.version = version
        self.prev_hash = prev_hash
        self.merkle_root = merkle_root
        self.timestamp = timestamp
        self.bits = bits
        self.nonce = nonce
    
    def serialize(self) -> bytes:
        """Serialize header for hashing"""
        return (
            struct.pack('<I', self.version) +
            self.prev_hash[::-1] +  # Little-endian
            self.merkle_root[::-1] +
            struct.pack('<I', self.timestamp) +
            struct.pack('<I', self.bits) +
            struct.pack('<I', self.nonce)
        )
    
    def hash(self) -> bytes:
        """Double SHA-256 hash"""
        header_bin = self.serialize()
        return hashlib.sha256(hashlib.sha256(header_bin).digest()).digest()
    
    @staticmethod
    def bits_to_target(bits: int) -> int:
        """Convert compact bits representation to full target"""
        exponent = bits >> 24
        mantissa = bits & 0x00FFFFFF
        
        if exponent <= 3:
            target = mantissa >> (8 * (3 - exponent))
        else:
            target = mantissa << (8 * (exponent - 3))
        
        return target
    
    def is_valid(self) -> bool:
        """Check if hash meets difficulty target"""
        hash_int = int.from_bytes(self.hash(), 'little')
        target = self.bits_to_target(self.bits)
        return hash_int < target

class Miner:
    def __init__(self, header: BlockHeader):
        self.header = header
        self.target = BlockHeader.bits_to_target(header.bits)
        self.hashes_computed = 0
        self.start_time = None
    
    def mine(self, max_nonce: int = 2**32, update_interval: int = 1000000) -> Optional[int]:
        """
        Mine block by finding valid nonce
        
        Args:
            max_nonce: Maximum nonce to try
            update_interval: How often to update timestamp
        
        Returns:
            Valid nonce if found, None otherwise
        """
        self.start_time = time.time()
        initial_timestamp = self.header.timestamp
        
        print(f"Mining started...")
        print(f"Target: {self.target:064x}")
        print(f"Difficulty: ~{(2**256 / self.target):.2e}\n")
        
        for nonce in range(max_nonce):
            self.header.nonce = nonce
            self.hashes_computed += 1
            
            # Check if valid
            hash_result = self.header.hash()
            hash_int = int.from_bytes(hash_result, 'little')
            
            if hash_int < self.target:
                # Found valid block!
                elapsed = time.time() - self.start_time
                hashrate = self.hashes_computed / elapsed
                
                print(f"✓ Valid block found!")
                print(f"Nonce: {nonce}")
                print(f"Hash: {hash_result[::-1].hex()}")
                print(f"Hashes: {self.hashes_computed:,}")
                print(f"Time: {elapsed:.2f}s")
                print(f"Hash rate: {hashrate/1e6:.2f} MH/s")
                
                return nonce
            
            # Update timestamp periodically
            if nonce > 0 and nonce % update_interval == 0:
                self.header.timestamp = int(time.time())
                
                # Progress update
                elapsed = time.time() - self.start_time
                hashrate = self.hashes_computed / elapsed if elapsed > 0 else 0
                progress = (nonce / max_nonce) * 100
                
                print(f"Progress: {progress:.1f}% | "
                      f"Nonce: {nonce:,} | "
                      f"Hash rate: {hashrate/1e6:.2f} MH/s | "
                      f"Time: {elapsed:.1f}s")
        
        # Exhausted nonce space
        print(f"\n✗ Failed to find valid block in {max_nonce:,} attempts")
        print(f"Need to change block (update transactions or timestamp)")
        return None

class MiningPool:
    """Simplified mining pool that distributes work"""
    
    def __init__(self, header: BlockHeader, num_workers: int = 4):
        self.header = header
        self.num_workers = num_workers
        self.target = BlockHeader.bits_to_target(header.bits)
    
    def assign_work(self, worker_id: int) -> Tuple[int, int]:
        """Assign nonce range to worker"""
        nonce_space = 2**32
        range_size = nonce_space // self.num_workers
        
        start_nonce = worker_id * range_size
        end_nonce = start_nonce + range_size
        
        return start_nonce, end_nonce
    
    def mine_range(self, start_nonce: int, end_nonce: int, 
                   worker_id: int) -> Optional[int]:
        """Mine within assigned nonce range"""
        print(f"Worker {worker_id}: Mining nonce range "
              f"{start_nonce:,} to {end_nonce:,}")
        
        for nonce in range(start_nonce, end_nonce):
            self.header.nonce = nonce
            hash_result = self.header.hash()
            hash_int = int.from_bytes(hash_result, 'little')
            
            if hash_int < self.target:
                print(f"✓ Worker {worker_id} found valid block at nonce {nonce}!")
                return nonce
        
        return None

# Example usage
if __name__ == "__main__":
    print("=== Bitcoin Mining Simulation ===\n")
    
    # Create a very easy block for demonstration (difficulty ~1000)
    # Normal Bitcoin difficulty is ~60 trillion!
    header = BlockHeader(
        version=0x20000000,
        prev_hash=bytes.fromhex("00" * 32),
        merkle_root=bytes.fromhex("aa" * 32),
        timestamp=int(time.time()),
        bits=0x1e0ffff0,  # Much easier than real Bitcoin
        nonce=0
    )
    
    print("Block Header:")
    print(f"  Version: {header.version}")
    print(f"  Previous Hash: {header.prev_hash.hex()[:32]}...")
    print(f"  Merkle Root: {header.merkle_root.hex()[:32]}...")
    print(f"  Timestamp: {header.timestamp}")
    print(f"  Bits: 0x{header.bits:08x}")
    print()
    
    # Mine!
    miner = Miner(header)
    valid_nonce = miner.mine(max_nonce=10_000_000)  # Limit for demo
    
    if valid_nonce:
        print(f"\n✓ Mining successful!")
        print(f"Block can now be broadcast to network")
```

### 5.2. Mô phỏng thuật toán điều chỉnh độ khó

```python
import random
from typing import List

class DifficultySimulator:
    def __init__(self, target_block_time: int = 600, adjustment_period: int = 2016):
        self.target_block_time = target_block_time
        self.adjustment_period = adjustment_period
        self.difficulty = 1.0
        self.hash_rate = 100.0  # Arbitrary units
        self.blocks: List[dict] = []
    
    def mine_block(self) -> dict:
        """Simulate mining one block"""
        # Expected time based on hash rate and difficulty
        expected_time = self.target_block_time * self.difficulty / self.hash_rate
        
        # Add randomness (exponential distribution matches Poisson process)
        actual_time = random.expovariate(1.0 / expected_time)
        
        block = {
            'height': len(self.blocks),
            'time': actual_time,
            'difficulty': self.difficulty,
            'hash_rate': self.hash_rate
        }
        
        self.blocks.append(block)
        
        # Check if adjustment needed
        if len(self.blocks) % self.adjustment_period == 0:
            self.adjust_difficulty()
        
        return block
    
    def adjust_difficulty(self):
        """Adjust difficulty based on recent block times"""
        if len(self.blocks) < self.adjustment_period:
            return
        
        # Get blocks from last adjustment period
        recent_blocks = self.blocks[-self.adjustment_period:]
        
        # Calculate actual time taken
        actual_time = sum(b['time'] for b in recent_blocks)
        expected_time = self.target_block_time * self.adjustment_period
        
        # Calculate adjustment
        adjustment_factor = expected_time / actual_time
        
        # Constrain to [0.25, 4] range
        adjustment_factor = max(0.25, min(4.0, adjustment_factor))
        
        old_difficulty = self.difficulty
        self.difficulty *= adjustment_factor
        
        print(f"\n=== Difficulty Adjustment at Block {len(self.blocks)} ===")
        print(f"Actual time: {actual_time/60:.1f} minutes")
        print(f"Expected time: {expected_time/60:.1f} minutes")
        print(f"Old difficulty: {old_difficulty:.2f}")
        print(f"New difficulty: {self.difficulty:.2f}")
        print(f"Change: {(adjustment_factor - 1) * 100:+.1f}%\n")
    
    def simulate(self, num_blocks: int, hash_rate_changes: dict = None):
        """
        Simulate mining multiple blocks
        
        Args:
            num_blocks: Number of blocks to mine
            hash_rate_changes: Dict of {block_height: new_hash_rate}
        """
        hash_rate_changes = hash_rate_changes or {}
        
        print(f"Starting simulation: {num_blocks} blocks")
        print(f"Target block time: {self.target_block_time}s\n")
        
        for i in range(num_blocks):
            # Apply hash rate changes
            if i in hash_rate_changes:
                old_rate = self.hash_rate
                self.hash_rate = hash_rate_changes[i]
                print(f"\n*** Hash rate changed at block {i}: "
                      f"{old_rate:.0f} → {self.hash_rate:.0f} ({self.hash_rate/old_rate:.1f}x) ***\n")
            
            block = self.mine_block()
            
            if i % 100 == 0:
                avg_time = sum(b['time'] for b in self.blocks[-100:]) / min(100, len(self.blocks))
                print(f"Block {i:5d} | Time: {block['time']:6.1f}s | "
                      f"Avg (last 100): {avg_time:6.1f}s | "
                      f"Difficulty: {self.difficulty:8.2f}")
    
    def analyze_results(self):
        """Analyze simulation results"""
        print("\n=== Simulation Results ===")
        
        block_times = [b['time'] for b in self.blocks]
        
        print(f"Total blocks: {len(self.blocks)}")
        print(f"Average block time: {sum(block_times)/len(block_times):.1f}s")
        print(f"Min block time: {min(block_times):.1f}s")
        print(f"Max block time: {max(block_times):.1f}s")
        print(f"Final difficulty: {self.difficulty:.2f}")
        
        # Blocks per adjustment period
        for i in range(0, len(self.blocks), self.adjustment_period):
            period_blocks = self.blocks[i:i+self.adjustment_period]
            if len(period_blocks) == self.adjustment_period:
                avg_time = sum(b['time'] for b in period_blocks) / len(period_blocks)
                print(f"\nPeriod {i//self.adjustment_period + 1} "
                      f"(blocks {i}-{i+self.adjustment_period-1}): "
                      f"Avg time: {avg_time:.1f}s")

# Run simulation
if __name__ == "__main__":
    print("=== Difficulty Adjustment Simulation ===\n")
    
    simulator = DifficultySimulator(target_block_time=600, adjustment_period=100)  # Shorter for demo
    
    # Simulate hash rate increases (mining hardware improvements)
    hash_rate_changes = {
        200: 200.0,   # 2x increase at block 200
        500: 500.0,   # 2.5x increase at block 500
        800: 300.0    # Decrease (miners leave)
    }
    
    simulator.simulate(num_blocks=1000, hash_rate_changes=hash_rate_changes)
    simulator.analyze_results()
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Tập trung hóa hoạt động đào

Hoạt động đào Bitcoin có xu hướng tập trung cả về địa lý lẫn nhóm đào (pool):

**Phân bổ địa lý tham khảo (2024)**:
- Mỹ: ~38% hash rate.
- Trung Quốc: ~21% (giảm mạnh từ mức trên 65% năm 2021).
- Kazakhstan: ~13%.
- Nga: ~10%.
- Canada: ~7%.

**Tập trung nhóm đào**: Các pool lớn nhất chiếm hơn một nửa tổng sức mạnh băm toàn mạng (tiêu biểu gồm Foundry USA, Antpool, F2Pool và Binance Pool).

**Rủi ro chính**: Can thiệp pháp lý từ một quốc gia duy nhất, nguy cơ thông đồng giữa các pool lớn để tấn công 51%, hoặc kiểm duyệt giao dịch ở tầng tạo mẫu khối.

**Giải pháp giảm thiểu**:
- **Stratum V2**: Cho phép từng thợ đào tự chọn giao dịch đưa vào mẫu khối thay vì phụ thuộc hoàn toàn vào pool.
- **P2Pool**: Mô hình pool phi tập trung dựa trên chuỗi chia sẻ (sharechain).
- **Đa dạng hóa địa lý** và khả năng chuyển đổi pool nhanh chóng của thợ đào.

### 6.2. Tranh luận về tính kháng ASIC

- **Quan điểm ủng hộ ASIC**: Tạo ra tổng hash rate rất cao giúp tăng bảo mật; phần cứng chuyên dụng khó bị trưng dụng cho mục đích tấn công; khoản đầu tư phần cứng lớn gắn chặt lợi ích của thợ đào với sự ổn định dài hạn của mạng lưới.
- **Quan điểm phản đối ASIC**: Dễ gây tập trung hóa vào vài nhà sản xuất chip, tạo rào cản gia nhập cao và làm phát sinh rác thải điện tử khi máy đào lỗi thời.
- **Hướng tiếp cận kháng ASIC**: Dùng thuật toán đòi hỏi nhiều bộ nhớ (Ethash, RandomX), thay đổi thuật toán định kỳ hoặc kết hợp nhiều thuật toán. Bitcoin chọn chấp nhận ASIC vì đánh giá lợi ích bảo mật vượt trội hơn rủi ro tập trung phần cứng.

### 6.3. Đào ích kỷ và tấn công giữ khối (Block Withholding)

**Đào ích kỷ (Selfish Mining)**:
```
Normal strategy: Found block → broadcast immediately
Selfish strategy: Found block → keep secret → strategic release

Example:
1. Attacker finds block n+1 (keeps secret)
2. Honest miners work on block n
3. Attacker finds block n+2 (still secret)
4. Honest miners find block n+1'
5. Attacker broadcasts n+1 and n+2
   → Longer chain → Honest block orphaned
```
Ngưỡng sinh lợi lý thuyết khoảng 25%–33% hash rate. Các biện pháp giảm thiểu gồm chọn ngẫu nhiên nhánh khi hòa, thưởng khối chú (uncle block rewards như Ethereum thời PoW) và tăng tốc lan truyền khối (FIBRE, Compact Blocks).

**Tấn công giữ khối (Block Withholding Attack)** nhắm vào pool đối thủ:
```
Attacker joins pool:
- Submits partial proofs (gets rewards shares)
- NEVER submits full solutions
- Pool wastes work, attacker gets paid anyway

Goal: Sabotage competitor pools
```
Tấn công này khó phân biệt với vận may kém trong ngắn hạn; các pool thường phòng chống bằng phân tích thống kê dài hạn và loại bỏ tài khoản bất thường.

### 6.4. Sự tiến hóa của thị trường phí và kỷ nguyên hậu trợ cấp

Diễn biến phí giao dịch trong lịch sử rất biến động: từ ~0,0001 BTC giai đoạn 2009–2016 lên đỉnh trên 50 USD (2017) và trên 60 USD (2021), trước khi dao động quanh 1–20 USD tùy mức độ tắc nghẽn (2024). Hai cơ chế hỗ trợ điều chỉnh phí gồm **Replace-by-Fee (RBF)** (thay giao dịch chưa xác nhận bằng giao dịch trả phí cao hơn) và **Child-Pays-for-Parent (CPFP)** (tạo giao dịch con trả phí cao để khuyến khích thợ đào gộp luôn giao dịch cha).

Sau khoảng năm 2140, khi trợ cấp khối về 0 và chỉ còn phí giao dịch, câu hỏi mở đặt ra là liệu nguồn phí có đủ duy trì mức bảo mật cao hay không: quan điểm lạc quan kỳ vọng giá BTC và thị trường phí trưởng thành kết hợp Layer 2 sẽ đủ bù đắp, trong khi quan điểm thận trọng lo ngại hash rate suy giảm và đặt vấn đề về cơ chế phát hành đuôi (tail emission).

### 6.5. Vấn đề khối rỗng (Empty Blocks)

Khoảng 1%–3% số block được đào chỉ chứa duy nhất giao dịch coinbase mà không có giao dịch người dùng nào khác. Nguyên nhân chủ yếu không hẳn do ác ý mà do tối ưu **SPV mining**: thợ đào bắt đầu đào khối mới ngay khi nhận được block header của khối trước (tiết kiệm ~100 ms xác thực giao dịch) để giành lợi thế thời gian, chấp nhận bỏ qua phần phí giao dịch nhỏ.

---

## 7. Các khái niệm liên quan

### 7.1. Các cơ chế chia thưởng của Mining Pool

- **Pay-Per-Share (PPS)**: Trả cố định cho mỗi share hợp lệ gửi lên; thợ đào không chịu rủi ro phương sai nhưng phí pool cao hơn (3%–5%) vì pool gánh rủi ro.
- **Proportional (PROP)**: Chia thưởng theo tỷ lệ số share đóng góp trong từng vòng đào; phí thấp (1%–2%) nhưng phương sai cao và dễ bị khai thác kiểu nhảy pool (pool hopping).
- **Pay-Per-Last-N-Shares (PPLNS)**: Chia thưởng dựa trên \( N \) share gần nhất thay vì theo từng vòng riêng lẻ; phí trung bình (2%–3%) và chống nhảy pool hiệu quả hơn.

### 7.2. Đào gộp (Merged Mining)

Cho phép dùng chung một công sức băm để đào đồng thời nhiều blockchain (ví dụ: Bitcoin và Namecoin) bằng cách nhúng dữ liệu tiêu đề của chuỗi phụ vào giao dịch coinbase của chuỗi chính. Chuỗi nhỏ nhờ đó thừa hưởng thêm bảo mật từ hash rate của chuỗi lớn, đổi lại giao dịch coinbase lớn hơn và đòi hỏi hỗ trợ tương thích ở tầng giao thức.

### 7.3. Giao thức Stratum

Giao thức kết nối giữa thợ đào và pool:
- **Stratum V1**: Pool toàn quyền chọn giao dịch và gửi mẫu khối cho thợ đào, làm tăng mức độ tập trung ở khâu chọn giao dịch.
- **Stratum V2**: Cho phép thợ đào tự chọn giao dịch, tăng tính phi tập trung, giảm lưu lượng truyền tải và bổ sung mã hóa đầu cuối.

```json
{
  "id": 1,
  "method": "mining.notify",
  "params": [
    "job_id",
    "prev_hash",
    "coinbase1",
    "coinbase2",
    "merkle_branches",
    "version",
    "nbits",
    "ntime",
    "clean_jobs"
  ]
}
```

### 7.4. Tối ưu ASICBoost

ASICBoost là kỹ thuật tối ưu khai thác cấu trúc nội bộ của SHA-256 để tiết kiệm khoảng 20% năng lượng tính toán. **Overt ASICBoost** (điều chỉnh các bit phiên bản trong block header) dễ nhận diện trên chuỗi và tương thích với nâng cấp giao thức, trong khi **Covert ASICBoost** (thay đổi thứ tự giao dịch để tìm trùng lặp) không tương thích với SegWit và từng gây nhiều tranh cãi.

### 7.5. Các thuật toán PoW thay thế

- **Ethash** (Ethereum trước The Merge): Đòi hỏi bộ nhớ lớn (~4 GB RAM) nhằm hạn chế ASIC ban đầu, nhưng về sau vẫn xuất hiện ASIC chuyên dụng.
- **RandomX** (Monero): Tối ưu cho CPU đa dụng và cập nhật định kỳ để duy trì tính kháng ASIC cao.
- **Equihash** (Zcash): Thiết kế hướng bộ nhớ nhưng cuối cùng vẫn có máy ASIC hỗ trợ.

Thực tế cho thấy tính kháng ASIC tuyệt đối rất khó duy trì dài hạn vì động lực kinh tế luôn thúc đẩy các nhà sản xuất chế tạo phần cứng chuyên dụng.

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"Pricing via Processing or Combating Junk Mail"** | 1992 | Dwork, Naor | Đề xuất khái niệm Proof-of-Work đầu tiên |
| **"Hashcash - A Denial of Service Counter-Measure"** | 2002 | Adam Back | Ứng dụng PoW chống thư rác và DoS |
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Tích hợp PoW vào cơ chế đồng thuận phân tán |
| **"Majority is not Enough: Bitcoin Mining is Vulnerable"** | 2013 | Eyal, Sirer | Phân tích tấn công đào ích kỷ (selfish mining) |
| **"The Bitcoin Backbone Protocol: Analysis and Applications"** | 2015 | Garay, Kiayias, Leonardos | Chứng minh bảo mật hình thức cho giao thức PoW |
| **"Analysis of Bitcoin Pooled Mining Reward Systems"** | 2011 | Rosenfeld | Mô hình hóa toán học các cơ chế chia thưởng mining pool |
| **"Be Selfish and Avoid Dilemmas"** | 2016 | Sapirshtein et al. | Phân tích chiến lược đào ích kỷ tối ưu |
| **"On the Security and Performance of PoW Blockchains"** | 2016 | Gervais et al. | Phân tích đánh đổi giữa bảo mật và hiệu năng PoW |
| **"Blockchain Mining Games"** | 2016 | Biais et al. | Phân tích hoạt động đào dưới góc độ lý thuyết trò chơi |
| **"Consensus Redux: Distributed Ledgers in the Face of Adversarial Supremacy"** | 2020 | Garay et al. | Nghiên cứu chuyên sâu về an toàn PoW |

**Tài liệu nên ưu tiên đọc**:
1. Mục 4 của Whitepaper Bitcoin (Proof-of-Work).
2. Bài báo *Majority is not Enough* của Eyal & Sirer.
3. *The Bitcoin Backbone Protocol*.
4. Bài báo phân tích mining pool của Rosenfeld.

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Minh họa quy trình đào** | [Anders Brownworth Demo](https://andersbrownworth.com/blockchain/blockchain) | Mô phỏng PoW tương tác |
| **Biểu đồ Hash Rate** | [Blockchain.com Charts](https://www.blockchain.com/charts/hash-rate) | Sức mạnh băm toàn mạng theo thời gian thực |
| **Lịch sử điều chỉnh độ khó** | [BitcoinWisdom](https://bitcoinwisdom.com/bitcoin/difficulty) | Biến động độ khó theo các chu kỳ |
| **Thị phần nhóm đào** | [BTC.com Pool Stats](https://btc.com/stats/pool) | Phân bổ hash rate giữa các pool |
| **Hiệu suất phần cứng ASIC** | [ASIC Miner Value](https://www.asicminervalue.com/) | So sánh thông số các dòng máy đào |
| **Sơ đồ Selfish Mining** | [Cornell Tech](https://www.cs.cornell.edu/~ie53/publications/btcProcFC.pdf) | Minh họa mô hình tấn công |
| **Ước lượng phí giao dịch** | [Mempool.space](https://mempool.space/) | Theo dõi thị trường phí trực tiếp |

**Công cụ tương tác**:
- [Bitcoin Mining Calculator](https://www.cryptocompare.com/mining/calculator/) — Ước tính lợi nhuận đào.
- [Difficulty Estimator](https://diff.cryptothis.com/) — Dự báo kỳ điều chỉnh độ khó tiếp theo.
- [Block Explorer](https://blockchair.com/bitcoin) — Tra cứu chi tiết các block thực tế.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. PoW là cơ chế đồng thuận kiểu xổ số: sức mạnh băm càng lớn, xác suất thắng càng cao.
2. Sử dụng băm kép SHA-256 so sánh với ngưỡng `Target` điều chỉnh động.
3. Độ khó tự cập nhật sau mỗi 2.016 block để giữ nhịp độ trung bình 10 phút/block.
4. Hoạt động đào có lãi khi phần thưởng khối cộng phí vượt chi phí phần cứng, điện năng và vận hành.

**Cơ chế kỹ thuật và bảo mật**:
- Đào khối: tìm `nonce` sao cho `hash(header) < target`.
- Tấn công 51%: đòi hỏi trên 50% hash rate, chi phí phần cứng ước tính nhiều tỷ USD.
- Đào ích kỷ: có thể sinh lợi về lý thuyết từ ngưỡng 25%–33% hash rate.
- Chi tiêu gấp đôi: xác suất thành công giảm theo hàm mũ khi số xác nhận tăng.

**Kinh tế học và thách thức**:
- Phần thưởng khối giảm một nửa sau mỗi 210.000 block (6,25 BTC giai đoạn 2020–2024; 3,125 BTC từ halving 2024).
- Các mining pool giúp giảm phương sai thu nhập nhưng tạo thách thức tập trung hóa.
- Tiêu thụ năng lượng (~150 TWh/năm) và câu hỏi về độ an toàn sau năm 2140 khi chỉ còn phí giao dịch vẫn là những bài toán dài hạn.

**Điểm chốt**: Proof-of-Work chuyển hóa tài nguyên vật lý (phần cứng và điện năng) thành bảo mật số thông qua bài toán mật mã và cơ chế cân bằng kinh tế tự điều tiết.

---

✅ **Kết thúc Lecture 01.01**

**Bài tiếp theo**: Lecture 01.02 - Kinh tế học Bitcoin, Lý thuyết trò chơi và Chính sách tiền tệ

---

## Video tham khảo

- **Xem trước:** [But how does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4) — 3Blue1Brown, tiếng Anh. Phần giải thích cơ chế đào cho thấy cách hoạt động của `nonce` và ngưỡng mục tiêu; nên xem trước mục mining và target.
- [Bitcoin Mining Difficulty Made Simple! | Hashpower Academy](https://www.youtube.com/watch?v=qrvdXAf1UOY) — Hashpower Academy, tiếng Anh. Giải thích cách điều chỉnh độ khó theo thời gian tạo khối, phù hợp đối chiếu với công thức trong bài.
- [Cryptoeconomics - 3.5 - Bitcoin: Selfish Mining](https://www.youtube.com/watch?v=SWKjSEi-9pg) — Cryptoeconomics Study, tiếng Anh. Phân tích chiến lược selfish mining và lý do dưới 50% hashrate vẫn có thể trục lợi, khớp với phần phân tích bảo mật.

## References

1. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.
2. Back, A. (2002). *Hashcash - A denial of service counter-measure*.
3. Eyal, I., & Sirer, E. G. (2014). *Majority is not enough: Bitcoin mining is vulnerable*. FC 2014.
4. Garay, J., Kiayias, A., & Leonardos, N. (2015). *The bitcoin backbone protocol*. EUROCRYPT 2015.
5. Rosenfeld, M. (2011). *Analysis of bitcoin pooled mining reward systems*. arXiv:1112.4980.
6. Sapirshtein, A., Sompolinsky, Y., & Zohar, A. (2016). *Optimal selfish mining strategies*. FC 2016.
7. Cambridge Bitcoin Electricity Consumption Index: https://cbeci.org/
