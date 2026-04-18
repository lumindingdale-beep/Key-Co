import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Linkedin, Phone, Mail, Globe, MapPin, AlertCircle } from 'lucide-react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserProfile } from '@/types';
import { motion } from 'motion/react';

export default function PublicProfile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
          
          // Log the scan record
          await addDoc(collection(db, 'scans'), {
            userId: uid,
            scannedAt: Date.now(),
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Reading Digital Keychain...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-flag/20 p-6 rounded-full mb-6">
          <AlertCircle size={48} className="text-red-flag" />
        </div>
        <h1 className="text-2xl font-display font-black text-white mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
          The Keyfolio profile you're trying to scan doesn't exist or is currently restricted.
        </p>
        <Button onClick={() => window.location.href = '/'} variant="outline" className="text-white border-white/20">
          Go to Keyfolio Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 overflow-x-hidden animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative pt-12 pb-24 px-6 flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-80 bg-white border-b-2 border-gold shadow-sm" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-gold p-1 shadow-2xl overflow-hidden bg-white flex items-center justify-center">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto} 
                  className="w-full h-full rounded-full object-cover"
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-gray-200 text-4xl font-black">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-display font-black text-gray-800 mb-2 tracking-tighter uppercase">
            {profile.fullName}
          </h1>
          <p className="text-red font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
            Philippines • Digital Resume Node
          </p>
          
          <div className="bg-white rounded-[24px] p-5 max-w-sm mb-6 border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <p className="text-xs font-bold leading-relaxed text-gray-800 uppercase tracking-tight">
              {profile.bio}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-16 px-6 z-20">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              disabled={!profile.resumeUrl}
              variant="primary" 
              size="lg" 
              className="w-full shadow-lg shadow-red/20 h-16 rounded-[12px] text-[10px] tracking-[0.2em]"
              onClick={() => profile.resumeUrl && window.open(profile.resumeUrl)}
            >
              <Download className="mr-2" size={18} />
              Resume
            </Button>
            <Button 
              disabled={!profile.cvUrl}
              variant="outline" 
              size="lg" 
              className="w-full border-gold text-gold hover:bg-gold/5 h-16 rounded-[12px] text-[10px] tracking-[0.2em]"
              onClick={() => profile.cvUrl && window.open(profile.cvUrl)}
            >
              <Download className="mr-2" size={18} />
              Full CV
            </Button>
          </div>

          {/* Contact Section */}
          <Card className="space-y-4 border-gray-200 shadow-xl rounded-[20px]">
            <h3 className="font-display font-black text-gray-800 text-[10px] uppercase tracking-[0.25em] mb-4 border-b border-gray-100 pb-3">
              Comm Hub
            </h3>
            
            {profile.contactNumber && (
              <a href={`tel:${profile.contactNumber}`} className="flex items-center space-x-4 text-gray-800 group bg-gray-50 p-3 rounded-[16px] border border-transparent hover:border-gold transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-red group-hover:bg-red group-hover:text-white transition-all shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-gold uppercase font-black tracking-tighter">Voice Line</p>
                  <p className="font-bold text-sm tracking-tight">{profile.contactNumber}</p>
                </div>
              </a>
            )}

            {profile.linkedInUrl && (
              <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-gray-800 group bg-gray-50 p-3 rounded-[16px] border border-transparent hover:border-gold transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-red group-hover:bg-red group-hover:text-white transition-all shadow-sm">
                  <Linkedin size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-gold uppercase font-black tracking-tighter">Pro Network</p>
                  <p className="font-bold text-sm tracking-tight text-ellipsis overflow-hidden max-w-[180px]">Connect on LinkedIn</p>
                </div>
              </a>
            )}

            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-gray-800 group bg-gray-50 p-3 rounded-[16px] border border-transparent hover:border-gold transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-red group-hover:bg-red group-hover:text-white transition-all shadow-sm">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-gold uppercase font-black tracking-tighter">Creative Node</p>
                  <p className="font-bold text-sm tracking-tight truncate max-w-[180px]">{profile.portfolioUrl.replace('https://', '')}</p>
                </div>
              </a>
            )}
          </Card>

          <footer className="py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="logo-icon w-4 h-4"></div>
              <p className="text-gray-400 text-[9px] tracking-widest uppercase font-black">
                Pulse by <span className="text-red">Keyfolio</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
