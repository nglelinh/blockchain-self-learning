---
layout: post
title: "Lecture 05.02: Smart Contract Security - Vulnerabilities và Best Practices"
chapter: '05'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Bài giảng 05.02: Bảo mật hợp đồng thông minh — Lỗ hổng và thực hành tốt

Tháng 6 năm 2016, một vụ tấn công chấn động đã rút cạn 3,6 triệu ETH (trị giá khoảng 60 triệu USD thời điểm đó) khỏi quỹ The DAO, buộc cộng đồng Ethereum phải thực hiện một đợt hard fork gây tranh cãi tách đôi mạng lưới. Thủ phạm không hề bẻ khóa mật mã đường cong elliptic hay phá vỡ đồng thuận PoW — hắn chỉ lợi dụng đúng **hai dòng code Solidity viết ngược thứ tự nhau**!

Khác với phần mềm web truyền thống nơi lập trình viên có thể âm thầm tung bản vá sau 5 phút, hợp đồng thông minh trên blockchain mang tính **bất biến**, **mã nguồn công khai** và **trực tiếp giữ hàng tỷ đô la tài sản thanh khoản tức thì**. Chỉ một lỗ hổng logic nhỏ là đủ để kẻ tấn công viết bot rút sạch quỹ trong đúng 1 block 12 giây.

---

## Bản đồ kiến thức nền: Bảo mật Hợp đồng Thông minh nghiên cứu những bề mặt tấn công nào?

1. **Lỗ hổng dòng điều khiển & trạng thái (Reentrancy):** Khi hợp đồng gọi ra địa chỉ bên ngoài *trước khi* cập nhật số dư nội bộ, kẻ tấn công tái nhập vào hàm rút tiền lặp đi lặp lại. Khắc phục chuẩn bằng mẫu **Checks–Effects–Interactions (CEI)** và `ReentrancyGuard`.
2. **Lỗi số học & độ chính xác (Overflow, Underflow, Rounding):** Tràn số nguyên (đã được bảo vệ mặc định từ Solidity 0.8+, trừ khối `unchecked`) và lỗi làm tròn chia nguyên trong các giao thức DeFi / Vault (tấn công lạm phát cổ phần — *inflation attack*).
3. **Tấn công kinh tế & Oracle (Flash Loans & Price Manipulation):** Kẻ tấn công vay hàng trăm triệu đô la không cần thế chấp trong cùng 1 giao dịch để làm méo giá spot trên một pool AMM, đánh lừa giao thức đọc giá trực tiếp thay vì dùng TWAP hoặc Oracle phi tập trung (Chainlink).
4. **Kiểm soát truy cập & Nâng cấp (Access Control & Proxy Storage Collision):** Quên kiểm tra `onlyOwner`, để hở hàm `initialize()` trên hợp đồng Proxy, hay lệch khe bộ nhớ (storage slot) khi nâng cấp logic.

---

## 1. Tổng quan về khái niệm

**Bảo mật hợp đồng thông minh (smart contract security)** là một trong những khía cạnh quan trọng nhất của phát triển blockchain. Khác với phần mềm truyền thống, một lỗi lập trình trong hợp đồng thông minh có thể dẫn đến **thiệt hại tài chính không thể đảo ngược lên tới hàng triệu USD**, trong khi mã nguồn không thể vá trực tiếp sau khi đã triển khai lên chuỗi.

**Vấn đề tính bất biến (Immutability)**:

```
Traditional Software:
Bug found → Deploy patch → Problem fixed
Users update → Everyone safe

Smart Contracts:
Bug found → Cannot change deployed code!
Exploit happens → Funds stolen forever
No "undo" button → Catastrophic consequences
```

**Các sự cố bảo mật tiêu biểu trong lịch sử**:

