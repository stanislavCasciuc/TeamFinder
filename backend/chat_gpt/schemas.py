import json

from team_finder.schemas import Employee


class EmployeeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Employee):
            return {
                'name': obj.name,
                'id': obj.id,
                'skills': obj.skills,
                'projects': obj.projects
            }
        return super().default(obj)