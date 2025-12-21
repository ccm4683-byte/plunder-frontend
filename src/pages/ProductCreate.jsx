// src/pages/ProductCreate.jsx
import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

export default function ProductCreate() {
  // 1. 초기값 설정 (category 삭제!)
  const [formData, setFormData] = useState({
    name: '',       
    price: '',
    description: '',
    imageUrl: '',   
    tags: ''        // 태그만 남김
    // category: '' (삭제됨)
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      
      // 데이터 전송 (여기서 category는 이제 안 보냄)
      await axios.post('https://plunder-backend.onrender.com/api/products', formData, {
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        } 
      });

      alert('상품이 등록되었습니다!');
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert('등록 실패: ' + (err.response?.data?.msg || '서버 오류'));
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>상품 등록 (스폰서 전용)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 상품명 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>상품명</label>
          <input 
            type="text" 
            name="name" 
            placeholder="예: 맛있는 사과" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 가격 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>가격</label>
          <input 
            type="number" 
            name="price" 
            placeholder="숫자만 입력" 
            value={formData.price} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 이미지 URL */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>이미지 주소 (URL)</label>
          <input 
            type="text" 
            name="imageUrl" 
            placeholder="https://..." 
            value={formData.imageUrl} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* [중요] 카테고리 대신 태그 입력칸 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>태그 (쉼표로 구분)</label>
          <input 
            type="text" 
            name="tags" 
            placeholder="예: 신상, 세일, 한정판" 
            value={formData.tags} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 설명 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>상세 설명</label>
          <textarea 
            name="description" 
            placeholder="설명" 
            value={formData.description} 
            onChange={handleChange} 
            rows="5"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          등록하기
        </button>
      </form>
    </div>
  );
}