---
layout: post
title: "Lecture 04.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '04'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter04
lesson_type: optional
---

# Lecture (tùy chọn): Scaling production 2022–2026 — blobs, fault proofs, BoLD, zkEVM, PeerDAS

> Bài này là **tùy chọn**. Nó **không** viết lại blockchain trilemma, state channel, hay định nghĩa optimistic / ZK-rollup. Nó chỉ chỉ các hệ thống *đã lên mainnet* và các EIP DA đã kích hoạt.

## 1. Rollup-centric không còn là roadmap giấy

Bài 04.00–04.02 đặt vấn đề 7–30 TPS và phác thảo rollup / sharding. Ethereum chính thức chọn **rollup-centric roadmap**: L1 bán data availability + settlement; L2 bán execution. Ba cột mốc production:

1. **Proto-danksharding** — [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), Dencun 13-Mar-2024: làn blob rẻ, prune ~18 ngày.
2. **Fault proofs permissionless** — OP Stack Stage 1 (OP Mainnet, 10-Jun-2024) và Arbitrum **BoLD**.
3. **DAS** — [PeerDAS / EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) trong Fusaka: node không còn tải hết mọi blob.

zkEVM (zkSync Era, Scroll, Linea, Polygon zkEVM, 2023–2025) đưa ZK-rollup từ paper sang EVM-equivalent *đủ* để deploy Solidity thật. Based / native rollup research (2024–2026) hỏi lại: sequencer có cần là entity riêng không?

![Chuỗi khối L1 — rollup neo DA/settlement vào đây; sau 2024 làn rẻ là blob](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg). Phân loại L2: [ethereum.org/layer-2](https://ethereum.org/layer-2/) và [L2BEAT](https://l2beat.com/scaling/summary).*

## 2. Các bước tiến then chốt

### 2.1. EIP-4844 và thị trường blob gas

Mỗi blob 4096 field elements × 32 B ≈ 128 KiB. Commitment KZG; execution chỉ thấy versioned hash. Fee: `blob_gas` riêng, cập nhật giống EIP-1559. [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) (Pectra, May 2025) tăng target/max blob. Kết quả quan sát: phí L2 giảm một bậc ngay tuần đầu Dencun (Arbitrum, Optimism, Base, Linea).

Đây là lời giải *tạm* cho 04.02 “sharding”: chưa chia execution, chỉ chia *DA bandwidth*. Danksharding đầy đủ = nhiều blob hơn + DAS. 4844 ship *format* trước *sampling*.

### 2.2. Optimistic rollup bước sang Stage 1

Ngày 10 tháng 6 năm 2024, [Optimism công bố permissionless fault proofs](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack): bất kỳ ai cũng đề xuất output root và challenge; Security Council vẫn là backstop (định nghĩa Stage 1 của L2BEAT / Vitalik). Cannon (MIPS) / các VM fault-proof là *implementation* của trò chơi bisection mà 04.01 đã mô tả.

Arbitrum thay dispute protocol cũ bằng **BoLD** (*Bounded Liquidity Delay*; [arXiv:2404.10491](https://arxiv.org/abs/2404.10491), AFT 2024; [docs](https://docs.arbitrum.io/how-arbitrum-works/bold/gentle-introduction)): chống delay attack, chặn thời gian tranh chấp, mở validation permissionless trên One/Nova. Cùng optimistic assumption — khác *game lý thuyết delay*.

Stage 2 (“no training wheels”) vẫn là đích: bỏ council, đa prover. Học viên đọc L2BEAT stages *sau* khi đã hiểu fraud proof trong 04.01.

### 2.3. zkEVM và zkVM production

2023–2025: nhiều team đạt “EVM-equivalent” hoặc “EVM-compatible” với proof trên L1. Chi phí chứng minh (GPU, recursion, STARK→SNARK wrapper Groth16/Plonk) là bottleneck, không phải định nghĩa SNARK trong Chapter 05. Superchain (OP Stack) và Orbit (Arbitrum) biến rollup thành *framework*: cùng settlement, khác execution policy.

### 2.4. PeerDAS: sharding dữ liệu thật sự

[PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) chia blob thành 128 cột, erasure code, mỗi node custody ~1/8 (subscribe 8 subnet ngẫu nhiên). Xác minh availability bằng lấy mẫu — đúng tinh thần 04.02 mà không đợi execution sharding. [EIP-7892](https://eips.ethereum.org/EIPS/eip-7892) BPO forks tăng số blob theo lịch mà không cần hard fork văn hóa lớn.

Based rollup (sequencing bởi L1 proposers) và native rollup (precompile thực thi) là hướng 2025–2026: giảm sequencer trust, tăng coupling với PBS của Chapter 02.

## 3. Insight triển khai

Sequencer OP Stack sau Dencun: `op-batcher` chọn blob thay calldata khi `blob_base_fee` rẻ hơn. Fault proof: `op-challenger` theo dõi `DisputeGameFactory`, bisection xuống một instruction MIPS. Không cần học lại “optimistic vs ZK”; cần thấy *binary và role* (batcher, proposer, challenger, guardian).

```text
L2 blocks --> batcher --(EIP-4844 blob)--> L1 consensus (prune ~18d)
                 \
                  proposer --> output root --> DisputeGame
                                    ^
                                    challenger (permissionless, Stage 1)
```

## 4. Thách thức và trade-off

Blob prune đẩy gánh lưu trữ lịch sử sang rollup/archive. Stage 1 vẫn có council — không quảng cáo “trustless”. zkEVM prover tập trung (vài data center). PeerDAS tăng độ phức tạp networking; DAS sai tham số = mất safety availability. Based rollup đánh đổi latency UX lấy decentralization sequencer.

## 5. Bài này bổ sung gì

Vẫn dùng 04.00–04.02 cho trilemma, kênh thanh toán, định nghĩa rollup, sharding. Bài tùy chọn gắn chúng với 4844, OP fault proofs, BoLD, zkEVM mainnet, PeerDAS.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) | 2024 | Proto-danksharding |
| [Dencun FAQ](https://ethereum.org/roadmap/dencun/) | 2024-03-13 | Blob lifecycle ~4096 epoch |
| [OP fault proofs / Stage 1](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack) | 2024-06-10 | Permissionless withdrawal proofs |
| [BoLD (arXiv:2404.10491)](https://arxiv.org/abs/2404.10491) | 2024 | Bounded dispute; AFT 2024 |
| [PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) | 2025 | EIP-7594 column sampling |
| [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) | 2025 | Tăng blob throughput |
| [L2BEAT scaling](https://l2beat.com/scaling/summary) | 2022– | Stage 0/1/2 taxonomy |

## 7. Bài tập định hướng

1. Vì sao cửa sổ prune blob ~18 ngày phải dài hơn withdrawal delay 7 ngày của optimistic rollup?
2. So sánh delay attack trên dispute protocol Arbitrum *trước* BoLD và bound mà BoLD cam kết.
3. PeerDAS: nếu một node chỉ custody 8/128 cột, xác suất một blob *không available* bị bắt bởi \(k\) sample độc lập là gì (mô hình đơn giản)?

---
✅ **End of optional lesson**
Next: [Lecture 05.00 — Blockchain Privacy]({{ site.baseurl }}/contents/vi/chapter05/)
