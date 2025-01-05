from flask import Flask, jsonify, request, session, send_file
from flask_cors import CORS
import psycopg2
from psycopg2 import sql
import pandas as pd
from io import BytesIO
import os
import traceback
import openpyxl

app = Flask(__name__)

app.secret_key = 'your_secret_key'

CORS(app)

connection = psycopg2.connect(
    database="data_retrieval",
    user="postgres",
    password="postgres",
    host="127.0.0.1",
    port="5432"
)

@app.route('/api/login', methods=['POST'])
def login():
    cursor = connection.cursor()
    try:
        # Menerima data JSON dan menampilkan data yang diterima untuk debugging
        data = request.get_json()
        print(f"Request received: {data}")  # Menambahkan print untuk menampilkan data yang diterima

        nik = data.get("nik")
        password = data.get("password")

        print(f"Searching for NIK: {nik}")  # Menampilkan NIK yang sedang dicari

        cursor.execute('SELECT id, name, nik, password, role FROM akun_pegawai WHERE nik = %s', (nik,))
        result = cursor.fetchone()
        print(f"Query result: {result}")  # Menampilkan hasil query untuk debugging

        if result:
            user_id,name, stored_nik, stored_password, role = result

            print(f"Stored password: {stored_password}")  # Menampilkan password yang disimpan di database
            print(f"Input password: {password}")  # Menampilkan password yang dimasukkan oleh pengguna

            if stored_password == password:
                session['user_id'] = user_id
                session['name'] = name
                session['nik'] = stored_nik
                session['role'] = role

                print(f"Password matches, role: {role}")  # Menampilkan bahwa password cocok dan role pengguna

                # Tentukan redirect berdasarkan role
                if role == "admin":
                    redirect_url = "/dashboardadmin"
                elif role == "pegawai":
                    redirect_url = "/dashboarduser"
                else:
                    return jsonify({"status": "error", "message": "Role not recognized"}), 403

                # Commit transaksi jika berhasil
                connection.commit()
                return jsonify({
                    "status": "success",
                    "message": "Login successful",
                    "redirect": redirect_url,
                    "profile": {
                        "user_id": user_id,
                        "name": name,
                        "nik": stored_nik,
                        "role": role
                    }
                })
            else:
                print("Invalid password")  # Menampilkan pesan jika password tidak cocok
                return jsonify({"status": "error", "message": "Invalid password"}), 401
        else:
            print("User not found")  # Menampilkan pesan jika pengguna tidak ditemukan
            return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Error during login: {str(e)}")  # Menampilkan error jika terjadi kesalahan
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "error_details": str(e)
        }), 500
    finally:
        cursor.close()

@app.route('/api/pegawai', methods=['GET'])
def get_all_pegawai():
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM akun_pegawai WHERE role != %s', ('admin',))
        pegawai = cursor.fetchall()

        return jsonify([{
            'id': data[0],
            'name': data[1],
            'nik': data[2],
            'born_date': data[3],
            'phone_number': data[4],
            'password': data[5],
            'role': data[6],
            'department': data[7],
        } for data in pegawai])
    except Exception as e:
        print(f"Error during fetching pegawai: {str(e)}")
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({"status": "error", "message": "Failed to fetch pegawai"}), 500
    finally:
        cursor.close()

@app.route('/api/pegawai', methods=['POST'])
def create_pegawai():
    data = request.get_json()
    
    if not all(key in data for key in ('name', 'nik', 'born_date', 'phone_number', 'password', 'department')):
        return jsonify({'error': 'Missing required fields'}), 400

    cursor = connection.cursor()
    try:
        cursor.execute(
            '''
            INSERT INTO akun_pegawai (name, nik, born_date, phone_number, department, password, role) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''',
            (
                data['name'],
                data['nik'],
                data['born_date'],
                data['phone_number'],
                data['department'],
                data['password'],
                'pegawai'
            )
        )
        connection.commit()  # Commit transaksi
        
        # Retrieve the inserted data and return it as part of the response
        cursor.execute("SELECT id, name, nik, born_date, phone_number, department, role FROM akun_pegawai WHERE nik = %s", (data['nik'],))
        created_data = cursor.fetchone()

        # Build the response with keys and values
        response_data = {
            'id': created_data[0],
            'name': created_data[1],
            'nik': created_data[2],
            'born_date': created_data[3],
            'phone_number': created_data[4],
            'department': created_data[5],
            'role': created_data[6]
        }

        return jsonify({
            'message': 'Pegawai created successfully',
            'data': response_data
        }), 201
    except Exception as e:
        print(f"Error during create pegawai: {str(e)}")
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({"status": "error", "message": "Failed to create pegawai"}), 500
    finally:
        cursor.close()


@app.route('/api/pegawai/<int:id>', methods=['GET'])
def get_pegawai(id):
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM akun_pegawai WHERE id = %s', (id,))
        pegawai = cursor.fetchone()

        if not pegawai:
            return jsonify({'error': 'Pegawai not found'}), 404

        return jsonify({
            'id': pegawai[0],
            'name': pegawai[1],
            'nik': pegawai[2],
            'born_date': pegawai[3],
            'phone_number': pegawai[4],
            'password': pegawai[5],
            'role': pegawai[6],
            'department': pegawai[7],
        })
    except Exception as e:
        print(f"Error during fetching pegawai: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to fetch pegawai"}), 500
    finally:
        cursor.close()

