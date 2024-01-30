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


### ✍️ Additional Information

- **Note**: This information reflects the specifications of the virtual machine (VM) being used and may not accurately represent your local environment.
- **CPU**: The CPU is equipped with  ${
      cpu ? cpu.cpus.length : "N/A"
    } virtual CPUs running on an Intel Xeon processor with a clock speed of 2.3 GHz.
- **RAM**: The system is provisioned with ${
      mem
        ? (mem.total / 1024 / 1024 / 1024).toFixed(2) + " gigabytes (GB)"
        : "N/A"
    } of RAM.
- **Storage**: The VM is equipped with a ${
      disks[0] ? (disks[0].size / 1024 / 1024 / 1024).toFixed(2) + " GB" : "N/A"
    } solid-state drive (SSD).

## 📝 Instructions

- This Monitor note provides real-time system specifications for the current environment.
- It is important to note that the accuracy of the specifications depends on the environment where the script is executed.
- For local machines, the specifications will accurately reflect the hardware specifications.
`;

    // Write dynamic README content to file
    fs.writeFileSync("README.md", markdownContent);
  } catch (error) {
    console.error("Error generating system information:", error);
  }
}

generateSystemInfo();
