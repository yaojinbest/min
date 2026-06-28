// L1 基础词典 - 50 词
export interface DictEntry {
  word: string;
  phonetic: string;
  meaningCn: string;
  emoji: string;
  partOfSpeech: string;
}

export const dictionary: DictEntry[] = [
  { word: 'I',       phonetic: '/aɪ/',     meaningCn: '我',       emoji: '🙋', partOfSpeech: 'pron.' },
  { word: 'you',     phonetic: '/juː/',    meaningCn: '你',       emoji: '👉', partOfSpeech: 'pron.' },
  { word: 'it',      phonetic: '/ɪt/',     meaningCn: '它',       emoji: '👉', partOfSpeech: 'pron.' },
  { word: 'my',      phonetic: '/maɪ/',    meaningCn: '我的',     emoji: '🤲', partOfSpeech: 'pron.' },
  { word: 'a',       phonetic: '/ə/',      meaningCn: '一个',     emoji: '1️⃣', partOfSpeech: 'art.' },
  { word: 'the',     phonetic: '/ðə/',     meaningCn: '这/那',   emoji: '👆', partOfSpeech: 'art.' },
  { word: 'is',      phonetic: '/ɪz/',     meaningCn: '是',       emoji: '✅', partOfSpeech: 'v.' },
  { word: 'am',      phonetic: '/æm/',     meaningCn: '是(我)',   emoji: '✅', partOfSpeech: 'v.' },
  { word: 'can',     phonetic: '/kæn/',    meaningCn: '能',       emoji: '💪', partOfSpeech: 'v.' },
  { word: 'have',    phonetic: '/hæv/',    meaningCn: '有',       emoji: '🤲', partOfSpeech: 'v.' },
  { word: 'look',    phonetic: '/lʊk/',    meaningCn: '看',       emoji: '👀', partOfSpeech: 'v.' },
  { word: 'see',     phonetic: '/siː/',    meaningCn: '看见',     emoji: '👁️', partOfSpeech: 'v.' },
  { word: 'come',    phonetic: '/kʌm/',    meaningCn: '来',       emoji: '🏃', partOfSpeech: 'v.' },
  { word: 'go',      phonetic: '/ɡoʊ/',    meaningCn: '走',       emoji: '🚶', partOfSpeech: 'v.' },
  { word: 'make',    phonetic: '/meɪk/',   meaningCn: '做',       emoji: '🛠️', partOfSpeech: 'v.' },
  { word: 'fly',     phonetic: '/flaɪ/',   meaningCn: '飞',       emoji: '🦅', partOfSpeech: 'v.' },
  { word: 'hatch',   phonetic: '/hætʃ/',   meaningCn: '孵化',     emoji: '🐣', partOfSpeech: 'v.' },
  { word: 'glow',    phonetic: '/ɡloʊ/',   meaningCn: '发光',     emoji: '✨', partOfSpeech: 'v.' },
  { word: 'magic',   phonetic: '/ˈmædʒɪk/', meaningCn: '魔法的',   emoji: '✨', partOfSpeech: 'adj.' },
  { word: 'small',   phonetic: '/smɔːl/',  meaningCn: '小的',     emoji: '🤏', partOfSpeech: 'adj.' },
  { word: 'big',     phonetic: '/bɪɡ/',    meaningCn: '大的',     emoji: '🐘', partOfSpeech: 'adj.' },
  { word: 'little',  phonetic: '/ˈlɪtl/',  meaningCn: '小的',     emoji: '🐭', partOfSpeech: 'adj.' },
  { word: 'round',   phonetic: '/raʊnd/',  meaningCn: '圆的',     emoji: '⭕', partOfSpeech: 'adj.' },
  { word: 'bright',  phonetic: '/braɪt/',  meaningCn: '亮的',     emoji: '🌟', partOfSpeech: 'adj.' },
  { word: 'hot',     phonetic: '/hɑːt/',  meaningCn: '热的',     emoji: '🔥', partOfSpeech: 'adj.' },
  { word: 'cold',    phonetic: '/koʊld/',  meaningCn: '冷的',     emoji: '🧊', partOfSpeech: 'adj.' },
  { word: 'happy',   phonetic: '/ˈhæpi/',  meaningCn: '开心的',   emoji: '😊', partOfSpeech: 'adj.' },
  { word: 'good',    phonetic: '/ɡʊd/',    meaningCn: '好的',     emoji: '👍', partOfSpeech: 'adj.' },
  { word: 'egg',     phonetic: '/eɡ/',     meaningCn: '蛋',       emoji: '🥚', partOfSpeech: 'n.' },
  { word: 'dragon',  phonetic: '/ˈdræɡən/', meaningCn: '龙',      emoji: '🐲', partOfSpeech: 'n.' },
  { word: 'star',    phonetic: '/stɑːr/',  meaningCn: '星星',     emoji: '⭐', partOfSpeech: 'n.' },
  { word: 'wizard',  phonetic: '/ˈwɪzərd/', meaningCn: '巫师',    emoji: '🧙', partOfSpeech: 'n.' },
  { word: 'fire',    phonetic: '/ˈfaɪər/', meaningCn: '火',       emoji: '🔥', partOfSpeech: 'n.' },
  { word: 'water',   phonetic: '/ˈwɔːtər/', meaningCn: '水',      emoji: '💧', partOfSpeech: 'n.' },
  { word: 'tree',    phonetic: '/triː/',   meaningCn: '树',       emoji: '🌳', partOfSpeech: 'n.' },
  { word: 'sun',     phonetic: '/sʌn/',    meaningCn: '太阳',     emoji: '☀️', partOfSpeech: 'n.' },
  { word: 'moon',    phonetic: '/muːn/',   meaningCn: '月亮',     emoji: '🌙', partOfSpeech: 'n.' },
  { word: 'cat',     phonetic: '/kæt/',    meaningCn: '猫',       emoji: '🐱', partOfSpeech: 'n.' },
  { word: 'dog',     phonetic: '/dɔːɡ/',   meaningCn: '狗',       emoji: '🐶', partOfSpeech: 'n.' },
  { word: 'bird',    phonetic: '/bɜːrd/',  meaningCn: '鸟',       emoji: '🐦', partOfSpeech: 'n.' },
  { word: 'book',    phonetic: '/bʊk/',    meaningCn: '书',       emoji: '📖', partOfSpeech: 'n.' },
  { word: 'and',     phonetic: '/ænd/',    meaningCn: '和',       emoji: '➕', partOfSpeech: 'conj.' },
  { word: 'but',     phonetic: '/bʌt/',    meaningCn: '但是',     emoji: '↩️', partOfSpeech: 'conj.' },
  { word: 'in',      phonetic: '/ɪn/',     meaningCn: '在...里',  emoji: '📦', partOfSpeech: 'prep.' },
  { word: 'on',      phonetic: '/ɑːn/',    meaningCn: '在...上',  emoji: '⬆️', partOfSpeech: 'prep.' },
  { word: 'at',      phonetic: '/æt/',     meaningCn: '在...处',  emoji: '📍', partOfSpeech: 'prep.' },
  { word: 'to',      phonetic: '/tuː/',    meaningCn: '到',       emoji: '➡️', partOfSpeech: 'prep.' },
  { word: 'now',     phonetic: '/naʊ/',    meaningCn: '现在',     emoji: '⏰', partOfSpeech: 'adv.' },
  { word: 'here',    phonetic: '/hɪr/',    meaningCn: '这里',     emoji: '👇', partOfSpeech: 'adv.' },
  { word: 'yes',     phonetic: '/jes/',    meaningCn: '是的',     emoji: '✅', partOfSpeech: 'intj.' },
  { word: 'no',      phonetic: '/noʊ/',    meaningCn: '不',       emoji: '❌', partOfSpeech: 'intj.' },
];

// 单词查词函数
export function lookupWord(word: string): DictEntry | undefined {
  return dictionary.find((d) => d.word.toLowerCase() === word.toLowerCase());
}

// 模糊匹配(去掉标点)
export function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}
