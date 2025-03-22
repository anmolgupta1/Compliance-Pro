# models/models.py
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt

db = SQLAlchemy()

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    logo_path = db.Column(db.String(255))
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    users = db.relationship('User', backref='company', lazy=True)
    projects = db.relationship('Project', backref='company', lazy=True)
    vulnerabilities = db.relationship('Vulnerability', backref='company', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'logo_path': self.logo_path,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50))
    designation = db.Column(db.String(255))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    role = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    project_users = db.relationship('ProjectUser', backref='user', lazy=True)
    created_projects = db.relationship('Project', backref='creator', lazy=True, foreign_keys='Project.created_by')
    assigned_project_evidences = db.relationship('ProjectEvidence', backref='assignee', lazy=True, foreign_keys='ProjectEvidence.assigned_to')
    assigned_action_items = db.relationship('ActionItem', backref='assignee', lazy=True, foreign_keys='ActionItem.assigned_to')
    assigned_tickets = db.relationship('SupportTicket', backref='assignee', lazy=True, foreign_keys='SupportTicket.assigned_to')
    created_tickets = db.relationship('SupportTicket', backref='requester', lazy=True, foreign_keys='SupportTicket.requester_id')
    notification_settings = db.relationship('NotificationSetting', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    audit_logs = db.relationship('AuditLog', backref='user', lazy=True)
    
    # In your User model

def check_password(self, password):
    try:
        import bcrypt
        # Convert the stored password hash from string to bytes
        stored_hash = self.password.encode('utf-8')
        
        # Convert the provided password to bytes and check against stored hash
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash)
    except ImportError:
        # Fallback in case bcrypt is not available
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password, password)

def set_password(self, password):
    try:
        import bcrypt
        # Generate a salt and hash the password
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        self.password = hashed.decode('utf-8')  # Store as string in the database
    except ImportError:
        # Fallback in case bcrypt is not available
        from werkzeug.security import generate_password_hash
        self.password = generate_password_hash(password)


    # def set_password(self, password):
    #     self.password = generate_password_hash(password)
    
    # def check_password(self, password):
    #     return check_password_hash(self.password, password)
    
    
    def to_dict(self, include_company=False):
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'designation': self.designation,
            'company_id': self.company_id,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active
        }
        
        if include_company and self.company:
            data['company'] = self.company.to_dict()
        
        return data


