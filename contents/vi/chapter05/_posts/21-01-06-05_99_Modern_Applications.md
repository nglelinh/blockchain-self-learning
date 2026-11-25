---
layout: post
title: "Lecture 05.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '05'
order: 7
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
lesson_type: optional
---

# Bài giảng tùy chọn 05.99: ZK và bảo mật giai đoạn 2022–2026 — Folding, zkVM, Jolt, FIPS 203

> Bài giảng này mang tính **tùy chọn**. Nội dung **không** lặp lại định nghĩa ZK, Groth16, STARK, lỗ hổng tái nhập hay nền tảng toán học PQC trong bài 05.04, mà tập trung điểm qua các *hệ chứng minh và tiêu chuẩn* đã đi vào thực tế kỹ thuật trong giai đoạn 2022–2026.

Vào năm 2020, muốn xây dựng một ứng dụng Zero-Knowledge là một cực hình kỹ thuật: lập trình viên phải tự tay dịch từng câu lệnh `if/else` và vòng lặp thành hàng trăm nghìn ràng buộc đại số R1CS bằng ngôn ngữ chuyên biệt như Circom. Chỉ bốn năm sau (2022–2026), bức tranh đã đổi chiều ngoạn mục: các kỹ thuật **Gấp (Folding — Nova/HyperNova)**, **máy ảo zkVM (RISC Zero, SP1)** và **Lookup Arguments (Jolt/Lasso)** cho phép kỹ sư viết mã Rust bình thường rồi xuất thẳng bằng chứng ZK chạy được ngay trên điện thoại!

Bài cập nhật hiện đại này tổng hợp bước nhảy vọt lớn nhất của ngành ZK và bảo mật blockchain giai đoạn 2022–2026, giúp bạn hiểu rõ cơ chế toán học đứng sau thế hệ công cụ mới này.

---

## Kiến thức cần nhớ: Làn sóng ZK 2022–2026 đột phá trên bốn trụ cột nào?

1. **Lược đồ Gấp (Folding Schemes — Nova, Sangria, HyperNova):** Thay vì tạo và xác minh đệ quy hàng triệu bằng chứng SNARK nặng nề, ta "gấp" từng bước tính toán thành một thể hiện duy nhất bằng tổ hợp tuyến tính ngẫu nhiên — giảm chi phí Prover xuống hàng chục lần.
2. **zkVM đa dụng (RISC Zero, SP1):** Chứng minh trực tiếp việc thực thi của bộ lệnh chuẩn RISC-V; lập trình viên viết Rust/C++ thông thường, không cần thiết kế mạch thủ công.
3. **Tra cứu bảng (Lookup Arguments — Jolt & Lasso):** Thay vì mô phỏng phép XOR hay SHA-256 bằng hàng nghìn cổng nhân đắt đỏ, ta biến chúng thành thao tác tra cứu bảng cực nhỏ được chứng minh bằng đa thức đa tuyến tính (sum-check).
4. **ZK ứng dụng thực tế (ZK Email, zkTLS & Privacy Pools):** Chứng minh thông tin từ chữ ký DKIM của email hoặc phiên HTTPS mà không lộ dữ liệu riêng tư, đồng thời cho phép chứng minh "tiền sạch không thuộc danh sách đen" để hài hòa giữa riêng tư và tuân thủ pháp lý.

---

## 1. Từ “mạch R1CS thủ công” đến “chạy chương trình Rust và xuất bằng chứng”

Bài 05.01 giới thiệu SNARK và STARK ở cấp độ nguyên thủy mật mã học. Sang giai đoạn 2022–2026, điểm nghẽn kỹ thuật đã dịch chuyển: các đội ngũ phát triển không muốn viết tay từng mạch băm Poseidon nữa; thay vào đó, họ hướng tới **zkVM** — chứng minh trực tiếp vết thực thi (execution trace) của tập lệnh RISC-V hoặc ISA tùy chỉnh — kết hợp với **kỹ thuật gập (folding)** để giảm chi phí tính toán có thể xác minh tăng dần (IVC — incremental verifiable computation). Song song đó, vào tháng 8/2024, NIST đã hoàn tất bộ tiêu chuẩn FIPS 203/204/205, đưa mật mã hậu lượng tử (PQC) từ giai đoạn nghiên cứu sang tiêu chuẩn liên bang chính thức, gắn kết trực tiếp với nền tảng lý thuyết của bài 05.04.

Ở mảng bảo mật hợp đồng, xác minh hình thức (bài 05.03) ngày càng được tích hợp thẳng vào quy trình CI thông qua các công cụ như Certora, Halmos và Kontrol; dù không thay thế kiểm toán thủ công, các công cụ này đã trở thành bước kiểm tra bắt buộc đối với nhiều giao thức lớn.

