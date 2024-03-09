"""Creating department_id column for skills

Revision ID: e5d415a4296b
Revises: 9c035c019d0c
Create Date: 2024-03-07 20:20:49.863361

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5d415a4296b'
down_revision: Union[str, None] = '9c035c019d0c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('skills', sa.Column('department_id', sa.Integer, sa.ForeignKey('departments.id')))

def downgrade():
    op.drop_column('skills', 'department_id')