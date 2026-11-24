---
layout: post
title: "Lecture 06.00: Cross-Chain Communication - Kết nối các Blockchain"
chapter: '06'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter06
---

# Bài giảng 06.00: Giao tiếp xuyên chuỗi — Kết nối các Blockchain

Mỗi blockchain hoạt động như một hòn đảo khép kín hoàn hảo: các nút Ethereum biết chính xác từng wei trên Ethereum, nhưng hoàn toàn mù tịt trước việc một giao dịch có thật sự đã được xác nhận trên Bitcoin hay Solana hay chưa. Bởi giữa hai blockchain độc lập không hề tồn tại máy chủ trung tâm, không có đồng hồ chung và không chia sẻ bộ nhớ!

Làm thế nào để Chuỗi B tin tưởng một sự kiện vừa diễn ra trên Chuỗi A mà **không phải đặt niềm tin mù quáng vào một bên trung gian**? Đó chính là bài toán cốt lõi của **Giao tiếp Xuyên chuỗi (Cross-Chain Communication)** — nền móng kỹ thuật của mọi cầu nối tài sản, trao đổi nguyên tử và kiến trúc đa chuỗi hiện đại.

---

## Bản đồ kiến thức nền: Giao tiếp Xuyên chuỗi giải quyết bốn bài toán nền tảng nào?

1. **Xác minh trạng thái từ xa (Light Clients & Merkle Proofs):** Làm sao Chuỗi B chỉ cần lưu tiêu đề block (block header) nhỏ gọn của Chuỗi A và dùng bằng chứng cây Merkle (hoặc bằng chứng ZK) để kiểm chứng bất kỳ giao dịch nào của Chuỗi A.
2. **Phổ mô hình tin cậy (Trust Models):** Phân loại rõ các cơ chế từ yếu đến mạnh: tin vào 1 máy chủ tập trung → tin vào ủy ban Multisig/MPC → cơ chế lạc quan (Optimistic) → xác minh đồng thuận trực tiếp (Light Client / ZK Bridge).
3. **Tính nguyên tử xuyên chuỗi (Atomicity & HTLC):** Bảo đảm giao dịch hoán đổi hai chiều hoặc *cả hai bên cùng thành công*, hoặc *cả hai cùng hoàn tiền* (như Hash Time-Locked Contracts) — không bao giờ xảy ra cảnh một bên mất tiền còn bên kia chạy mất.
4. **Rủi ro tổ chức lại chuỗi (Reorg & Finality):** Xử lý sự khác biệt giữa tính hoàn tất xác suất (PoW như Bitcoin cần đợi 6 block) và tính hoàn tất tức thì (BFT như Cosmos/Ethereum PoS) để ngăn chặn chi tiêu kép xuyên chuỗi.

---

## 1. Tổng quan về khái niệm

**Khả năng tương tác xuyên chuỗi (blockchain interoperability)** — tức khả năng các blockchain khác nhau giao tiếp và trao đổi giá trị với nhau — là một trong những thách thức quan trọng nhất trong quá trình phát triển của hệ sinh thái blockchain. Hiện nay có hàng trăm blockchain hoạt động độc lập như Bitcoin, Ethereum, Binance Smart Chain, Solana, Polkadot hay Cosmos; mỗi mạng lưới vận hành như một "hòn đảo" tách biệt với cơ chế đồng thuận, chuẩn token và hệ sinh thái ứng dụng riêng. Sự phân mảnh này làm suy giảm trải nghiệm người dùng và hiệu quả sử dụng vốn.

Bối cảnh lịch sử của bài toán tương tác bắt đầu từ giai đoạn sơ khai của blockchain. Khi Bitcoin còn tồn tại đơn độc, vấn đề liên kết chuỗi chưa xuất hiện. Đến năm 2015, sự ra đời của Ethereum cùng hợp đồng thông minh và các chuẩn token mới đã tạo ra nhu cầu chuyển dịch giá trị giữa Bitcoin và Ethereum — người dùng muốn đưa thanh khoản Bitcoin vào các nền tảng DeFi trên Ethereum nhưng chưa có cơ chế bản địa nào hỗ trợ. Các giải pháp ban đầu còn thô sơ và tập trung, chủ yếu dựa vào sàn giao dịch trung gian hoặc cầu nối lưu ký (custodial bridges) đòi hỏi niềm tin vào bên thứ ba.

Giai đoạn 2017–2018 đánh dấu sự xuất hiện của **hoán đổi nguyên tử (atomic swaps)** như giải pháp xuyên chuỗi không cần tin cậy đầu tiên. Khái niệm này do **Tier Nolan** giới thiệu năm 2013 và được triển khai thực tế sau đó. Atomic swap sử dụng **Hợp đồng khóa băm theo thời gian (Hash Time-Locked Contracts — HTLCs)** để cho phép trao đổi ngang hàng giữa các chuỗi mà không cần trung gian: Alice trên Bitcoin có thể hoán đổi trực tiếp với Bob trên Litecoin với đảm bảo rằng hoặc cả hai giao dịch cùng thành công, hoặc cả hai cùng được hoàn tiền.

