from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "your-secret-key")

# Initialize Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add-asset', methods=['GET', 'POST'])
def add_asset():
    if request.method == 'POST':
        try:
            data = request.form.to_dict()
            required_fields = ['asset_id', 'asset_name', 'qr_code_number', 'location', 'installation_date']
            
            for field in required_fields:
                if not data.get(field):
                    flash(f'Missing required field: {field}', 'error')
                    return redirect(url_for('add_asset'))

            data['status'] = data.get('status', 'active')

            result = supabase.table('municipal_assets').insert(data).execute()
            flash('Asset created successfully!', 'success')
            return redirect(url_for('view_assets'))

        except Exception as e:
            flash(f'Error creating asset: {str(e)}', 'error')
            return redirect(url_for('add_asset'))
            
    return render_template('add_asset.html')

@app.route('/view-assets')
def view_assets():
    try:
        result = supabase.table('municipal_assets').select('*').execute()
        assets = result.data
        return render_template('view_assets.html', assets=assets)
    except Exception as e:
        flash(f'Error loading assets: {str(e)}', 'error')
        return render_template('view_assets.html', assets=[])

@app.route('/assets/<asset_id>', methods=['PUT'])
def update_asset(asset_id):
    try:
        data = request.json
        result = supabase.table('municipal_assets').update(data).eq('id', asset_id).execute()
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/assets/<asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    try:
        result = supabase.table('municipal_assets').delete().eq('id', asset_id).execute()
        return jsonify({'message': 'Asset deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 