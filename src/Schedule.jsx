import React, { useState, useEffect } from 'react';
import './NarratorSchedule.css';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // 編集中の予定管理用ステート
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempSchedules, setTempSchedules] = useState([]);
  const [newScheduleInput, setNewScheduleInput] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // --- 設定：GoogleスプレッドシートのGAS URLとパスワード ---
  const API_URL = 'https://script.google.com/macros/s/AKfycbwa6PPuqk4ZR58uc7Twy9xr2Ul2dNDl1d6gOLiiifyzWA0xCyrrASFLSfJhxmLSvL8L/exec';
  const MASTER_PASSWORD = '加藤智也';
  // ------------------------------------------------

  // データ読み込み用 (JSON形式でフェッチ)
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
      const data = await response.json(); // { "2026-06-05": ["予定1", "予定2"], ... }
      setScheduleData(data || {});
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // 日付セルがクリックされた時の処理 (Admin用モーダルを開く)
  const handleCellClick = (dateStr) => {
    if (!isAdmin) return;
    setSelectedDate(dateStr);
    setTempSchedules(scheduleData[dateStr] || []);
    setNewScheduleInput('');
    setShowEditModal(true);
  };

  // モーダル内で予定を追加
  const handleAddSchedule = () => {
    if (!newScheduleInput.trim()) return;
    setTempSchedules(prev => [...prev, newScheduleInput.trim()]);
    setNewScheduleInput('');
  };

  // モーダル内で予定を削除
  const handleRemoveSchedule = (index) => {
    setTempSchedules(prev => prev.filter((_, i) => i !== index));
  };

  // モーダルでの編集内容をローカルに反映
  const handleSaveModal = () => {
    setScheduleData(prev => ({
      ...prev,
      [selectedDate]: tempSchedules
    }));
    setShowEditModal(false);
  };

  // 全データをGAS経由でスプレッドシートに保存する
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: adminPassword,
          data: scheduleData
        })
      });
      alert('保存リクエストを送信しました。\n(スプレッドシートへの反映まで数秒〜数十秒かかる場合があります)');
      fetchSchedule();
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  // 管理者ログイン/ログアウト
  const handleAdminAuth = () => {
    if (isAdmin) {
      if (window.confirm('ログアウトしますか？')) {
        setIsAdmin(false);
        setAdminPassword('');
      }
      return;
    }
    setShowLoginModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === MASTER_PASSWORD) {
      setAdminPassword(passwordInput);
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      alert('編集モードに切り替わりました。\nカレンダーのセルをクリックして予定を編集できます。');
    } else {
      alert('パスワードが違います。');
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDisplay = month + 1;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const schedules = scheduleData[dateStr] || [];
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      cells.push(
        <div 
          key={d} 
          className={`calendar-cell ${isToday ? 'today' : ''} ${isAdmin ? 'admin-editable' : ''}`}
          onClick={() => handleCellClick(dateStr)}
        >
          <span className="date-num">{d}</span>
          <div className="schedules-list-container">
            {schedules.map((sch, index) => {
              const isOff = sch.includes('休み') || sch.includes('休業') || sch.includes('オフ');
              return (
                <div 
                  key={index} 
                  className={`schedule-badge ${isOff ? 'off-badge' : 'active-badge'}`}
                  title={sch}
                >
                  {sch}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={`schedule-container fade-in ${isAdmin ? 'admin-mode' : ''}`}>
      {/* 管理者ログインモーダル */}
      {showLoginModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>管理者ログイン</h3>
            <form onSubmit={handleModalSubmit}>
              <input 
                type="password" 
                placeholder="パスワードを入力"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button type="submit" className="login-submit">ログイン</button>
                <button type="button" className="login-cancel" onClick={() => setShowLoginModal(false)}>キャンセル</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 予定編集モーダル (Admin用) */}
      {showEditModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content edit-modal">
            <h3>{selectedDate} の予定編集</h3>
            
            <div className="current-schedules-list">
              {tempSchedules.length === 0 ? (
                <p className="no-schedules-text">予定はありません</p>
              ) : (
                tempSchedules.map((sch, idx) => (
                  <div key={idx} className="edit-schedule-row">
                    <span>{sch}</span>
                    <button type="button" className="remove-sch-btn" onClick={() => handleRemoveSchedule(idx)}>削除</button>
                  </div>
                ))
              )}
            </div>

            <div className="add-schedule-form">
              <input 
                type="text" 
                placeholder="例: 10:00～13:30レッスン" 
                value={newScheduleInput}
                onChange={(e) => setNewScheduleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSchedule()}
              />
              <button type="button" className="add-sch-btn" onClick={handleAddSchedule}>追加</button>
            </div>

            <div className="modal-buttons" style={{ marginTop: '2rem' }}>
              <button type="button" className="login-submit" onClick={handleSaveModal}>編集を確定</button>
              <button type="button" className="login-cancel" onClick={() => setShowEditModal(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>スケジュール</h2>
        {isAdmin && (
          <button 
            className="save-button" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '変更を保存する'}
          </button>
        )}
      </div>
      
      <div className="schedule-intro">
        ご予約状況およびレッスンの予定です。詳細・正式な空き時間はメールフォームよりお気軽にお問い合わせください。
        {isAdmin && <div className="admin-badge">【編集モード】日付をクリックして予定を編集できます。変更後は右上の「変更を保存する」を押してください。</div>}
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <button onClick={prevMonth} className="month-nav">◀</button>
          <h3 className="current-month" style={{ userSelect: 'none' }}>
            {year}年 {monthDisplay}月
          </h3>
          <button onClick={nextMonth} className="month-nav">▶</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--accent)' }}>読み込み中...</div>
        ) : (
          <div className="calendar-grid">
            <div className="weekday">日</div>
            <div className="weekday">月</div>
            <div className="weekday">火</div>
            <div className="weekday">水</div>
            <div className="weekday">木</div>
            <div className="weekday">金</div>
            <div className="weekday">土</div>
            {renderCells()}
          </div>
        )}
      </div>

      <div className="schedule-footer">
        <p>※リアルタイム更新ではありません。正式な空き状況はメールフォームよりお問い合わせください。</p>
        <button 
          className="admin-login-link" 
          onClick={handleAdminAuth}
          style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.5 }}
        >
          {isAdmin ? '管理者ログアウト' : '管理者ログイン'}
        </button>
      </div>
    </div>
  );
};

export default Schedule;
