# import os

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
#         'postgresql://youruser:yourpassword@db:5432/yourdb'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False

# # app/config.py
import os

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
#     SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/compliancepro'  # Replace 'yourdb' with your database name
#     SQLALCHEMY_TRACK_MODIFICATIONS = False


class Config:
    SECRET_KEY = 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = 'postgresql://anmolgupta@localhost/compliancepron'
    SQLALCHEMY_TRACK_MODIFICATIONS = False