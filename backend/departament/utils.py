from backend.storage.model import Departament


def get_departament_by_manager(db, manager_id):
    return db.query(Departament).filter(Departament.departament_manager == manager_id).first()