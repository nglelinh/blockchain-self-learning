---
layout: post
title: "Lecture 03.02: Solidity Programming - Smart Contract Development"
chapter: '03'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
---

# Bài giảng: Lập trình Solidity — Phát triển hợp đồng thông minh

Trong lập trình web truyền thống, nếu bạn viết nhầm một dòng code, bạn có thể sửa lỗi và triển khai bản vá sau 5 phút. Nhưng trên Ethereum, hợp đồng thông minh một khi đã triển khai lên chuỗi thường là **bất biến** và nắm giữ trực tiếp hàng triệu đô la tài sản công khai — bất kỳ kẻ tấn công nào trên thế giới cũng có thể đọc mã nguồn và khai thác sai sót chỉ trong một khối 12 giây! Chính vụ tấn công **The DAO năm 2016** (mất 3.6 triệu ETH chỉ vì đặt dòng cập nhật số dư *sau* dòng gửi tiền — lỗi Reentrancy) đã dạy cả ngành một bài học xương máu: lập trình **Solidity** không chỉ là viết mã chạy đúng, mà là thiết kế phần mềm trong môi trường đối kháng hoàn toàn.

---

## Bản đồ kiến thức nền: Lập trình Solidity an toàn và tối ưu đứng trên ba trụ cột nào?

### 1. Hệ kiểu tĩnh, Giao diện ABI và Bố cục Ô nhớ (Storage Layout)
Solidity biên dịch thành bytecode EVM và giao tiếp với thế giới bên ngoài qua chuẩn **ABI (Application Binary Interface)**: mỗi hàm được nhận diện bằng **4 byte đầu của mã băm Keccak-256** của chữ ký hàm (ví dụ `transfer(address,uint256)` có selector `0xa9059cbb`). Bên trong hợp đồng, các biến trạng thái được xếp tuần tự vào các **ô nhớ 32 byte (storage slots)** — cách bạn sắp xếp thứ tự khai báo biến quyết định trực tiếp chi phí gas!

### 2. Tư duy bảo mật đối kháng và Mẫu Checks–Effects–Interactions (CEI)
Khác với phần mềm thông thường, khi hợp đồng của bạn gọi sang một địa chỉ bên ngoài (như gửi ETH), địa chỉ đó có thể là một hợp đồng ác ý lập tức **gọi ngược lại (re-enter)** vào chính hàm đang chạy dở! Quy tắc sống còn **Checks–Effects–Interactions** yêu cầu luôn: (1) Kiểm tra điều kiện (`require`), (2) Cập nhật trạng thái số dư trước, rồi mới (3) Gửi tiền ra ngoài sau cùng (kết hợp `ReentrancyGuard`).

### 3. Tiêu chuẩn giao diện (ERC) và Mẫu thiết kế nâng cấp
Toàn bộ hệ sinh thái Ethereum lắp ghép được với nhau như gạch Lego nhờ các giao diện chuẩn: **ERC-20** (token thay thế được), **ERC-721 / ERC-1155** (NFT), và **Proxy Pattern (`delegatecall`)** cho phép tách riêng hợp đồng lưu dữ liệu với hợp đồng chứa logic khi cần nâng cấp bảo mật có kiểm soát.

---

### Khung giải thích: tự tay tính tiết kiệm 33% Gas nhờ kỹ thuật đóng gói ô nhớ (Storage Slot Packing) (nên đọc chậm)

Mỗi ô nhớ `storage` của EVM rộng đúng **32 byte (256 bit)**, và ghi một ô mới từ `0` sang khác `0` tốn khoảng **20.000 gas**. Hãy so sánh hai cách viết cùng một cấu trúc `struct` gồm 3 biến (`uint128` = 16 byte, `uint256` = 32 byte):

1. **Cách viết chưa tối ưu (xen kẽ kích thước):**
   - `uint128 a;` (16 byte) → đặt vào **Slot 0** (còn thừa 16 byte trống).
   - `uint256 b;` (32 byte) → không vừa 16 byte trống của Slot 0, buộc phải nhảy sang **Slot 1**!
   - `uint128 c;` (16 byte) → buộc phải nhảy sang **Slot 2**!
   - **Tổng chi phí khởi tạo:** $$3\text{ slot} \times 20\,000\text{ gas} = \mathbf{60\,000\text{ gas}}$$.
