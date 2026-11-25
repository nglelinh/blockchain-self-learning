---
layout: post
title: "Lecture 07.01: NFTs và Digital Ownership - Non-Fungible Tokens"
chapter: '07'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter07
---

# Bài giảng 07.01: NFT và Quyền sở hữu số (Non-Fungible Tokens)

Câu nói châm biếm nổi tiếng nhất về NFT là: *"Tôi chỉ cần bấm chuột phải rồi chọn Lưu ảnh (Save As) là có ngay bức tranh giống hệt!"* Câu đùa ấy thực ra chạm đúng bản chất cốt lõi nhất của bài học này: **một NFT không hề là tệp ảnh JPEG**. Bức ảnh chỉ là phần hiển thị, còn NFT là **bản ghi quyền sở hữu duy nhất, bất biến và kiểm chứng công khai bằng mật mã** trên blockchain — giống như việc chụp ảnh bức tranh Mona Lisa bằng điện thoại không biến bạn thành chủ sở hữu hợp pháp của bảo tàng Louvre.

Nhưng chính ở đây cũng ẩn giấu một cạm bẫy kỹ thuật chết người: nếu siêu dữ liệu (metadata) của NFT trỏ về một máy chủ `https://` thông thường thay vì hệ thống lưu trữ định địa chỉ theo nội dung (IPFS/Arweave), chiếc NFT trị giá hàng trăm nghìn đô la có thể biến thành một trang báo lỗi `404 Not Found` ngay khi máy chủ đó đóng cửa!

---

## Kiến thức cần nhớ: NFT và Quyền sở hữu số đứng trên bốn trụ cột nào?

1. **Chuẩn mã hóa tài sản không thể thay thế (ERC-721 & ERC-1155):** Mỗi token được định danh duy nhất bởi cặp `(contractAddress, tokenId)` kèm bảng ánh xạ `ownerOf[tokenId] -> address` bất khả xâm phạm.
2. **Định địa chỉ theo nội dung (Content Addressing — IPFS/Arweave):** Dùng mã băm mật mã (CID) làm chính địa chỉ của tệp dữ liệu, bảo đảm không ai có thể lén tráo đổi hình ảnh hay thuộc tính sau khi đúc (mint).
3. **Tiền bản quyền & Giao dịch (EIP-2981):** Cơ chế chia sẻ phần trăm doanh thu cho tác giả mỗi khi tài sản đổi chủ trên thị trường thứ cấp (kèm thách thức thực thi giữa các sàn giao dịch).
4. **Ứng dụng vượt xa nghệ thuật số:** Vị thế thanh khoản tập trung Uniswap v3 (mỗi vị thế LP là một NFT!), vé sự kiện chống giả mạo, chứng chỉ học thuật không thể chuyển nhượng (*Soulbound Tokens*) và tài sản thế giới thực (RWA).

---

## 1. Tổng quan về khái niệm

**Token không thể thay thế (Non-Fungible Tokens — NFTs)** mang lại sự thay đổi căn bản trong cách biểu diễn quyền sở hữu trên môi trường số. Trước khi có blockchain, tài sản số luôn gặp một đặc tính cố hữu là có thể sao chép hoàn hảo với chi phí gần như bằng không — một tệp nhạc MP3, một bức ảnh số hay một tài liệu đều có thể nhân bản vô hạn. Điều này tạo ra mâu thuẫn giữa sự dồi dào của hàng hóa số và tính khan hiếm cần thiết để hình thành giá trị kinh tế.

NFT giải quyết bài toán đó bằng cách tạo ra **tính khan hiếm có thể kiểm chứng** và **quyền sở hữu xác thực được** trên blockchain. Mỗi NFT là một token duy nhất, không thể trao đổi ngang giá 1-1 với token khác (non-fungible), đồng thời có lịch sử sở hữu được lưu trữ minh bạch và lâu dài trên chuỗi.

Lịch sử của NFT bắt đầu từ khá sớm: năm 2012, **Colored Coins** trên Bitcoin thử nghiệm biểu diễn tài sản thực trên chuỗi; năm 2014, nền tảng **Counterparty** cho phép phát hành token tùy chỉnh. Tuy nhiên, phong trào NFT chỉ thực sự hình thành từ năm 2017 với **CryptoPunks** (10.000 nhân vật nghệ thuật pixel tạo bằng thuật toán và phát miễn phí trên Ethereum) cùng trò chơi **CryptoKitties** (nhân giống và giao dịch mèo số, từng gây tắc nghẽn mạng Ethereum).

