---
layout: post
title: "Lecture 01.00: Bitcoin Architecture - Hệ thống tiền điện tử phi tập trung đầu tiên"
chapter: '01'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter01
---

# Lecture: Bitcoin Architecture - Hệ thống tiền điện tử phi tập trung đầu tiên

## 1. Tổng quan về khái niệm

Ngày 31 tháng 10 năm 2008, giữa bối cảnh khủng hoảng tài chính toàn cầu, một cá nhân hoặc nhóm tác giả ẩn danh lấy bút danh **Satoshi Nakamoto** đã công bố whitepaper *"Bitcoin: A Peer-to-Peer Electronic Cash System"* trên một diễn đàn thư điện tử về mật mã học. Tài liệu dài 9 trang này đặt nền móng cho sự ra đời của hệ thống tiền điện tử phi tập trung đầu tiên vận hành ổn định trong thực tế.

Bitcoin giải quyết bài toán chi tiêu gấp đôi (double-spending) mà không cần bên thứ ba tin cậy. Trước Bitcoin, các nỗ lực xây dựng tiền mặt số (digital cash) đều gặp một trong hai rào cản chính:
1. Phụ thuộc vào một cơ quan vận hành tập trung (như e-gold, DigiCash) nên dễ bị đóng cửa hoặc kiểm soát.
2. Không giải quyết được bài toán chi tiêu gấp đôi trong môi trường phân tán.

Thiết kế của Bitcoin kết hợp nhiều thành phần kỹ thuật đã có sẵn — hàm băm mật mã, chữ ký số, mạng ngang hàng (peer-to-peer) và cơ chế đồng thuận — thành một kiến trúc thống nhất gọi là **đồng thuận Nakamoto (Nakamoto Consensus)**:
- **Blockchain**: Sổ cái công khai lưu toàn bộ lịch sử giao dịch.
- **Proof-of-Work**: Cơ chế chọn người đề xuất khối theo xác suất dựa trên năng lực tính toán nhằm thống nhất thứ tự giao dịch.
- **Động lực kinh tế**: Thợ đào nhận thưởng bằng bitcoin mới phát hành cùng phí giao dịch.
- **Bảo mật mật mã**: Chữ ký số đảm bảo chỉ chủ sở hữu hợp pháp mới có quyền chi tiêu số tiền tương ứng.

**Các mục tiêu thiết kế của Bitcoin** (theo whitepaper):
1. **Ngang hàng (Peer-to-peer)**: Giao dịch trực tiếp không qua trung gian.
2. **Phi tập trung (Decentralized)**: Không tồn tại điểm kiểm soát hay điểm lỗi đơn.
3. **Không cần tin cậy (Trustless)**: Không yêu cầu người dùng đặt niềm tin vào một bên cụ thể.
4. **Kháng kiểm duyệt (Censorship-resistant)**: Không một thực thể đơn lẻ nào có thể tùy ý chặn giao dịch hợp lệ.
5. **Nguồn cung giới hạn (Limited supply)**: Tối đa 21 triệu BTC.
6. **Giả danh (Pseudonymous)**: Giao dịch gắn với địa chỉ mật mã thay vì trực tiếp với danh tính thực.

**Bối cảnh lịch sử**:

Bitcoin kế thừa nhiều thập kỷ nghiên cứu trước đó, đặc biệt từ **phong trào Cypherpunk** (thập niên 1990) gồm các nhà mật mã học và nhà nghiên cứu ủng hộ công nghệ bảo vệ quyền riêng tư như Adam Back, Nick Szabo và Hal Finney, cùng các hệ thống tiền thân:
- **DigiCash (1990)**: Công ty của David Chaum, kiến trúc tập trung, ngừng hoạt động năm 1998.
- **Hashcash (1997)**: Hệ thống Proof-of-Work của Adam Back, tiền đề trực tiếp cho cơ chế đào Bitcoin.
- **b-money (1998)**: Đề xuất lý thuyết của Wei Dai về tiền điện tử phân tán.
- **Bit Gold (2005)**: Đề xuất kiến trúc của Nick Szabo, chưa từng được triển khai thực tế.

**Các cột mốc chính của Bitcoin**:
- **31/10/2008**: Công bố whitepaper Bitcoin.
- **03/01/2009**: Khối nguyên thủy (Genesis Block — block 0) được đào, mang thông điệp nhúng: *"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"*, phản ánh bối cảnh khủng hoảng tài chính và hoạt động cứu trợ ngân hàng.
- **12/01/2009**: Giao dịch đầu tiên trên mạng lưới (Satoshi gửi 10 BTC cho Hal Finney).
- **22/05/2010**: Giao dịch mua bán hàng hóa thực tế đầu tiên (10.000 BTC đổi lấy 2 chiếc pizza, trị giá khoảng 41 USD lúc bấy giờ).
- **12/2010**: Satoshi ngừng xuất hiện công khai.
- **Từ 2011 đến nay**: Hệ sinh thái Bitcoin mở rộng mạnh mẽ, đạt vốn hóa trên 500 tỷ USD (tính đến năm 2024), thúc đẩy sự ra đời của hàng nghìn dự án tiền mã hóa khác cùng nhiều nghiên cứu về blockchain và chính sách tiền tệ số.

---

## 2. Hiểu biết trực quan

### 2.1. Bitcoin và phép so sánh "Vàng kỹ thuật số"

Bitcoin thường được so sánh với vàng vật chất qua các đặc tính tiền tệ:

**Vàng (Gold)**:
- Khan hiếm: Khó khai thác và trữ lượng tự nhiên có hạn.
- Bền vững: Không bị ăn mòn hay phân hủy theo thời gian.
- Dễ chia nhỏ: Có thể cân đo theo nhiều đơn vị khối lượng.
- Có tính thay thế (Fungible): Mỗi gam vàng nguyên chất có giá trị tương đương nhau.
- Được công nhận rộng rãi trên toàn cầu.
- Mang tính vật lý nên tốn chi phí lưu trữ và vận chuyển.

