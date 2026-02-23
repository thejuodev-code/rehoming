export default function ImagePlaceholder({
    width,
    height,
    text = '이미지가 들어갈 자리입니다',
    className = '',
}: {
    width?: string;
    height?: string;
    text?: string;
    className?: string;
}) {
    return (
        <div
            className={`relative flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden group transition-all duration-300 hover:bg-gray-100 hover:border-gray-300 ${className}`}
            style={{
                width: width || '100%',
                height: height || '100%',
                minHeight: height ? 'auto' : '200px',
            }}
        >
            <div className="flex flex-col items-center justify-center space-y-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                    className="w-10 h-10 text-gray-400 group-hover:text-brand-trust transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">{text}</p>
                    {width && height && (
                        <p className="text-xs text-gray-400 font-mono tracking-wider">
                            권장 사이즈: {width} x {height}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
