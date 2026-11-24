---
layout: post
title: "Lecture 05.01: Zero-Knowledge Proofs - Prove Without Revealing"
chapter: '05'
order: 2
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Bài giảng 05.01: Chứng minh không tiết lộ thông tin (Zero-Knowledge Proofs)

Hãy tưởng tượng bạn cần chứng minh với toàn bộ mạng lưới blockchain rằng: *"Tôi thực sự sở hữu khóa bí mật của khoản tiền này và số dư sau giao dịch không bị âm"* — nhưng tuyệt đối **không được tiết lộ khóa bí mật, không tiết lộ số dư, thậm chí không tiết lộ bạn là ai**. Nghe tưởng như một nghịch lý logic bất khả thi, thế nhưng vào năm 1985, Goldwasser, Micali và Rackoff đã biến điều đó thành một nhánh toán học chấn động mang tên **Chứng minh Không Tiết lộ (Zero-Knowledge Proofs — ZKP)**.

Ngày nay, ZKP không còn nằm trong các hội nghị mật mã thuần túy: nó là động cơ đứng sau các giao dịch riêng tư (Zcash), các mạng mở rộng quy mô ZK-Rollup (Starknet, zkSync, Polygon zkEVM) và hệ thống xác thực danh tính số thế hệ mới.

---

## Bản đồ kiến thức nền: Chứng minh Không Tiết lộ (ZKP) dựa trên những trụ cột nào?

1. **Bộ ba tiên đề vàng:** Mọi hệ ZKP phải thỏa đồng thời **Tính đầy đủ** (người trung thực luôn thuyết phục được), **Tính vững chắc / Soundness** (kẻ gian không thể giả mạo bằng chứng trừ xác suất không đáng kể), và **Không tiết lộ / Zero-Knowledge** (người kiểm chứng không học thêm được 1 bit nào ngoài việc phát biểu là đúng).
2. **Số học hóa (Arithmetization — R1CS, QAP, AIR):** Biến một chương trình máy tính bất kỳ thành hệ phương trình đa thức trên trường hữu hạn $$\mathbb{F}_p$$ để có thể kiểm tra toàn bộ phép tính chỉ tại một điểm ngẫu nhiên (nhờ bổ đề Schwartz–Zippel).
3. **Biến đổi Fiat–Shamir:** Thay người kiểm chứng tương tác bằng một hàm băm mật mã sinh ra thử thách ngẫu nhiên, biến giao thức hỏi–đáp thành một **bằng chứng tĩnh ngắn gọn** có thể đưa lên blockchain.
4. **SNARK vs. STARK:** zk-SNARK dùng cam kết đường cong elliptic/pairing (bằng chứng siêu nhỏ vài trăm byte, nhưng đôi khi cần thiết lập tin cậy); zk-STARK chỉ dùng hàm băm & cây Merkle (bằng chứng lớn hơn nhưng minh bạch và kháng lượng tử).

---

## 1. Tổng quan về khái niệm

**Chứng minh không tiết lộ thông tin (Zero-Knowledge Proofs — ZKP)** là một trong những bước tiến quan trọng nhất của mật mã học và công nghệ blockchain. ZKP cho phép một bên (người chứng minh — prover) chứng minh với bên kia (người xác minh — verifier) rằng một mệnh đề là đúng **mà không tiết lộ bất kỳ thông tin nào ngoài tính đúng đắn của chính mệnh đề đó**.

**Ý tưởng cốt lõi của Zero-Knowledge**:

Giả sử bạn muốn chứng minh với ai đó rằng bạn biết một mật khẩu nhưng không muốn tiết lộ mật khẩu đó. Với chứng minh không tiết lộ thông tin, điều này hoàn toàn có thể thực hiện được:

```
Traditional Proof:
You: "I know the password"
Verifier: "Prove it"
You: "The password is: hunter2"
Verifier: "OK, I believe you"

Problem: Verifier now knows password too!

Zero-Knowledge Proof:
You: "I know the password"  
Verifier: "Prove it without telling me"
You: [Generates cryptographic proof]
Verifier: [Verifies proof] "OK, I believe you"

Result: Verifier convinced, but learned NOTHING about password!
```

**Định nghĩa hình thức** (Goldwasser, Micali, Rackoff, 1985):

Một hệ thống ZKP cho mệnh đề \( x \) phải thỏa mãn ba tính chất sau:

1. **Tính đầy đủ (Completeness)**: Nếu mệnh đề đúng, người chứng minh trung thực luôn có thể thuyết phục được người xác minh:
\[
P(\text{verifier accepts} | x \text{ is true}) = 1
\]

2. **Tính đúng đắn (Soundness)**: Nếu mệnh đề sai, không kẻ gian lận nào có thể thuyết phục được người xác minh (trừ xác suất không đáng kể):
\[
P(\text{verifier accepts} | x \text{ is false}) < \epsilon \quad \text{(negligible)}
\]

3. **Tính không tiết lộ thông tin (Zero-Knowledge)**: Người xác minh không thu được thông tin nào khác ngoài việc mệnh đề là đúng:
\[
\text{View}_{\text{verifier}} \stackrel{c}{\equiv} \text{Simulator output}
\]

Điều này có nghĩa là mọi thông tin mà người xác minh quan sát được đều có thể được mô phỏng mà không cần sự tham gia của người chứng minh.

**Bối cảnh lịch sử**:

- **1985**: Goldwasser, Micali và Rackoff giới thiệu khái niệm ZKP — một nguyên thủy mật mã học mang tính nền tảng, ban đầu chủ yếu ở mức lý thuyết.
- **1986**: Giao thức không tiết lộ thông tin cho bài toán đẳng cấu đồ thị (graph isomorphism) ra đời, trở thành giao thức ZKP cụ thể đầu tiên.
- **Thập niên 2010 (ZKP đi vào thực tiễn)**: Năm 2012 xuất hiện zk-SNARKs (Gennaro và cộng sự); năm 2013 có giao thức Pinocchio; năm 2014 dự án Zcash khởi động và đến năm 2016 chính thức ra mắt, trở thành đồng tiền mã hóa đầu tiên ứng dụng zk-SNARK.
- **Từ năm 2018 trở đi**: Hệ sinh thái ZKP mở rộng nhanh chóng với zk-STARKs (minh bạch, không cần thiết lập tin cậy), Bulletproofs (chứng minh khoảng giá trị), PLONK (thiết lập phổ quát) và zkEVM (tương thích Ethereum).

**Ứng dụng trong blockchain**:

- **Quyền riêng tư**: Zcash (giao dịch ẩn), Tornado Cash (công cụ trộn trên Ethereum) và các giải pháp thay thế Monero.
- **Khả năng mở rộng**: zkSync, StarkNet (ZK-Rollups), Validium (lưu dữ liệu ngoài chuỗi kèm bằng chứng ZK) và Mina (blockchain có kích thước trạng thái không đổi khoảng 22 KB).
- **Danh tính số**: Chứng minh trên 18 tuổi mà không lộ tuổi thật, chứng minh quốc tịch mà không lộ danh tính, hoặc xác minh chứng chỉ.
- **Tuân thủ pháp lý**: Chứng minh khả năng thanh toán (proof of solvency) mà không công khai chi tiết tài sản nắm giữ, báo cáo quản lý đi kèm bảo vệ quyền riêng tư và quyền riêng tư có thể kiểm toán.

---

## 2. Hiểu biết trực quan

### 2.1. Hang động Ali Baba — Ví dụ kinh điển về ZKP

**Bối cảnh**:

```
Ali Baba discovers cave với magic door
Door opens với secret password

Wants to prove: "I know password"
Without revealing: The actual password

Setup:
        [Entrance]
           / \
          /   \
     Path A   Path B
          \   /
           \ /
      [Magic Door]
      (needs password)
```

**Giao thức**:

```
Round 1:
1. Ali Baba enters cave, chooses Path A or B randomly
2. Verifier stays outside (doesn't see which path)
3. Verifier shouts: "Come out via Path A!"
4. Ali Baba uses password to go through door if needed
5. Exits via Path A
6. Verifier sees: "He exited via requested path"

If Ali didn't know password:
- Probability of success: 50% (lucky guess)

Repeat 20 times:
- If Ali knows password: 100% success
- If Ali doesn't: (0.5)^20 ≈ 0.0001% success

After 20 rounds, verifier convinced with 99.9999% certainty!
But learned NOTHING about password itself!
```

