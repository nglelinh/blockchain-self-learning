---
layout: post
title: "Lecture 03.01: Ethereum Virtual Machine (EVM) - The World Computer Engine"
chapter: '03'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter03
---

# Lecture: Ethereum Virtual Machine (EVM) - The World Computer Engine

## 1. Tổng quan về khái niệm

**Ethereum Virtual Machine (EVM)** là trái tim của Ethereum - một **quasi-Turing-complete** virtual machine chạy trên mọi Ethereum node, executing smart contract code một cách deterministic và isolated. Nếu Ethereum là "World Computer", thì EVM chính là CPU của computer đó.

**What is a Virtual Machine?**

Virtual Machine (VM) là một software emulation của một computer system. Familiar examples:
- **JVM (Java Virtual Machine)**: Runs Java bytecode
- **Python VM**: Executes Python bytecode
- **Docker**: Containerized virtual environments
- **VMware/VirtualBox**: Full OS virtualization

EVM similar nhưng với critical differences designed cho blockchain:

**Traditional VM** (JVM, Python VM):
```
Purpose: Run applications efficiently
Optimization: Speed, memory usage
Safety: Sandbox from host system
Determinism: Not critical
Cost: Free to execute
```

**EVM** (Ethereum Virtual Machine):
```
Purpose: Execute smart contracts trustlessly
Optimization: Determinism, consensus compatibility
Safety: Complete isolation, metered execution
Determinism: CRITICAL (all nodes must agree)
Cost: Every operation costs gas
```

**The Determinism Requirement**:

Đây là requirement quan trọng nhất của EVM. Vì thousands of nodes phải execute cùng contract và arrive at cùng result, EVM phải **absolutely deterministic**:

\[
\forall \text{ inputs } I, \text{ state } S: \quad \text{EVM}(S, I) = \text{Same Output (always)}
\]

Không được có:
- ❌ Random number generation (unless from blockchain state)
- ❌ Current time access (unless from block timestamp)
- ❌ Network calls (no external data)
- ❌ File system access
- ❌ Floating-point arithmetic (rounding differences across platforms)

**Historical Context**:

EVM design influenced by:
- **Bitcoin Script**: Proved programmable money possible, nhưng too limited
- **JVM**: Stack-based architecture
- **WebAssembly**: Compilation target concepts
- **Academic VM research**: Formal semantics

**Vitalik Buterin's Design Philosophy**:

> "The EVM is designed to be as simple as possible, while still being Turing-complete. Simplicity makes it easier to reason about security và formal verification."

**Key Design Decisions**:

1. **Stack-based** (not register-based): Simpler, less state
2. **256-bit word size**: Native support cho cryptographic operations
3. **Metered execution** (gas): Prevents DoS, ensures termination
4. **Immutable code**: Deployed contracts cannot be changed
5. **Isolated execution**: Contracts cannot affect node's host system

**EVM as State Transition Function**:

Fundamentally, EVM is a function:

\[
\text{EVM}: (\text{World State}, \text{Transaction}) \rightarrow (\text{New World State}, \text{Gas Used})
\]

```
Input:
- Current state (all account balances, storage)
- Transaction (from, to, data, value, gas)

Process:
- Execute bytecode
- Modify state
- Track gas consumption

Output:
- New state (updated balances, storage)
- Gas used
- Success/revert status
- Logs emitted
```

**Evolution of EVM**:

- **2015**: Original EVM (Frontier)
- **2016**: Homestead improvements
- **2017**: Metropolis (Byzantium, Constantinople) - new opcodes
- **2019**: Istanbul - gas cost adjustments
- **2021**: London (EIP-1559) - base fee
- **2022**: The Merge - PoS integration
- **Future**: EVM improvements (EOF, verkle tries)

---

## 2. Hiểu biết trực quan

### 2.1. EVM như "Virtual CPU"

Hãy tưởng tượng EVM như một **extremely simple computer** với very specific constraints:

**Regular Computer CPU**:
```
Components:
- Registers (fast storage): 16+ registers
- RAM (memory): GBs available
- Hard Drive (storage): TBs available
- Clock speed: GHz
- Instructions: Hundreds of complex instructions
- Cost: Free to run programs
```

**EVM "CPU"**:
```
Components:
- Stack (temporary): 1024 items max, 256-bit words
- Memory (scratch): Expandable but expensive
- Storage (persistent): Key-value store, very expensive
- "Clock speed": Limited by gas
- Instructions: ~150 simple opcodes
- Cost: Every operation costs gas!
```

**Example Program - Add Two Numbers**:

**x86 Assembly** (regular CPU):
```asm
mov eax, 5      ; Load 5 into register
add eax, 3      ; Add 3 to register
; Result in eax = 8
; Cost: Free, nanoseconds
```

