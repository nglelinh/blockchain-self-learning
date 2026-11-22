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

# Bài giảng (tùy chọn): Ethereum và DeFi 2022–2026 — Dencun, Pectra, 4337/7702, Uniswap v4, Foundry

> Bài học này là phần **tùy chọn**, **không** trình bày lại mô hình tài khoản, tập lệnh EVM, Solidity hay AMM hằng số tích. Nội dung tập trung vào các nâng cấp giao thức và bộ công cụ phát triển đã trở thành tiêu chuẩn trong giai đoạn 2022–2026.

## 1. Cùng một EVM nhưng quy trình tương tác với L1 đã thay đổi

Các bài 03.00–03.03 giới thiệu Ethereum như một máy tính toàn cầu với mô hình tài khoản, cây trạng thái, EVM, gas, AMM kiểu Uniswap v2 và giao thức cho vay như Aave, Compound. Từ The Merge (2022) qua Shanghai (2023), Dencun (2024) đến Pectra (2025), hàm chuyển đổi trạng thái cốt lõi hầu như giữ nguyên, nhưng cách người dùng và hợp đồng tương tác với L1 đã thay đổi đáng kể: rollup chuyển sang dùng blob thay cho calldata, tài khoản EOA có thể gắn mã ủy quyền (EIP-7702), bundler của ERC-4337 tạo thành mempool phụ, Uniswap v4 mở rộng pool với cơ chế hook, và Foundry (`forge`/`cast`/`anvil`) thay thế Truffle làm bộ công cụ chuẩn.