2. **Cách viết tối ưu (gom các biến nhỏ đứng cạnh nhau):**
   - `uint128 a;` (16 byte) và `uint128 c;` (16 byte) → $$16 + 16 = 32\text{ byte}$$, trình biên dịch Solidity tự động **đóng gói khít cả hai vào chung Slot 0**!
   - `uint256 b;` (32 byte) → nằm gọn trong **Slot 1**.
   - **Tổng chi phí khởi tạo:** $$2\text{ slot} \times 20\,000\text{ gas} = \mathbf{40\,000\text{ gas}}$$!
3. **Kết luận:** Không hề thay đổi bất kỳ logic nào của chương trình, chỉ đổi vị trí hai dòng khai báo biến đã cắt giảm ngay **20.000 gas (33.3%)** cho mỗi người dùng tạo mới bản ghi — nhân lên 1 triệu người dùng, đó là khoản tiết kiệm khổng lồ!

---

## 1. Tổng quan về khái niệm

**Solidity** là ngôn ngữ lập trình chính dùng để viết hợp đồng thông minh trên Ethereum. Được **Gavin Wood** (đồng sáng lập Ethereum) thiết kế vào năm 2014, Solidity là ngôn ngữ **định kiểu tĩnh (statically-typed)** và **hướng hợp đồng (contract-oriented)**, có cú pháp gần với JavaScript và C++ nhưng được tối ưu hóa cho môi trường thực thi blockchain.

**Vì sao chọn Solidity?**

Trước Solidity, đã có một số ngôn ngữ thử nghiệm cho hợp đồng thông minh:
- **Serpent**: Cú pháp giống Python, đã ngừng sử dụng do các vấn đề bảo mật.
- **LLL (Low-Level Lisp)**: Ở mức quá thấp, khó viết và bảo trì.
- **Mutan**: Cú pháp giống Go, đã ngừng phát triển.

Solidity trở thành lựa chọn phổ biến nhờ các yếu tố:
1. **Cú pháp quen thuộc**: Tương đồng với JavaScript và C++.
2. **Bộ tính năng đầy đủ**: Hỗ trợ kế thừa, thư viện và các kiểu dữ liệu phức hợp.
3. **Hệ sinh thái công cụ phong phú**: Remix, Hardhat, Foundry.
4. **Cộng đồng lớn**: Nhiều tài liệu, thư viện chuẩn và kinh nghiệm kiểm toán.
5. **Cải tiến liên tục**: Được duy trì và nâng cấp thường xuyên.

**Vị trí của Solidity trong kiến trúc Ethereum**:

```
Developer writes:
    Solidity (.sol)
         ↓
    Compiler (solc)
         ↓
    EVM Bytecode (.bin)
         ↓
    Deployed on Ethereum
         ↓
    Executed by EVM
```

**Triết lý thiết kế**:

Solidity cân bằng giữa bốn mục tiêu:
- **Khả năng biểu đạt**: Đủ tính năng để xây dựng logic nghiệp vụ phức tạp.
- **An toàn kiểu**: Hệ thống kiểu tĩnh giúp phát hiện sớm nhiều lỗi tại thời điểm biên dịch.
- **Hiệu quả thực thi**: Biên dịch ra bytecode gọn cho EVM.
- **Dễ tiếp cận**: Thuận tiện cho lập trình viên đã quen các ngôn ngữ phổ biến.

**Trạng thái phiên bản** (2024):
- **Phiên bản mới nhất**: Nhánh 0.8.x.
- **Thay đổi phá vỡ tương thích**: Mỗi nhánh phụ 0.x có thể mang thay đổi không tương thích ngược.
- **Cải tiến**: Tăng cường bảo mật (như kiểm tra tràn số mặc định), tối ưu gas và bổ sung tính năng ngôn ngữ.

**Các đặc điểm chính**:

**Định kiểu tĩnh (Statically Typed)**:
```solidity
uint256 x = 5;        // ✓ Type declared
var y = 10;           // ✗ Deprecated (ambiguous)
```

**Hướng hợp đồng (Contract-Oriented)**:
```solidity
contract MyContract {
    // State variables
    // Functions
    // Events
    // Modifiers
}
```

**Kế thừa (Inheritance)**:
```solidity
contract Parent { }
contract Child is Parent { }  // Inheritance
```

**Thư viện (Libraries)**:
```solidity
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }
}
```

---

## 2. Hiểu biết trực quan

### 2.1. Hợp đồng thông minh qua ví dụ máy bán hàng

**Chương trình truyền thống**:
```javascript
class VendingMachine {
    constructor() {
        this.inventory = {};
        this.balance = 0;
    }
    
    buy(item, payment) {
        if (payment >= this.prices[item]) {
            this.inventory[item]--;
            this.balance += this.prices[item];
            return item;
        }
    }
}
```

