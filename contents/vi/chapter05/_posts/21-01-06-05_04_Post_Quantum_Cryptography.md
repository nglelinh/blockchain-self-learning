---
layout: post
title: "Lecture 05.04: Post-Quantum Cryptography - Preparing for Quantum Computing Era"
chapter: '05'
order: 5
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
---

# Bài giảng 05.04: Mật mã học hậu lượng tử — Chuẩn bị cho kỷ nguyên máy tính lượng tử

Toàn bộ hàng nghìn tỷ đô la tài sản trên Bitcoin và Ethereum hiện nay đang được khóa bằng chữ ký đường cong elliptic (ECDSA trên `secp256k1` hoặc BLS). Khi bạn nhận tiền vào một địa chỉ mới (vốn là hàm băm của khóa công khai), khóa công khai của bạn vẫn còn ẩn mình an toàn. Nhưng ngay khoảnh khắc bạn ký một giao dịch chi tiêu, khóa công khai lập tức hiện ra trên mempool công khai — và trước một máy tính lượng tử chịu lỗi trong tương lai chạy **thuật toán Shor**, kẻ tấn công có thể khôi phục khóa bí mật và cướp giao dịch trước khi block kịp xác nhận!

Mật mã hậu lượng tử (PQC) không phải khoa học viễn tưởng xa vời: NIST đã ban hành các chuẩn chính thức **FIPS 203/204/205** vào năm 2024, và các mạng blockchain đang đứng trước bài toán thiết kế đầy thách thức: làm sao chuyển sang chữ ký kháng lượng tử mà không làm phình kích thước block lên gấp hàng chục lần?

---

## Kiến thức cần nhớ: Mật mã Hậu lượng tử cho Blockchain đứng trên bốn trụ cột nào?

1. **Bản đồ đe dọa lượng tử (Shor vs. Grover):** Thuật toán **Shor** phá hoàn toàn chữ ký khóa công khai (ECDSA, Ed25519, RSA, BLS) trong thời gian đa thức; ngược lại, thuật toán **Grover** chỉ tăng tốc bậc hai với hàm băm SHA-256 (kéo mức an toàn 256-bit xuống 128-bit — vẫn rất an toàn, không cần bỏ SHA-256!).
2. **Các họ chữ ký PQC chính:** Mật mã dựa trên **Lưới** (ML-DSA / Dilithium, Falcon — cân bằng tốt giữa tốc độ và kích thước) và mật mã dựa trên **Hàm băm** (SLH-DSA / SPHINCS+, XMSS — bảo thủ nhất về giả định an toàn nhưng chữ ký lớn).
3. **Nút thắt băng thông & kích thước chữ ký:** Chữ ký PQC lớn gấp 10 đến 100 lần chữ ký ECDSA (64 byte), trực tiếp cắt giảm số giao dịch trên mỗi block (TPS).
4. **Chiến lược di cư (Migration & Aggregation):** Kết hợp chữ ký lai (Hybrid ECDSA + PQC), Account Abstraction (ERC-4337 cho phép đổi thuật toán chữ ký ngay ở cấp ví), và **tổng hợp hàng nghìn chữ ký PQC bằng một bằng chứng ZK-STARK duy nhất**.

---

## 1. Tổng quan về khái niệm

Máy tính lượng tử đặt ra một mối đe dọa trực tiếp đối với nền tảng mật mã học hiện tại của công nghệ blockchain. Trong khi máy tính cổ điển xử lý các bit nhị phân (0 hoặc 1), máy tính lượng tử khai thác các hiện tượng cơ học lượng tử như **chồng chập (superposition)** và **vướng víu (entanglement)** để xử lý các bit lượng tử (qubit) có thể tồn tại đồng thời ở nhiều trạng thái. Nhờ đó, một số thuật toán lượng tử có thể giải quyết các bài toán toán học nhanh hơn theo cấp số mũ so với thuật toán cổ điển tốt nhất, đe dọa trực tiếp các lược đồ mật mã đang bảo vệ hàng tỷ USD tài sản trên các hệ sinh thái blockchain.

