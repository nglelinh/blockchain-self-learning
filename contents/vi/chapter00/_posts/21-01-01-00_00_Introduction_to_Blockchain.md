---
layout: post
title: "Lecture 00.00: Giới thiệu về Blockchain và Distributed Ledgers"
chapter: '00'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Giới thiệu về Blockchain và Distributed Ledgers

Tháng 10 năm 2008, khi cuộc khủng hoảng tài chính toàn cầu đang làm lung lay niềm tin vào các ngân hàng lớn nhất thế giới, một bức thư điện tử ngắn xuất hiện trên danh sách thư của giới mật mã học. Tác giả ký tên **Satoshi Nakamoto** và đặt ra một câu hỏi tưởng như nghịch lý: *làm thế nào hai người xa lạ ở hai đầu Trái Đất có thể chuyển tiền điện tử trực tiếp cho nhau mà không cần bất kỳ ngân hàng, công ty thẻ tín dụng hay trọng tài trung tâm nào đứng giữa kiểm tra xem đồng tiền đó đã bị chi tiêu hai lần hay chưa?*

Trước năm 2008, mọi hệ thống thanh toán số đều xoay quanh một quyển sổ cái nằm trong phòng máy chủ của một tổ chức trung gian. Đột phá của **blockchain** không phải là phát minh ra một định dạng cơ sở dữ liệu kỳ bí, mà là sự kết hợp tinh tế giữa **mật mã học**, **hệ phân tán** và **động lực kinh tế** để hàng nghìn máy tính không tin nhau cùng ghi và bảo vệ chung một quyển sổ cái bất biến. Bài học mở đầu này giúp bạn nhìn xuyên qua lớp từ khóa truyền thông để nắm đúng kiến trúc cốt lõi của sổ cái phân tán.

---

## Bản đồ kiến thức nền: Blockchain đứng trên ba trụ cột khoa học nào?

Với nền tảng toán học và tin học đại học (cấu trúc dữ liệu, xác suất, lý thuyết đồ thị), bạn có thể tách blockchain thành ba trụ cột rõ ràng:

### 1. Mật mã học ứng dụng (Hàm băm & Chữ ký số)
Nếu sổ cái mở công khai cho mọi người cùng giữ, điều gì ngăn kẻ gian sửa lại một giao dịch từ năm ngoái? **Hàm băm mật mã** tạo ra "dấu vân tay" duy nhất cho mỗi khối dữ liệu và móc nối khối sau vào dấu vân tay của khối trước thành một **chuỗi băm (hash chain)** — sửa một bit ở quá khứ sẽ làm vỡ dây chuyền mọi dấu vân tay phía sau. Song song đó, **chữ ký số khóa công khai** bảo đảm chỉ chủ sở hữu khóa bí mật mới có quyền ký tiêu số dư của mình.

### 2. Hệ thống phân tán và Đồng thuận (Distributed Consensus)
Khi không có máy chủ trung tâm, các nút mạng nằm rải rác toàn cầu chịu độ trễ truyền tin và có thể chứa các nút gian lận. **Lý thuyết đồng thuận phân tán** giải quyết bài toán: làm sao toàn mạng thống nhất *đúng một thứ tự giao dịch duy nhất* (ngăn chi tiêu gấp đôi) ngay cả khi một phần nút ngừng hoạt động hoặc cố tình tung tin giả.

### 3. Lý thuyết trò chơi và Động lực kinh tế (Cryptoeconomics)
Thuật toán thuần túy chưa đủ trong một mạng mở mà ai cũng có thể tạo hàng triệu tài khoản giả (tấn công Sybil). Blockchain đưa **chi phí vật lý hoặc kinh tế thực** (năng lực tính toán trong PoW, tài sản đặt cọc trong PoS) cùng phần thưởng khối vào giao thức, khiến hành vi trung thực trở thành chiến lược có lợi nhất về mặt kinh tế.

---

### Khung giải thích: tự tay kiểm tra chuỗi băm chống giả mạo 3 khối (nên đọc chậm)

Để thấy vì sao chỉ sửa một con số trong quá khứ lại làm sụp đổ toàn bộ chuỗi khối, hãy tự tay tính một **chuỗi băm mini 3 khối** bằng hàm băm đồ chơi $$h(x) = (7x + 13) \bmod 97$$ (trong thực tế Bitcoin dùng SHA-256 trên không gian $$2^{256}$$):

1. **Tạo Khối 0 (Genesis)** với dữ liệu giao dịch $$d_0 = 10$$:
   $$
   H_0 = h(10) = (7 \cdot 10 + 13) \bmod 97 = 83.
   $$
2. **Tạo Khối 1** chứa dữ liệu $$d_1 = 25$$ và **móc nối** mã băm khối trước $$H_0 = 83$$ bằng cách tính $$h(H_0 + d_1)$$:
   $$
   H_1 = h(83 + 25) = (7 \cdot 108 + 13) \bmod 97 = 769 \bmod 97 = 90 \quad (\text{vì } 97 \times 7 = 679).
   $$
3. **Tạo Khối 2** chứa dữ liệu $$d_2 = 40$$ móc vào $$H_1 = 90$$:
   $$
   H_2 = h(90 + 40) = (7 \cdot 130 + 13) \bmod 97 = 923 \bmod 97 = 50 \quad (\text{vì } 97 \times 9 = 873).
   $$
   Toàn mạng lúc này cùng ghi nhớ dấu vân tay đầu chuỗi là $$H_2 = 50$$.
4. **Thử tấn công sửa lén Khối 0** từ $$d_0 = 10$$ thành $$d_0' = 11$$ (chỉ lệch đúng 1 đơn vị!):
   - $$H_0' = (7 \cdot 11 + 13) \bmod 97 = 90 \neq 83$$.
   - $$H_1' = (7(90 + 25) + 13) \bmod 97 = 818 \bmod 97 = 42 \neq 90$$.
   - $$H_2' = (7(42 + 40) + 13) \bmod 97 = 587 \bmod 97 = 5 \neq 50$$!