- **Vụ tấn công The DAO (tháng 6/2016)**: Thiệt hại 3,6 triệu ETH (tương đương ~50 triệu USD tại thời điểm đó và từng đạt khoảng 7 tỷ USD ở mức đỉnh). Nguyên nhân là lỗ hổng tái nhập (reentrancy), dẫn đến đợt hard fork tách Ethereum thành ETH và ETC.
- **Ví Parity lần 1 (tháng 7/2017)**: Thiệt hại 153.000 ETH (~30 triệu USD) do sử dụng `delegatecall` tới hợp đồng không tin cậy, khiến nhiều ví đa chữ ký bị chiếm quyền.
- **Ví Parity lần 2 (tháng 11/2017)**: 513.000 ETH (~150 triệu USD) bị **đóng băng vĩnh viễn** do thư viện proxy chưa được khởi tạo quyền sở hữu.
- **Poly Network (tháng 8/2021)**: Thiệt hại 611 triệu USD do lỗ hổng kiểm soát truy cập trên cầu nối xuyên chuỗi; sau đó kẻ tấn công đã hoàn trả số tiền này.
- **Ronin Bridge (tháng 3/2022)**: Thiệt hại 625 triệu USD do lộ khóa của các trình xác thực (validator), gây ảnh hưởng lớn tới hệ sinh thái Axie Infinity.

Tổng thiệt hại từ các lỗ hổng hợp đồng thông minh kể từ năm 2016 đã vượt mốc **10 tỷ USD**.

**Vì sao bảo mật hợp đồng thông minh đặc biệt khó?**

1. **Tính bất biến**: Không thể vá lỗi trực tiếp sau khi triển khai.
2. **Giá trị tài chính trực tiếp**: Mã nguồn quản lý trực tiếp tài sản có giá trị lớn.
3. **Mã nguồn công khai**: Kẻ tấn công có thể phân tích công khai mã hợp đồng.
4. **Tính khả hợp (Composability)**: Các hợp đồng tương tác phức tạp với nhau, tạo ra nhiều tình huống biên khó lường.
5. **Đặc thù của EVM**: Một số cơ chế thực thi của máy ảo Ethereum không trực quan với lập trình viên truyền thống.
6. **Tấn công kinh tế**: Rủi ro không chỉ đến từ lỗi mã nguồn mà còn từ các khai thác lý thuyết trò chơi.

**Tư duy bảo mật cần thiết**:

```
Traditional Development:
- Move fast, break things
- Iterate based on user feedback
- Bugs are unfortunate but fixable

Smart Contract Development:
- Move slow, don't break anything
- Extensive testing before deployment
- Bugs are catastrophic and permanent
- Security > Features
```

---

## 2. Hiểu biết trực quan

### 2.1. Tái nhập (Reentrancy) — "Cái bẫy gọi ngược"

**Phép ẩn dụ**: Lỗ hổng quy trình tại quầy giao dịch ngân hàng.

```
Normal Withdrawal (Secure):
1. Customer: "Withdraw $100"
2. Teller: Check balance ($500)
3. Teller: Update ledger ($500 → $400)
4. Teller: Give $100 cash
✓ Safe

Reentrancy Attack (Vulnerable):
1. Attacker: "Withdraw $100"
2. Teller: Check balance ($500) ✓
3. Teller: Give $100 cash
4. BEFORE updating ledger: Attacker interrupts!
   "Withdraw $100 again!"
5. Teller: Check balance (still $500!) ✓
6. Teller: Give another $100
7. Repeat until bank empty!

Problem: Teller updates ledger AFTER giving money
```

**Phiên bản hợp đồng thông minh**:

```solidity
// VULNERABLE CODE
contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount);
        
        // External call BEFORE state update (DANGER!)
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
        
        balances[msg.sender] -= amount;  // Too late!
    }
}

// ATTACK CONTRACT
contract Attacker {
    VulnerableBank bank;
    
    function attack() public payable {
        bank.deposit{value: 1 ether}();
        bank.withdraw(1 ether);
    }
    
    // Fallback function - called when receiving ETH
    receive() external payable {
        if (address(bank).balance >= 1 ether) {
            bank.withdraw(1 ether);  // Reenter!
        }
    }
}
```

