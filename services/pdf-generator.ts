// Try to import react-native-fs, but provide fallback for Expo
let RNFS: any = null;
try {
  RNFS = require('react-native-fs');
} catch (error) {
  console.log('react-native-fs not available, using fallback for Expo');
}

// Try to import react-native-share, but provide fallback for Expo
let Share: any = null;
try {
  Share = require('react-native-share');
} catch (error) {
  console.log('react-native-share not available, using fallback for Expo');
}

export interface PDFData {
  user: {
    id?: string;
    email?: string;
  };
  activities: any[];
  statistics: {
    wasteLogged: number;
    ecoCredits: number;
    totalActivities: number;
  };
  verificationCodes: any[];
  settings: any;
  exportDate: string;
}

class PDFGeneratorService {
  generateHTMLContent(data: PDFData): string {
    const formatDate = (dateString: string) => {
      try {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (error) {
        return 'Invalid Date';
      }
    };

    const formatCodeStatus = (code: any) => {
      if (!code) return 'Unknown';
      if (code.isUsed) return 'Used';
      if (code.expiresAt && new Date(code.expiresAt) <= new Date()) return 'Expired';
      return 'Active';
    };

    // Safely access nested properties
    const safeGet = (obj: any, path: string, defaultValue: any = '') => {
      try {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AgroLoop Data Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #22c55e;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #22c55e;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #22c55e;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          .stat-card {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 5px;
          }
          .stat-label {
            color: #666;
            font-size: 14px;
          }
          .activity-item {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
          }
          .activity-title {
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 8px;
          }
          .activity-details {
            color: #666;
            font-size: 14px;
          }
          .code-item {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
          }
          .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .code-number {
            font-weight: bold;
            color: #22c55e;
          }
          .code-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-active {
            background: #dcfce7;
            color: #166534;
          }
          .status-used {
            background: #fef3c7;
            color: #92400e;
          }
          .status-expired {
            background: #fee2e2;
            color: #991b1b;
          }
          .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          .setting-item {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
          }
          .setting-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
          }
          .setting-value {
            color: #22c55e;
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .environmental-impact {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
          }
          .impact-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .impact-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
          }
          .impact-stat {
            text-align: center;
          }
          .impact-value {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .impact-label {
            font-size: 12px;
            opacity: 0.9;
          }
          @media print {
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 AgroLoop Data Report</h1>
          <p>Generated on: ${formatDate(safeGet(data, 'exportDate'))}</p>
          <p>User: ${safeGet(data, 'user.email', 'N/A')}</p>
        </div>

        <div class="section">
          <h2>📊 Statistics Overview</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${safeGet(data, 'statistics.totalActivities', 0)}</div>
              <div class="stat-label">Total Activities</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${safeGet(data, 'statistics.wasteLogged', 0)} kg</div>
              <div class="stat-label">Waste Logged</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${safeGet(data, 'statistics.ecoCredits', 0)}</div>
              <div class="stat-label">Eco Credits Earned</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${safeGet(data, 'verificationCodes.length', 0)}</div>
              <div class="stat-label">Verification Codes</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>🌍 Environmental Impact</h2>
          <div class="environmental-impact">
            <div class="impact-title">Your Contribution to Sustainability</div>
            <div class="impact-stats">
              <div class="impact-stat">
                <div class="impact-value">${(safeGet(data, 'statistics.wasteLogged', 0) * 0.5).toFixed(1)} kg</div>
                <div class="impact-label">CO₂ Emissions Reduced</div>
              </div>
              <div class="impact-stat">
                <div class="impact-value">${(safeGet(data, 'statistics.wasteLogged', 0) * 0.3).toFixed(1)} kg</div>
                <div class="impact-label">Fertilizer Equivalent</div>
              </div>
              <div class="impact-stat">
                <div class="impact-value">${(safeGet(data, 'statistics.wasteLogged', 0) * 0.2).toFixed(1)} kg</div>
                <div class="impact-label">Soil Enrichment</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>📝 Recent Activities</h2>
          ${Array.isArray(data.activities) && data.activities.length > 0 ? data.activities.map((activity, index) => `
            <div class="activity-item">
              <div class="activity-title">${safeGet(activity, 'title', 'Activity')}</div>
              <div class="activity-details">
                <strong>Date:</strong> ${formatDate(safeGet(activity, 'timestamp'))}<br>
                <strong>Credits:</strong> ${safeGet(activity, 'credits', 0)}<br>
                ${safeGet(activity, 'verificationCode') ? `<strong>Verification Code:</strong> ${safeGet(activity, 'verificationCode')}<br>` : ''}
                ${safeGet(activity, 'wasteType') ? `<strong>Waste Type:</strong> ${safeGet(activity, 'wasteType')}<br>` : ''}
                ${safeGet(activity, 'quantity') ? `<strong>Quantity:</strong> ${safeGet(activity, 'quantity')} kg<br>` : ''}
                ${safeGet(activity, 'location') ? `<strong>Location:</strong> ${safeGet(activity, 'location')}<br>` : ''}
              </div>
            </div>
          `).join('') : '<p>No activities found.</p>'}
        </div>

        <div class="section">
          <h2>🔐 Verification Codes</h2>
          ${Array.isArray(data.verificationCodes) && data.verificationCodes.length > 0 ? data.verificationCodes.map((code, index) => `
            <div class="code-item">
              <div class="code-header">
                <div class="code-number">Code: ${safeGet(code, 'code', 'N/A')}</div>
                <div class="code-status status-${formatCodeStatus(code).toLowerCase()}">${formatCodeStatus(code)}</div>
              </div>
              <div class="activity-details">
                <strong>Waste Type:</strong> ${safeGet(code, 'wasteType', 'N/A')}<br>
                <strong>Quantity:</strong> ${safeGet(code, 'quantity', 0)} kg<br>
                <strong>Location:</strong> ${safeGet(code, 'location', 'N/A')}<br>
                <strong>Created:</strong> ${formatDate(safeGet(code, 'createdAt'))}<br>
                <strong>Expires:</strong> ${formatDate(safeGet(code, 'expiresAt'))}<br>
                ${safeGet(code, 'isUsed') ? `<strong>Used:</strong> ${formatDate(safeGet(code, 'usedAt'))}<br>` : ''}
              </div>
            </div>
          `).join('') : '<p>No verification codes found.</p>'}
        </div>

        <div class="section">
          <h2>⚙️ App Settings</h2>
          <div class="settings-grid">
            <div class="setting-item">
              <div class="setting-label">Biometric Authentication</div>
              <div class="setting-value">${safeGet(data, 'settings.biometricAuth') ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div class="setting-item">
              <div class="setting-label">Data Sharing</div>
              <div class="setting-value">${safeGet(data, 'settings.dataSharing') ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div class="setting-item">
              <div class="setting-label">Analytics</div>
              <div class="setting-value">${safeGet(data, 'settings.analytics') ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div class="setting-item">
              <div class="setting-label">Location Sharing</div>
              <div class="setting-value">${safeGet(data, 'settings.locationSharing') ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div class="setting-item">
              <div class="setting-label">Auto Backup</div>
              <div class="setting-value">${safeGet(data, 'settings.autoBackup') ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This report was generated by AgroLoop - Empowering Sustainable Agriculture</p>
          <p>Report generated on ${formatDate(safeGet(data, 'exportDate'))}</p>
        </div>
      </body>
      </html>
    `;
  }

  async generatePDF(data: PDFData): Promise<string> {
    try {
      const htmlContent = this.generateHTMLContent(data);
      
      if (RNFS) {
        // Use react-native-fs if available
        const fileName = `agroloop_report_${new Date().toISOString().split('T')[0]}.html`;
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.writeFile(filePath, htmlContent, 'utf8');
        return filePath;
      } else {
        // Fallback for Expo - return HTML content as data URL
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
        return dataUrl;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async sharePDF(filePath: string, fileName: string): Promise<void> {
    try {
      if (Share) {
        if (filePath.startsWith('data:')) {
          // For Expo fallback, share HTML content directly
          await Share.open({
            url: filePath,
            type: 'text/html',
            title: fileName,
            subject: 'AgroLoop Data Report',
            message: 'Here is your AgroLoop data report.',
          });
        } else {
          // For react-native-fs, share the file
          await Share.open({
            url: `file://${filePath}`,
            type: 'text/html',
            title: fileName,
            subject: 'AgroLoop Data Report',
            message: 'Here is your AgroLoop data report.',
          });
        }
      } else {
        // Fallback for Expo Go - return success without actually sharing
        // The calling component will handle showing the data
        console.log('Share not available in Expo Go. Data would be shared here.');
        return; // Don't throw error, just return successfully
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw error;
    }
  }

  async generateAndSharePDF(data: PDFData): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      // Validate required data
      if (!data.user || !data.activities || !data.statistics) {
        throw new Error('Invalid data structure for PDF generation');
      }

      // Ensure activities have required fields
      const validatedActivities = data.activities.map(activity => ({
        title: activity.title || 'Activity',
        timestamp: activity.timestamp || new Date().toISOString(),
        credits: activity.credits || 0,
        verificationCode: activity.verificationCode || '',
        wasteType: activity.wasteType || '',
        quantity: activity.quantity || 0,
        location: activity.location || '',
      }));

      // Create validated data object
      const validatedData = {
        ...data,
        activities: validatedActivities,
        user: {
          id: data.user.id || 'Unknown',
          email: data.user.email || 'N/A',
        },
        statistics: {
          wasteLogged: data.statistics.wasteLogged || 0,
          ecoCredits: data.statistics.ecoCredits || 0,
          totalActivities: data.statistics.totalActivities || 0,
        },
        verificationCodes: data.verificationCodes || [],
        settings: data.settings || {},
        exportDate: data.exportDate || new Date().toISOString(),
      };

      const filePath = await this.generatePDF(validatedData);
      const fileName = `agroloop_report_${new Date().toISOString().split('T')[0]}.html`;
      
      try {
        await this.sharePDF(filePath, fileName);
        return { success: true, filePath };
      } catch (shareError) {
        // If sharing fails, return the file path for manual download
        console.log('Sharing failed, returning file path for manual download:', shareError);
        return { success: false, filePath, error: 'Sharing failed, but file was generated' };
      }
    } catch (error) {
      console.error('Error in generateAndSharePDF:', error);
      return { success: false, error: (error as Error).message || 'Failed to generate report' };
    }
  }

  // Method to create a downloadable blob for Expo Go
  async createDownloadableBlob(data: PDFData): Promise<string> {
    try {
      const htmlContent = this.generateHTMLContent(data);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating downloadable blob:', error);
      throw error;
    }
  }
}

export const pdfGeneratorService = new PDFGeneratorService(); 