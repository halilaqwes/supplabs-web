import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.supplabs.app',
    appName: 'SuppLabs',
    webDir: 'www',
    server: {
        url: 'https://supplabs.xyz',
        cleartext: false
    },
    android: {
        allowMixedContent: false,
        captureInput: true,
        webContentsDebuggingEnabled: true
    }
};

export default config;

