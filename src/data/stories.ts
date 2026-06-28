// 3 个 L1 魔法故事
export type QuizType = 'image_choice' | 'word_builder';

export interface QuizItem {
  id: string;
  type: QuizType;
  // image_choice: question 是中文, options 是 {emoji, value}
  // word_builder: question 是中文, answer 是单词, scrambled 是打乱字母
  question: string;
  options?: { emoji: string; value: string }[];
  answer: string;
  scrambled: string[];
}

export interface Paragraph {
  en: string;
  cn: string;
}

export interface Story {
  id: string;
  level: 1;
  title: string;
  titleCn: string;
  emoji: string;
  themeColor: string;
  paragraphs: Paragraph[];
  quiz: QuizItem[];
}

export const stories: Story[] = [
  // Story 1: 魔法蛋
  {
    id: 'story_1',
    level: 1,
    title: 'The Magic Egg',
    titleCn: '魔法蛋',
    emoji: '🥚',
    themeColor: 'from-yellow-200 to-pink-200',
    paragraphs: [
      { en: 'I have a magic egg.', cn: '我有一个魔法蛋。' },
      { en: 'It is small and round.', cn: '它又小又圆。' },
      { en: 'Look! It is glowing!', cn: '看!它在发光!' },
    ],
    quiz: [
      {
        id: 'q1_1',
        type: 'image_choice',
        question: '听音选图:哪个是"魔法蛋"?',
        options: [
          { emoji: '🥚', value: 'egg' },
          { emoji: '⭐', value: 'star' },
          { emoji: '🐲', value: 'dragon' },
          { emoji: '🌳', value: 'tree' },
        ],
        answer: 'egg',
        scrambled: [],
      },
      {
        id: 'q1_2',
        type: 'image_choice',
        question: '"small" 是什么意思?',
        options: [
          { emoji: '🐘', value: 'big' },
          { emoji: '🤏', value: 'small' },
          { emoji: '⭕', value: 'round' },
          { emoji: '✨', value: 'bright' },
        ],
        answer: 'small',
        scrambled: [],
      },
      {
        id: 'q1_3',
        type: 'word_builder',
        question: '拼出单词:magic (魔法的)',
        answer: 'magic',
        scrambled: ['g', 'i', 'c', 'a', 'm'],
      },
      {
        id: 'q1_4',
        type: 'word_builder',
        question: '拼出单词:egg (蛋)',
        answer: 'egg',
        scrambled: ['g', 'e', 'g'],
      },
    ],
  },

  // Story 2: 小雏龙
  {
    id: 'story_2',
    level: 1,
    title: 'The Little Dragon',
    titleCn: '小雏龙',
    emoji: '🐲',
    themeColor: 'from-green-200 to-blue-200',
    paragraphs: [
      { en: 'The egg hatches.', cn: '蛋孵化了。' },
      { en: 'A little dragon comes out.', cn: '一只小龙出来了。' },
      { en: 'The dragon can fly!', cn: '龙能飞!' },
    ],
    quiz: [
      {
        id: 'q2_1',
        type: 'image_choice',
        question: '听音选图:哪个是"龙"?',
        options: [
          { emoji: '🐱', value: 'cat' },
          { emoji: '🐶', value: 'dog' },
          { emoji: '🐲', value: 'dragon' },
          { emoji: '🐦', value: 'bird' },
        ],
        answer: 'dragon',
        scrambled: [],
      },
      {
        id: 'q2_2',
        type: 'image_choice',
        question: '"fly" 是什么意思?',
        options: [
          { emoji: '🦅', value: 'fly' },
          { emoji: '🚶', value: 'go' },
          { emoji: '👀', value: 'look' },
          { emoji: '🛠️', value: 'make' },
        ],
        answer: 'fly',
        scrambled: [],
      },
      {
        id: 'q2_3',
        type: 'word_builder',
        question: '拼出单词:dragon (龙)',
        answer: 'dragon',
        scrambled: ['g', 'o', 'n', 'r', 'a', 'd'],
      },
      {
        id: 'q2_4',
        type: 'word_builder',
        question: '拼出单词:fly (飞)',
        answer: 'fly',
        scrambled: ['l', 'f', 'y'],
      },
    ],
  },

  // Story 3: 闪亮的星星
  {
    id: 'story_3',
    level: 1,
    title: 'A Bright Star',
    titleCn: '闪亮的星星',
    emoji: '⭐',
    themeColor: 'from-purple-200 to-indigo-200',
    paragraphs: [
      { en: 'I am a wizard.', cn: '我是一个巫师。' },
      { en: 'I can make a bright star.', cn: '我能造一颗闪亮的星星。' },
      { en: 'Look at the star!', cn: '看那颗星星!' },
    ],
    quiz: [
      {
        id: 'q3_1',
        type: 'image_choice',
        question: '听音选图:哪个是"巫师"?',
        options: [
          { emoji: '🧙', value: 'wizard' },
          { emoji: '🐲', value: 'dragon' },
          { emoji: '🐣', value: 'dragon' },
          { emoji: '⭐', value: 'star' },
        ],
        answer: 'wizard',
        scrambled: [],
      },
      {
        id: 'q3_2',
        type: 'image_choice',
        question: '"bright" 是什么意思?',
        options: [
          { emoji: '🌑', value: 'dark' },
          { emoji: '🌟', value: 'bright' },
          { emoji: '🔴', value: 'red' },
          { emoji: '🔵', value: 'blue' },
        ],
        answer: 'bright',
        scrambled: [],
      },
      {
        id: 'q3_3',
        type: 'word_builder',
        question: '拼出单词:star (星星)',
        answer: 'star',
        scrambled: ['r', 's', 'a', 't'],
      },
      {
        id: 'q3_4',
        type: 'word_builder',
        question: '拼出单词:look (看)',
        answer: 'look',
        scrambled: ['o', 'l', 'k', 'o'],
      },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
