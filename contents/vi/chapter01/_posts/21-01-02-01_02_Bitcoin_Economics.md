---
layout: post
title: "Lecture 01.02: Bitcoin Economics, Game Theory, và Monetary Policy"
chapter: '01'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter01
---

# Lecture: Bitcoin Economics, Game Theory, và Monetary Policy

Xuyên suốt hàng nghìn năm lịch sử, mọi hệ thống tiền tệ đều xoay quanh hai cực: vàng khan hiếm nhờ địa chất nhưng nặng nề khó vận chuyển, còn tiền pháp định tiện lợi nhưng cung tiền có thể được ngân hàng trung ương in thêm bất cứ lúc nào. Khi thiết kế Bitcoin, Satoshi Nakamoto đã nhúng thẳng **một chính sách tiền tệ bất biến bằng toán học** vào mã nguồn giao thức: lịch trình phát hành giảm một nửa sau mỗi 210.000 khối (khoảng 4 năm) và hội tụ chặt chẽ về trần **21 triệu BTC**.

Nhưng Bitcoin không chỉ là một công thức cung tiền. An ninh của cả mạng lưới trị giá hàng trăm tỷ đô la được bảo vệ bởi **lý thuyết trò chơi**: khi phần thưởng khối giảm dần về 0 trong tương lai, liệu phí giao dịch có đủ duy trì ngân sách bảo mật hay không? Và tại sao một thợ đào nắm 30% sức mạnh mạng lại có thể bị cám dỗ bởi chiến lược **khai thác ích kỷ (selfish mining)**? Bài học này mở khóa lớp kinh tế học và lý thuyết trò chơi đằng sau Bitcoin.

---

## Bản đồ kiến thức nền: Kinh tế học Bitcoin đứng trên ba trụ cột toán học – kinh tế nào?

Với nền tảng giải tích chuỗi số, xác suất và kinh tế vi mô đại học, bạn có thể nắm trọn cấu trúc kinh tế của Bitcoin qua ba trụ cột:

### 1. Chính sách tiền tệ thuật toán và Chuỗi cấp số nhân hội tụ
Khác với ngân hàng trung ương điều chỉnh lãi suất theo chu kỳ kinh tế, cung tiền Bitcoin là một **hàm tất định theo độ cao khối**. Nhờ tổng cấp số nhân có công bội $$r = 1/2$$, nguồn cung mới giảm dần theo hàm mũ và không bao giờ vượt quá 21 triệu BTC — tạo ra khái niệm **khan hiếm kỹ thuật số có thể kiểm chứng**.

### 2. Ngân sách bảo mật (Security Budget) và Thị trường phí giao dịch
Doanh thu của thợ đào mỗi khối gồm hai phần: **phần thưởng khối mới đúc (block subsidy)** và **phí giao dịch (transaction fees)**. Ở trạng thái cân bằng cạnh tranh, tổng chi phí điện năng và phần cứng mà thợ đào sẵn sàng chi ra mỗi ngày xấp xỉ đúng doanh thu khối — chính chi phí ấy tạo thành "bức tường thành" bảo vệ chuỗi khỏi tấn công 51%. Khi phần thưởng khối tiến về 0 qua nhiều chu kỳ Halving, thị trường đấu giá không gian khối (phí giao dịch) phải gánh vai trò nuôi sống ngân sách bảo mật.

### 3. Lý thuyết trò chơi khai thác (Mining Game Theory)
Phân tích của Satoshi giả định thợ đào chỉ chọn giữa "trung thực" hoặc "tấn công phá hoại 51%". Nhưng công trình đột phá của Ittay Eyal và Emin Gün Sirer (2014) chỉ ra một chiến lược trung gian tinh vi hơn — **Selfish Mining**: giữ bí mật khối vừa đào được để tạo nhánh riêng làm lãng phí công sức của thợ đào trung thực. Nhờ lý thuyết trò chơi (chuỗi Markov), ta tính được ngưỡng hashrate chính xác nơi hành vi trung thực không còn là cân bằng Nash!

---

### Khung giải thích: tự tay chứng minh trần 21 triệu BTC và tính lạm phát sau Halving (nên đọc chậm)

Hãy kiểm chứng các con số cốt lõi của chính sách tiền tệ Bitcoin chỉ bằng công thức cấp số nhân phổ thông:

1. **Vì sao tổng cung Bitcoin hội tụ đúng về 21 triệu BTC?**
   - Mỗi kỷ nguyên (halving era) kéo dài đúng $$210\,000$$ khối ($$210\,000 \times 10\text{ phút} \approx 4\text{ năm}$$).
   - Kỷ nguyên 0 (2009–2012) thưởng $$50\text{ BTC/khối}$$; kỷ nguyên 1 thưởng $$25$$; kỷ nguyên 2 thưởng $$12.5$$; kỷ nguyên $$k$$ thưởng $$\frac{50}{2^k}\text{ BTC}$$.
   - Lấy tổng cấp số nhân vô hạn với công bội $$r = \frac{1}{2}$$:
     $$
     S_{\max} = 210\,000 \times \sum_{k=0}^{\infty} \frac{50}{2^k} = 210\,000 \times 50 \times \frac{1}{1 - 1/2} = 210\,000 \times 100 = \mathbf{21\,000\,000\text{ BTC}}!
     $$
   - (Chi tiết triển khai thực tế: vì Bitcoin chỉ chia nhỏ tới $$1\text{ satoshi} = 10^{-8}\text{ BTC}$$ và làm tròn xuống theo phép dịch bit số nguyên, sau 33 lần halving phần thưởng giảm hẳn về $$0$$ vào khoảng năm 2140, nên tổng cung thực tế xấp xỉ $$20\,999\,999.9769\text{ BTC}$$.)
