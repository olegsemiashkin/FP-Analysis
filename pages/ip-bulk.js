import React from 'react';

export default function BulkIP({ ips }) {
  return (
    <div style={{ margin: "0 auto", maxWidth: "98vw", padding: 0 }}>
      <div style={{ overflowX: "auto" }}>
        <table className="bulk-table" style={{ minWidth: 1050, width: "100%", borderCollapse: "separate" }}>
          <colgroup>
            <col style={{ width: "15%" }} />   {/* IP */}
            <col style={{ width: "11%" }} />   {/* Country */}
            <col style={{ width: "12%" }} />   {/* City */}
            <col style={{ width: "8%" }} />    {/* Proxy */}
            <col style={{ width: "8%" }} />    {/* VPN */}
            <col style={{ width: "8%" }} />    {/* TOR */}
            <col style={{ width: "28%" }} />   {/* Org/ISP */}
            <col style={{ width: "10%" }} />   {/* Details */}
          </colgroup>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>IP</th>
              <th style={{ textAlign: "left" }}>Country</th>
              <th style={{ textAlign: "left" }}>City</th>
              <th style={{ textAlign: "left" }}>Proxy</th>
              <th style={{ textAlign: "left" }}>VPN</th>
              <th style={{ textAlign: "left" }}>TOR</th>
              <th style={{ textAlign: "left" }}>Org/ISP</th>
              <th style={{ textAlign: "left" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {ips && ips.length ? ips.map((ip, i) => (
              <tr key={ip.address || i}>
                <td>{ip.address}</td>
                <td>{ip.country}</td>
                <td>{ip.city}</td>
                <td style={{ color: ip.proxy ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                  {ip.proxy ? 'Yes' : 'No'}
                </td>
                <td style={{ color: ip.vpn ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                  {ip.vpn ? 'Yes' : 'No'}
                </td>
                <td style={{ color: ip.tor ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                  {ip.tor ? 'Yes' : 'No'}
                </td>
                <td>{ip.isp}</td>
                <td>
                  <a href={`/details/${ip.address}`} style={{ color: "#e95a16" }}>▶ Details</a>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
