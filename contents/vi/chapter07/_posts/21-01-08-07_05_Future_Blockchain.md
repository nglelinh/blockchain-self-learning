---
layout: post
title: "Lecture 07.05: The Future of Blockchain - Trends và Innovations"
chapter: '07'
order: 6
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter07
---

# Bài giảng 07.05: Tương lai của Blockchain — Xu hướng và Đổi mới

Vào thập niên 1990, muốn dùng Internet bạn phải nghe tiếng modem dial-up rít lên, tự cấu hình địa chỉ IP và hiểu các giao thức mạng. Ba thập kỷ sau, hàng tỷ người dùng Internet mỗi giây mà chẳng cần biết TCP/IP hay DNS là gì — công nghệ đã thực sự chiến thắng khi nó **biến mất vào nền sau**.

Blockchain đang đứng trước đúng bước ngoặt chuyển mình ấy. Tương lai của blockchain không nằm ở việc bắt người dùng ghi nhớ 24 từ khóa bí mật hay chuyển cầu nối thủ công giữa 15 mạng L2, mà nằm ở **kiến trúc mô-đun quy mô trăm nghìn TPS**, **chứng minh ZK thời gian thực**, **trừu tượng hóa tài khoản và chuỗi**, cùng sự hội tụ với **AI và tài sản thế giới thực (RWA)**.

---

## Bản đồ kiến thức nền: Bốn xu hướng định hình Tương lai Blockchain (2025–2035)

1. **Mở rộng quy mô Mô-đun & DAS (100,000+ TPS):** Kết hợp Rollup, lớp Khả dụng Dữ liệu (Danksharding / Celestia) và Lấy mẫu khả dụng dữ liệu (DAS) để mở rộng băng thông toàn cầu mà điện thoại cá nhân vẫn tự kiểm chứng được.
2. **Trừu tượng hóa Tài khoản & Chuỗi (Account & Chain Abstraction):** Đăng nhập bằng Passkey/FaceID, tài trợ phí gas ngầm và gom thanh khoản xuyên chuỗi để người dùng tương tác mượt như ứng dụng Web2.
3. **ZK Toàn phần (Ubiquitous ZK & Realtime Proving):** Mọi block L1 và giao dịch L2 đều được chứng minh bằng ZK trong vài giây, giúp mọi thiết bị di động trở thành nút xác minh tin cậy hoàn toàn (Stateless Light Clients).
4. **Hội tụ với Tài chính thực & AI (RWA & AI Agents):** Token hóa trái phiếu, cổ phiếu, thanh toán 24/7 trên chuỗi, đồng thời cung cấp lớp thanh toán tự động và xác minh suy luận (zkML) cho các tác tử AI tự trị.

---

## 1. Tổng quan về khái niệm

Công nghệ blockchain đang đứng trước giai đoạn chuyển mình từ hạ tầng thử nghiệm sang nền tảng vận hành thực tế phục vụ hàng triệu người dùng. Quỹ đạo phát triển trong thời gian tới bao gồm các đổi mới kỹ thuật (blockchain dạng mô-đun, zkEVM, trừu tượng hóa tài khoản), các lĩnh vực ứng dụng mới (khoa học phi tập trung, tài chính tái tạo, mạng xã hội phi tập trung), sự hoàn thiện khung pháp lý cũng như các thảo luận về vai trò của tính phi tập trung trong xã hội.

Thập kỷ tới nhiều khả năng sẽ chứng kiến sự hội tụ quanh một số kiến trúc chủ đạo song song với đổi mới liên tục ở lớp ứng dụng: lộ trình lấy rollup làm trung tâm của Ethereum (lớp nền đảm bảo an ninh, lớp thực thi mô-đun mở rộng thông lượng), các chuỗi chuyên biệt ứng dụng trong hệ Cosmos, mô hình bảo mật chia sẻ của Polkadot và các cơ chế đồng thuận tối ưu hiệu năng cao như Proof-of-History của Solana hay đồng thuận của Avalanche.

---

## 2. Hiểu biết trực quan

Sự phát triển của blockchain có nhiều nét tương đồng với lịch sử internet từ thập niên 1990 đến năm 2024. Internet thời kỳ đầu chậm, khó sử dụng và ít ứng dụng, khiến nhiều người hoài nghi về tính thực tiễn. Tuy nhiên, khi hạ tầng trưởng thành (băng thông rộng, di động, điện toán đám mây) kết hợp với các ứng dụng thiết thực (mạng xã hội, phát trực tuyến, thương mại điện tử), internet đã đạt mức phổ cập rộng rãi. Tương tự, hạ tầng blockchain đang tiến bộ nhanh về Layer 2, trải nghiệm người dùng và công cụ phát triển, mở đường cho các ứng dụng thực tế ngoài phạm vi đầu cơ.

---

## 3. Nền tảng kỹ thuật

