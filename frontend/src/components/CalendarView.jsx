import { useState } from 'react'
import './CalendarView.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export function toDateStr(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getRangeLineType(date, rangeStart, rangeEnd) {
  if (!rangeStart || !rangeEnd) return null

  const time = date.getTime()
  const start = rangeStart.getTime()
  const end = rangeEnd.getTime()
  if (time < start || time > end) return null
  if (start === end) return 'single'
  if (time === start) return 'start'
  if (time === end) return 'end'
  return 'middle'
}

function getLineClass(lineType, date) {
  if (!lineType) return ''
  const dow = date.getDay()
  let extra = ''
  if (lineType === 'start' && dow === 0) extra = ' range-line--week-start'
  if (lineType === 'end' && dow === 6) extra = ' range-line--week-end'
  return `range-line--${lineType}${extra}`
}

function MonthCalendar({ year, month, startDate, endDate, onDayClick, tripRanges, readOnly }) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(year, month)
  const cells = []

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="cal-day empty" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateStr = toDateStr(date)

    const tripLines = (tripRanges || [])
      .map((trip) => {
        const tripStart = new Date(trip.start + 'T00:00:00')
        const tripEnd = new Date(trip.end + 'T00:00:00')
        const lineType = getRangeLineType(date, tripStart, tripEnd)
        if (!lineType) return null
        return { type: lineType, color: trip.color, rank: trip.rank }
      })
      .filter(Boolean)

    let className = 'cal-day'
    if (startDate && toDateStr(startDate) === dateStr) className += ' selected-start'
    if (endDate && toDateStr(endDate) === dateStr) className += ' selected-end'
    if (startDate && endDate && date > startDate && date < endDate) className += ' in-range'
    if (readOnly) className += ' readonly'

    cells.push(
      <button
        key={day}
        className={className}
        onClick={readOnly ? undefined : () => onDayClick?.(date)}
        type="button"
        disabled={readOnly}
      >
        <span className="day-num">{day}</span>
        {tripLines.length > 0 && (
          <div className="day-lines" aria-hidden="true">
            {tripLines.map((line) => (
              <span
                key={`trip-${line.rank}`}
                className={`range-line range-line--trip ${getLineClass(line.type, date)}`}
                style={{
                  '--trip-color': line.color,
                  bottom: `${4 + (line.rank - 1) * 4}px`,
                }}
              />
            ))}
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="month-cal">
      <div className="month-title">
        {year}년 {MONTHS[month]}
      </div>
      <div className="weekday-row">
        {WEEKDAYS.map((w) => (
          <span key={w} className="weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="days-grid">{cells}</div>
    </div>
  )
}

export default function CalendarView({
  startDate,
  endDate,
  onDayClick,
  results = [],
  tripRanges = [],
  readOnly = false,
  initialYear = 2026,
  initialMonth = 0,
  showNav = true,
  title,
}) {
  const [viewYear, setViewYear] = useState(initialYear)
  const [viewMonth, setViewMonth] = useState(initialMonth)

  const month2 = viewMonth === 11 ? 0 : viewMonth + 1
  const year2 = viewMonth === 11 ? viewYear + 1 : viewYear

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div className={`calendar-view ${readOnly ? 'calendar-view--readonly' : ''}`}>
      {showNav && (
        <div className="cal-header">
          <button className="cal-nav" onClick={prevMonth} type="button">
            ‹
          </button>
          <span className="cal-header-title">{title || '여행 가능 기간'}</span>
          <button className="cal-nav" onClick={nextMonth} type="button">
            ›
          </button>
        </div>
      )}

      <div className="cal-months">
        <MonthCalendar
          year={viewYear}
          month={viewMonth}
          startDate={startDate}
          endDate={endDate}
          onDayClick={onDayClick}
          tripRanges={tripRanges}
          readOnly={readOnly}
        />
        <MonthCalendar
          year={year2}
          month={month2}
          startDate={startDate}
          endDate={endDate}
          onDayClick={onDayClick}
          tripRanges={tripRanges}
          readOnly={readOnly}
        />
      </div>

      {results.length > 0 && (
        <div className="rank-legend">
          {results.map((r) => (
            <span key={r.rank} className="legend-item">
              <span className="legend-line" style={{ background: r.color }} />
              {r.rank}위 왕복
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
