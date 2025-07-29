import "../../css/main.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants";
import dayjs from "dayjs";

const Main = () => {
  const navigate = useNavigate();
  const [orgLists, setOrgLists] = useState([]);
  const [csvLists, setCsvLists] = useState([]);
  useEffect(() => {
    const loadOrg = async () => {
      try {
        const response = await axios.get(`${API_URL}/master/loadOrg`);

        setOrgLists(response.data.allOrgLists);
        setCsvLists(response.data.allCsvLists);
      } catch(e) {  
        console.error(e);
      }
    }
    loadOrg();
  }, [])

  const goDetail = (device_code) => {
    navigate(`detail/${device_code}`);
  }
  
  return (
    <>
      <div className="main_container">
        <div className="head_row" >
          <p>기관명</p>
          <p>디바이스 코드</p>
          <p>최신 업데이트</p>
          <p>총 파일 수</p>
        </div>
        {orgLists && orgLists.map((list, index) => {
          const csvs = csvLists.filter((csv) => csv.device_code === list.device_code);
          const lastest = csvs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          const formatKoreanTime = (dateString) => {
            if (!dateString) return "날짜 없음";
            return dayjs(dateString).format('YYYY.MM.DD-HH:mm:ss');
          };
          
          return (
            <div className="body_row" onClick={() => {
              goDetail(list.device_code);
            }} key={index}>
              <p>{list.org_name}</p>
              <p>{list.device_code}</p>
              <p>{formatKoreanTime(lastest?.createdAt)}</p>
              <p>{csvs.length}</p>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Main;
