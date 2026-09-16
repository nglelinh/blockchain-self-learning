---
layout: post
title: "Lecture 05.99: Ứng dụng và cập nhật hiện đại (2022–2026)"
chapter: '05'
order: 7
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter05
lesson_type: optional
---

# Lecture (tùy chọn): ZK & security 2022–2026 — folding, zkVM, Jolt, FIPS 203

> Bài này là **tùy chọn**. Nó **không** viết lại định nghĩa ZK, Groth16, STARK, reentrancy, hay toán PQC trong 05.04. Nó chỉ chỉ các *hệ chứng minh và tiêu chuẩn* đã thành công cụ kỹ sư khoảng 2022–2026.

## 1. Từ “mạch R1CS” tới “chạy Rust, xuất proof”

Bài 05.01 dạy SNARK/STARK như primitive. Đến 2022–2026, bottleneck chuyển: team không muốn viết mạch Poseidon bằng tay; họ muốn **zkVM** — chứng minh một trace RISC-V / custom ISA — và **folding** để IVC (incremental verifiable computation) rẻ. Song song, NIST hoàn tất FIPS 203/204/205 (tháng 8 năm 2024), biến PQC từ “nghiên cứu” thành *tiêu chuẩn liên bang* — nối 05.04 với số hiệu cụ thể.

Formal verification (05.03) đi vào CI: Certora, Halmos, Kontrol; không thay thế audit nhưng trở thành gate cho protocol lớn.

