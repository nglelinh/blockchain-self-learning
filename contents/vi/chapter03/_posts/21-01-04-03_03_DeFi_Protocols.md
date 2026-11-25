---
layout: post
title: "Lecture 03.03: DeFi Protocols - Decentralized Finance Mechanics"
chapter: '03'
order: 4
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
---

# Bài giảng: Các giao thức DeFi — Cơ chế tài chính phi tập trung

Trên một sàn chứng khoán truyền thống như NYSE hay Nasdaq, muốn giao dịch khớp lệnh bạn cần một cuốn **sổ lệnh (order book)** khổng lồ với các nhà tạo lập thị trường chuyên nghiệp liên tục cập nhật hàng nghìn lệnh mua–bán mỗi giây. Khi các lập trình viên đầu tiên thử mang sổ lệnh đó lên Ethereum, họ lập tức đụng tường: mỗi lần đặt hay hủy lệnh đều tốn gas và chờ 12 giây!

Đột phá làm bùng nổ cả kỷ nguyên **Tài chính Phi tập trung (DeFi)** năm 2018–2020 đến từ một phương trình đại số vỏn vẹn ba ký tự của Uniswap: **$$x \cdot y = k$$**. Thay vì ghép cặp từng người mua với người bán, bất kỳ ai cũng có thể gửi hai loại tài sản vào một **bể thanh khoản (liquidity pool)** và để một công thức toán học tự động báo giá 24/7 không cần trung gian. Từ viên gạch nền AMM đó, cả một hệ sinh thái tài chính lắp ghép (**Money Legos**) gồm cho vay thế chấp vượt mức (Aave/Compound), stablecoin thuật toán/thế chấp (MakerDAO/DAI) và khoản vay không cần tài sản đảm bảo trong 1 giao dịch (**Flash Loans**) đã hình thành.

---

## Kiến thức cần nhớ: Toán học và Kinh tế học của DeFi đứng trên ba trụ cột nào?

### 1. Nhà tạo lập thị trường tự động (AMM) và Đường cong bất biến $$x \cdot y = k$$
Với hai tài sản có lượng dự trữ $$x$$ và $$y$$ trong bể, quy tắc **tích hằng số** yêu cầu sau mọi giao dịch (chưa tính phí), điểm $$(x', y')$$ mới vẫn phải nằm trên đường hyperbol $$x' \cdot y' = k$$. Giá tức thời là độ dốc $$P = y/x$$; lệnh giao dịch càng lớn so với độ sâu bể thì điểm $$(x', y')$$ trượt càng xa trên đường cong — sinh ra **độ trượt giá (slippage)** và **tổn thất tạm thời (Impermanent Loss)** cho người cung cấp thanh khoản khi giá thị trường biến động.

### 2. Thị trường tiền tệ thế chấp vượt mức và Cơ chế Thanh lý (Health Factor)
Vì người vay trên blockchain ẩn danh nên không có điểm tín dụng hay tòa án đòi nợ. Các giao thức cho vay (Aave, Compound) đòi hỏi **thế chấp vượt mức (over-collateralization)** (ví dụ thế chấp 150 USD ETH để vay tối đa 100 USD USDC). Một chỉ số sức khỏe (**Health Factor**) được cập nhật liên tục theo nguồn giá **Oracle (Chainlink)**; hễ $$\text{HF} < 1$$, bất kỳ bot thanh lý nào cũng có quyền trả hộ nợ và mua lại tài sản thế chấp với mức chiết khấu thưởng (ví dụ 5–10%) để bảo toàn khả năng thanh toán của giao thức.

### 3. Tính nguyên tử (Atomicity) và Vay nhanh (Flash Loans)
Trong EVM, một giao dịch gồm hàng chục bước gọi hợp đồng khác nhau hoặc **thành công toàn bộ**, hoặc **hoàn tác như chưa từng xảy ra**. Tính nguyên tử này sinh ra một sản phẩm tài chính chưa từng tồn tại ở thế giới truyền thống: **Flash Loan** — bạn có thể vay 100 triệu USD với **0 USD thế chấp**, miễn là bạn trả đủ vốn cộng phí (0.05–0.09%) ngay trước khi giao dịch đó kết thúc; nếu không trả đủ, toàn bộ giao dịch bị hủy ngược và bể thanh khoản không mất một xu!

---

### Giải thích: tự tay tính trượt giá AMM $$x \cdot y = k$$ và Tổn thất tạm thời

Hãy tự tay tính hai phép tính quan trọng mà mọi nhà đầu tư và kỹ sư DeFi đều phải nắm vững:

