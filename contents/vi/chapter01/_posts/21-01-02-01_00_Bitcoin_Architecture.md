---
layout: post
title: "Lecture 01.00: Bitcoin Architecture - Hệ thống tiền điện tử phi tập trung đầu tiên"
chapter: '01'
order: 1
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter01
---

# Lecture: Bitcoin Architecture - Hệ thống tiền điện tử phi tập trung đầu tiên

## 1. Tổng quan về khái niệm

Vào ngày 31 tháng 10 năm 2008, giữa cuộc khủng hoảng tài chính toàn cầu, một người (hoặc nhóm người) ẩn danh với bút danh **Satoshi Nakamoto** đã publish một whitepaper có tiêu đề "Bitcoin: A Peer-to-Peer Electronic Cash System" lên mailing list về mật mã học. Chín trang giấy này đã thay đổi lịch sử công nghệ và tài chính mãi mãi.

Bitcoin không chỉ là một loại tiền điện tử - nó là **first successful implementation** của một hệ thống thanh toán điện tử phi tập trung, giải quyết vấn đề double-spending mà không cần bên thứ ba tin cậy. Trước Bitcoin, mọi nỗ lực tạo ra digital cash đều thất bại vì một trong hai lý do:
1. Phụ thuộc vào central authority (e-gold, DigiCash) - có thể bị đóng cửa
2. Không giải quyết được double-spending trong môi trường phân tán

Bitcoin elegant solution kết hợp nhiều công nghệ đã tồn tại (cryptographic hashing, digital signatures, peer-to-peer networks, consensus mechanisms) theo một cách hoàn toàn mới:

**Core Innovation - Nakamoto Consensus**:
Thay vì dựa vào một central server để prevent double-spending, Bitcoin sử dụng:
- **Blockchain**: Một public ledger chứa toàn bộ transaction history
- **Proof-of-Work**: Một lottery-based consensus mechanism đảm bảo nodes đồng ý về transaction order
- **Economic Incentives**: Miners được reward bằng newly created bitcoin và transaction fees
- **Cryptographic Security**: Digital signatures đảm bảo chỉ owner của coins mới có thể spend

**Bitcoin's Design Goals** (theo whitepaper):
1. **Peer-to-peer**: Direct transactions không cần intermediary
2. **Decentralized**: Không có central point of control hoặc failure
3. **Trustless**: Không cần trust bất kỳ party nào
4. **Censorship-resistant**: Không ai có thể block transactions
5. **Limited supply**: Tối đa 21 million bitcoins
6. **Pseudonymous**: Transactions không trực tiếp linked với real-world identities

**Historical Context**:

Bitcoin không xuất hiện trong chân không. Nó xây dựng trên decades of research:

**Cypherpunk Movement** (1990s):
- Nhóm cryptographers và activists ủng hộ privacy-enhancing technologies
- Mailing list discussions về digital cash
- Notable members: Adam Back, Nick Szabo, Hal Finney

**Previous Digital Cash Attempts**:
- **DigiCash (1990)**: David Chaum's company, centralized, failed 1998
- **b-money (1998)**: Wei Dai's proposal, theoretical only
- **Bit Gold (2005)**: Nick Szabo's proposal, never implemented
- **Hashcash (1997)**: Adam Back's proof-of-work system (Bitcoin precursor)

**Bitcoin Timeline**:
- **Oct 31, 2008**: Whitepaper published
- **Jan 3, 2009**: Genesis block mined (block 0)
  - Embedded message: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
  - Comment on financial crisis và central banking
- **Jan 12, 2009**: First transaction (Satoshi → Hal Finney, 10 BTC)
- **May 22, 2010**: First real-world transaction (10,000 BTC for 2 pizzas, ~$41)
- **Dec 2010**: Satoshi disappears from public
- **2011-present**: Bitcoin ecosystem grows exponentially

**Impact**:
- Market cap: >$500 billion (2024)
- Spawned thousands of altcoins
- Catalyzed blockchain research
- Influenced monetary policy discussions
- Created entirely new industry

---

## 2. Hiểu biết trực quan

### 2.1. Bitcoin như một "Digital Gold"

Bitcoin thường được gọi là "digital gold" - hãy so sánh:

**Gold (Vàng)**:
- Scarce: Khó tìm và khai thác
- Durable: Không bị phá hủy theo thời gian
- Divisible: Có thể chia nhỏ
- Fungible: Mỗi gram vàng = mỗi gram vàng khác
- Valuable: Được công nhận globally
- Physical: Cần storage và transport

**Bitcoin**:
- Scarce: Chỉ 21 million coins, hard-coded
- Durable: Tồn tại miễn blockchain còn tồn tại
- Divisible: Chia được đến 8 decimal places (0.00000001 BTC = 1 satoshi)
- Fungible: Mỗi BTC = mỗi BTC khác (về mặt kỹ thuật)
- Valuable: Được công nhận bởi millions of users
- Digital: Chỉ cần internet connection

### 2.2. How Bitcoin Works - Simple Analogy

Tưởng tượng Bitcoin như một **public town square với một cuốn sổ khổng lồ**:

**The Ledger (Blockchain)**:
- Một cuốn sổ công khai nằm ở giữa quảng trường
- Ai cũng có thể đọc toàn bộ lịch sử
- Mỗi trang (block) chứa ~2000 transactions
- Mỗi trang được "seal" với special code (hash)

**The Miners (Network Nodes)**:
- Hàng nghìn người đứng xung quanh quảng trường
- Họ compete để được viết trang tiếp theo vào sổ
- Phải giải một puzzle toán học cực khó (Proof-of-Work)
- Người đầu tiên giải được puzzle:
  - Được viết trang mới
  - Nhận reward (6.25 BTC hiện tại + fees)
  - Everyone else verifies và accepts

**Transactions (Chuyển tiền)**:
```
Alice muốn gửi 1 BTC cho Bob:

1. Alice broadcast: "I, Alice, send 1 BTC to Bob"
   - Ký bằng digital signature (chỉ Alice có thể tạo)

2. Miners nhặt transaction lên
   - Verify signature: "This really from Alice?"
   - Check balance: "Does Alice have 1 BTC?"

3. Miners đưa transaction vào block mới
   - Compete to solve puzzle
   - Winner broadcasts block

4. Other nodes verify và accept
   - Transaction now confirmed!
   - Bob có thể spend 1 BTC
```

**Security Through Work**:
- Để thay đổi history (cheat), attacker phải:
  1. Rewrite block chứa transaction đó
  2. Rewrite ALL blocks after đó (vì chúng linked)
  3. Làm faster than toàn bộ honest network combined
- Với hàng nghìn miners, virtually impossible!

### 2.3. UTXO Model - "Digital Cash Chips"

Bitcoin không dùng "account balances" như bank. Thay vào đó, dùng **UTXO (Unspent Transaction Output)** model - giống như cash chips:

**Bank Account Model** (NOT Bitcoin):
```
Alice's account: $100
Transfer $30 to Bob
Alice's account: $70
Bob's account: $30
```

**UTXO Model** (Bitcoin):
```
Alice có: [50 BTC chip] [30 BTC chip] [20 BTC chip]
Total: 100 BTC

Alice muốn gửi 60 BTC cho Bob:
1. Grab [50 BTC] và [30 BTC] chips (total 80 BTC)
2. Create new transaction:
   Inputs:  [50 BTC] + [30 BTC] = 80 BTC
   Outputs: [60 BTC → Bob]
            [19.99 BTC → Alice] (change)
            [0.01 BTC → Miner] (fee)
3. Destroy old chips [50] and [30]
4. Create new chips [60] and [19.99]

Result:
Alice có: [20 BTC] [19.99 BTC] = 39.99 BTC
Bob có: [60 BTC] = 60 BTC
```

**Advantages**:
- Better privacy (không có single "account")
- Parallel processing (different UTXOs processed independently)
- Simpler to verify (each UTXO spent exactly once)

---

## 3. Nền tảng kỹ thuật

### 3.1. Bitcoin Network Architecture

Bitcoin là một **peer-to-peer network** với multiple types of nodes:

**Node Types**:

1. **Full Nodes** (~10,000-15,000 active):
   - Store complete blockchain (~500 GB)
   - Validate all transactions và blocks
   - Relay transactions và blocks
   - Enforce consensus rules
   - Can independently verify entire history

2. **Mining Nodes** (subset of full nodes):
   - Full node capabilities +
   - Solve Proof-of-Work puzzle
   - Create new blocks
   - Receive block rewards

3. **Light Nodes (SPV - Simplified Payment Verification)**:
   - Store only block headers (~100 MB)
   - Cannot fully validate transactions
   - Trust full nodes for validation
   - Good for mobile wallets

4. **Archive Nodes**:
   - Full nodes + complete UTXO set history
   - Required for blockchain explorers
   - ~1 TB+ storage

**Network Communication**:

```
         Internet
            │
    ┌───────┴───────┐
    │               │
 Node A          Node B
    │               │
    └───────┬───────┘
            │
         Node C
            │
    ┌───────┴───────┐
    │               │
 Node D          Node E
```

**Gossip Protocol**:
- Mỗi node connect với 8-125 peers
- New transactions broadcast đến all peers
- Peers forward đến their peers
- Exponential propagation (~7 seconds to reach 95% network)

### 3.2. Bitcoin Transaction Structure

**Transaction Components**:

```
Transaction
├── Version (4 bytes)
├── Input Count (variable)
├── Inputs (variable)
│   ├── Previous TXID (32 bytes) - Reference to previous transaction
│   ├── Output Index (4 bytes) - Which output of previous tx
│   ├── ScriptSig (variable) - Signature và public key
│   └── Sequence (4 bytes)
├── Output Count (variable)
├── Outputs (variable)
│   ├── Amount (8 bytes) - In satoshis
│   └── ScriptPubKey (variable) - Locking script
└── Locktime (4 bytes)
```

**Example Transaction**:

```json
{
  "txid": "a1b2c3d4e5f6...",
  "version": 1,
  "locktime": 0,
  "vin": [
    {
      "txid": "previous_tx_id",
      "vout": 0,
      "scriptSig": {
        "asm": "3045... 0279...",
        "hex": "483045..."
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.5,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 ab68025513...",
        "hex": "76a914ab68...",
        "type": "pubkeyhash",
        "address": "1GdK9UzpHBzqzX2A9JFP3Di4weBwqgmoQA"
      }
    }
  ]
}
```

### 3.3. Bitcoin Script Language

Bitcoin sử dụng **Script** - một stack-based, non-Turing-complete programming language để define spending conditions.

**Why Non-Turing-Complete?**
- Prevents infinite loops
- Guarantees termination
- Makes resource estimation possible

**Common Script Types**:

**1. Pay-to-Public-Key-Hash (P2PKH)** - Standard transaction:

```
ScriptPubKey (Locking Script):
OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG

ScriptSig (Unlocking Script):
<Signature> <PubKey>

Combined execution:
<Signature> <PubKey> OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

**Execution Steps**:
```
Stack:                  Operation:
[]                      <Signature> pushed
[Sig]                   <PubKey> pushed
[Sig, PubKey]           OP_DUP (duplicate top)
[Sig, PubKey, PubKey]   OP_HASH160 (hash top)
[Sig, PubKey, Hash]     <PubKeyHash> pushed
[Sig, PubKey, Hash, PKH] OP_EQUALVERIFY (check equal)
[Sig, PubKey]           OP_CHECKSIG (verify signature)
[1]                     Success!
```

**2. Pay-to-Script-Hash (P2SH)** - Multi-signature:

```
ScriptPubKey: OP_HASH160 <RedeemScriptHash> OP_EQUAL
ScriptSig: <Sig1> <Sig2> ... <RedeemScript>
```

**3. Pay-to-Witness-Public-Key-Hash (P2WPKH)** - SegWit:

```
ScriptPubKey: OP_0 <PubKeyHash>
Witness: <Signature> <PubKey>
```

### 3.4. Block Structure

**Block Components**:

```
Block
├── Block Header (80 bytes)
│   ├── Version (4 bytes)
│   ├── Previous Block Hash (32 bytes)
│   ├── Merkle Root (32 bytes)
│   ├── Timestamp (4 bytes)
│   ├── Difficulty Target (4 bytes)
│   └── Nonce (4 bytes)
└── Transaction Data (variable, ~1-2 MB)
    ├── Transaction Count (variable)
    └── Transactions (variable)
```

**Block Header Breakdown**:

```
Version:           00000020 (hex) = 32 (decimal)
Previous Hash:     000000000000000000041fe...
Merkle Root:       7f16c5962e8bd963659c793...
Timestamp:         5e7e5e5e (hex) = 2020-03-27 12:34:06 UTC
Bits (Difficulty): 171007ea
Nonce:             282c7f00 (hex) = 673668864 (decimal)
```

**Genesis Block** (Block 0):
```
{
  "hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
  "timestamp": "2009-01-03 18:15:05",
  "nonce": 2083236893,
  "difficulty": 1,
  "coinbase": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
}
```

### 3.5. UTXO Set

**Global State**:
Bitcoin's state = set của tất cả unspent transaction outputs (UTXOs)

**UTXO Entry**:
```
UTXO = {
  txid: transaction ID,
  vout: output index,
  amount: value in satoshis,
  scriptPubKey: spending condition,
  height: block height created
}
```

**UTXO Set Statistics** (2024):
- Total UTXOs: ~80-100 million
- Total size: ~5-6 GB
- Total value: ~19.5 million BTC

**Performance**:
- Full nodes maintain UTXO set in memory (fast lookups)
- Validating transaction = checking inputs exist in UTXO set
- Adding block:
  - Remove spent UTXOs (inputs)
  - Add new UTXOs (outputs)

---

## 4. Công thức toán học và mật mã học

### 4.1. Bitcoin Address Generation

**Full Process**:

\[
\begin{align}
\text{Private Key} &\xrightarrow{\text{random}} k \in [1, n-1] \\
\text{Public Key} &= k \times G = (x, y) \\
\text{Compressed PubKey} &= \begin{cases}
\text{0x02} || x & \text{if } y \text{ even} \\
\text{0x03} || x & \text{if } y \text{ odd}
\end{cases} \\
\text{PubKey Hash} &= \text{RIPEMD160}(\text{SHA256}(\text{PubKey})) \\
\text{Versioned Hash} &= \text{0x00} || \text{PubKey Hash} \\
\text{Checksum} &= \text{SHA256}(\text{SHA256}(\text{Versioned Hash}))[:4] \\
\text{Address Bytes} &= \text{Versioned Hash} || \text{Checksum} \\
\text{Bitcoin Address} &= \text{Base58}(\text{Address Bytes})
\end{align}
\]

**Example**:
```
Private Key (hex):
  18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725

Public Key (uncompressed):
  04 50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
     2cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6

Public Key Hash (RIPEMD160 of SHA256):
  010966776006953d5567439e5e39f86a0d273bee

Address (Base58Check):
  16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM
```

### 4.2. Difficulty Adjustment

Bitcoin adjusts mining difficulty mỗi 2016 blocks (~2 weeks) để maintain 10-minute block time.

**Formula**:

\[
\text{New Difficulty} = \text{Old Difficulty} \times \frac{\text{2 weeks}}{\text{Actual Time}}
\]

More precisely:

\[
\text{New Target} = \text{Old Target} \times \frac{\text{Actual Time (2016 blocks)}}{\text{Expected Time (20160 minutes)}}
\]

**Constraints**:
- Maximum adjustment: 4x per period (up or down)
- Minimum difficulty: 1 (genesis block)
- Maximum target: 0x00000000FFFF0000000000000000000000000000000000000000000000000000

**Example Calculation**:
```
Old Difficulty: 20,000,000,000,000
2016 blocks took: 14 days = 20,160 minutes (exactly on target!)

New Difficulty = 20,000,000,000,000 × (20,160 / 20,160) = 20,000,000,000,000 (no change)

If blocks came faster (12 days):
New Difficulty = 20,000,000,000,000 × (20,160 / 17,280) = 23,333,333,333,333 (harder)
```

### 4.3. Block Reward và Supply

**Block Subsidy** (coinbase reward):

\[
\text{Subsidy}(h) = \frac{50 \text{ BTC}}{2^{\lfloor h / 210000 \rfloor}}
\]

Where \( h \) = block height

**Halving Schedule**:
```
Blocks 0 - 209,999:        50 BTC per block
Blocks 210,000 - 419,999:  25 BTC per block
Blocks 420,000 - 629,999:  12.5 BTC per block
Blocks 630,000 - 839,999:  6.25 BTC per block (current, 2024)
Blocks 840,000 - 1,049,999: 3.125 BTC per block (next halving ~2024)
...
After 64 halvings: 0 BTC (around year 2140)
```

**Total Supply**:

\[
\text{Total BTC} = \sum_{i=0}^{63} 210000 \times \frac{50}{2^i} = 21,000,000 \text{ BTC}
\]

**Derivation**:
\[
\begin{align}
S &= 210000 \times 50 \times \left(1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \cdots \right) \\
&= 210000 \times 50 \times \frac{1}{1 - 1/2} \\
&= 210000 \times 50 \times 2 \\
&= 21,000,000
\end{align}
\]

**Actual Supply** (slightly less):
- Due to lost coins
- Mining bugs (some miners didn't claim full reward)
- Estimated circulating: ~19.5 million BTC (2024)

### 4.4. Transaction Fees

**Fee Calculation**:

\[
\text{Fee} = \sum \text{Inputs} - \sum \text{Outputs}
\]

**Fee Rate**:

\[
\text{Fee Rate} = \frac{\text{Fee}}{\text{Transaction Size (bytes)}} \quad (\text{sat/vByte})
\]

**SegWit Virtual Size**:

\[
\text{vSize} = \frac{\text{Base Size} \times 3 + \text{Total Size}}{4}
\]

**Economic Model**:
- Users bid fees để get prioritized
- Miners select highest fee/byte transactions
- Fee market emerges naturally
- High congestion → high fees

**Historical Fees**:
- 2010-2016: ~0.0001 BTC (~$0.01)
- 2017 peak: ~$50 per transaction
- 2021 peak: ~$60 per transaction
- 2024 average: ~$1-5 per transaction

---

## 5. Implementation Insight

### 5.1. Simple Bitcoin Transaction (Python)

```python
import hashlib
import ecdsa
from typing import List, Tuple