- **Blockchain mô-đun (Modular blockchains)**: Tách rời bốn chức năng cốt lõi gồm lớp thực thi (tính toán), lớp sẵn sàng dữ liệu (lưu trữ), lớp đồng thuận (sắp xếp thứ tự) và lớp thanh toán (hoàn tất trạng thái). Các dự án như **Celestia** cung cấp lớp sẵn sàng dữ liệu độc lập giúp rollup đăng dữ liệu với chi phí thấp hơn nhiều so với đăng trực tiếp qua calldata của Ethereum.
- **Trừu tượng hóa tài khoản (Account abstraction — ERC-4337)**: Cho phép sử dụng ví hợp đồng thông minh một cách tự nhiên, hỗ trợ khôi phục xã hội (social recovery), tài trợ phí gas (meta-transactions), gộp nhiều thao tác trong một giao dịch và thiết lập chính sách bảo mật tùy biến — giúp ví tự lưu ký có trải nghiệm gần với ứng dụng truyền thống hơn.
- **zkEVM**: Kết hợp hiệu quả của bằng chứng không tiết lộ thông tin với khả năng tương thích hoàn toàn môi trường EVM. Các dự án như **Polygon zkEVM**, **Scroll** và **zkSync Era** chứng minh tính đúng đắn của toàn bộ quá trình thực thi EVM bằng SNARK, giúp ứng dụng Ethereum chạy trên zkRollup mà hầu như không cần sửa mã.

---

## 4. Công thức toán học và mật mã học

Tiềm năng mở rộng thông lượng của kiến trúc mô-đun (kết hợp rollup và phân mảnh dữ liệu):

\[
\text{TPS}_{\text{total}} = n_{\text{rollups}} \times n_{\text{shards}} \times \text{TPS}_{\text{base}}
\]

Ví dụ với 100 rollup hoạt động trên 64 phân mảnh và thông lượng cơ sở 15 TPS:
\[
\text{TPS} = 100 \times 64 \times 15 = 96,000 \text{ TPS}
\]

Mức thông lượng lý thuyết này tiệm cận quy mô xử lý của các mạng lưới thanh toán toàn cầu như Visa.

---

### Khung giải thích: tự tay tính bài toán 100,000 TPS và xác suất bảo mật của Lấy mẫu Dữ liệu (DAS) (nên đọc chậm)

Làm thế nào một mạng blockchain tương lai có thể đạt **$$100{,}000\text{ TPS}$$** (vượt đỉnh mạng Visa) mà không buộc mọi nút mạng cá nhân phải sở hữu đường truyền trung tâm dữ liệu? Hãy kiểm tra hai phép tính gọn:

1. **Băng thông cần thiết ở mức 100,000 TPS:**
   Mỗi giao dịch nén tối giản trên Rollup tốn cỡ $$100\text{ byte}$$ dữ liệu. Tổng lưu lượng phát tán toàn mạng là:
   $$
   100{,}000\text{ tx/s} \times 100\text{ byte/tx} = \mathbf{10\text{ MB/giây}}\;(\approx 80\text{ Mbps}).
   $$
   Một chiếc điện thoại hay máy tính cá nhân không thể tải liên tục 10 MB/giây (gần 1 TB mỗi ngày!) chỉ để tự kiểm chứng blockchain.

2. **Phép màu của Lấy mẫu Khả dụng Dữ liệu (DAS + Mã hóa xóa Reed–Solomon 2D):**
   Dữ liệu block được mã hóa dư thừa gấp 4 lần (chỉ cần có mặt bất kỳ **25%** số mảnh là khôi phục trọn vẹn 100% block). Do đó, muốn *giấu dữ liệu* không cho mạng khôi phục, kẻ sản xuất block xấu buộc phải giấu đi **hơn 75%** số mảnh (chỉ công bố tối đa 25% — hoặc với ngưỡng 50% theo hàng/cột, giấu ít nhất 25% số mảnh).
   - Giả sử kẻ xấu giấu đúng $$25\%$$ số mảnh (tức $$75\%$$ mảnh còn lại vẫn phản hồi bình thường).
   - Một điện thoại nút nhẹ bốc thăm ngẫu nhiên **$$k$$ mảnh nhỏ** để kiểm tra. Xác suất kẻ xấu qua mặt được cả $$k$$ lần kiểm tra là $$(0.75)^k$:
     - Với $$k = 30$$ mảnh: $$(0.75)^{30} \approx 0.00018\;(0.018\%)$$.
     - Với $$k = 75$$ mảnh (chỉ tốn vài chục KB!):
       $$
       (0.75)^{75} \approx \mathbf{4.3 \times 10^{-10}} \quad (\text{chưa tới 1 phần 2 tỷ!}).
       $$
   Nhờ định lý xác suất kết hợp mã hóa xóa này, mạng lưới mở rộng lên 100,000 TPS trong khi mỗi điện thoại chỉ cần tải vài chục KB mỗi block để kiểm chứng độc lập!

## 5. Góc nhìn triển khai