Từ năm 2018 đến 2020, các giao thức cầu nối (bridge) phát triển mạnh. **Wrapped Bitcoin (WBTC)** ra mắt năm 2019 và nhanh chóng trở thành tài sản xuyên chuỗi phổ biến — đây là token ERC-20 trên Ethereum được bảo chứng 1:1 bởi Bitcoin khóa trong hệ thống lưu ký. Dù tồn tại lo ngại về tính tập trung của đơn vị lưu ký, WBTC đã đưa hàng tỷ USD Bitcoin vào DeFi trên Ethereum, kéo theo nhiều tài sản bọc (wrapped assets) khác như renBTC, tBTC hay WETH với các mô hình tin cậy khác nhau.

Năm 2020, **Polkadot** và **Cosmos** mang đến hướng tiếp cận kiến trúc hoàn toàn khác: thiết kế khả năng tương tác ngay từ nền tảng thay vì bắc cầu cho các chuỗi có sẵn. Mô hình **parachain** của Polkadot cho phép các blockchain chuyên biệt dùng chung lớp bảo mật của relay chain và giao tiếp liền mạch, trong khi giao thức **IBC (Inter-Blockchain Communication)** của Cosmos định nghĩa chuẩn giao tiếp cho các chuỗi độc lập nhằm hình thành một "mạng internet của các blockchain".

Giai đoạn 2021–2024 chứng kiến sự bùng nổ của các cầu nối đi kèm hàng loạt sự cố bảo mật nghiêm trọng như Ronin (625 triệu USD), Poly Network (611 triệu USD) và Wormhole (325 triệu USD), với tổng thiệt hại vượt mốc 2 tỷ USD. Thực tế này thúc đẩy cộng đồng chuyển hướng nghiên cứu sang thiết kế cầu nối an toàn hơn, xác minh hình thức, các giao thức truyền thông điệp xuyên chuỗi và mô hình bảo mật chia sẻ.

---

## 2. Hiểu biết trực quan

Để hình dung rõ thách thức tương tác xuyên chuỗi, có thể xem các hệ sinh thái blockchain như những quốc gia độc lập có đồng tiền, luật pháp và ngôn ngữ riêng: Bitcoin như Hoa Kỳ dùng đồng USD, Ethereum như Liên minh châu Âu dùng đồng Euro, Solana như Nhật Bản dùng đồng Yên. Khi công dân của hai quốc gia muốn giao dịch với nhau, họ gặp nhiều rào cản về tỷ giá, quy định pháp lý và giao tiếp.

Trong thương mại quốc tế truyền thống, các bên trung gian như ngân hàng, đơn vị vận tải và hải quan đảm nhận vai trò kết nối. Cầu nối blockchain đóng vai trò tương tự cho việc chuyển tài sản và thông điệp giữa các chuỗi không tương thích. Tuy nhiên, việc đưa thêm bên trung gian lại mâu thuẫn với triết lý không cần tin cậy (trustless) của blockchain.

Xét tình huống cụ thể: Alice sở hữu Bitcoin và muốn tham gia giao thức DeFi Uniswap trên Ethereum. Hai mạng lưới này hoàn toàn tách biệt — không dùng chung trình xác thực, không đọc được trạng thái của nhau và không dùng chung ngôn ngữ thực thi. Alice không thể gửi trực tiếp Bitcoin sang địa chỉ Ethereum mà cần một cơ chế đại diện giá trị Bitcoin trên Ethereum.

- **Cách tiếp cận lưu ký**: Alice gửi Bitcoin tới một đơn vị lưu ký (chẳng hạn BitGo), đơn vị này đúc lượng WBTC tương ứng trên Ethereum cho Alice sử dụng trên Uniswap; khi rút, Alice đốt WBTC để nhận lại Bitcoin. Cách này đơn giản nhưng tạo ra điểm lỗi duy nhất (single point of failure) nếu bên lưu ký gian lận hoặc bị tấn công.
- **Cách tiếp cận không cần tin cậy (HTLC)**: Có thể hình dung HTLC như hai két an toàn có khóa thời gian. Alice và Bob cùng khóa tài sản vào hai két dùng chung một mã băm bí mật: két của Alice mở khi có bí mật hoặc tự hoàn tiền sau 48 giờ, còn két của Bob mở khi có cùng bí mật hoặc tự hoàn tiền sau 24 giờ. Khi Alice công bố bí mật để mở két của Bob, Bob lập tức nhìn thấy bí mật đó để mở két của Alice; nếu một bên không hợp tác, khóa thời gian sẽ hoàn tiền cho cả hai.
- **Khách nhẹ (Light clients)**: Cho phép hợp đồng trên chuỗi đích xác minh trạng thái của chuỗi nguồn mà không cần chạy nút đầy đủ — ví dụ hợp đồng Ethereum kiểm tra bằng chứng Merkle của giao dịch Bitcoin đối chiếu với tiêu đề khối (block header) Bitcoin. Phương pháp này không cần tin cậy bên thứ ba nhưng phức tạp và tốn chi phí gas.
- **Bảo mật chia sẻ (Shared security)**: Như mô hình parachain của Polkadot, có thể ví với Liên minh châu Âu có khung pháp lý và thể chế chung. Các chuỗi thành viên chuyên môn hóa theo từng ứng dụng nhưng được bảo vệ bởi cùng một tập trình xác thực, giúp giao tiếp xuyên chuỗi trở nên an toàn ngay từ thiết kế, đổi lại là giảm một phần quyền tự chủ của từng chuỗi.

