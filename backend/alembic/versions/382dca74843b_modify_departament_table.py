"""modify_departament_table

Revision ID: 382dca74843b
Revises: c13d533354c7
Create Date: 2024-03-01 17:45:48.549489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '382dca74843b'
down_revision: Union[str, None] = 'c13d533354c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('departaments', sa.Column('departament_manager', sa.Integer))
    op.execute('UPDATE departaments SET departament_manager = departament_admin')
    op.drop_column('departaments', 'departament_admin')

def downgrade():
    op.add_column('departaments', sa.Column('departament_admin', sa.Integer))
    op.execute('UPDATE departaments SET departament_admin = departament_manager')
    op.drop_column('departaments', 'departament_manager')