2. **Tính tay tỉ lệ lạm phát nguồn cung sau Halving lần 4 (tháng 4/2024):**
   - Phần thưởng hiện tại: $$\frac{50}{2^4} = \mathbf{3.125\text{ BTC/khối}}$$.
   - Với trung bình $$144$$ khối/ngày ($$24 \times 6$$), lượng BTC đúc mới mỗi ngày là $$144 \times 3.125 = 450\text{ BTC}$$, tức khoảng $$450 \times 365 = 164\,250\text{ BTC/năm}$$.
   - Chia cho lượng cung đang lưu hành khoảng $$19.7\text{ triệu BTC}$$, tỉ lệ lạm phát nguồn cung hằng năm chỉ còn:
     $$
     \frac{164\,250}{19\,700\,000} \approx \mathbf{0.83\%/\text{năm}}
     $$
     — lần đầu tiên thấp hơn cả tốc độ tăng nguồn cung vàng khai thác hằng năm (khoảng $$1.5\text{–}2\%$$)!

---

## 1. Tổng quan về khái niệm

Bitcoin không chỉ là một thiết kế kỹ thuật phân tán mà còn là một **thử nghiệm tiền tệ** đặc biệt: một hệ thống tiền kỹ thuật số có chính sách phát hành được lập trình cứng trong giao thức và không chịu sự điều chỉnh đơn phương của bất kỳ cơ quan trung ương nào.

**Đổi mới về bản chất khan hiếm**:

Trước Bitcoin, các hình thức tiền tệ thường dựa trên một trong hai cơ sở:
1. **Khan hiếm vật lý** (vàng, bạc): Khó tạo thêm do giới hạn trữ lượng tự nhiên.
2. **Niềm tin thể chế** (tiền pháp định — fiat): Nguồn cung phụ thuộc vào chính sách của chính phủ và ngân hàng trung ương.

Bitcoin giới thiệu dạng thứ ba là **khan hiếm kỹ thuật số (digital scarcity)**, được đảm bảo bằng toán học, mật mã học và đồng thuận mạng lưới thay vì đặc tính vật lý hay thể chế trung tâm.

**Nguồn cung cố định 21 triệu BTC**:

Giới hạn tổng cung 21 triệu BTC được quy định trực tiếp trong mã giao thức và thực thi bởi toàn bộ các nút mạng. Không một cá nhân, doanh nghiệp hay chính phủ nào có thể đơn phương thay đổi giới hạn này nếu không có sự đồng thuận của đa số mạng lưới.

```
Traditional Money Supply:
Government decides → Central bank prints → Money supply increases
Result: Inflation controlled by human decisions

Bitcoin Supply:
Protocol decides → Mathematics enforces → Fixed at 21 million
Result: Inflation schedule predictable, predetermined
```

**Hệ thống động lực kinh tế**:

Bên cạnh kỹ thuật, thiết kế của Bitcoin vận dụng **lý thuyết trò chơi (game theory)** để gắn kết lợi ích của các nhóm tham gia với sự ổn định chung của mạng:
1. **Thợ đào (Miners)**: Nhận phần thưởng khối và phí giao dịch để đổi lấy việc bảo vệ sổ cái.
2. **Người dùng (Users)**: Hưởng lợi từ hệ thống thanh toán an toàn và kháng kiểm duyệt.
3. **Người nắm giữ (Holders)**: Gắn lợi ích với tính khan hiếm và hiệu ứng mạng lưới.
4. **Nhà phát triển (Developers)**: Đóng góp mã nguồn mở dựa trên uy tín và lợi ích dài hạn của hệ sinh thái.

Mục tiêu cốt lõi của thiết kế là khiến **hành xử trung thực mang lại lợi ích cao hơn tấn công**, ngay cả đối với những tác nhân có nguồn lực lớn.

**Bối cảnh lịch sử — Thông điệp trong khối nguyên thủy**:

Khối đầu tiên của Bitcoin (Genesis Block, ngày 03/01/2009) chứa dòng văn bản:

> "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"

Đây là tiêu đề trên tờ *The Times* về gói cứu trợ ngân hàng thứ hai tại Anh trong khủng hoảng tài chính năm 2008, phản ánh động lực ban đầu của Bitcoin trong việc đề xuất một phương án thay thế cho hệ thống ngân hàng tập trung.

**Bitcoin dưới góc độ "tiền tệ lành mạnh" (Sound Money)**:

Những người ủng hộ thường đối chiếu Bitcoin với các thuộc tính truyền thống của vàng gồm tính khan hiếm, bền vững, dễ chia nhỏ (tới 8 chữ số thập phân, 100 triệu satoshi mỗi BTC), dễ vận chuyển toàn cầu, có tính thay thế về mặt kỹ thuật và dễ xác minh bằng mật mã. Ngoài ra, Bitcoin còn có các đặc tính riêng của tài sản số như khả năng lập trình điều kiện chi tiêu, tính minh bạch công khai, kháng kiểm duyệt và không bị giới hạn biên giới.

---

## 2. Hiểu biết trực quan

### 2.1. Lịch trình phát hành — "Đào vàng kỹ thuật số theo cấp độ"

Có thể hình dung lịch trình phát hành Bitcoin như một trò chơi đào vàng có độ khó tăng dần theo từng chu kỳ 4 năm:

**Giai đoạn 1 (2009–2012)**:
```
- Block reward: 50 BTC
- Difficulty: Low (can mine on laptop)
- Total mined per day: 7,200 BTC
- Like: Finding gold nuggets on surface
```

**Giai đoạn 2 (2012–2016)**:
```
- Block reward: 25 BTC (first halving!)
- Difficulty: Higher (need GPU)
- Total mined per day: 3,600 BTC
- Like: Need to dig deeper for gold
```

**Giai đoạn 3 (2016–2020)**:
```
- Block reward: 12.5 BTC
- Difficulty: Very high (need ASICs)
- Total mined per day: 1,800 BTC
- Like: Need industrial mining equipment
```

**Giai đoạn 4 (2020–2024)**:
```
- Block reward: 6.25 BTC
- Difficulty: Extreme
- Total mined per day: 900 BTC
- Like: Mining from deep underground
```

