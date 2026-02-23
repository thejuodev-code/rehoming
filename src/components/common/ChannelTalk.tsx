'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        ChannelIO?: (...args: any[]) => void;
        ChannelIOInitialized?: boolean;
    }
}

export default function ChannelTalk() {
    useEffect(() => {
        const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY;
        if (!pluginKey || typeof window === 'undefined') return;

        // 이미 스크립트가 삽입된 경우 boot만 재실행
        if (window.ChannelIOInitialized && window.ChannelIO) {
            window.ChannelIO('boot', { pluginKey });
            return () => { window.ChannelIO?.('shutdown'); };
        }

        // 채널톡 SDK 스텁 설정
        const ch: any = (...args: any[]) => { ch.q.push(args); };
        ch.q = [];
        window.ChannelIO = ch;

        // 스크립트 동적 삽입
        const script = document.createElement('script');
        script.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
        script.async = true;
        script.onload = () => {
            window.ChannelIOInitialized = true;
            window.ChannelIO?.('boot', { pluginKey });
        };
        document.head.appendChild(script);

        return () => {
            window.ChannelIO?.('shutdown');
        };
    }, []);

    return null;
}