Mối đe dọa này xuất phát từ những thuật toán lượng tử cụ thể làm lung lay các giả định bảo mật cốt lõi. **Thuật toán Shor**, do Peter Shor đề xuất năm 1994, giải được bài toán phân tích thừa số nguyên tố và bài toán logarit rời rạc trong thời gian đa thức trên máy tính lượng tử. Đây chính là hai bài toán nền tảng cho RSA (phân tích thừa số) và ECDSA (logarit rời rạc) — các lược đồ chữ ký số đang bảo vệ hầu hết các blockchain hiện nay như Bitcoin và Ethereum. Một máy tính lượng tử đủ mạnh có thể suy ra khóa bí mật từ khóa công khai, cho phép kẻ tấn công chiếm đoạt tài sản từ bất kỳ địa chỉ nào đã từng để lộ khóa công khai.

Các ước tính về thời điểm máy tính lượng tử đủ mạnh để phá vỡ ECDSA 256-bit vẫn còn nhiều khác biệt: ước tính thận trọng cho rằng cần khoảng 10–15 năm, trong khi ước tính lạc quan hơn về phía bảo mật kéo dài từ 20–30 năm. Tuy nhiên, tiến độ phần cứng trong những năm gần đây khiến cộng đồng phải chú ý nhiều hơn: Google công bố mốc "ưu thế lượng tử" năm 2019 với bộ xử lý Sycamore 53 qubit; IBM giới thiệu chip Osprey 433 qubit năm 2022; và Atom Computing trình diễn hệ thống 1.225 qubit năm 2023. Dù các hệ thống này còn xa ngưỡng cần thiết về mặt mật mã học (ước tính khoảng 4.000 qubit logic đã sửa lỗi để phá ECDSA), tốc độ phát triển cho thấy việc chuẩn bị sớm là cần thiết.

Cộng đồng mật mã học và blockchain đã phản ứng bằng cả nghiên cứu lý thuyết lẫn kế hoạch chuyển đổi thực tế. **Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ (NIST)** đã tổ chức cuộc thi kéo dài nhiều năm để đánh giá các lược đồ mật mã hậu lượng tử và công bố các chuẩn chính thức vào tháng 8/2024, bao gồm các lược đồ dựa trên mạng lưới (lattice-based) như **CRYSTALS-Kyber** (mã hóa/trao đổi khóa) và **CRYSTALS-Dilithium** (chữ ký số), chữ ký dựa trên hàm băm (**SPHINCS+**), bên cạnh hướng nghiên cứu mật mã dựa trên mã sửa lỗi (code-based).

Quá trình chuyển đổi trên blockchain đối mặt với nhiều thách thức lớn. Không thể đơn giản thay thế ECDSA bằng chữ ký hậu lượng tử vì nhiều lược đồ mới có kích thước khóa, kích thước chữ ký và thời gian xác minh lớn hơn đáng kể, làm gia tăng áp lực lên băng thông và lưu trữ của mạng lưới. Ngoài ra, việc chuyển đổi đòi hỏi một đợt hard fork phối hợp trên toàn mạng, vốn phức tạp cả về kỹ thuật lẫn quản trị.

Nhiều hướng thiết kế blockchain kháng lượng tử đang được nghiên cứu: **Phân phối khóa lượng tử (QKD)** cho bảo mật truyền thông đồng thuận, đánh giá độ bền của hàm băm trước thuật toán lượng tử, và **lược đồ lai (hybrid schemes)** kết hợp đồng thời mật mã cổ điển và hậu lượng tử trong giai đoạn chuyển tiếp. Một số dự án như **QRL (Quantum Resistant Ledger)** đã tích hợp chữ ký hậu lượng tử ngay từ đầu để chứng minh tính khả thi, dù mức độ ứng dụng thực tế còn hạn chế.

---

## 2. Hiểu biết trực quan

