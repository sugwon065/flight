# SkyFinder - 항공권 최저가 날짜 추천

스카이스캐너 스타일 UI로 여행 가능 기간 내 항공권 최저가 출발일 Top 5를 추천하는 웹 앱입니다.
# https://skyfinder.onrender.com/

## 실행 방법

### 1. 백엔드 (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. 프론트엔드 (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속

## API

| 엔드포인트 | 설명 |
|---|---|
| `GET /api/destinations` | 도착지 목록 |
| `GET /api/search?destination=&start_date=&end_date=&trip_days=` | Top 5 최저가 추천 |

## 데이터

`data/raw/flights.csv` 파일을 pandas로 로드합니다.
