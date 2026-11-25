---
layout: post
title: "Lecture 05.03: Formal Verification - Proving Smart Contract Correctness"
chapter: '05'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Bài giảng 05.03: Xác minh hình thức — Chứng minh tính đúng đắn của hợp đồng thông minh bằng toán học

Nhà khoa học máy tính huyền thoại Edsger Dijkstra từng nói một câu bất hủ: *"Kiểm thử phần mềm (testing) có thể cho thấy sự tồn tại của lỗi, nhưng không bao giờ chứng minh được sự vắng mặt của lỗi."* Với một hợp đồng thông minh DeFi quản lý hàng tỷ đô la, bạn có thể viết 10.000 bài unit test và tất cả đều xanh — nhưng chỉ cần **một đầu vào kỳ dị duy nhất** trong số $$2^{256}$$ khả năng phá vỡ bất biến thanh khoản, toàn bộ giao thức vẫn có thể bốc hơi!

**Xác minh hình thức (Formal Verification)** bước vào đúng khoảng trống đó: thay vì thử vài nghìn ca kiểm thử rời rạc, ta dịch mã nguồn hợp đồng sang ngôn ngữ logic toán học và **chứng minh định lý** rằng các tính chất an toàn luôn đúng cho *mọi* đầu vào và *mọi* trình tự giao dịch có thể xảy ra.

---

## Kiến thức cần nhớ: Xác minh Hình thức dựa trên những nhánh toán học nào?

1. **Logic Hoare ($$\{P\}\, C\, \{Q\}$$) & Bất biến hệ thống:** Đặc tả toán học nói rằng nếu tiền điều kiện $$P$$ đúng trước khi chạy lệnh $$C$$, thì hậu điều kiện $$Q$$ chắc chắn đúng sau khi $$C$$ kết thúc. Trong DeFi, bất biến cốt lõi thường là *"tổng số dư mọi tài khoản luôn bằng tổng cung token"*.
2. **Thực thi tượng trưng & Bộ giải SMT (Symbolic Execution — Z3):** Thay biến đầu vào bằng ký hiệu đại số $$x, y$$ rồi đưa mọi nhánh điều kiện vào bộ giải thỏa mãn công thức (SMT Solver). Nếu tồn tại dù chỉ 1 đầu vào phá vỡ bất biến, bộ giải sẽ tự động in ra đúng **phản ví dụ tấn công**!
3. **Kiểm tra mô hình (Model Checking):** Duyệt có hệ thống toàn bộ đồ thị trạng thái hữu hạn của giao thức (đặc biệt hữu ích cho cơ chế đồng thuận và giao thức nhiều bên).
4. **Trợ lý chứng minh định lý (Interactive Theorem Provers — Coq, Lean, Isabelle):** Chứng minh bằng máy hoàn chỉnh từng bước logic cho các hệ thống siêu trọng yếu (như lõi compiler, mạch ZK và hợp đồng cầu nối).

---

## 1. Tổng quan về khái niệm

**Xác minh hình thức (formal verification)** là phương pháp tiếp cận toán học chặt chẽ nhằm đảm bảo tính đúng đắn của phần mềm, đặc biệt quan trọng đối với hợp đồng thông minh nơi một lỗi nhỏ có thể gây thiệt hại tài chính không thể đảo ngược. Khác với kiểm thử truyền thống vốn chỉ xác nhận chương trình hoạt động đúng trên các đầu vào cụ thể, xác minh hình thức chứng minh bằng toán học rằng chương trình hành xử đúng với **mọi đầu vào có thể xảy ra**. Sự khác biệt này mang ý nghĩa quan trọng trong bối cảnh blockchain, bởi hợp đồng thông minh quản lý lượng tài sản hàng tỷ USD, được triển khai bất biến và luôn đối mặt với những kẻ tấn công có động cơ kinh tế rất lớn.

