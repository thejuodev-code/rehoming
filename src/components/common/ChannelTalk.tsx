'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        ChannelIO?: any;
        ChannelIOInitialized?: boolean;
    }
}

export default function ChannelTalk() {
    useEffect(() => {
        // 플러그인 키 입력: 환경변수 혹은 직접 입력
        const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY || "b33d2fd1-0bb6-4a15-9868-2f78657ed297";

        // SSR 환경에서는 실행하지 않음
        if (typeof window === 'undefined') return;

        // 채널톡 스크립트 로드
        (function () {
            var w = window as any;
            if (w.ChannelIO) {
                return w.console.error('ChannelIO script included twice.');
            }
            var ch: any = function () {
                ch.c(arguments);
            };
            ch.q = [];
            ch.c = function (args: any) {
                ch.q.push(args);
            };
            w.ChannelIO = ch;
            function l() {
                if (w.ChannelIOInitialized) {
                    return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                s.charset = 'UTF-8';
                var x = document.getElementsByTagName('script')[0];
                if (x.parentNode) {
                    x.parentNode.insertBefore(s, x);
                }
            }
            if (document.readyState === 'complete') {
                l();
            } else {
                w.addEventListener('DOMContentLoaded', l, false);
                w.addEventListener('load', l, false);
            }
        })();

        // 채널톡 부트
        if (window.ChannelIO) {
            window.ChannelIO('boot', {
                pluginKey: pluginKey,
            });
        }

        // 컴포넌트 언마운트 시 채널톡 종료
        return () => {
            if (window.ChannelIO) {
                window.ChannelIO('shutdown');
            }
        };
    }, []);

    return null;
}