1. **Tính giá thực khớp và độ trượt giá trên bể Uniswap v2:**
   - Giả sử bể ETH/USDC đang có $$x = 100\text{ ETH}$$ và $$y = 300\,000\text{ USDC}$$.
   - Giá tức thời ban đầu: $$P_0 = \frac{300\,000}{100} = \mathbf{3\,000\text{ USDC/ETH}}$$; hằng số bể: $$k = 100 \times 300\,000 = 30\,000\,000$$.
   - Alice bán **10 ETH** vào bể (bỏ qua phí 0.3% để nhẩm sạch): lượng ETH mới là $$x' = 100 + 10 = 110\text{ ETH}$$. Để giữ $$x' \cdot y' = k$$:
     $$
     y' = \frac{30\,000\,000}{110} \approx 272\,727.27\text{ USDC}.
     $$
   - Lượng USDC Alice thực nhận: $$\Delta y = 300\,000 - 272\,727.27 = \mathbf{27\,272.73\text{ USDC}}$$.
   - Giá thực khớp trung bình chỉ là $$2\,727.27\text{ USDC/ETH}$$ — Alice chịu **độ trượt giá $$\frac{3\,000 - 2\,727.27}{3\,000} \approx 9.09\%$$** vì lệnh bán chiếm tới 10% độ sâu bể! (Và giá mới trong bể lập tức tụt xuống $$P_1 = \frac{272\,727.27}{110} \approx 2\,479.34\text{ USDC/ETH}$$.)
2. **Tính Tổn thất tạm thời (Impermanent Loss) khi giá ETH tăng gấp 4 lần ($$r = 4$$):**
   - Ban đầu Bob nạp 1 ETH + 3.000 USDC (tổng 6.000 USD). Khi giá ETH bên ngoài tăng gấp 4 lên 12.000 USDC, các bot chênh lệch giá (arbitrage) mua ETH giá rẻ từ bể cho đến khi tỉ lệ mới thỏa $$y/x = 12\,000$$ và $$xy = 3\,000 \implies x_{\text{mới}} = 0.5\text{ ETH},\ y_{\text{mới}} = 6\,000\text{ USDC}$$.
   - Giá trị phần góp của Bob trong bể lúc này: $$0.5 \times 12\,000 + 6\,000 = \mathbf{12\,000\text{ USD}}$$.
   - Nếu Bob chỉ ngồi yên giữ (HODL) 1 ETH + 3.000 USDC ban đầu: $$1 \times 12\,000 + 3\,000 = \mathbf{15\,000\text{ USD}}$$.
   - Bob bị hụt mất $$\frac{12\,000 - 15\,000}{15\,000} = \mathbf{-20\%}$$ — khớp chính xác công thức tổng quát:
     $$
     \mathrm{IL}(r) = \frac{2\sqrt{r}}{1 + r} - 1 = \frac{2\sqrt{4}}{1 + 4} - 1 = \frac{4}{5} - 1 = -20\%!
     $$

---

## 1. Tổng quan về khái niệm

**Tài chính phi tập trung (Decentralized Finance — DeFi)** là một trong những ứng dụng nổi bật nhất của hợp đồng thông minh, xây dựng hệ thống dịch vụ tài chính vận hành tự động trên blockchain mà không phụ thuộc vào ngân hàng, công ty môi giới hay trung gian truyền thống. Trong năm 2020, tổng giá trị tài sản khóa (Total Value Locked — TVL) trong DeFi tăng từ dưới 1 tỷ USD lên hơn 100 tỷ USD chỉ trong một năm.

**DeFi là gì?**

DeFi là tập hợp các **giao thức tài chính triển khai trên blockchain** (chủ yếu trên Ethereum), cung cấp nhiều nghiệp vụ cơ bản:
- **Cho vay và đi vay (Lending/Borrowing)**: Vay và gửi tài sản lấy lãi mà không cần ngân hàng trung gian.
- **Giao dịch (Trading)**: Hoán đổi token trực tiếp trên chuỗi mà không cần sàn giao dịch tập trung.
- **Tạo lợi suất (Yield Generation)**: Thu lãi từ việc cung cấp thanh khoản hoặc đặt cọc tài sản mã hóa.
- **Phái sinh (Derivatives)**: Hợp đồng quyền chọn, hợp đồng tương lai và tài sản tổng hợp.
- **Bảo hiểm (Insurance)**: Cơ chế phân tán rủi ro trên chuỗi.
- **Quản lý tài sản (Asset Management)**: Tự động hóa danh mục đầu tư qua hợp đồng thông minh.

**Đổi mới cốt lõi — Tính kết hợp (Composability)**:

Các giao thức DeFi thường được ví như những mảnh ghép tài chính ("Money Legos") vì có thể kết nối trực tiếp với nhau:

```
Traditional Finance (Siloed):
Bank A ─┐
        ├─ Cannot easily combine
Bank B ─┘

DeFi (Composable):
Uniswap ──┐
          ├─ Can compose freely!
Aave ─────┤
          ├─ Example: Borrow from Aave →
Compound ─┘           Trade on Uniswap →
                      Lend on Compound
                      
All in one transaction!
```

**Giai đoạn DeFi Summer (2020)**:

Từ tháng 6 đến tháng 9 năm 2020, hệ sinh thái DeFi tăng trưởng nhanh với các đặc điểm:
- **Khai thác thanh khoản (Liquidity Mining)**: Các giao thức phân phối token thưởng để khuyến khích người dùng cung cấp thanh khoản.
- **Canh tác lợi suất (Yield Farming)**: Người dùng tối ưu hóa lợi nhuận qua nhiều giao thức kết hợp.
- **Tăng trưởng TVL**: Tăng từ 1 tỷ USD lên 15 tỷ USD trong 3 tháng.
- **Đổi mới sản phẩm**: Phổ biến mô hình AMM, khoản vay nhanh (flash loan) và chiến lược kết hợp đa giao thức.

**Một số giao thức tiêu biểu** (theo quy mô TVL năm 2024):
1. **Uniswap**: ~4 tỷ USD TVL — Sàn giao dịch phi tập trung (AMM).
2. **Aave**: ~6 tỷ USD TVL — Giao thức cho vay và đi vay.
3. **MakerDAO**: ~5 tỷ USD TVL — Phát hành stablecoin (DAI).
4. **Curve**: ~2 tỷ USD TVL — Sàn hoán đổi tối ưu cho stablecoin.
5. **Lido**: ~20 tỷ USD TVL — Dịch vụ liquid staking.

**Cấu trúc phân tầng của DeFi**:

```
Layer 4: Aggregators (1inch, Yearn)
         └─ Optimize across protocols
         
Layer 3: Applications (Uniswap, Aave, Compound)
         └─ User-facing protocols
         
Layer 2: Infrastructure (Oracles, Keepers)
         └─ Price feeds, automation
         
Layer 1: Base Layer (Ethereum)
         └─ Smart contract execution
         
Layer 0: Assets (ETH, WBTC, stablecoins)
         └─ Underlying value
```

---

## 2. Hiểu biết trực quan

### 2.1. Nhà tạo lập thị trường tự động (AMM)

**Sàn giao dịch truyền thống** (sổ lệnh — Orderbook):
```
Buyers post: "I want to buy 10 ETH at $2000 each"
Sellers post: "I want to sell 10 ETH at $2010 each"
Matching engine: Pairs buyers với sellers

Requires:
✓ Active market makers
✓ Sufficient liquidity
✓ Centralized infrastructure
```

**AMM** (Mô hình hằng số tích — Constant Product):
```
Instead of orderbook: Use liquidity pool!

Pool contains:
- 1000 ETH
- 2,000,000 USDC

Price determined by formula:
x × y = k (constant)
ETH_amount × USDC_amount = constant

To buy ETH:
1. Add USDC to pool
2. Remove proportional ETH
3. Maintain x × y = k

No orderbook needed!
No market makers needed!
Always liquid!
```

**Ví dụ giao dịch**:
```
Pool before: 1000 ETH × 2,000,000 USDC = 2,000,000,000 (k)

User wants to buy 10 ETH:

Add USDC to pool, remove ETH:
(1000 - 10) × (2,000,000 + X) = 2,000,000,000

Solve for X:
990 × (2,000,000 + X) = 2,000,000,000
2,000,000 + X = 2,020,202
X = 20,202 USDC

Price per ETH: 20,202 / 10 = 2,020 USDC

Pool after: 990 ETH × 2,020,202 USDC = 2,000,000,000 ✓
```

**Tác động giá (Price Impact)**: Khối lượng giao dịch càng lớn so với quy mô bể thanh khoản thì mức trượt giá càng cao.

### 2.2. Giao thức cho vay — Mô hình người gửi tới bể thanh khoản (Peer-to-Pool)

**Ngân hàng truyền thống**:
```
Depositor → Bank (takes deposits) → Borrower
              ↓
          Bank keeps spread (profit)
          
Depositor gets: 1% interest
Borrower pays: 5% interest
Bank profit: 4% spread
```

**Cho vay trong DeFi** (Aave, Compound):
```
Depositor → Liquidity Pool ← Borrower
                ↓
        Interest shared directly
        
Depositor gets: 4% APY (direct from borrowers)
Borrower pays: 5% APY (directly to pool)
Protocol fee: 1% (minimal)
```

**Cách vận hành**:
```
1. Alice deposits 100 ETH into pool
   → Receives 100 aETH (receipt tokens)
   → Earns interest automatically

2. Bob wants to borrow
   → Deposits collateral (150 ETH worth of USDC)
   → Can borrow up to ~100 ETH (67% collateralization)
   → Pays interest to pool

3. Interest accumulates
   → Alice's aETH value increases
   → Can redeem anytime for ETH + interest

No approval needed!
No credit check!
Instant!
```

### 2.3. Tổn thất tạm thời (Impermanent Loss)

**Khái niệm**: Khi giá giữa hai tài sản biến động mạnh, việc cung cấp thanh khoản vào bể AMM có thể mang lại tổng giá trị thấp hơn so với việc chỉ nắm giữ nguyên tài sản ban đầu.