class BitcoinTransaction:
    def __init__(self):
        self.version = 1
        self.inputs: List[dict] = []
        self.outputs: List[dict] = []
        self.locktime = 0
    
    def add_input(self, prev_txid: str, prev_index: int, 
                  scriptPubKey: bytes, amount: int):
        """Add input (UTXO to spend)"""
        self.inputs.append({
            'prev_txid': bytes.fromhex(prev_txid),
            'prev_index': prev_index,
            'scriptPubKey': scriptPubKey,
            'amount': amount,
            'scriptSig': b''
        })
    
    def add_output(self, address: str, amount: int):
        """Add output (new UTXO)"""
        # Create P2PKH scriptPubKey
        pubkey_hash = self.address_to_pubkey_hash(address)
        scriptPubKey = (
            b'\x76' +  # OP_DUP
            b'\xa9' +  # OP_HASH160
            b'\x14' +  # Push 20 bytes
            pubkey_hash +
            b'\x88' +  # OP_EQUALVERIFY
            b'\xac'    # OP_CHECKSIG
        )
        
        self.outputs.append({
            'amount': amount,
            'scriptPubKey': scriptPubKey
        })
    
    @staticmethod
    def address_to_pubkey_hash(address: str) -> bytes:
        """Decode Bitcoin address to get pubkey hash"""
        # Base58 decode (simplified)
        # In production, use proper Base58Check
        import base58
        decoded = base58.b58decode_check(address)
        return decoded[1:]  # Skip version byte
    
    def serialize_for_signing(self, input_index: int) -> bytes:
        """Serialize transaction for signing"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Input count
        result += self.var_int(len(self.inputs))
        
        # Inputs
        for i, inp in enumerate(self.inputs):
            result += inp['prev_txid'][::-1]  # Little-endian
            result += inp['prev_index'].to_bytes(4, 'little')
            
            # Include scriptPubKey for input being signed
            if i == input_index:
                script = inp['scriptPubKey']
                result += self.var_int(len(script))
                result += script
            else:
                result += b'\x00'  # Empty script
            
            result += (0xFFFFFFFF).to_bytes(4, 'little')  # Sequence
        
        # Output count
        result += self.var_int(len(self.outputs))
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            result += self.var_int(len(out['scriptPubKey']))
            result += out['scriptPubKey']
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        # Hash type (SIGHASH_ALL)
        result += (1).to_bytes(4, 'little')
        
        return result
    
    @staticmethod
    def var_int(n: int) -> bytes:
        """Variable-length integer encoding"""
        if n < 0xfd:
            return bytes([n])
        elif n <= 0xffff:
            return b'\xfd' + n.to_bytes(2, 'little')
        elif n <= 0xffffffff:
            return b'\xfe' + n.to_bytes(4, 'little')
        else:
            return b'\xff' + n.to_bytes(8, 'little')
    
    def sign_input(self, input_index: int, private_key_hex: str):
        """Sign input with private key"""
        # Get private key
        private_key = bytes.fromhex(private_key_hex)
        sk = ecdsa.SigningKey.from_string(private_key, curve=ecdsa.SECP256k1)
        
        # Serialize for signing
        preimage = self.serialize_for_signing(input_index)
        
        # Double SHA-256
        sighash = hashlib.sha256(hashlib.sha256(preimage).digest()).digest()
        
        # Sign
        signature = sk.sign_digest(sighash, sigencode=ecdsa.util.sigencode_der)
        signature += b'\x01'  # SIGHASH_ALL
        
        # Get public key
        vk = sk.get_verifying_key()
        public_key = b'\x04' + vk.to_string()  # Uncompressed
        
        # Create scriptSig
        scriptSig = (
            self.var_int(len(signature)) + signature +
            self.var_int(len(public_key)) + public_key
        )
        
        self.inputs[input_index]['scriptSig'] = scriptSig
    
    def serialize(self) -> bytes:
        """Serialize complete signed transaction"""
        result = b''
        
        # Version
        result += self.version.to_bytes(4, 'little')
        
        # Input count
        result += self.var_int(len(self.inputs))
        
        # Inputs
        for inp in self.inputs:
            result += inp['prev_txid'][::-1]
            result += inp['prev_index'].to_bytes(4, 'little')
            result += self.var_int(len(inp['scriptSig']))
            result += inp['scriptSig']
            result += (0xFFFFFFFF).to_bytes(4, 'little')
        
        # Output count
        result += self.var_int(len(self.outputs))
        
        # Outputs
        for out in self.outputs:
            result += out['amount'].to_bytes(8, 'little')
            result += self.var_int(len(out['scriptPubKey']))
            result += out['scriptPubKey']
        
        # Locktime
        result += self.locktime.to_bytes(4, 'little')
        
        return result
    
    def get_txid(self) -> str:
        """Calculate transaction ID"""
        serialized = self.serialize()
        hash_result = hashlib.sha256(hashlib.sha256(serialized).digest()).digest()
        return hash_result[::-1].hex()  # Little-endian

# Example usage
if __name__ == "__main__":
    print("=== Bitcoin Transaction Example ===\n")
    
    # Create transaction
    tx = BitcoinTransaction()
    
    # Add input (spending previous output)
    prev_txid = "a1b2c3d4" * 16  # Example TXID
    scriptPubKey = bytes.fromhex("76a914" + "00" * 20 + "88ac")  # P2PKH
    tx.add_input(prev_txid, 0, scriptPubKey, 100000000)  # 1 BTC in satoshis
    
    # Add outputs
    tx.add_output("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", 50000000)  # 0.5 BTC to Bob
    tx.add_output("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", 49900000)  # 0.499 BTC change
    # Fee: 0.001 BTC (100,000 satoshis)
    
    # Sign (use your own private key in production!)
    private_key = "18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725"
    tx.sign_input(0, private_key)
    
    # Serialize
    raw_tx = tx.serialize()
    txid = tx.get_txid()
    
    print(f"Transaction ID: {txid}")
    print(f"Raw transaction: {raw_tx.hex()[:100]}...")
    print(f"Size: {len(raw_tx)} bytes")
    print(f"Fee rate: {100000 / len(raw_tx):.2f} sat/byte")
```

### 5.2. UTXO Set Management

```python
from typing import Dict, Set, Tuple

class UTXOSet:
    def __init__(self):
        # UTXO set: (txid, vout) -> (amount, scriptPubKey, height)
        self.utxos: Dict[Tuple[str, int], Tuple[int, bytes, int]] = {}
        self.total_supply = 0
    
    def add_utxo(self, txid: str, vout: int, amount: int, 
                 scriptPubKey: bytes, height: int):
        """Add new UTXO"""
        key = (txid, vout)
        if key in self.utxos:
            raise ValueError(f"UTXO {txid}:{vout} already exists!")
        
        self.utxos[key] = (amount, scriptPubKey, height)
        self.total_supply += amount
        
        print(f"+ Added UTXO: {txid[:8]}...:{vout} = {amount/1e8:.8f} BTC")
    
    def spend_utxo(self, txid: str, vout: int) -> Tuple[int, bytes]:
        """Spend (remove) UTXO"""
        key = (txid, vout)
        if key not in self.utxos:
            raise ValueError(f"UTXO {txid}:{vout} not found!")
        
        amount, scriptPubKey, height = self.utxos[key]
        del self.utxos[key]
        self.total_supply -= amount
        
        print(f"- Spent UTXO: {txid[:8]}...:{vout} = {amount/1e8:.8f} BTC")
        return amount, scriptPubKey
    
    def get_balance(self, address: str) -> int:
        """Get total balance for address"""
        # Simplified: check scriptPubKey contains address hash
        total = 0
        for (txid, vout), (amount, scriptPubKey, height) in self.utxos.items():
            # In production: properly decode scriptPubKey
            total += amount
        return total
    
    def apply_transaction(self, tx: dict, block_height: int):
        """Apply transaction to UTXO set"""
        txid = tx['txid']
        
        # Spend inputs
        total_input = 0
        for inp in tx['inputs']:
            amount, scriptPubKey = self.spend_utxo(
                inp['prev_txid'],
                inp['prev_index']
            )
            total_input += amount
        
        # Create outputs
        total_output = 0
        for i, out in enumerate(tx['outputs']):
            self.add_utxo(
                txid, i,
                out['amount'],
                out['scriptPubKey'],
                block_height
            )
            total_output += out['amount']
        
        # Verify fee
        fee = total_input - total_output
        print(f"Transaction fee: {fee/1e8:.8f} BTC")
        
        if fee < 0:
            raise ValueError("Negative fee! Transaction invalid.")
        
        return fee
    
    def get_stats(self) -> dict:
        """Get UTXO set statistics"""
        return {
            'utxo_count': len(self.utxos),
            'total_supply': self.total_supply / 1e8,  # BTC
            'avg_utxo_size': self.total_supply / len(self.utxos) if self.utxos else 0
        }

# Example
if __name__ == "__main__":
    print("=== UTXO Set Management Example ===\n")
    
    utxo_set = UTXOSet()
    
    # Genesis coinbase (block reward)
    utxo_set.add_utxo(
        "genesis_tx_id", 0,
        5000000000,  # 50 BTC
        b'scriptPubKey_alice',
        0
    )
    
    print(f"\nStats: {utxo_set.get_stats()}\n")
    
    # Alice sends 30 BTC to Bob
    tx1 = {
        'txid': 'tx1_id',
        'inputs': [
            {'prev_txid': 'genesis_tx_id', 'prev_index': 0}
        ],
        'outputs': [
            {'amount': 3000000000, 'scriptPubKey': b'scriptPubKey_bob'},  # 30 BTC to Bob
            {'amount': 1999000000, 'scriptPubKey': b'scriptPubKey_alice'}  # 19.99 BTC change
        ]
    }
    
    print("\nProcessing transaction 1...")
    fee1 = utxo_set.apply_transaction(tx1, 1)
    
    print(f"\nStats: {utxo_set.get_stats()}")
```

---

*[Tiếp tục với phần 6-10 trong response tiếp theo do giới hạn độ dài]*

## 6. Các thách thức và đánh đổi thường gặp

### 6.1. Scalability - The Biggest Challenge

**Problem**: Bitcoin có thể process ~7 transactions/second (TPS)

**Comparison**:
- Visa: ~24,000 TPS
- Mastercard: ~5,000 TPS  
- PayPal: ~193 TPS
- Bitcoin: ~7 TPS
- Ethereum: ~15 TPS

**Why So Slow?**
1. **Block size limit**: 1 MB (legacy), ~4 MB (SegWit)
2. **Block time**: 10 minutes average
3. **Broadcast overhead**: All nodes must receive và validate

**Calculation**:
\[
\text{TPS} = \frac{\text{Block Size}}{\text{Avg TX Size} \times \text{Block Time}} = \frac{1 \text{ MB}}{250 \text{ bytes} \times 600 \text{ sec}} \approx 7 \text{ TPS}
\]

**Scaling Debates**:
- **Big blocks**: Increase block size (Bitcoin Cash approach)
  - Pro: More transactions per block
  - Con: Centralization (fewer can run full nodes)
  
- **Layer 2**: Off-chain solutions (Lightning Network)
  - Pro: Thousands of TPS, instant, low fees
  - Con: Complexity, need to lock funds

- **SegWit**: Separate signature data
  - Pro: Effective block size increase, fix malleability
  - Con: Not all wallets support

### 6.2. Energy Consumption

**Current Statistics** (2024):
- Bitcoin network: ~150 TWh/year
- Comparable to: Argentina's total energy consumption
- Per transaction: ~700 kWh
- Carbon footprint: ~65 Mt CO2/year

**Arguments Pro**:
- Secures $500B+ network
- Incentivizes renewable energy (miners seek cheap power)
- Much energy from stranded/wasted sources
- Banking system uses more energy overall

**Arguments Con**:
- Environmental impact
- E-waste from obsolete ASICs
- Could use more efficient consensus (PoS)

**Future**:
- Shift to renewable energy (already ~50%+)
- More efficient mining hardware
- Layer 2 solutions reduce on-chain transactions

### 6.3. Privacy Limitations

**Pseudonymity ≠ Anonymity**:
- All transactions public
- Address clustering: Link multiple addresses to same entity
- Chain analysis firms (Chainalysis, Elliptic)
- Exchange KYC links addresses to real identities

**Example Attack**:
```
Alice withdraws from exchange (KYC'd address known)
  → Address A (identity linked)
  → Sends to Address B
  → Sends to Address C
  → ...

Chain analysis can trace entire flow!
```

**Privacy Improvements**:
- **CoinJoin**: Multiple users combine transactions
- **Lightning Network**: Off-chain, more private
- **Taproot**: Makes different transaction types look similar

### 6.4. 51% Attack Resistance

**Attack Cost** (2024):
- Total network hash rate: ~600 EH/s
- Cost to acquire 51%: ~$10-20 billion in hardware
- Operating cost: ~$1 million/hour in electricity

**Why Attack Is Irrational**:
1. Huge upfront cost
2. Attack would crash BTC price → attacker loses money
3. Can only double-spend own transactions (can't steal others' BTC)
4. Community would hard fork away → hardware becomes worthless

**Historical Near-Misses**:
- 2014: GHash.io mining pool briefly exceeded 50%
- Community pressure → pool voluntarily reduced share
- Now: Top 4 pools ~55%, but pools ≠ pool members

### 6.5. Lost Coins

**Estimated Lost**: 3-4 million BTC (~20% of supply)

**Reasons**:
- Lost private keys
- Forgotten passwords
- Dead owners without backup
- Sending to wrong address (no undo!)
- Intentional burning (proof-of-burn)

**Famous Cases**:
- **James Howells**: 7,500 BTC on hard drive in landfill (~$300M at peak)
- **Stefan Thomas**: 7,002 BTC, forgot password, 2 guesses remaining
- **Satoshi's coins**: ~1 million BTC, never moved

**Economic Impact**:
- Reduces effective supply
- Increases scarcity
- Deflation over time

---

## 7. Các khái niệm liên quan

### 7.1. Bitcoin Forks

**Soft Fork**: Backward-compatible protocol change
- Old nodes accept blocks từ new nodes
- Examples: SegWit, Taproot

**Hard Fork**: Non-backward-compatible change
- Requires all nodes upgrade
- Can split blockchain
- Examples: Bitcoin Cash, Bitcoin SV

**Major Forks**:
```
Bitcoin (BTC)
    ├── Bitcoin Cash (BCH) - 2017, 8MB blocks
    │   └── Bitcoin SV (BSV) - 2018, 128MB blocks
    ├── Bitcoin Gold (BTG) - 2017, ASIC-resistant
    └── Bitcoin Diamond (BCD) - 2017, 8MB blocks
```

### 7.2. Lightning Network (Layer 2)

**Concept**: Off-chain payment channels

**How It Works**:
```
1. Alice và Bob open channel:
   - Both deposit funds in 2-of-2 multisig on-chain

2. Transact off-chain:
   - Update channel state (signed by both)
   - Thousands of transactions
   - Instant, near-zero fees

3. Close channel:
   - Final state broadcast on-chain
   - Both receive their final balances
```

**Routing**:
- Multi-hop payments through network
- Alice → Bob → Charlie → David
- Onion routing for privacy

**Trade-offs**:
- Pro: Fast, cheap, scalable
- Con: Need to lock funds, complexity, must be online

### 7.3. Taproot Upgrade (2021)

**Improvements**:
1. **Schnorr Signatures**: Replace ECDSA
   - Smaller signatures
   - Batch verification
   - Key aggregation

2. **MAST** (Merklized Abstract Syntax Trees):
   - Complex smart contracts
   - Only reveal executed path
   - Better privacy

3. **Better Privacy**:
   - Multi-sig looks like single-sig
   - Complex scripts look like simple payments

### 7.4. Colored Coins & Tokens

**Concept**: Represent other assets on Bitcoin blockchain

**Methods**:
- **OP_RETURN**: Embed data in transactions (80 bytes)
- **RGB Protocol**: Client-side validation
- **Taro**: Taproot-based assets

**Use Cases**:
- Stablecoins
- NFTs
- Securities
- Loyalty points

### 7.5. BIPs (Bitcoin Improvement Proposals)

**Important BIPs**:
- **BIP 32**: HD Wallets (Hierarchical Deterministic)
- **BIP 39**: Mnemonic seed phrases (12/24 words)
- **BIP 44**: Multi-account HD wallet structure
- **BIP 141**: SegWit
- **BIP 340-342**: Taproot

---

## 8. ⭐ Các bài báo và whitepaper nền tảng

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"Bitcoin: A Peer-to-Peer Electronic Cash System"** | 2008 | Satoshi Nakamoto | Original whitepaper - foundation of Bitcoin |
| **"Hashcash - A Denial of Service Counter-Measure"** | 2002 | Adam Back | Proof-of-work precursor |
| **"B-Money"** | 1998 | Wei Dai | Conceptual cryptocurrency design |
| **"Bit Gold"** | 2005 | Nick Szabo | Precursor to Bitcoin |
| **"Enabling Blockchain Innovations with Pegged Sidechains"** | 2014 | Back et al. | Sidechain concept |
| **"The Bitcoin Backbone Protocol"** | 2015 | Garay, Kiayias, Leonardos | Formal security analysis |
| **"Analysis of the Blockchain Protocol in Asynchronous Networks"** | 2016 | Pass, Seeman, Shelat | Asynchronous security |
| **"The Bitcoin Lightning Network"** | 2016 | Poon, Dryja | Layer 2 scaling |
| **"Segregated Witness (BIP 141)"** | 2015 | Wuille et al. | SegWit specification |
| **"Schnorr Signatures for secp256k1 (BIP 340)"** | 2020 | Wuille, Nick, Ruffing | Taproot foundation |

**Essential Reading Order**:
1. Bitcoin whitepaper (must-read, 9 pages)
2. Hashcash paper (understand PoW origins)
3. Bitcoin Backbone Protocol (formal security)
4. Lightning Network paper (understand Layer 2)
5. BIP 141, 340-342 (modern improvements)

---

## 9. 🎨 Minh họa và tham khảo hình ảnh

| Description | Source | Notes |
|-------------|--------|-------|
| **Bitcoin transaction flow** | [Bitcoin.org Developer Guide](https://bitcoin.org/en/developer-guide) | Official documentation |
| **Block structure diagram** | [Mastering Bitcoin Ch9](https://github.com/bitcoinbook/bitcoinbook) | Andreas Antonopoulos's book |
| **UTXO model visualization** | [Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/questions/49853) | Community explanations |
| **Mining process** | [Anders Brownworth Demo](https://andersbrownworth.com/blockchain/blockchain) | Interactive visualization |
| **Network topology** | [Bitnodes](https://bitnodes.io/) | Live network map |
| **Mempool visualization** | [Mempool.space](https://mempool.space/) | Real-time mempool |
| **Blockchain explorer** | [Blockchain.com](https://www.blockchain.com/explorer) | Explore transactions |
| **Lightning Network** | [1ML.com](https://1ml.com/) | LN network stats |

**Interactive Tools**:
- [Bitcoin Demo](https://andersbrownworth.com/blockchain/) - Best visual learning tool
- [Bitcoin Script Simulator](https://siminchen.github.io/bitcoinIDE/build/editor.html) - Script execution
- [Transaction Decoder](https://live.blockcypher.com/btc/decodetx/) - Decode raw transactions

---

## 10. Tóm tắt và điểm chính

**Core Concepts**:
1. Bitcoin là first successful decentralized digital currency
2. Giải quyết double-spending không cần trusted third party
3. Sử dụng Proof-of-Work consensus và economic incentives
4. UTXO model thay vì account balances

**Architecture Components**:
- **P2P Network**: Gossip protocol, ~15,000 nodes
- **Blockchain**: Append-only ledger, ~500 GB
- **Transactions**: Digital signatures, Script language
- **Mining**: Proof-of-Work, difficulty adjustment
- **Consensus**: Longest chain rule, economic security

**Key Innovations**:
- Nakamoto consensus: PoW + longest chain + incentives
- UTXO model: Parallel transaction processing
- Script: Programmable spending conditions
- Difficulty adjustment: Self-regulating security

**Limitations**:
- Scalability: ~7 TPS (being addressed via Layer 2)
- Energy: ~150 TWh/year (shift to renewables)
- Privacy: Pseudonymous not anonymous
- Finality: Probabilistic (6 confirmations standard)

**Future Developments**:
- Lightning Network: Off-chain scaling
- Taproot: Better privacy và smart contracts
- Quantum resistance: Long-term consideration
- Layer 2 innovations: Continuous improvement

**Key Takeaway**: Bitcoin proved that decentralized digital money is possible through cryptography, game theory, và distributed systems - creating a new asset class và inspiring thousands of blockchain projects.

---

✅ **End of Lecture 01.00**

**Next**: Lecture 01.01 - Proof-of-Work Deep Dive: Mining, Security, và Economics

---

## References

1. Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*.
2. Antonopoulos, A. M. (2017). *Mastering Bitcoin: Programming the Open Blockchain*. O'Reilly Media.
3. Narayanan, A., et al. (2016). *Bitcoin and Cryptocurrency Technologies*. Princeton University Press.
4. Garay, J., Kiayias, A., & Leonardos, N. (2015). *The bitcoin backbone protocol*. EUROCRYPT 2015.
5. Poon, J., & Dryja, T. (2016). *The Bitcoin Lightning Network*. White paper.
6. Bitcoin Developer Documentation: https://developer.bitcoin.org/

