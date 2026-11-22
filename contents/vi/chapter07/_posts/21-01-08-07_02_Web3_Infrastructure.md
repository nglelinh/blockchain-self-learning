---
layout: post
title: "Lecture 07.02: Web3 Infrastructure - Decentralized Internet Stack"
chapter: '07'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter07
---

# Bài giảng 07.02: Hạ tầng Web3 — Kiến trúc Internet phi tập trung

## 1. Tổng quan về khái niệm

**Web3** hướng tới việc thiết kế lại kiến trúc internet theo mô hình phi tập trung, chuyển dịch từ các nền tảng tập trung kiểm soát dữ liệu và tương tác người dùng sang các mạng lưới nơi người dùng trực tiếp sở hữu dữ liệu, danh tính và tài sản số của mình. Quá trình này đòi hỏi xây dựng lại toàn bộ ngăn xếp hạ tầng — từ lưu trữ dữ liệu, hệ thống tên miền đến danh tính và vận hành ứng dụng — dựa trên các giao thức chống kiểm duyệt và không có điểm lỗi duy nhất.

Kiến trúc internet hiện đại (thường gọi là **Web2**) tập trung quanh các nền tảng lớn như Google, Facebook, Amazon hay Microsoft, nơi doanh nghiệp kiểm soát máy chủ, dữ liệu, thuật toán và quyền truy cập dịch vụ. Nhìn lại tiến trình lịch sử:
- **Web1 (1990–2004)**: Các trang web tĩnh, chủ yếu chỉ đọc, vận hành trên giao thức mở (HTTP, SMTP, FTP). Kiến trúc có tính phi tập trung nhưng tính năng tương tác còn hạn chế.
- **Web2 (2004–nay)**: Bùng nổ mạng xã hội, điện toán đám mây và ứng dụng di động với khả năng tương tác phong phú, nhưng kéo theo sự tập trung hóa dữ liệu và quyền kiểm soát vào các hệ sinh thái khép kín.
- **Web3 (2014–nay)**: Tìm cách kết hợp tính phi tập trung của Web1 với tính năng phong phú của Web2 thông qua hợp đồng thông minh (Ethereum), lưu trữ phi tập trung (IPFS, Filecoin), tên miền phi tập trung (ENS) và danh tính tự chủ (DID).

Các thành phần cốt lõi trong hạ tầng Web3 bao gồm:
- **IPFS (InterPlanetary File System)**: Do **Juan Benet** phát triển năm 2014, sử dụng cơ chế định địa chỉ theo nội dung (content addressing) thay vì theo vị trí máy chủ. Mọi tệp dữ liệu được định danh bằng mã băm mật mã của chính nội dung đó (CID — Content Identifier), giúp hạn chế liên kết hỏng (link rot) và giảm nguy cơ kiểm duyệt.
- **Filecoin**: Ra mắt năm 2020 như lớp khuyến khích kinh tế cho IPFS. Nhà cung cấp lưu trữ nhận thưởng token FIL khi chứng minh được bằng mật mã rằng họ đang lưu trữ dữ liệu cho khách hàng theo thời gian.
- **ENS (Ethereum Name Service)**: Ra mắt năm 2017 như giải pháp thay thế phi tập trung cho DNS, ánh xạ tên dễ đọc (như `alice.eth`) tới địa chỉ ví Ethereum, mã băm IPFS hoặc dữ liệu tùy ý, với quyền sở hữu bảo vệ dưới dạng NFT.
- **Danh tính phi tập trung (DID và Verifiable Credentials)**: Do W3C chuẩn hóa, cho phép người dùng tự nắm giữ định danh mật mã và trình bày các chứng chỉ đã ký số (từ trường học, cơ quan, tổ chức) theo cơ chế tiết lộ có chọn lọc mà không phụ thuộc nhà cung cấp danh tính trung tâm.

---

## 2. Hiểu biết trực quan

