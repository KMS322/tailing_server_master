import React, { useState, useEffect } from 'react';
import { getDataFolders, getFolderFiles, checkServerConnection } from '../../api/dataService';

const MainS1 = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('연결 확인 중...');

  // 컴포넌트 마운트 시 서버 연결 상태 확인
  useEffect(() => {
    checkConnection();
  }, []);

  // 서버 연결 상태 확인
  const checkConnection = async () => {
    try {
      const response = await checkServerConnection();
      setServerStatus('연결됨');
      console.log('서버 연결 성공:', response);
    } catch (error) {
      setServerStatus('연결 실패');
      setError('원격 서버에 연결할 수 없습니다.');
    }
  };

  // 데이터 폴더 목록 조회
  const fetchDataFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDataFolders();
      setFolders(response.folders || []);
    } catch (error) {
      setError('폴더 목록을 가져올 수 없습니다. 원격 서버에 /data/folders API가 구현되어 있는지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  // 특정 폴더의 파일 목록 조회
  const fetchFolderFiles = async (folderName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFolderFiles(folderName);
      setFolderFiles(response.files || []);
      setSelectedFolder(folderName);
    } catch (error) {
      setError(`폴더 "${folderName}"의 파일 목록을 가져올 수 없습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>원격 서버 데이터 조회</h1>
      
      {/* 서버 연결 상태 */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: serverStatus === '연결됨' ? '#d4edda' : '#f8d7da',
        border: '1px solid ' + (serverStatus === '연결됨' ? '#c3e6cb' : '#f5c6cb'),
        borderRadius: '5px'
      }}>
        <strong>서버 상태:</strong> {serverStatus} (211.188.55.131:3060)
      </div>

      {/* 폴더 목록 조회 버튼 */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchDataFolders}
          disabled={loading || serverStatus !== '연결됨'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '로딩 중...' : '데이터 폴더 목록 조회'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24'
        }}>
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 폴더 목록 */}
      {folders.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>데이터 폴더 목록:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {folders.map((folder, index) => (
              <div 
                key={index}
                onClick={() => fetchFolderFiles(folder)}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: selectedFolder === folder ? '#e7f3ff' : '#f8f9fa',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.backgroundColor = selectedFolder === folder ? '#e7f3ff' : '#f8f9fa'}
              >
                📁 {folder}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 폴더의 파일 목록 */}
      {selectedFolder && folderFiles.length > 0 && (
        <div>
          <h3>폴더 "{selectedFolder}" 의 파일 목록:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {folderFiles.map((file, index) => (
              <li 
                key={index}
                style={{
                  padding: '8px 12px',
                  margin: '5px 0',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '3px'
                }}
              >
                📄 {file}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 사용법 안내 */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '5px' 
      }}>
        <h4>사용법:</h4>
        <ol>
          <li>먼저 "데이터 폴더 목록 조회" 버튼을 클릭하세요</li>
          <li>원격 서버에 다음 API들이 구현되어 있어야 합니다:
            <ul>
              <li><code>GET /data/folders</code> - 폴더 목록 반환</li>
              <li><code>GET /data/folders/:folderName/files</code> - 특정 폴더의 파일 목록 반환</li>
            </ul>
          </li>
          <li>폴더를 클릭하면 해당 폴더의 파일 목록을 조회합니다</li>
        </ol>
      </div>
    </div>
  );
};

export default MainS1;