Phát triển phần mềm truyền thống chủ yếu dựa vào kiểm thử — chạy chương trình với nhiều đầu vào khác nhau và đối chiếu kết quả. Kiểm thử giúp phát hiện lỗi nhưng không thể chứng minh sự vắng mặt của lỗi. Nhà khoa học máy tính **Edsger Dijkstra** từng nhận định rằng kiểm thử chương trình chỉ có thể chứng minh sự tồn tại của lỗi, chứ không bao giờ chứng minh được rằng chương trình không có lỗi. Với ứng dụng thông thường, điều này có thể chấp nhận được vì lỗi có thể vá và thiệt hại thường có giới hạn. Ngược lại, hợp đồng thông minh không thể sửa trực tiếp sau khi triển khai, khiến lỗ hổng tồn tại vĩnh viễn cùng rủi ro tài chính rất cao.

Xác minh hình thức bắt nguồn từ khoa học máy tính hàn lâm, gắn liền với công trình của **Tony Hoare** về tính đúng đắn của chương trình trong thập niên 1960–1970. Hoare đã đưa ra **ngữ nghĩa tiên đề (axiomatic semantics)** và **logic Hoare** — khuôn khổ toán học để suy luận về chương trình. Với tiền điều kiện \(P\), chương trình \(S\) và hậu điều kiện \(Q\), bộ ba Hoare \(\{P\} S \{Q\}\) phát biểu rằng: nếu \(P\) đúng trước khi thực thi \(S\), thì \(Q\) sẽ đúng sau khi \(S\) kết thúc. Việc chứng minh chương trình đúng quy về việc chứng minh mọi bộ ba Hoare liên quan đều hợp lệ.

Nhu cầu ứng dụng xác minh hình thức cho hợp đồng thông minh trở nên cấp thiết sau vụ tấn công The DAO năm 2016. Việc **50 triệu USD bị đánh cắp** qua lỗ hổng tái nhập cho thấy kiểm thử đơn thuần là chưa đủ đối với các hợp đồng quản lý giá trị lớn. Cộng đồng nghiên cứu đã phát triển nhiều công cụ chuyên biệt cho lĩnh vực này: **Runtime Verification** xây dựng **K Framework** để hình thức hóa ngữ nghĩa EVM; **Certora** phát triển **Certora Prover** cho Solidity; **Trail of Bits** tạo ra **Manticore** phục vụ thực thi ký hiệu (symbolic execution); cùng các hệ thống hàn lâm như **Why3**, **Isabelle/HOL** và **Coq**.

Mỗi phương pháp xác minh mang lại mức độ đảm bảo và sự đánh đổi riêng:
- **Kiểm tra mô hình (Model checking)** duyệt toàn bộ không gian trạng thái, nhưng chủ yếu khả thi với các hợp đồng nhỏ.
- **Chứng minh định lý (Theorem proving)** đòi hỏi xây dựng chứng minh thủ công, mang lại mức đảm bảo cao nhất nhưng yêu cầu chuyên môn sâu.
- **Thực thi ký hiệu (Symbolic execution)** phân tích các nhánh thực thi dưới dạng biểu thức ký hiệu để tìm trường hợp vi phạm thuộc tính.
- **Xác minh thời gian chạy (Runtime verification)** giám sát quá trình thực thi để phát hiện vi phạm trực tiếp.

Các tiêu chuẩn xung quanh hợp đồng thông minh đã xác minh ngày càng rõ nét hơn. **Bảo mật token ERC-20** là trọng tâm phổ biến, với các đặc tả hình thức định nghĩa hành vi kỳ vọng (chẳng hạn lệnh chuyển tiền bảo toàn tổng cung, lệnh `approve` không làm thay đổi số dư). Nhiều giao thức DeFi như Aave, Compound và MakerDAO đều áp dụng các phương pháp hình thức ở những mức độ khác nhau trước khi ra mắt. Các giao thức bảo hiểm như **Nexus Mutual** cũng xem xét kết quả kiểm toán có kèm xác minh hình thức khi định giá mức phí bảo hiểm.

