"""add array column collections.notes

Revision ID: f305ebe0af36
Revises: bb558cdd50c5
Create Date: 2023-02-27 19:11:17.339544

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f305ebe0af36'
down_revision = 'bb558cdd50c5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('collection', schema=None) as batch_op:
        batch_op.add_column(sa.Column('notes', postgresql.ARRAY(sa.Integer()), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('collection', schema=None) as batch_op:
        batch_op.drop_column('notes')

    # ### end Alembic commands ###