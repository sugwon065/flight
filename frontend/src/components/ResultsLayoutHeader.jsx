import './ResultsLayoutHeader.css'

export default function ResultsLayoutHeader() {
  return (
    <header className="rl-header">
      <div className="rl-header-top">
        <div className="rl-header-inner">
          <div className="rl-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#0770e3" />
              <path
                d="M8 14.5L12 10.5L16 14.5L20 10.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>SkyFinder</span>
          </div>

          <nav className="rl-tabs">
            <span className="rl-tab active">항공권</span>
            <span className="rl-tab">숙소</span>
            <span className="rl-tab">렌터카</span>
          </nav>

          <div className="rl-header-actions">
            <span className="rl-action">고객센터</span>
            <span className="rl-action">한국 · 한국어 · ₩ KRW</span>
            <span className="rl-action rl-icon">♡</span>
            <span className="rl-login">로그인</span>
          </div>
        </div>
      </div>
    </header>
  )
}
