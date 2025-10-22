import { Link } from "react-router-dom";

const categories = [
  {
    name: "Floral",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    description: "Romantic and elegant scents inspired by garden blooms",
  },
  {
    name: "Oriental",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop",
    description: "Rich, exotic fragrances with spicy and warm notes",
  },
  {
    name: "Woody",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop",
    description: "Earthy and sophisticated with natural wood accents",
  },
  {
    name: "Fresh",
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=400&h=400&fit=crop",
    description: "Clean and invigorating scents for everyday wear",
  },
];

const CategoryShowcase = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Scent Family</h2>
          <p className="text-muted-foreground text-lg">Find your perfect fragrance profile</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/90 text-sm">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;