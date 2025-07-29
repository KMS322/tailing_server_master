import "../../css/detail.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../constants";

const Detail = () => {
  const {code} = useParams();
  const [dataLists,setDataLists] = useState([]);
  const [petInfos, setPetInfos] = useState([]);
  useEffect(() => {
    const loadDatas = async () => {
      try {
        const response = await axios.post(`${API_URL}/master/loadData`, {code});

        setDataLists(response.data.dataLists);  
        setPetInfos(response.data.petInfos);
      }
      catch(e) {
        console.error(e);
      }
    }
    loadDatas();
  }, [])

  const formatDate = (date) => {
    const [datePart, timePart] = date.split("-");

    const year = datePart.slice(0, 4);
    const month = datePart.slice(4, 6);
    const day = datePart.slice(6, 8);

    // 시간 분리
    const hour = timePart.slice(0, 2);
    const minute = timePart.slice(2, 4);
    const second = timePart.slice(4, 6);

    // 포맷팅
    const formatted = `${year}.${month}.${day}-${hour}:${minute}:${second}`;

    return formatted;
  }
  
  const downloadFile = async(fileName, type) => {
    try {
      const response = await axios.post(`${API_URL}/master/downloadFile`, 
        { fileName, type },
        {
          responseType: 'blob', // 중요: 파일 데이터를 blob으로 받기
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      // Blob 객체 생성
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      
      // 임시 a 태그 생성하여 다운로드 트리거
      const link = document.createElement('a');
      link.href = url;
      if(type === "customer") {
        link.download = fileName; // 다운로드될 파일명
      } else {
        link.download = "creamoff_" +fileName; // 다운로드될 파일명
      }
      document.body.appendChild(link);
      link.click();
      
      // 정리
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch(e) {
      console.error(e);
    }
  }
  return (
    <>
      <div className="detail_container">
        <div className="head_row" >
          <p>시작날짜</p>
          <p>동물</p>
          <p>용량</p>
          <p>다운로드</p>
        </div>
        {
          dataLists && dataLists
          .sort((a, b) => {
            // 각 항목에서 startDate 추출
            const startDateA = a.file_name.split("_")[2].split(".")[0];
            const startDateB = b.file_name.split("_")[2].split(".")[0];
            
            // 내림차순 정렬 (최신이 위로)
            return startDateB.localeCompare(startDateA);
          })
          .map((list, index) => {
            const pet = petInfos.find((pet) => pet.pet_code === list.pet_code);
            const startDate = list.file_name.split("_")[2].split(".")[0];
            return (
              <div className="body_row" key={index} onClick={() => {
                // goDetailPet(list.pet_code);
              }}>
                <p>{formatDate(startDate)}</p>
                <p>{pet.name}/{pet.birth}/{pet.species}/{pet.breed}/{pet.weight}</p>
                <p>{list.size} kb</p>
                <div className="btn_box">
                  <p className="btn"onClick={() => {
                    downloadFile(list.file_name, "customer");
                  }}>고객용</p>
                  <p className="btn" onClick={() => {
                    downloadFile(list.file_name, "company");
                  }}>회사용</p>
                </div>

            </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Detail;