![Cây hash — commitment mà SNARK/STARK/zkVM vẫn dựa trên](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)
*Nguồn: [Wikimedia Commons — Hash Tree](https://commons.wikimedia.org/wiki/File:Hash_Tree.svg). Tổng quan ZKP: [Wikipedia](https://en.wikipedia.org/wiki/Zero-knowledge_proof).*

## 2. Các bước tiến then chốt

### 2.1. Kỹ thuật gập (Folding): Nova và các biến thể

Kothapalli, Setty và Tzialla trong công trình *Nova: Recursive Zero-Knowledge Arguments from Folding Schemes* (CRYPTO 2022; [ePrint 2021/370](https://eprint.iacr.org/2021/370)) đã đề xuất cơ chế **folding**: gộp hai thực thể R1CS (ở dạng nới lỏng — relaxed R1CS) thành một thực thể duy nhất với chi phí đệ quy xấp xỉ hằng số (chỉ tốn vài phép nhân nhóm), không cần sinh SNARK ở từng bước, không cần thiết lập tin cậy và không bắt buộc dùng FFT. Sau đó, các biến thể như SuperNova, HyperNova và Protostar (2023–2024) tiếp tục mở rộng folding cho các mạch không đồng nhất và cơ chế bảng tra cứu (lookup).

Liên hệ trực quan với bài 05.01: thay vì tạo một bằng chứng Groth16 ở mỗi bước, người chứng minh chỉ cần *cộng gộp* các ràng buộc qua từng bước rồi mới nén thành bằng chứng cuối cùng một lần. Đây là lý do nhiều zkVM và zk coprocessor từ năm 2024 lựa chọn họ Nova cho các tác vụ chứng minh dài (như cầu nối chuỗi, suy luận học máy hoặc chứng minh thay đổi trạng thái L2).

### 2.2. zkVM: RISC Zero, SP1 và Jolt

Một zkVM nhận đầu vào là chương trình biên dịch theo một tập lệnh (thường là RISC-V) và sinh ra bằng chứng khẳng định rằng chương trình ELF đó khi chạy trên đầu vào \(x\) sẽ cho ra kết quả \(y\).

- **RISC Zero** và **SP1** (Succinct): Sử dụng STARK để chứng minh vết thực thi, sau đó bọc bằng một lớp SNARK (Groth16 hoặc PLONK) để xác minh trên chuỗi với chi phí thấp. Các thao tác mật mã phổ biến như `keccak`, `secp256k1` hay pairing được tách thành precompile thay vì chạy qua mạch RISC-V thuần túy.
- **Jolt** (Arun, Setty, Thaler; [ePrint 2023/1217](https://eprint.iacr.org/2023/1217), EUROCRYPT 2024): Áp dụng kiến trúc "lookup singularity", trong đó hầu hết các lệnh CPU được biểu diễn dưới dạng tra cứu vào các bảng có cấu trúc rất lớn, kết hợp với đối số tra cứu **Lasso** (ePrint 2023/1216). Người chứng minh chỉ cần cam kết số phần tử trường xấp xỉ hằng số cho mỗi bước CPU, giúp hệ thống dễ kiểm toán hơn so với mạch viết thủ công.

Hệ quả đối với bảo mật (bài 05.02): thay vì kiểm chứng từng mạch số học riêng lẻ, nhóm phát triển chuyển sang kiểm chứng chương trình khách (guest program) viết bằng Rust và đặt niềm tin vào tính đúng đắn của zkVM — bề mặt tấn công thay đổi về bản chất chứ không nhỏ đi.

### 2.3. Hệ sinh thái ngôn ngữ mạch: Noir, Circom, Cairo và Halo2

Trong giai đoạn 2023–2026, kỹ sư phát triển mạch ZK thường làm việc trên các công cụ chính như **Noir** (Aztec), **Halo2** (0xPARC), **Cairo** (StarkWare, vận hành trên Starknet) cùng Plonky2/3 (Polygon) tối ưu cho STARK đệ quy. Từ nền tảng SNARK và STARK ở bài 05.01, có thể ánh xạ nhanh các công cụ này như sau: Circom tương ứng với R1CS cổ điển; Halo2 và Plonky dựa trên Plonkish kết hợp lookup; còn Cairo gắn với mô hình AIR/STARK.

### 2.4. FIPS 203 và lộ trình PQC

Ngày 13/8/2024, NIST chính thức ban hành ba tiêu chuẩn hậu lượng tử: [FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final), [FIPS 204 (ML-DSA)](https://csrc.nist.gov/pubs/fips/204/final) và [FIPS 205 (SLH-DSA)](https://csrc.nist.gov/pubs/fips/205/final). Đây là các mã tiêu chuẩn tham chiếu bắt buộc khi làm việc về mật mã hậu lượng tử với cơ quan chính phủ và hệ thống ngân hàng, bổ sung mốc chuẩn hóa cụ thể cho phần lý thuyết mạng lưới ở bài 05.04. Trên thực tế, các blockchain lớn như Ethereum và Bitcoin *chưa* chuyển đổi khỏi ECDSA; các hướng nghiên cứu về tài khoản và địa chỉ kháng lượng tử vẫn đang mở (xem thêm bài 07.99).

Ở mảng quyền riêng tư ứng dụng, xu hướng dịch chuyển sang zk coprocessor (lấy dữ liệu lưu trữ từ L1 để chứng minh ngoài chuỗi) và DeFi riêng tư có kiểm soát tuân thủ sau sự kiện Tornado Cash (2022) — phản ánh rõ bài toán cân bằng giữa quyền riêng tư và tuân thủ pháp lý đã nêu ở bài 05.00.

### Giải thích: tự tay kiểm tra cơ chế Gấp (Folding) hai bài toán thành một trong Nova

Tại sao **Folding** lại cách mạng hóa tính toán kiểm chứng tăng dần (IVC — *Incrementally Verifiable Computation*)? Hãy thử trực tiếp trên hai hệ phương trình tuyến tính siêu nhỏ (mô hình thu gọn của R1CS):

- **Bước 1 hợp lệ:** $$A x_1 = b_1$$ với $$A = \begin{pmatrix}2 & 1\end{pmatrix}$$, nghiệm $$x_1 = \begin{pmatrix}3\\ 1\end{pmatrix} \;\Longrightarrow\; b_1 = 2(3) + 1(1) = 7$$.
- **Bước 2 hợp lệ:** $$A x_2 = b_2$$ với cùng ma trận $$A$$, nghiệm $$x_2 = \begin{pmatrix}4\\ 2\end{pmatrix} \;\Longrightarrow\; b_2 = 2(4) + 1(2) = 10$$.

Thay vì tốn công tạo **2 bằng chứng SNARK** riêng rồi kiểm tra lồng nhau, Verifier (hoặc hàm băm Fiat–Shamir) sinh ra một hệ số ngẫu nhiên $$r = 5$$ và **gấp** hai bước thành **duy nhất 1 bài toán**:

$$
x_{\text{gấp}} = x_1 + r\,x_2 = \begin{pmatrix}3 + 5(4)\\ 1 + 5(2)\end{pmatrix} = \begin{pmatrix}23\\ 11\end{pmatrix},
\qquad
b_{\text{gấp}} = b_1 + r\,b_2 = 7 + 5(10) = 57.
$$

**Kiểm tra lại bằng tay:** $$A x_{\text{gấp}} = 2(23) + 1(11) = 46 + 11 = 57 = b_{\text{gấp}}$$!
- **Nếu Prover gian lận ở bước 2** (ví dụ bịa $$b_2 = 11 \neq 10$$), thì vế phải thành $$7 + 5(11) = 62 \neq 57$$ — chỉ trừ trường hợp cực hiếm $$r$$ rơi đúng nghiệm của một phương trình bậc 1 trên trường $$\mathbb{F}_p$$ (xác suất $$1/p \approx 2^{-256}$$)!
- Nhờ cơ chế gấp siêu rẻ này (chỉ cần phép cộng vectơ và cam kết đường cong), ta có thể gấp **1 triệu bước thực thi liên tiếp** rồi chỉ chạy bộ tạo bằng chứng SNARK nặng nề **đúng 1 lần duy nhất ở bước cuối cùng**!

## 3. Góc nhìn triển khai

Trong một cầu nối hiện đại, chương trình khách bằng Rust chạy trên SP1 có thể chứng minh rằng nó đã xác minh đúng đường dẫn Merkle và chữ ký BLS; sau đó lớp bọc Groth16 được xác minh trên L1 nhờ các hợp đồng biên dịch sẵn (precompile) cho phép pairing (EIP-2537 sau bản nâng cấp Pectra hỗ trợ thêm đường cong BLS). Khi cần chứng minh chuỗi *nhiều khối* L2 liên tiếp, kỹ thuật folding được dùng để gập từng khối lại trước khi nén thành một bằng chứng SNARK duy nhất:

```text
guest.rs (RISC-V) --> zkVM STARK --> Groth16 wrapper --> eip-197/2537 verify
                         \
                          Nova folds (nếu IVC dài)
```

Bên cạnh đó, các quy tắc Certora (chẳng hạn đảm bảo không đúc vượt quá `totalSupply`) được chạy tự động trong CI như lớp bảo vệ bổ sung, không thay thế danh mục kiểm tra lỗ hổng tái nhập và kiểm toán thủ công ở bài 05.02.

## 4. Thách thức và sự đánh đổi

Mỗi precompile trong zkVM đều tạo thêm một mạch tin cậy mới cần kiểm toán kỹ lưỡng. Việc bọc bằng Groth16 cũng đưa yêu cầu thiết lập tin cậy (trusted setup) quay trở lại, trong khi các thực thể relaxed R1CS của kỹ thuật folding dễ mắc lỗi cài đặt. Nếu hạ tầng tạo bằng chứng (prover) bị tập trung hóa, tính sẵn sàng (liveness) của hệ thống sẽ chịu rủi ro. Đối với mật mã hậu lượng tử, kích thước chữ ký lớn hơn ECDSA nhiều lần khiến việc thay thế trực tiếp trên L1 gặp rào cản lớn về phí giao dịch. Cuối cùng, các công cụ xác minh hình thức phụ thuộc hoàn toàn vào chất lượng đặc tả: nếu đặc tả sai, hệ thống chỉ chứng minh đúng một yêu cầu sai.

## 5. Phạm vi bổ sung của bài giảng

Người học vẫn cần nắm vững các bài 05.00–05.05 về quyền riêng tư cổ điển, toán học của Groth16/STARK, lỗ hổng hợp đồng, phương pháp hình thức và lý thuyết PQC. Bài tùy chọn này giúp kết nối các kiến thức nền đó với hệ sinh thái công cụ thực tế gồm Nova, zkVM, Jolt/Lasso, Noir/Halo2 và bộ chuẩn FIPS 203–205.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [Nova (CRYPTO 2022 / ePrint 2021/370)](https://eprint.iacr.org/2021/370) | 2022 | Lược đồ gập (folding schemes) giúp giảm chi phí IVC |
| [Jolt (ePrint 2023/1217)](https://eprint.iacr.org/2023/1217) | 2023–2024 | zkVM dựa trên tra cứu bảng (EUROCRYPT 2024) |
| [Lasso (ePrint 2023/1216)](https://eprint.iacr.org/2023/1216) | 2023 | Đối số tra cứu (lookup argument) |
| [RISC Zero docs](https://dev.risczero.com/) | 2022– | zkVM RISC-V vận hành thực tế |
| [SP1 (Succinct)](https://docs.succinct.xyz/) | 2024– | zkVM RISC-V tích hợp precompile |
| [FIPS 203 ML-KEM](https://csrc.nist.gov/pubs/fips/203/final) | 2024-08-13 | Chuẩn hóa thuật toán Kyber |
| [Halo2 book](https://zcash.github.io/halo2/) / [Noir](https://noir-lang.org/) | 2022– | Hệ sinh thái công cụ viết mạch ZK |

## Video tham khảo

- **Xem trước:** [Nova: Recursive Zero-Knowledge Arguments from Folding Schemes - Srinath Setty](https://www.youtube.com/watch?v=mY-LWXKsBLc) — Protocol Labs, tiếng Anh. Srinath Setty trình bày về Nova; nên xem trước để hiểu cách folding giúp IVC nhẹ hơn so với dùng Groth16 ở từng bước.
- [What is Jolt? The simplest and most extensible zkVM, explained.](https://www.youtube.com/watch?v=WxjOF1oPmNs) — a16z Frontier, tiếng Anh. Giải thích kiến trúc zkVM Jolt, giúp đối chiếu cách chứng minh vết thực thi thay vì viết mạch thủ công.
- [FIPS 203 Post-Quantum Cryptography](https://www.youtube.com/watch?v=GLBCdATgSbg) — Dr. Carmenatty - AI, Cybersecurity & Quantum Comp., tiếng Anh. Phân tích tiêu chuẩn FIPS 203, liên hệ ML-KEM với cột mốc chuẩn hóa của NIST tháng 8/2024.

## 7. Bài tập định hướng

1. Kỹ thuật gập Nova giúp giảm *chi phí nào* so với việc dùng Groth16 đệ quy ở từng bước, và yếu tố nào *không* tự giảm (chẳng hạn kích thước bằng chứng cuối nếu không có bước nén)?
2. Với kiến trúc "lookup singularity" của Jolt, vì sao bảng kích thước \(2^{128}\) không cần lưu trực tiếp trong bộ nhớ và Lasso khai thác cấu trúc bảng như thế nào (tham khảo phần tóm tắt trên ePrint)?
3. Nêu một lý do kỹ thuật khiến Ethereum *chưa* thay thế ngay ECDSA bằng ML-DSA cho các giao dịch người dùng trên L1.

---
✅ **End of optional lesson**
Next: [Lecture 06.00 — Cross-Chain Communication]({{ site.baseurl }}/contents/vi/chapter06/)