```
Scenario:
You have: 10 ETH + 20,000 USDC (total: $40,000)

Option A: HOLD
- Keep 10 ETH + 20,000 USDC
- ETH price doubles: $2000 → $4000
- Value: 10 × $4000 + $20,000 = $60,000

Option B: Provide Liquidity (AMM)
- Add to pool: 10 ETH + 20,000 USDC
- ETH price doubles
- Pool rebalances automatically
- You have: ~7.07 ETH + 28,284 USDC
- Value: 7.07 × $4000 + $28,284 = $56,568

Loss: $60,000 - $56,568 = $3,432 (5.7%)

This is "impermanent loss"!
(Impermanent because loss only realized when you withdraw)
```

**Công thức**:
\[
\text{IL} = \frac{2\sqrt{r}}{1 + r} - 1
\]

Trong đó \( r = \frac{\text{Price}_{\text{new}}}{\text{Price}_{\text{old}}} \).

### 2.4. Khoản vay nhanh (Flash Loans) — Vay không cần thế chấp

**Khái niệm**: Cho phép vay lượng vốn lớn mà không cần tài sản thế chấp, với điều kiện phải hoàn trả đầy đủ trong cùng một giao dịch.

**Cơ chế hoạt động**:
```
Traditional Loan:
1. Apply for loan
2. Provide collateral
3. Receive loan
4. Repay over time

Flash Loan (one transaction!):
1. Borrow (no collateral!)
2. Use funds
3. Repay loan + fee
4. If can't repay → entire transaction reverts
   (like loan never happened!)
```

**Ví dụ kinh doanh chênh lệch giá (Arbitrage)**:
```
Transaction atomicity ensures:
function flashLoanArbitrage() {
    // 1. Borrow 1000 ETH from Aave (no collateral!)
    borrow(1000 ETH);
    
    // 2. Trade on Uniswap (ETH cheap here)
    buy 1000 ETH worth of USDC on Uniswap;
    
    // 3. Trade on SushiSwap (USDC expensive here)
    sell USDC on SushiSwap for 1010 ETH;
    
    // 4. Repay loan + 0.09% fee
    repay(1000.9 ETH);
    
    // 5. Keep profit
    profit = 1010 - 1000.9 = 9.1 ETH!
}

If step 4 fails → Everything reverts!
Risk-free arbitrage!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Uniswap V2 — AMM hằng số tích

**Công thức cốt lõi**:

\[
x \times y = k
\]

Trong đó:
- \( x \) là lượng dự trữ token A.
- \( y \) là lượng dự trữ token B.
- \( k \) là hằng số tích.

**Cài đặt hợp đồng thông minh (rút gọn)**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Simplified Uniswap V2 Pair
 * @dev Constant product AMM implementation
 */
contract UniswapV2Pair {
    address public token0;
    address public token1;
    
    uint112 private reserve0;
    uint112 private reserve1;
    
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    
    uint private constant MINIMUM_LIQUIDITY = 1000;
    
    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1);
    event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out);
    
    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }
    
    /**
     * @dev Add liquidity
     */
    function mint(address to) external returns (uint liquidity) {
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        
        uint amount0 = balance0 - reserve0;
        uint amount1 = balance1 - reserve1;
        
        if (totalSupply == 0) {
            // First liquidity provider
            liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            balanceOf[address(0)] = MINIMUM_LIQUIDITY;  // Lock minimum
        } else {
            // Subsequent providers
            liquidity = min(
                amount0 * totalSupply / reserve0,
                amount1 * totalSupply / reserve1
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        balanceOf[to] += liquidity;
        totalSupply += liquidity;
        
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        
        emit Mint(msg.sender, amount0, amount1);
    }
    
    /**
     * @dev Remove liquidity
     */
    function burn(address to) external returns (uint amount0, uint amount1) {
        uint liquidity = balanceOf[address(this)];
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        
        amount0 = liquidity * balance0 / totalSupply;
        amount1 = liquidity * balance1 / totalSupply;
        
        require(amount0 > 0 && amount1 > 0, "Insufficient liquidity burned");
        
        balanceOf[address(this)] -= liquidity;
        totalSupply -= liquidity;
        
        IERC20(token0).transfer(to, amount0);
        IERC20(token1).transfer(to, amount1);
        
        reserve0 = uint112(IERC20(token0).balanceOf(address(this)));
        reserve1 = uint112(IERC20(token1).balanceOf(address(this)));
        
        emit Burn(msg.sender, amount0, amount1);
    }
    
    /**
     * @dev Swap tokens
     */
    function swap(uint amount0Out, uint amount1Out, address to) external {
        require(amount0Out > 0 || amount1Out > 0, "Insufficient output");
        require(amount0Out < reserve0 && amount1Out < reserve1, "Insufficient liquidity");
        
        // Transfer tokens out
        if (amount0Out > 0) IERC20(token0).transfer(to, amount0Out);
        if (amount1Out > 0) IERC20(token1).transfer(to, amount1Out);
        
        // Check new balances
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        
        uint amount0In = balance0 > reserve0 - amount0Out ? 
                         balance0 - (reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > reserve1 - amount1Out ? 
                         balance1 - (reserve1 - amount1Out) : 0;
        
        require(amount0In > 0 || amount1In > 0, "Insufficient input");
        
        // Check constant product (with 0.3% fee)
        uint balance0Adjusted = balance0 * 1000 - amount0In * 3;
        uint balance1Adjusted = balance1 * 1000 - amount1In * 3;
        
        require(
            balance0Adjusted * balance1Adjusted >= 
            uint(reserve0) * uint(reserve1) * (1000**2),
            "K invariant violated"
        );
        
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out);
    }
    
    // Helper functions
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    
    function min(uint x, uint y) internal pure returns (uint) {
        return x < y ? x : y;
    }
}
```

