"""add location and note columns for aidan

Revision ID: 8b7771a91e94
Revises: f786877539e8
Create Date: 2023-03-02 10:44:55.929806

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8b7771a91e94'
down_revision = 'f786877539e8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('location', schema=None) as batch_op:
        batch_op.add_column(sa.Column('location_type', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('x', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('y', sa.Integer(), nullable=False))
        batch_op.drop_column('coords')

    with op.batch_alter_table('note', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_visible', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('note', schema=None) as batch_op:
        batch_op.drop_column('is_visible')

    with op.batch_alter_table('location', schema=None) as batch_op:
        batch_op.add_column(sa.Column('coords', postgresql.ARRAY(sa.INTEGER()), autoincrement=False, nullable=False))
        batch_op.drop_column('y')
        batch_op.drop_column('x')
        batch_op.drop_column('location_type')

    # ### end Alembic commands ###
