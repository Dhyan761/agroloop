import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi' | 'pa' | 'bn' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'signIn': 'Sign In',
    'signUp': 'Sign Up',
    'email': 'Email',
    'phone': 'Phone',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'forgotPassword': 'Forgot Password?',
    'loginFailed': 'Login Failed',
    'invalidCredentials': 'Invalid credentials. Please try again.',
    'signingIn': 'Signing In...',
    'dontHaveAccount': 'Don\'t have an account? Sign Up',
    
    // Dashboard
    'goodMorning': 'Good morning',
    'goodAfternoon': 'Good afternoon',
    'goodEvening': 'Good evening',
    'goodNight': 'Good night',
    'welcomeBack': 'Welcome back to',
    'ecoCreditsBalance': 'Eco-Credits Balance',
    'monthlyEarnings': 'Monthly Earnings',
    'wasteEntries': 'Waste Entries',
    'quickActions': 'Quick Actions',
    'logWaste': 'Log Waste',
    'redeemRewards': 'Redeem Rewards',
    'recentActivity': 'Recent Activity',
    'viewAll': 'View All',
    'noRecentActivity': 'No recent activity',
    
    // Transactions
    'transactionHistory': 'Transaction History',
    'all': 'All',
    'earned': 'Earned',
    'redeemed': 'Redeemed',
    'noTransactions': 'No Transactions',
    'noTransactionsDescription': 'Start logging waste to see your transaction history',
    
    // Profile
    'profile': 'Profile',
    'logout': 'Logout',
    'logoutConfirm': 'Are you sure you want to logout?',
    'ecoCredits': 'Eco Credits',
    'wasteLogged': 'Waste Logged',
    'personalInformation': 'Personal Information',
    'memberSince': 'Member Since',
    'signOutAccount': 'Sign out of your account',
    'options': 'Options',
    'january2024': 'January 2024',
    
    // Rewards
    'rewards': 'Rewards',
    'credits': 'Credits',
    'redeem': 'Redeem',
    'insufficientCredits': 'Insufficient Credits',
    'notEnoughCredits': 'You don\'t have enough eco-credits for this reward',
    'confirmRedemption': 'Confirm Redemption',
    'redeemForCredits': 'Redeem {item} for {credits} eco-credits?',
    'rewardRedeemed': 'Reward redeemed successfully! Your remaining credits: {credits}',
    'redeemFailed': 'Failed to redeem reward. Please try again.',
    'unavailable': 'Unavailable',
    'insufficient': 'Insufficient',
    
    // Categories
    'fertilizers': 'Fertilizers',
    'seeds': 'Seeds',
    'tools': 'Tools',
    'services': 'Services',
    
    // Waste Log
    'wasteLog': 'Waste Log',
    'wasteType': 'Waste Type',
    'quantity': 'Quantity',
    'location': 'Location',
    'notes': 'Notes',
    'details': 'Details',
    'submit': 'Submit',
    'camera': 'Camera',
    'gallery': 'Gallery',
    'cancel': 'Cancel',
    'riceStubble': 'Rice Stubble',
    'cropLeaves': 'Crop Leaves',
    'cornStalks': 'Corn Stalks',
    'wheatHusks': 'Wheat Husks',
    'otherWaste': 'Other Waste',
    'aiWillDetect': 'AI will detect waste type',
    'fromGallery': 'From gallery',
    'fillQuantityLocation': 'Please fill in quantity and location',
    'confirmSubmission': 'Confirm Submission',
    'logWasteMessage': 'Log {quantity}kg of {type}?\nEstimated credits: {credits}',
    'wasteLoggedSuccess': 'Waste logged successfully!',
    'verificationCodePlaceholder': 'Enter verification code',
    'verificationCodeRequired': 'Please enter the verification code',
    'invalidVerificationCode': 'Invalid verification code. Please try again.',
    'verifying': 'Verifying',
    'generateVerificationCode': 'Generate Verification Code',
    'verificationCodeInstructions': 'Generate a unique verification code for your waste logging. This code will be used to verify your waste submission.',
    'verificationCodeInstructionsStaff': 'Generate verification codes for farmers when they submit waste. Enter the farmer ID and waste details to create a unique code.',
    'farmerAndWasteDetails': 'Farmer & Waste Details',
    'farmerId': 'Farmer ID',
    'enterFarmerId': 'Enter farmer ID',
    'wasteDetails': 'Waste Details',
    'fieldLocation': 'Field location',
    'generating': 'Generating...',
    'generateCode': 'Generate Code',
    'verificationCodeExpiry': 'Verification codes expire in 24 hours',
    'verificationCodeGenerated': 'Verification Code Generated!',
    'yourVerificationCode': 'Your Verification Code',
    'verificationCodeForFarmer': 'Verification Code for Farmer',
    'giveCodeToFarmer': 'Give this code to the farmer to enter in their app',
    'copyCode': 'Copy Code',
    'copied': 'Copied!',
    'close': 'Close',
    'fillAllFields': 'Please fill in all fields',
    'invalidData': 'Invalid data provided',
    'codeGenerationFailed': 'Failed to generate verification code',
    'verificationCodes': 'Verification Codes',
    'totalCodes': 'Total Codes',
    'usedCodes': 'Used Codes',
    'activeCodes': 'Active Codes',
    'expiredCodes': 'Expired Codes',
    'cleanupExpired': 'Cleanup Expired',
    'allCodes': 'All Codes',
    'noVerificationCodes': 'No verification codes found',
    'noCodesYet': 'You will see verification codes here after they are issued to you at the collection center',
    'generateFirstCode': 'Generate First Code',
    'failedToLoadCodes': 'Failed to load verification codes',
    'expiredCodesCleaned': 'Expired codes cleaned up successfully',
    'cleanupFailed': 'Failed to cleanup expired codes',
    'used': 'Used',
    'active': 'Active',
    'expired': 'Expired',
    'created': 'Created',
    'expires': 'Expires',
    'usedAt': 'Used At',
    
    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'ok': 'OK',
    'yes': 'Yes',
    'no': 'No',
    'pleaseLogin': 'Please log in to view your dashboard',
    
    // AI Disease Detection
    'aiDiseaseDetection': 'AI Disease Detection',
    'aiDiseaseDetectionSubtitle': 'Upload a photo of your crop to detect diseases',
    'captureImage': 'Capture Image',
    'takePhoto': 'Take Photo',
    'uploadPhoto': 'Upload Photo',
    'retakePhoto': 'Retake Photo',
    'analyzeImage': 'Analyze Image',
    'diseaseDetected': 'Disease Detected',
    'noDiseaseDetected': 'No Disease Detected',
    'confidence': 'Confidence',
    'recommendations': 'Recommendations',
    'contactAgriculturalCenters': 'Contact Agricultural Centers',
    'hideCenters': 'Hide Centers',
    'nearbyAgriculturalCenters': 'Nearby Agricultural Centers',
    'call': 'Call',
    'configureAI': 'Configure AI',
    'apiKey': 'API Key',
    'saveConfiguration': 'Save Configuration',
    'treatmentOptions': 'Treatment Options',
  },
  hi: {
    // Auth
    'signIn': 'साइन इन करें',
    'signUp': 'साइन अप करें',
    'email': 'ईमेल',
    'phone': 'फोन',
    'password': 'पासवर्ड',
    'confirmPassword': 'पासवर्ड की पुष्टि करें',
    'forgotPassword': 'पासवर्ड भूल गए?',
    'loginFailed': 'लॉगिन विफल',
    'invalidCredentials': 'अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।',
    'signingIn': 'साइन इन हो रहा है...',
    'dontHaveAccount': 'खाता नहीं है? साइन अप करें',
    
    // Dashboard
    'goodMorning': 'सुप्रभात',
    'goodAfternoon': 'सुभ दोपहर',
    'goodEvening': 'सुभ संध्या',
    'goodNight': 'शुभ रात्रि',
    'welcomeBack': 'वापसी पर स्वागत है',
    'ecoCreditsBalance': 'इको-क्रेडिट्स बैलेंस',
    'monthlyEarnings': 'मासिक कमाई',
    'wasteEntries': 'कचरा प्रविष्टियां',
    'quickActions': 'त्वरित कार्य',
    'logWaste': 'कचरा लॉग करें',
    'redeemRewards': 'पुरस्कार भुनाएं',
    'recentActivity': 'हाल की गतिविधि',
    'viewAll': 'सभी देखें',
    'noRecentActivity': 'कोई हाल की गतिविधि नहीं',
    
    // Transactions
    'transactionHistory': 'लेन-देन इतिहास',
    'all': 'सभी',
    'earned': 'कमाया',
    'redeemed': 'भुनाया',
    'noTransactions': 'कोई लेन-देन नहीं',
    'noTransactionsDescription': 'अपना लेन-देन इतिहास देखने के लिए कचरा लॉग करना शुरू करें',
    
    // Profile
    'profile': 'प्रोफाइल',
    'logout': 'लॉगआउट',
    'logoutConfirm': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    'ecoCredits': 'इको क्रेडिट्स',
    'wasteLogged': 'कचरा लॉग किया गया',
    'personalInformation': 'व्यक्तिगत जानकारी',
    'memberSince': 'सदस्यता से',
    'options': 'विकल्प',
    'january2024': 'जनवरी 2024',
    
    // Rewards
    'rewards': 'पुरस्कार',
    'credits': 'क्रेडिट्स',
    'redeem': 'भुनाएं',
    'insufficientCredits': 'अपर्याप्त क्रेडिट्स',
    'notEnoughCredits': 'इस पुरस्कार के लिए आपके पास पर्याप्त इको-क्रेडिट्स नहीं हैं',
    'confirmRedemption': 'भुनाई की पुष्टि करें',
    'redeemForCredits': '{credits} इको-क्रेडिट्स के लिए {item} भुनाएं?',
    'rewardRedeemed': 'पुरस्कार सफलतापूर्वक भुनाया गया! आपके शेष क्रेडिट्स: {credits}',
    'redeemFailed': 'पुरस्कार भुनाने में विफल। कृपया पुनः प्रयास करें।',
    'unavailable': 'अनुपलब्ध',
    'insufficient': 'अपर्याप्त',
    
    // Categories
    'fertilizers': 'उर्वरक',
    'seeds': 'बीज',
    'tools': 'उपकरण',
    'services': 'सेवाएं',
    
    // Waste Log
    'wasteLog': 'कचरा लॉग',
    'wasteType': 'कचरे का प्रकार',
    'quantity': 'मात्रा',
    'notes': 'टिप्पणियां',
    'submit': 'जमा करें',
    'camera': 'कैमरा',
    'gallery': 'गैलरी',
    'cancel': 'रद्द करें',
    'riceStubble': 'चावल का डंठल',
    'cropLeaves': 'फसल के पत्ते',
    'cornStalks': 'मक्का के डंठल',
    'wheatHusks': 'गेहूं की भूसी',
    'otherWaste': 'अन्य कचरा',
    'aiWillDetect': 'AI कचरे का प्रकार पहचानेगा',
    'fromGallery': 'गैलरी से',
    'fillQuantityLocation': 'कृपया मात्रा और स्थान भरें',
    'confirmSubmission': 'जमा करने की पुष्टि करें',
    'logWasteMessage': '{quantity}kg {type} लॉग करें?\nअनुमानित क्रेडिट्स: {credits}',
    'wasteLoggedSuccess': 'कचरा सफलतापूर्वक लॉग किया गया!',
    'verificationCodePlaceholder': 'सत्यापन कोड दर्ज करें',
    'verificationCodeRequired': 'कृपया सत्यापन कोड दर्ज करें',
    'invalidVerificationCode': 'अमान्य सत्यापन कोड। कृपया पुनः प्रयास करें।',
    'verifying': 'सत्यापन हो रहा है',
    
    // Common
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफलता',
    'ok': 'ठीक है',
    'yes': 'हां',
    'no': 'नहीं',
    
    // AI Disease Detection
    'aiDiseaseDetection': 'AI बीमारी पहचान',
    'aiDiseaseDetectionSubtitle': 'अपने फसल का एक फोटो अपलोड करें और बीमारी पहचानें',
    'captureImage': 'फोटो एक्स्ट्रैक्ट करें',
    'takePhoto': 'फोटो लें',
    'uploadPhoto': 'फोटो अपलोड करें',
    'retakePhoto': 'फोटो फिर से लें',
    'analyzeImage': 'छवि विश्लेषण करें',
    'diseaseDetected': 'बीमारी पहचान ली',
    'noDiseaseDetected': 'कोई बीमारी नहीं पहचानी',
    'confidence': 'आत्मविश्वास',
    'recommendations': 'सुझाव',
    'contactAgriculturalCenters': 'कृषि केंद्रों से संपर्क करें',
    'hideCenters': 'केंद्र छिपाएं',
    'nearbyAgriculturalCenters': 'आसपास के कृषि केंद्र',
    'call': 'कॉल करें',
  },
  pa: {
    // Auth
    'signIn': 'ਸਾਈਨ ਇਨ ਕਰੋ',
    'signUp': 'ਸਾਈਨ ਅਪ ਕਰੋ',
    'email': 'ਈਮੇਲ',
    'phone': 'ਫੋਨ',
    'password': 'ਪਾਸਵਰਡ',
    'confirmPassword': 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'forgotPassword': 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    'loginFailed': 'ਲੌਗਿਨ ਅਸਫਲ',
    'invalidCredentials': 'ਅਵੈਧ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    'signingIn': 'ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...',
    'dontHaveAccount': 'ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅਪ ਕਰੋ',
    
    // Dashboard
    'goodMorning': 'ਸ਼ੁਭ ਸਵੇਰ',
    'goodAfternoon': 'ਸ਼ੁਭ ਦੁਪਹਿਰ',
    'goodEvening': 'ਸ਼ੁਭ ਸ਼ਾਮ',
    'goodNight': 'ਸ਼ੁਭ ਰਾਤ',
    'welcomeBack': 'ਵਾਪਸੀ ਤੇ ਸਵਾਗਤ ਹੈ',
    'ecoCreditsBalance': 'ਈਕੋ-ਕ੍ਰੈਡਿਟਸ ਬੈਲੇਂਸ',
    'monthlyEarnings': 'ਮਹੀਨਾਵਾਰ ਕਮਾਈ',
    'wasteEntries': 'ਕੂੜਾ ਪ੍ਰਵੇਸ਼',
    'quickActions': 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
    'logWaste': 'ਕੂੜਾ ਲੌਗ ਕਰੋ',
    'redeemRewards': 'ਇਨਾਮ ਭੁਗਤਾਓ',
    'recentActivity': 'ਤਾਜ਼ੀ ਗਤੀਵਿਧੀ',
    'viewAll': 'ਸਾਰੇ ਦੇਖੋ',
    'noRecentActivity': 'ਕੋਈ ਤਾਜ਼ੀ ਗਤੀਵਿਧੀ ਨਹੀਂ',
    
    // Transactions
    'transactionHistory': 'ਲੈਣ-ਦੇਣ ਦਾ ਇਤਿਹਾਸ',
    'all': 'ਸਾਰੇ',
    'earned': 'ਕਮਾਇਆ',
    'redeemed': 'ਭੁਗਤਾਇਆ',
    'noTransactions': 'ਕੋਈ ਲੈਣ-ਦੇਣ ਨਹੀਂ',
    'noTransactionsDescription': 'ਆਪਣਾ ਲੈਣ-ਦੇਣ ਦਾ ਇਤਿਹਾਸ ਦੇਖਣ ਲਈ ਕੂੜਾ ਲੌਗ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰੋ',
    
    // Profile
    'profile': 'ਪ੍ਰੋਫਾਈਲ',
    'logout': 'ਲੌਗਆਉਟ',
    'logoutConfirm': 'ਕੀ ਤੁਸੀਂ ਸੱਚਮੁੱਚ ਲੌਗਆਉਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    'ecoCredits': 'ਈਕੋ ਕ੍ਰੈਡਿਟਸ',
    'wasteLogged': 'ਕੂੜਾ ਲੌਗ ਕੀਤਾ ਗਿਆ',
    'personalInformation': 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ',
    'memberSince': 'ਮੈਂਬਰ ਇਸ ਤੋਂ',
    'options': 'ਵਿਕਲਪ',
    'january2024': 'ਜਨਵਰੀ 2024',
    
    // Rewards
    'rewards': 'ਇਨਾਮ',
    'credits': 'ਕ੍ਰੈਡਿਟਸ',
    'redeem': 'ਭੁਗਤਾਓ',
    'insufficientCredits': 'ਨਾਕਾਫੀ ਕ੍ਰੈਡਿਟਸ',
    'notEnoughCredits': 'ਇਸ ਇਨਾਮ ਲਈ ਤੁਹਾਡੇ ਕੋਲ ਕਾਫੀ ਈਕੋ-ਕ੍ਰੈਡਿਟਸ ਨਹੀਂ ਹਨ',
    'confirmRedemption': 'ਭੁਗਤਾਈ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'redeemForCredits': '{credits} ਈਕੋ-ਕ੍ਰੈਡਿਟਸ ਲਈ {item} ਭੁਗਤਾਓ?',
    'rewardRedeemed': 'ਇਨਾਮ ਸਫਲਤਾਪੂਰਵਕ ਭੁਗਤਾਇਆ ਗਿਆ! ਤੁਹਾਡੇ ਬਾਕੀ ਕ੍ਰੈਡਿਟਸ: {credits}',
    'redeemFailed': 'ਇਨਾਮ ਭੁਗਤਾਉਣ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    'unavailable': 'ਅਣਉਪਲਬਧ',
    'insufficient': 'ਨਾਕਾਫੀ',
    
    // Categories
    'fertilizers': 'ਖਾਦ',
    'seeds': 'ਬੀਜ',
    'tools': 'ਉਪਕਰਣ',
    'services': 'ਸੇਵਾਵਾਂ',
    
    // Waste Log
    'wasteLog': 'ਕੂੜਾ ਲੌਗ',
    'wasteType': 'ਕੂੜੇ ਦੀ ਕਿਸਮ',
    'quantity': 'ਮਾਤਰਾ',
    'location': 'ਟਿਕਾਣਾ',
    'notes': 'ਨੋਟਸ',
    'submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'camera': 'ਕੈਮਰਾ',
    'gallery': 'ਗੈਲਰੀ',
    'cancel': 'ਰੱਦ ਕਰੋ',
    
    // Common
    'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'error': 'ਗਲਤੀ',
    'success': 'ਸਫਲਤਾ',
    'ok': 'ਠੀਕ ਹੈ',
    'yes': 'ਹਾਂ',
    'no': 'ਨਹੀਂ',
    
    // AI Disease Detection
    'aiDiseaseDetection': 'ਐਆਇ ਬੀਮਾਰੀ ਪਹਚਾਨ',
    'aiDiseaseDetectionSubtitle': 'ਆਪਣੀ ਫਸਲ ਦੀ ਇਕ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਬੀਮਾਰੀ ਪਹਚਾਨੋ',
    'captureImage': 'ਫੋਟੋ ਏਕਸਟਰੈਕਟ ਕਰੋ',
    'takePhoto': 'ਫੋਟੋ ਲਓ',
    'uploadPhoto': 'ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
    'retakePhoto': 'ਫੋਟੋ ਫਰਾਂਸਕੋ ਲਓ',
    'analyzeImage': 'ਛਵਿ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    'diseaseDetected': 'ਬੀਮਾਰੀ ਪਹਚਾਨ ਲਈਆਂ',
    'noDiseaseDetected': 'ਕੋਈ ਬੀਮਾਰੀ ਨਹੀਂ ਪਹਚਾਨੀ',
    'confidence': 'ਆਤਮਵਿਸ਼ਾਸ',
    'recommendations': 'ਸੁਝਾਵ',
    'contactAgriculturalCenters': 'ਕ੃਷ਿ ਕੇਂਦਰਾਂ ਨੂੰ ਸੰਪਰਕ ਕਰੋ',
    'hideCenters': 'ਕੇਂਦਰ ਛੱਡੋ',
    'nearbyAgriculturalCenters': 'ਆਸਪਾਸੀ ਕੇਂਦਰਾਂ',
    'call': 'ਕੱਲ ਕਰੋ',
  },
  bn: {
    // Auth
    'signIn': 'সাইন ইন করুন',
    'signUp': 'সাইন আপ করুন',
    'email': 'ইমেইল',
    'phone': 'ফোন',
    'password': 'পাসওয়ার্ড',
    'confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
    'forgotPassword': 'পাসওয়ার্ড ভুলে গেছেন?',
    'loginFailed': 'লগইন ব্যর্থ',
    'invalidCredentials': 'অবৈধ কৃতিত্ব। অনুগ্রহ করে আবার চেষ্টা করুন।',
    'signingIn': 'সাইন ইন হচ্ছে...',
    'dontHaveAccount': 'অ্যাকাউন্ট নেই? সাইন আপ করুন',
    
    // Dashboard
    'goodMorning': 'শুভ সকাল',
    'goodAfternoon': 'শুভ দুপুর',
    'goodEvening': 'শুভ সন্ধ্যা',
    'goodNight': 'শুভ রাত্রি',
    'welcomeBack': 'ফিরে আসার জন্য স্বাগতম',
    'ecoCreditsBalance': 'ইকো-ক্রেডিটস ব্যালেন্স',
    'monthlyEarnings': 'মাসিক আয়',
    'wasteEntries': 'বর্জ্য এন্ট্রি',
    'quickActions': 'দ্রুত কর্ম',
    'logWaste': 'বর্জ্য লগ করুন',
    'redeemRewards': 'পুরস্কার ভোগ করুন',
    'recentActivity': 'সাম্প্রতিক কার্যক্রম',
    'viewAll': 'সব দেখুন',
    'noRecentActivity': 'কোন সাম্প্রতিক কার্যক্রম নেই',
    
    // Transactions
    'transactionHistory': 'লেনদেনের ইতিহাস',
    'all': 'সব',
    'earned': 'অর্জিত',
    'redeemed': 'ভোগ করা',
    'noTransactions': 'কোন লেনদেন নেই',
    'noTransactionsDescription': 'আপনার লেনদেনের ইতিহাস দেখতে বর্জ্য লগ করা শুরূ করুন',
    
    // Profile
    'profile': 'প্রোফাইল',
    'logout': 'লগআউট',
    'logoutConfirm': 'আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?',
    'ecoCredits': 'ইকো ক্রেডিটস',
    'wasteLogged': 'বর্জ্য লগ করা হয়েছে',
    'personalInformation': 'ব্যক্তিগত তথ্য',
    'memberSince': 'সদস্যতা থেকে',
    'options': 'বিকল্প',
    'january2024': 'জানুয়ারি ২০২৪',
    
    // Rewards
    'rewards': 'পুরস্কার',
    'credits': 'ক্রেডিটস',
    'redeem': 'ভোগ করুন',
    'insufficientCredits': 'অপর্যাপ্ত ক্রেডিটস',
    'notEnoughCredits': 'এই পুরস্কারের জন্য আপনার পর্যাপ্ত ইকো-ক্রেডিটস নেই',
    'confirmRedemption': 'ভোগের নিশ্চিতকরণ',
    'redeemForCredits': '{credits} ইকো-ক্রেডিটসের জন্য {item} ভোগ করুন?',
    'rewardRedeemed': 'পুরস্কার সফলভাবে ভোগ করা হয়েছে! আপনার অবশিষ্ট ক্রেডিটস: {credits}',
    'redeemFailed': 'পুরস্কার ভোগ করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
    'unavailable': 'অনুপলব্ধ',
    'insufficient': 'অপর্যাপ্ত',
    
    // Categories
    'fertilizers': 'সার',
    'seeds': 'বীজ',
    'tools': 'সরঞ্জাম',
    'services': 'সেবা',
    
    // Waste Log
    'wasteLog': 'বর্জ্য লগ',
    'wasteType': 'বর্জ্যের ধরন',
    'quantity': 'পরিমাণ',
    'location': 'অবস্থান',
    'notes': 'নোট',
    'submit': 'জমা দিন',
    'camera': 'ক্যামেরা',
    'gallery': 'গ্যালারি',
    'cancel': 'বাতিল করুন',
    
    // Common
    'loading': 'লোড হচ্ছে...',
    'error': 'ত্রুটি',
    'success': 'সফলতা',
    'ok': 'ঠিক আছে',
    'yes': 'হ্যাঁ',
    'no': 'না',
    
    // AI Disease Detection
    'aiDiseaseDetection': 'ঐআই বিমারী পহচান',
    'aiDiseaseDetectionSubtitle': 'আপনার ফসলের একটি ছবি আপলোড করুন এবং বিমারী পহচানো',
    'captureImage': 'ছবি এক্স্ট্রেক্ট করুন',
    'takePhoto': 'ছবি নিয়ে যান',
    'uploadPhoto': 'ছবি আপলোড করুন',
    'retakePhoto': 'ছবি ফ্রান্সকো নিয়ে যান',
    'analyzeImage': 'ছবি বিশ্লেষণ করুন',
    'diseaseDetected': 'বিমারী পহচান করা হয়েছে',
    'noDiseaseDetected': 'কোন বিমারী পহচানা হয়নি',
    'confidence': 'আতমবিশ্বাস',
    'recommendations': 'সুঝাচার',
    'contactAgriculturalCenters': 'কৃষি কেন্দ্রাংশকে যোগাযোগ করুন',
    'hideCenters': 'কেন্দ্র ছাড়াও',
    'nearbyAgriculturalCenters': 'আসপাসী কেন্দ্রাংশ',
    'call': 'কল করুন',
  },
  kn: {
    // Auth
    'signIn': 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    'signUp': 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    'email': 'ಇಮೇಲ್',
    'phone': 'ಫೋನ್',
    'password': 'ಪಾಸ್‌ವರ್ಡ್',
    'confirmPassword': 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    'forgotPassword': 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?',
    'loginFailed': 'ಲಾಗಿನ್ ವಿಫಲ',
    'invalidCredentials': 'ಅಮಾನ್ಯ ಕ್ರೆಡೆನ್ಷಿಯಲ್ಸ್. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'signingIn': 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...',
    'dontHaveAccount': 'ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    
    // Dashboard
    'goodMorning': 'ಶುಭೋದಯ',
    'goodAfternoon': 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    'goodEvening': 'ಶುಭ ಸಂಜೆ',
    'goodNight': 'ಶುಭ ರಾತ್ರಿ',
    'welcomeBack': 'ಮರಳಿ ಬರಲು ಸ್ವಾಗತ',
    'ecoCreditsBalance': 'ಇಕೋ-ಕ್ರೆಡಿಟ್ಸ್ ಬ್ಯಾಲೆನ್ಸ್',
    'monthlyEarnings': 'ಮಾಸಿಕ ಗಳಿಕೆ',
    'wasteEntries': 'ತ್ಯಾಜ್ಯ ನಮೂದುಗಳು',
    'quickActions': 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    'logWaste': 'ತ್ಯಾಜ್ಯ ಲಾಗ್ ಮಾಡಿ',
    'redeemRewards': 'ಬಹುಮಾನಗಳನ್ನು ವಿನಿಮಯ ಮಾಡಿ',
    'recentActivity': 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    'viewAll': 'ಎಲ್ಲಾ ವೀಕ್ಷಿಸಿ',
    'noRecentActivity': 'ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಇಲ್ಲ',
    
    // Transactions
    'transactionHistory': 'ವ್ಯವಹಾರ ಇತಿಹಾಸ',
    'all': 'ಎಲ್ಲಾ',
    'earned': 'ಗಳಿಸಿದ',
    'redeemed': 'ವಿನಿಮಯ ಮಾಡಿದ',
    'noTransactions': 'ಯಾವುದೇ ವ್ಯವಹಾರಗಳು ಇಲ್ಲ',
    'noTransactionsDescription': 'ನಿಮ್ಮ ವ್ಯವಹಾರ ಇತಿಹಾಸವನ್ನು ನೋಡಲು ತ್ಯಾಜ್ಯ ಲಾಗ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ',
    
    // Profile
    'profile': 'ಪ್ರೊಫೈಲ್',
    'logout': 'ಲಾಗ್‌ಔಟ್',
    'logoutConfirm': 'ನೀವು ಖಚಿತವಾಗಿ ಲಾಗ್‌ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?',
    'ecoCredits': 'ಇಕೋ ಕ್ರೆಡಿಟ್ಸ್',
    'wasteLogged': 'ತ್ಯಾಜ್ಯ ಲಾಗ್ ಮಾಡಲಾಗಿದೆ',
    'personalInformation': 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    'memberSince': 'ಸದಸ್ಯತೆ ಇಂದ',
    'options': 'ಆಯ್ಕೆಗಳು',
    'january2024': 'ಜನವರಿ 2024',
    
    // Rewards
    'rewards': 'ಬಹುಮಾನಗಳು',
    'credits': 'ಕ್ರೆಡಿಟ್ಸ್',
    'redeem': 'ವಿನಿಮಯ ಮಾಡಿ',
    'insufficientCredits': 'ಅಪೂರ್ಣ ಕ್ರೆಡಿಟ್ಸ್',
    'notEnoughCredits': 'ಈ ಬಹುಮಾನಕ್ಕಾಗಿ ನಿಮ್ಮಲ್ಲಿ ಸಾಕಷ್ಟು ಇಕೋ-ಕ್ರೆಡಿಟ್ಸ್ ಇಲ್ಲ',
    'confirmRedemption': 'ವಿನಿಮಯ ದೃಢೀಕರಿಸಿ',
    'redeemForCredits': '{credits} ಇಕೋ-ಕ್ರೆಡಿಟ್ಸ್‌ಗಾಗಿ {item} ವಿನಿಮಯ ಮಾಡಿ?',
    'rewardRedeemed': 'ಬಹುಮಾನ ಯಶಸ್ವಿಯಾಗಿ ವಿನಿಮಯ ಮಾಡಲಾಗಿದೆ! ನಿಮ್ಮ ಉಳಿದ ಕ್ರೆಡಿಟ್ಸ್: {credits}',
    'redeemFailed': 'ಬಹುಮಾನ ವಿನಿಮಯ ಮಾಡಲು ವಿಫಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'unavailable': 'ಲಭ್ಯವಿಲ್ಲ',
    'insufficient': 'ಅಪೂರ್ಣ',
    
    // Categories
    'fertilizers': 'ರಸಗೊಬ್ಬರಗಳು',
    'seeds': 'ಬೀಜಗಳು',
    'tools': 'ಉಪಕರಣಗಳು',
    'services': 'ಸೇವೆಗಳು',
    
    // Waste Log
    'wasteLog': 'ತ್ಯಾಜ್ಯ ಲಾಗ್',
    'wasteType': 'ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರ',
    'quantity': 'ಪರಿಮಾಣ',
    'location': 'ಸ್ಥಳ',
    'notes': 'ಟಿಪ್ಪಣಿಗಳು',
    'details': 'ವಿವರಗಳು',
    'submit': 'ಸಲ್ಲಿಸಿ',
    'camera': 'ಕ್ಯಾಮೆರಾ',
    'gallery': 'ಗ್ಯಾಲರಿ',
    'cancel': 'ರದ್ದುಮಾಡಿ',
    'riceStubble': 'ಅಕ್ಕಿ ಕಾಂಡ',
    'cropLeaves': 'ಬೆಳೆ ಎಲೆಗಳು',
    'cornStalks': 'ಮೆಕ್ಕೆಜೋಳ ಕಾಂಡಗಳು',
    'wheatHusks': 'ಗೋಧಿ ತೊಗಟೆ',
    'otherWaste': 'ಇತರ ತ್ಯಾಜ್ಯ',
    'aiWillDetect': 'AI ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರವನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ',
    'fromGallery': 'ಗ್ಯಾಲರಿಯಿಂದ',
    'fillQuantityLocation': 'ದಯವಿಟ್ಟು ಪರಿಮಾಣ ಮತ್ತು ಸ್ಥಳವನ್ನು ಭರ್ತಿ ಮಾಡಿ',
    'confirmSubmission': 'ಸಲ್ಲಿಕೆ ದೃಢೀಕರಿಸಿ',
    'logWasteMessage': '{quantity}kg {type} ಲಾಗ್ ಮಾಡಿ?\nಅಂದಾಜು ಕ್ರೆಡಿಟ್ಸ್: {credits}',
    'wasteLoggedSuccess': 'ತ್ಯಾಜ್ಯ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಮಾಡಲಾಗಿದೆ!',
    
    // Common
    'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'error': 'ದೋಷ',
    'success': 'ಯಶಸ್ಸು',
    'ok': 'ಸರಿ',
    'yes': 'ಹೌದು',
    'no': 'ಇಲ್ಲ',
    'pleaseLogin': 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೋಡಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ',
    
    // AI Disease Detection
    'aiDiseaseDetection': 'AI ರೋಗ ಪತ್ತೆ',
    'aiDiseaseDetectionSubtitle': 'ರೋಗಗಳನ್ನು ಪತ್ತೆ ಮಾಡಲು ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'captureImage': 'ಚಿತ್ರ ಸೆರೆಹಿಡಿಯಿರಿ',
    'takePhoto': 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    'uploadPhoto': 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'retakePhoto': 'ಫೋಟೋ ಮತ್ತೆ ತೆಗೆಯಿರಿ',
    'analyzeImage': 'ಚಿತ್ರ ವಿಶ್ಲೇಷಿಸಿ',
    'diseaseDetected': 'ರೋಗ ಪತ್ತೆಯಾಗಿದೆ',
    'noDiseaseDetected': 'ಯಾವುದೇ ರೋಗ ಪತ್ತೆಯಾಗಿಲ್ಲ',
    'confidence': 'ನಂಬಿಕೆ',
    'recommendations': 'ಶಿಫಾರಸುಗಳು',
    'contactAgriculturalCenters': 'ಕೃಷಿ ಕೇಂದ್ರಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ',
    'hideCenters': 'ಕೇಂದ್ರಗಳನ್ನು ಮರೆಮಾಡಿ',
    'nearbyAgriculturalCenters': 'ಹತ್ತಿರದ ಕೃಷಿ ಕೇಂದ್ರಗಳು',
    'call': 'ಕರೆ ಮಾಡಿ',
    'configureAI': 'AI ಕಾನ್ಫಿಗರ್ ಮಾಡಿ',
    'apiKey': 'API ಕೀ',
    'saveConfiguration': 'ಕಾನ್ಫಿಗರೇಶನ್ ಉಳಿಸಿ',
    'treatmentOptions': 'ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳು',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  React.useEffect(() => {
    // Load saved language preference
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 