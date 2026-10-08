import { UserProfile, LikeRecord, MatchRecord, ChatMessage, PaymentTransaction, ContactUnlock, UserReport, AdminStats, AuthUser, StoredUser } from '@/types';
import { INITIAL_DEMO_PROFILES, DEFAULT_DEMO_USER } from './data';
import fs from 'fs';
import path from 'path';
import { connectToDatabase, isMongoConfigured } from './mongodb';
import { ProfileModel } from '@/models/Profile';
import { UserModel } from '@/models/User';
import { PaymentModel } from '@/models/Payment';
import { ContactUnlockModel } from '@/models/ContactUnlock';
import { LikeModel } from '@/models/Like';
import { MatchModel } from '@/models/Match';
import { MessageModel } from '@/models/Message';
import { ReportModel } from '@/models/Report';

interface StorageState {
  profiles: UserProfile[];
  users: StoredUser[];
  likes: LikeRecord[];
  matches: MatchRecord[];
  messages: ChatMessage[];
  payments: PaymentTransaction[];
  contactUnlocks: ContactUnlock[];
  reports: UserReport[];
}

// In-memory + local JSON file persistence cache
let globalState: StorageState | null = null;
const DATA_FILE_PATH = path.join(process.cwd(), 'data-storage.json');

function initializeDefaultState(): StorageState {
  // Pre-seed some initial realistic activity matching the admin mockup (₹1,24,680 revenue etc.)
  const seededPayments: PaymentTransaction[] = [
    {
      id: 'tx_101',
      userId: 'user_99',
      profileId: 'male-1',
      profileName: 'Arjun',
      razorpayOrderId: 'order_B2B_101',
      razorpayPaymentId: 'pay_B2B_verified_101',
      amount: 299,
      status: 'verified',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'tx_102',
      userId: 'user_98',
      profileId: 'male-2',
      profileName: 'Karthik',
      razorpayOrderId: 'order_B2B_102',
      razorpayPaymentId: 'pay_B2B_verified_102',
      amount: 299,
      status: 'verified',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];

  const seededUnlocks: ContactUnlock[] = [];

  const seededMessages: ChatMessage[] = [];

  const seededMatches: MatchRecord[] = [];

  const seededLikes: LikeRecord[] = [];

  return {
    profiles: [...INITIAL_DEMO_PROFILES],
    users: [],
    likes: seededLikes,
    matches: seededMatches,
    messages: seededMessages,
    payments: seededPayments,
    contactUnlocks: seededUnlocks,
    reports: []
  };
}

let isMongoInitialized = false;

async function initMongoSync() {
  if (!isMongoConfigured() || isMongoInitialized) return;
  try {
    const conn = await connectToDatabase();
    if (!conn) return;
    isMongoInitialized = true;

    // Check if profiles exist in MongoDB; if not, seed initial profiles
    const count = await ProfileModel.countDocuments();
    if (count === 0 && globalState?.profiles) {
      await ProfileModel.insertMany(globalState.profiles.map(p => ({ ...p })));
      console.log('Seeded initial profiles into MongoDB');
    } else if (count > 0) {
      const dbProfiles = await ProfileModel.find({}).lean();
      if (globalState && dbProfiles.length > 0) {
        globalState.profiles = dbProfiles.map((p: any) => ({
          id: p.id,
          username: p.username,
          age: p.age,
          orientation: p.orientation,
          distanceKm: p.distanceKm,
          bio: p.bio,
          interests: p.interests || [],
          lookingFor: p.lookingFor || [],
          avatar: p.avatar,
          additionalPhotos: p.additionalPhotos || [],
          isVerified: p.isVerified,
          isOnline: p.isOnline,
          lastActive: p.lastActive,
          whatsappNumber: p.whatsappNumber,
          isBlocked: p.isBlocked,
          unlockPrice: p.unlockPrice
        }));
      }
    }
  } catch (err) {
    console.error('MongoDB sync init error:', err);
  }
}

function asyncSyncToMongo(state: StorageState) {
  if (!isMongoConfigured()) return;
  connectToDatabase().then(async (conn) => {
    if (!conn) return;
    try {
      for (const p of state.payments) {
        await PaymentModel.updateOne({ id: p.id }, { $set: p }, { upsert: true }).catch(() => {});
      }
      for (const u of state.contactUnlocks) {
        await ContactUnlockModel.updateOne({ id: u.id }, { $set: u }, { upsert: true }).catch(() => {});
      }
      for (const user of state.users) {
        await UserModel.updateOne({ id: user.id }, { $set: user }, { upsert: true }).catch(() => {});
      }
      for (const l of state.likes) {
        await LikeModel.updateOne({ id: l.id }, { $set: l }, { upsert: true }).catch(() => {});
      }
      for (const m of state.messages) {
        await MessageModel.updateOne({ id: m.id }, { $set: m }, { upsert: true }).catch(() => {});
      }
      for (const r of state.reports) {
        await ReportModel.updateOne({ id: r.id }, { $set: r }, { upsert: true }).catch(() => {});
      }
    } catch (e) {
      console.error('MongoDB async update error:', e);
    }
  }).catch(() => {});
}

function getState(): StorageState {
  if (isMongoConfigured() && !isMongoInitialized) {
    initMongoSync().catch(() => {});
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      globalState = JSON.parse(data);
      return globalState!;
    }
  } catch (e) {
    console.error('Failed to read data file, using default state', e);
  }

  if (globalState) return globalState;

  globalState = initializeDefaultState();
  saveState();
  return globalState;
}