**Luồng tấn công**:
```
1. Attacker deposits 1 ETH
2. Attacker calls withdraw(1 ETH)
3. Bank checks: balance[attacker] >= 1 ETH ✓
4. Bank sends 1 ETH → triggers attacker's receive()
5. Attacker's receive() calls withdraw(1 ETH) again!
6. Bank checks: balance[attacker] still 1 ETH! ✓
7. Bank sends another 1 ETH
8. Loop continues until bank drained!
```

### 2.2. Tràn số nguyên (Integer Overflow) — "Quay vòng công-tơ-mét"

**Phép ẩn dụ**: Đồng hồ đo quãng đường ô tô.

```
Odometer: 999,999 km
Drive 2 km more
Result: 000,001 km (rolled over!)

Looks like new car!
```

**Trong hợp đồng thông minh** (trước Solidity 0.8.0):

```solidity
// VULNERABLE (Solidity < 0.8.0)
uint8 balance = 255;  // Max for uint8
balance += 1;         // Wraps to 0!

// Attacker exploit:
uint256 price = 100;
uint256 quantity = 2^256 / 100 + 1;
uint256 total = price * quantity;  // Overflows to small number!
```

**Sự cố thực tế (BEC Token, 2018)**:
```
Attacker sent transaction:
- Transfer HUGE amount
- Overflow caused amount to wrap to small number
- Check passed!
- Attacker received billion tokens!

Result: Token value crashed to $0
```

### 2.3. Kiểm soát truy cập (Access Control) — "Cánh cửa không khóa"

**Phép ẩn dụ**: Trang quản trị không có mật khẩu.

```
Website Admin Panel:
- Should require: Login + password
- If forgot: Anyone can access!
  → Delete users
  → Change settings
  → Steal data

Smart Contract:
- Should require: onlyOwner modifier
- If forgot: Anyone can call!
  → Drain funds
  → Change ownership
  → Destroy contract
```

**Ví dụ lỗ hổng**:

```solidity
// VULNERABLE
contract Wallet {
    address owner;
    
    function initialize(address _owner) public {
        // Missing access control!
        // Anyone can call and become owner!
        owner = _owner;
    }
    
    function withdraw() public {
        // Only owner should call
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }
}

// ATTACK
// 1. Attacker calls initialize(attackerAddress)
// 2. Attacker now owner!
// 3. Attacker calls withdraw()
// 4. Steals all funds!
```

### 2.4. Chạy trước giao dịch (Front-Running) — "Nhìn bài trước khi đánh"

**Phép ẩn dụ**: Giao dịch nội gián trên thị trường chứng khoán.

```
Normal Trading:
- You place order
- Order executed
- Fair price

Front-Running (Blockchain):
- You broadcast transaction (buy token at $100)
- Attacker sees pending transaction
- Attacker submits transaction với higher gas (priority!)
- Attacker's buy executes first (price → $110)
- Your buy executes at worse price
- Attacker sells at profit

Mempool is public! Everyone sees pending transactions!
```

**MEV (Maximal Extractable Value — Giá trị có thể trích xuất tối đa)**:

```
Scenario: Large DEX trade pending
- Trade will move price significantly
- Bots detect in mempool

Bot strategy:
1. Buy before user (front-run)
2. User's trade executes (price increases)
3. Bot sells at higher price (back-run)

"Sandwich attack" - profit from user's trade!
```

### 2.5. Thao túng Oracle (Oracle Manipulation) — "Dữ liệu giá sai lệch"

**Phép ẩn dụ**: Thao túng nguồn báo giá.

