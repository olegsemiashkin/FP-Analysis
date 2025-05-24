import { useEffect, useState } from "react";

export default function Home() {
  const [visitorId, setVisitorId] = useState('');
  const [ip, setIp] = useState('');
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');

  useEffect(() => {
    // Новый FingerprintJS
    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(fp => {
        fp.get().then(result => {
          setVisitorId(result.visitorId);
        });
      });
    });

    fetch("/api/myip")
      .then(res => res.json())
      .then(data => setIp(data.ip));

    setBrowser(navigator.userAgent);
    setOs(navigator.platform);
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>FP-Analysis: Device & IP Tools</h1>
      <div>
        <strong>Visitor ID:</strong> {visitorId || "Calculating..."}
      </div>
      <div>
        <strong>Your IP:</strong> {ip}
      </div>
      <div>
        <strong>Browser:</strong> {browser}
      </div>
      <div>
        <strong>OS:</strong> {os}
      </div>
    </div>
  );
}
