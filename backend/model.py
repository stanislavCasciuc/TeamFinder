from sqlalchemy import Column, String, Integer, ForeignKey, DateTime

from config import Base


class Organization(Base):
    __tablename__ = 'organization'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(String)
class User(Base):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    departament_id = Column(Integer, ForeignKey('departament.id'))
    role = Column(String)
    name = Column(String)
    email = Column(String)
    password = Column(String)

class Departament(Base):
    __tablename__ = 'departament'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    name = Column(String)

class Role(Base):
    __tablename__ = 'role'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    name = Column(String)

class Project(Base):
    __tablename__ = 'project'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    name = Column(String)
    description = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String)

class ProjectRoles(Base):
    __tablename__ = 'project_roles'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('project.id'))
    role_id = Column(Integer, ForeignKey('role.id'))
    user_id = Column(Integer, ForeignKey('user.id'))

class Skills(Base):
    __tablename__ = 'skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    name = Column(String)
    category = Column(String)
    description = Column(String)
    author_id = Column(Integer, ForeignKey('user.id'))

class UserSkills(Base):
    __tablename__ = 'user_skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))
    level = Column(Integer)
    experience = Column(Integer)

class ProjectSkills(Base):
    __tablename__ = 'project_skills'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('project.id'))
    skill_id = Column(Integer, ForeignKey('skills.id'))