---

## 3. Nền tảng kỹ thuật

Các giao thức giao tiếp xuyên chuỗi dựa trên một số thành phần kỹ thuật nền tảng. **Hợp đồng khóa băm theo thời gian (HTLC)** gồm hai hợp đồng liên kết trên hai blockchain khác nhau, kết hợp **khóa băm (hashlock)** (yêu cầu tiết lộ tiền ảnh bí mật để nhận tiền) và **khóa thời gian (timelock)** (hoàn tiền cho người gửi nếu quá hạn).

Trên Bitcoin, HTLC được cài đặt bằng ngôn ngữ Bitcoin Script với các mã lệnh như `OP_IF`, `OP_SHA256`, `OP_CHECKLOCKTIMEVERIFY` và `OP_CHECKSIG`:

```
OP_IF
    OP_SHA256 <hash> OP_EQUALVERIFY <pubkey_receiver> OP_CHECKSIG
OP_ELSE
    <timeout> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey_sender> OP_CHECKSIG
OP_ENDIF
```

Trên Ethereum, HTLC được cài đặt linh hoạt hơn bằng hợp đồng thông minh Solidity với ba hàm chính: `initiate()` (khóa tài sản kèm mã băm và thời hạn), `claim()` (nhận tài sản bằng cách cung cấp tiền ảnh bí mật) và `refund()` (hoàn tiền sau khi hết hạn):

```solidity
contract HTLC {
    struct Swap {
        address sender;
        address receiver;
        uint256 amount;
        bytes32 hash;
        uint256 timeout;
        bool completed;
        bool refunded;
    }
    
    mapping(bytes32 => Swap) public swaps;
    
    function initiate(
        address receiver,
        bytes32 hash,
        uint256 timeout
    ) external payable {
        bytes32 swapId = keccak256(abi.encodePacked(msg.sender, receiver, hash));
        require(swaps[swapId].sender == address(0), "Swap exists");
        
        swaps[swapId] = Swap({
            sender: msg.sender,
            receiver: receiver,
            amount: msg.value,
            hash: hash,
            timeout: block.timestamp + timeout,
            completed: false,
            refunded: false
        });
    }
    
    function claim(bytes32 swapId, bytes32 preimage) external {
        Swap storage swap = swaps[swapId];
        require(!swap.completed && !swap.refunded, "Swap already settled");
        require(sha256(abi.encodePacked(preimage)) == swap.hash, "Invalid preimage");
        require(block.timestamp < swap.timeout, "Timeout expired");
        
        swap.completed = true;
        payable(swap.receiver).transfer(swap.amount);
    }
    
    function refund(bytes32 swapId) external {
        Swap storage swap = swaps[swapId];
        require(!swap.completed && !swap.refunded, "Already settled");
        require(block.timestamp >= swap.timeout, "Timeout not reached");
        require(msg.sender == swap.sender, "Not sender");
        
        swap.refunded = true;
        payable(swap.sender).transfer(swap.amount);
    }
}
```

**Xác minh bằng khách nhẹ (Light client verification)** cho phép một blockchain kiểm chứng trạng thái của chuỗi khác mà không cần lưu toàn bộ dữ liệu. Khách nhẹ chỉ lưu tiêu đề khối (khoảng 80 byte mỗi khối với Bitcoin), xác minh chuỗi tiêu đề thông qua bằng chứng công việc (PoW) hoặc chữ ký đồng thuận, rồi kiểm tra bằng chứng Merkle của giao dịch đối chiếu với gốc Merkle trong tiêu đề. Thách thức lớn nhất là chi phí gas để cập nhật tiêu đề liên tục, thường được giảm nhẹ nhờ các bên chuyển tiếp (relayer) hoặc cơ chế cập nhật theo yêu cầu.

**Chuỗi chuyển tiếp (Relay chains)** như trong Polkadot đưa vào một chuỗi trung tâm điều phối và xác thực các khối ứng viên của parachain. Thông điệp xuyên chuỗi được định tuyến qua relay chain để đảm bảo thứ tự và tính toàn vẹn, kế thừa an ninh chung từ tập trình xác thực của relay chain.

**Giao thức IBC (Inter-Blockchain Communication)** của Cosmos áp dụng kiến trúc mô-đun cho các chuỗi có chủ quyền hoàn toàn. IBC tổ chức theo các lớp gồm lớp vận chuyển (gửi gói tin tin cậy), lớp xác thực (xác minh nguồn gửi) và lớp thứ tự (đảm bảo trình tự thông điệp). Mỗi chuỗi tự bảo vệ đồng thuận của mình, còn IBC cung cấp hạ tầng truyền tải và xác minh chéo bằng khách nhẹ.

Việc xác minh trạng thái xuyên chuỗi đòi hỏi bằng chứng mật mã chặt chẽ: bằng chứng Merkle đơn thuần là chưa đủ mà còn phải chứng minh tiêu đề khối hợp lệ theo đúng quy tắc đồng thuận của chuỗi nguồn (chứng minh công việc với PoW, chứng minh chữ ký và tài sản đặt cọc của trình xác thực với PoS, hoặc chứng minh chữ ký đạt ngưỡng đa số với BFT).