![Logo Ethereum — cùng máy trạng thái; Dencun và Pectra đổi hạ tầng giao dịch, không đổi mô hình tài khoản/EVM](https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg)
*Nguồn: [Wikimedia Commons — Ethereum logo](https://commons.wikimedia.org/wiki/File:Ethereum_logo_2014.svg). Tài liệu EVM: [ethereum.org](https://ethereum.org/developers/docs/evm/).*

## 2. Các bước tiến then chốt

### 2.1. Dencun ở tầng thực thi: không chỉ giảm phí cho L2

Bản nâng cấp [Dencun](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) (13/03/2024) không chỉ có EIP-4844 mà còn bổ sung các cải tiến quan trọng trên EVM:

- **[EIP-1153](https://eips.ethereum.org/EIPS/eip-1153)**: Bộ nhớ tạm theo giao dịch (`TLOAD`/`TSTORE`), chỉ tồn tại trong phạm vi một giao dịch, tránh cơ chế hoàn gas phức tạp khi dùng `SSTORE` tạm thời.
- **[EIP-4788](https://eips.ethereum.org/EIPS/eip-4788)**: Đưa gốc khối Beacon (beacon block root) vào EVM, cho phép các staking pool và oracle đọc trực tiếp dữ liệu từ tầng đồng thuận mà không cần bên trung gian.
- **[EIP-5656](https://eips.ethereum.org/EIPS/eip-5656)**: Bổ sung lệnh sao chép bộ nhớ `MCOPY`; **[EIP-6780](https://eips.ethereum.org/EIPS/eip-6780)** giới hạn `SELFDESTRUCT` chỉ xóa mã và trạng thái khi gọi trong cùng giao dịch khởi tạo hợp đồng.

Đây là những bổ sung opcode trực tiếp cho EVM chứ không thay đổi mô hình tính toán. Các hợp đồng DeFi tận dụng transient storage để làm khóa chống tái nhập (reentrancy lock) với chi phí thấp, còn các staking pool đọc dữ liệu từ EIP-4788 thay cho oracle tự dựng.

### 2.2. Trừu tượng hóa tài khoản (Account Abstraction): ERC-4337 và EIP-7702

[ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) (EntryPoint 0.6/0.7, phổ biến từ 2023) không đòi hỏi thay đổi tầng đồng thuận. Người dùng gửi `UserOperation` vào một mempool riêng; bundler gom các thao tác này thành giao dịch gọi `EntryPoint.handleOps`. Paymaster có thể tài trợ phí gas, còn chữ ký có thể dùng passkey, đa chữ ký (multisig) hoặc khóa phiên (session key).

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) (kích hoạt trong Pectra ngày 07/05/2025) đưa khả năng tương tự xuống tầng giao thức: tài khoản EOA ký một ủy quyền để nút gắn mã thực thi cho chính địa chỉ đó thông qua giao dịch loại 4 (type-4). Giữ nguyên địa chỉ và khóa ECDSA nhưng có thể gộp giao dịch (batch), tài trợ gas và ủy quyền logic, giúp các ví như MetaMask hay ví phần cứng hỗ trợ trải nghiệm tương tự ERC-4337 mà không cần tạo tài khoản hợp đồng mới.

Điểm phân biệt cốt lõi là **ERC-4337 vận hành ở hạ tầng tầng ứng dụng**, còn **EIP-7702 mở rộng ngữ nghĩa tài khoản ngay ở tầng giao thức**. Cả hai đều dựa trên mô hình tài khoản của bài 03.00 và không thay đổi cấu trúc cây trạng thái.

### 2.3. Uniswap v4 hooks và chuẩn ERC-4626

Uniswap v4 (tài liệu tại [docs.uniswap.org/contracts/v4](https://docs.uniswap.org/contracts/v4/overview), phát triển 2023–2025) kế thừa thanh khoản tập trung của v3 nhưng gộp toàn bộ pool vào kiến trúc *singleton* và bổ sung **hooks** — các hợp đồng bên ngoài được gọi tại các điểm như `beforeSwap`, `afterSwap` hoặc khi thêm/rút thanh khoản. Công thức AMM \(x\cdot y = k\) (và cơ chế tick của v3) vẫn giữ nguyên; điểm mới là khả năng lập trình tại biên của pool cho lệnh giới hạn (limit order), phí động, kiểm tra KYC hoặc oracle tùy chỉnh.

[ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) (Tokenized Vault Standard, hoàn thiện năm 2022 và được áp dụng rộng rãi giai đoạn 2022–2026) chuẩn hóa các hàm `deposit`, `redeem`, `convertToShares` cho các vault sinh lợi suất. Cơ chế cho vay của Aave hay Compound trong bài 03.03 không đổi, nhưng các giao thức tích hợp nay có một giao diện thống nhất, giúp giảm sai sót làm tròn và rủi ro không tương thích giữa các vault.

### 2.4. Foundry, Solidity via-IR và custom errors

Foundry (do Paradigm phát triển, phổ biến từ 2022) cho phép viết kiểm thử trực tiếp bằng Solidity, hỗ trợ fuzzing (`forge test --fuzz-runs`), chạy mạng cục bộ (`anvil`) và kịch bản triển khai (`script`). Từ Solidity 0.8.x, `custom errors` và quy trình biên dịch **via-IR** (dần trở nên phổ biến từ 0.8.13 trở đi) thay đổi khâu sinh mã (codegen) mà không làm đổi ngữ nghĩa ngôn ngữ trong bài 03.02. Người học vẫn cần nắm vững sự khác biệt giữa storage và memory, nhưng thực hành với `forge` thay vì `truffle migrate`.

Bản nâng cấp Pectra còn bổ sung [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (precompile BLS12-381) trên tầng thực thi, hỗ trợ phép ghép cặp (pairing) cho account abstraction, light client và bộ xác minh ZK, kết nối trực tiếp EVM với đường cong mật mã của Beacon Chain.

## 3. Góc nhìn triển khai

Một luồng giao dịch điển hình năm 2025 có thể gồm: tài khoản EOA dùng EIP-7702 ủy quyền cho hợp đồng thực thi gộp; giao dịch đi qua `UserOperation` của ERC-4337 hoặc giao dịch type-4; lệnh hoán đổi gọi vào pool Uniswap v4 có hook tính phí; thanh khoản được gửi trong vault chuẩn ERC-4626. Ở tầng dưới cùng, toàn bộ vẫn là các lệnh `CALL`, `SSTORE` và phát log như bài 03.01.

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

Lệnh `forge test` cho phép kiểm thử fuzz các bất biến như “shares * price ≈ assets” cho ERC-4626 — minh họa cách kiến thức DeFi ở bài 03.03 kết hợp với bộ công cụ kiểm thử hiện đại.

## 4. Thách thức và đánh đổi

Ủy quyền EIP-7702 tới hợp đồng độc hại có thể dẫn đến mất tài sản ngay tại chính địa chỉ EOA người dùng đang sử dụng. Hook trong Uniswap v4 mở rộng bề mặt tấn công (như tái nhập qua callback hoặc thao túng phí). Bộ nhớ tạm thời (transient storage) dễ bị hiểu nhầm là lưu trữ bền vững. Quy trình biên dịch via-IR có thể làm thay đổi mức tiêu thụ gas so với legacy codegen nên cần kiểm thử trên phiên bản trình biên dịch cố định. Ngoài ra, thị trường phí blob tách biệt với priority fee khiến một số kỹ thuật tối ưu calldata cũ không còn phù hợp.

## 5. Điểm bổ sung của bài học

Các bài 03.00–03.03 vẫn là nền tảng để hiểu trạng thái, gas, Solidity, AMM và giao thức cho vay. Bài học tùy chọn này chỉ cập nhật các thành phần mới trong hệ sinh thái thực tế: các opcode của Dencun, ERC-4337/EIP-7702, hook của Uniswap v4, chuẩn ERC-4626 và bộ công cụ Foundry.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [Dencun announcement](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) | 2024 | EIP-1153, 4788, 4844, 6780 |
| [Pectra announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | EIP-7702, 2537, 7691 |
| [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) | 2025 | Gắn mã thực thi cho tài khoản EOA |
| [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) | 2023 | Account abstraction qua mempool phụ |
| [Uniswap v4 overview](https://docs.uniswap.org/contracts/v4/overview) | 2024– | Kiến trúc singleton và hooks |
| [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) | 2022 | Chuẩn vault token hóa |
| [Foundry Book](https://book.getfoundry.sh/) | 2022– | Bộ công cụ `forge` / `anvil` / `cast` |
| [EVM docs](https://ethereum.org/developers/docs/evm/) | — | Tài liệu tham chiếu opcode và thực thi |

## Video tham khảo

- **Xem trước:** [EIP-7702 (Type 4 transactions) | Everything you need to know](https://www.youtube.com/watch?v=0uy4nd8vIe8) — Patrick Collins, tiếng Anh. Giải thích giao dịch loại 4 và EIP-7702; nên xem trước mục EOA ủy quyền mã sau Pectra.
- [What is Account Abstraction? ERC-4337](https://www.youtube.com/watch?v=PZ8svp68NXM) — Patrick Collins, tiếng Anh. Trình bày ERC-4337 gồm UserOperation, bundler và paymaster, giúp phân biệt rõ với EIP-7702.
- [What is Uniswap V4? - Uniswap V4 Upgrade Proposal Explained](https://www.youtube.com/watch?v=tpYeroi4zCc) — University of Crypto, tiếng Anh. Giới thiệu kiến trúc singleton pool và cơ chế callback hook của Uniswap v4.

## 7. Bài tập định hướng

1. Nêu một bất biến của Uniswap v2 (\(x\cdot y \ge k\)) và chỉ ra loại hook v4 nào có thể phá vỡ nó nếu không có ràng buộc chặt chẽ.
2. So sánh chi phí gas của khóa chống tái nhập dùng `SSTORE` và `TSTORE` (EIP-1153). Trong trường hợp nào dùng `TSTORE` sẽ gây lỗi logic?
3. Lập bảng so sánh ERC-4337 và EIP-7702 theo các tiêu chí: mempool, địa chỉ tài khoản, bên trả gas và yêu cầu hard fork.

---
✅ **Kết thúc bài học tùy chọn**
Tiếp theo: [Lecture 04.00 — Scalability Problem]({{ site.baseurl }}/contents/vi/chapter04/)
