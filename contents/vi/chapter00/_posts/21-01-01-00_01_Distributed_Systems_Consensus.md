---
layout: post
title: "Lecture 00.01: Distributed Systems và Consensus Theory"
chapter: '00'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter00
---

# Lecture: Distributed Systems và Consensus Theory

Hãy tưởng tượng bốn đạo quân đóng quanh một thành trì kiên cố, chỉ liên lạc với nhau qua người đưa tin chạy ngựa. Nếu cả bốn cùng tấn công lúc bình minh, họ sẽ thắng; nếu chỉ một nửa tấn công còn nửa kia rút lui, họ sẽ thảm bại. Nhưng trớ trêu thay: có thể có một vị tướng là **kẻ phản bội**, cố tình gửi thư "Tấn công!" cho người này và "Rút lui!" cho người kia. Làm thế nào các vị tướng trung thành vẫn đi đến cùng một quyết định?

Câu chuyện ngụ ngôn năm 1982 của Leslie Lamport, Robert Shostak và Marshall Pease — **Bài toán các vị tướng Byzantine** — không chỉ là câu đố trí tuệ, mà chính là trái tim toán học của mọi hệ thống phân tán và blockchain hiện đại. Trước khi nói về Bitcoin, Ethereum hay Tendermint, ta cần hiểu hai ranh giới thép của khoa học máy tính phân tán: **định lý bất khả FLP (1985)** và **ngưỡng chịu lỗi Byzantine $$n \ge 3f + 1$$**.

---

## Kiến thức cần nhớ: Lý thuyết Hệ phân tán và Đồng thuận nghiên cứu những gì?

Với hành trang khoa học máy tính đại học (mạng máy tính, xác suất, tổ hợp cơ bản), lý thuyết đồng thuận đứng trên ba trụ cột rõ ràng:

### 1. Mô hình mạng: Đồng bộ, Bán đồng bộ và Bất đồng bộ
Mọi giao thức phân tán đều phụ thuộc vào giả thiết về thời gian truyền tin:
- **Đồng bộ (Synchronous):** Mọi gói tin đều đến nơi trong một giới hạn thời gian $$\Delta$$ biết trước.
- **Bất đồng bộ (Asynchronous):** Độ trễ có thể dài tùy ý (nhưng gói tin không mất vĩnh viễn) — trong mô hình này, ta không thể phân biệt một nút đã *sập nguồn* với một nút chỉ đang *chậm mạng*, dẫn tới **Định lý bất khả FLP (1985)**: không có giao thức tất định nào vừa an toàn vừa chắc chắn dừng khi có dù chỉ 1 nút lỗi dừng!
- **Bán đồng bộ (Partially Synchronous):** Mạng có thể tắc nghẽn tạm thời, nhưng sau một mốc thời gian ổn định toàn cục (GST), gói tin lại đến trong giới hạn $$\Delta$$ — đây là mô hình chuẩn của PBFT, Tendermint và Ethereum PoS.

### 2. Mô hình lỗi: Lỗi dừng (Crash) vs. Lỗi Byzantine
- **Crash Fault (CFT — như Raft, Paxos):** Nút có thể ngừng chạy đột ngột nhưng không bao giờ nói dối; chỉ cần quá bán $$n \ge 2f + 1$$ nút để chịu được $$f$$ nút lỗi.
- **Byzantine Fault (BFT):** Nút ác ý có thể gửi hai thông điệp trái ngược cho hai nút khác nhau, giả mạo thời gian hoặc câu kết phá hoại; khi mạng bán đồng bộ/bất đồng bộ, ta bắt buộc phải có **$$n \ge 3f + 1$$** nút!

### 3. Hai bất biến cốt lõi: Safety (An toàn) và Liveness (Sống động)
- **Safety:** Không bao giờ có hai nút trung thực chốt hai khối mâu thuẫn nhau ở cùng một độ cao (không bị phân nhánh đôi).
- **Liveness:** Mọi giao dịch hợp lệ cuối cùng đều sẽ được đưa vào chuỗi (hệ thống không bị treo chết mãi mãi).
Định lý CAP và FLP cho thấy khi mạng bị phân mảnh, mọi blockchain đều phải chọn rõ: ưu tiên giữ **Safety** (tạm dừng chốt khối như Tendermint) hay ưu tiên giữ **Liveness** (vẫn tiếp tục tạo khối rồi chọn chuỗi dài nhất như Bitcoin).

---

### Giải thích: tự tay chứng minh ngưỡng $$n \ge 3f + 1$$ bằng nguyên lý chuồng bồ câu

Tại sao hệ thống chịu lỗi Byzantine lại cần đúng $$3f + 1$$ nút (ví dụ 4 nút để chịu 1 kẻ phản bội, 7 nút để chịu 2 kẻ phản bội) mà không thể là $$3f$$? Hãy kiểm tra tận tay trong 3 bước ngắn:

1. **Vì sao $$n = 3,\ f = 1$$ thất bại (3 vị tướng với 1 kẻ phản bội)?** Giả sử có 3 nút $$A, B, C$$. Vì mạng có thể có 1 nút sập nguồn, giao thức bắt buộc phải cho phép $$A$$ chốt quyết định khi chỉ nghe được 2 phiếu ($$A$$ và 1 nút nữa).
   - *Kịch bản 1:* $$C$$ là kẻ phản bội. $$C$$ nói với $$A$$ là "Tấn công" (cùng với $$A$$ được 2 phiếu → $$A$$ chốt **Tấn công**), đồng thời $$C$$ nói với $$B$$ là "Rút lui" (cùng với $$B$$ được 2 phiếu → $$B$$ chốt **Rút lui**)!
   - Hai nút trung thực $$A$$ và $$B$$ chốt hai kết quả trái ngược nhau — **Safety bị phá vỡ hoàn toàn!**
2. **Nguyên lý giao nhau của tập đại biểu (Quorum Intersection) với $$n = 3f + 1$$:** Giả sử ta có $$n = 3f + 1$$ nút và quy định một quyết định chỉ được chốt khi gom đủ tập đại biểu (quorum) cỡ $$Q = 2f + 1$$ phiếu.
   - *Liveness:* Ngay cả khi toàn bộ $$f$$ nút lỗi im lặng hoàn toàn, vẫn còn $$n - f = 2f + 1 = Q$$ nút trung thực đủ để chốt khối!
   - *Safety:* Xét hai tập đại biểu bất kỳ $$Q_1, Q_2$$ (mỗi tập cỡ $$2f + 1$$). Theo nguyên lý chuồng bồ câu:
     $$
     |Q_1 \cap Q_2| = |Q_1| + |Q_2| - |Q_1 \cup Q_2| \ge (2f + 1) + (2f + 1) - (3f + 1) = f + 1.
     $$
   - Vì cả mạng chỉ có tối đa $$f$$ kẻ phản bội, giao của $$Q_1$$ và $$Q_2$$ **bắt buộc chứa ít nhất $$(f + 1) - f = 1$$ nút trung thực**! Nút trung thực này không bao giờ ký hai khối mâu thuẫn ở cùng một vòng, nên hai quyết định trái ngược không thể cùng gom đủ $$2f+1$$ phiếu!
