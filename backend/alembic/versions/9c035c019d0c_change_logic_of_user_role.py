"""Change logic of user role

Revision ID: 9c035c019d0c
Revises: aebf36ccd5cc
Create Date: 2024-03-07 16:04:08.553263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c035c019d0c'
down_revision: Union[str, None] = 'aebf36ccd5cc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    conn = op.get_bind()
    result = conn.execute(sa.text("SELECT 1 FROM pg_constraint WHERE conname = 'uix_1'")).scalar()
    if result:
        with op.batch_alter_table("user_skills") as batch_op:
            batch_op.drop_constraint('uix_1', type_='unique')

def downgrade():
    with op.batch_alter_table("user_skills") as batch_op:
        batch_op.create_unique_constraint('uix_1', ['user_id', 'skill_id'])
