# SkyFinder 간단 배포 (Render)

한 URL에서 웹 화면 + API가 같이 동작합니다.

## 1. GitHub에 올리기

```powershell
cd C:\Users\sugwo\Desktop\project
git init
git add .
git commit -m "SkyFinder initial deploy"
```

GitHub에서 새 저장소를 만든 뒤:

```powershell
git remote add origin https://github.com/내아이디/저장소이름.git
git branch -M main
git push -u origin main
```

## 2. Render에 배포

1. https://render.com 가입 (GitHub 연동)
2. **New +** → **Blueprint** 선택
3. 방금 만든 GitHub 저장소 연결
4. `render.yaml`이 자동 인식되면 **Apply** 클릭
5. 5~10분 후 배포 완료 → `https://skyfinder-xxxx.onrender.com` 주소 생성

## 3. 로컬에서 배포 전 테스트 (선택)

```powershell
cd C:\Users\sugwo\Desktop\project\frontend
npm run build

cd C:\Users\sugwo\Desktop\project\backend
python -m uvicorn main:app --port 8000
```

브라우저에서 http://localhost:8000 접속

## 참고

- Render 무료 플랜은 15분 미사용 시 슬립 → 첫 접속이 30초~1분 걸릴 수 있음
- 코드 수정 후 GitHub에 push하면 Render가 자동 재배포