### 3.2. Aave — Giao thức cho vay

**Cơ chế cốt lõi**:

```solidity
/**
 * @title Simplified Aave Lending Pool
 */
contract LendingPool {
    struct ReserveData {
        uint256 availableLiquidity;
        uint256 totalBorrows;
        uint256 liquidityRate;      // Deposit APY
        uint256 borrowRate;          // Borrow APY
        uint256 liquidityIndex;      // Cumulative interest
        uint256 borrowIndex;
        uint40 lastUpdateTimestamp;
    }
    
    mapping(address => ReserveData) public reserves;
    mapping(address => mapping(address => uint256)) public deposits;
    mapping(address => mapping(address => uint256)) public borrows;
    
    /**
     * @dev Deposit assets
     */
    function deposit(address asset, uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Update indices
        updateInterest(asset);
        
        // Credit deposit
        deposits[asset][msg.sender] += amount;
        reserves[asset].availableLiquidity += amount;
        
        // Mint aTokens (receipt tokens)
        mintAToken(asset, msg.sender, amount);
        
        emit Deposit(asset, msg.sender, amount);
    }
    
    /**
     * @dev Borrow assets (requires collateral)
     */
    function borrow(address asset, uint256 amount) external {
        ReserveData storage reserve = reserves[asset];
        
        // Check available liquidity
        require(reserve.availableLiquidity >= amount, "Insufficient liquidity");
        
        // Check collateral
        require(getUserAccountData(msg.sender).healthFactor > 1e18, "Insufficient collateral");
        
        // Update interest
        updateInterest(asset);
        
        // Transfer borrowed amount
        IERC20(asset).transfer(msg.sender, amount);
        
        // Update state
        borrows[asset][msg.sender] += amount;
        reserve.totalBorrows += amount;
        reserve.availableLiquidity -= amount;
        
        emit Borrow(asset, msg.sender, amount);
    }
    
    /**
     * @dev Repay borrowed assets
     */
    function repay(address asset, uint256 amount) external {
        uint256 userBorrow = borrows[asset][msg.sender];
        require(userBorrow > 0, "No borrow to repay");
        
        // Update interest
        updateInterest(asset);
        
        uint256 repayAmount = amount > userBorrow ? userBorrow : amount;
        
        // Transfer repayment
        IERC20(asset).transferFrom(msg.sender, address(this), repayAmount);
        
        // Update state
        borrows[asset][msg.sender] -= repayAmount;
        reserves[asset].totalBorrows -= repayAmount;
        reserves[asset].availableLiquidity += repayAmount;
        
        emit Repay(asset, msg.sender, repayAmount);
    }
    
    /**
     * @dev Calculate interest rates
     */
    function calculateInterestRates(address asset) internal view returns (uint liquidityRate, uint borrowRate) {
        ReserveData storage reserve = reserves[asset];
        
        uint totalLiquidity = reserve.availableLiquidity + reserve.totalBorrows;
        
        if (totalLiquidity == 0) {
            return (0, 0);
        }
        
        // Utilization rate
        uint utilizationRate = reserve.totalBorrows * 1e18 / totalLiquidity;
        
        // Borrow rate (linear model)
        // Base rate + utilization × slope
        borrowRate = 0.02e18 + utilizationRate * 0.1e18 / 1e18;  // 2% + U × 10%
        
        // Liquidity rate (depositors earn)
        // borrowRate × utilizationRate × (1 - reserveFactor)
        liquidityRate = borrowRate * utilizationRate / 1e18 * 90 / 100;  // 90% to depositors
        
        return (liquidityRate, borrowRate);
    }
    
    /**
     * @dev Update accrued interest
     */
    function updateInterest(address asset) internal {
        ReserveData storage reserve = reserves[asset];
        
        uint40 currentTimestamp = uint40(block.timestamp);
        uint timeDelta = currentTimestamp - reserve.lastUpdateTimestamp;
        
        if (timeDelta == 0) return;
        
        (uint liquidityRate, uint borrowRate) = calculateInterestRates(asset);
        
        // Compound interest calculation
        uint liquidityIndex = reserve.liquidityIndex;
        uint borrowIndex = reserve.borrowIndex;
        
        // New index = old index × (1 + rate × time)
        liquidityIndex = liquidityIndex * (1e18 + liquidityRate * timeDelta / 365 days) / 1e18;
        borrowIndex = borrowIndex * (1e18 + borrowRate * timeDelta / 365 days) / 1e18;
        
        reserve.liquidityIndex = liquidityIndex;
        reserve.borrowIndex = borrowIndex;
        reserve.lastUpdateTimestamp = currentTimestamp;
    }
    
    /**
     * @dev Get user account data (for health factor)
     */
    function getUserAccountData(address user) public view returns (
        uint totalCollateral,
        uint totalDebt,
        uint healthFactor
    ) {
        // Calculate total collateral in ETH
        // Calculate total debt in ETH
        // healthFactor = totalCollateral / totalDebt
        
        // Simplified
        return (1e18, 0.5e18, 2e18);  // Health factor = 2.0 (safe)
    }
}
```

