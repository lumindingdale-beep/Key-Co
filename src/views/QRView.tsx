import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function QRView() {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;
  
  const publicUrl = `${window.location.origin}/p/${user?.uid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Keyfolio-QR-${user?.uid}.png`;
      link.href = url;
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="p-6 space-y-8 pb-20 overflow-x-hidden max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-black text-gray-800 tracking-tighter uppercase">
          Key Generator
        </h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          Deploy your digital keychain pulse
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="qr-container w-full max-w-[320px]">
          <div ref={qrRef} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-center">
            {user ? (
              <QRCodeSVG
                value={publicUrl}
                size={220}
                level="H"
                includeMargin={false}
              />
            ) : null}
          </div>
          
          <div className="bg-gold px-6 py-2 rounded-full shadow-lg border-2 border-white">
             <p className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
               YOUR KEYCHAIN QR
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="bg-white rounded-[20px] p-4 flex items-center justify-between border border-gray-200">
          <div className="truncate flex-1 pr-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 ml-1">Identity Gateway</p>
            <p className="text-[10px] font-bold text-gray-800 truncate">
              {publicUrl}
            </p>
          </div>
          <Button 
            variant={copied ? 'secondary' : 'ghost'} 
            size="icon" 
            onClick={handleCopy}
            className="flex-shrink-0 h-10 w-10"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" className="w-full flex space-x-2 h-14" onClick={downloadQR}>
            <Download size={16} />
            <span>Download Node</span>
          </Button>
          <Button variant="outline" className="w-full h-14 border-gold text-gold flex space-x-2">
            <Share2 size={16} />
            <span>Cast Pulse</span>
          </Button>
        </div>
      </div>

      <Card className="bg-gray-50 border-gray-200 p-6 flex items-start space-x-4">
        <div className="bg-red text-white p-3 rounded-xl shadow-lg">
          <QrCode size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black text-gray-800 mb-1 uppercase tracking-widest leading-none">Persistent Linkage</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
            The pulse is persistent. Updating your Resume or CV vault will automatically update this entry point.
          </p>
        </div>
      </Card>
    </div>
  );
}

import { QrCode } from 'lucide-react';
