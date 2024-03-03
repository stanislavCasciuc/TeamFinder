from backend.storage.model import Departament, User


def get_departament_by_manager(db, manager_id):
    return db.query(Departament).filter(Departament.departament_manager == manager_id).first()

def get_department_manager_name(user_id, db):
    return db.query(User).filter(User.id == user_id).first().name