Đến năm 2021, thị trường NFT tăng trưởng mạnh: nghệ sĩ **Beeple** bán một tác phẩm NFT với giá 69 triệu USD qua nhà đấu giá Christie's; bộ sưu tập **Bored Ape Yacht Club** thu hút sự chú ý rộng rãi; và ứng dụng NFT mở rộng sang trò chơi điện tử, âm nhạc, bất động sản, danh tính và chứng chỉ số.

Vượt ra ngoài yếu tố đầu cơ hay sưu tầm nghệ thuật, đóng góp cốt lõi của NFT là **quyền sở hữu có thể lập trình (programmable ownership)**. Trong khi quyền sở hữu truyền thống cần hệ thống pháp lý, văn phòng đăng ký và trung gian xác nhận, quyền sở hữu NFT được thực thi bằng mã nguồn và mật mã học, hỗ trợ sở hữu phân mảnh, tự động chia tiền bản quyền khi bán lại và khả năng kết hợp giữa nhiều ứng dụng.

---

## 2. Hiểu biết trực quan

Để hiểu rõ NFT, hãy đối chiếu với **token có thể thay thế (fungible tokens)**. Tính có thể thay thế nghĩa là mọi đơn vị tài sản đều giống hệt nhau và hoán đổi ngang giá được — một tờ 1 USD có thể đổi lấy bất kỳ tờ 1 USD nào khác, tương tự mỗi BTC hay ETH đều có chức năng và giá trị như nhau. Đặc tính này phù hợp cho tiền tệ nhưng không phù hợp để đại diện cho các vật phẩm độc nhất.

Ngược lại, một bức tranh nổi tiếng như Mona Lisa có xuất xứ riêng biệt, không thể chia nhỏ thành các phần tương đương hay đổi ngang 1-1 với bức tranh khác — đó là tính không thể thay thế (non-fungibility).

Trong không gian số, mỗi NFT mang một mã định danh (`tokenId`) duy nhất, gắn liền với siêu dữ liệu (ảnh, mô tả, thuộc tính) và được theo dõi chủ sở hữu riêng biệt. Sở hữu một CryptoPunk nghĩa là sở hữu đúng nhân vật có mã số cụ thể đó, không thể nhầm lẫn với mã số khác.

Có thể hình dung NFT như một **giấy chứng nhận xác thực số (digital certificate of authenticity)** được lưu trên blockchain: không thể làm giả (bảo vệ bằng mật mã), không thể thất lạc bản ghi (lưu công khai trên chuỗi) và có lịch sử chuyển nhượng minh bạch. Hơn thế nữa, nhờ hợp đồng thông minh, NFT còn có thể chứa **logic lập trình sẵn** — chẳng hạn vé sự kiện tự hết hạn sau ngày diễn ra, tác phẩm âm nhạc tự động chia phần trăm bản quyền cho nghệ sĩ khi chuyển nhượng, hoặc vật phẩm trò chơi tự nâng cấp theo quá trình sử dụng.

---

## 3. Nền tảng kỹ thuật

Các chuẩn NFT trên Ethereum được định nghĩa thông qua hệ thống ERC (Ethereum Request for Comments). Chuẩn nền tảng nhất là **ERC-721**, do **William Entriken, Dieter Shirley, Jacob Evans và Nastassia Sachs** đề xuất năm 2018, quy định giao diện tối thiểu giúp hợp đồng NFT tương thích với ví, sàn giao dịch và các hợp đồng khác.

Các hàm cốt lõi của ERC-721 gồm: `balanceOf` (số lượng NFT một địa chỉ sở hữu), `ownerOf` (chủ sở hữu của một `tokenId`), `transferFrom` (chuyển nhượng), `approve` (ủy quyền chuyển nhượng một token cụ thể) và `safeTransferFrom` (chuyển nhượng an toàn có kiểm tra khả năng tiếp nhận của hợp đồng đích). Mỗi token được định danh bằng giá trị `uint256` duy nhất.