---

## 4. Công thức toán học và mật mã học

Xét phân tích bảo mật của hoán đổi nguyên tử giữa Alice (trên Bitcoin) và Bob (trên Ethereum). Alice tạo bí mật \(s\), tính mã băm \(h = H(s)\), và hai bên thiết lập thời hạn \(t_A, t_B\) sao cho \(t_B < t_A\).

**Hợp đồng của Alice** (trên Bitcoin, thời hạn \(t_A\)):
\[
\text{Locked} \to \begin{cases}
\text{Bob} & \text{if } \text{reveals } s: H(s) = h \\
\text{Alice} & \text{if } \text{time} > t_A
\end{cases}
\]

**Hợp đồng của Bob** (trên Ethereum, thời hạn \(t_B\)):
\[
\text{Locked} \to \begin{cases}
\text{Alice} & \text{if } \text{reveals } s: H(s) = h \\
\text{Bob} & \text{if } \text{time} > t_B
\end{cases}
\]

**Chứng minh tính nguyên tử (Atomicity)**:

- **Trường hợp 1**: Alice nhận ETH của Bob trước thời điểm \(t_B\). Khi đó Alice buộc phải công khai \(s\) trên chuỗi Ethereum. Bob quan sát được \(s\) và sử dụng nó để nhận BTC của Alice trước thời điểm \(t_A\) (vì \(t_B < t_A\)). Cả hai giao dịch đều thành công.
- **Trường hợp 2**: Alice không nhận ETH trước thời điểm \(t_B\). Hạn của Bob hết trước (\(t_B < t_A\)), nên Bob rút lại được ETH. Khi hạn \(t_A\) kết thúc, Alice cũng rút lại được BTC. Cả hai bên đều được hoàn tiền.
- **Trường hợp 3**: Alice cố gắng nhận ETH sau thời điểm \(t_B\). Điều này bất khả thi vì hợp đồng cưỡng chế điều kiện thời hạn \(t_B\).

Kết quả: không tồn tại kịch bản một bên mất tiền trong khi bên kia chiếm được cả hai khoản tài sản.

**Điều kiện tham số an toàn**:
\[
t_A - t_B > \text{Max block time difference} + \text{Network latency}
\]

Khoảng chênh lệch \(t_A - t_B\) đảm bảo Bob luôn có đủ thời gian để rút BTC sau khi Alice công khai bí mật \(s\) để rút ETH.

**Độ phức tạp lưu trữ của khách nhẹ**:

Với một blockchain có các tiêu đề khối \(H_1, H_2, \dots, H_n\), dung lượng lưu trữ toàn bộ tiêu đề là:
\[
\text{Storage} = n \times |H| \text{ bytes}
\]

Với Bitcoin (tiêu đề 80 byte và khoảng 850.000 khối), tổng dung lượng vào khoảng 68 MB — quá tốn kém nếu lưu trực tiếp trên Ethereum. Các giải pháp thực tế gồm: chỉ lưu các tiêu đề gần đây, lưu điểm kiểm tra (checkpoint) kèm bằng chứng, hoặc dùng dịch vụ chuyển tiếp.

**Xác minh bằng chứng Merkle** cho giao dịch \(T_x\) trong khối \(B_k\):

Người xác minh cần tiêu đề khối \(H_k\) (80 byte) và đường dẫn Merkle \(P\) gồm \(\log_2 n\) giá trị băm (với \(n\) là số giao dịch trong khối), sau đó tính:
\[
\text{root} = \text{MerkleCompute}(T_x, P)
\]
và kiểm tra:
\[
\text{root} \stackrel{?}{=} H_k.\text{merkleRoot}
\]

Chi phí xác minh là \(O(\log n)\) phép băm với bộ nhớ hằng số.

**Xác minh gói tin IBC**: Chuỗi nguồn lưu cam kết gói tin \(p\):
\[
c = H(p.\text{sequence}, p.\text{data}, p.\text{timeout})
\]

Chuỗi đích kiểm tra ba điều kiện: cam kết tồn tại trong trạng thái chuỗi nguồn, trạng thái chuỗi nguồn hợp lệ theo bằng chứng đồng thuận, và gói tin chưa quá hạn:
\[
\text{Verify}(\text{stateProof}, \text{commitment}) \land \text{time} < p.\text{timeout}
\]

---

### Khung giải thích: tự tay kiểm chứng một bằng chứng Merkle Inclusion 4 giao dịch xuyên chuỗi (nên đọc chậm)

Giả sử Chuỗi A đóng gói 4 giao dịch $$T_1, T_2, T_3, T_4$$ vào một block, và Chuỗi B chỉ lưu duy nhất **Merkle Root** $$R$$ nằm trong tiêu đề block đó (tốn 32 byte). Làm sao Relayer chứng minh cho Chuỗi B rằng giao dịch $$T_2$$ thực sự nằm trong block của Chuỗi A?

1. **Cấu trúc cây Merkle trên Chuỗi A:**
   - 4 lá: $$H_1 = h(T_1),\; H_2 = h(T_2),\; H_3 = h(T_3),\; H_4 = h(T_4)$$.
   - Tầng giữa: $$H_{12} = h(H_1 \,\|\, H_2)$$ và $$H_{34} = h(H_3 \,\|\, H_4)$$.
   - Gốc (đã có trên Chuỗi B): $$R = h(H_{12} \,\|\, H_{34})$$.

