// src/pages/ProductEdit.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // 경로 확인 필요

export default function ProductEdit() {
  const { id } = useParams();
  const { token } = useContext(AuthContext); // 혹은 localStorage에서 직접 가져와도 됨
  const navigate = useNavigate();

  // 1. 상태 관리 (카테고리 삭제, 태그/이미지URL 추가)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '', // [변경] 파일 객체 대신 URL 문자열
    tags: ''      // [변경] 카테고리 대신 태그 문자열
  });

  // 2. 기존 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        const p = res.data;
        
        setFormData({
          name: p.name || p.title, 
          description: p.description || '',
          price: p.price,
          imageUrl: p.imageUrl || '', 
          // [중요] 태그 배열(['a','b'])을 문자열("a, b")로 바꿔서 입력창에 표시
          tags: p.tags ? p.tags.join(', ') : '' 
        });
      } catch (err) {
        console.error("불러오기 실패:", err);
        alert('상품 정보를 불러올 수 없습니다.');
        navigate('/products/mine');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // [삭제] handleFileChange는 이제 필요 없습니다.

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 3. 데이터 전송 (JSON 방식)
    // FormData 대신 일반 객체를 만듭니다.
    const updateData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      tags: formData.tags // "태그1, 태그2" 문자열 그대로 전송 (백엔드가 자름)
    };

    try {
      // headers에 'Content-Type': 'application/json' 확인
      await axios.put(`http://localhost:4000/api/products/${id}`, updateData, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
      alert('수정되었습니다!');
      navigate('/products/mine'); // 수정 후 이동할 경로
    } catch (err) {
      console.error(err);
      alert('수정 실패: ' + (err.response?.data?.msg || '오류 발생'));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛠 상품 정보 수정</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 1. 이미지 URL 입력 (파일 선택 X) */}
        <div>
          <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>이미지 주소 (URL)</label>
          <input 
             type="text" 
             name="imageUrl" 
             value={formData.imageUrl} 
             onChange={handleChange} 
             placeholder="https://..."
             style={{ width: '100%', padding: '10px', boxSizing:'border-box' }}
          />
          {/* 미리보기 */}
          {formData.imageUrl && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
                onError={(e) => e.target.style.display='none'}
              />
            </div>
          )}
        </div>

        {/* 2. 상품명 */}
        <div>
            <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>상품명</label>
            <input 
            type="text" name="name" 
            value={formData.name} onChange={handleChange} required 
            style={{ width: '100%', padding: '10px', boxSizing:'border-box' }}
            />
        </div>

        {/* 3. 가격 */}
        <div>
            <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>가격 (원)</label>
            <input 
            type="number" name="price" 
            value={formData.price} onChange={handleChange} required 
            style={{ width: '100%', padding: '10px', boxSizing:'border-box' }}
            />
        </div>

        {/* 4. [변경] 카테고리 삭제 -> 태그 입력 */}
        <div>
            <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>태그 (쉼표로 구분)</label>
            <input 
            type="text" name="tags" 
            placeholder="예: 유니폼, 굿즈, 할인"
            value={formData.tags} onChange={handleChange} 
            style={{ width: '100%', padding: '10px', boxSizing:'border-box' }}
            />
        </div>

        {/* 5. 설명 */}
        <div>
            <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>상품 설명</label>
            <textarea 
            name="description" 
            value={formData.description} onChange={handleChange} 
            rows="5" 
            style={{ width: '100%', padding: '10px', resize: 'vertical', boxSizing:'border-box' }}
            />
        </div>

        <button 
          type="submit" 
          style={{ padding: '15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          수정 완료
        </button>
      </form>
    </div>
  );
}