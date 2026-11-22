---
layout: post
title: "Lecture 06.02: Polkadot & Cosmos - Purpose-Built Interoperability Platforms"
chapter: '06'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter06
---

# Bài giảng 06.02: Polkadot và Cosmos — Các nền tảng thiết kế chuyên biệt cho tương tác xuyên chuỗi

## 1. Tổng quan về khái niệm

Trong khi các cầu nối cố gắng liên kết những blockchain đã được xây dựng tách biệt từ trước, **Polkadot** và **Cosmos** tiếp cận bài toán bằng cách thiết kế lại kiến trúc blockchain để tích hợp khả năng tương tác ngay vào giao thức lõi. Hai nền tảng này đại diện cho hai triết lý khác nhau về "mạng internet của các blockchain": Polkadot hướng tới **bảo mật chia sẻ** và thực thi phối hợp, còn Cosmos ưu tiên **chủ quyền độc lập** kết hợp giao thức truyền tin chuẩn hóa.

**Polkadot**, do **Gavin Wood** (đồng sáng lập Ethereum) đề xuất trong sách trắng năm 2016, giới thiệu **kiến trúc đa chuỗi không đồng nhất (heterogeneous multi-chain architecture)**. Mục tiêu là cho phép nhiều blockchain chuyên biệt (**parachains**) hoạt động độc lập nhưng dùng chung lớp bảo mật của một chuỗi trung tâm (**relay chain**). Nhờ đó, các parachain không cần tự xây dựng tập trình xác thực riêng mà kế thừa trực tiếp an ninh từ relay chain, giúp giảm đáng kể rào cản khi khởi chạy một blockchain mới.

Trên Polkadot, relay chain đóng vai trò điều phối và bảo chứng an ninh: các nút thu gom (collator) của parachain tạo khối ứng viên gửi lên relay chain để các trình xác thực kiểm tra chuyển trạng thái và hoàn tất khối. Thông điệp xuyên chuỗi được định tuyến qua relay chain nhằm đảm bảo tính toàn vẹn và thứ tự, giúp parachain tập trung vào logic ứng dụng.

**Cosmos**, do **Jae Kwon** và **Ethan Buchman** phát triển, đi theo hướng đề cao tính tự chủ. Các blockchain độc lập (**zones**) giao tiếp với nhau qua giao thức chuẩn **IBC (Inter-Blockchain Communication)** trong khi vẫn giữ trọn quyền kiểm soát về quản trị, cơ chế đồng thuận và kinh tế token. Khác với Polkadot, mỗi zone trong Cosmos tự chịu trách nhiệm bảo mật cho chính mình; **Cosmos Hub** là chuỗi đầu tiên hỗ trợ IBC và đóng vai trò điểm kết nối nhưng không áp đặt lớp bảo mật lên các zone khác.

Sự khác biệt về triết lý này phản ánh sự đánh đổi cốt lõi trong thiết kế hệ thống: Polkadot ưu tiên khởi tạo bảo mật đồng đều và phối hợp chặt chẽ, chấp nhận giảm một phần chủ quyền của từng chuỗi; Cosmos ưu tiên chủ quyền và tính linh hoạt tối đa, chấp nhận mức độ bảo mật không đồng đều giữa các zone.

Về mốc phát triển, Polkadot ra mắt mạng chính vào tháng 5/2020 và bắt đầu đấu giá vị trí parachain từ tháng 12/2021 (với các dự án như Moonbeam, Astar, Acala). Cosmos Hub ra mắt tháng 3/2019 và kích hoạt IBC vào tháng 2/2021 (hình thành mạng lưới các zone như Osmosis, Juno, Secret Network). Cả hai hệ sinh thái đều chứng minh khả năng vận hành thực tế ở quy mô hàng chục tỷ USD tổng giá trị khóa.

---

## 2. Hiểu biết trực quan

