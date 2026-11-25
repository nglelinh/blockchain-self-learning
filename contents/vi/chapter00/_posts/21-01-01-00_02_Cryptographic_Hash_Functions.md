---
layout: post
title: "Lecture 00.02: Cryptographic Hash Functions - Nền tảng của Blockchain"
chapter: '00'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Cryptographic Hash Functions - Nền tảng của Blockchain

Bạn tải về một tập tin hệ điều hành nặng 4 GB từ internet. Làm thế nào chỉ bằng một chuỗi 64 ký tự thập lục phân (như `e3b0c442...`) bạn có thể biết chắc 100% tập tin ấy chưa bị tin tặc sửa dù chỉ **một bit duy nhất** trong hàng chục tỷ bit? Phép màu đằng sau dấu vân tay số ấy chính là **hàm băm mật mã (cryptographic hash function)** — linh hồn của cả an ninh mạng hiện đại lẫn mọi kiến trúc blockchain.

Trên blockchain, hàm băm không chỉ làm nhiệm vụ kiểm tra toàn vẹn dữ liệu. Nó vừa đóng vai trò "xi măng" gắn kết các khối thành chuỗi bất biến, vừa dựng nên **cây Merkle** giúp điện thoại di động xác minh một giao dịch trong tích tắc mà không cần tải cả trăm gigabyte lịch sử, lại vừa tạo ra "câu đố xổ số" cho cơ chế đào Proof-of-Work của Bitcoin.

---

## Kiến thức cần nhớ: Hàm băm mật mã, Xác suất va chạm và Cây Merkle nghiên cứu những gì?

Với kiến thức toán rời rạc, xác suất và cấu trúc dữ liệu cây nhị phân ở bậc đại học, bạn có thể nắm trọn ba trụ cột của bài học này:

### 1. Mật mã học đối xứng và Ba tính chất an ninh của Hàm băm
Một hàm băm $$H: \{0,1\}^* \to \{0,1\}^n$$ ánh xạ không gian đầu vào vô hạn về tập đầu ra hữu hạn $$2^n$$ phần tử (với SHA-256 là $$2^{256} \approx 1.15 \times 10^{77}$$, gần bằng số nguyên tử trong vũ trụ quan sát được). Theo nguyên lý chuồng bồ câu, va chạm *chắc chắn tồn tại*, nhưng hàm băm mật mã đòi hỏi ba bài toán sau phải bất khả thi về mặt tính toán: **kháng tiền ảnh** ($$O(2^n)$$), **kháng tiền ảnh bậc hai** ($$O(2^n)$$), và **kháng va chạm** ($$O(2^{n/2})$$), kèm **hiệu ứng tuyết lở (avalanche effect)** — đổi 1 bit đầu vào làm lật ngẫu nhiên khoảng 50% số bit đầu ra.

### 2. Xác suất tổ hợp và Nghịch lý ngày sinh (Birthday Paradox)
Tại sao độ dài đầu ra phải là **256 bit** thay vì 128 bit? Nếu kẻ tấn công chỉ muốn tìm *một cặp bất kỳ* $$x \neq y$$ có cùng mã băm $$H(x) = H(y)$$ (tấn công va chạm), họ không cần thử $$2^n$$ lần mà chỉ cần khoảng $$\sqrt{2^n} = 2^{n/2}$$ lần! Do đó hàm băm 128-bit như MD5 chỉ có độ an toàn va chạm $$2^{64}$$ (và đã bị bẻ gãy hoàn toàn), trong khi SHA-256 đạt chuẩn an toàn $$2^{128}$$.

### 3. Cấu trúc dữ liệu xác thực: Cây Merkle (Merkle Tree)
Thay vì băm gộp tất cả $$N$$ giao dịch thành một chuỗi phẳng (muốn kiểm tra 1 giao dịch phải tải cả $$N$$ giao dịch), **cây Merkle** băm từng cặp giao dịch theo cấu trúc cây nhị phân lên tới một **Merkle Root** duy nhất 32 byte đặt trong tiêu đề khối. Nhờ đó, kích thước bằng chứng thành viên giảm từ tuyến tính $$O(N)$$ xuống logarit $$O(\log_2 N)$$!

---

### Giải thích: tự tay tính nghịch lý ngày sinh và bằng chứng cây Merkle

Hãy kiểm chứng hai con số quan trọng nhất của bài học chỉ bằng phép nhân cơ bản:

1. **Tại sao tìm va chạm tốn $$\sim 2^{n/2}$$ thay vì $$2^n$$?** Giả sử hàm băm trả về $$M = 2^n$$ giá trị đều nhau. Nếu bạn băm $$k$$ thông điệp khác nhau, số **cặp** có thể đối chiếu với nhau là $$\binom{k}{2} = \frac{k(k-1)}{2} \approx \frac{k^2}{2}$$. Xác suất không có cặp nào trùng nhau xấp xỉ:
   $$
   P(\text{không trùng}) \approx \Bigl(1 - \frac{1}{M}\Bigr)^{k^2/2} \approx e^{-k^2/(2M)}.
   $$
   Muốn xác suất trùng đạt $$50\%$$ ($$e^{-k^2/(2M)} = 0.5$$), ta giải $$\frac{k^2}{2M} = \ln 2 \approx 0.693 \implies k \approx 1.177\sqrt{M}$$.
   - Kiểm tra với $$M = 365$$ ngày trong năm: $$k \approx 1.177 \times \sqrt{365} \approx 22.5$$ → chỉ cần **23 người** trong một căn phòng là xác suất có hai người trùng sinh nhật đã vượt $$50\%$$!
   - Kiểm tra với SHA-256 ($$M = 2^{256}$$): $$k \approx 2^{128} \approx 3.4 \times 10^{38}$$ phép băm — ngay cả toàn mạng Bitcoin cộng lại cũng mất hàng nghìn tỷ tỷ năm!