2. **Bằng chứng Relayer gửi sang Chuỗi B cho $$T_2$$:**
   Relayer không cần gửi cả 4 giao dịch — chỉ cần gửi đúng nội dung $$T_2$$ kèm **2 nút anh em (sibling hashes)**: $$\pi = \{H_1\text{ (trái)},\; H_{34}\text{ (phải)}\}$$.

3. **Hợp đồng thông minh trên Chuỗi B tự tính lại bằng tay:**
   - Tính lá: $$H'_2 = h(T_2)$$.
   - Ghép với anh em tầng 1: $$H'_{12} = h(H_1 \,\|\, H'_2)$$.
   - Ghép với anh em tầng 2: $$R' = h(H'_{12} \,\|\, H_{34})$$.
   - So sánh: nếu **$$R' == R$$**, nhờ tính kháng va chạm của hàm băm mật mã, Chuỗi B chắc chắn tuyệt đối $$T_2$$ đã nằm trong block đó!

**Sức mạnh mở rộng theo logarit:** Nếu một block trên Chuỗi A chứa tới $$N = 4{,}096 = 2^{12}$$ giao dịch, bằng chứng Merkle chỉ cần đúng $$\log_2(4096) = \mathbf{12}$$ mã băm ($$12 \times 32 = 384\text{ byte}$$) — nhẹ hơn hàng nghìn lần so với việc tải toàn bộ block!

## 5. Góc nhìn triển khai

Cài đặt mô phỏng hoán đổi nguyên tử HTLC minh họa quy trình phối hợp trạng thái giữa hai blockchain độc lập:

```python
import hashlib
import time
from typing import Optional

class HTLCSwap:
    """Hash Time-Locked Contract for atomic swaps"""
    
    def __init__(self):
        self.swaps = {}  # swapId -> swap data
        
    def initiate_swap(
        self,
        sender: str,
        receiver: str,
        amount: float,
        hash_lock: bytes,
        timeout_seconds: int,
        chain: str
    ) -> str:
        """
        Initiate HTLC swap
        
        Args:
            sender: Initiator address
            receiver: Counterparty address
            amount: Amount to lock
            hash_lock: Hash of secret (sha256)
            timeout_seconds: Time until refund allowed
            chain: Which blockchain (BTC/ETH)
        """
        swap_id = hashlib.sha256(
            f"{sender}{receiver}{hash_lock.hex()}{chain}".encode()
        ).hexdigest()
        
        swap = {
            'id': swap_id,
            'sender': sender,
            'receiver': receiver,
            'amount': amount,
            'hash_lock': hash_lock,
            'timeout': time.time() + timeout_seconds,
            'chain': chain,
            'state': 'INITIATED',
            'secret': None
        }
        
        self.swaps[swap_id] = swap
        
        print(f"✓ HTLC Swap initiated on {chain}")
        print(f"  Swap ID: {swap_id[:16]}...")
        print(f"  {sender} → {receiver}")
        print(f"  Amount: {amount}")
        print(f"  Timeout: {timeout_seconds}s")
        
        return swap_id
    
    def claim_swap(self, swap_id: str, secret: bytes) -> bool:
        """
        Claim funds by revealing secret
        
        Args:
            swap_id: Swap identifier
            secret: Preimage of hash_lock
        """
        if swap_id not in self.swaps:
            print("✗ Swap not found")
            return False
            
        swap = self.swaps[swap_id]
        
        # Verify swap not already completed/refunded
        if swap['state'] != 'INITIATED':
            print(f"✗ Swap already {swap['state']}")
            return False
        
        # Verify timeout not expired
        if time.time() >= swap['timeout']:
            print("✗ Timeout expired")
            return False
        
        # Verify secret matches hash
        secret_hash = hashlib.sha256(secret).digest()
        if secret_hash != swap['hash_lock']:
            print("✗ Invalid secret")
            return False
        
        # Claim successful!
        swap['state'] = 'CLAIMED'
        swap['secret'] = secret
        
        print(f"✓ Swap {swap_id[:16]}... CLAIMED on {swap['chain']}")
        print(f"  Receiver: {swap['receiver']}")
        print(f"  Amount: {swap['amount']}")
        print(f"  Secret revealed: {secret.hex()[:16]}...")
        
        return True
    
    def refund_swap(self, swap_id: str) -> bool:
        """
        Refund swap after timeout
        
        Args:
            swap_id: Swap identifier
        """
        if swap_id not in self.swaps:
            return False
            
        swap = self.swaps[swap_id]
        
        if swap['state'] != 'INITIATED':
            print(f"✗ Swap already {swap['state']}")
            return False
        
        if time.time() < swap['timeout']:
            print("✗ Timeout not reached yet")
            return False
        
        # Refund!
        swap['state'] = 'REFUNDED'
        
        print(f"✓ Swap {swap_id[:16]}... REFUNDED on {swap['chain']}")
        print(f"  Sender: {swap['sender']}")
        print(f"  Amount: {swap['amount']}")
        
        return True

class AtomicSwapCoordinator:
    """Coordinate atomic swap across two chains"""
    
    def __init__(self):
        self.chain_btc = HTLCSwap()
        self.chain_eth = HTLCSwap()
    
    def execute_atomic_swap(
        self,
        alice_btc_addr: str,
        bob_eth_addr: str,
        alice_eth_addr: str,
        bob_btc_addr: str,
        btc_amount: float,
        eth_amount: float
    ):
        """
        Execute full atomic swap between Bitcoin and Ethereum
        
        Alice: Has BTC, wants ETH
        Bob: Has ETH, wants BTC
        """
        print("=== Atomic Swap: BTC ↔ ETH ===\n")
        
        # 1. Alice generates secret
        secret = hashlib.sha256(b"alice_secret_random").digest()
        hash_lock = hashlib.sha256(secret).digest()
        
        print(f"1. Alice generates secret")
        print(f"   Hash: {hash_lock.hex()[:32]}...\n")
        
        # 2. Alice locks BTC (timeout: 48 hours)
        swap_btc = self.chain_btc.initiate_swap(
            sender=alice_btc_addr,
            receiver=bob_btc_addr,
            amount=btc_amount,
            hash_lock=hash_lock,
            timeout_seconds=48 * 3600,
            chain='Bitcoin'
        )
        
        print()
        
        # 3. Bob verifies Alice's BTC lock, then locks ETH (timeout: 24 hours)
        # Bob's timeout SHORTER - important for security!
        swap_eth = self.chain_eth.initiate_swap(
            sender=bob_eth_addr,
            receiver=alice_eth_addr,
            amount=eth_amount,
            hash_lock=hash_lock,  # Same hash!
            timeout_seconds=24 * 3600,
            chain='Ethereum'
        )
        
        print()
        
        # 4. Alice claims Bob's ETH (reveals secret)
        print("2. Alice claims ETH (reveals secret)...")
        self.chain_eth.claim_swap(swap_eth, secret)
        
        print()
        
        # 5. Bob sees secret, claims Alice's BTC
        print("3. Bob claims BTC (using revealed secret)...")
        self.chain_btc.claim_swap(swap_btc, secret)
        
        print()
        print("✓ ATOMIC SWAP COMPLETED SUCCESSFULLY!")
        print(f"  Alice: {btc_amount} BTC → {eth_amount} ETH")
        print(f"  Bob: {eth_amount} ETH → {btc_amount} BTC")

# Example usage
if __name__ == "__main__":
    coordinator = AtomicSwapCoordinator()
    
    coordinator.execute_atomic_swap(
        alice_btc_addr="alice_btc",
        bob_eth_addr="bob_eth",
        alice_eth_addr="alice_eth",
        bob_btc_addr="bob_btc",
        btc_amount=1.0,
        eth_amount=15.0
    )
```