Về **quản lý siêu dữ liệu (metadata)**, hợp đồng thường lưu một đường dẫn gốc (`baseURI`) kết hợp với `tokenId` trỏ tới tệp siêu dữ liệu lưu ngoài chuỗi (trên IPFS, Arweave hoặc máy chủ tập trung) vì lưu tệp lớn trực tiếp trên Ethereum rất tốn kém. Thực hành tốt khuyến nghị sử dụng lưu trữ phi tập trung định địa chỉ theo nội dung (như IPFS) để tăng tính bền vững.

**ERC-1155**, do nhóm **Enjin** đề xuất, mở rộng thành **chuẩn đa token (multi-token standard)** cho phép một hợp đồng quản lý đồng thời cả token có thể thay thế lẫn không thể thay thế. Chuẩn này đặc biệt phù hợp với trò chơi điện tử nhờ hỗ trợ chuyển nhượng hàng loạt (batch transfer) trong một giao dịch duy nhất, tiết kiệm đáng kể chi phí gas.

Hệ sinh thái NFT cũng phát triển nhiều mẫu thiết kế nâng cao:
- **NFT lồng nhau (Nested NFTs)**: Một NFT có thể sở hữu các NFT khác (ví dụ nhân vật sở hữu vũ khí).
- **NFT phân mảnh (Fractionalized NFTs)**: Chia một NFT giá trị lớn thành nhiều cổ phần dạng token fungible.
- **NFT động (Dynamic NFTs)**: Cập nhật siêu dữ liệu theo điều kiện bên ngoài (chẳng hạn thống kê thi đấu của vận động viên).
- **Soulbound Tokens (SBTs)**: Do Vitalik Buterin đề xuất, là các NFT không thể chuyển nhượng dùng cho danh tính và chứng chỉ.

Kiến trúc thực tế thường tách biệt các thành phần: hợp đồng lõi theo dõi quyền sở hữu, dịch vụ siêu dữ liệu cung cấp thông tin hiển thị, hợp đồng sàn giao dịch xử lý mua bán và giao diện bản quyền quản lý chia sẻ doanh thu thứ cấp.

---

## 4. Công thức toán học và mật mã học

Tính duy nhất của NFT được đảm bảo bởi không gian mã định danh `uint256`:

\[
N_{\max} = 2^{256} \approx 1.16 \times 10^{77}
\]

Con số này gần tương đương quy mô số nguyên tử trong vũ trụ quan sát được (ước tính khoảng \(10^{78}\)–\(10^{80}\)), tạo ra không gian định danh gần như vô hạn trong thực tế thiết kế.

Việc xác minh quyền sở hữu dựa trên cùng nguyên thủy mật mã như token thông thường: với hợp đồng \(C\) và mã \(t\), hàm \(\text{ownerOf}(t)\) trả về địa chỉ \(A\); người nắm giữ địa chỉ \(A\) phải chứng minh sở hữu khóa bí mật tương ứng thông qua chữ ký ECDSA.

Về an toàn chuyển nhượng, `transferFrom` cập nhật trực tiếp bảng ánh xạ chủ sở hữu:

\[
\text{owner}[t] \leftarrow A_{\text{new}} \quad \text{(atomic state update)}
\]

Trong khi đó, `safeTransferFrom` bổ sung bước kiểm tra khi người nhận là một hợp đồng thông minh bằng cách gọi hàm `onERC721Received`:

\[
\text{if recipient is contract: require}(recipient.\text{onERC721Received}(...) = \text{MAGIC\_VALUE})
\]

Giá trị hằng số `0x150b7a02` xác nhận hợp đồng đích biết cách xử lý ERC-721, tránh nguy cơ khóa vĩnh viễn NFT.

**Công thức bản quyền theo chuẩn ERC-2981**:

\[
(\text{receiver}, \text{royaltyAmount}) = \text{royaltyInfo}(\text{tokenId}, \text{salePrice})
\]

Trong đó:

\[
\text{royaltyAmount} = \text{salePrice} \times \frac{\text{royaltyBasisPoints}}{10000}
\]

Ví dụ với mức bản quyền 5% (500 điểm cơ bản) và giá bán 10 ETH:

\[
\text{royaltyAmount} = 10 \times \frac{500}{10000} = 0.5 \text{ ETH}
\]

**Độ hiếm trong các bộ sưu tập NFT tạo sinh**: Với \(n\) nhóm thuộc tính, mỗi nhóm có \(m_i\) biến thể, tổng số tổ hợp có thể tạo ra là:

