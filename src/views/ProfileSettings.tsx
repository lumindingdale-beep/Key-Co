import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserProfile } from '@/types';
import { Camera, FileText, Globe, Linkedin, Phone, Save, Upload, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<'resume' | 'cv' | 'photo' | null>(null);
  const [progress, setProgress] = useState(0);

  // Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setProfile(data);
        setFullName(data.fullName || '');
        setBio(data.bio || '');
        setPhone(data.contactNumber || '');
      }
    });
    return unsubscribe;
  }, []);

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      if (!profile) {
        await setDoc(userDoc, {
          uid: auth.currentUser.uid,
          fullName,
          bio,
          contactNumber: phone,
          updatedAt: Date.now(),
        });
      } else {
        await updateDoc(userDoc, {
          fullName,
          bio,
          contactNumber: phone,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = (file: File, type: 'resume' | 'cv' | 'photo') => {
    if (!auth.currentUser) return;
    setUploading(type);
    setProgress(0);

    const storageRef = ref(storage, `users/${auth.currentUser.uid}/${type}_${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error(error);
        setUploading(null);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const userDoc = doc(db, 'users', auth.currentUser.uid!);
        
        const updateData: any = { updatedAt: Date.now() };
        if (type === 'resume') updateData.resumeUrl = url;
        if (type === 'cv') updateData.cvUrl = url;
        if (type === 'photo') updateData.profilePhoto = url;

        await updateDoc(userDoc, updateData);
        setUploading(null);
        setProgress(0);
      }
    );
  };

  return (
    <div className="p-6 space-y-8 pb-20 overflow-x-hidden max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-black text-gray-800 tracking-tighter uppercase">
            Asset Vault
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">Configure your digital twin</p>
        </div>
        <Button variant="ghost" size="icon" className="text-red h-10 w-10 bg-gray-100 rounded-full" onClick={() => auth.signOut()}>
          <LogOut size={20} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full border-4 border-gold p-1 shadow-xl overflow-hidden bg-white flex items-center justify-center">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} className="w-full h-full rounded-full object-cover" alt="Profile" />
              ) : (
                <Camera className="text-gray-200" size={32} />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-red text-white p-2.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              <Upload size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'photo')} />
            </label>
            {uploading === 'photo' && (
              <div className="absolute inset-0 bg-gray-800/60 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-black text-white">{Math.round(progress)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Essential Info */}
        <Card className="space-y-4 shadow-xl border-gray-200">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-[12px] py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Abstract</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-[12px] py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px]"
              placeholder="Tell companies who you are..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Voice Communication</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-[12px] py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="+63 9XX XXX XXXX"
            />
          </div>
          <Button variant="primary" className="w-full h-14 shadow-lg shadow-red/20" onClick={handleSaveProfile} isLoading={loading}>
            <Save size={18} className="mr-2" />
            <span>Update Vault</span>
          </Button>
        </Card>

        {/* File Assets */}
        <div className="space-y-4 px-2">
          <h3 className="font-display font-black text-gray-800 uppercase tracking-widest text-xs">Document Nodes</h3>
          
          <div className="space-y-3">
             <FileUploadCard 
               title="PRIMARY RESUME" 
               url={profile?.resumeUrl} 
               isUploading={uploading === 'resume'} 
               progress={progress}
               onUpload={(file) => uploadFile(file, 'resume')}
             />
             <FileUploadCard 
               title="SYSTEM CV" 
               url={profile?.cvUrl} 
               isUploading={uploading === 'cv'} 
               progress={progress}
               onUpload={(file) => uploadFile(file, 'cv')}
             />
          </div>
        </div>
      </div>
    </div>
  );
}

function FileUploadCard({ title, url, isUploading, progress, onUpload }: any) {
  return (
    <div className={`p-4 flex items-center justify-between rounded-[20px] border-2 border-dashed transition-all ${url ? 'border-gold/30 bg-gold/5' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${url ? 'bg-gold text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
          <FileText size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight leading-none mb-1">{title}</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            {url ? 'Deployed' : 'Node Null'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        {isUploading ? (
          <div className="w-8 h-8 rounded-full border-2 border-red border-t-transparent animate-spin" />
        ) : (
          <label className="cursor-pointer">
             <div className={`px-4 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest shadow-sm transition-all ${url ? 'bg-white text-gold border border-gold hover:bg-gold hover:text-white' : 'bg-red text-white hover:opacity-90'}`}>
               {url ? 'Update' : 'Upload'}
             </div>
             <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
}