**Hợp đồng thông minh bằng Solidity**:
```solidity
contract VendingMachine {
    mapping(string => uint) public inventory;
    mapping(string => uint) public prices;
    
    constructor() {
        inventory["Coke"] = 100;
        prices["Coke"] = 0.001 ether;
    }
    
    function buy(string memory item) public payable {
        require(msg.value >= prices[item], "Insufficient payment");
        require(inventory[item] > 0, "Out of stock");
        
        inventory[item]--;
        // Item "delivered" (in real contract, would transfer NFT/token)
    }
}
```

**Các điểm khác biệt chính**:
- Mã Solidity chạy trên blockchain (công khai và lưu giữ lâu dài).
- Từ khóa `payable` cho phép hàm nhận ETH.
- `require()` kiểm tra điều kiện và hoàn tác giao dịch nếu không thỏa mãn.
- Lưu trữ trạng thái trên chuỗi tốn chi phí gas đáng kể.
- Mã hợp đồng sau khi triển khai không thể chỉnh sửa trực tiếp.

### 2.2. Biến trạng thái — "Cơ sở dữ liệu" của hợp đồng

Biến trạng thái đóng vai trò tương tự các bảng dữ liệu lưu trữ bền vững trong cơ sở dữ liệu:

```solidity
contract BankAccount {
    // State variables = Database tables
    mapping(address => uint256) balances;  // Like: user_id → balance table
    address public owner;                   // Like: config table
    uint256 public totalDeposits;          // Like: aggregates table
    
    // Every write costs gas (database write expensive!)
    // Every read from outside costs gas (query cost!)
}
```

**Bố trí ô lưu trữ (Storage Slots)** (theo đúng thứ tự khai báo trong hợp đồng):
```
Slot 0: balances mapping (slot nền; giá trị lưu tại keccak256(key ∥ 0))
Slot 1: owner (address, 20 bytes padded to 32)
Slot 2: totalDeposits (uint256, 32 bytes)

Writing to storage = writing to blockchain forever!
Cost: ~20,000 gas (~$50 when gas high)
```

### 2.3. Hàm — Giao diện lập trình (API) của hợp đồng

Các phạm vi truy cập hàm tương ứng với các mức phân quyền khác nhau:

```solidity
// External: Called from outside only (most gas efficient)
function buyProduct() external payable { }

// Public: Called from outside AND inside
function getBalance() public view returns (uint) { }

// Internal: Called only within contract and derived contracts
function _validateInput(uint x) internal pure returns (bool) { }

// Private: Called only within this exact contract
function _secretFunction() private { }
```

**Liên hệ với mô hình API và hướng đối tượng**:
```
External = Public API endpoint (REST API)
Public = Public method (can call internally too)
Internal = Protected method (subclasses can use)
Private = Private method (only this class)
```

### 2.4. Modifier — Lớp kiểm tra quyền truy cập

**Modifier** hoạt động như các điểm kiểm soát điều kiện trước khi thân hàm được thực thi:

```solidity
contract SecureVault {
    address public owner;
    
    // Modifier = Security guard
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner!");
        _;  // Continue execution if check passes
    }
    
    // Function with security
    function withdraw(uint amount) public onlyOwner {
        // This code only runs if msg.sender == owner
        payable(msg.sender).transfer(amount);
    }
}
```

**So sánh khi có và không có modifier**:
```
Without modifier:
function withdraw() {
    if (msg.sender != owner) revert();
    // withdraw logic
}

With modifier:
modifier onlyOwner() {
    if (msg.sender != owner) revert();
    _;
}

function withdraw() onlyOwner {
    // withdraw logic (cleaner!)
}

Like: Security guard checks ID before letting you into room
```

### 2.5. Sự kiện (Events) — Nhật ký hoạt động trên chuỗi

**Events** là cơ chế ghi nhật ký tối ưu gas trên blockchain:

```solidity
contract Token {
    event Transfer(address indexed from, address indexed to, uint amount);
    
    function transfer(address to, uint amount) public {
        // ... transfer logic ...
        
        emit Transfer(msg.sender, to, amount);
        // Stored in logs (cheap, ~375 gas per LOG)
        // Not accessible from contracts
        // But external apps can listen!
    }
}
```

