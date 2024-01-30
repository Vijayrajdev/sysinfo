const si = require("systeminformation");
const fs = require("fs");

async function generateSystemInfo() {
  try {
    // Fetch dynamic system metrics including network interfaces
    const [cpu, mem, disks, networkInterfaces] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkInterfaces(),
    ]);

    // Format dynamic metrics with conditional checks
    const cpuUsage = cpu ? cpu.currentLoad.toFixed(2) + "%" : "N/A";
    const ramUsage = mem
      ? (mem.used / 1024 / 1024 / 1024).toFixed(2) + " GB"
      : "N/A";
    const romUsage = disks[0]
      ? (disks[0].used / 1024 / 1024 / 1024).toFixed(2) + " GB"
      : "N/A";

    // Find the WiFi interface and extract relevant details
    const wifiInterface = networkInterfaces.find(
      (interface) => interface.type === "wireless"
    );
    const wifiSpeed = wifiInterface ? wifiInterface.speed + " Mbps" : "N/A";

    // Generate README content with dynamic metrics and WiFi speed
    const markdownContent = `
# 🖥️ System Monitor 📊

This Monitor note provides real-time system metrics for monitoring your system's performance.

## 📊 Metrics Overview

| Metric                    | Value             |
| ------------------------- | ----------------- |
| 🖥️ CPU Usage              | ${cpuUsage}       |
| 💾 RAM Usage              | ${ramUsage}       |
| 💽 ROM Usage              | ${romUsage}       |
| 🌐 WiFi Speed             | ${wifiSpeed}      |

## ℹ️ Detailed Information

### 🖥️ CPU Usage

- **Current Usage**: ${cpuUsage}
- **Cores**: ${cpu ? cpu.cpus.length : "N/A"}

### 💾 RAM Usage

- **Used Memory**: ${ramUsage}
- **Total Memory**: ${
      mem ? (mem.total / 1024 / 1024 / 1024).toFixed(2) + " GB" : "N/A"
    }

### 💽 ROM Usage

- **Used Space**: ${romUsage}
- **Total Space**: ${
      disks[0] ? (disks[0].size / 1024 / 1024 / 1024).toFixed(2) + " GB" : "N/A"
    }

### 🌐 WiFi Speed

- **WiFi Speed**: ${wifiSpeed}

## 📝 Instructions

- This Monitor note is automatically updated to provide the latest system metrics.
- To view historical data, check the commit history of this file.
`;

    // Write dynamic README content to file
    fs.writeFileSync("README.md", markdownContent);
  } catch (error) {
    console.error("Error generating system information:", error);
  }
}

generateSystemInfo();
