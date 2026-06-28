import { useState, useRef } from 'react';
import { Camera, Save, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Avatar({ user, size = 96 }) {
  const initials = (user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="rounded-full object-cover border-2 border-stone-200"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-stone-900 flex items-center justify-center border-2 border-stone-200"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.3 }}>
        {initials}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name,       setName]       = useState(user?.name  || '');
  const [bio,        setBio]        = useState(user?.bio   || '');
  const [avatar,     setAvatar]     = useState(user?.avatar || '');
  const [preview,    setPreview]    = useState(user?.avatar || '');
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null); // { type: 'success'|'error', msg }
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image must be smaller than 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setAvatar('');
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    if (!name.trim()) { showToast('error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ name: name.trim(), bio, avatar });
      updateUser(data.user);
      showToast('success', 'Profile updated');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const fakeUser = { name, avatar: preview };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={13} /></button>
        </div>
      )}

      <div className="max-w-lg mx-auto w-full px-4 py-10 flex-1">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Profile</h1>
        <p className="text-sm text-stone-500 mb-8">Update your name, photo, and bio.</p>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-7">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar user={fakeUser} size={96} />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center shadow-md hover:bg-stone-700 transition-colors"
                title="Upload photo"
              >
                <Camera size={13} className="text-white" />
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
              >
                {preview ? 'Change photo' : 'Upload photo'}
              </button>
              {preview && (
                <button
                  onClick={removePhoto}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400">JPG, PNG or GIF · max 2 MB</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-stone-100 bg-stone-100 text-stone-400 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-stone-400 mt-1">Email cannot be changed.</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Bio <span className="font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition-all"
              placeholder="A short bio about yourself…"
            />
            <p className="text-right text-xs text-stone-400 mt-0.5">{bio.length}/300</p>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 active:bg-stone-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
