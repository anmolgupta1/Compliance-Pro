# Import required libraries
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

# Import the models
from app.models.models import db, User, Company, ProjectType

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://anmolgupta@localhost:5432/compliancepron'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key in production

# Initialize the database
db.init_app(app)

# Helper function to create a JWT token

def create_token(user_id, role):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': str(user_id),  # Convert user_id to string
        'role': role
    }
    return jwt.encode(
        payload,
        app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

# Decorator to verify JWT token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        print(f"Auth header received: {auth_header}")
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            print("No token found")
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Print token for debugging
            print(f"Decoding token: {token[:10]}...")
            
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['sub'])
            
            if not current_user:
                print(f"User not found for id: {data.get('sub')}")
                return jsonify({'message': 'User not found!'}), 401
                
            print(f"User authenticated: {current_user.email}")
            
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            return jsonify({'message': 'Invalid token!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# Basic routes
@app.route('/')
def index():
    return jsonify({'message': 'Welcome to Compliance Pro API!'})

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 409
    
    # Create new user
    new_user = User(
        email=data['email'],
        name=data['name'],
        role='client_admin',  # Default role for new registrations
        is_active=True
    )
    new_user.set_password(data['password'])
    
    # Save user to database
    db.session.add(new_user)
    db.session.commit()
    
    # Create JWT token
    token = create_token(new_user.id, new_user.role)
    
    return jsonify({
        'message': 'User registered successfully!',
        'token': token,
        'user': new_user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login attempt for email: {data.get('email')}")
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        print(f"User not found: {data.get('email')}")
        return jsonify({'message': 'Invalid credentials!'}), 401
    
    print(f"Found user: {user.email}, stored password hash: {user.password[:15]}...")
    
    # Verify password using bcrypt
    import bcrypt
    try:
        stored_hash = user.password.encode('utf-8')
        provided_password = data['password'].encode('utf-8')
        print(f"Checking password: '{data['password']}' against stored hash")
        password_valid = bcrypt.checkpw(provided_password, stored_hash)
        print(f"Password valid: {password_valid}")
    except Exception as e:
        print(f"Password verification error: {e}")
        password_valid = False
    
    if not password_valid:
        return jsonify({'message': 'Invalid credentials!'}), 401
    
    # If we get here, authentication succeeded
    # rest of the function...
    
    if not user.is_active:
        return jsonify({'message': 'User is inactive!'}), 401
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.session.commit()

    # Create JWT token
    token = create_token(user.id, user.role)

    user_data = {
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
        # Add other user fields you need
    }
    
    # If you need company data
    if hasattr(user, 'company_id') and user.company_id:
        company = Company.query.get(user.company_id)
        if company:
            user_data['company'] = {
                'id': company.id,
                'name': company.name,
                # Add other company fields
            }
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user_data
    })
    
    # return jsonify({
    #     'message': 'Login successful!',
    #     'token': token,
    #     'user': user.to_dict(include_company=True)
    # })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user):
    # Create user dictionary directly
    user_data = {
        'id': current_user.id,
        'email': current_user.email,
        'name': current_user.name,
        'role': current_user.role,
        # Add other user fields you need
    }
    
    # If you need company data
    if hasattr(current_user, 'company_id') and current_user.company_id:
        company = Company.query.get(current_user.company_id)
        if company:
            user_data['company'] = {
                'id': company.id,
                'name': company.name,
                # Add other company fields
            }
    
    return jsonify({
        'user': user_data
    })

# User routes
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    # Only super_admin and client_admin can access user list
    if current_user.role not in ['super_admin', 'client_admin']:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    # If client_admin, only show users from their company
    if current_user.role == 'client_admin':
        users = User.query.filter_by(company_id=current_user.company_id).all()
    else:
        users = User.query.all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    })

@app.route('/api/users', methods=['POST'])
@token_required
def create_user(current_user):
    # Only super_admin and client_admin can create users
    if current_user.role not in ['super_admin', 'client_admin']:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 409
    
    # If client_admin, they can only create users for their company
    if current_user.role == 'client_admin' and (
        'company_id' not in data or data['company_id'] != current_user.company_id
    ):
        company_id = current_user.company_id
    else:
        company_id = data.get('company_id')
    
    # Create new user
    new_user = User(
        email=data['email'],
        name=data['name'],
        phone=data.get('phone'),
        designation=data.get('designation'),
        company_id=company_id,
        role=data['role'],
        is_active=True
    )
    new_user.set_password(data['password'])
    
    # Save user to database
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully!',
        'user': new_user.to_dict()
    }), 201

# Company routes
@app.route('/api/companies', methods=['GET'])
@token_required
def get_companies(current_user):
    # Super admin can see all companies
    if current_user.role == 'super_admin':
        companies = Company.query.all()
    # Others can only see their own company
    else:
        companies = Company.query.filter_by(id=current_user.company_id).all()
    
    return jsonify({
        'companies': [company.to_dict() for company in companies]
    })

@app.route('/api/companies', methods=['POST'])
@token_required
def create_company(current_user):
    # Only super_admin can create companies
    if current_user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    # Create new company
    new_company = Company(
        name=data['name'],
        address=data.get('address'),
        is_active=True
    )
    
    # Save company to database
    db.session.add(new_company)
    db.session.commit()
    
    return jsonify({
        'message': 'Company created successfully!',
        'company': new_company.to_dict()
    }), 201

# Project routes
@app.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    # Get projects based on user role
    if current_user.role == 'super_admin':
        # Super admin can see all projects
        projects = Project.query.all()
    elif current_user.role == 'client_admin':
        # Client admin can see all projects in their company
        projects = Project.query.filter_by(company_id=current_user.company_id).all()
    else:
        # Other roles can only see projects they're assigned to
        project_users = ProjectUser.query.filter_by(user_id=current_user.id).all()
        project_ids = [pu.project_id for pu in project_users]
        projects = Project.query.filter(Project.id.in_(project_ids)).all()
    
    return jsonify({
        'projects': [project.to_dict(include_company=True, include_project_type=True) for project in projects]
    })

@app.route('/api/projects', methods=['POST'])
@token_required
def create_project(current_user):
    # Only super_admin and client_admin can create projects
    if current_user.role not in ['super_admin', 'client_admin']:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    # If client_admin, they can only create projects for their company
    if current_user.role == 'client_admin' and (
        'company_id' not in data or data['company_id'] != current_user.company_id
    ):
        company_id = current_user.company_id
    else:
        company_id = data.get('company_id')
    
    # Create new project
    new_project = Project(
        name=data['name'],
        company_id=company_id,
        project_type_id=data['project_type_id'],
        status='in_progress',
        created_by=current_user.id
    )
    
    # Save project to database
    db.session.add(new_project)
    db.session.commit()
    
    # If project owner is specified, assign them to the project
    if 'project_owner_id' in data:
        project_user = ProjectUser(
            project_id=new_project.id,
            user_id=data['project_owner_id'],
            role='project_owner'
        )
        db.session.add(project_user)
        db.session.commit()
    
    return jsonify({
        'message': 'Project created successfully!',
        'project': new_project.to_dict()
    }), 201

# Run the application
if __name__ == '__main__':
    # Create all tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the app
    app.run(debug=True, port=5001)