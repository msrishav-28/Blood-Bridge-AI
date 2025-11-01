/**
 * GAMIFICATION & ENGAGEMENT SERVICE
 * Achievements, leaderboards, rewards, social features
 */

import { Utils } from '../utils.js';

export class GamificationService {
    constructor() {
        this.achievements = new AchievementSystem();
        this.leaderboard = new LeaderboardSystem();
        this.rewards = new RewardSystem();
        this.social = new SocialFeatures();
        this.challenges = new ChallengeSystem();
    }
}

/**
 * Achievement System
 */
class AchievementSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.userAchievements = new Map();
    }

    initializeAchievements() {
        return [
            // Donation Milestones
            { id: 'first_donation', name: 'First Drop', description: 'Complete your first blood donation', icon: '🩸', points: 100, tier: 'bronze' },
            { id: 'donation_5', name: 'Life Saver', description: 'Complete 5 blood donations', icon: '❤️', points: 500, tier: 'silver' },
            { id: 'donation_10', name: 'Hero', description: 'Complete 10 blood donations', icon: '🦸', points: 1000, tier: 'gold' },
            { id: 'donation_25', name: 'Legend', description: 'Complete 25 blood donations', icon: '👑', points: 2500, tier: 'platinum' },
            { id: 'donation_50', name: 'Champion', description: 'Complete 50 blood donations', icon: '🏆', points: 5000, tier: 'diamond' },
            { id: 'donation_100', name: 'Immortal', description: 'Complete 100 blood donations', icon: '💎', points: 10000, tier: 'legendary' },
            
            // Frequency Achievements
            { id: 'regular_donor', name: 'Regular Donor', description: 'Donate 4 times in a year', icon: '📅', points: 400, tier: 'silver' },
            { id: 'year_streak', name: 'Dedicated', description: 'Maintain donation streak for 1 year', icon: '🔥', points: 1500, tier: 'gold' },
            { id: 'early_bird', name: 'Early Bird', description: 'Donate within 1 hour of opening', icon: '🌅', points: 150, tier: 'bronze' },
            
            // Social Achievements
            { id: 'recruiter_5', name: 'Influencer', description: 'Recruit 5 new donors', icon: '👥', points: 500, tier: 'silver' },
            { id: 'recruiter_10', name: 'Ambassador', description: 'Recruit 10 new donors', icon: '🌟', points: 1000, tier: 'gold' },
            { id: 'social_share', name: 'Advocate', description: 'Share donation milestone on social media', icon: '📱', points: 50, tier: 'bronze' },
            
            // Special Achievements
            { id: 'emergency_hero', name: 'Emergency Hero', description: 'Respond to emergency blood request', icon: '🚨', points: 300, tier: 'gold' },
            { id: 'rare_blood', name: 'Rare Savior', description: 'Donate rare blood type (AB-, O-)', icon: '💫', points: 200, tier: 'silver' },
            { id: 'distance_warrior', name: 'Distance Warrior', description: 'Travel >50km to donate', icon: '🚗', points: 250, tier: 'silver' },
            { id: 'camp_organizer', name: 'Camp Organizer', description: 'Organize a blood donation camp', icon: '🏕️', points: 800, tier: 'gold' },
            
            // Health Achievements
            { id: 'health_check', name: 'Health Conscious', description: 'Complete health screening', icon: '🏥', points: 100, tier: 'bronze' },
            { id: 'appointment_keeper', name: 'Punctual', description: 'Never miss scheduled appointment', icon: '⏰', points: 200, tier: 'silver' },
            
            // Learning Achievements
            { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on blood donation quiz', icon: '🎓', points: 150, tier: 'bronze' },
            { id: 'certificate', name: 'Certified Donor', description: 'Complete donor training course', icon: '📜', points: 300, tier: 'silver' }
        ];
    }

    async unlockAchievement(userId, achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        
        if (!achievement) {
            throw new Error('Achievement not found');
        }
        
        // Check if already unlocked
        if (!this.userAchievements.has(userId)) {
            this.userAchievements.set(userId, []);
        }
        
        const userAchs = this.userAchievements.get(userId);
        
        if (userAchs.find(a => a.id === achievementId)) {
            return { alreadyUnlocked: true };
        }
        
        // Unlock achievement
        const unlocked = {
            ...achievement,
            unlockedAt: new Date().toISOString(),
            progress: 100
        };
        
        userAchs.push(unlocked);
        
        // Award points
        await this.awardPoints(userId, achievement.points);
        
        // Show celebration
        return {
            unlocked: true,
            achievement: unlocked,
            totalPoints: await this.getUserPoints(userId),
            celebration: this.getCelebrationAnimation(achievement.tier)
        };
    }

    async checkAchievements(userId, activity) {
        const toUnlock = [];
        
        // Check donation count achievements
        if (activity.type === 'donation') {
            const donationCount = activity.totalDonations;
            
            if (donationCount === 1) toUnlock.push('first_donation');
            if (donationCount === 5) toUnlock.push('donation_5');
            if (donationCount === 10) toUnlock.push('donation_10');
            if (donationCount === 25) toUnlock.push('donation_25');
            if (donationCount === 50) toUnlock.push('donation_50');
            if (donationCount === 100) toUnlock.push('donation_100');
        }
        
        // Check emergency response
        if (activity.type === 'emergency_response') {
            toUnlock.push('emergency_hero');
        }
        
        // Check recruitment
        if (activity.type === 'recruited_donor') {
            const recruitCount = activity.totalRecruited;
            if (recruitCount === 5) toUnlock.push('recruiter_5');
            if (recruitCount === 10) toUnlock.push('recruiter_10');
        }
        
        // Unlock all eligible achievements
        const unlocked = [];
        for (const achId of toUnlock) {
            const result = await this.unlockAchievement(userId, achId);
            if (result.unlocked) {
                unlocked.push(result.achievement);
            }
        }
        
        return unlocked;
    }

    async getUserAchievements(userId) {
        const unlocked = this.userAchievements.get(userId) || [];
        const total = this.achievements.length;
        
        return {
            unlocked,
            total,
            progress: Math.round((unlocked.length / total) * 100),
            remaining: this.achievements.filter(a => 
                !unlocked.find(u => u.id === a.id)
            ),
            byTier: this.groupByTier(unlocked)
        };
    }

    groupByTier(achievements) {
        return achievements.reduce((acc, ach) => {
            if (!acc[ach.tier]) acc[ach.tier] = [];
            acc[ach.tier].push(ach);
            return acc;
        }, {});
    }

    getCelebrationAnimation(tier) {
        const animations = {
            bronze: 'confetti-small',
            silver: 'confetti-medium',
            gold: 'fireworks',
            platinum: 'fireworks-gold',
            diamond: 'diamond-rain',
            legendary: 'epic-celebration'
        };
        
        return animations[tier] || 'confetti-small';
    }

    async awardPoints(userId, points) {
        // Award points to user
        console.log(`🏆 Awarded ${points} points to user ${userId}`);
    }

    async getUserPoints(userId) {
        // Get total points for user
        const achievements = this.userAchievements.get(userId) || [];
        return achievements.reduce((sum, ach) => sum + ach.points, 0);
    }
}

/**
 * Leaderboard System
 */
class LeaderboardSystem {
    constructor() {
        this.leaderboards = new Map();
    }

    async getLeaderboard(type = 'national', timeframe = 'all-time') {
        // Types: national, state, city, hospital
        // Timeframes: all-time, yearly, monthly, weekly
        
        const mockData = this.generateMockLeaderboard(type, timeframe);
        
        return {
            type,
            timeframe,
            lastUpdated: new Date().toISOString(),
            entries: mockData,
            userRank: await this.getUserRank('current-user', type, timeframe)
        };
    }

    generateMockLeaderboard(type, timeframe) {
        const leaders = [
            { userId: 'user1', name: 'Rajesh Kumar', location: 'Delhi', donations: 125, points: 15000, bloodType: 'O+', avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=FFD700&color=000' },
            { userId: 'user2', name: 'Priya Sharma', location: 'Mumbai', donations: 98, points: 12500, bloodType: 'A+', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=C0C0C0&color=000' },
            { userId: 'user3', name: 'Amit Patel', location: 'Bangalore', donations: 87, points: 11200, bloodType: 'B+', avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=CD7F32&color=fff' },
            { userId: 'user4', name: 'Sneha Reddy', location: 'Hyderabad', donations: 76, points: 9800, bloodType: 'AB+', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=1FB8CD&color=fff' },
            { userId: 'user5', name: 'Vikram Singh', location: 'Chennai', donations: 65, points: 8500, bloodType: 'O-', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10B981&color=fff' }
        ];
        
        return leaders.map((leader, index) => ({
            rank: index + 1,
            ...leader,
            badge: this.getBadge(index + 1),
            trend: index % 2 === 0 ? 'up' : 'stable'
        }));
    }

    getBadge(rank) {
        if (rank === 1) return { emoji: '🥇', name: 'Gold Medal', color: '#FFD700' };
        if (rank === 2) return { emoji: '🥈', name: 'Silver Medal', color: '#C0C0C0' };
        if (rank === 3) return { emoji: '🥉', name: 'Bronze Medal', color: '#CD7F32' };
        if (rank <= 10) return { emoji: '🏅', name: 'Top 10', color: '#1FB8CD' };
        return { emoji: '⭐', name: 'Star Donor', color: '#F59E0B' };
    }

    async getUserRank(userId, type, timeframe) {
        return {
            rank: 42,
            donations: 15,
            points: 1800,
            percentile: 85, // Top 15%
            nextRank: { rank: 41, pointsNeeded: 50 }
        };
    }

    async getCityLeaderboard(city) {
        return this.getLeaderboard('city', 'all-time');
    }

    async getStateLeaderboard(state) {
        return this.getLeaderboard('state', 'all-time');
    }

    async getMonthlyLeaders() {
        return this.getLeaderboard('national', 'monthly');
    }
}

/**
 * Reward System
 */
class RewardSystem {
    constructor() {
        this.rewards = this.initializeRewards();
        this.userRewards = new Map();
    }

    initializeRewards() {
        return [
            // Digital Rewards
            { id: 'badge_bronze', name: 'Bronze Badge', type: 'badge', cost: 0, description: 'Earned after 5 donations' },
            { id: 'badge_silver', name: 'Silver Badge', type: 'badge', cost: 0, description: 'Earned after 10 donations' },
            { id: 'badge_gold', name: 'Gold Badge', type: 'badge', cost: 0, description: 'Earned after 25 donations' },
            
            // Vouchers & Discounts
            { id: 'movie_ticket', name: 'Movie Ticket', type: 'voucher', cost: 500, description: 'Free movie ticket at PVR/INOX', partner: 'PVR Cinemas' },
            { id: 'food_voucher', name: '₹200 Food Voucher', type: 'voucher', cost: 400, description: 'Zomato/Swiggy voucher', partner: 'Zomato' },
            { id: 'gym_membership', name: 'Gym Pass', type: 'voucher', cost: 1000, description: '1 month gym membership', partner: 'Cult.fit' },
            { id: 'health_checkup', name: 'Free Health Checkup', type: 'service', cost: 800, description: 'Comprehensive health screening', partner: 'Metropolis' },
            
            // Merchandise
            { id: 'tshirt', name: 'Donor T-Shirt', type: 'merchandise', cost: 300, description: 'Official BloodBridge t-shirt' },
            { id: 'mug', name: 'Coffee Mug', type: 'merchandise', cost: 200, description: '"Life Saver" printed mug' },
            { id: 'cap', name: 'Donor Cap', type: 'merchandise', cost: 150, description: 'BloodBridge branded cap' },
            
            // Special Perks
            { id: 'vip_pass', name: 'VIP Pass', type: 'perk', cost: 2000, description: 'Priority booking at blood banks' },
            { id: 'certificate', name: 'Appreciation Certificate', type: 'certificate', cost: 100, description: 'Official certificate of appreciation' },
            { id: 'recognition', name: 'Hall of Fame', type: 'recognition', cost: 5000, description: 'Featured in Blood Bridge Hall of Fame' }
        ];
    }

    async redeemReward(userId, rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        
        if (!reward) {
            throw new Error('Reward not found');
        }
        
        // Check user points
        const userPoints = await this.getUserPoints(userId);
        
        if (userPoints < reward.cost) {
            throw new Error(`Insufficient points. Need ${reward.cost}, have ${userPoints}`);
        }
        
        // Deduct points
        await this.deductPoints(userId, reward.cost);
        
        // Add to user rewards
        if (!this.userRewards.has(userId)) {
            this.userRewards.set(userId, []);
        }
        
        const redemption = {
            rewardId: reward.id,
            reward,
            redeemedAt: new Date().toISOString(),
            status: 'pending',
            code: Utils.generateId().substring(0, 8).toUpperCase()
        };
        
        this.userRewards.get(userId).push(redemption);
        
        // Send redemption details
        await this.sendRedemptionDetails(userId, redemption);
        
        return redemption;
    }

    async getUserPoints(userId) {
        // Would fetch from database
        return 1500;
    }

    async deductPoints(userId, points) {
        console.log(`💰 Deducted ${points} points from user ${userId}`);
    }

    async sendRedemptionDetails(userId, redemption) {
        console.log(`📧 Sending redemption code: ${redemption.code}`);
    }

    async getAvailableRewards(userId) {
        const userPoints = await this.getUserPoints(userId);
        
        return this.rewards.map(reward => ({
            ...reward,
            affordable: userPoints >= reward.cost,
            pointsNeeded: Math.max(0, reward.cost - userPoints)
        }));
    }

    async getUserRedemptions(userId) {
        return this.userRewards.get(userId) || [];
    }
}

/**
 * Social Features
 */
class SocialFeatures {
    constructor() {
        this.posts = [];
        this.connections = new Map();
    }

    async shareMilestone(userId, milestone) {
        const post = {
            id: Utils.generateId(),
            userId,
            type: 'milestone',
            milestone,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            shares: 0
        };
        
        this.posts.push(post);
        
        // Generate social media content
        const content = this.generateSocialContent(milestone);
        
        return {
            post,
            content,
            platforms: ['Facebook', 'Twitter', 'Instagram', 'WhatsApp'],
            shareUrls: this.generateShareUrls(content)
        };
    }

    generateSocialContent(milestone) {
        const messages = {
            first_donation: '🩸 Just completed my first blood donation! Proud to be a life saver! #BloodDonation #SaveLives',
            donation_10: '🏆 Milestone achieved: 10 blood donations! Together we can save more lives! #BloodHero #DonateBlood',
            donation_25: '👑 25 blood donations completed! Every drop counts! Join me in saving lives! #BloodDonor #LifeSaver'
        };
        
        return messages[milestone.type] || `🩸 Proud blood donor making a difference! #BloodDonation`;
    }

    generateShareUrls(content) {
        const encoded = encodeURIComponent(content);
        const url = encodeURIComponent('https://bloodbridge.in');
        
        return {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}`,
            twitter: `https://twitter.com/intent/tweet?text=${encoded}&url=${url}`,
            whatsapp: `https://wa.me/?text=${encoded}%20${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };
    }

    async connectDonors(userId1, userId2) {
        if (!this.connections.has(userId1)) {
            this.connections.set(userId1, new Set());
        }
        
        this.connections.get(userId1).add(userId2);
        
        return {
            connected: true,
            totalConnections: this.connections.get(userId1).size
        };
    }

    async getFeed(userId) {
        // Get social feed for user
        return this.posts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);
    }
}

/**
 * Challenge System
 */
class ChallengeSystem {
    constructor() {
        this.challenges = this.initializeChallenges();
        this.userChallenges = new Map();
    }

    initializeChallenges() {
        return [
            {
                id: 'monthly_goal',
                name: 'Monthly Donation Goal',
                description: 'Donate blood this month',
                type: 'individual',
                duration: 'monthly',
                target: 1,
                reward: 200,
                active: true
            },
            {
                id: 'team_challenge',
                name: 'Team Challenge',
                description: 'Your team to donate 50 units',
                type: 'team',
                duration: 'monthly',
                target: 50,
                reward: 1000,
                active: true
            },
            {
                id: 'streak_7',
                name: '7-Day Engagement',
                description: 'Use app for 7 consecutive days',
                type: 'engagement',
                duration: 'weekly',
                target: 7,
                reward: 150,
                active: true
            }
        ];
    }

    async joinChallenge(userId, challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        
        if (!this.userChallenges.has(userId)) {
            this.userChallenges.set(userId, []);
        }
        
        const userChallenge = {
            challengeId,
            challenge,
            joinedAt: new Date().toISOString(),
            progress: 0,
            completed: false
        };
        
        this.userChallenges.get(userId).push(userChallenge);
        
        return userChallenge;
    }

    async updateProgress(userId, challengeId, progress) {
        const userChallenges = this.userChallenges.get(userId) || [];
        const userChallenge = userChallenges.find(c => c.challengeId === challengeId);
        
        if (!userChallenge) {
            throw new Error('User not enrolled in challenge');
        }
        
        userChallenge.progress = progress;
        
        if (progress >= userChallenge.challenge.target) {
            userChallenge.completed = true;
            userChallenge.completedAt = new Date().toISOString();
            
            // Award reward
            return {
                completed: true,
                reward: userChallenge.challenge.reward,
                celebration: true
            };
        }
        
        return {
            completed: false,
            progress: `${progress}/${userChallenge.challenge.target}`
        };
    }

    async getUserChallenges(userId) {
        return this.userChallenges.get(userId) || [];
    }

    async getActiveChallenges() {
        return this.challenges.filter(c => c.active);
    }
}

export { GamificationService, AchievementSystem, LeaderboardSystem, RewardSystem, SocialFeatures, ChallengeSystem };