**Các tính chất được minh họa**:
- **Completeness**: Người thực sự biết mật khẩu luôn vượt qua thử thách.
- **Soundness**: Người không biết mật khẩu gần như không thể vượt qua khi lặp lại nhiều vòng.
- **Zero-knowledge**: Người xác minh chỉ biết rằng Ali Baba nắm giữ mật khẩu, không biết nội dung mật khẩu.

### 2.2. Bài toán "Where's Waldo" — Phép ẩn dụ tính toán

**Bài toán**: Chứng minh bạn đã tìm thấy nhân vật Waldo mà không tiết lộ vị trí của nhân vật trên trang giấy.

```
Traditional:
You: "Waldo is at coordinates (234, 567)"
Verifier: Checks → "Correct!"

Problem: Verifier now knows location

Zero-Knowledge:
You: Cut out large piece of paper với hole
     Place over page so ONLY Waldo shows through hole
     Everything else covered
Verifier: Sees Waldo through hole
         Convinced you found him
         But doesn't know position on page!

This is zero-knowledge!
```

### 2.3. Chứng minh lời giải Sudoku — Lược đồ cam kết (Commitment Scheme)

**Thiết lập**: Chứng minh bạn đã giải xong một bảng Sudoku mà không tiết lộ lời giải.

```
1. Write solution on paper
2. Put in locked box
3. Give box to verifier
4. Verifier checks:
   - Box is sealed
   - Cannot see inside
5. Later, open box
6. Verify solution correct

Properties:
- Commitment: Cannot change solution after box locked
- Hiding: Verifier can't see solution
- Binding: Must reveal same solution later

But this reveals solution eventually!
```

**Sudoku không tiết lộ thông tin thực sự**:

```
Use cryptographic commitments:
1. Commit to each cell: Com(value, random)
2. Verify constraints without opening:
   - Row sum commitments
   - Column sum commitments  
   - Box sum commitments
3. Prove algebraically constraints satisfied
4. Never reveal individual cell values!

Verifier convinced solution valid
Without learning any cell values!
```

### 2.4. Hai quả bóng khác màu — ZKP tương tác

**Thiết lập**: Chứng minh hai quả bóng có màu khác nhau mà không tiết lộ màu cụ thể của chúng.

```
Verifier is colorblind
You can see: Ball A is red, Ball B is green

Protocol:
1. Verifier holds both balls behind back
2. Randomly swaps or doesn't swap
3. Shows you balls
4. You say: "Swapped" or "Not swapped"
5. Repeat many times

If balls actually different colors:
└─ You can always tell (100% accuracy)

If balls same color:
└─ You can only guess (50% accuracy)

After 20 rounds:
└─ If 100% correct → Verifier convinced balls different
└─ But verifier learned NOTHING about actual colors!
```

### 2.5. Chứng minh mật khẩu — ZKP dựa trên hàm băm

**Chứng minh biết mật khẩu mà không tiết lộ mật khẩu**:

```
Setup: Everyone knows H(password) = 0xABC...

Traditional:
You: "Password is: secret123"
Verifier: Checks H("secret123") = 0xABC... ✓

Problem: Password revealed!

Zero-Knowledge (Fiat-Shamir):
You: Generate proof using password
     Proof is function of password + random challenge
     But reveals nothing about password
Verifier: Checks proof mathematically
         Convinced you know password
         Without learning it!

This is basis of authentication protocols!
```

---

## 3. Nền tảng kỹ thuật

### 3.1. Tổng quan về zk-SNARK

**zk-SNARK** là viết tắt của *Zero-Knowledge Succinct Non-interactive Argument of Knowledge* (Lập luận tri thức không tương tác, ngắn gọn và không tiết lộ thông tin), với các đặc tính:
- **Zero-Knowledge**: Không tiết lộ thông tin nào ngoài tính hợp lệ của mệnh đề.
- **Succinct (Ngắn gọn)**: Kích thước bằng chứng rất nhỏ (~128 byte) và thời gian xác minh nhanh (~1 ms).
- **Non-interactive (Không tương tác)**: Không cần trao đổi qua lại nhiều vòng, chỉ cần gửi một thông điệp duy nhất.
- **Argument (Lập luận)**: Đảm bảo tính đúng đắn về mặt tính toán (computationally sound), thay vì bảo mật tuyệt đối theo lý thuyết thông tin.
- **of Knowledge (Tri thức)**: Người chứng minh phải thực sự sở hữu nhân chứng (witness) bí mật.

