import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { Camera, Upload, Phone, MapPin, AlertTriangle, CheckCircle, Settings, Zap, Clock, Key, MessageCircle, Send, Brain, HelpCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';
import aiService, { DiseaseResult, AIConfig, AIExpertResponse } from '../../services/ai';

interface AgriculturalCenter {
  name: string;
  phone: string;
  address: string;
  distance: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIDiseaseDetectionScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { addActivity } = useActivity();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseResult | null>(null);
  const [showCenters, setShowCenters] = useState(false);
  const [isAIConfigured, setIsAIConfigured] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [plantnetApiKey, setPlantnetApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  
  // AI Expert Chat States
  const [showAIExpert, setShowAIExpert] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);

  // Mock agricultural centers data
  const agriculturalCenters: AgriculturalCenter[] = [
    {
      name: 'Punjab Agricultural University',
      phone: '+91-161-2401960',
      address: 'Ludhiana, Punjab',
      distance: '15 km away',
    },
    {
      name: 'Krishi Vigyan Kendra',
      phone: '+91-161-2401961',
      address: 'Amritsar, Punjab',
      distance: '25 km away',
    },
    {
      name: 'District Agricultural Office',
      phone: '+91-161-2401962',
      address: 'Jalandhar, Punjab',
      distance: '30 km away',
    },
  ];

  // Sample AI Expert responses for fallback
  const sampleResponses = [
    "Based on your query, I recommend checking soil pH levels first. Most crops prefer a pH between 6.0-7.0. You can get a soil testing kit from our rewards section.",
    "For pest control, I suggest using neem-based organic pesticides. They're effective and environmentally friendly. Apply early morning or evening for best results.",
    "Water management is crucial. Implement drip irrigation to conserve water and ensure even distribution. Monitor soil moisture regularly.",
    "Crop rotation helps prevent soil-borne diseases and improves soil fertility. Consider planting legumes between main crops.",
    "For better yields, ensure proper spacing between plants and regular weeding. Mulching can help retain soil moisture.",
  ];

  useEffect(() => {
    // Check if AI service is configured
    checkAIConfiguration();
    
    // Request camera and gallery permissions
    requestPermissions();
    
    // Initialize AI Expert with welcome message
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          text: "Hello! I'm your AI Agricultural Expert. I can help you with farming queries, crop management, pest control, soil health, and much more. What would you like to know?",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
      
      // Request media library permission
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const checkAIConfiguration = async () => {
    try {
      const config = await aiService.loadConfig();
      if (config) {
        setAiConfig(config);
        setIsAIConfigured(true);
        // Pre-fill API keys if they exist
        if (config.plantnetApiKey) setPlantnetApiKey(config.plantnetApiKey);
        if (config.openaiApiKey) setOpenaiApiKey(config.openaiApiKey);
      } else {
        // Initialize with PlantNet API key
        const defaultConfig: AIConfig = {
          enableRealTime: false,
          useFreeModels: true,
          plantnetApiKey: '2b10bouC4sTbl1rxWbm5KKVg', // Your PlantNet API key
        };
        await aiService.initialize(defaultConfig);
        setAiConfig(defaultConfig);
        setPlantnetApiKey('2b10bouC4sTbl1rxWbm5KKVg');
        setIsAIConfigured(true);
      }
    } catch (error) {
      console.error('Failed to check AI configuration:', error);
      setIsAIConfigured(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      if (cameraPermission === false) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos for disease detection.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Grant Permission',
              onPress: () => requestPermissions(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        'Camera Error',
        'Failed to open camera. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (galleryPermission === false) {
        Alert.alert(
          'Gallery Permission Required',
          'Please grant gallery permission to select photos for disease detection.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Grant Permission',
              onPress: () => requestPermissions(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert(
        'Gallery Error',
        'Failed to open gallery. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please take or upload a photo first.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Use free AI service for analysis
      const result = await aiService.analyzeImage(selectedImage);
      setAnalysisResult(result);
      
      // Add activity if disease is detected
      if (result && result.detected && result.diseaseName) {
        addActivity({
          type: 'disease_detection',
          title: `Detected ${result.diseaseName}`,
          severity: result.severity || 'Unknown',
        });
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze the image. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const config: AIConfig = {
        enableRealTime: false,
        useFreeModels: true,
        plantnetApiKey: plantnetApiKey.trim() || undefined,
        openaiApiKey: openaiApiKey.trim() || undefined,
      };
      
      await aiService.initialize(config);
      setAiConfig(config);
      setIsAIConfigured(true);
      setShowConfigModal(false);
      
      const hasPlantNet = !!plantnetApiKey.trim();
      const hasOpenAI = !!openaiApiKey.trim();
      
      let message = 'AI services configured successfully!';
      if (hasPlantNet && hasOpenAI) {
        message = 'PlantNet and OpenAI APIs configured successfully!';
      } else if (hasPlantNet) {
        message = 'PlantNet API configured successfully! (Using local knowledge base for chat)';
      } else if (hasOpenAI) {
        message = 'OpenAI API configured successfully! (Using local analysis for disease detection)';
      } else {
        message = 'Local AI services configured successfully! (No API keys provided)';
      }
      
      Alert.alert(
        'Configuration Successful',
        message,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Configuration Failed',
        'Failed to configure AI services. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleContactCenter = (center: AgriculturalCenter) => {
    Alert.alert(
      'Contact Agricultural Center',
      `Call ${center.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${center.phone}`);
          },
        },
        {
          text: 'View on Map',
          onPress: () => {
            // In a real app, this would open maps with the address
            Alert.alert('Maps', 'This would open the location in maps app.');
          },
        },
      ]
    );
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setShowCenters(false);
  };

  const getServiceDisplayName = (service?: string) => {
    const serviceNames: Record<string, string> = {
      'PlantNet': 'PlantNet AI',
      'Plant.id': 'Plant.id AI',
      'Google Vision': 'Google Vision AI',
      'Multiple Services': 'Multi-AI Analysis',
      'Fallback Analysis': 'Local Analysis'
    };
    return serviceNames[service || ''] || service || 'Unknown';
  };

  // AI Expert Chat Functions
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Use free AI Expert
      const aiResponse: AIExpertResponse = await aiService.chatWithAIExpert(userInput.trim());
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Expert chat failed:', error);
      
      // Fallback to sample responses
      setTimeout(() => {
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: '1',
        text: "Hello! I'm your AI Agricultural Expert. I can help you with farming queries, crop management, pest control, soil health, and much more. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
      }
    ]);
    
    // Clear conversation history in AI service
    aiService.clearConversationHistory();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>{t('aiDiseaseDetection')}</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>{t('aiDiseaseDetectionSubtitle')}</Text>
        
        {/* AI Configuration Status */}
        <View style={styles.configStatus}>
          <View style={[styles.statusIndicator, isAIConfigured ? styles.statusConnected : styles.statusDisconnected]} />
          <Text style={[styles.statusText, { color: isDark ? '#ffffff' : '#111827' }]}>
            {isAIConfigured ? 'AI Services Ready' : 'AI Services Not Configured'}
          </Text>
          <TouchableOpacity style={styles.configButton} onPress={() => setShowConfigModal(true)}>
            <Settings size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* AI Service Info */}
        {aiConfig && (
          <View style={styles.serviceInfo}>
            <Text style={[styles.serviceInfoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Disease Detection: {aiConfig.plantnetApiKey ? '✅ PlantNet API (Enhanced)' : 'Local Analysis'}
            </Text>
            <Text style={[styles.serviceInfoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              AI Expert Chat: {aiConfig.openaiApiKey ? '✅ OpenAI GPT (Enhanced)' : 'Local Knowledge Base'}
            </Text>
          </View>
        )}
      </View>

      {/* AI Expert Section */}
      <View style={[styles.section, styles.aiExpertSection]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>🤖 AI Expert</Text>
          <TouchableOpacity 
            style={[styles.aiExpertToggle, { backgroundColor: isDark ? '#1e40af' : '#dbeafe' }]}
            onPress={() => setShowAIExpert(!showAIExpert)}
          >
            <Brain size={20} color={showAIExpert ? '#22c55e' : '#3b82f6'} />
            <Text style={[styles.aiExpertToggleText, { color: showAIExpert ? '#22c55e' : '#3b82f6' }]}>
              {showAIExpert ? 'Hide Chat' : 'Ask AI Expert'}
            </Text>
          </TouchableOpacity>
        </View>

        {showAIExpert && (
          <View style={[styles.aiExpertContainer, { backgroundColor: isDark ? '#374151' : '#ffffff' }]}>
            <View style={styles.chatHeader}>
              <Text style={[styles.chatHeaderTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                AI Agricultural Expert
              </Text>
              <TouchableOpacity onPress={clearChat}>
                <Text style={[styles.clearChatText, { color: '#ef4444' }]}>Clear</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
              {chatMessages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.isUser ? styles.userMessage : styles.aiMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                    { color: message.isUser ? '#ffffff' : (isDark ? '#ffffff' : '#111827') }
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[styles.messageTime, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
              {isTyping && (
                <View style={styles.typingIndicator}>
                  <Text style={[styles.typingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    AI Expert is typing...
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={[styles.chatInput, { 
                  backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
                  color: isDark ? '#ffffff' : '#111827'
                }]}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Ask about farming, crops, pests, soil..."
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, !userInput.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!userInput.trim()}
              >
                <Send size={20} color={userInput.trim() ? '#ffffff' : '#9ca3af'} />
              </TouchableOpacity>
            </View>

            <View style={styles.aiExpertInfo}>
              <Text style={[styles.aiExpertInfoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                💡 Ask me about: crop management, pest control, soil health, irrigation, fertilizers, weather advice, and more!
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Image Capture Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('captureImage')}</Text>
        
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity style={styles.retakeButton} onPress={resetAnalysis}>
              <Text style={styles.retakeButtonText}>{t('retakePhoto')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.captureOptions}>
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
              <Camera size={32} color="#22c55e" />
              <Text style={styles.captureButtonText}>{t('takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={handleUploadPhoto}>
              <Upload size={32} color="#3b82f6" />
              <Text style={styles.captureButtonText}>{t('uploadPhoto')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Analysis Section */}
      {selectedImage && (
        <View style={styles.section}>
                        <TouchableOpacity
                style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.analyzeButtonText}>
                    Analyze Disease
                  </Text>
                )}
              </TouchableOpacity>
        </View>
      )}

      {/* Results Section */}
      {analysisResult && (
        <View style={styles.section}>
          <View style={styles.resultHeader}>
            {analysisResult.detected ? (
              <AlertTriangle size={24} color="#ef4444" />
            ) : (
              <CheckCircle size={24} color="#22c55e" />
            )}
            <Text style={[
              styles.resultTitle,
              analysisResult.detected ? styles.diseaseDetected : styles.noDisease
            ]}>
              {analysisResult.detected ? 'Disease Detected' : 'No Disease Detected'}
            </Text>
          </View>

          {/* AI Service Info */}
          <View style={styles.aiServiceInfo}>
            <Text style={styles.aiServiceText}>
              AI Service: {getServiceDisplayName(analysisResult.aiService)}
            </Text>
            {analysisResult.processingTime && (
              <View style={styles.processingTime}>
                <Clock size={14} color="#64748b" />
                <Text style={styles.processingTimeText}>
                  {analysisResult.processingTime}ms
                </Text>
              </View>
            )}
          </View>

          {analysisResult.detected && (
            <View style={styles.diseaseInfo}>
              <Text style={styles.diseaseName}>{analysisResult.diseaseName}</Text>
              <Text style={styles.confidenceText}>
                Confidence: {analysisResult.confidence}%
              </Text>
              {analysisResult.severity && (
                <Text style={styles.severityText}>
                  Severity: {analysisResult.severity.toUpperCase()}
                </Text>
              )}
              <Text style={styles.description}>{analysisResult.description}</Text>
              
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              {analysisResult.recommendations?.map((rec, index) => (
                <Text key={index} style={styles.recommendation}>• {rec}</Text>
              ))}

              {analysisResult.treatmentOptions && (
                <>
                  <Text style={styles.recommendationsTitle}>Treatment Options:</Text>
                  {analysisResult.treatmentOptions.map((treatment, index) => (
                    <Text key={index} style={styles.recommendation}>• {treatment}</Text>
                  ))}
                </>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => setShowCenters(!showCenters)}
          >
            <Text style={styles.contactButtonText}>
              {showCenters ? 'Hide Centers' : 'Contact Agricultural Centers'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Agricultural Centers Section */}
      {showCenters && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('nearbyAgriculturalCenters')}</Text>
          {agriculturalCenters.map((center, index) => (
            <View key={index} style={styles.centerCard}>
              <View style={styles.centerInfo}>
                <Text style={styles.centerName}>{center.name}</Text>
                <Text style={styles.centerAddress}>{center.address}</Text>
                <Text style={styles.centerDistance}>{center.distance}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleContactCenter(center)}
              >
                <Phone size={20} color="#22c55e" />
                <Text style={styles.callButtonText}>{t('call')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}



      {/* Configuration Modal */}
      <Modal
        visible={showConfigModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>{t('configureAI')}</Text>
              <TouchableOpacity 
                style={styles.helpButton}
                onPress={() => {
                  Alert.alert(
                    'AI Services Configuration',
                    'Configure your API keys for enhanced AI functionality. PlantNet API for disease detection and OpenAI API for expert chat. Both are optional - local fallbacks are available.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <HelpCircle size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Configure AI services for enhanced disease detection and expert chat
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#111827' }]}>PlantNet API Key</Text>
              <View style={styles.inputContainer}>
                <Key size={16} color="#22c55e" />
                <TextInput
                  style={styles.textInput}
                  value={plantnetApiKey}
                  onChangeText={setPlantnetApiKey}
                  placeholder="Enter your PlantNet API key"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
              <Text style={[styles.apiKeyNote, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                ✅ Your PlantNet API key is configured for enhanced disease detection
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#111827' }]}>OpenAI API Key (Optional)</Text>
              <View style={styles.inputContainer}>
                <Key size={16} color="#64748b" />
                <TextInput
                  style={styles.textInput}
                  value={openaiApiKey}
                  onChangeText={setOpenaiApiKey}
                  placeholder="Enter your OpenAI API key (optional)"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfigModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveConfig}
              >
                <Text style={styles.saveButtonText}>{t('saveConfiguration')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalInfo}>
              <Text style={styles.modalInfoText}>
                • PlantNet API: Enhanced disease detection (optional)
              </Text>
              <Text style={styles.modalInfoText}>
                • OpenAI API: Advanced AI expert chat (optional)
              </Text>
              <Text style={styles.modalInfoText}>
                • Local fallbacks available if no API keys provided
              </Text>
              <Text style={styles.modalInfoText}>
                • API keys are stored securely on your device
              </Text>
              <Text style={styles.modalInfoText}>
                • Works offline with local services
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  configStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusConnected: {
    backgroundColor: '#22c55e',
  },
  statusDisconnected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  configButton: {
    padding: 4,
  },
  serviceInfo: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  serviceInfoText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  section: {
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  captureOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  captureButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
  },
  retakeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  diseaseDetected: {
    color: '#ef4444',
  },
  noDisease: {
    color: '#22c55e',
  },
  aiServiceInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiServiceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  processingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  processingTimeText: {
    fontSize: 12,
    color: '#64748b',
  },
  diseaseInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  severityText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  centerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  centerDistance: {
    fontSize: 12,
    color: '#9ca3af',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#22c55e',
    fontWeight: '500',
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  helpButton: {
    padding: 4,
  },
  apiKeyNote: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  modalInfo: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#0c4a6e',
    marginBottom: 4,
    lineHeight: 16,
  },
  // AI Expert Chat Styles
  aiExpertSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  aiExpertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  aiExpertToggleText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  aiExpertContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearChatText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chatMessages: {
    maxHeight: 300,
    marginBottom: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#374151',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  typingIndicator: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 12,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  chatInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
    borderRadius: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  aiExpertInfo: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  aiExpertInfoText: {
    fontSize: 12,
    textAlign: 'center',
  },

}); 