```
Smart Contract needs: "What is ETH price?"
Gets from: Price Oracle (external data source)

Attack:
1. Manipulate oracle (flash loan to move price)
2. Oracle reports manipulated price
3. Smart contract acts on fake price
4. Attacker profits
5. Repay flash loan

Example:
- Borrow $10M via flash loan
- Buy token on small DEX (price spikes)
- Oracle reads inflated price
- Borrow against inflated collateral value
- Profit!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Các lỗ hổng phổ biến và cách khắc phục

**1. Tái nhập (Reentrancy)**

Mã dễ bị tấn công:
```solidity
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool success,) = msg.sender.call{value: amount}("");  // External call first!
    require(success);
    balances[msg.sender] = 0;  // State update last (WRONG!)
}
```

Mã đã sửa (mẫu Checks-Effects-Interactions):
```solidity
function withdraw() public {
    uint amount = balances[msg.sender];
    
    // 1. Checks
    require(amount > 0, "No balance");
    
    // 2. Effects (update state FIRST!)
    balances[msg.sender] = 0;
    
    // 3. Interactions (external calls LAST!)
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
}
```

Hoặc sử dụng `ReentrancyGuard`:
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureBank is ReentrancyGuard {
    mapping(address => uint) public balances;
    
    function withdraw() public nonReentrant {
        uint amount = balances[msg.sender];
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] = 0;
    }
}
```

**2. Tràn trên / tràn dưới số nguyên (Integer Overflow/Underflow)**

Mã dễ bị tấn công (Solidity < 0.8.0):
```solidity
function transfer(address to, uint amount) public {
    balances[msg.sender] -= amount;  // Can underflow!
    balances[to] += amount;           // Can overflow!
}
```

Mã đã sửa (Solidity >= 0.8.0 tích hợp sẵn kiểm tra tràn số):
```solidity
function transfer(address to, uint amount) public {
    balances[msg.sender] -= amount;  // Auto reverts on underflow
    balances[to] += amount;           // Auto reverts on overflow
}

// Or use SafeMath (pre-0.8.0)
using SafeMath for uint256;

function transfer(address to, uint amount) public {
    balances[msg.sender] = balances[msg.sender].sub(amount);
    balances[to] = balances[to].add(amount);
}
```

**3. Kiểm soát truy cập (Access Control)**

Mã dễ bị tấn công:
```solidity
contract Wallet {
    function initialize(address _owner) public {
        owner = _owner;  // Anyone can call!
    }
}
```

Mã đã sửa:
```solidity
contract Wallet {
    address public owner;
    bool private initialized;
    
    function initialize(address _owner) public {
        require(!initialized, "Already initialized");
        owner = _owner;
        initialized = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function adminFunction() public onlyOwner {
        // Only owner can call
    }
}
```

**4. Không kiểm tra giá trị trả về (Unchecked Return Values)**

Mã dễ bị tấn công:
```solidity
function transfer(address token, address to, uint amount) public {
    IERC20(token).transfer(to, amount);  // Ignores return value!
    // If transfer fails, continue anyway!
}
```

Mã đã sửa:
```solidity
function transfer(address token, address to, uint amount) public {
    bool success = IERC20(token).transfer(to, amount);
    require(success, "Transfer failed");
}

// Or use SafeERC20
using SafeERC20 for IERC20;

function transfer(address token, address to, uint amount) public {
    IERC20(token).safeTransfer(to, amount);  // Reverts if fails
}
```

### 3.2. Nghiên cứu tình huống: Vụ tấn công The DAO

**Hợp đồng The DAO** (phần lược giản chứa lỗ hổng):

```solidity
contract TheDAO {
    mapping(address => uint) public balances;
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        
        // Send ETH first (VULNERABLE!)
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
        
        // Update balance after (TOO LATE!)
        balances[msg.sender] = 0;
    }
}
```

**Hợp đồng tấn công**:

```solidity
contract DAOAttacker {
    TheDAO public dao;
    uint public attackCount;
    
    constructor(address _dao) {
        dao = TheDAO(_dao);
    }
    
    function attack() public payable {
        // Deposit some ETH first
        dao.deposit{value: 1 ether}();
        
        // Start the attack
        dao.withdraw();
    }
    
    // Fallback - called when receiving ETH
    receive() external payable {
        if (attackCount < 10 && address(dao).balance >= 1 ether) {
            attackCount++;
            dao.withdraw();  // REENTER!
        }
    }
}
```

