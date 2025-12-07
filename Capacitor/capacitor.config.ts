import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.supplabs.app',
    appName: 'SuppLabs',
    webDir: 'www',
    server: {
        url: 'https://www.supplabs.com.tr/',
        allowNavigation: [
            'supplabs.com.tr',
            '*.supplabs.com.tr'
        ],
        cleartext: true
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true
    }
};

export default config;