Trong kiến trúc **relay chain của Polkadot**, các trình xác thực được phân công cho từng parachain sẽ chứng thực tính hợp lệ của khối ứng viên, sau đó tổng hợp chứng thực đưa vào khối relay chain. Các thông điệp xuyên chuỗi lưu trực tiếp trong trạng thái relay chain để parachain đích đọc và xử lý không cần tin cậy.

Trong **Cosmos IBC**, hai chuỗi thường chạy đồng thuận Tendermint hoặc BFT tương thích. Một tiến trình ngoài chuỗi (IBC relayer) theo dõi cả hai chuỗi, chuyển tiêu đề khối và bằng chứng sang chuỗi đối tác. Khi chuỗi A gửi gói tin tới chuỗi B, chuỗi B kiểm tra chữ ký của tập trình xác thực chuỗi A dựa trên trạng thái khách nhẹ đã lưu:

\[
\text{Verify}_{\text{ClientState}_A}(\text{signature}_{\text{validators}}, \text{packet\_commitment})
\]

Gói tin chỉ được xử lý khi bước xác minh này thành công.

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Rủi ro bảo mật cầu nối**: Các vụ tấn công cầu nối đã gây thiệt hại hơn 2 tỷ USD. Vụ **Ronin Bridge** (tháng 3/2022, 625 triệu USD) cho thấy rủi ro tập trung khóa khi kẻ tấn công chiếm 5 trong số 9 khóa trình xác thực để rút cạn quỹ. Vụ **Wormhole** (tháng 2/2022, 325 triệu USD) xuất phát từ lỗi bỏ qua bước xác minh chữ ký của guardian, cho phép đúc token bọc mà không cần khóa tài sản gốc.
- **Giả định tin cậy (Trust assumptions)**: Cầu nối lưu ký (WBTC) tin cậy vào tổ chức nắm giữ tài sản; cầu nối liên minh (Multichain) phân tán niềm tin vào mô hình n-trên-m; cầu nối xác minh mật mã giảm thiểu niềm tin nhưng tốn gas và phức tạp. Không có cầu nối nào hoàn toàn miễn nhiễm giả định — tất cả đều phụ thuộc vào an ninh chuỗi nguồn, sự trung thực của trình xác thực hoặc tính đúng đắn của mã nguồn.
- **Phân mảnh thanh khoản**: Sự tồn tại đồng thời của nhiều phiên bản tài sản bọc (như WBTC, renBTC, tBTC, hBTC trên Ethereum) khiến thanh khoản bị chia nhỏ và không tương thích trực tiếp với nhau.
- **MEV xuyên chuỗi và tấn công phức hợp**: Kẻ tấn công theo dõi giao dịch cầu nối đang chờ xử lý có thể chạy trước ở chuỗi đích, chạy sau ở chuỗi nguồn hoặc kết hợp flash loan và thao túng oracle để khai thác chênh lệch giá.
- **Tính sẵn sàng dữ liệu (Data availability)**: Đặc biệt quan trọng với cầu nối lạc quan (optimistic bridges) dựa trên bằng chứng gian lận — nếu dữ liệu giao dịch không sẵn có, người giám sát không thể lập bằng chứng gian lận.
- **Khác biệt về tính cuối cùng (Finality)**: Bitcoin có tính cuối cùng xác suất (thường chờ 6 xác nhận), Ethereum sau The Merge có tính cuối cùng xác định, còn các chuỗi BFT đạt tính cuối cùng gần như tức thì. Cầu nối phải xử lý cẩn thận sự chênh lệch này để tránh rủi ro tổ chức lại chuỗi (reorg) gây chi tiêu lặp.

