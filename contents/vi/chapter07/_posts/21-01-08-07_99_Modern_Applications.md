---
layout: post
title: "Lecture 07.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '07'
order: 7
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter07
lesson_type: optional
---

# Lecture (tùy chọn): Advanced apps 2022–2026 — restaking, ERC-6551, ePBS, ML-KEM

> Bài này là **tùy chọn**. Nó **không** viết lại Governor/DAO, ERC-721, IPFS, định nghĩa MEV, hay toán lattice. Nó chỉ chỉ các *ứng dụng và EIP* đã định hình chương “nâng cao” sau 2022.

## 1. Cùng các chủ đề 07.00–07.05 — lớp sản phẩm mới

Chapter 07 phủ DAO, NFT, Web3 infra, MEV, quantum, tương lai. 2022–2026 thêm bốn lớp sản phẩm: **restaking** (EigenLayer và họ hàng) biến stake Ethereum thành dịch vụ AVS; **token-bound accounts** ([ERC-6551](https://eips.ethereum.org/EIPS/eip-6551)) biến NFT thành ví; **MEV in-protocol** (inclusion lists, ePBS research) sau MEV-Boost; **PQC chuẩn hóa** (FIPS 203) cho lộ trình migrate. Superchain / Orbit biến “một L2” thành *fleet governance* — DAO 07.00 gặp infra 07.02.

![Chuỗi khối — thứ tự giao dịch trong block là sân khấu MEV / PBS](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg). Lộ trình PBS: [ethereum.org/roadmap/pbs](https://ethereum.org/roadmap/pbs/).*

## 2. Các bước tiến then chốt

### 2.1. Restaking: bảo mật như hàng hóa

EigenLayer (whitepaper 2023; mainnet 2024–2025) cho validator / LST *restake* ETH để bảo đảm AVS (oracle, DA, coprocessor, fast finality). Ý kinh tế: tái sử dụng vốn slashable. Ý hệ thống: slashing condition *mới* chồng lên slashing beacon — rủi ro tương quan. Đây là “DAO + staking + oracle” của 07.00/07.02, không phải consensus L1 mới (Chapter 02 vẫn là Gasper).

Học viên nên đọc giả định: AVS bug → slashing lan; governance AVS tập trung; liquid restaking token thêm một lớp deleveraging (sự kiện 2024–2025 trên các LRT).

### 2.2. ERC-6551: NFT như account

[ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) (2023, adoption 2023–2026): registry tạo địa chỉ smart account *xác định* cho mỗi `(chainId, tokenContract, tokenId)`. NFT giữ được asset, ký được (qua implementation), compose được. ERC-721 trong 07.01 không đổi; *ownership* mở rộng từ “token trong ví” sang “ví trong token”. Kết hợp 7702/4337 (03.99): character game, on-chain identity, bundle quyền.

### 2.3. MEV sau 07.03: từ Flashbots auction tới inclusion lists

Bài 07.03 mô tả MEV. Production 2022–2026: MEV-Boost chiếm đa số block (Chapter 02.99). Tiếp theo:

- **Inclusion lists / FOCIL** research: proposer ép một tập tx phải vào block, giảm kiểm duyệt relay.
- **ePBS**: đưa PBS vào protocol, bỏ relay tập trung.
- **Builder concentration** và order-flow auctions (2023–2025) là bài chính trị-kinh tế, không chỉ “sandwich”.

Pectra không “giải MEV”; nó đổi validator economics (7251) và blob supply (7691), tức *đổi sân* MEV.

### 2.4. Quantum: từ “sẽ xảy ra” tới số FIPS

[FIPS 203 ML-KEM](https://csrc.nist.gov/pubs/fips/203/final), 204 ML-DSA, 205 SLH-DSA (13-Aug-2024) cho 07.04 một mốc: thuật toán *có tên chuẩn*. Ethereum / Bitcoin vẫn ECDSA/BLS. Lộ trình thảo luận: dual-sign, address hash chống harvest-now-decrypt-later, kích thước witness. Đừng nhầm “FIPS published” với “mainnet migrated”.

Web3 infra: EIP-4844 DA, PeerDAS, EigenDA, Celestia — 07.02 “IPFS/Filecoin” vẫn đúng cho *nội dung*; DA cho rollup là thị trường *khác* (04.99).

## 3. Insight triển khai

Một NFT 6551 sở hữu USDC và một session key 4337; restaked AVS cung cấp oracle giá; block chứa swap bị builder sắp xếp — cùng một user story đi qua 07.01, 07.02, 07.03. Governance Superchain (OP Collective) vote fault-proof upgrade (04.99) là DAO *điều khiển infra*, không chỉ treasury.

```text
[ERC-721] --6551--> [TBA account] --holds--> assets / session keys
[ETH stake] --restake--> [AVS slashing] --secures--> oracle / DA
[user tx] --public mempool / OF--> [builder] --bid--> [proposer]
```

## 4. Thách thức và trade-off

Restaking: systemic risk, slashing overlay. 6551: implementation registry bị upgrade độc hại; phishing “ký cho TBA”. ePBS tăng độ phức tạp consensus. PQC làm tx nặng — L2 có thể migrate trước L1. DAO fleet (nhiều chain một governor) tạo surface capture lớn hơn DAO đơn.

## 5. Bài này bổ sung gì

Vẫn đọc 07.00–07.05 cho DAO, NFT standards, Web3 stack, MEV basics, PQC theory, tương lai. Bài tùy chọn gắn chúng với EigenLayer, ERC-6551, inclusion lists/ePBS, FIPS 203, Superchain governance.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EigenLayer whitepaper](https://docs.eigenlayer.xyz/) | 2023– | Restaking / AVS |
| [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) | 2023 | Token-bound accounts |
| [MEV-Boost](https://github.com/flashbots/mev-boost) | 2022– | Out-of-protocol PBS |
| [ethereum.org PBS](https://ethereum.org/roadmap/pbs/) | 2023– | Enshrined PBS roadmap |
| [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) | 2024-08-13 | ML-KEM |
| [Pectra](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | Validator + blob + 7702 |
| [OP Superchain / Stage 1](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack) | 2024 | Fleet governance + proofs |

## 7. Bài tập định hướng

1. Restaking: viết điều kiện slashing *thứ hai* (AVS) và giải thích vì sao tương quan với slashing beacon là rủi ro hệ thống.
2. ERC-6551 vs EIP-7702: cái nào gắn *token*, cái nào gắn *EOA*? Khi nào dùng cả hai?
3. Đọc trang PBS trên ethereum.org và chỉ ra *một* thuộc tính kiểm duyệt mà inclusion list muốn phục hồi so với MEV-Boost thuần.

---
✅ **End of optional lesson**
Next: [Course home]({{ site.baseurl }}/)
