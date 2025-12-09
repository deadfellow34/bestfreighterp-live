/**
 * CMR (Convention on the Contract for the International Carriage of Goods by Road) Generator
 * Generates international CMR consignment notes
 */

const PdfPrinter = require('pdfmake');
const fonts = require('../../pdf/fonts');

const printer = new PdfPrinter(fonts);

/**
 * Generate CMR PDF document
 * @param {Object} load - Load data from database
 * @param {Object} options - Optional settings
 * @returns {PDFDocument} pdfmake document
 */
function generateCMR(load, options = {}) {
  const cmrNumber = options.cmrNumber || `CMR-${load.position_no || load.id}`;
  const issueDate = options.issueDate || new Date().toLocaleDateString('tr-TR');
  
  // Helper function for empty values
  const val = (v) => v || '-';
  
  // Format date helper
  const formatDate = (d) => {
    if (!d) return '-';
    try {
      const date = new Date(d);
      return date.toLocaleDateString('tr-TR');
    } catch (e) {
      return d;
    }
  };

  // CMR document definition following international standard format
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [20, 20, 20, 20],
    
    content: [
      // Header
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'CMR', fontSize: 28, bold: true, color: '#1e40af' },
              { text: 'ULUSLARARASI TAŞ. SÖZL.', fontSize: 9, color: '#64748b', margin: [0, 2, 0, 0] },
              { text: 'Convention Relative au Contrat de Transport', fontSize: 7, color: '#94a3b8', italics: true }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: 'CMR No:', fontSize: 9, color: '#64748b', alignment: 'right' },
              { text: cmrNumber, fontSize: 14, bold: true, color: '#1e40af', alignment: 'right' },
              { text: `Tarih: ${issueDate}`, fontSize: 9, color: '#64748b', alignment: 'right', margin: [0, 4, 0, 0] }
            ]
          }
        ],
        margin: [0, 0, 0, 15]
      },
      
      // Divider
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 2, lineColor: '#1e40af' }], margin: [0, 0, 0, 15] },
      
      // 1. Sender (Gönderici)
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              {
                stack: [
                  { text: '1. GÖNDERİCİ / SENDER', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 4] },
                  { text: val(load.customer_name), fontSize: 11, bold: true },
                  { text: `${val(load.loading_city)}, ${val(load.loading_country)}`, fontSize: 9, color: '#475569' },
                  { text: val(load.loading_address), fontSize: 8, color: '#64748b', margin: [0, 2, 0, 0] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                fillColor: '#f8fafc',
                margin: [8, 8, 8, 8]
              },
              {
                stack: [
                  { text: '2. ALICI / CONSIGNEE', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 4] },
                  { text: val(load.consignee_name), fontSize: 11, bold: true },
                  { text: `${val(load.unloading_city)}, ${val(load.unloading_country)}`, fontSize: 9, color: '#475569' },
                  { text: val(load.unloading_address), fontSize: 8, color: '#64748b', margin: [0, 2, 0, 0] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                fillColor: '#f8fafc',
                margin: [8, 8, 8, 8]
              }
            ]
          ]
        },
        layout: {
          defaultBorder: false,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0
        },
        margin: [0, 0, 0, 10]
      },
      
      // 3. Loading Place / 4. Delivery Place
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              {
                stack: [
                  { text: '3. YÜKLEME YERİ / PLACE OF LOADING', fontSize: 8, bold: true, color: '#059669', margin: [0, 0, 0, 4] },
                  { text: val(load.loading_address), fontSize: 10 },
                  { text: `${val(load.loading_city)}, ${val(load.loading_country)}`, fontSize: 9, color: '#475569' },
                  { text: `Yükleme Tarihi: ${formatDate(load.loading_date)}`, fontSize: 8, color: '#64748b', margin: [0, 4, 0, 0] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 8, 8, 8]
              },
              {
                stack: [
                  { text: '4. TESLİM YERİ / PLACE OF DELIVERY', fontSize: 8, bold: true, color: '#dc2626', margin: [0, 0, 0, 4] },
                  { text: val(load.unloading_address), fontSize: 10 },
                  { text: `${val(load.unloading_city)}, ${val(load.unloading_country)}`, fontSize: 9, color: '#475569' },
                  { text: `Varış Tarihi: ${formatDate(load.arrival_date)}`, fontSize: 8, color: '#64748b', margin: [0, 4, 0, 0] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 8, 8, 8]
              }
            ]
          ]
        },
        layout: {
          defaultBorder: false,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0
        },
        margin: [0, 0, 0, 10]
      },
      
      // 5-10. Goods Description
      {
        stack: [
          { text: '5-10. MAL BİLGİLERİ / GOODS DESCRIPTION', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['*', '15%', '15%', '15%', '15%'],
              headerRows: 1,
              body: [
                [
                  { text: 'Açıklama / Description', style: 'tableHeader' },
                  { text: 'Koli', style: 'tableHeader', alignment: 'center' },
                  { text: 'Palet', style: 'tableHeader', alignment: 'center' },
                  { text: 'Brüt (kg)', style: 'tableHeader', alignment: 'center' },
                  { text: 'LDM', style: 'tableHeader', alignment: 'center' }
                ],
                [
                  { text: val(load.goods_description), fontSize: 10 },
                  { text: val(load.packages), fontSize: 10, alignment: 'center' },
                  { text: val(load.pallets), fontSize: 10, alignment: 'center' },
                  { text: val(load.gross_weight), fontSize: 10, alignment: 'center' },
                  { text: val(load.ldm), fontSize: 10, alignment: 'center' }
                ]
              ]
            },
            layout: {
              hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => '#e2e8f0',
              vLineColor: () => '#e2e8f0',
              fillColor: (row) => row === 0 ? '#f1f5f9' : null,
              paddingLeft: () => 8,
              paddingRight: () => 8,
              paddingTop: () => 6,
              paddingBottom: () => 6
            }
          }
        ],
        margin: [0, 0, 0, 15]
      },
      
      // 11-15. Transport Details
      {
        stack: [
          { text: '11-15. TAŞIMA BİLGİLERİ / TRANSPORT DETAILS', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['33.33%', '33.33%', '33.34%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'Çekici Plaka', fontSize: 7, color: '#64748b' },
                      { text: val(load.truck_plate), fontSize: 12, bold: true }
                    ],
                    border: [true, true, true, true],
                    borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                    margin: [8, 6, 8, 6]
                  },
                  {
                    stack: [
                      { text: 'Dorse Plaka', fontSize: 7, color: '#64748b' },
                      { text: val(load.trailer_plate), fontSize: 12, bold: true }
                    ],
                    border: [true, true, true, true],
                    borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                    margin: [8, 6, 8, 6]
                  },
                  {
                    stack: [
                      { text: 'Şoför', fontSize: 7, color: '#64748b' },
                      { text: val(load.driver_name), fontSize: 12, bold: true }
                    ],
                    border: [true, true, true, true],
                    borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                    margin: [8, 6, 8, 6]
                  }
                ]
              ]
            },
            layout: { defaultBorder: false }
          }
        ],
        margin: [0, 0, 0, 15]
      },
      
      // 16-18. Seal & MRN
      {
        table: {
          widths: ['33.33%', '33.33%', '33.34%'],
          body: [
            [
              {
                stack: [
                  { text: '16. MÜHÜR NO / SEAL NO', fontSize: 7, color: '#64748b' },
                  { text: val(load.seal_code), fontSize: 12, bold: true, color: '#7c3aed' }
                ],
                border: [true, true, true, true],
                borderColor: ['#7c3aed', '#7c3aed', '#7c3aed', '#7c3aed'],
                fillColor: '#faf5ff',
                margin: [8, 6, 8, 6]
              },
              {
                stack: [
                  { text: '17. MRN NO', fontSize: 7, color: '#64748b' },
                  { text: val(load.mrn_no || load.t1_mrn), fontSize: 10, bold: true }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 6, 8, 6]
              },
              {
                stack: [
                  { text: '18. ÇIKIŞ TARİHİ', fontSize: 7, color: '#64748b' },
                  { text: formatDate(load.exit_date), fontSize: 10, bold: true }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 6, 8, 6]
              }
            ]
          ]
        },
        layout: { defaultBorder: false },
        margin: [0, 0, 0, 15]
      },
      
      // 19-22. Commercial Terms
      {
        stack: [
          { text: '19-22. NAVLUN BİLGİLERİ / FREIGHT CHARGES', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'Navlun / Freight', fontSize: 8, color: '#64748b' },
                      {
                        text: load.navlun_amount ? `${load.navlun_amount} ${load.navlun_currency || 'EUR'}` : '-',
                        fontSize: 14,
                        bold: true,
                        color: '#059669'
                      }
                    ],
                    border: [true, true, true, true],
                    borderColor: ['#059669', '#059669', '#059669', '#059669'],
                    fillColor: '#f0fdf4',
                    margin: [8, 8, 8, 8]
                  },
                  {
                    stack: [
                      { text: 'Pozisyon No', fontSize: 8, color: '#64748b' },
                      { text: val(load.position_no), fontSize: 14, bold: true, color: '#1e40af' }
                    ],
                    border: [true, true, true, true],
                    borderColor: ['#1e40af', '#1e40af', '#1e40af', '#1e40af'],
                    fillColor: '#eff6ff',
                    margin: [8, 8, 8, 8]
                  }
                ]
              ]
            },
            layout: { defaultBorder: false }
          }
        ],
        margin: [0, 0, 0, 15]
      },
      
      // Notes section
      {
        stack: [
          { text: '23. NOTLAR / REMARKS', fontSize: 8, bold: true, color: '#1e40af', margin: [0, 0, 0, 4] },
          {
            text: val(load.notes),
            fontSize: 9,
            color: '#475569',
            margin: [0, 0, 0, 0]
          }
        ],
        fillColor: '#f8fafc',
        border: [true, true, true, true],
        borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
        margin: [0, 0, 0, 20]
      },
      
      // Signatures Section
      {
        table: {
          widths: ['33.33%', '33.33%', '33.34%'],
          body: [
            [
              {
                stack: [
                  { text: '22. GÖNDERİCİ İMZASI', fontSize: 7, bold: true, color: '#64748b' },
                  { text: 'Sender\'s Signature', fontSize: 6, color: '#94a3b8', italics: true },
                  { text: '', margin: [0, 40, 0, 0] },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 8, 8, 8]
              },
              {
                stack: [
                  { text: '23. TAŞIYICI İMZASI', fontSize: 7, bold: true, color: '#64748b' },
                  { text: 'Carrier\'s Signature', fontSize: 6, color: '#94a3b8', italics: true },
                  { text: '', margin: [0, 40, 0, 0] },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 8, 8, 8]
              },
              {
                stack: [
                  { text: '24. ALICI İMZASI', fontSize: 7, bold: true, color: '#64748b' },
                  { text: 'Consignee\'s Signature', fontSize: 6, color: '#94a3b8', italics: true },
                  { text: '', margin: [0, 40, 0, 0] },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 160, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] }
                ],
                border: [true, true, true, true],
                borderColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0'],
                margin: [8, 8, 8, 8]
              }
            ]
          ]
        },
        layout: { defaultBorder: false }
      }
    ],
    
    styles: {
      tableHeader: {
        fontSize: 8,
        bold: true,
        color: '#475569'
      }
    },
    
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10
    },
    
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `Pozisyon: ${val(load.position_no)}`, fontSize: 7, color: '#94a3b8', margin: [20, 0, 0, 0] },
          { text: `Sayfa ${currentPage} / ${pageCount}`, fontSize: 7, color: '#94a3b8', alignment: 'center' },
          { text: `Oluşturulma: ${new Date().toLocaleString('tr-TR')}`, fontSize: 7, color: '#94a3b8', alignment: 'right', margin: [0, 0, 20, 0] }
        ],
        margin: [0, 0, 0, 10]
      };
    }
  };
  
  return printer.createPdfKitDocument(docDefinition);
}

module.exports = {
  generateCMR,
  printer
};