3. **Thử ngay với số cụ thể $$f = 1 \implies n = 4,\ Q = 3$$:** Hai nhóm bất kỳ cỡ 3 lấy từ 4 nút luôn trùng nhau ít nhất $$3 + 3 - 4 = 2$$ nút. Trong 2 nút trùng nhau đó, có tối đa 1 kẻ gian, nên **chắc chắn có ít nhất 1 nút trung thực đứng làm nhân chứng chung** khóa chặt an toàn cho cả mạng!

---

## 1. Tổng quan về khái niệm

Để hiểu sâu cơ chế vận hành của blockchain, trước hết cần nắm vững **hệ thống phân tán (distributed systems)** — nền tảng lý thuyết mà blockchain được xây dựng trên đó. Một hệ thống phân tán là tập hợp các máy tính độc lập kết nối với nhau qua mạng, phối hợp để thực hiện một mục tiêu chung sao cho từ góc nhìn của người dùng cuối, toàn bộ hệ thống hoạt động như một thực thể thống nhất.

Bài toán cốt lõi của hệ thống phân tán là **sự đồng thuận (consensus)**: làm thế nào để nhiều máy tính độc lập — vốn có thể gặp sự cố bất kỳ lúc nào, chịu độ trễ mạng hoặc thậm chí hành xử ác ý — vẫn có thể thống nhất về cùng một giá trị hay trạng thái duy nhất?

Đây là một bài toán khó về mặt lý thuyết. Năm 1985, ba nhà khoa học máy tính **Fischer, Lynch và Paterson** đã chứng minh **Kết quả bất khả FLP (FLP Impossibility Result)**: trong một mạng bất đồng bộ (không có cận trên cho độ trễ truyền tin), chỉ cần tồn tại khả năng một nút gặp lỗi dừng (crash), sẽ không có bất kỳ thuật toán đồng thuận tất định (deterministic) nào đảm bảo luôn kết thúc trong thời gian hữu hạn. Kết quả này cho thấy đồng thuận tuyệt đối trong môi trường phân tán bất đồng bộ là bất khả thi.

Tuy nhiên, các hệ thống phân tán vẫn vận hành hiệu quả trong thực tế nhờ **nới lỏng một số giả định lý thuyết**:
- Chấp nhận đảm bảo theo xác suất thay vì tất định tuyệt đối.
- Giả định mạng có tính đồng bộ yếu (không hoàn toàn bất đồng bộ).
- Giới hạn tỷ lệ các nút gặp lỗi hoặc hành xử ác ý.
- Chấp nhận tính nhất quán cuối cùng (eventual consistency) thay vì nhất quán tức thời.

Blockchain là một dạng hệ thống phân tán đặc thù với bốn đặc điểm nổi bật:
1. **Không có cơ quan điều phối trung tâm**: Không tồn tại nút điều phối duy nhất.
2. **Môi trường Byzantine**: Các nút có thể hành xử tùy ý và cố tình phá hoại.
3. **Tư cách thành viên mở (Open membership)**: Trong blockchain công khai, bất kỳ ai cũng có thể tham gia hoặc rời khỏi mạng.
4. **Cơ chế khuyến khích kinh tế (Incentive-driven)**: Sử dụng phần thưởng và hình phạt kinh tế để thúc đẩy hành vi trung thực.

Vì vậy, đồng thuận trong blockchain không chỉ là vấn đề kỹ thuật mạng mà là **sự kết hợp giữa mật mã học, lý thuyết trò chơi và lý thuyết hệ thống phân tán**. Bitcoin tiếp cận bài toán này bằng Proof-of-Work, chuyển đổi tài nguyên tính toán thành quyền biểu quyết và gắn động lực kinh tế trực tiếp với mức độ bảo mật của mạng lưới.

---

## 2. Hiểu biết trực quan

### 2.1. Bài toán đồng thuận

Giả sử bạn và 9 người bạn đang ở 10 thành phố khác nhau, cùng muốn thống nhất địa điểm ăn trưa cho ngày mai và chỉ có thể liên lạc qua tin nhắn văn bản:

**Kịch bản 1: Tập trung (có người điều phối)**
- Alice làm người điều phối và quyết định: "Ăn Pizza!"
- Mọi người làm theo quyết định của Alice.
- ✅ Đơn giản và nhanh chóng.
- ❌ Nếu điện thoại của Alice hết pin hoặc bị chiếm quyền điều khiển, cả nhóm mất khả năng thống nhất.

**Kịch bản 2: Bỏ phiếu phân tán (không có người điều phối)**
- Mỗi người gửi phiếu bầu của mình tới tất cả những người còn lại.
- Từng người tự đếm phiếu và chọn phương án nhận được nhiều phiếu nhất.
- ✅ Loại bỏ điểm lỗi đơn (no single point of failure).
- ❌ Tin nhắn có thể bị trễ hoặc thất lạc; Bob có thể nhận phiếu theo thứ tự khác với Charlie, dẫn đến khó đảm bảo tất cả mọi người cùng ra một kết quả.

**Kịch bản 3: Bỏ phiếu trong môi trường Byzantine (có người phá hoại)**
- Eve là kẻ gian lận: cô gửi "Pizza" cho một nửa nhóm và "Sushi" cho nửa còn lại.
- Một nửa nhóm kết luận đa số chọn Pizza, nửa kia kết luận đa số chọn Sushi.
- Quyết định bị chia rẽ khiến hệ thống thất bại.

Đây chính là **Bài toán các tướng Byzantine (Byzantine Generals Problem)**: làm sao để một nhóm các vị tướng (các nút mạng) thống nhất được một kế hoạch tác chiến chung khi một số tướng có thể là kẻ phản bội (nút Byzantine), đồng thời kênh truyền tin có thể bị trễ hoặc bị can thiệp?

### 2.2. Cách tiếp cận của Blockchain

Blockchain giải quyết bài toán này bằng bốn cơ chế phối hợp:

