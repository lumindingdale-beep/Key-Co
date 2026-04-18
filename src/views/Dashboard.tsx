import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Eye, Bell, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ScanHistory } from '@/types';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [totalScans, setTotalScans] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'scans'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('scannedAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scanData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanHistory));
      setScans(scanData);
      setTotalScans(snapshot.size); // This only reflects the limited query size if using limit, but better to use a dedicated counter if possible. For now, we use the snapshot.
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="logo-icon"></div>
          <div>
            <h2 className="text-xl font-display font-black text-gray-800 tracking-tighter leading-none mb-1">
              KEYFOLIO
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative text-gray-800 bg-gray-100 rounded-full h-10 w-10">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red rounded-full" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="card space-y-6">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <h3 className="font-display font-black text-gray-800 tracking-tight text-lg uppercase tracking-widest">Pulse Recap</h3>
          <Button variant="outline" size="sm" className="text-[9px] h-8 px-3">Sync Now</Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-item">
            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[9px] mb-1">Total Scans</p>
            <div className="flex items-end space-x-2">
              <h4 className="text-3xl font-display font-black text-gray-800">{totalScans}</h4>
              <span className="text-red font-black text-[10px] mb-1.5 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                12%
              </span>
            </div>
          </div>
          <div className="stat-item border-l-red">
            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[9px] mb-1">Engagements</p>
            <div className="flex items-end space-x-2">
              <h4 className="text-3xl font-display font-black text-gray-800">42</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-display font-black text-gray-800 uppercase tracking-widest text-xs">Access Logs</h3>
          <button className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline">
            History Repo
          </button>
        </div>

        <div className="space-y-3">
          {scans.length > 0 ? (
            scans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 p-4 bg-white rounded-[20px] border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-red">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-800 uppercase tracking-tight">QR Pulse Detected</p>
                    <div className="flex items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      <MapPin size={10} className="mr-1 text-gold" />
                      Digital Node • {format(scan.scannedAt, 'hh:mm a')}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2 py-1 rounded-full">
                      {format(scan.scannedAt, 'MMM dd')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-[24px] border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Eye size={24} />
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No Node Detected</p>
              <p className="text-[10px] text-gray-300 mt-1 font-bold">Deploy your QR Keychain pulse.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <Card variant="outline" className="border-dashed border-primary/20 bg-primary/5 p-4 flex items-center space-x-4">
        <div className="p-3 bg-gold text-primary rounded-xl">
          <Bell size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Pro Tip</p>
          <p className="text-xs text-slate-500">Update your CV every 3 months to stay relevant in the Philippine tech market.</p>
        </div>
      </Card>
    </div>
  );
}