**Biểu diễn dưới dạng mạch số học (Arithmetic Circuits)**:

Các phép tính được chuyển đổi thành mạch số học để tạo ràng buộc:

```
Example: Prove you know x such that x^3 + x + 5 = 35

Circuit:
Input: x (private witness)
Output: 35 (public)

Gates:
1. x_squared = x × x
2. x_cubed = x_squared × x  
3. x_cubed_plus_x = x_cubed + x
4. result = x_cubed_plus_x + 5

Constraint: result = 35

Solution: x = 3
(3^3 + 3 + 5 = 27 + 3 + 5 = 35)

ZK Proof proves: "I know x satisfying constraints"
Without revealing: x = 3
```

**Groth16 (Lược đồ phổ biến nhất)**:

```python
class ZKProof:
    """Simplified zk-SNARK proof structure"""
    
    def __init__(self):
        # Proof components (elliptic curve points)
        self.A = None  # 32 bytes
        self.B = None  # 64 bytes  
        self.C = None  # 32 bytes
        # Total: 128 bytes (constant size!)
    
    def verify(self, public_inputs, verification_key):
        """Verify proof (simplified)"""
        # Pairing check:
        # e(A, B) = e(alpha, beta) × e(L, gamma) × e(C, delta)
        
        # Where:
        # - e() is pairing function
        # - alpha, beta, gamma, delta from verification key
        # - L computed from public inputs
        
        # If equation holds → Proof valid!
        # Takes ~1ms, constant time regardless of circuit size!
        
        return True  # Simplified
```

**Nghi thức thiết lập tin cậy (Trusted Setup Ceremony)**:

```
Problem: zk-SNARKs need "toxic waste" generation

Setup generates:
- Proving key (for creating proofs)
- Verification key (for verifying proofs)
- Secret randomness (MUST BE DESTROYED!)

If secret leaked:
→ Can create fake proofs!
→ System compromised!

Solution: Multi-party computation (MPC)
- 100+ participants
- Each adds randomness
- Only need ONE honest participant
- Secret impossible to reconstruct

Zcash had 200+ participants in ceremonies!
```

### 3.2. Tổng quan về zk-STARK

**zk-STARK** là viết tắt của *Zero-Knowledge Scalable Transparent Argument of Knowledge* (Lập luận tri thức minh bạch, có khả năng mở rộng và không tiết lộ thông tin).

**So sánh giữa zk-SNARK và zk-STARK**:

| Đặc điểm | zk-SNARK | zk-STARK |
|----------|----------|----------|
| **Thiết lập ban đầu** | Cần thiết lập tin cậy (trusted setup) | Không cần thiết lập tin cậy (minh bạch) |
| **Kích thước bằng chứng** | ~128 byte | ~100–200 KB |
| **Thời gian xác minh** | ~1 ms | ~10 ms |
| **Thời gian tạo bằng chứng** | Nhanh | Chậm hơn |
| **Kháng máy tính lượng tử** | Không | Có |

**Cấu trúc nền tảng của STARK**:
- Cam kết đa thức (polynomial commitments).
- Giao thức FRI (*Fast Reed-Solomon Interactive Oracle Proofs*).
- Chỉ dựa trên các hàm băm kháng va chạm, không sử dụng đường cong elliptic.

```python
class STARKProof:
    """Simplified zk-STARK structure"""
    
    def __init__(self):
        # Proof components (much larger than SNARK)
        self.fri_layers = []  # Multiple rounds
        self.merkle_roots = []
        self.query_responses = []
        # Total: ~100-200 KB
    
    def verify(self, public_inputs):
        """Verify STARK proof"""
        # FRI protocol verification
        # Check polynomial low-degree
        # Query random positions
        # Verify Merkle proofs
        
        # Takes ~10ms (still very fast!)
        # But larger proof size
        
        return True  # Simplified
```

**Sự đánh đổi giữa hai phương pháp**:

```
SNARKs:
✓ Tiny proofs (good for blockchain)
✓ Fast verification
✗ Trusted setup (security risk)
✗ Quantum vulnerable

STARKs:
✓ No trusted setup (transparent!)
✓ Quantum resistant
✓ Simpler cryptographic assumptions
✗ Larger proofs (expensive on-chain)
✗ Slower verification
```

### 3.3. Ứng dụng — Giao dịch riêng tư (theo mô hình Zcash)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZK Private Transaction System
 * @dev Simplified Zcash-style shielded pool
 */
