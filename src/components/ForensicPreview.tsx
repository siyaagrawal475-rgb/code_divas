import { FileCode, FileText, Film, Image as ImageIcon, Binary } from 'lucide-react';

interface ForensicPreviewProps {
  type: string;
  previewType?: 'image' | 'video' | 'document' | 'audio' | 'code';
  previewDataUrl?: string;
  evidenceNumber: string;
  sha256: string;
  className?: string;
}

export const ForensicPreview: React.FC<ForensicPreviewProps> = ({
  previewType = 'image',
  previewDataUrl,
  evidenceNumber,
  sha256,
  className = '',
}) => {
  // Generate deterministic coordinates for mock forensic telemetry
  const num = parseInt(evidenceNumber.replace(/\D/g, '') || '1', 10);
  const lat = (40.7128 + num * 0.0432).toFixed(4);
  const lon = (-74.006 + num * 0.0511).toFixed(4);

  return (
    <div
      className={`relative w-full h-36 bg-[#070908] border-b border-[#1F2B25] overflow-hidden flex flex-col justify-between p-3 select-none ${className}`}
    >
      {/* 4 Corner Crop Marks (+ ticks) */}
      <div className="absolute top-1.5 left-1.5 text-[#45E08A]/70 text-[9px] font-mono leading-none pointer-events-none">
        +
      </div>
      <div className="absolute top-1.5 right-1.5 text-[#45E08A]/70 text-[9px] font-mono leading-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-1.5 left-1.5 text-[#45E08A]/70 text-[9px] font-mono leading-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-1.5 right-1.5 text-[#45E08A]/70 text-[9px] font-mono leading-none pointer-events-none">
        +
      </div>

      {/* Background forensic grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`forensicGrid-${evidenceNumber}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#1F2B25" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#forensicGrid-${evidenceNumber})`} />
        {/* Subtle crosshairs */}
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#45E08A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#45E08A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
      </svg>

      {/* If previewDataUrl exists, render raw capture behind overlay */}
      {previewDataUrl && (
        <img
          src={previewDataUrl}
          alt={`Evidence #${evidenceNumber}`}
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
      )}

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-[#45E08A] bg-[#0D1210] px-1.5 py-0.5 rounded-[2px] border border-[#1F2B25] flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#45E08A] gem-glow-sm" />
          <span>EV-{evidenceNumber}</span>
        </span>
        <span className="font-mono text-[8px] text-[#C9A24B] tracking-wider bg-[#0D1210] px-1 py-0.5 rounded-[2px] border border-[#1F2B25]">
          LOC: {lat}°N {lon}°W
        </span>
      </div>

      {/* Center Icon Representation */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="w-8 h-8 rounded-[2px] bg-[#0D1210]/90 border border-[#1F2B25] flex items-center justify-center text-[#7F8D85] shadow-sm">
          {previewType === 'image' && <ImageIcon size={15} strokeWidth={1.5} className="text-[#45E08A]" />}
          {previewType === 'video' && <Film size={15} strokeWidth={1.5} className="text-[#45E08A]" />}
          {previewType === 'document' && <FileText size={15} strokeWidth={1.5} className="text-[#45E08A]" />}
          {previewType === 'code' && <FileCode size={15} strokeWidth={1.5} className="text-[#45E08A]" />}
          {previewType === 'audio' && <Binary size={15} strokeWidth={1.5} className="text-[#45E08A]" />}
        </div>
      </div>

      {/* Bottom Forensic Watermark Line */}
      <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono text-[#7F8D85] pt-1 border-t border-[#1F2B25]/50">
        <span className="truncate max-w-[130px] opacity-80">
          HASH: {sha256.substring(0, 10)}...
        </span>
        <span className="text-[#45E08A] opacity-90 font-semibold">PRESERVED</span>
      </div>
    </div>
  );
};
