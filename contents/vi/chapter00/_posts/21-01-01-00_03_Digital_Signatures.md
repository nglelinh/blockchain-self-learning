---
layout: post
title: "Lecture 00.03: Digital Signatures và Public-Key Cryptography"
chapter: '00'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Digital Signatures và Public-Key Cryptography

Nếu hàm băm giúp ta chắc chắn một bức thư không bị tẩy xóa trên đường đi, thì một câu hỏi hóc búa khác vẫn còn nguyên: *làm sao biết chắc bức thư chuyển 10 BTC kia thực sự do Alice ký, chứ không phải do một tin tặc nào đó giả danh Alice viết ra?* Trên một mạng lưới mở nơi mọi người đều có thể nhìn thấy toàn bộ dữ liệu giao dịch, bạn không thể dùng "mật khẩu chung" như ngân hàng truyền thống — vì hễ công bố mật khẩu để mạng lưới kiểm tra thì ai cũng sẽ biết và đánh cắp tiền của bạn!

Lời giải thiên tài của mật mã học hiện đại (Diffie–Hellman 1976, Rivest–Shamir–Adleman 1977, và mật mã đường cong elliptic của Koblitz–Miller 1985) là **mật mã khóa công khai (public-key cryptography)** và **chữ ký số**: tách riêng một **khóa bí mật** (giữ kín tuyệt đối để ký) và một **khóa công khai** (phát rộng rãi cho cả thế giới xác minh). Trên blockchain, "sở hữu tiền" thực chất không có nghĩa là giữ đồng xu nào trong máy — mà đơn giản là **nắm giữ khóa bí mật tạo ra chữ ký số hợp lệ**.

---

## Bản đồ kiến thức nền: Mật mã khóa công khai và Chữ ký số đứng trên ba trụ cột toán học nào?

Với nền tảng số học đồng dư và đại số trừu tượng bậc đại học, bạn có thể nhìn thấu cơ chế của chữ ký số qua ba trụ cột:

### 1. Lý thuyết số đồng dư và Hàm cửa sập (RSA)
Phép nhân hai số nguyên tố lớn $$p \times q = n$$ chỉ mất vài micro giây, nhưng bài toán ngược lại — phân tích $$n$$ (cỡ 2048 bit) ra thừa số nguyên tố $$p, q$$ — hiện chưa có thuật toán cổ điển nào giải nhanh. Nhờ định lý Euler $$a^{\varphi(n)} \equiv 1 \pmod n$$, người biết $$p, q$$ dễ dàng tính khóa nghịch đảo $$d \equiv e^{-1} \pmod{\varphi(n)}$$ để ký, trong khi cả thế giới chỉ cần biết $$(e, n)$$ để kiểm tra.

### 2. Hình học đại số hữu hạn và Bài toán Logarit rời rạc trên Đường cong Elliptic (ECC / ECDSA / Schnorr)
Khóa RSA 3072-bit khá cồng kềnh cho blockchain. Bitcoin và Ethereum dùng **mật mã đường cong elliptic** (như `secp256k1`: $$y^2 \equiv x^3 + 7 \pmod p$$): các điểm trên đường cong lập thành một nhóm abel dưới phép cộng hình học (nối dây cung rồi lấy đối xứng). Tính $$Q = d \cdot G$$ (cộng điểm sinh $$G$$ với chính nó $$d$$ lần bằng nhân đôi–cộng) cực nhanh, nhưng biết $$G$$ và $$Q$$ mà tìm ngược ra số bí mật $$d$$ (**ECDLP**) khó đến mức khóa ECC 256-bit đạt độ an toàn ngang ngửa RSA 3072-bit!

### 3. Tính ngẫu nhiên của Nonce $$k$$ và Bảo mật thực thi
Trong ECDSA và Schnorr, mỗi chữ ký phải trộn thêm một số ngẫu nhiên dùng một lần gọi là **nonce $$k$$**. Toán học của sơ đồ cực kỳ sắc bén, nhưng chỉ cần một lỗi kỹ thuật nhỏ — **dùng lại cùng một giá trị $$k$$ cho hai thông điệp khác nhau** — khóa bí mật $$d$$ lập tức bị giải ra bằng đúng một phép trừ sơ cấp! (Đây chính là nguyên nhân khiến hệ máy PlayStation 3 và nhiều ví Bitcoin đời đầu bị bẻ khóa hoàn toàn.)

---

### Khung giải thích: tự tay ký và xác minh RSA mini, rồi phá khóa ECDSA khi tái sử dụng nonce (nên đọc chậm)

Hãy tự tay thực hiện hai phép tính kinh điển để hiểu sâu bản chất toán học của chữ ký số:

1. **Tự tay ký & xác minh chữ ký RSA mini ($$p = 5,\ q = 11$$):**
   - **Tạo khóa:** Tính $$n = p \cdot q = 55$$ và $$\varphi(n) = (5-1)(11-1) = 40$$. Chọn số mũ công khai $$e = 3$$ (vì $$\gcd(3, 40) = 1$$). Tìm khóa bí mật $$d$$ sao cho $$3d \equiv 1 \pmod{40}$$: thử ngay $$d = 27$$ vì $$3 \times 27 = 81 = 2 \times 40 + 1 \equiv 1 \pmod{40}$$!
   - **Alice ký thông điệp có mã băm $$m = 2$$:** Tính chữ ký $$s = m^d \bmod n = 2^{27} \bmod 55$$. Nhẩm nhanh:
     $$
     2^5 = 32,\quad 2^{10} = 1024 \equiv 34 \pmod{55},\quad 2^{20} \equiv 34^2 = 1156 \equiv 1 \pmod{55} \quad (\text{vì } 55 \times 21 = 1155!).
     $$
     Do đó $$s = 2^{20} \cdot 2^7 \equiv 1 \cdot 128 \equiv 18 \pmod{55}$$. Alice gửi cặp $$(m = 2,\ s = 18)$$.
   - **Mạng lưới xác minh bằng khóa công khai $$(e = 3,\ n = 55)$$:** Tính $$s^e \bmod n = 18^3 \bmod 55$$:
     $$
     18^2 = 324 \equiv -6 \pmod{55} \implies 18^3 \equiv (-6)\cdot 18 = -108 \equiv 2 \pmod{55} = m!
     $$
     Khớp chính xác $$2 = 2$$ mà không hề biết $$d = 27$$!
2. **Vì sao tái sử dụng nonce $$k$$ trong ECDSA lập tức làm lộ khóa bí mật $$d$$?** Trong ECDSA, chữ ký $$(r, s)$$ của thông điệp có mã băm $$z$$ thỏa $$s \equiv k^{-1}(z + r d) \pmod q$$ (với $$r$$ chỉ phụ thuộc vào $$k$$). Nếu Alice ký hai giao dịch $$z_1 \neq z_2$$ bằng **cùng một nonce $$k$$**, hai chữ ký $$(r, s_1)$$ và $$(r, s_2)$$ sẽ có **cùng tọa độ $$r$$**! Kẻ tấn công lập tức trừ hai phương trình:
   $$
   s_1 - s_2 \equiv k^{-1}(z_1 - z_2) \pmod q \implies k \equiv (z_1 - z_2)(s_1 - s_2)^{-1} \pmod q.
   $$
   Biết $$k$$ rồi, thay ngược vào phương trình đầu thu ngay khóa bí mật:
   $$
   d \equiv r^{-1}(s_1 k - z_1) \pmod q!
   $$
   Đó là lý do chuẩn **RFC 6979** (sinh nonce $$k$$ tất định từ hàm băm của khóa bí mật và thông điệp) là bắt buộc trong mọi ví tiền mã hóa hiện đại!

