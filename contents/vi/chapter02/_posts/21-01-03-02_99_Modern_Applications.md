---
layout: post
title: "Lecture 02.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '02'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter02
lesson_type: optional
---

# Lecture (tùy chọn): Consensus production 2022–2026 — Merge, PBS, Pectra staking, CometBFT

> Bài này là **tùy chọn**. Nó **không** viết lại Casper FFG, LMD-GHOST, PBFT hay Tendermint. Nó chỉ chỉ các *triển khai và fork* đã xảy ra trên cùng các protocol mà Chapter 02 đã phân tích.

## 1. Từ “Ethereum 2.0 trên slide” tới beacon chain production

Bài 02.00 mô tả PoS, nothing-at-stake, slashing. Ngày 15 tháng 9 năm 2022, [The Merge](https://ethereum.org/roadmap/merge/) tắt PoW execution và gắn engine vào beacon chain: cùng state EVM, consensus đổi sang Gasper (FFG + LMD-GHOST). Đó không phải alt-chain mới; đó là *thay trái tim* của một state machine đã chạy từ 2015.

Sau Merge, nút thắt không còn “PoS có hoạt động không?” mà là: ai *xây* block (PBS / MEV-Boost), validator set có co giãn được không (EIP-7251), và exit có thể kích hoạt từ execution layer không (EIP-7002). Phía BFT cổ điển, Tendermint Core trở thành [CometBFT](https://docs.cometbft.com/) (2023) — cùng thuật toán, governance và stack Cosmos tách khỏi Informal Systems brand.

![Chuỗi khối — cùng sổ cái, trái tim consensus đổi sau The Merge](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg)*

Xem thêm sơ đồ validator/attest tại [ethereum.org — Proof of Stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/).

## 2. Các bước tiến then chốt

### 2.1. The Merge như một bài toán distributed systems

Merge đòi hỏi mọi execution client và consensus client đồng bộ một `Terminal Total Difficulty`, rồi chuyển sang slot/epoch. Đây là *coordinated hard fork* trên hai lớp — minh họa FLP/partial synchrony của 00.01: an toàn dựa trên đồng hồ slot 12 giây và committee vote, không dựa trên năng lượng. [Paris / Bellatrix specs](https://github.com/ethereum/consensus-specs) vẫn là tài liệu đọc sau khi đã hiểu Gasper trong 02.00.

Hệ quả kinh tế: issuance PoW biến mất; staking yield và fee (kể cả MEV) trở thành incentive chính — nối thẳng bài 02.00 “validator selection / slashing” với production.

### 2.2. Proposer-Builder Separation và MEV-Boost

Sau Merge, phần lớn block Ethereum được xây bởi *builder* chuyên biệt và đề xuất qua [MEV-Boost](https://github.com/flashbots/mev-boost) (Flashbots): proposer chọn header có bid cao nhất từ relay, không thấy nội dung đầy đủ cho đến khi nhận payload. Đây là PBS *out-of-protocol* — cùng ý BFT “ai đề xuất, ai vote”, nhưng thị trường MEV tách vai trò để giảm tích tụ quyền lực ở validator lớn.

Hệ quả consensus: liveness phụ thuộc relay/builder trung thực; censorship (OFAC relays 2022) trở thành vấn đề *protocol-adjacent*. Nghiên cứu 2023–2026 đi tới ePBS (enshrined PBS) và inclusion lists — sẽ gặp lại ở Chapter 07. Ở Chapter 02, bài học là: **cơ chế đồng thuận production không chỉ là fork-choice**; nó là thị trường quyền đề xuất.

### 2.3. Pectra staking: EIP-7251 và EIP-7002

[Pectra](https://blog.ethereum.org/2025/04/23/pectra-mainnet) kích hoạt 7 tháng 5 năm 2025 (epoch 364032). Hai EIP consensus quan trọng:

- **[EIP-7251](https://eips.ethereum.org/EIPS/eip-7251)** tăng `MAX_EFFECTIVE_BALANCE` từ 32 ETH lên 2048 ETH (opt-in, withdrawal credential mới). Staker gộp validator, thưởng compound trên từng ETH trên mức tối thiểu. Đây là câu trả lời engineering cho “hàng triệu validator làm gossip và attestation set phình” — trade-off decentralization *số lượng khóa* lấy *số lượng thực thể*.
- **[EIP-7002](https://eips.ethereum.org/EIPS/eip-7002)** cho phép kích hoạt exit từ execution layer (smart contract / credential 0x01/0x02), không chỉ từ signing key consensus. Tách *custody* và *validator duty* — quan trọng cho staking pool.

[EIP-6110](https://eips.ethereum.org/EIPS/eip-6110) đưa deposit lên EL; [EIP-7549](https://eips.ethereum.org/EIPS/eip-7549) dời committee index ra ngoài attestation để aggregation rẻ hơn. Cùng một Gasper, *đường ống* validator được tái cấu trúc.

### 2.4. CometBFT, HotStuff-2, và SSF research

Cosmos SDK mặc định chuyển sang CometBFT: cùng vòng đề xuất + prevote/precommit 2/3 như Tendermint trong 02.01, cộng ABCI 2.0 (vote extensions). HotStuff-2 (2023) và các biến thể Jolteon rút latency BFT. Ethereum research theo đuổi **single-slot finality** — FFG hiện finality theo epoch 32 slot; SSF muốn một slot ≈ một quyết định, đổi bandwidth lấy UX. Chưa phải production 2026 trên L1, nhưng đó là hướng đọc sau khi đã hiểu 02.00–02.01.

## 3. Insight triển khai

Một validator hiện đại chạy cặp `geth`/`lighthouse` (hoặc tương đương), đăng ký MEV-Boost relay, và — sau Pectra — có thể cấu hình số dư hiệu dụng > 32 ETH. Slashing vẫn là điều kiện an toàn nothing-at-stake; PBS không thay slashing, nó thay *ai được viết giao dịch vào block*.

```text
[searchers] --> [builders] --> [relays] --> [proposer / beacon]
                                              |
                                         fork-choice
                                         (LMD-GHOST + FFG)
```

CometBFT app gắn qua ABCI: `PrepareProposal` / `ProcessProposal` cho phép ứng dụng *thấy* đề xuất trước khi vote — đó là chỗ Cosmos nhúng vote extensions, không phải chỗ “BFT khác PBFT”.

## 4. Thách thức và trade-off

PBS out-of-protocol tạo điểm kiểm duyệt. MaxEB lớn giảm số validator object nhưng tăng trọng số mỗi khóa bị tấn công. EIP-7002 nếu triển khai ẩu có thể để smart contract ép exit. SSF tăng yêu cầu đồng bộ. CometBFT vẫn \(O(n^2)\) all-to-all trên committee — sharding / ICS không xóa bound ấy.

## 5. Bài này bổ sung gì

Vẫn chứng minh safety/liveness từ 02.00–02.02. Bài tùy chọn chỉ gắn chúng với Merge, MEV-Boost, Pectra staking EIPs, và CometBFT.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [The Merge (ethereum.org)](https://ethereum.org/roadmap/merge/) | 2022-09-15 | PoS production trên mainnet |
| [MEV-Boost](https://github.com/flashbots/mev-boost) | 2022– | PBS out-of-protocol |
| [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) | 2025 | Max effective balance 2048 ETH |
| [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) | 2025 | EL-triggerable exits |
| [Pectra announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025-05-07 | Electra + Prague |
| [CometBFT docs](https://docs.cometbft.com/) | 2023– | Tendermint successor |
| [HotStuff-2 (arXiv:2302.07871)](https://arxiv.org/abs/2302.07871) | 2023 | BFT latency refinements |

## 7. Bài tập định hướng

1. Vẽ lại sơ đồ “proposer / attester” của 02.00 và đánh dấu chỗ MEV-Boost chèn vào. Safety của FFG có phụ thuộc relay không?
2. EIP-7251 giảm số validator từ \(N\) xuống \(\approx N/64\) nếu mọi người gộp tối đa. Gossip attestation thay đổi thế nào?
3. So sánh điều kiện exit: signing key (trước 7002) vs EL trigger. Ai thắng trong kịch bản pool bị tấn công?

---
✅ **End of optional lesson**
Next: [Lecture 03.00 — Ethereum Architecture]({{ site.baseurl }}/contents/vi/chapter03/)
