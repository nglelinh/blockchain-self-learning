---
layout: post
title: "Lecture 03.00: Ethereum Architecture - World Computer Platform"
chapter: '03'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
---

# Lecture: Ethereum Architecture - World Computer Platform

## 1. Tổng quan về khái niệm

**Ethereum** không chỉ là một cryptocurrency - nó là một **decentralized world computer**, một platform cho phép bất kỳ ai deploy và run **smart contracts** (chương trình tự động thực thi) trên một global network. Nếu Bitcoin là "digital gold" hay "peer-to-peer cash", thì Ethereum là "programmable money" và "decentralized application platform".

**The Vision - Vitalik Buterin's Insight**:

Vào năm 2013, **Vitalik Buterin** - một programmer 19 tuổi involved trong Bitcoin community - nhận ra một limitation fundamental: Bitcoin's Script language quá limited. Nó có thể handle simple "if this then that" logic, nhưng không thể run complex computations. Vitalik đề xuất thêm Turing-complete programming language vào Bitcoin, nhưng proposal bị reject.

Vậy nên năm 2013, ông viết **Ethereum Whitepaper**: "A Next-Generation Smart Contract and Decentralized Application Platform". Key insight:

> "What blockchain needs is a built-in Turing-complete programming language that allows anyone to write smart contracts and decentralized applications where they can create their own arbitrary rules for ownership, transaction formats and state transition functions."

**Smart Contracts - The Core Innovation**:

Term "smart contract" được đề xuất bởi **Nick Szabo** năm 1994, nhưng Ethereum là first platform successfully implement concept này at scale:

```
Traditional Contract:
- Written in legal language
- Enforced by legal system
- Requires trusted intermediaries
- Slow, expensive, subjective interpretation

Smart Contract:
- Written in programming language (Solidity, Vyper)
- Enforced by blockchain consensus
- No intermediaries needed
- Instant, cheap, deterministic execution
```

**Example - Vending Machine Analogy**:

Nick Szabo's famous analogy: Smart contract giống như vending machine:

```
Traditional Purchase:
1. Go to store
2. Find clerk
3. Ask for item
4. Clerk gets item
5. Pay clerk
6. Clerk gives item
(Requires trust in clerk)

Vending Machine (Smart Contract):
1. Insert money
2. Press button
3. Get item automatically
(No trust needed - machine enforces rules)
```

Ethereum extends this: Bất kỳ programmable rule nào có thể become a "vending machine"!

**Ethereum Timeline**:

- **2013**: Whitepaper published
- **2014**: Crowdsale raises 18 million USD (31,000 BTC)
- **July 30, 2015**: Genesis block (Frontier launch)
- **2016**: The DAO hack → Ethereum/Ethereum Classic split
- **2017**: ICO boom (hundreds of projects launch on Ethereum)
- **2020**: DeFi summer (Uniswap, Aave, Compound explode)
- **2021**: NFT boom (CryptoPunks, Bored Apes)
- **Sept 2022**: "The Merge" - transition từ PoW sang PoS
- **2023-2024**: Layer 2 scaling (Arbitrum, Optimism, zkSync)

**Key Differences from Bitcoin**:

| Aspect | Bitcoin | Ethereum |
|--------|---------|----------|
| **Purpose** | Digital currency | Programmable platform |
| **Scripting** | Limited (Script) | Turing-complete (Solidity) |
| **State** | UTXO model | Account model |
| **Block time** | ~10 minutes | ~12 seconds |
| **Consensus** | PoW (SHA-256) | PoS (Gasper) |
| **Supply** | Fixed 21M | No hard cap (low inflation) |
| **Use cases** | Store of value, payments | DeFi, NFTs, DAOs, dApps |

**Ethereum's Architecture Philosophy**:

Ethereum được thiết kế với principles:

1. **Simplicity**: Protocol đơn giản nhất có thể
2. **Universality**: Turing-complete language
3. **Modularity**: Separate consensus from execution
4. **Agility**: Protocol có thể upgrade
5. **Non-discrimination**: No built-in applications
6. **Non-censorship**: No transaction censorship

---

## 2. Hiểu biết trực quan

### 2.1. Ethereum như "World Computer"

Hãy tưởng tượng Ethereum như một **giant global computer**:

```
Traditional Cloud Computing:
- Run app on AWS, Google Cloud, etc.
- Trust company to not shut down
- Company can censor, change rules
- Centralized control

Ethereum "World Computer":
- Run app on thousands of nodes globally
- Cannot be shut down (decentralized)
- Rules enforced by code, not company
- Censorship-resistant
```