- **Web2 và Web3 qua hình ảnh thư viện**: Thư viện truyền thống (Web2) lưu toàn bộ sách trong một tòa nhà trung tâm do thủ thư kiểm soát quyền mượn và theo dõi người đọc. Mạng thư viện phi tập trung (Web3) phân tán sách tại nhà các thành viên cộng đồng; bất kỳ ai cũng có thể lưu trữ bản sao và tra cứu sách theo mã nội dung (như mã ISBN) thay vì theo địa chỉ tòa nhà.
- **Định địa chỉ nội dung (IPFS)**: URL truyền thống giống địa chỉ nhà — nếu người ở chuyển đi, địa chỉ trở nên vô hiệu. CID của IPFS giống trình tự ADN — gắn liền với chính nội dung, nên dù tệp được chuyển sang máy chủ nào, mã định danh vẫn không đổi.
- **Thị trường lưu trữ Filecoin**: Hoạt động tương tự mô hình chia sẻ không gian lưu trữ ngang hàng thay vì phụ thuộc vào một chuỗi khách sạn tập trung như AWS hay Google Cloud, giúp tăng khả năng chống chịu lỗi đơn điểm.
- **ENS so với DNS**: Tên miền DNS chịu sự quản lý của tổ chức cấp phát và có thể bị thu hồi, trong khi tên miền ENS do người dùng nắm giữ trực tiếp bằng khóa bí mật.
- **Danh tính phi tập trung**: Tương tự hộ chiếu cá nhân so với tài khoản đăng nhập mạng xã hội — người dùng tự giữ chứng chỉ và chỉ xuất trình đúng thông tin cần thiết (chẳng hạn chứng minh trên 18 tuổi mà không lộ ngày sinh).

---

## 3. Nền tảng kỹ thuật

IPFS sử dụng **bảng băm phân tán (Distributed Hash Table — DHT)** để khám phá dữ liệu. Khi thêm dữ liệu vào IPFS, hệ thống chia tệp thành các khối (mặc định 256 KB), băm từng khối (mặc định dùng SHA-256) và tổ chức thành đồ thị có hướng không chu trình Merkle (Merkle DAG), tạo ra mã định danh nội dung:

\[
\text{CID} = \text{Hash}(\text{content})
\]

Khi một nút cần tải dữ liệu, nó truy vấn DHT (theo thuật toán **Kademlia**) để tìm nút đang lưu giữ CID tương ứng dựa trên khoảng cách XOR:

\[
d(a, b) = a \oplus b
\]

Truy vấn được định tuyến qua số chặng logarit tới các nút gần nhất với CID mục tiêu, sau đó tải trực tiếp ngang hàng.

```python
class SimplifiedIPFS:
    """Educational IPFS implementation showing core concepts"""
    
    def __init__(self):
        self.content_store = {}  # CID -> content
        self.dht = {}  # CID -> [provider_addresses]
    
    def add(self, content):
        """Add content to IPFS"""
        import hashlib
        
        # Compute CID (content identifier)
        cid = hashlib.sha256(content.encode()).hexdigest()
        
        # Store locally
        self.content_store[cid] = content
        
        # Announce to DHT
        if cid not in self.dht:
            self.dht[cid] = []
        self.dht[cid].append('this_node')
        
        print(f"✓ Content added to IPFS")
        print(f"  CID: {cid[:32]}...")
        print(f"  Size: {len(content)} bytes")
        
        return cid
    
    def get(self, cid):
        """Retrieve content from IPFS"""
        # Check local store first
        if cid in self.content_store:
            print(f"✓ Content found locally")
            return self.content_store[cid]
        
        # Query DHT for providers
        providers = self.dht.get(cid, [])
        
        if not providers:
            print(f"✗ Content not found")
            return None
        
        # Fetch from provider
        print(f"✓ Content found on network")
        print(f"  Providers: {len(providers)}")
        
        # In real IPFS: fetch from closest provider
        return "content_from_network"
    
    def pin(self, cid):
        """Pin content (keep it available)"""
        if cid in self.content_store:
            print(f"✓ Content pinned (will persist)")
            return True
        return False

# Example usage
if __name__ == "__main__":
    print("=== IPFS Example ===\n")
    
    ipfs = SimplifiedIPFS()
    
    # Add content
    content = "Hello, decentralized web!"
    cid = ipfs.add(content)
    
    # Retrieve content
    print(f"\nRetrieving content...")
    retrieved = ipfs.get(cid)
    print(f"Content: {retrieved}")
    
    # Pin for persistence
    print(f"\nPinning content...")
    ipfs.pin(cid)
```

**Cơ chế chứng minh lưu trữ của Filecoin** gồm hai loại bằng chứng mật mã:
- **Bằng chứng sao chép (Proof-of-Replication — PoRep)**: Chứng minh nhà cung cấp thực sự lưu một bản sao vật lý tách biệt của dữ liệu (dùng mã hóa Stacked Depth Robust — SDR để ngăn việc giả mạo bản sao).
- **Bằng chứng không-thời gian (Proof-of-Spacetime — PoSt)**: Chứng minh nhà cung cấp tiếp tục duy trì dữ liệu trong suốt thời hạn cam kết thông qua các thử thách ngẫu nhiên không thể dự đoán trước.

Biểu diễn hình thức của bước xác minh PoRep:

\[
\text{Verify}(\text{proof}, \text{data\_commitment}, \text{replica\_commitment}) \to \{\text{valid}, \text{invalid}\}
\]

**Hệ thống phân giải tên miền ENS** vận hành trên hợp đồng thông minh Ethereum, gồm hợp đồng đăng ký (`ENSRegistry`) và hợp đồng phân giải (`PublicResolver`):

```solidity
contract ENSRegistry {
    struct Record {
        address owner;
        address resolver;
        uint64 ttl;
    }
    
    mapping(bytes32 => Record) records;
    
    function setResolver(bytes32 node, address resolver) external {
        require(records[node].owner == msg.sender);
        records[node].resolver = resolver;
    }
}

contract PublicResolver {
    mapping(bytes32 => address) addresses;
    mapping(bytes32 => bytes) contenthashes;  // IPFS CID
    
    function setAddr(bytes32 node, address addr) external {
        addresses[node] = addr;
    }
    
    function setContenthash(bytes32 node, bytes memory hash) external {
        contenthashes[node] = hash;
    }
    
    function addr(bytes32 node) external view returns (address) {
        return addresses[node];
    }
}
```

Luồng phân giải: `alice.eth` → `namehash("alice.eth")` → truy vấn `ENSRegistry` để lấy địa chỉ resolver → truy vấn resolver để nhận địa chỉ ví hoặc mã băm nội dung IPFS.

---

## 4. Công thức toán học và mật mã học

Tính duy nhất của định địa chỉ nội dung dựa vào tính kháng va chạm của hàm băm. Với \(n\) tệp sử dụng SHA-256, xác suất xảy ra va chạm CID xấp xỉ:

\[
P(\text{collision}) \approx \frac{n^2}{2^{257}} \text{ for } n \text{ files}
\]

Ngay cả với một nghìn tỷ (\(10^{12}\)) tệp:
\[
P(\text{collision}) \approx \frac{(10^{12})^2}{2^{256}} \approx 10^{-53}
\]

Xác suất này không đáng kể, đảm bảo tính duy nhất trong thực tế.

Độ phức tạp tra cứu DHT theo thuật toán Kademlia trong mạng gồm \(N\) nút:

\[
\text{Hops} = O(\log_2 N)
\]

Với mạng 1 triệu nút:
\[
\text{Hops} \approx \log_2(10^6) \approx 20
\]

Đối với bằng chứng lưu trữ trên Filecoin, cả kích thước bằng chứng lẫn thời gian xác minh đều có độ phức tạp \(O(\log n)\) theo dung lượng dữ liệu \(n\), cho phép xác minh dữ liệu cỡ 1 TB bằng bằng chứng khoảng 100 KB trong vài mili-giây.

---

## 5. Góc nhìn triển khai

Ví dụ minh họa cách kết nối IPFS, ENS và Ethereum để triển khai một ứng dụng Web3 hoàn chỉnh:

```javascript
// Web3 App connecting IPFS + ENS + Ethereum

const ipfs = require('ipfs-http-client');
const { ethers } = require('ethers');

class Web3App {
    constructor() {
        this.ipfs = ipfs.create();
        this.provider = new ethers.providers.JsonRpcProvider();
        this.ensResolver = null;
    }
    
    async deployContent(htmlContent) {
        // 1. Upload to IPFS
        const result = await this.ipfs.add(htmlContent);
        const cid = result.cid.toString();
        
        console.log(`✓ Content uploaded to IPFS`);
        console.log(`  CID: ${cid}`);
        
        return cid;
    }
    
    async registerENS(name, cid) {
        // 2. Register ENS name pointing to IPFS CID
        const ensRegistry = new ethers.Contract(
            ENS_REGISTRY_ADDRESS,
            ENS_ABI,
            this.signer
        );
        
        const namehash = ethers.utils.namehash(name);
        
        // Set resolver
        await ensRegistry.setResolver(namehash, RESOLVER_ADDRESS);
        
        // Set content hash
        const resolver = new ethers.Contract(
            RESOLVER_ADDRESS,
            RESOLVER_ABI,
            this.signer
        );
        
        await resolver.setContenthash(namehash, cidToContentHash(cid));
        
        console.log(`✓ ENS registered: ${name}`);
        console.log(`  Points to: ipfs://${cid}`);
    }
    
    async resolveENS(name) {
        // 3. Resolve ENS name to IPFS content
        const resolver = await this.provider.getResolver(name);
        const contenthash = await resolver.getContentHash();
        
        // Convert to CID
        const cid = contenthashToCid(contenthash);
        
        // 4. Fetch from IPFS
        const content = await this.fetchFromIPFS(cid);
        
        console.log(`✓ Content retrieved for ${name}`);
        
        return content;
    }
    
    async fetchFromIPFS(cid) {
        const chunks = [];
        for await (const chunk of this.ipfs.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString();
    }
}