Chỉ một thay đổi nhỏ nhất ở Khối 0 đã tạo hiệu ứng domino làm sai lệch toàn bộ mã băm phía sau: mọi nút trung thực chỉ cần đối chiếu $$H_2' = 5 \neq 50$$ là phát hiện ngay gian lận mà không cần tin bất kỳ ai!

---

## 1. Tổng quan về khái niệm

Blockchain ra đời từ bài toán xây dựng một hệ thống thanh toán điện tử ngang hàng (peer-to-peer) không phụ thuộc vào bên trung gian tin cậy. Mô hình này được giới thiệu lần đầu vào năm 2008 bởi một cá nhân hoặc nhóm tác giả ẩn danh dưới bút danh **Satoshi Nakamoto** trong bài báo *"Bitcoin: A Peer-to-Peer Electronic Cash System"*.

Trước khi Bitcoin xuất hiện, các hệ thống thanh toán điện tử đều phải đối mặt với **bài toán chi tiêu gấp đôi (double-spending problem)**. Trong thế giới vật lý, khi bạn trao một tờ tiền giấy cho người khác, bạn không còn giữ tờ tiền đó nữa. Tuy nhiên, dữ liệu số có thể được sao chép vô hạn lần. Do đó, câu hỏi đặt ra là làm thế nào để đảm bảo một đơn vị tiền điện tử không bị cùng một người chi tiêu nhiều lần.

Cách tiếp cận truyền thống là dựa vào một bên trung gian tin cậy — chẳng hạn ngân hàng, PayPal hay Visa — để quản lý số dư và xác nhận giao dịch. Cách làm này kéo theo nhiều hạn chế như phí giao dịch cao, thời gian xử lý chậm, rủi ro về quyền riêng tư và đặc biệt là **điểm lỗi đơn (single point of failure)**: nếu bên trung gian bị tấn công, ngừng hoạt động hoặc hành xử thiếu trung thực, toàn bộ hệ thống sẽ bị ảnh hưởng.

Blockchain giải quyết bài toán này bằng cách thay thế bên trung gian bằng một **cơ chế đồng thuận phân tán (distributed consensus mechanism)**. Thay vì để một tổ chức duy nhất quản lý sổ cái, hàng nghìn máy tính độc lập trên toàn cầu cùng lưu trữ và xác thực chung một bản sao của sổ cái. Mỗi giao dịch mới cần được đa số mạng lưới xác nhận trước khi ghi vĩnh viễn vào chuỗi. Nhờ đó, hệ thống đạt được các đặc tính chính sau:

- **Phi tập trung (Decentralized)**: Không có một thực thể duy nhất nắm quyền kiểm soát toàn mạng.
- **Minh bạch (Transparent)**: Mọi người tham gia đều có thể kiểm tra lịch sử giao dịch.
- **Bất biến (Immutable)**: Dữ liệu một khi đã ghi vào blockchain rất khó bị sửa đổi.
- **An toàn (Secure)**: Được bảo vệ bởi các nguyên lý mật mã học và cơ chế đồng thuận.

Phạm vi ứng dụng của blockchain không chỉ dừng lại ở Bitcoin mà mở rộng sang một mô hình lưu trữ và xác thực dữ liệu mới trong môi trường không tin cậy lẫn nhau. Từ hợp đồng thông minh (smart contracts) trên Ethereum đến quản lý chuỗi cung ứng, bỏ phiếu điện tử và quản lý danh tính số, công nghệ này đang được triển khai trong nhiều lĩnh vực khác nhau.

Để nắm vững nguyên lý hoạt động của blockchain, chúng ta cần hiểu rõ ba trụ cột cốt lõi:
1. **Mật mã học (Cryptography)**: Hàm băm (hash functions), chữ ký số (digital signatures) và mật mã khóa công khai (public-key cryptography).
2. **Cấu trúc dữ liệu phân tán (Distributed Data Structures)**: Cây Merkle (Merkle trees), khối (blocks) và chuỗi khối (chains).
3. **Cơ chế đồng thuận (Consensus Mechanisms)**: Proof-of-Work, Proof-of-Stake và khả năng chịu lỗi Byzantine (Byzantine Fault Tolerance).

---

## 2. Hiểu biết trực quan

Có thể hình dung blockchain như một **cuốn sổ kế toán công khai mà ai cũng có thể đọc, nhưng không ai có thể tự ý xóa hay sửa đổi nội dung đã ghi**.

Giả sử trong một ngôi làng nhỏ, thay vì có một ngân hàng trung tâm ghi chép mọi giao dịch, mỗi người dân đều giữ một bản sao của cuốn sổ kế toán. Khi Alice muốn chuyển 10 đồng xu cho Bob, cô thông báo công khai cho cả làng:

> "Tôi, Alice, muốn chuyển 10 đồng xu cho Bob. Đây là chữ ký số của tôi để xác nhận giao dịch này."

Mọi người trong làng sẽ cùng kiểm tra:
- Alice có đủ 10 đồng xu hay không (dựa trên lịch sử giao dịch đã lưu).
- Chữ ký có đúng là của Alice hay không.
- Giao dịch có tuân thủ các quy tắc hợp lệ hay không.

Nếu đa số đồng ý giao dịch hợp lệ, họ ghi nhận giao dịch đó vào bản sao sổ cái của mình. Thay vì ghi rời từng giao dịch, họ gom nhiều giao dịch lại thành một **"trang"** (block). Mỗi trang mới được gắn chặt với trang liền trước bằng một **"con dấu mật mã"** (cryptographic hash), tạo thành một chuỗi các trang liên kết chặt chẽ với nhau.

