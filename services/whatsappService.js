const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;

exports.initializeWhatsApp = () => {
    console.log('WhatsApp: Starting client initialization...');

    client = new Client({
        authStrategy: new LocalAuth(),
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
        },
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-extensions',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        }
    });

    client.on('qr', (qr) => {
        isReady = false;
        console.log('WhatsApp: QR Code received. Please scan:');
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log('WhatsApp: Authenticated successfully!');
    });

    client.on('auth_failure', (msg) => {
        isReady = false;
        console.error('WhatsApp: Authentication failure:', msg);
    });

    client.on('ready', () => {
        isReady = true;
        console.log('WhatsApp: Client is ready and connected!');
    });

    client.on('disconnected', (reason) => {
        isReady = false;
        console.log('WhatsApp: Client disconnected:', reason);
        // Attempt to re-initialize if it wasn't a manual logout
        if (reason !== 'NAVIGATION') {
            console.log('WhatsApp: Attempting to reconnect...');
            client.initialize();
        }
    });

    client.initialize().catch(err => {
        console.error('WhatsApp: Initialization Error:', err.message);
    });
};

exports.sendMessage = async (number, message) => {
    try {
        if (!client) {
            throw new Error('Client not created');
        }

        if (!isReady) {
            console.warn(`WhatsApp: Cannot send message to ${number} - Client is not ready yet.`);
            return;
        }

        // Robust number cleaning
        let cleanNumber = number.toString().replace(/\D/g, '');

        // Handle Malawi specific: if starts with 0 and is 10 digits, prepend 265 and drop the 0
        if (cleanNumber.length === 10 && cleanNumber.startsWith('0')) {
            cleanNumber = '265' + cleanNumber.substring(1);
        } else if (cleanNumber.length === 9 && !cleanNumber.startsWith('265')) {
            // If it's 9 digits (no leading 0), assume it needs 265
            cleanNumber = '265' + cleanNumber;
        }

        if (!cleanNumber || cleanNumber.length < 10) {
            throw new Error(`Invalid phone number format: ${number}`);
        }

        const formattedNumber = `${cleanNumber}@c.us`;
        console.log(`WhatsApp: Attempting to send message to ${formattedNumber}`);

        await client.sendMessage(formattedNumber, message);
        console.log(`WhatsApp: Message sent successfully to ${cleanNumber}`);
    } catch (error) {
        console.error('WhatsApp: Detailed Send Error:', error);
        if (error.stack) console.error('Stack:', error.stack);
    }
};