// Usage: User visits "alice.eth" in Web3 browser
// Browser resolves ENS -> gets IPFS CID -> fetches content from IPFS
// Fully decentralized! No central server!
```

Trong thực tế, giao diện người dùng của **Uniswap** có thể được lưu trên IPFS và truy cập qua tên miền ENS `uniswap.eth`, giúp ứng dụng vẫn có thể tiếp cận ngay cả khi máy chủ tập trung gặp gián đoạn.

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Hiệu năng của IPFS**: Tốc độ tải nội dung khi ít nút lưu trữ chậm hơn đáng kể so với CDN tập trung. Việc dùng các cổng chuyển tiếp HTTP (IPFS gateways như Cloudflare, Pinata) cải thiện tốc độ nhưng lại đưa yếu tố tập trung quay trở lại.
- **Chi phí lưu trữ Filecoin**: Hiện vẫn cao hơn so với dịch vụ đám mây truyền thống như AWS S3 (khoảng 2–5 lần) và phải cạnh tranh với hệ sinh thái công cụ hoàn thiện sẵn có của các nhà cung cấp đám mây lớn.
- **Tính bền vững dữ liệu**: Trên IPFS, nếu không còn ai duy trì ghim (pin) hoặc trả phí, dữ liệu có thể biến mất khỏi mạng, khác với cam kết chất lượng dịch vụ (SLA) của hạ tầng đám mây truyền thống.
- **Nhầm lẫn tên miền và hỗ trợ trình duyệt**: Tên miền `alice.com` và `alice.eth` thuộc hai hệ thống độc lập có thể gây rủi ro giả mạo; nhiều trình duyệt phổ thông chưa hỗ trợ phân giải ENS bản địa.
- **Chi phí tính toán phi tập trung**: Thực thi logic trên Ethereum đắt hơn nhiều lần so với máy chủ đám mây, giới hạn độ phức tạp của tác vụ chạy trực tiếp trên chuỗi.
- **Quản lý khóa cá nhân**: Tự lưu ký đồng nghĩa mất khóa bí mật là mất quyền truy cập vĩnh viễn; các cơ chế khôi phục xã hội (social recovery như ví Argent) cải thiện trải nghiệm nhưng đưa thêm giả định tin cậy vào nhóm người hỗ trợ khôi phục.

---

## 7. Các khái niệm liên quan

- **Quản trị hạ tầng bằng DAO**: ENS DAO quản trị tham số tên miền, còn hệ thống công chứng viên Filecoin Plus phân bổ lưu trữ thông qua cơ chế cộng đồng.
- **Arweave**: Cung cấp mô hình lưu trữ dài hạn trả phí một lần ban đầu dựa trên quỹ dự phòng (endowment) giả định chi phí lưu trữ giảm dần theo thời gian, thường dùng lưu trữ siêu dữ liệu NFT và giao diện ứng dụng.
- **The Graph**: Giao thức lập chỉ mục và truy vấn dữ liệu blockchain phi tập trung qua GraphQL (subgraph), thay thế cơ sở dữ liệu máy chủ tập trung cho backend của dApp.
- **Ceramic Network**: Bổ sung lớp quản lý luồng dữ liệu có thể thay đổi (mutable data streams) có lịch sử phiên bản trên nền IPFS vốn bất biến.
- **Push Protocol**: Cung cấp dịch vụ thông báo phi tập trung giữa các ví mà không phụ thuộc vào hạ tầng tập trung như Firebase hay Apple Push Notification Service.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"IPFS - Content Addressed, Versioned, P2P File System"** | 2014 | Juan Benet | Đặc tả giao thức IPFS |
| **"Filecoin: A Decentralized Storage Network"** | 2017 | Protocol Labs | Mạng lưu trữ phi tập trung dùng bằng chứng mật mã |
| **"EIP-137: Ethereum Domain Name Service"** | 2016 | Nick Johnson | Đặc tả hệ thống tên miền ENS |
| **"Decentralized Identifiers (DIDs) v1.0"** | 2021 | W3C | Tiêu chuẩn định danh phi tập trung DID |
| **"Verifiable Credentials Data Model"** | 2021 | W3C | Tiêu chuẩn mô hình chứng chỉ có thể xác minh |
| **"Arweave: A Protocol for Economically Sustainable Information Permanence"** | 2018 | Sam Williams, Viktor Diordiiev | Mô hình kinh tế lưu trữ dài hạn trả phí một lần |

---

## 9. Minh họa và tài liệu trực quan

### Kiến trúc Web2 so với Web3

**Ngăn xếp Web2**:
```
User → Browser → CDN → AWS → Centralized DB → Application Server
       ↓
   Platform owns everything