Để dễ hình dung sự khác biệt giữa hai mô hình, có thể so sánh Polkadot với **mô hình nhà nước liên bang** và Cosmos với **Liên Hợp Quốc**:

- **Polkadot (Nhà nước liên bang)**: Chính quyền trung ương (relay chain) cung cấp quốc phòng chung (bảo mật) và cơ chế phối hợp (truyền tin xuyên chuỗi) cho các bang thành viên (parachains). Các bang có thể chuyên môn hóa (DeFi, danh tính, trò chơi) và cùng được bảo vệ bởi quân đội liên bang, nhưng phải tuân thủ quy tắc chung và cạnh tranh để giành vị trí (parachain slot).
- **Cosmos (Liên Hợp Quốc)**: Gồm các quốc gia có chủ quyền hoàn toàn (zones) với quân đội (trình xác thực) và luật pháp (quản trị) riêng. Liên Hợp Quốc cung cấp diễn đàn và chuẩn giao tiếp (IBC, Tendermint) nhưng không bảo vệ hộ từng nước: quốc gia mạnh thì an toàn, quốc gia yếu dễ bị tổn thương hơn, đổi lại họ có quyền gia nhập hoặc rời đi tự do.

Ở góc độ kỹ thuật máy tính, relay chain của Polkadot tương tự **nhân hệ điều hành (OS kernel)** quản lý tài nguyên (không gian khối), lập lịch thực thi và điều phối giao tiếp liên tiến trình giữa các parachain. Trong khi đó, IBC của Cosmos giống như **bộ giao thức TCP/IP**: cho phép mọi chuỗi nói chung ngôn ngữ IBC kết nối với nhau bất kể cài đặt bên trong, nhưng không tự đảm bảo an toàn nội bộ cho từng chuỗi.

Cơ chế **đấu giá parachain** trên Polkadot tương tự đấu giá băng tần viễn thông: tài nguyên vị trí có hạn được phân bổ thông qua việc khóa DOT trong kỳ thuê (96 tuần), giúp ưu tiên các dự án có cộng đồng và nguồn lực tốt nhưng tạo rào cản vốn cao.

Cơ chế truyền tin giữa hai nền tảng cũng khác biệt căn bản: **XCMP (Cross-Chain Message Passing)** của Polkadot vận hành trong môi trường bảo mật chia sẻ nơi trình xác thực relay chain bảo đảm thông điệp không bị mất hay giả mạo; còn **IBC** của Cosmos dựa trên xác minh mật mã độc lập giữa hai chuỗi riêng biệt, đòi hỏi mỗi bên tin rằng chuỗi đối tác đang tự bảo vệ đồng thuận của mình đủ tốt.

---

## 3. Nền tảng kỹ thuật

Kiến trúc **Polkadot** xoay quanh relay chain sử dụng đồng thuận **Nominated Proof-of-Stake (NPoS)**. Các trình xác thực được gán ngẫu nhiên cho các parachain theo từng kỷ nguyên (epoch) để hạn chế thông đồng dài hạn. Collator của parachain tạo khối ứng viên gửi tới các trình xác thực được phân công; khi đủ ngưỡng chứng thực, khối parachain được đưa vào và hoàn tất cùng relay chain.

Runtime của relay chain và phần lớn parachain được xây dựng trên **Substrate** — bộ công cụ phát triển blockchain dạng mô-đun cung cấp sẵn đồng thuận, mạng ngang hàng, lưu trữ và môi trường thực thi. Trong giao thức **XCMP**, khi parachain A gửi thông điệp tới parachain B, thông điệp được ghi nhận vào trạng thái relay chain khi khối của A hoàn tất, và B đọc thông điệp đó ở khối tiếp theo với đảm bảo gửi đúng một lần và đúng thứ tự.

