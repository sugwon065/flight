import './ResultsList.css'

const AIRPORT_CODES = {
  '도쿄(나리타)': 'NRT',
  '도쿄(하네다)': 'HND',
  '오사카(간사이)': 'KIX',
  '후쿠오카': 'FUK',
  '삿포로': 'CTS',
  '나고야': 'NGO',
  '오키나와': 'OKA',
  '센다이': 'SDJ',
  '히로시마': 'HIJ',
  '가고시마': 'KOJ',
  '구마모토': 'KMJ',
  '미야자키': 'KMI',
  '오ita': 'OIT',
  '오이타': 'OIT',
  '고베': 'UKB',
  '마쓰야마': 'MYJ',
  '다카마쓰': 'TAK',
  '기타큐슈': 'KKJ',
  '사가': 'HSG',
  '하코다테': 'HKD',
  '요나고': 'YGJ',
  '시즈오카': 'FSZ',
  '니가타': 'KIJ',
  '아오모리': 'AOJ',
  '고마쓰': 'KMJ',
  '오카야마': 'OKJ',
}

const AIRLINE_COLORS = {
  대한항공: '#0064B3',
  아시아나항공: '#FF6600',
  제주항공: '#FF6600',
  진에어: '#1A3978',
  티웨이항공: '#E6002D',
  에어부산: '#E60012',
  에어서울: '#0064B3',
  JAL: '#CC0000',
  ANA: '#0066CC',
  피치항공: '#FF6600',
}

function getAirportCode(destination) {
  return AIRPORT_CODES[destination] || destination.slice(0, 3).toUpperCase()
}

function formatPrice(price) {
  return '₩' + price.toLocaleString('ko-KR')
}

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

function formatKoreanTime(hour24, minute) {
  const period = hour24 < 12 ? '오전' : '오후'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  const min = minute.toString().padStart(2, '0')
  return `${period} ${hour12}:${min}`
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

function getFlightSchedule(dateStr, airline, leg) {
  const seed = hashSeed(`${dateStr}-${airline}-${leg}`)
  const depHour = 6 + (seed % 14)
  const depMin = (Math.floor(seed / 7) % 4) * 15
  const durationMin = 80 + (seed % 40)
  const depTotal = depHour * 60 + depMin
  const arrTotal = depTotal + durationMin
  const arrHour = Math.floor(arrTotal / 60) % 24
  const arrMin = arrTotal % 60

  return {
    departure: formatKoreanTime(depHour, depMin),
    arrival: formatKoreanTime(arrHour, arrMin),
    duration: formatDuration(durationMin),
  }
}

function AirlineLogo({ name }) {
  const color = AIRLINE_COLORS[name] || '#64748b'
  const initial = name.charAt(0)
  return (
    <span className="airline-logo" style={{ background: color }}>
      {initial}
    </span>
  )
}

function FlightLeg({ from, to, dateStr, airline, leg }) {
  const { departure, arrival, duration } = getFlightSchedule(dateStr, airline, leg)

  return (
    <div className="flight-leg">
      <div className="leg-endpoint leg-departure">
        <span className="leg-time">{departure}</span>
        <span className="leg-airport">{from}</span>
      </div>

      <div className="leg-route">
        <span className="leg-duration">{duration}</span>
        <div className="leg-line">
          <span className="leg-bar" />
          <span className="leg-dot" aria-hidden="true" />
          <span className="leg-bar" />
        </div>
        <span className="leg-direct">직항</span>
      </div>

      <div className="leg-endpoint leg-arrival">
        <span className="leg-time">{arrival}</span>
        <span className="leg-airport">{to}</span>
      </div>
    </div>
  )
}

export default function ResultsList({
  results,
  loading,
  destination = '',
  embedded = false,
  showPromo = false,
}) {
  const isJapanAll = destination === '일본 전체'

  if (loading) {
    return (
      <div className={`results-container ${embedded ? 'embedded' : ''}`}>
        <div className="results-loading">최저가 날짜를 검색하고 있습니다...</div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={`results-container ${embedded ? 'embedded' : ''}`}>
        <div className="results-empty">
          <p>검색 결과가 없습니다.</p>
          <p className="results-empty-sub">다른 기간이나 도착지를 선택해 보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`results-container ${embedded ? 'embedded' : ''}`}>
      <div className="results-list">
        {results.map((item, index) => {
          const itemDestination = item.destination || destination
          const destCode = getAirportCode(itemDestination)

          return (
          <div key={`${item.rank}-${itemDestination}-${item.departure_date}`}>
            <article className="sky-card">
              <div className="sky-card-body">
                <div className="sky-card-airline">
                  <AirlineLogo name={item.airline_name} />
                  <span className="sky-airline-name">{item.airline_name}</span>
                  {isJapanAll && (
                    <span className="sky-destination-tag">{itemDestination}</span>
                  )}
                </div>

                <div className="sky-card-legs">
                  <FlightLeg
                    from="ICN"
                    to={destCode}
                    dateStr={item.departure_date}
                    airline={item.airline_name}
                    leg="out"
                  />
                  <FlightLeg
                    from={destCode}
                    to="ICN"
                    dateStr={item.return_date}
                    airline={item.airline_name}
                    leg="in"
                  />
                </div>
              </div>

              <div className="sky-card-price">
                <button className="save-btn" type="button" tabIndex={-1} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                <span className="price-tag">
                  {item.rank === 1
                    ? `총 ${results.length}건 중 최저가`
                    : `${item.rank}번째 추천`}
                </span>
                <span className="price-amount">{formatPrice(item.round_trip_price)}</span>
                <button className="sky-select-btn" type="button">
                  선택하기
                  <span className="sky-select-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </article>

            {showPromo && index === 0 && (
              <div className="price-alert-promo">
                <div className="promo-text">
                  <strong>이 항공편이 마음에 드셨나요?</strong>
                  <span>가격이 변동되면 알려드릴게요.</span>
                </div>
                <span className="promo-alert-btn">가격 알림 설정</span>
              </div>
            )}
          </div>
          )
        })}
      </div>
    </div>
  )
}