1. **Nhật ký sự kiện có thứ tự (Ordered Log of Events)**: Thay vì bỏ phiếu cho một quyết định đơn lẻ, mạng lưới duy trì một nhật ký theo trình tự thời gian ghi lại toàn bộ giao dịch.
2. **Xổ số Proof-of-Work**: Thay vì mọi nút cùng bỏ phiếu đồng thời, hệ thống chọn ngẫu nhiên một thợ đào (miner) đề xuất block tiếp theo. Quá trình chọn ngẫu nhiên này gắn với năng lực tính toán thông qua việc giải bài toán mật mã.
3. **Quy tắc chuỗi dài nhất (Longest Chain Rule)**: Khi xảy ra xung đột (hai block được đề xuất gần như cùng lúc), các nút đi theo chuỗi dài nhất (chính xác hơn là chuỗi tích lũy nhiều công sức tính toán nhất). Theo thời gian, một nhánh sẽ chiếm ưu thế.
4. **Động lực kinh tế (Economic Incentives)**: Người đề xuất block hợp lệ nhận phần thưởng khối và phí giao dịch, khiến việc tấn công trở nên tốn kém trong khi hành xử trung thực mang lại lợi nhuận.

Quay lại ví dụ bỏ phiếu: thay vì buộc mọi người đồng thuận ngay lập tức về "Pizza hay Sushi", blockchain tạo ra một danh sách có thứ tự các giao dịch, và sự đồng thuận hình thành dần dần khi ngày càng có nhiều block mới được nối tiếp phía sau.

---

## 3. Nền tảng kỹ thuật

### 3.1. Các tính chất của hệ thống phân tán

Một hệ thống phân tán cần đảm bảo ba nhóm tính chất cơ bản:

**Tính an toàn (Safety)** — *"Không có điều xấu nào xảy ra"*:
- **Tính nhất quán (Consistency)**: Mọi nút trung thực đều nhìn thấy cùng một dữ liệu.
- **Tính thống nhất (Agreement)**: Mọi nút trung thực đều đi đến cùng một giá trị quyết định.

**Tính sống (Liveness)** — *"Điều tốt đẹp cuối cùng sẽ xảy ra"*:
- **Tính dừng (Termination)**: Thuật toán cuối cùng sẽ hoàn tất.
- **Tính tiến triển (Progress)**: Hệ thống tiếp tục xử lý và tạo ra trạng thái mới.

**Khả năng chịu lỗi (Fault Tolerance)**:
- **Lỗi dừng (Crash faults)**: Nút đột ngột ngừng phản hồi.
- **Lỗi bỏ sót (Omission faults)**: Thông điệp bị mất trên đường truyền.
- **Lỗi Byzantine (Byzantine faults)**: Nút hành xử tùy ý, gửi thông tin sai lệch hoặc cố tình phá hoại.

### 3.2. Định lý CAP

Định lý CAP do Eric Brewer đề xuất năm 2000 khẳng định rằng một hệ thống lưu trữ phân tán chỉ có thể đảm bảo đồng thời tối đa 2 trong 3 tính chất sau:

- **Tính nhất quán (Consistency — C)**: Mọi thao tác đọc đều nhận được dữ liệu từ lần ghi gần nhất.
- **Tính sẵn sàng (Availability — A)**: Mọi yêu cầu hợp lệ đều nhận được phản hồi (không báo lỗi).
- **Khả năng chịu phân mảnh mạng (Partition Tolerance — P)**: Hệ thống vẫn tiếp tục hoạt động khi mạng bị chia cắt thành các phân vùng mất liên lạc với nhau.

```
         C (Consistency)
         /  \
        /    \
       /  CA  \
      /________\
    A           P
(Availability) (Partition Tolerance)

CP Systems: Consistency + Partition Tolerance
  → May become unavailable during network partition
  → Bitcoin, Ethereum (prioritize consistency)

AP Systems: Availability + Partition Tolerance
  → May return stale data during partition
  → DNS, Cassandra (eventual consistency)

CA Systems: Consistency + Availability
  → No partition tolerance
  → Traditional RDBMS in single datacenter
```

Các hệ thống blockchain thường thiên về mô hình **CP**: ưu tiên tính nhất quán của sổ cái chung hơn là tính sẵn sàng tức thời (ví dụ, giao dịch có thể tạm thời chưa được chốt trong quá trình tái tổ chức chuỗi).

### 3.3. Các mô hình đồng thuận

**Nhân bản máy trạng thái (State Machine Replication — SMR)**:

Đồng thuận trong hệ thống phân tán thường được triển khai dưới dạng nhân bản máy trạng thái:
- Mỗi nút vận hành cùng một máy trạng thái tất định.
- Tất cả các nút khởi đầu từ cùng một trạng thái ban đầu.
- Các nút tiếp nhận cùng một chuỗi lệnh theo đúng một thứ tự.
- Do quá trình thực thi mang tính tất định, mọi nút sẽ tiến tới cùng một trạng thái cuối cùng.

```
Node 1:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3
Node 2:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3
Node 3:  S0 --cmd1--> S1 --cmd2--> S2 --cmd3--> S3

Consensus = Agreement on sequence of commands
```

Blockchain áp dụng trực tiếp mô hình SMR:
- **Trạng thái (State)**: Số dư tài khoản (hoặc tập UTXO) và dữ liệu lưu trữ của hợp đồng thông minh.
- **Lệnh (Commands)**: Các giao dịch.
- **Đồng thuận (Consensus)**: Thống nhất về thứ tự thực thi các giao dịch thông qua các block.

### 3.4. Phân loại thuật toán đồng thuận

**Đồng thuận cổ điển chịu lỗi dừng (CFT — Crash Fault Tolerant)**:

1. **Paxos** (Leslie Lamport, 1989):
   - Chịu được lỗi dừng (crash).
   - Yêu cầu đa số phiếu (quorum): \( \lfloor n/2 \rfloor + 1 \).
   - Được ứng dụng trong Google Chubby và Apache ZooKeeper.

2. **Raft** (Diego Ongaro, 2014):
   - Phương án thay thế dễ hiểu hơn cho Paxos.
   - Dựa trên nút dẫn đầu (leader-based), cấu trúc rõ ràng hơn.
   - Được ứng dụng trong etcd và Consul.

**Đồng thuận chịu lỗi Byzantine (BFT — Byzantine Fault Tolerant)**:

1. **PBFT** (Practical Byzantine Fault Tolerance, 1999):
   - Chịu được tối đa \( f \) nút Byzantine khi tổng số nút \( n \geq 3f + 1 \).
   - Giao thức gồm ba pha: `pre-prepare`, `prepare` và `commit`.
   - Độ phức tạp thông điệp là \( O(n^2) \).
   - Được ứng dụng trong Hyperledger Fabric và Zilliqa.

2. **Đồng thuận Nakamoto (Proof-of-Work)**:
   - Ra mắt cùng Bitcoin năm 2008.
   - Tính chung cuộc theo xác suất (probabilistic finality).
   - Cho phép tham gia mở (permissionless).
   - Chống tấn công Sybil dựa trên công sức tính toán.

3. **Proof-of-Stake (PoS)**:
   - Các trình xác thực (validator) đặt cược tiền mã hóa.
   - Quyền đề xuất và xác thực khối được phân bổ theo tỷ trọng tài sản đặt cược.
   - Được sử dụng trong Ethereum 2.0, Cardano và Polkadot.

