import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './VoiceCheck.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ============================
// 設問データ
// （各選択肢の値がそれぞれの軸スコアに加算されます）
// axes: { 呼気圧, 頭蓋共鳴, 鼻腔共鳴, 口腔共鳴, 咽頭共鳴, 胸部共鳴 }
// ============================
const AXES = ['呼気圧', '頭蓋共鳴', '鼻腔共鳴', '口腔共鳴', '咽頭共鳴', '胸部共鳴'];
const MAX_SCORE = 10; // 各軸の最大スコア（表示スケール用）

const QUESTIONS = [
  {
    id: 'q1',
    text: '声を出すとき、おなかと背中が外側に張っている感じはありますか？',
    help: '丹田・腹圧・横隔膜の使い方に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [1, 0, 0, 0, 0, 0] },
      { label: 'どちらとも言えない', scores: [2, 0, 0, 0, 0, 0] },
      { label: 'ときどきある', scores: [3, 0, 0, 0, 0, 0] },
      { label: 'いつもある', scores: [4, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 'q2',
    text: '高い声を出すとき、頭のてっぺんから声が抜けていくような感じはありますか？',
    help: '頭蓋骨（頭頂部）を使った共鳴の感覚に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 1, 0, 0, 0, 0] },
      { label: 'どちらとも言えない', scores: [0, 2, 0, 0, 0, 0] },
      { label: 'ときどきある', scores: [0, 3, 0, 0, 0, 0] },
      { label: 'いつもある', scores: [0, 4, 0, 0, 0, 0] },
    ],
  },
  {
    id: 'q3',
    text: 'ハミングをしているとき、鼻の奥や鼻すじのあたりがビリビリ・ムズムズする感じはありますか？',
    help: '鼻腔共鳴の使い方に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 0, 1, 0, 0, 0] },
      { label: 'どちらとも言えない', scores: [0, 0, 2, 0, 0, 0] },
      { label: 'ときどきある', scores: [0, 0, 3, 0, 0, 0] },
      { label: 'いつもある', scores: [0, 0, 4, 0, 0, 0] },
    ],
  },
  {
    id: 'q4',
    text: '声を出すとき、口の天井（上あご）やのどちんこ付近が、ビリビリと震えている感覚はありますか？',
    help: '口腔内の空間を使った共鳴の感覚に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 0, 0, 1, 0, 0] },
      { label: 'どちらとも言えない', scores: [0, 0, 0, 2, 0, 0] },
      { label: 'ときどきある', scores: [0, 0, 0, 3, 0, 0] },
      { label: 'いつもある', scores: [0, 0, 0, 4, 0, 0] },
    ],
  },
  {
    id: 'q5',
    text: 'リラックスしてしゃべるときの「低い声」は、無理なくラクに出せますか？',
    help: '喉の奥・咽頭腔を広げる感覚に関する設問です。',
    options: [
      { label: 'とても出しにくい', scores: [0, 0, 0, 0, 0, 0] },
      { label: '出しにくい', scores: [0, 0, 0, 0, 1, 0] },
      { label: 'どちらとも言えない', scores: [0, 0, 0, 0, 2, 0] },
      { label: '出しやすい', scores: [0, 0, 0, 0, 3, 0] },
      { label: 'とても出しやすい', scores: [0, 0, 0, 0, 4, 0] },
    ],
  },
  {
    id: 'q6',
    text: '声を出しながら胸に手を当てると、胸がビリビリと震えているのがわかりますか？',
    help: '胸腔共鳴・チェストレゾナンスに関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 0, 0, 0, 0, 1] },
      { label: 'どちらとも言えない', scores: [0, 0, 0, 0, 0, 2] },
      { label: 'ときどきある', scores: [0, 0, 0, 0, 0, 3] },
      { label: 'いつもある', scores: [0, 0, 0, 0, 0, 4] },
    ],
  },
  {
    id: 'q7',
    text: '話したり歌ったりすると、すぐに喉がイガイガしたり、声がガラガラになりますか？',
    help: '呼気コントロールの効率性に関する設問です（逆算して加算します）。',
    options: [
      { label: 'すぐに疲れる', scores: [0, 0, 0, 0, 0, 0] },
      { label: '疲れやすい', scores: [1, 0, 0, 0, 0, 0] },
      { label: 'どちらとも言えない', scores: [2, 0, 0, 0, 0, 0] },
      { label: 'あまり疲れない', scores: [3, 0, 0, 0, 0, 0] },
      { label: 'まったく疲れない', scores: [4, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 'q8',
    text: '声を出すときあくびをするように、口の奥が広く開いている感じはしますか？',
    help: '口腔・軟口蓋の使い方に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 0, 0, 1, 0, 0] },
      { label: 'どちらとも言えない', scores: [0, 0, 0, 2, 0, 0] },
      { label: 'ときどきある', scores: [0, 0, 0, 3, 0, 0] },
      { label: 'いつもある', scores: [0, 0, 0, 4, 0, 0] },
    ],
  },
  {
    id: 'q9',
    text: '歌ったあと喉が痛くならず「気持ちよく声が出せた」とスッキリしますか？',
    help: '声帯・共鳴バランスの効率性に関する設問です。',
    options: [
      { label: 'いつも枯れる', scores: [0, 0, 0, 0, 0, 0] },
      { label: '枯れやすい', scores: [1, 0, 0, 0, 1, 0] },
      { label: 'どちらとも言えない', scores: [1, 0, 0, 0, 1, 1] },
      { label: 'あまり枯れない', scores: [2, 0, 0, 0, 1, 1] },
      { label: 'まったく枯れない', scores: [2, 0, 1, 0, 2, 1] },
    ],
  },
  {
    id: 'q10',
    text: '高い声を出すとき、おでこや「眉毛と眉毛の間」のあたりに声が集まっている感覚はありますか？',
    help: '頭蓋共鳴・鼻腔共鳴の前方共鳴に関する設問です。',
    options: [
      { label: 'まったくない', scores: [0, 0, 0, 0, 0, 0] },
      { label: 'あまりない', scores: [0, 1, 1, 0, 0, 0] },
      { label: 'どちらとも言えない', scores: [0, 2, 1, 0, 0, 0] },
      { label: 'ときどきある', scores: [0, 3, 2, 0, 0, 0] },
      { label: 'いつもある', scores: [0, 4, 2, 0, 0, 0] },
    ],
  },
];

// スコアに応じた4段階メッセージ定義
// score: 0〜3 → できていない / 4〜6 → 自然と使えている / 7〜9 → 大きく使えている / 10 → 過剰かもしれない
const AXIS_MESSAGES = [
  // 呼気圧
  {
    icon: '💨',
    name: '呼気圧',
    levels: [
      'まだ腹圧・横隔膜を使った発声ができていない状態です。意識してトレーニングしてみましょう。',
      '腹から息を送り出す感覚が自然と身についてきています。',
      '腹圧・横隔膜によるしっかりした呼気圧が大きく使えています！',
      '呼気圧が非常に高いです。力みすぎていないか確認してみましょう。',
    ],
  },
  // 頭蓋共鳴
  {
    icon: '🔔',
    name: '頭蓋共鳴',
    levels: [
      '頭のてっぺんへの共鳴がまだできていない状態です。高音を出す際に上への意識を持ちましょう。',
      '頭蓋骨への響きが自然と使えてきています。',
      '頭のてっぺんへの共鳴を大きく使えています！高音の抜けが豊かです。',
      '頭蓋共鳴が非常に強い状態です。鋭くなりすぎていないかバランスを確認しましょう。',
    ],
  },
  // 鼻腔共鳴
  {
    icon: '👃',
    name: '鼻腔共鳴',
    levels: [
      '鼻腔への響きがまだできていない状態です。ハミングを使った練習が効果的です。',
      '鼻腔共鳴が自然と使えてきています。',
      '鼻腔・鼻すじへの响きを大きく使えています！',
      '鼻腔共鳴が非常に強い状態です。鼻声になりすぎていないか確認しましょう。',
    ],
  },
  // 口腔共鳴
  {
    icon: '👄',
    name: '口腔共鳴',
    levels: [
      '口腔内の空間をまだ使えていない状態です。軟口蓋を上げる意識をもちましょう。',
      '口腔共鳴が自然と使えてきています。',
      '口腔内の空間を大きく使えています！口の奥の響きが豊かです。',
      '口腔共鳴が非常に強い状態です。こもった印象にならないか確認しましょう。',
    ],
  },
  // 咽頭共鳴
  {
    icon: '🎙️',
    name: '咽頭共鳴',
    levels: [
      '喉の奥（咽頭）をまだうまく広げられていない状態です。低音・太い声の練習をしましょう。',
      '咽頭共鳴が自然と使えてきています。',
      '咽頭腔を大きく広げた響きが使えています！低音の深みがあります。',
      '咽頭共鳴が非常に強い状態です。喉に力が入りすぎていないか確認しましょう。',
    ],
  },
  // 胸部共鳴
  {
    icon: '🫀',
    name: '胸部共鳴',
    levels: [
      '胸板への響きがまだできていない状態です。胸・鎖骨への振動を意識してみましょう。',
      '胸部共鳴が自然と使えてきています。',
      '胸板・鎖骨への共鳴を大きく使えています！声に厚みと安定感があります。',
      '胸部共鳴が非常に強い状態です。重くなりすぎていないかバランスを確認しましょう。',
    ],
  },
];

// 各軸に対応するnote記事の定義 (IDはURLの末尾部分)
const AXIS_NOTES = [
  { axisIndex: 0, name: '呼気圧',   noteId: 'n3cf58f4f5328' },
  { axisIndex: 1, name: '頭蓋共鳴', noteId: 'n8b227f7c2658' },
  { axisIndex: 2, name: '鼻腔共鳴', noteId: 'n11a7757020b9' },
  { axisIndex: 3, name: '口腔共鳴', noteId: 'nee2f4d7c666f' },
  { axisIndex: 4, name: '咽頭共鳴', noteId: 'n062f02f71047' },
  { axisIndex: 5, name: '胸部共鳴', noteId: 'na9a565f42913' },
];

function getRecommendations(scores) {
  // スコアが低い順にソートして、上位3つ（ただし満点に近いものは除外したいが、基本は低いものから選ぶ）
  // ユーザーが「足りない部分」と言っているので、単純に昇順ソートで上位3つを返す。
  const items = AXIS_NOTES.map(note => ({
    ...note,
    score: scores[note.axisIndex]
  }));
  
  // スコアで昇順ソート
  items.sort((a, b) => a.score - b.score);
  
  // 最大3つを返す（もし特定のスコア以上なら除外するなどのロジックも可能だが、まずは単純に3つ）
  return items.slice(0, 3);
}

// スコアから段階インデックスを取得
function getLevel(score) {
  if (score >= 10) return 3;
  if (score >= 7) return 2;
  if (score >= 4) return 1;
  return 0; // 0〜3：できていない
}

// スコアからコメントを生成
function generateComment(scores) {
  return scores.map((score, i) => {
    const { icon, name, levels } = AXIS_MESSAGES[i];
    return `${icon} ${name}：${levels[getLevel(score)]}`;
  });
}

// ============================
// タイプ別診断
// axes index: [呼気圧(0), 頭蓋共鳴(1), 鼻腔共鳴(2), 口腔共鳴(3), 咽頭共鳴(4), 胸部共鳴(5)]
// ============================
const VOICE_TYPES = [
  { id: 1,  icon: '🔥', name: 'エンジン全開タイプ',     desc: '声のパワーがずば抜けてる！場の空気を変える力を持っている' },
  { id: 2,  icon: '🌤️', name: '天の響きタイプ',         desc: '澄んでいて空に抜けていく声。高音の美しさが際立つ' },
  { id: 3,  icon: '🌍', name: '大地の声タイプ',         desc: 'どっしりした低音で聴く人をホッとさせる、安定感の声' },
  { id: 4,  icon: '☀️', name: '太陽みたいな声タイプ',   desc: '明るく前に飛ぶ！人の心に直接届く元気をくれる声' },
  { id: 5,  icon: '🍵', name: '懐の深いタイプ',         desc: '温かみと奥行きが両立。つい聴き入ってしまう魅力的な声' },
  { id: 6,  icon: '🎯', name: 'フルパッケージタイプ',   desc: 'どんな場面にも対応できる、完成度の高い万能な声' },
  { id: 7,  icon: '⚡', name: '嵐タイプ',               desc: '力強さと重みを兼備。圧倒的な存在感で場を支配する声' },
  { id: 8,  icon: '🏛️', name: 'ホールを満たすタイプ',   desc: '高さと広がりで空間を支配。映える声の持ち主' },
  { id: 9,  icon: '🌙', name: 'ミステリアスタイプ',     desc: '独特の色気と深み。ほかの人と被らない個性的な声' },
  { id: 10, icon: '🏹', name: '一点突破タイプ',         desc: '鋭く、遠くまで届く。突き刺さるような高音の持ち主' },
  { id: 11, icon: '🌅', name: 'お日さまタイプ',         desc: '温かみと豊かさで包み込む。聴く人を安心させる声' },
  { id: 12, icon: '🚣', name: '自分探しの旅人タイプ',   desc: 'なりたい！も、自分向きも探せる可能性の旅人。未来は無限大！' },
];

function determineVoiceType(scores) {
  const [kiki, zukai, biku, kouku, intou, kyobu] = scores;
  const H = 6; // 「高い」の閾値
  const h = (v) => v >= H;

  // フルパッケージ（5軸以上が高い）
  if (scores.filter(h).length >= 5) return VOICE_TYPES[5];
  // 呼気圧＋胸部 → 嵐
  if (h(kiki) && h(kyobu)) return VOICE_TYPES[6];
  // 呼気圧＋頭蓋 → 一点突破
  if (h(kiki) && h(zukai)) return VOICE_TYPES[9];
  // 呼気圧のみ → エンジン全開
  if (h(kiki)) return VOICE_TYPES[0];
  // 頭蓋＋鼻腔 → 天の響き
  if (h(zukai) && h(biku)) return VOICE_TYPES[1];
  // 頭蓋＋口腔 → ホールを満たす
  if (h(zukai) && h(kouku)) return VOICE_TYPES[7];
  // 鼻腔＋口腔 → 太陽みたいな声
  if (h(biku) && h(kouku)) return VOICE_TYPES[3];
  // 鼻腔＋咽頭 → ミステリアス
  if (h(biku) && h(intou)) return VOICE_TYPES[8];
  // 口腔＋咽頭 → 懐の深い
  if (h(kouku) && h(intou)) return VOICE_TYPES[4];
  // 胸部＋口腔 → お日さま
  if (h(kyobu) && h(kouku)) return VOICE_TYPES[10];
  // 咽頭＋胸部 → 大地の声
  if (h(intou) && h(kyobu)) return VOICE_TYPES[2];
  // fallback → 自分探しの旅人
  return VOICE_TYPES[11];
}

export default function VoiceCheck() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState([0, 0, 0, 0, 0, 0]);
  const resultRef = useRef(null);
  const voiceType = showResult ? determineVoiceType(scores) : null;
  const recommendations = showResult ? getRecommendations(scores) : [];

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleSelect = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setShowResult(false);
  };

  const handleSubmit = () => {
    const total = [0, 0, 0, 0, 0, 0];
    QUESTIONS.forEach((q) => {
      const selected = answers[q.id];
      if (selected !== undefined) {
        q.options[selected].scores.forEach((v, i) => {
          total[i] += v;
        });
      }
    });
    // MAX_SCOREにスケーリング（最大理論値：各軸ごとに計算）
    const maxPossible = [0, 0, 0, 0, 0, 0];
    QUESTIONS.forEach((q) => {
      const maxOption = q.options[q.options.length - 1].scores;
      maxOption.forEach((v, i) => { maxPossible[i] += v; });
    });
    const scaled = total.map((v, i) =>
      maxPossible[i] > 0 ? Math.round((v / maxPossible[i]) * MAX_SCORE * 10) / 10 : 0
    );
    setScores(scaled);
    setShowResult(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    setScores([0, 0, 0, 0, 0, 0]);
  };

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  const chartData = {
    labels: AXES,
    datasets: [
      {
        label: 'あなたの発声状態',
        data: scores,
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: 'rgba(99, 179, 237, 0.9)',
        borderWidth: 2.5,
        pointBackgroundColor: 'rgba(99, 179, 237, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: MAX_SCORE,
        ticks: {
          stepSize: 2,
          color: 'rgba(148, 163, 184, 0.8)',
          backdropColor: 'transparent',
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.12)',
        },
        pointLabels: {
          color: '#e2e8f0',
          font: { size: 13, weight: '600', family: "'Noto Sans JP', sans-serif" },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#93c5fd',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} / ${MAX_SCORE}`,
        },
      },
    },
    animation: {
      duration: 900,
      easing: 'easeInOutQuart',
    },
  };

  const comments = showResult ? generateComment(scores) : [];

  return (
    <div className="page-content fade-in">
      <h2>発声状態チェック</h2>
      <p className="vc-intro">
        設問に答えると、あなたの現在の発声バランスを<br className="sp-only" />
        レーダーチャートで可視化します。<br />
        人の身体によって最適なバランスがあり、<br className="sp-only" />
        レーダーチャートは歪になります。<br />
        最大評価の場合は過剰の危険性があります。<br />
        自分にとって最適なバランスはどこかを<br className="sp-only" />
        探す目安にお使いください。<br />
        全 {QUESTIONS.length} 問・5段階評価
      </p>

      {/* 進捗バー */}
      <div className="vc-progress-wrap">
        <div className="vc-progress-bar" style={{ width: `${progress}%` }} />
        <span className="vc-progress-label">
          {Object.keys(answers).length} / {QUESTIONS.length} 問回答済み
        </span>
      </div>

      {/* 設問リスト */}
      <div className="vc-questions">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className={`vc-question-card ${answers[q.id] !== undefined ? 'answered' : ''}`}>
            <div className="vc-q-header">
              <span className="vc-q-num">Q{qi + 1}</span>
              <p className="vc-q-text">{q.text}</p>
            </div>
            <p className="vc-q-help">{q.help}</p>
            <div className="vc-options">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  className={`vc-option-btn ${answers[q.id] === oi ? 'selected' : ''}`}
                  onClick={() => handleSelect(q.id, oi)}
                >
                  <span className="vc-option-dot" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 送信ボタン */}
      <div className="vc-submit-wrap">
        {!allAnswered && (
          <p className="vc-submit-hint">
            ※ すべての設問に回答するとチャートが表示されます（残り {QUESTIONS.length - Object.keys(answers).length} 問）
          </p>
        )}
        <button
          className="vc-submit-btn"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          🎙️ 発声状態を診断する
        </button>
        {showResult && (
          <button className="vc-reset-btn" onClick={handleReset}>
            もう一度やり直す
          </button>
        )}
      </div>

      {/* 結果エリア */}
      {showResult && (
        <div className="vc-result fade-in" ref={resultRef}>

          {/* タイプ診断カード */}
          {voiceType && (
            <div className="vc-type-card">
              <p className="vc-type-label">あなたの声タイプは…</p>
              <div className="vc-type-icon">{voiceType.icon}</div>
              <h3 className="vc-type-name">「{voiceType.name}」</h3>
              <p className="vc-type-desc">{voiceType.desc}</p>
              <button
                className="vc-share-btn"
                onClick={() => {
                  const siteUrl = window.location.origin;
                  const text = `🎙️ 発声タイプ診断やってみた！\n\n私のタイプは…\n${voiceType.icon}「${voiceType.name}」\n\n${voiceType.desc}\n\nあなたはどのタイプ？\n▶ ${siteUrl}\n\n#発声診断 #ボイストレーニング`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                𝕏 このタイプをポストする
              </button>
            </div>
          )}

          <h3 className="vc-result-title">あなたの発声バランス</h3>

          <div className="vc-chart-wrap">
            <Radar data={chartData} options={chartOptions} />
          </div>

          {/* スコア一覧 */}
          <div className="vc-score-list">
            {AXES.map((axis, i) => (
              <div key={axis} className="vc-score-item">
                <span className="vc-score-axis">{axis}</span>
                <div className="vc-score-bar-wrap">
                  <div
                    className="vc-score-bar-fill"
                    style={{ width: `${(scores[i] / MAX_SCORE) * 100}%` }}
                  />
                </div>
                <span className="vc-score-val">{scores[i].toFixed(1)} / {MAX_SCORE}</span>
              </div>
            ))}
          </div>

          {/* コメント */}
          <div className="vc-comments">
            <h4 className="vc-comments-title">✦ なぎぃからのアドバイス</h4>
            <ul>
              {comments.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <div className="vc-cta">
              <p>より詳しく改善したい方は、レッスンでお話しませんか？</p>
              <span className="vc-cta-note">↓ サイドメニューの「メールフォーム」からお気軽にどうぞ</span>
            </div>
          </div>

          {/* note レコメンドセクション */}
          {recommendations.length > 0 && (
            <div className="vc-recommend">
              <h4 className="vc-recommend-title">📖 あなたに最適なメソッド（note）</h4>
              <p className="vc-recommend-sub">現在のバランスから、特に伸ばしがいのある項目をピックアップしました。</p>
              <div className="vc-note-list">
                {recommendations.map((note) => (
                  <div key={note.noteId} className="vc-note-card">
                    <iframe
                      src={`https://note.com/embed/notes/${note.noteId}`}
                      title={`${note.name}の解説記事`}
                      style={{ border: 0, display: 'block', maxWidth: '100%', width: '100%', height: '400px', borderRadius: '12px', background: '#fff' }}
                      scrolling="no"
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
