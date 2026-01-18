import random
from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = "Backfill ratings and reviews_count for existing products"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Update all products regardless of current rating",
        )
        parser.add_argument(
            "--seed",
            type=int,
            default=123,
            help="Random seed to make results reproducible",
        )

    def handle(self, *args, **options):
        force = options.get("force", False)
        seed = options.get("seed", 123)
        random.seed(seed)

        qs = Product.objects.all()
        if not force:
            qs = qs.filter(rating=Decimal("0"))

        updated = 0
        total = qs.count()
        for p in qs.iterator():
            # Generate a rating between 1.00 and 5.00
            rating_float = random.uniform(1, 5)
            rating_dec = Decimal(str(rating_float)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            reviews = random.randint(0, 500)

            p.rating = rating_dec
            p.reviews_count = reviews
            p.save(update_fields=["rating", "reviews_count"])
            updated += 1

        self.stdout.write(
            self.style.SUCCESS(f"Updated {updated} products out of {total} in queryset")
        )