```

**Ngăn xếp Web3**:
```
User → Browser → IPFS → Ethereum → Your Wallet
       ↓
   You own your data
```

### Định địa chỉ nội dung trên IPFS
![IPFS Content Addressing](https://docs.ipfs.tech/assets/img/ipfs-illustration-works.png)  
*Nguồn: [IPFS Documentation](https://docs.ipfs.tech/concepts/)*

### Luồng phân giải ENS
![ENS Resolution](https://docs.ens.domains/img/ens-architecture.png)  
*Nguồn: [ENS Documentation](https://docs.ens.domains/)*

### Kiến trúc danh tính phi tập trung
![DID Architecture](https://www.w3.org/TR/did-core/diagrams/did-architecture.svg)  
*Nguồn: [W3C DID Specification](https://www.w3.org/TR/did-core/)*

### Công cụ tương tác tham khảo
- [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/) — Chạy nút IPFS trực tiếp trên máy cá nhân.
- [ENS Manager](https://app.ens.domains/) — Đăng ký và quản lý tên miền ENS.
- [Etherscan ENS](https://etherscan.io/enslookup) — Tra cứu bản ghi ENS trên chuỗi.
- [Fleek](https://fleek.co/) — Triển khai trang web Web3 lên hạ tầng phi tập trung.

---

## 10. Tóm tắt

Hạ tầng Web3 cung cấp các thành phần thay thế phi tập trung cho kiến trúc internet truyền thống: IPFS và Filecoin cho lưu trữ, ENS cho tên miền, DID cho danh tính và Ethereum cùng các mạng lưới liên quan cho tính toán. Dù vẫn còn những đánh đổi rõ rệt về hiệu năng, chi phí và trải nghiệm người dùng so với hạ tầng đám mây tập trung, các chuẩn mở (như W3C DID, ERC) và giải pháp mở rộng đang từng bước hoàn thiện hệ sinh thái ứng dụng phi tập trung.

---

**Kết thúc bài giảng**

Bài tiếp theo: Lecture 07.03 — MEV (Maximal Extractable Value)

---

## Video tham khảo

- **Xem trước:** [Why IPFS? - Juan Benet](https://www.youtube.com/watch?v=zE_WSLbqqvo) — IPFS, tiếng Anh. Juan Benet giải thích lý do IPFS định địa chỉ theo nội dung; nên xem trước phần lưu trữ phi tập trung.
- [What Is Filecoin? (2023)](https://www.youtube.com/watch?v=26ZdMAo23mM) — Filecoin, tiếng Anh. Mô tả thị trường lưu trữ Filecoin, giúp đối chiếu lớp khuyến khích kinh tế phía trên IPFS trong bài.
- [What is Ethereum Name Service (ENS) and Why It Matters?](https://www.youtube.com/watch?v=wDPy-SIwHOU) — CoinGecko, tiếng Anh. Giải thích hệ thống tên miền ENS, hỗ trợ phần danh tính và định danh dễ đọc.

## Tài liệu tham khảo

1. Benet, J. (2014). *IPFS - Content Addressed, Versioned, P2P File System*. IPFS Whitepaper.
2. Protocol Labs. (2017). *Filecoin: A Decentralized Storage Network*. Filecoin Whitepaper.
3. Johnson, N. (2016). *EIP-137: Ethereum Domain Name Service - Specification*. Ethereum Improvement Proposals.
4. W3C. (2021). *Decentralized Identifiers (DIDs) v1.0*. W3C Recommendation.
5. W3C. (2021). *Verifiable Credentials Data Model v1.0*. W3C Recommendation.
