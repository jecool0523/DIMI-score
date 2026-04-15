import React, { useEffect, useState } from 'react';

type AnnouncementOverlayProps = {
    show: boolean;
    announcement: string;
};

export default function AnnouncementOverlay({ show, announcement }: AnnouncementOverlayProps) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4F4F4] overflow-hidden animate-in fade-in duration-500">
            <div
                className="relative w-[1920px] h-[1080px] shrink-0"
                style={{ transform: `scale(${scale})` }}
            >
                <img src="/assets/background/공지화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

                {/* Center Elements */}
                <div className="absolute left-[790.71px] w-[338.585px] h-[338.585px] top-[169.09px]">
                    <img alt="Warning Icon" className="absolute block inset-0 max-w-none size-full" src="/notice.svg" />
                </div>

                <div className="-translate-x-1/2 absolute font-sans leading-[1.5] left-1/2 text-center text-black top-[618.03px] tracking-[1.64px] w-[1500px]">
                    <p className="text-[82px] mb-0 whitespace-pre-line font-bold drop-shadow-lg break-keep">{announcement}</p>
                </div>

                {/* Footer */}
                <div className="absolute left-0 top-[981px] w-[1920px] h-[99px]">
                    <img src="/assets/밑에%20바.svg" className="w-full h-full object-cover" alt="" />
                </div>

            </div>
        </div>
    );
}
