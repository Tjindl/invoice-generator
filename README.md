# Estimate Generator

A React-based web application for generating professional estimates with product-specific tracking and PDF export capabilities.

## Features

- Password-protected access
- Product type management (Plate, Channel, Balli, Farma)
- Separate balance tracking for each product type
- Automatic rate calculation based on product type
- PDF generation with professional layout
- Responsive design
- Easy-to-use interface

## Technologies Used

- React + Vite
- HTML2PDF for PDF generation
- Environment variables for secure configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Tjindl/invoice-generator.git
```

2. Install dependencies:
```bash
cd invoice-generator
npm install
```

3. Create a `.env` file in the root directory and add your password:
```
VITE_APP_PASSWORD=your-password-here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter the password to access the application
2. Fill in customer details
3. Select product type (rates are preset)
4. Add entries with dates and quantities
5. Generate PDF estimates with product-wise subtotals

## Product Types and Rates

- Plate: Rs. 1.20 per day per item
- Channel: Rs. 1.20 per day per item
- Balli: Rs. 1.10 per day per item
- Farma: Rs. 90 per day per item

## Security

The application is protected by a password stored in environment variables. Make sure to:
- Never commit your .env file
- Set up proper environment variables in your hosting platform
- Keep your password secure

## License

MIT License
