"""change budget column type

Revision ID: 85059e965a57
Revises: b4ce04edfdad
Create Date: 2026-04-04 15:40:11.254692

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '85059e965a57'
down_revision: Union[str, Sequence[str], None] = 'b4ce04edfdad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        'form', 'budget',
        existing_type=sa.Integer(),
        type_=sa.String(50),
        postgresql_using='budget::text'  # Обязательно для PostgreSQL!
    )

def downgrade():
    op.alter_column(
        'form', 'budget',
        existing_type=sa.String(50),
        type_=sa.Integer(),
        postgresql_using='budget::integer'
    )