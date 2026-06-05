import './PromoSidebar.css'

export default function PromoSidebar({ destination }) {
  const city =
    destination === '일본 전체'
      ? '일본'
      : destination?.split('(')[0] || destination

  return (
    <aside className="promo-sidebar">
      <div className="promo-card promo-hotel">
        <div className="promo-icon">🏨</div>
        <h4>숙소도 찾아보세요</h4>
        <p>{city}에서 머무를 호텔을 검색해 보세요.</p>
        <span className="promo-btn">숙소 둘러보기</span>
      </div>

      <div className="promo-card promo-car">
        <div className="promo-icon">🚗</div>
        <h4>렌터카</h4>
        <p>{city}에서 이용할 렌터카를 찾아보세요.</p>
        <span className="promo-btn">렌터카 검색</span>
      </div>
    </aside>
  )
}