Nếu Charlie cố tình gian lận bằng cách sửa một giao dịch cũ để chiếm thêm tiền, anh ta buộc phải:
1. Sửa đổi trang chứa giao dịch đó trong cuốn sổ của mình.
2. Tính lại con dấu mật mã của trang bị sửa vì liên kết với trang kế tiếp đã bị phá vỡ.
3. Tính lại toàn bộ con dấu của tất cả các trang đứng sau đó.
4. Hoàn thành toàn bộ quá trình này nhanh hơn phần còn lại của ngôi làng (tức nắm giữ hơn 50% tổng năng lực tính toán).

Trong thực tế, với hàng nghìn máy tính độc lập cùng tham gia, kịch bản này gần như không khả thi về mặt chi phí và tính toán.

Một cách liên tưởng khác là xem blockchain như **một chuỗi khối vật lý**:
- Mỗi khối chứa dữ liệu giao dịch.
- Mỗi khối nối với khối trước nó bằng một liên kết mật mã.
- Muốn sửa một khối ở giữa chuỗi, kẻ tấn công phải tháo rời và nối lại toàn bộ các khối phía sau.
- Vì mọi thành viên khác trong mạng đều giữ bản sao của chuỗi gốc, họ sẽ dễ dàng phát hiện và từ chối phiên bản bị sửa đổi.

Tóm lại, về bản chất, blockchain là:
- **Một cơ sở dữ liệu phân tán** không chịu sự kiểm soát của một bên duy nhất.
- **Cấu trúc chỉ cho phép ghi thêm (append-only)**: có thể bổ sung dữ liệu mới nhưng không thể tùy tiện xóa hay sửa dữ liệu cũ.
- **Được bảo vệ bằng mật mã** nhằm ngăn chặn gian lận và phát hiện giả mạo.
- **Được đồng bộ hóa** giữa nhiều nút mạng (node) thông qua cơ chế đồng thuận.

---

## 3. Nền tảng kỹ thuật

### 3.1. Cấu trúc của một Block

Một block trong blockchain gồm ba thành phần chính:

**Block Header (Phần đầu khối)**:
- **Previous Block Hash**: Giá trị băm của block liền trước, tạo thành liên kết chuỗi.
- **Timestamp**: Dấu thời gian ghi nhận thời điểm tạo block.
- **Nonce**: Số nguyên được thay đổi liên tục trong quá trình đào (mining) ở cơ chế Proof-of-Work.
- **Merkle Root**: Giá trị băm đại diện cho toàn bộ các giao dịch nằm trong block.
- **Difficulty Target**: Ngưỡng độ khó của bài toán mật mã mà block cần thỏa mãn.

**Transaction List (Danh sách giao dịch)**:
- Chứa toàn bộ giao dịch được đóng gói trong block.
- Mỗi giao dịch cơ bản gồm người gửi (sender), người nhận (receiver), số lượng (amount) và chữ ký số (signature).

**Metadata (Siêu dữ liệu)**:
- Chỉ số hoặc chiều cao của block (block number/height).
- Kích thước của block.
- Tổng số giao dịch trong block.

### 3.2. Hàm băm mật mã (Cryptographic Hash Functions)

Hàm băm đóng vai trò trung tâm trong kiến trúc blockchain. Một hàm băm \( H \) là một hàm toán học nhận đầu vào có độ dài tùy ý và ánh xạ sang đầu ra có độ dài cố định:

\[
H: \{0,1\}^* \rightarrow \{0,1\}^n
\]

Bitcoin sử dụng thuật toán **SHA-256** (Secure Hash Algorithm 256-bit), luôn tạo ra chuỗi đầu ra dài 256 bit.

**Các tính chất quan trọng của hàm băm mật mã**:

1. **Tính tất định (Deterministic)**: Cùng một đầu vào luôn cho ra đúng một đầu ra duy nhất:
   \[
   H(x) = y \implies H(x) = y \text{ (luôn luôn)}
   \]

2. **Kháng tiền ảnh (Pre-image Resistance)**: Cho trước giá trị băm \( h \), cực kỳ khó về mặt tính toán để tìm ra đầu vào \( x \) sao cho \( H(x) = h \).
   - Độ phức tạp tìm kiếm vét cạn: \( O(2^n) \) với \( n = 256 \).

3. **Kháng va chạm (Collision Resistance)**: Cực kỳ khó tìm được hai đầu vào khác nhau \( x_1 \neq x_2 \) sao cho \( H(x_1) = H(x_2) \).
   - Theo nghịch lý ngày sinh (birthday paradox), cần khoảng \( 2^{n/2} \) phép thử, tức khoảng \( 2^{128} \) phép thử đối với SHA-256.

4. **Hiệu ứng tuyết lở (Avalanche Effect)**: Chỉ cần thay đổi 1 bit ở đầu vào, trung bình 50% số bit ở đầu ra sẽ thay đổi một cách khó dự đoán.

**Ví dụ thực tế với SHA-256**:
```
Input: "Hello, Blockchain!"
Output: 7526b1d2bc17587443fbf1fafb27e95d70615bc7576c6e34c1f139c9ce857733

Input: "Hello, Blockchain?" (chỉ thay ! bằng ?)
Output: 69b14049b5a3915315f57a3db1dec988b4b330426c46a61bbde4993575840f52
```

Chỉ một ký tự thay đổi đã làm toàn bộ chuỗi đầu ra biến đổi hoàn toàn.

### 3.3. Cấu trúc chuỗi (Chain Structure)

Blockchain được liên kết theo dạng chuỗi nhờ mỗi block đều chứa giá trị băm của block liền trước:

```
Block 0 (Genesis)          Block 1                Block 2                Block 3
┌──────────────┐          ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Prev: 0x000  │          │ Prev: 0xABC  │       │ Prev: 0xDEF  │       │ Prev: 0x123  │
│ Data: ...    │──────────│ Data: ...    │───────│ Data: ...    │───────│ Data: ...    │
│ Hash: 0xABC  │          │ Hash: 0xDEF  │       │ Hash: 0x123  │       │ Hash: 0x456  │
└──────────────┘          └──────────────┘       └──────────────┘       └──────────────┘
```

