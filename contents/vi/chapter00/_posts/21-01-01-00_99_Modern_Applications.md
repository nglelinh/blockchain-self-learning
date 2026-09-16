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

# Lecture (tùy chọn): Building blocks 2022–2026 — Verkle, blob DA, BLS, account abstraction

> Bài này là **tùy chọn**. Nó **không** thay các bài 00.00–00.03 về sổ cái phân tán, hash, Merkle tree, hay ECDSA. Nó chỉ chỉ ra chỗ các *đối tượng* ấy sống trong các hệ thống đã ship khoảng 2022–2026.

## 1. Vì sao chương nền tảng vẫn cần — và điều gì đã đổi

Ba trụ cột của Chapter 00 — đồng thuận phân tán, hàm băm / cây Merkle, chữ ký số — không bị thay thế. Cái đổi là *hình dạng công nghiệp* của chúng. Một block Ethereum sau Dencun không chỉ là header + danh sách giao dịch + Merkle root; nó mang thêm **blob** (EIP-4844) mà node chỉ cam kết và lưu tạm. Một tài khoản không còn chỉ là cặp khóa ECDSA trên `secp256k1`; EIP-7702 cho phép EOA *ủy quyền tạm thời* cho mã hợp đồng. Một chứng thực validator không còn là một chữ ký ECDSA đơn lẻ: beacon chain dùng **BLS12-381** để gộp hàng nghìn attestation thành một đối tượng nhỏ.

Nếu Chapter 00 dạy “hash = dấu vân tay, Merkle = bằng chứng thành viên, chữ ký = ủy quyền”, bài này dạy ba biến thể production của cùng các ý đó: cam kết đa thức (Verkle / KZG), dữ liệu sẵn có tạm thời (blobs), và chữ ký có thể gộp (BLS).