contract ZKPrivatePool {
    // Merkle tree of commitments
    bytes32 public merkleRoot;
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifiers;
    
    uint256 public constant DENOMINATION = 1 ether;
    
    event Deposit(bytes32 indexed commitment);
    event Withdrawal(bytes32 indexed nullifier);
    
    /**
     * @dev Shielded deposit
     */
    function deposit(bytes32 commitment) external payable {
        require(msg.value == DENOMINATION, "Must deposit 1 ETH");
        require(!commitments[commitment], "Commitment exists");
        
        // Add commitment to tree
        commitments[commitment] = true;
        
        // Update Merkle root
        updateMerkleRoot(commitment);
        
        emit Deposit(commitment);
    }
    
    /**
     * @dev Shielded withdrawal
     */
    function withdraw(
        bytes32 nullifier,
        address payable recipient,
        bytes calldata zkProof
    ) external {
        require(!nullifiers[nullifier], "Already spent");
        
        // Verify ZK proof proves:
        // 1. Knows secret s such that commitment = hash(s, nullifier)
        // 2. Commitment exists in Merkle tree
        // 3. Nullifier derived from same secret
        // WITHOUT revealing which commitment!
        
        bool valid = verifyZKProof(
            merkleRoot,
            nullifier,
            recipient,
            zkProof
        );
        
        require(valid, "Invalid proof");
        
        // Mark nullifier as used (prevents double-spend)
        nullifiers[nullifier] = true;
        
        // Send funds to recipient
        recipient.transfer(DENOMINATION);
        
        emit Withdrawal(nullifier);
    }
    
    /**
     * @dev Verify zk-SNARK proof
     */
    function verifyZKProof(
        bytes32 root,
        bytes32 nullifier,
        address recipient,
        bytes calldata proof
    ) internal view returns (bool) {
        // In production: Use Groth16 verifier
        // Public inputs: [root, nullifier, recipient]
        // Proof proves: "I know secret for valid commitment"
        
        // Call pairing check via precompiled contract
        // return zkVerifier.verify(publicInputs, proof);
        
        return proof.length == 128;  // Simplified check
    }
    
    function updateMerkleRoot(bytes32 commitment) internal {
        // Update Merkle tree (simplified)
        merkleRoot = keccak256(abi.encodePacked(merkleRoot, commitment));
    }
}

/**
 * @title User-side ZK proof generation (off-chain)
 */
contract ZKProver {
    /**
     * @dev Generate commitment and nullifier
     */
    function generateCommitment() external view returns (
        bytes32 secret,
        bytes32 nullifier,
        bytes32 commitment
    ) {
        // Generate random secret
        secret = keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            blockhash(block.number - 1)
        ));
        
        // Derive nullifier (unique per secret)
        nullifier = keccak256(abi.encodePacked(secret, "nullifier"));
        
        // Derive commitment (what gets deposited)
        commitment = keccak256(abi.encodePacked(secret, nullifier));
        
        return (secret, nullifier, commitment);
    }
    
    /**
     * @dev Generate ZK proof (off-chain, computationally expensive)
     * In production: Use libsnark, snarkjs, etc.
     */
    function generateProof(
        bytes32 secret,
        bytes32 nullifier,
        bytes32 commitment,
        bytes32[] memory merkleProof
    ) external pure returns (bytes memory) {
        // Steps:
        // 1. Build arithmetic circuit
        // 2. Convert to R1CS (Rank-1 Constraint System)
        // 3. Generate witness
        // 4. Compute proof using proving key
        
        // Circuit proves:
        // - hash(secret, nullifier) = commitment
        // - commitment in Merkle tree (via merkleProof)
        // - nullifier derived correctly
        
        // Output: 128-byte Groth16 proof
        
        return new bytes(128);  // Placeholder
    }
}
```

---

## 4. Công thức toán học và mật mã học

### 4.1. Giao thức Schnorr — Một ZKP đơn giản

**Mục tiêu**: Cho \( y = g^x \mod p \), chứng minh biết giá trị logarit rời rạc \( x \) mà không tiết lộ \( x \).

**Giao thức**:

```
Setup:
- Public: g, p, y = g^x mod p
- Private: x (prover knows this)

Steps:
1. Prover picks random r
2. Prover computes: t = g^r mod p
3. Prover sends t to verifier

