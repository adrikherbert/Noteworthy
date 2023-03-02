"""remove default constraint from root_collection_id

Revision ID: df9f1270bcf4
Revises: aee35610c3ba
Create Date: 2023-03-02 01:11:39.867064

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'df9f1270bcf4'
down_revision = 'aee35610c3ba'
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