Tuy nhiên, việc đưa xác minh hình thức vào quy trình phát triển vẫn gặp nhiều thách thức. Phương pháp này đòi hỏi viết đặc tả thật chính xác, phát biểu thuộc tính dưới dạng hình thức và vận hành chuỗi công cụ phức tạp. Phần lớn lập trình viên blockchain chưa được đào tạo bài bản về phương pháp hình thức, trong khi chi phí triển khai (tốn hàng tuần đến hàng tháng) khó lượng hóa lợi ích cho đến khi sự cố xảy ra. Dù vậy, các giao thức có giá trị lớn ngày càng coi xác minh hình thức là khoản đầu tư cần thiết.

---

## 2. Hiểu biết trực quan

Để hình dung trực quan về xác minh hình thức, hãy so sánh với kiểm thử truyền thống qua một ví dụ cụ thể. Xét một hàm cộng hai số. Kiểm thử truyền thống thử các cặp đầu vào mẫu (`1+2=3`, `10+5=15`, `100+200=300`) và kiểm tra kết quả. Sau 1.000 ca kiểm thử đạt yêu cầu, ta có mức độ tin cậy nhất định, nhưng không thể kiểm tra toàn bộ không gian đầu vào — với số nguyên 256-bit, có tới \(2^{512}\) cặp đầu vào khác nhau, nhiều hơn số nguyên tử trong vũ trụ, nên một lỗi ẩn vẫn có thể tồn tại ở tổ hợp chưa từng được thử.

Ngược lại, xác minh hình thức chứng minh hàm đúng cho **tất cả** đầu vào bằng toán học. Đặc tả phát biểu: "Hàm trả về tổng của hai đầu vào", và phép chứng minh cho thấy với mọi \(a\) và \(b\), hàm luôn trả về \(a+b\). Với phép cộng đơn giản, chứng minh rất ngắn gọn; với hợp đồng thông minh có máy trạng thái phức tạp, quá trình chứng minh khó hơn nhiều nhưng mang lại mức độ chắc chắn mà kiểm thử đơn thuần không thể đạt tới.

Xét hợp đồng quản lý số dư token với hàm `transfer`. Kiểm thử chỉ kiểm tra các kịch bản cụ thể như Alice chuyển 10 token cho Bob hoặc Charlie chuyển 100 token cho David. Xác minh hình thức chứng minh các thuộc tính tổng quát cho mọi trạng thái và mọi giao dịch: hàm chuyển tiền không bao giờ tự tạo ra token mới (bảo toàn), chuyển từ Alice sang Bob luôn giảm số dư của Alice và tăng số dư của Bob đúng một lượng bằng nhau (chuyển trạng thái đúng), và tổng cung luôn bất biến qua mọi lần chuyển (bảo toàn bất biến).

Phép so sánh với kỹ thuật xây cầu cũng làm rõ giá trị này. Kiểm thử một cây cầu giống như cho xe tải chạy qua để đo độ chịu tải và tìm lỗi hiển nhiên — cách này không thể đảm bảo cầu an toàn dưới mọi tổ hợp tải trọng hay điều kiện thời tiết hiếm gặp. Trong khi đó, các tính toán kỹ thuật dựa trên định luật vật lý và đặc tính vật liệu chứng minh cây cầu chịu được tải trọng thiết kế tối đa. Tương tự, xác minh hình thức dùng logic và toán học để chứng minh hợp đồng xử lý đúng mọi kịch bản.

Quy trình xác minh có nét tương đồng với phản biện khoa học (peer review). Khi nhà nghiên cứu công bố một định lý, người phản biện kiểm tra từng bước suy luận từ các tiên đề để xác nhận chứng minh hợp lệ. Trong xác minh hình thức, lập trình viên phát biểu thuộc tính mà hợp đồng phải thỏa mãn, còn công cụ xác minh tự động kiểm tra chứng minh, loại bỏ sai sót chủ quan của con người trong khâu kiểm duyệt.

