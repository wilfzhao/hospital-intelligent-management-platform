
export interface ProgressPhase {
  id: string;
  date: string;
  content: string;
  reporter: string;
  status: '未启动' | '推进中' | '已办结';
  attachments?: string[];
}

export interface TrackingItem {
  id: string;
  issue: number;
  discipline: string;
  itemNo: string;
  agreedMatter: string;
  leadDept: string;
  supportingDepts: string[];
  completionTier?: '短期' | '中期' | '中长期' | '长期';
  agreedCompletionTime: string;
  deliverable?: string;
  feedbackFrequency: '月度' | '季度';
  status: '未启动' | '推进中' | '已办结';
  isRevoked?: boolean;
  lastFeedbackDate: string;
  progressHistory?: ProgressPhase[];
}

export interface LedgerItem {
  id: string;
  issue: number;
  year?: string;
  meetingDate: string;
  reportedDiscipline: string;
  reporter: string;
  agreedMattersCount: number;
  progress: string; // "x/y"
  overallStatus: string;
  lastUpdated: string;
  attachments?: string[];
}
