export class TimesheetMetricsDto {
  id?: number;
  date?: string;
  totalTasks?: number;
  workedHours?: string;
  averageRating?: number;
}

export interface TimesheetMetrics {
  id: number;
  date: string;
  totalTasks: number;
  workedHours: number;
  averageRating: number;
}

export type Metrics = Omit<TimesheetMetrics, 'id' | 'date'>;

export type TimesheetAverageMetrics = Metrics & {
  total: number;
  dayAvgs: Metrics;
  weekAvgs: Metrics;
};

export interface TimesheetMetricsStore {
  byDate: Record<string, TimesheetMetrics | undefined>;
  dates: string[];
}