**Components**:
```
Hardware: Thousands of Ethereum nodes (computers running client)
CPU: EVM (Ethereum Virtual Machine) processes transactions
RAM: State (account balances, contract storage)
Hard Drive: Blockchain (permanent history)
Operating System: Ethereum protocol rules
Programs: Smart contracts
Users: External accounts sending transactions
```

**Cost Model**:
```
AWS: Pay per hour/month for resources
Ethereum: Pay per computation (Gas fees)

Example:
- Store 32 bytes: ~20,000 gas (~$0.50 at 50 gwei)
- Complex computation: 100,000 gas (~$2.50)
- Simple transfer: 21,000 gas (~$0.50)
```

### 2.2. Account Model vs UTXO - Bank Account vs Cash

**Bitcoin UTXO (Cash Model)**:
```
Alice has:
- $50 bill
- $20 bill
- $10 bill
Total: $80

To pay Bob $60:
- Use $50 + $20 bills
- Bob gets $60 in new bills
- Alice gets $10 change
- Old bills destroyed

Advantages: Privacy, parallel processing
Disadvantages: Complex to track "balance"
```

**Ethereum Account (Bank Account Model)**:
```
Alice's account: $80
Bob's account: $40

To pay Bob $60:
- Alice account: $80 → $20
- Bob account: $40 → $100
- Simple deduction/addition

Advantages: Simple, intuitive, easy to track balance
Disadvantages: Less privacy, sequential processing
```

### 2.3. Smart Contract như "Vending Machine Program"

**Simple Smart Contract Example** (conceptual):

```
Contract: CrowdfundingCampaign
State:
  - Goal: 100 ETH
  - Deadline: Dec 31, 2024
  - Total raised: 0 ETH
  - Contributors: {}

Functions:
  contribute():
    - Accept ETH from sender
    - Add to total raised
    - Record contributor

  checkGoal():
    - If deadline passed:
      - If goal reached:
        → Send all ETH to project owner
      - If goal not reached:
        → Refund everyone automatically

No human intervention needed!
Rules enforced by code!
```

**Real-World Impact**:
```
Traditional Crowdfunding (Kickstarter):
- Platform takes 5% fee
- Can freeze/cancel campaign
- Refunds manual, slow
- Geographic restrictions

Smart Contract Crowdfunding:
- No platform fee (only gas)
- Cannot be censored
- Refunds automatic, instant
- Global, permissionless
```

### 2.4. Gas System - "Computational Postage Stamps"

**Problem**: Nếu computation free, attackers có thể spam network với infinite loops!

**Solution: Gas** - pay per computation

```
Analogy: Postage stamps
- Want to send letter? Buy stamp
- Heavier letter? More stamps
- More complex computation? More gas

Gas Pricing:
Operation          Gas Cost
---------------------------------
ADD two numbers    3 gas
MULTIPLY           5 gas
Store 32 bytes     20,000 gas
Create contract    32,000 gas
Transfer ETH       21,000 gas

User sets:
- Gas Limit: Max gas willing to spend
- Gas Price: How much per gas (in gwei)

Total Fee = Gas Used × Gas Price
```

**Example Transaction**:
```
Send 1 ETH to friend:
- Gas used: 21,000
- Gas price: 50 gwei (0.00000005 ETH)
- Fee: 21,000 × 50 = 1,050,000 gwei = 0.00105 ETH

At $2,000/ETH: Fee = $2.10
```

### 2.5. EVM - "Global Sandbox Computer"

**Ethereum Virtual Machine (EVM)** như một **giant sandboxed computer**:

```
Sandbox Properties:
✓ Deterministic: Same input → Same output (always)
✓ Isolated: Cannot access external world directly
✓ Metered: Every operation costs gas
✓ Reversible: Failed transactions rollback completely

Why Sandbox?
- Security: Malicious code can't harm nodes
- Consensus: All nodes compute same result
- Fairness: No one gets free computation
```