Tính bất biến (immutability) bắt nguồn trực tiếp từ cơ chế liên kết này:
- Nếu dữ liệu trong Block 1 bị thay đổi, giá trị băm của Block 1 sẽ thay đổi theo.
- Trường `Previous Hash` lưu trong Block 2 không còn khớp với giá trị băm mới của Block 1.
- Hệ quả là toàn bộ phần chuỗi từ Block 2 trở đi trở nên không hợp lệ.

### 3.4. Cây Merkle (Merkle Tree / Hash Tree)

Để tổ chức và xác minh hiệu quả hàng nghìn giao dịch trong một block, blockchain sử dụng **cây Merkle** — một cấu trúc cây nhị phân trong đó:
- Các nút lá (leaf node) chứa giá trị băm của từng giao dịch.
- Các nút trong (internal node) chứa giá trị băm của chuỗi ghép (concatenation) từ hai nút con.

```
                    Merkle Root
                   /            \
                Hash01          Hash23
               /     \         /      \
            Hash0   Hash1   Hash2   Hash3
              |       |       |       |
             Tx0     Tx1     Tx2     Tx3
```

**Lợi ích chính**:
1. **Xác minh hiệu quả**: Kiểm tra một giao dịch có nằm trong block hay không chỉ cần \( O(\log n) \) giá trị băm.
2. **Biểu diễn gọn nhẹ**: Phần đầu khối (block header) chỉ cần lưu Merkle root (32 byte) thay vì toàn bộ danh sách giao dịch (có thể lên tới hàng megabyte).
3. **Xác minh thanh toán đơn giản hóa (SPV — Simplified Payment Verification)**: Các nút nhẹ (light client) có thể xác minh giao dịch mà không cần tải xuống toàn bộ blockchain.

### 3.5. Công nghệ Sổ cái Phân tán (Distributed Ledger Technology — DLT)

Blockchain là một dạng cụ thể của công nghệ sổ cái phân tán (DLT). Một hệ thống sổ cái phân tán có năm đặc điểm cơ bản:

- **Nhân bản dữ liệu (Replication)**: Mỗi nút trong mạng lưu trữ một bản sao đầy đủ (hoặc một phần) của sổ cái.
- **Đồng thuận (Consensus)**: Các nút thống nhất về trạng thái hiện tại của sổ cái thông qua giao thức đồng thuận.
- **Xác thực (Validation)**: Mỗi nút tự kiểm tra tính hợp lệ của giao dịch trước khi chấp nhận.
- **Đồng bộ hóa (Synchronization)**: Các nút liên tục cập nhật dữ liệu với nhau để duy trì tính nhất quán.
- **Khả năng chịu lỗi (Fault Tolerance)**: Hệ thống vẫn tiếp tục vận hành ổn định ngay cả khi một số nút gặp sự cố hoặc hành động ác ý.

---

## 4. Công thức toán học và mật mã học

### 4.1. Hàm băm — Định nghĩa chính xác

Cho \( H: \{0,1\}^* \rightarrow \{0,1\}^{256} \) là hàm băm SHA-256.

**Các giả định về độ khó tính toán**:

1. **Kháng tiền ảnh (Pre-image Resistance / Tính một chiều)**:
   \[
   \Pr[\text{Adversary finds } x \text{ given } H(x)] < \frac{1}{2^{256}}
   \]
   (với mỗi phép thử ngẫu nhiên đơn lẻ, xác suất tìm đúng là \( 2^{-256} \)).

2. **Kháng tiền ảnh thứ hai (Second Pre-image Resistance)**:
   \[
   \text{Given } x_1, \text{ find } x_2 \neq x_1 \text{ such that } H(x_1) = H(x_2)
   \]
   Xác suất thành công mỗi phép thử: \( < 2^{-256} \).

3. **Kháng va chạm (Collision Resistance)**:
   \[
   \text{Find any } x_1 \neq x_2 \text{ such that } H(x_1) = H(x_2)
   \]
   Theo nghịch lý ngày sinh, cần khoảng \( 2^{128} \) phép thử.

### 4.2. Tính toàn vẹn của chuỗi (Chain Integrity)

Tính toàn vẹn của blockchain được duy trì nhờ chuỗi liên kết băm. Xét một blockchain \( B = [B_0, B_1, ..., B_n] \), trong đó mỗi block \( B_i \) gồm:
- Dữ liệu: \( D_i \)
- Giá trị băm của block trước: \( h_{i-1} = H(B_{i-1}) \)
- Giá trị băm hiện tại: \( h_i = H(B_i) = H(D_i || h_{i-1} || \text{metadata}_i) \)

Để sửa đổi block \( B_k \) mà không bị phát hiện, kẻ tấn công phải:
1. Tính lại giá trị băm mới \( h_k' = H(D_k' || h_{k-1} || ...) \).
2. Tính lại \( h_{k+1}' = H(D_{k+1} || h_k' || ...) \).
3. Lặp lại cho toàn bộ các block \( B_{k+2}, ..., B_n \).
4. Đuổi kịp và vượt qua chuỗi trung thực (nếu mạng dùng cơ chế Proof-of-Work).

**Chi phí tính toán**:
\[
\text{Cost} = \sum_{i=k}^{n} \text{Work}(B_i) 
\]

Trong Proof-of-Work, \( \text{Work}(B_i) \) đòi hỏi tìm một giá trị `nonce` thỏa mãn:
\[
H(\text{block\_header}_i) < \text{Target}_i
\]

### 4.3. Bằng chứng Merkle (Merkle Proof)

