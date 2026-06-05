import { useState, useEffect, useCallback } from 'react'
import SearchHome from './components/SearchHome'
import CalendarPopup from './components/CalendarPopup'
import ResultsPage from './components/ResultsPage'
import './App.css'

const API_BASE = '/api'

function formatDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function App() {
  const [page, setPage] = useState('search')
  const [destinations, setDestinations] = useState([])
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [tripDays, setTripDays] = useState(3)
  const [showCalendar, setShowCalendar] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/destinations`)
      .then((r) => r.json())
      .then((data) => {
        setDestinations(data.destinations)
        if (data.destinations.length > 0) {
          setDestination(data.destinations[0])
        }
      })
      .catch(() => setError('서버에 연결할 수 없습니다. 백엔드를 실행해 주세요.'))
  }, [])

  const handleSearch = useCallback(async () => {
    if (!destination || !startDate || !endDate) {
      setError('도착지, 여행기간, 여행날짜를 선택해 주세요.')
      return
    }

    setError('')
    setLoading(true)
    setShowCalendar(false)
    setPage('results')
    setResults([])

    const params = new URLSearchParams({
      destination,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      trip_days: tripDays,
    })

    try {
      const res = await fetch(`${API_BASE}/search?${params}`)
      if (!res.ok) throw new Error('검색 실패')
      const data = await res.json()
      setResults(data)
    } catch {
      setError('검색 중 오류가 발생했습니다.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [destination, startDate, endDate, tripDays])

  const handleBackToSearch = () => {
    setPage('search')
    setError('')
  }

  if (page === 'results') {
    return (
      <ResultsPage
        destination={destination}
        startDate={startDate}
        endDate={endDate}
        tripDays={tripDays}
        results={results}
        loading={loading}
        error={error}
        onBack={handleBackToSearch}
        onSearchAgain={handleBackToSearch}
      />
    )
  }

  return (
    <div className="app">
      <SearchHome
        destination={destination}
        destinations={destinations}
        onDestinationChange={setDestination}
        startDate={startDate}
        endDate={endDate}
        onPeriodClick={() => setShowCalendar(true)}
        tripDays={tripDays}
        onTripDaysChange={setTripDays}
        onSearch={handleSearch}
        loading={loading}
        error={error}
      />

      {showCalendar && (
        <CalendarPopup
          startDate={startDate}
          endDate={endDate}
          onSelectRange={(start, end) => {
            setStartDate(start)
            setEndDate(end)
          }}
          onClose={() => setShowCalendar(false)}
          onSearch={handleSearch}
        />
      )}
    </div>
  )
}
