import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import { Copy, Check, Sparkles, MessageCircleHeart } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';
import { getGatewayConfig, sendWhatsAppMessage } from '../../services/whatsapp';

export default function PartnerReminderModal({
  isOpen,
  onClose,
  partner,
  partnerProgress,
}) {
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState(() => {
    const config = getGatewayConfig();
    return partner?.role === 'girlfriend'
      ? config.phoneCahayu || partner?.partnerPhone || ''
      : config.phoneIzza || partner?.partnerPhone || '';
  });
  const [sentToast, setSentToast] = useState('');
  const [isSending, setIsSending] = useState(false);

  const nickname = getRandomNickname(partner);

  const defaultMessage = `Hai ${nickname}! ❤️ Jangan lupa minum air & selesaikan checklist makan hari ini yaa, biar Health Streak kita berdua nyala hari ini! Semangat ${nickname} 🔥`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = async () => {
    const targetPhone = phone.replace(/[^0-9]/g, '');

    if (!targetPhone) {
      handleCopy();
      setSentToast('Nomor WA belum diisi, pesan sudah disalin ke clipboard! Siap dipaste di chat ya sayang 💕');
      setTimeout(() => setSentToast(''), 3000);
      return;
    }

    setIsSending(true);
    try {
      const res = await sendWhatsAppMessage({
        targetPhone,
        message: defaultMessage,
      });

      if (res.method === 'fonnte') {
        setSentToast('Pesan pengingat terkirim otomatis di latar belakang! 🟢');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSentToast('Membuka WhatsApp untuk mengirim pesan... 🟡');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setSentToast(`Gagal mengirim: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Ingatkan ${partner?.name || 'Pasangan'} Hidup Sehat`}
    >
      <div className="space-y-4">
        {/* Partner Progress Status */}
        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-pink-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Progres {partner?.name || 'Pasangan'}:
            </span>
            <span className="font-mono text-xs font-bold text-pink-300">
              {partnerProgress?.completedItems || 0} / {partnerProgress?.totalItems || 7} Target ({partnerProgress?.percent || 0}%)
            </span>
          </div>
          <p className="text-[11px] text-neutral-300">
            Ayo semangati {partner?.name} agar target sehat hari ini tuntas berdua dan streak cinta kita menyala! 🔥
          </p>
        </div>

        {/* Message Preview */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1.5">
            Draf Pesan Pengingat Manis:
          </label>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-neutral-200 leading-relaxed font-sans select-all">
            {defaultMessage}
          </div>
        </div>

        {/* WhatsApp Phone Input */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Nomor WhatsApp {partner?.name} (Awali 628...):
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 6281234567890 (tersinkron dengan Gateway)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none font-mono"
          />
        </div>

        {sentToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-200 text-center animate-in fade-in">
            {sentToast}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-neutral-300 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin Pesan'}
          </button>

          <button
            type="button"
            onClick={handleSendWA}
            disabled={isSending}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <MessageCircleHeart className="w-4 h-4" />
            {isSending ? 'Mengirim...' : 'Kirim via WhatsApp'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
