export interface Violation {
  id: string;
  plateNumber: string;
  timestamp: string;
  location: string;
  status: 'pending_review' | 'verified' | 'ticket_issued' | 'appealed';
  videoUrl: string;
  boundingBoxVerified: boolean;
  officerName: string;
}

export const mockViolations: Violation[] = [
  {
    id: 'VIO-2024-001',
    plateNumber: 'ABC-1234',
    timestamp: '2024-01-15 14:23:45',
    location: 'EDSA cor. Makati Ave',
    status: 'verified',
    videoUrl: '/videos/violation-001.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Garcia',
  },
  {
    id: 'VIO-2024-002',
    plateNumber: 'XYZ-5678',
    timestamp: '2024-01-15 15:45:12',
    location: 'Commonwealth Ave, Quezon City',
    status: 'ticket_issued',
    videoUrl: '/videos/violation-002.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Santos',
  },
  {
    id: 'VIO-2024-003',
    plateNumber: 'MNO-9012',
    timestamp: '2024-01-15 16:10:30',
    location: 'Bonifacio Drive, BGC',
    status: 'pending_review',
    videoUrl: '/videos/violation-003.mp4',
    boundingBoxVerified: false,
    officerName: 'Officer Reyes',
  },
  {
    id: 'VIO-2024-004',
    plateNumber: 'PQR-3456',
    timestamp: '2024-01-15 17:22:15',
    location: 'C5 Southbound, Mandaluyong',
    status: 'verified',
    videoUrl: '/videos/violation-004.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Garcia',
  },
  {
    id: 'VIO-2024-005',
    plateNumber: 'STU-7890',
    timestamp: '2024-01-15 18:00:45',
    location: 'Binondo-Intramuros Bridge',
    status: 'appealed',
    videoUrl: '/videos/violation-005.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Tan',
  },
  {
    id: 'VIO-2024-006',
    plateNumber: 'VWX-1123',
    timestamp: '2024-01-16 08:15:30',
    location: 'Ayala Avenue, Makati',
    status: 'ticket_issued',
    videoUrl: '/videos/violation-006.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Santos',
  },
  {
    id: 'VIO-2024-007',
    plateNumber: 'YZA-4567',
    timestamp: '2024-01-16 09:30:22',
    location: 'South Superhighway, Parañaque',
    status: 'pending_review',
    videoUrl: '/videos/violation-007.mp4',
    boundingBoxVerified: false,
    officerName: 'Officer Reyes',
  },
  {
    id: 'VIO-2024-008',
    plateNumber: 'BCD-8901',
    timestamp: '2024-01-16 10:45:00',
    location: 'Cebu Port Authority Road',
    status: 'verified',
    videoUrl: '/videos/violation-008.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Cruz',
  },
  {
    id: 'VIO-2024-009',
    plateNumber: 'EFG-2345',
    timestamp: '2024-01-16 12:10:15',
    location: 'Davao Boulevard, Davao City',
    status: 'ticket_issued',
    videoUrl: '/videos/violation-009.mp4',
    boundingBoxVerified: true,
    officerName: 'Officer Morales',
  },
  {
    id: 'VIO-2024-010',
    plateNumber: 'HIJ-6789',
    timestamp: '2024-01-16 13:25:45',
    location: 'Marcos Highway, Antipolo',
    status: 'pending_review',
    videoUrl: '/videos/violation-010.mp4',
    boundingBoxVerified: false,
    officerName: 'Officer Garcia',
  },
];

export const dashboardStats = {
  totalViolations: 148,
  todayViolations: 10,
  ticketsIssued: 89,
  pendingReview: 35,
  appealedCases: 5,
};

export const violationsTrendData = [
  { date: 'Jan 10', violations: 8, resolved: 5 },
  { date: 'Jan 11', violations: 12, resolved: 8 },
  { date: 'Jan 12', violations: 15, resolved: 11 },
  { date: 'Jan 13', violations: 10, resolved: 7 },
  { date: 'Jan 14', violations: 18, resolved: 14 },
  { date: 'Jan 15', violations: 16, resolved: 12 },
  { date: 'Jan 16', violations: 10, resolved: 8 },
];

export const violationsByLocationData = [
  { location: 'EDSA', violations: 28 },
  { location: 'Commonwealth Ave', violations: 22 },
  { location: 'South Superhighway', violations: 18 },
  { location: 'BGC Roads', violations: 15 },
  { location: 'Cebu Port Road', violations: 12 },
  { location: 'Davao Boulevard', violations: 9 },
  { location: 'Others', violations: 44 },
];

export const violationStatusData = [
  { status: 'Verified', count: 64 },
  { status: 'Pending Review', count: 35 },
  { status: 'Ticket Issued', count: 42 },
  { status: 'Appealed', count: 7 },
];
