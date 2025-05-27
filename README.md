# 🕵️‍♂️ Inspectify: Bulk IP & Crypto Address AML Analyzer

**Inspectify** is a modern online tool for analyzing IP addresses **and cryptocurrency wallets** — designed for anti-fraud, AML (Anti-Money Laundering), and cybersecurity professionals.

🌐 **Live Demo:** [https://inspectify-cyan.vercel.app/](https://inspectify-cyan.vercel.app/)  
💻 **GitHub:** [https://github.com/olegsemiashkin/Inspectify](https://github.com/olegsemiashkin/Inspectify)

---

## 🚀 Features

### **Bulk IP Check** Tab
- **Mass IP Analysis** — Upload up to 50 IP addresses at once to instantly get an extended report on each.
- **Key Insights**: country, city, ISP, VPN, Proxy, TOR, Fraud Score, abuse flags, and other risk factors.
- **Details** — Click "Details" to view a full JSON report for advanced users.
- **Automatic Extraction** — Instantly extracts IP addresses from any pasted text.

### **Crypto Address AML Analysis** Tab  *(NEW!)*
- **Supports all major blockchains:** BTC, ETH, LTC, BCH, DOGE, DASH, ZEC, XRP.
- **Risk Score** — Instantly see if an address is “Trusted”, “Medium Risk”, or “High Risk” based on public blacklists and transaction patterns.
- **Risk breakdown** — Analysis by category: Dark Market, Mixer, Exchange, etc.
- **Live transaction stats** — Get key info: total transactions, unique interactions, first/last activity, received/sent funds.
- **One click to advanced tools:** Easily open MetaSleuth, Etherscan, Blockchair, Breadcrumbs for deeper investigations.
- **Open-source logic** — No API key required for blockchains except ETH; analysis is based on open, public data.

### Device Analysis *(in development)*
- Analyze device fingerprint, browser, OS, and hidden parameters.

---

## 🛡️ Who is this for?

- **Anti-Fraud:** Detect suspicious IPs, wallets, anonymizers, risky crypto funds, and bypass tools.
- **AML:** Speed up KYC/AML checks by flagging risky IPs and wallet addresses.
- **Cybersecurity:** Prevent attacks, phishing, and fraud from high-risk sources.
- **Traffic Quality:** Filter bots and click-fraud in ad or affiliate traffic.

---

## 🤖 How does it work?

- **IP Analysis:** Combines data from multiple APIs (IPinfo, IPQualityScore, etc.) for each address.
- **Crypto AML:** Checks every crypto wallet address against public blacklists, risk sources, and fetches transaction history in real-time.
- **No registration required.** Just paste, analyze, and get results.

---

## ⚡ Example Use Cases

- Bulk screening of customer IPs and wallet addresses before onboarding/AML.
- Fast filtering of affiliate traffic and new users for fraud/AML risk.
- Manual or automated analysis of incidents, crypto fund flows, and attacks.

---

## 🔒 Disclaimer

Inspectify is a research and demo project; results may depend on third-party and public APIs, which can change.

---

## 👨‍💻 Roadmap

- Further improve Crypto AML tab (multi-chain support, more heuristics)
- Expand Device Analysis tab (fingerprinting, browser details)
- OSINT, email/phone enrichment, export (CSV, PDF)
- Telegram bot integration

---

**Open for collaboration and further development — suggestions are welcome!**

---

> _This project is open-source. Feel free to use, fork, and contribute!_