![Cây hash — commitment mà SNARK/STARK/zkVM vẫn dựa trên](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)
*Nguồn: [Wikimedia Commons — Hash Tree](https://commons.wikimedia.org/wiki/File:Hash_Tree.svg). Tổng quan ZKP: [Wikipedia](https://en.wikipedia.org/wiki/Zero-knowledge_proof).*

## 2. Các bước tiến then chốt

### 2.1. Folding: Nova và họ hàng

Kothapalli, Setty, Tzialla, *Nova: Recursive Zero-Knowledge Arguments from Folding Schemes* (CRYPTO 2022; [ePrint 2021/370](https://eprint.iacr.org/2021/370)) đưa **folding**: gộp hai instance R1CS/relaxed thành một, recursion overhead ~ hằng số (vài nhân nhóm), không cần SNARK ở mỗi bước, không trusted setup, không FFT bắt buộc. SuperNova, HyperNova, Protostar (2023–2024) mở rộng folding cho mạch không đồng nhất và lookup.

Ý trực quan từ 05.01: thay vì “mỗi bước một Groth16”, prover *cộng* ràng buộc rồi mới nén một lần. Đó là lý do nhiều zkVM / “zk coprocessor” 2024 chọn Nova-family cho chứng minh dài (bridge, ML inference, L2 state diff).

### 2.2. zkVM: RISC Zero, SP1, Jolt

Một zkVM nhận chương trình ISA (thường RISC-V), sinh proof “tôi đã chạy ELF này trên input \(x\) ra \(y\)”.

- **RISC Zero** và **SP1** (Succinct): STARK cho execution trace, rồi wrapper SNARK (Groth16/Plonk) để verify on-chain rẻ. Precompile cho keccak, secp256k1, pairing — EVM ops không đi qua mạch RISC-V thuần.
- **Jolt** (Arun, Setty, Thaler; [ePrint 2023/1217](https://eprint.iacr.org/2023/1217), EUROCRYPT 2024): front-end “lookup singularity” — hầu hết instruction là lookup vào bảng cấu trúc khổng lồ; **Lasso** (ePrint 2023/1216) là lookup argument. Prover commit ~ hằng số field element mỗi bước CPU, dễ audit hơn mạch thủ công.

Hệ quả cho 05.02: thay vì formalize từng mạch, team formalize *guest program* Rust và tin zkVM — surface khác, không nhỏ hơn.

### 2.3. Ngôn ngữ: Noir, Circom, Cairo, Halo2

Aztec **Noir**, 0xPARC **Halo2**, StarkWare **Cairo** (Starknet production) là chỗ circuit engineer làm việc 2023–2026. Plonky2/3 (Polygon) đẩy recursive STARK-friendly field. Học viên đã biết SNARK vs STARK trong 05.01 chỉ cần *map* toolchain: Circom ≈ R1CS cổ điển; Halo2/Plonky ≈ Plonkish + lookup; Cairo ≈ AIR/STARK.

### 2.4. FIPS 203 và lịch PQC

NIST [FIPS 203 (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final), [FIPS 204 (ML-DSA)](https://csrc.nist.gov/pubs/fips/204/final), [FIPS 205 (SLH-DSA)](https://csrc.nist.gov/pubs/fips/205/final) xuất bản 13-Aug-2024. Đây là số hiệu *bắt buộc* khi nói “post-quantum” với chính phủ / ngân hàng — không thay bài 05.04 về lattice, chỉ neo chuẩn. Blockchain (Ethereum, Bitcoin) *chưa* migrate ECDSA; nghiên cứu account / address hash chống quantum vẫn mở (xem 07.99).

Privacy production: zk coprocessor (lấy storage L1, prove off-chain), private DeFi có chọn lọc sau cú sốc Tornado Cash (2022) — bài học compliance vs privacy của 05.00, không phải hướng dẫn mixer.

## 3. Insight triển khai

Một bridge hiện đại: guest Rust trong SP1 chứng minh “tôi đã verify Merkle path + BLS”; wrapper Groth16 verify trên L1 bằng precompile pairing (EIP-2537 sau Pectra giúp BLS). Folding dùng khi chứng minh *nhiều block* L2: mỗi block một fold, cuối cùng một SNARK.

```text
guest.rs (RISC-V) --> zkVM STARK --> Groth16 wrapper --> eip-197/2537 verify
                         \
                          Nova folds (nếu IVC dài)
```

Certora rule “không mint quá `totalSupply`” chạy trong CI — bổ sung, không thay, checklist reentrancy 05.02.

## 4. Thách thức và trade-off

zkVM precompile = trusted circuit mới. Groth16 wrapper tái nhập trusted setup. Folding instance “relaxed R1CS” dễ implement sai. Prover tập trung → liveness. PQC signatures lớn hơn ECDSA nhiều lần — fee L1 không chấp nhận thay thế ngây thơ. Formal tools cần spec; spec sai thì chứng minh đúng điều sai.

## 5. Bài này bổ sung gì

Vẫn học 05.00–05.05 cho privacy classic, Groth16/STARK math, vuln, formal methods, PQC theory. Bài tùy chọn gắn chúng với Nova, zkVM, Jolt/Lasso, Noir/Halo2, FIPS 203–205.

## 6. Tài liệu gốc (2022–2026)

| Nguồn | Năm | Đóng góp |
| --- | --- | --- |
| [Nova (CRYPTO 2022 / ePrint 2021/370)](https://eprint.iacr.org/2021/370) | 2022 | Folding schemes; IVC rẻ |
| [Jolt (ePrint 2023/1217)](https://eprint.iacr.org/2023/1217) | 2023–2024 | zkVM via lookups; EUROCRYPT 2024 |
| [Lasso (ePrint 2023/1216)](https://eprint.iacr.org/2023/1216) | 2023 | Lookup argument |
| [RISC Zero docs](https://dev.risczero.com/) | 2022– | Production RISC-V zkVM |
| [SP1 (Succinct)](https://docs.succinct.xyz/) | 2024– | RISC-V zkVM + precompiles |
| [FIPS 203 ML-KEM](https://csrc.nist.gov/pubs/fips/203/final) | 2024-08-13 | Kyber standardized |
| [Halo2 book](https://zcash.github.io/halo2/) / [Noir](https://noir-lang.org/) | 2022– | Circuit toolchains |

## 7. Bài tập định hướng

1. Nova folding giảm *gì* so với recursive Groth16 mỗi bước? Cái gì *không* giảm (kích thước proof cuối nếu không nén)?
2. Jolt “lookup singularity”: vì sao bảng \(2^{128}\) không được materialize, và Lasso khai thác cấu trúc thế nào (đọc abstract ePrint)?
3. Kể một lý do Ethereum *chưa* thay ECDSA bằng ML-DSA trên L1 user tx.

---
✅ **End of optional lesson**
Next: [Lecture 06.00 — Cross-Chain Communication]({{ site.baseurl }}/contents/vi/chapter06/)
