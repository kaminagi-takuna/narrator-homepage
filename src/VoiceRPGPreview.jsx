import React, { useState, useEffect } from 'react';
import './VoiceRPGPreview.css';
import questionData from './data/questions.json';

const VoiceRPGPreview = () => {
  const [hp, setHp] = useState(100);
  const [gameState, setGameState] = useState('opening');
  const [beginnerCorrectCount, setBeginnerCorrectCount] = useState(0);
  const [bossHp, setBossHp] = useState(4);
  const [usedIndices, setUsedIndices] = useState({ beginner: [], boss: [] });
  const [currentMonsterImg, setCurrentMonsterImg] = useState('/images/rpg/monster_slime_v2.png');
  const [monsterClass, setMonsterClass] = useState('monster-floating');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSlashing, setIsSlashing] = useState(false);
  const [isDistorting, setIsDistorting] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [isTextDamaged, setIsTextDamaged] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const playSound = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      if (type === 'click') {
        oscillator.frequency.setValueAtTime(880, now); oscillator.start(); oscillator.stop(now + 0.1);
      } else if (type === 'slash') {
        oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(880, now + 0.2); oscillator.start(); oscillator.stop(now + 0.2);
      } else if (type === 'impact') {
        oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(120, now + 0.5); oscillator.start(); oscillator.stop(now + 0.5);
      }
    } catch (e) {}
  };

  const typeMessage = (text) => {
    if (!text) return;
    setIsTyping(true); let currentText = ""; let i = 0; setMessage("");
    const timer = setInterval(() => {
      if (i < text.length) { currentText += text.charAt(i); setMessage(currentText); i++; }
      else { clearInterval(timer); setIsTyping(false); }
    }, 25);
  };

  const startGame = () => {
    playSound('click'); setHp(100); setBeginnerCorrectCount(0); setBossHp(4);
    setCurrentMonsterImg('/images/rpg/monster_slime_v2.png'); setMonsterClass('monster-floating');
    setUsedIndices({ beginner: [], boss: [] }); setGameState('battle'); nextQuestion(true, 0, 4, { beginner: [], boss: [] });
  };

  const nextQuestion = (isFirst = false, overrideCount, overrideBossHp, overrideUsed) => {
    setFeedback(null); setMonsterClass('monster-floating'); setIsSlashing(false); setSparks([]);
    const count = overrideCount !== undefined ? overrideCount : beginnerCorrectCount;
    const bHp = overrideBossHp !== undefined ? overrideBossHp : bossHp;
    const used = overrideUsed !== undefined ? overrideUsed : usedIndices;
    if (count < 8) {
      const pool = questionData.beginner;
      const available = pool.map((_, i) => i).filter(i => !used.beginner.includes(i));
      const index = (available.length > 0) ? available[Math.floor(Math.random() * available.length)] : 0;
      const q = pool[index];
      setCurrentQuestion({ ...q, options: generateOptions(q), index });
      typeMessage(`${isFirst ? "ボイス・トレーニング・クエスト開始！ " : ""}${q.question}`);
    } else if (gameState !== 'bossBattle' && gameState !== 'victory' && gameState !== 'bossTransition') {
      setGameState('bossTransition'); typeMessage("喉の支配者が現れた...！");
    } else if (bHp > 0) {
      const pool = questionData.boss;
      const available = pool.map((_, i) => i).filter(i => !used.boss.includes(i));
      const index = (available.length > 0) ? available[Math.floor(Math.random() * available.length)] : 0;
      const q = pool[index];
      setCurrentQuestion({ ...q, options: generateOptions(q), index });
      typeMessage(bHp === 1 ? `【!! 弱点露呈 !!】 ${q.question}` : q.question);
    }
  };

  const generateOptions = (q) => {
    const pool = ["ビブラート", "閉鎖", "共鳴腔", "軟口蓋", "腹式呼吸", "地声", "裏声", "滑舌", "呼気圧", "倍音"];
    let options = [q.answer];
    while (options.length < 4) {
      const r = pool[Math.floor(Math.random() * pool.length)]; if (!options.includes(r)) options.push(r);
    }
    return options.sort(() => 0.5 - Math.random());
  };

  const createSparks = () => {
    const newSparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i, tx: (Math.random() - 0.5) * 400 + "px", ty: (Math.random() - 0.5) * 300 + "px"
    }));
    setSparks(newSparks);
  };

  const handleAnswer = (selected) => {
    if (isTyping || feedback || monsterClass.includes('sink')) return;
    playSound('click');
    const isCorrect = selected === currentQuestion.answer;
    if (isCorrect) {
      setIsDistorting(true); setMonsterClass('monster-hit'); setIsSlashing(true); createSparks(); playSound('slash');
      setTimeout(() => {
        setIsDistorting(false); setMonsterClass('monster-floating');
        setFeedback({ isCorrect, explanation: currentQuestion.explanation });
        if (gameState === 'bossBattle') {
          const nextBossHp = bossHp - 1;
          setBossHp(nextBossHp);
          setUsedIndices(prev => ({ ...prev, boss: [...prev.boss, currentQuestion.index] }));
          if (nextBossHp <= 0) {
            setMonsterClass('monster-sink-fade');
            setTimeout(() => { setGameState('victory'); typeMessage("MISSION COMPLETE!"); }, 1500);
          } else { typeMessage("正解！魔王に痛恨の一撃！"); }
        } else {
          setBeginnerCorrectCount(prev => prev + 1);
          setUsedIndices(prev => ({ ...prev, beginner: [...prev.beginner, currentQuestion.index] }));
          typeMessage("正解！喉の力がみなぎってくる！");
        }
      }, 150);
    } else {
      playSound('impact'); setMonsterClass('monster-attack-motion'); setIsShaking(true); setIsFlashing(true); setIsTextDamaged(true); setHp(prev => Math.max(0, prev - 25));
      setTimeout(() => { setIsShaking(false); setIsFlashing(false); setIsTextDamaged(false); setMonsterClass('monster-floating'); }, 1000);
      setFeedback({ isCorrect, explanation: currentQuestion.explanation });
      if (gameState === 'bossBattle') {
        setBossHp(prev => Math.min(4, prev + 1)); typeMessage("不正解！ボスの弱点が隠れた！");
      } else { typeMessage("不正解！喉にダメージ！"); }
    }
  };

  const startBossBattle = () => {
    playSound('click'); setMonsterClass('monster-sink-fade');
    setTimeout(() => {
      setCurrentMonsterImg('/images/rpg/monster_boss.png'); setMonsterClass('monster-fade-in');
      setTimeout(() => { setGameState('bossBattle'); setBossHp(4); nextQuestion(false, 8, 4); }, 2000);
    }, 1500);
  };

  return (
    <div className="rpg-test-container">
      <div className={`rpg-screen-frame ${isShaking ? 'screen-shake' : ''} ${isFlashing ? 'flash-red' : ''} ${isDistorting ? 'screen-distort' : ''}`} 
           style={{ backgroundImage: `url('/images/rpg/bg_training.png')`, filter: gameState.includes('boss') ? 'hue-rotate(180deg) brightness(0.6)' : 'none' }}>
        
        {/* ステータスパネル */}
        <div className="rpg-status-panel">
          <div className="status-row">
            <div className="status-label"><span>Vocal HP</span><span>{hp}%</span></div>
            <div className="gauge-bg"><div className="gauge-fill hp" style={{ width: `${hp}%` }}></div></div>
          </div>
          {gameState === 'battle' && (
            <div className="status-row">
              <div className="status-label"><span>Discovery</span></div>
              <div className="gauge-bg"><div className="gauge-fill mp" style={{ width: `${(beginnerCorrectCount / 8) * 100}%` }}></div></div>
            </div>
          )}
        </div>

        {/* モンスターエリア（内部にボスHPバーを統合） */}
        <div className="rpg-monster-area">
          <div className="monster-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* ボスHPバー（モンスターの上部に配置） */}
            {gameState === 'bossBattle' && (
              <div className="boss-hp-container" style={{ width: '280px', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '0.9rem', textShadow: '0 0 10px #000', marginBottom: '4px' }}>BOSS HP</div>
                <div className="gauge-bg" style={{ height: '10px', border: '1px solid #ff4d4d' }}><div className="gauge-fill" style={{ width: `${(bossHp / 4) * 100}%`, backgroundColor: '#ff4d4d' }}></div></div>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <img src={currentMonsterImg} alt="Monster" className={`monster-sprite ${monsterClass}`} 
                   style={{ mixBlendMode: 'lighten', transform: (gameState === 'bossBattle' && !monsterClass.includes('fade-in')) ? 'scale(1.2)' : 'none' }} />
              {isSlashing && <div className="slash-effect" style={{ position: 'absolute', width: '100vw', height: '100vh', left: '-50vw', top: '-50vh' }}></div>}
              {sparks.map(s => ( <div key={s.id} className="spark" style={{ '--tx': s.tx, '--ty': s.ty, position: 'absolute', top: '50%', left: '50%' }}></div> ))}
            </div>
          </div>
        </div>

        <div className="rpg-message-area">
          <div style={{ minHeight: '60px' }}><p className={`message-text ${isTextDamaged ? 'text-damage-shake' : ''}`}>{message}</p></div>
          <div className="rpg-choices-grid">
            {gameState === 'opening' && <button className="rpg-choice-btn" onClick={startGame}>クエストを開始する</button>}
            {(gameState === 'battle' || gameState === 'bossBattle') && currentQuestion && !feedback && !monsterClass.includes('fade') && (
              currentQuestion.options.map((opt, i) => (
                <button key={i} className="rpg-choice-btn" onClick={() => handleAnswer(opt)}><span className="choice-index">{String.fromCharCode(65 + i)}</span>{opt}</button>
              ))
            )}
            {feedback && !monsterClass.includes('sink') && (
              <div style={{ width: '100%', animation: 'fadeIn 0.3s ease-out' }}>
                <p style={{ color: feedback.isCorrect ? '#4dff88' : '#ff4d4d', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 5px 0' }}>{feedback.isCorrect ? '【SUCCESS】' : '【FAILURE】'} {currentQuestion.answer}</p>
                <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>{feedback.explanation}</p>
                <button className="rpg-choice-btn" style={{ marginTop: '10px' }} onClick={() => nextQuestion()}>次の戦いへ ➔</button>
              </div>
            )}
            {gameState === 'bossTransition' && !monsterClass.includes('fade') && <button className="rpg-choice-btn" onClick={startBossBattle}>魔王を呼び出す!!</button>}
            {(gameState === 'victory' || gameState === 'gameover') && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '2.4rem', color: gameState === 'victory' ? 'gold' : 'red' }}>{gameState === 'victory' ? 'QUEST CLEAR!' : 'DEFEATED...'}</h3>
                <button className="rpg-choice-btn" onClick={() => { setGameState('opening'); }}>タイトルへ戻る</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRPGPreview;
