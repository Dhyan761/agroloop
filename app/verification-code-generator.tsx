import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { verificationService, VerificationRequest } from '../services/verification';
import { router } from 'expo-router';
import {
  ArrowLeft,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Leaf,
  Scale,
  MapPin,
  User,
} from 'lucide-react-native';

export default function VerificationCodeGeneratorScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [farmerId, setFarmerId] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const wasteTypes = [
    { id: 'stubble', label: t('riceStubble') },
    { id: 'leaves', label: t('cropLeaves') },
    { id: 'stalks', label: t('cornStalks') },
    { id: 'husks', label: t('wheatHusks') },
    { id: 'other', label: t('otherWaste') },
  ];

  const handleGenerateCode = async () => {
    if (!farmerId || !wasteType || !quantity || !location) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    if (!user?.uid) {
      Alert.alert(t('error'), t('pleaseLogin'));
      return;
    }

    const request: VerificationRequest = {
      wasteType,
      quantity: parseFloat(quantity),
      location,
      farmerId: farmerId.trim(),
    };

    const validation = verificationService.validateVerificationRequest(request);
    if (!validation.isValid) {
      Alert.alert(t('error'), validation.error || t('invalidData'));
      return;
    }

    setIsGenerating(true);
    try {
      const verificationCode = await verificationService.createVerificationCode(request);
      setGeneratedCode(verificationCode.code);
      setShowCodeModal(true);
    } catch (error) {
      console.error('Error generating verification code:', error);
      Alert.alert(t('error'), t('codeGenerationFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      // In a real app, you would use Clipboard API
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert(t('success'), t('codeCopied'));
    }
  };

  const handleCloseModal = () => {
    setShowCodeModal(false);
    setGeneratedCode(null);
    setCopied(false);
    // Reset form after successful generation
    setFarmerId('');
    setWasteType('');
    setQuantity('');
    setLocation('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('generateVerificationCode')}
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <AlertCircle size={24} color="#f59e0b" />
          <Text style={[styles.instructionsText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {t('verificationCodeInstructionsStaff')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('farmerAndWasteDetails')}
          </Text>

          {/* Farmer ID Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('farmerId')}
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <User size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
                placeholder={t('enterFarmerId')}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={farmerId}
                onChangeText={setFarmerId}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Waste Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('wasteType')}
            </Text>
            <View style={styles.wasteTypeGrid}>
              {wasteTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.wasteTypeCard,
                    wasteType === type.id && styles.wasteTypeCardActive,
                    { backgroundColor: isDark ? '#374151' : '#ffffff' }
                  ]}
                  onPress={() => setWasteType(type.id)}
                >
                  <Leaf 
                    size={20} 
                    color={wasteType === type.id ? '#ffffff' : '#22c55e'} 
                  />
                  <Text style={[
                    styles.wasteTypeLabel,
                    wasteType === type.id && styles.wasteTypeLabelActive,
                    { color: isDark ? '#ffffff' : '#111827' }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('quantity')} (kg)
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <Scale size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
                placeholder="0.0"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {t('location')}
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
              <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
                placeholder={t('fieldLocation')}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerateCode}
            disabled={isGenerating}
          >
            <QrCode size={20} color="#ffffff" />
            <Text style={styles.generateButtonText}>
              {isGenerating ? t('generating') : t('generateCode')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Information */}
        <View style={styles.infoContainer}>
          <Clock size={20} color="#6b7280" />
          <Text style={[styles.infoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {t('verificationCodeExpiry')}
          </Text>
        </View>
        
        {/* Simulation Note */}
        <View style={styles.simulationContainer}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={[styles.simulationText, { color: '#f59e0b' }]}>
            Simulation Mode: Generating codes 1-100 for testing
          </Text>
        </View>
      </ScrollView>

      {/* Verification Code Modal */}
      <Modal
        visible={showCodeModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <CheckCircle size={32} color="#22c55e" />
              <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                {t('verificationCodeGenerated')}
              </Text>
            </View>

            <View style={styles.codeContainer}>
              <Text style={[styles.codeLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('verificationCodeForFarmer')}
              </Text>
              <Text style={[styles.codeText, { color: isDark ? '#ffffff' : '#111827' }]}>
                {generatedCode}
              </Text>
              <Text style={[styles.codeInstructions, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('giveCodeToFarmer')}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.copyButton]}
                onPress={handleCopyCode}
              >
                <Copy size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>
                  {copied ? t('copied') : t('copyCode')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton]}
                onPress={handleCloseModal}
              >
                <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {t('close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 20,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    gap: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  wasteTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wasteTypeCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  wasteTypeCardActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  wasteTypeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  wasteTypeLabelActive: {
    color: '#ffffff',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  simulationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  simulationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  codeInstructions: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  copyButton: {
    backgroundColor: '#22c55e',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
}); 