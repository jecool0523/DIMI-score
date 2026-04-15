import React from 'react';

const Digit = ({ value, index }: { value: string, index: number }) => {
    if (isNaN(Number(value))) {
        return <span className="inline-flex h-[1.3em] leading-[1.3em] items-center justify-center pb-[0.05em]">{value}</span>;
    }

    const target = Number(value);
    return (
        <div className="relative inline-flex flex-col h-[1.3em] overflow-hidden leading-[1.3em]">
            <div
                className="flex flex-col transition-transform duration-[1000ms]"
                style={{
                    transform: `translateY(-${target * 10}%)`,
                    transitionTimingFunction: 'cubic-bezier(0.2, 1, 0.2, 1)',
                    transitionDelay: `${index * 50}ms`
                }}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="h-[1.3em] leading-[1.3em] flex-none inline-flex items-center justify-center pb-[0.05em]">{n}</span>
                ))}
            </div>
        </div>
    );
};

const RouletteNumber = ({ value }: { value: string | number }) => {
    const str = value.toString();
    return (
        <div className="flex">
            {str.split('').map((char, i) => (
                <Digit key={`${str.length - i}-${i}`} value={char} index={str.length - i} />
            ))}
        </div>
    );
};

export default RouletteNumber;
