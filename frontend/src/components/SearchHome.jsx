import './SearchHome.css'

function formatPeriodRange(startDate, endDate) {
  if (!startDate || !endDate) return '여행날짜 선택'
  const fmt = (d) => `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
  return `${fmt(startDate)} – ${fmt(endDate)}`
}

export default function SearchHome({
  destination,
  destinations,
  onDestinationChange,
  startDate,
  endDate,
  onPeriodClick,
  tripDays,
  onTripDaysChange,
  onSearch,
  loading,
  error,
}) {
  return (
    <div className="search-home">
      {/* Top utility bar */}
      <div className="sh-topbar">
        <div className="sh-topbar-inner">
          <div className="sh-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#0770e3" />
              <path
                d="M10 16.5L14 12.5L18 16.5L22 12.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>SkyFinder</span>
          </div>
          <div className="sh-topbar-actions">
            <span className="sh-top-link">도움말</span>
            <span className="sh-top-icon">🌐</span>
            <span className="sh-top-icon">♡</span>
            <span className="sh-top-login">
              <span className="sh-login-icon">👤</span> 로그인
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="sh-hero">
        <div className="sh-hero-inner">
          <div className="sh-service-pills">
            <span className="sh-pill active">
              <span className="sh-pill-icon">✈</span> 항공권
            </span>
            <span className="sh-pill">
              <span className="sh-pill-badge">신규</span>
              <span className="sh-pill-icon">🛏</span> 숙소
            </span>
            <span className="sh-pill">
              <span className="sh-pill-icon">🚗</span> 렌터카
            </span>
          </div>

          <h1 className="sh-headline">
            수백만 개의 저가 항공권.
            <br />
            검색 한 번으로 간단하게.
          </h1>

          <div className="sh-search-area">
            <div className="sh-trip-type">
              <span className="sh-trip-pill">왕복 ▾</span>
            </div>

            <div className="sh-search-row">
              <div className="sh-search-bar">
                <div className="sh-field">
                  <label>출발지</label>
                  <div className="sh-field-value">인천 국제 (ICN)</div>
                </div>

                <div className="sh-field sh-field--select sh-field--to">
                  <label>도착지</label>
                  <select
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    className="sh-select"
                  >
                    {destinations.map((d) => (
                      <option key={d} value={d}>
                        {d === '일본 전체' ? '🇯🇵 일본 전체' : d}
                      </option>
                    ))}
                  </select>
                  <span className="sh-swap" aria-hidden="true">⇄</span>
                </div>

                <div className="sh-field sh-field--select">
                  <label>여행기간</label>
                  <select
                    value={tripDays}
                    onChange={(e) => onTripDaysChange(Number(e.target.value))}
                    className="sh-select"
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}일
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="sh-field sh-field--click"
                  onClick={onPeriodClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onPeriodClick()}
                >
                  <label>여행날짜</label>
                  <div
                    className={`sh-field-value ${!startDate || !endDate ? 'placeholder' : ''}`}
                  >
                    {formatPeriodRange(startDate, endDate)}
                  </div>
                </div>

                <div className="sh-field">
                  <label>여행자 및 좌석 등급</label>
                  <div className="sh-field-value">성인 1명, 일반석</div>
                </div>
              </div>

              <button
                className="sh-search-btn"
                onClick={onSearch}
                disabled={loading}
                type="button"
              >
                {loading ? '검색 중...' : '검색하기'}
              </button>
            </div>

            <div className="sh-options">
              <div className="sh-options-left">
                <label className="sh-checkbox">
                  <input type="checkbox" disabled />
                  <span>주변 공항 추가</span>
                </label>
                <label className="sh-checkbox">
                  <input type="checkbox" disabled />
                  <span>주변 공항 추가</span>
                </label>
              </div>
              <label className="sh-checkbox">
                <input type="checkbox" disabled />
                <span>직항 항공편</span>
              </label>
              <label className="sh-checkbox sh-checkbox--checked">
                <input type="checkbox" defaultChecked disabled />
                <span>숙소 추가</span>
              </label>
            </div>
          </div>

          {error && <p className="sh-error">{error}</p>}
        </div>
      </div>

      {/* White content area */}
      <div className="sh-content">
        <div className="sh-content-inner">
          <div className="sh-quick-links">
            <div className="sh-quick-card">
              <span className="sh-quick-icon">🛏</span>
              <span>숙소</span>
            </div>
            <div className="sh-quick-card">
              <span className="sh-quick-icon">🚗</span>
              <span>렌터카</span>
            </div>
            <div className="sh-quick-card">
              <span className="sh-quick-icon">🔍</span>
              <span>어디든지 검색</span>
            </div>
          </div>

          <div className="sh-promo-banner">
            <div className="sh-promo-overlay">
              <h2>경기대학교 데이터 분석 동아리 D.N.A</h2>
              <p>Data · Network · Analytics — 최저가 항공권 날짜 추천 프로젝트</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
