---
layout: post
title: "Lecture 07.02: Web3 Infrastructure - Decentralized Internet Stack"
chapter: '07'
order: 3
owner: Blockchain Course Team
lang: vi
categories:
- blockchain-chapter07
---

# Lecture: Web3 Infrastructure - Decentralized Internet Stack

## 1. Concept Overview

Web3 represents vision fundamental rethinking của internet architecture, transitioning from centralized platforms controlling user data và interactions toward decentralized networks where users own their data, identity, và digital assets directly. This paradigm shift requires rebuilding entire internet infrastructure stack - from data storage và domain names to identity systems và application hosting - using decentralized protocols resistant to censorship, manipulation, và single points of failure.

Current internet architecture, often termed Web2, centralized around massive platforms - Google, Facebook, Amazon, Microsoft - controlling servers, data, algorithms, và user relationships. Users create content, generate data, build communities, but platforms own everything, monetize user attention, và can unilaterally change rules, ban users, hoặc shut down services. Web3 vision reverses this: users own their data cryptographically through private keys, applications run on decentralized networks, platforms reduced to interfaces rather than gatekeepers.

Historical evolution traces through distinct eras. **Web1 (1990-2004)** consisted of static websites, read-only content, decentralized protocols (HTTP, SMTP, FTP). Anyone could run server, publish content, participate freely. Decentralized in architecture but limited in functionality - no social interaction, no user-generated content dynamically, no persistent identity across sites. **Web2 (2004-present)** introduced platforms enabling user interaction - social media, cloud computing, mobile apps. Functionality exploded but centralization increased dramatically. Platforms aggregated users, data, và value, creating walled gardens controlling digital lives.

**Web3 emergence** (2014-present) attempts recapture Web1's decentralization whilst providing Web2's functionality. Ethereum smart contracts enable decentralized applications (dApps) with persistent state và programmatic logic. IPFS provides decentralized storage. ENS creates decentralized naming. Decentralized identity protocols enable self-sovereign credentials. Together, these components form infrastructure stack supporting fully decentralized applications rivaling centralized counterparts in functionality whilst preserving user sovereignty.

Core Web3 primitives include **decentralized storage** replacing cloud servers, **decentralized compute** replacing centralized hosting, **decentralized identity** replacing platform accounts, và **decentralized monetization** through tokens replacing advertising models. Each primitive addresses specific centralization vulnerability trong current web while introducing new challenges around performance, user experience, và governance.

**IPFS (InterPlanetary File System)**, created by **Juan Benet** năm 2014, pioneered content-addressed storage. Instead of addressing data by location (URLs pointing to servers), IPFS addresses data by cryptographic hash của content itself. Same content always yields same hash (CID - Content Identifier), regardless of where stored. Anyone can host content, users retrieve from whoever has it, no central servers required. This fundamental inversion eliminates link rot (content disappears when server goes down) và censorship (content persists as long as anyone pins it).

**Filecoin**, incentive layer for IPFS launched 2020, introduces economic mechanisms ensuring content persistence. Storage providers earn FIL tokens for reliably storing client data, verified through cryptographic proofs. Clients pay for storage, creating market matching supply và demand. This transforms IPFS from volunteer network into sustainable storage economy, though complexity và costs higher than centralized alternatives currently.

**ENS (Ethereum Name Service)**, launched 2017, provides decentralized alternative to DNS. Human-readable names (alice.eth) map to Ethereum addresses, IPFS hashes, hoặc arbitrary data. Ownership secured through NFTs, not ICANN registrars. Users truly own names, cannot be seized hoặc revoked arbitrarily. Integration with wallets enables replacing hexadecimal addresses với readable names, dramatically improving UX whilst maintaining decentralization.

Decentralized identity frameworks like **DID (Decentralized Identifiers)** và **Verifiable Credentials** enable self-sovereign identity. Users control cryptographic identifiers không tied to any platform. Credentials issued by trusted entities (universities, employers, governments) cryptographically signed, verifiable by anyone, stored by users directly. No central identity provider required, users present credentials selectively maintaining privacy. Standards developed by W3C provide interoperability across implementations.

---

## 2. Intuitive Understanding

Web3 architecture comparable to comparing library systems. Traditional library (Web2): central building holds all books, librarian controls access, knows what you read, can ban you. Decentralized library network (Web3): books distributed across community members' homes, anyone can host copies, lookup directory shows who has which books, request directly from current holders, no central librarian controlling access. Books addressed by content (ISBN), not location, so finding copies easy regardless of who holds them.

