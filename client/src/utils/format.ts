export function formatDate(date: Date): string {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  }
  
  export function formatUptime(uptime: number): string {
    return `${uptime.toFixed(2)}%`
  }
  
  