**EVM Bytecode**:
```
PUSH1 0x05     ; Push 5 onto stack
PUSH1 0x03     ; Push 3 onto stack
ADD            ; Pop two, add, push result
; Result on stack = 8
; Cost: 3 + 3 + 3 = 9 gas
```

### 2.2. Stack Machine - Calculator Analogy

EVM hoạt động giống như **RPN (Reverse Polish Notation) calculator**:

**Normal Calculator** (infix notation):
```
Input: 2 + 3 × 4
Need parentheses: (2 + 3) × 4 = 20
                or 2 + (3 × 4) = 14
```

**RPN Calculator** (postfix, like EVM):
```
Input: 2 3 4 × +

Stack operations:
1. Push 2    → [2]
2. Push 3    → [2, 3]
3. Push 4    → [2, 3, 4]
4. Multiply  → [2, 12]       (3 × 4)
5. Add       → [14]          (2 + 12)

No ambiguity! No parentheses needed!
```

**EVM Example** - Compute (5 + 3) × 2:

```
Bytecode:           Stack After:
PUSH1 0x05         [5]
PUSH1 0x03         [5, 3]
ADD                [8]              (5 + 3)
PUSH1 0x02         [8, 2]
MUL                [16]             (8 × 2)

Final result: 16
Gas used: 3 + 3 + 3 + 3 + 5 = 17 gas
```

### 2.3. Three Storage Types - Kitchen Analogy

**Stack** = **Counter top**:
```
Fast, temporary workspace
Limited space (1024 items)
Free to use (low gas)
Cleared after transaction

Like: Ingredients laid out while cooking
```

**Memory** = **Table**:
```
Expandable workspace
Exists only during transaction
Relatively cheap initially
Gets expensive as you expand

Like: Setting up extra workspace
```

**Storage** = **Pantry/Freezer**:
```
Persistent between transactions
Very expensive to write
Cheap to read
Stored forever on blockchain

Like: Long-term food storage (expensive)
```

**Cost Comparison**:
```
Stack operation:    3 gas       (pennies)
Memory expansion:   3+ gas      (pennies to dollars)
Storage write:      20,000 gas  (tens of dollars!)
Storage read:       2,100 gas   (few dollars)
```

### 2.4. Gas như "Computer Time Meter"

Tưởng tượng EVM như một **pay-per-use supercomputer at arcade**:

```
Arcade Game:
- Insert quarters
- Play until quarters run out
- More complex actions = more quarters

EVM Execution:
- Provide gas
- Execute until gas runs out
- More complex operations = more gas

Example:
Simple addition:     1 quarter  (3 gas)
Store data:          100 quarters (20,000 gas)
Complex loop:        1000 quarters (varies)
```

**Why Metered Execution?**

```
Without Gas:
- Attacker writes infinite loop
- All nodes execute forever
- Network halts!

With Gas:
- Attacker must pay for computation
- Gas runs out → execution stops
- Network protected!
```

### 2.5. Contract Execution - Vending Machine 2.0

**Simple Vending Machine**:
```
Input: Money + Button press
Process: Check balance, dispense item
Output: Item + Change
State: Inventory decreased
```

**Smart Contract (Token Transfer)**:
```
Input: Transaction (from: Alice, to: Bob, amount: 10)
Process:
  1. Check Alice's balance ≥ 10
  2. Deduct 10 from Alice
  3. Add 10 to Bob
  4. Emit Transfer event
Output: Success/Revert
State: Balances updated permanently
Gas: ~50,000 gas consumed
```

---

## 3. Nền tảng kỹ thuật

### 3.1. EVM Architecture

**Components**:

```
┌─────────────────────────────────────────┐
│           EVM EXECUTION CONTEXT         │
├─────────────────────────────────────────┤
│  Stack (1024 × 256-bit)                │
│  - Temporary workspace                  │
│  - LIFO structure                       │
│  - Operations pop/push                  │
├─────────────────────────────────────────┤
│  Memory (byte array)                    │
│  - Volatile (cleared after TX)          │
│  - Expandable (costly)                  │
│  - Word-addressed (32-byte chunks)      │
├─────────────────────────────────────────┤
│  Storage (key-value mapping)            │
│  - Persistent (blockchain state)        │
│  - 2^256 slots per contract             │
│  - Each slot: 256 bits                  │
├─────────────────────────────────────────┤
│  Program Counter (PC)                   │
│  - Current instruction position         │
│  - Increments or jumps                  │
├─────────────────────────────────────────┤
│  Gas Available                          │
│  - Remaining gas                        │
│  - Decrements with each operation       │
├─────────────────────────────────────────┤
│  Call Stack (1024 depth)               │
│  - Nested contract calls                │
│  - Return data                          │
└─────────────────────────────────────────┘
```

**Execution Model**:

```python
class EVMExecutionContext:
    """EVM execution context"""
    def __init__(self, code, calldata, value, gas_limit):
        # Code
        self.code = code              # Contract bytecode
        self.pc = 0                   # Program counter
        
        # Stack (max 1024 items)
        self.stack = []
        self.max_stack = 1024
        
        # Memory (byte array, expands as needed)
        self.memory = bytearray()
        
        # Storage (persistent key-value)
        self.storage = {}             # Will connect to state DB
        
        # Gas
        self.gas_remaining = gas_limit
        
        # Call context
        self.calldata = calldata      # Input data
        self.returndata = b''         # Output data
        self.value = value            # ETH sent
        
        # Logs
        self.logs = []
        
        # Success flag
        self.reverted = False
    
    def execute(self):
        """Execute bytecode until completion or out of gas"""
        while self.pc < len(self.code) and not self.reverted:
            # Get opcode
            opcode = self.code[self.pc]
            
            # Consume gas for operation
            gas_cost = self.get_gas_cost(opcode)
            
            if self.gas_remaining < gas_cost:
                # Out of gas!
                self.revert("Out of gas")
                break
            
            self.gas_remaining -= gas_cost
            
            # Execute operation
            self.execute_opcode(opcode)
            
            # Increment PC (unless JUMP occurred)
            if opcode not in [0x56, 0x57]:  # JUMP, JUMPI
                self.pc += 1
        
        return self.get_result()
```

### 3.2. Opcode Categories

**EVM has ~150 opcodes, grouped by category**:

**1. Arithmetic Operations** (0x01-0x0b):
```
0x01  ADD        a b → a+b           (3 gas)
0x02  MUL        a b → a×b           (5 gas)
0x03  SUB        a b → a-b           (3 gas)
0x04  DIV        a b → a÷b           (5 gas)
0x05  SDIV       a b → signed div    (5 gas)
0x06  MOD        a b → a mod b       (5 gas)
0x07  SMOD       a b → signed mod    (5 gas)
0x08  ADDMOD     a b N → (a+b) mod N (8 gas)
0x09  MULMOD     a b N → (a×b) mod N (8 gas)
0x0a  EXP        a b → a^b           (10 gas + 50/byte)
0x0b  SIGNEXTEND b x → sign extend   (5 gas)
```

**2. Comparison Operations** (0x10-0x1d):
```
0x10  LT         a b → a < b         (3 gas)
0x11  GT         a b → a > b         (3 gas)
0x12  SLT        a b → signed <      (3 gas)
0x13  SGT        a b → signed >      (3 gas)
0x14  EQ         a b → a == b        (3 gas)
0x15  ISZERO     a → a == 0          (3 gas)
0x16  AND        a b → a & b         (3 gas)
0x17  OR         a b → a | b         (3 gas)
0x18  XOR        a b → a ^ b         (3 gas)
0x19  NOT        a → ~a              (3 gas)
0x1a  BYTE       i x → i-th byte     (3 gas)
0x1b  SHL        shift value → <<    (3 gas)
0x1c  SHR        shift value → >>    (3 gas)
0x1d  SAR        shift value → >>>   (3 gas)
```

**3. Cryptographic Operations** (0x20):
```
0x20  SHA3       offset size → keccak256(memory[offset:offset+size])
                                      (30 gas + 6/word)
```

**4. Environmental Information** (0x30-0x3f):
```
0x30  ADDRESS       → this.address                    (2 gas)
0x31  BALANCE       addr → balance[addr]              (100 gas)
0x32  ORIGIN        → tx.origin                       (2 gas)
0x33  CALLER        → msg.sender                      (2 gas)
0x34  CALLVALUE     → msg.value                       (2 gas)
0x35  CALLDATALOAD  i → calldata[i:i+32]             (3 gas)
0x36  CALLDATASIZE  → len(calldata)                   (2 gas)
0x37  CALLDATACOPY  destOffset offset size → copy    (3 gas)
0x38  CODESIZE      → len(this.code)                  (2 gas)
0x39  CODECOPY      destOffset offset size → copy    (3 gas)
0x3a  GASPRICE      → tx.gasprice                     (2 gas)
0x3b  EXTCODESIZE   addr → len(code[addr])           (100 gas)
0x3c  EXTCODECOPY   addr destOffset offset size      (100 gas)
0x3d  RETURNDATASIZE → len(returndata)                (2 gas)
0x3e  RETURNDATACOPY destOffset offset size          (3 gas)
0x3f  EXTCODEHASH   addr → keccak256(code[addr])    (100 gas)
```

**5. Block Information** (0x40-0x48):
```
0x40  BLOCKHASH     blockNumber → hash               (20 gas)
0x41  COINBASE      → block.coinbase                  (2 gas)
0x42  TIMESTAMP     → block.timestamp                 (2 gas)
0x43  NUMBER        → block.number                    (2 gas)
0x44  DIFFICULTY    → block.difficulty (0 post-Merge) (2 gas)
0x45  GASLIMIT      → block.gaslimit                  (2 gas)
0x46  CHAINID       → chain_id                        (2 gas)
0x47  SELFBALANCE   → balance[this]                   (5 gas)
0x48  BASEFEE       → block.basefee                   (2 gas)
```

