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

# Bài giảng (tùy chọn): Mở rộng trong thực tế 2022–2026 — Blob, Fault Proofs, BoLD, zkEVM, PeerDAS

> Bài học này là phần **tùy chọn**, **không** trình bày lại bộ ba bất khả thi, kênh trạng thái hay định nghĩa Optimistic và ZK-Rollup. Nội dung chỉ tổng hợp các hệ thống đã triển khai trên mainnet và các đề xuất cải tiến về khả dụng dữ liệu (DA) đã được kích hoạt.

## 1. Lộ trình lấy Rollup làm trung tâm đi vào thực tế

Các bài 04.00–04.02 đã nêu bài toán giới hạn 7–30 TPS cùng nguyên lý của rollup và sharding. Trong thực tế, Ethereum theo đuổi **lộ trình lấy rollup làm trung tâm (rollup-centric roadmap)**: L1 cung cấp khả dụng dữ liệu (data availability — DA) và tầng quyết toán (settlement), còn L2 đảm nhiệm tầng thực thi (execution). Ba cột mốc chính gồm:

1. **Proto-danksharding** — [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) trong bản nâng cấp Dencun (13/03/2024): bổ sung không gian dữ liệu blob với chi phí thấp, tự động xóa sau khoảng 18 ngày.
2. **Bằng chứng gian lận không cần cấp phép (permissionless fault proofs)** — OP Stack đạt Stage 1 (OP Mainnet, 10/06/2024) và Arbitrum triển khai **BoLD**.
3. **Lấy mẫu khả dụng dữ liệu (DAS)** — [PeerDAS / EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) trong bản nâng cấp Fusaka: nút mạng không còn phải tải toàn bộ mọi blob.

Bên cạnh đó, các hệ thống zkEVM (zkSync Era, Scroll, Linea, Polygon zkEVM giai đoạn 2023–2025) đã đưa ZK-rollup từ nghiên cứu lý thuyết sang mức độ tương thích đủ để triển khai hợp đồng Solidity thực tế. Hướng nghiên cứu based rollup và native rollup (2024–2026) đặt lại câu hỏi liệu sequencer có nhất thiết phải là một thực thể tách biệt hay không.

