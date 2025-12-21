// src/pages/ProductList.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [teamStatus, setTeamStatus] = useState({ winStreak: 0 });
  const [expandedId, setExpandedId] = useState(null);
  
  const { user, token } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user && user.role === 'fan' && user.favoriteTeam) {
      fetchTeamStatus(user.favoriteTeam);
    } else {
      setTeamStatus({ winStreak: 0 });
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://plunder-backend.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeamStatus = async (teamName) => {
    try {
      const safeName = encodeURIComponent(teamName);
      const res = await axios.get(`https://plunder-backend.onrender.com/api/teams/${safeName}`);
      setTeamStatus(res.data);
    } catch (err) {
      console.error("팀 정보 로딩 실패");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 구매 핸들러
  const handleBuy = async (product, finalPrice) => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    if (user.role === 'sponsor') {
      alert("스폰서는 상품을 구매할 수 없습니다. (팬 계정으로 로그인하세요)");
      return;
    }

    const confirmBuy = window.confirm(
      `[${product.name || product.title}]\n\n` +
      `최종 결제 금액: ${finalPrice.toLocaleString()}원 입니다.\n` +
      `정말 구매하시겠습니까?`
    );

    if (!confirmBuy) return;

    try {
      await axios.post('https://plunder-backend.onrender.com/api/products/buy', {
        productId: product._id,
        productName: product.name || product.title,
        price: finalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🎉 구매가 완료되었습니다!\n(배송 준비중...)");
      setExpandedId(null); // 구매 후 닫기

    } catch (err) {
      console.error(err);
      alert("구매 실패: " + (err.response?.data?.msg || "오류 발생"));
    }
  };

  const discountRate = Math.min(teamStatus.winStreak * 5, 30);
  const isDiscountActive = discountRate > 0;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>오늘의 약탈 품목</h2>

      {user && user.role === 'fan' && isDiscountActive && (
        <div style={{ backgroundColor: '#6200ee', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight:'bold', boxShadow:'0 4px 6px rgba(0,0,0,0.2)' }}>
           🔥 {user.favoriteTeam} {teamStatus.winStreak}연승! 전 품목 {discountRate}% 할인 중! 🔥
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {products.map((product) => {
          const originalPrice = Number(product.price);
          const discountedPrice = originalPrice * (1 - discountRate / 100);
          const finalPrice = isDiscountActive ? discountedPrice : originalPrice;

          return (
            <div 
              key={product._id} 
              style={{ 
                border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', 
                backgroundColor: 'white', transition: '0.3s',
                boxShadow: expandedId === product._id ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {/* 항상 보이는 부분 (목록) */}
              <div 
                onClick={() => toggleExpand(product._id)}
                style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <h3 style={{ margin: 0, fontSize: '18px' }}>{product.name || product.title}</h3>
                
                <div style={{ fontSize: '16px' }}>
                  {isDiscountActive ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>{originalPrice.toLocaleString()}원</span>
                      <span style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '18px' }}>{discountedPrice.toLocaleString()}원</span>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{originalPrice.toLocaleString()}원</span>
                  )}
                </div>
              </div>

              {/* 클릭하면 펼쳐지는 부분 (상세 정보) */}
              {expandedId === product._id && (
                <div style={{ 
                  padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#f9f9f9',
                  animation: 'fadeIn 0.3s' 
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    
                    {/* 이미지 */}
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}

                    <div style={{ flex: 1 }}>
                      
                      {/* ▼▼▼ [수정된 부분] 태그 목록 보여주기 ▼▼▼ */}
                      <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {product.tags && product.tags.length > 0 ? (
                          product.tags.map((tag, index) => (
                            <span key={index} style={{ 
                              backgroundColor: '#e0e0e0', // 회색 배경
                              color: '#333',              // 글자색
                              padding: '4px 10px', 
                              borderRadius: '20px',       // 둥글게
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '12px', color: '#aaa' }}>태그 없음</span>
                        )}
                      </div>
                      
                      <h4 style={{ marginTop: '10px', marginBottom: '10px' }}>상품 설명</h4>
                      <p style={{ color: '#555', lineHeight: '1.6', marginTop: 0 }}>{product.description || '설명이 없습니다.'}</p>
                      
                      {/* 구매하기 버튼 */}
                      <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuy(product, finalPrice);
                          }}
                          style={{ 
                            backgroundColor: '#6200ee', color: 'white', 
                            padding: '12px 25px', border: 'none', borderRadius: '5px', 
                            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(98, 0, 238, 0.3)'
                          }}
                        >
                          💳 {finalPrice.toLocaleString()}원 구매하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}