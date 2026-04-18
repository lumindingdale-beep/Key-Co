import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, ExternalLink, Navigation } from 'lucide-react';
import { JobFair } from '@/types';

const MOCK_FAIRS: JobFair[] = [
  {
    id: '1',
    title: 'Philippine Tech Talent Fair 2026',
    description: 'The largest gathering of tech employers in Metro Manila.',
    date: 'May 15, 2026',
    location: { lat: 14.5547, lng: 121.0244, address: 'Ayala Malls Makati' }
  },
  {
    id: '2',
    title: 'BGC Career Expo',
    description: 'Focusing on Global Shared Services and Fintech roles.',
    date: 'June 02, 2026',
    location: { lat: 14.5492, lng: 121.0450, address: 'BGC Taguig' }
  }
];

export default function JobMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeFair, setActiveFair] = useState<JobFair | null>(null);

  useEffect(() => {
    setOptions({
      key: '', // UI will prompt or user can set in .env
      v: 'weekly',
    });

    const initMap = async () => {
      try {
        const [{ Map }, { Marker }] = await Promise.all([
          importLibrary('maps') as Promise<google.maps.MapsLibrary>,
          importLibrary('marker') as Promise<google.maps.MarkerLibrary>
        ]);

        if (mapRef.current) {
          const newMap = new Map(mapRef.current, {
            center: { lat: 14.5547, lng: 121.0244 },
            zoom: 12,
            styles: [
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#0A2342" }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#2CA58D" }, { "opacity": 0.2 }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
          });

          MOCK_FAIRS.forEach(fair => {
            const marker = new Marker({
              position: fair.location,
              map: newMap,
              title: fair.title,
              icon: {
                path: 0, // google.maps.SymbolPath.CIRCLE is 0
                scale: 10,
                fillColor: '#FFD700',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#0A2342',
              } as any
            });

            marker.addListener('click', () => {
              setActiveFair(fair);
              newMap.panTo(fair.location);
            });
          });

          setMap(newMap);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Floating Header */}
      <div className="absolute top-6 left-6 right-6 z-10 max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 shadow-xl rounded-[24px] py-4 px-6 flex items-center justify-between">
           <div>
             <h2 className="text-xl font-display font-black text-gray-800 tracking-tighter leading-none mb-1 uppercase">Ops Radar</h2>
             <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Target sites in Metro Manila</p>
           </div>
           <div className="bg-red p-2 rounded-xl text-white shadow-lg shadow-red/20">
             <MapPin size={20} />
           </div>
        </div>
      </div>

      {/* Fair Detail Popup */}
      <AnimatePresence>
        {activeFair && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-6 right-6 z-10 max-w-lg mx-auto"
          >
             <div className="bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 rounded-[28px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-12 -mt-12" />
                
                <button 
                  onClick={() => setActiveFair(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-800 text-white p-3.5 rounded-[16px] shadow-lg">
                       <Calendar size={24} />
                    </div>
                    <div>
                       <h3 className="font-display font-black text-gray-800 leading-tight uppercase tracking-tight text-lg mb-1">{activeFair.title}</h3>
                       <p className="text-[10px] text-red font-black uppercase tracking-widest">{activeFair.date}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed border-l-4 border-gold pl-4 py-1">
                    {activeFair.description}
                  </p>

                  <div className="flex items-center space-x-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 p-3 rounded-[12px] border border-gray-100">
                    <MapPin size={12} className="text-gold" />
                    <span>{activeFair.location.address}</span>
                  </div>

                  <Button variant="primary" className="w-full h-14 shadow-lg shadow-red/20 text-[10px] tracking-widest">
                    <Navigation size={18} className="mr-2" />
                    ACTIVATE NAVIGATION
                  </Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder Instruction */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 z-10">
         <p className="text-[9px] text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full uppercase font-black tracking-widest border border-gray-100 shadow-sm">
           System Alpha • Maps.enc
         </p>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
