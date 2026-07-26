export interface InspectionRecord {
  id: string;
  date: string;
  driverLastName: string;
  driverFirstName: string;
  vehiclePlate?: string;
  status: 'VALID' | 'WARNING' | 'BLOCKED' | 'PENDING';
  blockingReason?: string;
  assuranceDate?: string;
  documentsExpiredCount?: number;
}