**Bitcoin**:
- Khan hiếm: Giới hạn cứng 21 triệu BTC trong mã giao thức.
- Bền vững: Tồn tại chừng nào mạng lưới blockchain còn hoạt động.
- Chia nhỏ linh hoạt: Chia tới 8 chữ số thập phân (\( 0.00000001 \) BTC = 1 satoshi).
- Có tính thay thế về mặt kỹ thuật: Mỗi đơn vị BTC tuân theo cùng một quy tắc giao thức.
- Được chấp nhận bởi hàng triệu người dùng trên thế giới.
- Hoàn toàn kỹ thuật số: Chuyển giao qua Internet không phụ thuộc biên giới địa lý.

### 2.2. Cách Bitcoin hoạt động qua phép ví quảng trường công khai

Hãy hình dung mạng Bitcoin như một **quảng trường công cộng đặt một cuốn sổ cái khổng lồ ở chính giữa**:

- **Sổ cái (Blockchain)**: Ai cũng có thể đọc toàn bộ lịch sử. Mỗi trang (block) ghi khoảng 2.000 giao dịch và được niêm phong bằng một mã băm đặc biệt.
- **Thợ đào (Miners)**: Hàng nghìn người đứng quanh quảng trường cùng cạnh tranh quyền viết trang tiếp theo bằng cách giải một bài toán mật mã khó (Proof-of-Work). Người giải được đầu tiên sẽ viết trang mới, nhận phần thưởng khối (6,25 BTC ở giai đoạn 2020–2024, sau đó giảm một nửa theo lịch halving) kèm phí giao dịch; toàn bộ những người khác kiểm tra và chấp nhận trang đó.

**Luồng một giao dịch**:
```
Alice muốn gửi 1 BTC cho Bob:

1. Alice broadcast: "I, Alice, send 1 BTC to Bob"
   - Ký bằng digital signature (chỉ Alice có thể tạo)

2. Miners nhặt transaction lên
   - Verify signature: "This really from Alice?"
   - Check balance: "Does Alice have 1 BTC?"

3. Miners đưa transaction vào block mới
   - Compete to solve puzzle
   - Winner broadcasts block

4. Other nodes verify và accept
   - Transaction now confirmed!
   - Bob có thể spend 1 BTC
```

**Bảo mật dựa trên công sức tính toán**:
Để gian lận sửa đổi lịch sử, kẻ tấn công phải viết lại block chứa giao dịch mục tiêu, viết lại toàn bộ các block đứng sau do chúng liên kết bằng hàm băm, và làm việc đó nhanh hơn tổng sức mạnh tính toán của toàn bộ mạng lưới trung thực. Với quy mô hàng nghìn thợ đào toàn cầu, kịch bản này gần như bất khả thi.

### 2.3. Mô hình UTXO — "Các đồng phỉnh tiền mặt số"

Bitcoin không lưu số dư theo kiểu "tài khoản ngân hàng" mà sử dụng mô hình **UTXO (Unspent Transaction Output — Đầu ra giao dịch chưa chi tiêu)**, tương tự việc sử dụng các tờ tiền mặt hoặc đồng phỉnh:

**Mô hình tài khoản ngân hàng (KHÔNG phải Bitcoin)**:
```
Alice's account: $100
Transfer $30 to Bob
Alice's account: $70
Bob's account: $30
```

**Mô hình UTXO (Bitcoin)**:
```
Alice có: [50 BTC chip] [30 BTC chip] [20 BTC chip]
Total: 100 BTC

Alice muốn gửi 60 BTC cho Bob:
1. Grab [50 BTC] và [30 BTC] chips (total 80 BTC)
2. Create new transaction:
   Inputs:  [50 BTC] + [30 BTC] = 80 BTC
   Outputs: [60 BTC → Bob]
            [19.99 BTC → Alice] (change)
            [0.01 BTC → Miner] (fee)
3. Destroy old chips [50] and [30]
4. Create new chips [60] and [19.99]

Result:
Alice có: [20 BTC] [19.99 BTC] = 39.99 BTC
Bob có: [60 BTC] = 60 BTC
```

**Ưu điểm của mô hình UTXO**:
- Cải thiện quyền riêng tư do không gom toàn bộ tiền vào một tài khoản cố định duy nhất.
- Dễ xử lý song song vì các UTXO độc lập nhau.
- Xác minh đơn giản: mỗi UTXO chỉ có thể được tiêu đúng một lần.

---

## 3. Nền tảng kỹ thuật

### 3.1. Kiến trúc mạng Bitcoin

Bitcoin vận hành trên một **mạng ngang hàng (P2P)** gồm nhiều loại nút có vai trò khác nhau:

1. **Nút đầy đủ (Full Nodes)** (~10.000–15.000 nút hoạt động):
   - Lưu trữ toàn bộ lịch sử blockchain (~500 GB).
   - Xác thực độc lập mọi giao dịch và block.
   - Chuyển tiếp giao dịch và block cho các nút lân cận.
   - Thực thi đầy đủ các quy tắc đồng thuận.

2. **Nút đào (Mining Nodes)** (tập con của full nodes):
   - Có đầy đủ chức năng của full node, đồng thời giải bài toán Proof-of-Work để tạo block mới và nhận phần thưởng khối.

3. **Nút nhẹ (Light Nodes / SPV — Simplified Payment Verification)**:
   - Chỉ lưu phần đầu khối (block headers, ~100 MB).
   - Không tự xác thực toàn bộ sổ cái mà dựa vào các full node và bằng chứng Merkle.
   - Phù hợp cho ví trên thiết bị di động.

4. **Nút lưu trữ toàn phần (Archive Nodes)**:
   - Lưu đầy đủ dữ liệu như full node kèm chỉ mục và lịch sử trạng thái chi tiết (dung lượng ~1 TB trở lên), thường dùng cho các trình khám phá blockchain (explorers).

**Giao tiếp mạng (Gossip Protocol)**:

```
         Internet
            │
    ┌───────┴───────┐
    │               │
 Node A          Node B
    │               │
    └───────┬───────┘
            │
         Node C
            │
    ┌───────┴───────┐
    │               │
 Node D          Node E
```

Mỗi nút thường kết nối với 8–125 nút ngang hàng (peers). Khi một giao dịch hoặc block mới xuất hiện, nó được lan truyền theo cơ chế tin đồn (gossip protocol) với tốc độ hàm mũ (khoảng 7 giây để tiếp cận 95% mạng lưới).