Các giai đoạn tiếp theo tiếp tục giảm một nửa phần thưởng sau mỗi ~4 năm cho tới khoảng năm 2140 khi gần như toàn bộ 21 triệu BTC đã được phát hành.

### 2.2. Sự kiện Halving — "Cú sốc nguồn cung theo lịch định sẵn"

Mỗi lần halving cắt giảm 50% lượng Bitcoin mới tạo ra mỗi ngày, tương tự một cú sốc nguồn cung được báo trước trên thị trường hàng hóa:

```
Before Halving:
└─ Daily Production: 900 BTC
└─ Mining Cost: $X
└─ Price: $Y

After Halving:
└─ Daily Production: 450 BTC (50% reduction!)
└─ Mining Cost: Still $X (same difficulty initially)
└─ Price: ??? (market decides)

Miner Decision:
If Price stays same → Unprofitable miners turn off
If Price doubles → All miners remain profitable
Reality: Usually somewhere in between
```

**Diễn biến giá tham khảo qua các kỳ halving**:
```
Halving 1 (Nov 2012): 50 → 25 BTC
  Before: ~$12/BTC
  After (1 year): ~$1,000/BTC (83x increase!)

Halving 2 (July 2016): 25 → 12.5 BTC
  Before: ~$650/BTC
  After (1 year): ~$2,500/BTC (4x increase)
  After (2 years): ~$20,000/BTC (30x increase!)

Halving 3 (May 2020): 12.5 → 6.25 BTC
  Before: ~$9,000/BTC
  After (1 year): ~$60,000/BTC (7x increase!)
  After (2 years): ~$20,000/BTC (bear market)
  
Halving 4 (April 2024): 6.25 → 3.125 BTC
  Before: ~$65,000/BTC
```

**Tỷ số Stock-to-Flow (Dự trữ trên Dòng chảy)**:
```
Stock = Total existing supply
Flow = New production per year

Stock-to-Flow Ratio = Stock / Flow

Higher ratio = More scarce

Gold: ~62 (takes 62 years of production to match current stock)
Bitcoin pre-halving 4: ~56
Bitcoin post-halving 4: ~112 (more scarce than gold!)
```

### 2.3. Thị trường phí — "Đấu giá chỗ ngồi trong không gian khối"

Thị trường phí giao dịch hoạt động giống như một cuộc đấu giá vé cho một chuyến xe buýt có số chỗ cố định:

```
Bus (Block):
- Capacity: ~2,000 seats (transactions)
- Frequency: Every 10 minutes
- Driver (Miner): Picks highest-paying passengers

Low Congestion:
└─ Few people waiting
└─ Fees: ~$1 (minimum)
└─ Everyone gets on

High Congestion:
└─ Many people waiting (10,000+ transactions in mempool)
└─ Fees: $20, $50, $100+
└─ Priority auction: Highest bidders get on first

Result: Market-based pricing for block space
```

