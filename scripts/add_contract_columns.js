/**
 * Add new columns to contracts table
 * - start_date: Başlangıç tarihi
 * - expiry_date: Bitiş tarihi (zorunlu)
 * - contract_type: Sözleşme türü
 * - status: Durum
 * - contract_value: Sözleşme değeri
 * - currency: Para birimi
 * - party_name: Karşı taraf adı
 * - party_contact: Karşı taraf iletişim
 * - party_email: Karşı taraf email
 */
const db = require('../src/config/db');

const columns = [
  { name: 'start_date', sql: 'ALTER TABLE contracts ADD COLUMN start_date TEXT' },
  { name: 'expiry_date', sql: 'ALTER TABLE contracts ADD COLUMN expiry_date TEXT' },
  { name: 'contract_type', sql: "ALTER TABLE contracts ADD COLUMN contract_type TEXT DEFAULT 'other'" },
  { name: 'status', sql: "ALTER TABLE contracts ADD COLUMN status TEXT DEFAULT 'active'" },
  { name: 'contract_value', sql: 'ALTER TABLE contracts ADD COLUMN contract_value REAL' },
  { name: 'currency', sql: "ALTER TABLE contracts ADD COLUMN currency TEXT DEFAULT 'EUR'" },
  { name: 'party_name', sql: 'ALTER TABLE contracts ADD COLUMN party_name TEXT' },
  { name: 'party_contact', sql: 'ALTER TABLE contracts ADD COLUMN party_contact TEXT' },
  { name: 'party_email', sql: 'ALTER TABLE contracts ADD COLUMN party_email TEXT' }
];

console.log('🚀 Contracts tablosuna yeni sütunlar ekleniyor...\n');

let successCount = 0;
let skipCount = 0;

columns.forEach(col => {
  try {
    db.exec(col.sql);
    console.log(`✅ ${col.name} sütunu eklendi`);
    successCount++;
  } catch (err) {
    if (err.message.includes('duplicate column')) {
      console.log(`⏭️  ${col.name} sütunu zaten var, atlanıyor`);
      skipCount++;
    } else {
      console.error(`❌ ${col.name} eklenirken hata:`, err.message);
    }
  }
});

// Create index on expiry_date for fast lookups
try {
  db.exec('CREATE INDEX IF NOT EXISTS idx_contracts_expiry_date ON contracts(expiry_date)');
  console.log('\n✅ expiry_date index oluşturuldu');
} catch (err) {
  console.log('⏭️  expiry_date index zaten var');
}

// Create index on status
try {
  db.exec('CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status)');
  console.log('✅ status index oluşturuldu');
} catch (err) {
  console.log('⏭️  status index zaten var');
}

console.log(`\n🎉 Tamamlandı! ${successCount} sütun eklendi, ${skipCount} atlandı.`);
process.exit(0);