class ProjectType(db.Model):
    __tablename__ = 'project_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50))
    is_auditable = db.Column(db.Boolean, default=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    projects = db.relationship('Project', backref='project_type', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'category': self.category,
            'is_auditable': self.is_auditable,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    project_type_id = db.Column(db.Integer, db.ForeignKey('project_types.id'), nullable=False)
    status = db.Column(db.String(50))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project_users = db.relationship('ProjectUser', backref='project', lazy=True)
    project_plan = db.relationship('ProjectPlan', backref='project', lazy=True, uselist=False)
    project_evidences = db.relationship('ProjectEvidence', backref='project', lazy=True)
    action_items = db.relationship('ActionItem', backref='project', lazy=True)
    testing_scopes = db.relationship('TestingScope', backref='project', lazy=True)
    scan_results = db.relationship('ScanResult', backref='project', lazy=True)
    soa_items = db.relationship('SOA', backref='project', lazy=True)
    
    def to_dict(self, include_company=False, include_project_type=False, include_stats=False):
        data = {
            'id': self.id,
            'name': self.name,
            'company_id': self.company_id,
            'project_type_id': self.project_type_id,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_company and self.company:
            data['company'] = self.company.to_dict()
            
        if include_project_type and self.project_type:
            data['project_type'] = self.project_type.to_dict()
            
        if include_stats:
            # Calculate evidence stats
            total_evidence = len(self.project_evidences)
            completed_evidence = sum(1 for e in self.project_evidences if e.status == 'completed')
            
            # Calculate action item stats
            total_actions = len(self.action_items)
            closed_actions = sum(1 for a in self.action_items if a.status == 'closed')
            
            data['stats'] = {
                'total_evidence': total_evidence,
                'completed_evidence': completed_evidence,
                'evidence_completion_percentage': (completed_evidence / total_evidence * 100) if total_evidence > 0 else 0,
                'total_actions': total_actions,
                'closed_actions': closed_actions,
                'action_completion_percentage': (closed_actions / total_actions * 100) if total_actions > 0 else 0
            }
        
        return data


class ProjectUser(db.Model):
    __tablename__ = 'project_users'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('project_id', 'user_id'),)
    
    def to_dict(self, include_user=False, include_project=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'user_id': self.user_id,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_user and self.user:
            data['user'] = self.user.to_dict()
            
        if include_project and self.project:
            data['project'] = self.project.to_dict()
            
        return data


class ProjectPlan(db.Model):
    __tablename__ = 'project_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    estimated_end_date = db.Column(db.Date)
    actual_end_date = db.Column(db.Date)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    milestones = db.relationship('Milestone', backref='project_plan', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_milestones=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'estimated_end_date': self.estimated_end_date.isoformat() if self.estimated_end_date else None,
            'actual_end_date': self.actual_end_date.isoformat() if self.actual_end_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_milestones:
            data['milestones'] = [milestone.to_dict() for milestone in self.milestones]
            
        return data


class Milestone(db.Model):
    __tablename__ = 'milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    project_plan_id = db.Column(db.Integer, db.ForeignKey('project_plans.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_plan_id': self.project_plan_id,
            'name': self.name,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ComplianceStandard(db.Model):
    __tablename__ = 'compliance_standards'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    version = db.Column(db.String(50))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requirements = db.relationship('Requirement', backref='compliance_standard', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_requirements=False):
        data = {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'version': self.version,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_requirements:
            data['requirements'] = [req.to_dict() for req in self.requirements]
            
        return data


class Requirement(db.Model):
    __tablename__ = 'requirements'
    
    id = db.Column(db.Integer, primary_key=True)
    compliance_standard_id = db.Column(db.Integer, db.ForeignKey('compliance_standards.id'), nullable=False)
    requirement_number = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, db.ForeignKey('requirements.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    children = db.relationship('Requirement', backref=db.backref('parent', remote_side=[id]), lazy=True)
    evidence_mappings = db.relationship('EvidenceRequirementMapping', backref='requirement', lazy=True)
    soa_items = db.relationship('SOA', backref='requirement', lazy=True)
    action_items = db.relationship('ActionItem', backref='requirement', lazy=True)
    group_mappings = db.relationship('RequirementGroupMapping', backref='requirement', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    __table_args__ = (db.UniqueConstraint('compliance_standard_id', 'requirement_number'),)
    
    def to_dict(self, include_children=False, include_evidence=False):
        data = {
            'id': self.id,
            'compliance_standard_id': self.compliance_standard_id,
            'requirement_number': self.requirement_number,
            'title': self.title,
            'description': self.description,
            'parent_id': self.parent_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_children:
            data['children'] = [child.to_dict() for child in self.children]
            
        if include_evidence:
            data['evidence_items'] = [mapping.evidence_item.to_dict() for mapping in self.evidence_mappings]
            
        return data


class RequirementGroup(db.Model):
    __tablename__ = 'requirement_groups'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requirement_mappings = db.relationship('RequirementGroupMapping', backref='group', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_requirements=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_requirements:
            data['requirements'] = [mapping.requirement.to_dict() for mapping in self.requirement_mappings]
            
        return data


class RequirementGroupMapping(db.Model):
    __tablename__ = 'requirement_group_mappings'
    
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('requirement_groups.id'), nullable=False)
    requirement_id = db.Column(db.Integer, db.ForeignKey('requirements.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    
    __table_args__ = (db.UniqueConstraint('group_id', 'requirement_id'),)


class EvidenceItem(db.Model):
    __tablename__ = 'evidence_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    evidence_type = db.Column(db.String(100))
    sub_item = db.Column(db.String(100))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requirement_mappings = db.relationship('EvidenceRequirementMapping', backref='evidence_item', lazy=True)
    project_evidences = db.relationship('ProjectEvidence', backref='evidence_item', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_requirements=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'evidence_type': self.evidence_type,
            'sub_item': self.sub_item,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_requirements:
            data['requirements'] = [mapping.requirement.to_dict() for mapping in self.requirement_mappings]
            
        return data


class EvidenceRequirementMapping(db.Model):
    __tablename__ = 'evidence_requirement_mappings'
    
    id = db.Column(db.Integer, primary_key=True)
    evidence_id = db.Column(db.Integer, db.ForeignKey('evidence_items.id'), nullable=False)
    requirement_id = db.Column(db.Integer, db.ForeignKey('requirements.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    
    __table_args__ = (db.UniqueConstraint('evidence_id', 'requirement_id'),)


class ProjectEvidence(db.Model):
    __tablename__ = 'project_evidences'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    evidence_id = db.Column(db.Integer, db.ForeignKey('evidence_items.id'), nullable=False)
    status = db.Column(db.String(50))
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    evidence_uploads = db.relationship('EvidenceUpload', backref='project_evidence', lazy=True)
    
    __table_args__ = (db.UniqueConstraint('project_id', 'evidence_id'),)
    
    def to_dict(self, include_uploads=False, include_evidence_item=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'evidence_id': self.evidence_id,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_uploads:
            data['uploads'] = [upload.to_dict() for upload in self.evidence_uploads]
            
        if include_evidence_item and self.evidence_item:
            data['evidence_item'] = self.evidence_item.to_dict()
            
        return data


class EvidenceUpload(db.Model):
    __tablename__ = 'evidence_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    project_evidence_id = db.Column(db.Integer, db.ForeignKey('project_evidences.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    file_size = db.Column(db.Integer)
    status = db.Column(db.String(50))
    comments = db.Column(db.Text)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    
    # Relationships
    uploader = db.relationship('User', foreign_keys=[uploaded_by])
    reviewer = db.relationship('User', foreign_keys=[reviewed_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_evidence_id': self.project_evidence_id,
            'file_path': self.file_path,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'status': self.status,
            'comments': self.comments,
            'uploaded_by': self.uploaded_by,
            'reviewed_by': self.reviewed_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }


class SOA(db.Model):
    __tablename__ = 'soa'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    requirement_id = db.Column(db.Integer, db.ForeignKey('requirements.id'), nullable=False)
    is_applicable = db.Column(db.Boolean, default=True)
    justification = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    
    __table_args__ = (db.UniqueConstraint('project_id', 'requirement_id'),)
    
    def to_dict(self, include_requirement=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'requirement_id': self.requirement_id,
            'is_applicable': self.is_applicable,
            'justification': self.justification,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_requirement and self.requirement:
            data['requirement'] = self.requirement.to_dict()
            
        return data


class ActionItem(db.Model):
    __tablename__ = 'action_items'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    requirement_id = db.Column(db.Integer, db.ForeignKey('requirements.id'))
    observation = db.Column(db.Text)
    action_point = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(50))
    status = db.Column(db.String(50))
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    department = db.Column(db.String(100))
    target_date = db.Column(db.Date)
    is_evidence_required = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    evidences = db.relationship('ActionEvidence', backref='action_item', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_evidences=False, include_requirement=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'requirement_id': self.requirement_id,
            'observation': self.observation,
            'action_point': self.action_point,
            'severity': self.severity,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'department': self.department,
            'target_date': self.target_date.isoformat() if self.target_date else None,
            'is_evidence_required': self.is_evidence_required,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_evidences:
            data['evidences'] = [evidence.to_dict() for evidence in self.evidences]
            
        if include_requirement and self.requirement:
            data['requirement'] = self.requirement.to_dict()
            
        return data


class ActionEvidence(db.Model):
    __tablename__ = 'action_evidences'
    
    id = db.Column(db.Integer, primary_key=True)
    action_item_id = db.Column(db.Integer, db.ForeignKey('action_items.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    file_size = db.Column(db.Integer)
    status = db.Column(db.String(50))
    comments = db.Column(db.Text)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    
    # Relationships
    uploader = db.relationship('User', foreign_keys=[uploaded_by])
    reviewer = db.relationship('User', foreign_keys=[reviewed_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'action_item_id': self.action_item_id,
            'file_path': self.file_path,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'status': self.status,
            'comments': self.comments,
            'uploaded_by': self.uploaded_by,
            'reviewed_by': self.reviewed_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }


class TestingScope(db.Model):
    __tablename__ = 'testing_scopes'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    scope_type = db.Column(db.String(50))
    scope_value = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    scan_results = db.relationship('ScanResult', backref='scope', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_scan_results=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'scope_type': self.scope_type,
            'scope_value': self.scope_value,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_scan_results:
            data['scan_results'] = [result.to_dict() for result in self.scan_results]
            
        return data


class Vulnerability(db.Model):
    __tablename__ = 'vulnerabilities'
    
    id = db.Column(db.Integer, primary_key=True)
    cve_id = db.Column(db.String(50))
    name = db.Column(db.String(255), nullable=False)
    cvss_score = db.Column(db.Numeric(3, 1))
    affected_systems = db.Column(db.Text)
    description = db.Column(db.Text)
    status = db.Column(db.String(50))
    remediation_steps = db.Column(db.Text)
    date_published = db.Column(db.Date)
    date_patched = db.Column(db.Date)
    is_custom = db.Column(db.Boolean, default=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    scan_results = db.relationship('ScanResult', backref='vulnerability', lazy=True)
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_scan_results=False):
        data = {
            'id': self.id,
            'cve_id': self.cve_id,
            'name': self.name,
            'cvss_score': float(self.cvss_score) if self.cvss_score else None,
            'affected_systems': self.affected_systems,
            'description': self.description,
            'status': self.status,
            'remediation_steps': self.remediation_steps,
            'date_published': self.date_published.isoformat() if self.date_published else None,
            'date_patched': self.date_patched.isoformat() if self.date_patched else None,
            'is_custom': self.is_custom,
            'company_id': self.company_id,
            'project_id': self.project_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_scan_results:
            data['scan_results'] = [result.to_dict() for result in self.scan_results]
            
        return data


class ScanResult(db.Model):
    __tablename__ = 'scan_results'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    scope_id = db.Column(db.Integer, db.ForeignKey('testing_scopes.id'), nullable=False)
    vulnerability_id = db.Column(db.Integer, db.ForeignKey('vulnerabilities.id'), nullable=False)
    proof_of_concept = db.Column(db.Text)
    status = db.Column(db.String(50))
    scan_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self, include_vulnerability=False, include_scope=False):
        data = {
            'id': self.id,
            'project_id': self.project_id,
            'scope_id': self.scope_id,
            'vulnerability_id': self.vulnerability_id,
            'proof_of_concept': self.proof_of_concept,
            'status': self.status,
            'scan_date': self.scan_date.isoformat() if self.scan_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_vulnerability and self.vulnerability:
            data['vulnerability'] = self.vulnerability.to_dict()
            
        if include_scope and self.scope:
            data['scope'] = self.scope.to_dict()
            
        return data


class SupportTicket(db.Model):
    __tablename__ = 'support_tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.String(50), unique=True, nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    issue_category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(50))
    issue_description = db.Column(db.Text, nullable=False)
    initial_troubleshooting = db.Column(db.Text)
    status = db.Column(db.String(50))
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolution_details = db.Column(db.Text)
    resolution_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attachments = db.relationship('TicketAttachment', backref='ticket', lazy=True)
    
    def to_dict(self, include_attachments=False, include_requester=False, include_assignee=False):
        data = {
            'id': self.id,
            'ticket_id': self.ticket_id,
            'requester_id': self.requester_id,
            'issue_category': self.issue_category,
            'priority': self.priority,
            'issue_description': self.issue_description,
            'initial_troubleshooting': self.initial_troubleshooting,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'resolution_details': self.resolution_details,
            'resolution_date': self.resolution_date.isoformat() if self.resolution_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_attachments:
            data['attachments'] = [attachment.to_dict() for attachment in self.attachments]
            
        if include_requester and self.requester:
            data['requester'] = self.requester.to_dict()
            
        if include_assignee and self.assignee:
            data['assignee'] = self.assignee.to_dict()
            
        return data


class TicketAttachment(db.Model):
    __tablename__ = 'ticket_attachments'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('support_tickets.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    file_size = db.Column(db.Integer)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    uploader = db.relationship('User', foreign_keys=[uploaded_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'ticket_id': self.ticket_id,
            'file_path': self.file_path,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'uploaded_by': self.uploaded_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer, nullable=False)
    details = db.Column(JSONB)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self, include_user=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_user and self.user:
            data['user'] = self.user.to_dict()
            
        return data


class NotificationSetting(db.Model):
    __tablename__ = 'notification_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notification_type = db.Column(db.String(100), nullable=False)
    is_enabled = db.Column(db.Boolean, default=True)
    frequency = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'notification_type'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'notification_type': self.notification_type,
            'is_enabled': self.is_enabled,
            'frequency': self.frequency,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notification_type = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'notification_type': self.notification_type,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'link': self.link,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }