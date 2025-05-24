// pages/ip-bulk.js

import React from 'react';

export default function BulkIP({ ips }) {
  return (
    <div style={{ margin: "0 auto", maxWidth: 1200 }}>
      <table className="bulk-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Country</th>
            <th>City</th>
            <th>VPN/Proxy</th>
            <th>Org/ISP</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {ips && ips.length ? ips.map((ip, i) => (
            <tr key={ip.address || i}>
              <td>{ip.address}</td>
              <td>{ip.country}</td>
              <td>{ip.city}</td>
              <td style={{ color: (ip.proxy || ip.vpn) ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                {(ip.proxy || ip.vpn) ? (ip.proxy ? "Proxy" : "VPN") : "Clean"}
              </td>
              <td>{ip.isp}</td>
              <td>
                <a href={`/details/${ip.address}`} style={{ color: "#e95a16" }}>▶ Details</a>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
