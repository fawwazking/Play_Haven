import uuid
from django.db import models

class ConsoleCategory(models.TextChoices):
    PLAYSTATION = 'PLAYSTATION', 'PlayStation'
    XBOX = 'XBOX', 'Xbox'
    NINTENDO = 'NINTENDO', 'Nintendo'

class Platform(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50) # e.g. PlayStation 5, Xbox Series X, Nintendo Switch
    slug = models.SlugField(max_length=50, unique=True)
    category = models.CharField(max_length=20, choices=ConsoleCategory.choices)
    generation = models.CharField(max_length=50) # e.g. Gen 9, Gen 8, Gen 7

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    publisher = models.CharField(max_length=150)
    developer = models.CharField(max_length=150)
    release_year = models.PositiveIntegerField()
    description = models.TextField()
    cover_image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Region(models.TextChoices):
    REG1 = 'REG1', 'Region 1 (US)'
    REG2 = 'REG2', 'Region 2 (EU/UK)'
    REG3 = 'REG3', 'Region 3 (Asia/Indo)'
    ALL = 'ALL', 'Region All'

class Condition(models.TextChoices):
    SEALED = 'SEALED', 'Brand New Sealed'
    PREOWNED = 'PREOWNED', 'Pre-owned / Bekas'

class GameVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='variants')
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE, related_name='game_variants')
    region = models.CharField(max_length=10, choices=Region.choices, default=Region.REG3)
    condition = models.CharField(max_length=10, choices=Condition.choices, default=Condition.SEALED)
    sku = models.CharField(max_length=64, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    weight_grams = models.PositiveIntegerField(default=120) # BD standard case ~120g
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['game', 'platform', 'region', 'condition'],
                name='unique_game_platform_region_condition'
            )
        ]

    def __str__(self):
        return f"{self.game.title} - {self.platform.name} [{self.get_region_display()} / {self.get_condition_display()}]"
