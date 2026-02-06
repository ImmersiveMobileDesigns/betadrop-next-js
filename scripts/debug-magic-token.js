const { Client } = require('ssh2');

const config = {
    host: 'betadrop.app',
    port: 22,
    username: 'imobiledesigns-betadrop',
    password: 'vrSafaagEEtqWRP6vc6m',
};

const remotePath = '/home/imobiledesigns-betadrop/htdocs/betadrop.app';

const conn = new Client();

console.log('🔍 BetaDrop Magic Token Status');
console.log('==============================\n');

conn.on('ready', () => {
    console.log('✅ Connected\n');

    // Create a temporary script on the server
    const nodeScript = `
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
    
    // Get server time
    const [[serverTime]] = await pool.execute('SELECT NOW() as now');
    console.log('Server MySQL Time:', serverTime.now);
    console.log('');
    
    // Get all recent tokens
    const [tokens] = await pool.execute(\`
        SELECT 
            email,
            LEFT(token, 8) as token_start,
            expires_at,
            used_at,
            created_at,
            TIMESTAMPDIFF(MINUTE, created_at, expires_at) as expires_in_mins,
            CASE 
                WHEN used_at IS NOT NULL THEN 'USED'
                WHEN expires_at < NOW() THEN 'EXPIRED'
                ELSE 'ACTIVE'
            END as status
        FROM magic_tokens 
        ORDER BY created_at DESC 
        LIMIT 10
    \`);
    
    console.log('=== Recent Magic Tokens ===');
    tokens.forEach(t => {
        console.log(\`Email: \${t.email}\`);
        console.log(\`  Token: \${t.token_start}...\`);
        console.log(\`  Status: \${t.status}\`);
        console.log(\`  Created: \${t.created_at}\`);
        console.log(\`  Expires: \${t.expires_at} (in \${t.expires_in_mins} mins)\`);
        console.log(\`  Used at: \${t.used_at || 'Not used'}\`);
        console.log('');
    });
    
    if (tokens.length === 0) {
        console.log('No tokens found in database!');
    }
    
    // Count by status
    const [stats] = await pool.execute(\`
        SELECT 
            SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END) as used,
            SUM(CASE WHEN used_at IS NULL AND expires_at < NOW() THEN 1 ELSE 0 END) as expired,
            SUM(CASE WHEN used_at IS NULL AND expires_at > NOW() THEN 1 ELSE 0 END) as active
        FROM magic_tokens
    \`);
    
    console.log('=== Token Statistics ===');
    console.log(\`Active: \${stats[0].active}\`);
    console.log(\`Expired: \${stats[0].expired}\`);
    console.log(\`Used: \${stats[0].used}\`);
    
    await pool.end();
})().catch(e => console.error('Error:', e.message));
`;

    const commands = [
        `cd ${remotePath}`,
        `echo '${nodeScript.replace(/'/g, "'\\''")}' > /tmp/debug_tokens.js`,
        `node /tmp/debug_tokens.js`,
        `rm /tmp/debug_tokens.js`
    ].join(' && ');

    let output = '';

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log(output);
            conn.end();
        }).on('data', (data) => {
            output += data.toString();
        }).stderr.on('data', (data) => {
            output += data.toString();
        });
    });
}).on('error', (err) => {
    console.error('❌ Error:', err.message);
}).connect(config);