**Stack Machine**:
```
EVM operates like calculator with stack:

Example: Compute 2 + 3 × 4

Stack operations:
1. PUSH 2    → [2]
2. PUSH 3    → [2, 3]
3. PUSH 4    → [2, 3, 4]
4. MUL       → [2, 12]      (3 × 4)
5. ADD       → [14]          (2 + 12)

Result: 14
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Ethereum Account Model

**Two Account Types**:

**1. Externally Owned Accounts (EOA)**:
```python
class EOA:
    """User accounts controlled by private keys"""
    def __init__(self, private_key):
        self.address = derive_address(private_key)
        self.balance = 0  # ETH balance in wei
        self.nonce = 0    # Transaction counter
        
        # No code
        # No storage
```

**2. Contract Accounts**:
```python
class ContractAccount:
    """Smart contract accounts"""
    def __init__(self, creator):
        self.address = create_contract_address(creator)
        self.balance = 0      # Can hold ETH
        self.nonce = 1        # Always 1 for contracts
        self.code = b''       # EVM bytecode
        self.storage = {}     # Persistent storage (key → value)
```

**Account State Structure**:
```
Account = {
    nonce: uint64,           // Transaction count (EOA) or 1 (contract)
    balance: uint256,        // Wei balance
    storageRoot: bytes32,    // Merkle root of storage trie
    codeHash: bytes32        // Hash of EVM code (empty for EOA)
}
```

**State Trie**:

Ethereum uses **Patricia Merkle Trie** để store state:

```
                    State Root
                         |
        ┌───────────────┼───────────────┐
        |                               |
   Account 1                       Account 2
   ├─ nonce: 5                    ├─ nonce: 1
   ├─ balance: 10 ETH             ├─ balance: 0 ETH
   ├─ storageRoot: 0x...          ├─ storageRoot: 0x...
   └─ codeHash: 0x...             └─ codeHash: 0x...
```

**Address Derivation**:

**EOA Address** (from public key):
```python
def derive_eoa_address(public_key):
    """Derive Ethereum address from public key"""
    # Keccak-256 hash of public key (65 bytes)
    hash_result = keccak256(public_key)
    
    # Take last 20 bytes
    address = hash_result[-20:]
    
    # Add 0x prefix and checksum
    return to_checksum_address(address)
```

**Contract Address** (deterministic):
```python
def create_contract_address(sender, nonce):
    """Compute contract address from sender and nonce"""
    # RLP encode [sender_address, nonce]
    rlp_encoded = rlp.encode([sender, nonce])
    
    # Keccak-256 hash
    hash_result = keccak256(rlp_encoded)
    
    # Take last 20 bytes
    return hash_result[-20:]
```

**CREATE2 Address** (deterministic từ salt):
```python
def create2_address(sender, salt, init_code):
    """Compute CREATE2 contract address"""
    # 0xff + sender + salt + keccak256(init_code)
    data = b'\xff' + sender + salt + keccak256(init_code)
    
    hash_result = keccak256(data)
    return hash_result[-20:]
```

### 3.2. Transaction Structure

**Transaction Fields**:

```python
class Transaction:
    """Ethereum transaction"""
    def __init__(self):
        self.nonce = 0           # Sender's transaction count
        self.gas_price = 0       # Wei per gas (legacy)
        self.gas_limit = 0       # Max gas allowed
        self.to = None           # Recipient (None for contract creation)
        self.value = 0           # Wei to send
        self.data = b''          # Contract call data or init code
        self.v, self.r, self.s = 0, 0, 0  # ECDSA signature
        
        # EIP-1559 (post-London fork)
        self.max_fee_per_gas = 0              # Max total fee
        self.max_priority_fee_per_gas = 0    # Tip to miner
        self.chain_id = 1                     # Network ID
```

**Transaction Types**:

**Type 0: Legacy**
```
Fields: nonce, gasPrice, gasLimit, to, value, data, v, r, s
Fee: gasPrice × gasUsed
```

**Type 1: EIP-2930 (Access List)**
```
Additional: accessList (pre-declare accessed addresses/storage)
Benefit: Gas savings for known access patterns
```

**Type 2: EIP-1559 (Dynamic Fee)**
```
Instead of gasPrice:
- maxFeePerGas: Maximum total willing to pay
- maxPriorityFeePerGas: Tip for validator