2. **Tự tay kiểm tra bằng chứng cây Merkle cho 4 giao dịch $$T_1, T_2, T_3, T_4$$:**
   - Tầng lá: $$H_1 = H(T_1),\ H_2 = H(T_2),\ H_3 = H(T_3),\ H_4 = H(T_4)$$.
   - Tầng giữa: $$H_{12} = H(H_1 \| H_2)$$, $$H_{34} = H(H_3 \| H_4)$$.
   - Gốc Merkle: $$R = H(H_{12} \| H_{34})$$ (lưu công khai trong Block Header).
   - **Bài toán xác minh nhẹ (SPV):** Bob chỉ giữ $$R$$ và muốn kiểm tra xem $$T_2$$ có thật sự nằm trong khối không. Nút đầy đủ chỉ cần gửi cho Bob đúng **2 mã băm anh em**: $$\text{Proof}(T_2) = (H_1,\ H_{34})$$. Bob tự tính 3 phép băm:
     $$
     H_2 = H(T_2) \;\longrightarrow\; H_{12}' = H(H_1 \| H_2) \;\longrightarrow\; R' = H(H_{12}' \| H_{34}),
     $$
     rồi so khớp $$R' \stackrel{?}{=} R$$! Nếu một khối chứa tới $$N = 1\,048\,576 = 2^{20}$$ giao dịch, Bob cũng chỉ cần tải đúng **20 mã băm** ($$20 \times 32 = 640\text{ byte}$$) thay vì tải hàng trăm megabyte dữ liệu!

---

## 1. Tổng quan về khái niệm

Nếu xem blockchain như một công trình xây dựng, thì **hàm băm mật mã (cryptographic hash functions)** chính là những viên gạch cơ bản tạo nên phần móng. Mọi cơ chế cốt lõi của blockchain — từ liên kết các block với nhau, xác minh giao dịch cho đến quá trình đào block mới — đều dựa trên hàm băm.

Một **hàm băm (hash function)** là thuật toán toán học nhận đầu vào có độ dài bất kỳ và trả về đầu ra có độ dài cố định, gọi là **giá trị băm (hash)**, **bản tóm tắt (digest)** hoặc **dấu vân tay số (fingerprint)**. Chẳng hạn, SHA-256 (Secure Hash Algorithm 256-bit) — thuật toán băm được Bitcoin sử dụng — luôn cho ra kết quả dài 256 bit (32 byte), bất kể đầu vào chỉ dài 1 byte hay 1 gigabyte.

Tuy nhiên, không phải mọi hàm băm đều là **hàm băm mật mã**. Để đáp ứng yêu cầu bảo mật mật mã học, một hàm băm phải thỏa mãn ba tính chất then chốt:

**1. Kháng tiền ảnh (Pre-image Resistance / Tính một chiều)**:
Cho trước một giá trị băm \( h \), việc tìm ra bất kỳ thông điệp \( m \) nào sao cho \( H(m) = h \) là bất khả thi về mặt tính toán. Tính chất "một chiều" này giống như việc pha cà phê sữa: thao tác trộn hai thành phần rất dễ dàng, nhưng tách ngược lại thành cà phê và sữa riêng biệt sau khi đã trộn gần như không thể thực hiện.

**2. Kháng tiền ảnh thứ hai (Second Pre-image Resistance / Kháng va chạm yếu)**:
Cho trước một thông điệp \( m_1 \), cực kỳ khó tìm ra một thông điệp khác \( m_2 \neq m_1 \) sao cho \( H(m_1) = H(m_2) \). Tính chất này ngăn chặn việc tạo ra một tài liệu giả mạo có cùng giá trị băm với tài liệu gốc.

**3. Kháng va chạm (Collision Resistance / Kháng va chạm mạnh)**:
Cực kỳ khó tìm ra bất kỳ cặp thông điệp khác nhau \( m_1 \neq m_2 \) nào sao cho \( H(m_1) = H(m_2) \). Điều kiện này chặt hơn kháng tiền ảnh thứ hai vì kẻ tấn công được tự do chọn cả hai đầu vào.

Vai trò của các tính chất này trong blockchain:
- **Tính toàn vẹn (Integrity)**: Kháng tiền ảnh cho phép dùng giá trị băm làm cam kết (commitment); một khi giá trị băm đã công bố, mọi thay đổi trên dữ liệu gốc đều bị phát hiện.
- **Tính duy nhất (Uniqueness)**: Kháng va chạm đảm bảo mỗi block có một dấu vân tay số riêng biệt.
- **Liên kết chuỗi (Chain Linking)**: Mỗi block lưu giá trị băm của block liền trước; sửa đổi bất kỳ block nào sẽ làm đổi giá trị băm của nó và phá vỡ chuỗi liên kết phía sau.
- **Proof-of-Work**: Quá trình đào yêu cầu tìm đầu vào sao cho giá trị băm đầu ra thỏa mãn điều kiện ngưỡng (ví dụ: bắt đầu bằng một số lượng bit 0 nhất định).

**Lịch sử phát triển của các họ hàm băm**:
- **MD5** (1991): Đầu ra 128 bit, đã bị phá vỡ — có thể tạo va chạm chỉ trong vài giây.
- **SHA-1** (1995): Đầu ra 160 bit, đã ngừng khuyến nghị sử dụng sau khi xuất hiện tấn công va chạm thực tế năm 2017.
- **Họ SHA-2** (2001): Gồm SHA-224, SHA-256, SHA-384, SHA-512 — hiện vẫn được sử dụng rộng rãi.
- **SHA-3** (2015): Dựa trên kiến trúc Keccak, được thiết kế như phương án dự phòng độc lập với SHA-2 (không phải vì SHA-2 đã bị phá vỡ).
- **BLAKE2, BLAKE3**: Các hàm băm hiện đại có tốc độ xử lý cao hơn.

Bitcoin sử dụng **SHA-256**, trong khi Ethereum dùng **Keccak-256** (biến thể gần với SHA-3) cho phần lớn thao tác và trước đây từng dùng **Ethash** (hàm đòi hỏi nhiều bộ nhớ dựa trên Keccak) cho cơ chế đào PoW.

---

## 2. Hiểu biết trực quan

### 2.1. Hàm băm như "Dấu vân tay số"

Có thể hình dung hàm băm như một bộ xử lý chuẩn hóa đầu ra:

```
Input (any size)          Hash Function         Output (fixed size)
================         ==============        ===================
"Hello"          ──────►   SHA-256    ──────►  185f8db32271fe25...
"Hello!"         ──────►   SHA-256    ──────►  334d016f755cd6dc...
[Entire Harry    ──────►   SHA-256    ──────►  a7b38c29e4f15c83...
 Potter book]
```

Ba nhận xét chính:
1. Đầu ra luôn có độ dài cố định 256 bit (64 ký tự hệ thập lục phân), không phụ thuộc kích thước đầu vào.
2. Chỉ cần thêm hoặc đổi một ký tự ở đầu vào, đầu ra thay đổi hoàn toàn (hiệu ứng tuyết lở).
3. Không thể suy ngược nội dung đầu vào từ giá trị băm đầu ra.

### 2.2. Hiệu ứng tuyết lở (Avalanche Effect)

Hiệu ứng tuyết lở là đặc tính quan trọng của hàm băm mật mã: một thay đổi cực nhỏ ở đầu vào tạo ra thay đổi lớn và không thể dự đoán ở đầu ra:

```
Input:  "The quick brown fox jumps over the lazy dog"
SHA256: d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592

Input:  "The quick brown fox jumps over the lazy dag"  (dog → dag)
SHA256: 559cc2cb0e1998182b4b6343e38611b3757e8a6279d43e9914d74dfb7e7089e6
```

Chỉ thay đổi đúng một chữ cái nhưng hai chuỗi băm hoàn toàn khác nhau và không thể hiện bất kỳ quy luật tương quan nào.

### 2.3. Phép ví như đường một chiều

Hàm băm hoạt động như một **con đường một chiều**:

```
Message ─────[Hash Function]────► Hash Value
             ═══════════════
              Easy this way
                    
Message ◄────[Reverse?????]────── Hash Value
             ═══════════════
            Impossible this way
```

Với SHA-256, để tìm ngược tiền ảnh bằng cách thử vét cạn, cần duyệt trung bình cỡ \( 2^{255} \) đến \( 2^{256} \) thông điệp khác nhau. Con số \( 2^{256} \) lớn tới mức:

\[
2^{256} \approx 10^{77}
\]

Để dễ hình dung:
- Số nguyên tử trong vũ trụ quan sát được: \( \approx 10^{80} \).
- Số giây trôi qua kể từ vụ nổ Big Bang: \( \approx 4.3 \times 10^{17} \).

Ngay cả khi huy động toàn bộ máy tính trên Trái Đất, việc dò vét cạn một giá trị băm SHA-256 vẫn bất khả thi trong nhiều tỷ năm.

### 2.4. Nguyên lý chuồng bồ câu và sự tồn tại của va chạm

Về mặt toán học, va chạm (collision) **chắc chắn tồn tại**. Theo **Nguyên lý chuồng bồ câu (Pigeonhole Principle)**, nếu số lượng phần tử đầu vào lớn hơn số lượng ngăn chứa đầu ra, chắc chắn có ít nhất hai phần tử rơi vào cùng một ngăn:
- Không gian đầu vào: vô hạn (thông điệp có độ dài tùy ý).
- Không gian đầu ra: hữu hạn, gồm \( 2^{256} \) giá trị có thể.
- Vì vô hạn lớn hơn \( 2^{256} \), va chạm tất yếu phải tồn tại.

Tuy nhiên, việc *tìm ra* một va chạm trong thực tế lại cực kỳ khó. Theo **Nghịch lý ngày sinh (Birthday Paradox)**, cần khoảng \( 2^{128} \) phép thử băm ngẫu nhiên để xác suất tìm được va chạm của SHA-256 đạt mức 50%:

\[
2^{128} \approx 3.4 \times 10^{38}
\]

Với năng lực tính toán hiện nay, con số này vẫn nằm ngoài khả năng thực thi.

---

## 3. Nền tảng kỹ thuật

### 3.1. Cấu trúc thuật toán SHA-256

SHA-256 được xây dựng theo **cấu trúc Merkle–Damgård** và thực hiện qua bốn bước:

**Bước 1: Tiền xử lý — Đệm dữ liệu (Padding)**

Thông điệp được đệm thêm bit sao cho tổng độ dài chia hết cho 512 bit:
- Thêm 1 bit `'1'` vào cuối thông điệp.
- Thêm \( k \) bit `'0'` sao cho \( (\text{message length} + 1 + k) \equiv 448 \pmod{512} \).
- Thêm chuỗi 64 bit biểu diễn độ dài ban đầu của thông điệp gốc.

**Ví dụ**:
```
Original message: "abc" = 01100001 01100010 01100011 (24 bits)

After padding:
01100001 01100010 01100011 1 0000...0000 (423 bits) 0000...011000 (64 bits)
|-------- abc --------| ^ |---- k zeros ----| |--- length = 24 ---|
                       |
                    append 1
Total: 512 bits (one block)
```

**Bước 2: Khởi tạo các giá trị băm ban đầu**

SHA-256 sử dụng 8 hằng số khởi tạo 32-bit (\( H_0 \) đến \( H_7 \)):
```
H₀ = 0x6a09e667    (first 32 bits of fractional parts of √2)
H₁ = 0xbb67ae85    (√3)
H₂ = 0x3c6ef372    (√5)
...
H₇ = 0x5be0cd19    (√19)
```

Các hằng số này được lấy từ 32 bit đầu phần thập phân của căn bậc hai 8 số nguyên tố đầu tiên, nhằm đảm bảo tính minh bạch và tránh nghi ngờ về cửa hậu (backdoor).

**Bước 3: Xử lý từng khối 512-bit qua 64 vòng nén**

Mỗi khối 512-bit đi qua 64 vòng tính toán với các hàm thành phần sau:

1. **Hàm chọn `Ch(x, y, z)`**:
   \[
   \text{Ch}(x, y, z) = (x \land y) \oplus (\neg x \land z)
   \]
   (nếu bit của \( x \) là 1 thì chọn bit của \( y \), ngược lại chọn bit của \( z \)).

2. **Hàm đa số `Maj(x, y, z)`**:
   \[
   \text{Maj}(x, y, z) = (x \land y) \oplus (x \land z) \oplus (y \land z)
   \]
   (trả về giá trị xuất hiện nhiều hơn trong ba bit đầu vào).

3. **Các hàm xoay bit `Σ₀(x)`, `Σ₁(x)`**:
   \[
   \begin{align}
   \Sigma_0(x) &= \text{ROTR}^2(x) \oplus \text{ROTR}^{13}(x) \oplus \text{ROTR}^{22}(x) \\
   \Sigma_1(x) &= \text{ROTR}^6(x) \oplus \text{ROTR}^{11}(x) \oplus \text{ROTR}^{25}(x)
   \end{align}
   \]

4. **Các hàm dịch và xoay bit `σ₀(x)`, `σ₁(x)`**:
   \[
   \begin{align}
   \sigma_0(x) &= \text{ROTR}^7(x) \oplus \text{ROTR}^{18}(x) \oplus \text{SHR}^3(x) \\
   \sigma_1(x) &= \text{ROTR}^{17}(x) \oplus \text{ROTR}^{19}(x) \oplus \text{SHR}^{10}(x)
   \end{align}
   \]

**Vòng lặp chính (64 vòng)**:
```
For t = 0 to 63:
    T₁ = h + Σ₁(e) + Ch(e,f,g) + Kₜ + Wₜ
    T₂ = Σ₀(a) + Maj(a,b,c)
    h = g
    g = f
    f = e
    e = d + T₁
    d = c
    c = b
    b = a
    a = T₁ + T₂
```

Trong đó:
- `a, b, c, d, e, f, g, h`: 8 biến làm việc 32-bit.
- `Kₜ`: 64 hằng số vòng (32 bit đầu phần thập phân của căn bậc ba 64 số nguyên tố đầu tiên).
- `Wₜ`: Lịch trình thông điệp (message schedule) được mở rộng từ khối đầu vào.

**Bước 4: Tạo đầu ra cuối cùng**

Sau khi xử lý hết mọi khối, kết quả cuối cùng là chuỗi ghép 8 thanh ghi 32-bit \( H_0 || H_1 || \dots || H_7 \) tạo thành giá trị băm 256-bit.

### 3.2. Lịch trình thông điệp (Mảng W)

Mảng `W` gồm 64 từ 32-bit được xây dựng từ khối 512-bit đầu vào:

```python
# First 16 words: directly from message block
W[0..15] = message_block[0..15]  # Each word is 32 bits

# Remaining 48 words: derived from previous words
for t in range(16, 64):
    W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]
```

Quá trình mở rộng này đảm bảo mỗi bit của dữ liệu đầu vào khuếch tán ảnh hưởng tới nhiều bit của đầu ra (tính khuếch tán — diffusion).

### 3.3. Phân tích các tính chất thống kê

**Tính tất định (Deterministic)**:
\[
\forall m: H(m) \text{ always produces same output}
\]

**Phân phối đều (Uniform Distribution)**:
Với đầu vào ngẫu nhiên, mỗi bit trong đầu ra có xác suất xấp xỉ 0,5 nhận giá trị 0 hoặc 1.

**Hiệu ứng tuyết lở (Strict Avalanche Criterion)**:
Đảo 1 bit bất kỳ ở đầu vào sẽ làm đảo trung bình 50% số bit ở đầu ra:
\[
\text{Avalanche} = \frac{\text{Number of flipped bits in output}}{256} \times 100\%
\]

Với một hàm băm tốt, chỉ số này xấp xỉ 50% với phương sai rất nhỏ.

**Tính nén (Compression)**:
\[
|H(m)| = 256 \text{ bits, regardless of } |m|
\]

---

## 4. Công thức toán học và mật mã học

### 4.1. Phân tích toán học về kháng va chạm

Áp dụng **Nghịch lý ngày sinh** cho tập đầu ra có \( N \) giá trị khả dĩ, xác suất xuất hiện ít nhất một va chạm sau \( k \) mẫu ngẫu nhiên là:

\[
P(\text{collision}) \approx 1 - e^{-k(k-1)/(2N)}
\]

Để xác suất va chạm đạt 50%:
\[
k \approx \sqrt{2 N \ln 2} \approx 1.177\sqrt{N}
\]

Với SHA-256 (\( N = 2^{256} \)):
\[
k \approx 1.177 \times 2^{128} \approx 4.01 \times 10^{38}
\]

**Ước tính thời gian tìm va chạm bằng vét cạn**:

Giả sử năng lực tính toán là \( C \) phép băm/giây:
\[
\text{Time} = \frac{k}{C}
\]

**Ví dụ minh họa**:
- Giả sử huy động toàn bộ mạng Bitcoin với tốc độ \( C \approx 600 \times 10^{18} \) hash/giây (600 EH/s).
- Thời gian để đạt xác suất va chạm 50%:
  \[
  T = \frac{4.01 \times 10^{38}}{600 \times 10^{18}} \approx 6.68 \times 10^{17} \text{ seconds}
  \]
  \[
  T \approx 2.1 \times 10^{10} \text{ years} = 21 \text{ billion years}
  \]

Tuổi của vũ trụ hiện ước tính khoảng 13,8 tỷ năm. Ngay cả khi dùng toàn bộ sức mạnh tính toán của mạng Bitcoin, thời gian kỳ vọng vẫn lớn hơn tuổi của vũ trụ.

### 4.2. Kháng tiền ảnh và giới hạn nhiệt động lực học

Để tìm tiền ảnh của một giá trị băm \( h \) bằng phương pháp vét cạn, số phép thử kỳ vọng là:
\[
E[\text{attempts}] = \frac{2^{256}}{2} = 2^{255}
\]

**So sánh với giới hạn vật lý**:

Theo nguyên lý Landauer, năng lượng tối thiểu để xóa hoặc đảo 1 bit ở nhiệt độ \( T \) là:
\[
E_{\text{min}} = kT \ln 2
\]

Ở nhiệt độ phòng \( T = 300\text{ K} \):
\[
E_{\text{min}} \approx 2.87 \times 10^{-21} \text{ joules}
\]

Nếu mỗi phép băm chỉ tiêu tốn tối thiểu tương đương 1 thao tác bit lý tưởng, năng lượng để thực hiện \( 2^{256} \) phép tính là:
\[
E_{\text{total}} = 2^{256} \times 2.87 \times 10^{-21} \approx 3.3 \times 10^{56} \text{ joules}
\]

Quy đổi theo hệ thức tương đương khối lượng — năng lượng (\( E = mc^2 \)):
\[
m = \frac{E}{c^2} \approx \frac{3.3 \times 10^{56}}{9 \times 10^{16}} \approx 3.7 \times 10^{39} \text{ kg}
\]

So sánh tham khảo:
- Khối lượng Trái Đất: \( 5.97 \times 10^{24} \) kg.
- Khối lượng Mặt Trời: \( 1.99 \times 10^{30} \) kg.
- Giá trị trên tương đương khoảng 1,8 tỷ lần khối lượng Mặt Trời.

Điều này cho thấy việc phá vỡ SHA-256 bằng phương pháp vét cạn hoàn toàn bất khả thi về mặt vật lý.

### 4.3. Kháng tiền ảnh thứ hai

Với bài toán tìm \( m_2 \neq m_1 \) sao cho \( H(m_1) = H(m_2) \) khi \( m_1 \) đã cho trước, kẻ tấn công không thể dùng tấn công ngày sinh mà phải tìm kiếm vét cạn:
\[
\text{Expected attempts} = 2^{256}
\]

**Độ phức tạp tấn công tổng quát (với độ dài băm \( n \) bit)**:
- Kháng va chạm: \( O(2^{n/2}) \).
- Kháng tiền ảnh: \( O(2^n) \).
- Kháng tiền ảnh thứ hai: \( O(2^n) \).

Với SHA-256 (\( n = 256 \)), tìm va chạm cần cỡ \( 2^{128} \) phép tính và tìm tiền ảnh cần cỡ \( 2^{256} \) phép tính.

### 4.4. Tấn công mở rộng độ dài (Length Extension Attack)

Do sử dụng cấu trúc Merkle–Damgård, các hàm như MD5, SHA-1 và SHA-256 dễ bị ảnh hưởng bởi tấn công mở rộng độ dài: chỉ cần biết \( H(m) \) và độ dài của \( m \) (không cần biết nội dung \( m \)), kẻ tấn công có thể tính được \( H(m || \text{padding}(m) || m') \).

**Nguyên nhân**:
Giá trị băm đầu ra của Merkle–Damgård chính là trạng thái nội bộ cuối cùng của thuật toán. Kẻ tấn công có thể:
1. Khởi tạo trạng thái băm bằng đúng \( H(m) \).
2. Tiếp tục nén thêm phần dữ liệu \( m' \).
3. Thu được giá trị băm hợp lệ của \( m || \text{padding}(m) || m' \).

**Kịch bản tấn công minh họa**:
```
Legitimate: secret || message → H(secret || message)
Attacker sees: H(secret || message)
Attacker computes: H(secret || message || padding || malicious_data)
```

**Biện pháp phòng chống**:
- Sử dụng **HMAC** (Hash-based Message Authentication Code) thay vì ghép trực tiếp khóa bí mật với thông điệp:
  \[
  \text{HMAC}(K, m) = H((K \oplus \text{opad}) || H((K \oplus \text{ipad}) || m))
  \]
- Hoặc sử dụng **SHA-3** (dựa trên cấu trúc bọt biển — sponge construction, không dễ bị tấn công mở rộng độ dài).

---

## 5. Minh họa triển khai

### 5.1. Cài đặt SHA-256 bằng Python thuần

```python
import struct

def rotr(n, b, bits=32):
    """Rotate right"""
    return ((n >> b) | (n << (bits - b))) & ((1 << bits) - 1)

def shr(n, b):
    """Shift right"""
    return n >> b

class SHA256:
    # Initial hash values (first 32 bits of fractional parts of √primes)
    H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]
    
    # Round constants (first 32 bits of fractional parts of ∛primes)
    K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
    
    @staticmethod
    def Ch(x, y, z):
        """Choose: if x then y else z"""
        return (x & y) ^ (~x & z)
    
    @staticmethod
    def Maj(x, y, z):
        """Majority: vote of x, y, z"""
        return (x & y) ^ (x & z) ^ (y & z)
    
    @staticmethod
    def Sigma0(x):
        return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)
    
    @staticmethod
    def Sigma1(x):
        return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)
    
    @staticmethod
    def sigma0(x):
        return rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)
    
    @staticmethod
    def sigma1(x):
        return rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)
    
    @classmethod
    def hash(cls, message: bytes) -> str:
        """Compute SHA-256 hash of message"""
        # Preprocessing: Padding
        ml = len(message) * 8  # Message length in bits
        message += b'\x80'  # Append '1' bit
        
        # Append zeros until length ≡ 448 (mod 512)
        while (len(message) * 8) % 512 != 448:
            message += b'\x00'
        
        # Append original length as 64-bit big-endian integer
        message += struct.pack('>Q', ml)
        
        # Initialize hash values
        h0, h1, h2, h3, h4, h5, h6, h7 = cls.H
        
        # Process message in 512-bit chunks
        for chunk_start in range(0, len(message), 64):
            chunk = message[chunk_start:chunk_start + 64]
            
            # Create message schedule (W)
            w = list(struct.unpack('>16I', chunk)) + [0] * 48
            for i in range(16, 64):
                w[i] = (cls.sigma1(w[i-2]) + w[i-7] + 
                       cls.sigma0(w[i-15]) + w[i-16]) & 0xFFFFFFFF
            
            # Initialize working variables
            a, b, c, d, e, f, g, h = h0, h1, h2, h3, h4, h5, h6, h7
            
            # Main loop (64 rounds)
            for i in range(64):
                T1 = (h + cls.Sigma1(e) + cls.Ch(e, f, g) + 
                     cls.K[i] + w[i]) & 0xFFFFFFFF
                T2 = (cls.Sigma0(a) + cls.Maj(a, b, c)) & 0xFFFFFFFF
                
                h = g
                g = f
                f = e
                e = (d + T1) & 0xFFFFFFFF
                d = c
                c = b
                b = a
                a = (T1 + T2) & 0xFFFFFFFF
            
            # Add compressed chunk to hash values
            h0 = (h0 + a) & 0xFFFFFFFF
            h1 = (h1 + b) & 0xFFFFFFFF
            h2 = (h2 + c) & 0xFFFFFFFF
            h3 = (h3 + d) & 0xFFFFFFFF
            h4 = (h4 + e) & 0xFFFFFFFF
            h5 = (h5 + f) & 0xFFFFFFFF
            h6 = (h6 + g) & 0xFFFFFFFF
            h7 = (h7 + h) & 0xFFFFFFFF
        
        # Produce final hash value
        return ''.join(f'{h:08x}' for h in [h0, h1, h2, h3, h4, h5, h6, h7])

# Test
if __name__ == "__main__":
    test_vectors = [
        (b"", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
        (b"abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"),
        (b"The quick brown fox jumps over the lazy dog",
         "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"),
    ]
    
    print("=== SHA-256 Implementation Test ===\n")
    for message, expected in test_vectors:
        result = SHA256.hash(message)
        status = "✓" if result == expected else "✗"
        print(f"{status} Input: {message}")
        print(f"  Output: {result}")
        print(f"  Expect: {expected}\n")
```

### 5.2. Băm kép SHA-256 trong Bitcoin (Double SHA-256)

Bitcoin áp dụng **băm kép (double hashing)** nhằm tăng biên độ bảo mật và ngăn tấn công mở rộng độ dài:

```python
import hashlib

def double_sha256(data: bytes) -> bytes:
    """Bitcoin's double SHA-256"""
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

def hash256(data: bytes) -> str:
    """Bitcoin hash (double SHA-256, hex output)"""
    return double_sha256(data).hex()

# Example: Bitcoin block hash
block_header = bytes.fromhex(
    "01000000" +  # Version
    "0000000000000000000000000000000000000000000000000000000000000000" +  # Previous hash
    "3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a" +  # Merkle root
    "29ab5f49" +  # Timestamp
    "ffff001d" +  # Bits (difficulty)
    "1dac2b7c"    # Nonce
)

block_hash = hash256(block_header)
print(f"Bitcoin Block Hash: {block_hash}")
# Output: 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
# This is Bitcoin's Genesis Block!
```

**Lý do dùng băm kép**:
1. Ngăn chặn tấn công mở rộng độ dài (length extension attack).
2. Bổ sung biên độ bảo mật thận trọng.
3. Gây khó khăn hơn cho một số dạng phân tích mật mã lý thuyết.

### 5.3. Cài đặt cây Merkle

```python
from typing import List
import hashlib

def sha256(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def merkle_tree(transactions: List[bytes]) -> bytes:
    """
    Build Merkle tree and return root hash
    
    Example tree:
             Root
            /    \
          AB      CD
         /  \    /  \
        A    B  C    D
    """
    if len(transactions) == 0:
        return sha256(b'')
    
    # Level 0: Hash all transactions
    current_level = [sha256(tx) for tx in transactions]
    
    # Build tree bottom-up
    while len(current_level) > 1:
        next_level = []
        
        # Pair up hashes
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            
            # If odd number, duplicate last hash
            if i + 1 < len(current_level):
                right = current_level[i + 1]
            else:
                right = current_level[i]
            
            # Hash concatenation
            parent = sha256(left + right)
            next_level.append(parent)
        
        current_level = next_level
    
    return current_level[0]

def merkle_proof(transactions: List[bytes], index: int) -> List[tuple]:
    """
    Generate Merkle proof for transaction at index
    Returns list of (hash, is_left) tuples
    """
    if index >= len(transactions):
        raise ValueError("Index out of range")
    
    proof = []
    current_level = [sha256(tx) for tx in transactions]
    current_index = index
    
    while len(current_level) > 1:
        next_level = []
        
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else current_level[i]
            
            # If current transaction is in this pair
            if i == current_index or i + 1 == current_index:
                if i == current_index:
                    # Our node is left, sibling is right
                    proof.append((right, False))  # Sibling is on right
                else:
                    # Our node is right, sibling is left
                    proof.append((left, True))   # Sibling is on left
            
            next_level.append(sha256(left + right))
        
        current_index = current_index // 2
        current_level = next_level
    
    return proof

def verify_merkle_proof(transaction: bytes, proof: List[tuple], root: bytes) -> bool:
    """Verify Merkle proof"""
    current_hash = sha256(transaction)
    
    for sibling_hash, is_left in proof:
        if is_left:
            # Sibling is on left
            current_hash = sha256(sibling_hash + current_hash)
        else:
            # Sibling is on right
            current_hash = sha256(current_hash + sibling_hash)
    
    return current_hash == root

# Example usage
if __name__ == "__main__":
    print("=== Merkle Tree Example ===\n")
    
    # Create transactions
    transactions = [
        b"Alice -> Bob: 10 BTC",
        b"Bob -> Charlie: 5 BTC",
        b"Charlie -> David: 3 BTC",
        b"David -> Alice: 2 BTC"
    ]
    
    # Build Merkle tree
    root = merkle_tree(transactions)
    print(f"Merkle Root: {root.hex()}\n")
    
    # Generate proof for transaction 1
    tx_index = 1
    proof = merkle_proof(transactions, tx_index)
    
    print(f"Merkle Proof for transaction {tx_index}:")
    print(f"Transaction: {transactions[tx_index]}")
    print(f"Proof path ({len(proof)} hashes):")
    for i, (h, is_left) in enumerate(proof):
        position = "left" if is_left else "right"
        print(f"  {i+1}. {h.hex()[:16]}... (sibling on {position})")
    
    # Verify proof
    is_valid = verify_merkle_proof(transactions[tx_index], proof, root)
    print(f"\nProof verification: {'✓ Valid' if is_valid else '✗ Invalid'}")
    
    # Demonstrate efficiency
    print(f"\n=== Efficiency Comparison ===")
    print(f"Total transactions: {len(transactions)}")
    print(f"Full download: {len(transactions)} hashes ({len(transactions) * 32} bytes)")
    print(f"Merkle proof: {len(proof)} hashes ({len(proof) * 32} bytes)")
    print(f"Savings: {(1 - len(proof)/len(transactions)) * 100:.1f}%")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Va chạm hàm băm trong thực tế

Dù tính kháng va chạm rất quan trọng, lịch sử đã ghi nhận nhiều hàm băm phổ biến bị phá vỡ:

**Va chạm MD5 (2004)**:
```
Message 1: [binary data A]
Message 2: [binary data B] (different from A)
MD5(Message 1) = MD5(Message 2) = 79054025255fb1a26e4bc422aef54eb4
```
Kẻ tấn công có thể tạo hai tệp thực thi hoặc hai tệp PDF khác nhau nhưng có cùng giá trị băm MD5.

**Va chạm SHA-1 (2017 — SHAttered)**:
Nhóm nghiên cứu tại Google và CWI Amsterdam đã tạo thành công hai tệp PDF khác nhau có cùng giá trị băm SHA-1 với chi phí tính toán ước tính khoảng 110.000 USD (khoảng 9 tỷ tỷ phép tính).

**Hệ quả đối với blockchain**:
- SHA-256 của Bitcoin hiện vẫn an toàn và chưa có tấn công thực tế nào.
- Nếu SHA-256 bị phá vỡ nghiêm trọng, kẻ tấn công có thể làm giả cấu trúc khối hoặc khai thác chi tiêu gấp đôi, buộc toàn mạng phải di chuyển sang thuật toán mới.

**Chiến lược chuyển đổi (nếu SHA-256 suy yếu)**:
1. Thực hiện hard fork để chuyển sang hàm băm mới (như SHA-3 hoặc BLAKE3).
2. Nâng cấp toàn bộ các nút mạng.
3. Các block mới áp dụng thuật toán băm mới.
4. Các block lịch sử cũ vẫn được giữ nguyên theo mốc chuyển tiếp.

### 6.2. Nguy cơ từ máy tính lượng tử

**Thuật toán Grover** cho phép tìm kiếm trong không gian chưa sắp xếp có kích thước \( N \) với độ phức tạp \( O(\sqrt{N}) \).

Đối với bài toán tìm ngược tiền ảnh của SHA-256:
- Máy tính cổ điển: \( O(2^{256}) \) phép tính.
- Máy tính lượng tử (Grover): \( O(2^{128}) \) phép tính.

Tuy nhiên, \( 2^{128} \approx 3.4 \times 10^{38} \) vẫn là con số cực kỳ lớn, nên SHA-256 vẫn được đánh giá an toàn trước tấn công tìm tiền ảnh bằng máy tính lượng tử.

Đối với bài toán tìm va chạm, thuật toán lượng tử BHT (Brassard–Høyer–Tapp) có thể giảm độ phức tạp từ \( O(2^{n/2}) = O(2^{128}) \) xuống \( O(2^{n/3}) \approx O(2^{85.3}) \) (đòi hỏi đồng thời lượng bộ nhớ lượng tử tương ứng), nên chưa tạo thành mối đe dọa thực tiễn trong ngắn hạn.

**Hướng dự phòng dài hạn**:
- Sử dụng SHA-512 để tăng biên độ bảo mật hậu lượng tử.
- Tiếp tục nghiên cứu các hàm băm tối ưu cho kỷ nguyên hậu lượng tử.

### 6.3. Tập trung hóa sức mạnh băm (trong bối cảnh đào PoW)

Cơ chế PoW đòi hỏi tốc độ tính băm rất lớn, kéo theo sự chuyển dịch phần cứng đào Bitcoin qua các giai đoạn:
- **2009**: Đào bằng CPU (~10 MH/s mỗi máy).
- **2010**: Đào bằng GPU (~100 MH/s).
- **2013**: Đào bằng ASIC (~1.000 GH/s).
- **2024**: Máy đào ASIC hiện đại (~100 TH/s).

**Các lo ngại về tập trung hóa**:
- 4 nhóm đào (mining pool) lớn nhất kiểm soát hơn 50% tổng sức mạnh băm.
- Tập trung theo khu vực địa lý (trước đây tập trung mạnh ở Trung Quốc, nay dịch chuyển nhiều sang Mỹ và Kazakhstan).
- Các nhà sản xuất chip ASIC có lợi thế tiếp cận phần cứng sớm.

**Đánh đổi thiết kế**:
- **Ưu điểm của SHA-256**: Được kiểm chứng lâu dài, xác minh rất nhanh.
- **Nhược điểm của SHA-256**: Dễ tối ưu bằng mạch ASIC, dẫn đến xu hướng tập trung hóa phần cứng.
- **Giải pháp thay thế**: Các hàm đòi hỏi nhiều bộ nhớ (memory-hard) như Ethash hoặc RandomX nhằm hạn chế lợi thế của ASIC.

### 6.4. Đánh đổi giữa hiệu năng và bảo mật

| Hàm băm | Độ dài đầu ra | Tốc độ (chu kỳ/byte) | Mức độ an toàn | Ghi chú |
|---------------|-------------|---------------------|----------------|-------|
| MD5 | 128 bit | 4–5 | ⚠️ Đã bị phá vỡ | Đã tìm thấy va chạm |
| SHA-1 | 160 bit | 6–7 | ⚠️ Ngừng khuyến nghị | Đã tìm thấy va chạm (SHAttered) |
| SHA-256 | 256 bit | 7–8 | ✅ An toàn | Chuẩn của Bitcoin |
| SHA-512 | 512 bit | 6–7 | ✅ An toàn | Nhanh hơn trên kiến trúc 64-bit |
| SHA-3 (Keccak-256) | 256 bit | 9–10 | ✅ An toàn | Dùng trong Ethereum, cấu trúc khác SHA-2 |
| BLAKE2b | 512 bit | 3–4 | ✅ An toàn | Nhanh hơn SHA-3 |
| BLAKE3 | 256 bit | 2–3 | ✅ An toàn | Rất nhanh, hỗ trợ song song hóa |

Đối với blockchain, tốc độ xác minh rất quan trọng vì mọi nút đều phải kiểm tra dữ liệu, nhưng bảo mật luôn là ưu tiên hàng đầu. SHA-256 đạt được sự cân bằng tốt và đã qua thời gian kiểm chứng dài.

### 6.5. Đánh đổi về độ sâu cây Merkle

Kích thước bằng chứng Merkle tăng theo hàm logarit của số giao dịch \( n \):
- Độ sâu cây: \( \log_2 n \).
- Kích thước bằng chứng: \( \log_2 n \times 32 \) byte (mỗi giá trị băm dài 32 byte).

**Ví dụ**:
- 1.000 giao dịch: ~10 giá trị băm (320 byte).
- 10.000 giao dịch: ~14 giá trị băm (448 byte).
- 1.000.000 giao dịch: ~20 giá trị băm (640 byte).

Càng nhiều giao dịch trong một block thì đường dẫn bằng chứng càng dài, ảnh hưởng nhẹ đến băng thông của các nút nhẹ SPV. Trên mạng Bitcoin, mỗi block chứa khoảng 2.000–3.000 giao dịch, tương ứng khoảng 12 giá trị băm cho mỗi bằng chứng Merkle.

---

## 7. Các khái niệm liên quan

### 7.1. Hàm băm và Mã hóa (Encryption)

Hai khái niệm này thường bị nhầm lẫn nhưng có mục đích và cơ chế hoàn toàn khác nhau:

| Đặc điểm | Hàm băm (Hash Function) | Mã hóa (Encryption) |
|---------|--------------|------------|
| Chiều biến đổi | Một chiều | Hai chiều (mã hóa và giải mã) |
| Khóa | Không dùng khóa | Yêu cầu khóa |
| Kích thước đầu ra | Cố định | Thay đổi theo đầu vào |
| Mục đích chính | Kiểm tra toàn vẹn, tạo dấu vân tay | Bảo mật nội dung (Confidentiality) |
| Khả năng khôi phục | Không | Có (khi có khóa hợp lệ) |

**Ví dụ**:
```
Hash:      "password" → SHA256 → 5e88...9abc (không thể đảo ngược)
Encrypt:   "password" + key → AES → gH3k...2xYz (có thể giải mã bằng khóa)
```

### 7.2. Hàm băm mật mã và Mã kiểm tra tổng (Checksums)

**Mã kiểm tra tổng (Checksums)** (như CRC, Adler-32):
- Mục đích: Phát hiện lỗi ngẫu nhiên do hỏng dữ liệu hoặc nhiễu đường truyền.
- Không an toàn về mặt mật mã.
- Tính toán nhanh hơn và đầu ra ngắn hơn.

**Hàm băm mật mã (Cryptographic Hashes)**:
- Mục đích: Phát hiện hành vi sửa đổi có chủ ý.
- Chống lại các cuộc tấn công tạo va chạm có chủ đích.
- Tốc độ chậm hơn và đầu ra dài hơn.

**Ví dụ**:
```
CRC-32("data") = 0x12345678 (32 bits)
SHA-256("data") = 3a6eb079... (256 bits)

Attacker can easily find different message with same CRC.
Attacker cannot find different message with same SHA-256.
```

### 7.3. HMAC (Hash-based Message Authentication Code)

HMAC kết hợp hàm băm với một khóa bí mật dùng chung để xác thực thông điệp:

\[
\text{HMAC}(K, m) = H((K \oplus \text{opad}) || H((K \oplus \text{ipad}) || m))
\]

Trong đó:
- \( K \): Khóa bí mật.
- \( m \): Thông điệp.
- \( \text{ipad} \): Chuỗi đệm trong (lặp byte `0x36`).
- \( \text{opad} \): Chuỗi đệm ngoài (lặp byte `0x5c`).
- \( || \): Phép nối chuỗi.

**Tính chất**:
- Đảm bảo đồng thời tính xác thực và tính toàn vẹn.
- Yêu cầu hai bên chia sẻ chung khóa bí mật.
- Chống được tấn công mở rộng độ dài.

**Ứng dụng liên quan đến blockchain**:
- Xác thực API và bảo mật ví (chẳng hạn sinh khóa tất định), nhưng không dùng trực tiếp trong lớp đồng thuận (nơi cần chữ ký số bất đối xứng).

### 7.4. Lược đồ cam kết (Commitment Schemes)

Hàm băm cho phép xây dựng **lược đồ cam kết** — khóa chặt một giá trị mà chưa cần tiết lộ nội dung:

**Quy trình**:
1. Alice cam kết: gửi \( c = H(m || r) \) (với \( m \) là thông điệp và \( r \) là số ngẫu nhiên nonce).
2. Sau đó Alice mở cam kết: công bố \( m \) và \( r \).
3. Bob xác minh: kiểm tra lại \( H(m || r) = c \).

**Hai tính chất cơ bản**:
- **Tính ẩn (Hiding)**: Không thể suy ra \( m \) từ \( c \) (nhờ tính kháng tiền ảnh và số ngẫu nhiên \( r \)).
- **Tính ràng buộc (Binding)**: Không thể thay đổi \( m \) sau khi đã công bố \( c \) (nhờ tính kháng va chạm).

**Ứng dụng trong blockchain**:
- Bỏ phiếu theo cơ chế cam kết — tiết lộ (commit–reveal voting).
- Xổ số công bằng trên chuỗi.
- Hoán đổi nguyên tử (atomic swaps).

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"New Directions in Cryptography"** | 1976 | Diffie, Hellman | Công trình nền tảng mở ra mật mã học hiện đại |
| **"A Method for Obtaining Digital Signatures and Public-Key Cryptosystems"** | 1978 | Rivest, Shamir, Adleman | Đề xuất thuật toán RSA |
| **"One-Way Hash Functions"** | 1989 | Ralph Merkle | Hình thức hóa các tính chất của hàm băm một chiều |
| **"The MD5 Message-Digest Algorithm"** | 1992 | Ronald Rivest | Đặc tả thuật toán MD5 (nay đã bị phá vỡ) |
| **"Secure Hash Standard (SHS)"** | 2015 | NIST FIPS 180-4 | Đặc tả chuẩn chính thức của họ SHA-2 |
| **"The Keccak SHA-3 Submission"** | 2011 | Bertoni et al. | Thuật toán SHA-3 (Keccak) |
| **"BLAKE: A Hash Function"** | 2008 | Aumasson et al. | Họ hàm băm BLAKE |
| **"Collisions for Hash Functions MD4, MD5, HAVAL-128 and RIPEMD"** | 2004 | Xiaoyun Wang et al. | Công bố va chạm thực tế đầu tiên của MD5 |
| **"The first collision for full SHA-1"** | 2017 | Stevens et al. | Tấn công va chạm thực tế SHAttered trên SHA-1 |
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Ứng dụng hàm băm và cây Merkle trong blockchain |

**Tài liệu nên ưu tiên đọc**:
1. NIST FIPS 180-4: Đặc tả chuẩn cho họ SHA-2.
2. Đặc tả Keccak: Hiểu cấu trúc bọt biển của SHA-3.
3. Bài báo SHAttered: Tìm hiểu cách các hàm băm yếu bị tấn công trong thực tế.
4. Mục 4–5 của Whitepaper Bitcoin: Cách ứng dụng cây Merkle trong thực tiễn.

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Sơ đồ thuật toán SHA-256** | [NIST FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf) | Tài liệu chuẩn kèm sơ đồ chi tiết |
| **Minh họa hiệu ứng tuyết lở** | [Interactive SHA-256](https://sha256algorithm.com/) | Quan sát tác động khi đổi 1 bit đầu vào |
| **Cấu trúc cây Merkle** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/block_chain.html) | Minh họa theo cài đặt thực tế của Bitcoin |
| **So sánh hiệu năng hàm băm** | [Crypto++ Benchmarks](https://www.cryptopp.com/benchmarks.html) | Bảng đo tốc độ thực tế |
| **Minh họa tấn công va chạm** | [SHAttered.io](https://shattered.io/) | Trình diễn va chạm SHA-1 trên hai tệp PDF |
| **Nghịch lý ngày sinh** | [Better Explained - Birthday Paradox](https://betterexplained.com/articles/understanding-the-birthday-paradox/) | Diễn giải trực quan, dễ hiểu |

**Công cụ tương tác**:
- [Anders Brownworth - Hash Demo](https://andersbrownworth.com/blockchain/hash) — Thử nghiệm SHA-256 trực tiếp.
- [SHA-256 Visualizer](https://sha256algorithm.com/) — Minh họa từng bước của thuật toán SHA-256.
- [Merkle Tree Visualizer](https://blockchain-academy.hs-mittweida.de/merkle-tree/) — Công cụ dựng cây Merkle tương tác.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. Hàm băm là phép biến đổi một chiều: tính xuôi rất nhanh nhưng tính ngược bất khả thi.
2. Hàm băm mật mã cần thỏa mãn ba tính chất: kháng tiền ảnh, kháng va chạm và hiệu ứng tuyết lở.
3. SHA-256 là thành phần cốt lõi trong Bitcoin và nhiều hệ thống blockchain khác.

**Nền tảng kỹ thuật**:
- SHA-256: kiến trúc Merkle–Damgård, 64 vòng nén, đầu ra 256 bit.
- Kháng va chạm: theo nghịch lý ngày sinh cần khoảng \( 2^{128} \) phép thử.
- Kháng tiền ảnh: cần cỡ \( 2^{255} \)–\( 2^{256} \) phép thử, vượt xa giới hạn nhiệt động lực học.
- Cây Merkle: xác minh giao dịch với kích thước bằng chứng \( O(\log n) \).

**Ứng dụng trong blockchain**:
- Liên kết khối: mỗi block chứa giá trị băm của block liền trước.
- Xác minh giao dịch: cây Merkle hỗ trợ các nút nhẹ SPV.
- Proof-of-Work: quá trình đào tìm `nonce` sao cho giá trị băm nhỏ hơn ngưỡng `target`.
- Lược đồ cam kết: hỗ trợ các giao thức cam kết — tiết lộ.

**Lưu ý bảo mật**:
- SHA-256 vẫn an toàn dù MD5 và SHA-1 đã bị phá vỡ.
- Máy tính lượng tử làm giảm biên độ bảo mật nhưng chưa phá vỡ SHA-256.
- Cơ chế băm kép của Bitcoin giúp phòng chống tấn công mở rộng độ dài.

**Góc nhìn triển khai**:
- Có thể cài đặt thuần phần mềm (~7–8 chu kỳ CPU/byte) và tăng tốc bằng tập lệnh phần cứng SHA trên CPU hiện đại.
- Lựa chọn hàm băm luôn là sự cân bằng giữa tốc độ xử lý, mức độ an toàn và tính kháng ASIC.

**Điểm chốt**: Hàm băm mật mã đóng vai trò "chất kết dính số" giúp blockchain duy trì tính toàn vẹn, tính bất biến và khả năng xác minh hiệu quả trong môi trường không tin cậy lẫn nhau.

---

✅ **Kết thúc Lecture 00.02**

**Bài tiếp theo**: Lecture 00.03 - Chữ ký số và Mật mã khóa công khai

---

## Video tham khảo

- **Xem trước:** [SHA: Secure Hashing Algorithm - Computerphile](https://www.youtube.com/watch?v=DMtFhACPnTY) — Computerphile, tiếng Anh. Phân tích hàm nén và cấu trúc Merkle–Damgård; nên xem trước khi đọc chi tiết SHA-256 ở phần nền tảng kỹ thuật.
- [How secure is 256 bit security?](https://www.youtube.com/watch?v=S9JGmA5_unY) — 3Blue1Brown, tiếng Anh. Minh họa trực quan độ lớn của \( 2^{256} \) và lý do không thể dò ngược tiền ảnh SHA-256.
- [Merkle Tree | Merkle Root | Blockchain](https://www.youtube.com/watch?v=fB41w3JcR7U) — Telusko, tiếng Anh. Cách dựng Merkle root từ các lá giao dịch, phù hợp để đối chiếu với phần cây Merkle và nút nhẹ trong bài.

## References

1. National Institute of Standards and Technology (NIST). (2015). *FIPS 180-4: Secure Hash Standard (SHS)*.
2. Bertoni, G., Daemen, J., Peeters, M., & Van Assche, G. (2011). *The Keccak SHA-3 submission*.
3. Stevens, M., Bursztein, E., Karpman, P., Albertini, A., & Markov, Y. (2017). *The first collision for full SHA-1*. CRYPTO 2017.
4. Merkle, R. C. (1989). *One way hash functions and DES*. CRYPTO'89.
5. Aumasson, J. P., Henzen, L., Meier, W., & Phan, R. C. W. (2008). *SHA-3 proposal BLAKE*. Submission to NIST.
6. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.
