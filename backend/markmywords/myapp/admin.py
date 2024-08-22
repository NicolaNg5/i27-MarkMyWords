from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

admin.site.register(Class)
admin.site.register(Student)
admin.site.register(ReadingMaterial)
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Skill)
admin.site.register(Results)

