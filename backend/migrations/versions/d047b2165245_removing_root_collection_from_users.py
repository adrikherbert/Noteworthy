"""removing root collection from users

Revision ID: d047b2165245
Revises: 3564afecace9
Create Date: 2023-03-01 23:34:56.219137

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd047b2165245'
down_revision = '3564afecace9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_account', schema=None) as batch_op:
        batch_op.drop_constraint('user_account_root_collection_id_key', type_='unique')
        batch_op.drop_column('root_collection_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_account', schema=None) as batch_op:
        batch_op.add_column(sa.Column('root_collection_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_unique_constraint('user_account_root_collection_id_key', ['root_collection_id'])

    # ### end Alembic commands ###
