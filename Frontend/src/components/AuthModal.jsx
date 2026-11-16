import { useState } from 'react';
import { X, UserRound, Mail, Lock, LoaderCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isPhone = !identifier.includes('@');

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      if (!identifier.trim() || !password) throw new Error('Enter your email/phone and password.');
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Enter your name.');
        const credentials = isPhone
          ? { phone: identifier.trim(), password, options: { data: { full_name: name.trim() } } }
          : { email: identifier.trim(), password, options: { data: { full_name: name.trim() } } };
        const { data, error: authError } = await supabase.auth.signUp(credentials);
        if (authError) throw authError;
        if (!data.session) {
          setMessage(isPhone
            ? 'Account created. Complete the SMS verification in Supabase before logging in.'
            : 'Account created. Check your email for the verification link, then log in.');
        } else onClose();
      } else {
        const credentials = isPhone
          ? { phone: identifier.trim(), password }
          : { email: identifier.trim(), password };
        const { error: authError } = await supabase.auth.signInWithPassword(credentials);
        if (authError) throw authError;
        onClose();
      }
    } catch (err) { setError(err.message || 'Authentication failed.'); }
    finally { setBusy(false); }
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1713] p-6 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">QuantGen account</p><h2 className="mt-2 text-2xl font-extrabold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-white/40">Save your portfolio and access your tracker.</p></div><button onClick={onClose} className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white" aria-label="Close"><X size={19}/></button></div>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {mode === 'signup' && <label className="block text-xs text-white/55">Full name<div className="mt-2 flex items-center rounded-xl border border-white/10 bg-[#07100d] px-3"><UserRound size={16} className="text-white/30"/><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" placeholder="Your name" autoComplete="name"/></div></label>}
        <label className="block text-xs text-white/55">Email or phone number<div className="mt-2 flex items-center rounded-xl border border-white/10 bg-[#07100d] px-3"><Mail size={16} className="text-white/30"/><input value={identifier} onChange={e=>setIdentifier(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" placeholder="name@email.com or +91..." autoComplete="username"/></div></label>
        <label className="block text-xs text-white/55">Password<div className="mt-2 flex items-center rounded-xl border border-white/10 bg-[#07100d] px-3"><Lock size={16} className="text-white/30"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none" placeholder="Your password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></div></label>
        {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">{error}</p>}
        {message && <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-3 text-xs text-emerald-200">{message}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 py-3.5 text-sm font-bold text-[#07100d] hover:bg-emerald-200 disabled:opacity-50">{busy && <LoaderCircle size={16} className="animate-spin"/>}{mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
      <p className="mt-5 text-center text-xs text-white/40">{mode === 'login' ? "Don't have an account?" : 'Already registered?'} <button onClick={()=>{setMode(mode === 'login' ? 'signup' : 'login');setError('');setMessage('');}} className="font-bold text-emerald-300">{mode === 'login' ? 'Sign up' : 'Log in'}</button></p>
      <p className="mt-4 text-[10px] leading-5 text-white/25">Phone sign-up requires Phone Auth and an SMS provider to be enabled in your Supabase project. Email confirmation settings are controlled in Supabase.</p>
    </div>
  </div>;
}
