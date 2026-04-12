import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const nextEvent = events.find((e) => e.status === 'UPCOMING') || events.find((e) => e.status === 'IN_PROGRESS');

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  if (!nextEvent) {
    return (
      <div className="fixed inset-0 z-40 bg-[#0a0a0a] flex items-center justify-center animate-in fade-in duration-500">
        <p className="font-display text-5xl text-white">더 이상 진행할 종목이 없습니다 🎉</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#0a0a0a] overflow-hidden flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <TotalScoreBoard />

        {/* Content Box (Left) */}
        <div className="absolute top-[120px] left-0 w-[916px] h-[861px]">
          <p className="absolute font-['Pretendard'] font-bold leading-normal left-[94px] text-[93px] text-white top-[100px] whitespace-nowrap m-0 tracking-tight">
            다음 종목
          </p>
          <p className="absolute font-['Pretendard'] font-extrabold leading-tight left-[71px] text-[205px] text-white top-[242px] whitespace-nowrap m-0 tracking-tighter w-[800px] break-keep">
            {nextEvent.name}
          </p>
        </div>

        {/* Vertical Divider 1 */}
        <div className="absolute left-[916px] top-[120px] w-[1px] h-[535px] bg-transparent">
          <img alt="" className="absolute inset-0 size-[2000%] max-w-none object-cover" src="/assets/vector16.svg" />
        </div>

        {/* Content Box (Right Top) */}
        <div className="absolute top-[120px] left-[917px] w-[1003px] h-[535px]">
          <div className="absolute font-display leading-[0.85] left-[104px] text-[#ff40c2] text-[130px] top-[218px] uppercase select-none m-0 flex flex-col gap-[10px] tracking-widest">
            <span>DIMIGO</span>
            <span>SPORTS</span>
            <span>DAY</span>
          </div>

          <div className="absolute font-display leading-[0.85] right-[88px] text-[#ff40c2] text-[171px] text-right top-[164px] m-0 flex flex-col gap-[10px] tracking-widest tabular-nums">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="absolute top-[655px] left-0 w-[1920px] h-[1px]">
          <img alt="" className="absolute inset-0 size-full object-cover" src="/assets/vector13.svg" />
        </div>

        {/* Vertical Divider 2 */}
        <div className="absolute left-[1046px] top-[655px] w-[1px] h-[326px]">
          <img alt="" className="absolute inset-0 size-[2000%] max-w-none object-cover" src="/assets/vector15.svg" />
        </div>

        {/* Content Box (Left Bottom) */}
        <div className="absolute top-[656px] left-0 w-[1046px] h-[325px] overflow-hidden">
          {/* Pink Arrows */}
          <div className="absolute top-[90px] left-[150px] right-0 flex gap-20">
            <div className="w-[124px] h-[124px] animate-pulse">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
            <div className="w-[124px] h-[124px] animate-pulse delay-100">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
            <div className="w-[124px] h-[124px] animate-pulse delay-200">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
          </div>

          {/* Noise Pixel Dots */}
          <div className="absolute bg-[#ff40c2] size-[29px] bottom-[30px] left-[29px]" />
          <div className="absolute bg-[#ff40c2] size-[29px] bottom-[120px] left-0" />
          <div className="absolute bg-[#ff40c2] size-[29px] top-[29px] left-[29px]" />
          <div className="absolute bg-[#ff40c2] size-[29px] top-[60px] left-0" />
          <div className="absolute bg-[#ff40c2] size-[29px] bottom-[200px] left-[29px]" />
        </div>

        {/* Content Box (Right Bottom) */}
        <div className="absolute top-[656px] left-[1047px] w-[873px] h-[325px] overflow-hidden">
          <div className="absolute font-['Pretendard'] font-bold leading-tight left-[154px] text-[80px] text-white top-[82px] m-0 tracking-tight flex flex-col">
            <span>선수분들은 준비해</span>
            <span>주시길 바랍니다.</span>
          </div>

          {/* Right Noise Pixel Dots */}
          <div className="absolute bg-[#ff40c2] size-[31px] top-[63px] right-[31px]" />
          <div className="absolute bg-[#ff40c2] size-[31px] top-[188px] right-[31px]" />
          <div className="absolute bg-[#ff40c2] size-[31px] top-[125px] right-0" />
          <div className="absolute bg-[#ff40c2] size-[31px] top-[282px] right-0" />
          <div className="absolute bg-[#ff40c2] size-[31px] top-[219px] right-[31px]" />
        </div>

        {/* Footer from Figma */}
        <div className="absolute bg-[#111] flex flex-col h-[99px] items-center left-0 overflow-clip top-[981px] w-[1920px]">
          <div className="h-0 relative shrink-0 w-[1920px]">
            <div className="absolute inset-[-1.25px_0]">
              <img alt="" className="block max-w-none size-full" src="/assets/notice-footer-line.svg" />
            </div>
          </div>
          <div className="flex flex-[1_0_0] items-center justify-between px-[30px] w-full">
            <div className="h-[24.712px] relative shrink-0 w-[170.43px]">
              <img alt="Logo 1" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/assets/notice-footer-1.png" />
            </div>
            <div className="h-[34.177px] relative shrink-0 w-[60.413px]">
              <img alt="Center" className="absolute block inset-0 max-w-none size-full" src="/assets/notice-footer-2.svg" />
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
};

export default PreparationView;