**Ví dụ thực tế trong đợt tăng nóng năm 2021**:
```
Mempool: 200 MB of unconfirmed transactions
Block size: ~1-2 MB
Wait time for low fee tx: Days or weeks!

Fee evolution:
- Normal: $1-2
- Busy: $10-20
- Extreme: $50-100+

Some people paid $100 in fees to move $500 in BTC!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Đặc tả toán học chính sách tiền tệ Bitcoin

**Công thức trợ cấp khối (tính theo satoshi)**:

\[
\text{Reward}(h) = \frac{50 \times 10^8}{2^{\lfloor h / 210000 \rfloor}} \text{ satoshis}
\]

Trong đó \( h \) là chiều cao khối, \( 10^8 \) là số satoshi trong 1 BTC và 210.000 là số block giữa hai kỳ halving (~4 năm).

**Cài đặt trong Bitcoin Core (C++)**:
```cpp
CAmount GetBlockSubsidy(int nHeight, const Consensus::Params& consensusParams)
{
    int halvings = nHeight / consensusParams.nSubsidyHalvingInterval;
    
    // Force block reward to zero when right shift is undefined
    if (halvings >= 64)
        return 0;
    
    CAmount nSubsidy = 50 * COIN;  // 50 BTC in satoshis
    
    // Subsidy is cut in half every 210,000 blocks
    // which will occur approximately every 4 years
    nSubsidy >>= halvings;  // Right shift = divide by 2^halvings
    
    return nSubsidy;
}
```

**Tính tổng cung bằng cấp số nhân**:

\[
\text{Total Supply} = \sum_{i=0}^{63} 210000 \times \frac{50}{2^i}
\]

\[
\begin{align}
S &= 210000 \times 50 \times \left(1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \cdots\right) \\
&= 210000 \times 50 \times \sum_{i=0}^{\infty} \left(\frac{1}{2}\right)^i \\
&= 210000 \times 50 \times \frac{1}{1 - 1/2} \\
&= 210000 \times 50 \times 2 \\
&= 21,000,000 \text{ BTC}
\end{align}
\]

**Bảng lịch trình phát hành**:

| Chu kỳ | Khoảng block | Phần thưởng/block | BTC đào thêm | Lũy kế | % Tổng cung |
|--------|--------|--------------|-----------|------------|------------|
| 0 | 0–209.999 | 50 | 10.500.000 | 10.500.000 | 50,0% |
| 1 | 210.000–419.999 | 25 | 5.250.000 | 15.750.000 | 75,0% |
| 2 | 420.000–629.999 | 12,5 | 2.625.000 | 18.375.000 | 87,5% |
| 3 | 630.000–839.999 | 6,25 | 1.312.500 | 19.687.500 | 93,75% |
| 4 | 840.000–1.049.999 | 3,125 | 656.250 | 20.343.750 | 96,875% |
| ... | ... | ... | ... | ... | ... |
| 32 | 6.720.000–6.929.999 | 0,00000116 | 0,24 | ~21.000.000 | ~100% |
| 64+ | 13.440.000+ | 0 | 0 | 21.000.000 | 100% |

Satoshi cuối cùng dự kiến được đào vào khoảng năm 2140; sau mốc này phần thưởng của thợ đào hoàn toàn đến từ phí giao dịch.

### 3.2. Tỷ lệ lạm phát nguồn cung theo thời gian

\[
\text{Inflation Rate} = \frac{\text{New Supply (year)}}{\text{Existing Supply}} \times 100\%
\]

| Năm | Tỷ lệ phát hành năm | Tổng cung (Stock) | Lượng đào mới/năm (Flow) | Tỷ số Stock-to-Flow |
|------|-----------------|--------|-----------------|---------------|
| 2009 | ∞ (từ 0) | 0 → 2,6M | 2,6M | ~0 |
| 2012 | ~25% | 10,5M | 2,6M | 4 |
| 2016 | ~4,3% | 15,75M | 0,66M | 24 |
| 2020 | ~1,8% | 18,4M | 0,33M | 56 |
| 2024 | ~0,9% | 19,7M | 0,16M | 120 |
| 2028 | ~0,4% | 20,3M | 0,08M | 250 |
| 2032 | ~0,2% | 20,7M | 0,04M | 500 |
| 2140 | ~0% | 21M | ~0 | ∞ |

So sánh với tiền pháp định: tăng trưởng cung tiền M2 của USD giai đoạn 2000–2020 trung bình khoảng 7%/năm, trong khi tỷ lệ phát hành mới của Bitcoin giảm xuống dưới 1%/năm từ sau kỳ halving 2024 và khoảng 0,4%/năm vào năm 2028.

### 3.3. Động lực thị trường phí giao dịch

**Lựa chọn giao dịch từ góc độ thợ đào**:

Thợ đào tối đa hóa tổng phí thu được bằng cách chọn các giao dịch có **tỷ lệ phí trên kích thước ảo (`sat/vByte`)** cao nhất:

\[
\text{Fee Rate} = \frac{\text{Transaction Fee (satoshis)}}{\text{Virtual Size (vBytes)}}
\]

Bài toán đóng gói khối tối ưu (tương tự bài toán cái túi):
\[
\max \sum_{i \in \text{selected}} f_i \quad \text{subject to} \quad \sum_{i \in \text{selected}} s_i \leq S_{\max}
\]

Trong đó \( f_i \) là phí, \( s_i \) là kích thước giao dịch \( i \) và \( S_{\max} \) là dung lượng tối đa của khối (~4 MB trọng số với SegWit). Giải pháp tham lam (greedy) thực tế là sắp xếp giảm dần theo `fee/size` rồi chọn lần lượt cho đến khi đầy khối:

```python
def select_transactions(mempool, max_size):
    # Sort by fee rate (descending)
    sorted_txs = sorted(mempool, 
                       key=lambda tx: tx.fee / tx.size, 
                       reverse=True)
    
    selected = []
    total_size = 0
    total_fees = 0
    
    for tx in sorted_txs:
        if total_size + tx.size <= max_size:
            selected.append(tx)
            total_size += tx.size
            total_fees += tx.fee
        else:
            break  # Block full
    
    return selected, total_fees
```

**Ước lượng phí từ góc độ người dùng**:

Người dùng cần ước lượng mức phí phù hợp với thời gian xác nhận mong muốn dựa trên phân phối phí trong mempool:
\[
\text{Required Fee Rate} \approx P_{target}(\text{mempool fee distribution})
\]

```
Mempool state:
- 10 MB of pending transactions
- Next 6 blocks will clear ~6 MB

To get in next block:
└─ Need to be in top ~1 MB
└─ Fee rate threshold: ~50 sat/vByte

To get in next 3 blocks:
└─ Need to be in top ~3 MB  
└─ Fee rate threshold: ~20 sat/vByte

To get confirmed eventually:
└─ Minimum: ~1 sat/vByte
```

### 3.4. Kinh tế học của hoạt động đào

\[
\text{Profit} = \text{Revenue} - \text{Costs}
\]

**Doanh thu kỳ vọng mỗi ngày**:
\[
\text{Revenue per day} = \frac{\text{Hash Rate}}{\text{Network Hash Rate}} \times 144 \times (\text{Block Reward} + \text{Avg Fees})
\]

**Chi phí mỗi ngày**:
\[
\text{Costs per day} = \text{Electricity Cost} + \text{Hardware Amortization} + \text{Operations}
\]

**Chi phí điện năng mỗi ngày**:
\[
\text{Electricity Cost per day} = \text{Power (kW)} \times 24 \times \text{Price (\$/kWh)}
\]

**Ví dụ tính toán với máy đào Antminer S19 Pro**:
```
Hardware:
- Hash rate: 110 TH/s
- Power: 3,250 W
- Cost: $5,000
- Efficiency: 29.5 J/TH

Operating Costs:
- Electricity: $0.06/kWh
- Daily consumption: 3.25 kW × 24h = 78 kWh
- Daily cost: 78 × $0.06 = $4.68

Network Stats:
- Total hash rate: 600 EH/s = 600,000,000 TH/s
- Block reward: 6.25 BTC
- Avg fees: 0.1 BTC per block
- BTC price: $40,000

Daily Revenue:
= (110 / 600,000,000) × 144 × (6.25 + 0.1) × $40,000
= 0.000000183 × 144 × 6.35 × $40,000
= $6.71 per day

Daily Profit:
= $6.71 - $4.68 = $2.03 per day

Hardware Payback:
= $5,000 / $2.03 = 2,463 days ≈ 6.7 years

Breakeven Electricity Cost:
= $6.71 / 78 kWh = $0.086/kWh