**Diễn biến tấn công**:
```
Step 1: Attacker deposits 1 ETH
        balances[attacker] = 1 ETH

Step 2: Attacker calls withdraw()
        
Step 3: DAO checks: balances[attacker] >= 1 ETH ✓

Step 4: DAO sends 1 ETH to attacker
        → Triggers attacker's receive()
        
Step 5: receive() calls withdraw() again (reentrancy!)

Step 6: DAO checks: balances[attacker] still 1 ETH! ✓
        (Not yet updated!)
        
Step 7: DAO sends another 1 ETH
        → Triggers receive() again
        
Loop continues until DAO drained!

Final: Attacker stole 3.6M ETH with 1 ETH deposit!
```

---

## 4. Công thức toán học và phân tích

### 4.1. Phân tích toán học tấn công tái nhập

Gọi \( B_a \) là số dư của kẻ tấn công và \( B_c \) là tổng số dư của hợp đồng.

**Rút tiền bình thường**:
\[
\begin{align}
B_a(t) &\xrightarrow{\text{check}} B_a(t) \geq w \\
B_c(t) &\xrightarrow{\text{send}} B_c(t) - w \\
B_a(t) &\xrightarrow{\text{update}} B_a(t) - w
\end{align}
\]

**Khi xảy ra tấn công tái nhập**:
\[
\begin{align}
B_a(0) &= 1 \\
B_c(0) &= 1000 \\
\\
\text{Call 1: } B_a &\text{ checked (1 ≥ 1)} ✓ \\
& B_c \to 999 \text{ (send 1)} \\
& \text{REENTER before update!} \\
\\
\text{Call 2: } B_a &\text{ still 1!} ✓ \\
& B_c \to 998 \\
\\
\text{After } n \text{ calls: } B_c(n) &= 1000 - n \\
B_a \text{ never updated during attack!}
\end{align}
\]

**Số lần rút tối đa có thể khai thác**:
\[
n_{\max} = \left\lfloor \frac{B_c(0)}{w} \right\rfloor = \left\lfloor \frac{1000}{1} \right\rfloor = 1000
\]

Kẻ tấn công có thể rút cạn lượng tài sản gấp 1.000 lần số tiền ban đầu đã gửi vào.

### 4.2. Tấn công giới hạn Gas (Gas Limit Attack)

**Tấn công từ chối dịch vụ thông qua giới hạn gas**:

```solidity
// Vulnerable: Unbounded loop
function distributeRewards(address[] memory recipients) public {
    for (uint i = 0; i < recipients.length; i++) {
        recipients[i].call{value: 1 ether}("");  // Can fail!
    }
}
```

**Điều kiện xảy ra tấn công**:
\[
n_{\text{recipients}} > \frac{\text{Block Gas Limit}}{\text{Gas per iteration}}
\]

```
Block gas limit: 30M
Gas per iteration: ~30,000
Max iterations: 30M / 30,000 = 1,000

Attacker submits 10,000 recipients
→ Transaction always runs out of gas
→ Function cannot complete
→ Denial of service!
```

**Cách khắc phục**: Chuyển từ mô hình đẩy (push) sang mô hình kéo (pull), để người dùng tự rút phần thưởng của mình:

```solidity
mapping(address => uint) public rewards;

function claimReward() public {
    uint amount = rewards[msg.sender];
    rewards[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```

### 4.3. Kinh tế học của tấn công chạy trước (Front-Running)

**Lợi nhuận từ front-running**:

\[
\text{Profit} = (P_{\text{after}} - P_{\text{before}}) \times Q - \text{Gas Cost}
\]

Trong đó:
- \( P_{\text{before}} \): mức giá trước giao dịch của nạn nhân.
- \( P_{\text{after}} \): mức giá sau giao dịch của nạn nhân.
- \( Q \): khối lượng giao dịch.

**Ví dụ**:
```
Victim buys 100 ETH on Uniswap
- Current price: $2000
- After trade: $2050 (price impact)

Bot strategy:
1. Front-run: Buy 50 ETH at $2000 (cost: $100,000)
2. Victim buys: Price → $2050
3. Back-run: Sell 50 ETH at $2050 (revenue: $102,500)

Profit: $102,500 - $100,000 - gas = $2,500

Bot steals value from victim's price impact!
```