Để hình dung mối đe dọa lượng tử, hãy coi mật mã cổ điển như một ổ khóa số với số tổ hợp khổng lồ. Khóa 256-bit tạo ra \(2^{256}\) khả năng — việc thử tuần tự từng tổ hợp sẽ tốn thời gian dài hơn tuổi của vũ trụ ngay cả khi huy động mọi máy tính trên Trái Đất. Tuy nhiên, máy tính lượng tử không duyệt tuần tự như vậy mà tận dụng trạng thái chồng chập và giao thoa lượng tử để khuếch đại biên độ xác suất của lời giải đúng, tăng tốc độ tìm kiếm một cách vượt trội đối với những bài toán có cấu trúc phù hợp.

Phép so sánh với việc giải mê cung minh họa rõ sự khác biệt này. Máy tính cổ điển phải thử lần lượt từng nhánh hành lang, gặp ngõ cụt rồi quay lại, nên thời gian tăng theo hàm mũ với quy mô mê cung. Trong bài toán tìm khóa bí mật từ khóa công khai, thuật toán lượng tử khai thác cấu trúc toán học ẩn bên trong thông qua giao thoa để đi thẳng tới đáp án thay vì dò từng nhánh.

Cụ thể, thuật toán Shor nhắm vào cấu trúc toán học của bài toán logarit rời rạc: cho \(y = g^x \mod p\), hãy tìm \(x\). Các thuật toán cổ điển tốt nhất (như baby-step giant-step hay Pollard's rho) cần \(O(\sqrt{p})\) phép toán — với đường cong 256-bit là khoảng \(2^{128}\) phép toán, bất khả thi về mặt tính toán. Thuật toán Shor sử dụng biến đổi Fourier lượng tử để tìm chu kỳ của phép lũy thừa modulo, giải bài toán trong thời gian đa thức \(O((\log p)^3)\).

Các lược đồ mật mã hậu lượng tử dựa trên những bài toán được tin là vẫn khó ngay cả với máy tính lượng tử:
- **Bài toán mạng lưới (Lattice problems)**: Tìm vector ngắn nhất trong mạng lưới nhiều chiều — hiện chưa có thuật toán lượng tử nào mang lại mức tăng tốc theo hàm mũ.
- **Chữ ký dựa trên hàm băm (Hash-based signatures)**: Chỉ dựa vào tính kháng va chạm và kháng tiền ảnh của hàm băm mật mã, nơi thuật toán Grover chỉ mang lại mức tăng tốc bậc hai.
- **Mật mã dựa trên mã sửa lỗi (Code-based cryptography)**: Dựa trên độ khó của việc giải mã các mã tuyến tính tổng quát.

Việc chuyển đổi hạ tầng mật mã giống như gia cố hoặc thay thế một cây cầu trước khi nó xuống cấp nghiêm trọng. Nếu chờ đến khi mối đe dọa lượng tử hiện hữu rõ ràng, khóa bí mật có thể bị lộ hàng loạt trước khi mạng lưới kịp nâng cấp. Trong giai đoạn chuyển tiếp, **mật mã lai (hybrid cryptography)** hoạt động như cơ chế bảo vệ kép: mỗi giao dịch sử dụng đồng thời cả chữ ký cổ điển (ECDSA) lẫn chữ ký hậu lượng tử, và chỉ hợp lệ khi cả hai cùng vượt qua xác minh. Dù kích thước chữ ký tạm thời tăng lên, cách tiếp cận này đảm bảo an toàn ngay cả khi một trong hai lược đồ bị phá vỡ.

---

## 3. Nền tảng kỹ thuật

Phân tích mối đe dọa bắt đầu từ độ phức tạp của **thuật toán Shor**. Với số nguyên \(N\) có độ dài \(n\) bit, thuật toán Shor phân tích \(N\) hoặc giải logarit rời rạc trong thời gian:

\[
O(n^3) \text{ quantum operations}
\]

Trong khi thuật toán cổ điển tốt nhất cho phân tích thừa số (GNFS) yêu cầu thời gian dưới hàm mũ:
\[
O(e^{1.9(\ln N)^{1/3}(\ln \ln N)^{2/3}}) \approx O(e^{n^{1/3}})
\]

Với bài toán logarit rời rạc trên đường cong elliptic 256-bit:
- Cổ điển: \(O(2^{128})\) phép toán (bất khả thi).
- Lượng tử: \(O(256^3) = 16.777.216\) phép toán (khả thi trên máy tính lượng tử đủ mạnh).

**Thuật toán Grover** mang lại mức tăng tốc bậc hai cho bài toán tìm kiếm không có cấu trúc, chẳng hạn tìm tiền ảnh (preimage) của một hàm băm \(n\)-bit:
- Cổ điển: \(O(2^n)\).
- Lượng tử (dùng Grover): \(O(2^{n/2})\).

Đối với SHA-256:
- Độ khó cổ điển: \(2^{256}\) phép toán.
- Độ khó lượng tử: \(2^{128}\) phép toán.

Như vậy, độ bảo mật hiệu dụng trước tấn công tìm tiền ảnh bị giảm một nửa — hàm băm 256-bit chỉ còn mức bảo mật lượng tử 128-bit.

Các lược đồ chữ ký hậu lượng tử tiêu biểu và sự đánh đổi về tham số:

**CRYSTALS-Dilithium** (dựa trên mạng lưới):
```python
class DilithiumSignature:
    """Simplified Dilithium signature scheme"""
    
    # Parameters
    PUBLIC_KEY_SIZE = 1312 bytes  # Much larger than ECDSA (33 bytes)
    SIGNATURE_SIZE = 2420 bytes   # Much larger than ECDSA (64 bytes)
    
    def keygen(self):
        """Generate key pair"""
        # Lattice-based key generation
        # Private: short vectors in lattice
        # Public: random matrix + public vector
        pass
    
    def sign(self, message, private_key):
        """Create signature"""
        # Rejection sampling over lattice
        # Output: (z, c) where z is response, c is challenge
        pass
    
    def verify(self, message, signature, public_key):
        """Verify signature"""
        # Check lattice relation holds
        # Significantly slower than ECDSA (~10x)
        pass
```

**SPHINCS+** (dựa trên hàm băm):
```python
class SPHINCS_Plus:
    """Hash-based signature (quantum-safe)"""
    
    PUBLIC_KEY_SIZE = 32 bytes    # Reasonable
    SIGNATURE_SIZE = 7856 bytes   # VERY large!
    
    # Security relies only on hash function collision resistance
    # Grover only gives quadratic speedup
    # Use SHA-256 → 128-bit quantum security
    # Or SHA-512 → 256-bit quantum security
```

Bảng so sánh các lược đồ chữ ký:

| Lược đồ | Khóa công khai | Chữ ký | Tốc độ | Kháng lượng tử |
|---------|----------------|--------|--------|----------------|
| ECDSA | 33 byte | 64 byte | Nhanh | Không |
| Dilithium | 1.312 byte | 2.420 byte | Trung bình | Có |
| SPHINCS+ | 32 byte | 7.856 byte | Chậm | Có |
| Falcon | 897 byte | 666 byte | Nhanh | Có |

---

## 4. Công thức toán học và mật mã học

Các bài toán trên mạng lưới (lattice) là nền tảng của nhiều lược đồ hậu lượng tử. **Bài toán vector ngắn nhất (Shortest Vector Problem — SVP)** yêu cầu tìm một vector khác không có độ dài nhỏ nhất trong mạng lưới \(L\), với mạng lưới được sinh bởi các vector cơ sở:

\[
L = \{\sum_{i=1}^{n} a_i \mathbf{b}_i : a_i \in \mathbb{Z}\}
\]

Cả thuật toán cổ điển tốt nhất (như BKZ) lẫn thuật toán lượng tử hiện biết đều có độ phức tạp hàm mũ theo số chiều \(n\) (\(O(2^n)\)), chưa có mức tăng tốc theo hàm mũ từ máy tính lượng tử.

**Bài toán học có nhiễu (Learning With Errors — LWE)**: Cho các mẫu \((a_i, b_i)\) thỏa mãn:

\[
b_i = \langle a_i, s \rangle + e_i \mod q
\]

Yêu cầu tìm vector bí mật \(s\). Thành phần nhiễu nhỏ \(e_i\) khiến bài toán khó giải trên cả máy tính cổ điển lẫn máy tính lượng tử.

**Ảnh hưởng của thuật toán lượng tử đối với tìm kiếm va chạm hàm băm**:
- Tìm kiếm va chạm cổ điển: \(O(2^{n/2})\) (theo nghịch lý ngày sinh).
- Tìm kiếm va chạm lượng tử (thuật toán BHT kết hợp Grover): \(O(2^{n/3})\).

Với SHA-256 (\(n = 256\)):
- Độ bảo mật va chạm cổ điển: 128 bit.
- Độ bảo mật va chạm lượng tử: ~85 bit.

Mức này vẫn còn đáng kể nhưng biên độ an toàn đã thu hẹp; do đó SHA-512 (độ bảo mật va chạm lượng tử ~170 bit) thường được khuyến nghị trong bối cảnh hậu lượng tử.

---

### Giải thích: tự tay tính "cái giá băng thông" khi chuyển blockchain sang chữ ký hậu lượng tử

Tại sao Bitcoin và Ethereum không thể đơn giản "đổi hàm `ecdsa_verify` thành `ml_dsa_verify` trong một bản cập nhật cuối tuần"? Hãy làm một phép chia đơn giản trên một block kích thước **1 MB** ($$1{,}000{,}000\text{ byte}$$):

1. **Hiện trạng với ECDSA (`secp256k1`):**
   - Chữ ký: $$64\text{ byte}$$; khóa công khai nén: $$33\text{ byte}$$ → phần mật mã chỉ tốn $$\approx 97\text{ byte}$$.
   - Cộng thêm siêu dữ liệu giao dịch (~$$153\text{ byte}$$), mỗi giao dịch cỡ **$$250\text{ byte}$$**.
   - Sức chứa của block 1 MB: $$\frac{1{,}000{,}000}{250} = \mathbf{4{,}000}\text{ giao dịch/block}$$.

2. **Chuyển thẳng sang ML-DSA-65 (Dilithium3 — chuẩn NIST FIPS 204):**
   - Chữ ký: $$3{,}309\text{ byte}$$; khóa công khai: $$1{,}952\text{ byte}$$ → phần mật mã vọt lên **$$5{,}261\text{ byte}$$** (gấp **54 lần** ECDSA!).
   - Tổng kích thước giao dịch cỡ **$$5{,}414\text{ byte}$$**.
   - Sức chứa của cùng block 1 MB: $$\frac{1{,}000{,}000}{5{,}414} \approx \mathbf{185}\text{ giao dịch/block}$$ (**thông lượng sụp giảm hơn 21 lần!**).

3. **Chuyển sang SLH-DSA-128s (SPHINCS+ — chuẩn NIST FIPS 205, chỉ dựa trên hàm băm):**
   - Chữ ký: $$7{,}856\text{ byte}$$, khóa công khai $$32\text{ byte}$$ → tổng giao dịch cỡ **$$8{,}040\text{ byte}$$** → chỉ còn **$$\approx 124\text{ giao dịch/block}$$** (giảm **32 lần**)!

**Lối thoát kỹ thuật:** Phép tính tay ở trên cho thấy rõ vì sao nghiên cứu blockchain hậu lượng tử tập trung vào **Falcon** (chữ ký nhỏ hơn, ~666 byte) và đặc biệt là **tổng hợp chữ ký bằng ZK-STARK** — gom 4.000 chữ ký PQC ngoài chuỗi thành một bằng chứng STARK duy nhất vài chục KB đưa lên block!

## 5. Góc nhìn triển khai

```python
# Post-quantum migration strategy simulation

class QuantumResistantBlockchain:
    """Blockchain with hybrid classical + post-quantum crypto"""
    
    def __init__(self):
        self.accounts = {}
        self.quantum_era = False  # Switch when quantum threat real
    
    def create_hybrid_address(self):
        """Generate address with both ECDSA and post-quantum keys"""
        
        # Classical key (ECDSA)
        classical_private = generate_ecdsa_key()
        classical_public = derive_public_key(classical_private)
        
        # Post-quantum key (Dilithium)
        pq_private = generate_dilithium_key()
        pq_public = derive_pq_public(pq_private)
        
        # Hybrid address = hash(classical_pub + pq_pub)
        address = hash(classical_public + pq_public)
        
        return {
            'address': address,
            'classical_key': classical_private,
            'pq_key': pq_private,
            'type': 'hybrid'
        }
    
    def verify_transaction(self, tx):
        """Verify transaction with hybrid signatures"""
        
        if self.quantum_era:
            # Post-quantum era: only check PQ signature
            return verify_dilithium(tx['pq_signature'], tx['pq_pubkey'])
        else:
            # Pre-quantum: check both (belt + suspenders)
            classical_valid = verify_ecdsa(tx['ecdsa_signature'])
            pq_valid = verify_dilithium(tx['pq_signature'])
            
            return classical_valid and pq_valid
```

---

## 6. Thách thức, tấn công và sự đánh đổi

- **Chọn thời điểm chuyển đổi**: Chuyển đổi quá sớm làm lãng phí tài nguyên do chữ ký lớn và xác minh chậm hơn; chuyển đổi quá muộn lại tạo rủi ro máy tính lượng tử phá vỡ mật mã hiện hành trước khi mạng lưới hoàn tất nâng cấp. Việc theo dõi sát tiến bộ phần cứng lượng tử là cần thiết, dù các bước đột phá rất khó dự báo chính xác.
- **Phình to kích thước chữ ký**: Chữ ký hậu lượng tử lớn hơn ECDSA từ 10 đến 100 lần. Với giới hạn kích thước khối cố định, số giao dịch mỗi khối sẽ giảm mạnh. Các phương án như tăng kích thước khối (gây lo ngại về tập trung hóa), nén chữ ký một phần hoặc chấp nhận thông lượng thấp hơn đều buộc mạng lưới phải đánh đổi giữa bảo mật hậu lượng tử và hiệu năng.

---

## 7. Các khái niệm liên quan

- **Phân phối khóa lượng tử (Quantum Key Distribution — QKD)**: Cung cấp bảo mật theo lý thuyết thông tin cho kênh truyền nhưng đòi hỏi phần cứng chuyên dụng (cáp quang riêng, bộ lặp lượng tử), nên không phù hợp với bản chất phi tập trung của blockchain công khai. Mật mã hậu lượng tử dựa trên độ khó toán học thực tế hơn vì chạy trực tiếp trên phần cứng cổ điển.
- **Chữ ký dựa trên hàm băm (như SPHINCS+)**: Có ưu điểm lớn là độ an toàn quy hoàn toàn về tính chất của hàm băm mà không phụ thuộc vào cấu trúc đại số như mạng lưới hay đường cong elliptic. Nhược điểm chính là kích thước chữ ký rất lớn (khoảng 7–8 KB so với 64 byte của ECDSA).

---

## 8. Tài liệu nền tảng và bài báo quan trọng

| Tài liệu | Năm | Tác giả | Đóng góp chính |
|----------|-----|---------|----------------|
| **"Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer"** | 1994 | Peter Shor | Thuật toán Shor — phá vỡ RSA và ECDSA |
| **"A Fast Quantum Mechanical Algorithm for Database Search"** | 1996 | Lov Grover | Thuật toán Grover — làm giảm độ bảo mật hiệu dụng của hàm băm |
| **"CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme"** | 2018 | Ducas và cộng sự | Thuật toán chữ ký số được NIST chọn chuẩn hóa |
| **"SPHINCS+: Stateless Hash-Based Signatures"** | 2019 | Bernstein và cộng sự | Chữ ký hậu lượng tử không trạng thái dựa trên hàm băm |
| **"Quantum Resource Estimates for Computing Elliptic Curve Discrete Logarithms"** | 2017 | Roetteler và cộng sự | Ước tính số qubit cần thiết để phá ECDSA |

---

## 9. Minh họa và tài liệu trực quan

### Mốc phát triển phần cứng lượng tử và mối đe dọa
```
2019: Google Quantum Supremacy (53 qubits)
2022: IBM Osprey (433 qubits)
2023: Atom Computing (1,225 qubits)

Needed to break ECDSA-256: ~4,000 logical qubits
(Millions of physical qubits with error correction)

Timeline: 10-30 years (uncertain!)
```

*Nguồn: [NIST Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)*

### So sánh kích thước chữ ký
| Thuật toán | Khóa công khai | Chữ ký | Kháng lượng tử |
|------------|----------------|--------|----------------|
| ECDSA | 33 byte | 64 byte | Không |
| Dilithium | 1.312 byte | 2.420 byte | Có |
| Falcon | 897 byte | 666 byte | Có |
| SPHINCS+ | 32 byte | 7.856 byte | Có |

---

## 10. Tóm tắt

Mật mã học hậu lượng tử giữ vai trò then chốt đối với an toàn dài hạn của blockchain trước sự phát triển của máy tính lượng tử. Thuật toán Shor đe dọa trực tiếp chữ ký ECDSA hiện hành, buộc hệ sinh thái phải chuẩn bị lộ trình chuyển sang các lược đồ kháng lượng tử dựa trên mạng lưới, hàm băm hoặc mã sửa lỗi. Dù thời điểm xuất hiện máy tính lượng tử đủ mạnh còn cách khoảng 10–30 năm, mức độ phức tạp của quá trình chuyển đổi đòi hỏi phải chuẩn bị từ sớm.

Quá trình chuẩn hóa của NIST đã cung cấp các thuật toán sẵn sàng để nghiên cứu và triển khai. Thách thức trọng tâm nằm ở việc cân bằng giữa kích thước chữ ký lớn, tốc độ xác minh chậm hơn và yêu cầu băng thông cao hơn, đồng thời đảm bảo quá trình chuyển đổi diễn ra suôn sẻ mà không làm gián đoạn hệ sinh thái hiện có.

---

**Kết thúc bài giảng**

Bài tiếp theo: Lecture 05.05 — Advanced Privacy Techniques

---

## Video tham khảo

- **Xem trước:** [How Quantum Computers Break Encryption | Shor's Algorithm Explained](https://www.youtube.com/watch?v=lvTqbM5Dq4Q) — minutephysics, tiếng Anh. Giải thích thuật toán Shor và lý do nó tác động trực tiếp đến bài toán logarit rời rạc; nên xem trước phần mối đe dọa với ECDSA.
- [NIST standardization of Post Quantum Cryptography](https://www.youtube.com/watch?v=I2v7AaKuxR4) — IoT Security Foundation, tiếng Anh. Điểm lại quá trình chuẩn hóa PQC của NIST, phù hợp với nội dung chuyển từ nghiên cứu sang tiêu chuẩn.
- [Dilithium Signatures (ML-DSA) \[Post-Quantum Cryptography Explained\]](https://www.youtube.com/watch?v=JvqUS8Ai87g) — Cryptography 101, tiếng Anh. Trình bày cơ chế chữ ký Dilithium (ML-DSA) thuộc họ chữ ký hậu lượng tử trên mạng lưới.

## Tài liệu tham khảo

1. Shor, P. W. (1994). *Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer*. FOCS 1994.
2. NIST. (2024). *Post-Quantum Cryptography Standardization*. https://csrc.nist.gov/projects/post-quantum-cryptography
3. Roetteler, M., et al. (2017). *Quantum resource estimates for computing elliptic curve discrete logarithms*. ASIACRYPT 2017.