Conclusion: Profitable at $0.06/kWh, but tight margins!
```

**Cân bằng Nash trong cạnh tranh đào**:
Ở trạng thái cân bằng cạnh tranh, doanh thu cận biên tiệm cận chi phí cận biên:
\[
\text{Marginal Revenue} = \text{Marginal Cost}
\]
Các thợ đào mới tiếp tục tham gia cho đến khi lợi nhuận ròng tiến gần về 0 (chỉ còn phần bù cho rủi ro và chi phí vốn).

### 3.5. Mô hình Stock-to-Flow (SF)

\[
\text{SF}(t) = \frac{S(t)}{F(t)} = \frac{\text{Cumulative Supply at time } t}{\text{Annual New Supply at time } t}
\]

Mô hình hồi quy hàm lũy thừa (được PlanB phổ biến):
\[
\text{Market Cap} = \exp(a) \times \text{SF}^b
\]
với các tham số ước lượng thực nghiệm \( a \approx 14.6 \) và \( b \approx 3.3 \), kéo theo dự phóng giá:
\[
\text{Price} = \frac{\text{Market Cap}}{\text{Supply}} = \frac{\exp(14.6) \times \text{SF}^{3.3}}{\text{Supply}}
\]

Nếu thay trực tiếp \( \text{SF} = 120 \) (sau halving 2024) vào biểu thức trên, giá trị tính ra lên tới khoảng 15,9 nghìn tỷ USD vốn hóa (~796.000 USD/BTC với ~20 triệu BTC), cho thấy mô hình ngoại suy cực kỳ nhạy với hệ số mũ \( b \) và gây nhiều tranh cãi.

**Các điểm phê bình chính đối với mô hình SF**:
- Tương quan trong quá khứ không đồng nghĩa với quan hệ nhân quả.
- Kích thước mẫu quá nhỏ (chỉ mới trải qua vài chu kỳ halving).
- Bỏ qua các yếu tố phía cầu và điều kiện vĩ mô.
- Giả định đơn giản hóa rằng chỉ riêng độ khan hiếm quyết định giá trị tài sản.

---

## 4. Công thức toán học và lý thuyết trò chơi

### 4.1. Lý thuyết trò chơi — Thế tiến thoái lưỡng nan của thợ đào (Miner's Dilemma)

Xét một thợ đào có tỷ trọng sức mạnh băm \( \alpha \), phần còn lại của mạng là \( 1 - \alpha \) với hai chiến lược: **trung thực** (công bố khối ngay lập tức) và **ích kỷ** (giữ khối có tính toán).

**Ma trận lợi ích (rút gọn)**:

|  | Những người khác trung thực | Những người khác ích kỷ |
|---|---|---|
| **Bạn trung thực** | \( \alpha R \) | \( \alpha R (1 - \epsilon) \) |
| **Bạn ích kỷ** | \( \alpha R (1 + \delta) \) | \( \alpha R (1 - \epsilon') \) |

Trong đó \( R \) là tổng phần thưởng khối, \( \delta \) là phần lợi ích tăng thêm khi đào ích kỷ đơn lẻ, còn \( \epsilon, \epsilon' \) là tổn thất do xung đột phân nhánh.

**Phân tích cân bằng Nash**:
- Nếu mọi thợ đào đều trung thực, mỗi người nhận đúng \( \alpha R \).
- Một thợ đào chỉ có động cơ lệch sang chiến lược ích kỷ khi \( \delta > 0 \) và vượt ngưỡng:
  \[
  \alpha > \frac{1 - \gamma}{3 - 2\gamma} \approx 0.25 - 0.33
  \]
- Tuy nhiên, nếu nhiều thợ đào cùng hành xử ích kỷ, xung đột tăng mạnh khiến tất cả cùng bị thiệt hại (lợi ích cá nhân mâu thuẫn với lợi ích tập thể). Trong thực tế, hành vi đào ích kỷ cũng dễ bị mạng lưới phát hiện, chịu rủi ro khối mồ côi và kém hấp dẫn hơn so với giả định lý thuyết.

### 4.2. Bi kịch của tài sản chung — Bài toán thị trường phí sau năm 2140

Khi trợ cấp khối bằng 0 và thợ đào chỉ sống bằng phí giao dịch, mỗi người dùng cá nhân muốn trả phí thấp nhưng lại kỳ vọng toàn mạng duy trì mức bảo mật cao — trong khi bảo mật lại phụ thuộc vào tổng lượng phí mọi người cùng đóng góp.

Hàm hữu dụng của người dùng \( i \):
\[
U_i = V_i - f_i - c \times (1 - S)
\]
trong đó \( V_i \) là giá trị giao dịch, \( f_i \) là mức phí trả, \( S = S(\sum_j f_j) \) là mức bảo mật toàn mạng và \( c \) là tổn thất nếu mạng kém an toàn.

**Tối ưu xã hội**:
\[
\sum_i f_i^* = \arg\max_{\{f_i\}} \left[\sum_i V_i - \sum_i f_i - N \times c \times (1 - S(\sum_i f_i))\right]
\]

**Cân bằng Nash** (mỗi người tối thiểu hóa phí của riêng mình khi coi phí của người khác cố định):
\[
f_i^{\text{NE}} < f_i^*
\]
Hệ quả là tình trạng đầu tư dưới mức tối ưu cho bảo mật (hiệu ứng ăn theo — free-rider problem). Các hướng bù đắp đang được thảo luận gồm áp lực khan hiếm không gian khối tự đẩy phí lên, các giải pháp Layer 2 gộp nhiều giao dịch để chia sẻ chi phí bảo mật lớp nền, hoặc thay đổi quy tắc mức phí tối thiểu (vốn gây nhiều tranh luận).

### 4.3. Điểm Schelling — Quy tắc đồng thuận xã hội

Không có cơ quan trung tâm, làm sao các nút phối hợp thống nhất về các tham số cốt lõi của giao thức? Lý thuyết trò chơi gọi đó là **điểm hội tụ (Schelling Point)** — những quy ước mà mọi người tự động hướng tới ngay cả khi không trao đổi trực tiếp:
1. Giới hạn tổng cung **21 triệu BTC**.
2. Thời gian tạo khối trung bình **10 phút**.
3. Kích thước khối nền **1 MB** (mở rộng qua SegWit).

Trạng thái hiện hữu giữ được tính ổn định chừng nào:
\[
\text{Cost of Deviation} > \text{Benefit of Change}
\]

Chẳng hạn, bất kỳ nỗ lực nào nhằm tăng giới hạn 21 triệu BTC đều vấp phải rủi ro phá vỡ khế ước xã hội về độ khan hiếm, gây phân nhánh chuỗi (hard fork) và làm suy giảm niềm tin. Trường hợp Bitcoin Cash (2017) cho thấy khi cộng đồng bị chia rẽ bởi hard fork, hiệu ứng mạng lưới bị phân tán:
\[
V_{\text{original}} + V_{\text{fork}} < V_{\text{unified}}
\]

### 4.4. Thiết kế cơ chế (Mechanism Design) của Bitcoin

Một cơ chế khuyến khích bền vững hướng tới ba tính chất:
1. **Tương thích động cơ (Incentive Compatibility — IC)**: Hành xử trung thực là tối ưu:
   \[
   \pi(\text{honest}) \geq \pi(\text{selfish}) \quad \forall i
   \]
   Đạt được khi không có bên nào vượt ngưỡng \( \alpha < 0.5 \) (chống tấn công 51%) và \( \alpha < 0.25\text{–}0.33 \) (chống đào ích kỷ).
2. **Tính hợp lý cá nhân (Individual Rationality — IR)**: Thợ đào sẵn sàng tham gia khi lợi nhuận kỳ vọng không âm (\( \pi(\text{honest}) \geq 0 \)), tức doanh thu bù đắp được chi phí điện năng và phần cứng.
3. **Cân bằng ngân sách (Budget Balance)**:
   \[
   \text{Block Rewards + Fees} \geq \text{Security Costs}
   \]
   Hiện nay trợ cấp khối vẫn chiếm trên 95% doanh thu của thợ đào; về dài hạn, khả năng chuyển dịch sang mô hình thuần phí giao dịch vẫn là câu hỏi mở:
   \[
   \lim_{t \to \infty} \frac{\text{Security Cost}}{\text{Transaction Volume}} = \text{?}
   \]

### 4.5. Hiệu ứng mạng lưới và Định luật Metcalfe

Theo định luật Metcalfe, giá trị của một mạng lưới kết nối tỷ lệ với bình phương số người dùng \( n \) (vì mỗi người có thể giao dịch với \( n - 1 \) người khác, tạo ra \( \frac{n(n-1)}{2} \approx \frac{n^2}{2} \) cặp kết nối):

\[
V \propto n^2
\]

Các nghiên cứu thực nghiệm trên dữ liệu Bitcoin thường đánh giá mối quan hệ theo dạng logarit dựa trên các chỉ số như số địa chỉ hoạt động, khối lượng giao dịch, hash rate, hoạt động phát triển mã nguồn và mức độ chấp nhận thanh toán:

\[
\log(\text{Market Cap}) = a + b \times \log(\text{Active Addresses})
\]

Nhiều ước lượng thực nghiệm ghi nhận \( b \approx 1.5\text{–}2 \), cho thấy mối quan hệ siêu tuyến tính và động lực tập trung thanh khoản mạnh vào mạng lưới dẫn đầu.

---

## 5. Minh họa triển khai

### 5.1. Thuật toán ước lượng phí giao dịch (Python)

```python
import statistics
from typing import List, Dict
from collections import defaultdict