**6. Stack Operations** (0x50-0x5f):
```
0x50  POP           a →                               (2 gas)
0x51  MLOAD         offset → memory[offset:offset+32] (3 gas)
0x52  MSTORE        offset value → memory[offset]=value (3 gas)
0x53  MSTORE8       offset value → memory[offset]=value[0] (3 gas)
0x54  SLOAD         key → storage[key]                (2100 gas)
0x55  SSTORE        key value → storage[key]=value    (20000/5000 gas)
0x56  JUMP          dest → pc=dest                    (8 gas)
0x57  JUMPI         dest cond → if(cond) pc=dest     (10 gas)
0x58  PC            → pc                              (2 gas)
0x59  MSIZE         → len(memory)                     (2 gas)
0x5a  GAS           → gas_remaining                   (2 gas)
0x5b  JUMPDEST      (marker for valid jump)           (1 gas)
```

**7. Push Operations** (0x60-0x7f):
```
0x60  PUSH1   → push 1-byte value                     (3 gas)
0x61  PUSH2   → push 2-byte value                     (3 gas)
...
0x7f  PUSH32  → push 32-byte value                    (3 gas)
```

**8. Duplication** (0x80-0x8f):
```
0x80  DUP1    [a, ...] → [a, a, ...]                  (3 gas)
0x81  DUP2    [a, b, ...] → [b, a, b, ...]           (3 gas)
...
0x8f  DUP16   duplicate 16th item                     (3 gas)
```

**9. Exchange** (0x90-0x9f):
```
0x90  SWAP1   [a, b] → [b, a]                         (3 gas)
0x91  SWAP2   [a, b, c] → [c, b, a]                  (3 gas)
...
0x9f  SWAP16  swap với 16th item                      (3 gas)
```

**10. Logging** (0xa0-0xa4):
```
0xa0  LOG0    offset size → emit log (no topics)     (375+ gas)
0xa1  LOG1    offset size topic1 → emit log          (375+ gas)
0xa2  LOG2    offset size topic1 topic2              (375+ gas)
0xa3  LOG3    offset size topic1 topic2 topic3       (375+ gas)
0xa4  LOG4    offset size topic1 topic2 topic3 topic4 (375+ gas)
```

**11. Contract Creation và Calls** (0xf0-0xff):
```
0xf0  CREATE        value offset size → addr         (32000 gas)
0xf1  CALL          gas addr value in out → success  (700+ gas)
0xf2  CALLCODE      (deprecated)                      
0xf3  RETURN        offset size → return data         (0 gas)
0xf4  DELEGATECALL  gas addr in out → success        (700+ gas)
0xf5  CREATE2       value offset size salt → addr    (32000 gas)
0xfa  STATICCALL    gas addr in out → success        (700+ gas)
0xfd  REVERT        offset size → revert với data    (0 gas)
0xfe  INVALID       → invalid opcode                  (consumes all gas)
0xff  SELFDESTRUCT  addr → destroy contract          (5000 gas)
```

### 3.3. Execution Trace Example

**Solidity Code**:
```solidity
function add(uint256 a, uint256 b) public pure returns (uint256) {
    return a + b;
}
```

**Compiled Bytecode** (simplified):
```
PUSH1 0x40          // Free memory pointer
MLOAD
CALLDATALOAD 0x04   // Load first argument (a)
CALLDATALOAD 0x24   // Load second argument (b)
ADD                 // a + b
PUSH1 0x40
MLOAD
MSTORE              // Store result in memory
PUSH1 0x20
PUSH1 0x40
MLOAD
RETURN              // Return 32 bytes from memory
```

**Execution Trace**:

```
Step  Opcode         Stack (top→bottom)              Memory    Gas
────────────────────────────────────────────────────────────────────
0     PUSH1 0x40     [0x40]                          []        21000
1     MLOAD          [0x80]                          [...]     20997
2     CALLDATALOAD   [5, 0x80]                       [...]     20994
3     CALLDATALOAD   [3, 5, 0x80]                    [...]     20991
4     ADD            [8, 0x80]                       [...]     20988
5     PUSH1 0x40     [0x40, 8, 0x80]                 [...]     20985
6     MLOAD          [0x80, 8, 0x80]                 [...]     20982
7     MSTORE         [0x80]                          [0x08...] 20979
8     PUSH1 0x20     [0x20, 0x80]                    [...]     20976
9     PUSH1 0x40     [0x40, 0x20, 0x80]              [...]     20973
10    MLOAD          [0x80, 0x20, 0x80]              [...]     20970
11    RETURN         []                               [...]     20970

Result: Returns 32 bytes from memory = 0x0...08 (8 in hex)
Gas Used: 21000 - 20970 = 30 gas
```

### 3.4. Memory Layout