\[
C = \prod_{i=1}^{n} m_i
\]

Điểm độ hiếm (rarity score) thường được ước lượng theo tổng nghịch đảo tần suất xuất hiện \(f_i\) của từng thuộc tính trong bộ sưu tập:

\[
R(t) = \sum_{i=1}^{k} \frac{1}{f_i}
\]

Thuộc tính càng hiếm (tần suất \(f_i\) càng nhỏ) thì đóng góp vào điểm độ hiếm càng lớn.

---

### Giải thích: tự tay tính chi phí lưu ảnh trực tiếp On-chain vs. Lưu mã băm CID (IPFS)

Tại sao hầu hết NFT không lưu trực tiếp tệp ảnh lên Ethereum mà chỉ lưu một đường dẫn mã băm `ipfs://...`? Hãy tự kiểm chứng bằng chi phí lưu trữ thực của máy ảo Ethereum (EVM):

Trên Ethereum, ghi mới 1 khe nhớ (`SSTORE`) cỡ **32 byte** tốn **$$20{,}000\text{ gas}$$** — tương đương $$\frac{20{,}000}{32} = 625\text{ gas/byte}$$.

1. **Nếu lưu thẳng 1 ảnh PNG dung lượng 500 KB ($$500{,}000\text{ byte}$$) lên chuỗi:**
   $$
   \text{Gas cần thiết} = 500{,}000 \times 625 = \mathbf{312{,}500{,}000\text{ gas}!}
   $$
   Con số này **gấp hơn 10 lần giới hạn gas của cả một block Ethereum (30 triệu gas)** — về mặt kỹ thuật thậm chí không thể nhét vừa vào một giao dịch đơn lẻ!

2. **Nếu lưu tệp ảnh trên IPFS/Arweave và chỉ ghi mã băm CID (32 byte) lên chuỗi:**
   - Chi phí lưu trữ trên chuỗi: chỉ đúng **$$20{,}000\text{ gas}$$** (rẻ hơn **15.625 lần**, tương đương chưa tới 1 USD ở mức phí bình thường!).
   - Tính toàn vẹn mật mã: vì $$\mathrm{CID} = \mathrm{SHA256}(\text{dữ liệu ảnh})$$, bất kỳ ai sửa dù chỉ 1 pixel trên ảnh sẽ làm CID thay đổi hoàn toàn và bị ví người dùng phát hiện ngay lập tức!

(Chỉ những dự án nghệ thuật mã nguồn thuần như *CryptoPunks* hay *Autoglyphs* — dùng vài trăm byte mã SVG/thuật toán sinh hình — mới đủ nhỏ để lưu 100% trực tiếp on-chain!)

## 5. Góc nhìn triển khai

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Complete NFT Implementation with Advanced Features
 * @dev Includes: Minting, Metadata, Royalties, Enumeration
 */
