---
layout: post
title: "Lecture 01.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '01'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter01
lesson_type: optional
---

# Lecture (tùy chọn): Bitcoin 2022–2026 — BIP-324, BitVM, inscriptions, assumeUTXO

> Bài này là **tùy chọn**, **không** viết lại các kiến thức về UTXO, Script, điều chỉnh độ khó hay lý thuyết trò chơi của phí giao dịch. Nội dung dưới đây chỉ ra những hệ thống *đã triển khai hoặc đang đặc tả* dựa trên chính kiến trúc Bitcoin mà Chapter 01 đã trình bày.

Nhiều người từng nghĩ Bitcoin là một "hóa thạch số" đóng băng từ năm 2009 và không thể tiến hóa thêm. Thực tế giai đoạn **2022–2026** chứng minh điều ngược lại: ngay cả khi tầng đồng thuận cốt lõi (PoW, UTXO, quy tắc 21 triệu BTC) gần như giữ nguyên bất biến để bảo vệ độ tin cậy, bốn lớp bao quanh nó đã trải qua bước nhảy vọt đáng kinh ngạc — từ **BIP-324** mã hóa toàn bộ đường truyền P2P chống nghe lén, **BitVM / BitVM2** đưa khả năng kiểm chứng tính toán tổng quát lên Script mà không cần sửa giao thức, **Ordinals / Inscriptions** khai thác phần witness thành không gian xuất bản dữ liệu, cho đến **assumeUTXO** rút ngắn thời gian khởi chạy nút đầy đủ từ nhiều ngày xuống vài phút.

---

## Kiến thức cần nhớ: Bốn bước tiến Bitcoin 2022–2026 dựa trên những nguyên lý kỹ thuật nào?

### 1. Mật mã đường truyền (BIP-324) và Bảo vệ tầng mạng P2P
Trước đây, mọi nút Bitcoin nói chuyện với nhau bằng văn bản thuần (plaintext), cho phép nhà mạng (ISP) dễ dàng nghe lén hoặc chặn lọc giao dịch. **BIP-324** bổ sung trao đổi khóa ElligatorSwift (trên đường cong `secp256k1`) và mã hóa đối xứng ChaCha20-Poly1305 để ngụy trang lưu lượng Bitcoin như luồng byte ngẫu nhiên thuần túy.

### 2. Xác minh lạc quan bằng tìm kiếm nhị phân (BitVM / BitVM2)
Bitcoin Script cố tình không đầy đủ Turing, nhưng vẫn biểu diễn được **cổng logic NAND** (mà mọi mạch số trên đời đều dựng được từ cổng NAND!). **BitVM** kết hợp cây cam kết Taproot (MAST) với **trò chơi tranh chấp chia đôi (bisection game)**: hai bên chạy chương trình khổng lồ ngoài chuỗi, và chỉ khi có tranh chấp mới đưa đúng **1 bước sai duy nhất** lên chuỗi L1 để trọng tài phân xử — mở đường cho cầu nối (bridge) và Rollup tối thiểu hóa niềm tin trên Bitcoin.

### 3. Kinh tế học trọng số SegWit (Inscriptions) và Đồng bộ trạng thái (`assumeUTXO`)
Quy tắc **SegWit** gán trọng số 1 đơn vị cho mỗi byte dữ liệu `witness` (rẻ gấp 4 lần byte dữ liệu thường), vô tình tạo ra thị trường ghi dữ liệu bất biến (Inscriptions) cạnh tranh trực tiếp vào phí khối. Trong khi đó, **assumeUTXO** cho phép nút mới tải trước ảnh chụp nhanh (snapshot) tập UTXO tại một khối tin cậy rồi xác minh song song toàn bộ lịch sử từ Genesis ở chế độ nền.

---

### Giải thích: tự tay tính chiết khấu SegWit cho Inscriptions và số vòng tranh chấp BitVM

1. **Chi phí không gian khối của một Inscription 100 KB nhờ chiết khấu SegWit:**
   - Một khối Bitcoin có giới hạn cứng là $$4\,000\,000\text{ WU}$$ (weight units), tương đương $$1\,000\,000\text{ vByte}$$ (vì $$1\text{ vByte} = 4\text{ WU}$$).
   - Mỗi byte dữ liệu giao dịch thường (non-witness) tốn **4 WU**, còn mỗi byte đặt trong vùng `witness` (như kịch bản Taproot của Inscription) chỉ tốn **1 WU** (chiết khấu 75%).
   - Do đó, một ảnh 100 KB ($$100\,000\text{ byte}$$) nhúng trong `witness` chỉ chiếm $$\frac{100\,000}{4} = \mathbf{25\,000\text{ vByte}}$$ — tức chỉ khoảng $$2.5\%$$ dung lượng một khối, giúp chi phí lưu trữ dữ liệu giảm đúng 4 lần so với nhét vào phần giao dịch thường!
