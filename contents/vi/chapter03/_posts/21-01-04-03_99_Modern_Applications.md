---
layout: post
title: "Lecture 03.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '03'
order: 5
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
lesson_type: optional
---

# Lecture (tùy chọn): Ethereum & DeFi 2022–2026 — Dencun, Pectra, 4337/7702, Uniswap v4, Foundry

> Bài này là **tùy chọn**. Nó **không** viết lại account model, opcode EVM, Solidity, hay AMM constant-product. Nó chỉ chỉ các nâng cấp protocol và stack phát triển đã trở thành mặc định khoảng 2022–2026.

## 1. Cùng một EVM — khác đường ống lên L1

Bài 03.00–03.03 dạy Ethereum như world computer: account, state trie, EVM, gas, Uniswap v2-style AMM, Aave/Compound lending. Từ The Merge (2022) qua Shanghai withdrawals (2023), Dencun (2024) và Pectra (2025), *state transition* gần như giữ nguyên trong đầu học viên — nhưng *cách user và contract chạm vào L1* đổi: blob thay calldata cho rollup, EOA có thể mang code (EIP-7702), ERC-4337 bundler trở thành mempool thứ hai, Uniswap v4 biến pool thành hook machine, và Foundry (`forge`/`cast`/`anvil`) thay Truffle làm toolchain chuẩn.