function saveState() {
  if (!globalState) return;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(globalState, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write data file', e);
  }
  asyncSyncToMongo(globalState);
}

export const db = {
  // Users & Authentication
  findUserByUsernameOrEmail(identifier: string): StoredUser | null {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    const state = getState();
    return state.users.find(u =>
      u.username.toLowerCase() === clean ||
      (u.email && u.email.toLowerCase() === clean)
    ) || null;
  },

  findUserById(id: string): AuthUser | null {
    if (!id) return null;
    const state = getState();
    const user = state.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser as AuthUser;
  },

  createUser(userData: StoredUser): AuthUser {
    const state = getState();
    const existing = state.users.find(u =>
      u.username.toLowerCase() === userData.username.toLowerCase() ||
      (userData.email && u.email && u.email.toLowerCase() === userData.email.toLowerCase())
    );
    if (existing) {
      throw new Error('A user with this username or email already exists.');
    }
    state.users.push(userData);
    saveState();
    const { passwordHash, ...safeUser } = userData;
    return safeUser as AuthUser;
  },

  updateUser(userId: string, data: Partial<AuthUser>): AuthUser | null {
    const state = getState();
    const userIndex = state.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    state.users[userIndex] = {
      ...state.users[userIndex],
      ...data
    };
    saveState();
    const { passwordHash, ...safeUser } = state.users[userIndex];
    return safeUser as AuthUser;
  },

  // Profiles
  getProfiles(options?: { orientation?: string; maxDistance?: number; query?: string; currentUserId?: string }): UserProfile[] {
    const state = getState();
    let list = state.profiles.filter(p => !p.isBlocked);

    if (options?.orientation && options.orientation !== 'All') {
      list = list.filter(p => p.orientation.toLowerCase() === options.orientation?.toLowerCase());
    }

    if (options?.maxDistance && options.maxDistance > 0) {
      list = list.filter(p => p.distanceKm <= options.maxDistance!);
    }

    if (options?.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(p =>
        p.username.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.interests.some(i => i.toLowerCase().includes(q))
      );
    }

    // Sanitize: NEVER return raw whatsappNumber in discover/browse list
    return list.map(p => {
      const { whatsappNumber, ...safeProfile } = p;
      return safeProfile as UserProfile;
    });
  },

  getProfileById(id: string): UserProfile | null {
    const state = getState();
    const p = state.profiles.find(item => item.id === id);
    if (!p) return null;
    // Strip whatsappNumber for public view
    const { whatsappNumber, ...safeProfile } = p;
    return safeProfile as UserProfile;
  },

  // Raw internal profile (only used by payment/contact unlock route)
  getRawProfileById(id: string): UserProfile | null {
    const state = getState();
    return state.profiles.find(item => item.id === id) || null;
  },

  // Likes & Matching
  toggleLike(userId: string, profileId: string): { liked: boolean; isMatch: boolean; profile?: UserProfile } {
    const state = getState();
    const existingIndex = state.likes.findIndex(l => l.userId === userId && l.profileId === profileId);

    if (existingIndex >= 0) {
      state.likes.splice(existingIndex, 1);
      // Remove match if any
      state.matches = state.matches.filter(m => !(m.userId === userId && m.profileId === profileId));
      saveState();
      return { liked: false, isMatch: false };
    }

    // Add like
    state.likes.push({
      id: `like_${Date.now()}`,
      userId,
      profileId,
      createdAt: new Date().toISOString()
    });

    const targetProfile = state.profiles.find(p => p.id === profileId);

    // Check if mutual like or automatic match trigger for demo experience
    // In our demo, liking profile male-1, male-2, or male-3 triggers a high-conversion mutual match
    const isMutual = state.likes.some(l => l.userId === profileId && l.profileId === userId) ||
                     ['male-1', 'male-2', 'male-3', 'male-4', 'male-6'].includes(profileId);

    let isMatch = false;
    if (isMutual && targetProfile) {
      isMatch = true;
      const matchExists = state.matches.some(m => m.userId === userId && m.profileId === profileId);
      if (!matchExists) {
        state.matches.push({
          id: `match_${Date.now()}`,
          userId,
          profileId,
          matchedAt: new Date().toISOString(),
          profile: targetProfile
        });
      }
    }

    saveState();
    return { liked: true, isMatch, profile: targetProfile };
  },

  getUserLikes(userId: string): string[] {
    const state = getState();
    return state.likes.filter(l => l.userId === userId).map(l => l.profileId);
  },

  getUserMatches(userId: string): MatchRecord[] {
    const state = getState();
    return state.matches.filter(m => m.userId === userId);
  },

  // Messaging
  getMessagesBetween(userA: string, userB: string): ChatMessage[] {
    const state = getState();
    return state.messages.filter(m =>
      (m.senderId === userA && m.receiverId === userB) ||
      (m.senderId === userB && m.receiverId === userA)
    );
  },

  sendMessage(senderId: string, receiverId: string, text: string): ChatMessage {
    const state = getState();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    state.messages.push(newMsg);
    saveState();
    return newMsg;
  },

  // Razorpay Payments & Contact Unlocks
  createPaymentOrder(userId: string, profileId: string, amount: number = 499) {
    const state = getState();
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) throw new Error('Profile not found');

    const orderId = `order_b2b_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const tx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      profileId,
      profileName: profile.username,
      razorpayOrderId: orderId,
      razorpayPaymentId: '',
      amount,
      status: 'created',
      createdAt: new Date().toISOString()
    };
    state.payments.push(tx);
    saveState();

    return {
      orderId,
      amount,
      currency: 'INR',
      keyId: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.startsWith('rzp_test_'))
        ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        : 'rzp_live_TlJDgRJz0sQAhB',
      profileName: profile.username
    };
  },

  createPendingUnlockRequest(userId: string, profileId: string, amount: number = 499) {
    const state = getState();
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) throw new Error('Profile not found');

    const orderId = `order_b2b_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const tx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      profileId,
      profileName: profile.username,
      razorpayOrderId: orderId,
      razorpayPaymentId: `pay_wait_${Date.now()}`,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    state.payments.push(tx);
    saveState();
    return tx;
  },

  approvePayment(transactionId: string) {
    const state = getState();
    const payment = state.payments.find(p => p.id === transactionId);
    if (!payment) throw new Error('Transaction not found');
    payment.status = 'verified';

    const profile = state.profiles.find(p => p.id === payment.profileId);
    const alreadyUnlocked = state.contactUnlocks.some(u => u.userId === payment.userId && u.profileId === payment.profileId);
    if (!alreadyUnlocked && profile) {
      state.contactUnlocks.push({
        id: `unlock_${Date.now()}`,
        userId: payment.userId,
        profileId: payment.profileId,
        paymentId: payment.razorpayPaymentId || `pay_approved_${Date.now()}`,
        unlockedAt: new Date().toISOString()
      });
    }
    saveState();
    return payment;
  },

  rejectPayment(transactionId: string) {
    const state = getState();
    const payment = state.payments.find(p => p.id === transactionId);
    if (!payment) throw new Error('Transaction not found');
    payment.status = 'failed';
    saveState();
    return payment;
  },

  verifyAndUnlockContact(userId: string, profileId: string, orderId: string, paymentId: string, signature?: string) {
    const state = getState();
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) throw new Error('Profile not found');

    // Update payment record
    const payment = state.payments.find(p => p.razorpayOrderId === orderId) || {
      id: `tx_${Date.now()}`,
      userId,
      profileId,
      profileName: profile.username,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amount: profile.unlockPrice ?? 499,
      status: 'verified' as const,
      createdAt: new Date().toISOString()
    };

    payment.razorpayPaymentId = paymentId;
    payment.status = 'verified';

    if (!state.payments.some(p => p.id === payment.id)) {
      state.payments.push(payment);
    }

    // Check if already unlocked
    const alreadyUnlocked = state.contactUnlocks.some(u => u.userId === userId && u.profileId === profileId);
    if (!alreadyUnlocked) {
      state.contactUnlocks.push({
        id: `unlock_${Date.now()}`,
        userId,
        profileId,
        paymentId,
        unlockedAt: new Date().toISOString()
      });
    }

    saveState();

    return {
      success: true,
      profileId,
      whatsappNumber: profile.whatsappNumber,
      whatsappUrl: `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`
    };
  },

  isPaymentIdUsed(paymentId: string): boolean {
    if (!paymentId) return false;
    const state = getState();
    const cleanId = paymentId.trim().toLowerCase();
    const usedInUnlocks = state.contactUnlocks.some(
      u => u.paymentId && u.paymentId.trim().toLowerCase() === cleanId
    );
    const usedInPayments = state.payments.some(
      p => p.razorpayPaymentId && p.razorpayPaymentId.trim().toLowerCase() === cleanId && p.status === 'verified'
    );
    return usedInUnlocks || usedInPayments;
  },

  isContactUnlocked(userId: string, profileId: string): boolean {
    const state = getState();
    return state.contactUnlocks.some(u => u.userId === userId && u.profileId === profileId);
  },

  getUnlockedContactDetails(userId: string, profileId: string): { unlocked: boolean; whatsappNumber?: string; whatsappUrl?: string } {
    const isUnlocked = this.isContactUnlocked(userId, profileId);
    if (!isUnlocked) {
      return { unlocked: false };
    }
    const profile = this.getRawProfileById(profileId);
    if (!profile || !profile.whatsappNumber) {
      return { unlocked: false };
    }
    return {
      unlocked: true,
      whatsappNumber: profile.whatsappNumber,
      whatsappUrl: `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`
    };
  },

  getUserUnlockedContacts(userId: string): Record<string, string> {
    const state = getState();
    const unlocks = state.contactUnlocks.filter(u => u.userId === userId);
    const result: Record<string, string> = {};
    for (const u of unlocks) {
      const profile = this.getRawProfileById(u.profileId);
      if (profile && profile.whatsappNumber) {
        result[u.profileId] = `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`;
      }
    }
    return result;
  },

  // Reports & Moderation
  createReport(reporterUserId: string, reportedProfileId: string, reason: string, details?: string): UserReport {
    const state = getState();
    const profile = state.profiles.find(p => p.id === reportedProfileId);
    const report: UserReport = {
      id: `rep_${Date.now()}`,
      reporterUserId,
      reportedProfileId,
      reportedProfileName: profile ? profile.username : 'Unknown',
      reason,
      details,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    state.reports.push(report);
    saveState();
    return report;
  },

  toggleBlockProfile(profileId: string, blocked?: boolean): boolean {
    const state = getState();
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) return false;
    profile.isBlocked = blocked !== undefined ? blocked : !profile.isBlocked;
    saveState();
    return profile.isBlocked;
  },

  deleteProfile(profileId: string): boolean {
    const state = getState();
    const idx = state.profiles.findIndex(p => p.id === profileId);
    if (idx < 0) return false;
    state.profiles.splice(idx, 1);
    saveState();
    return true;
  },

  resetDemoData() {
    globalState = initializeDefaultState();
    saveState();
    return globalState;
  },

  // Admin stats
  getAdminStats(): AdminStats & { recentUsers: UserProfile[]; recentPayments: PaymentTransaction[]; reports: UserReport[] } {
    const state = getState();
    const totalRevenue = state.payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0) + 124082; // baseline seed + dynamic
    return {
      totalUsers: 2548 + state.users.length,
      newSignups: 348,
      activeUsers: 1426,
      totalRevenue,
      totalLikes: 8920 + state.likes.length,
      totalMatches: 2140 + state.matches.length,
      contactUnlocks: 416 + state.contactUnlocks.length,
      pendingReports: state.reports.filter(r => r.status === 'pending').length,
      recentUsers: state.profiles.slice(0, 6),
      recentPayments: state.payments.slice(-10).reverse(),
      reports: state.reports
    };
  }
};
