export type Orientation = 'Male Model' | 'Gay' | 'Bisexual' | string;

export type LookingFor = 'Friendship' | 'Conversation' | 'Dating' | 'Relationship';

export interface UserProfile {
  id: string;
  username: string;
  age: number;
  orientation: Orientation;
  distanceKm: number;
  bio: string;
  interests: string[];
  lookingFor: LookingFor[];
  avatar: string;
  additionalPhotos?: string[];
  isVerified?: boolean;
  isOnline?: boolean;
  lastActive?: string;
  // Private contact field — ONLY accessible via /api/contacts/:profileId after payment verification
  whatsappNumber?: string;
  isBlocked?: boolean;
  unlockPrice?: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  age: number;
  orientation: Orientation;
  bio?: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface StoredUser extends AuthUser {
  passwordHash?: string;
}

export interface LikeRecord {
  id: string;
  userId: string;
  profileId: string;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  userId: string;
  profileId: string;
  matchedAt: string;
  profile: UserProfile;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number; // ₹499
  status: 'created' | 'pending' | 'verified' | 'failed';
  createdAt: string;
}

export interface ContactUnlock {
  id: string;
  userId: string;
  profileId: string;
  paymentId: string;
  unlockedAt: string;
  whatsappUrl?: string;
}

export interface UserReport {
  id: string;
  reporterUserId: string;
  reportedProfileId: string;
  reportedProfileName: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface AdminStats {
  totalUsers: number;
  newSignups: number;
  activeUsers: number;
  totalRevenue: number;
  totalLikes: number;
  totalMatches: number;
  contactUnlocks: number;
  pendingReports: number;
}