### 3.2. Cấu trúc giao dịch Bitcoin

```
Transaction
├── Version (4 bytes)
├── Input Count (variable)
├── Inputs (variable)
│   ├── Previous TXID (32 bytes) - Reference to previous transaction
│   ├── Output Index (4 bytes) - Which output of previous tx
│   ├── ScriptSig (variable) - Signature và public key
│   └── Sequence (4 bytes)
├── Output Count (variable)
├── Outputs (variable)
│   ├── Amount (8 bytes) - In satoshis
│   └── ScriptPubKey (variable) - Locking script
└── Locktime (4 bytes)
```

**Ví dụ một giao dịch ở định dạng JSON**:

```json
{
  "txid": "a1b2c3d4e5f6...",
  "version": 1,
  "locktime": 0,
  "vin": [
    {
      "txid": "previous_tx_id",
      "vout": 0,
      "scriptSig": {
        "asm": "3045... 0279...",
        "hex": "483045..."
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.5,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 ab68025513...",
        "hex": "76a914ab68...",
        "type": "pubkeyhash",
        "address": "1GdK9UzpHBzqzX2A9JFP3Di4weBwqgmoQA"
      }
    }
  ]
}
```

### 3.3. Ngôn ngữ Bitcoin Script

Bitcoin sử dụng **Script** — một ngôn ngữ lập trình dựa trên ngăn xếp (stack-based) và **không đầy đủ Turing (non-Turing-complete)** để quy định điều kiện chi tiêu của từng UTXO. Việc cố ý không hỗ trợ đầy đủ Turing giúp ngăn chặn vòng lặp vô hạn, đảm bảo chương trình luôn kết thúc và dễ ước lượng tài nguyên xác thực.

**Các loại Script phổ biến**:

**1. Pay-to-Public-Key-Hash (P2PKH)** — Giao dịch chuẩn truyền thống:
```
ScriptPubKey (Locking Script):
OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG

ScriptSig (Unlocking Script):
<Signature> <PubKey>

Combined execution:
<Signature> <PubKey> OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

**Các bước thực thi trên ngăn xếp**:
```
Stack:                  Operation:
[]                      <Signature> pushed
[Sig]                   <PubKey> pushed
[Sig, PubKey]           OP_DUP (duplicate top)
[Sig, PubKey, PubKey]   OP_HASH160 (hash top)
[Sig, PubKey, Hash]     <PubKeyHash> pushed
[Sig, PubKey, Hash, PKH] OP_EQUALVERIFY (check equal)
[Sig, PubKey]           OP_CHECKSIG (verify signature)
[1]                     Success!
```

**2. Pay-to-Script-Hash (P2SH)** — Thường dùng cho đa chữ ký:
```
ScriptPubKey: OP_HASH160 <RedeemScriptHash> OP_EQUAL
ScriptSig: <Sig1> <Sig2> ... <RedeemScript>
```

**3. Pay-to-Witness-Public-Key-Hash (P2WPKH)** — Chuẩn SegWit:
```
ScriptPubKey: OP_0 <PubKeyHash>
Witness: <Signature> <PubKey>
```

### 3.4. Cấu trúc Block

```
Block
├── Block Header (80 bytes)
│   ├── Version (4 bytes)
│   ├── Previous Block Hash (32 bytes)
│   ├── Merkle Root (32 bytes)
│   ├── Timestamp (4 bytes)
│   ├── Difficulty Target (4 bytes)
│   └── Nonce (4 bytes)
└── Transaction Data (variable, ~1-2 MB)
    ├── Transaction Count (variable)
    └── Transactions (variable)
```

**Chi tiết các trường trong Block Header**:
```
Version:           00000020 (hex) = 32 (decimal)
Previous Hash:     000000000000000000041fe...
Merkle Root:       7f16c5962e8bd963659c793...
Timestamp:         5e7e5e5e (hex) = 2020-03-27 12:34:06 UTC
Bits (Difficulty): 171007ea
Nonce:             282c7f00 (hex) = 673668864 (decimal)
```

**Khối nguyên thủy (Genesis Block — Block 0)**:
```
{
  "hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
  "timestamp": "2009-01-03 18:15:05",
  "nonce": 2083236893,
  "difficulty": 1,
  "coinbase": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
}
```

### 3.5. Tập UTXO (UTXO Set)

Trạng thái toàn cục của Bitcoin chính là tập hợp tất cả các đầu ra giao dịch chưa được chi tiêu (UTXO set).

**Cấu trúc một mục UTXO**:
```
UTXO = {
  txid: transaction ID,
  vout: output index,
  amount: value in satoshis,
  scriptPubKey: spending condition,
  height: block height created
}
```

**Thống kê tham khảo (năm 2024)**:
- Tổng số UTXO: ~80–100 triệu.
- Dung lượng tập UTXO: ~5–6 GB.
- Tổng giá trị: ~19,5 triệu BTC.

**Hiệu năng xử lý**:
Các nút đầy đủ thường lưu tập UTXO trong bộ nhớ đệm để tra cứu nhanh. Khi xác thực giao dịch, nút kiểm tra các đầu vào có tồn tại trong tập UTXO hay không; khi bổ sung một block mới, nút xóa các UTXO đã tiêu và thêm các UTXO mới tạo ra.

---

## 4. Công thức toán học và mật mã học

### 4.1. Quy trình sinh địa chỉ Bitcoin

\[
\begin{align}
\text{Private Key} &\xrightarrow{\text{random}} k \in [1, n-1] \\
\text{Public Key} &= k \times G = (x, y) \\
\text{Compressed PubKey} &= \begin{cases}
\text{0x02} || x & \text{if } y \text{ even} \\
\text{0x03} || x & \text{if } y \text{ odd}
\end{cases} \\
\text{PubKey Hash} &= \text{RIPEMD160}(\text{SHA256}(\text{PubKey})) \\
\text{Versioned Hash} &= \text{0x00} || \text{PubKey Hash} \\
\text{Checksum} &= \text{SHA256}(\text{SHA256}(\text{Versioned Hash}))[:4] \\
\text{Address Bytes} &= \text{Versioned Hash} || \text{Checksum} \\
\text{Bitcoin Address} &= \text{Base58}(\text{Address Bytes})
\end{align}
\]

**Ví dụ minh họa**:
```
Private Key (hex):
  18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725

