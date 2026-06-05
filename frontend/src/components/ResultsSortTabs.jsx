import './ResultsSortTabs.css'

function formatPrice(price) {
  if (!price) return '—'
  return '₩' + price.toLocaleString('ko-KR')
}

export default function ResultsSortTabs({ results, activeTab, onTabChange }) {
  const cheapest = results[0]?.round_trip_price

  const tabs = [
    { id: 'recommend', label: '추천순', price: cheapest, meta: '평균 2시간 10분' },
    { id: 'cheapest', label: '최저가', price: cheapest, meta: '평균 2시간 15분' },
    { id: 'fastest', label: '최단여행시간', price: cheapest, meta: '평균 1시간 45분' },
  ]

  return (
    <div className="sort-tabs-wrap">
      <div className="sort-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`sort-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="sort-tab-label">{tab.label}</span>
            <span className="sort-tab-price">{formatPrice(tab.price)}</span>
            <span className="sort-tab-meta">{tab.meta}</span>
          </button>
        ))}
      </div>
      <div className="sort-dropdown">
        <span>정렬</span>
        <span className="sort-chevron">▾</span>
      </div>
    </div>
  )
}
