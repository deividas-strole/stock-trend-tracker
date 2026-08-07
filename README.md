# Stock Trend Tracker by Deividas Strole

An application that pulls stock market data and surfaces short-term trend estimates using technical indicators — built with Java (Spring Boot) on the backend and React on the frontend.

## Disclaimer

This project does **not** predict future stock prices. Markets are highly unpredictable, and no algorithm here (or anywhere) can reliably forecast them. What this app *does* provide is **trend estimation** based on historical price data and well-known technical indicators (moving averages, RSI, momentum, linear regression). It's a learning/portfolio project, not financial advice, and should never be used to make real investment decisions.

## Features

- Fetch and store historical stock price data for a given symbol
- Calculate technical indicators:
  - Simple/Exponential Moving Averages (SMA/EMA)
  - Relative Strength Index (RSI)
  - MACD
  - Short-term linear regression trend line
- REST API exposing trend/estimate data per symbol
- React dashboard with price charts and trend overlays

## Tech Stack

**Backend**
- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL (or MySQL)
- Jackson (JSON serialization)

**Frontend**
- React
- Recharts / Chart.js for visualizations

**Data Source**
- Alpha Vantage / IEX Cloud / Twelve Data (TBD — see ticket in project board)

## Project Structure

```
stock-trend-tracker/
├── backend/          # Spring Boot application
├── frontend/          # React application
└── README.md
```

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Maven or Gradle
- PostgreSQL (or your DB of choice)

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Roadmap

See the [Project Board](#) for current status. High-level milestones:

- [ ] Project scaffolding (backend + frontend)
- [ ] Market data ingestion service
- [ ] Stock price storage schema
- [ ] Trend/indicator calculation module
- [ ] REST API for trend estimates
- [ ] React dashboard
- [ ] (Stretch) AI/ML-based prediction service

## License

TBD

## Connect

* [Deividas Strole](https://deividasstrole.com)
* [LinkedIn](https://linkedin.com/in/deividas-strole)
* [YouTube](https://youtube.com/@deividas-strole)
* [Dev.to](https://dev.to/deividas-strole)
* [Medium](https://medium.com/@deividas-strole)
* [X](https://x.com/deividasstrole)
* [Lake Apps](https://lakeapps.com)
  
If you enjoyed this project, consider starring the repository to support the work of **Deividas Strole**.

© Deividas Strole. All rights reserved.