---

## 7. Các khái niệm liên quan

- **Chuẩn chuyển tài sản bản địa**: **Cross-Chain Transfer Protocol (CCTP)** của Circle cho phép đốt USDC bản địa trên chuỗi nguồn và đúc USDC bản địa trên chuỗi đích, loại bỏ hoàn toàn tài sản bọc.
- **Mạng lưới thanh khoản (Liquidity networks)**: Các giao thức như **Connext** và **Hop Protocol** dùng bể thanh khoản trên chuỗi đích để người dùng nhận tiền gần như ngay lập tức, sau đó mới cân bằng lại qua cầu nối chính thức.
- **Sàn DEX xuyên chuỗi**: **THORChain** cho phép hoán đổi tài sản bản địa (như BTC sang ETH) trực tiếp qua các bể thanh khoản liên tục được bảo đảm bằng tài sản đặt cọc RUNE, dù từng trải qua nhiều sự cố bảo mật.
- **Lớp truyền thông điệp tổng quát**: **LayerZero** và **Axelar** cho phép truyền thông điệp tùy ý và gọi hàm hợp đồng giữa các chuỗi, mở đường cho các ứng dụng đa chuỗi (quản trị, cho vay và quản lý thanh khoản hợp nhất).
- **Trình sắp xếp dùng chung (Shared sequencing)**: Một trình sắp xếp duy nhất xác định thứ tự giao dịch đồng thời cho nhiều rollup, cho phép thực thi giao dịch nguyên tử xuyên rollup mà không cần độ trễ truyền tin bất đồng bộ.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"Atomic Cross-Chain Swaps"** | 2013 | Tier Nolan | Mô tả đầu tiên về hoán đổi nguyên tử không cần tin cậy bằng HTLC |
| **"Bitcoin and Cryptocurrency Technologies"** | 2016 | Narayanan và cộng sự | Chương phân tích các giao thức xuyên chuỗi |
| **"Polkadot: Vision for a Heterogeneous Multi-Chain Framework"** | 2016 | Gavin Wood | Kiến trúc relay chain và parachain |
| **"Cosmos: A Network of Distributed Ledgers"** | 2016 | Jae Kwon, Ethan Buchman | Nền tảng giao thức IBC |
| **"IBC Protocol Specification"** | 2020 | Đội ngũ Cosmos | Đặc tả kỹ thuật đầy đủ của IBC |
| **"XCMP: Cross-Chain Message Passing"** | 2020 | Đội ngũ Polkadot | Giao thức truyền thông điệp giữa các parachain |
| **"LayerZero: Trustless Omnichain Interoperability Protocol"** | 2021 | LayerZero Labs | Xác minh bằng nút siêu nhẹ (Ultra-Light Node) |
| **"Wormhole: A Generic Message Passing Protocol"** | 2021 | Certus One | Kiến trúc mạng lưới Guardian |
| **"THORChain: A Decentralized Liquidity Network"** | 2018 | Đội ngũ THORChain | Thiết kế sàn giao dịch phi tập trung xuyên chuỗi |

---

## 9. Minh họa và tài liệu trực quan

### Luồng hoán đổi nguyên tử HTLC
```
Alice (Bitcoin)                          Bob (Ethereum)
     |                                        |
     | 1. Generate secret s, compute h=H(s)  |
     | 2. Lock BTC with h, timeout 48h       |
     |--------------------------------------->|
     |                                        | 3. Verify BTC lock
     |                                        | 4. Lock ETH with h, timeout 24h
     |<---------------------------------------|
     | 5. Claim ETH with secret s            |
     |--------------------------------------->|
     |                                        | 6. See secret s revealed
     |                                        | 7. Claim BTC with secret s
     |<---------------------------------------|
     ✓ Both parties received funds!
```
*Sơ đồ: Luồng hoạt động của giao thức hoán đổi nguyên tử HTLC*

### So sánh kiến trúc các loại cầu nối

