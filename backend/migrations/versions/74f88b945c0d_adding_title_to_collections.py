"""adding title to collections

Revision ID: 74f88b945c0d
Revises: efbc64e1134d
Create Date: 2023-02-26 17:25:35.954696

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74f88b945c0d'
down_revision = 'efbc64e1134d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('collection', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(length=60), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('collection', schema=None) as batch_op:
        batch_op.drop_column('title')

    # ### end Alembic commands ###