![Logo Ethereum — cùng state machine; Dencun/Pectra đổi đường ống, không đổi mô hình account/EVM](https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg)
*Nguồn: [Wikimedia Commons — Ethereum logo](https://commons.wikimedia.org/wiki/File:Ethereum_logo_2014.svg). Tài liệu EVM: [ethereum.org](https://ethereum.org/developers/docs/evm/).*

## 2. Các bước tiến then chốt

### 2.1. Dencun trên execution layer: không chỉ “rẻ hơn cho L2”

[Dencun](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) (13-Mar-2024) không chỉ EIP-4844. Trên EVM:

- **[EIP-1153](https://eips.ethereum.org/EIPS/eip-1153)** transient storage (`TLOAD`/`TSTORE`) — state sống trong transaction, hết gas-refund game của `SSTORE` tạm.
- **[EIP-4788](https://eips.ethereum.org/EIPS/eip-4788)** đưa beacon block root vào EVM — trustless access tới consensus (staking pools, oracles).
- **[EIP-5656](https://eips.ethereum.org/EIPS/eip-5656)** `MCOPY`; **[EIP-6780](https://eips.ethereum.org/EIPS/eip-6780)** thu hẹp `SELFDESTRUCT` còn cùng-transaction.

Đây là “EVM deep dive” phiên bản 2024: opcode mới, không phải mô hình mới. Hợp đồng DeFi dùng transient storage cho reentrancy lock rẻ; pool staking đọc 4788 thay vì oracle tự viết.

### 2.2. Account abstraction: ERC-4337 rồi EIP-7702

[ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) (EntryPoint 0.6/0.7, canonical 2023) không đổi consensus. User gửi `UserOperation` vào alt-mempool; bundler đóng thành một giao dịch gọi `EntryPoint.handleOps`. Paymaster trả gas; signature có thể là passkey / multisig / session key.

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) (Pectra, 7-May-2025) đi vào protocol: EOA ký authorization, node set code cho địa chỉ đó trong các giao dịch type-4. Cùng địa chỉ, cùng ECDSA — thêm batch, sponsorship, delegated logic. Ví MetaMask / hardware không cần “tạo smart account mới” để có UX 4337-like.

Phân biệt giảng đường: **4337 = infra lớp ứng dụng**; **7702 = semantics tài khoản tại protocol**. Cả hai đều *dùng* mô hình account của 03.00, không thay trie.

### 2.3. Uniswap v4 hooks và ERC-4626

Uniswap v4 (docs: [docs.uniswap.org/contracts/v4](https://docs.uniswap.org/contracts/v4/overview), hook math 2023–2025) giữ tập trung thanh khoản v3 nhưng đưa *singleton pool* và **hooks**: contract ngoài được gọi tại các điểm `beforeSwap` / `afterSwap` / add-liquidity. AMM \(x\cdot y = k\) (và v3 ticks) vẫn đúng; cái mới là *programmability tại biên pool* — limit order, dynamic fee, KYC hook, custom oracle.

[ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) (Tokenized Vault Standard, final 2022, adoption 2022–2026) chuẩn hóa `deposit`/`redeem`/`convertToShares` cho vault lợi suất. Aave/Compound *mechanism* trong 03.03 không đổi; cách integrators nói chuyện với yield thì có interface chung — giảm lỗi làm tròn và attack surface “vault không tương thích”.

### 2.4. Foundry, Solidity via-IR, custom errors

Foundry (Paradigm, mainstream 2022–) : test Solidity-in-Solidity, fuzz (`forge test --fuzz-runs`), `anvil`, script. Solidity 0.8.x custom errors và pipeline **via-IR** (mặc định dần 0.8.13+) đổi codegen, không đổi semantics ngôn ngữ trong 03.02. Học viên vẫn học storage vs memory; họ chỉ chạy `forge` thay `truffle migrate`.

Pectra còn [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) BLS precompile — pairing trên EL cho AA, light client, zk verifier — nối EVM với đường cong beacon.

## 3. Insight triển khai

Một luồng 2025 điển hình: user EOA 7702-delegate tới contract batch; một `UserOperation` 4337 (nếu ví vẫn trên EntryPoint) hoặc một type-4 tx; swap đi vào Uniswap v4 pool có hook fee; thanh khoản nằm trong ERC-4626 vault. Toàn bộ vẫn là `CALL`/`SSTORE`/event như 03.01.

```solidity
// Ý tưởng 7702: logic nằm ở implementation, địa chỉ vẫn là EOA.
// Không phải bài "học Solidity từ đầu" — chỉ thấy delegation.
function executeBatch(Call[] calldata calls) external {
    require(msg.sender == address(this) || msg.sender == owner);
    for (uint i; i < calls.length; i++) {
        (bool ok,) = calls[i].to.call{value: calls[i].value}(calls[i].data);
        require(ok);
    }
}
```

`forge test` fuzz invariant “shares * price ≈ assets” cho ERC-4626 — đó là chỗ DeFi 03.03 gặp toolchain 2024.

## 4. Thách thức và trade-off

7702 delegation độc hại = mất quỹ tại *đúng địa chỉ* user vẫn dùng. Hook Uniswap v4 là bề mặt tấn công mới (callback reentrancy, fee griefing). Transient storage dễ hiểu nhầm là persistent. Via-IR có thể đổi gas so với legacy codegen — test trên compiler version pin. Blob fee tách khỏi priority fee: contract “tối ưu calldata” cũ có thể lạc hậu.

## 5. Bài này bổ sung gì

Vẫn đọc 03.00–03.03 để hiểu state, gas, Solidity, AMM, lending. Bài tùy chọn chỉ cập nhật *đường ống*: Dencun opcodes, 4337/7702, v4 hooks, 4626, Foundry.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [Dencun announcement](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) | 2024 | EIP-1153, 4788, 4844, 6780 |
| [Pectra announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | EIP-7702, 2537, 7691 |
| [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) | 2025 | Set EOA account code |
| [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) | 2023 | Account abstraction alt-mempool |
| [Uniswap v4 overview](https://docs.uniswap.org/contracts/v4/overview) | 2024– | Hooks + singleton |
| [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) | 2022 | Tokenized vaults |
| [Foundry Book](https://book.getfoundry.sh/) | 2022– | `forge` / `anvil` / `cast` |
| [EVM docs](https://ethereum.org/developers/docs/evm/) | — | Tham chiếu opcode / execution |

## 7. Bài tập định hướng

1. Kể một invariant Uniswap v2 (\(x\cdot y \ge k\)) và chỉ ra hook v4 nào có thể *cố ý* phá nếu author hook không bị ràng buộc.
2. So sánh gas: reentrancy lock bằng `SSTORE` vs `TSTORE` (EIP-1153). Khi nào TSTORE sai?
3. Viết bảng 4337 vs 7702: mempool, địa chỉ, ai trả gas, có cần hard fork không?

---
✅ **End of optional lesson**
Next: [Lecture 04.00 — Scalability Problem]({{ site.baseurl }}/contents/vi/chapter04/)