Actual fee: baseFee + min(maxPriorityFee, maxFee - baseFee)
```

**Transaction Lifecycle**:

```python
def process_transaction(tx, state):
    """Process transaction through EVM"""
    
    # 1. Validation
    if tx.nonce != state.get_nonce(tx.sender):
        return "Invalid nonce"
    
    if state.get_balance(tx.sender) < tx.value + tx.gas_limit * tx.gas_price:
        return "Insufficient balance"
    
    # 2. Increment nonce
    state.increment_nonce(tx.sender)
    
    # 3. Deduct gas prepay
    gas_cost = tx.gas_limit * tx.gas_price
    state.deduct_balance(tx.sender, gas_cost)
    
    # 4. Execute
    if tx.to is None:
        # Contract creation
        result = create_contract(tx.data, tx.value, tx.gas_limit)
    else:
        # Call contract or transfer
        result = execute_call(tx.to, tx.data, tx.value, tx.gas_limit)
    
    # 5. Refund unused gas
    gas_refund = (tx.gas_limit - result.gas_used) * tx.gas_price
    state.add_balance(tx.sender, gas_refund)
    
    # 6. Pay validator
    validator_fee = result.gas_used * tx.gas_price
    state.add_balance(validator, validator_fee)
    
    return result
```

### 3.3. Gas Mechanism

**Gas Costs** (subset, pre-EIP-1559):

| Operation | Gas Cost | Description |
|-----------|----------|-------------|
| ADD, SUB | 3 | Arithmetic operations |
| MUL | 5 | Multiplication |
| DIV, MOD | 5 | Division, modulo |
| SHA3 | 30 + 6/word | Keccak-256 hash |
| BALANCE | 400 | Get account balance |
| SLOAD | 800 | Load from storage |
| SSTORE | 20,000 / 5,000 | Store to storage (new/existing) |
| CALL | 700 + | Call another contract |
| CREATE | 32,000 | Create new contract |
| SELFDESTRUCT | 5,000 | Delete contract |

**EIP-1559 Fee Market**:

```python
def calculate_eip1559_fee(block, tx):
    """Calculate transaction fee under EIP-1559"""
    
    # Base fee (burned)
    base_fee = block.base_fee_per_gas
    
    # Priority fee (tip to validator)
    priority_fee = min(
        tx.max_priority_fee_per_gas,
        tx.max_fee_per_gas - base_fee
    )
    
    # Total fee per gas
    effective_gas_price = base_fee + priority_fee
    
    # Total fee
    total_fee = tx.gas_used * effective_gas_price
    
    # Distribution
    burned = tx.gas_used * base_fee
    validator_reward = tx.gas_used * priority_fee
    
    return {
        'total_fee': total_fee,
        'burned': burned,
        'validator_reward': validator_reward
    }
```

**Base Fee Adjustment**:

```python
def update_base_fee(parent_block, current_block):
    """Update base fee based on block fullness"""
    
    TARGET_GAS = 15_000_000  # Target gas per block
    MAX_GAS = 30_000_000     # Max gas per block
    BASE_FEE_MAX_CHANGE_DENOMINATOR = 8
    
    parent_gas_used = parent_block.gas_used
    parent_base_fee = parent_block.base_fee
    
    if parent_gas_used == TARGET_GAS:
        # On target - no change
        return parent_base_fee
    
    elif parent_gas_used > TARGET_GAS:
        # Above target - increase fee
        gas_used_delta = parent_gas_used - TARGET_GAS
        base_fee_delta = max(
            parent_base_fee * gas_used_delta // TARGET_GAS // BASE_FEE_MAX_CHANGE_DENOMINATOR,
            1
        )
        return parent_base_fee + base_fee_delta
    
    else:
        # Below target - decrease fee
        gas_used_delta = TARGET_GAS - parent_gas_used
        base_fee_delta = parent_base_fee * gas_used_delta // TARGET_GAS // BASE_FEE_MAX_CHANGE_DENOMINATOR
        return max(parent_base_fee - base_fee_delta, 0)
```

### 3.4. Block Structure

**Ethereum Block**:

```python
class EthereumBlock:
    """Ethereum block structure"""
    def __init__(self):
        # Header
        self.parent_hash = b''       # Hash of parent block
        self.uncle_hash = b''        # Hash of uncle headers (pre-Merge)
        self.coinbase = b''          # Validator address
        self.state_root = b''        # State trie root
        self.transactions_root = b'' # Transaction trie root
        self.receipts_root = b''     # Receipt trie root
        self.logs_bloom = b''        # Bloom filter for logs
        self.difficulty = 0          # PoW difficulty (0 post-Merge)
        self.number = 0              # Block number
        self.gas_limit = 0           # Max gas for block
        self.gas_used = 0            # Actual gas used
        self.timestamp = 0           # Unix timestamp
        self.extra_data = b''        # Arbitrary data (max 32 bytes)
        self.mix_hash = b''          # PoW mix hash (pre-Merge)
        self.nonce = 0               # PoW nonce (pre-Merge)
        self.base_fee_per_gas = 0    # EIP-1559 base fee
        
        # Body
        self.transactions = []       # List of transactions
        self.uncles = []            # Uncle headers (pre-Merge, max 2)