![Chuỗi khối L1 — rollup neo khả dụng dữ liệu và quyết toán vào L1; từ năm 2024 sử dụng blob thay cho calldata](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg). Phân loại L2: [ethereum.org/layer-2](https://ethereum.org/layer-2/) và [L2BEAT](https://l2beat.com/scaling/summary).*

## 2. Các bước tiến then chốt

### 2.1. EIP-4844 và thị trường phí blob

Mỗi blob gồm 4.096 phần tử trường × 32 byte, tương đương khoảng 128 KiB, đi kèm cam kết KZG; tầng thực thi chỉ nhìn thấy mã băm có phiên bản (versioned hash). Phí `blob_gas` có thị trường riêng với cơ chế điều chỉnh tương tự EIP-1559. [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) (trong Pectra, tháng 5/2025) tiếp tục nâng mức mục tiêu và giới hạn tối đa số blob mỗi khối. Ngay trong tuần đầu sau Dencun, phí giao dịch trên các mạng L2 như Arbitrum, Optimism, Base và Linea đã giảm rõ rệt.

Đây là bước chuyển tiếp thực tế cho bài 04.02 về sharding: thay vì phân mảnh tầng thực thi, Ethereum phân tách băng thông dữ liệu (DA bandwidth) trước. Danksharding đầy đủ kết hợp số lượng blob lớn hơn với cơ chế lấy mẫu DAS; EIP-4844 triển khai trước định dạng dữ liệu trước khi bổ sung bước lấy mẫu.

### 2.2. Optimistic Rollup tiến tới Stage 1

Ngày 10 tháng 6 năm 2024, [Optimism kích hoạt permissionless fault proofs](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack): bất kỳ ai cũng có thể đề xuất output root và tham gia tranh chấp; Hội đồng Bảo mật (Security Council) vẫn đóng vai trò lớp dự phòng theo định nghĩa Stage 1 của L2BEAT và Vitalik Buterin. Máy ảo Cannon (MIPS) và các máy ảo fault-proof tương tự chính là bản triển khai thực tế của trò chơi chia đôi tìm lỗi (bisection game) đã mô tả ở bài 04.01.

Arbitrum thay thế giao thức tranh chấp cũ bằng **BoLD** (*Bounded Liquidity Delay*; [arXiv:2404.10491](https://arxiv.org/abs/2404.10491), AFT 2024; [tài liệu kỹ thuật](https://docs.arbitrum.io/how-arbitrum-works/bold/gentle-introduction)) nhằm ngăn tấn công kéo dài thời gian tranh chấp (delay attack), giới hạn thời gian giải quyết và mở quyền xác thực không cần cấp phép trên Arbitrum One/Nova. Giả định lạc quan (optimistic assumption) vẫn giữ nguyên, nhưng cơ chế trò chơi giải quyết tranh chấp đã được thiết kế lại chặt chẽ hơn.

Mục tiêu tiếp theo là Stage 2 ("không cần bánh phụ"), loại bỏ quyền can thiệp tùy ý của hội đồng và áp dụng đa hệ thống chứng minh (multi-prover). Việc đọc bảng phân loại Stage trên L2BEAT sẽ rõ ràng hơn sau khi đã nắm cơ chế fraud proof trong bài 04.01.

### 2.3. zkEVM và zkVM trong môi trường thực tế

Giai đoạn 2023–2025, nhiều nhóm phát triển đã đạt mức tương đương EVM (EVM-equivalent) hoặc tương thích EVM (EVM-compatible) với bằng chứng xác minh trực tiếp trên L1. Nút thắt chủ yếu nằm ở chi phí tạo bằng chứng (phần cứng GPU, đệ quy bằng chứng, đóng gói STARK thành SNARK bằng Groth16/Plonk), chứ không phải định nghĩa lý thuyết của SNARK ở Chương 05. Các bộ khung như Superchain (OP Stack) và Orbit (Arbitrum) biến rollup thành mô hình có thể tái sử dụng: dùng chung tầng quyết toán nhưng linh hoạt chính sách thực thi.

### 2.4. PeerDAS: phân mảnh dữ liệu theo cột

[PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) chia dữ liệu blob thành 128 cột kèm mã xóa (erasure coding); mỗi nút chỉ cần lưu giữ khoảng 1/8 dữ liệu (theo dõi 8 subnet ngẫu nhiên). Việc xác minh tính khả dụng dữ liệu được thực hiện qua lấy mẫu ngẫu nhiên — đúng tinh thần bài 04.02 mà không cần chờ phân mảnh tầng thực thi. Ngoài ra, [EIP-7892](https://eips.ethereum.org/EIPS/eip-7892) (các đợt nâng cấp BPO — Blob Parameter Only) cho phép tăng số lượng blob theo lịch trình mà không cần đợt hard fork quy mô lớn.

Các hướng phát triển giai đoạn 2025–2026 như based rollup (giao quyền sắp xếp giao dịch cho proposer trên L1) và native rollup (tích hợp precompile xác thực thực thi) nhằm giảm mức độ tin cậy đặt vào sequencer, đồng thời gắn kết chặt hơn với cơ chế PBS ở Chương 02.

## 3. Góc nhìn triển khai

Trong OP Stack sau Dencun, thành phần `op-batcher` tự động chọn gửi dữ liệu qua blob thay vì calldata khi `blob_base_fee` thấp hơn. Với hệ thống fault proof, `op-challenger` theo dõi `DisputeGameFactory` và thực hiện chia đôi vết thực thi cho tới một lệnh MIPS đơn lẻ. Điểm cần nắm ở đây là vai trò cụ thể của từng thành phần vận hành (`batcher`, `proposer`, `challenger`, `guardian`).

```text
L2 blocks --> batcher --(EIP-4844 blob)--> L1 consensus (prune ~18d)
                 \
                  proposer --> output root --> DisputeGame
                                    ^
                                    challenger (permissionless, Stage 1)
```

## 4. Thách thức và đánh đổi

Cơ chế tự xóa blob sau khoảng 18 ngày chuyển gánh nặng lưu trữ lịch sử lâu dài sang các nút lưu trữ (archive node) và hệ sinh thái rollup. Các mạng ở Stage 1 vẫn có Security Council nên chưa thể coi là hoàn toàn không cần tin cậy. Hạ tầng sinh bằng chứng zkEVM hiện vẫn tập trung tại một số trung tâm dữ liệu lớn. PeerDAS làm tăng độ phức tạp của tầng mạng; nếu chọn sai tham số lấy mẫu có thể ảnh hưởng tới tính an toàn khả dụng dữ liệu. Based rollup đánh đổi độ trễ xác nhận ban đầu để đạt mức phi tập trung cao hơn ở tầng sắp xếp giao dịch.

## 5. Điểm bổ sung của bài học

Các bài 04.00–04.02 cung cấp nền tảng lý thuyết về bộ ba bất khả thi, kênh thanh toán, định nghĩa rollup và sharding. Bài học tùy chọn này liên hệ trực tiếp phần nền tảng đó với EIP-4844, OP fault proofs, BoLD, các hệ thống zkEVM trên mainnet và PeerDAS.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) | 2024 | Proto-danksharding |
| [Dencun FAQ](https://ethereum.org/roadmap/dencun/) | 2024-03-13 | Vòng đời blob (~4096 epoch) |
| [OP fault proofs / Stage 1](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack) | 2024-06-10 | Bằng chứng rút tiền không cần cấp phép |
| [BoLD (arXiv:2404.10491)](https://arxiv.org/abs/2404.10491) | 2024 | Giao thức tranh chấp có chặn thời gian (AFT 2024) |
| [PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) | 2025 | EIP-7594 lấy mẫu theo cột |
| [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) | 2025 | Tăng thông lượng blob |
| [L2BEAT scaling](https://l2beat.com/scaling/summary) | 2022– | Hệ thống phân loại Stage 0/1/2 |

## Video tham khảo

- **Xem trước:** [Unlocking Ethereum’s Scaling: EIP-4844 Explained](https://www.youtube.com/watch?v=HT9PHWloIiU) — Finematics, tiếng Anh. Giải thích cơ chế blob và EIP-4844; nên xem trước mục proto-danksharding và phí blob.
- [PeerDAS in 4 min by Tim Beiko | How Ethereum's Fusaka Upgrade Enhances Scalability #ethereum](https://www.youtube.com/watch?v=LSjSwsnpxyo) — ECH Institute, tiếng Anh. Tim Beiko tóm tắt PeerDAS trong khoảng 4 phút về phân cột và lấy mẫu, tương ứng với mục Fusaka và EIP-7594.
- [Arbitrum’s BoLD - A Layer 2 Rollup Dispute Protocol (Explained with Animation)](https://www.youtube.com/watch?v=OQQfAbMUNro) — Whiteboard Crypto, tiếng Anh. Minh họa giao thức tranh chấp BoLD của Arbitrum, đối chiếu với mục phòng chống tấn công kéo dài thời gian.

## 7. Bài tập định hướng

1. Vì sao thời gian lưu giữ blob (~18 ngày) cần dài hơn thời gian chờ rút tiền 7 ngày của optimistic rollup?
2. So sánh rủi ro tấn công trì hoãn (delay attack) trong giao thức tranh chấp của Arbitrum trước BoLD với giới hạn thời gian mà BoLD đảm bảo.
3. Trong PeerDAS, nếu một nút chỉ lưu giữ 8/128 cột, xác suất phát hiện một blob không khả dụng thông qua \(k\) phép lấy mẫu độc lập được tính như thế nào (theo mô hình đơn giản)?

---
✅ **Kết thúc bài học tùy chọn**
Tiếp theo: [Lecture 05.00 — Blockchain Privacy]({{ site.baseurl }}/contents/vi/chapter05/)
