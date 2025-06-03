export interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string | number;
}

export interface RuleGroup {
  id: string;
  combinator: 'AND' | 'OR';
  rules: (Rule | RuleGroup)[];
}

export interface Segment {
  id: string;
  name: string;
  rules: RuleGroup;
  audienceSize: number;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  message: string;
  audienceSize: number;
  sent: number;
  failed: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
}

export interface DeliveryLog {
  id: string;
  campaignId: string;
  customerId: string;
  status: 'SENT' | 'FAILED';
  timestamp: Date;
} 