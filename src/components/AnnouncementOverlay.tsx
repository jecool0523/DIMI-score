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
                    <img alt="Warning Icon" className="absolute block inset-0 max-w-none size-full" src="/assets/notice-icon.svg" />
                </div>

                <div className="-translate-x-1/2 absolute font-sans leading-[1.5] left-1/2 text-center text-black top-[618.03px] tracking-[1.64px] w-[1500px]">
                    <p className="text-[82px] mb-0 whitespace-pre-line font-bold drop-shadow-lg break-keep">{announcement}</p>
                </div>

                {/* Footer */}
                <div className="absolute bg-[#111] flex flex-col h-[99px] items-center left-0 overflow-clip top-[981px] w-[1920px]">
                    <div className="h-0 relative shrink-0 w-[1920px]">
                        <div className="absolute inset-[-1.25px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/notice-footer-line.svg" />
                        </div>
                    </div>
                    <div className="flex flex-[1_0_0] items-center justify-between min-h-px min-w-px px-[30px] relative w-full">
                        <div className="h-[24.712px] relative shrink-0 w-[170.43px]">
                            <img alt="Logo 1" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/assets/notice-footer-1.png" />
                        </div>
                        <div className="h-[34.177px] relative shrink-0 w-[60.413px]">
                            <img alt="Center Footer Icon" className="absolute block inset-0 max-w-none size-full" src="/assets/notice-footer-2.svg" />
                        </div>
                        <div className="flex gap-[6.843px] items-center justify-center relative shrink-0">
                            <div className="h-[32.424px] relative shrink-0 w-[23.53px]">
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <img alt="Logo 2" className="absolute h-[606%] left-[-670.26%] max-w-none top-[-252.7%] w-[2361.16%]" src="/assets/notice-footer-3.png" />
                                </div>
                            </div>
                            <div className="h-[32.424px] relative shrink-0 w-[215.326px]">
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <img alt="Logo 3" className="absolute h-[606%] left-[-86.73%] max-w-none top-[-252.7%] w-[258.02%]" src="/assets/notice-footer-4.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
