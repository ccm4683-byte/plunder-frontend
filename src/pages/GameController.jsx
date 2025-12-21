// src/pages/GameController.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TEAMS = [
  "Gen.G", "Hanwha Life Esports", "kt Rolster", "T1", "Dplus KIA", 
  "BNK FEARX", "Nongshim RedForce", "OKSavingsBank BRION", "DRX", "DN FREECS"
];

export default function GameController() {
  const [teamStats, setTeamStats] = useState({}); // 팀별 연승 정보 저장

  // 페이지 들어오면 현재 상태 싹 긁어오기
  useEffect(() => {
    fetchTeamStats();
  }, []);

  const fetchTeamStats = async () => {
    try {
      const res = await axios.get('https://plunder-backend.onrender.com/api/teams');
      // 배열을 객체로 변환 { "T1": 3, "Gen.G": 0 ... } 형태
      const stats = {};
      res.data.forEach(t => {
        stats[t.name] = t.winStreak;
      });
      setTeamStats(stats);
    } catch (err) {
      console.error("팀 정보 로딩 실패");
    }
  };

  const handleMatch = async (teamName, result) => {
    try {
      await axios.post('https://plunder-backend.onrender.com/api/teams/match', {
        name: teamName,
        result: result
      });
      // 버튼 누르면 즉시 정보 갱신
      fetchTeamStats(); 
    } catch (err) {
      alert('오류 발생');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🎮 LCK 경기 관리자 (Admin)</h1>
      <p>⚠️ 이곳에서 승패를 조작하면, 해당 팀 팬들의 상품 가격이 실시간으로 변동됩니다.</p>
      
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {TEAMS.map(team => {
          // 현재 연승 정보 (DB에 없으면 0)
          const wins = teamStats[team] || 0;
          const discount = wins * 5; // 할인율 계산

          return (
            <div key={team} style={{ 
              border: '1px solid #ddd', padding: '15px', borderRadius: '8px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: wins > 0 ? '#f3e5f5' : 'white' // 연승 중이면 보라색 배경
            }}>
              {/* 왼쪽: 팀 정보 */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{team}</span>
                <span style={{ marginLeft: '15px', color: '#666' }}>
                  현재: <strong style={{ color: '#6200ee', fontSize: '20px' }}>{wins}연승</strong> 
                  (🔻{discount}% 할인 적용 중)
                </span>
              </div>

              {/* 오른쪽: 조작 버튼 */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleMatch(team, 'win')}
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  승리 (+1승)
                </button>
                <button 
                  onClick={() => handleMatch(team, 'lose')}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  패배 (초기화)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}