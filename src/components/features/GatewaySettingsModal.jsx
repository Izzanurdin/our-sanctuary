import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import {
  KeyRound,
  Phone,
  Radio,
  CheckCircle2,
  ExternalLink,
  Save,
  Send,
  AlertCircle,
} from 'lucide-react';
import {
  getGatewayConfig,
  saveGatewayConfig,
  sendWhatsAppMessage,
} from '../../services/whatsapp';

export default function GatewaySettingsModal({ isOpen, onClose, currentUser }) {
  const [fonnteToken, setFonnteToken] = useState(() => getGatewayConfig().fonnteToken || '');
  const [phoneIzza, setPhoneIzza] = useState(() => getGatewayConfig().phoneIzza || '');
  const [phoneCahayu, setPhoneCahayu] = useState(() => getGatewayConfig().phoneCahayu || '');
  const [savedToast, setSavedToast] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const config = {
      fonnteToken: fonnteToken.trim(),
      phoneIzza: phoneIzza.trim(),
      phoneCahayu: phoneCahayu.trim(),
    };
    saveGatewayConfig(config);
    setSavedToast('Pengaturan WhatsApp Gateway berhasil disimpan! 💕');
    setTimeout(() => {
      setSavedToast('');
    }, 2500);
  };

  const handleTestSend = async () => {
    const targetPhone = currentUser?.role === 'boyfriend' ? phoneCahayu : phoneIzza;
    const partnerName = currentUser?.role === 'boyfriend' ? 'Cahayu' : 'Izza';

    if (!targetPhone) {
      setTestResult(`Silakan isi nomor WhatsApp ${partnerName} terlebih dahulu.`);
      return;
    }

    setTesting(true);
    setTestResult('');
    try {
      const res = await sendWhatsAppMessage({
        targetPhone,
        message: `✨ [Tes Koneksi Our Sanctuary]\nHalo ${partnerName}! Ini adalah pesan uji coba WhatsApp Gateway dari ${currentUser?.name || 'Pasanganmu'}. Koneksi berhasil terhubung! ❤️`,
      });

      if (res.method === 'fonnte') {
        setTestResult('Berhasil dikirim otomatis via Fonnte Gateway! 🟢');
      } else {
        setTestResult('Direct link WhatsApp (wa.me) berhasil dibuka! 🟡');
      }
    } catch (err) {
      setTestResult(`Gagal mengirim: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const isFonnteActive = Boolean(fonnteToken.trim());

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan WhatsApp Gateway"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Status Mode Badge */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isFonnteActive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Radio
              className={`w-3.5 h-3.5 ${
                isFonnteActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
              }`}
            />
            <span className="font-semibold text-xs text-white">
              {isFonnteActive
                ? 'Gateway Otomatis Aktif (Fonnte API)'
                : 'Mode Direct Link WhatsApp (wa.me Aktif)'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            {isFonnteActive
              ? 'Pesan cinta & rindu akan terkirim instan di latar belakang langsung ke WhatsApp pasangan tanpa perlu buka aplikasi WA!'
              : 'Pesan akan disiapkan otomatis dan diarahkan ke WhatsApp Web/App secara langsung.'}
          </p>
        </div>

        {/* Fonnte API Token Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-pink-200 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-pink-400" />
              Fonnte API Token (Opsional)
            </label>
            <a
              href="https://fonnte.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-pink-400/80 hover:text-pink-300 flex items-center gap-0.5 underline decoration-pink-500/30"
            >
              Daftar di fonnte.com <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <input
            type="password"
            value={fonnteToken}
            onChange={(e) => setFonnteToken(e.target.value)}
            placeholder="Masukkan token Fonnte jika ingin kirim otomatis..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none transition-all font-mono"
          />
          <p className="text-[10px] text-neutral-400 mt-1">
            Kosongkan jika ingin menggunakan link gratis wa.me biasa tanpa API.
          </p>
        </div>

        {/* Phone Numbers Grid */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <label className="text-xs font-medium text-pink-200 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              Nomor WhatsApp Cahayu (Format 628...)
            </label>
            <input
              type="text"
              value={phoneCahayu}
              onChange={(e) => setPhoneCahayu(e.target.value)}
              placeholder="Contoh: 6281234567890"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-rose-200 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              Nomor WhatsApp Izza (Format 628...)
            </label>
            <input
              type="text"
              value={phoneIzza}
              onChange={(e) => setPhoneIzza(e.target.value)}
              placeholder="Contoh: 6289876543210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-rose-500/50 text-xs text-white placeholder-neutral-500 outline-none font-mono"
            />
          </div>
        </div>

        {/* Test Result Toast */}
        {testResult && (
          <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-neutral-200 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-[11px] leading-snug">{testResult}</span>
          </div>
        )}

        {/* Save Toast */}
        {savedToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleTestSend}
            disabled={testing}
            className="py-2.5 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-neutral-300 text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-pink-400" />
            {testing ? 'Menguji...' : 'Uji Koneksi'}
          </button>

          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Konfigurasi
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