| Loại cầu nối | Mô hình tin cậy | Đặc điểm bảo mật | Ví dụ |
|--------------|-----------------|------------------|-------|
| **Lưu ký (Custodial)** | Tin cậy tổ chức lưu ký | Rủi ro tập trung | WBTC, sàn giao dịch tập trung |
| **Liên minh (Federation)** | Tin cậy n-trên-m trình xác thực | Phân tán niềm tin có giới hạn | Multichain, Synapse |
| **Lạc quan (Optimistic)** | Tin cậy ít nhất 1 trong n người giám sát trung thực | Dựa trên bằng chứng gian lận | Optimism Bridge, Arbitrum |
| **ZK** | Tin cậy mật mã học | Dựa trên chứng minh toán học | zkSync Bridge |
| **Bảo mật chia sẻ** | Tin cậy chuỗi chuyển tiếp | Dùng chung tập trình xác thực | Polkadot parachains |

*Nguồn: [L2Beat Bridge Risk Framework](https://l2beat.com/bridges/risk)*

### Kiến trúc giao thức IBC
![IBC Protocol Architecture](https://tutorials.cosmos.network/resized-images/600/academy/2-cosmos-concepts/images/ibc.png)  
*Nguồn: [Cosmos IBC Documentation](https://tutorials.cosmos.network/academy/2-cosmos-concepts/6-ibc.html)*

### Kiến trúc Polkadot
![Polkadot Relay Chain and Parachains](https://wiki.polkadot.network/assets/images/polkadot-relay-chain-0e42bf5a5e344e33ca945ef2d5d82c24.png)  
*Nguồn: [Polkadot Wiki](https://wiki.polkadot.network/)*

### Công cụ tương tác tham khảo
- [Cosmos IBC Tracker](https://www.mintscan.io/cosmos/relayers) — Theo dõi các giao dịch chuyển tiếp IBC.
- [Polkadot.js](https://polkadot.js.org/) — Tương tác với hệ sinh thái Polkadot.
- [Bridge Analytics](https://dune.com/browse/dashboards?q=bridge) — Dữ liệu khối lượng giao dịch xuyên chuỗi.
- [L2Beat Bridges](https://l2beat.com/bridges) — Phân tích và xếp hạng rủi ro các cầu nối.

---

## 10. Tóm tắt

Giao tiếp xuyên chuỗi là bước tiến quan trọng giúp chuyển đổi hệ sinh thái blockchain từ các mạng lưới cô lập sang môi trường kết nối liền mạch. Các hướng tiếp cận trải rộng từ hoán đổi nguyên tử dùng HTLC (không cần tin cậy nhưng giới hạn tính năng), các giao thức cầu nối đa dạng (mở rộng chức năng nhưng phát sinh giả định tin cậy) đến các nền tảng thiết kế sẵn cho tương tác như Polkadot và Cosmos.

Bài toán cốt lõi nằm ở việc xác minh trạng thái của một blockchain từ một blockchain khác mà không cần chạy nút đầy đủ, với các giải pháp tiêu biểu gồm khách nhẹ, chuỗi chuyển tiếp và mạng lưới oracle. Mỗi lựa chọn đều đánh đổi giữa đảm bảo bảo mật, độ phức tạp kỹ thuật, chi phí gas và giả định tin cậy. Trước thực tế thiệt hại hơn 2 tỷ USD từ các vụ tấn công cầu nối, bảo vệ hạ tầng xuyên chuỗi đòi hỏi phòng thủ nhiều lớp gồm đa dạng hóa trình xác thực, kiểm toán và xác minh hình thức hợp đồng, giám sát bất thường và đảm bảo kinh tế.

---

**Kết thúc bài giảng**

Bài tiếp theo: Lecture 06.01 — Blockchain Bridges: Architecture và Security

---

## Video tham khảo

- **Xem trước:** [What is an Atomic Swap in Crypto? Time Locked Smart Contracts](https://www.youtube.com/watch?v=-9NDKbJo_A4) — Whiteboard Crypto, tiếng Anh. Giải thích cơ chế atomic swap và khóa thời gian; nên xem trước phần công thức HTLC.
- [Introduction to Atomic Swaps: Live Demo +  Solidity Tutorial Of Hash Timelocked Contract (HTLC)](https://www.youtube.com/watch?v=VZX2ApRLuwM) — EatTheBlocks, tiếng Anh. Hướng dẫn viết và chạy thử hợp đồng HTLC bằng Solidity, tương ứng với phần cài đặt trong bài.
- [A Technical Introduction to The Lightning Network - We Are Developers 2020](https://www.youtube.com/watch?v=E1n3sKKPD_k) — aantonop, tiếng Anh. Trình bày cách Lightning Network ứng dụng nguyên thủy HTLC ở quy mô thanh toán thực tế.

## Tài liệu tham khảo

1. Nolan, T. (2013). *Atomic Cross-Chain Swaps*. BitcoinTalk Forum.
2. Wood, G. (2016). *Polkadot: Vision for a Heterogeneous Multi-Chain Framework*. Polkadot Whitepaper.
3. Kwon, J., & Buchman, E. (2016). *Cosmos: A Network of Distributed Ledgers*. Cosmos Whitepaper.
4. Cosmos Network. (2020). *IBC Protocol Specification*. https://github.com/cosmos/ibc
5. LayerZero Labs. (2021). *LayerZero: Trustless Omnichain Interoperability Protocol*. LayerZero Whitepaper.
6. L2Beat Team. (2024). *Bridge Risk Framework*. https://l2beat.com/bridges/risk