---

## 1. Tổng quan về khái niệm

Ở bài giảng trước, chúng ta đã tìm hiểu hàm băm — công cụ giúp kiểm tra tính toàn vẹn của dữ liệu. Tuy nhiên, riêng hàm băm không thể chứng minh **tính xác thực nguồn gốc (authenticity)**: làm thế nào biết chắc ai là người tạo ra thông điệp đó? **Chữ ký số (digital signatures)** ra đời để giải quyết bài toán này.

Trong blockchain, chữ ký số đóng vai trò tương tự chữ ký tay ngoài đời thực nhưng vượt trội hơn về tính bảo mật và khả năng tự động hóa:

**Chữ ký tay truyền thống**:
- Có thể bị làm giả nếu người khác tập bắt chước.
- Có thể sao chép hình ảnh chữ ký từ tài liệu này sang tài liệu khác.
- Không thể xác minh tự động bằng toán học.
- Hình dạng chữ ký gần như giống nhau trên mọi văn bản.

**Chữ ký số (Digital Signature)**:
- Bất khả thi về mặt tính toán để giả mạo nếu không có khóa bí mật.
- Gắn chặt và duy nhất với từng thông điệp (không thể cắt dán sang thông điệp khác).
- Bất kỳ ai cũng có thể xác minh tự động bằng khóa công khai.
- Dựa trên các chứng minh toán học chặt chẽ.

Chữ ký số trong blockchain đảm bảo ba tính chất cơ bản:
1. **Xác thực (Authentication)**: Chứng minh thông điệp do chính chủ sở hữu khóa bí mật tương ứng tạo ra.
2. **Không thể chối bỏ (Non-repudiation)**: Người ký không thể phủ nhận việc mình đã ký vào thông điệp.
3. **Toàn vẹn (Integrity)**: Đảm bảo thông điệp không bị chỉnh sửa sau thời điểm ký.

Trong Bitcoin và phần lớn các mạng blockchain, chữ ký số được dùng để:
- **Ủy quyền giao dịch**: Chứng minh người gửi có quyền chi tiêu số tiền tương ứng.
- **Chứng minh quyền sở hữu**: Địa chỉ ví được sinh ra từ khóa công khai.
- **Ngăn chặn chi tiêu trái phép**: Mỗi giao dịch hợp lệ gắn với chữ ký riêng biệt cho từng đầu vào.
- **Kích hoạt hợp đồng thông minh**: Chữ ký xác nhận lệnh gọi thực thi hợp đồng.

Nền tảng của chữ ký số là **mật mã khóa công khai (public-key cryptography)** hay **mật mã bất đối xứng (asymmetric cryptography)**, do Whitfield Diffie và Martin Hellman giới thiệu năm 1976, tạo ra bước ngoặt cho bài toán truyền tin an toàn qua kênh không tin cậy.

**Mật mã đối xứng (Symmetric Cryptography)**:
- Dùng chung một khóa để mã hóa và giải mã.
- Hạn chế lớn: khó trao đổi khóa dùng chung một cách an toàn qua mạng công cộng.

```
Alice ─────[shared key]────► Encrypt ────► Internet ────► Decrypt ─────[shared key]────► Bob
```

**Mật mã bất đối xứng (Asymmetric Cryptography)**:
- Gồm cặp hai khóa: khóa công khai (public key — có thể chia sẻ rộng rãi) và khóa bí mật (private key — giữ tuyệt đối kín).
- Trong mã hóa: mã hóa bằng khóa công khai, giải mã bằng khóa bí mật.
- Trong chữ ký số: ký bằng khóa bí mật, xác minh bằng khóa công khai.

```
Alice                                                                     Bob
┌───────────────┐                                              ┌───────────────┐
│ Private Key A │                                              │ Private Key B │
│ Public Key A  │                                              │ Public Key B  │
└───────────────┘                                              └───────────────┘
      │                                                                │
      │ Sign with Private Key A                                       │
      └──► Message + Signature ───────► Internet ───────────────────► │
                                                                       │
                                              Verify with Public Key A ◄┘
                                              ✓ Authentic!
```

Bitcoin chủ yếu sử dụng thuật toán **ECDSA** (Elliptic Curve Digital Signature Algorithm) trên đường cong **secp256k1**, và Ethereum cũng áp dụng ECDSA với một số điều chỉnh kỹ thuật. Các giao thức mới hơn mở rộng sang **chữ ký Schnorr** (trong bản nâng cấp Taproot của Bitcoin) và **EdDSA** (đường cong Ed25519 trong Cardano, Polkadot).

---

## 2. Hiểu biết trực quan

### 2.1. Phép ví về cặp khóa

Có thể hình dung cặp khóa công khai — khóa bí mật giống như một **hòm thư có khe thả thư**:

- **Khóa công khai = Địa chỉ nhà và khe thả thư**: Ai cũng có thể biết địa chỉ và thả thư vào bên trong, nhưng không thể lấy thư ra.
- **Khóa bí mật = Chìa khóa mở hòm thư**: Chỉ riêng bạn giữ chìa khóa để mở hòm và đọc thư; nếu mất chìa khóa, bạn mất quyền truy cập vĩnh viễn.

Tương tự, **chữ ký số** giống như **con dấu sáp mang gia huy riêng**:
- Thời trung cổ, các bức thư quan trọng được niêm phong bằng sáp và đóng con dấu riêng.
- Ai cũng có thể kiểm tra hình dấu để xác nhận nguồn gốc (xác minh công khai), nhưng chỉ chủ nhân mới có con dấu để đóng (ký bí mật).
- Mọi hành vi mở hoặc sửa nội dung thư đều làm hỏng niêm phong.

### 2.2. Quy trình ký và xác minh (rút gọn)

**Quá trình ký (Signing)**:
```
Message: "Alice sends 10 BTC to Bob"
                    ↓
              [Hash Function]
                    ↓
              Message Digest
                    ↓
        [Sign with Alice's Private Key]
                    ↓
              Digital Signature
```

**Quá trình xác minh (Verification)** (minh họa trực giác theo cơ chế đối chiếu bản băm; với ECDSA thực tế, bước xác minh kiểm tra một đẳng thức toán học trên đường cong elliptic dùng khóa công khai, chữ ký và bản băm):
```
Message + Signature
        ↓
[Hash the Message] ──────────► Digest 1
        
Signature + Alice's Public Key
        ↓
[Verify with Alice's Public Key] ──► Valid / Invalid
        
Check consistency with Digest 1:
    ✓ Yes → Signature valid, message authentic
    ✗ No  → Signature invalid or message tampered
```

