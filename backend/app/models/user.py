# from app import db
# import bcrypt
# from datetime import datetime

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password_hash = db.Column(db.String(128))
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     def set_password(self, password):
#         salt = bcrypt.gensalt()
#         self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

#     def check_password(self, password):
#         return bcrypt.checkpw(password.encode('utf-8'), 
#                             self.password_hash.encode('utf-8'))

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'email': self.email,
#             'created_at': self.created_at.isoformat()
#         }

from app import db
import bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # def set_password(self, password):
    #     salt = bcrypt.gensalt()
    #     self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    #     def check_password(self, password):
    #         return bcrypt.checkpw(
    #             password.encode('utf-8'),
    #             self.password_hash.encode('utf-8')
    #         )
        
    #     # In your User model
    # import bcrypt

def set_password(self, password):
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    self.password = hashed.decode('utf-8')  # Store as string in the database

def check_password(self, password):
    # Convert the stored password hash from string to bytes
    stored_hash = self.password.encode('utf-8')
    
    # Convert the provided password to bytes and check against stored hash
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash)