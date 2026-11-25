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

# Bài giảng tùy chọn 07.99: Ứng dụng nâng cao giai đoạn 2022–2026 — Restaking, ERC-6551, ePBS và ML-KEM

> Bài giảng này mang tính **tùy chọn**. Nội dung **không** lặp lại hợp đồng Governor/DAO, chuẩn ERC-721, IPFS, định nghĩa MEV hay toán học mạng lưới, mà điểm qua các *ứng dụng và đề xuất EIP* nổi bật đã định hình các chủ đề nâng cao sau năm 2022.

Chỉ trong giai đoạn **2022–2026**, một tầng sản phẩm hoàn toàn mới đã mọc lên trực tiếp trên nền móng quản trị, NFT, hạ tầng và MEV của Chương 7: **Restaking** (EigenLayer, Symbiotic) cho phép dùng chính ETH đã stake để bảo vệ hàng chục dịch vụ mạng lưới bên ngoài; **Account Abstraction (ERC-4337 & EIP-7702)** thay thế cụm 12 từ khóa rườm rà bằng ví thông minh có Passkey và khôi phục xã hội; còn **Token hóa Tài sản Thực (RWA)** đã đưa hàng tỷ đô la trái phiếu chính phủ Mỹ lên chuỗi với thanh khoản 24/7!

Bài cập nhật cuối cùng của khóa học giúp bạn nhìn xuyên qua lớp tiếp thị để nắm rõ cơ chế kỹ thuật, lợi ích hiệu quả vốn và những rủi ro hệ thống mới của thế hệ ứng dụng Web3 2022–2026.

---

## Kiến thức cần nhớ: Lớp Sản phẩm Web3 2022–2026 đứng trên bốn trụ cột nào?

1. **Restaking & Dịch vụ Xác thực Chủ động (AVS — EigenLayer):** Tái sử dụng bảo mật kinh tế của ETH đã stake cho các Oracle, cầu nối và lớp DA mới — tăng hiệu quả sử dụng vốn nhưng làm tăng rủi ro phạt cắt (slashing) dây chuyền.
2. **Trừu tượng hóa Tài khoản (ERC-4337 & EIP-7702):** Tách biệt khái niệm "người ký" và "tài khoản giữ tiền", mở khóa giao dịch gộp nhiều bước, trả gas bằng stablecoin qua Paymaster và nâng cấp trực tiếp ví EOA truyền thống.
3. **Tài sản Thế giới Thực (RWA — Tokenized Treasuries & Credit):** Đưa tài sản tài chính truyền thống lên chuỗi bằng tiêu chuẩn tuân thủ (ERC-3643 / whitelist KYC) để kết hợp độ an toàn pháp lý với tốc độ thanh toán tức thì của DeFi.
4. **Thanh toán cho AI Agents & Hạ tầng DePIN:** Cung cấp ví tự trị và kênh thanh toán vi mô không cần cấp phép cho các tác tử phần mềm tự mua dữ liệu, năng lực tính toán GPU và gọi API theo từng truy vấn.

---

## 1. Lớp sản phẩm mới trên nền tảng các bài 07.00–07.05

