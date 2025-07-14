# URL Shortener Frontend

![App Screenshot 1](./frontend/assets/URLShortner.png)
A professional, responsive React web application for shortening URLs and viewing analytics, built with Material UI and JavaScript.

## Features

![App Screenshot 2](./frontend/assets/stats.png)

- **Shorten up to 5 URLs at once** with optional custom shortcode and validity period
- **Client-side validation** for URLs, validity, and shortcode
- **View analytics** for all shortened URLs in the current session
- **Detailed statistics**: click count, click details (timestamp, referrer, geo-location)
- **Modern, clean UI** using Material UI
- **Integrated with backend microservice** for all URL logic and analytics

## Tech Stack
- React (JavaScript)
- Material UI
- Axios
- React Router DOM

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Backend URL Shortener microservice running (see backend/README.md)

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

### Usage
- **Shorten URLs:**
  - Enter up to 5 long URLs, with optional validity (in minutes) and custom shortcode.
  - Click "Shorten" to generate short links.
  - Results are displayed with expiry information.
- **View Statistics:**
  - Navigate to the "Statistics" page to see analytics for all URLs shortened in this session.
  - View click count and detailed click data (timestamp, referrer, geo-location).

### Customization
- To change the backend API URL, edit the `API_BASE` constant in `src/pages/ShortenerPage.js` and `src/pages/StatisticsPage.js`.

## Folder Structure
```
frontend/
  src/
    components/
      UrlShortenerForm.js
    pages/
      ShortenerPage.js
      StatisticsPage.js
    App.js
    index.js
  assets/
    screenshot1.png
    screenshot2.png
```

## License
This project is for educational and demonstration purposes.