4. Verifier picks random challenge c
5. Verifier sends c to prover

6. Prover computes: s = r + c·x mod (p - 1)
7. Prover sends s to verifier

8. Verifier checks: g^s = t · y^c mod p

Verification:
g^s = g^(r + cx) = g^r · g^(cx) = g^r · (g^x)^c = t · y^c mod p ✓
```

**Vì sao giao thức này đảm bảo tính không tiết lộ thông tin?**

Người xác minh chỉ quan sát được bộ ba \( (t, c, s) \), và hoàn toàn có thể tự mô phỏng một bản ghi có phân phối giống hệt mà không cần biết \( x \):
1. Chọn ngẫu nhiên \( s \) và \( c \).
2. Tính \( t = g^s \cdot y^{-c} \mod p \).
3. Xuất bộ ba \( (t, c, s) \).

Vì bản ghi mô phỏng không thể phân biệt được với bản ghi thực, người xác minh không học thêm bất kỳ thông tin nào ngoài việc người chứng minh biết \( x \).

### 4.2. Kỹ thuật Fiat-Shamir

Kỹ thuật Fiat-Shamir cho phép chuyển một giao thức tương tác thành không tương tác. Thay vì để người xác minh chọn thử thách \( c \), người chứng minh tự tính \( c \) bằng hàm băm mật mã:

\[
c = H(\text{public inputs} \parallel t)
\]

**Giao thức sau khi biến đổi**:
```
1. Prover picks random r
2. Prover computes t = g^r mod p
3. Prover computes c = H(g, y, t)  // Hash challenge!
4. Prover computes s = r + c·x mod (p - 1)
5. Prover sends (t, s)

Verifier:
1. Computes c = H(g, y, t)
2. Checks g^s = t · y^c mod p

Non-interactive! Single message!
```

Đây là nền tảng quan trọng cho các hệ thống zk-SNARK hiện đại.

### 4.3. Hệ ràng buộc bậc 1 (R1CS — Rank-1 Constraint System)

Mạch số học có thể được biểu diễn dưới dạng hệ ràng buộc R1CS. Xét ví dụ chứng minh \( x^3 + x + 5 = 35 \) với \( x = 3 \):

**Các biến trung gian**:
- \( x \) (đầu vào bí mật)
- \( sym_1 = x \times x = 9 \)
- \( sym_2 = sym_1 \times x = 27 \)
- \( sym_3 = sym_2 + x = 30 \)
- \( out = sym_3 + 5 = 35 \)

**Các ràng buộc bậc 1**:

\[
\begin{align}
x \times x &= sym_1 \\
sym_1 \times x &= sym_2 \\
(sym_2 + x) \times 1 &= sym_3 \\
(sym_3 + 5) \times 1 &= out
\end{align}
\]

**Biểu diễn dạng ma trận** (với ba ma trận \( A, B, C \)):

\[
(A \cdot w) \circ (B \cdot w) = (C \cdot w)
\]

Trong đó:
- \( w \) là vector nhân chứng (chứa toàn bộ các biến).
- \( \circ \) là phép nhân từng phần tử (Hadamard product).

**Quy trình tạo bằng chứng**:
1. Chuyển chương trình sang dạng R1CS.
2. Tạo vector nhân chứng thỏa mãn toàn bộ ràng buộc.
3. Dùng lược đồ mật mã (như Groth16 hoặc PLONK) để sinh bằng chứng.
4. Thu được bằng chứng có kích thước không đổi (128 byte đối với Groth16).

### 4.4. Kích thước bằng chứng và mức độ bảo mật

**Kích thước bằng chứng SNARK**:

\[
|\text{Proof}_{\text{Groth16}}| = 128 \text{ bytes}
\]

Kích thước này giữ nguyên bất kể độ phức tạp của mạch.

**Kích thước bằng chứng STARK**:

\[
|\text{Proof}_{\text{STARK}}| = O(\text{poly}\log(N))
\]

Trong đó \( N \) là kích thước mạch.

**Ví dụ so sánh**:
```
Circuit: 1 million gates

Groth16 SNARK: 128 bytes
STARK: ~100-200 KB (depending on parameters)