**Điểm quan trọng**: Ta luôn ký trên *giá trị băm* thay vì toàn bộ thông điệp gốc, vì:
1. **Hiệu quả**: Kích thước chữ ký cố định, không phụ thuộc độ dài thông điệp.
2. **Bảo mật**: Hàm băm chuẩn hóa đầu vào về độ dài cố định cho thuật toán ký.

### 2.3. Phép ví với giao dịch Bitcoin

Một giao dịch Bitcoin có thể so sánh với **tờ séc (check)**:

**Séc giấy**:
```
Pay to: Bob
Amount: $100
From: Alice
Signature: [Alice's handwritten signature]
```

**Giao dịch Bitcoin**:
```
Pay to: Bob's address (derived from his public key)
Amount: 10 BTC
From: UTXO controlled by Alice's address
Signature: Digital signature created with Alice's private key
```

**Điểm khác biệt**:
- Với séc giấy, ngân hàng đối chiếu chữ ký bằng mắt với mẫu chữ ký đã lưu; với Bitcoin, mọi nút mạng đều xác minh được bằng toán học thông qua khóa công khai.
- Séc giấy có thể bị lợi dụng để rút nhiều lần nếu kiểm soát kém; trong Bitcoin, mỗi giao dịch tham chiếu đến một đầu ra chưa tiêu (UTXO) cụ thể nên ngăn chặn việc chi tiêu lặp.

---

## 3. Nền tảng kỹ thuật

### 3.1. Cơ sở của mật mã khóa công khai

Quá trình sinh khóa tạo ra cặp `(khóa công khai, khóa bí mật)` sao cho hai khóa có quan hệ toán học chặt chẽ nhưng không thể suy ngược khóa bí mật từ khóa công khai.

Nền tảng của thiết kế này là **hàm cửa sập (trapdoor functions)** — các hàm dễ tính theo chiều xuôi nhưng rất khó đảo ngược trừ khi nắm thông tin bí mật ("cửa sập").

- **Ví dụ cửa sập RSA**:
  - Dễ: Nhân hai số nguyên tố lớn \( N = p \times q \).
  - Khó: Phân tích \( N \) ngược lại thành thừa số nguyên tố \( p \) và \( q \).
  - Thông tin bí mật: Biết trước \( p \) và \( q \).

- **Ví dụ cửa sập đường cong Elliptic**:
  - Dễ: Phép nhân vô hướng \( Q = k \times G \) (với \( Q \) là điểm kết quả, \( k \) là số nguyên, \( G \) là điểm sinh).
  - Khó: Bài toán logarit rời rạc trên đường cong elliptic (ECDLP) — cho biết \( Q \) và \( G \), tìm \( k \).
  - Thông tin bí mật: Giá trị \( k \) (khóa bí mật).

### 3.2. Mật mã đường cong Elliptic (ECC)

Bitcoin và Ethereum dùng **ECDSA** thay vì RSA nhờ kích thước khóa ngắn hơn ở cùng mức độ an toàn, tính toán nhanh hơn và tiết kiệm băng thông lưu trữ.

**So sánh độ dài khóa ở cùng mức bảo mật**:

| Mật mã đối xứng | RSA | ECC | Mức bảo mật |
|-----------|-----|-----|----------------|
| 80 bit | 1024 bit | 160 bit | Yếu (đã lỗi thời) |
| 128 bit | 3072 bit | 256 bit | Mạnh |
| 256 bit | 15360 bit | 512 bit | Rất mạnh |

**Định nghĩa đường cong Elliptic**:

Một đường cong elliptic trên trường hữu hạn \( \mathbb{F}_p \) có phương trình:

\[
y^2 \equiv x^3 + ax + b \pmod{p}
\]

với điều kiện không suy biến \( 4a^3 + 27b^2 \not\equiv 0 \pmod{p} \).

**Tham số đường cong `secp256k1` của Bitcoin**:
```
Equation: y² = x³ + 7  (a=0, b=7)
Prime: p = 2²⁵⁶ - 2³² - 2⁹ - 2⁸ - 2⁷ - 2⁶ - 2⁴ - 1
       = FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF 
         FFFFFFFF FFFFFFFF FFFFFFFE FFFFFC2F (hex)

Generator Point G:
  Gx = 79BE667E F9DCBBAC 55A06295 CE870B07
       029BFCDB 2DCE28D9 59F2815B 16F81798
  Gy = 483ADA77 26A3C465 5DA4FBFC 0E1108A8
       FD17B448 A6855419 9C47D08F FB10D4B8

Order (number of points): 
  n = FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE
      BAAEDCE6 AF48A03B BFD25E8C D0364141
```

