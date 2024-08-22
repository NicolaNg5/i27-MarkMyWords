from django.db import models

# Create your models here.

# models are created based on the entities from the supabase
from django.db import models

class Class(models.Model):
    class_number = models.CharField(max_length=36, unique=True)

class Student(models.Model):
    student_id = models.CharField(max_length=36, unique=True)
    name = models.CharField(max_length=24)
    email_address = models.CharField(max_length=36)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)

class ReadingMaterial(models.Model):
    material_id = models.CharField(max_length=36, unique=True)
    filename = models.CharField(max_length=56)

class Assessment(models.Model):
    assessment_id = models.CharField(max_length=36, unique=True)
    reading_material_id = models.ForeignKey(ReadingMaterial, on_delete=models.CASCADE)
    title = models.CharField(max_length=56)
    topic = models.CharField(max_length=56)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)

class Question(models.Model):
    question_id = models.CharField(max_length=36, unique=True)
    assessment_id = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    question_text = models.CharField(max_length=50)
    TYPE_CHOICES = [
        ('MCQ', 'Multiple Choice Question'),
        ('SA', 'Short Answer'),
        ('FC', 'Fill in the Blanks'),
        ('HL', 'Higher Level Question')
    ]
    type = models.CharField(max_length=3, choices=TYPE_CHOICES)
    category = models.CharField(max_length=24)
    skills = models.ManyToManyField('Skill')

class Answer(models.Model):
    answer_id = models.CharField(max_length=36, unique=True)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=120)

class Skill(models.Model):
    skill_id = models.CharField(max_length=36, unique=True)
    name = models.CharField(max_length=36)
    IMPORTANCE_CHOICES = [
        ('High', 'High'),
        ('Normal', 'Normal'),
        ('Low', 'Low')
    ]
    importance = models.CharField(max_length=7, choices=IMPORTANCE_CHOICES)

class Results(models.Model):
    result_id = models.CharField(max_length=36, unique=True)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    feedback = models.CharField(max_length=120)
    marks = models.IntegerField()
