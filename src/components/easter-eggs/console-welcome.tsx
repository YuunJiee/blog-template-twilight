'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

export function ConsoleWelcome() {
    useEffect(() => {
        const style = 'background: #222; color: #bada55; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;';
        console.log(`%cWelcome to ${siteConfig.name}!`, style);
        console.log('Found a bug? Or an Easter Egg? Let me know! 😉');
    }, []);

    return null;
}