Chương 07 bao phủ DAO, NFT, hạ tầng Web3, MEV, kháng lượng tử và định hướng tương lai. Trong giai đoạn 2022–2026, hệ sinh thái bổ sung bốn hướng phát triển nổi bật: **restaking** (EigenLayer và các giao thức tương tự) biến tài sản ETH đặt cọc thành lớp bảo mật cho các dịch vụ AVS; **tài khoản gắn với token** ([ERC-6551](https://eips.ethereum.org/EIPS/eip-6551)) biến mỗi NFT thành một ví hợp đồng thông minh; các nghiên cứu **xử lý MEV ngay trong giao thức** (inclusion lists, ePBS) nối tiếp MEV-Boost; và **chuẩn hóa mật mã hậu lượng tử** (FIPS 203) làm mốc tham chiếu cho lộ trình chuyển đổi. Song song đó, các mô hình như Superchain hay Orbit đưa bài toán quản trị từ "một L2 đơn lẻ" sang *quản trị cả đội chuỗi (fleet governance)* — nơi DAO (07.00) giao thoa trực tiếp với hạ tầng (07.02).

![Chuỗi khối — thứ tự giao dịch trong block là sân khấu MEV / PBS](https://upload.wikimedia.org/wikipedia/commons/9/98/Blockchain.svg)
*Nguồn: [Wikimedia Commons — Blockchain](https://commons.wikimedia.org/wiki/File:Blockchain.svg). Lộ trình PBS: [ethereum.org/roadmap/pbs](https://ethereum.org/roadmap/pbs/).*

## 2. Các bước tiến then chốt

### 2.1. Restaking: Bảo mật như một dịch vụ

EigenLayer (sách trắng 2023; mạng chính 2024–2025) cho phép trình xác thực hoặc người nắm giữ LST *tái đặt cọc (restake)* ETH để bảo đảm an ninh cho các dịch vụ xác thực chủ động (AVS — như oracle, lớp sẵn sàng dữ liệu, coprocessor hay lớp hoàn tất nhanh). Về kinh tế, cơ chế này tái sử dụng nguồn vốn có thể bị cắt phạt (slashable capital); về hệ thống, nó chồng thêm các điều kiện cắt phạt *mới* lên trên điều kiện cắt phạt của Beacon Chain, tạo ra rủi ro tương quan. Đây là sự kết hợp giữa DAO, staking và oracle (07.00/07.02), chứ không thay đổi cơ chế đồng thuận L1 (vẫn là Gasper như Chương 02).

Những giả định rủi ro cần lưu ý gồm: lỗi ở một AVS có thể kích hoạt cắt phạt lan truyền, quản trị AVS còn tập trung, và các token tái đặt cọc thanh khoản (LRT) bổ sung thêm một lớp rủi ro giải chấp đòn bẩy (như các biến động trên nhóm LRT giai đoạn 2024–2025).

### 2.2. ERC-6551: Biến NFT thành tài khoản thông minh

[ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) (ra đời năm 2023 và mở rộng ứng dụng giai đoạn 2023–2026) dùng một hợp đồng đăng ký để tạo địa chỉ tài khoản thông minh *xác định trước* cho từng bộ ba `(chainId, tokenContract, tokenId)`. Nhờ đó, bản thân NFT có thể nắm giữ tài sản, ký giao dịch (thông qua hợp đồng cài đặt) và tương tác trực tiếp với các giao thức khác. Chuẩn ERC-721 ở bài 07.01 giữ nguyên, nhưng khái niệm sở hữu mở rộng từ "token nằm trong ví" sang "ví nằm trong token". Khi kết hợp với EIP-7702 hoặc ERC-4337 (03.99), mô hình này hỗ trợ nhân vật trò chơi, danh tính trên chuỗi và đóng gói nhiều quyền sử dụng trong một tài sản duy nhất.

### 2.3. MEV sau bài 07.03: Từ đấu giá Flashbots tới Inclusion Lists và ePBS

Bài 07.03 đã giới thiệu khái niệm MEV. Trong thực tế vận hành giai đoạn 2022–2026, MEV-Boost chiếm phần lớn số khối được tạo ra trên Ethereum (xem bài 02.99). Các hướng phát triển tiếp theo tập trung vào:
- **Inclusion lists / FOCIL**: Cho phép người đề xuất khối (proposer) buộc một tập giao dịch hợp lệ phải được đưa vào khối, giảm khả năng kiểm duyệt từ các relay.
- **ePBS (Enshrined Proposer-Builder Separation)**: Tích hợp cơ chế tách biệt proposer–builder trực tiếp vào giao thức lõi để loại bỏ sự phụ thuộc vào relay tập trung.
- **Tập trung hóa builder và đấu giá luồng lệnh (order-flow auctions)**: Cho thấy MEV giai đoạn 2023–2025 đã mở rộng thành bài toán cấu trúc thị trường và kinh tế chính trị, vượt xa phạm vi tấn công kẹp bánh mì đơn thuần.

Bản nâng cấp Pectra không "xóa bỏ MEV", nhưng thay đổi kinh tế trình xác thực (EIP-7251) và nguồn cung blob (EIP-7691), qua đó làm thay đổi bối cảnh cạnh tranh MEV.

### 2.4. Kháng lượng tử: Từ cảnh báo lý thuyết tới mã chuẩn FIPS

Việc NIST ban hành [FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final), FIPS 204 (ML-DSA) và FIPS 205 (SLH-DSA) vào ngày 13/8/2024 mang lại cột mốc chuẩn hóa cụ thể cho bài 07.04. Tuy vậy, Ethereum và Bitcoin hiện vẫn đang dùng ECDSA/BLS; các đề xuất về chữ ký kép, địa chỉ băm chống chiến thuật "thu thập trước, giải mã sau" (harvest-now-decrypt-later) và tối ưu kích thước nhân chứng vẫn đang trong giai đoạn thảo luận — không nên đánh đồng việc ban hành chuẩn FIPS với việc mạng chính đã hoàn tất chuyển đổi.

Ở mảng hạ tầng Web3, các giải pháp sẵn sàng dữ liệu (DA) như EIP-4844, PeerDAS, EigenDA và Celestia phục vụ riêng cho thị trường rollup (bài 04.99), tách biệt với vai trò lưu trữ nội dung của IPFS/Filecoin trong bài 07.02.

### Giải thích: tự tay tính đòn bẩy lợi suất và rủi ro Slashing dây chuyền trong Restaking

Restaking thường được quảng bá như "bữa trưa miễn phí" giúp nhận nhiều lớp lãi suất từ cùng một số ETH. Hãy tự kiểm tra bằng một phép tính xác suất cơ bản để thấy mặt trái của đòn bẩy bảo mật này:

Giả sử một Validator đang stake **$$100\text{ ETH}$$** trên Ethereum L1 (lãi suất gốc $$r_0 = 3.5\%/\text{năm}$$) và đem **Restake** chính $$100\text{ ETH}$$ đó vào bảo vệ đồng thời **3 dịch vụ AVS độc lập** (một Oracle, một Cầu nối, một lớp DA), mỗi AVS trả thêm phần thưởng $$r_i = 1.5\%/\text{năm}$$.

1. **Lợi suất danh nghĩa nếu mọi thứ suôn sẻ:**
   $$
   R_{\text{tổng}} = 3.5\% + 3 \times 1.5\% = \mathbf{8.0\%/\text{năm}}
   $$
   (thu về $$+8\text{ ETH/năm}$$ thay vì $$+3.5\text{ ETH/năm}$$).

2. **Tính xác suất rủi ro Slashing dây chuyền:**
   Giả sử mỗi AVS mới ra mắt có xác suất xảy ra lỗi phần mềm nghiêm trọng hoặc tấn công dẫn tới phạt cắt nặng stake độc lập là $$p = 2\%/\text{năm}$$. Khi Validator cam kết bảo vệ cùng lúc cả 3 AVS bằng **chung một khoản cọc 100 ETH**, xác suất bị phạt ít nhất 1 lần trong năm là:
   $$
   P(\text{bị slash}) = 1 - (1 - 0.02)^3 = 1 - 0.9412 = \mathbf{5.88\%!}
   $$
   Nếu mức phạt mỗi sự cố là cắt $$50\%$$ lượng cọc ($$-50\text{ ETH}$$), tổn thất kỳ vọng riêng từ rủi ro slashing đã là $$5.88\% \times 50 = 2.94\text{ ETH/năm}$$ — **ăn gần sạch phần lãi suất cộng thêm ($$+4.5\text{ ETH}$$) và biến Restaking thành bài toán quản trị rủi ro cực kỳ chặt chẽ!**

**Bài học hệ thống:** Trong kinh tế học mật mã không bao giờ có lợi suất miễn phí — Restaking mở rộng *bảo mật dùng chung*, đồng thời ghép thêm *rủi ro tương quan* mà mỗi operator phải định giá cẩn thận trước khi tham gia.

## 3. Góc nhìn triển khai

Một kịch bản thực tế có thể kết nối trực tiếp nhiều bài học trong chương: một NFT theo chuẩn ERC-6551 nắm giữ USDC cùng khóa phiên (session key) theo ERC-4337; một dịch vụ AVS được bảo đảm bằng restaking cung cấp nguồn giá oracle; và giao dịch hoán đổi trong khối được các builder sắp xếp trước khi đấu giá cho proposer. Ở tầng quản trị, Optimism Collective (DAO quản trị Superchain) bỏ phiếu cho các nâng cấp bằng chứng lỗi (bài 04.99), cho thấy DAO đã mở rộng sang điều hành hạ tầng kỹ thuật chứ không chỉ quản lý ngân quỹ:

```text
[ERC-721] --6551--> [TBA account] --holds--> assets / session keys
[ETH stake] --restake--> [AVS slashing] --secures--> oracle / DA
[user tx] --public mempool / OF--> [builder] --bid--> [proposer]
```

## 4. Thách thức và sự đánh đổi

Restaking làm tăng rủi ro hệ thống do các tầng cắt phạt chồng chéo. Với ERC-6551, rủi ro đến từ hợp đồng cài đặt bị nâng cấp độc hại hoặc lừa đảo ký giao dịch cho tài khoản gắn token (TBA). ePBS làm tăng độ phức tạp của lớp đồng thuận. Mật mã hậu lượng tử khiến kích thước giao dịch tăng mạnh nên nhiều khả năng các mạng Layer 2 sẽ thử nghiệm chuyển đổi trước Layer 1. Cuối cùng, mô hình một DAO quản trị đồng thời nhiều chuỗi (DAO fleet) làm mở rộng đáng kể phạm vi ảnh hưởng nếu xảy ra thâu tóm quản trị.

## 5. Phạm vi bổ sung của bài giảng

Người học vẫn cần nắm vững các bài 07.00–07.05 về DAO, chuẩn NFT, hạ tầng Web3, cơ chế MEV, lý thuyết PQC và định hướng tương lai. Bài tùy chọn này bổ sung góc nhìn cập nhật gắn với EigenLayer, ERC-6551, inclusion lists/ePBS, chuẩn FIPS 203 và quản trị Superchain.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EigenLayer whitepaper](https://docs.eigenlayer.xyz/) | 2023– | Mô hình restaking và dịch vụ AVS |
| [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) | 2023 | Tài khoản gắn với token (Token-bound accounts) |
| [MEV-Boost](https://github.com/flashbots/mev-boost) | 2022– | Tách biệt proposer–builder ngoài giao thức |
| [ethereum.org PBS](https://ethereum.org/roadmap/pbs/) | 2023– | Lộ trình tích hợp PBS vào giao thức lõi (ePBS) |
| [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) | 2024-08-13 | Chuẩn hóa ML-KEM |
| [Pectra](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | Nâng cấp trình xác thực, blob và EIP-7702 |
| [OP Superchain / Stage 1](https://optimism.io/blog/permissionless-fault-proofs-and-stage-1-arrive-to-the-op-stack) | 2024 | Quản trị đa chuỗi và bằng chứng lỗi |

## Video tham khảo

- **Xem trước:** [Ethereum Inclusion Lists Explained | Censorship Resistance & EIP-7547](https://www.youtube.com/watch?v=n2P_ZUqP6Fs) — Wolfgang Vitale, tiếng Anh. Giải thích inclusion lists và EIP-7547; nên xem trước thuộc tính chống kiểm duyệt so với PBS thuần túy.
- [Axelar Tech Talks With Sreeram Kannan of EigenLayer](https://www.youtube.com/watch?v=yuIlzgValaA) — Axelar Network, tiếng Anh. Sreeram Kannan trình bày về EigenLayer, phù hợp cho mục restaking và điều kiện cắt phạt bổ sung.
- [ERC 6551: Token Bound Accounts Explained](https://www.youtube.com/watch?v=8N8OdTyFmd8) — The Web3 IP Lawyer, tiếng Anh. Giải thích tài khoản gắn với token theo ERC-6551, đối chiếu với phần mở rộng khả năng của NFT trong bài.

## 7. Bài tập định hướng

1. Với mô hình restaking, hãy mô tả một điều kiện cắt phạt *thứ hai* ở cấp AVS và giải thích vì sao sự tương quan với cắt phạt trên Beacon Chain tạo ra rủi ro hệ thống.
2. So sánh ERC-6551 và EIP-7702: tiêu chuẩn nào gắn tài khoản thông minh với *token*, tiêu chuẩn nào gắn với *EOA*, và trong tình huống nào có thể kết hợp cả hai?
3. Tham khảo trang lộ trình PBS trên ethereum.org và chỉ ra *một* thuộc tính chống kiểm duyệt mà inclusion lists hướng tới khôi phục so với mô hình MEV-Boost thuần túy.

---
✅ **End of optional lesson**
Next: [Course home]({{ site.baseurl }}/)