Các thuộc tính thường được xác minh chia thành bốn nhóm chính:
- **Thuộc tính an toàn (Safety properties)**: Đảm bảo "điều xấu không xảy ra" (không tái nhập, không tràn số, không truy cập trái phép).
- **Thuộc tính sống (Liveness properties)**: Đảm bảo "điều tốt cuối cùng sẽ xảy ra" (hàm luôn kết thúc, giao dịch hợp lệ cuối cùng được xử lý).
- **Tính đúng đắn chức năng (Functional correctness)**: Chứng minh mã nguồn khớp chính xác với đặc tả.
- **Thuộc tính kinh tế (Economic properties)**: Xác minh cơ chế khuyến khích vững chắc theo lý thuyết trò chơi.

---

## 3. Nền tảng kỹ thuật

Nền tảng của xác minh hình thức là **ngữ nghĩa hình thức (formal semantics)** — định nghĩa toán học chính xác cho ý nghĩa của từng câu lệnh trong ngôn ngữ lập trình. Ngữ nghĩa EVM mô tả chính xác từng mã lệnh (opcode) làm gì, thay đổi trạng thái ra sao và tiêu tốn bao nhiêu gas. Dự án **KEVM** đã hình thức hóa ngữ nghĩa EVM bằng K Framework, tạo ra một đặc tả hình thức có thể thực thi vừa đóng vai trò tài liệu, vừa làm cơ sở cho xác minh.

**Logic Hoare** cung cấp khung suy luận cho các chương trình mệnh lệnh. Bộ ba Hoare \(\{P\} S \{Q\}\) khẳng định rằng nếu tiền điều kiện \(P\) đúng trước khi thực thi \(S\), thì hậu điều kiện \(Q\) đúng sau khi thực thi \(S\). Các quy tắc suy diễn cho phép ghép nhiều bộ ba để suy luận về chương trình lớn hơn:

**Ghép tuần tự (Sequential composition)**:
\[
\frac{\{P\} S_1 \{Q\}, \quad \{Q\} S_2 \{R\}}{\{P\} S_1; S_2 \{R\}}
\]

**Rẽ nhánh có điều kiện (Conditional)**:
\[
\frac{\{P \land B\} S_1 \{Q\}, \quad \{P \land \neg B\} S_2 \{Q\}}{\{P\} \text{if } B \text{ then } S_1 \text{ else } S_2 \{Q\}}
\]

**Bất biến vòng lặp (Loop invariant)**:
\[
\frac{\{I \land B\} S \{I\}}{\{I\} \text{while } B \text{ do } S \{I \land \neg B\}}
\]

Trong đó \(I\) là bất biến vòng lặp — thuộc tính luôn đúng sau mỗi lần lặp.

Áp dụng cho Solidity với một hàm `transfer` đơn giản:

```solidity
function transfer(address to, uint amount) public {
    require(balances[msg.sender] >= amount);  // Precondition
    balances[msg.sender] -= amount;
    balances[to] += amount;
    // Postcondition: balances preserved
}
```

Đặc tả hình thức tương ứng:
\[
\begin{align}
P: & \quad \text{balances}[sender] \geq amount \\
Q: & \quad \text{balances}'[sender] = \text{balances}[sender] - amount \\
   & \quad \land \text{balances}'[to] = \text{balances}[to] + amount \\
   & \quad \land \sum \text{balances}' = \sum \text{balances}
\end{align}
\]

Các nghĩa vụ chứng minh (proof obligations) sẽ kiểm tra rằng từng dòng lệnh đều bảo toàn các quan hệ đã nêu.

**Thực thi ký hiệu (Symbolic execution)** duyệt các nhánh thực thi bằng biến ký hiệu (\(x\), \(y\)) thay vì giá trị cụ thể (5, 10). Các điều kiện rẽ nhánh được tích lũy thành hệ ràng buộc ký hiệu. Cuối mỗi nhánh, bộ giải ràng buộc (SMT solver) kiểm tra xem có tồn tại giá trị đầu vào nào khiến **điều kiện khẳng định (assertion) bị vi phạm** hay không: nếu tìm thấy nghiệm thỏa mãn trạng thái lỗi (SAT), tức là tồn tại lỗi kèm phản ví dụ; nếu vô nghiệm (UNSAT), nhánh đó an toàn.