SNARK 1000× smaller!
But STARK no trusted setup.
```

**Mức độ bảo mật**:

Cả hai hệ thống đều đạt mức bảo mật xấp xỉ 128 bit:

\[
P(\text{forge proof}) \approx 2^{-128} \approx 10^{-38}
\]

Xác suất giả mạo này là bất khả thi về mặt tính toán.

### 4.5. Độ phức tạp xác minh

**Thời gian xác minh SNARK**:

\[
T_{\text{verify}} = O(|x| + |y|)
\]

Trong đó \( |x| \) là kích thước đầu vào công khai và \( |y| \) là kích thước đầu ra công khai. Thời gian xác minh không phụ thuộc vào kích thước của mạch tính toán.

**Ví dụ**:
```
Circuit: 1 million gates
Public inputs: 10 values
Public outputs: 1 value

Verification time: ~1ms (constant!)

Compare to re-execution: 
- Would need to execute 1M gates
- Takes seconds to minutes

10,000× faster!
```

---

### Khung giải thích: tự tay chạy giao thức Schnorr Zero-Knowledge modulo $$p = 23$$ (nên đọc chậm)

Trước khi đụng tới các mạch SNARK hàng triệu cổng, hãy tự tay chạy trọn vẹn **giao thức Schnorr** — giao thức ZKP kinh điển, đẹp và trong suốt nhất — để chứng minh bạn biết khóa bí mật $$x$$ sao cho $$y = g^x \bmod p$$ mà không bao giờ gửi $$x$$ đi!

Chọn trường nhỏ $$p = 23$$ và phần tử sinh $$g = 2$$ có cấp $$q = 11$$ (kiểm tra nhanh: $$2^{11} = 2048 = 89 \times 23 + 1 \equiv 1 \pmod{23}$$).
- **Khóa bí mật của Prover:** $$x = 4$$.
- **Khóa công khai:** $$y = 2^4 \bmod 23 = 16$$.

Bây giờ chạy 3 bước trao đổi bằng tay:

1. **Bước 1 — Cam kết (Prover):** Chọn số ngẫu nhiên bí mật $$r = 3 \in \mathbb{Z}_{11}$$, tính và gửi cam kết:
   $$
   t = g^r \bmod 23 = 2^3 \bmod 23 = 8.
   $$
2. **Bước 2 — Thử thách (Verifier):** Chọn ngẫu nhiên một thử thách $$c = 3 \in \mathbb{Z}_{11}$$ gửi cho Prover.
3. **Bước 3 — Phản hồi (Prover):** Tính và gửi duy nhất con số:
   $$
   s = (r + c \cdot x) \bmod 11 = (3 + 3 \cdot 4) \bmod 11 = 15 \bmod 11 = 4.
   $$
4. **Bước 4 — Kiểm chứng (Verifier kiểm tra $$g^s \stackrel{?}{\equiv} t \cdot y^c \pmod{23}$$):**
   - **Vế trái:** $$g^s \bmod 23 = 2^4 \bmod 23 = 16$$.
   - **Vế phải:** $$t \cdot y^c = 8 \cdot 16^3 \pmod{23}$$. Tính tay: $$16^2 = 256 = 11(23) + 3 \equiv 3$$, suy ra $$16^3 \equiv 3 \cdot 16 = 48 \equiv 2 \pmod{23}$$, và
     $$
     8 \cdot 2 = 16 \pmod{23}!
     $$
   **Khớp hoàn hảo $$16 = 16$$!**

**Tại sao không lộ $$x$$?** Vì $$s = r + cx \pmod{11}$$ bị che kín bởi số ngẫu nhiên $$r$$ dùng đúng một lần (như mã một lần One-Time Pad): nhìn vào $$s = 4$$, mọi giá trị $$x$$ đều khớp với một giá trị $$r$$ tương ứng. (Và hãy lưu ý bài học bảo mật: nếu Prover *tái sử dụng* cùng một $$r$$ cho hai thử thách $$c_1 \neq c_2$$, kẻ tấn công lấy hiệu $$s_1 - s_2 \equiv (c_1 - c_2)x \pmod{11}$$ sẽ khôi phục ngay khóa bí mật $$x$$!)

## 5. Góc nhìn triển khai

### 5.1. Cài đặt giao thức Schnorr ZKP đơn giản

```python
import hashlib
import random

