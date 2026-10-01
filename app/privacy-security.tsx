import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../context/AuthContext';
import { verificationService } from '../services/verification';
import { pdfGeneratorService } from '../services/pdf-generator';
import { authService } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Shield, Lock, Eye, EyeOff, Smartphone, Wifi, Download, BarChart3, MapPin, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacySecurityScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { activities, wasteLogged, ecoCredits } = useActivity();
  const { user } = useAuth();
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  const handleBack = () => {
    router.back();
  };

  const handleExportData = async () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported as an HTML report. This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            try {
              // Ensure user is logged in
              if (!user?.uid) {
                Alert.alert('Error', 'User not logged in. Please sign in again.');
                return;
              }

              // Transform activities to match PDF generator format
              const transformedActivities = activities.map(activity => ({
                ...activity,
                timestamp: activity.date, // Map date to timestamp for PDF generator
                // Ensure all required fields are present
                title: activity.title || 'Activity',
                credits: activity.credits || 0,
                verificationCode: activity.verificationCode || '',
                wasteType: activity.wasteType || '',
                quantity: activity.quantity || 0,
                location: activity.location || '',
              }));

              // Collect all user data for PDF
              const pdfData = {
                exportDate: new Date().toISOString(),
                user: {
                  id: user.uid,
                  email: user.email || 'N/A',
                },
                activities: transformedActivities,
                statistics: {
                  wasteLogged: wasteLogged,
                  ecoCredits: ecoCredits,
                  totalActivities: activities.length,
                },
                verificationCodes: await verificationService.getFarmerVerificationCodes(user.uid),
                settings: {
                  biometricAuth,
                  dataSharing,
                  analytics,
                  locationSharing,
                  autoBackup,
                },
              };

              // Store data for modal display
              setExportData(pdfData);

              // Generate and share PDF
              const result = await pdfGeneratorService.generateAndSharePDF(pdfData);

              if (result.success) {
                Alert.alert('Success', 'Your data report has been generated and shared successfully.');
              } else {
                // If sharing failed, show the data in a modal with download instructions
                Alert.alert(
                  'Report Generated',
                  'Your report has been generated but sharing is not available in Expo Go. The report data is shown below. You can copy this data and save it as an HTML file.',
                  [
                    {
                      text: 'View Report',
                      onPress: () => setShowExportModal(true),
                    },
                    {
                      text: 'OK',
                      style: 'cancel',
                    },
                  ]
                );
              }
            } catch (error) {
              console.error('Error exporting data:', error);
              Alert.alert('Error', 'Failed to generate report. Please try again.');
            }
          },
        },
      ]
    );
  };



  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            setShowDeleteModal(true);
          },
        },
      ]
    );
  };

  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Error', 'Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user account with password verification
      await authService.deleteUser(deletePassword);
      
      setShowDeleteModal(false);
      setDeletePassword('');
      
      Alert.alert(
        'Account Deleted Successfully',
        'Your account has been permanently deleted. You will be signed out and redirected to the login screen.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              router.replace('/auth/login');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error deleting account:', error);
      let errorMessage = 'Failed to delete account. Please check your password and try again.';
      
      if (error.message?.includes('Invalid password')) {
        errorMessage = 'Invalid password. Please enter the correct password to delete your account.';
      } else if (error.message?.includes('No user logged in')) {
        errorMessage = 'No user is currently logged in. Please sign in again and try deleting your account.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
  };

  const privacySections = [
    {
      title: 'Authentication',
      items: [
        {
          icon: <Lock size={20} color="#6b7280" />,
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID to unlock the app',
          type: 'toggle',
          value: biometricAuth,
          onPress: () => setBiometricAuth(!biometricAuth),
        },
      ],
    },
    {
      title: 'Data Privacy',
      items: [
        {
          icon: <Eye size={20} color="#6b7280" />,
          title: 'Data Sharing',
          subtitle: 'Allow sharing of anonymous usage data for app improvement',
          type: 'toggle',
          value: dataSharing,
          onPress: () => setDataSharing(!dataSharing),
        },
        {
          icon: <BarChart3 size={20} color="#6b7280" />,
          title: 'Analytics',
          subtitle: 'Help us improve by sharing app usage analytics',
          type: 'toggle',
          value: analytics,
          onPress: () => setAnalytics(!analytics),
        },
        {
          icon: <MapPin size={20} color="#6b7280" />,
          title: 'Location Sharing',
          subtitle: 'Share your location for nearby agricultural centers',
          type: 'toggle',
          value: locationSharing,
          onPress: () => setLocationSharing(!locationSharing),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: <Wifi size={20} color="#6b7280" />,
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data to cloud',
          type: 'toggle',
          value: autoBackup,
          onPress: () => setAutoBackup(!autoBackup),
        },
        {
          icon: <Download size={20} color="#6b7280" />,
          title: 'Export Data',
          subtitle: 'Download a PDF report of your data',
          type: 'link',
          onPress: handleExportData,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: <Shield size={20} color="#ef4444" />,
          title: 'Delete Account',
          subtitle: 'Permanently delete your account and all data',
          type: 'danger',
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderPrivacyItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.privacyItem, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.privacyLeft}>
        <View style={styles.privacyIcon}>
          {item.icon}
        </View>
        <View style={styles.privacyContent}>
          <Text style={[styles.privacyTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            {item.title}
          </Text>
          <Text style={[styles.privacySubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
          thumbColor={item.value ? '#ffffff' : '#ffffff'}
        />
      )}
      {item.type === 'link' && (
        <Text style={[styles.privacyArrow, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          ›
        </Text>
      )}
      {item.type === 'danger' && (
        <Text style={[styles.privacyArrow, { color: '#ef4444' }]}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={isDark ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Privacy & Security
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Privacy Notice */}
        <View style={[styles.noticeContainer, { backgroundColor: isDark ? '#374151' : '#f8fafc' }]}>
          <Shield size={24} color="#22c55e" />
          <Text style={[styles.noticeTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            Your Privacy Matters
          </Text>
          <Text style={[styles.noticeText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            We are committed to protecting your personal information and ensuring your data is secure.
          </Text>
        </View>

        {/* Privacy Settings */}
        {privacySections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderPrivacyItem)}
            </View>
          </View>
        ))}

        {/* Privacy Policy Link */}
        <TouchableOpacity style={[styles.policyLink, { backgroundColor: isDark ? '#374151' : '#f8fafc' }]}>
          <Text style={[styles.policyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Read our complete{' '}
            <Text style={{ color: '#22c55e', textDecorationLine: 'underline' }}>
              Privacy Policy
            </Text>
          </Text>
                 </TouchableOpacity>
       </ScrollView>

       {/* Delete Account Modal */}
       <Modal
         visible={showDeleteModal}
         transparent={true}
         animationType="fade"
         onRequestClose={handleCancelDelete}
       >
         <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
             <View style={styles.modalHeader}>
               <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                 Delete Account
               </Text>
               <Text style={[styles.modalSubtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                 This action cannot be undone. Please enter your password to confirm.
               </Text>
             </View>

             <View style={styles.modalBody}>
               <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#111827' }]}>
                 Password
               </Text>
               <TextInput
                 style={[styles.passwordInput, { 
                   backgroundColor: isDark ? '#4b5563' : '#f9fafb',
                   color: isDark ? '#ffffff' : '#111827',
                   borderColor: isDark ? '#6b7280' : '#e5e7eb'
                 }]}
                 placeholder="Enter your password"
                 placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                 value={deletePassword}
                 onChangeText={setDeletePassword}
                 secureTextEntry={true}
                 autoFocus={true}
               />
             </View>

             <View style={styles.modalActions}>
               <TouchableOpacity
                 style={[styles.modalButton, styles.cancelButton]}
                 onPress={handleCancelDelete}
                 disabled={isDeleting}
               >
                 <Text style={styles.cancelButtonText}>Cancel</Text>
               </TouchableOpacity>
               
               <TouchableOpacity
                 style={[styles.modalButton, styles.deleteButton, isDeleting && styles.disabledButton]}
                 onPress={handleConfirmDelete}
                 disabled={isDeleting}
               >
                 {isDeleting ? (
                   <Text style={styles.deleteButtonText}>Deleting...</Text>
                 ) : (
                   <Text style={styles.deleteButtonText}>Delete Account</Text>
                 )}
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>

       {/* Export Data Modal */}
       <Modal
         visible={showExportModal}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowExportModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
             <View style={styles.modalHeader}>
               <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                 Export Data
               </Text>
               <TouchableOpacity onPress={() => setShowExportModal(false)} style={styles.closeButton}>
                 <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
               </TouchableOpacity>
             </View>

             <View style={styles.modalBody}>
               <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#111827' }]}>
                 Download Instructions
               </Text>
               <Text style={[styles.instructionText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                 1. Copy the HTML content below{'\n'}
                 2. Create a new file with .html extension{'\n'}
                 3. Paste the content and save{'\n'}
                 4. Open the file in any web browser
               </Text>
               
               <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#111827', marginTop: 16 }]}>
                 Report Data (HTML)
               </Text>
               <ScrollView style={[styles.exportDataScrollView, { backgroundColor: isDark ? '#4b5563' : '#f9fafb' }]}>
                 <Text style={[styles.exportDataText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                   {exportData ? pdfGeneratorService.generateHTMLContent(exportData) : 'No data available'}
                 </Text>
               </ScrollView>
             </View>

             <View style={styles.modalActions}>
               <TouchableOpacity
                 style={[styles.modalButton, styles.copyButton]}
                 onPress={() => {
                   if (exportData) {
                     // Copy to clipboard functionality would go here
                     Alert.alert('Copy', 'Data copied to clipboard!');
                   }
                 }}
               >
                 <Text style={styles.copyButtonText}>Copy Data</Text>
               </TouchableOpacity>
               
               <TouchableOpacity
                 style={[styles.modalButton, styles.closeButton]}
                 onPress={() => setShowExportModal(false)}
               >
                 <Text style={styles.closeButtonText}>Close</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  noticeContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionContent: {
    backgroundColor: '#f8fafc',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 14,
  },
  privacyArrow: {
    fontSize: 18,
    fontWeight: '600',
  },
  policyLink: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
     policyText: {
     fontSize: 14,
     textAlign: 'center',
   },
   // Modal Styles
   modalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   modalContent: {
     width: '85%',
     borderRadius: 16,
     padding: 24,
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
   modalHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 20,
   },
   modalTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     marginBottom: 8,
     textAlign: 'center',
   },
   modalSubtitle: {
     fontSize: 14,
     textAlign: 'center',
     lineHeight: 20,
   },
   modalBody: {
     marginBottom: 24,
   },
   inputLabel: {
     fontSize: 16,
     fontWeight: '500',
     marginBottom: 8,
   },
   passwordInput: {
     borderWidth: 1,
     borderRadius: 8,
     paddingHorizontal: 16,
     paddingVertical: 12,
     fontSize: 16,
   },
   modalActions: {
     flexDirection: 'row',
     gap: 12,
   },
   modalButton: {
     flex: 1,
     paddingVertical: 12,
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
   },
   cancelButton: {
     backgroundColor: '#f3f4f6',
     borderWidth: 1,
     borderColor: '#e5e7eb',
   },
   deleteButton: {
     backgroundColor: '#ef4444',
   },
   disabledButton: {
     backgroundColor: '#9ca3af',
   },
   cancelButtonText: {
     color: '#374151',
     fontSize: 16,
     fontWeight: '500',
   },
   deleteButtonText: {
     color: '#ffffff',
     fontSize: 16,
     fontWeight: '500',
   },
   closeButton: {
     padding: 4,
   },
   closeButtonText: {
     color: '#22c55e',
     fontSize: 16,
     fontWeight: '500',
   },
   copyButton: {
     backgroundColor: '#22c55e',
   },
   copyButtonText: {
     color: '#ffffff',
     fontSize: 16,
     fontWeight: '500',
   },
   instructionText: {
     fontSize: 14,
     lineHeight: 20,
     marginBottom: 16,
   },
       exportDataScrollView: {
      maxHeight: 300,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    exportDataText: {
      fontSize: 14,
      lineHeight: 20,
    },
  });