2. **Sức mạnh logarit của trò chơi chia đôi trong BitVM:**
   - Giả sử một phép kiểm chứng bằng chứng không tiết lộ (ZK proof) ngoài chuỗi cần tới $$N = 2^{30} \approx 1.07\text{ tỷ}$$ cổng logic NAND. Chạy trực tiếp 1 tỷ cổng trên Bitcoin L1 là bất khả thi.
   - Nhờ trò chơi **chia đôi (binary search)** giữa người chứng minh (Prover) và người thách thức (Challenger): mỗi vòng, Prover cam kết trạng thái ở đúng điểm giữa đoạn tranh chấp; Challenger chỉ ra nửa trái hay nửa phải chứa sai lệch.
   - Sau đúng **$$\log_2(2^{30}) = 30\text{ vòng}$$** tương tác, hai bên khoanh chính xác vào **đúng 1 cổng NAND duy nhất** có đầu vào khớp nhưng đầu ra sai — và Bitcoin L1 chỉ cần chạy một đoạn Script tí hon để kiểm tra đúng 1 cổng đó rồi tịch thu tiền đặt cọc của kẻ gian!

---

## 1. Vì sao kiến trúc 2008–2017 vẫn là nền tảng — và những lớp nào đã chuyển dịch

Bitcoin Core vẫn vận hành trên nền PoW, mô hình UTXO và ngôn ngữ Script. Tuy nhiên, trong giai đoạn 2022–2026, bốn lớp *xung quanh* tầng đồng thuận đã phát triển nhanh: (1) **tầng truyền tải P2P** được mã hóa (BIP-324), (2) **tính toán lạc quan trên Script/Taproot** (BitVM / BitVM2) mà không cần soft-fork thêm opcode mới, (3) **lưu dữ liệu trong phần witness** (inscriptions / Ordinals) biến không gian khối thành lớp xuất bản dữ liệu, và (4) **tối ưu hóa đồng bộ nút** (assumeUTXO) giúp giảm rào cản tải khối ban đầu (IBD).

Nâng cấp Taproot (BIP-340/341/342, kích hoạt tháng 11 năm 2021) đóng vai trò điều kiện tiên quyết như đã đề cập ở bài 01.00. Bài học này tiếp nối từ sau mốc Taproot: cách cộng đồng khai thác cây MAST và chữ ký Schnorr để xây dựng những cơ chế vượt xa phạm vi của Script đời đầu.

