import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Gift, Coins, ShoppingCart, Percent, Leaf, Sprout, User, Clock, MapPin, Phone } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useActivity } from '@/context/ActivityContext';
import { authService } from '@/services/auth';

type RewardCategory = 'fertilizer' | 'seeds' | 'tools' | 'services';

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  availability: string;
  location: string;
  phone: string;
  rating: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  credits: number;
  category: RewardCategory;
  discount: number;
  available: boolean;
  serviceType?: 'consultation' | 'soil_testing' | 'tool_rental' | 'irrigation' | 'pest_control';
}

export default function RewardsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { ecoCredits, addActivity } = useActivity();
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('fertilizer');
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const categories = [
    { id: 'fertilizer', label: t('fertilizers'), icon: Leaf },
    { id: 'seeds', label: t('seeds'), icon: Sprout },
    { id: 'tools', label: t('tools'), icon: ShoppingCart },
    { id: 'services', label: t('services'), icon: Gift },
  ];

  const experts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Soil Science & Crop Nutrition',
      experience: '15+ years',
      availability: 'Mon-Fri, 9 AM - 6 PM',
      location: 'Punjab Agricultural University',
      phone: '+91 98765 43210',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Organic Farming & Pest Management',
      experience: '12+ years',
      availability: 'Mon-Sat, 10 AM - 7 PM',
      location: 'Karnal Research Station',
      phone: '+91 98765 43211',
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Dr. Amit Patel',
      specialization: 'Irrigation & Water Management',
      experience: '18+ years',
      availability: 'Mon-Fri, 8 AM - 5 PM',
      location: 'Ludhiana Agricultural Institute',
      phone: '+91 98765 43212',
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Dr. Meera Singh',
      specialization: 'Crop Disease & Treatment',
      experience: '14+ years',
      availability: 'Mon-Sat, 9 AM - 6 PM',
      location: 'Amritsar Extension Center',
      phone: '+91 98765 43213',
      rating: 4.6,
    },
  ];

  const rewards: Reward[] = [
    // Fertilizers
    {
      id: '1',
      title: 'Organic Fertilizer 50kg',
      description: '20% discount on premium organic fertilizer',
      credits: 500,
      category: 'fertilizer',
      discount: 20,
      available: true,
    },
    {
      id: '2',
      title: 'NPK Fertilizer 25kg',
      description: 'Balanced NPK fertilizer for all crops',
      credits: 300,
      category: 'fertilizer',
      discount: 15,
      available: true,
    },
    {
      id: '3',
      title: 'Urea Fertilizer 50kg',
      description: 'High nitrogen fertilizer for leafy growth',
      credits: 250,
      category: 'fertilizer',
      discount: 10,
      available: true,
    },
    {
      id: '4',
      title: 'DAP Fertilizer 25kg',
      description: 'Phosphorus-rich fertilizer for root development',
      credits: 400,
      category: 'fertilizer',
      discount: 12,
      available: true,
    },
    {
      id: '5',
      title: 'Micronutrient Mix 10kg',
      description: 'Essential micronutrients for healthy crops',
      credits: 600,
      category: 'fertilizer',
      discount: 25,
      available: true,
    },
    {
      id: '6',
      title: 'Bio Fertilizer Pack',
      description: 'Organic bio fertilizers for sustainable farming',
      credits: 450,
      category: 'fertilizer',
      discount: 18,
      available: true,
    },

    // Seeds
    {
      id: '7',
      title: 'Hybrid Wheat Seeds 10kg',
      description: 'High-yield hybrid wheat seeds',
      credits: 300,
      category: 'seeds',
      discount: 15,
      available: true,
    },
    {
      id: '8',
      title: 'Rice Seeds Premium 5kg',
      description: 'Premium quality rice seeds',
      credits: 250,
      category: 'seeds',
      discount: 12,
      available: true,
    },
    {
      id: '9',
      title: 'Corn Seeds Hybrid 2kg',
      description: 'High-yield hybrid corn seeds',
      credits: 200,
      category: 'seeds',
      discount: 10,
      available: true,
    },
    {
      id: '10',
      title: 'Cotton Seeds 1kg',
      description: 'Quality cotton seeds for better yield',
      credits: 180,
      category: 'seeds',
      discount: 8,
      available: true,
    },
    {
      id: '11',
      title: 'Sugarcane Seeds 5kg',
      description: 'Premium sugarcane seeds',
      credits: 350,
      category: 'seeds',
      discount: 20,
      available: true,
    },
    {
      id: '12',
      title: 'Vegetable Seeds Mix',
      description: 'Mixed vegetable seeds pack',
      credits: 150,
      category: 'seeds',
      discount: 15,
      available: true,
    },
    {
      id: '13',
      title: 'Pulse Seeds Pack',
      description: 'Various pulse seeds for crop rotation',
      credits: 220,
      category: 'seeds',
      discount: 12,
      available: true,
    },

    // Tools
    {
      id: '14',
      title: 'Soil Testing Kit',
      description: 'Free soil analysis kit worth ₹200',
      credits: 400,
      category: 'tools',
      discount: 100,
      available: true,
    },
    {
      id: '15',
      title: 'Garden Tool Set',
      description: 'Complete garden tool set with 5 tools',
      credits: 600,
      category: 'tools',
      discount: 30,
      available: true,
    },
    {
      id: '16',
      title: 'Pruning Shears',
      description: 'Professional pruning shears',
      credits: 250,
      category: 'tools',
      discount: 20,
      available: true,
    },
    {
      id: '17',
      title: 'Watering Can 10L',
      description: 'Large capacity watering can',
      credits: 180,
      category: 'tools',
      discount: 15,
      available: true,
    },
    {
      id: '18',
      title: 'Sprayer Pump',
      description: 'Manual sprayer for pesticides/fertilizers',
      credits: 350,
      category: 'tools',
      discount: 25,
      available: true,
    },
    {
      id: '19',
      title: 'Measuring Tape',
      description: 'Agricultural measuring tape 50m',
      credits: 120,
      category: 'tools',
      discount: 10,
      available: true,
    },
    {
      id: '20',
      title: 'Seed Drill',
      description: 'Manual seed drill for precise planting',
      credits: 800,
      category: 'tools',
      discount: 40,
      available: true,
    },
    {
      id: '21',
      title: 'Weeder Tool',
      description: 'Efficient weeding tool for row crops',
      credits: 200,
      category: 'tools',
      discount: 15,
      available: true,
    },
    {
      id: '22',
      title: 'Harvesting Sickle',
      description: 'Traditional harvesting sickle',
      credits: 150,
      category: 'tools',
      discount: 12,
      available: true,
    },

    // Services
    {
      id: '23',
      title: 'Agricultural Consultation',
      description: '1 hour free consultation with expert',
      credits: 200,
      category: 'services',
      discount: 100,
      available: true,
      serviceType: 'consultation',
    },
    {
      id: '24',
      title: 'Professional Soil Testing',
      description: 'Complete soil analysis with detailed report',
      credits: 350,
      category: 'services',
      discount: 100,
      available: true,
      serviceType: 'soil_testing',
    },
    {
      id: '25',
      title: 'Tool Rental Service',
      description: 'Rent agricultural tools for 1 week',
      credits: 150,
      category: 'services',
      discount: 50,
      available: true,
      serviceType: 'tool_rental',
    },
    {
      id: '26',
      title: 'Irrigation System Setup',
      description: 'Professional irrigation system installation',
      credits: 800,
      category: 'services',
      discount: 200,
      available: true,
      serviceType: 'irrigation',
    },
    {
      id: '27',
      title: 'Pest Control Service',
      description: 'Professional pest control treatment',
      credits: 600,
      category: 'services',
      discount: 150,
      available: true,
      serviceType: 'pest_control',
    },
  ];

  const filteredRewards = rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = async (reward: Reward) => {
    if (!user) {
      Alert.alert(t('error'), 'Please login to redeem rewards');
      return;
    }

    if (ecoCredits < reward.credits) {
      Alert.alert(t('insufficientCredits'), t('notEnoughCredits'));
      return;
    }

    // If it's a consultation service, show expert selection
    if (reward.serviceType === 'consultation') {
      setSelectedReward(reward);
      setShowExpertModal(true);
      return;
    }

    // For other services, proceed with normal redemption
    proceedWithRedemption(reward);
  };

  const proceedWithRedemption = async (reward: Reward, selectedExpert?: Expert) => {
    Alert.alert(
      t('confirmRedemption'),
      selectedExpert 
        ? `Redeem ${reward.title} with ${selectedExpert.name} for ${reward.credits} credits?`
        : t('redeemForCredits').replace('{item}', reward.title).replace('{credits}', reward.credits.toString()),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('redeem'),
          onPress: async () => {
            try {
              // Add redemption activity
              addActivity({
                type: 'reward_redemption',
                title: selectedExpert 
                  ? `Redeemed: ${reward.title} with ${selectedExpert.name}`
                  : `Redeemed: ${reward.title}`,
                credits: -reward.credits,
              });
              
              Alert.alert(
                t('success'), 
                selectedExpert
                  ? `Service booked with ${selectedExpert.name}! You'll receive a call within 24 hours.`
                  : t('rewardRedeemed').replace('{credits}', (ecoCredits - reward.credits).toLocaleString())
              );
            } catch (error) {
              Alert.alert(t('error'), t('redeemFailed'));
            }
          }
        }
      ]
    );
  };

  const handleExpertSelection = (expert: Expert) => {
    setShowExpertModal(false);
    if (selectedReward) {
      proceedWithRedemption(selectedReward, expert);
    }
  };

  const renderExpertCard = (expert: Expert) => (
    <TouchableOpacity
      key={expert.id}
      style={[styles.expertCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}
      onPress={() => handleExpertSelection(expert)}
    >
      <View style={styles.expertHeader}>
        <View style={styles.expertInfo}>
          <Text style={[styles.expertName, { color: isDark ? '#ffffff' : '#111827' }]}>{expert.name}</Text>
          <Text style={[styles.expertSpecialization, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{expert.specialization}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingText, { color: '#f59e0b' }]}>★ {expert.rating}</Text>
        </View>
      </View>
      
      <View style={styles.expertDetails}>
        <View style={styles.expertDetail}>
          <Clock size={16} color="#6b7280" />
          <Text style={[styles.expertDetailText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{expert.experience}</Text>
        </View>
        <View style={styles.expertDetail}>
          <MapPin size={16} color="#6b7280" />
          <Text style={[styles.expertDetailText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{expert.location}</Text>
        </View>
        <View style={styles.expertDetail}>
          <Clock size={16} color="#6b7280" />
          <Text style={[styles.expertDetailText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{expert.availability}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.callButton}>
        <Phone size={16} color="#22c55e" />
        <Text style={styles.callButtonText}>Call Expert</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>{t('rewards')}</Text>
          <View style={styles.creditsContainer}>
            <Coins size={20} color="#f59e0b" />
            <Text style={[styles.creditsText, { color: isDark ? '#ffffff' : '#111827' }]}>{ecoCredits.toLocaleString()} {t('credits')}</Text>
          </View>
        </View>

        <View style={styles.categorySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id as RewardCategory)}
                >
                  <IconComponent 
                    size={20} 
                    color={selectedCategory === category.id ? '#ffffff' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.rewardsContainer}>
          {filteredRewards.map((reward) => (
            <View key={reward.id} style={[styles.rewardCard, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <View style={styles.rewardHeader}>
                <Text style={[styles.rewardTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{reward.title}</Text>
                <View style={styles.discountBadge}>
                  <Percent size={14} color="#ffffff" />
                  <Text style={styles.discountText}>{reward.discount}%</Text>
                </View>
              </View>
              
              <Text style={[styles.rewardDescription, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{reward.description}</Text>
              
              <View style={styles.rewardFooter}>
                <View style={styles.creditsInfo}>
                  <Coins size={16} color="#f59e0b" />
                  <Text style={[styles.rewardCredits, { color: isDark ? '#ffffff' : '#111827' }]}>{reward.credits} {t('credits')}</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    !reward.available && styles.redeemButtonDisabled,
                    ecoCredits < reward.credits && styles.redeemButtonInsufficient
                  ]}
                  onPress={() => handleRedeem(reward)}
                  disabled={!reward.available || ecoCredits < reward.credits}
                >
                  <Text style={[
                    styles.redeemButtonText,
                    (!reward.available || ecoCredits < reward.credits) && styles.redeemButtonTextDisabled
                  ]}>
                    {!reward.available ? t('unavailable') : 
                     ecoCredits < reward.credits ? t('insufficient') : t('redeem')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Expert Selection Modal */}
      <Modal
        visible={showExpertModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExpertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                Choose Your Expert
              </Text>
              <TouchableOpacity onPress={() => setShowExpertModal(false)}>
                <Text style={[styles.closeButton, { color: isDark ? '#ffffff' : '#111827' }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Select an agricultural expert for consultation
            </Text>
            
            <ScrollView style={styles.expertsList}>
              {experts.map(renderExpertCard)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 6,
  },
  categorySelector: {
    padding: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  categoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  rewardsContainer: {
    padding: 16,
    gap: 16,
  },
  rewardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardCredits: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 6,
  },
  redeemButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  redeemButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  redeemButtonInsufficient: {
    backgroundColor: '#ef4444',
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  redeemButtonTextDisabled: {
    color: '#9ca3af',
  },
  expertCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  expertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 18,
    fontWeight: '700',
  },
  expertSpecialization: {
    fontSize: 14,
  },
  ratingContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expertDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertDetailText: {
    fontSize: 13,
    marginLeft: 6,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  expertsList: {
    width: '100%',
  },
});