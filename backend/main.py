import csv
from datetime import date, datetime, timedelta
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "raw" / "flights.csv"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Flight Deal Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_flights() -> list[dict]:
    flights = []
    with DATA_PATH.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            flights.append(
                {
                    "departure_date": datetime.strptime(
                        row["departure_date"], "%Y-%m-%d"
                    ).date(),
                    "airline_name": row["airline_name"],
                    "airline_type": row["airline_type"],
                    "destination": row["destination"],
                    "price": int(row["price"]),
                }
            )
    return flights


def build_price_index(flights: list[dict]) -> dict[tuple, int]:
    index: dict[tuple, int] = {}
    for flight in flights:
        key = (
            flight["destination"],
            flight["departure_date"],
            flight["airline_name"],
            flight["airline_type"],
        )
        if key not in index or flight["price"] < index[key]:
            index[key] = flight["price"]
    return index


FLIGHTS = load_flights()
PRICE_INDEX = build_price_index(FLIGHTS)
DESTINATIONS = sorted({f["destination"] for f in FLIGHTS})
JAPAN_ALL = "일본 전체"
AIRLINES_BY_DEST = {
    dest: {
        (f["airline_name"], f["airline_type"])
        for f in FLIGHTS
        if f["destination"] == dest
    }
    for dest in DESTINATIONS
}


class SearchResult(BaseModel):
    rank: int
    destination: str
    departure_date: str
    return_date: str
    airline_name: str
    airline_type: str
    outbound_price: int
    return_price: int
    round_trip_price: int
    color: str


RANK_COLORS = {
    1: "#22c55e",
    2: "#86efac",
    3: "#fde047",
    4: "#fb923c",
    5: "#ef4444",
}


def compute_round_trip(
    destination: str,
    departure: date,
    trip_days: int,
) -> list[dict]:
    """왕복 가격 = 출발일 편도 + 귀국일 편도 (동일 항공사)."""
    return_date = departure + timedelta(days=trip_days - 1)
    results = []

    for airline_name, airline_type in AIRLINES_BY_DEST[destination]:
        outbound_key = (destination, departure, airline_name, airline_type)
        return_key = (destination, return_date, airline_name, airline_type)

        outbound_price = PRICE_INDEX.get(outbound_key)
        return_price = PRICE_INDEX.get(return_key)
        if outbound_price is None or return_price is None:
            continue

        results.append(
            {
                "destination": destination,
                "departure_date": departure.isoformat(),
                "return_date": return_date.isoformat(),
                "airline_name": airline_name,
                "airline_type": airline_type,
                "outbound_price": outbound_price,
                "return_price": return_price,
                "round_trip_price": outbound_price + return_price,
            }
        )

    return results


@app.get("/api/destinations")
def get_destinations():
    return {"destinations": [JAPAN_ALL, *DESTINATIONS]}


@app.get("/api/search", response_model=list[SearchResult])
def search_flights(
    destination: str = Query(...),
    start_date: str = Query(..., description="YYYY-MM-DD"),
    end_date: str = Query(..., description="YYYY-MM-DD"),
    trip_days: int = Query(..., ge=1, le=15),
):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid date format") from exc

    if start > end:
        raise HTTPException(status_code=400, detail="start_date must be before end_date")

    if destination != JAPAN_ALL and destination not in DESTINATIONS:
        raise HTTPException(status_code=404, detail="Destination not found")

    search_destinations = DESTINATIONS if destination == JAPAN_ALL else [destination]

    candidates: list[dict] = []
    current = start
    while current <= end:
        for dest in search_destinations:
            candidates.extend(compute_round_trip(dest, current, trip_days))
        current += timedelta(days=1)

    if not candidates:
        return []

    candidates.sort(key=lambda x: x["round_trip_price"])

    seen_keys: set[str] = set()
    top5: list[SearchResult] = []
    for item in candidates:
        if destination == JAPAN_ALL:
            dedupe_key = f"{item['departure_date']}|{item['destination']}"
        else:
            dedupe_key = item["departure_date"]

        if dedupe_key in seen_keys:
            continue
        seen_keys.add(dedupe_key)

        rank = len(top5) + 1
        top5.append(
            SearchResult(
                rank=rank,
                destination=item["destination"],
                departure_date=item["departure_date"],
                return_date=item["return_date"],
                airline_name=item["airline_name"],
                airline_type=item["airline_type"],
                outbound_price=item["outbound_price"],
                return_price=item["return_price"],
                round_trip_price=item["round_trip_price"],
                color=RANK_COLORS[rank],
            )
        )
        if rank >= 5:
            break

    return top5


if STATIC_DIR.exists():
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_index():
        return FileResponse(STATIC_DIR / "index.html")

    @app.get("/{path:path}")
    def serve_spa(path: str):
        if path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")

        file_path = STATIC_DIR / path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
