---
layout: post
title: "Lecture 00.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '00'
order: 5
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
lesson_type: optional
---

# Lecture (tùy chọn): Các thành phần nền tảng 2022–2026 — Verkle, blob DA, BLS, account abstraction

> Bài này là **tùy chọn**, **không** thay thế các bài 00.00–00.03 về sổ cái phân tán, hàm băm, cây Merkle hay ECDSA. Nội dung dưới đây chỉ ra cách những thành phần nền tảng đó được triển khai trong các hệ thống thực tế giai đoạn 2022–2026.

## 1. Vì sao chương nền tảng vẫn cần thiết — và điều gì đã thay đổi

Ba trụ cột của Chapter 00 — đồng thuận phân tán, hàm băm/cây Merkle và chữ ký số — không hề bị thay thế; điều thay đổi là *hình thức triển khai thực tế* của chúng. Một block Ethereum sau nâng cấp Dencun không chỉ gồm phần đầu khối, danh sách giao dịch và Merkle root, mà còn mang theo **blob** (EIP-4844) để các nút cam kết và lưu trữ tạm thời. Một tài khoản cũng không còn chỉ là cặp khóa ECDSA trên `secp256k1`: EIP-7702 cho phép tài khoản sở hữu bên ngoài (EOA) *ủy quyền tạm thời* cho mã hợp đồng thông minh. Tương tự, chứng thực của trình xác thực (validator) không còn là từng chữ ký ECDSA riêng lẻ mà chuyển sang dùng **BLS12-381** trên beacon chain để gộp hàng nghìn chứng thực thành một chữ ký gọn nhẹ.

Nếu các bài cốt lõi của Chapter 00 giới thiệu hàm băm như dấu vân tay số, cây Merkle như bằng chứng thành viên và chữ ký số như cơ chế ủy quyền, thì bài học này trình bày ba biến thể sản xuất của chính các ý tưởng đó: cam kết đa thức (Verkle / KZG), tính sẵn có dữ liệu tạm thời (blobs) và chữ ký có thể gộp (BLS).

