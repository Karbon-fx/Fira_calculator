'use client';
import { format } from 'date-fns';
import type { FircResult } from '../actions';

interface GeneratePdfParams {
  data: FircResult;
  activeTab: 'totalCost' | 'paise' | 'bps';
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const formatCurrency = (value: number, currencyCode: string = 'INR', decimals = 2) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Math.abs(value));
  if (currencyCode === 'USD') return `$${formatted}`;
  if (currencyCode === 'INR') return `₹${formatted}`;
  return `${currencyCode} ${formatted}`;
};

const generateReportId = () => `FR${Math.floor(1000 + Math.random() * 9000)}`;

// Build the HTML template for the report (optimized for A4)
function buildReportHTML(data: FircResult, activeTab: 'totalCost'|'paise'|'bps') {
  const txnDate = format(new Date(data.transactionDate), 'MMM dd, yyyy');
  const reportId = generateReportId();

  let heroLabel = '';
  let heroValue = '';
  if (activeTab === 'totalCost') {
    heroLabel = 'Total Hidden Cost';
    heroValue = formatCurrency(data.hiddenCost);
  } else if (activeTab === 'paise') {
    heroLabel = 'Effective FX Spread';
    heroValue = formatCurrency(data.spread);
  } else {
    heroLabel = 'Basis Points';
    heroValue = `${data.basisPoints.toFixed(2)} bps`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KarbonFX FIRC Analysis Report</title>
    <style>
        @page { 
            size: A4; 
            margin: 25mm; 
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            color: #0F172A;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            font-size: 13px;
        }
        .container { 
            max-width: 100%; 
            margin: 0 auto; 
            background: white; 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header { 
            background: linear-gradient(135deg, #0657d0 0%, #0846b8 100%); 
            color: white; 
            padding: 20px;
            border-radius: 6px 6px 0 0;
            flex-shrink: 0;
        }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .brand-text h1 { margin: 0; font-size: 18px; font-weight: 600; }
        .brand-text p { margin: 2px 0 0; color: #cbd5e1; font-size: 12px; }
        .report-info { text-align: right; }
        .report-info h2 { margin: 0; font-size: 20px; font-weight: 700; }
        .report-info .meta { color: #cbd5e1; font-size: 11px; margin-top: 2px; }
        .tagline { 
            text-align: center; 
            margin-top: 15px; 
            padding-top: 15px; 
            border-top: 1px solid rgba(255,255,255,0.2); 
        }
        .tagline .main { color: #facc15; font-weight: 600; font-size: 13px; }
        .tagline .sub { color: #cbd5e1; font-size: 11px; margin-top: 2px; }
        .tagline .sub a { color: #cbd5e1; text-decoration: underline; }
        
        .content { 
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .hero-section { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 16px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
        }
        .bank-info h3 { margin: 0 0 3px; color: #64748B; font-size: 12px; font-weight: normal; }
        .bank-info .value { font-size: 16px; font-weight: 700; color: #0f172a; }
        .metric { text-align: right; }
        .metric .label { color: #64748B; font-size: 12px; margin-bottom: 3px; }
        .metric .value { font-size: 22px; font-weight: 800; color: #dc2626; }
        
        .section { margin-bottom: 16px; }
        .section-title { 
            font-size: 16px; 
            font-weight: 700; 
            color: #0f172a; 
            margin-bottom: 10px; 
            padding-bottom: 4px; 
            border-bottom: 2px solid #e2e8f0; 
        }
        
        .details-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr; 
            gap: 16px; 
            padding: 16px; 
            background: #f8fafc; 
            border-radius: 6px; 
            margin-bottom: 12px; 
        }
        .detail-item .label { color: #64748B; font-size: 10px; margin-bottom: 2px; }
        .detail-item .value { font-weight: 600; color: #0f172a; font-size: 12px; }
        
        .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .table th { 
            background: #f1f5f9; 
            padding: 8px; 
            text-align: left; 
            font-size: 10px; 
            font-weight: 600; 
            color: #475569; 
            border-bottom: 1px solid #e2e8f0; 
        }
        .table td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        .table .highlight { background: #fef2f2; color: #991b1b; font-weight: 600; }
        .table .positive { color: #15803d; }
        
        .impact-box { 
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
            border: 2px solid #fecaca; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
            margin-top: 8px;
        }
        .impact-box .title { color: #991b1b; font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .impact-box .calculation { color: #b91c1c; font-size: 11px; margin-bottom: 8px; }
        .impact-box .amount { color: #991b1b; font-size: 26px; font-weight: 800; margin-bottom: 6px; }
        .impact-box .note { color: #b91c1c; font-size: 10px; }

        .disclaimer-note {
            margin-top: 12px;
            padding: 12px 16px;
            background: #f1f5f9;
            border-left: 4px solid #0657d0;
            border-radius: 4px;
        }
        .disclaimer-note .note-title {
            font-size: 11px;
            font-weight: 700;
            color: #0657d0;
            margin-bottom: 4px;
        }
        .disclaimer-note .note-text {
            font-size: 10px;
            color: #475569;
            line-height: 1.5;
        }

        .footer {
            background: linear-gradient(135deg, #0657d0 0%, #0846b8 100%);
            color: white;
            padding: 20px;
            border-radius: 0 0 6px 6px;
            flex-shrink: 0;
            margin-top: auto;
            text-align: center;
        }
        .footer-message {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: white;
        }
        .signup-button {
            display: inline-block;
            background: #facc15;
            color: #0f172a;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .signup-button:hover {
            background: #f59e0b;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Print optimization */
        @media print {
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
            }
            .container {
                min-height: auto;
            }
            .signup-button:hover {
                transform: none;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container" id="pdf-content">
        <header class="header">
            <div class="header-content">
                <div class="brand-text">
                    <h1>FIRC Analysis Report</h1>
                    <p>Karbon Forex</p>
                </div>
                <div class="report-info">
                    <h2>Report #${reportId}</h2>
                    <div class="meta">
                        <div>Report Generated</div>
                        <div style="font-weight: 600; margin-top: 1px;">${format(new Date(), 'MMM dd, yyyy')}</div>
                    </div>
                </div>
            </div>
            <div class="tagline">
                <div class="main">Your bank hides fees. Karbon doesn't. Switch now.</div>
                <div class="sub"><a href="https://www.karboncard.com" target="_blank">www.karboncard.com</a></div>
            </div>
        </header>

        <main class="content">
            <div class="hero-section">
                <div class="bank-info">
                    <h3>Bank</h3>
                    <div class="value">${data.bankName}</div>
                </div>
                <div class="metric">
                    <div class="label">${heroLabel}</div>
                    <div class="value">${heroValue}</div>
                </div>
            </div>

            <section class="section">
                <h2 class="section-title">Transaction Overview</h2>
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="label">BANK INSTITUTION</div>
                        <div class="value">${data.bankName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="label">TRANSACTION DATE</div>
                        <div class="value">${txnDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="label">PURPOSE CODE</div>
                        <div class="value">${data.purposeCode}</div>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Exchange Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.foreignCurrencyCode} Transaction</td>
                            <td>${data.foreignCurrencyCode}</td>
                            <td>${formatCurrency(data.foreignCurrencyAmount, data.foreignCurrencyCode)}</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>INR Received (Bank Rate)</td>
                            <td>INR</td>
                            <td>${formatCurrency(data.inrCredited)}</td>
                            <td>${formatCurrency(data.bankRate, 'INR', 4)}</td>
                        </tr>
                        <tr class="positive">
                            <td>Fair Market Rate</td>
                            <td>INR</td>
                            <td>${formatCurrency(data.foreignCurrencyAmount * data.midMarketRate)}</td>
                            <td>${formatCurrency(data.midMarketRate, 'INR', 4)}</td>
                        </tr>
                        <tr class="highlight">
                            <td><strong>Hidden Cost</strong></td>
                            <td><strong>INR</strong></td>
                            <td><strong>${formatCurrency(data.hiddenCost)}</strong></td>
                            <td><strong>${formatCurrency(data.spread, 'INR', 2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="section">
                <h2 class="section-title">Financial Impact</h2>
                <div class="impact-box">
                    <div class="title">Total Hidden Cost</div>
                    <div class="calculation">${formatCurrency(data.spread, 'INR', 2)} × ${formatCurrency(data.foreignCurrencyAmount, data.foreignCurrencyCode)}</div>
                    <div class="amount">${formatCurrency(data.hiddenCost)}</div>
                    <div class="note">Amount lost due to unfavorable exchange rate</div>
                </div>

                <div class="disclaimer-note">
                    <div class="note-title">Note:</div>
                    <div class="note-text">This analysis highlights the potential savings you could achieve with transparent forex services. All calculations are based on the available market rates for your transaction date.</div>
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="footer-message">Simplify your business payments</div>
            <a href="https://karbonfx.com/signup-v2-form" target="_blank" class="signup-button">
                Signup now
            </a>
        </footer>
    </div>
</body>
</html>`;
}

export const generateFircReport = async ({ 
  data, 
  activeTab, 
  onStart, 
  onSuccess, 
  onError 
}: GeneratePdfParams): Promise<void> => {
  try {
    // Notify loading start
    onStart?.();
    
    const htmlContent = buildReportHTML(data, activeTab);
    
    // Check if html2pdf is available, if not, load it dynamically
    if (typeof (window as any).html2pdf === 'undefined') {
      // Create script element to load html2pdf
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => generatePDFWithHtml2pdf(htmlContent, data, onSuccess, onError);
      script.onerror = () => onError?.('Failed to load PDF library');
      document.head.appendChild(script);
    } else {
      await generatePDFWithHtml2pdf(htmlContent, data, onSuccess, onError);
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF report';
    onError?.(errorMessage);
    
    // Fallback: Print dialog
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(buildReportHTML(data, activeTab));
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
};

function generatePDFWithHtml2pdf(
  htmlContent: string, 
  data: FircResult, 
  onSuccess?: () => void, 
  onError?: (error: string) => void
) {
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);
  
  const element = tempDiv.querySelector('#pdf-content');
  const filename = `KarbonFX_FIRC_Analysis_Report_${format(new Date(data.transactionDate), 'yyyyMMdd')}.pdf`;
  
  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  
  (window as any).html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // Clean up
      document.body.removeChild(tempDiv);
      onSuccess?.();
    })
    .catch((error: any) => {
      console.error('PDF generation failed:', error);
      document.body.removeChild(tempDiv);
      const errorMessage = error?.message || 'PDF generation failed';
      onError?.(errorMessage);
    });
}
