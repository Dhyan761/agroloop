import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Camera, Upload, Leaf, Scale, MapPin } from 'lucide-react-native';
import { useActivity } from '../../context/ActivityContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { verificationService } from '../../services/verification';

type WasteType = 'stubble' | 'leaves' | 'stalks' | 'husks' | 'other';

export default function WasteLogScreen() {
  const { addActivity } = useActivity();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<WasteType>('stubble');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const wasteTypes = [
    { id: 'stubble', label: t('riceStubble'), credits: 5 },
    { id: 'leaves', label: t('cropLeaves'), credits: 3 },
    { id: 'stalks', label: t('cornStalks'), credits: 4 },
    { id: 'husks', label: t('wheatHusks'), credits: 3 },
    { id: 'other', label: t('otherWaste'), credits: 2 },
  ];

  const handleCameraCapture = () => {
    // TODO: Implement camera capture with TensorFlow Lite classification
    Alert.alert(t('camera'), 'Camera feature will be implemented with TensorFlow Lite integration');
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload from gallery
    Alert.alert(t('uploadPhoto'), 'Image upload feature coming soon');
  };

  const verifyCode = async (code: string) => {
    if (!user) return false;
    
    setIsVerifying(true);
    
    try {
      const verificationResult = await verificationService.verifyCode(code, user.uid);
      setIsVerifying(false);
      return verificationResult !== null;
    } catch (error) {
      console.error('Error verifying code:', error);
      setIsVerifying(false);
      return false;
    }
  };

  const handleSubmitLog = async () => {
    if (!quantity || !location) {
      Alert.alert(t('error'), t('fillQuantityLocation'));
      return;
    }

    if (!verificationCode) {
      Alert.alert(t('error'), t('verificationCodeRequired'));
      return;
    }

    const selectedWasteType = wasteTypes.find(type => type.id === selectedType);
    const estimatedCredits = selectedWasteType ? parseInt(quantity) * selectedWasteType.credits : 0;

    Alert.alert(
      t('confirmSubmission'),
      t('logWasteMessage').replace('{quantity}', quantity).replace('{type}', selectedWasteType?.label || '').replace('{credits}', estimatedCredits.toString()),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('submit'), 
          onPress: async () => {
            // Verify the code first
            const isValid = await verifyCode(verificationCode);
            
            if (!isValid) {
              Alert.alert(t('error'), t('invalidVerificationCode'));
              return;
            }

            // Add activity to context
            addActivity({
              type: 'waste_log',
              title: `Logged ${selectedWasteType?.label}`,
              credits: estimatedCredits,
              verificationCode: verificationCode,
              wasteType: selectedWasteType?.label || '',
              quantity: parseInt(quantity),
              location: location,
            });
            
            Alert.alert(t('success'), t('wasteLoggedSuccess'));
            // Reset form
            setQuantity('');
            setLocation('');
            setNotes('');
            setImage(null);
            setVerificationCode('');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>{t('logWaste')}</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Convert your waste into eco-credits</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('captureImage')}</Text>
        <View style={styles.imageActions}>
          <TouchableOpacity style={[styles.imageButton, { backgroundColor: isDark ? '#374151' : '#ffffff' }]} onPress={handleCameraCapture}>
            <Camera size={32} color="#22c55e" />
            <Text style={[styles.imageButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>{t('takePhoto')}</Text>
            <Text style={[styles.imageButtonSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('aiWillDetect')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.imageButton, { backgroundColor: isDark ? '#374151' : '#ffffff' }]} onPress={handleImageUpload}>
            <Upload size={32} color="#6b7280" />
            <Text style={[styles.imageButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>{t('uploadPhoto')}</Text>
            <Text style={[styles.imageButtonSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('fromGallery')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('wasteType')}</Text>
        <View style={styles.wasteTypeGrid}>
          {wasteTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.wasteTypeCard,
                selectedType === type.id && styles.wasteTypeCardActive,
                { backgroundColor: isDark ? '#374151' : '#ffffff' }
              ]}
              onPress={() => setSelectedType(type.id as WasteType)}
            >
              <Leaf 
                size={24} 
                color={selectedType === type.id ? '#ffffff' : '#22c55e'} 
              />
              <Text style={[
                styles.wasteTypeLabel,
                selectedType === type.id && styles.wasteTypeLabelActive,
                { color: isDark ? '#ffffff' : '#111827' }
              ]}>
                {type.label}
              </Text>
              <Text style={[
                styles.wasteTypeCredits,
                selectedType === type.id && styles.wasteTypeCreditsActive,
                { color: isDark ? '#9ca3af' : '#6b7280' }
              ]}>
                {type.credits} credits/kg
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('details')}</Text>
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Scale size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
              placeholder="Quantity (kg)"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
              placeholder="Field location"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <TextInput
              style={[styles.input, styles.notesInput, { color: isDark ? '#ffffff' : '#111827' }]}
              placeholder="Additional notes (optional)"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <Text style={[styles.verificationIcon, { color: isDark ? '#9ca3af' : '#6b7280' }]}>🔐</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#ffffff' : '#111827' }]}
              placeholder={t('verificationCodePlaceholder')}
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={verificationCode}
              onChangeText={setVerificationCode}
              autoCapitalize="characters"
            />
            {isVerifying && (
              <Text style={[styles.verifyingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {t('verifying')}...
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.submitSection}>
        <TouchableOpacity 
          style={[styles.submitButton, isVerifying && styles.submitButtonDisabled]} 
          onPress={handleSubmitLog}
          disabled={isVerifying}
        >
          <Text style={styles.submitButtonText}>
            {isVerifying ? t('verifying') : t('submit')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  imageButtonSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  wasteTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wasteTypeCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  wasteTypeCardActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  wasteTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
  wasteTypeLabelActive: {
    color: '#ffffff',
  },
  wasteTypeCredits: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  wasteTypeCreditsActive: {
    color: '#ffffff',
  },
  inputContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1f2937',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitSection: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  verificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  verifyingText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 8,
  },
});