### 3.5. Các giả định về tính đồng bộ mạng

Mọi thuật toán đồng thuận đều phụ thuộc vào giả định về độ trễ truyền tin trên mạng:

**Mạng đồng bộ (Synchronous)**:
- Độ trễ thông điệp có cận trên xác định \( \Delta \).
- Tốc độ xử lý của các nút có cận trên xác định.
- Đây là giả định mạnh, hiếm khi đúng hoàn toàn trong môi trường Internet thực tế.

**Mạng bất đồng bộ (Asynchronous)**:
- Không có bất kỳ cận trên nào cho độ trễ truyền tin.
- Chịu giới hạn của định lý bất khả FLP: không tồn tại thuật toán đồng thuận tất định.
- Là giả định yếu nhất nhưng sát với môi trường thực tế nhất.

**Mạng đồng bộ một phần (Partially Synchronous)**:
- Mạng sẽ trở nên đồng bộ sau một thời điểm ổn định toàn cục (GST — Global Stabilization Time).
- Trước GST: mạng hoạt động bất đồng bộ (thông điệp có thể trễ tùy ý).
- Sau GST: mạng hoạt động đồng bộ (thông điệp đến nơi trong khoảng \( \Delta \)).
- Phần lớn các thuật toán đồng thuận thực tế đều dựa trên giả định này.

Bitcoin hoạt động dựa trên giả định **đồng bộ yếu**: mạng có độ trễ nhưng các block vẫn lan truyền đủ nhanh so với chu kỳ tạo khối trung bình (thường nhanh hơn nhiều so với mốc 10 phút).

---

## 4. Công thức toán học và mật mã học

### 4.1. Cận dưới của khả năng chịu lỗi Byzantine

<div class="textbook-theorem" markdown="1">
**Định lý**: Trong một hệ thống phân tán gồm \( n \) nút, nếu có tối đa \( f \) nút Byzantine (hành xử ác ý), đồng thuận chỉ có thể đạt được khi:

\[
n \geq 3f + 1
\]
</div>

Nói cách khác:

\[
f < \frac{n}{3}
\]

**Chứng minh trực quan**:

Giả sử hệ thống có \( n \) nút và cần chịu được \( f \) nút Byzantine:

1. Trong trường hợp xấu nhất, \( f \) nút Byzantine có thể ngừng phản hồi hoàn toàn.
2. Khi đó, hệ thống chỉ nhận được phản hồi từ tối đa \( n - f \) nút.
3. Trong số \( n - f \) phản hồi này, trường hợp xấu nhất là vẫn có \( f \) nút Byzantine cố tình gửi thông tin sai lệch.
4. Số phản hồi trung thực tối thiểu nhận được là: \( (n - f) - f = n - 2f \).
5. Để nhóm nút trung thực luôn chiếm đa số so với \( f \) nút ác ý:
   \[
   n - 2f > f \implies n > 3f \implies n \geq 3f + 1
   \]

**Ví dụ**:
- \( n = 4 \), \( f = 1 \): \( 4 \geq 3(1) + 1 = 4 \) ✅ (đủ điều kiện).
- \( n = 3 \), \( f = 1 \): \( 3 \geq 3(1) + 1 = 4 \) ❌ (không đủ).
- \( n = 10 \), \( f = 3 \): \( 10 \geq 3(3) + 1 = 10 \) ✅ (đủ điều kiện).

### 4.2. Độ an toàn của đồng thuận Nakamoto

Trong cơ chế Proof-of-Work, giả sử kẻ tấn công kiểm soát tỷ lệ \( q \) trên tổng sức mạnh băm toàn mạng, còn các thợ đào trung thực kiểm soát tỷ lệ \( p = 1 - q \).

**Xác suất tấn công thành công**:

Gọi \( z \) là số lượng xác nhận (số block mà chuỗi trung thực đang dẫn trước). Xác suất kẻ tấn công đuổi kịp từ vị trí tụt lại \( z \) block là:

\[
P_{\text{catch-up}}(q, z) = 
\begin{cases}
1 & \text{if } q \geq 0.5 \\
\left(\frac{q}{p}\right)^z & \text{if } q < 0.5
\end{cases}
\]

**Diễn giải (rút gọn)**:

Quá trình này được mô hình hóa như một bước đi ngẫu nhiên (random walk):
- Ở mỗi block mới, kẻ tấn công có xác suất thắng là \( q \), còn mạng trung thực có xác suất thắng là \( p \).
- Kẻ tấn công cần thắng nhiều hơn mạng trung thực \( z \) lần để bắt kịp.
- Xác suất tổng hợp: \( \sum_{k=0}^{\infty} P(\text{attacker } z+k, \text{ honest } k) \).