**So sánh với ghi nhật ký truyền thống**:
```
Traditional logging:
console.log("Transfer:", from, to, amount);
└─ Output to console
└─ Developers see in logs
└─ Not stored permanently

Ethereum events:
emit Transfer(from, to, amount);
└─ Stored in blockchain logs
└─ Permanently accessible
└─ Indexed for fast search
└─ Frontend apps can listen
```

**Ví dụ lắng nghe sự kiện ở tầng giao diện**:
```javascript
// Frontend (JavaScript)
contract.on('Transfer', (from, to, amount) => {
    console.log(`${from} sent ${amount} to ${to}`);
    updateUI();
});
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Hệ thống kiểu dữ liệu trong Solidity

**Kiểu giá trị (Value Types)** (lưu trực tiếp giá trị):

```solidity
// Booleans
bool isActive = true;

// Integers (signed and unsigned)
uint8 small = 255;           // 0 to 2^8-1
uint256 large = 1e18;        // 0 to 2^256-1 (default)
int8 signed = -128;          // -2^7 to 2^7-1

// Address (20 bytes)
address user = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb;
address payable recipient;   // Can receive ETH

// Fixed-size byte arrays
bytes1 singleByte = 0xff;
bytes32 hash = 0xabc...;     // 32 bytes

// Enums
enum State { Created, Locked, Released }
State public state = State.Created;
```

**Kiểu tham chiếu (Reference Types)** (truyền theo tham chiếu tới vị trí lưu trữ):

```solidity
// Arrays
uint[] dynamicArray;              // Dynamic size
uint[10] fixedArray;              // Fixed size
bytes dynamicBytes;               // Dynamic byte array
string name = "Ethereum";         // UTF-8 string

// Structs
struct User {
    address wallet;
    uint256 balance;
    bool active;
}
User public user;