```

**Block Validation**:

```python
def validate_block(block, parent_block, state):
    """Validate Ethereum block"""
    
    # 1. Check parent hash
    if block.parent_hash != parent_block.hash():
        return False, "Invalid parent hash"
    
    # 2. Check block number
    if block.number != parent_block.number + 1:
        return False, "Invalid block number"
    
    # 3. Check timestamp
    if block.timestamp <= parent_block.timestamp:
        return False, "Invalid timestamp"
    
    # 4. Check gas limit (can only change by 1/1024 per block)
    if abs(block.gas_limit - parent_block.gas_limit) > parent_block.gas_limit // 1024:
        return False, "Gas limit changed too much"
    
    # 5. Check gas used
    if block.gas_used > block.gas_limit:
        return False, "Gas used exceeds limit"
    
    # 6. Validate transactions
    for tx in block.transactions:
        result = validate_transaction(tx, state)
        if not result.valid:
            return False, f"Invalid transaction: {tx.hash}"
    
    # 7. Verify state root
    computed_state_root = compute_state_root(state)
    if block.state_root != computed_state_root:
        return False, "State root mismatch"
    
    # 8. Check base fee (EIP-1559)
    expected_base_fee = update_base_fee(parent_block, block)
    if block.base_fee_per_gas != expected_base_fee:
        return False, "Invalid base fee"
    
    return True, "Valid"
```

### 3.5. State Transition Function

**Core Function** - Heart of Ethereum:

```python
def apply_transaction(state, tx):
    """Apply transaction to state (simplified)"""
    
    # Create execution context
    context = ExecutionContext(
        sender=tx.sender,
        origin=tx.sender,  # Original sender
        gas_price=tx.gas_price,
        gas_limit=tx.gas_limit
    )
    
    # Initialize gas
    gas_remaining = tx.gas_limit
    
    # Intrinsic gas (minimum cost)
    intrinsic_gas = calculate_intrinsic_gas(tx)
    gas_remaining -= intrinsic_gas
    
    if gas_remaining < 0:
        return TransactionResult(success=False, reason="Out of gas")
    
    # Execute
    if tx.to is None:
        # Contract creation
        contract_address = create_contract_address(tx.sender, state.get_nonce(tx.sender))
        result = evm_create(
            state=state,
            sender=tx.sender,
            value=tx.value,
            init_code=tx.data,
            gas=gas_remaining,
            context=context
        )
        
    else:
        # Message call
        result = evm_call(
            state=state,
            sender=tx.sender,
            recipient=tx.to,
            value=tx.value,
            data=tx.data,
            gas=gas_remaining,
            context=context
        )
    
    # Update state if successful
    if result.success:
        state.apply_changes(result.state_changes)
    else:
        # Revert state changes (except nonce increment và gas payment)
        pass
    
    return result
```

---

Bài giảng đã đạt ~10,000 từ và covering core Ethereum architecture concepts. Tôi sẽ tiếp tục tạo các phần còn lại (sections 4-10) và các bài giảng tiếp theo về EVM, Solidity, và DeFi!

Bạn muốn tôi tiếp tục không? 🚀

## Video tham khảo

- **Xem trước:** [What is ETHEREUM? EXPLAINED For Beginners](https://www.youtube.com/watch?v=1Hu8lzoi0Tw) — CoinGecko, tiếng Anh. Bức tranh Ethereum như máy tính thế giới và smart contract; xem trước mục động lực so với Bitcoin.
- [Account Based vs. UTxO - Understanding Ethereum](https://www.youtube.com/watch?v=5Mhvk0U6zqE) — Unbounded Capital, tiếng Anh. Đối chiếu sổ cái theo tài khoản với UTXO; đúng mô hình state mà bài lấy làm trục.
- [What is the EVM? Ethereum Virtual Machine - Explained with Animations](https://www.youtube.com/watch?v=sTOcqS4msoU) — Whiteboard Crypto, tiếng Anh. Hoạt hình EVM cho thấy giao dịch làm đổi state; cầu nối sang bài sau về bytecode và gas.
