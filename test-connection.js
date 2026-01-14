const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

console.log('データベース接続テスト中...');

client.connect()
  .then(() => {
    console.log('✅ 接続成功！');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('PostgreSQL:', result.rows[0].version);
    client.end();
    console.log('\n✅ 次のステップ: npm run db:push');
  })
  .catch(err => {
    console.error('❌ 接続失敗:', err.message);
    process.exit(1);
  });