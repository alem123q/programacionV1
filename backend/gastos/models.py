from django.db import models

from organizador.models import Evento


class Gasto(models.Model):
    id = models.BigAutoField(primary_key=True)
    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name="gastos",
    )
    concepto = models.CharField(max_length=200)
    pagado_por = models.CharField(max_length=120)
    pagado_por_iniciales = models.CharField(max_length=5)
    monto = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "Gasto"
        verbose_name_plural = "Gastos"
        ordering = ["concepto", "id"]

    def __str__(self):
        return f"{self.concepto} - {self.evento.titulo}"
