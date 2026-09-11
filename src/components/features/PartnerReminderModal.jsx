import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import { Copy, Check, Sparkles, BellRing, ExternalLink } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';
import { sendPartnerReminderToCloud } from '../../services/notificationService';

export default function PartnerReminderModal({
  isOpen,
  onClose,
  partner,
  partnerProgress,
  user,
}) {
  const [copied, setCopied] = useState(false);
  const [sentToast, setSentToast] = useState('');
  const [isSending, setIsSending] = useState(false);

  const nickname = getRandomNickname(partner);

  const defaultMessage = `Hai ${nickname}! ❤️ Jangan lupa minum air & selesaikan checklist makan hari ini yaa, biar Health Streak kita berdua nyala hari ini! Semangat ${nickname} 🔥`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Kirim Pop-up Notifikasi & Getaran langsung ke HP Pasangan via Web Push
  const handleSendWebPush = async () => {
    setIsSending(true);
    try {
      const senderName = user?.name || (user?.role === 'boyfriend' ? 'Izza' : 'Cahayu');
      const senderId = user?.id || (partner?.role === 'girlfriend' ? 'user_izza' : 'user_sayang');
      const recipientId = partner?.id || (user?.id === 'user_sayang' ? 'user_izza' : 'user_sayang');

      await sendPartnerReminderToCloud({
        senderName,
        senderId,
        recipientId,
        message: defaultMessage,
        reminderType: 'health_checklist',
      });

      setSentToast(`🔔 Notifikasi getar & pop-up berhasil meluncur ke HP ${partner?.name || 'Pasangan'}!`);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setSentToast(`Gagal mengirim notifikasi: ${err.message}`);
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
            Pesan Pengingat Manis:
          </label>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-neutral-200 leading-relaxed font-sans select-all">
            {defaultMessage}
          </div>
        </div>

        {sentToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-200 text-center animate-in fade-in">
            {sentToast}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleSendWebPush}
            disabled={isSending}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>{isSending ? 'Mengirim Notifikasi...' : `Kirim Notifikasi Langsung ke HP ${partner?.name || 'Pasangan'}`}</span>
          </button>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-neutral-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-[11px] text-neutral-400 hover:text-pink-300 transition-colors flex items-center gap-1"
            >
              <span>Buka WhatsApp Manual</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