Trên các mạng như Ethereum, giá trị MEV tích lũy hàng năm có thể đạt quy mô hàng trăm triệu đến hàng tỷ USD, dù giá trị MEV ở từng khối riêng lẻ biến động mạnh (thường nhỏ trong điều kiện thông thường nhưng có thể tăng vọt ở những khối xuất hiện cơ hội chênh lệch giá hoặc thanh lý lớn).

---

### Khung giải thích: tự tay lần vết ngăn xếp gọi hàm (Call Stack) của vụ tấn công Reentrancy (nên đọc chậm)

Để thấy vì sao chỉ **đảo thứ tự hai dòng code** lại quyết định sinh tử của hàng triệu đô la, hãy theo dõi từng dòng trạng thái của hợp đồng `Vault` bị lỗi:

- **Trạng thái ban đầu:** `Vault` đang giữ tổng cộng **3 ETH** (2 ETH của Alice + 1 ETH của Attacker), nên `balances[Attacker] = 1 ETH`.
- **Hàm rút tiền bị lỗi:**
  `(1) require(balances[msg.sender] >= 1 ether);`
  `(2) msg.sender.call{value: 1 ether}("");` *(gọi ra ngoài trước!)*
  `(3) balances[msg.sender] = 0;` *(cập nhật trạng thái sau!)*

**Diễn biến từng khung gọi hàm trong cùng 1 giao dịch:**
1. **Lượt gọi 1:** `Attacker` gọi `withdraw()`. Dòng `(1)` thấy `balances[Attacker] == 1 ETH` (Hợp lệ!). Dòng `(2)` chuyển **1 ETH** sang `Attacker` (`Vault` còn **2 ETH**) và tự động chạy hàm `receive()` của `Attacker`. *Dòng `(3)` vẫn chưa hề được chạy!*
2. **Lượt gọi 2 (tái nhập từ bên trong `receive()`):** `Attacker` gọi lại `withdraw()`. Dòng `(1)` đọc `balances[Attacker]` — **vẫn bằng 1 ETH!** Dòng `(2)` chuyển tiếp **1 ETH** (`Vault` còn **1 ETH**).
3. **Lượt gọi 3 (tái nhập lần nữa):** Dòng `(1)` vẫn thấy `1 ETH` → dòng `(2)` rút nốt **1 ETH** cuối cùng (`Vault` về **0 ETH**!).
4. **Thoát đệ quy:** `receive()` dừng gọi tiếp; lúc này cả 3 lượt mới lần lượt chạy tới dòng `(3)` gán `balances[Attacker] = 0` — nhưng `Attacker` đã ôm trọn **3 ETH** (lãi ròng 2 ETH của Alice)!

**Sửa bằng 1 nhát cắt (Checks–Effects–Interactions):** Đưa dòng `(3) balances[msg.sender] = 0;` lên **trước** dòng `(2)`. Ngay khi lượt gọi 2 tái nhập, dòng `(1)` lập tức đọc thấy `0 < 1` và hoàn tác (revert) toàn bộ cuộc tấn công!

## 5. Góc nhìn triển khai

### 5.1. Các mẫu thiết kế hợp đồng an toàn

**Mẫu 1: Checks-Effects-Interactions**

```solidity
contract SecureWithdrawal {
    mapping(address => uint) public balances;
    
    function withdraw(uint amount) public {
        // 1. CHECKS - Validate conditions
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Invalid amount");
        
        // 2. EFFECTS - Update state
        balances[msg.sender] -= amount;
        
        // 3. INTERACTIONS - External calls
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

**Mẫu 2: Reentrancy Guard**

```solidity
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    
    uint256 private _status;
    
    constructor() {
        _status = _NOT_ENTERED;
    }
    
    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrant call");
        
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract SecureBank is ReentrancyGuard {
    function withdraw() public nonReentrant {
        // Safe from reentrancy!
    }
}
```

**Mẫu 3: Pull Over Push**

```solidity
// BAD: Push payments (can fail)
function distributeRewards(address[] memory users) public {
    for (uint i = 0; i < users.length; i++) {
        users[i].call{value: rewards}("");  // Can fail, DOS
    }
}

