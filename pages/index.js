import { useEffect, useState } from "react";

export default function Home() {
  const [fingerprint, setFingerprint] = useState("");
  const [ip, setIp] = useState("");
  const [device, setDevice] = useState("");

  useEffect(() => {
    import("fingerprintjs2").then(Fingerprint2 => {
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        setFingerprint(Fingerprint2.x64hash128(values.join(""), 31));
        setDevice(JSON.stringify(components, null, 2));
      });
    });

    fetch("/api/myip").then(res => res.json()).then(data => setIp(data.ip));
  }, []);

  return (
    <main style={{ padding: 30 }}>
      <h1>Device & IP Analysis</h1>
      <h2>Fingerprint: {fingerprint}</h2>
      <h3>Your IP: {ip}</h3>
      <details>
        <summary>Device details</summary>
        <pre style={{textAlign: "left"}}>{device}</pre>
      </details>
    </main>
  );
}
