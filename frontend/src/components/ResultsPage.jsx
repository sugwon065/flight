import { useState } from 'react'
import ResultsLayoutHeader from './ResultsLayoutHeader'
import ResultsSearchBar from './ResultsSearchBar'
import FilterSidebar from './FilterSidebar'
import PromoSidebar from './PromoSidebar'
import ResultsSortTabs from './ResultsSortTabs'
import CalendarView from './CalendarView'
import ResultsList from './ResultsList'
import './ResultsPage.css'
import './FilterSidebar.css'

export default function ResultsPage({
  destination,
  startDate,
  endDate,
  tripDays,
  results,
  loading,
  error,
  onBack,
  onSearchAgain,
}) {
  const [timeOpen, setTimeOpen] = useState(true)
  const [sortTab, setSortTab] = useState('recommend')

  const initialMonth = startDate ? startDate.getMonth() : 0
  const initialYear = startDate ? startDate.getFullYear() : 2026

  return (
    <div className="results-page">
      <ResultsLayoutHeader />
      <ResultsSearchBar
        destination={destination}
        startDate={startDate}
        endDate={endDate}
        tripDays={tripDays}
        onBack={onBack}
      />

      <div className="results-shell">
        <div className="results-grid">
          <div className="results-col-left">
            <FilterSidebar
              timeOpen={timeOpen}
              onToggleTime={() => setTimeOpen((v) => !v)}
            />
          </div>

          <main className="results-col-center">
            {!loading && results.length > 0 && (
              <ResultsSortTabs
                results={results}
                activeTab={sortTab}
                onTabChange={setSortTab}
              />
            )}

            {error && <p className="results-page-error">{error}</p>}

            {!loading && results.length > 0 && (
              <div className="results-calendar-panel">
                <h3 className="results-calendar-title">
                  {destination === '일본 전체'
                    ? '일본 전체 최저가 출발일 · 왕복 여행 기간'
                    : '최저가 출발일 · 왕복 여행 기간'}
                </h3>
                <CalendarView
                  startDate={startDate}
                  endDate={endDate}
                  results={results}
                  tripRanges={results.map((r) => ({
                    start: r.departure_date,
                    end: r.return_date,
                    color: r.color,
                    rank: r.rank,
                  }))}
                  readOnly
                  initialYear={initialYear}
                  initialMonth={initialMonth}
                  title="출발일 순위"
                />
              </div>
            )}

            <ResultsList
              results={results}
              loading={loading}
              tripDays={tripDays}
              destination={destination}
              embedded
              showPromo
            />

            {!loading && (
              <button className="search-again-btn" onClick={onSearchAgain} type="button">
                조건 변경하고 다시 검색
              </button>
            )}
          </main>

          <PromoSidebar destination={destination} />
        </div>
      </div>
    </div>
  )
}
