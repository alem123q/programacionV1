# Generated manually to align gastos with frontend expense cards.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gastos", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="gasto",
            options={
                "ordering": ["concepto", "id"],
                "verbose_name": "Gasto",
                "verbose_name_plural": "Gastos",
            },
        ),
        migrations.RemoveField(
            model_name="gasto",
            name="categoria",
        ),
        migrations.RemoveField(
            model_name="gasto",
            name="estado_pago",
        ),
        migrations.RemoveField(
            model_name="gasto",
            name="fecha_gasto",
        ),
        migrations.RemoveField(
            model_name="gasto",
            name="observaciones",
        ),
        migrations.RemoveField(
            model_name="gasto",
            name="proveedor",
        ),
        migrations.AddField(
            model_name="gasto",
            name="pagado_por",
            field=models.CharField(default="Sin definir", max_length=120),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="gasto",
            name="pagado_por_iniciales",
            field=models.CharField(default="SD", max_length=5),
            preserve_default=False,
        ),
    ]