class SchnorrZKP:
    """Schnorr protocol - prove knowledge of discrete log"""
    
    def __init__(self, p, g):
        """
        Initialize with group parameters
        
        Args:
            p: Large prime (modulus)
            g: Generator
        """
        self.p = p
        self.g = g
    
    def generate_keypair(self):
        """Generate public/private key pair"""
        # Private key: random x
        x = random.randint(1, self.p - 2)
        
        # Public key: y = g^x mod p
        y = pow(self.g, x, self.p)
        
        return x, y
    
    def prove(self, x, y):
        """
        Generate ZK proof of knowledge of x
        
        Args:
            x: Private key (secret)
            y: Public key (y = g^x mod p)
            
        Returns:
            Non-interactive proof (t, s)
        """
        # 1. Pick random r
        r = random.randint(1, self.p - 2)
        
        # 2. Compute commitment
        t = pow(self.g, r, self.p)
        
        # 3. Compute challenge (Fiat-Shamir)
        challenge_input = f"{self.g}{self.p}{y}{t}"
        c = int(hashlib.sha256(challenge_input.encode()).hexdigest(), 16) % (self.p - 1)
        
        # 4. Compute response
        s = (r + c * x) % (self.p - 1)
        
        proof = {
            't': t,
            's': s,
            'c': c  # Include for verification
        }
        
        print(f"✓ Proof generated (non-interactive)")
        print(f"  Commitment t: {t}")
        print(f"  Response s: {s}")
        
        return proof
    
    def verify(self, y, proof):
        """
        Verify ZK proof
        
        Args:
            y: Public key
            proof: Proof dict containing (t, s, c)
            
        Returns:
            True if proof valid
        """
        t = proof['t']
        s = proof['s']
        c = proof['c']
        
        # Recompute challenge
        challenge_input = f"{self.g}{self.p}{y}{t}"
        c_computed = int(hashlib.sha256(challenge_input.encode()).hexdigest(), 16) % (self.p - 1)
        
        if c != c_computed:
            return False
        
        # Check: g^s = t · y^c
        left = pow(self.g, s, self.p)
        right = (t * pow(y, c, self.p)) % self.p
        
        valid = (left == right)
        
        if valid:
            print(f"✓ Proof VERIFIED")
            print(f"  Prover knows discrete log")
            print(f"  Without revealing it!")
        
        return valid

# Example usage
if __name__ == "__main__":
    print("=== Schnorr Zero-Knowledge Proof ===\n")
    
    # Setup (use small numbers for demo, production uses 256-bit)
    p = 23  # Prime
    g = 5   # Generator
    
    zkp = SchnorrZKP(p, g)
    
    # Prover generates keypair
    print("Prover generating keypair...")
    x, y = zkp.generate_keypair()
    print(f"Private key x: {x} (SECRET - not revealed!)")
    print(f"Public key y: {y} (= {g}^{x} mod {p})")
    
    # Prover creates proof
    print(f"\nProver creating ZK proof...")
    proof = zkp.prove(x, y)
    
    # Verifier verifies (without learning x!)
    print(f"\nVerifier verifying proof...")
    valid = zkp.verify(y, proof)
    
    print(f"\n{'✓ SUCCESS' if valid else '✗ FAILED'}")
    print(f"Verifier convinced prover knows x")
    print(f"But verifier DID NOT learn x!")
```

---

## Video tham khảo

- **Xem trước:** [ZK Whiteboard Sessions - Module One: What is a SNARK? by Dan Boneh](https://www.youtube.com/watch?v=h-94UhJLeck) — Zero Knowledge, tiếng Anh. Dan Boneh trình bày định nghĩa SNARK trong chuỗi ZK Whiteboard Sessions; nên xem trước mục người chứng minh (prover) và người xác minh (verifier).
- [ZKP MOOC Lecture 2: Overview of Modern SNARK Constructions](https://www.youtube.com/watch?v=bGEXYpt3sj0) — Berkeley RDI, tiếng Anh. Bài giảng 2 của ZKP MOOC (Berkeley RDI) khảo sát các cấu trúc SNARK hiện đại, bao gồm họ Groth; hữu ích cho phần xây dựng mạch số học.
- [Understanding ZK Starks with the godfather of ZK #privacy #zeroknowledgeproofs](https://www.youtube.com/watch?v=nxn4FyOn48E) — StarkWare, tiếng Anh. StarkWare giải thích về STARK, giúp đối chiếu với mục chứng minh minh bạch và không cần thiết lập tin cậy.
