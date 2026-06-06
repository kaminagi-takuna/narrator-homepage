import React from 'react';
import Schedule from './Schedule.jsx';
import './App.css';

const LessonApp = () => {
  return (
    <div className="layout-container" style={{ display: 'block', height: 'auto', overflow: 'visible' }}>
      <main className="content-area" style={{ height: 'auto', minHeight: '100vh', paddingBottom: '5rem' }}>
        <div className="page-content fade-in" style={{ padding: '2rem 1.2rem' }}>
          
          {/* 1. 料金表セクション */}
          <section className="section-block">
            <h2 style={{ fontSize: '2rem' }}>レッスン内容・料金表</h2>
            <div className="info-banner" style={{ marginTop: '1rem' }}>
              <p style={{ lineHeight: '1.8' }}>
                オンラインレッスンは<br className="sp-only"/>通話アプリDiscordを使用します<br/>
                <strong style={{ color: 'var(--accent)' }}>レッスン実施時間</strong>:<br className="sp-only" /> 14:00～18:00 / 22:00～02:00<br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>※在宅介護のため上記の時間とさせていただいております。</span>
              </p>
            </div>

            <div className="pricing-cards">
              <div className="price-card">
                <h3>昼間</h3>
                <p className="desc">14:00〜18:00。介護の合間を縫って集中指導いたします。</p>
                <ul>
                  <li><span>60分</span><span>10,000円</span></li>
                  <li><span>120分</span><span>15,000円</span></li>
                  <li><span>180分</span><span>20,000円</span></li>
                </ul>
              </div>

              <div className="price-card popular">
                <h3>夜間</h3>
                <p className="desc">22:00〜02:00。一番人気の基本コース。じっくり向き合います。</p>
                <ul>
                  <li><span>60分</span><span>5,000円</span></li>
                  <li><span>120分</span><span>8,000円</span></li>
                  <li><span>180分</span><span>10,000円</span></li>
                </ul>
              </div>

              <div className="price-card pro">
                <h3>プロコース</h3>
                <p className="desc">プロ現場で通用する情報を実践して持ち帰るブーストコースです。</p>
                <ul>
                  <li><span>60分</span><span>15,000円</span></li>
                  <li><span>120分</span><span>24,000円</span></li>
                  <li><span>180分</span><span>32,000円</span></li>
                </ul>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ※お支払いは銀行振り込み（後払い）となります。
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4rem 0' }} />

          {/* 2. カレンダーセクション */}
          <section className="section-block">
            <h2 style={{ fontSize: '2rem' }}>空き状況の確認</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>以下のカレンダーで「空き」となっている日時をご確認ください。</p>
            <Schedule />
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4rem 0' }} />

          {/* 3. メールフォームセクション */}
          <section className="section-block">
            <h2 style={{ fontSize: '2rem' }}>お申し込み・お問い合わせ</h2>
            <div className="content-card" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--accent)' }}>ご記入のお願い:</strong><br/>
                フォーム内のフリースペースに<br className="sp-only"/>「希望日時」と「レッスン内容（ボイトレ等）」、<br className="sp-only"/>そして「Discordアカウント」をご記入ください。
              </p>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: '12px' }}>
              <iframe
                id="JotFormIFrame-253502863799066"
                title="お問い合わせフォーム"
                onLoad={() => window.parent.scrollTo(0, 0)}
                allowtransparency="true"
                allowFullScreen={true}
                allow="geolocation; microphone; camera"
                src="https://form.jotform.com/253502863799066"
                frameBorder="0"
                style={{ minWidth: '100%', maxWidth: '100%', height: '800px', border: 'none', overflowY: 'auto' }}
                scrolling="yes"
              ></iframe>
            </div>
          </section>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>← ホームページに戻る</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonApp;
