// src/pages/MyProducts.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ❌ import { Pie } ... <-- 이 줄을 지웠습니다! (에러 해결)

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null); // 통계 데이터 저장
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchMyProducts();
      fetchAnalytics(); // 통계 가져오기 실행
    }
  }, [token]);

  // 1. 내 상품 목록 가져오기
  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('https://plunder-backend.onrender.com/api/products/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. 판매 통계 데이터 가져오기
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('https://plunder-backend.onrender.com/api/products/stats/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("통계 로딩 실패 (아직 주문이 없거나 서버 에러)");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`https://plunder-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("삭제되었습니다.");
      fetchMyProducts();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>내 상품 관리 ({user?.email})</h2>

      {/* ▼▼▼ [대시보드] 판매 데이터 분석 (차트 대신 깔끔한 박스 UI) ▼▼▼ */}
      {stats && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e9ecef', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#343a40', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}>
            📊 판매 분석 리포트
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
            
            {/* 1. 총 매출 카드 */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '5px' }}>총 매출액</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.totalRevenue.toLocaleString()}원
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                총 <strong style={{color:'black'}}>{stats.totalOrders}</strong>건 주문 완료
              </div>
            </div>

            {/* 2. 성별 분석 카드 */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '10px' }}>구매자 성별 비율</div>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '60px' }}>
                <div style={{ fontSize: '18px' }}>
                  <span style={{ fontSize: '24px' }}>👨</span> 남성 <strong style={{color:'#007bff'}}>{stats.genderStats.male}</strong>
                </div>
                <div style={{ width: '1px', height: '40px', background: '#eee' }}></div>
                <div style={{ fontSize: '18px' }}>
                  <span style={{ fontSize: '24px' }}>👩</span> 여성 <strong style={{color:'#e83e8c'}}>{stats.genderStats.female}</strong>
                </div>
              </div>
            </div>

            {/* 3. 나이대 분석 카드 */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '10px' }}>주요 구매 연령대</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', textAlign: 'left', paddingLeft: '20px' }}>
                <div>🌱 10대: <strong>{stats.ageStats['10대']}</strong>명</div>
                <div>🌿 20대: <strong>{stats.ageStats['20대']}</strong>명</div>
                <div>🌳 30대: <strong>{stats.ageStats['30대']}</strong>명</div>
                <div>🌲 40↑: <strong>{stats.ageStats['40대이상']}</strong>명</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 내 상품 목록 */}
      <h3 style={{ marginTop: '40px' }}>등록된 상품 목록</h3>
      {products.length === 0 ? (
        <p style={{ marginTop: '20px', color: '#666' }}>등록한 상품이 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', marginTop: '10px' }}>
          {products.map(p => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '8px', background: 'white' }}>
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />}
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{p.name || p.title}</h3> 
                <p style={{ margin: 0, fontWeight: 'bold' }}>{Number(p.price).toLocaleString()}원</p>
                <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0 0' }}>{p.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => navigate(`/products/edit/${p._id}`)}
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  수정
                </button>
                <button 
                  onClick={() => handleDelete(p._id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}