---

## 4. Công thức toán học và kinh tế học

### 4.1. Chứng minh công thức hằng số tích (Constant Product)

**Bất biến**:

\[
x \cdot y = k
\]

**Giá trước giao dịch**:

\[
P_{\text{before}} = \frac{y}{x}
\]

**Khi bán \( \Delta x \) token X vào bể để nhận \( \Delta y \) token Y**:

\[
(x + \Delta x)(y - \Delta y) = k = xy
\]

Giải theo \( \Delta y \):

\[
\begin{align}
xy + y\Delta x - x\Delta y - \Delta x \Delta y &= xy \\
y\Delta x &= x\Delta y + \Delta x \Delta y \\
\Delta y &= \frac{y\Delta x}{x + \Delta x}
\end{align}
\]

**Giá thực khớp trung bình**:

\[
P_{\text{exec}} = \frac{\Delta y}{\Delta x} = \frac{y}{x + \Delta x}
\]

**Mức trượt giá (Slippage / Price Impact)**:

\[
\text{Slippage} = \frac{P_{\text{exec}} - P_{\text{before}}}{P_{\text{before}}} = \frac{-\Delta x}{x + \Delta x}
\]

**Ví dụ**:
```
Pool: 1000 ETH × 2,000,000 USDC
Sell 10 ETH into pool:

Δy = (2,000,000 × 10) / (1000 + 10) = 19,802 USDC

Execution price: 19,802 / 10 = 1,980 USDC/ETH
Market price: 2,000,000 / 1000 = 2,000 USDC/ETH

Slippage: (1980 - 2000) / 2000 = -1% (got 1% worse price)
```

### 4.2. Công thức tổn thất tạm thời (Impermanent Loss)

**Giả thiết**: Tỷ giá thay đổi từ 1 sang \( r \).

**Giá trị nếu chỉ nắm giữ (HODL)**:
\[
V_{\text{HODL}} = V_0 \left(\frac{1 + r}{2}\right)
\]

**Giá trị khi cung cấp thanh khoản (LP)** (theo hằng số tích):

Sau khi giá thay đổi, bể tự tái cân bằng theo \( x \cdot y = k \):

\[
\begin{align}
x_{\text{new}} &= \sqrt{\frac{k}{r}} \\
y_{\text{new}} &= \sqrt{k \cdot r}
\end{align}
\]

**Tổng giá trị vị thế LP** (với \( V_0 = 2\sqrt{k} \) tại mức giá ban đầu bằng 1):
\[
V_{\text{LP}} = r \cdot x_{\text{new}} + y_{\text{new}} = V_0 \sqrt{r}
\]

**Tổn thất tạm thời (IL)**:

\[
\text{IL} = \frac{V_{\text{LP}} - V_{\text{HODL}}}{V_{\text{HODL}}} = \frac{2\sqrt{r}}{1+r} - 1
\]

**Bảng minh họa theo mức biến động giá**:

| Tỷ lệ thay đổi giá | IL |
|--------------|-----|
| 1.25× | -0.6% |
| 1.5× | -2.0% |
| 2× | -5.7% |
| 3× | -13.4% |
| 4× | -20.0% |
| 5× | -25.5% |

**Biểu đồ minh họa**:
```
IL (%)
  0│              
    │              
 -5│      ╱
    │    ╱
-10│   ╱
    │  ╱
-15│ ╱
    │╱
-20├──────────────────
    1    2    3    4    5  (Price Ratio)
```

Phí giao dịch thu được từ bể có thể bù đắp tổn thất tạm thời nếu khối lượng giao dịch đủ lớn.

### 4.3. Tỷ lệ sử dụng vốn trong giao thức cho vay

**Tỷ lệ sử dụng (Utilization Rate)**:

\[
U = \frac{\text{Total Borrows}}{\text{Total Liquidity}} = \frac{B}{B + A}
\]

Trong đó:
- \( B \) là tổng dư nợ đang vay.
- \( A \) là thanh khoản khả dụng còn lại trong bể.

**Các mô hình lãi suất**:

**Mô hình tuyến tính**:
\[
r_{\text{borrow}} = r_0 + r_s \cdot U
\]

**Mô hình gãy khúc (Kinked Model — Aave, Compound)**:

