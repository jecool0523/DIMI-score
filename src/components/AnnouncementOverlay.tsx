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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden animate-in fade-in duration-500">
            <div
                className="relative w-[1920px] h-[1080px] shrink-0"
                style={{ transform: `scale(${scale})` }}
            >
                <img src="/assets/background/공지화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />
                {/* Left Border Pattern */}
                <div className="absolute bg-[#ff40c2] left-[0.74px] size-[30.652px] top-[337.17px]" />
                <div className="absolute bg-[#ff40c2] left-[92.69px] size-[30.652px] top-[490.43px]" />
                <div className="absolute bg-[#ff40c2] left-[0.74px] size-[30.652px] top-[704.99px]" />
                <div className="absolute bg-[#ff40c2] left-[92.69px] size-[30.652px] top-[858.1px]" />
                <div className="absolute left-[0.74px] size-[30.652px] top-[153.26px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[521.08px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[889.04px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[214.42px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute bg-[#ff40c2] left-[31.39px] size-[30.652px] top-[306.52px]" />
                <div className="absolute bg-[#ff40c2] left-[31.39px] size-[30.652px] top-[674.34px]" />
                <div className="absolute bg-[#ff40c2] left-[62.04px] size-[30.652px] top-[337.02px]" />
                <div className="absolute bg-[#ff40c2] left-[62.04px] size-[30.652px] top-[704.84px]" />
                <div className="absolute left-[31.39px] size-[30.652px] top-[122.61px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[490.43px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[858.39px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[91.96px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[459.78px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.44px] size-[30.901px] top-[988.99px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.901px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[613.03px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[827.74px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[153.11px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[61.3px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[429.12px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[797.09px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[61.3px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[429.12px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[950.35px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[62.04px] size-[30.652px] top-[950.35px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[919.7px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[582.38px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[797.09px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[122.46px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[275.87px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[643.69px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[30.65px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[398.47px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[766.44px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[245.21px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[398.47px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[613.03px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[766.15px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[-0.26px] size-[30.901px] top-[988.99px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.901px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[306.37px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-0">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[367.82px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[31.39px] size-[30.652px] top-[735.79px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-0">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[367.82px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[889.04px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[521.08px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[735.79px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[61.16px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[62.04px] size-[30.652px] top-[30.65px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[214.56px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[367.82px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[582.38px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[735.49px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[0.74px] size-[30.652px] top-[950.35px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[92.69px] size-[30.652px] top-[275.72px]">
                    <div className="-rotate-90 flex-none"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>

                {/* Right Border Pattern */}
                <div className="absolute left-[1889.11px] size-[30.652px] top-[705.13px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[551.88px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[337.31px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[184.2px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[889.05px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[827.89px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1827.81px] size-[30.652px] top-[858.39px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[521.22px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-0">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[153.26px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[827.89px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[735.79px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[367.97px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-0">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1827.81px] size-[30.652px] top-[705.28px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1827.81px] size-[30.652px] top-[337.46px]">
                    <div className="flex-none rotate-180"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[919.7px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[551.88px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[183.91px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[950.35px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[582.53px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[61.3px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[429.27px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[214.56px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[889.19px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.9px] top-[988.95px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.9px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[613.18px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[245.21px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.36px] size-[30.9px] top-[988.95px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.9px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[613.18px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[91.95px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[459.92px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[245.21px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[919.84px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[766.44px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[398.62px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[30.65px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[643.83px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[275.87px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[797.09px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[643.83px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[429.27px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[276.16px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[61.3px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[735.93px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[674.48px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1858.46px] size-[30.652px] top-[306.52px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[674.48px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[153.26px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[521.22px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[306.52px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1796.66px] size-[30.9px] top-[989.1px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.9px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[827.74px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[674.48px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[459.92px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[306.81px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1889.11px] size-[30.652px] top-[91.95px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>
                <div className="absolute left-[1797.16px] size-[30.652px] top-[766.58px]">
                    <div className="flex-none rotate-90"><div className="bg-[#ff40c2] size-[30.652px]" /></div>
                </div>

                {/* Center Elements */}
                <div className="absolute left-[790.71px] w-[338.585px] h-[338.585px] top-[169.09px]">
                    <img alt="Warning Icon" className="absolute block inset-0 max-w-none size-full" src="/assets/notice-icon.svg" />
                </div>

                <div className="-translate-x-1/2 absolute font-['Pretendard'] leading-[1.5] left-1/2 text-center text-white top-[618.03px] tracking-[1.64px] w-[1500px]">
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
