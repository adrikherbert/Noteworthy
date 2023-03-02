"""add user_account.root_collection_id

Revision ID: 3564afecace9
Revises: b634d131cde7
Create Date: 2023-03-01 23:31:14.915791

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3564afecace9'
down_revision = 'b634d131cde7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_account', schema=None) as batch_op:
        batch_op.add_column(sa.Column('root_collection_id', sa.Integer(), nullable=True))
        batch_op.create_unique_constraint(None, ['root_collection_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_account', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('root_collection_id')

    # ### end Alembic commands ###
