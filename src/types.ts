export type JobStatus = 'Applied' | 'Interview' | 'Assessment' | 'Offer' | 'Rejected' | 'Hired';

export interface UserProfile {
  uid: string;
  fullName: string;
  bio: string;
  contactNumber: string;
  profilePhoto?: string;
  resumeUrl?: string;
  cvUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  updatedAt: number;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  status: JobStatus;
  appliedDate: number;
  notes?: string;
}

export interface ScanHistory {
  id: string;
  userId: string; // The QR owner
  scannedAt: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface JobFair {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}