\[
r_{\text{borrow}} = \begin{cases}
r_0 + \frac{U}{U_{\text{optimal}}} r_s & \text{if } U \leq U_{\text{optimal}} \\
r_0 + r_s + \frac{U - U_{\text{optimal}}}{1 - U_{\text{optimal}}} r_e & \text{if } U > U_{\text{optimal}}
\end{cases}
\]

**Đồ thị minh họa**:
```
Borrow Rate (%)
 100│                    ╱
    │                  ╱
  50│                ╱
    │              ╱
  10│         ╱╱╱  ← Kink at U_optimal (80%)
    │    ╱╱╱
   2│╱╱╱
    └──────────────────────
    0    20   40   60   80   100  Utilization (%)
```

**Lãi suất tiền gửi**:

\[
r_{\text{deposit}} = r_{\text{borrow}} \times U \times (1 - f)
\]

Trong đó \( f \) là tỷ lệ phí dự trữ của giao thức (thường khoảng 10%).

**Ví dụ**:
```
Pool state:
- Available: 200 ETH
- Borrowed: 800 ETH
- Total: 1000 ETH

Utilization: 800 / 1000 = 80%

Borrow rate: 2% + 80% × 10% = 10%

Deposit rate: 10% × 80% × 90% = 7.2%

Depositors earn 7.2% APY
Borrowers pay 10% APY
Protocol earns 0.8% (10% × 80% × 10%)
```

### 4.4. Hệ số sức khỏe tài khoản (Health Factor)

**Tỷ lệ tài sản thế chấp**:

\[
\text{Health Factor} = \frac{\text{Collateral Value} \times \text{Liquidation Threshold}}{\text{Debt Value}}
\]

**Trạng thái an toàn**:
\[
\text{HF} > 1
\]

**Ngưỡng kích hoạt thanh lý**:
\[
\text{HF} \leq 1
\]

**Ví dụ**:
```
User deposits: 100 ETH collateral @ $2000 = $200,000
Liquidation threshold: 80%
Max borrow: $200,000 × 80% = $160,000

User borrows: $120,000 USDC

Health Factor = ($200,000 × 0.8) / $120,000 = 1.33 ✓ Safe

If ETH drops to $1600:
New collateral value: $160,000
Health Factor = ($160,000 × 0.8) / $120,000 = 1.07 ⚠️ Risky

If ETH drops to $1500:
New collateral value: $150,000  
Health Factor = ($150,000 × 0.8) / $120,000 = 1.0 ⚠️ Liquidatable!
```

### 4.5. Toán học của Arbitrage bằng Flash Loan

**Cơ hội chênh lệch giá**:

Gọi giá trên sàn A là \( P_A \) và giá trên sàn B là \( P_B \). Nếu \( P_A < P_B \):

\[
\text{Profit} = (P_B - P_A) \times Q - \text{Fees}
\]

**Khi sử dụng Flash Loan** (với \( f_{\text{flash}} \) và \( f_{\text{swap}} \) là chi phí tính trên mỗi đơn vị khối lượng \( Q \)):

\[
\begin{align}
\text{Profit} &= (P_B - P_A) \times Q - f_{\text{flash}} \times Q - f_{\text{swap}} \times Q \\
&= Q \times (P_B - P_A - f_{\text{flash}} - f_{\text{swap}})
\end{align}
\]

**Ví dụ**:
```
ETH price on Uniswap: $2000
ETH price on Sushiswap: $2015 (0.75% higher)

Flash loan: 1000 ETH (fee: 0.09%)
Swap fees: 0.3% each exchange

Profit calculation:
Revenue: 1000 × ($2015 - $2000) = $15,000
Flash loan fee: 1000 × $2000 × 0.09% = $1,800
Swap fees: 1000 × $2000 × 0.6% = $12,000

Net profit: $15,000 - $1,800 - $12,000 = $1,200

ROI: $1,200 / $0 = ∞ (no capital needed!)
```

---

## 5. Góc nhìn triển khai

### 5.1. Ví dụ tương tác kết hợp đa giao thức DeFi

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface ILendingPool {
    function deposit(address asset, uint256 amount, address onBehalfOf) external;
    function borrow(address asset, uint256 amount, address onBehalfOf) external;
}

/**
 * @title DeFi Strategy Contract
 * @dev Demonstrates composability: Swap → Lend → Borrow
 */