@app.route('/api/pegawai/<int:id>', methods=['PUT'])
def update_pegawai(id):
    data = request.get_json()
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM akun_pegawai WHERE id = %s', (id,))
        pegawai = cursor.fetchone()

        if not pegawai:
            return jsonify({'error': 'Pegawai not found'}), 404

        # Update fields if provided in the request
        for key, value in data.items():
            cursor.execute(
                sql.SQL('UPDATE akun_pegawai SET {} = %s WHERE id = %s').format(sql.Identifier(key)),
                (value, id)
            )
        
        connection.commit()  # Commit transaksi

        # Fetch the updated pegawai data
        cursor.execute('SELECT * FROM akun_pegawai WHERE id = %s', (id,))
        updated_pegawai = cursor.fetchone()

        if updated_pegawai:
            return jsonify({
                'message': 'Pegawai updated successfully',
                'data': {
                    'id': updated_pegawai[0],
                    'name': updated_pegawai[1],
                    'nik': updated_pegawai[2],
                    'born_date': updated_pegawai[3],
                    'phone_number': updated_pegawai[4],
                    'password': updated_pegawai[5],
                    'role': updated_pegawai[6],
                    'department': updated_pegawai[7],
                }
            })
        else:
            return jsonify({'error': 'Failed to retrieve updated pegawai data'}), 500
    except Exception as e:
        print(f"Error during update pegawai: {str(e)}")
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({"status": "error", "message": "Failed to update pegawai"}), 500
    finally:
        cursor.close()

@app.route('/api/pegawai/<int:id>', methods=['DELETE'])
def delete_pegawai(id):
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM akun_pegawai WHERE id = %s', (id,))
        pegawai = cursor.fetchone()

        if not pegawai:
            return jsonify({'error': 'Pegawai not found'}), 404

        cursor.execute('DELETE FROM akun_pegawai WHERE id = %s', (id,))
        connection.commit()  # Commit transaksi

        return jsonify({'message': 'Pegawai deleted successfully'})
    except Exception as e:
        print(f"Error during delete pegawai: {str(e)}")
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({"status": "error", "message": "Failed to delete pegawai"}), 500
    finally:
        cursor.close()

@app.route('/')
def index():
    return jsonify({
        "message": "Aplikasi berjalan dengan baik!"
    })

@app.route('/api/file', methods=['GET'])
def get_all_file():
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM create_file')
        file = cursor.fetchall()

        return jsonify([{
            'id': data[0],
            'nama_file': data[1],
            'creator': data[2],
            'creation_date': data[3],
        } for data in file])
    except Exception as e:
        print(f"Error during fetching file: {str(e)}")
        connection.rollback()  # Rollback transaksi jika terjadi error
        return jsonify({"status": "error", "message": "Failed to fetch file"}), 500
    finally:
        cursor.close()

@app.route('/api/file', methods=['POST'])
def create_file():
    data = request.get_json()

    # Check if required fields are in the request data
    if not all(key in data for key in ('nama_file', 'creator', 'barang')):
        return jsonify({'error': 'Missing required fields'}), 400

    # Extracting the file data
    nama_file = data['nama_file']
    creator = data['creator']
    barang = data['barang']  # List of items to be converted into Excel

    try:
        # Create a pandas DataFrame from the barang data
        df = pd.DataFrame(barang)

        # Ensure that 'creation_date' column is timezone-unaware
        if 'creation_date' in df.columns:
            # Ubah kolom 'creation_date' menjadi datetime, jika ada nilai yang tidak bisa dikonversi, menjadi NaT
            df['creation_date'] = pd.to_datetime(df['creation_date'], errors='coerce', utc=True)
            
            # Hapus informasi timezone jika ada (timezone-unaware)
            df['creation_date'] = df['creation_date'].dt.tz_localize(None)
            
            # Konversi ke format 'YYYY-MM-DD' (contoh: 2020-10-12)
            df['creation_date'] = df['creation_date'].dt.strftime('%Y-%m-%d')

        # Save the DataFrame to a BytesIO object (no styling yet)
        output = BytesIO()
        df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)

        # Now open the generated file with openpyxl to apply styling
        output.seek(0)
        wb = openpyxl.load_workbook(output)
        ws = wb.active

        # Auto-adjust column widths based on content
        for col in ws.columns:
            max_length = 0
            column = col[0].column_letter  # Get the column name
            for cell in col:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(cell.value)
                except:
                    pass
            adjusted_width = (max_length + 2)
            ws.column_dimensions[column].width = adjusted_width

        # Apply some simple styling (bold headers, center alignment)
        for cell in ws[1]:
            cell.font = openpyxl.styles.Font(bold=True)
            cell.alignment = openpyxl.styles.Alignment(horizontal='center', vertical='center')

        # Save the styled file to BytesIO object
        styled_output = BytesIO()
        wb.save(styled_output)
        styled_output.seek(0)

        # Insert file metadata into the database
        cursor = connection.cursor()
        cursor.execute(
            '''
            INSERT INTO create_file (nama_file, creator) 
            VALUES (%s, %s) RETURNING id, nama_file, creator, creation_date
            ''',
            (
                nama_file,
                creator
            )
        )
        connection.commit()  # Commit transaction
        
        created_data = cursor.fetchone()
        if created_data:
            # Convert tuple to dictionary
            result = {
                'id': created_data[0],
                'nama_file': created_data[1],
                'creator': created_data[2],
            }

            # Send the styled file to the client for download
            return send_file(
                styled_output,
                as_attachment=True,
                download_name=f"{nama_file}.xlsx",
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ), 201
        else:
            return jsonify({'error': 'Failed to retrieve created file data'}), 500

    except Exception as e:
        # Log detailed error for debugging
        print(f"Error during file creation: {str(e)}")
        connection.rollback()  # Rollback transaction if error occurs
        return jsonify({"status": "error", "message": "Failed to create file"}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()



if __name__ == '__main__':
    app.run(debug=True)
