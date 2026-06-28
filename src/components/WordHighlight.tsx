/**
 * 单词高亮组件
 * 把句子拆成单词,正在朗读的单词高亮
 * 点击单词触发查词
 */
import { useMemo } from 'react';
import { tokenize, lookupWord } from '../data/dictionary';

interface Props {
  text: string;
  activeIndex: number | null;
  onWordClick?: (word: string) => void;
}

export function WordHighlight({ text, activeIndex, onWordClick }: Props) {
  // 切词:按空格拆,标点跟着上一个词
  const tokens = useMemo(() => {
    // 按字符扫描:连续字母数字 = 1 个词
    const result: { text: string; wordIndex: number | null }[] = [];
    let i = 0;
    let wordIdx = 0;
    while (i < text.length) {
      const ch = text[i];
      if (/[a-zA-Z]/.test(ch)) {
        let j = i;
        while (j < text.length && /[a-zA-Z']/.test(text[j])) j++;
        result.push({ text: text.slice(i, j), wordIndex: wordIdx });
        wordIdx++;
        i = j;
      } else {
        result.push({ text: ch, wordIndex: null });
        i++;
      }
    }
    return result;
  }, [text]);

  return (
    <p className="text-2xl md:text-3xl leading-relaxed text-gray-800 select-text">
      {tokens.map((tok, i) => {
        if (tok.wordIndex === null) {
          return <span key={i}>{tok.text}</span>;
        }
        const isActive = activeIndex === tok.wordIndex;
        const dict = lookupWord(tok.text);
        return (
          <span
            key={i}
            onClick={() => onWordClick?.(tok.text)}
            className={[
              'inline-block cursor-pointer rounded px-0.5 transition-all',
              isActive ? 'word-active' : 'hover:bg-magic-100',
              dict ? 'text-magic-700' : 'text-gray-800',
            ].join(' ')}
            title={dict?.meaningCn}
          >
            {tok.text}
          </span>
        );
      })}
    </p>
  );
}