![Cấu trúc block Bitcoin — điểm xuất phát cho mọi “block” sau này](https://upload.wikimedia.org/wikipedia/commons/5/55/Bitcoin_Block_Data.svg)
*Nguồn: [Wikimedia Commons — Bitcoin block data](https://commons.wikimedia.org/wiki/File:Bitcoin_Block_Data.svg)*

## 2. Các bước tiến then chốt

### 2.1. Từ cây Merkle tới cây Verkle và cam kết KZG

Cây Merkle trong bài 00.02 cho phép chứng minh giao dịch \(T\) nằm trong block bằng một đường dẫn gồm \(O(\log n)\) giá trị băm. Cây Verkle (Kuszmaul 2018; Dankrad Feist và nhóm nghiên cứu Ethereum giai đoạn 2021–2024) thay thế các giá trị băm dọc đường đi bằng **cam kết vector (vector commitment)** — cụ thể trong thực tế là cam kết KZG trên đa thức. Nhờ đó, kích thước bằng chứng thành viên trở thành *hằng số* (chỉ vài phần tử nhóm toán học) thay vì tăng theo \(\log n\), đánh đổi thêm chi phí xác minh để nén đáng kể dữ liệu chứng minh (witness) khi trạng thái Ethereum vượt hàng trăm GB.

Bạn không cần học lại định nghĩa hàm băm. Điểm cốt lõi là trong *cùng bài toán chứng minh thành viên*, đối tượng mật mã chuyển từ:

\[
\pi_{\text{Merkle}} = \big(h_1, h_2, \ldots, h_{\log n}\big)
\]

sang một mở cam kết (opening):

\[
\pi_{\text{KZG}} = \big(C, y, \pi\big) \quad\text{sao cho}\quad e\big(\pi, [s-z]G_2\big) = e\big(C - [y]G_1, G_2\big).
\]

KZG cũng chính là cơ chế mà EIP-4844 sử dụng để cam kết dữ liệu blob: lớp thực thi (execution layer) chỉ nhìn thấy *giá trị băm có phiên bản (versioned hash)* của cam kết, còn lớp đồng thuận (consensus layer) lưu trữ dữ liệu blob trong khoảng 4096 epoch (~18 ngày) rồi cắt tỉa (prune). Đây có thể xem là một dạng cam kết dữ liệu tạm thời: tính bất biến của *cam kết* không đòi hỏi phải lưu trữ vĩnh viễn toàn bộ *dữ liệu gốc*.

Tài liệu tham khảo: [Verkle Trees](https://vitalik.eth.limo/general/2021/06/18/verkle.html) (Buterin, 2021, lộ trình vẫn tiếp tục được phát triển giai đoạn 2024–2026); [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844); [Dencun FAQ](https://ethereum.org/roadmap/dencun/) (kích hoạt ngày 13/03/2024 tại epoch 269568).

### 2.2. Blob là đơn vị dữ liệu mới, không phải “block nhỏ hơn”

EIP-4844 bổ sung loại giao dịch mang theo blob dung lượng 128 KiB. Dữ liệu blob **không** đi vào trạng thái thực thi của EVM và **không** được lưu vĩnh viễn trên mọi nút đầy đủ. Các rollup đăng gói dữ liệu (batch) lên kênh sẵn có dữ liệu (DA) với chi phí thấp hơn, còn bên xác minh chỉ cần kiểm tra mở cam kết KZG. Dưới góc độ hệ thống phân tán, đây là bước tách bạch *tính sẵn có dữ liệu (availability)* khỏi *thực thi (execution)* — vẫn là bài toán CAP và nhân bản dữ liệu của bài 00.01 nhưng có bổ sung thời gian sống (TTL).

Nâng cấp Dencun (Cancun-Deneb) đã kích hoạt proto-danksharding trên mạng chính ngày 13 tháng 3 năm 2024. Sau đó, nâng cấp Pectra (ngày 7 tháng 5 năm 2025) tăng thông lượng blob thông qua [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691). Tiếp nối lộ trình này, Fusaka giới thiệu [PeerDAS / EIP-7594](https://ethereum.org/roadmap/fusaka/peerdas/): mỗi nút chỉ lưu giữ một phần các cột dữ liệu blob đã được mã hóa xóa (erasure-coded) rồi tiến hành lấy mẫu ngẫu nhiên; nhờ đó, việc lấy mẫu tính sẵn có dữ liệu (data availability sampling) trở thành một giao thức lan truyền mạng thay vì buộc mọi nút tải toàn bộ dữ liệu.

### 2.3. Chữ ký: từ ECDSA đơn lẻ tới gộp chữ ký BLS và mô hình tài khoản khả trình

Bài 00.03 trình bày thuật toán ECDSA trên đường cong `secp256k1`. Beacon chain của Ethereum lựa chọn BLS (trên đường cong BLS12-381) nhờ tính tuyến tính: \(n\) chữ ký trên cùng một thông điệp có thể được gộp thành một chữ ký duy nhất. [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (trong nâng cấp Pectra tháng 5 năm 2025) bổ sung hàm tiền biên dịch (precompile) cho BLS12-381 trên lớp thực thi, giúp hợp đồng thông minh xác minh trực tiếp trên cùng đường cong mà lớp đồng thuận sử dụng.

Song song với đó, mô hình truyền thống coi mỗi tài khoản chỉ là một cặp khóa cũng được mở rộng. [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) (hợp đồng EntryPoint chuẩn triển khai năm 2023) đưa các thành phần `UserOperation`, `bundler` và `paymaster` vào *tầng ứng dụng*. [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) (trong Pectra) cho phép EOA ký một thông điệp ủy quyền để *gắn mã hợp đồng tạm thời* — hỗ trợ gộp giao dịch, tài trợ phí gas và khôi phục tài khoản xã hội — mà không cần đổi địa chỉ ví. Chữ ký vẫn chứng minh quyền kiểm soát, nhưng *đối tượng được ủy quyền* nay có thể là hợp đồng thông minh thay vì chỉ dựa vào lệnh `ecrecover`.

![Cây hash / Merkle — primitive membership mà Verkle và KZG vẫn giải](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)
*Nguồn: [Wikimedia Commons — Hash Tree](https://commons.wikimedia.org/wiki/File:Hash_Tree.svg)*

## 3. Góc nhìn triển khai

Khi một rollup gửi gói giao dịch sau nâng cấp Dencun, ví của người dùng không gửi dữ liệu trực tiếp qua `calldata`. Trình sắp xếp giao dịch (sequencer) tạo giao dịch mang blob, còn phần mềm lớp thực thi chỉ thấy trường `blob_versioned_hashes`. Cơ chế tính phí được tách thành hai thị trường độc lập: `gas` cho EVM và `blob_gas` (theo EIP-4844 mục 3.1, kết hợp opcode `BLOBBASEFEE` trong EIP-7516). Cách tiếp cận này kế thừa nguyên lý đo lường tài nguyên của cơ chế gas (Chapter 03), nhưng áp dụng riêng cho thành phần sẵn có dữ liệu của Chapter 00.

Với EIP-7702, ví phần cứng vẫn tiếp tục ký bằng ECDSA; dữ liệu được ký là bộ ủy quyền `(chain_id, address, nonce)`. Các nút sẽ gán mã tương ứng vào `account.code` cho đến khi ủy quyền bị thay thế. Không có nguyên thủy mật mã mới nào được tạo ra — điểm thay đổi nằm ở *ngữ nghĩa thực thi* của chữ ký.

```text
[user EOA] --(EIP-7702 auth)--> [delegated contract]
       |                              |
       +-- ECDSA như bài 00.03 --+    +-- batch / paymaster / 4337-style logic
```

## 4. Thách thức và đánh đổi

Cây Verkle và PeerDAS làm tăng đáng kể độ phức tạp của phần mềm nút, đòi hỏi triển khai thêm các phép toán đa thức, cơ chế lấy mẫu sẵn có dữ liệu (DAS) và các mạng con theo cột (column subnet). Cơ chế cắt tỉa blob cũng khiến việc lưu trữ lịch sử đầy đủ không còn mặc định miễn phí, buộc các trình khám phá blockchain và bản thân các rollup phải tự đảm nhiệm khâu lưu trữ dài hạn. Trong khi đó, EIP-7702 mở ra bề mặt tấn công mới như ủy quyền nhầm mã độc hại hoặc lừa đảo ký ủy quyền (phishing authorization). Đối với gộp chữ ký BLS, cơ chế này dựa trên giả định đồng bộ của ủy ban xác thực; khi xảy ra phân nhánh hoặc ký mâu thuẫn (equivocation), hệ thống vẫn cần cơ chế cắt giảm tài sản đặt cược (slashing) như đã phân tích về lỗi Byzantine ở bài 00.01.

## 5. Giá trị bổ sung của bài học này

Các bài 00.00–00.03 vẫn là tài liệu cốt lõi giải thích *vì sao* hàm băm có tính một chiều, *vì sao* cây Merkle chống giả mạo và *vì sao* chữ ký số không thể làm giả. Bài học tùy chọn này chỉ kết nối những nền tảng đó với EIP-4844, Verkle, EIP-2537, EIP-4337 và EIP-7702 mà không chứng minh lại các tính chất mật mã cơ bản.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844) | 2022–2024 | Proto-danksharding; cơ chế blob và cam kết KZG |
| [Dencun Mainnet Announcement](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) | 2024 | Kích hoạt ngày 13/03/2024 tại epoch 269568 |
| [Pectra Mainnet Announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | Bao gồm EIP-7702, EIP-2537 và EIP-7691; kích hoạt ngày 07/05/2025 |
| [EIP-7702: Set EOA account code](https://eips.ethereum.org/EIPS/eip-7702) | 2024–2025 | Trừu tượng hóa tài khoản dựa trên ủy quyền ở tầng giao thức |
| [EIP-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337) | 2021–2023 | UserOperation và EntryPoint ở tầng ứng dụng |
| [PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) / [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) | 2025 | Lấy mẫu tính sẵn có dữ liệu (DAS) theo cột blob |
| [Verkle trees (Buterin)](https://vitalik.eth.limo/general/2021/06/18/verkle.html) | 2021+ | Dùng cam kết vector thay thế đường dẫn Merkle |

## Video tham khảo

- **Xem trước:** [Goodbye Merkle Trees? Verkle Trees & Multiproofs Demystified | Episode7 - Season 1 Finale](https://www.youtube.com/watch?v=3PyDkMYrzAs) — zkMarek, tiếng Anh. So sánh kích thước bằng chứng Merkle với Verkle multiproof; nên xem trước mục chuyển từ cây Merkle sang cam kết vector.
- [What is EIP-4844? | Blobs & Proto-danksharding](https://www.youtube.com/watch?v=LmQTRGqUL9s) — Patrick Collins, tiếng Anh. Giải thích cơ chế blob và proto-danksharding, khớp với phần EIP-4844 và cam kết KZG trên dữ liệu tạm.
- [5. BLS aggregation by Vitalik Buterin and Justin Drake (Ethereum Foundation)](https://www.youtube.com/watch?v=DpV0Hh9YajU) — Ethereum Foundation, tiếng Anh. Vitalik Buterin và Justin Drake trình bày cơ chế gộp chữ ký BLS, tương ứng với phần beacon chain và EIP-2537.

## 7. Bài tập định hướng

1. So sánh độ dài bằng chứng Merkle (với trạng thái Ethereum khoảng \(2^{28}\) lá) với một mở cam kết KZG. Đại lượng nào quan trọng hơn đối với *nút nhẹ (light client)*?
2. Đọc phần vòng đời blob trong EIP-4844. Vì sao thời gian lưu trữ khoảng 18 ngày là đủ cho cửa sổ rút tiền 7 ngày của optimistic rollup?
3. Viết bốn câu phân biệt EIP-4337 và EIP-7702: đề xuất nào thay đổi tầng giao thức đồng thuận, đề xuất nào chỉ hoạt động qua mempool thay thế (alt-mempool)?

---
✅ **Kết thúc bài học tùy chọn**
Next: [Lecture 01.00 — Bitcoin Architecture]({{ site.baseurl }}/contents/vi/chapter01/)