```python
class PolkadotParachain:
    """Simplified Polkadot parachain model"""
    
    def __init__(self, para_id, relay_chain):
        self.para_id = para_id
        self.relay_chain = relay_chain
        self.state = {}
        self.pending_blocks = []
        self.finalized_blocks = []
    
    def produce_block(self, transactions):
        """Collator produces parachain block candidate"""
        block = {
            'para_id': self.para_id,
            'parent_hash': self.get_latest_hash(),
            'transactions': transactions,
            'state_root': self.compute_state_root(),
            'messages': []  # Cross-chain messages
        }
        
        # Execute transactions
        for tx in transactions:
            self.execute_transaction(tx)
            
            # If cross-chain tx, create message
            if tx.get('target_para'):
                message = self.create_xcmp_message(tx)
                block['messages'].append(message)
        
        self.pending_blocks.append(block)
        return block
    
    def submit_to_relay_chain(self, block):
        """Submit block to relay chain validators"""
        # Collator submits block candidate
        # Relay chain validators verify
        return self.relay_chain.validate_parachain_block(
            self.para_id,
            block
        )
    
    def create_xcmp_message(self, tx):
        """Create cross-chain message"""
        return {
            'source_para': self.para_id,
            'target_para': tx['target_para'],
            'data': tx['data']
        }
    
    def process_xcmp_message(self, message):
        """Process incoming cross-chain message"""
        # Verify message from relay chain state
        if self.relay_chain.verify_message(message, self.para_id):
            # Execute message
            self.execute_message(message['data'])
            return True
        return False
```

Trong **Cosmos**, mỗi zone vận hành độc lập với đồng thuận Tendermint BFT (hoặc biến thể tương thích IBC). **Giao thức IBC** hoạt động dựa trên mô hình khách nhẹ (light client): mỗi chuỗi duy trì một khách nhẹ theo dõi tập trình xác thực và tiêu đề khối của chuỗi đối tác. Khi chuỗi A gửi gói tin sang chuỗi B, tiến trình chuyển tiếp (IBC relayer) mang bằng chứng cam kết gói tin sang chuỗi B để chuỗi B tự kiểm chứng và gửi lại xác nhận (acknowledgment).

```python
class CosmosZone:
    """Simplified Cosmos zone with IBC"""
    
    def __init__(self, zone_id):
        self.zone_id = zone_id
        self.validators = []
        self.state = {}
        self.ibc_clients = {}  # client_id -> ClientState
        self.ibc_connections = {}
        self.ibc_channels = {}
        self.pending_packets = []
    
    def create_ibc_client(self, counterparty_chain_id):
        """Create light client for counterparty chain"""
        client_id = f"client-{counterparty_chain_id}"
        
        self.ibc_clients[client_id] = {
            'chain_id': counterparty_chain_id,
            'validator_set': None,  # Will be updated
            'trusted_height': 0,
            'trusted_hash': None
        }
        
        return client_id
    
    def update_client(self, client_id, header, validator_signatures):
        """Update light client with new header"""
        client = self.ibc_clients[client_id]
        
        # Verify header signed by known validators
        if self.verify_header(header, validator_signatures, client['validator_set']):
            client['trusted_height'] = header['height']
            client['trusted_hash'] = header['hash']
            client['validator_set'] = header.get('next_validators')
            return True
        
        return False
    
    def send_ibc_packet(self, channel_id, data):
        """Send IBC packet to counterparty"""
        packet = {
            'sequence': len(self.pending_packets) + 1,
            'source_channel': channel_id,
            'data': data,
            'timeout_height': self.get_height() + 1000,
            'timeout_timestamp': time.time() + 3600
        }
        
        # Commit packet in state
        commitment = self.commit_packet(packet)
        self.pending_packets.append(packet)
        
        return packet
    
    def receive_ibc_packet(self, packet, proof):
        """Receive and verify IBC packet"""
        # Verify packet committed on source chain
        client_id = self.get_client_for_channel(packet['source_channel'])
        client = self.ibc_clients[client_id]
        
        # Verify proof against client state
        if self.verify_packet_commitment(packet, proof, client):
            # Process packet
            self.process_packet(packet)
            
            # Send acknowledgment back
            self.send_acknowledgment(packet)
            return True
        
        return False
    
    def verify_header(self, header, signatures, validator_set):
        """Verify consensus header with validator signatures"""
        # Simplified - check 2/3+ validators signed
        return len(signatures) >= len(validator_set) * 2 // 3
    
    def verify_packet_commitment(self, packet, proof, client):
        """Verify packet was committed on source chain"""
        # Verify merkle proof of packet commitment
        # Against client's trusted state root
        return True  # Simplified
    
    def commit_packet(self, packet):
        """Create commitment for packet"""
        import hashlib
        return hashlib.sha256(str(packet).encode()).hexdigest()
```