Content addressing in IPFS revolutionizes link semantics. Traditional URL như street address - points to location. If resident moves, address becomes invalid (link rot). IPFS CID như DNA sequence - identifies content uniquely regardless of location. Like saying "find person với this DNA" rather than "check this address." Person moves, DNA unchanged, still findable. Content moves servers, hash unchanged, still retrievable. Persistence through identity rather than location.

Filecoin storage market comparable to Airbnb for data. Instead of centralized hotel chain (AWS, Google Cloud), decentralized marketplace matches storage providers với clients. Providers offer storage space, clients pay for retention, protocol ensures delivery through cryptographic proofs. Like renting spare rooms globally rather than booking single hotel chain. Diversity increases resilience - no single provider failure affects entire network.

ENS versus DNS comparable to cryptocurrency ownership versus bank account. DNS registrations controlled by registrars, subject to government seizure, can be revoked. ENS names owned directly through private keys, truly yours like Bitcoin. No entity can seize alice.eth if Alice controls private key. Decentralized ownership versus centralized administration fundamental difference.

Decentralized identity analogous to passport versus Facebook login. Facebook controls account - can ban, change rules, require ID verification arbitrarily. Passport self-sovereign - you own document, present when needed, no platform controls. DIDs extend này to digital realm - cryptographic identifiers owned directly, credentials presented selectively, no platform intermediary. Privacy preserved through selective disclosure - prove age over 18 without revealing birthdate, prove employment without revealing salary.

Web3 application stack layers comparable to protocol stack trong networking. Just as TCP/IP provides reliable communication layer for HTTP applications, Web3 infrastructure layers enable decentralized applications. Base layer (Ethereum) provides computation và consensus. Storage layer (IPFS) provides content availability. Identity layer (ENS, DIDs) provides user primitives. Application layer (dApps) composes these primitives into user-facing services. Each layer decentralized independently, composed trustlessly.

---

## 3. Technical Foundation

IPFS architecture employs distributed hash table (DHT) for content discovery. When content added to IPFS, system computes CID (Content Identifier):

\[
\text{CID} = \text{Hash}(\text{content})
\]

Default: SHA-256, producing 256-bit identifier. Content split into blocks (256 KB default), each block hashed individually, creating merkle DAG (directed acyclic graph). Large files represented as tree of content-addressed blocks, enabling efficient partial retrieval và deduplication.

Content retrieval operates through DHT lookup. Node wanting content queries DHT for providers của specific CID. DHT (using Kademlia algorithm) routes query to nodes likely storing provider information based on XOR distance metric:

\[
d(a, b) = a \oplus b
\]

Queries forwarded to nodes minimizing XOR distance to target, logarithmic hops finding providers. Once provider identified, content retrieved directly peer-to-peer.

```python
class SimplifiedIPFS:
    """Educational IPFS implementation showing core concepts"""
    
    def __init__(self):
        self.content_store = {}  # CID -> content
        self.dht = {}  # CID -> [provider_addresses]
    
    def add(self, content):
        """Add content to IPFS"""
        import hashlib
        
        # Compute CID (content identifier)
        cid = hashlib.sha256(content.encode()).hexdigest()
        
        # Store locally
        self.content_store[cid] = content
        
        # Announce to DHT
        if cid not in self.dht:
            self.dht[cid] = []
        self.dht[cid].append('this_node')
        
        print(f"✓ Content added to IPFS")
        print(f"  CID: {cid[:32]}...")
        print(f"  Size: {len(content)} bytes")
        
        return cid
    
    def get(self, cid):
        """Retrieve content from IPFS"""
        # Check local store first
        if cid in self.content_store:
            print(f"✓ Content found locally")
            return self.content_store[cid]
        
        # Query DHT for providers
        providers = self.dht.get(cid, [])
        
        if not providers:
            print(f"✗ Content not found")
            return None
        
        # Fetch from provider
        print(f"✓ Content found on network")
        print(f"  Providers: {len(providers)}")
        
        # In real IPFS: fetch from closest provider
        return "content_from_network"
    
    def pin(self, cid):
        """Pin content (keep it available)"""
        if cid in self.content_store:
            print(f"✓ Content pinned (will persist)")
            return True
        return False

# Example usage
if __name__ == "__main__":
    print("=== IPFS Example ===\n")
    
    ipfs = SimplifiedIPFS()
    
    # Add content
    content = "Hello, decentralized web!"
    cid = ipfs.add(content)
    
    # Retrieve content
    print(f"\nRetrieving content...")
    retrieved = ipfs.get(cid)
    print(f"Content: {retrieved}")
    
    # Pin for persistence
    print(f"\nPinning content...")
    ipfs.pin(cid)
```

