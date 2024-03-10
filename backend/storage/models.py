from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, ARRAY, Boolean, UniqueConstraint

from storage.config import Base, SessionLocal


class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(String)


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    department_id = Column(Integer, ForeignKey('departments.id'))
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_organization_admin = Column(Boolean, default=False)
    is_department_manager = Column(Boolean, default=False)
    is_project_manager = Column(Boolean, default=False)

class Department(Base):
    __tablename__ = 'departments'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    name = Column(String)
    department_manager_id = Column(Integer, ForeignKey('users.id'), unique=True)

class Roles(Base):
    __tablename__ = 'roles'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    name = Column(String)

class Project(Base):
    __tablename__ = 'projects'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    project_manager_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)

class ProjectEmployees(Base):
    __tablename__ = 'project_employees'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    hours_per_day = Column(Integer)
    is_proposal = Column(Boolean, default=False)
    is_deallocated = Column(Boolean, default=False)
    comment = Column(Text)
    deallocate_comment = Column(Text)

class Skills(Base):
    __tablename__ = 'skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    name = Column(String)
    category = Column(String)
    description = Column(Text)
    author_id = Column(Integer, ForeignKey('users.id'))
    department_id = Column(Integer, ForeignKey('departments.id'))

class UserSkills(Base):
    __tablename__ = 'user_skills'
    __table_args__ = (UniqueConstraint('user_id', 'skill_id', name='uix_1'),
        {'extend_existing': True, 'sqlite_autoincrement': True})
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))
    level = Column(Integer)
    experience = Column(DateTime)

class ProjectTechnologies(Base):
    __tablename__ = 'project_technologies'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    name = Column(String, unique=True)

class DepartmentSkills(Base):
    __tablename__ = 'department_skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    department_id = Column(Integer, ForeignKey('departments.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
