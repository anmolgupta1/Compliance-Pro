# init_db.py
from flask import Flask
from werkzeug.security import generate_password_hash
from datetime import datetime
import os
from app.models.models import db, User, Company, ProjectType

app = Flask(__name__)

# Database configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/compliancepron'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://anmolgupta@localhost:5432/compliancepron'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

def init_db():
    """Initialize the database with basic data"""
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if super admin already exists
        if User.query.filter_by(email='admin@compliancepro.com').first():
            print("Super admin already exists!")
            return
        
        # Create super admin user
        super_admin = User(
            email='admin@compliancepro.com',
            password=generate_password_hash('admin123'),  # Change this password in production!
            name='System Administrator',
            role='super_admin',
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(super_admin)
        db.session.commit()
        print("Super admin created successfully!")
        
        # Create default project types
        project_types = [
            {
                'name': 'PCI DSS Assessment',
                'code': 'PCIDSS',
                'category': 'GRC',
                'is_auditable': True
            },
            {
                'name': 'External Penetration Test',
                'code': 'EPT',
                'category': 'Testing',
                'is_auditable': True
            },
            {
                'name': 'Internal Vulnerability Assessment',
                'code': 'IVA',
                'category': 'Testing',
                'is_auditable': True
            },
            {
                'name': 'Application Security Assessment',
                'code': 'ASA',
                'category': 'Testing',
                'is_auditable': True
            },
            {
                'name': 'Segmentation Penetration Test',
                'code': 'SPT',
                'category': 'Testing',
                'is_auditable': True
            }
        ]
        
        for pt_data in project_types:
            project_type = ProjectType(
                name=pt_data['name'],
                code=pt_data['code'],
                category=pt_data['category'],
                is_auditable=pt_data['is_auditable'],
                created_by=super_admin.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(project_type)
        
        db.session.commit()
        print("Default project types created successfully!")
        
        # Create a sample company for testing
        sample_company = Company(
            name='Compliance Pro Demo',
            address='123 Test Street, Test City, 12345',
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(sample_company)
        db.session.commit()
        print("Sample company created successfully!")
        
        # Create a client admin user
        client_admin = User(
            email='client.admin@compliancepro.com',
            password=generate_password_hash('client123'),  # Change this password in production!
            name='Client Administrator',
            designation='IT Director',
            company_id=sample_company.id,
            role='client_admin',
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(client_admin)
        db.session.commit()
        print("Client admin user created successfully!")
        
        print("Database initialization completed successfully!")

if __name__ == "__main__":
    init_db()