/**
 * 阅读页 — TTS + 单词高亮 + 跟读 + 查词
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStory } from '../data/stories';
import { lookupWord, type DictEntry } from '../data/dictionary';
import { tts } from '../services/tts';
import { WordHighlight } from '../components/WordHighlight';
import { DictionaryPopup } from '../components/DictionaryPopup';
import { Recorder } from '../components/Recorder';

export function Reader() {
  const { storyId = '' } = useParams();
  const navigate = useNavigate();
  const story = getStory(storyId);
  const [pIdx, setPIdx] = useState(0);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [dict, setDict] = useState<DictEntry | null>(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // 订阅 TTS 事件
    unsubRef.current = tts.subscribe((e) => {
      if (e.type === 'start') {
        setTtsPlaying(true);
        setActiveWord(null);
      } else if (e.type === 'end') {
        setTtsPlaying(false);
        setActiveWord(null);
      } else if (e.type === 'word') {
        setActiveWord(e.wordIndex);
      }
    });
    // 预热:首次进入页面加载音频
    tts.prime();
    return () => {
      unsubRef.current?.();
      tts.stop();
    };
  }, []);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <div className="text-4xl mb-2">😢</div>
          <div>没找到这个故事</div>
          <button onClick={() => navigate('/home')} className="btn-magic mt-4">
            返回
          </button>
        </div>
      </div>
    );
  }

  const paragraph = story.paragraphs[pIdx];
  const isLast = pIdx === story.paragraphs.length - 1;

  const playTTS = useCallback(async () => {
    if (!tts.isSupported()) {
      alert('当前浏览器不支持语音播放 😅');
      return;
    }
    try {
      await tts.speakParagraph(storyId, pIdx, paragraph.en);
    } catch (e) {
      console.error('[TTS] play failed:', e);
    }
  }, [storyId, pIdx, paragraph.en]);

  function next() {
    tts.stop();
    if (isLast) {
      navigate(`/quiz/${storyId}`);
    } else {
      setPIdx(pIdx + 1);
    }
  }

  function prev() {
    tts.stop();
    if (pIdx > 0) setPIdx(pIdx - 1);
  }

  function handleWordClick(word: string) {
    const entry = lookupWord(word);
    if (entry) {
      setDict(entry);
      tts.stop();
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/home')} className="btn-ghost">
            ← 返回
          </button>
          <div className="text-sm text-gray-500">
            {pIdx + 1} / {story.paragraphs.length}
          </div>
        </div>

        {/* 故事标题 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-1">{story.emoji}</div>
          <h1 className="text-2xl font-bold text-magic-700">{story.titleCn}</h1>
          <div className="text-sm text-gray-500">{story.title}</div>
        </div>

        {/* 英文段落 */}
        <div className="card mb-4">
          <WordHighlight
            text={paragraph.en}
            activeIndex={activeWord}
            onWordClick={handleWordClick}
          />
          <div className="mt-4 pt-4 border-t border-gray-100 text-base text-gray-600">
            {paragraph.cn}
          </div>
        </div>

        {/* TTS 控制 */}
        <div className="flex justify-center gap-2 mb-4">
          <button onClick={playTTS} disabled={ttsPlaying} className="btn-magic disabled:opacity-50">
            {ttsPlaying ? '🔊 朗读中...' : '🔊 朗读'}
          </button>
          {ttsPlaying && (
            <button onClick={() => tts.stop()} className="btn-ghost">
              ⏹ 停止
            </button>
          )}
        </div>

        {/* 跟读 */}
        <div className="mb-4">
          <Recorder
            key={`rec-${storyId}-${pIdx}`}
            text={paragraph.en}
            onPlayTTS={playTTS}
            ttsPlaying={ttsPlaying}
          />
        </div>

        {/* 翻页 */}
        <div className="flex justify-between gap-2">
          <button onClick={prev} disabled={pIdx === 0} className="btn-ghost disabled:opacity-30">
            ← 上一段
          </button>
          <button onClick={next} className="btn-magic">
            {isLast ? '开始答题 →' : '下一段 →'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          💡 点击单词可以查词
        </div>

        {/* 调试用诊断按钮(隐藏,长按底部署名触发) */}
        <div
          className="mt-8 text-center text-xs text-gray-300 cursor-help select-none"
          onDoubleClick={() => {
            console.log('[TTS] diagnose:', tts.diagnose());
            alert(JSON.stringify(tts.diagnose(), null, 2));
          }}
          title="双击查看 TTS 诊断"
        >
          ·
        </div>
      </div>

      {/* 查词弹窗 */}
      {dict && (
        <DictionaryPopup
          entry={dict}
          onClose={() => setDict(null)}
          onPlay={() => {
            tts.speakWord(dict.word);
          }}
        />
      )}
    </div>
  );
}
