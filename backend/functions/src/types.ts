export interface StudentRecord {
  registerNumber: string;
  attendance: number;
  sleepHours: number;
  riskStatus: "Normal" | "At Risk";
  updatedAt: number;
}