// Mappings (hash tables)
mapping(address => uint256) balances;
mapping(address => mapping(address => uint256)) allowances;  // Nested
```

**Vị trí dữ liệu (Data Locations)**:

```solidity
contract DataLocations {
    uint[] storageArray;  // State variable = storage
    
    function process() public {
        uint[] memory tempArray = new uint[](10);  // Memory
        
        // Storage reference
        uint[] storage ref = storageArray;
        ref.push(5);  // Modifies storageArray!
        
        // Memory copy
        uint[] memory copy = storageArray;
        copy[0] = 10;  // Does NOT modify storageArray
    }
    
    function external(uint[] calldata data) external {
        // Calldata = read-only, from transaction input
        // Cannot modify calldata
    }
}
```

### 3.2. Phạm vi hiển thị và khả năng thay đổi trạng thái của hàm

**Phạm vi hiển thị (Visibility Modifiers)**:

```solidity
contract Visibility {
    uint private secretNumber = 42;
    
    // External: Cheapest for external calls
    function buyToken() external payable {
        // Cannot call this.buyToken() internally (expensive)
        // Must call from outside
    }
    
    // Public: Can call internally and externally
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    // Internal: This contract + derived contracts
    function _calculate(uint x) internal pure returns (uint) {
        return x * 2;
    }
    
    // Private: Only this contract
    function _secret() private view returns (uint) {
        return secretNumber;
    }
}
```

**Khả năng thay đổi trạng thái (State Mutability)**:

```solidity
contract Mutability {
    uint public value = 0;
    
    // Pure: No read, no write
    function pureFunction(uint x) public pure returns (uint) {
        return x * 2;  // Only uses parameters
    }
    
    // View: Read only, no write
    function viewFunction() public view returns (uint) {
        return value;  // Reads state
    }
    
    // Payable: Can receive ETH
    function payableFunction() public payable {
        // msg.value available
    }
    
    // Default: Can read and write state
    function normalFunction() public {
        value = 100;  // Writes state
    }
}
```

### 3.3. Các mẫu thiết kế phổ biến

**Mẫu 1: Checks–Effects–Interactions**

```solidity
contract Withdrawal {
    mapping(address => uint) balances;
    
    function withdraw(uint amount) public {
        // 1. Checks (validate conditions)
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // 2. Effects (update state BEFORE external calls)
        balances[msg.sender] -= amount;
        
        // 3. Interactions (external calls last)
        payable(msg.sender).transfer(amount);
    }
}
```

Thứ tự này giúp ngăn chặn tấn công tái nhập (reentrancy), vì số dư đã được cập nhật trước khi gọi ra hợp đồng bên ngoài (chi tiết sẽ được phân tích trong bài học về bảo mật).

**Mẫu 2: Kiểm soát quyền truy cập (Access Control)**

```solidity
contract Ownable {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
```

**Mẫu 3: Ngắt mạch khẩn cấp (Circuit Breaker)**

```solidity
contract CircuitBreaker {
    bool public paused = false;
    address public owner;
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function pause() public onlyOwner {
        paused = true;
    }
    
    function unpause() public onlyOwner {
        paused = false;
    }
    
    function normalOperation() public whenNotPaused {
        // Business logic
    }
}
```

---

## 4. Công thức toán học và tối ưu hóa gas

### 4.1. Tối ưu chi phí gas

**Đóng gói lưu trữ (Storage Packing)**:

```solidity
// Bad: Uses 3 storage slots (3 × 20,000 gas = 60,000 gas)
contract Unoptimized {
    uint8 a = 1;    // Slot 0 (wastes 31 bytes!)
    uint8 b = 2;    // Slot 1 (wastes 31 bytes!)
    uint8 c = 3;    // Slot 2 (wastes 31 bytes!)
}

// Good: Uses 1 storage slot (20,000 gas)
contract Optimized {
    uint8 a = 1;    // ]
    uint8 b = 2;    // ] All packed in Slot 0
    uint8 c = 3;    // ]
    // Saves 40,000 gas!
}
```

*Lưu ý kỹ thuật*: Trong Solidity thực tế, các biến nhỏ khai báo liền kề nhau (như ba biến `uint8` liên tiếp) được trình biên dịch tự động đóng gói vào chung một slot 32 byte; tình trạng lãng phí 3 slot chỉ xảy ra khi một biến lớn (chẳng hạn `uint256`) xen vào giữa các biến nhỏ (ví dụ `uint8`, `uint256`, `uint8`).

**Mức tiết kiệm khi giảm từ 3 slot xuống 1 slot**:
\[
\text{Savings} = (3 - 1) \times 20000 = 40000 \text{ gas}
\]

Tại mức giá gas 50 gwei và giá ETH 2.000 USD:
\[
\text{Savings} = 40000 \times 50 \times 10^{-9} \times 2000 = \$4
\]

**So sánh `immutable`, `constant` và biến trạng thái**:

```solidity
contract GasComparison {
    // Constant: Replaced at compile time (no storage)
    uint256 public constant RATE = 100;  // 0 gas to access
    
    // Immutable: Set once in constructor (no storage slot)
    uint256 public immutable deployTime;  // ~100 gas to access
    
    // State variable: Uses storage slot
    uint256 public stateVar;  // 2100 gas to access (cold)
    
    constructor() {
        deployTime = block.timestamp;
    }
}
```

**So sánh chi phí truy cập**:
```
Access constant:  Inlined at compile → 0 gas
Access immutable: Embedded in code → ~100 gas
Access storage:   SLOAD opcode → 2100 gas (cold), 100 gas (warm)
```

### 4.2. So sánh Memory, Storage và Calldata

**Thứ tự chi phí gas**:

\[
\begin{align}
\text{Stack} &\approx \text{Calldata (read)} < \text{Memory} < \text{Storage} \\
3 \text{ gas} &\approx 3 \text{ gas} < 3+ \text{ gas (expansion)} < 2100\text{–}20000 \text{ gas}
\end{align}
\]

**Ví dụ**:
```solidity
contract StorageComparison {
    uint[] numbers;  // Storage
    
    // Expensive: Multiple storage reads
    function sumStorage() public view returns (uint) {
        uint total = 0;
        for (uint i = 0; i < numbers.length; i++) {
            total += numbers[i];  // SLOAD each iteration!
        }
        return total;
        // Gas: 2100 × n (cold) or 100 × n (warm)
    }
    
    // Cheap: Copy to memory once
    function sumMemory() public view returns (uint) {
        uint[] memory nums = numbers;  // One-time copy
        uint total = 0;
        for (uint i = 0; i < nums.length; i++) {
            total += nums[i];  // Memory access (cheap!)
        }
        return total;
        // Gas: 2100 + 3 × n (much cheaper!)
    }
}
```

**Ước tính tiết kiệm với mảng 100 phần tử**:
\[
\text{Storage method} \approx 100 \times 100 = 10000 \text{ gas}
\]
\[
\text{Memory method} \approx 2100 + 100 \times 3 = 2400 \text{ gas}
\]
\[
\text{Savings} = 10000 - 2400 = 7600 \text{ gas} \approx \$0.75
\]

### 4.3. Ước lượng chi phí gas của vòng lặp

**Công thức tổng quát**:

\[
\text{Gas} = \text{Setup} + n \times (\text{Iteration Cost})
\]

**Ví dụ**:
```solidity
function processArray(uint[] memory data) public pure returns (uint) {
    uint sum = 0;
    
    for (uint i = 0; i < data.length; i++) {
        sum += data[i];
    }
    
    return sum;
}
```

**Phân tích chi phí**:
```
Setup:
- Function call: 21000 gas
- Copy calldata to memory: ~3 gas/word

Per iteration:
- Load i: 3 gas
- Compare i < length: 3 gas
- Load data[i]: 3 gas
- Add to sum: 3 gas
- Increment i: 3 gas
Total per iteration: ~15 gas

For 100 items: 21000 + 100×3 + 100×15 = 21000 + 1800 = ~23000 gas
```

**Ràng buộc từ giới hạn gas của khối**:

\[
\text{Max iterations} \approx \frac{\text{Block Gas Limit}}{\text{Gas per iteration}} = \frac{30M}{15} \approx 2M
\]

Trong thực tế, giới hạn an toàn cho vòng lặp trên chuỗi thấp hơn nhiều (thường khoảng vài nghìn đến 10.000 lượt) để tránh rủi ro giao dịch không đủ gas thực thi (DoS/griefing).

---

## 5. Góc nhìn triển khai

### 5.1. Hợp đồng token chuẩn ERC-20 hoàn chỉnh

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-20 Token Standard Implementation
 * @dev Complete implementation với best practices
 */
contract ERC20Token {
    // State variables
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    /**
     * @dev Constructor
     */
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        totalSupply = _initialSupply * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
        
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    /**
     * @dev Transfer tokens
     */
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Approve spender
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Approve to zero address");
        
        allowance[msg.sender][spender] = amount;
        
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer from (với allowance)
     */
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    /**
     * @dev Mint new tokens (only for demo - production should have access control)
     */
    function mint(address to, uint256 amount) public {
        require(to != address(0), "Mint to zero address");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Transfer(address(0), to, amount);
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Transfer(msg.sender, address(0), amount);
    }
}
```

### 5.2. Mẫu nâng cao — Hợp đồng có thể nâng cấp (Proxy Pattern)

```solidity
/**
 * @title Proxy Pattern - Upgradeable Contracts
 * @dev Separates logic from storage
 */
contract Proxy {
    // Storage
    address public implementation;
    address public admin;
    
    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }
    
    // Fallback: Delegate all calls to implementation
    fallback() external payable {
        address impl = implementation;
        
        assembly {
            // Copy calldata
            calldatacopy(0, 0, calldatasize())
            
            // Delegatecall to implementation
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            
            // Copy returndata
            returndatacopy(0, 0, returndatasize())
            
            // Return or revert
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    // Upgrade function
    function upgrade(address newImplementation) external {
        require(msg.sender == admin, "Not admin");
        implementation = newImplementation;
    }
    
    receive() external payable {}
}

/**
 * @title Implementation Contract (Logic)
 */
contract TokenImplementationV1 {
    // Must match Proxy storage layout!
    address public implementation;
    address public admin;
    
    // Token storage
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}

/**
 * @title Upgraded Implementation
 */
contract TokenImplementationV2 {
    // Same storage layout
    address public implementation;
    address public admin;
    mapping(address => uint256) public balances;
    
    // New feature!
    function batchTransfer(address[] memory recipients, uint256 amount) public {
        for (uint i = 0; i < recipients.length; i++) {
            require(balances[msg.sender] >= amount);
            balances[msg.sender] -= amount;
            balances[recipients[i]] += amount;
        }
    }
}
```

---

## Video tham khảo

- **Xem trước:** [Learn Solidity, Blockchain Development, & Smart Contracts | Powered By AI - Full Course (0 - 6)](https://www.youtube.com/watch?v=umepbfKp5rI) — Patrick Collins, tiếng Anh. Khóa học đầy đủ của Patrick Collins về Solidity và hợp đồng thông minh; nên bắt đầu từ các phần đầu về cú pháp, biến trạng thái và quy trình triển khai (chưa có mốc thời gian cụ thể).
- [Solidity 0.8 New Features](https://www.youtube.com/watch?v=xv9OmztShIw) — Smart Contract Programmer, tiếng Anh. Điểm lại các thay đổi trong Solidity 0.8, bao gồm phép toán số học có kiểm tra tràn số, hỗ trợ cho phần tối ưu gas và an toàn kiểu.
