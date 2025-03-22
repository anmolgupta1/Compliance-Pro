from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt

# Create a simple Flask app
app = Flask(__name__)

# Connect to your database
engine = create_engine('postgresql://anmolgupta@localhost:5432/compliancepron')
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Create a new password hash
    password = 'admin123'
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Update the admin user's password
    result = session.execute(
        "UPDATE users SET password = :new_password WHERE email = 'admin@compliancepro.com'",
        {"new_password": hashed.decode('utf-8')}
    )
    
    session.commit()
    print(f"Password reset successful! New hash: {hashed.decode('utf-8')[:15]}...")
    print(f"Number of rows updated: {result.rowcount}")
    
except Exception as e:
    session.rollback()
    print(f"Error: {e}")
finally:
    session.close()