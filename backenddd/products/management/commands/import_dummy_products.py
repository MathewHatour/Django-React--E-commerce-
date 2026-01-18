import random
from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Product

class Command(BaseCommand):
    help = "Generate synthetic products with unique names, prices, images, and descriptions (default: 100)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=100,
            help="Number of products to generate (default: 100)",
        )

    def handle(self, *args, **options):
        count = max(1, options.get("count", 100))

        # Ensure a seller user exists
        seller, _ = User.objects.get_or_create(
            username="seedbot",
            defaults={"email": "seedbot@example.com"},
        )
        if not seller.has_usable_password():
            seller.set_unusable_password()
            seller.save()

        # Deterministic randomness for repeatable seeds
        random.seed(42)

        created_count = 0
        skipped_count = 0

        for i in range(1, count + 1):
            title = f"Sample Product {i:03d}"
            # Avoid duplicate titles
            if Product.objects.filter(title=title).exists():
                skipped_count += 1
                continue

            # Create a simple description
            description = (
                f"A high-quality item number {i} with modern design, built for everyday use. "
                f"This product is part of our synthetic dataset for testing and demos."
            )

            # Generate a price between 5 and 250, rounded to 2 decimals, as Decimal
            price_float = random.uniform(5, 250)
            price_dec = Decimal(str(price_float)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

            # Stock between 10 and 500
            stock = random.randint(10, 500)

            # Unique image via Picsum seed (no download required)
            image_url = f"https://picsum.photos/seed/product-{i}/600/600"

            Product.objects.create(
                seller=seller,
                title=title,
                description=description,
                price=price_dec,
                stock=stock,
                image_url=image_url,
                rating=Decimal(str(random.uniform(1, 5))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
                reviews_count=random.randint(0, 500),
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Generated {created_count} products, skipped {skipped_count} (duplicates)"
            )
        )
