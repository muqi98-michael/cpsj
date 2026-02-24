export interface AttachmentFile {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
}

export interface Scene {
  id: string;
  code: string;
  title: string;
  description: string;
  painPoint: string;
  industry: string;
  industryColor: string;
  iconBg: string;
  iconColor: string;
  solutionCount: number;
  caseCount: number;
  status: '已完善' | '待完善' | '进行中';
  tags: string[];
  createdAt: string;
  product?: string;
  coverImage?: string;
  attachments?: AttachmentFile[];
}

export interface Solution {
  id: string;
  title: string;
  version?: string;
  description: string;
  industry: string;
  industryColor: string;
  industryBg: string;
  fileType: string;
  fileSize?: string;
  relatedScene: string;
  updatedAt: string;
  createdAt?: string;
  author?: string;
  authorDept?: string;
  downloads?: number;
  views?: number;
  tags?: string[];
  status?: '已发布' | '审核中' | '草稿';
  applicableProducts?: string[];
  coverImage?: string;
  attachments?: AttachmentFile[];
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  industry: string;
  industryColor: string;
  industryBg: string;
  coverColor: string;
  metrics: {
    value: string;
    label: string;
  }[];
  coverImage?: string;
  attachments?: AttachmentFile[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  active?: boolean;
}

export type IndustryFilter = '全部行业' | '金融' | '制造' | '零售' | '医疗健康' | '教育';