```python
def symbolic_execution_example():
    """Illustrate symbolic execution concept"""
    
    # Concrete execution:
    x = 5
    if x > 3:
        y = x * 2  # y = 10
    else:
        y = x + 1
    assert y < 15  # Passes for x = 5
    
    # Symbolic execution: check if violation (y >= 15) is reachable
    x = Symbol('x')  # x is symbolic variable
    
    # Path 1: x > 3
    path1_condition = (x > 3)
    path1_y = x * 2
    path1_violation = (path1_y >= 15)
    # Combine: (x > 3) ∧ (x * 2 >= 15) => x >= 7.5
    # Satisfiable (e.g., x = 8 -> y = 16 >= 15) - BUG FOUND!
    
    # Path 2: x ≤ 3
    path2_condition = (x <= 3)
    path2_y = x + 1
    path2_violation = (path2_y >= 15)
    # Combine: (x ≤ 3) ∧ (x + 1 >= 15) => (x ≤ 3) ∧ (x >= 14)
    # Unsatisfiable (UNSAT) - PATH SAFE
    
    # Result: Path 1 has a counterexample (x >= 7.5), so assertion fails!
```

**Kiểm tra mô hình (Model checking)** duyệt toàn bộ không gian trạng thái. Hợp đồng thông minh được mô hình hóa thành máy hữu hạn trạng thái, còn các thuộc tính được biểu diễn bằng logic thời gian (temporal logic). Bộ kiểm tra mô hình duyệt có hệ thống các trạng thái đạt được để xác minh thuộc tính luôn đúng. Phương pháp này hiệu quả ở mức giao thức nhưng đối mặt với hiện tượng **bùng nổ trạng thái (state explosion)** vì số trạng thái tăng theo hàm mũ theo số biến. Các kỹ thuật trừu tượng hóa giúp giảm kích thước mô hình bằng cách gom nhóm các trạng thái tương tự, đổi lại một phần độ chính xác để bài toán có thể giải được.

**Chứng minh định lý (Theorem proving)** mã hóa chương trình và thuộc tính trong các trình trợ giúp chứng minh (như Coq, Isabelle, Lean), sau đó xây dựng chứng minh hình thức theo cách tương tác. Trình trợ giúp sẽ kiểm tra từng bước suy luận để đảm bảo tính chặt chẽ tuyệt đối. Những thành tựu nổi bật của hướng tiếp cận này gồm **CompCert** (trình biên dịch C được xác minh hình thức) và **seL4** (vi nhân hệ điều hành được xác minh hình thức). Trong lĩnh vực hợp đồng thông minh, một số dự án nghiên cứu cũng đã dùng Coq để chứng minh các thuộc tính của chuẩn ERC-20.

---

## 4. Công thức toán học và mật mã học

Đặc tả hình thức yêu cầu phát biểu hành vi mong muốn bằng ngôn ngữ toán học chính xác. Với token ERC-20, bất biến nền tảng là tổng số dư của mọi địa chỉ luôn bằng tổng cung:

\[
\forall t: \quad \sum_{a \in \text{addresses}} \text{balanceOf}(a, t) = \text{totalSupply}
\]

Hàm `transfer` phải bảo toàn bất biến này:

\[
\{B_1 + B_2 = S\} \quad \text{transfer}(from, to, v) \quad \{B_1' + B_2' = S\}
\]

Trong đó \(B_1 = \text{balanceOf}(from)\), \(B_2 = \text{balanceOf}(to)\), và \(S = \text{totalSupply}\).

Khai triển biểu thức:
\[
\begin{align}
B_1' &= B_1 - v \\
B_2' &= B_2 + v \\
B_1' + B_2' &= (B_1 - v) + (B_2 + v) = B_1 + B_2 = S \quad \checkmark
\end{align}
\]

