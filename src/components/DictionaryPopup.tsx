/**
 * 查词弹窗
 */
import type { DictEntry } from '../data/dictionary';

interface Props {
  entry: DictEntry;
  onClose: () => void;
  onPlay: () => void;
}

export function DictionaryPopup({ entry, onClose, onPlay }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card max-w-sm w-full mx-4 text-center animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-7xl mb-3">{entry.emoji}</div>
        <div className="text-3xl font-bold text-magic-700 mb-1">{entry.word}</div>
        <div className="text-gray-500 text-sm mb-3">
          {entry.phonetic} · <span className="italic">{entry.partOfSpeech}</span>
        </div>
        <div className="text-xl text-gray-800 mb-4">{entry.meaningCn}</div>
        <div className="flex gap-2 justify-center">
          <button
            className="btn-magic flex items-center gap-2"
            onClick={onPlay}
          >
            <span>🔊</span> 听一听
          </button>
          <button className="btn-ghost" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