Filecoin proof-of-storage mechanisms ensure providers actually storing data claimed. Two primary proofs:

**Proof-of-Replication (PoRep)**: Proves provider storing physically distinct copy của data, not just original. Uses **Stacked Depth Robust (SDR)** encoding making replication necessary. Provider cannot fake storage without actually performing expensive encoding.

**Proof-of-Spacetime (PoSt)**: Proves provider continued storing data over time period. Randomly challenges provider generate proof from stored data. Cannot generate proof without actually having data, cannot predict challenges ahead of time.

Mathematical formulation for PoRep verification:

\[
\text{Verify}(\text{proof}, \text{data\_commitment}, \text{replica\_commitment}) \to \{\text{valid}, \text{invalid}\}
\]

Proof demonstrates:
1. Replica commitment derived from data commitment correctly
2. Encoding performed (cannot be bypassed)
3. Provider possesses encoded replica

ENS resolution system uses Ethereum smart contracts mapping names to resources:

```solidity
contract ENSRegistry {
    struct Record {
        address owner;
        address resolver;
        uint64 ttl;
    }
    
    mapping(bytes32 => Record) records;
    
    function setResolver(bytes32 node, address resolver) external {
        require(records[node].owner == msg.sender);
        records[node].resolver = resolver;
    }
}

contract PublicResolver {
    mapping(bytes32 => address) addresses;
    mapping(bytes32 => bytes) contenthashes;  // IPFS CID
    
    function setAddr(bytes32 node, address addr) external {
        addresses[node] = addr;
    }
    
    function setContenthash(bytes32 node, bytes memory hash) external {
        contenthashes[node] = hash;
    }
    
    function addr(bytes32 node) external view returns (address) {
        return addresses[node];
    }
}
```

Name resolution flow: alice.eth → namehash("alice.eth") → query ENS registry → get resolver contract → query resolver for address/content. All on-chain, trustlessly verifiable.

---

## 4. Mathematical / Cryptographic Formulation

Content addressing security relies on collision resistance của hash function. Probability of CID collision:

\[
P(\text{collision}) \approx \frac{n^2}{2^{257}} \text{ for } n \text{ files}
\]

With SHA-256, even with trillion files:
\[
P(\text{collision}) \approx \frac{(10^{12})^2}{2^{256}} \approx 10^{-53}
\]

Negligible! Unique addressing guaranteed.

DHT lookup complexity using Kademlia:

\[
\text{Hops} = O(\log_2 N)
\]

Where \(N\) = number of nodes. Network với 1 million nodes:
\[
\text{Hops} \approx \log_2(10^6) \approx 20
\]

Efficient routing enables scalability.

Filecoin storage proof verification:

Proof size: \(O(\log n)\) where \(n\) = data size
Verification time: \(O(\log n)\)

Efficient even for large files - 1 TB file proven with ~100 KB proof, verified in milliseconds.

---

## 5. Implementation Insight

Complete Web3 application demonstrating infrastructure integration:

```javascript
// Web3 App connecting IPFS + ENS + Ethereum

const ipfs = require('ipfs-http-client');
const { ethers } = require('ethers');

class Web3App {
    constructor() {
        this.ipfs = ipfs.create();
        this.provider = new ethers.providers.JsonRpcProvider();
        this.ensResolver = null;
    }
    
    async deployContent(htmlContent) {
        // 1. Upload to IPFS
        const result = await this.ipfs.add(htmlContent);
        const cid = result.cid.toString();
        
        console.log(`✓ Content uploaded to IPFS`);
        console.log(`  CID: ${cid}`);
        
        return cid;
    }
    
    async registerENS(name, cid) {
        // 2. Register ENS name pointing to IPFS CID
        const ensRegistry = new ethers.Contract(
            ENS_REGISTRY_ADDRESS,
            ENS_ABI,
            this.signer
        );
        
        const namehash = ethers.utils.namehash(name);
        
        // Set resolver
        await ensRegistry.setResolver(namehash, RESOLVER_ADDRESS);
        
        // Set content hash
        const resolver = new ethers.Contract(
            RESOLVER_ADDRESS,
            RESOLVER_ABI,
            this.signer
        );
        
        await resolver.setContenthash(namehash, cidToContentHash(cid));
        
        console.log(`✓ ENS registered: ${name}`);
        console.log(`  Points to: ipfs://${cid}`);
    }
    
    async resolveENS(name) {
        // 3. Resolve ENS name to IPFS content
        const resolver = await this.provider.getResolver(name);
        const contenthash = await resolver.getContentHash();
        
        // Convert to CID
        const cid = contenthashToCid(contenthash);
        
        // 4. Fetch from IPFS
        const content = await this.fetchFromIPFS(cid);
        
        console.log(`✓ Content retrieved for ${name}`);
        
        return content;
    }
    
    async fetchFromIPFS(cid) {
        const chunks = [];
        for await (const chunk of this.ipfs.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString();
    }
}

