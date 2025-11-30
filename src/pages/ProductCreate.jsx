// src/pages/ProductCreate.jsx
import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

export default function ProductCreate() {
  // 1. 입력받을 데이터들 (여기에 imageUrl이 추가되었습니다!)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    imageUrl: '' // <-- 이미지 주소 저장할 공간
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      
      // 백엔드로 전송 (http://localhost:4000 주소 확인!)
      await axios.post('http://localhost:4000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` } 
      });

      alert('상품이 등록되었습니다!');
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert('등록 실패: 스폰서 계정인지 확인하거나, 서버가 켜져있는지 확인하세요.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>상품 등록 (스폰서 전용)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 제목 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>상품명</label>
          <input 
            type="text" 
            name="title" 
            placeholder="예: 맛있는 사과" 
            value={formData.title} 
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

        {/* ▼▼▼ [추가된 부분] 이미지 주소 입력칸 ▼▼▼ */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>이미지 주소 (URL)</label>
          <input 
            type="text" 
            name="imageUrl" 
            placeholder="https://... (인터넷 이미지 주소 복사)" 
            value={formData.imageUrl} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
          
          {/* 이미지가 있을 때만 미리보기 보여주기 */}
          {formData.imageUrl && (
            <div style={{ marginTop: '10px', textAlign: 'center', border: '1px dashed #ccc', padding: '5px' }}>
              <p style={{fontSize: '12px', color: '#666'}}>미리보기</p>
              <img 
                src={formData.imageUrl} 
                alt="미리보기" 
                style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }}
                onError={(e) => e.target.style.display = 'none'} 
              />
            </div>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>상세 설명</label>
          <textarea 
            name="description" 
            placeholder="상품 설명을 적어주세요." 
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