Theo bài toán phá sản của con bạc (Gambler's Ruin), kết quả thu được là:

\[
P_{\text{catch-up}} = \left(\frac{q}{p}\right)^z = \left(\frac{q}{1-q}\right)^z
\]

**Bảng số liệu minh họa**:

| Sức mạnh tấn công \( q \) | Số xác nhận \( z \) | Xác suất \( P \) |
|------------------------|----------------------|---------------------|
| 0.1 (10%)              | 1                    | 0.111 (11.1%)       |
| 0.1 (10%)              | 6                    | 0.0000019 (0.00019%)|
| 0.3 (30%)              | 1                    | 0.429 (42.9%)       |
| 0.3 (30%)              | 6                    | 0.0062 (0.62%)      |
| 0.4 (40%)              | 6                    | 0.0878 (8.8%)       |
| 0.45 (45%)             | 10                   | 0.1344 (13.4%)      |

**Nhận xét**: Ngay cả khi nắm tới 40% tổng sức mạnh băm, sau 6 xác nhận kẻ tấn công chỉ có khoảng 8,8% cơ hội đuổi kịp. Với 10% sức mạnh băm, sau 6 xác nhận xác suất này giảm xuống còn khoảng 0,00019%.

### 4.3. Kết quả bất khả FLP

<div class="textbook-theorem" markdown="1">
**Định lý** (Fischer, Lynch, Paterson, 1985):

Trong một hệ thống phân tán bất đồng bộ, không tồn tại giao thức đồng thuận tất định nào có thể đảm bảo tính dừng (termination) ngay cả khi chỉ có tối đa một tiến trình có thể gặp lỗi dừng (crash).
</div>

**Phát biểu hình thức**:

Xét hệ thống với các điều kiện:
- Mô hình mạng: bất đồng bộ (không có giả định về thời gian truyền tin).
- Mô hình lỗi: tối đa 1 lỗi dừng.
- Tính an toàn (Safety): đảm bảo thống nhất (agreement) và hợp lệ (validity).
- Tính sống (Liveness): đảm bảo kết thúc (termination).

Kết luận: Không thể đảm bảo đồng thời tất cả các tính chất trên.

**Hệ quả đối với blockchain**:
1. **Cách khắc phục của blockchain**: Chấp nhận tính dừng theo xác suất (probabilistic/eventual termination) thay vì tính dừng tất định.
2. **Bitcoin không có điểm dừng tuyệt đối**: Về mặt lý thuyết, luôn tồn tại khả năng tái tổ chức chuỗi.
3. **Proof-of-Stake có tính chung cuộc**: Bổ sung giả định đồng bộ một phần để tránh rào cản của FLP.

### 4.4. Các mô hình nhất quán

**Nhất quán mạnh (Strong Consistency / Linearizability)**:

Với các thao tác \( op_1, op_2, ..., op_n \) có thứ tự thời gian thực \( \prec \):

\[
op_i \prec op_j \implies \text{system executes } op_i \text{ before } op_j
\]

**Nhất quán cuối cùng (Eventual Consistency)**:

\[
\forall \text{ nodes } n_i, n_j: \quad \lim_{t \to \infty} \text{state}(n_i, t) = \text{state}(n_j, t)
\]

Blockchain đạt được **tính nhất quán cuối cùng**: khi không có thêm giao dịch mới, tất cả các nút trung thực cuối cùng sẽ hội tụ về cùng một trạng thái.

### 4.5. Phân mảnh mạng và Quorum

Trong các giao thức đồng thuận kiểu PBFT với \( n = 3f + 1 \) nút:

**Kích thước quorum**:
\[
Q = 2f + 1 = \frac{2n + 1}{3}
\]

Lý do của ngưỡng này là hai quorum bất kỳ luôn giao nhau tại ít nhất \( f + 1 \) nút. Vì trong toàn mạng có tối đa \( f \) nút Byzantine, phần giao đó chắc chắn chứa ít nhất 1 nút trung thực:

\[
Q_1 \cap Q_2 \geq 2Q - n = 2(2f+1) - (3f+1) = f + 1
\]

---

## 5. Minh họa triển khai

### 5.1. Cài đặt PBFT đơn giản hóa

```python
from enum import Enum
from typing import Dict, List, Set
import hashlib
import json

class MessageType(Enum):
    PRE_PREPARE = "pre-prepare"
    PREPARE = "prepare"
    COMMIT = "commit"

class Message:
    def __init__(self, msg_type: MessageType, view: int, 
                 sequence: int, digest: str, node_id: int):
        self.msg_type = msg_type
        self.view = view          # Current view number
        self.sequence = sequence  # Sequence number of request
        self.digest = digest      # Digest of request
        self.node_id = node_id    # Sender's ID
    
    def __hash__(self):
        return hash((self.msg_type, self.view, self.sequence, 
                     self.digest, self.node_id))
    
    def __eq__(self, other):
        return (self.msg_type == other.msg_type and 
                self.view == other.view and
                self.sequence == other.sequence and
                self.digest == other.digest)

class PBFTNode:
    def __init__(self, node_id: int, total_nodes: int):
        self.node_id = node_id
        self.n = total_nodes
        self.f = (total_nodes - 1) // 3  # Max Byzantine nodes
        
        self.view = 0  # Current view
        self.sequence = 0  # Current sequence number
        
        # Message logs
        self.pre_prepare_log: Dict[int, Message] = {}
        self.prepare_log: Dict[int, Set[Message]] = {}
        self.commit_log: Dict[int, Set[Message]] = {}
        
        # State
        self.prepared: Set[int] = set()  # Prepared requests
        self.committed: Set[int] = set()  # Committed requests
    
    def is_primary(self) -> bool:
        """Check if this node is primary for current view"""
        return self.view % self.n == self.node_id
    
    def request(self, request_data: str) -> Message:
        """Client request - primary creates PRE-PREPARE"""
        if not self.is_primary():
            raise Exception("Only primary can create pre-prepare")
        
        self.sequence += 1
        digest = hashlib.sha256(request_data.encode()).hexdigest()
        
        msg = Message(
            MessageType.PRE_PREPARE,
            self.view,
            self.sequence,
            digest,
            self.node_id
        )
        
        self.pre_prepare_log[self.sequence] = msg
        return msg
    
    def receive_pre_prepare(self, msg: Message, request_data: str):
        """Backup receives PRE-PREPARE from primary"""
        # Verify message
        expected_digest = hashlib.sha256(request_data.encode()).hexdigest()
        if msg.digest != expected_digest:
            raise Exception("Invalid digest")
        
        if msg.view != self.view:
            raise Exception("Wrong view")
        
        # Accept and send PREPARE
        self.pre_prepare_log[msg.sequence] = msg
        
        prepare_msg = Message(
            MessageType.PREPARE,
            self.view,
            msg.sequence,
            msg.digest,
            self.node_id
        )
        
        # Add own prepare message
        if msg.sequence not in self.prepare_log:
            self.prepare_log[msg.sequence] = set()
        self.prepare_log[msg.sequence].add(prepare_msg)
        
        return prepare_msg
    
    def receive_prepare(self, msg: Message):
        """Receive PREPARE from other nodes"""
        if msg.sequence not in self.prepare_log:
            self.prepare_log[msg.sequence] = set()
        
        self.prepare_log[msg.sequence].add(msg)
        
        # Check if prepared (received 2f PREPARE messages)
        if (msg.sequence not in self.prepared and 
            len(self.prepare_log[msg.sequence]) >= 2 * self.f):
            self.prepared.add(msg.sequence)
            
            # Send COMMIT
            commit_msg = Message(
                MessageType.COMMIT,
                self.view,
                msg.sequence,
                msg.digest,
                self.node_id
            )
            
            if msg.sequence not in self.commit_log:
                self.commit_log[msg.sequence] = set()
            self.commit_log[msg.sequence].add(commit_msg)
            
            return commit_msg
        
        return None
    
    def receive_commit(self, msg: Message):
        """Receive COMMIT from other nodes"""
        if msg.sequence not in self.commit_log:
            self.commit_log[msg.sequence] = set()
        
        self.commit_log[msg.sequence].add(msg)
        
        # Check if committed (received 2f+1 COMMIT messages)
        if (msg.sequence not in self.committed and
            len(self.commit_log[msg.sequence]) >= 2 * self.f + 1):
            self.committed.add(msg.sequence)
            return True  # Request is committed!
        
        return False

# Example usage
if __name__ == "__main__":
    # Create 4 nodes (f=1, tolerates 1 Byzantine)
    nodes = [PBFTNode(i, 4) for i in range(4)]
    
    print("=== PBFT Consensus Example ===")
    print(f"Total nodes: {nodes[0].n}")
    print(f"Max Byzantine faults: {nodes[0].f}")
    print(f"Required PREPARE messages: {2 * nodes[0].f}")
    print(f"Required COMMIT messages: {2 * nodes[0].f + 1}\n")
    
    # Client sends request to primary (node 0)
    request = "Transfer 100 BTC from Alice to Bob"
    print(f"Client request: {request}")
    
    # Phase 1: PRE-PREPARE (primary broadcasts)
    print("\n--- Phase 1: PRE-PREPARE ---")
    pre_prepare = nodes[0].request(request)
    print(f"Node 0 (primary) creates PRE-PREPARE: seq={pre_prepare.sequence}")
    
    # Phase 2: PREPARE (backups send PREPARE)
    print("\n--- Phase 2: PREPARE ---")
    prepare_messages = []
    for i in range(1, 4):  # Nodes 1, 2, 3
        prepare = nodes[i].receive_pre_prepare(pre_prepare, request)
        prepare_messages.append((i, prepare))
        print(f"Node {i} sends PREPARE")
    
    # Broadcast PREPARE messages to all nodes
    commit_messages = []
    for node in nodes:
        for sender_id, prepare in prepare_messages:
            commit = node.receive_prepare(prepare)
            if commit:
                commit_messages.append((node.node_id, commit))
                print(f"Node {node.node_id} enters PREPARED state, sends COMMIT")
    
    # Phase 3: COMMIT
    print("\n--- Phase 3: COMMIT ---")
    for node in nodes:
        for sender_id, commit in commit_messages:
            if node.node_id != sender_id:
                committed = node.receive_commit(commit)
                if committed:
                    print(f"Node {node.node_id} COMMITTED request!")
    
    print("\n=== Consensus Reached! ===")
    print(f"All honest nodes agreed on: {request}")
```

### 5.2. Mô phỏng đồng thuận Bitcoin (đơn giản hóa)

```python
import hashlib
import time
from typing import List, Optional

class BitcoinBlock:
    def __init__(self, index: int, transactions: List[str], 
                 previous_hash: str, difficulty: int):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.difficulty = difficulty
        self.nonce = 0
        self.hash = ""
    
    def mine(self):
        """Proof-of-Work: find nonce such that hash < target"""
        target = "0" * self.difficulty
        attempts = 0
        
        start_time = time.time()
        while True:
            self.hash = self.calculate_hash()
            attempts += 1
            
            if self.hash.startswith(target):
                elapsed = time.time() - start_time
                print(f"Block mined! Nonce: {self.nonce}, "
                      f"Attempts: {attempts}, Time: {elapsed:.2f}s")
                return
            
            self.nonce += 1
    
    def calculate_hash(self) -> str:
        block_data = (f"{self.index}{self.timestamp}"
                     f"{self.transactions}{self.previous_hash}{self.nonce}")
        return hashlib.sha256(block_data.encode()).hexdigest()

class BitcoinBlockchain:
    def __init__(self, difficulty: int = 4):
        self.chain: List[BitcoinBlock] = []
        self.difficulty = difficulty
        self.pending_transactions: List[str] = []
        
        # Create genesis block
        genesis = BitcoinBlock(0, ["Genesis"], "0", difficulty)
        genesis.mine()
        self.chain.append(genesis)
    
    def add_transaction(self, transaction: str):
        self.pending_transactions.append(transaction)
    
    def mine_block(self) -> BitcoinBlock:
        """Simulate mining a new block"""
        if not self.pending_transactions:
            return None
        
        new_block = BitcoinBlock(
            len(self.chain),
            self.pending_transactions.copy(),
            self.chain[-1].hash,
            self.difficulty
        )
        
        print(f"\nMining block {new_block.index}...")
        new_block.mine()
        
        self.chain.append(new_block)
        self.pending_transactions = []
        
        return new_block
    
    def is_valid(self) -> bool:
        """Verify blockchain integrity"""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            
            # Check hash
            if current.hash != current.calculate_hash():
                return False
            
            # Check previous hash link
            if current.previous_hash != previous.hash:
                return False
            
            # Check PoW difficulty
            if not current.hash.startswith("0" * self.difficulty):
                return False
        
        return True
    
    def resolve_fork(self, other_chain: 'BitcoinBlockchain') -> bool:
        """Longest chain rule: replace if other chain is longer and valid"""
        if len(other_chain.chain) > len(self.chain) and other_chain.is_valid():
            self.chain = other_chain.chain.copy()
            return True
        return False

# Example: Simulating network consensus
if __name__ == "__main__":
    print("=== Bitcoin Consensus Simulation ===\n")
    
    # Two miners competing
    blockchain_A = BitcoinBlockchain(difficulty=4)
    blockchain_B = BitcoinBlockchain(difficulty=4)
    
    # Both receive same transactions
    blockchain_A.add_transaction("Alice -> Bob: 5 BTC")
    blockchain_A.add_transaction("Bob -> Charlie: 2 BTC")
    
    blockchain_B.add_transaction("Alice -> Bob: 5 BTC")
    blockchain_B.add_transaction("Bob -> Charlie: 2 BTC")
    
    print("Miner A mining...")
    blockchain_A.mine_block()
    
    print("\nMiner B mining...")
    blockchain_B.mine_block()
    
    # Simulate: Miner A mines another block first
    blockchain_A.add_transaction("Charlie -> Alice: 1 BTC")
    print("\nMiner A mines block 2...")
    blockchain_A.mine_block()
    
    # Miner B receives A's longer chain
    print(f"\nMiner B chain length: {len(blockchain_B.chain)}")
    print(f"Miner A chain length: {len(blockchain_A.chain)}")
    
    if blockchain_B.resolve_fork(blockchain_A):
        print("Miner B adopted Miner A's longer chain!")
        print("CONSENSUS REACHED - Both miners on same chain")
    
    print(f"\nFinal blockchain length: {len(blockchain_A.chain)}")
    print(f"Blockchain valid: {blockchain_A.is_valid()}")
```

---

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Vấn đề Nothing-at-Stake (trong Proof-of-Stake)

Trong PoS, khi mạng xảy ra phân nhánh (fork), trình xác thực có thể bỏ phiếu đồng thời cho cả hai nhánh mà gần như không mất thêm chi phí (khác với PoW vốn đòi hỏi phải phân bổ điện năng và phần cứng vào một nhánh).

```
      Block 3a
      /
Block 2
      \
      Block 3b

PoW: Miner must choose one chain (can't mine both simultaneously)
PoS: Validator can sign both chains at no cost!
```

**Giải pháp**:
- **Cắt giảm tài sản đặt cược (Slashing)**: Phạt trực tiếp các trình xác thực ký xác nhận đồng thời cho nhiều nhánh xung đột.
- **Cơ chế chung cuộc (Finality Gadgets)**: Casper FFG, Tendermint đảm bảo tính chung cuộc tuyệt đối khi đạt đủ điều kiện.

### 6.2. Tấn công tầm xa (Long-Range Attacks trong PoS)

Kẻ tấn công có thể thu mua khóa bí mật cũ của các trình xác thực đã rút tài sản đặt cược, sau đó viết lại một lịch sử chuỗi mới từ thời điểm rất xa trong quá khứ.

**Giải pháp**:
- **Điểm kiểm tra (Checkpoints)**: Phần mềm khách cố định sẵn giá trị băm của các block đã được chốt gần đây.
- **Tính chủ quan yếu (Weak subjectivity)**: Dựa vào đồng thuận xã hội ngoài chuỗi để xác minh mốc lịch sử cũ khi một nút mới tham gia mạng.

### 6.3. Đào ích kỷ (Selfish Mining)

Thợ đào có thể cố tình giữ kín các block vừa đào được thay vì phát tán ngay, sau đó tung ra có tính toán nhằm giành lợi thế phần thưởng không công bằng.

**Chiến lược minh họa**:
1. Đào được block \( B_1 \) và giữ riêng.
2. Nếu một thợ đào khác tìm thấy \( B_1' \), lập tức công bố \( B_1 \) để tạo cuộc đua giữa hai nhánh.
3. Trong một số trường hợp, nhánh riêng giành thắng lợi và loại bỏ block trung thực.
4. Chiến lược này có thể sinh lợi ngay cả khi kẻ tấn công nắm dưới 50% sức mạnh băm (ngưỡng tối thiểu khoảng 25%).

**Hệ quả**: Hạ ngưỡng an toàn lý thuyết của mạng từ 50% xuống khoảng 33% (hoặc thấp hơn tùy điều kiện lan truyền mạng).

### 6.4. Phân mảnh mạng (Network Partitions)

Khi mạng bị chia tách thành hai phân vùng không liên lạc được với nhau:

```
Partition A (60% nodes)    |    Partition B (40% nodes)
   Chain A continues       |       Chain B continues
        ...                |            ...
        
When partition heals:
- Longest chain wins (A)
- Transactions on chain B get reverted (!)
- Users on B experienced "false confirmations"
```

**Biện pháp giảm thiểu**:
- Chờ thêm nhiều xác nhận cho các giao dịch quan trọng.
- Giám sát tình trạng kết nối và độ trễ của mạng.
- Áp dụng các cơ chế chung cuộc (finality gadgets).

### 6.5. Tấn công Sybil (Sybil Attacks)

Kẻ tấn công tạo ra hàng loạt danh tính giả để chiếm quyền biểu quyết trong mạng.

- **Phòng vệ trong PoW**: Một đơn vị năng lực tính toán tương ứng một phiếu bầu; kẻ tấn công không thể tạo thêm phiếu nếu không đầu tư phần cứng và điện năng thực.
- **Phòng vệ trong PoS**: Một đơn vị tài sản đặt cược tương ứng một phiếu bầu; chi phí thu gom đủ tài sản rất lớn.
- **Phòng vệ trong PBFT**: Mạng có cấp phép, danh tính của từng nút được xác thực trước.

---

## 7. Các khái niệm liên quan

### 7.1. So sánh đồng thuận Paxos và Bitcoin

| Đặc điểm | Paxos | Bitcoin |
|---------|-------|---------|
| Môi trường | Có cấp phép, CFT | Không cần cấp phép, BFT |
| Mô hình lỗi | Lỗi dừng (Crash faults) | Lỗi Byzantine |
| Thành viên mạng | Cố định, biết trước | Động, mở rộng tự do |
| Tính chung cuộc | Mạnh (tức thời) | Theo xác suất (tăng dần) |
| Hiệu năng | Thông lượng cao | Thông lượng thấp |
| Chống tấn công Sybil | Dựa trên danh tính | Dựa trên tài nguyên (PoW) |

### 7.2. Tính nhất quán và Sự đồng thuận

- **Tính nhất quán (Consistency)**: Thuộc tính của dữ liệu, thể hiện việc mọi bản sao đều có cùng một giá trị.
- **Sự đồng thuận (Consensus)**: Giao thức giúp các bản sao thống nhất với nhau để đạt được tính nhất quán.

```
Consensus Algorithm → Achieves → Data Consistency
     (PBFT)                        (Linearizability)
     (Raft)                        (Sequential)
     (Nakamoto)                    (Eventual)
```

### 7.3. Đồng bộ, Bất đồng bộ và Đồng bộ một phần

| Mô hình | Giả định | Có thể đạt đồng thuận? | Ví dụ |
|-------|-----------|---------------------|----------|
| Đồng bộ | Có cận trên độ trễ truyền tin \( \Delta \) | Có (đơn giản) | Chủ yếu ở mức lý thuyết |
| Bất đồng bộ | Không có giả định về thời gian | Không (theo FLP) | Mạng Internet thực tế |
| Đồng bộ một phần | Trở nên đồng bộ sau mốc GST | Có (khả thi trong thực tế) | PBFT, Tendermint, Ethereum 2.0 |

### 7.4. Mạng có cấp phép và Không cần cấp phép

**Có cấp phép (Permissioned)** (Hyperledger, Corda):
- Thành viên được xác định từ trước.
- Đồng thuận nhanh hơn (không cần PoW).
- Thông lượng cao hơn.
- Mức độ phi tập trung thấp hơn.

**Không cần cấp phép (Permissionless)** (Bitcoin, Ethereum):
- Ai cũng có thể tham gia.
- Đồng thuận chậm hơn do cần cơ chế chống Sybil.
- Thông lượng thấp hơn.
- Mức độ phi tập trung cao.

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Bài báo | Năm | Tác giả | Đóng góp chính |
|-------|------|-----------|--------------|
| **"Impossibility of Distributed Consensus with One Faulty Process"** | 1985 | Fischer, Lynch, Paterson | Kết quả bất khả FLP — giới hạn nền tảng của bài toán đồng thuận |
| **"The Byzantine Generals Problem"** | 1982 | Lamport, Shostak, Pease | Định nghĩa bài toán chịu lỗi Byzantine |
| **"Practical Byzantine Fault Tolerance"** | 1999 | Castro, Liskov | Thuật toán BFT thực tế đầu tiên với độ phức tạp thông điệp \( O(n^2) \) |
| **"Paxos Made Simple"** | 2001 | Leslie Lamport | Trình bày đơn giản hóa về thuật toán đồng thuận Paxos |
| **"In Search of an Understandable Consensus Algorithm (Raft)"** | 2014 | Ongaro, Ousterhout | Đề xuất phương án thay thế dễ hiểu hơn cho Paxos |
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Giới thiệu đồng thuận Nakamoto (BFT theo xác suất) |
| **"The Bitcoin Backbone Protocol"** | 2015 | Garay, Kiayias, Leonardos | Phân tích hình thức độ an toàn của giao thức đồng thuận Bitcoin |
| **"Consensus in the Age of Blockchains"** | 2017 | Cachin, Vukolić | Khảo sát tổng quan các cơ chế đồng thuận trong blockchain |
| **"Tendermint: Consensus without Mining"** | 2014 | Jae Kwon | Đồng thuận BFT cho blockchain công khai không cần đào |
| **"Casper the Friendly Finality Gadget"** | 2017 | Buterin, Griffith | Cơ chế tính chung cuộc PoS của Ethereum |

**Lộ trình đọc gợi ý**:
1. Khởi đầu: *The Byzantine Generals Problem* (hiểu bản chất thách thức).
2. Cổ điển: Paxos / Raft (đồng thuận CFT).
3. BFT: Bài báo PBFT (đồng thuận BFT có cấp phép).
4. Blockchain: Whitepaper Bitcoin kết hợp *The Bitcoin Backbone Protocol* (BFT không cần cấp phép).
5. Hiện đại: Tendermint, Casper (các hướng tiếp cận mới).

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Mô tả | Nguồn | Ghi chú |
|-------------|--------|-------|
| **Minh họa bài toán các tướng Byzantine** | [The Byzantine Generals Problem (Lamport et al.)](https://lamport.azurewebsites.net/pubs/byz.pdf) | Bài báo gốc kèm sơ đồ |
| **Luồng giao thức PBFT** | [PBFT paper (Castro & Liskov)](http://pmg.csail.mit.edu/papers/osdi99.pdf) | Minh họa quy trình ba pha |
| **Biểu đồ định lý CAP** | [Visual Guide to NoSQL Systems](http://blog.nahurst.com/visual-guide-to-nosql-systems) | Minh họa ngắn gọn, dễ hiểu |
| **Đồng thuận Nakamoto** | [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/block_chain.html) | Cơ chế chọn chuỗi và xử lý fork |
| **Nhân bản máy trạng thái** | [Raft visualization](https://raft.github.io/) | Hoạt họa tương tác |
| **Trực giác về định lý bất khả FLP** | [The Morning Paper - FLP](https://blog.acolyer.org/2015/03/01/impossibility-of-distributed-consensus-with-one-faulty-process/) | Diễn giải dễ tiếp cận |

**Công cụ tương tác**:
- [Raft Consensus Simulator](https://raft.github.io/raftscope/index.html) — Minh họa quá trình bầu chọn leader.
- [PBFT Simulator](http://www.pbft.org/) — Quan sát giao thức cam kết ba pha.
- [Bitcoin Fork Simulator](https://anders.com/blockchain/blockchain.html) — Mô phỏng cách giải quyết phân nhánh chuỗi.

---

## 10. Tóm tắt và điểm chính

**Khái niệm cốt lõi**:
1. Đồng thuận trong hệ thống phân tán là bài toán khó về mặt lý thuyết (định lý bất khả FLP).
2. Khả năng chịu lỗi Byzantine cổ điển yêu cầu tổng số nút \( n \geq 3f + 1 \).
3. Blockchain sử dụng đồng thuận theo xác suất kết hợp với cơ chế khuyến khích kinh tế.
4. Các hệ thống phân tán phải cân bằng giữa tính nhất quán mạnh và tính sẵn sàng (định lý CAP).

**Phân loại cơ chế đồng thuận**:
- **Cổ điển (Paxos, Raft)**: Có cấp phép, CFT, tính chung cuộc mạnh.
- **BFT (PBFT)**: Có cấp phép, chịu lỗi Byzantine, độ phức tạp truyền tin \( O(n^2) \).
- **Nakamoto (PoW)**: Không cần cấp phép, tính chung cuộc theo xác suất, chống tấn công Sybil.
- **Hiện đại (PoS, Tendermint)**: Kết hợp nguyên lý BFT với mô hình tham gia mở.

**Điểm đáng lưu ý**:
- Blockchain đánh đổi tính chung cuộc tức thời để đạt được tính mở.
- Độ an toàn được neo vào chi phí kinh tế (PoW) hoặc tài sản đặt cược (PoS).
- Giả định về mạng (đồng bộ hay bất đồng bộ) quyết định trực tiếp thiết kế thuật toán.
- Đồng thuận tuyệt đối là bất khả thi trong mạng bất đồng bộ, nhưng đồng thuận thực tiễn vẫn khả thi khi nới lỏng các giả định hợp lý.

**Nền tảng toán học**:
- Cận BFT: \( f < n/3 \).
- Độ an toàn PoW: xác suất tấn công thành công giảm theo hàm mũ khi số xác nhận tăng.
- Giao của hai quorum: \( |Q_1 \cap Q_2| \geq f + 1 \).

---

✅ **Kết thúc Lecture 00.01**

**Bài tiếp theo**: Lecture 00.02 - Hàm băm mật mã chuyên sâu

---

## Video tham khảo

- **Xem trước:** [Distributed Systems 2.2: The Byzantine generals problem](https://www.youtube.com/watch?v=LoGx_ldRBU0) — Martin Kleppmann, tiếng Anh. Martin Kleppmann trình bày bài toán các tướng Byzantine; nên xem trước khi đọc định nghĩa lỗi Byzantine và ngưỡng một phần ba.
- [Impossibility of Consensus](https://www.youtube.com/watch?v=2fnS-f-mwIo) — Computational Thinking, tiếng Anh. Giải thích tính bất khả của đồng thuận, tương ứng với phần nối FLP với mô hình đồng bộ một phần.
- [\[CS198.2x Week 1\] Practical Byzantine Fault Tolerance](https://www.youtube.com/watch?v=IafgKJN3nwU) — Blockchain at BerkeleyX, tiếng Anh. Bài giảng của BerkeleyX đi qua thuật toán Practical Byzantine Fault Tolerance làm nền cho mục kỹ thuật của bài.

## References

1. Fischer, M. J., Lynch, N. A., & Paterson, M. S. (1985). Impossibility of distributed consensus with one faulty process. *Journal of the ACM*, 32(2), 374-382.
2. Lamport, L., Shostak, R., & Pease, M. (1982). The Byzantine generals problem. *ACM Transactions on Programming Languages and Systems*, 4(3), 382-401.
3. Castro, M., & Liskov, B. (1999). Practical byzantine fault tolerance. *OSDI*, 99, 173-186.
4. Nakamoto, S. (2008). Bitcoin: A peer-to-peer electronic cash system.
5. Garay, J., Kiayias, A., & Leonardos, N. (2015). The bitcoin backbone protocol: Analysis and applications. *EUROCRYPT 2015*.
6. Cachin, C., & Vukolić, M. (2017). Blockchain consensus protocols in the wild. *arXiv:1707.01873*.
