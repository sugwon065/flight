import './ResultsSearchBar.css'

function formatPeriodShort(startDate, endDate) {
  if (!startDate || !endDate) return ''
  return `${startDate.getMonth() + 1}월 ${startDate.getDate()}일 – ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`
}

export default function ResultsSearchBar({
  destination,
  startDate,
  endDate,
  tripDays,
  onBack,
}) {
  return (
    <div className="rs-bar">
      <div className="rs-bar-inner">
        <button className="rs-back" onClick={onBack} type="button" aria-label="검색으로 돌아가기">
          ←
        </button>

        <div className="rs-route-box">
          <span className="rs-route">
            서울 (ICN) – {destination === '일본 전체' ? '일본 전체' : `${destination} (모두)`} · 성인 1명, 일반석
          </span>
        </div>

        <div className="rs-dates">
          <div className="rs-date-box">
            <span className="rs-date-label">여행기간</span>
            <span>{tripDays}일</span>
          </div>
          <div className="rs-date-box">
            <span className="rs-date-label">여행날짜</span>
            <span>{formatPeriodShort(startDate, endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