Như vậy, bất biến được bảo toàn.

Đối với việc xác minh chống tái nhập, ta cần chứng minh cập nhật trạng thái diễn ra trước khi thực hiện lời gọi ra bên ngoài. Biểu diễn bằng logic Hoare:

```
{balances[sender] = B}
balances[sender] -= amount;
{balances[sender] = B - amount}  // State updated
(bool success,) = recipient.call{value: amount}("");
{balances[sender] = B - amount}  // Still holds - no reentry possible
```

So với mã chứa lỗ hổng:
```
{balances[sender] = B}
recipient.call{value: amount}("");
// Reentry possible! balances[sender] still B
balances[sender] -= amount;
```

Chứng minh hình thức cho thấy phiên bản thứ hai cho phép nhiều lần rút tiền diễn ra trước khi trạng thái kịp cập nhật, làm vi phạm bất biến của hợp đồng.

---

### Giải thích: tự tay chứng minh bất biến bằng Logic Hoare — và bắt một lỗ hổng "in tiền vô hạn"

Xét một hàm chuyển token trông cực kỳ vô hại:

```text
b1 := bal[from];
b2 := bal[to];
bal[from] := b1 - amt;
bal[to]   := b2 + amt;
```

Ta muốn chứng minh bất biến bảo toàn tổng cung $$I:\ \sum_i \text{bal}[i] = S$$ dưới tiền điều kiện $$P:\ I \land (\text{bal}[\text{from}] \ge \text{amt} \ge 0)$$.

1. **Trường hợp 1 — Khi $$\text{from} \neq \text{to}$$:**
   Sau hai phép gán, tổng mới là:
   $$
   S' = S - \text{bal}[\text{from}] - \text{bal}[\text{to}] + (b_1 - \text{amt}) + (b_2 + \text{amt}) = S.
   $$
   Bất biến $$I$$ được **chứng minh đúng tuyệt đối** cho mọi số nguyên $$b_1, b_2, \text{amt}$$!
2. **Trường hợp 2 — Bỏ sót điều kiện $$\text{from} \neq \text{to}$$ (bộ giải SMT bắt sống lỗi!):**
   Nếu kẻ tấn công gọi `transfer(Alice, Alice, 100)` với số dư ban đầu `bal[Alice] = 100`:
   - `b1 = 100`, `b2 = 100`.
   - `bal[Alice] := 100 - 100 = 0`.
   - `bal[Alice] := 100 + 100 = 200` (**ghi đè lên chính `bal[Alice]`!**).
   - Tổng cung mới $$S' = S + 100 \neq S$$ — kẻ tấn công vừa **tự nhân đôi tài sản vô hạn** chỉ bằng cách tự chuyển tiền cho chính mình!

Chỉ một điều kiện nhỏ `from != to` mà unit test thông thường rất dễ quên, nhưng khi viết bộ ba Hoare $$\{P\}\,C\,\{Q\}$$ cho bộ giải SMT, máy tính lập tức chỉ ra phản ví dụ `from = to = Alice, amt = 100` trong chưa tới 1 mili-giây!

## 5. Góc nhìn triển khai

```python
from z3 import *

def verify_transfer_preserves_total():
    """
    Use Z3 SMT solver to verify transfer preserves total supply
    """
    
    # Define symbolic variables
    balance_from = Int('balance_from')
    balance_to = Int('balance_to')
    amount = Int('amount')
    
    # Define solver
    solver = Solver()
    
    # Preconditions
    solver.add(balance_from >= amount)  # Sufficient balance
    solver.add(balance_from >= 0)
    solver.add(balance_to >= 0)
    solver.add(amount >= 0)
    
    # Compute new balances
    new_balance_from = balance_from - amount
    new_balance_to = balance_to + amount
    
    # Property to verify: Total preserved
    total_before = balance_from + balance_to
    total_after = new_balance_from + new_balance_to
    
    # Check if total can differ (should be UNSAT - impossible)
    solver.add(total_before != total_after)
    
    result = solver.check()
    
    if result == unsat:
        print("✓ VERIFIED: Transfer always preserves total supply")
        print("  Mathematical proof complete")
    elif result == sat:
        print("✗ VIOLATION FOUND:")
        model = solver.model()
        print(f"  balance_from: {model[balance_from]}")
        print(f"  balance_to: {model[balance_to]}")
        print(f"  amount: {model[amount]}")
    else:
        print("? Unknown (solver timeout)")

if __name__ == "__main__":
    print("=== Formal Verification Example ===\n")
    verify_transfer_preserves_total()
```