class FeeEstimator:
    """Estimate appropriate transaction fees based on mempool state"""
    
    def __init__(self, target_blocks: int = 6):
        self.target_blocks = target_blocks  # Default: confirm within 6 blocks
        self.recent_blocks: List[Dict] = []
        self.mempool: List[Dict] = []
    
    def add_block(self, block: Dict):
        """Record confirmed block for fee statistics"""
        self.recent_blocks.append(block)
        
        # Keep last 100 blocks
        if len(self.recent_blocks) > 100:
            self.recent_blocks.pop(0)
    
    def update_mempool(self, mempool: List[Dict]):
        """Update current mempool state"""
        self.mempool = sorted(mempool, 
                             key=lambda tx: tx['fee_rate'], 
                             reverse=True)
    
    def estimate_fee_rate(self, confirmation_target: int = None) -> float:
        """
        Estimate required fee rate for target confirmation time
        
        Args:
            confirmation_target: Number of blocks (default: self.target_blocks)
        
        Returns:
            Estimated fee rate in sat/vByte
        """
        if confirmation_target is None:
            confirmation_target = self.target_blocks
        
        # Method 1: Historical confirmation rates
        historical_estimate = self._historical_method(confirmation_target)
        
        # Method 2: Current mempool analysis
        mempool_estimate = self._mempool_method(confirmation_target)
        
        # Combine estimates (weighted average)
        combined = 0.6 * mempool_estimate + 0.4 * historical_estimate
        
        # Add safety margin
        final_estimate = combined * 1.1
        
        return final_estimate
    
    def _historical_method(self, target_blocks: int) -> float:
        """Estimate based on recent block confirmation rates"""
        if not self.recent_blocks:
            return 1.0  # Default minimum
        
        # Get fee rates from recent blocks
        fee_rates = []
        for block in self.recent_blocks[-20:]:  # Last 20 blocks
            for tx in block.get('transactions', []):
                fee_rates.append(tx['fee_rate'])
        
        if not fee_rates:
            return 1.0
        
        # For faster confirmation, need higher percentile
        percentile = min(95, 50 + target_blocks * 7)
        
        import numpy as np
        return np.percentile(fee_rates, percentile)
    
    def _mempool_method(self, target_blocks: int) -> float:
        """Estimate based on current mempool state"""
        if not self.mempool:
            return 1.0
        
        # Estimate block space capacity
        block_capacity = 4_000_000  # ~4 MB SegWit blocks
        blocks_capacity = block_capacity * target_blocks
        
        # Calculate cumulative size from highest fee rate
        cumulative_size = 0
        threshold_fee_rate = 1.0
        
        for tx in self.mempool:
            cumulative_size += tx['size']
            
            if cumulative_size >= blocks_capacity:
                threshold_fee_rate = tx['fee_rate']
                break
        
        return threshold_fee_rate
    
    def simulate_confirmation_time(self, fee_rate: float, 
                                   num_simulations: int = 1000) -> Dict:
        """
        Simulate expected confirmation time for given fee rate
        
        Returns:
            Statistics on confirmation time
        """
        confirmation_times = []
        
        for _ in range(num_simulations):
            # Estimate position in mempool
            position = sum(1 for tx in self.mempool 
                          if tx['fee_rate'] > fee_rate)
            
            # Estimate blocks until confirmation
            block_capacity_txs = 2000  # Approximate
            blocks_needed = (position // block_capacity_txs) + 1
            
            # Add randomness (Poisson block times)
            import random
            actual_time = sum(random.expovariate(1/600) 
                            for _ in range(blocks_needed))
            
            confirmation_times.append(actual_time / 60)  # Convert to minutes
        
        return {
            'mean': statistics.mean(confirmation_times),
            'median': statistics.median(confirmation_times),
            'p10': statistics.quantiles(confirmation_times, n=10)[0],
            'p90': statistics.quantiles(confirmation_times, n=10)[8]
        }

# Example usage
if __name__ == "__main__":
    print("=== Bitcoin Fee Estimation ===\n")
    
    # Create estimator
    estimator = FeeEstimator(target_blocks=6)
    
    # Simulate mempool state
    mempool = [
        {'fee_rate': 50, 'size': 250, 'id': f'tx{i}'}
        for i in range(1000)
    ] + [
        {'fee_rate': 25, 'size': 250, 'id': f'tx{i}'}
        for i in range(1000, 3000)
    ] + [
        {'fee_rate': 10, 'size': 250, 'id': f'tx{i}'}
        for i in range(3000, 8000)
    ]
    
    estimator.update_mempool(mempool)
    
    print(f"Total mempool transactions: {len(mempool)}")
    print(f"Total mempool size: {sum(tx['size'] for tx in mempool) / 1e6:.2f} MB\n")
    
    # Estimate fees for different targets
    for target in [1, 3, 6, 12, 24]:
        fee_rate = estimator.estimate_fee_rate(target)
        print(f"Target: {target:2d} blocks (~{target*10:3d} min)")
        print(f"  Estimated fee rate: {fee_rate:.2f} sat/vByte")
        
        # Simulate confirmation
        stats = estimator.simulate_confirmation_time(fee_rate)
        print(f"  Expected confirmation: {stats['median']:.1f} min (median)")
        print(f"  Range: {stats['p10']:.1f} - {stats['p90']:.1f} min (80% interval)")
        print()
```

### 5.2. Công cụ tính toán lợi nhuận đào Bitcoin

```python
class MiningProfitabilityCalculator:
    """Calculate mining profitability under various scenarios"""
    
    def __init__(self, btc_price: float, network_hashrate: float):
        self.btc_price = btc_price  # USD per BTC
        self.network_hashrate = network_hashrate  # TH/s
        self.block_reward = 6.25  # BTC (current, will halve in 2024)
        self.blocks_per_day = 144
    
    def calculate_daily_revenue(self, miner_hashrate: float, 
                               avg_fees_per_block: float = 0.1) -> Dict:
        """
        Calculate expected daily mining revenue
        
        Args:
            miner_hashrate: Hash rate in TH/s
            avg_fees_per_block: Average fees in BTC
        
        Returns:
            Revenue breakdown
        """
        # Probability of finding block
        prob_per_block = miner_hashrate / self.network_hashrate
        
        # Expected blocks per day
        expected_blocks = prob_per_block * self.blocks_per_day
        
        # Revenue from block rewards
        block_reward_btc = expected_blocks * self.block_reward
        block_reward_usd = block_reward_btc * self.btc_price
        
        # Revenue from fees
        fee_reward_btc = expected_blocks * avg_fees_per_block
        fee_reward_usd = fee_reward_btc * self.btc_price
        
        return {
            'expected_blocks_per_day': expected_blocks,
            'expected_days_per_block': 1 / expected_blocks if expected_blocks > 0 else float('inf'),
            'block_reward_btc': block_reward_btc,
            'block_reward_usd': block_reward_usd,
            'fee_reward_btc': fee_reward_btc,
            'fee_reward_usd': fee_reward_usd,
            'total_btc': block_reward_btc + fee_reward_btc,
            'total_usd': block_reward_usd + fee_reward_usd
        }
    
    def calculate_costs(self, miner_hashrate: float, power_consumption: float,
                       electricity_cost: float, hardware_cost: float,
                       hardware_lifetime_days: int = 1095) -> Dict:
        """
        Calculate daily mining costs
        
        Args:
            miner_hashrate: Hash rate in TH/s
            power_consumption: Power in Watts
            electricity_cost: Cost per kWh in USD
            hardware_cost: Upfront hardware cost in USD
            hardware_lifetime_days: Expected lifetime
        
        Returns:
            Cost breakdown
        """
        # Electricity cost
        daily_kwh = (power_consumption / 1000) * 24
        daily_electricity = daily_kwh * electricity_cost
        
        # Hardware amortization
        daily_hardware_amortization = hardware_cost / hardware_lifetime_days
        
        # Operating costs (estimated 10% of electricity)
        daily_operating = daily_electricity * 0.1
        
        total_daily_cost = (daily_electricity + 
                           daily_hardware_amortization + 
                           daily_operating)
        
        return {
            'electricity_kwh': daily_kwh,
            'electricity_cost': daily_electricity,
            'hardware_amortization': daily_hardware_amortization,
            'operating_cost': daily_operating,
            'total_daily_cost': total_daily_cost
        }
    
    def analyze_profitability(self, miner_config: Dict) -> Dict:
        """Complete profitability analysis"""
        # Revenue
        revenue = self.calculate_daily_revenue(
            miner_config['hashrate'],
            miner_config.get('avg_fees', 0.1)
        )
        
        # Costs
        costs = self.calculate_costs(
            miner_config['hashrate'],
            miner_config['power'],
            miner_config['electricity_cost'],
            miner_config['hardware_cost'],
            miner_config.get('hardware_lifetime', 1095)
        )
        
        # Profitability
        daily_profit = revenue['total_usd'] - costs['total_daily_cost']
        daily_profit_btc = revenue['total_btc'] - (costs['total_daily_cost'] / self.btc_price)
        
        # ROI
        if daily_profit > 0:
            roi_days = miner_config['hardware_cost'] / daily_profit
        else:
            roi_days = float('inf')
        
        # Break-even electricity price
        breakeven_elec = (revenue['total_usd'] - costs['hardware_amortization'] - costs['operating_cost']) / costs['electricity_kwh']
        
        return {
            'revenue': revenue,
            'costs': costs,
            'daily_profit_usd': daily_profit,
            'daily_profit_btc': daily_profit_btc,
            'monthly_profit_usd': daily_profit * 30,
            'annual_profit_usd': daily_profit * 365,
            'roi_days': roi_days,
            'roi_months': roi_days / 30,
            'profit_margin': (daily_profit / revenue['total_usd'] * 100) if revenue['total_usd'] > 0 else 0,
            'breakeven_electricity_price': breakeven_elec
        }

# Example usage
if __name__ == "__main__":
    print("=== Bitcoin Mining Profitability Analysis ===\n")
    
    # Network parameters
    btc_price = 40000  # $40k per BTC
    network_hashrate = 600_000_000  # 600 EH/s = 600M TH/s
    
    calculator = MiningProfitabilityCalculator(btc_price, network_hashrate)
    
    # Miner configurations
    miners = {
        'Antminer S19 Pro': {
            'hashrate': 110,  # TH/s
            'power': 3250,  # Watts
            'hardware_cost': 5000,
            'electricity_cost': 0.06  # USD per kWh
        },
        'Antminer S19 XP': {
            'hashrate': 140,
            'power': 3010,
            'hardware_cost': 7000,
            'electricity_cost': 0.06
        },
        'WhatsMiner M50': {
            'hashrate': 126,
            'power': 3306,
            'hardware_cost': 5500,
            'electricity_cost': 0.06
        }
    }
    
    for miner_name, config in miners.items():
        print(f"\n{'='*60}")
        print(f"Miner: {miner_name}")
        print(f"{'='*60}")
        print(f"Hash rate: {config['hashrate']} TH/s")
        print(f"Power: {config['power']} W")
        print(f"Hardware cost: ${config['hardware_cost']:,}")
        print(f"Electricity: ${config['electricity_cost']}/kWh")
        
        analysis = calculator.analyze_profitability(config)
        
        print(f"\n--- Revenue (Daily) ---")
        print(f"Expected blocks: {analysis['revenue']['expected_blocks_per_day']:.4f}")
        print(f"Days per block: {analysis['revenue']['expected_days_per_block']:.1f}")
        print(f"Block rewards: {analysis['revenue']['block_reward_btc']:.6f} BTC (${analysis['revenue']['block_reward_usd']:.2f})")
        print(f"Fee rewards: {analysis['revenue']['fee_reward_btc']:.6f} BTC (${analysis['revenue']['fee_reward_usd']:.2f})")
        print(f"Total revenue: ${analysis['revenue']['total_usd']:.2f}")
        
        print(f"\n--- Costs (Daily) ---")
        print(f"Electricity: {analysis['costs']['electricity_kwh']:.2f} kWh (${analysis['costs']['electricity_cost']:.2f})")
        print(f"Hardware amortization: ${analysis['costs']['hardware_amortization']:.2f}")
        print(f"Operating: ${analysis['costs']['operating_cost']:.2f}")
        print(f"Total costs: ${analysis['costs']['total_daily_cost']:.2f}")
        
        print(f"\n--- Profitability ---")
        print(f"Daily profit: ${analysis['daily_profit_usd']:.2f} ({analysis['daily_profit_btc']:.6f} BTC)")
        print(f"Monthly profit: ${analysis['monthly_profit_usd']:.2f}")
        print(f"Annual profit: ${analysis['annual_profit_usd']:.2f}")
        print(f"Profit margin: {analysis['profit_margin']:.1f}%")
        print(f"ROI: {analysis['roi_months']:.1f} months")
        print(f"Breakeven electricity: ${analysis['breakeven_electricity_price']:.3f}/kWh")
        
        # Profitability verdict
        if analysis['daily_profit_usd'] > 0:
            print(f"\n✓ PROFITABLE at current prices")
        else:
            print(f"\n✗ NOT PROFITABLE at current prices")
```

---

## Video tham khảo

- **Xem trước:** [Bitcoin Halving 2024: How It's Different This Time, Myths Debunked, Bitcoin Bugs, and More](https://www.youtube.com/watch?v=vwkRsp0gqX4) — aantonop, tiếng Anh. Antonopoulos phân tích lịch halving và tác động của trợ cấp khối lên động lực thợ đào; nên xem trước mục chính sách tiền tệ.
- [Bitcoin Fees Explained](https://www.youtube.com/watch?v=EHYDeORj_tc) — Exodus, tiếng Anh. Minh họa cơ chế đấu giá phí giao dịch trong không gian khối, khớp với mô hình thị trường phí của bài.
- [EB76 – Emin Gün Sirer & Ittay Eyal: From Selfish Miners To The Miner's Dilemma](https://www.youtube.com/watch?v=DWielchhe00) — Epicenter Podcast, tiếng Anh. Eyal và Sirer thảo luận từ đào ích kỷ đến thế tiến thoái lưỡng nan của thợ đào, tương ứng phần lý thuyết trò chơi.
