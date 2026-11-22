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

# Bài giảng (tùy chọn): Đồng thuận trong thực tế 2022–2026 — The Merge, PBS, Pectra staking, CometBFT

> Bài học này là phần **tùy chọn**, **không** trình bày lại Casper FFG, LMD-GHOST, PBFT hay Tendermint. Nội dung chỉ điểm qua các *triển khai thực tế và bản nâng cấp* đã diễn ra trên chính những giao thức mà Chương 02 đã phân tích.

## 1. Từ “Ethereum 2.0 trên lý thuyết” tới Beacon Chain vận hành thực tế

Bài 02.00 đã trình bày PoS, vấn đề nothing-at-stake và cơ chế slashing. Ngày 15 tháng 9 năm 2022, [The Merge](https://ethereum.org/roadmap/merge/) ngừng cơ chế đào PoW và gắn tầng thực thi vào Beacon Chain: trạng thái EVM giữ nguyên, còn tầng đồng thuận chuyển sang Gasper (FFG + LMD-GHOST). Đây không phải việc tạo ra một chuỗi mới mà là thay đổi cơ chế đồng thuận của một máy trạng thái đã vận hành liên tục từ năm 2015.

Sau The Merge, trọng tâm kỹ thuật không còn là câu hỏi PoS có hoạt động hay không, mà chuyển sang các vấn đề: ai là người xây dựng khối (PBS / MEV-Boost), tập validator có thể mở rộng quy mô hiệu quả hay không (EIP-7251), và quá trình rút validator có thể kích hoạt từ tầng thực thi hay không (EIP-7002). Ở nhánh BFT cổ điển, Tendermint Core được kế thừa bởi [CometBFT](https://docs.cometbft.com/) (2023) — giữ nguyên thuật toán nền tảng nhưng tách riêng quản trị và hạ tầng cho hệ sinh thái Cosmos.

![Chuỗi khối — cùng sổ cái, cơ chế đồng thuận thay đổi sau The Merge](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg)*

Xem thêm sơ đồ validator và attestation tại [ethereum.org — Proof of Stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/).

## 2. Các bước tiến then chốt

### 2.1. The Merge dưới góc độ hệ thống phân tán

The Merge yêu cầu mọi client tầng thực thi (execution client) và tầng đồng thuận (consensus client) đồng bộ tại cùng một ngưỡng `Terminal Total Difficulty`, sau đó chuyển sang chu kỳ slot/epoch. Đây là một đợt *hard fork có phối hợp* trên hai tầng, minh họa cho bài toán FLP và tính đồng bộ từng phần ở bài 00.01: tính an toàn dựa trên đồng hồ slot 12 giây và biểu quyết của ủy ban thay vì năng lượng tính toán. [Paris / Bellatrix specs](https://github.com/ethereum/consensus-specs) là tài liệu tham khảo tiếp theo sau khi đã nắm vững Gasper trong bài 02.00.

Về mặt kinh tế, phần thưởng phát hành từ PoW chấm dứt; lợi suất staking và phí giao dịch (bao gồm cả MEV) trở thành động lực chính, nối trực tiếp phần lựa chọn validator và slashing của bài 02.00 với môi trường vận hành thực tế.

### 2.2. Proposer-Builder Separation và MEV-Boost

Sau The Merge, phần lớn khối trên Ethereum được xây dựng bởi các *builder* chuyên biệt và gửi tới proposer thông qua [MEV-Boost](https://github.com/flashbots/mev-boost) (Flashbots): proposer chọn block header có giá đặt cao nhất từ relay mà không thấy nội dung giao dịch cho tới khi nhận payload. Đây là cơ chế PBS *ngoài giao thức* (out-of-protocol), tách biệt vai trò tạo khối và đề xuất khối nhằm hạn chế sự tập trung lợi thế MEV vào các validator lớn.

Về mặt đồng thuận, tính sống của mạng phụ thuộc một phần vào độ tin cậy của relay và builder, đồng thời vấn đề kiểm duyệt giao dịch (như các relay tuân thủ OFAC năm 2022) trở thành thách thức gắn sát với giao thức. Các hướng nghiên cứu giai đoạn 2023–2026 hướng tới ePBS (enshrined PBS) và danh sách bắt buộc đưa vào khối (inclusion lists), sẽ được trình bày ở Chương 07. Điểm cần rút ra trong Chương 02 là **đồng thuận trong thực tế không chỉ dừng ở quy tắc chọn nhánh (fork-choice)**, mà còn liên quan trực tiếp đến thị trường quyền đề xuất khối.

### 2.3. Nâng cấp staking trong Pectra: EIP-7251 và EIP-7002

Bản nâng cấp [Pectra](https://blog.ethereum.org/2025/04/23/pectra-mainnet) được kích hoạt ngày 7 tháng 5 năm 2025 (epoch 364032) với hai EIP đồng thuận đáng chú ý:

- **[EIP-7251](https://eips.ethereum.org/EIPS/eip-7251)** tăng `MAX_EFFECTIVE_BALANCE` từ 32 ETH lên 2048 ETH (tự chọn, áp dụng với withdrawal credential mới). Người đặt cọc có thể gộp nhiều validator và hưởng lãi kép trên phần số dư vượt mức tối thiểu. Đây là giải pháp kỹ thuật cho tình trạng hàng triệu validator làm phình to lưu lượng gossip và tập attestation, đánh đổi số lượng khóa độc lập để giảm tải mạng.
- **[EIP-7002](https://eips.ethereum.org/EIPS/eip-7002)** cho phép kích hoạt lệnh rút validator trực tiếp từ tầng thực thi (thông qua hợp đồng thông minh hoặc credential 0x01/0x02), thay vì chỉ phụ thuộc vào khóa ký ở tầng đồng thuận. Cơ chế này tách biệt quyền lưu ký tài sản (custody) với nhiệm vụ vận hành validator, đặc biệt hữu ích cho các staking pool.

Ngoài ra, [EIP-6110](https://eips.ethereum.org/EIPS/eip-6110) đưa cơ chế xử lý tiền gửi (deposit) lên tầng thực thi và [EIP-7549](https://eips.ethereum.org/EIPS/eip-7549) tách chỉ số ủy ban ra khỏi cấu trúc attestation để việc tổng hợp chữ ký tiết kiệm tài nguyên hơn. Nền tảng Gasper vẫn giữ nguyên, nhưng quy trình vận hành validator được tối ưu hóa rõ rệt.

### 2.4. CometBFT, HotStuff-2 và nghiên cứu Single-Slot Finality

Cosmos SDK chuyển sang sử dụng mặc định CometBFT: giữ nguyên chu trình đề xuất cùng hai vòng prevote/precommit 2/3 của Tendermint trong bài 02.01, đồng thời bổ sung ABCI 2.0 (với vote extensions). HotStuff-2 (2023) và các biến thể như Jolteon tiếp tục rút ngắn độ trễ của nhóm giao thức BFT. Trong khi đó, nhóm nghiên cứu Ethereum theo đuổi **hoàn tất trong một slot (Single-Slot Finality — SSF)**: thay vì hoàn tất theo từng epoch 32 slot như FFG hiện tại, SSF hướng tới hoàn tất ngay trong mỗi slot, đánh đổi bằng yêu cầu băng thông lớn hơn. Tính đến năm 2026, SSF chưa được triển khai trên L1 nhưng là hướng đọc tiếp theo phù hợp sau bài 02.00 và 02.01.

## 3. Góc nhìn triển khai

Một validator Ethereum hiện đại thường vận hành cặp client như `geth`/`lighthouse` (hoặc tương đương), kết nối với MEV-Boost relay và sau bản nâng cấp Pectra có thể cấu hình số dư hiệu dụng lớn hơn 32 ETH. Slashing vẫn là điều kiện bảo đảm an toàn trước nothing-at-stake; PBS không thay thế slashing mà chỉ thay đổi chủ thể sắp xếp giao dịch vào khối.

```text
[searchers] --> [builders] --> [relays] --> [proposer / beacon]
                                              |
                                         fork-choice
                                         (LMD-GHOST + FFG)
```

Ứng dụng trên CometBFT kết nối qua giao diện ABCI: các phương thức `PrepareProposal` và `ProcessProposal` cho phép tầng ứng dụng kiểm tra đề xuất trước khi bỏ phiếu — đây là nơi Cosmos tích hợp vote extensions, còn lõi đồng thuận BFT vẫn giữ nguyên nguyên lý.

## 4. Thách thức và đánh đổi

PBS ngoài giao thức có thể tạo ra các điểm kiểm duyệt tập trung. Tăng mức số dư hiệu dụng tối đa (MaxEB) giúp giảm số đối tượng validator nhưng làm tăng trọng số rủi ro trên mỗi khóa nếu bị xâm nhập. EIP-7002 nếu triển khai thiếu chặt chẽ có thể để hợp đồng thông minh ép buộc validator thoát khỏi mạng. SSF làm tăng đáng kể yêu cầu về băng thông và đồng bộ. CometBFT vẫn có độ phức tạp truyền thông \(O(n^2)\) trong phạm vi ủy ban; các mở rộng như sharding hay ICS không loại bỏ giới hạn này.

## 5. Điểm bổ sung của bài học

Các chứng minh về tính an toàn và tính sống từ bài 02.00 đến 02.02 vẫn giữ nguyên giá trị. Bài học tùy chọn này chỉ kết nối phần lý thuyết đó với các hệ thống thực tế gồm The Merge, MEV-Boost, các EIP về staking trong Pectra và CometBFT.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [The Merge (ethereum.org)](https://ethereum.org/roadmap/merge/) | 2022-09-15 | Triển khai PoS thực tế trên mainnet |
| [MEV-Boost](https://github.com/flashbots/mev-boost) | 2022– | PBS ngoài giao thức |
| [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) | 2025 | Tăng số dư hiệu dụng tối đa lên 2048 ETH |
| [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) | 2025 | Kích hoạt rút validator từ tầng thực thi |
| [Pectra announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025-05-07 | Bản nâng cấp Electra + Prague |
| [CometBFT docs](https://docs.cometbft.com/) | 2023– | Dự án kế thừa Tendermint |
| [HotStuff-2 (arXiv:2302.07871)](https://arxiv.org/abs/2302.07871) | 2023 | Cải tiến độ trễ cho BFT |

## Video tham khảo

- **Xem trước:** [Proof of Stake and The Merge: Why, What, How, Wen? - Ethereum Foundation](https://www.youtube.com/watch?v=2xhAGQsF-Ss) — ETHBarcelona, tiếng Anh. Bài trình bày của Ethereum Foundation giải thích lý do The Merge chuyển tầng thực thi sang Beacon Chain; nên xem trước mục sự kiện 15 tháng 9 năm 2022.
- [A study of the transaction supply chain from CryptoKitties to MEV-Boost to PBS - Barnabé Monnot (EF)](https://www.youtube.com/watch?v=jQjBNbEv9Mg) — Flashbots, tiếng Anh. Barnabé Monnot (EF) phân tích chuỗi cung ứng giao dịch từ MEV-Boost đến PBS, đúng với cơ chế proposer chọn bid qua relay ngoài giao thức.
- [CometBFT Explained Simply: ABCI and ABCI++](https://www.youtube.com/watch?v=IlepSxHQO_w) — redshiftzero, tiếng Anh. Giải thích CometBFT qua ABCI và ABCI++, hỗ trợ cho phần Tendermint chuyển sang CometBFT và vote extensions.

## 7. Bài tập định hướng

1. Vẽ lại sơ đồ “proposer / attester” của bài 02.00 và đánh dấu vị trí MEV-Boost can thiệp. Tính an toàn của FFG có phụ thuộc vào relay không?
2. EIP-7251 giảm số validator từ \(N\) xuống khoảng \(N/64\) nếu mọi người gộp tối đa. Lưu lượng gossip attestation thay đổi như thế nào?
3. So sánh cơ chế kích hoạt rút validator bằng signing key (trước EIP-7002) và kích hoạt từ tầng thực thi (EL trigger). Bên nào có lợi thế hơn khi staking pool gặp sự cố bảo mật?

---
✅ **Kết thúc bài học tùy chọn**
Tiếp theo: [Lecture 03.00 — Ethereum Architecture]({{ site.baseurl }}/contents/vi/chapter03/)
