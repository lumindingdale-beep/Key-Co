import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogIn, UserPlus, Github, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="logo-icon"></div>
            <h1 className="text-3xl font-display font-extrabold text-gray-800 tracking-tighter">
              KEYFOLIO
            </h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            Geometric Pulse Dashboard
          </p>
        </div>

        <Card className="space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-[16px]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] rounded-[12px] transition-all ${
                isLogin ? 'bg-white text-gray-800 shadow-md' : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              Access
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] rounded-[12px] transition-all ${
                !isLogin ? 'bg-white text-gray-800 shadow-md' : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Channel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-200 rounded-[12px] py-3 pl-12 pr-4 text-gray-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Email ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-[12px] py-3 px-4 text-gray-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red text-[10px] font-black text-center px-2 uppercase tracking-tight">{error}</p>}

            <Button type="submit" variant="primary" className="w-full py-4 text-sm font-extrabold shadow-lg shadow-red/20" isLoading={loading}>
              {isLogin ? 'Login Dashboard' : 'Create Digital Pulse'}
            </Button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute w-full h-[1px] bg-gray-200"></div>
            <span className="relative bg-white px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Social Gateway
            </span>
          </div>

          <Button 
            onClick={handleGoogleSignIn}
            variant="outline" 
            className="w-full border-gray-200 text-gray-800 hover:bg-gray-100 space-x-3"
          >
            <span className="font-extrabold text-[10px]">AUTH WITH GOOGLE</span>
          </Button>
        </Card>

        <p className="mt-8 text-center text-white/40 text-xs">
          By continuing, you agree to the Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
