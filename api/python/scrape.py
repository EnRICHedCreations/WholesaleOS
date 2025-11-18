from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add homeharvest-elite to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../homeharvest-elite'))

try:
    from homeharvest import scrape_property
except ImportError:
    # Fallback for development
    scrape_property = None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)

            # Check if HomeHarvest is available
            if scrape_property is None:
                raise ImportError("HomeHarvest Elite library not found")

            # Extract parameters from request
            location = data.get('location')
            if not location:
                raise ValueError("location parameter is required")

            # Build scraping parameters
            scrape_params = {
                'location': location,
                'past_hours': data.get('past_hours', 1),
                'return_type': 'pandas',
                'clean_data': True,
                'add_derived_fields': True,
            }

            # Add optional parameters if provided
            optional_params = [
                'preset', 'listing_type', 'property_type', 'radius', 'mls_only',
                'price_min', 'price_max', 'beds_min', 'beds_max',
                'baths_min', 'baths_max', 'sqft_min', 'sqft_max',
                'lot_sqft_min', 'lot_sqft_max', 'year_built_min', 'year_built_max',
                'hoa_fee_min', 'hoa_fee_max', 'stories_min', 'stories_max',
                'garage_spaces_min', 'has_pool', 'has_garage', 'waterfront', 'has_view'
            ]

            for param in optional_params:
                if param in data and data[param] is not None:
                    scrape_params[param] = data[param]

            # Call HomeHarvest Elite scrape function
            df = scrape_property(**scrape_params)

            # Convert DataFrame to JSON
            if df is not None and len(df) > 0:
                # Replace NaN values with None
                df = df.where(df.notna(), None)
                properties = df.to_dict('records')

                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'properties': properties,
                    'count': len(properties)
                }).encode())
            else:
                # No properties found
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'properties': [],
                    'count': 0
                }).encode())

        except ValueError as e:
            # Bad request
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode())

        except Exception as e:
            # Internal server error
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode())

    def do_GET(self):
        # Health check endpoint
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            'status': 'ok',
            'service': 'scrape',
            'homeharvest_available': scrape_property is not None
        }).encode())
