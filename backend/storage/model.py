from sqlalchemy import Column, String, Integer, ForeignKey, DateTime

from backend.storage.config import Base, SessionLocal


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
    departament_id = Column(Integer, ForeignKey('departaments.id'))
    role = Column(String)
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)

class Departament(Base):
    __tablename__ = 'departaments'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    name = Column(String)

class Role(Base):
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
    name = Column(String)
    description = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String)

class ProjectRoles(Base):
    __tablename__ = 'project_roles'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

class Skills(Base):
    __tablename__ = 'skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'))
    name = Column(String)
    category = Column(String)
    description = Column(String)
    author_id = Column(Integer, ForeignKey('users.id'))

class UserSkills(Base):
    __tablename__ = 'user_skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))
    level = Column(Integer)
    experience = Column(Integer)

class ProjectSkills(Base):
    __tablename__ = 'project_skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