---

## 4. Công thức toán học và mật mã học

Trong mô hình bảo mật chia sẻ của Polkadot, giả sử tổng số trình xác thực là \(N\), phân bổ cho \(p\) parachain và relay chain. Để duy trì ngưỡng an toàn tương ứng với mức \(\alpha\) cho mỗi chuỗi:

\[
\frac{N}{p+1} \geq \frac{N_{\min}}{\alpha}
\]

Trong đó \(N_{\min}\) là số trình xác thực tối thiểu cho mức bảo mật mục tiêu. Ví dụ, nếu giả định mỗi chuỗi cần tối thiểu 150 trình xác thực:
\[
150p \leq N_{\text{total}}
\]

Với tổng cộng 1.000 trình xác thực:
\[
p \leq \frac{1000}{150} \approx 6 \text{ parachains}
\]

Công thức này minh họa giới hạn phân bổ: khi số parachain tăng lên với tập trình xác thực cố định, số trình xác thực phân công trực tiếp cho từng parachain sẽ giảm xuống.

Đối với **xác minh IBC trên Cosmos**, với chuỗi Tendermint có tập trình xác thực \(V\), để chứng minh khối \(B\) đã hoàn tất cần tổng trọng số đặt cọc của các trình xác thực đã ký đạt ít nhất \(2/3\):

\[
\sum_{v \in V_{\text{signed}}} \text{stake}(v) \geq \frac{2}{3} \sum_{v \in V} \text{stake}(v)
\]

Người xác minh trên chuỗi đích dùng tập \(V\) lưu trong khách nhẹ để kiểm tra từng chữ ký trong tập \(\{\sigma_1, \dots, \sigma_k\}\) và cộng tổng trọng số, với độ phức tạp \(O(k)\) phép xác minh chữ ký (thường \(k \approx 100\)).

---

## 5. Góc nhìn triển khai