Public Key (uncompressed):
  04 50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
     2cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6

Public Key Hash (RIPEMD160 of SHA256):
  010966776006953d5567439e5e39f86a0d273bee

Address (Base58Check):
  16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM
```

### 4.2. Điều chỉnh độ khó (Difficulty Adjustment)

Bitcoin tự động điều chỉnh độ khó đào sau mỗi 2.016 block (khoảng 2 tuần) để giữ thời gian tạo block trung bình ở mức 10 phút:

\[
\text{New Difficulty} = \text{Old Difficulty} \times \frac{\text{2 weeks}}{\text{Actual Time}}
\]

Chính xác hơn theo ngưỡng mục tiêu (target):

\[
\text{New Target} = \text{Old Target} \times \frac{\text{Actual Time (2016 blocks)}}{\text{Expected Time (20160 minutes)}}
\]

**Các ràng buộc**:
- Biên độ điều chỉnh tối đa trong một kỳ: không quá 4 lần (tăng tối đa 4x hoặc giảm xuống tối thiểu 1/4).
- Độ khó tối thiểu: 1 (ở khối nguyên thủy).
- Ngưỡng mục tiêu tối đa: `0x00000000FFFF0000000000000000000000000000000000000000000000000000`.

**Ví dụ tính toán**:
```
Old Difficulty: 20,000,000,000,000
2016 blocks took: 14 days = 20,160 minutes (exactly on target!)

New Difficulty = 20,000,000,000,000 × (20,160 / 20,160) = 20,000,000,000,000 (no change)

If blocks came faster (12 days):
New Difficulty = 20,000,000,000,000 × (20,160 / 17,280) = 23,333,333,333,333 (harder)
```

### 4.3. Phần thưởng khối và Tổng cung

**Trợ cấp khối (Block Subsidy)**:

\[
\text{Subsidy}(h) = \frac{50 \text{ BTC}}{2^{\lfloor h / 210000 \rfloor}}
\]

trong đó \( h \) là chiều cao khối (block height).

**Lịch trình giảm một nửa (Halving Schedule)**:
```
Blocks 0 - 209,999:        50 BTC per block
Blocks 210,000 - 419,999:  25 BTC per block
Blocks 420,000 - 629,999:  12.5 BTC per block
Blocks 630,000 - 839,999:  6.25 BTC per block (2020–2024)
Blocks 840,000 - 1,049,999: 3.125 BTC per block (từ halving 2024)
...
After 64 halvings: 0 BTC (around year 2140)
```

**Tổng cung tối đa**:

\[
\text{Total BTC} = \sum_{i=0}^{63} 210000 \times \frac{50}{2^i} = 21,000,000 \text{ BTC}
\]

**Diễn giải bằng cấp số nhân**:
\[
\begin{align}
S &= 210000 \times 50 \times \left(1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \cdots \right) \\
&= 210000 \times 50 \times \frac{1}{1 - 1/2} \\
&= 210000 \times 50 \times 2 \\
&= 21,000,000
\end{align}
\]

Nguồn cung lưu hành thực tế thấp hơn một chút so với lý thuyết do coin bị thất lạc khóa và một số lỗi lịch sử khi thợ đào không nhận đủ trợ cấp khối (tính đến năm 2024 có khoảng 19,5 triệu BTC đã được đào).

### 4.4. Phí giao dịch

**Công thức tính phí**:
\[
\text{Fee} = \sum \text{Inputs} - \sum \text{Outputs}
\]

**Mức phí theo kích thước (Fee Rate)**:
\[
\text{Fee Rate} = \frac{\text{Fee}}{\text{Transaction Size (bytes)}} \quad (\text{sat/vByte})
\]

**Kích thước ảo trong SegWit (Virtual Size)**:
\[
\text{vSize} = \frac{\text{Base Size} \times 3 + \text{Total Size}}{4}
\]

**Cơ chế thị trường phí**:
Người dùng tự đặt mức phí để cạnh tranh độ ưu tiên; thợ đào ưu tiên chọn các giao dịch có tỷ lệ `sat/vByte` cao nhất. Khi mạng tắc nghẽn, mức phí tăng mạnh theo cơ chế đấu giá tự nhiên:
- Giai đoạn 2010–2016: ~0,0001 BTC (~0,01 USD).
- Đỉnh năm 2017: ~50 USD mỗi giao dịch.
- Đỉnh năm 2021: ~60 USD mỗi giao dịch.
- Trung bình năm 2024: ~1–5 USD mỗi giao dịch.

---

## 5. Minh họa triển khai

### 5.1. Tạo và ký giao dịch Bitcoin đơn giản (Python)

```python
import hashlib
import ecdsa
from typing import List, Tuple

class BitcoinTransaction:
    def __init__(self):
        self.version = 1
        self.inputs: List[dict] = []
        self.outputs: List[dict] = []
        self.locktime = 0
    
    def add_input(self, prev_txid: str, prev_index: int, 
                  scriptPubKey: bytes, amount: int):
        """Add input (UTXO to spend)"""
        self.inputs.append({
            'prev_txid': bytes.fromhex(prev_txid),
            'prev_index': prev_index,
            'scriptPubKey': scriptPubKey,
            'amount': amount,
            'scriptSig': b''
        })
    
    def add_output(self, address: str, amount: int):
        """Add output (new UTXO)"""
        # Create P2PKH scriptPubKey
        pubkey_hash = self.address_to_pubkey_hash(address)
        scriptPubKey = (
            b'\x76' +  # OP_DUP
            b'\xa9' +  # OP_HASH160
            b'\x14' +  # Push 20 bytes
            pubkey_hash +
            b'\x88' +  # OP_EQUALVERIFY
            b'\xac'    # OP_CHECKSIG
        )
        
        self.outputs.append({
            'amount': amount,
            'scriptPubKey': scriptPubKey
        })
    
    @staticmethod
    def address_to_pubkey_hash(address: str) -> bytes:
        """Decode Bitcoin address to get pubkey hash"""
        # Base58 decode (simplified)
        # In production, use proper Base58Check
        import base58
        decoded = base58.b58decode_check(address)
        return decoded[1:]  # Skip version byte
    
    def serialize_for_signing(self, input_index: int) -> bytes:
        """Serialize transaction for signing"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Input count
        result += self.var_int(len(self.inputs))
        
        # Inputs
        for i, inp in enumerate(self.inputs):
            result += inp['prev_txid'][::-1]  # Little-endian
            result += inp['prev_index'].to_bytes(4, 'little')
            
            # Include scriptPubKey for input being signed
            if i == input_index:
                script = inp['scriptPubKey']
                result += self.var_int(len(script))
                result += script
            else:
                result += b'\x00'  # Empty script
            
            result += (0xFFFFFFFF).to_bytes(4, 'little')  # Sequence
        
        # Output count
        result += self.var_int(len(self.outputs))
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            result += self.var_int(len(out['scriptPubKey']))
            result += out['scriptPubKey']
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        # Hash type (SIGHASH_ALL)
        result += (1).to_bytes(4, 'little')
        
        return result
    
    @staticmethod
    def var_int(n: int) -> bytes:
        """Variable-length integer encoding"""
        if n < 0xfd:
            return bytes([n])
        elif n <= 0xffff:
            return b'\xfd' + n.to_bytes(2, 'little')
        elif n <= 0xffffffff:
            return b'\xfe' + n.to_bytes(4, 'little')
        else:
            return b'\xff' + n.to_bytes(8, 'little')
    
    def sign_input(self, input_index: int, private_key_hex: str):
        """Sign input with private key"""
        # Get private key
        private_key = bytes.fromhex(private_key_hex)
        sk = ecdsa.SigningKey.from_string(private_key, curve=ecdsa.SECP256k1)
        
        # Serialize for signing
        preimage = self.serialize_for_signing(input_index)
        
        # Double SHA-256
        sighash = hashlib.sha256(hashlib.sha256(preimage).digest()).digest()
        
        # Sign
        signature = sk.sign_digest(sighash, sigencode=ecdsa.util.sigencode_der)
        signature += b'\x01'  # SIGHASH_ALL
        
        # Get public key
        vk = sk.get_verifying_key()
        public_key = b'\x04' + vk.to_string()  # Uncompressed
        
        # Create scriptSig
        scriptSig = (
            self.var_int(len(signature)) + signature +
            self.var_int(len(public_key)) + public_key
        )
        
        self.inputs[input_index]['scriptSig'] = scriptSig
    
    def serialize(self) -> bytes:
        """Serialize complete signed transaction"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Input count
        result += self.var_int(len(self.inputs))
        
        # Inputs
        for inp in self.inputs:
            result += inp['prev_txid'][::-1]
            result += inp['prev_index'].to_bytes(4, 'little')
            result += self.var_int(len(inp['scriptSig']))
            result += inp['scriptSig']
            result += (0xFFFFFFFF).to_bytes(4, 'little')
        
        # Output count
        result += self.var_int(len(self.outputs))
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            result += self.var_int(len(out['scriptPubKey']))
            result += out['scriptPubKey']
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        return result
    
    def get_txid(self) -> str:
        """Calculate transaction ID"""
        serialized = self.serialize()
        hash_result = hashlib.sha256(hashlib.sha256(serialized).digest()).digest()
        return hash_result[::-1].hex()  # Little-endian

# Example usage
if __name__ == "__main__":
    print("=== Bitcoin Transaction Example ===\n")
    
    # Create transaction
    tx = BitcoinTransaction()
    
    # Add input (spending previous output)
    prev_txid = "a1b2c3d4" * 16  # Example TXID
    scriptPubKey = bytes.fromhex("76a914" + "00" * 20 + "88ac")  # P2PKH
    tx.add_input(prev_txid, 0, scriptPubKey, 100000000)  # 1 BTC in satoshis
    
    # Add outputs
    tx.add_output("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", 50000000)  # 0.5 BTC to Bob
    tx.add_output("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", 49900000)  # 0.499 BTC change
    # Fee: 0.001 BTC (100,000 satoshis)
    
    # Sign (use your own private key in production!)
    private_key = "18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725"
    tx.sign_input(0, private_key)
    
    # Serialize
    raw_tx = tx.serialize()
    txid = tx.get_txid()
    
    print(f"Transaction ID: {txid}")
    print(f"Raw transaction: {raw_tx.hex()[:100]}...")
    print(f"Size: {len(raw_tx)} bytes")
    print(f"Fee rate: {100000 / len(raw_tx):.2f} sat/byte")
```

### 5.2. Quản lý tập UTXO

```python
from typing import Dict, Set, Tuple

class UTXOSet:
    def __init__(self):
        # UTXO set: (txid, vout) -> (amount, scriptPubKey, height)
        self.utxos: Dict[Tuple[str, int], Tuple[int, bytes, int]] = {}
        self.total_supply = 0
    
    def add_utxo(self, txid: str, vout: int, amount: int, 
                 scriptPubKey: bytes, height: int):
        """Add new UTXO"""
        key = (txid, vout)
        if key in self.utxos:
            raise ValueError(f"UTXO {txid}:{vout} already exists!")
        
        self.utxos[key] = (amount, scriptPubKey, height)
        self.total_supply += amount
        
        print(f"+ Added UTXO: {txid[:8]}...:{vout} = {amount/1e8:.8f} BTC")
    
    def spend_utxo(self, txid: str, vout: int) -> Tuple[int, bytes]:
        """Spend (remove) UTXO"""
        key = (txid, vout)
        if key not in self.utxos:
            raise ValueError(f"UTXO {txid}:{vout} not found!")
        
        amount, scriptPubKey, height = self.utxos[key]
        del self.utxos[key]
        self.total_supply -= amount
        
        print(f"- Spent UTXO: {txid[:8]}...:{vout} = {amount/1e8:.8f} BTC")
        return amount, scriptPubKey
    
    def get_balance(self, address: str) -> int:
        """Get total balance for address"""
        # Simplified: check scriptPubKey contains address hash
        total = 0
        for (txid, vout), (amount, scriptPubKey, height) in self.utxos.items():
            # In production: properly decode scriptPubKey
            total += amount
        return total
    
    def apply_transaction(self, tx: dict, block_height: int):
        """Apply transaction to UTXO set"""
        txid = tx['txid']
        
        # Spend inputs
        total_input = 0
        for inp in tx['inputs']:
            amount, scriptPubKey = self.spend_utxo(
                inp['prev_txid'],
                inp['prev_index']
            )
            total_input += amount
        
        # Create outputs
        total_output = 0
        for i, out in enumerate(tx['outputs']):
            self.add_utxo(
                txid, i,
                out['amount'],
                out['scriptPubKey'],
                block_height
            )
            total_output += out['amount']
        
        # Verify fee
        fee = total_input - total_output
        print(f"Transaction fee: {fee/1e8:.8f} BTC")
        
        if fee < 0:
            raise ValueError("Negative fee! Transaction invalid.")
        
        return fee
    
    def get_stats(self) -> dict:
        """Get UTXO set statistics"""
        return {
            'utxo_count': len(self.utxos),
            'total_supply': self.total_supply / 1e8,  # BTC
            'avg_utxo_size': self.total_supply / len(self.utxos) if self.utxos else 0
        }

