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

> Bài này là **tùy chọn**. Nó **không** viết lại UTXO, Script, difficulty adjustment, hay game theory phí. Nó chỉ chỉ các hệ thống *đã triển khai hoặc đặc tả* trên cùng kiến trúc Bitcoin mà Chapter 01 đã dạy.

## 1. Vì sao kiến trúc 2008–2017 vẫn là nền — và lớp nào đã chuyển

Bitcoin Core vẫn là node PoW + UTXO + Script. Khoảng 2022–2026, ba lớp *xung quanh* consensus thay đổi nhanh: (1) **transport P2P** được mã hóa (BIP-324), (2) **compute lạc quan trên Script/Taproot** (BitVM / BitVM2) mà không soft-fork opcode mới, (3) **dữ liệu trong witness** (inscriptions / Ordinals) biến block space thành lớp xuất bản, và (4) **đồng bộ node** (assumeUTXO) để IBD không còn là rào cản xã hội duy nhất.

Taproot (BIP-340/341/342, kích hoạt tháng 11 năm 2021) là điều kiện tiên quyết — bài 01.00 đã nhắc. Bài này bắt đầu *sau* Taproot: người ta *dùng* cây MAST và Schnorr để làm những việc mà Script đời 2011 không tưởng.

![Cấu trúc block Bitcoin — UTXO/Script vẫn là lớp BitVM và BIP-324 bám vào](https://upload.wikimedia.org/wikipedia/commons/5/55/Bitcoin_Block_Data.svg)
*Nguồn: [Wikimedia Commons — Bitcoin block data](https://commons.wikimedia.org/wiki/File:Bitcoin_Block_Data.svg)*

## 2. Các bước tiến then chốt

### 2.1. BIP-324: transport v2, không phải consensus mới

[BIP-324](https://github.com/bitcoin/bips/blob/master/bip-0324.mediawiki) (Mehta, Ruffing, Schnelli, Wuille; status *Deployed*, bản 1.0.0 ngày 10-Jul-2024) thay P2P v1 plaintext bằng transport mã hóa cơ hội: handshake ECDH, bytestream trông ngẫu nhiên với eavesdropper thụ động, và khả năng đàm phán nâng cấp *trước* khi đổi message ứng dụng. Node quảng bá `NODE_P2P_V2`. Nếu peer cắt kết nối, client thử lại v1.

Đây là bài tập distributed systems của 00.01 gắn lên Bitcoin: kẻ tấn công nghe chùa trên ISP không còn đọc inventory/tx một cách miễn phí; chi phí traffic analysis tăng. **Không** có opcode mới, **không** đổi PoW. Bitcoin Core 26+ bật v2 theo mặc định cho kết nối outbound.

### 2.2. BitVM và BitVM2: “compute anything” mà không đổi consensus

Robin Linus, *BitVM: Compute Anything on Bitcoin* (9 / 12 tháng 12 năm 2023, [bitvm.org/bitvm.pdf](https://bitvm.org/bitvm.pdf)) đề xuất mô hình lạc quan: prover cam kết một chương trình lớn trong cây Taproot; chỉ khi tranh chấp mới mở fraud proof trên chuỗi, giống optimistic rollup. Primitive là hashlock, timelock, và lá Taproot — đúng Script mà 01.00 đã dạy, xếp thành mạch bit.

BitVM2 (Linus et al., 2024, [bitvm.org/bitvm_bridge.pdf](https://bitvm.org/bitvm_bridge.pdf)) giảm tranh chấp xuống khoảng ba giao dịch on-chain, cho phép *permissionless challenging*, và dùng script xác minh SNARK bị cắt nhỏ. Ứng dụng trưng bày là **BitVM Bridge**: giả định an toàn tiền gửi từ honest-majority \(t\)-of-\(n\) xuống *existential honesty* (1-of-\(n\)) lúc setup; liveness cần một operator hợp lý.

Bài học kiến trúc: Bitcoin không cần EVM để *xác minh* tính toán tùy ý; nó cần một giao thức challenge và một cam kết Taproot. Giá phải trả là giao tiếp off-chain và độ phức tạp setup — không phải throughput 7 TPS biến thành 7000.

### 2.3. Inscriptions / Ordinals: witness như lớp xuất bản

Giao thức Ordinals (Casey Rodarmor, 2023) đánh số satoshi và “khắc” dữ liệu vào witness của giao dịch Taproot. Về mặt kỹ thuật đây là *hệ quả* của SegWit + Taproot: witness được giảm giá và không nằm trong `txid` gốc. Về mặt kinh tế, đây là cú sốc fee market mà bài 01.02 mô hình hóa: block space bỗng có demand phi-thanh-toán. Bitcoin Core không “cấm” inscriptions ở lớp consensus; chính sách mempool (`datacarrier`, kích thước witness) mới là chỗ tranh cãi.

Đừng biến bài này thành lịch sử NFT. Câu hỏi đúng: *UTXO + witness discount* đã tạo ra một thị trường dữ liệu mà whitepaper 2008 không thiết kế — và difficulty/fee game vẫn là thứ quyết định ai thắng đấu giá block.

### 2.4. assumeUTXO và cluster mempool: node như hệ thống phân tán

assumeUTXO (Bitcoin Core, triển khai dần 2023–2025) cho phép node mới tải một snapshot UTXO đã cam kết, rồi bắt kịp tip, *song song* với việc xác minh background về genesis. Đây là cùng ý “checkpoint có chủ đích” — không thay PoW, chỉ thay *thứ tự đồng bộ*. Cluster mempool (thiết kế 2023–2025, vào Core theo lộ trình) mô hình hóa mempool như đồ thị phụ thuộc ancestor/descendant để chọn gói phí tối ưu hơn ancestor-score cổ điển. Cả hai đều là *systems work* trên kiến trúc 01.00, không phải alt-consensus.

## 3. Insight triển khai

Một bridge BitVM2 không “gửi BTC vào hợp đồng EVM”. Operator và committee pre-sign một tập giao dịch contest; user khóa UTXO vào script mà *bất kỳ ai* cũng có thể challenge nếu output root sai. On-chain footprint nhỏ khi mọi người thành thật — đúng câu “Script là verifier, không phải computer” của 01.00.

```text
[BTC locker script / Taproot]
        |  honest path: cooperative spend
        |  dispute path:  ~3 txs  (BitVM2)
        v
[SNARK verifier script slices] --> punish operator
```

Với BIP-324, `bitcoin-cli getpeerinfo` hiện trường `transport_protocol_type` (`v2` / `v1`). Đó là cách kiểm tra bài học: encryption là peer service, không phải soft-fork.

## 4. Thách thức và trade-off

BitVM setup nặng và giả định tồn tại ít nhất một verifier tỉnh táo. Inscriptions làm tăng bloat và tranh cãi văn hóa “Bitcoin là gì”. BIP-324 không chống active MITM có khả năng ép downgrade nếu peer không kiên quyết. assumeUTXO chuyển niềm tin sang *ai hash snapshot* — học viên phải đọc đúng giả định, không nhầm với SPV yếu.

## 5. Bài này bổ sung gì

Vẫn đọc 01.00–01.02 để hiểu UTXO, Script, PoW, halving, fee market. Bài tùy chọn chỉ nối chúng với BIP-324, BitVM/BitVM2, Ordinals, và assumeUTXO.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [BIP-324: Version 2 P2P Encrypted Transport](https://github.com/bitcoin/bips/blob/master/bip-0324.mediawiki) | 2024 (Final) | Mã hóa P2P opportunistic |
| [BitVM (Linus, Dec 2023)](https://bitvm.org/bitvm.pdf) | 2023 | Optimistic compute trên Taproot |
| [BitVM2 / BitVM Bridge](https://bitvm.org/bitvm_bridge.pdf) | 2024 | Permissionless challenge; bridge 1-of-n |
| [BIP-340/341/342 Taproot](https://github.com/bitcoin/bips) | 2021 | Điều kiện tiên quyết Schnorr + MAST |
| [assumeUTXO design notes](https://github.com/bitcoin/bitcoin) / Bitcoin Core docs | 2023–2025 | IBD song song với snapshot UTXO |
| Ordinals / inscriptions (Rodarmor) | 2023 | Witness as publication layer |

## 7. Bài tập định hướng

1. BIP-324 chống được lớp tấn công nào mà bài 01.00 (network architecture) đã nêu, và *không* chống được lớp nào?
2. Viết bốn câu: BitVM *không* biến Bitcoin thành Ethereum. Câu nào trong whitepaper Satoshi vẫn đúng?
3. Nếu inscriptions chiếm 50% trọng số block trong một tuần, mô hình fee của 01.02 dự đoán gì về confirmation time của thanh toán nhỏ?

---
✅ **End of optional lesson**
Next: [Lecture 02.00 — Proof of Stake]({{ site.baseurl }}/contents/vi/chapter02/)