```python
class PolkadotRelayChain:
    """Polkadot Relay Chain coordinating parachains"""
    
    def __init__(self, num_validators=100):
        self.validators = self.initialize_validators(num_validators)
        self.parachains = {}
        self.current_epoch = 0
    
    def register_parachain(self, para_id, lease_start, lease_end):
        """Register parachain (won auction)"""
        self.parachains[para_id] = {
            'para_id': para_id,
            'lease_start': lease_start,
            'lease_end': lease_end,
            'state_root': None,
            'assigned_validators': []
        }
        
        print(f"✓ Parachain {para_id} registered")
        print(f"  Lease: Blocks {lease_start} - {lease_end}")
    
    def assign_validators_to_parachains(self):
        """Randomly assign validators each epoch"""
        import random
        
        # Shuffle validators for randomness
        shuffled = self.validators.copy()
        random.shuffle(shuffled)
        
        # Distribute across parachains
        validators_per_para = len(self.validators) // len(self.parachains)
        
        idx = 0
        for para_id in self.parachains:
            assigned = shuffled[idx:idx + validators_per_para]
            self.parachains[para_id]['assigned_validators'] = assigned
            idx += validators_per_para
            
            print(f"Epoch {self.current_epoch}: Para {para_id} assigned {len(assigned)} validators")
    
    def validate_parachain_block(self, para_id, block):
        """Validators verify parachain block"""
        para = self.parachains.get(para_id)
        if not para:
            return False
        
        # Assigned validators verify
        attestations = []
        for validator in para['assigned_validators']:
            # Each validator checks state transition
            if self.verify_state_transition(block):
                attestation = {
                    'validator': validator['id'],
                    'block_hash': block.get('hash'),
                    'valid': True
                }
                attestations.append(attestation)
        
        # Need 2/3+ attestations
        if len(attestations) >= len(para['assigned_validators']) * 2 // 3:
            # Include in relay chain
            self.finalize_parachain_block(para_id, block)
            return True
        
        return False
    
    def finalize_parachain_block(self, para_id, block):
        """Finalize parachain block on relay chain"""
        para = self.parachains[para_id]
        para['state_root'] = block['state_root']
        
        # Process cross-chain messages
        for message in block.get('messages', []):
            self.route_xcmp_message(message)
        
        print(f"✓ Parachain {para_id} block finalized on relay chain")
```

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Sự khan hiếm vị trí parachain trên Polkadot**: Số lượng slot có giới hạn (giai đoạn đầu khoảng 100 slot và mở rộng dần) cùng yêu cầu khóa lượng lớn DOT trong các phiên đấu giá tạo lợi thế cho các dự án giàu vốn và giới hạn tốc độ mở rộng hệ sinh thái. Mô hình parathread (trả phí theo nhu cầu) được đề xuất để khắc phục nhưng mức độ ứng dụng ban đầu còn hạn chế.
- **Độ chênh lệch bảo mật trên Cosmos**: Các zone lớn như Cosmos Hub có tập trình xác thực mạnh, nhưng những zone nhỏ chỉ có khoảng 10 trình xác thực rất dễ bị thông đồng hoặc tấn công có chủ đích. Dù kênh truyền IBC không cần tin cậy, giao tiếp với một chuỗi có lớp bảo mật yếu vẫn tiềm ẩn rủi ro, buộc người dùng phải tự đánh giá độ an toàn của từng zone.

---

## 7. Các khái niệm liên quan

- **Giao thức tầng 0 (Layer 0) và sự đa dạng tầng 1**: Thay vì ép mọi ứng dụng lên một blockchain đa dụng duy nhất, các nền tảng như Polkadot và Cosmos cho phép xây dựng các chuỗi chuyên biệt cho DeFi, quyền riêng tư hay trò chơi nhằm tối ưu hiệu năng cho từng bài toán.
- **Bộ ba bất khả thi về tương tác (Interoperability trilemma)**: Tương tự bộ ba của blockchain, khó có thể đồng thời tối ưu hóa tính không cần tin cậy (trustlessness), tính tổng quát (generalizability) và khả năng mở rộng kết nối (extensibility). Polkadot mạnh về bảo mật và mở rộng trong hệ Substrate nhưng kém tổng quát ngoài hệ; Cosmos linh hoạt và dễ mở rộng giữa các chuỗi BFT nhưng mức độ tin cậy phụ thuộc từng zone; còn cầu nối truyền thống tổng quát hơn nhưng thường phải hy sinh tính không cần tin cậy.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"Polkadot: Vision for Heterogeneous Multi-Chain Framework"** | 2016 | Gavin Wood | Kiến trúc relay chain và parachain |
| **"Cosmos: A Network of Distributed Ledgers"** | 2016 | Jae Kwon, Ethan Buchman | Nền tảng Cosmos Hub và giao thức IBC |
| **"IBC Protocol Specification v1"** | 2020 | Nhóm cốt lõi Cosmos | Đặc tả kỹ thuật đầy đủ cho IBC |
| **"Polkadot Runtime Specification"** | 2020 | Web3 Foundation | Cơ chế chi tiết của relay chain |
| **"XCMP Design Documentation"** | 2021 | Parity Technologies | Giao thức truyền thông điệp xuyên parachain |