// Usage: User visits "alice.eth" in Web3 browser
// Browser resolves ENS -> gets IPFS CID -> fetches content from IPFS
// Fully decentralized! No central server!
```

Real-world Web3 applications demonstrate stack integration. **Uniswap interface** hosted on IPFS, accessible via uniswap.eth ENS name. Users interact with smart contracts on Ethereum through decentralized frontend. If Uniswap Inc disappeared entirely, application continues functioning - contracts on-chain, interface on IPFS, name on ENS, all persistent và ownerless.

---

## 6. Common Challenges / Attacks / Trade-offs

IPFS performance remains inferior to centralized CDNs. Content retrieval may take seconds when hosted by few peers versus milliseconds from geographically distributed CDN servers. **IPFS gateways** (Cloudflare, Pinata) provide HTTP access to IPFS content, improving performance but reintroducing centralization. Trade-off between pure decentralization và practical usability persistent.

Filecoin storage costs currently higher than AWS S3 (approximately 2-5× more expensive). Economic sustainability questioned - will costs decrease with scale, or fundamental overhead của decentralization means permanent premium? Network effects favor incumbents - AWS's installed base, tooling ecosystem, network effects create moat Filecoin must overcome.

**Data persistence** relies on economic incentives. If no one pays pin content, content disappears from network. Unlike AWS's SLA guarantees, IPFS persistence depends on continued interest và payment. Archival use cases challenged - cannot guarantee 100-year persistence without 100-year payment upfront. Solutions include DAOs funding public goods storage, protocol-level incentives, và cultural norms around preservation.

ENS naming collisions với traditional domains create confusion. alice.com và alice.eth completely separate, owned by different entities, potentially causing phishing attacks. Users unfamiliar with ENS may visit wrong site thinking it's official. Browser support inconsistent - some browsers resolve ENS natively, others require plugins hoặc gateways. Fragmented UX hampers adoption.

**Decentralized compute** (Ethereum smart contracts) extremely expensive compared to AWS Lambda. Simple computation costing milliseconds on AWS may cost dollars in gas on Ethereum. This limits Web3 application complexity - cannot run ML models on-chain, cannot process large datasets, must carefully minimize computation. Layer 2s và alternative architectures (Arweave's bundling) attempt address này but trade-offs remain.

Identity management complexity increases with sovereignty. Centralized platforms offer password recovery, account restoration, customer support. Web3 self-custody means losing private key loses access permanently, no recovery possible. Users bear full responsibility, requiring education và tooling far beyond current user capabilities. Solutions like social recovery (Argent wallet) reintroduce trust in recovery helpers, compromising pure self-custody.

---

## 7. Related Concepts

Web3 infrastructure connects deeply to **decentralized autonomous organizations (DAOs)** governing protocols. IPFS governed by Protocol Labs initially but transitioning toward community governance. Filecoin Plus notary system uses DAOs for storage allocation. ENS DAO controls protocol parameters through token voting. This pattern - infrastructure governed by users rather than companies - fundamental to Web3 ethos.

**Arweave** presents alternative permanent storage model. Instead of ongoing payment (Filecoin), users pay once upfront for permanent storage, funded through endowment earning interest perpetually. Mathematical model assumes storage costs decrease faster than endowment appreciation, enabling perpetual funding. Bold assumption but creative economic design. Arweave hosts permanent web archives, NFT metadata, và decentralized application frontends.

**The Graph** provides decentralized indexing and querying for blockchain data. Smart contract events và state indexed into subgraphs, developers query using GraphQL. Replaces centralized databases typically used for dApp backends. Indexers earn GRT tokens for serving queries, curators stake GRT signaling valuable subgraphs. Decentralized information retrieval completing Web3 stack.

**Ceramic Network** offers decentralized database with mutable data streams. IPFS immutable - content hash changes if content changes. Ceramic enables mutable documents with version history, suitable for user profiles, social graphs, application state. Built on IPFS với additional consensus layer managing updates.

**Push Protocol** (formerly EPNS) provides decentralized notifications. Traditional apps use Firebase Cloud Messaging hoặc Apple Push Notification Service - centralized services. Push Protocol enables wallet-to-wallet notifications via decentralized network, maintaining Web3 property không phụ thuộc centralized infrastructure.

---

## 8. ⭐ Fundamental Papers / Whitepapers

| Paper | Year | Author(s) | Contribution |
|-------|------|-----------|--------------|
| **"IPFS - Content Addressed, Versioned, P2P File System"** | 2014 | Juan Benet | IPFS protocol specification |
| **"Filecoin: A Decentralized Storage Network"** | 2017 | Protocol Labs | Incentivized storage via proofs |
| **"EIP-137: Ethereum Domain Name Service"** | 2016 | Nick Johnson | ENS specification |
| **"Decentralized Identifiers (DIDs) v1.0"** | 2021 | W3C | DID standard specification |
| **"Verifiable Credentials Data Model"** | 2021 | W3C | Credential standard |
| **"Arweave: A Protocol for Economically Sustainable Information Permanence"** | 2018 | Sam Williams, Viktor Diordiiev | Permanent storage model |

---

## 9. 🎨 Illustrations & Visual References

### Web2 vs Web3 Architecture

**Web2 Stack**:
```
User → Browser → CDN → AWS → Centralized DB → Application Server
       ↓
   Platform owns everything