# Example
if __name__ == "__main__":
    print("=== UTXO Set Management Example ===\n")
    
    utxo_set = UTXOSet()
    
    # Genesis coinbase (block reward)
    utxo_set.add_utxo(
        "genesis_tx_id", 0,
        5000000000,  # 50 BTC
        b'scriptPubKey_alice',
        0
    )
    
    print(f"\nStats: {utxo_set.get_stats()}\n")
    
    # Alice sends 30 BTC to Bob
    tx1 = {
        'txid': 'tx1_id',
        'inputs': [
            {'prev_txid': 'genesis_tx_id', 'prev_index': 0}
        ],
        'outputs': [
            {'amount': 3000000000, 'scriptPubKey': b'scriptPubKey_bob'},  # 30 BTC to Bob
            {'amount': 1999000000, 'scriptPubKey': b'scriptPubKey_alice'}  # 19.99 BTC change
        ]
    }
    
    print("\nProcessing transaction 1...")
    fee1 = utxo_set.apply_transaction(tx1, 1)
    
    print(f"\nStats: {utxo_set.get_stats()}")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Khả năng mở rộng (Scalability)

Thông lượng trên chuỗi chính của Bitcoin chỉ đạt khoảng 7 giao dịch/giây (TPS), thấp hơn nhiều so với các hệ thống thanh toán tập trung:
- Visa: ~24.000 TPS.
- Mastercard: ~5.000 TPS.
- PayPal: ~193 TPS.
- Ethereum: ~15 TPS.
- Bitcoin: ~7 TPS.

**Nguyên nhân giới hạn**:
1. Giới hạn kích thước khối: 1 MB (truyền thống), tối đa ~4 MB trọng số (từ SegWit).
2. Thời gian tạo khối trung bình: 10 phút.
3. Chi phí lan truyền và xác thực đồng loạt trên toàn mạng.

**Ước tính thông lượng**:
\[
\text{TPS} = \frac{\text{Block Size}}{\text{Avg TX Size} \times \text{Block Time}} = \frac{1 \text{ MB}}{250 \text{ bytes} \times 600 \text{ sec}} \approx 7 \text{ TPS}
\]

**Các hướng tiếp cận mở rộng**:
- **Tăng kích thước khối (Big blocks — như Bitcoin Cash)**: Xử lý nhiều giao dịch hơn mỗi block nhưng làm tăng chi phí vận hành full node, dễ dẫn đến tập trung hóa.
- **Mở rộng tầng 2 (Layer 2 — như Lightning Network)**: Đạt hàng nghìn TPS với phí thấp và xác nhận gần như tức thời, nhưng phức tạp hơn và yêu cầu khóa thanh khoản trong kênh.
- **SegWit**: Tách dữ liệu chữ ký giúp tăng dung lượng hiệu dụng của block và khắc phục tính khả biến giao dịch.

### 6.2. Tiêu thụ năng lượng

**Số liệu tham khảo (2024)**:
- Tổng điện năng tiêu thụ của mạng Bitcoin: ~150 TWh/năm (tương đương mức tiêu thụ điện của Argentina).
- Ước tính bình quân mỗi giao dịch trên chuỗi: ~700 kWh.
- Phát thải carbon ước tính: ~65 triệu tấn CO₂/năm.

**Quan điểm ủng hộ**: Bảo vệ mạng lưới giá trị trên 500 tỷ USD, tận dụng nguồn điện dư thừa hoặc năng lượng tái tạo giá rẻ (tỷ trọng năng lượng tái tạo ước tính đạt trên 50%) và có mức tiêu thụ có thể so sánh với hạ tầng ngân hàng truyền thống.

**Quan điểm phản đối**: Gây tác động môi trường, phát sinh rác thải điện tử từ máy đào ASIC lỗi thời và có thể thay thế bằng các cơ chế tiêu thụ ít điện hơn như PoS.

### 6.3. Hạn chế về quyền riêng tư

Tính giả danh không đồng nghĩa với ẩn danh: toàn bộ giao dịch đều công khai. Các kỹ thuật gom cụm địa chỉ (address clustering), công ty phân tích dữ liệu chuỗi (Chainalysis, Elliptic) và dữ liệu định danh (KYC) tại sàn giao dịch cho phép truy vết dòng tiền liên kết về danh tính thực.

```
Alice withdraws from exchange (KYC'd address known)
  → Address A (identity linked)
  → Sends to Address B
  → Sends to Address C
  → ...

Chain analysis can trace entire flow!
```

**Các giải pháp tăng cường quyền riêng tư**:
- **CoinJoin**: Nhiều người dùng gộp chung giao dịch để làm mờ liên kết đầu vào — đầu ra.
- **Lightning Network**: Giao dịch ngoài chuỗi, hạn chế lộ lịch sử chi tiết trên chuỗi chính.
- **Taproot**: Làm cho các loại giao dịch phức tạp trông tương đồng với giao dịch đơn giản.

### 6.4. Khả năng chống tấn công 51%

**Chi phí tấn công ước tính (2024)**:
- Tổng sức mạnh băm toàn mạng: ~600 EH/s.
- Chi phí đầu tư phần cứng chiếm 51%: ~10–20 tỷ USD.
- Chi phí điện năng vận hành: ~1 triệu USD/giờ.

