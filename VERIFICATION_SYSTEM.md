# Waste Logging Verification System

## Overview

The verification system ensures that farmers can only receive eco-credits for waste that has been physically verified. This prevents fraud and ensures the integrity of the waste logging process.

## How It Works

### 1. Physical Waste Submission
- Farmer goes to collection center with waste
- Collection center staff weighs and records waste details
- Staff generates a unique verification code for the farmer
- Code is tied to specific waste details (type, quantity, location, farmer ID)
- Codes expire after 24 hours for security

### 2. Digital Waste Logging
- Farmer receives verification code from collection center
- Farmer enters the code in the app along with waste details
- The system validates the code against the farmer's account
- Only valid, unused, and non-expired codes are accepted
- Upon successful verification, the code is marked as used

### 3. Credit Award
- Credits are only awarded after successful verification
- The verification code is linked to the activity for audit purposes
- All verification attempts are logged for transparency

## Features

### Verification Code Generator (`/verification-code-generator`)
- **For Collection Center Staff Only**
- Generate unique 8-character verification codes for farmers
- Enter farmer ID, waste type, quantity, and location
- Codes are valid for 24 hours
- Copy codes for easy sharing with farmers

### Verification Code Management (`/verification-codes`)
- **For Farmers**
- View all verification codes issued to you
- Track code status (active, used, expired)
- Statistics dashboard
- Detailed code information

### Enhanced Waste Logging
- Verification code input field
- Real-time code validation
- Integration with activity tracking
- Verification status feedback

## Technical Implementation

### Verification Service (`services/verification.ts`)
```typescript
interface VerificationCode {
  id: string;
  code: string;
  wasteType: string;
  quantity: number;
  location: string;
  farmerId: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}
```

### Key Methods
- `createVerificationCode()` - Generate new verification codes
- `verifyCode()` - Validate and mark codes as used
- `getFarmerVerificationCodes()` - Get all codes for a farmer
- `getVerificationStats()` - Get verification statistics
- `cleanupExpiredCodes()` - Remove expired codes

### Simulation Mode
For testing purposes, the system currently operates in simulation mode:
- **Valid Codes**: Numbers 1-100 are accepted as valid verification codes
- **Code Generation**: Random codes between 1-100 are generated
- **Mock Data**: Simulated waste details are used for testing
- **Real Codes**: Still supported for actual verification codes

### Storage
- Verification codes are stored locally using AsyncStorage
- Each farmer's codes are isolated by farmer ID
- Automatic cleanup of expired codes

## User Flow

### For Farmers

1. **Physical Waste Submission**
   - Go to collection center with waste
   - Staff weighs and records waste details
   - Receive verification code from staff

2. **Digital Waste Logging**
   - Open the app and go to "Log Waste"
   - Enter waste details (type, quantity, location)
   - Enter the verification code received from collection center
   - Submit for verification
   - Receive eco-credits upon successful verification

3. **Code Management**
   - View all verification codes in "My Verification Codes"
   - Track status of codes (active, used, expired)
   - View detailed information about each code

### For Collection Centers

1. **Waste Reception**
   - Receive waste from farmer
   - Weigh and record waste details
   - Verify farmer identity

2. **Code Generation**
   - Use verification code generator
   - Enter farmer ID and waste details
   - Generate unique verification code
   - Provide code to farmer

3. **Waste Processing**
   - Process the logged waste
   - Maintain records for audit purposes

## Security Features

- **Unique Codes**: Each code is unique and tied to specific waste details
- **Time Expiry**: Codes expire after 24 hours
- **Farmer Isolation**: Codes can only be used by the generating farmer
- **One-time Use**: Codes become invalid after first use
- **Audit Trail**: All verification attempts are logged

## Benefits

### For Farmers
- Transparent verification process
- Clear feedback on verification status
- Easy code management and tracking
- Secure credit earning
- No need to generate codes themselves

### For the System
- Prevents fraudulent waste logging
- Ensures data integrity
- Provides audit trail
- Maintains system credibility
- Centralized code generation by authorized staff

### For Collection Centers
- Streamlined verification process
- Reduced manual work
- Better tracking of waste collection
- Control over code generation
- Professional waste management workflow

## Future Enhancements

1. **QR Code Integration**: Generate QR codes for easier scanning
2. **GPS Verification**: Add location-based verification
3. **Photo Verification**: Require photos of waste for verification
4. **Real-time Sync**: Cloud-based verification for multi-device access
5. **Analytics Dashboard**: Detailed verification analytics
6. **Batch Verification**: Support for multiple waste types in one code

## Troubleshooting

### Common Issues

1. **Code Not Found**
   - Ensure the code was generated for your account
   - Check if the code has expired
   - Verify the code hasn't been used already
   - **Simulation**: Use codes 1-100 for testing

2. **Code Expired**
   - Generate a new verification code
   - Codes expire after 24 hours

3. **Verification Failed**
   - Double-check the code spelling
   - Ensure you're logged into the correct account
   - **Simulation**: Make sure you're using numbers 1-100
   - Contact support if issues persist

### Support

For technical issues or questions about the verification system, please contact the support team through the app's help section. 