// GOOD: Pull payments (user withdraws)
mapping(address => uint) public pendingRewards;

function claimReward() public {
    uint amount = pendingRewards[msg.sender];
    pendingRewards[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```

**Mẫu 4: Giới hạn tần suất (Rate Limiting)**

```solidity
contract RateLimited {
    mapping(address => uint) public lastWithdrawal;
    uint public constant COOLDOWN = 1 days;
    
    function withdraw(uint amount) public {
        require(
            block.timestamp >= lastWithdrawal[msg.sender] + COOLDOWN,
            "Cooldown active"
        );
        
        lastWithdrawal[msg.sender] = block.timestamp;
        
        // Process withdrawal
    }
}
```

**Mẫu 5: Ngắt mạch khẩn cấp (Circuit Breaker)**

```solidity
contract CircuitBreaker {
    bool public paused;
    address public owner;
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function criticalFunction() external whenNotPaused {
        // Can be emergency stopped!
    }
}
```

### 5.2. Cài đặt hoàn chỉnh một hợp đồng Token an toàn

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Secure ERC-20 Token
 * @dev Implements security best practices
 */
contract SecureToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    address public owner;
    bool public paused;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Paused(address account);
    event Unpaused(address account);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        
        // Mint initial supply
        _mint(msg.sender, _initialSupply * 10**decimals);
    }
    
    /**
     * @dev Transfer tokens (secure implementation)
     */
    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        // Checks
        require(to != address(0), "Transfer to zero address");
        require(to != address(this), "Transfer to contract");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        // Effects (Solidity 0.8+ prevents overflow)
        unchecked {  // Safe because of require above
            _balances[msg.sender] -= amount;
            _balances[to] += amount;
        }
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Approve spender
     */
    function approve(address spender, uint256 amount) public whenNotPaused returns (bool) {
        require(spender != address(0), "Approve to zero address");
        
        _allowances[msg.sender][spender] = amount;
        
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer from (secure)
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public whenNotPaused returns (bool) {
        // Checks
        require(from != address(0), "Transfer from zero");
        require(to != address(0), "Transfer to zero");
        require(_balances[from] >= amount, "Insufficient balance");
        
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "Insufficient allowance");
        
        // Effects
        unchecked {
            _balances[from] -= amount;
            _balances[to] += amount;
            _allowances[from][msg.sender] = currentAllowance - amount;
        }
        
        emit Transfer(from, to, amount);
        emit Approval(from, msg.sender, currentAllowance - amount);
        
        return true;
    }
    
    /**
     * @dev Get balance
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Get allowance
     */
    function allowance(address tokenOwner, address spender) public view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }
    
    /**
     * @dev Internal mint function
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        
        totalSupply += amount;
        _balances[account] += amount;
        
        emit Transfer(address(0), account, amount);
    }
    
    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
```

---

## Video tham khảo

- **Xem trước:** [Reentrancy | Hack Solidity (0.6)](https://www.youtube.com/watch?v=4Mm3BCyHtDY) — Smart Contract Programmer, tiếng Anh. Video dựng lại lỗi reentrancy trên Solidity 0.6; nên xem trước mẫu Checks-Effects-Interactions.
- [Solidity 0.8 New Features](https://www.youtube.com/watch?v=xv9OmztShIw) — Smart Contract Programmer, tiếng Anh. Giới thiệu các thay đổi của Solidity 0.8, bao gồm kiểm tra tràn số học mặc định — liên quan trực tiếp tới mục tràn số trong bài.
- [Onward with Smart Contract Security](https://www.youtube.com/watch?v=RipXdV7vygs) — OpenZeppelin, tiếng Anh. OpenZeppelin chia sẻ hướng thực hành bảo mật hợp đồng, phù hợp khi chuyển từ từng lỗ hổng riêng lẻ sang quy trình kiểm toán tổng thể.