**Vì sao tấn công 51% thiếu hợp lý về mặt kinh tế**:
1. Chi phí đầu tư ban đầu cực lớn.
2. Cuộc tấn công làm sụp đổ niềm tin và giá BTC, khiến chính kẻ tấn công chịu thiệt hại nặng.
3. Kẻ tấn công chỉ có thể chi tiêu gấp đôi giao dịch của chính mình, không thể giả chữ ký để lấy coin của người khác.
4. Cộng đồng có thể phản ứng bằng hard fork đổi thuật toán, biến toàn bộ phần cứng ASIC của kẻ tấn công thành vô giá trị.

*Ghi nhận lịch sử*: Năm 2014, pool GHash.io từng có thời điểm vượt ngưỡng 50% sức mạnh băm nhưng đã tự nguyện giảm thị phần dưới sức ép cộng đồng. Hiện 4 pool lớn nhất chiếm khoảng 55% hash rate, nhưng mỗi pool tập hợp từ nhiều thợ đào độc lập có thể chuyển đổi pool nhanh chóng.

### 6.5. Bitcoin bị thất lạc

Ước tính khoảng 3–4 triệu BTC (~20% tổng cung) đã bị mất vĩnh viễn do thất lạc khóa bí mật, quên mật khẩu, chủ sở hữu qua đời không để lại bản sao lưu, gửi nhầm địa chỉ hoặc đốt coin có chủ ý (proof-of-burn).

Một số trường hợp nổi tiếng gồm James Howells (7.500 BTC trong ổ cứng bị vứt ra bãi rác), Stefan Thomas (7.002 BTC bị khóa trong ổ cứng mã hóa chỉ còn 2 lần thử mật khẩu) và khoảng 1 triệu BTC gắn với các khối đầu tiên của Satoshi chưa từng di chuyển. Về mặt kinh tế, lượng coin mất vĩnh viễn làm giảm nguồn cung lưu hành thực tế và gia tăng độ khan hiếm.

---

## 7. Các khái niệm liên quan

### 7.1. Phân nhánh giao thức (Bitcoin Forks)

- **Soft Fork**: Thay đổi tương thích ngược; các nút chạy phiên bản cũ vẫn chấp nhận block do nút mới tạo ra (ví dụ: SegWit, Taproot).
- **Hard Fork**: Thay đổi không tương thích ngược, đòi hỏi toàn bộ nút nâng cấp; nếu không đạt đồng thuận sẽ tách thành hai chuỗi riêng biệt (ví dụ: Bitcoin Cash, Bitcoin SV).

```
Bitcoin (BTC)
    ├── Bitcoin Cash (BCH) - 2017, 8MB blocks
    │   └── Bitcoin SV (BSV) - 2018, 128MB blocks
    ├── Bitcoin Gold (BTG) - 2017, ASIC-resistant
    └── Bitcoin Diamond (BCD) - 2017, 8MB blocks
```

### 7.2. Mạng Lightning (Lightning Network — Layer 2)

Mạng Lightning xây dựng các **kênh thanh toán ngoài chuỗi (off-chain payment channels)**:

```
1. Alice và Bob open channel:
   - Both deposit funds in 2-of-2 multisig on-chain

2. Transact off-chain:
   - Update channel state (signed by both)
   - Thousands of transactions
   - Instant, near-zero fees

3. Close channel:
   - Final state broadcast on-chain
   - Both receive their final balances
```

Nhờ cơ chế định tuyến nhiều chặng (multi-hop routing) kết hợp định tuyến củ hành (onion routing), người dùng có thể thanh toán xuyên mạng với tốc độ nhanh và phí rất thấp, nhưng phải đánh đổi bằng yêu cầu khóa thanh khoản, độ phức tạp kỹ thuật và đòi hỏi nút trực tuyến để theo dõi kênh.

### 7.3. Nâng cấp Taproot (2021)

Taproot mang lại ba cải tiến chính:
1. **Chữ ký Schnorr**: Bổ sung lựa chọn gọn nhẹ hơn ECDSA, hỗ trợ xác minh theo lô và gộp khóa.
2. **MAST (Merklized Abstract Syntax Trees)**: Cho phép viết điều kiện chi tiêu phức tạp nhưng chỉ công bố nhánh thực sự được thực thi.
3. **Cải thiện quyền riêng tư**: Giao dịch đa chữ ký và hợp đồng phức tạp khi chi tiêu hợp tác trông giống hệt giao dịch thông thường.

### 7.4. Colored Coins và Token trên Bitcoin

Một số giao thức cho phép biểu diễn tài sản khác trên mạng Bitcoin thông qua `OP_RETURN` (nhúng tối đa 80 byte dữ liệu), **RGB Protocol** (xác thực phía máy khách) hoặc **Taro** (tài sản dựa trên Taproot), phục vụ các bài toán như stablecoin, NFT, chứng khoán số và điểm thưởng.

### 7.5. Các đề xuất cải tiến Bitcoin (BIPs)

Một số BIP nền tảng:
- **BIP 32**: Ví phân cấp tất định (HD Wallets).
- **BIP 39**: Cụm từ ghi nhớ khôi phục ví (12/24 từ).
- **BIP 44**: Cấu trúc đa tài khoản cho ví HD.
- **BIP 141**: SegWit.
- **BIP 340–342**: Taproot.

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Whitepaper gốc đặt nền móng cho Bitcoin |
| **"Hashcash - A Denial of Service Counter-Measure"** | 2002 | Adam Back | Cơ chế Proof-of-Work tiền thân |
| **"B-Money"** | 1998 | Wei Dai | Thiết kế khái niệm tiền mã hóa phân tán |
| **"Bit Gold"** | 2005 | Nick Szabo | Ý tưởng tiền thân của Bitcoin |
| **"Enabling Blockchain Innovations with Pegged Sidechains"** | 2014 | Back et al. | Khái niệm chuỗi song song neo giá trị (sidechain) |
| **"The Bitcoin Backbone Protocol"** | 2015 | Garay, Kiayias, Leonardos | Phân tích bảo mật hình thức cho giao thức Bitcoin |
| **"Analysis of the Blockchain Protocol in Asynchronous Networks"** | 2016 | Pass, Seeman, Shelat | Phân tích an toàn trong mạng bất đồng bộ |
| **"The Bitcoin Lightning Network"** | 2016 | Poon, Dryja | Giải pháp mở rộng Layer 2 cho Bitcoin |
| **"Segregated Witness (BIP 141)"** | 2015 | Wuille et al. | Đặc tả kỹ thuật của SegWit |
| **"Schnorr Signatures for secp256k1 (BIP 340)"** | 2020 | Wuille, Nick, Ruffing | Nền tảng chữ ký Schnorr cho nâng cấp Taproot |

