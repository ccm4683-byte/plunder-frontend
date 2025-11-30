// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // <-- [수정] 설정 파일 대신 라이브러리 직접 사용

function ProductItem({ product }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)} 
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        cursor: 'pointer',
        backgroundColor: isOpen ? '#f9f9f9' : 'white',
        transition: 'all 0.2s'
      }}
    >
      {/* 요약 정보 (항상 보임) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>{product.name}</h3>
        <span style={{ fontWeight: 'bold', color: '#007bff' }}>
          {product.price.toLocaleString()}원
        </span>
      </div>

      {/* 상세 정보 (클릭 시 보임) */}
      {isOpen && (
        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ width: '100%', maxWidth: '300px', borderRadius: '4px', marginBottom: '10px' }}
            />
          ) : (
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '10px' }}>
              (이미지 없음)
            </div>
          )}
          <p style={{ color: '#555', lineHeight: '1.6' }}>
            {product.description || "상세 설명이 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ▼▼▼ [핵심 수정] 주소를 'http://localhost:4000/...' 이렇게 풀네임으로 적어줍니다! ▼▼▼
    axios.get('http://localhost:4000/api/products')
      .then(res => {
        console.log("데이터 도착:", res.data); // 확인용 로그
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("에러 발생:", err);
        setError('상품을 불러오지 못했습니다. (F12 콘솔 확인 필요)');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        Plunder 상품 목록
      </h2>
      
      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <div>
          {products.map(product => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}