![Cấu trúc block Bitcoin — UTXO/Script vẫn là lớp BitVM và BIP-324 bám vào](https://upload.wikimedia.org/wikipedia/commons/5/55/Bitcoin_Block_Data.svg)
*Nguồn: [Wikimedia Commons — Bitcoin block data](https://commons.wikimedia.org/wiki/File:Bitcoin_Block_Data.svg)*

## 2. Các bước tiến then chốt

### 2.1. BIP-324: Giao thức truyền tải v2, không phải đồng thuận mới

[BIP-324](https://github.com/bitcoin/bips/blob/master/bip-0324.mediawiki) (Mehta, Ruffing, Schnelli, Wuille; trạng thái *Deployed*, phiên bản 1.0.0 ngày 10/07/2024) thay thế giao thức P2P v1 truyền văn bản rõ bằng tầng truyền tải mã hóa cơ hội (opportunistic encryption): bắt tay bằng ECDH, biến luồng byte thành dạng giả ngẫu nhiên trước các bên nghe lén thụ động và cho phép thương lượng nâng cấp *trước* khi trao đổi thông điệp tầng ứng dụng. Các nút hỗ trợ sẽ quảng bá cờ dịch vụ `NODE_P2P_V2`; nếu nút đối tác ngắt kết nối, phần mềm khách tự động quay lại v1.

Đây là ứng dụng trực tiếp của bài toán hệ thống phân tán ở bài 00.01 vào mạng Bitcoin: bên quan sát ở cấp nhà cung cấp mạng (ISP) không còn dễ dàng đọc trực tiếp danh sách giao dịch hay dữ liệu truyền qua, đồng thời chi phí phân tích lưu lượng tăng lên. BIP-324 **không** thêm opcode mới và **không** thay đổi PoW. Từ Bitcoin Core phiên bản 26 trở đi, kết nối v2 được bật mặc định cho các kết nối đi ra (outbound).

### 2.2. BitVM và BitVM2: Tính toán tổng quát mà không thay đổi đồng thuận

Bài báo *BitVM: Compute Anything on Bitcoin* của Robin Linus (tháng 12 năm 2023, [bitvm.org/bitvm.pdf](https://bitvm.org/bitvm.pdf)) đề xuất mô hình xác minh lạc quan: bên chứng minh (prover) cam kết một chương trình lớn trong cây Taproot và chỉ khi có tranh chấp mới kích hoạt bằng chứng gian lận (fraud proof) trên chuỗi, tương tự cách vận hành của optimistic rollup. Các thành phần sử dụng vẫn chỉ là hashlock, timelock và các lá Taproot — chính là Bitcoin Script của bài 01.00 được tổ hợp thành mạch logic bit.

BitVM2 (Linus et al., 2024, [bitvm.org/bitvm_bridge.pdf](https://bitvm.org/bitvm_bridge.pdf)) rút gọn quá trình giải quyết tranh chấp xuống còn khoảng ba giao dịch trên chuỗi, cho phép *bất kỳ ai cũng có thể phản biện (permissionless challenging)* và sử dụng các đoạn script xác minh SNARK được chia nhỏ. Ứng dụng tiêu biểu là **BitVM Bridge**, hạ giả định an toàn ký quỹ từ đa số trung thực (\(t\)-trên-\(n\)) xuống mức *tồn tại ít nhất một bên trung thực* (1-trên-\(n\)) tại khâu thiết lập, trong khi tính sống cần ít nhất một đơn vị vận hành (operator) hoạt động hợp lý.

Bài học kiến trúc rút ra: Bitcoin không cần EVM để *xác minh* các phép tính tùy ý mà cần một giao thức phản biện kết hợp cam kết Taproot. Chi phí đánh đổi nằm ở lượng giao tiếp ngoài chuỗi và độ phức tạp thiết lập, chứ không làm tăng thông lượng 7 TPS của lớp nền lên 7.000 TPS.

### 2.3. Inscriptions / Ordinals: Dùng witness làm lớp xuất bản dữ liệu

Giao thức Ordinals (Casey Rodarmor, 2023) đánh số từng satoshi và nhúng dữ liệu tùy ý vào phần witness của giao dịch Taproot. Về mặt kỹ thuật, đây là hệ quả trực tiếp của thiết kế SegWit kết hợp Taproot, khi dữ liệu witness được tính trọng số giảm giá và không nằm trong phần tính `txid`. Về mặt kinh tế, hiện tượng này tạo ra cú sốc nhu cầu cho thị trường phí mà bài 01.02 đã phân tích, khi không gian khối phát sinh thêm nhu cầu phi thanh toán. Bitcoin Core không chặn inscriptions ở tầng đồng thuận; các tranh luận chủ yếu xoay quanh chính sách mempool (như tham số `datacarrier` và giới hạn kích thước dữ liệu witness).

Điểm cốt lõi cần nắm không phải là câu chuyện NFT mà là cơ chế: sự kết hợp giữa *UTXO và ưu đãi trọng số witness* đã mở ra một thị trường lưu trữ dữ liệu ngoài dự kiến ban đầu của whitepaper năm 2008, trong khi trò chơi đấu giá phí và điều chỉnh độ khó vẫn là yếu tố quyết định giao dịch nào được đưa vào block.

### 2.4. assumeUTXO và cluster mempool: Nút Bitcoin dưới góc nhìn hệ thống phân tán

Cơ chế **assumeUTXO** (triển khai dần trong Bitcoin Core giai đoạn 2023–2025) cho phép nút mới tải một bản chụp nhanh (snapshot) tập UTXO đã được cam kết để bắt kịp ngay đầu chuỗi hiện tại, *song song* với quá trình xác minh ngầm toàn bộ lịch sử từ khối nguyên thủy. Đây là cách tiếp cận tương tự điểm kiểm tra có chủ đích: không thay đổi cơ chế PoW mà chỉ thay đổi *trình tự đồng bộ hóa*.

Trong khi đó, **cluster mempool** (thiết kế giai đoạn 2023–2025 theo lộ trình tích hợp vào Bitcoin Core) mô hình hóa mempool thành các cụm đồ thị phụ thuộc cha — con (ancestor/descendant), giúp chọn gói giao dịch tối ưu phí tốt hơn so với thuật toán tính điểm tổ tiên truyền thống. Cả hai đều là cải tiến kỹ thuật hệ thống trên kiến trúc bài 01.00, không làm thay đổi cơ chế đồng thuận.

## 3. Góc nhìn triển khai

Một cầu nối BitVM2 không gửi BTC vào một hợp đồng kiểu EVM. Thay vào đó, đơn vị vận hành và ủy ban ký trước một tập giao dịch xử lý tranh chấp; người dùng khóa UTXO vào một script mà *bất kỳ ai* cũng có thể gửi bằng chứng phản biện nếu kết quả đầu ra sai lệch. Khi tất cả các bên hành xử trung thực, dấu vết trên chuỗi rất nhỏ — đúng với nguyên lý ở bài 01.00 rằng Bitcoin Script đóng vai trò bộ xác minh chứ không phải máy tính đa dụng.

```text
[BTC locker script / Taproot]
        |  honest path: cooperative spend
        |  dispute path:  ~3 txs  (BitVM2)
        v
[SNARK verifier script slices] --> punish operator
```

Với BIP-324, lệnh `bitcoin-cli getpeerinfo` hiển thị trường `transport_protocol_type` (`v2` hoặc `v1`). Điều này minh họa rõ rằng mã hóa kết nối là dịch vụ tầng mạng giữa các nút, không phải một bản soft-fork đồng thuận.

## 4. Thách thức và đánh đổi

BitVM đòi hỏi khâu thiết lập nặng nề và giả định luôn tồn tại ít nhất một bên xác minh trung thực theo dõi liên tục. Inscriptions làm tăng dung lượng dữ liệu lưu trữ (bloat) và gây tranh luận sâu sắc về định hướng sử dụng không gian khối Bitcoin. BIP-324 không chống được kẻ tấn công xen giữa chủ động (active MITM) có khả năng ép hạ cấp xuống v1 nếu các nút không áp dụng chính sách buộc dùng v2. Còn với assumeUTXO, niềm tin tạm thời chuyển sang bên tạo mã băm bản chụp UTXO — người học cần phân biệt rõ giả định này và không nhầm lẫn với mô hình SPV yếu.

## 5. Giá trị bổ sung của bài học này

Các bài 01.00–01.02 vẫn giữ vai trò nền tảng giải thích UTXO, Script, PoW, lịch halving và thị trường phí. Bài tùy chọn này chỉ nối tiếp các kiến thức đó tới BIP-324, BitVM/BitVM2, Ordinals và assumeUTXO.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [BIP-324: Version 2 P2P Encrypted Transport](https://github.com/bitcoin/bips/blob/master/bip-0324.mediawiki) | 2024 (Final) | Mã hóa tầng truyền tải P2P cơ hội |
| [BitVM (Linus, Dec 2023)](https://bitvm.org/bitvm.pdf) | 2023 | Tính toán lạc quan trên Taproot |
| [BitVM2 / BitVM Bridge](https://bitvm.org/bitvm_bridge.pdf) | 2024 | Phản biện không cần cấp phép; cầu nối 1-trên-n |
| [BIP-340/341/342 Taproot](https://github.com/bitcoin/bips) | 2021 | Điều kiện tiên quyết Schnorr và MAST |
| [assumeUTXO design notes](https://github.com/bitcoin/bitcoin) / Bitcoin Core docs | 2023–2025 | Đồng bộ khối ban đầu song song với bản chụp UTXO |
| Ordinals / inscriptions (Rodarmor) | 2023 | Sử dụng witness như lớp xuất bản dữ liệu |

## Video tham khảo

- **Xem trước:** [BIP324: Improving #bitcoin ’s P2P Transport Protocol](https://www.youtube.com/watch?v=7J7EfqknVpM) — Bitcoin Developers, tiếng Anh. Trình bày giao thức truyền tải P2P mã hóa BIP-324; nên xem trước mục giao thức v2.
- [Ordinals Workshop with Casey Rodarmor](https://www.youtube.com/watch?v=MC_haVa6N3I) — PlebLab, tiếng Anh. Casey Rodarmor hướng dẫn Ordinals, giúp liên hệ witness Taproot với lớp xuất bản dữ liệu trong bài.
- [Robin Linus Presents BitVM3 | Bitcoin Amsterdam 2025](https://www.youtube.com/watch?v=_lYakucObZ0) — Bitcoin Magazine, tiếng Anh. Robin Linus trình bày về BitVM3, phù hợp để đối chiếu với mô hình tính toán lạc quan trên Script trong bài.

## 7. Bài tập định hướng

1. BIP-324 phòng chống được nhóm tấn công nào đã nêu trong bài 01.00 (kiến trúc mạng), và *không* phòng chống được nhóm tấn công nào?
2. Viết bốn câu giải thích vì sao BitVM *không* biến Bitcoin thành Ethereum, và chỉ ra luận điểm nào trong whitepaper của Satoshi vẫn còn nguyên giá trị.
3. Nếu inscriptions chiếm 50% trọng số block liên tục trong một tuần, mô hình thị trường phí ở bài 01.02 dự đoán điều gì sẽ xảy ra với thời gian xác nhận của các giao dịch thanh toán giá trị nhỏ?

---
✅ **Kết thúc bài học tùy chọn**
Next: [Lecture 02.00 — Proof of Stake]({{ site.baseurl }}/contents/vi/chapter02/)