```

**Web3 Stack**:
```
User → Browser → IPFS → Ethereum → Your Wallet
       ↓
   You own your data
```

### IPFS Content Addressing
![IPFS Content Addressing](https://docs.ipfs.tech/assets/img/ipfs-illustration-works.png)  
*Source: [IPFS Documentation](https://docs.ipfs.tech/concepts/)*

### ENS Resolution Flow
![ENS Resolution](https://docs.ens.domains/img/ens-architecture.png)  
*Source: [ENS Documentation](https://docs.ens.domains/)*

### Decentralized Identity Stack
![DID Architecture](https://www.w3.org/TR/did-core/diagrams/did-architecture.svg)  
*Source: [W3C DID Specification](https://www.w3.org/TR/did-core/)*

### Interactive Tools
- [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/) - Run IPFS node locally
- [ENS Manager](https://app.ens.domains/) - Register và manage ENS names
- [Etherscan ENS](https://etherscan.io/enslookup) - Lookup ENS names
- [Fleek](https://fleek.co/) - Deploy Web3 sites easily

---

## 10. Summary

Web3 infrastructure provides decentralized alternatives to centralized internet components - IPFS replacing cloud storage, ENS replacing DNS, DIDs replacing platform accounts, Filecoin incentivizing content persistence. Together these primitives enable applications running entirely on decentralized networks, resistant to censorship và platform control whilst preserving user data ownership.

Technical implementations leverage content addressing (IPFS), cryptographic ownership (ENS as NFTs), zero-knowledge proofs (selective credential disclosure), và token economics (Filecoin storage markets). Trade-offs include performance degradation versus centralized alternatives, higher costs currently, increased complexity in user experience, và uncertain long-term sustainability models.

Despite challenges, Web3 infrastructure maturing rapidly. Production applications serving millions of users demonstrate viability. Standards emerging (W3C DIDs, ERC standards) enable interoperability. As tooling improves và costs decrease through scaling solutions, Web3 promises realizing internet's original decentralization vision whilst adding programmability và ownership guarantees impossible in Web2 paradigm.

---

✅ **End of Lecture**

Next: Lecture 07.03 - MEV (Maximal Extractable Value)

---

## References

1. Benet, J. (2014). *IPFS - Content Addressed, Versioned, P2P File System*. IPFS Whitepaper.
2. Protocol Labs. (2017). *Filecoin: A Decentralized Storage Network*. Filecoin Whitepaper.
3. Johnson, N. (2016). *EIP-137: Ethereum Domain Name Service - Specification*. Ethereum Improvement Proposals.
4. W3C. (2021). *Decentralized Identifiers (DIDs) v1.0*. W3C Recommendation.
5. W3C. (2021). *Verifiable Credentials Data Model v1.0*. W3C Recommendation.