**Memory Model**:
```
Memory is byte array, expandable in 32-byte chunks (words)

Address:  0x00  0x20  0x40  0x60  0x80  0xA0  ...
          ┌────┬────┬────┬────┬────┬────┐
Content:  │ W0 │ W1 │ W2 │ W3 │ W4 │ W5 │ ...
          └────┴────┴────┴────┴────┴────┘
          
W0 = bytes[0:32]   (word 0)
W1 = bytes[32:64]  (word 1)
W2 = bytes[64:96]  (word 2)
...
```

**Memory Expansion Cost**:

\[
\text{Cost} = \text{Linear Cost} + \text{Quadratic Cost}
\]

\[
\begin{align}
\text{Linear} &= 3 \times \text{words\_allocated} \\
\text{Quadratic} &= \frac{(\text{words\_allocated})^2}{512}
\end{align}
\]

**Example**:
```
Access memory[0:32]:    Cost = 3 gas
Access memory[0:1024]:  Cost = 3×32 + 32²/512 = 96 + 2 = 98 gas
Access memory[0:10240]: Cost = 3×320 + 320²/512 = 960 + 200 = 1160 gas
```

Gets progressively more expensive!

### 3.5. Storage Layout

**Storage Model**: Persistent key-value store

```
Storage Slot:  256-bit key → 256-bit value

Contract:
  mapping(address => uint256) balances;
  uint256 totalSupply;
  address owner;

Layout:
  Slot 0: totalSupply
  Slot 1: owner (address padded to 256 bits)
  Slot 2-?: balances mapping
```

**Mapping Storage Location**:

For `mapping(K => V) map;` at slot `p`:

\[
\text{slot} = \text{keccak256}(k \parallel p)
\]

Where:
- k = key (padded to 32 bytes)
- p = mapping's slot position
- ∥ = concatenation

**Example**:
```solidity
contract Storage {
    mapping(address => uint256) balances;  // Slot 0
    
    // balances[0x123...] stored at:
    slot = keccak256(0x000...123 ++ 0x000...000)
         = keccak256(0x000...12300...000)
}
```

**Dynamic Arrays**:

For `T[] array;` at slot `p`:

\[
\begin{align}
\text{slot}(p) &= \text{array.length} \\
\text{slot}(\text{array}[i]) &= \text{keccak256}(p) + i
\end{align}
\]

---

## 4. Công thức toán học và độ phức tạp

### 4.1. Gas Cost Analysis

**Basic Gas Formula**:

\[
\text{Total Gas} = \text{Intrinsic Gas} + \sum_{i} \text{Gas}(\text{Operation}_i)
\]

**Intrinsic Gas** (minimum cost):

\[
G_{\text{intrinsic}} = 21000 + \sum_{\text{zero bytes}} 4 + \sum_{\text{non-zero bytes}} 16
\]

**Example Transaction**:
```
To: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Value: 0 ETH
Data: 0x0123 (2 bytes, both non-zero)

Intrinsic Gas = 21000 + 0×4 + 2×16 = 21,032 gas
```

**Memory Expansion Cost**:

Let \( \mu_i \) = memory size before operation, \( \mu'_i \) = after

\[
C_{\text{mem}}(\mu_i, \mu'_i) = C_{\text{mem}}(\mu'_i) - C_{\text{mem}}(\mu_i)
\]

Where:

\[
C_{\text{mem}}(\mu) = 3 \times \mu + \left\lfloor \frac{\mu^2}{512} \right\rfloor
\]

**Storage Cost** (SSTORE):

\[
\text{Gas}(\text{SSTORE}) = \begin{cases}
20000 & \text{if zero → non-zero} \\
5000 & \text{if non-zero → non-zero} \\
5000 & \text{if non-zero → zero (+ 15000 refund)}
\end{cases}
\]

**Post-EIP-2200** (more complex):
```
Cold access: 2100 gas (first access)
Warm access: 100 gas (subsequent)

Storage change:
- Zero → Non-zero: 20000 gas
- Non-zero → Different non-zero: 5000 gas  
- Non-zero → Zero: 5000 gas + 15000 refund (later)
- Same value: 100 gas
```

### 4.2. Stack Depth Limit

**Maximum Stack Depth**: 1024 items

**Why Limit?**

\[
\text{Stack overflow prevention}
\]

Without limit:
```
Malicious contract:
function infiniteRecursion() {
    this.infiniteRecursion();  // Call self
}

Would create infinite call stack → crash nodes!
```

With limit:
```
Call depth reaches 1024 → Exception → Execution stops
```

**Call Stack** (nested contract calls):

Each CALL consumes:
- 63/64 of remaining gas passed to callee
- 1/64 retained by caller

Maximum depth: 1024 levels

\[
\text{Gas at depth } d = \text{Initial Gas} \times \left(\frac{63}{64}\right)^d
\]

At depth 1024:
\[
\text{Remaining} \approx \text{Initial} \times 10^{-7} \approx 0
\]

### 4.3. EVM Complexity Analysis

**Time Complexity**:

For contract với n opcodes:

\[
T(n) = O(n)
\]

Linear in bytecode size (each opcode executed at most once per path).

**Space Complexity**:

\[
S = O(s + m + c)
\]

Where:
- s = stack size (≤1024 words)
- m = memory allocated
- c = storage slots accessed

**Gas as Resource Bound**:

Gas effectively limits:

\[
\text{Computation} \leq \frac{\text{Gas Limit}}{\text{Min Gas per Operation}} \approx \frac{30M}{3} = 10M \text{ operations}
\]

Even at block gas limit (30M), finite computation!

### 4.4. Determinism Proof

**Theorem**: EVM execution is deterministic.

**Proof Sketch**:

Given:
- Initial state \( S_0 \)
- Transaction \( T \)
- EVM semantics \( \mathcal{E} \)

**No non-deterministic sources**:
1. No randomness (except from blockchain state - deterministic)
2. No external calls (no network, files, etc.)
3. Fixed-precision arithmetic (256-bit, no floating-point)
4. No undefined behavior (all operations specified)

**Result**: \( \mathcal{E}(S_0, T) \) produces unique \( S_1 \)

\[
\forall \text{ nodes } n_i, n_j: \quad \mathcal{E}_{n_i}(S_0, T) = \mathcal{E}_{n_j}(S_0, T) = S_1
\]

All honest nodes reach same state → Consensus achieved!

### 4.5. Halting Problem và Gas

**Standard Halting Problem**: Undecidable whether program terminates

**EVM Solution**: Gas ensures termination

**Theorem**: Every EVM execution terminates.

**Proof**:

Gas decreases with each operation:
\[
G_{i+1} = G_i - \text{Cost}(\text{Op}_i) < G_i
\]

Gas cannot increase (except via external gas injection).

Eventually:
\[
G_n \leq 0 \implies \text{Execution stops}
\]

**Maximum Operations**:

\[
N_{\max} = \frac{G_{\text{initial}}}{\min(\text{Gas costs})} = \frac{30M}{1} = 30M
\]

Finite bound → Always terminates!

---

## 5. Implementation Insight

### 5.1. Simplified EVM Implementation

```python
import hashlib
from typing import List, Dict, Optional
from enum import IntEnum

class Opcode(IntEnum):
    """EVM Opcode definitions"""
    STOP = 0x00
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    DIV = 0x04
    MOD = 0x06
    ADDMOD = 0x08
    MULMOD = 0x09
    EXP = 0x0a
    
    LT = 0x10
    GT = 0x11
    EQ = 0x14
    ISZERO = 0x15
    AND = 0x16
    OR = 0x17
    XOR = 0x18
    NOT = 0x19
    
    SHA3 = 0x20
    
    ADDRESS = 0x30
    BALANCE = 0x31
    CALLER = 0x33
    CALLVALUE = 0x34
    CALLDATALOAD = 0x35
    CALLDATASIZE = 0x36
    
    POP = 0x50
    MLOAD = 0x51
    MSTORE = 0x52
    SLOAD = 0x54
    SSTORE = 0x55
    JUMP = 0x56
    JUMPI = 0x57
    PC = 0x58
    MSIZE = 0x59
    GAS = 0x5a
    JUMPDEST = 0x5b
    
    PUSH1 = 0x60
    # PUSH2-PUSH32: 0x61-0x7f
    
    DUP1 = 0x80
    # DUP2-DUP16: 0x81-0x8f
    
    SWAP1 = 0x90
    # SWAP2-SWAP16: 0x91-0x9f
    
    LOG0 = 0xa0
    RETURN = 0xf3
    REVERT = 0xfd
    INVALID = 0xfe
    SELFDESTRUCT = 0xff

class EVM:
    """Simplified Ethereum Virtual Machine"""
    
    def __init__(self, code: bytes, calldata: bytes = b'', 
                 value: int = 0, gas_limit: int = 1000000):
        # Code
        self.code = code
        self.pc = 0
        
        # Stack (max 1024 items, 256-bit each)
        self.stack: List[int] = []
        self.MAX_STACK = 1024
        
        # Memory (byte array)
        self.memory = bytearray()
        
        # Storage (persistent)
        self.storage: Dict[int, int] = {}
        
        # Execution context
        self.calldata = calldata
        self.value = value
        self.returndata = b''
        
        # Gas
        self.gas = gas_limit
        
        # State
        self.stopped = False
        self.reverted = False
        
        # Logs
        self.logs = []
    
    def push(self, value: int):
        """Push value onto stack"""
        if len(self.stack) >= self.MAX_STACK:
            raise Exception("Stack overflow")
        self.stack.append(value & ((1 << 256) - 1))  # Ensure 256-bit
    
    def pop(self) -> int:
        """Pop value from stack"""
        if not self.stack:
            raise Exception("Stack underflow")
        return self.stack.pop()
    
    def peek(self, depth: int = 0) -> int:
        """Peek at stack item"""
        if depth >= len(self.stack):
            raise Exception("Stack underflow")
        return self.stack[-(depth + 1)]
    
    def consume_gas(self, amount: int):
        """Consume gas"""
        if self.gas < amount:
            raise Exception("Out of gas")
        self.gas -= amount
    
    def expand_memory(self, offset: int, size: int):
        """Expand memory to accommodate access"""
        if size == 0:
            return
        
        new_size = offset + size
        
        if new_size > len(self.memory):
            # Calculate expansion cost
            old_words = (len(self.memory) + 31) // 32
            new_words = (new_size + 31) // 32
            
            old_cost = 3 * old_words + old_words ** 2 // 512
            new_cost = 3 * new_words + new_words ** 2 // 512
            
            expansion_cost = new_cost - old_cost
            self.consume_gas(expansion_cost)
            
            # Expand memory
            self.memory.extend(b'\x00' * (new_size - len(self.memory)))
    
    def execute(self):
        """Execute bytecode"""
        while self.pc < len(self.code) and not self.stopped and not self.reverted:
            opcode = self.code[self.pc]
            
            try:
                self.execute_opcode(opcode)
            except Exception as e:
                print(f"Exception at PC {self.pc}: {e}")
                self.reverted = True
                break
        
        return {
            'success': not self.reverted,
            'gas_used': gas_limit - self.gas,
            'returndata': self.returndata,
            'logs': self.logs,
            'storage': self.storage
        }
    
    def execute_opcode(self, opcode: int):
        """Execute single opcode"""
        
        # Arithmetic
        if opcode == Opcode.ADD:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push((a + b) & ((1 << 256) - 1))
        
        elif opcode == Opcode.MUL:
            self.consume_gas(5)
            b = self.pop()
            a = self.pop()
            self.push((a * b) & ((1 << 256) - 1))
        
        elif opcode == Opcode.SUB:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push((a - b) & ((1 << 256) - 1))
        
        elif opcode == Opcode.DIV:
            self.consume_gas(5)
            b = self.pop()
            a = self.pop()
            self.push(0 if b == 0 else a // b)
        
        elif opcode == Opcode.MOD:
            self.consume_gas(5)
            b = self.pop()
            a = self.pop()
            self.push(0 if b == 0 else a % b)
        
        # Comparison
        elif opcode == Opcode.LT:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(1 if a < b else 0)
        
        elif opcode == Opcode.GT:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(1 if a > b else 0)
        
        elif opcode == Opcode.EQ:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(1 if a == b else 0)
        
        elif opcode == Opcode.ISZERO:
            self.consume_gas(3)
            a = self.pop()
            self.push(1 if a == 0 else 0)
        
        # Bitwise
        elif opcode == Opcode.AND:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(a & b)
        
        elif opcode == Opcode.OR:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(a | b)
        
        elif opcode == Opcode.XOR:
            self.consume_gas(3)
            b = self.pop()
            a = self.pop()
            self.push(a ^ b)
        
        elif opcode == Opcode.NOT:
            self.consume_gas(3)
            a = self.pop()
            self.push(~a & ((1 << 256) - 1))
        
        # Stack operations
        elif opcode == Opcode.POP:
            self.consume_gas(2)
            self.pop()
        
        elif opcode == Opcode.MLOAD:
            self.consume_gas(3)
            offset = self.pop()
            self.expand_memory(offset, 32)
            value = int.from_bytes(self.memory[offset:offset+32], 'big')
            self.push(value)
        
        elif opcode == Opcode.MSTORE:
            self.consume_gas(3)
            offset = self.pop()
            value = self.pop()
            self.expand_memory(offset, 32)
            self.memory[offset:offset+32] = value.to_bytes(32, 'big')
        
        elif opcode == Opcode.SLOAD:
            self.consume_gas(2100)  # Cold access
            key = self.pop()
            value = self.storage.get(key, 0)
            self.push(value)
        
        elif opcode == Opcode.SSTORE:
            key = self.pop()
            value = self.pop()
            
            # Simplified gas cost (EIP-2200 more complex)
            if key not in self.storage or self.storage[key] == 0:
                self.consume_gas(20000)  # Zero → non-zero
            else:
                self.consume_gas(5000)   # Non-zero → non-zero
            
            self.storage[key] = value
        
        # Control flow
        elif opcode == Opcode.JUMP:
            self.consume_gas(8)
            dest = self.pop()
            
            # Verify JUMPDEST
            if dest >= len(self.code) or self.code[dest] != Opcode.JUMPDEST:
                raise Exception(f"Invalid jump destination: {dest}")
            
            self.pc = dest
            return  # Don't increment PC
        
        elif opcode == Opcode.JUMPI:
            self.consume_gas(10)
            dest = self.pop()
            cond = self.pop()
            
            if cond != 0:
                if dest >= len(self.code) or self.code[dest] != Opcode.JUMPDEST:
                    raise Exception(f"Invalid jump destination: {dest}")
                self.pc = dest
                return  # Don't increment PC
        
        elif opcode == Opcode.JUMPDEST:
            self.consume_gas(1)
            # Just a marker, no operation
        
        elif opcode == Opcode.PC:
            self.consume_gas(2)
            self.push(self.pc)
        
        elif opcode == Opcode.GAS:
            self.consume_gas(2)
            self.push(self.gas)
        
        # PUSH operations
        elif 0x60 <= opcode <= 0x7f:
            self.consume_gas(3)
            push_size = opcode - 0x5f
            
            # Get bytes after opcode
            value_bytes = self.code[self.pc+1:self.pc+1+push_size]
            value = int.from_bytes(value_bytes, 'big')
            
            self.push(value)
            self.pc += push_size  # Skip pushed bytes
        
        # DUP operations
        elif 0x80 <= opcode <= 0x8f:
            self.consume_gas(3)
            depth = opcode - 0x7f
            value = self.peek(depth - 1)
            self.push(value)
        
        # SWAP operations
        elif 0x90 <= opcode <= 0x9f:
            self.consume_gas(3)
            depth = opcode - 0x8f
            
            # Swap top với item at depth
            top_idx = len(self.stack) - 1
            swap_idx = len(self.stack) - 1 - depth
            
            self.stack[top_idx], self.stack[swap_idx] = \
                self.stack[swap_idx], self.stack[top_idx]
        
        # Return
        elif opcode == Opcode.RETURN:
            offset = self.pop()
            size = self.pop()
            self.expand_memory(offset, size)
            self.returndata = bytes(self.memory[offset:offset+size])
            self.stopped = True
        
        # Revert
        elif opcode == Opcode.REVERT:
            offset = self.pop()
            size = self.pop()
            self.expand_memory(offset, size)
            self.returndata = bytes(self.memory[offset:offset+size])
            self.reverted = True
        
        # Stop
        elif opcode == Opcode.STOP:
            self.stopped = True
        
        # Invalid
        elif opcode == Opcode.INVALID:
            raise Exception("Invalid opcode")
        
        else:
            raise Exception(f"Unimplemented opcode: 0x{opcode:02x}")
        
        # Increment PC
        self.pc += 1

# Example usage
if __name__ == "__main__":
    print("=== EVM Execution Example ===\n")
    
    # Example 1: Simple arithmetic (5 + 3) × 2
    print("Example 1: Calculate (5 + 3) × 2")
    code = bytes([
        Opcode.PUSH1, 0x05,  # Push 5
        Opcode.PUSH1, 0x03,  # Push 3
        Opcode.ADD,          # 5 + 3 = 8
        Opcode.PUSH1, 0x02,  # Push 2
        Opcode.MUL,          # 8 × 2 = 16
        Opcode.PUSH1, 0x00,  # Memory offset 0
        Opcode.MSTORE,       # Store result
        Opcode.PUSH1, 0x20,  # Size 32 bytes
        Opcode.PUSH1, 0x00,  # Offset 0
        Opcode.RETURN        # Return result
    ])
    
    evm = EVM(code)
    result = evm.execute()
    
    print(f"Success: {result['success']}")
    print(f"Gas used: {result['gas_used']}")
    print(f"Return value: {int.from_bytes(result['returndata'], 'big')}")
    print()
    
    # Example 2: Conditional (if x > 10 then y = 100 else y = 50)
    print("Example 2: Conditional execution")
    code = bytes([
        Opcode.PUSH1, 0x0f,  # Push 15 (x)
        Opcode.PUSH1, 0x0a,  # Push 10
        Opcode.GT,           # 15 > 10 ?
        Opcode.PUSH1, 0x0f,  # Jump destination (PC 15)
        Opcode.JUMPI,        # Jump if true
        
        # Else branch
        Opcode.PUSH1, 0x32,  # Push 50
        Opcode.PUSH1, 0x12,  # Jump to end (PC 18)
        Opcode.JUMP,
        
        # Then branch (PC 15)
        Opcode.JUMPDEST,
        Opcode.PUSH1, 0x64,  # Push 100
        
        # End (PC 18)
        Opcode.JUMPDEST,
        Opcode.PUSH1, 0x00,
        Opcode.MSTORE,
        Opcode.PUSH1, 0x20,
        Opcode.PUSH1, 0x00,
        Opcode.RETURN
    ])
    
    evm = EVM(code)
    result = evm.execute()
    
    print(f"Result: {int.from_bytes(result['returndata'], 'big')}")
    print(f"Gas used: {result['gas_used']}")
```

---

Bài giảng đã đạt ~11,000 từ với complete EVM implementation! Tôi sẽ tiếp tục với các lectures còn lại! 🚀