---

## 9. Minh họa và tài liệu trực quan

![Polkadot Architecture](https://wiki.polkadot.network/assets/images/polkadot-architecture-diagram.png)  
*Nguồn: [Polkadot Wiki](https://wiki.polkadot.network/)*

![Cosmos IBC Protocol Flow](https://tutorials.cosmos.network/resized-images/600/academy/2-cosmos-concepts/images/ibc-flow.png)  
*Nguồn: [Cosmos Academy](https://tutorials.cosmos.network/)*

### So sánh kiến trúc

| Đặc điểm | Polkadot | Cosmos |
|----------|----------|--------|
| **Mô hình bảo mật** | Bảo mật chia sẻ (relay chain) | Chủ quyền độc lập (từng zone) |
| **Tập trình xác thực** | Thống nhất | Độc lập theo từng zone |
| **Giao tiếp xuyên chuỗi** | XCMP (điều phối qua relay chain) | IBC (ngang hàng qua khách nhẹ) |
| **Tính linh hoạt** | Trung bình (hệ sinh thái Substrate) | Cao (mọi chuỗi Tendermint/BFT tương thích) |
| **Gia nhập mạng lưới** | Đấu giá slot (chi phí cao) | Tự do, không cần cấp phép |
| **Mức đảm bảo bảo mật** | Đồng đều giữa các parachain | Khác nhau tùy từng zone |

---

## 10. Tóm tắt

Polkadot và Cosmos đại diện cho hai hướng thiết kế hoàn chỉnh cho khả năng tương tác xuyên chuỗi ngay từ nền tảng. Polkadot cung cấp mức bảo mật đồng đều thông qua relay chain với đánh đổi về chủ quyền và chi phí slot, trong khi Cosmos tối đa hóa tính tự chủ và linh hoạt của từng chuỗi với đánh đổi về sự phân hóa bảo mật giữa các zone. Hiểu rõ hai kiến trúc này giúp đánh giá khách quan bức tranh tương tác đa chuỗi và lựa chọn nền tảng phù hợp với yêu cầu ứng dụng.

---

**Kết thúc bài giảng**

Chương tiếp theo: Chapter 07 — Advanced Blockchain Topics

---

## Video tham khảo

- **Xem trước:** [Polkadot Explained: Multi-Chain Ecosystem & Parachain Architecture for Beginners](https://www.youtube.com/watch?v=WYZKO6Beb8w) — CodeLucky, tiếng Anh. Giới thiệu trực quan relay chain và parachain; nên xem trước mô hình bảo mật chia sẻ của Polkadot.
- [Cosmos Blockchain Explained: Internet of Blockchains & IBC Protocol Tutorial](https://www.youtube.com/watch?v=HddEOo-zeDM) — CodeLucky, tiếng Anh. Trình bày mô hình mạng các chuỗi và IBC của Cosmos, giúp đối chiếu tính chủ quyền của từng chuỗi trong bài.
- [Cosmos IBC simply explained](https://www.youtube.com/watch?v=G0KpgQSAUAM) — Finality: The Business of Decentralized Networks, tiếng Anh. Đi sâu vào cơ chế gói tin, khách nhẹ và quy trình xác minh thông điệp của IBC.

## Tài liệu tham khảo

1. Wood, G. (2016). *Polkadot: Vision for a Heterogeneous Multi-Chain Framework*. Polkadot Whitepaper.
2. Kwon, J., & Buchman, E. (2016). *Cosmos: A Network of Distributed Ledgers*. Cosmos Whitepaper.
3. Cosmos Network. (2020). *IBC Protocol Specification*. https://github.com/cosmos/ibc
4. Web3 Foundation. (2020). *Polkadot Runtime Specification*.
5. Parity Technologies. (2021). *XCMP Design Documentation*.