**Phép cộng điểm (góc nhìn hình học)**:
- Cho hai điểm \( P \) và \( Q \) trên đường cong.
- Vẽ đường thẳng đi qua \( P \) và \( Q \), cắt đường cong tại điểm thứ ba \( R' \).
- Lấy đối xứng \( R' \) qua trục hoành \( x \) để thu được điểm tổng \( R = P + Q \).

```
       y
       │
       │    Q
       │   /│\
       │  / │ \
       │ /  │  \
       │/   │   \
  ─────┼────┼────┼───── x
       │\   P   /
       │ \     /R'
       │  \   /
       │   \ /
       │    R (reflected)
```

**Phép nhân vô hướng (Scalar Multiplication)**:
\[
Q = k \times G = \underbrace{G + G + \cdots + G}_{k \text{ times}}
\]

Trong thực tế, phép tính này dùng thuật toán **nhân đôi và cộng (double-and-add)** (tương tự lũy thừa nhị phân) để đạt độ phức tạp \( O(\log k) \):

```
Private key: k = 7
Public key:  Q = 7×G = G + G + G + G + G + G + G

Using double-and-add:
7 = 111₂ (binary)
Q = 2²×G + 2¹×G + 2⁰×G = 4G + 2G + G
```

### 3.3. Lược đồ chữ ký ECDSA

**Sinh khóa (Key Generation)**:
1. Chọn ngẫu nhiên khóa bí mật \( d_A \in [1, n-1] \).
2. Tính khóa công khai \( Q_A = d_A \times G \).

**Ký thông điệp \( m \) (Signing)**:
1. Tính giá trị băm \( e = \text{HASH}(m) \).
2. Chọn số ngẫu nhiên \( k \in [1, n-1] \) (**bắt buộc phải duy nhất cho mỗi lần ký**).
3. Tính điểm \( (x_1, y_1) = k \times G \).
4. Tính \( r = x_1 \mod n \). Nếu \( r = 0 \), quay lại bước 2.
5. Tính \( s = k^{-1}(e + rd_A) \mod n \). Nếu \( s = 0 \), quay lại bước 2.
6. Chữ ký là cặp \( (r, s) \).

**Xác minh (Verification)** với thông điệp \( m \), chữ ký \( (r, s) \) và khóa công khai \( Q_A \):
1. Kiểm tra \( r, s \in [1, n-1] \).
2. Tính giá trị băm \( e = \text{HASH}(m) \).
3. Tính \( w = s^{-1} \mod n \).
4. Tính \( u_1 = ew \mod n \) và \( u_2 = rw \mod n \).
5. Tính điểm \( (x_1, y_1) = u_1 \times G + u_2 \times Q_A \).
6. Chữ ký hợp lệ nếu \( r \equiv x_1 \pmod{n} \).

**Chứng minh tính đúng đắn**:

Từ bước ký:
\[
s = k^{-1}(e + rd_A) \implies k = s^{-1}(e + rd_A)
\]

Thay vào biểu thức xác minh:
\[
\begin{align}
u_1 \times G + u_2 \times Q_A &= ew \times G + rw \times Q_A \\
&= es^{-1} \times G + rs^{-1} \times d_A \times G \\
&= s^{-1}(e + rd_A) \times G \\
&= k \times G
\end{align}
\]

Do \( k \times G = (x_1, y_1) \) từ lúc ký, bước xác minh thu lại đúng cùng một điểm, do đó \( r \equiv x_1 \pmod{n} \) ✓.

### 3.4. Quy trình sinh địa chỉ Bitcoin

Địa chỉ Bitcoin không dùng trực tiếp khóa công khai thô mà được tạo qua chuỗi băm và mã hóa:

```
Private Key (256 bits random)
      ↓
   [ECDSA secp256k1]
      ↓
Public Key (uncompressed: 65 bytes)
      ↓
   [SHA-256]
      ↓
   [RIPEMD-160]
      ↓
Public Key Hash (20 bytes)
      ↓
   [Add version byte (0x00 for mainnet)]
      ↓
   [Double SHA-256 for checksum (first 4 bytes)]
      ↓
   [Base58 encoding]
      ↓
Bitcoin Address (starts with '1' for P2PKH)
```

**Ví dụ**:
```
Private Key: 
  18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725

Public Key (uncompressed):
  04 50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
     2cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6

Public Key Hash (RIPEMD-160 of SHA-256):
  010966776006953d5567439e5e39f86a0d273bee

Bitcoin Address:
  16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM
```

**Lý do băm khóa công khai trước khi tạo địa chỉ**:
1. **Địa chỉ ngắn gọn hơn**: 160 bit thay vì 256–512 bit.
2. **Tăng lớp phòng vệ hậu lượng tử**: Khóa công khai chỉ lộ ra khi chi tiêu lần đầu; trước đó kẻ tấn công chỉ thấy giá trị băm.
3. **Linh hoạt về nâng cấp**: Dễ dàng hỗ trợ các lược đồ chữ ký khác nhau.

---

## 4. Công thức toán học và mật mã học

### 4.1. Phân tích bảo mật của ECDSA

Độ an toàn của ECDSA dựa vào độ khó của **bài toán logarit rời rạc (DLP)**: cho \( Q = k \times G \), tìm \( k \).

Thuật toán tấn công cổ điển tốt nhất hiện biết là **Pollard's rho** với độ phức tạp \( O(\sqrt{n}) \), tức \( O(2^{128}) \) phép tính đối với đường cong 256 bit. Do đó, `secp256k1` cung cấp mức bảo mật tương đương 128 bit:

\[
\text{Security bits} = \frac{\text{Key size}}{2} = \frac{256}{2} = 128
\]

So sánh nhanh:
- AES-128: mức bảo mật 128 bit.
- RSA-2048: mức bảo mật ~112 bit.
- secp256k1: mức bảo mật ~128 bit.

### 4.2. Tấn công tái sử dụng Nonce (Nonce Reuse Attack)

**Quy tắc an toàn tuyệt đối**: KHÔNG BAO GIỜ dùng lại cùng một giá trị `nonce` \( k \) cho hai chữ ký khác nhau.

**Kịch bản tấn công**:

Giả sử kẻ tấn công thu được hai chữ ký tạo từ cùng một `nonce` \( k \):
- Chữ ký 1: \( (r, s_1) \) cho thông điệp \( m_1 \).
- Chữ ký 2: \( (r, s_2) \) cho thông điệp \( m_2 \) (cùng giá trị \( r \) là dấu hiệu rõ ràng cho thấy \( k \) đã bị dùng lại).

Từ phương trình ký:
\[
\begin{align}
s_1 &= k^{-1}(e_1 + rd_A) \mod n \\
s_2 &= k^{-1}(e_2 + rd_A) \mod n
\end{align}
\]

Trừ vế theo vế:
\[
s_1 - s_2 = k^{-1}(e_1 - e_2) \mod n
\]

Suy ra ngay \( k \):
\[
k = \frac{e_1 - e_2}{s_1 - s_2} \mod n
\]

Khi đã biết \( k \), kẻ tấn công khôi phục trực tiếp khóa bí mật \( d_A \):
\[
d_A = \frac{sk - e}{r} \mod n
\]

**Sự cố thực tế**: Vụ lộ khóa Sony PlayStation 3 năm 2010 xảy ra do Sony dùng cố định một giá trị \( k \) cho nhiều chữ ký firmware, khiến tin tặc khôi phục được khóa bí mật và ký được mã tùy ý.

**Biện pháp bảo vệ trong Bitcoin**:
Sử dụng `nonce` tất định theo chuẩn **RFC 6979**: \( k = \text{HMAC-SHA256}(d_A, e) \) (về nguyên lý), đảm bảo \( k \) vừa duy nhất cho từng thông điệp vừa không phụ thuộc vào bộ sinh số ngẫu nhiên yếu.

### 4.3. Tính khả biến của chữ ký (Signature Malleability)

ECDSA có đặc tính: nếu \( (r, s) \) là chữ ký hợp lệ thì \( (r, -s \mod n) \) cũng là một chữ ký hợp lệ cho cùng thông điệp.

**Nguyên nhân**:
Bước xác minh chỉ kiểm tra hoành độ \( r \stackrel{?}{=} x_1 \) với \( (x_1, y_1) = u_1 G + u_2 Q_A \). Vì đường cong elliptic đối xứng qua trục \( x \), hai điểm \( (x, y) \) và \( (x, -y) \) có cùng hoành độ \( x \).

**Hệ quả**:
- Cùng một giao dịch có thể tạo ra các mã định danh giao dịch (TXID) khác nhau nếu có bên thứ ba thay \( s \) bằng \( n - s \).
- Dù không cho phép đánh cắp tiền trực tiếp, hiện tượng này từng gây lỗi theo dõi giao dịch ở nhiều ví và sàn giao dịch.

**Giải pháp của Bitcoin (BIP 62, BIP 66)**:
Yêu cầu sử dụng giá trị \( s \) thấp (\( s \leq n/2 \)) và từ chối chữ ký có \( s \) cao nhằm chuẩn hóa chữ ký duy nhất.

**Cải tiến triệt để hơn — Chữ ký Schnorr (Bitcoin Taproot)**:
Không bị khả biến, kích thước nhỏ gọn, hỗ trợ xác minh theo lô (batch verification) và cải thiện quyền riêng tư.

### 4.4. Nguy cơ máy tính lượng tử đối với ECDSA

**Thuật toán Shor** trên máy tính lượng tử có thể giải bài toán logarit rời rạc trong thời gian đa thức:

\[
\text{Classical: } O(\sqrt{n}) \quad \text{vs} \quad \text{Quantum: } O((\log n)^3)
\]

Nếu máy tính lượng tử quy mô lớn xuất hiện, nó có thể suy ngược khóa bí mật từ khóa công khai. Các máy tính lượng tử hiện nay mới dừng ở mức khoảng hàng trăm qubit vật lý, trong khi phá vỡ ECDSA 256 bit ước tính cần khoảng 1.500–3.000 qubit logic (tương đương hàng triệu qubit vật lý), với mốc thời gian dự báo thường khoảng 10–30 năm.

**Lớp bảo vệ một phần của Bitcoin**:
Nếu một địa chỉ chưa từng chi tiêu, khóa công khai chưa lộ trên chuỗi — kẻ tấn công chỉ có giá trị băm khóa công khai (RIPEMD-160 của SHA-256).

**Các phương án mật mã hậu lượng tử**:
- **Dựa trên hàm băm**: SPHINCS+, XMSS.
- **Dựa trên mạng tinh thể (Lattice-based)**: Dilithium, Falcon.
- **Dựa trên mã sửa lỗi (Code-based)**: Classic McEliece.

### 4.5. Chữ ký ngưỡng và Đa chữ ký

**Đa chữ ký (Multi-Signature — MultiSig)**:
Yêu cầu \( m \) trên tổng số \( n \) chữ ký hợp lệ (ví dụ: 2-trên-3).

```
OP_2                           // Require 2 signatures
<PubKey1> <PubKey2> <PubKey3>  // 3 public keys
OP_3                           // From 3 total
OP_CHECKMULTISIG               // Verify
```

Nhược điểm của MultiSig truyền thống là kích thước giao dịch lớn (chứa nhiều chữ ký và khóa công khai), phí cao và làm lộ cấu trúc \( m \)-trên-\( n \) trên chuỗi.

**Chữ ký ngưỡng (Threshold Signatures — TSS)**:
Các bên chạy một giao thức mật mã tương tác để tạo ra **một chữ ký đơn duy nhất** từ \( m \)-trên-\( n \) thành viên. Kết quả trông giống hệt giao dịch đơn chữ ký, giúp giảm kích thước và bảo vệ quyền riêng tư tốt hơn, dù giao thức thiết lập phức tạp hơn.

**Ví dụ: Chữ ký ngưỡng Schnorr**:
\[
s = k + H(R, P, m) \cdot x
\]
Trong đó \( k \) là `nonce` tổng hợp, \( P \) là khóa công khai tổng hợp và \( x \) là khóa bí mật tổng hợp (không một cá nhân nào nắm toàn bộ \( x \)). Bên xác minh chỉ nhìn thấy một chữ ký thông thường.

---

## 5. Minh họa triển khai

### 5.1. Cài đặt ECDSA (Python)

```python
import hashlib
import secrets
from typing import Tuple

# Secp256k1 parameters
P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
G = (Gx, Gy)

def modinv(a: int, m: int) -> int:
    """Modular multiplicative inverse using Extended Euclidean Algorithm"""
    if a < 0:
        a = (a % m + m) % m
    g, x, _ = extended_gcd(a, m)
    if g != 1:
        raise Exception('Modular inverse does not exist')
    return x % m

def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """Extended Euclidean Algorithm"""
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y

def point_add(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
    """Add two points on elliptic curve"""
    if p1 is None:  # Identity element
        return p2
    if p2 is None:
        return p1
    
    x1, y1 = p1
    x2, y2 = p2
    
    if x1 == x2:
        if y1 == y2:
            # Point doubling
            s = (3 * x1 * x1 * modinv(2 * y1, P)) % P
        else:
            # Points are inverse of each other
            return None
    else:
        # Point addition
        s = ((y2 - y1) * modinv(x2 - x1, P)) % P
    
    x3 = (s * s - x1 - x2) % P
    y3 = (s * (x1 - x3) - y1) % P
    
    return (x3, y3)

def point_multiply(k: int, point: Tuple[int, int]) -> Tuple[int, int]:
    """Scalar multiplication using double-and-add algorithm"""
    if k == 0:
        return None
    if k == 1:
        return point
    
    result = None
    addend = point
    
    while k:
        if k & 1:
            result = point_add(result, addend)
        addend = point_add(addend, addend)
        k >>= 1
    
    return result

class ECDSA:
    @staticmethod
    def generate_keypair() -> Tuple[int, Tuple[int, int]]:
        """Generate private/public key pair"""
        # Private key: random number in [1, n-1]
        private_key = secrets.randbelow(N - 1) + 1
        
        # Public key: private_key * G
        public_key = point_multiply(private_key, G)
        
        return private_key, public_key
    
    @staticmethod
    def sign(message: bytes, private_key: int) -> Tuple[int, int]:
        """Sign message with private key"""
        # Hash message
        e = int.from_bytes(hashlib.sha256(message).digest(), 'big')
        
        while True:
            # Generate deterministic nonce (simplified RFC 6979)
            k = int.from_bytes(
                hashlib.sha256(
                    private_key.to_bytes(32, 'big') + message
                ).digest(),
                'big'
            ) % (N - 1) + 1
            
            # Compute r = (k * G).x mod n
            point = point_multiply(k, G)
            if point is None:
                continue
            r = point[0] % N
            if r == 0:
                continue
            
            # Compute s = k^(-1) * (e + r * private_key) mod n
            s = (modinv(k, N) * (e + r * private_key)) % N
            if s == 0:
                continue
            
            # Ensure low S (BIP 62)
            if s > N // 2:
                s = N - s
            
            return (r, s)
    
    @staticmethod
    def verify(message: bytes, signature: Tuple[int, int], 
               public_key: Tuple[int, int]) -> bool:
        """Verify signature"""
        r, s = signature
        
        # Check signature bounds
        if not (1 <= r < N and 1 <= s < N):
            return False
        
        # Hash message
        e = int.from_bytes(hashlib.sha256(message).digest(), 'big')
        
        # Compute w = s^(-1) mod n
        w = modinv(s, N)
        
        # Compute u1 = e * w mod n and u2 = r * w mod n
        u1 = (e * w) % N
        u2 = (r * w) % N
        
        # Compute point = u1 * G + u2 * public_key
        point1 = point_multiply(u1, G)
        point2 = point_multiply(u2, public_key)
        point = point_add(point1, point2)
        
        if point is None:
            return False
        
        # Verify r == point.x mod n
        return r == point[0] % N

# Example usage
if __name__ == "__main__":
    print("=== ECDSA Example ===\n")
    
    # Generate keys
    print("1. Generating key pair...")
    private_key, public_key = ECDSA.generate_keypair()
    print(f"Private key: {hex(private_key)[:70]}...")
    print(f"Public key:  ({hex(public_key[0])[:50]}...,")
    print(f"              {hex(public_key[1])[:50]}...)\n")
    
    # Sign message
    message = b"Alice sends 10 BTC to Bob"
    print(f"2. Signing message: {message.decode()}")
    signature = ECDSA.sign(message, private_key)
    print(f"Signature (r, s):")
    print(f"  r = {hex(signature[0])[:70]}...")
    print(f"  s = {hex(signature[1])[:70]}...\n")
    
    # Verify signature
    print("3. Verifying signature...")
    is_valid = ECDSA.verify(message, signature, public_key)
    print(f"Verification result: {'✓ Valid' if is_valid else '✗ Invalid'}\n")
    
    # Try tampering with message
    tampered_message = b"Alice sends 100 BTC to Bob"
    print(f"4. Verifying tampered message: {tampered_message.decode()}")
    is_valid_tampered = ECDSA.verify(tampered_message, signature, public_key)
    print(f"Verification result: {'✓ Valid' if is_valid_tampered else '✗ Invalid (Expected!)'}\n")
    
    # Demonstrate signature size
    print("5. Signature properties:")
    print(f"Message size: {len(message)} bytes")
    print(f"Signature size: 64 bytes (r: 32 bytes, s: 32 bytes)")
    print(f"Public key size: 64 bytes (uncompressed)")
    print(f"Compression: Can compress public key to 33 bytes")
```

### 5.2. Ký giao dịch Bitcoin

```python
import hashlib
from typing import List, Tuple

class BitcoinTransaction:
    def __init__(self):
        self.version = 1
        self.inputs: List[dict] = []
        self.outputs: List[dict] = []
        self.locktime = 0
    
    def add_input(self, prev_tx: str, prev_index: int, script_pubkey: bytes):
        """Add input to transaction"""
        self.inputs.append({
            'prev_tx': bytes.fromhex(prev_tx),
            'prev_index': prev_index,
            'script_pubkey': script_pubkey,  # For signing
            'script_sig': b'',  # Will be filled with signature
            'sequence': 0xFFFFFFFF
        })
    
    def add_output(self, amount: int, script_pubkey: bytes):
        """Add output to transaction"""
        self.outputs.append({
            'amount': amount,
            'script_pubkey': script_pubkey
        })
    
    def serialize_for_signature(self, input_index: int) -> bytes:
        """Serialize transaction for signing (SIGHASH_ALL)"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Number of inputs
        result += len(self.inputs).to_bytes(1, 'little')
        
        # Inputs
        for i, inp in enumerate(self.inputs):
            # Previous output
            result += inp['prev_tx'][::-1]  # Reverse for little-endian
            result += inp['prev_index'].to_bytes(4, 'little')
            
            # Script
            if i == input_index:
                # Include script_pubkey for the input being signed
                script = inp['script_pubkey']
                result += len(script).to_bytes(1, 'little')
                result += script
            else:
                # Empty script for other inputs
                result += b'\x00'
            
            # Sequence
            result += inp['sequence'].to_bytes(4, 'little')
        
        # Number of outputs
        result += len(self.outputs).to_bytes(1, 'little')
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            script = out['script_pubkey']
            result += len(script).to_bytes(1, 'little')
            result += script
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        # Hash type (SIGHASH_ALL)
        result += (1).to_bytes(4, 'little')
        
        return result
    
    def sign_input(self, input_index: int, private_key: int):
        """Sign specific input"""
        # Serialize for signing
        preimage = self.serialize_for_signature(input_index)
        
        # Double SHA-256
        sighash = hashlib.sha256(hashlib.sha256(preimage).digest()).digest()
        
        # Sign
        signature = ECDSA.sign(sighash, private_key)
        
        # Create DER-encoded signature + SIGHASH type
        signature_der = self.der_encode_signature(signature) + b'\x01'  # SIGHASH_ALL
        
        # Create scriptSig (signature + public key)
        public_key = point_multiply(private_key, G)
        pubkey_bytes = self.serialize_public_key(public_key)
        
        script_sig = (
            len(signature_der).to_bytes(1, 'little') + signature_der +
            len(pubkey_bytes).to_bytes(1, 'little') + pubkey_bytes
        )
        
        self.inputs[input_index]['script_sig'] = script_sig
    
    @staticmethod
    def der_encode_signature(signature: Tuple[int, int]) -> bytes:
        """DER encode ECDSA signature"""
        r, s = signature
        
        # Encode r
        r_bytes = r.to_bytes((r.bit_length() + 7) // 8, 'big')
        if r_bytes[0] & 0x80:  # Add 0x00 if high bit set
            r_bytes = b'\x00' + r_bytes
        
        # Encode s
        s_bytes = s.to_bytes((s.bit_length() + 7) // 8, 'big')
        if s_bytes[0] & 0x80:
            s_bytes = b'\x00' + s_bytes
        
        # DER structure: 0x30 [total-length] 0x02 [r-length] [r] 0x02 [s-length] [s]
        result = (
            b'\x02' + len(r_bytes).to_bytes(1, 'little') + r_bytes +
            b'\x02' + len(s_bytes).to_bytes(1, 'little') + s_bytes
        )
        result = b'\x30' + len(result).to_bytes(1, 'little') + result
        
        return result
    
    @staticmethod
    def serialize_public_key(public_key: Tuple[int, int], compressed=True) -> bytes:
        """Serialize public key"""
        x, y = public_key
        
        if compressed:
            # Compressed: 0x02 or 0x03 (depending on y parity) + x
            prefix = b'\x02' if y % 2 == 0 else b'\x03'
            return prefix + x.to_bytes(32, 'big')
        else:
            # Uncompressed: 0x04 + x + y
            return b'\x04' + x.to_bytes(32, 'big') + y.to_bytes(32, 'big')

# Example
if __name__ == "__main__":
    print("=== Bitcoin Transaction Signing Example ===\n")
    
    # Create transaction
    tx = BitcoinTransaction()
    
    # Add input (spending previous output)
    prev_tx_id = "a1b2c3d4" * 16  # 32-byte transaction ID
    tx.add_input(prev_tx_id, 0, b'\x76\xa9\x14' + b'\x00' * 20 + b'\x88\xac')  # P2PKH
    
    # Add outputs
    tx.add_output(1000000, b'\x76\xa9\x14' + b'\x11' * 20 + b'\x88\xac')  # To Bob
    tx.add_output(500000, b'\x76\xa9\x14' + b'\x22' * 20 + b'\x88\xac')   # Change
    
    # Sign
    private_key, _ = ECDSA.generate_keypair()
    tx.sign_input(0, private_key)
    
    print("Transaction signed successfully!")
    print(f"Input 0 scriptSig length: {len(tx.inputs[0]['script_sig'])} bytes")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Thách thức quản lý khóa

Trong hệ thống phi tập trung, mất khóa bí mật đồng nghĩa với mất quyền truy cập tài sản vĩnh viễn. Ước tính khoảng 3–4 triệu BTC (~20% tổng cung) đã bị thất lạc vĩnh viễn, phần lớn do mất khóa bí mật.

**Các giải pháp quản lý khóa**:
- **Ví phần cứng (Hardware wallets)**: Thiết bị chuyên dụng cô lập khóa bí mật như Ledger, Trezor.
- **Ví đa chữ ký (Multi-signature wallets)**: Phân tán quyền ký qua nhiều thiết bị hoặc nhiều người giữ khóa.
- **Khôi phục xã hội (Social recovery)**: Cho phép nhóm người tin cậy hỗ trợ khôi phục ví (như ví Argent).
- **Chia sẻ bí mật Shamir (Shamir's Secret Sharing)**: Chia khóa thành \( n \) mảnh, chỉ cần \( k \) mảnh để tái tạo lại khóa gốc.

**Đánh đổi giữa bảo mật và tiện lợi**:
```
Security ←────────────────────────────────────► Convenience

Hardware wallet        Software wallet        Exchange custodial
(Most secure)         (Medium)               (Least secure, most convenient)
```

### 6.2. So sánh các lược đồ chữ ký

| Lược đồ | Kích thước chữ ký | Tốc độ xác minh | Xác minh theo lô | Tính tuyến tính | Trạng thái ứng dụng |
|--------|---------------|--------------|--------------|-----------|--------|
| ECDSA | 64 byte | Trung bình | Không | Không | Bitcoin (truyền thống) |
| Schnorr | 64 byte | Nhanh | Có | Có | Bitcoin Taproot |
| EdDSA | 64 byte | Nhanh | Có | Không | Ed25519 (nhiều chuỗi khác) |
| BLS | 48 byte (G1) | Chậm | Có | Có | Ethereum 2.0 |
| Chữ ký gộp | ~48–64 byte cho cả nhóm | Nhanh | Tích hợp sẵn | Có | Hướng phát triển tiếp theo |

**Hạn chế của ECDSA**: chữ ký có tính khả biến, không hỗ trợ xác minh theo lô và làm giao dịch đa chữ ký cồng kềnh.

**Ưu điểm của Schnorr (nâng cấp Taproot trên Bitcoin)**: không khả biến, hỗ trợ xác minh theo lô, cho phép gộp khóa (\( n \) khóa thành 1 khóa tổng hợp) và tăng quyền riêng tư khi giao dịch đa chữ ký trông giống giao dịch đơn chữ ký.

### 6.3. Tấn công kênh kề (Side-Channel Attacks)

- **Tấn công thời gian (Timing Attacks)**: Đo thời gian thực thi phép ký để suy đoán thông tin về khóa bí mật. **Khắc phục**: cài đặt thuật toán có thời gian chạy hằng số (constant-time).
- **Phân tích tiêu thụ điện năng (Power Analysis)**: Đo biến thiên dòng điện trên thiết bị phần cứng trong lúc ký để trích xuất khóa. **Khắc phục**: ngẫu nhiên hóa phép tính và che chắn vật lý.
- **Tấn công gây lỗi phần cứng (Fault Attacks)**: Tạo nhiễu điện áp hoặc xung nhịp trong quá trình ký để làm lộ thông tin khóa bí mật. **Khắc phục**: kiểm tra lại kết quả chữ ký trước khi xuất ra và bổ sung cảm biến phát hiện nhiễu phần cứng.

### 6.4. Lỗi sinh Nonce yếu

Năm 2013, một số ví Bitcoin trên Android sử dụng bộ sinh số ngẫu nhiên bị lỗi, tạo ra các `nonce` có thể dự đoán hoặc trùng lặp, dẫn đến lộ khóa bí mật và mất tiền.

**Giải pháp**: Dùng `nonce` tất định theo chuẩn **RFC 6979**:
```
k = HMAC-SHA256(private_key, message_hash)
```
Cách làm này loại bỏ rủi ro từ nguồn sinh số ngẫu nhiên kém và đảm bảo tính lặp lại, dù phụ thuộc vào độ an toàn của hàm băm nền tảng.

### 6.5. Tính khả biến giao dịch (Vấn đề lịch sử)

Một phần nguyên nhân dẫn đến sự cố sàn giao dịch Mt. Gox bắt nguồn từ việc kẻ tấn công sửa chữ ký giao dịch để làm thay đổi TXID, khiến phần mềm của sàn hiểu nhầm giao dịch trước thất bại và gửi trùng tiền.

**Cách khắc phục**: Bản nâng cấp **SegWit (Segregated Witness)** tách dữ liệu chữ ký (witness) ra khỏi phần dữ liệu dùng để tính TXID, loại bỏ hoàn toàn ảnh hưởng của tính khả biến chữ ký lên mã định danh giao dịch.

---

## 7. Các khái niệm liên quan

### 7.1. Bằng chứng không tiết lộ kiến thức (Zero-Knowledge Proofs)

Mở rộng ý tưởng của chữ ký số:
- **Chữ ký số**: Chứng minh "tôi sở hữu khóa bí mật" gắn với một thông điệp cụ thể.
- **Bằng chứng không tiết lộ kiến thức**: Chứng minh "tôi biết một bí mật \( X \)" mà không tiết lộ bất kỳ thông tin nào về \( X \).

Ví dụ, **zk-SNARKs** (ứng dụng trong Zcash) dùng cặp song tuyến trên đường cong elliptic để chứng minh giao dịch hợp lệ mà không lộ số tiền hay địa chỉ, với độ phức tạp toán học cao hơn nhiều so với ECDSA.

### 7.2. Chữ ký vòng (Ring Signatures — Monero)

Chữ ký vòng chứng minh chữ ký được tạo bởi một trong các thành viên thuộc một nhóm ("vòng") khóa công khai mà không tiết lộ chính xác ai là người ký:

```
Ring: [Alice's key, Bob's key, Charlie's key]
Signature proves: "One of these three people signed"
But doesn't reveal which one!
```

Cơ chế này bảo vệ tính ẩn danh của người gửi nhưng đánh đổi bằng kích thước chữ ký lớn hơn.

### 7.3. Chữ ký mù (Blind Signatures)

Cho phép người ký ký vào một thông điệp mà không nhìn thấy nội dung bên trong:
1. Alice làm mù thông điệp: \( m' = \text{blind}(m, r) \).
2. Người ký tạo chữ ký: \( \sigma' = \text{sign}(m') \).
3. Alice gỡ lớp làm mù: \( \sigma = \text{unblind}(\sigma', r) \).
4. \( \sigma \) trở thành chữ ký hợp lệ cho thông điệp gốc \( m \).

Kỹ thuật này từng được ứng dụng trong các hệ thống tiền điện tử ẩn danh (e-cash).

### 7.4. So sánh Chữ ký ngưỡng và Đa chữ ký

- **Đa chữ ký (Multi-Signature)**: Mỗi bên ký độc lập và ghép toàn bộ chữ ký vào giao dịch; kích thước tăng tuyến tính \( O(n) \).
- **Chữ ký ngưỡng (Threshold Signature)**: Các bên phối hợp qua giao thức tương tác để xuất ra một chữ ký duy nhất; kích thước hằng số \( O(1) \).

**Ví dụ so sánh**:
```
3-of-5 MultiSig: 3 full signatures + 5 public keys ≈ 450 bytes
3-of-5 Threshold: 1 signature + 1 aggregate public key ≈ 96 bytes
```

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"New Directions in Cryptography"** | 1976 | Diffie, Hellman | Khởi xướng khái niệm mật mã khóa công khai |
| **"A Method for Obtaining Digital Signatures"** | 1978 | Rivest, Shamir, Adleman | Thuật toán RSA — hệ mật khóa công khai thực tiễn đầu tiên |
| **"A Digital Signature Based on a Conventional Encryption Function"** | 1987 | Ralph Merkle | Lược đồ chữ ký Merkle |
| **"Elliptic Curve Cryptosystems"** | 1985 | Neal Koblitz | Đặt nền móng cho mật mã đường cong elliptic (ECC) |
| **"Elliptic Curve Discrete Logarithm Problem"** | 1985 | Victor Miller | Đặt nền móng cho mật mã đường cong elliptic (ECC) |
| **"Digital Signature Standard (DSS)"** | 1994 | NIST FIPS 186 | Chuẩn hóa thuật toán DSA và ECDSA |
| **"SEC 2: Recommended Elliptic Curve Domain Parameters"** | 2010 | SECG | Đặc tả tham số đường cong `secp256k1` dùng trong Bitcoin |
| **"Deterministic Usage of DSA and ECDSA"** | 2013 | RFC 6979 | Chuẩn sinh `nonce` tất định an toàn |
| **"Schnorr Signatures for Bitcoin"** | 2018 | Pieter Wuille (BIP 340) | Đề xuất tích hợp chữ ký Schnorr vào Bitcoin |
| **"Compact Multi-Signatures for Smaller Blockchains"** | 2018 | Boneh et al. | Phân tích chữ ký gộp BLS |

**Tài liệu nên ưu tiên đọc**:
1. Bài báo Diffie–Hellman: Khái niệm nền tảng về mật mã khóa công khai.
2. NIST FIPS 186-4: Đặc tả chuẩn của ECDSA.
3. RFC 6979: Phương pháp sinh `nonce` an toàn.
4. BIP 340: Triển khai chữ ký Schnorr trong Bitcoin.

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Minh họa đường cong Elliptic** | [Andrea Corbellini's ECC Series](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/) | Chuỗi bài trực quan và dễ tiếp cận về ECC |
| **Luồng thuật toán ECDSA** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/transactions.html) | Hướng dẫn triển khai thực tế |
| **Quy trình sinh khóa và địa chỉ** | [Mastering Bitcoin Ch4](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch04.asciidoc) | Đi từ khóa bí mật tới địa chỉ Bitcoin |
| **Quy trình chữ ký số** | [Practical Cryptography](http://www.crypto-it.net/eng/theory/digital-signature.html) | Minh họa từng bước |
| **Đồ thị đường cong secp256k1** | [Desmos secp256k1](https://www.desmos.com/calculator/ialhd71we3) | Công cụ khám phá đường cong tương tác |

**Công cụ tương tác**:
- [Anders Brownworth - Public/Private Keys](https://andersbrownworth.com/blockchain/public-private-keys) — Minh họa trực quan cặp khóa và chữ ký.
- [Bitcoin Address Generator](https://www.bitaddress.org) — Quan sát quy trình sinh khóa (chỉ nên dùng ở chế độ ngoại tuyến nếu thử nghiệm thực tế).
- [ECC Point Calculator](https://www.desmos.com/calculator/ialhd71we3) — Thực hành phép toán trên đường cong elliptic.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. Chữ ký số đảm bảo tính xác thực, không thể chối bỏ và toàn vẹn dữ liệu.
2. Hoạt động dựa trên mật mã khóa công khai với cặp `(khóa công khai, khóa bí mật)`.
3. Bitcoin sử dụng ECDSA trên đường cong `secp256k1` (và mở rộng sang Schnorr từ Taproot).
4. Độ an toàn dựa trên độ khó của bài toán logarit rời rạc trên đường cong elliptic.

**Nền tảng kỹ thuật**:
- Sinh khóa: khóa bí mật chọn ngẫu nhiên, khóa công khai tính bằng `khóa bí mật × G`.
- Ký: cặp \( (r, s) \) với \( s = k^{-1}(e + rd_A) \mod n \).
- Xác minh: kiểm tra \( r \stackrel{?}{=} (u_1 G + u_2 Q_A).x \mod n \).
- Mức bảo mật: ~128 bit (với khóa dài 256 bit).

**Ứng dụng trong blockchain**:
- Ủy quyền chi tiêu trong giao dịch.
- Tạo địa chỉ ví từ giá trị băm của khóa công khai.
- Kích hoạt thực thi hợp đồng thông minh.
- Quản lý tài sản bằng ví đa chữ ký.

**Lưu ý bảo mật**:
- Không bao giờ tái sử dụng `nonce` \( k \) vì sẽ làm lộ trực tiếp khóa bí mật.
- Máy tính lượng tử (thuật toán Shor) là rủi ro dài hạn (ước tính 10–30 năm).
- Quản lý khóa có tính quyết định vì mất khóa đồng nghĩa mất tài sản vĩnh viễn.
- Cần phòng chống tấn công kênh kề ở các cài đặt phần cứng.

**Các cải tiến hiện đại**:
- Chữ ký Schnorr (Bitcoin Taproot): tăng quyền riêng tư và hỗ trợ xác minh theo lô.
- Sinh `nonce` tất định (RFC 6979): tránh lỗi từ bộ sinh số ngẫu nhiên yếu.
- Chữ ký ngưỡng: triển khai mô hình \( m \)-trên-\( n \) mà không lộ cấu trúc đa chữ ký.
- Chữ ký BLS (Ethereum 2.0): cho phép gộp nhiều chữ ký thành một.

**Điểm chốt**: Chữ ký số là thành phần mật mã cốt lõi tạo nên quyền sở hữu phi tập trung trong blockchain, chuyển đổi việc nắm giữ khóa bí mật thành quyền kiểm soát tài sản số thông qua chứng minh toán học.

---

✅ **Kết thúc Lecture 00.03**

**Chương tiếp theo**: Chapter 01 - Bitcoin: Kiến trúc và Proof-of-Work

---

## Video tham khảo

- **Xem trước:** [What are Digital Signatures? - Computerphile](https://www.youtube.com/watch?v=s22eJ1eVLTU) — Computerphile, tiếng Anh. Tách rõ vai trò người ký, người xác minh và bước ký trên giá trị băm của thông điệp; nên xem trước mục tính xác thực.
- [Elliptic Curves - Computerphile](https://www.youtube.com/watch?v=NF1pwjL9-DE) — Computerphile, tiếng Anh. Giới thiệu đường cong elliptic và bài toán logarit rời rạc, làm nền cho ECDSA trên `secp256k1` ở phần toán học.
- [Public Key Cryptography - Computerphile](https://www.youtube.com/watch?v=GSIDS_lvRv4) — Computerphile, tiếng Anh. Trình bày cặp khóa công khai — bí mật trước khi đi vào công thức ký và xác minh.

## References

1. Diffie, W., & Hellman, M. (1976). *New directions in cryptography*. IEEE transactions on Information Theory, 22(6), 644-654.
2. Koblitz, N. (1987). *Elliptic curve cryptosystems*. Mathematics of computation, 48(177), 203-209.
3. Johnson, D., Menezes, A., & Vanstone, S. (2001). *The elliptic curve digital signature algorithm (ECDSA)*. International journal of information security, 1(1), 36-63.
4. Pornin, T. (2013). *RFC 6979: Deterministic usage of the digital signature algorithm (DSA) and elliptic curve digital signature algorithm (ECDSA)*.
5. Wuille, P., Nick, J., & Ruffing, T. (2020). *BIP 340: Schnorr signatures for secp256k1*.
6. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.
