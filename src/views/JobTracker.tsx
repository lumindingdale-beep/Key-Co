import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Edit3, Briefcase, Building2, Calendar, ChevronRight, X } from 'lucide-react';
import { JobApplication, JobStatus } from '@/types';
import { JOB_STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobStatus>('Applied');

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('appliedDate', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication)));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'applications'), {
        userId: auth.currentUser.uid,
        companyName: company,
        position: position,
        status: status,
        appliedDate: Date.now(),
      });
      setIsAdding(false);
      setCompany('');
      setPosition('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this application?')) {
      await deleteDoc(doc(db, 'applications', id));
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20 overflow-x-hidden max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-black text-gray-800 tracking-tighter uppercase">
            Ops Tracker
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Maintain hunt discipline</p>
        </div>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full shadow-lg h-12 w-12"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={24} />
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-white border-2 border-gold/20 p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">Register Opportunity</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-red">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Name</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[12px] py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="e.g. GCash (Mynt)"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Functional Designation</label>
                  <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[12px] py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="e.g. Lead Designer"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Phase</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JobStatus)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[12px] py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {['Applied', 'Interview', 'Assessment', 'Offer', 'Rejected', 'Hired'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Button variant="primary" className="w-full h-14 shadow-lg shadow-red/20" isLoading={loading}>
                  Save Entry
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-white rounded-[20px] p-5 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gold">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-none mb-1.5 pt-1">
                        {app.companyName}
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {app.position}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full ${JOB_STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    <Calendar size={12} className="mr-1 text-gold" />
                    {format(app.appliedDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-red hover:bg-red/5 rounded-full"
                      onClick={() => handleDelete(app.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-gold hover:bg-gold/5 rounded-full"
                    >
                      <Edit3 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-gray-200">
            <div className="mb-4 text-gray-200">
              <Briefcase size={40} className="mx-auto" />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-none">Repo Is Void</p>
            <p className="text-[10px] text-gray-300 mt-2 font-bold uppercase tracking-tight">Tap circle to init tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}
