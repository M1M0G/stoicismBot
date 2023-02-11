declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            CHAT_ID: string;
            PORT?: number;
            WEBHOOK_DOMAIN?: string;
        }
    }
}

export {}