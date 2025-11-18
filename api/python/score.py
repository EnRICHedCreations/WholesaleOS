from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add homeharvest-elite to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../homeharvest-elite'))

try:
    import pandas as pd
    from homeharvest.sorting import rank_by_investment_potential
except ImportError:
    pd = None
    rank_by_investment_potential = None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)

            # Check if required libraries are available
            if pd is None or rank_by_investment_potential is None:
                raise ImportError("Required libraries not found")

            # Extract properties from request
            properties = data.get('properties', [])
            if not properties:
                raise ValueError("properties array is required")

            # Convert to DataFrame
            df = pd.DataFrame(properties)

            # Score properties using HomeHarvest Elite investment algorithm
            scored_df = rank_by_investment_potential(df)

            # Convert back to JSON
            scored_df = scored_df.where(scored_df.notna(), None)
            scored_properties = scored_df.to_dict('records')

            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'properties': scored_properties,
                'count': len(scored_properties)
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
            'service': 'score',
            'scoring_available': rank_by_investment_potential is not None
        }).encode())
