import { useEffect, useState } from "react";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const [logs, setLogs] = useState([]);

  async function login() {
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASS) setOk(true);
    else alert("Wrong password");
  }

  useEffect(() => {
    if (ok) {
      fetch("/api/logs").then(r => r.json()).then(setLogs);
    }
  }, [ok]);

  if (!ok)
    return (
      <main>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Admin password"
        />
        <button onClick={login}>Войти</button>
      </main>
    );

  return (
    <main>
      <h1>Device/IP Logs</h1>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </main>
  );
}
