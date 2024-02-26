from sqlalchemy.orm import Session


from model import User, Organization

# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user):
    db_organization = Organization(name=user.organization_name, address=user.address)
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    db_user = User(name=user.name, email=user.email, password=user.password, organization_id=db_organization.id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user