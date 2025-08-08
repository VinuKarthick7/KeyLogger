from django.db import models

# Create your models here.
from django.db import models

class KeyAssignment(models.Model):
    staff_id = models.CharField(max_length=100)
    key_id = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=[('Issued', 'Issued'), ('Returned', 'Returned')], default='Issued')
    issue_time = models.DateTimeField(auto_now_add=True)
    return_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Key {self.key_id} assigned to staff {self.staff_id}"