Phát triển ứng dụng blockchain tương lai đặt trọng tâm vào **tính khả hợp (composability)** — khả năng kết hợp liền mạch các khối chức năng từ nhiều giao thức khác nhau. Trong DeFi, một giao dịch đơn lẻ đã có thể tương tác đồng thời với Uniswap, Aave, Curve và Yearn; xu hướng sắp tới mở rộng tính khả hợp xuyên lĩnh vực giữa DeFi, NFT, DAO và danh tính số.

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Bất định pháp lý**: Khung pháp lý rõ ràng có thể thúc đẩy sự tham gia của các định chế tài chính, ngược lại quy định quá khắt khe có thể kìm hãm đổi mới và tạo ra sự dịch chuyển dự án giữa các khu vực pháp lý.
- **Mốc thời gian máy tính lượng tử**: Các dự báo về máy tính lượng tử đủ mạnh phá vỡ mật mã hiện hành dao động từ dưới 10 năm đến 20–30 năm, đòi hỏi ngành blockchain chủ động chuẩn bị trước.
- **Rào cản trải nghiệm người dùng**: Quản lý khóa bí mật, phí gas, ký giao dịch và chuyển đổi mạng lưới vẫn gây nhiều trở ngại so với ứng dụng Web2; các giải pháp như trừu tượng hóa tài khoản và trừu tượng hóa phí gas đang dần thu hẹp khoảng cách này.

---

## 7. Các khái niệm liên quan

- **Khoa học phi tập trung (DeSci)**: Ứng dụng DAO để tài trợ nghiên cứu, dùng lưu trữ phi tập trung để công bố học thuật, khuyến khích phản biện khoa học bằng token và theo dõi nguồn gốc dữ liệu.
- **Tài chính tái tạo (ReFi)**: Sử dụng blockchain cho các sáng kiến môi trường như tín chỉ carbon, theo dõi đa dạng sinh học và đầu tư tác động với kết quả có thể kiểm chứng.
- **Mạng xã hội phi tập trung**: Các giao thức như Lens và Farcaster cho phép người dùng tự sở hữu đồ thị xã hội, nội dung và tệp người theo dõi, tăng tính chống kiểm duyệt và minh bạch thuật toán.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"Endgame"** | 2021 | Vitalik Buterin | Tầm nhìn dài hạn về lộ trình mở rộng của Ethereum |
| **"Modular Blockchains: A Deep Dive"** | 2022 | Đội ngũ Celestia | Luận điểm nền tảng về kiến trúc blockchain mô-đun |
| **"Account Abstraction (ERC-4337)"** | 2021 | Vitalik Buterin và cộng sự | Tiêu chuẩn ví hợp đồng thông minh không cần sửa lớp đồng thuận |
| **"The Blockchain Trilemma"** | 2017 | Vitalik Buterin | Phân tích sự đánh đổi căn bản giữa phi tập trung, bảo mật và mở rộng |

---

## 9. Minh họa và tài liệu trực quan

![Modular Blockchain Stack](https://celestia.org/images/modular-stack.png)  
*Nguồn: [Celestia Documentation](https://docs.celestia.org/)*

---

## 10. Tóm tắt

Tương lai của blockchain gắn liền với các giải pháp mở rộng mô-đun, chứng minh không tiết lộ thông tin, trừu tượng hóa tài khoản và tương tác xuyên chuỗi, đi kèm sự mở rộng ứng dụng sang khoa học, môi trường, quản trị và mạng xã hội. Dù vẫn đối mặt với rủi ro lượng tử, khung pháp lý chưa đồng nhất và rào cản trải nghiệm người dùng, những giá trị cốt lõi gồm phi tập trung, minh bạch và niềm tin có thể lập trình tiếp tục là động lực phát triển dài hạn của công nghệ này.

---

**Kết thúc bài giảng**

**Kết thúc Chương 07 — Chủ đề nâng cao**

**KẾT THÚC KHÓA HỌC CÔNG NGHỆ BLOCKCHAIN**

---

## Video tham khảo

- **Xem trước:** [Celestia EXPLAINED (Animated Modular Blockchains)](https://www.youtube.com/watch?v=ToHbt8pYBfA) — gogoDiego, tiếng Anh. Giải thích trực quan kiến trúc chuỗi mô-đun qua Celestia; nên xem trước phần tách lớp thực thi và lớp sẵn sàng dữ liệu.
- [What is Account Abstraction? ERC-4337](https://www.youtube.com/watch?v=PZ8svp68NXM) — Patrick Collins, tiếng Anh. Trình bày cơ chế trừu tượng hóa tài khoản theo ERC-4337, tương ứng với hướng cải thiện trải nghiệm người dùng trong bài.
- [The Secrets of zkEVM: A Deep Dive into Zero-Knowledge Rollups](https://www.youtube.com/watch?v=LtDtCgVztg4) — James Bachini, tiếng Anh. Phân tích sâu về zkEVM, hỗ trợ phần chứng minh tương thích EVM trên Layer 2.

## Tài liệu tham khảo

1. Buterin, V. (2021). *Endgame*. Vitalik's Blog.
2. Celestia. (2022). *Modular Blockchains: A Deep Dive*. Celestia Whitepaper.
3. Buterin, V., et al. (2021). *ERC-4337: Account Abstraction*. Ethereum Improvement Proposals.
