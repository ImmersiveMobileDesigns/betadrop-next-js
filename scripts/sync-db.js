const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'betadrop.app',
    port: 22,
    username: 'imobiledesigns-betadrop',
    password: 'vrSafaagEEtqWRP6vc6m',
};

const remotePath = '/home/imobiledesigns-betadrop/htdocs/betadrop.app';
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

const conn = new Client();

console.log('Connecting to ' + config.host + '...');

conn.on('ready', () => {
    console.log('Client :: ready');

    conn.sftp((err, sftp) => {
        if (err) {
            console.error('SFTP error:', err);
            conn.end();
            return;
        }

        console.log('Uploading schema.prisma...');
        try {
            const localSchema = fs.readFileSync(schemaPath);
            const remoteSchemaPath = `${remotePath}/prisma/schema.prisma`;

            sftp.writeFile(remoteSchemaPath, localSchema, (err) => {
                if (err) {
                    console.error('Failed to upload schema:', err);
                    conn.end();
                    return;
                }
                console.log('Schema uploaded successfully.');

                // Commands to run
                const commands = [
                    `cd ${remotePath}`,
                    // Setup .env
                    `sed -i "s|DATABASE_URL=.*|DATABASE_URL=mysql://imd-betadrop:JqgzFA61QCaw734RLVEA@localhost:3306/betadrop|g" .env`,
                    `sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://betadrop.app|g" .env`,
                    `sed -i "s|PROD_DB_NAME=.*|PROD_DB_NAME=betadrop|g" .env`,
                    `if ! grep -q "WEBAUTHN_RP_ID=" .env; then echo "WEBAUTHN_RP_ID=betadrop.app" >> .env; else sed -i "s|WEBAUTHN_RP_ID=.*|WEBAUTHN_RP_ID=betadrop.app|g" .env; fi`,

                    // Diagnostics and Push
                    `echo "--- MySQL Connection Check ---"`,
                    `mysql -u imd-betadrop -p'JqgzFA61QCaw734RLVEA' -e "SHOW DATABASES;" || echo "MySQL Check Failed"`,
                    `echo "--- Running Prisma Push ---"`,
                    `export PATH=$PATH:/usr/local/bin:/usr/bin`,
                    `npx prisma db push --accept-data-loss --skip-generate`
                ].join(' && ');

                console.log('Executing remote commands...');
                let stdOut = '';
                let stdErr = '';
                conn.exec(commands, (err, stream) => {
                    if (err) throw err;
                    stream.on('close', (code, signal) => {
                        console.log('--- REMOTE STDOUT ---');
                        console.log(stdOut);
                        console.log('--- REMOTE STDERR ---');
                        console.log(stdErr);
                        console.log('--- END (Code: ' + code + ') ---');
                        conn.end();
                    }).on('data', (data) => {
                        stdOut += data.toString();
                    }).stderr.on('data', (data) => {
                        stdErr += data.toString();
                    });
                });
            });
        } catch (e) {
            console.error("Local file read error:", e);
            conn.end();
        }
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);