![Cấu trúc block Bitcoin — điểm xuất phát cho mọi “block” sau này](https://upload.wikimedia.org/wikipedia/commons/5/55/Bitcoin_Block_Data.svg)
*Nguồn: [Wikimedia Commons — Bitcoin block data](https://commons.wikimedia.org/wiki/File:Bitcoin_Block_Data.svg)*

## 2. Các bước tiến then chốt

### 2.1. Từ Merkle tree tới Verkle tree và KZG commitments

Cây Merkle trong bài 00.02 cho phép chứng minh “giao dịch \(T\) nằm trong block” bằng đường đi \(O(\log n)\) hash. Verkle tree (Kuszmaul 2018; Dankrad Feist / Ethereum research 2021–2024) thay hash dọc đường đi bằng **vector commitment** — trên thực tế là commitment KZG trên đa thức. Bằng chứng thành viên trở thành *hằng số* (một vài group element) thay vì \(\log n\) hash, đổi chi phí xác minh lấy khả năng nén witness khi state Ethereum vượt hàng trăm GB.

Bạn không cần học lại định nghĩa hash. Điều cần thấy: *cùng bài toán membership*, primitive đổi từ

\[
\pi_{\text{Merkle}} = \big(h_1, h_2, \ldots, h_{\log n}\big)
\]

sang một opening

\[
\pi_{\text{KZG}} = \big(C, y, \pi\big) \quad\text{sao that}\quad e\big(\pi, [s-z]G_2\big) = e\big(C - [y]G_1, G_2\big).
\]

KZG chính là primitive mà EIP-4844 dùng để cam kết blob: execution layer chỉ thấy *versioned hash* của commitment, consensus layer lưu blob khoảng 4096 epoch (~18 ngày) rồi prune. Đó là Merkle “tạm thời” — immutability của *cam kết* không đòi hỏi lưu mãi *dữ liệu*.

Tài liệu: [Verkle Trees](https://vitalik.eth.limo/general/2021/06/18/verkle.html) (Buterin, 2021, roadmap vẫn active 2024–2026); [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844); [Dencun FAQ](https://ethereum.org/roadmap/dencun/) (kích hoạt 13-Mar-2024, epoch 269568).

### 2.2. Blob là primitive dữ liệu mới, không phải “block nhỏ hơn”

EIP-4844 thêm loại giao dịch mang blob 128 KiB. Blob **không** đi vào execution state và **không** tồn tại vĩnh viễn trên mọi full node. Rollup đăng batch lên “làn DA” rẻ; verifier chỉ cần KZG opening. Về mặt distributed systems, đây là tách *availability* khỏi *execution* — đúng bài toán CAP/replication của 00.01, nhưng với TTL.

Dencun (Cancun-Deneb) kích hoạt proto-danksharding trên mainnet ngày 13 tháng 3 năm 2024. Pectra (7 tháng 5 năm 2025) tăng thông lượng blob qua [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691). Fusaka đưa [PeerDAS / EIP-7594](https://ethereum.org/roadmap/fusaka/peerdas/): mỗi node chỉ custody một phần cột của blob đã erasure-code, rồi lấy mẫu ngẫu nhiên — data availability sampling trở thành gossip protocol, không còn “mọi node tải hết”.

### 2.3. Chữ ký: từ một ECDSA tới BLS aggregation và “account là chương trình”

Bài 00.03 xây ECDSA trên `secp256k1`. Beacon chain Ethereum chọn BLS (BLS12-381) vì tính chất tuyến tính: \(n\) chữ ký trên cùng một message có thể gộp thành một chữ ký. [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (trong Pectra, tháng 5 năm 2025) thêm precompile BLS12-381 trên execution layer, để smart contract xác minh cùng đường cong mà consensus đã dùng.

Song song, mô hình “tài khoản = cặp khóa” bị nới. [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) (EntryPoint canonical 2023) đưa UserOperation, bundler, paymaster vào *lớp ứng dụng*. [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) (Pectra) cho EOA ký một authorization để *set code tạm thời* — batching, sponsorship, social recovery — mà không đổi địa chỉ. Chữ ký vẫn chứng minh quyền kiểm soát; cái đổi là *đối tượng được ủy quyền* có thể là contract, không chỉ `ecrecover`.

![Cây hash / Merkle — primitive membership mà Verkle và KZG vẫn giải](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)
*Nguồn: [Wikimedia Commons — Hash Tree](https://commons.wikimedia.org/wiki/File:Hash_Tree.svg)*

## 3. Insight triển khai

Khi một rollup đăng batch sau Dencun, wallet của user không “gửi calldata”. Sequencer tạo blob-carrying transaction; client execution chỉ thấy `blob_versioned_hashes`. Công thức phí tách làm hai thị trường: `gas` cho EVM và `blob_gas` (EIP-4844 §3.1, opcode `BLOBBASEFEE` / EIP-7516). Đó là cùng ý “resource metering” như gas trong Chapter 03, nhưng gắn vào primitive DA của Chapter 00.

Với EIP-7702, một ví phần cứng vẫn ký bằng ECDSA; payload là authorization tuple `(chain_id, address, nonce)`. Node set `account.code` cho đến khi authorization bị thay. Không có primitive mật mã mới — chỉ có *semantics* mới của chữ ký.

```text
[user EOA] --(EIP-7702 auth)--> [delegated contract]
       |                              |
       +-- ECDSA như bài 00.03 --+    +-- batch / paymaster / 4337-style logic
```

## 4. Thách thức và trade-off

Verkle và PeerDAS tăng độ phức tạp client: phải hiểu đa thức, DAS, column subnet. Blob prune nghĩa là “full history” không còn miễn phí — explorer và rollup phải tự lưu. EIP-7702 mở mặt tấn công mới (malicious delegation, phishing authorization). BLS aggregation giả định đồng bộ committee; một fork hoặc equivocation vẫn cần slashing như bài 00.01 đã nói về Byzantine faults.

## 5. Bài này bổ sung gì cho ghi chú cốt lõi

Vẫn dùng 00.00–00.03 để giải thích *tại sao* hash one-way, *tại sao* Merkle chống giả mạo, *tại sao* chữ ký không giả được. Bài tùy chọn chỉ nối các đối tượng ấy với EIP-4844, Verkle, EIP-2537, EIP-4337 và EIP-7702 — không chứng minh lại collision resistance.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844) | 2022–2024 | Proto-danksharding; blob + KZG |
| [Dencun Mainnet Announcement](https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement) | 2024 | Kích hoạt 13-Mar-2024, epoch 269568 |
| [Pectra Mainnet Announcement](https://blog.ethereum.org/2025/04/23/pectra-mainnet) | 2025 | EIP-7702, EIP-2537, EIP-7691; 07-May-2025 |
| [EIP-7702: Set EOA account code](https://eips.ethereum.org/EIPS/eip-7702) | 2024–2025 | Authorization-based account abstraction tại protocol |
| [EIP-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337) | 2021–2023 | UserOperation / EntryPoint (lớp ứng dụng) |
| [PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) / [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) | 2025 | DAS cho blob columns |
| [Verkle trees (Buterin)](https://vitalik.eth.limo/general/2021/06/18/verkle.html) | 2021+ | Vector commitment thay Merkle path |

## 7. Bài tập định hướng

1. So sánh độ dài witness Merkle (state Ethereum ~\(2^{28}\) lá) với một KZG opening. Con số nào quan trọng cho *light client*?
2. Đọc EIP-4844 § blob lifecycle. Vì sao ~18 ngày đủ cho cửa sổ rút optimistic rollup 7 ngày?
3. Viết bốn câu phân biệt EIP-4337 và EIP-7702: cái nào đổi consensus, cái nào chỉ alt-mempool?

---
✅ **End of optional lesson**
Next: [Lecture 01.00 — Bitcoin Architecture]({{ site.baseurl }}/contents/vi/chapter01/)