Trong thực tế sản xuất, một công cụ xác minh hình thức tiêu biểu sử dụng bộ giải SMT là **Certora Prover**:

```
// Certora specification language (CVL)
invariant totalSupplyInvariant()
    to_mathint(totalSupply()) == sum(balances);

rule transferPreservesTotal(address from, address to, uint amount) {
    mathint totalBefore = totalSupply();
    
    transfer(from, to, amount);
    
    mathint totalAfter = totalSupply();
    
    assert totalBefore == totalAfter, "Total supply changed!";
}
```

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Thách thức đặc tả (Specification challenge)**: Các thuộc tính cần kiểm chứng phải được phát biểu đúng và đầy đủ. Một đặc tả thiếu sót có thể tạo ra cảm giác an toàn giả tạo — hợp đồng được chứng minh đúng nhưng chỉ trên một tập thuộc tính chưa hoàn chỉnh. Chẳng hạn, hợp đồng The DAO vẫn có thể vượt qua xác minh nếu đặc tả bỏ sót ràng buộc về tái nhập. Việc xác định đúng các thuộc tính cốt lõi đòi hỏi trình độ chuyên môn cao.
- **Bùng nổ trạng thái (State explosion)**: Hạn chế phạm vi áp dụng của kiểm tra mô hình. Một hợp đồng có \(n\) biến logic đã có \(2^n\) trạng thái; khi có thêm các biến số nguyên 256-bit, không gian trạng thái trở nên khổng lồ. Các kỹ thuật trừu tượng hóa giúp giảm tải nhưng có thể gây sai lệch tinh vi giữa mô hình trừu tượng và mã triển khai thực tế.
- **Bài toán chi phí — lợi ích**: Xác minh hình thức đòi hỏi nhiều tuần đến nhiều tháng làm việc của chuyên gia cùng công cụ và tài nguyên tính toán chuyên dụng, trong khi hiệu quả phòng ngừa khó thấy rõ cho đến khi sự cố xảy ra. Với hợp đồng nhỏ, chi phí có thể vượt quá mức rủi ro; với các giao thức quản lý hàng tỷ USD, khoản đầu tư này là hợp lý, còn ở nhóm dự án tầm trung, ngưỡng quyết định vẫn chưa rõ ràng.

---

## 7. Các khái niệm liên quan

- **Tổng hợp chương trình (Program synthesis)**: Thay vì viết mã rồi mới xác minh, lập trình viên định nghĩa đặc tả hình thức và bộ tổng hợp sẽ tự động sinh mã nguồn đảm bảo thỏa mãn đặc tả đó. Hướng nghiên cứu này đang phát triển nhưng mới phù hợp với các hợp đồng đơn giản, còn gặp khó khăn trước logic nghiệp vụ phức tạp.
- **Giám sát thời gian chạy (Runtime monitoring)**: Bổ sung cho xác minh tĩnh bằng cách chèn các kiểm tra bất biến ngay trong quá trình thực thi. Nếu phát hiện vi phạm, giao dịch lập tức dừng lại để ngăn thiệt hại. Đánh đổi là phát sinh thêm chi phí gas, nhưng tạo thêm lớp phòng thủ khi xác minh tĩnh chưa bao phủ hết.
- **Mã mang theo chứng minh (Proof-carrying code)**: Bytecode của hợp đồng khi triển khai đi kèm với một chứng minh tính đúng đắn có thể kiểm tra bằng máy. Các trình xác thực kiểm tra chứng minh trước khi chấp nhận triển khai hợp đồng. Đây là hướng nghiên cứu giàu tiềm năng nhưng việc triển khai thực tế vẫn còn nhiều rào cản.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"An Axiomatic Basis for Computer Programming"** | 1969 | C.A.R. Hoare | Nền tảng logic Hoare |
| **"KEVM: Semantics of EVM in K"** | 2018 | Everett Hildenbrandt và cộng sự | Ngữ nghĩa hình thức của EVM |
| **"Formal Verification of Smart Contracts"** | 2016 | Bhargavan và cộng sự | Nghiên cứu sớm về xác minh hợp đồng thông minh |
| **"Certora Prover: Formal Verification for Solidity"** | 2020 | Đội ngũ Certora | Công cụ xác minh hình thức trong công nghiệp |
| **"Runtime Verification of Ethereum Smart Contracts"** | 2018 | Joshua Ellul, Gordon Pace | Phương pháp giám sát thời gian chạy |