contract AdvancedNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Royalty info (ERC-2981 standard)
    address public royaltyReceiver;
    uint96 public royaltyBasisPoints = 500; // 5% default
    
    // Metadata
    string private _baseTokenURI;
    mapping(uint256 => string) private _tokenURIs;
    
    // Supply tracking
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event RoyaltySet(address indexed receiver, uint96 basisPoints);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address _royaltyReceiver
    ) ERC721(name, symbol) {
        _baseTokenURI = baseURI;
        royaltyReceiver = _royaltyReceiver;
    }
    
    /**
     * @dev Mint new NFT
     */
    function mintNFT(address recipient, string memory metadataURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        require(newTokenId <= MAX_SUPPLY, "Max supply reached");
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        emit NFTMinted(recipient, newTokenId, metadataURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Batch mint (gas efficient)
     */
    function batchMint(address[] memory recipients, string[] memory metadataURIs) 
        public 
        onlyOwner 
    {
        require(recipients.length == metadataURIs.length, "Length mismatch");
        require(_tokenIds.current() + recipients.length <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIds.increment();
            uint256 tokenId = _tokenIds.current();
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, metadataURIs[i]);
            
            emit NFTMinted(recipients[i], tokenId, metadataURIs[i]);
        }
    }
    
    /**
     * @dev Set royalty info
     */
    function setRoyaltyInfo(address receiver, uint96 basisPoints) public onlyOwner {
        require(basisPoints <= 10000, "Royalty too high"); // Max 100%
        royaltyReceiver = receiver;
        royaltyBasisPoints = basisPoints;
        
        emit RoyaltySet(receiver, basisPoints);
    }
    
    /**
     * @dev ERC-2981 royalty info
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        royaltyAmount = (salePrice * royaltyBasisPoints) / 10000;
        return (royaltyReceiver, royaltyAmount);
    }
    
    /**
     * @dev Get base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Set base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Check if token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
    
    /**
     * @dev Token URI override for ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Supports interface (for marketplace compatibility)
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return interfaceId == 0x2a55205a // ERC-2981 royalty
            || super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Burn NFT
     */
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner or approved");
        _burn(tokenId);
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

/**
 * @title NFT Marketplace
 * @dev Simple marketplace for buying/selling NFTs
 */
contract NFTMarketplace {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }
    
    mapping(bytes32 => Listing) public listings;
    uint256 public constant MARKETPLACE_FEE = 250; // 2.5%
    
    event Listed(
        bytes32 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event Sold(
        bytes32 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    
    event Delisted(bytes32 indexed listingId);
    
    /**
     * @dev List NFT for sale
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public returns (bytes32) {
        require(price > 0, "Price must be > 0");
        
        // Verify ownership
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        
        // Verify approval
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );
        
        // Create listing ID
        bytes32 listingId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp)
        );
        
        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });
        
        emit Listed(listingId, msg.sender, nftContract, tokenId, price);
        
        return listingId;
    }
    
    /**
     * @dev Buy NFT
     */
    function buyNFT(bytes32 listingId) public payable {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Mark as inactive
        listing.active = false;
        
        // Calculate fees
        uint256 marketplaceFee = (listing.price * MARKETPLACE_FEE) / 10000;
        uint256 sellerProceeds = listing.price - marketplaceFee;
        
        // Check royalty (ERC-2981)
        (address royaltyReceiver, uint256 royaltyAmount) = 
            IERC2981(listing.nftContract).royaltyInfo(listing.tokenId, listing.price);
        
        if (royaltyAmount > 0) {
            sellerProceeds -= royaltyAmount;
            payable(royaltyReceiver).transfer(royaltyAmount);
        }
        
        // Transfer NFT
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        
        // Pay seller
        payable(listing.seller).transfer(sellerProceeds);
        
        // Refund excess
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit Sold(listingId, msg.sender, listing.price);
    }
    
    /**
     * @dev Delist NFT
     */
    function delistNFT(bytes32 listingId) public {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");
        
        listing.active = false;
        
        emit Delisted(listingId);
    }
    
    /**
     * @dev Withdraw marketplace fees (owner only)
     */
    function withdrawFees() public {
        payable(owner()).transfer(address(this).balance);
    }
}
```

Các nền tảng thực tế như OpenSea, Rarible và Foundation mở rộng trên những nguyên thủy này với xác minh bộ sưu tập, đúc lười (lazy minting — chỉ đúc khi có người mua), đấu giá (Anh, Hà Lan) và tối ưu gas như **ERC721A** (tối ưu của Azuki giúp đúc nhiều NFT với chi phí gas tiệm cận một NFT) cùng danh sách cho phép bằng bằng chứng Merkle.

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Tính bền vững của siêu dữ liệu**: Nếu NFT trỏ tới URL HTTP thông thường, nội dung có thể biến mất khi máy chủ ngừng hoạt động. IPFS cải thiện bằng định địa chỉ theo nội dung nhưng vẫn cần có nút ghim (pin) dữ liệu; Arweave hướng tới lưu trữ vĩnh viễn bằng phí trả một lần nhưng tính bền vững kinh tế dài hạn vẫn cần thời gian kiểm chứng.
- **Lừa đảo và rủi ro ủy quyền**: Kẻ tấn công thường dựng hợp đồng giả mạo lừa người dùng ký `setApprovalForAll`, qua đó giành quyền chuyển toàn bộ NFT thuộc một bộ sưu tập ra khỏi ví nạn nhân.
- **Giao dịch giả tạo (Wash trading)**: Kẻ thao túng tự mua đi bán lại NFT giữa các ví của chính mình để thổi phồng giá sàn và khối lượng giao dịch, gây sai lệch thông tin cho người mua.
- **Bản quyền và sở hữu trí tuệ**: Sở hữu một NFT mặc định không đồng nghĩa với sở hữu bản quyền tác phẩm gốc trừ khi có thỏa thuận rõ ràng; đồng thời bất kỳ ai cũng có thể đúc NFT trỏ tới nội dung không phải của mình.
- **Giới hạn thực thi tiền bản quyền**: Chuẩn ERC-2981 chỉ cung cấp thông tin bản quyền chứ không thể cưỡng chế ở cấp giao thức — giao dịch trực tiếp giữa hai ví hoặc qua sàn không tôn trọng bản quyền vẫn bỏ qua được khoản phí này.
- **Tác động môi trường**: Mối lo ngại về năng lượng tiêu thụ khi đúc NFT trên Ethereum đã giảm đáng kể sau sự kiện The Merge chuyển sang Proof-of-Stake (giảm khoảng 99,95% so với mức xấp xỉ 200 kWh trước đó).

---

## 7. Các khái niệm liên quan

- **Danh tính phi tập trung (DID) và Soulbound Tokens (SBTs)**: Ứng dụng token không thể chuyển nhượng để biểu diễn bằng cấp, chứng chỉ và tư cách thành viên, góp phần xây dựng mô hình Xã hội Phi tập trung (DeSoc).
- **Phân mảnh NFT (Fractionalization)**: Khóa một NFT giá trị lớn trong hợp đồng kho và phát hành \(n\) cổ phần ERC-20 (mỗi cổ phần đại diện \(1/n\) quyền sở hữu) để tạo thanh khoản, kèm cơ chế mua lại toàn bộ.
- **NFT động (Dynamic NFTs)**: Kết hợp với oracle như Chainlink để cập nhật siêu dữ liệu theo dữ liệu thực tế (thành tích thể thao, thời tiết).
- **So sánh các chuẩn NFT**: ERC-721 tối ưu cho vật phẩm đơn lẻ; ERC-1155 hiệu quả cho trò chơi và chuyển hàng loạt; ERC-998 hỗ trợ NFT sở hữu các token khác theo cấu trúc phân cấp.
- **NFT xuyên chuỗi (Cross-chain / Omnichain NFTs)**: Cho phép di chuyển NFT giữa các chuỗi (như từ Ethereum sang Ronin hoặc qua giao thức truyền tin như LayerZero) mà vẫn giữ nguyên bản sắc thống nhất.

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"ERC-721: Non-Fungible Token Standard"** | 2018 | William Entriken, Dieter Shirley, Jacob Evans, Nastassia Sachs | Định nghĩa chuẩn NFT nền tảng trên Ethereum |
| **"ERC-1155: Multi Token Standard"** | 2018 | Witek Radomski, Andrew Cooke, Philippe Castonguay và cộng sự | Chuẩn đa token tối ưu cho trò chơi và metaverse |
| **"ERC-998: Composable Non-Fungible Token Standard"** | 2018 | Matt Lockyer, Nick Mudge | Chuẩn NFT có thể sở hữu các token khác |
| **"Decentralized Society: Finding Web3's Soul"** | 2022 | E. Glen Weyl, Puja Ohlhaver, Vitalik Buterin | Đề xuất Soulbound Tokens cho danh tính số |
| **"ERC-2981: NFT Royalty Standard"** | 2020 | Zach Burks, James Morgan, Blaine Malone, James Seibel | Chuẩn hóa giao diện thông tin tiền bản quyền |
| **"ERC-4907: Rental NFT, Extension for ERC-721"** | 2022 | Anders, Lance, Shrug | Tách biệt quyền sở hữu và quyền sử dụng cho thuê |
| **"Art Blocks: On-Chain Generative Art"** | 2020 | Erick Calderon (Snowfro) | Nghệ thuật tạo sinh lưu thuật toán trên chuỗi |
| **"The Non-Fungible Token Bible"** | 2020 | Đội ngũ OpenSea | Tài liệu tổng quan toàn diện về hệ sinh thái NFT |

---

## 9. Minh họa và tài liệu trực quan

### Luồng giao dịch NFT trên Ethereum
![Ethereum NFT Transaction Flow](https://ethereum.org/static/7f6b2b6e0c8b4e7f8d5e9a3c2b1f0e8d/nft-diagram.png)  
*Nguồn: [Ethereum.org - NFT Documentation](https://ethereum.org/en/nft/)*

### Cấu trúc siêu dữ liệu NFT
![NFT Metadata Structure](https://docs.opensea.io/img/metadata-structure.png)  
*Nguồn: [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)*

### So sánh ERC-721 và ERC-1155

| Đặc điểm | ERC-721 | ERC-1155 |
|----------|---------|----------|
| Tính duy nhất của token | Một `tokenId` = một vật phẩm duy nhất | Có thể nhiều bản sao trên cùng một `tokenId` |
| Chuyển nhượng hàng loạt | Không (từng token một) | Có (gộp nhiều token trong một giao dịch) |
| Fungible + Non-fungible | Cần các hợp đồng riêng biệt | Một hợp đồng quản lý cả hai loại |
| Hiệu quả chi phí gas | Thấp hơn (xử lý đơn lẻ) | Cao hơn (nhờ thao tác hàng loạt) |
| Ứng dụng điển hình | Nghệ thuật, sưu tầm độc bản | Trò chơi điện tử, metaverse |

*Nguồn: [Ethereum EIP Repository](https://eips.ethereum.org/)*

### Công cụ tương tác tham khảo
- [OpenSea](https://opensea.io/) — Sàn giao dịch NFT quy mô lớn.
- [Etherscan NFT Tracker](https://etherscan.io/nft-top-contracts) — Công cụ theo dõi dữ liệu NFT trên chuỗi.
- [IPFS](https://ipfs.io/) — Hệ thống lưu trữ phi tập trung cho siêu dữ liệu.
- [Arweave](https://www.arweave.org/) — Giải pháp lưu trữ dài hạn.
- [Rarible](https://rarible.com/) — Nền tảng tạo và giao dịch NFT.
- [Zora](https://zora.co/) — Giao thức và thị trường NFT.

---

## 10. Tóm tắt

NFT tạo ra mô hình quyền sở hữu số có thể kiểm chứng bằng mật mã và lập trình được thông qua các chuẩn hợp đồng như ERC-721 và ERC-1155. Nhờ không gian định danh 256-bit, cơ chế chuyển nhượng an toàn và khả năng mở rộng sang bản quyền, phân mảnh hay dữ liệu động, NFT vượt xa phạm vi tranh ảnh sưu tầm để ứng dụng vào trò chơi, chứng chỉ, danh tính và số hóa tài sản. Đồng thời, các vấn đề về tính bền vững của siêu dữ liệu, rủi ro ủy quyền, giao dịch giả tạo và bản quyền sở hữu trí tuệ đòi hỏi thiết kế hệ thống và nhận thức người dùng chặt chẽ.

---

**Kết thúc bài giảng**

Bài tiếp theo: Lecture 07.02 — Web3 Infrastructure và Decentralized Storage

---

## Video tham khảo

- **Xem trước:** [What are ERC-721 Contracts? ERC-721 Explained with Animations](https://www.youtube.com/watch?v=f4KgeGwuyzs) — Crypto Explained, tiếng Anh. Minh họa trực quan hợp đồng ERC-721; nên xem trước phần ánh xạ `tokenId` và chủ sở hữu.
- [ERC-721 Tokens Explained: Complete NFT Standard Guide for Beginners](https://www.youtube.com/watch?v=8Nj1lA9Hl-c) — CodeLucky, tiếng Anh. Trình bày chi tiết giao diện ERC-721, giúp đối chiếu phần siêu dữ liệu và cơ chế chuyển nhượng trong bài.

## Tài liệu tham khảo

1. Entriken, W., Shirley, D., Evans, J., & Sachs, N. (2018). *ERC-721: Non-Fungible Token Standard*. Ethereum Improvement Proposals.
2. Radomski, W., Cooke, A., Castonguay, P., et al. (2018). *ERC-1155: Multi Token Standard*. Ethereum Improvement Proposals.
3. Weyl, E. G., Ohlhaver, P., & Buterin, V. (2022). *Decentralized Society: Finding Web3's Soul*. arXiv preprint.
4. OpenSea Documentation. (2024). *NFT Metadata Standards*. https://docs.opensea.io/
5. Ethereum.org. (2024). *Non-Fungible Tokens (NFT)*. https://ethereum.org/en/nft/