contract DeFiStrategy {
    IUniswapV2Router public uniswap;
    ILendingPool public aave;
    
    constructor(address _uniswap, address _aave) {
        uniswap = IUniswapV2Router(_uniswap);
        aave = ILendingPool(_aave);
    }
    
    /**
     * @dev Execute multi-protocol strategy
     * 1. Swap USDC for ETH on Uniswap
     * 2. Deposit ETH as collateral on Aave
     * 3. Borrow USDC against ETH collateral
     */
    function executeStrategy(uint256 usdcAmount) external {
        // 1. Swap USDC → ETH on Uniswap
        address[] memory path = new address[](2);
        path[0] = address(USDC);
        path[1] = address(WETH);
        
        IERC20(USDC).approve(address(uniswap), usdcAmount);
        
        uint[] memory amounts = uniswap.swapExactTokensForTokens(
            usdcAmount,
            0,  // Accept any amount (production: set slippage)
            path,
            address(this),
            block.timestamp + 15 minutes
        );
        
        uint ethReceived = amounts[1];
        
        // 2. Deposit ETH to Aave
        IERC20(WETH).approve(address(aave), ethReceived);
        aave.deposit(address(WETH), ethReceived, address(this));
        
        // 3. Borrow USDC (up to 80% of collateral value)
        uint borrowAmount = ethReceived * 2000 * 80 / 100;  // Assume $2000/ETH
        aave.borrow(address(USDC), borrowAmount, address(this));
        
        // Now have:
        // - ETH collateral earning interest
        // - USDC borrowed (can use for other strategies)
        // This is "leveraging" position!
    }
}
```

### 5.2. Cài đặt Flash Loan

```solidity
/**
 * @title Flash Loan Provider
 */
contract FlashLoanProvider {
    uint256 public constant FLASH_LOAN_FEE = 9;  // 0.09%
    
    /**
     * @dev Execute flash loan
     */
    function flashLoan(
        address token,
        uint256 amount,
        address borrower,
        bytes calldata data
    ) external {
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        require(balanceBefore >= amount, "Insufficient liquidity");
        
        // Calculate fee
        uint256 fee = amount * FLASH_LOAN_FEE / 10000;
        uint256 amountToRepay = amount + fee;
        
        // Transfer loan to borrower
        IERC20(token).transfer(borrower, amount);
        
        // Callback to borrower (execute their logic)
        IFlashLoanReceiver(borrower).executeOperation(
            token,
            amount,
            fee,
            data
        );
        
        // Check repayment
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        require(
            balanceAfter >= balanceBefore + fee,
            "Flash loan not repaid"
        );
        
        emit FlashLoan(borrower, token, amount, fee);
    }
}

/**
 * @title Flash Loan Receiver (borrower must implement)
 */
interface IFlashLoanReceiver {
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external;
}

/**
 * @title Arbitrage Bot
 */
contract FlashLoanArbitrage is IFlashLoanReceiver {
    address public flashLoanProvider;
    
    constructor(address _provider) {
        flashLoanProvider = _provider;
    }
    
    /**
     * @dev Execute arbitrage using flash loan
     */
    function executeArbitrage(
        address token,
        uint256 amount,
        address exchangeA,
        address exchangeB
    ) external {
        // Request flash loan
        FlashLoanProvider(flashLoanProvider).flashLoan(
            token,
            amount,
            address(this),
            abi.encode(exchangeA, exchangeB)
        );
    }
    
    /**
     * @dev Flash loan callback
     */
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external override {
        require(msg.sender == flashLoanProvider, "Unauthorized");
        
        (address exchangeA, address exchangeB) = abi.decode(data, (address, address));
        
        // 1. Buy on cheaper exchange
        uint256 boughtAmount = buyOnExchange(exchangeA, token, amount);
        
        // 2. Sell on expensive exchange  
        uint256 soldAmount = sellOnExchange(exchangeB, token, boughtAmount);
        
        // 3. Repay flash loan
        uint256 totalDebt = amount + fee;
        require(soldAmount >= totalDebt, "Arbitrage unprofitable");
        
        IERC20(token).transfer(flashLoanProvider, totalDebt);
        
        // 4. Keep profit
        uint256 profit = soldAmount - totalDebt;
        // Profit now in contract!
    }
    
    function buyOnExchange(address exchange, address token, uint256 amount) internal returns (uint256) {
        // Simplified - production would call actual DEX
        return amount;
    }
    
    function sellOnExchange(address exchange, address token, uint256 amount) internal returns (uint256) {
        // Simplified
        return amount * 101 / 100;  // 1% profit
    }
}
```

---

## Video tham khảo

- **Xem trước:** [How do LIQUIDITY POOLS work? (Uniswap, Curve, Balancer) | DEFI Explained](https://www.youtube.com/watch?v=cizLhxSKrAc) — Finematics, tiếng Anh. Minh họa cơ chế bể thanh khoản và đường cong AMM; nên xem trước công thức \( x \cdot y = k \).
- [UNISWAP V3 - New Era Of AMMs? Architecture Explained](https://www.youtube.com/watch?v=Ehm-OYBmlPM) — Finematics, tiếng Anh. Phân tích kiến trúc Uniswap v3 và thanh khoản tập trung, mở rộng từ mô hình AMM cổ điển.
- [What is AAVE? (Animated) Crypto Borrowing and Lending Explained](https://www.youtube.com/watch?v=dTCwssZ116A) — Whiteboard Crypto, tiếng Anh. Giải thích cơ chế cho vay có tài sản thế chấp của Aave, đối chiếu trực tiếp với mục giao thức cho vay.
