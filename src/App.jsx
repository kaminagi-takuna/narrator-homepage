import { useState, useEffect } from 'react'
import './App.css'
import Schedule from './Schedule.jsx'


const TweetEmbed = ({ tweetId }) => {
  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
    }
  }, [tweetId]);

  return (
    <div className="tweet-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', width: '100%' }}>
      <blockquote className="twitter-tweet" data-theme="dark" data-width="500">
        <a href={`https://twitter.com/x/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
};

const NoteEmbed = ({ noteId }) => {
  return (
    <div className="note-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', width: '100%' }}>
      <iframe
        className="note-embed"
        src={`https://note.com/embed/notes/${noteId}`}
        style={{ border: 0, display: 'block', maxWidth: '100%', width: '550px', height: '400px', borderRadius: '12px', background: '#fff' }}
        title="Note Embed"
      ></iframe>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'welcome':
        return (
          <div className="page-content fade-in">
            <h2>ようこそ</h2>
            <div className="content-card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
              <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>TOMOYA KATO OFFICIAL WEBSITE</p>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '2rem', letterSpacing: '0.15em', fontWeight: '800' }}>
                ようこそ
              </h3>
              <p style={{ fontSize: '1.2rem', lineHeight: '2.2', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                フリーナレーター、司会、講師でもある<br />
                加藤智也のホームページです<br />
                <br />
                アナウンサーの聞きやすく明瞭な発声と安心感<br />
                声優・ナレーターから授かった表現力<br />
                営業や接客に携わることで身に付けた<br />
                リアルな現場での対応力<br />
                <br />
                これらの経験値と技術全てを使い、声を使うあらゆる現場の力になります<br />
                <br />
                noteやＸなど各リンクはサイドバーへ
              </p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="page-content fade-in">
            <h2>自己紹介</h2>
            
            <div className="section-block">
              <h3 className="section-title">PROFILE</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                ナレーター、司会業、話し方・声優講師、<br className="sp-only" />
                プレゼン資料・司会原稿の推敲
              </p>
              <p style={{ color: 'var(--accent)', marginTop: '0.5rem' }}>
                さまざまな現場で得た経験を活かして、<br className="sp-only" />
                声で表現するあらゆるシーンでお役に立ちます。
              </p>

              <div className="profile-details" style={{ lineHeight: '2' }}>
                岩手県出身、宮城県在住。<br />
                株式会社宮城テレビ放送で11年間アナウンサーとして、<br className="sp-only" />
                ナレーション、天気予報やニュース、情報番組MC・リポーター、<br className="sp-only" />
                スポーツ実況、災害報道などあらゆる分野を担当。<br />
                入社2年目には第31回NNSアナウンス大賞最優秀新人賞受賞。<br />
                その後も新規事業立上げや営業支援部署で経験を積み独立。<br /><br />
                退社後は全国で活躍する声優・ボイストレーナーに<br className="sp-only" />
                師事しながら、ナレーター、司会者、講師として活動。<br />
                講師としては3つのスクールを掛け持ちし、<br className="sp-only" />
                2年間で100人以上の指導に携わる。<br />
                その間にもホテルや結婚相談所で接客のスキルを学び、<br className="sp-only" />
                2026年4月から本格的にフリーでの活動を開始。
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '4rem 0' }}>
              {/* ご自身で public/images/profile.jpg に画像を配置していただくと表示されます */}
              <img src="/images/profile.jpg" alt="加藤智也" style={{ maxWidth: '100%', width: '350px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="page-content fade-in">
            <h2>実績</h2>
            
            <div className="section-block">
              <h3 className="section-title">宮城テレビ放送所属時</h3>
              
              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈受賞歴〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>第31回ＮＮＳアナウンス大賞最優秀新人賞受賞</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈MC〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>情報番組「ちょっとブレイクタイム」MC</li>
                  <li style={{ marginBottom: '0.4rem' }}>24時間テレビ宮城会場MC　など</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈ナレーション〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>震災報道特番、ＮＮＮドキュメント</li>
                  <li style={{ marginBottom: '0.4rem' }}>スポーツバラエティ「ミヤテレスタジアム」</li>
                  <li style={{ marginBottom: '0.4rem' }}>地域密着型バラエティ「ＯＨ！バンデス」「ミヤギnews every.」</li>
                  <li style={{ marginBottom: '0.4rem' }}>「みやぎスマイルプロジェクト　発見！宮城のスマイルさん」</li>
                  <li style={{ marginBottom: '0.4rem' }}>他多数</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈実況〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>全日本大学女子駅伝　2号車・中継所実況</li>
                  <li style={{ marginBottom: '0.4rem' }}>全国高校サッカー選手権　宮城県大会、全国大会実況</li>
                  <li style={{ marginBottom: '0.4rem' }}>プロ野球東北楽天ゴールデンイーグルス　実況・ベンチリポート</li>
                  <li style={{ marginBottom: '0.4rem' }}>他多数</li>
                </ul>
              </div>
            </div>

            <div className="section-block" style={{ marginTop: '3rem' }}>
              <h3 className="section-title">独立後</h3>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈ナレーション〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>味の素「勝ち飯®️応援団プレゼントキャンペーン」全国63局ネットTVCMナレーション</li>
                  <li style={{ marginBottom: '0.4rem' }}>みやぎ生協「みやぎ生協の個人宅配」TVCMナレーション</li>
                  <li style={{ marginBottom: '0.4rem' }}>国見台病院　VPナレーション</li>
                  <li style={{ marginBottom: '0.4rem' }}>山形県「日本一美酒県山形フェア」TV・ラジオCMナレーション</li>
                  <li style={{ marginBottom: '0.4rem' }}>他多数</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈司会〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>トヨタ自動車東日本レガロッソ宮城　スタジアムMC</li>
                  <li style={{ marginBottom: '0.4rem' }}>「日本ハンドボール選手権大会」男子の部・女子の部総合司会</li>
                  <li style={{ marginBottom: '0.4rem' }}>ヴォスクオーレ仙台シーズン報告会</li>
                  <li style={{ marginBottom: '0.4rem' }}>他イベント、結婚式など多数</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈実況〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>WEリーグカップ</li>
                </ul>
              </div>

              <div className="content-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>〈講師業〉</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>いしのまきMANGA lab.ヒトコマ　話し方教室講師</li>
                  <li style={{ marginBottom: '0.4rem' }}>公益社団法人3.11メモリアルネットワーク　語り部・ガイド向け話し方講師</li>
                  <li style={{ marginBottom: '0.4rem' }}>NAYUTAS仙台駅前校　話し方・声優コース講師</li>
                  <li style={{ marginBottom: '0.4rem' }}>Music School ＆ Studio Ammy 話し方コース講師</li>
                  <li style={{ marginBottom: '0.4rem' }}>シアーミュージック　話し方・声優コース講師（2025年8月まで）</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'lessons':
        return (
          <div className="page-content fade-in">
            <h2>レッスン内容及び金額表</h2>
            <div className="info-banner">
              <p style={{ lineHeight: '1.8' }}>
                オンラインレッスンはZoomを使用します。<br/>
                <strong style={{ color: 'var(--accent)' }}>レッスン実施時間</strong>: 9:30～17:00 / 19:00～22:00<br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  ※夜はレッスンがある時のみ稼働。お返事は朝から夕方まで。レッスンや仕事のない時間にお返事いたします。数日かかることもございますことをご留意ください。<br/>
                  ※上記以上の時間や、時間外を希望の場合は応相談となります。<br/>
                  ※お支払いは、初回は銀行振り込み（先払い）のみの対応となります。2回目以降は応相談いたします。<br/>
                  ※入会金や休会費用、月の回数指定はございません。<br/>
                  ※繁忙期やキャンペーンによって金額は変更になる場合があります。
                </span>
              </p>
            </div>

            <div className="pricing-cards">
              <div className="price-card">
                <h3>オンライン</h3>
                <p className="desc" style={{ minHeight: '4.5rem' }}>宮城県外の方は基本的に<br className="sp-only" />オンラインレッスンプランをご利用いただきます。</p>
                <ul>
                  <li><span>30分</span><span>3,500円</span></li>
                  <li><span>60分</span><span>6,000円</span></li>
                  <li><span>120分</span><span>10,000円</span></li>
                </ul>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                  ※いずれも＋2,500円で30分延長可
                </p>
              </div>

              <div className="price-card popular">
                <h3>対面</h3>
                <div className="desc" style={{ fontSize: '0.85rem', textAlign: 'left', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>宮城県内の方を中心にご利用いただけるプランです。</p>
                  <p style={{ marginBottom: '0.8rem' }}>仙台市外でのレッスンの場合、別途交通費がかかることがありますので応相談となります。</p>
                  <p style={{ marginBottom: '0.8rem', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}>
                    レッスン実施場所は生徒様のご希望に合わせた形となりますので、最初のレッスン前にメールで場所の擦り合わせをさせてください。その後スタジオやカラオケなどご予約いただきまして、講師が実施場所に訪問させていただきレッスンを行う流れとなります。
                    生徒様の場所代は生徒様負担となりますのでご了承ください。
                  </p>
                </div>
                <ul>
                  <li><span>30分</span><span>4,000円</span></li>
                  <li><span>60分</span><span>6,500円</span></li>
                  <li><span>120分</span><span>11,000円</span></li>
                </ul>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                  ※いずれも＋2,500円で30分延長可
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                  ※対面授業には講師の交通費が含まれています
                </p>
              </div>

              <div className="price-card pro" style={{ borderColor: 'var(--accent)' }}>
                <h3 style={{ borderColor: 'var(--accent)' }}>回数券</h3>
                <p className="desc" style={{ minHeight: '4.5rem' }}>継続してレッスンを受けたい方に向けた<br className="sp-only" />お得なセットプランです。</p>
                <ul>
                  <li style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', padding: '0.8rem 0' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem' }}>オンライン 60分×11回</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(30分延長×3回まで可)</span>
                      <span style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>60,000円</span>
                    </div>
                  </li>
                  <li style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', padding: '0.8rem 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem' }}>オフライン 60分×11回</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(30分延長×3回まで可)</span>
                      <span style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>65,000円</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
              <button 
                onClick={() => handleTabChange('canva')}
                className="cta-button"
              >
                📝 レッスン・ご依頼の詳細はこちら
              </button>
            </div>
          </div>
        );
      case 'twitter':
        return (
          <div className="page-content fade-in">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: 'none' }}>
              <span style={{ fontSize: '2.5rem' }}>𝕏</span> 
              <span>最新の発信</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              声優・ナレーターとしての活動や、<br className="sp-only" />独自のメソッドを発信しています。
            </p>
            <div className="sns-feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <TweetEmbed tweetId="2041389006500634862" />
              <TweetEmbed tweetId="2040987860225179792" />
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="https://x.com/Voice_Tac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>X (Twitter) アカウントへ ↗</a>
            </p>
          </div>
        );
      case 'note':
        return (
          <div className="page-content fade-in">
            <h2 style={{ borderBottom: 'none' }}>note 執筆記事</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              ロジカルな発声理論から現場スキルまで、<br className="sp-only" />声にまつわるより深い考察。
            </p>
            <div className="sns-feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <NoteEmbed noteId="ndfa02e7a1680" />
              <NoteEmbed noteId="n64186d974d46" />
              <NoteEmbed noteId="nbb4d09d775ff" />
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="https://note.com/voice_tn_nagi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>noteマガジンへ ↗</a>
            </p>
          </div>
        );
      case 'canva':
        return (
          <div className="page-content fade-in">
            <h2>依頼詳細</h2>
            
            <div style={{ textAlign: 'center', margin: '2rem 0 3rem 0' }}>
              <img 
                src="/images/katoup.png" 
                alt="レッスンイメージ" 
                style={{ 
                  maxWidth: '100%', 
                  width: '600px', 
                  borderRadius: '16px', 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)', 
                  border: '2px solid rgba(255,255,255,0.1)' 
                }} 
              />
            </div>

            <div className="content-card" style={{ padding: '3rem 2.5rem', marginBottom: '2rem' }}>
              <h3 style={{ 
                color: 'var(--accent)', 
                fontSize: '1.8rem', 
                marginBottom: '2rem', 
                letterSpacing: '0.1em', 
                fontWeight: '800',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.8rem'
              }}>
                レッスン
              </h3>
              <ul className="lesson-list" style={{ 
                listStyleType: 'none', 
                padding: 0, 
                margin: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.2rem' 
              }}>
                {[
                  '発声の基礎',
                  '芝居の基礎',
                  '朗読、ナレーション',
                  'スピーチ、面接練習',
                  'フリートーク',
                  'プレゼンや司会原稿の推敲'
                ].map((item, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontSize: '1.2rem', 
                    lineHeight: '1.8', 
                    color: 'var(--text-primary)',
                    padding: '0.8rem 1.2rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--accent)',
                    transition: 'all 0.2s ease'
                  }}>
                    <span style={{ color: 'var(--accent)', marginRight: '0.8rem', fontWeight: 'bold' }}>✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="page-content fade-in">
            <h2>お問い合わせ</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)', textAlign: 'center'}}>
              レッスンのお申し込みや、<br className="sp-only" />各種お問い合わせは<br className="sp-only" />こちらからお願いいたします。
            </p>

            <div className="content-card" style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                入力フォーム途中にある<br className="sp-only" />フリースペースに、<br className="sp-only" />以下の内容をご記入ください。
              </h4>
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>・ボイトレ含むレッスンの場合</strong><br/>
                  希望内容と<br className="sp-only" />ご希望の日時、単発、複数回など<br className="sp-only" />ご記入ください。<br className="sp-only" />上記項目でご記入いただいた<br className="sp-only" />Discordアカウントをこちらで登録し、<br className="sp-only" />ご連絡いたします。
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>・原稿依頼の場合</strong><br/>
                  必要な原稿の分数、本数、ご予算など<br className="sp-only" />をご記入ください。<br/>
                  上記項目でご記入いただいた<br className="sp-only" />Discordアカウントを登録しご連絡、<br className="sp-only" />もしくはメールアドレスにて<br className="sp-only" />ご連絡いたします。
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)', marginRight: '1em' }}>個人のご依頼</strong>お名前、使用目的、ご予算、<br className="sp-only" />あれば原稿内容
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)', marginRight: '1em' }}>法人のご依頼</strong>会社名、案件内容、競合の有無、<br className="sp-only" />可能であればご予算
                </li>
                <li style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  上記項目でご記入いただいた<br className="sp-only" />Discordアカウントを登録しご連絡、<br/>
                  もしくはメールアドレスにて<br className="sp-only" />ご連絡いたします。
                </li>
              </ul>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(30, 41, 59, 0.4)', padding: '4rem 2rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>✉ メールフォーム作成中</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', lineHeight: '1.6' }}>
                現在、新しいお問い合わせ用のフォームを準備しております。<br />
                準備が整い次第、こちらにフォームが挿入されますので、しばらくお待ちください。
              </p>
            </div>
          </div>
        );
      case 'schedule':
        return <Schedule />;
      default:
        return <div>選択してください。</div>;
    }
  }

  useEffect(() => {
    if (activeTab === 'twitter') {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeTab]);

  return (
    <div className="layout-container">
      {/* Mobile Top Header (Visible only on mobile via CSS) */}
      <div className="mobile-header sp-only-flex">
        <div className="mobile-logo" style={{ textAlign: 'left', lineHeight: '1.2' }}>
          <span style={{ color: 'var(--accent)' }}>T</span>OMOY
          <span 
            onClick={() => {
              const pw = prompt('合言葉を入力してください');
              if(pw === '欄干橋') {
                window.open('/RankanScheduleMaker/index.html', '_blank');
              } else if (pw) {
                alert('合言葉が違います。');
              }
            }} 
            style={{ cursor: 'pointer' }}
          >A</span><br />
          <span style={{ color: 'var(--accent)' }}>K</span>ATO<br />
          <span style={{ color: 'var(--accent)' }}>O</span>FFICIAL<br />
          <span style={{ color: 'var(--accent)', opacity: 0.8, fontSize: '0.8rem' }}>WEBSITE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '5px' }}>
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>MENU</span>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay sp-only-block" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <nav className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <h1 className="logo desktop-logo" style={{ fontFamily: 'var(--font-en)', fontSize: '1.6rem', lineHeight: '1.1', textAlign: 'left', fontWeight: '800', marginLeft: '1.2rem' }}>
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>T</span>OMOY
          <span 
            onClick={() => {
              const pw = prompt('合言葉を入力してください');
              if(pw === '欄干橋') {
                window.open('/RankanScheduleMaker/index.html', '_blank');
              } else if (pw) {
                alert('合言葉が違います。');
              }
            }} 
            style={{ cursor: 'pointer' }}
          >A</span><br />
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>K</span>ATO<br />
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>O</span>FFICIAL<br />
          <span style={{ fontSize: '1.2rem', opacity: 0.6, letterSpacing: '0.1em' }}>WEBSITE</span>
        </h1>
        <ul className="nav-menu">
          <li className={activeTab === 'welcome' ? 'active' : ''} onClick={() => handleTabChange('welcome')}>ようこそ</li>
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => handleTabChange('profile')}>自己紹介</li>
          <li className={activeTab === 'achievements' ? 'active' : ''} onClick={() => handleTabChange('achievements')}>実績</li>
          <li className={activeTab === 'lessons' ? 'active' : ''} onClick={() => handleTabChange('lessons')}>レッスン内容及び金額表</li>
          <li className={activeTab === 'canva' ? 'active' : ''} onClick={() => handleTabChange('canva')}>
            <span>依頼詳細</span>
          </li>
          <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => handleTabChange('schedule')}>スケジュール</li>
          <li style={{ cursor: 'default', opacity: 0.5 }}>
            <span style={{ fontFamily: 'var(--font-en)' }}>Twitter</span>
          </li>
          <li style={{ cursor: 'default', opacity: 0.5 }}>
            <span style={{ fontFamily: 'var(--font-en)' }}>note</span>
          </li>
          <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => handleTabChange('contact')}>メールフォーム [作成中]</li>
        </ul>
      </nav>
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
