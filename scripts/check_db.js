// Database kontrol scripti
const db = require('../src/config/db');

console.log('=== Database Tables Check ===\n');

// Tüm tabloları listele
db.all(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`, [], (err, tables) => {
  if (err) {
    console.error('Error listing tables:', err);
    return;
  }
  
  console.log('All tables in database:');
  tables.forEach(t => console.log('  -', t.name));
  console.log('');
  
  // contracts tablosu yapısı
  db.all(`PRAGMA table_info(contracts)`, [], (err, cols) => {
    if (err) {
      console.error('Error getting contracts table info:', err);
      return;
    }
    
    console.log('contracts table columns:');
    cols.forEach(c => console.log(`  - ${c.name} (${c.type})`));
    console.log('');
    
    // contract_files tablosu yapısı
    db.all(`PRAGMA table_info(contract_files)`, [], (err, cols) => {
      if (err) {
        console.error('Error getting contract_files table info:', err);
        return;
      }
      
      console.log('contract_files table columns:');
      cols.forEach(c => console.log(`  - ${c.name} (${c.type})`));
      console.log('');
      
      // Kayıt sayıları
      db.get(`SELECT COUNT(*) as count FROM contracts`, [], (err, row) => {
        console.log('Total contracts:', row ? row.count : 0);
        
        db.get(`SELECT COUNT(*) as count FROM contract_files`, [], (err, row) => {
          console.log('Total contract files:', row ? row.count : 0);
          console.log('\n=== Check Complete ===');
          process.exit(0);
        });
      });
    });
  });
});