**Thứ tự đọc gợi ý**:
1. Whitepaper Bitcoin (9 trang, tài liệu nền tảng).
2. Bài báo Hashcash (hiểu nguồn gốc PoW).
3. *The Bitcoin Backbone Protocol* (chứng minh bảo mật hình thức).
4. Whitepaper Lightning Network (hiểu mở rộng Layer 2).
5. BIP 141 và BIP 340–342 (các nâng cấp quan trọng của Bitcoin hiện đại).

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Luồng giao dịch Bitcoin** | [Bitcoin.org Developer Guide](https://bitcoin.org/en/developer-guide) | Tài liệu kỹ thuật chính thức |
| **Sơ đồ cấu trúc block** | [Mastering Bitcoin Ch9](https://github.com/bitcoinbook/bitcoinbook) | Sách của Andreas Antonopoulos |
| **Minh họa mô hình UTXO** | [Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/questions/49853) | Giải thích chi tiết từ cộng đồng |
| **Quy trình đào block** | [Anders Brownworth Demo](https://andersbrownworth.com/blockchain/blockchain) | Minh họa tương tác |
| **Bản đồ mạng lưới nút** | [Bitnodes](https://bitnodes.io/) | Dữ liệu mạng lưới theo thời gian thực |
| **Trực quan hóa Mempool** | [Mempool.space](https://mempool.space/) | Theo dõi hàng đợi giao dịch trực tiếp |
| **Trình khám phá blockchain** | [Blockchain.com](https://www.blockchain.com/explorer) | Tra cứu giao dịch và block |
| **Thống kê Lightning Network** | [1ML.com](https://1ml.com/) | Số liệu kênh và nút Lightning |

**Công cụ tương tác**:
- [Bitcoin Demo](https://andersbrownworth.com/blockchain/) — Công cụ trực quan hóa cơ chế blockchain.
- [Bitcoin Script Simulator](https://siminchen.github.io/bitcoinIDE/build/editor.html) — Mô phỏng thực thi Bitcoin Script.
- [Transaction Decoder](https://live.blockcypher.com/btc/decodetx/) — Giải mã dữ liệu giao dịch thô.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. Bitcoin là hệ thống tiền điện tử phi tập trung đầu tiên vận hành thành công trong thực tế.
2. Giải quyết bài toán chi tiêu gấp đôi mà không cần bên trung gian tin cậy.
3. Kết hợp đồng thuận Proof-of-Work với cơ chế khuyến khích kinh tế.
4. Quản lý trạng thái theo mô hình UTXO thay vì mô hình số dư tài khoản.

**Các thành phần kiến trúc**:
- **Mạng P2P**: Giao thức lan truyền gossip, khoảng 10.000–15.000 nút đầy đủ hoạt động.
- **Blockchain**: Sổ cái chỉ ghi thêm, dung lượng khoảng 500 GB.
- **Giao dịch**: Sử dụng chữ ký số và ngôn ngữ Script.
- **Đào (Mining)**: Proof-of-Work với cơ chế tự điều chỉnh độ khó sau mỗi 2.016 block.
- **Đồng thuận**: Quy tắc chuỗi dài nhất (tích lũy nhiều công sức nhất) gắn với bảo mật kinh tế.

**Hạn chế và hướng phát triển**:
- Khả năng mở rộng (~7 TPS) đang được bổ trợ bằng Layer 2 (Lightning Network).
- Tiêu thụ năng lượng (~150 TWh/năm) có xu hướng dịch chuyển sang năng lượng tái tạo.
- Quyền riêng tư ở mức giả danh đang được cải thiện qua Taproot và các giao thức ngoài chuỗi.
- Tính chung cuộc theo xác suất (thông lệ chờ 6 xác nhận cho giao dịch lớn).

**Điểm chốt**: Bitcoin chứng minh rằng tiền kỹ thuật số phi tập trung hoàn toàn khả thi nhờ sự kết hợp giữa mật mã học, lý thuyết trò chơi và hệ thống phân tán.

---

✅ **Kết thúc Lecture 01.00**

**Bài tiếp theo**: Lecture 01.01 - Proof-of-Work chuyên sâu: Đào, Bảo mật và Kinh tế học

---

## Video tham khảo

- **Xem trước:** ["How Bitcoin Protocol Works" - Andreas Antonopoulos](https://www.youtube.com/watch?v=yorRGbp54tM) — Bitcoin TV, tiếng Anh. Antonopoulos đi qua giao dịch, block và quy tắc xác thực; nên xem trước khi đọc cấu trúc mạng và block.
- [Bitcoin UTXOs Explained](https://www.youtube.com/watch?v=ZX5UOPRPQhc) — Bitcoin Briefly, tiếng Anh. Giải thích UTXO như các đầu ra chưa chi tiêu, khớp với phần đối chiếu mô hình UTXO và tài khoản trong bài.
- [Andreas M. Antonopoulos: Advanced Bitcoin Scripting](https://www.youtube.com/watch?v=yU3Sr07Qnxg) — SF Bitcoin Developers, tiếng Anh. Buổi trình bày về Bitcoin Script, phù hợp khi đọc các opcode và điều kiện mở khóa trong bài.

## References

1. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.
2. Antonopoulos, A. M. (2017). *Mastering Bitcoin: Programming the Open Blockchain*. O'Reilly Media.
3. Narayanan, A., et al. (2016). *Bitcoin and Cryptocurrency Technologies*. Princeton University Press.
4. Garay, J., Kiayias, A., & Leonardos, N. (2015). *The bitcoin backbone protocol*. EUROCRYPT 2015.
5. Poon, J., & Dryja, T. (2016). *The Bitcoin Lightning Network*. White paper.
6. Bitcoin Developer Documentation: https://developer.bitcoin.org/
