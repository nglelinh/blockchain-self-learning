---
layout: post
title: "Lecture 06.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '06'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter06
lesson_type: optional
---

# Lecture (tùy chọn): Interop 2022–2026 — IBC, CCIP, LayerZero v2, ERC-7683 intents

> Bài này là **tùy chọn**. Nó **không** viết lại atomic swap, HTLC, hay kiến trúc bridge lock-and-mint. Nó chỉ chỉ các *mạng tin nhắn và intent* đã thành production, cùng bài học bảo mật sau các vụ hack 2022–2024.

## 1. Sau “bridge là điểm yếu”

Bài 06.00–06.02 dạy HTLC, light-client vs federated vs optimistic bridge, Polkadot parachain và Cosmos IBC. Thực tế 2022–2024: hàng tỷ USD mất qua cầu (Ronin, Wormhole, Nomad, Multichain…). Câu trả lời công nghiệp không phải “một cầu duy nhất đúng”, mà là **tách lớp**: (1) *message passing* có giả định tin cậy rõ, (2) *settlement / liquidity* (intents, solver), (3) *shared security* (ICS, restaked verification).

IBC vẫn là chuẩn light-client-to-light-client. Chainlink **CCIP** và LayerZero **v2** chiếm thị phần app-chain EVM. [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) (2024–) chuẩn hóa cross-chain *intents* — user ký “tôi muốn 1000 USDC trên chain B”, solver cạnh tranh thực hiện, không bắt user tự mint wrapper.

![IBC — hai chain, relayer, light client](https://tutorials.cosmos.network/resized-images/600/academy/2-cosmos-concepts/images/ibc.png)
*Nguồn: [Cosmos Academy — IBC](https://tutorials.cosmos.network/). Spec: [ibc.cosmos.network](https://ibc.cosmos.network/).*

## 2. Các bước tiến then chốt

### 2.1. IBC vượt “chỉ Cosmos”

IBC (ICS-02 clients, ICS-03 connections, ICS-04 channels) trong 06.02 là lý thuyết **IBC Classic**. Từ ibc-go v10, cùng repo còn **IBC v2**: bỏ handshake channel nhiều bước, packet tham chiếu cặp light client, timeout theo timestamp (phù hợp EVM), payload khai báo version/encoding từng gói — thiết kế để nối Cosmos với Ethereum (IBC Eureka). 2023–2026 còn Interchain Security / Replicated Security (Hub chia validator set cho consumer chain). Polkadot chuyển sang **Agile Coretime** (2024): parachain không còn slot auction 2 năm; coretime là hàng hóa — cùng ý “shared security”, khác thị trường tài nguyên.

Đọc: [IBC docs](https://ibc.cosmos.network/), [Polkadot Agile Coretime](https://wiki.polkadot.network/docs/learn-agile-coretime).

### 2.2. CCIP và LayerZero v2: message bus có giả định khác IBC

[Chainlink CCIP](https://docs.chain.link/ccip) : DON oracle + Risk Management Network; lane giữa hai chain; token pool (lock/burn). Giả định: không phải 2/3 validator đối phương, mà là mạng oracle + mạng rủi ro độc lập. Đó là *external verification* — hợp lệ nếu học viên kể đúng trust set.

[LayerZero v2](https://docs.layerzero.network/v2) (2024): tách **DVN** (Decentralized Verifier Networks) và **Executor**. App chọn tập DVN (multisig, zk, native client…). Ultra Light Node đời v1 bị chỉ trích; v2 biến *security stack* thành cấu hình, không phải một relayer thần thánh.

Cả hai **không** thay HTLC cho atomic swap không tin cậy; chúng thay *kênh tin nhắn có chủ* cho DeFi đa chain.

### 2.3. Intents: ERC-7683 và Across-style

[ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) (Across / Uniswap labs et al.): `ISettlement` + order struct chung. User không gọi bridge contract trên nguồn rồi mint trên đích; họ đăng intent, solver ứng vốn trên đích, rồi settle. An toàn phụ thuộc *settlement contract + bonding*, không phụ thuộc “khóa token mãi trên cầu nóng”.

Đây là bước đi từ 06.01 “bridge architecture” sang *market for fills*. HTLC vẫn đúng cho atomic swap hai party; intent đúng cho “tôi không quan tâm path”.

### 2.4. Bài học hack: ánh xạ lại 06.01

| Sự cố (minh họa) | Lớp vỡ | Liên hệ bài bắt buộc |
| --- | --- | --- |
| Validator / multisig bị chiếm | trusted federation | 06.01 trust assumptions |
| Thông điệp giả / không verify proof | light client thiếu hoặc tắt | 06.00 “verify, don’t trust” |
| Upgrade proxy độc hại | governance cầu | 06.01 + Chapter 07 DAO |
| Liquidity pool cầu rỗng | economic design | không phải bug consensus |

BitVM2 bridge (Chapter 01.99) là một câu trả lời *Bitcoin-side* cho cùng bài toán 1-of-n honesty.

## 3. Insight triển khai

Một app 2025: user trên Arbitrum ký ERC-7683 order; solver fill trên Optimism; settlement dùng CCIP *hoặc* native L1 proof tùy lane. IBC packet vẫn là `(port, channel, sequence)` như 06.02; chỉ endpoint có thể là rollup.

```text
[user intent / 7683] --> [solver network] --> [fill on dest]
                              |
                         settlement
                    (IBC / CCIP / L0 / L1 proof)
```

Khi audit: vẽ *ba* hộp — verification, execution, liquidity — rồi hỏi hộp nào bị giả định honest majority.

## 4. Thách thức và trade-off

Message bus EVM thường *không* atomic với state hai bên (khác HTLC). DVN/oracle set có thể trùng với team app. Intent solver có thể kiểm duyệt hoặc trích MEV từ order của user. IBC light client trên Ethereum đắt cho đến khi blob/zk-client đủ rẻ. Agile Coretime đổi chính trị parachain, không xóa cầu EVM–Substrate.

## 5. Bài này bổ sung gì

Vẫn đọc 06.00–06.02 cho HTLC, phân loại cầu, IBC/Polkadot cổ điển. Bài tùy chọn gắn chúng với IBC mở rộng, CCIP, LayerZero v2, ERC-7683, và phân tích sự cố.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [IBC protocol](https://ibc.cosmos.network/) | 2022– | Clients / channels; ICS evolution |
| [CCIP docs](https://docs.chain.link/ccip) | 2023– | Cross-chain token + arbitrary message |
| [LayerZero v2](https://docs.layerzero.network/v2) | 2024 | Configurable DVN + Executor |
| [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) | 2024 | Cross-chain intent standard |
| [Polkadot Agile Coretime](https://wiki.polkadot.network/docs/learn-agile-coretime) | 2024 | On-demand blockspace |
| [BitVM2 Bridge](https://bitvm.org/bitvm_bridge.pdf) | 2024 | 1-of-n Bitcoin-side bridge |
| L2BEAT / Rekt newsletters | 2022–2024 | Bridge incident catalog (đọc phê phán) |

## 7. Bài tập định hướng

1. Vẽ trust set: HTLC hai party vs CCIP lane vs IBC Tendermint client. Ai có thể đánh cắp quỹ?
2. ERC-7683: nếu solver fill rồi settlement thất bại, invariant nào phải giữ cho user?
3. Đọc một post-mortem cầu 2022–2023 và gắn vào đúng mục “Common Challenges” của 06.01 — không viết lại lý thuyết.

---
✅ **End of optional lesson**
Next: [Lecture 07.00 — DAOs]({{ site.baseurl }}/contents/vi/chapter07/)