---

## 9. Minh họa và tài liệu trực quan

### Ví dụ logic Hoare
```
{x > 0}           // Precondition
y := x + 1
{y > 1}           // Postcondition

Proof: If x > 0, then x + 1 > 1 ✓
```

### Quy trình xác minh
```
Smart Contract
      ↓
  Specification (properties to verify)
      ↓
  Verification Tool (Z3, Certora, etc.)
      ↓
   Verified ✓ or Bug Found ✗
```

*Nguồn: [Certora Documentation](https://docs.certora.com/)*

---

## 10. Tóm tắt

Xác minh hình thức mang lại các đảm bảo toán học về tính đúng đắn của hợp đồng thông minh mà kiểm thử truyền thống không thể cung cấp. Nhờ các kỹ thuật như logic Hoare, thực thi ký hiệu, kiểm tra mô hình và chứng minh định lý, nhóm phát triển có thể chứng minh hợp đồng thỏa mãn những thuộc tính cốt lõi trên toàn bộ không gian đầu vào và trạng thái. Dù còn đối mặt với khó khăn về viết đặc tả, bùng nổ trạng thái và yêu cầu nhân lực chuyên sâu, phương pháp này ngày càng trở thành thành phần thiết yếu cho các giao thức giá trị lớn do tính bất biến của mã hợp đồng trên chuỗi.

Các công cụ như Certora Prover, K Framework và Z3 giúp quá trình xác minh tiếp cận gần hơn với thực tế sản xuất. Nắm vững nền tảng xác minh hình thức giúp kỹ sư vừa đánh giá tốt hơn độ an toàn của các hợp đồng hiện có, vừa thiết kế được những giao thức mới có cơ sở chứng minh chặt chẽ.

---

**Kết thúc bài giảng**

Bài tiếp theo: Lecture 05.04 — Post-Quantum Cryptography

---

## Video tham khảo

- **Xem trước:** [What is Certora and Formal Verification - Simply Explained](https://www.youtube.com/watch?v=8ON0Vpo7zls) — JohnnyTime, tiếng Anh. Giới thiệu về Certora và ý nghĩa của việc chứng minh thuộc tính; nên xem trước khi đọc phần đặc tả hình thức.
- [Certora AutoProver Demo: How AutoProver Automates Formal Verification](https://www.youtube.com/watch?v=ZJ0KMwR_NvU) — Certora, tiếng Anh. Trình diễn AutoProver trên một đặc tả thực tế; đối chiếu với mục prover và bất biến trong bài.

## Tài liệu tham khảo

1. Hoare, C. A. R. (1969). *An axiomatic basis for computer programming*. Communications of the ACM, 12(10), 576-580.
2. Hildenbrandt, E., et al. (2018). *KEVM: A complete formal semantics of the Ethereum Virtual Machine*. CSF 2018.
3. Certora. (2020). *Certora Prover Documentation*. https://docs.certora.com/
4. Runtime Verification. (2018). *K Framework*. https://kframework.org/