Để chứng minh giao dịch \( T_x \) thuộc về một block có Merkle root là \( M_R \), bên xác minh (verifier) chỉ cần:
- Giao dịch \( T_x \)
- Đường dẫn xác thực (authentication path): \( [h_1, h_2, ..., h_{\log_2 n}] \)

Quá trình xác minh diễn ra lần lượt từ lá lên gốc:
\[
\begin{align}
h_0 &= H(T_x) \\
h_1' &= H(h_0 || h_1) \\
h_2' &= H(h_1' || h_2) \\
&\vdots \\
h_{\log_2 n}' &= M_R
\end{align}
\]

Nếu kết quả cuối cùng \( h_{\log_2 n}' = M_R \), giao dịch được xác nhận là có mặt trong block.

**Độ phức tạp**: \( O(\log n) \) thay vì \( O(n) \).

### 4.4. Khả năng chịu lỗi Byzantine (Byzantine Fault Tolerance)

Trong một mạng phân tán gồm \( n \) nút, trong đó có tối đa \( f \) nút Byzantine (hỏng hóc hoặc hành xử ác ý), đồng thuận cổ điển theo mô hình BFT có thể đạt được khi:

\[
n \geq 3f + 1
\]

Nói cách khác, mạng cần có hơn 2/3 tổng số nút (cụ thể là ít nhất \( 2f + 1 \) nút) hoạt động trung thực.

**Trực giác chứng minh**:
- \( f \) nút Byzantine có thể không phản hồi hoặc gửi các thông điệp mâu thuẫn nhau.
- Cần ít nhất \( f + 1 \) nút trung thực để tạo thành đa số áp đảo so với \( f \) nút ác ý.
- Trong trường hợp xấu nhất khi \( f \) nút Byzantine im lặng và \( f \) nút khác nói dối, cần thêm \( f \) nút trung thực để đảm bảo đa số phiếu vẫn thuộc về các nút trung thực.
- Tổng số nút tối thiểu: \( 2f + 1 \) nút trung thực + \( f \) nút Byzantine = \( 3f + 1 \).

---

## 5. Minh họa triển khai

### 5.1. Cấu trúc Block đơn giản hóa (Python)

```python
import hashlib
import json
import time
from typing import List, Dict, Any

class Transaction:
    def __init__(self, sender: str, receiver: str, amount: float):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.timestamp = time.time()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'sender': self.sender,
            'receiver': self.receiver,
            'amount': self.amount,
            'timestamp': self.timestamp
        }
    
    def hash(self) -> str:
        tx_string = json.dumps(self.to_dict(), sort_keys=True)
        return hashlib.sha256(tx_string.encode()).hexdigest()

class Block:
    def __init__(self, index: int, transactions: List[Transaction], 
                 previous_hash: str, timestamp: float = None):
        self.index = index
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.timestamp = timestamp or time.time()
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Tính hash của block"""
        block_data = {
            'index': self.index,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash,
            'timestamp': self.timestamp,
            'nonce': self.nonce
        }
        block_string = json.dumps(block_data, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int):
        """Proof-of-Work: tìm nonce sao cho hash bắt đầu với 'difficulty' số 0"""
        target = "0" * difficulty
        while not self.hash.startswith(target):
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"Block mined: {self.hash}")

class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.difficulty = 4
        self.pending_transactions: List[Transaction] = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """Tạo block đầu tiên (Genesis Block)"""
        genesis_block = Block(0, [], "0")
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        return self.chain[-1]
    
    def add_transaction(self, transaction: Transaction):
        """Thêm transaction vào pending pool"""
        self.pending_transactions.append(transaction)
    
    def mine_pending_transactions(self):
        """Mine một block mới chứa tất cả pending transactions"""
        if not self.pending_transactions:
            return
        
        new_block = Block(
            index=len(self.chain),
            transactions=self.pending_transactions,
            previous_hash=self.get_latest_block().hash
        )
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)
        
        # Clear pending transactions
        self.pending_transactions = []
    
    def is_chain_valid(self) -> bool:
        """Verify tính toàn vẹn của blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Verify hash của current block
            if current_block.hash != current_block.calculate_hash():
                print(f"Block {i} has been tampered with!")
                return False
            
            # Verify liên kết với previous block
            if current_block.previous_hash != previous_block.hash:
                print(f"Block {i} is not linked to previous block!")
                return False
        
        return True

# Example usage
if __name__ == "__main__":
    # Tạo blockchain
    blockchain = Blockchain()
    
    # Thêm transactions
    tx1 = Transaction("Alice", "Bob", 50)
    tx2 = Transaction("Bob", "Charlie", 25)
    
    blockchain.add_transaction(tx1)
    blockchain.add_transaction(tx2)
    
    # Mine block
    print("Mining block 1...")
    blockchain.mine_pending_transactions()
    
    # Thêm thêm transactions
    tx3 = Transaction("Charlie", "Alice", 10)
    blockchain.add_transaction(tx3)
    
    print("Mining block 2...")
    blockchain.mine_pending_transactions()
    
    # Verify blockchain
    print(f"\nBlockchain is valid: {blockchain.is_chain_valid()}")
    
    # Print blockchain
    for block in blockchain.chain:
        print(f"\nBlock {block.index}:")
        print(f"  Timestamp: {block.timestamp}")
        print(f"  Previous Hash: {block.previous_hash[:16]}...")
        print(f"  Hash: {block.hash[:16]}...")
        print(f"  Nonce: {block.nonce}")
        print(f"  Transactions: {len(block.transactions)}")
```

### 5.2. Cài đặt trong Bitcoin Core (C++)

Cấu trúc phần đầu khối của Bitcoin Core tuân theo nguyên lý tương tự nhưng tối ưu hơn về dung lượng và hiệu năng:

```cpp
// Simplified Bitcoin block header structure
class CBlockHeader {
public:
    int32_t nVersion;           // Block version
    uint256 hashPrevBlock;      // Hash of previous block
    uint256 hashMerkleRoot;     // Merkle root of transactions
    uint32_t nTime;             // Timestamp
    uint32_t nBits;             // Difficulty target
    uint32_t nNonce;            // Nonce for PoW
    
    uint256 GetHash() const {
        return SerializeHash(*this);
    }
};
```

### 5.3. Cấu trúc Block của Ethereum

Ethereum có cấu trúc block phức tạp hơn vì cần quản lý thêm các chuyển đổi trạng thái (state transitions) của hợp đồng thông minh:

```javascript
// Simplified Ethereum block structure
interface Block {
    number: number;                    // Block number
    hash: string;                      // Block hash
    parentHash: string;                // Previous block hash
    nonce: string;                     // PoW nonce
    sha3Uncles: string;               // Hash of uncle blocks
    logsBloom: string;                // Bloom filter for logs
    transactionsRoot: string;         // Merkle root of transactions
    stateRoot: string;                // State trie root
    receiptsRoot: string;             // Receipts trie root
    miner: string;                    // Miner address
    difficulty: bigint;               // Mining difficulty
    totalDifficulty: bigint;          // Cumulative difficulty
    extraData: string;                // Extra data
    size: number;                     // Block size
    gasLimit: bigint;                 // Gas limit
    gasUsed: bigint;                  // Gas used
    timestamp: number;                // Timestamp
    transactions: Transaction[];       // List of transactions
    uncles: string[];                 // Uncle block hashes
}
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Bộ ba bất khả thi của Blockchain (Blockchain Trilemma)

Vitalik Buterin khái quát "Blockchain Trilemma" như sự đánh đổi giữa ba thuộc tính cốt lõi:

1. **Tính phi tập trung (Decentralization)**: Số lượng và mức độ phân tán của các nút tham gia.
2. **Bảo mật (Security)**: Khả năng chống chịu của mạng lưới trước các cuộc tấn công.
3. **Khả năng mở rộng (Scalability)**: Thông lượng xử lý giao dịch (throughput) và độ trễ (latency).

Trong thiết kế thực tế, rất khó tối ưu đồng thời cả ba thuộc tính này:

```
         Decentralization
              /  \
             /    \
            /      \
           /        \
    Security -------- Scalability
    
Bitcoin: High Decentralization + Security, Low Scalability
Visa: High Scalability + Security, No Decentralization
Private Chains: High Scalability, Low Decentralization
```

**So sánh thông lượng tham khảo**:
- **Bitcoin**: ~7 giao dịch/giây (TPS)
- **Ethereum**: ~15–30 TPS
- **Visa**: ~24.000 TPS
- **PayPal**: ~193 TPS

### 6.2. Yêu cầu về lưu trữ

Dung lượng dữ liệu của blockchain tăng liên tục theo thời gian:
- Blockchain Bitcoin: ~500 GB (tính đến năm 2024).
- Blockchain Ethereum: ~1 TB trở lên đối với nút lưu trữ đầy đủ (full archive node).

Xu hướng này tạo ra **áp lực tập trung hóa**, vì chỉ những tổ chức có đủ tài nguyên phần cứng mới duy trì được nút đầy đủ (full node).

**Các hướng giải quyết**:
- **Light clients (Nút nhẹ)**: Chỉ lưu block header và xác minh giao dịch bằng SPV.
- **Pruning (Cắt tỉa dữ liệu)**: Xóa dữ liệu trạng thái cũ, chỉ giữ lại các phần gần nhất cần cho xác thực.
- **Sharding (Phân mảnh)**: Chia mạng blockchain thành nhiều phân vùng (shard) để xử lý và lưu trữ song song.

### 6.3. Tấn công 51% (51% Attack)

Nếu một kẻ tấn công kiểm soát hơn 50% năng lực đào (trong PoW) hoặc lượng tài sản đặt cược (trong PoS), họ có thể:
- Thực hiện chi tiêu gấp đôi (double-spend) các giao dịch của chính mình.
- Kiểm duyệt, ngăn chặn một số giao dịch được đưa vào block.
- Đảo ngược các giao dịch gần đây thông qua tái tổ chức chuỗi.

**Xác suất tấn công thành công trong PoW**:

Giả sử kẻ tấn công nắm tỷ lệ sức mạnh băm \( q \), còn các thợ đào trung thực nắm \( p = 1 - q \). Xác suất kẻ tấn công đuổi kịp chuỗi trung thực sau khi đã bị dẫn trước \( z \) block là:

\[
P_{\text{catch-up}} = \begin{cases}
1 & \text{if } q \geq p \\
\left(\frac{q}{p}\right)^z & \text{if } q < p
\end{cases}
\]

Chẳng hạn, với \( q = 0.4 \) (40% sức mạnh băm), sau 6 xác nhận:
\[
P_{\text{catch-up}} = \left(\frac{0.4}{0.6}\right)^6 \approx 0.088 = 8.8\%
\]

**Biện pháp phòng vệ**: Chờ thêm nhiều xác nhận (confirmations). Trên mạng Bitcoin, các giao dịch giá trị lớn thường chờ 6 xác nhận (khoảng 1 giờ).

### 6.4. Bài toán tính chung cuộc (Finality Problem)

Trong các blockchain sử dụng PoW, không có **tính chung cuộc tuyệt đối (absolute finality)**; về mặt lý thuyết, luôn tồn tại khả năng xảy ra tái tổ chức chuỗi (chain reorganization).

**Hai dạng tính chung cuộc**:
- **Tính chung cuộc theo xác suất (Probabilistic Finality)** (Bitcoin, Ethereum thời kỳ PoW): Mức độ chắc chắn tăng dần theo số lượng xác nhận.
- **Tính chung cuộc tuyệt đối (Absolute Finality)** (Ethereum PoS, Tendermint): Block được chốt vĩnh viễn sau khi đáp ứng đủ điều kiện đồng thuận.

### 6.5. Tiêu thụ năng lượng

Cơ chế PoW của Bitcoin tiêu thụ khoảng 150 TWh điện mỗi năm (tương đương mức tiêu thụ điện của Argentina).

**Các lo ngại về môi trường**:
- Lượng phát thải khí nhà kính (carbon footprint).
- Rác thải điện tử từ các thiết bị đào chuyên dụng lỗi thời.

**Các hướng giảm thiểu**:
- Chuyển sang Proof-of-Stake (giảm khoảng 99,95% năng lượng tiêu thụ).
- Sử dụng năng lượng tái tạo cho hoạt động đào.
- Áp dụng các cơ chế đồng thuận thay thế như PoA hoặc DPoS.

### 6.6. Hạn chế về quyền riêng tư

Blockchain mang tính **giả danh (pseudonymous)** chứ không hoàn toàn ẩn danh (anonymous):
- Mọi giao dịch đều hiển thị công khai trên sổ cái.
- Địa chỉ ví có thể bị liên kết ngược với danh tính thực.
- Dữ liệu giao dịch có thể bị phân tích theo đồ thị dòng tiền (transaction graph analysis).

**Các giải pháp cải thiện**:
- **Bằng chứng không tiết lộ kiến thức (Zero-Knowledge Proofs)**: ZK-SNARKs, ZK-STARKs.
- **Chữ ký vòng (Ring Signatures)**: Được sử dụng trong Monero.
- **Dịch vụ trộn giao dịch (Mixing Services)**: Chẳng hạn CoinJoin.

---

## 7. Các khái niệm liên quan

### 7.1. So sánh Blockchain và Cơ sở dữ liệu truyền thống

| Đặc điểm | Blockchain | Cơ sở dữ liệu truyền thống |
|---------|-----------|----------------|
| Quyền kiểm soát | Phi tập trung | Tập trung |
| Mô hình tin cậy | Không cần bên trung gian (Trustless) | Tin cậy quản trị viên |
| Tính minh bạch | Công khai (hoặc có phân quyền) | Riêng tư |
| Tính bất biến | Cao | Thấp (có thể sửa/xóa) |
| Hiệu năng | Thấp (tốn chi phí đồng thuận) | Cao |
| Chi phí vận hành | Cao (do lưu trữ nhân bản) | Thấp |
| Tính nhất quán | Nhất quán cuối cùng (Eventual consistency) | Nhất quán mạnh (Strong consistency) |

### 7.2. Blockchain công khai và Blockchain riêng tư

**Công khai / Không cần cấp phép (Public / Permissionless)**:
- Bất kỳ ai cũng có thể tham gia mạng lưới.
- Minh bạch hoàn toàn.
- Sử dụng cơ chế khuyến khích bằng token.
- Ví dụ: Bitcoin, Ethereum.

**Riêng tư / Có cấp phép (Private / Permissioned)**:
- Hạn chế quyền truy cập và tham gia.
- Mức độ minh bạch được kiểm soát theo phân quyền.
- Không nhất thiết cần token nội sinh.
- Ví dụ: Hyperledger Fabric, R3 Corda.

**Liên minh (Consortium)**:
- Bán phi tập trung, do nhiều tổ chức cùng đồng quản lý.
- Ví dụ: Energy Web Chain.

### 7.3. Blockchain và DAG (Đồ thị có hướng không chu trình)

**Các hệ thống dựa trên DAG** (IOTA, Nano, Hedera):
- Không đóng gói giao dịch thành block; mỗi giao dịch tham chiếu trực tiếp đến các giao dịch trước đó.
- Có tiềm năng đạt thông lượng cao hơn.
- Áp dụng mô hình bảo mật khác với blockchain truyền thống.

```
Blockchain:      DAG:
  B3               Tx5 ──┐
  ↑                ↑     ↓
  B2             Tx3   Tx6
  ↑              ↑ ↑    
  B1            Tx1 Tx2
  ↑               ↑
  B0             Tx0
```

### 7.4. Layer 1 và Layer 2

**Layer 1**: Giao thức blockchain nền tảng (như Bitcoin, Ethereum).

**Layer 2**: Các giải pháp xây dựng phía trên Layer 1 để mở rộng khả năng xử lý:
- **Kênh trạng thái (State Channels)**: Lightning Network.
- **Chuỗi song song (Sidechains)**: Polygon.
- **Rollups**: Optimistic Rollups, ZK-Rollups.

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Giới thiệu blockchain và đồng thuận Proof-of-Work, giải quyết bài toán chi tiêu gấp đôi |
| **"Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform"** | 2014 | Vitalik Buterin | Mở rộng blockchain thành nền tảng lập trình hỗ trợ hợp đồng thông minh |
| **"Practical Byzantine Fault Tolerance"** | 1999 | Miguel Castro, Barbara Liskov | Đặt nền móng cho các thuật toán đồng thuận chịu lỗi Byzantine thực tế (PBFT) |
| **"The Byzantine Generals Problem"** | 1982 | Leslie Lamport, Robert Shostak, Marshall Pease | Hình thức hóa bài toán chịu lỗi Byzantine |
| **"Merkle Tree"** (khái niệm) | 1979 | Ralph Merkle | Đề xuất cấu trúc cây băm giúp xác minh dữ liệu hiệu quả |
| **"Secure Hash Standard (SHS)"** | 2015 | NIST FIPS 180-4 | Đặc tả chuẩn của thuật toán SHA-256 |
| **"Majority is not Enough: Bitcoin Mining is Vulnerable"** | 2013 | Ittay Eyal, Emin Gün Sirer | Phân tích tấn công đào ích kỷ (selfish mining) |
| **"The Bitcoin Lightning Network"** | 2016 | Joseph Poon, Thaddeus Dryja | Đề xuất giải pháp mở rộng Layer 2 cho Bitcoin |
| **"Chainlink: A Decentralized Oracle Network"** | 2017 | Steve Ellis et al. | Kết nối blockchain với dữ liệu ngoài chuỗi |

**Thứ tự đọc gợi ý**:
1. Whitepaper Bitcoin của Satoshi Nakamoto (8 trang, ngắn gọn và dễ tiếp cận).
2. Whitepaper Ethereum (chuyên sâu hơn nhưng vẫn dễ theo dõi).
3. *The Byzantine Generals Problem* (nắm rõ thách thức của bài toán đồng thuận).
4. Bài báo PBFT (tìm hiểu cơ chế đồng thuận BFT hiện đại).

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Sơ đồ cấu trúc blockchain** | [Mastering Bitcoin - Chapter 7](https://github.com/bitcoinbook/bitcoinbook) của Andreas Antonopoulos | Tài liệu mở, minh họa cách liên kết các block |
| **Minh họa hàm băm** | [Khan Academy - Cryptographic Hash Functions](https://www.khanacademy.org/computing/computer-science/cryptography) | Dễ hình dung tính chất một chiều của hàm băm |
| **Luồng giao dịch Bitcoin** | [Bitcoin.org - How Bitcoin Works](https://bitcoin.org/en/how-it-works) | Tài liệu chính thức của Bitcoin |
| **Minh họa cây Merkle** | [Ethereum.org - Merkle Proofs](https://ethereum.org/en/developers/tutorials/merkle-proofs-for-offline-data-integrity/) | Trình bày cơ chế xác minh hiệu quả |
| **Khái niệm sổ cái phân tán** | [IBM Blockchain Docs](https://www.ibm.com/blockchain/what-is-blockchain) | Góc nhìn doanh nghiệp về DLT |
| **Minh họa bài toán các tướng Byzantine** | [Martin Kleppmann's Blog](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) | Các khái niệm hệ thống phân tán |
| **Sơ đồ Blockchain Trilemma** | [Vitalik Buterin's Blog](https://vitalik.ca) | Phân tích đánh đổi mở rộng — bảo mật — phi tập trung |

**Công cụ tương tác**:
- [Blockchain Demo](https://andersbrownworth.com/blockchain/) — Minh họa trực quan của Anders Brownworth.
- [3D Blockchain Visualizer](https://www.blockchain.com/explorer) — Trình khám phá blockchain Bitcoin theo thời gian thực.
- [Ethereum Virtual Machine Illustrated](https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf) — Minh họa chi tiết cơ chế bên trong EVM.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. Blockchain là sổ cái phân tán giải quyết bài toán chi tiêu gấp đôi mà không cần bên trung gian tin cậy.
2. Các hàm băm mật mã tạo nên tính bất biến và khả năng phát hiện giả mạo cho chuỗi dữ liệu.
3. Cơ chế đồng thuận giúp các nút đạt được thống nhất trong môi trường không tin cậy lẫn nhau.
4. Thiết kế blockchain luôn phải cân bằng giữa ba yếu tố: phi tập trung, bảo mật và khả năng mở rộng.

**Nền tảng kỹ thuật**:
- Hàm băm: SHA-256, kháng va chạm và kháng tiền ảnh.
- Cấu trúc block: header, danh sách giao dịch và giá trị băm của block liền trước.
- Cây Merkle: xác minh giao dịch hiệu quả với chi phí \( O(\log n) \).
- Liên kết chuỗi: cấu trúc phát hiện mọi thay đổi trái phép.

**Ứng dụng tiêu biểu**:
- Tiền mã hóa (Bitcoin, Ethereum).
- Hợp đồng thông minh (Smart contracts).
- Quản lý chuỗi cung ứng.
- Danh tính số.
- Tài chính phi tập trung (DeFi).

**Thách thức chính**:
- Giới hạn về khả năng mở rộng.
- Mức tiêu thụ năng lượng (với cơ chế PoW).
- Hạn chế về quyền riêng tư.
- Đánh đổi giữa tính chung cuộc và tốc độ xác nhận.
- Yêu cầu lưu trữ ngày càng tăng.

---

✅ **Kết thúc Lecture 00.00**

**Bài tiếp theo**: Lecture 00.01 - Hệ thống phân tán và Lý thuyết đồng thuận

---

## Video tham khảo

- **Xem trước:** [But how does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4) — 3Blue1Brown, tiếng Anh. Đi từ sổ cái chung và chữ ký số tới bài toán Proof-of-Work; giúp xây dựng trực giác cho phần tổng quan và chuỗi băm của bài.
- [How does a blockchain work - Simply Explained](https://www.youtube.com/watch?v=SSo_EIwHSd4) — Simply Explained, tiếng Anh. Minh họa cách một block được nối với block trước bằng hàm băm, tương ứng với mô hình sổ cái công khai ở phần hiểu biết trực quan.
- [Introduction to Bitcoin: what is bitcoin and why does it matter?](https://www.youtube.com/watch?v=l1si5ZWLgy0) — aantonop, tiếng Anh. Antonopoulos đặt Bitcoin trong bài toán truyền giá trị không cần trung gian, phù hợp với bối cảnh lịch sử ở mục 1.

## References

1. Nakamoto, S. (2008). Bitcoin: A peer-to-peer electronic cash system.
2. Buterin, V. (2014). Ethereum whitepaper: A next-generation smart contract and decentralized application platform.
3. Antonopoulos, A. M. (2017). *Mastering Bitcoin: Programming the Open Blockchain*. O'Reilly Media.
4. Narayanan, A., Bonneau, J., Felten, E., Miller, A., & Goldfeder, S. (2016). *Bitcoin and Cryptocurrency Technologies*. Princeton University Press.
5. Castro, M., & Liskov, B. (1999). Practical byzantine fault tolerance. OSDI, 99, 173-186.
