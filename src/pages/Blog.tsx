import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    id: 1,
    title: "How to Choose Your Perfect Fragrance",
    excerpt: "Discover the art of selecting a fragrance that complements your personality and style.",
    category: "Guide",
    date: "January 15, 2025"
  },
  {
    id: 2,
    title: "Understanding Fragrance Notes",
    excerpt: "Learn about top, heart, and base notes and how they work together to create memorable scents.",
    category: "Education",
    date: "January 10, 2025"
  },
  {
    id: 3,
    title: "Seasonal Fragrance Guide",
    excerpt: "Find out which fragrances work best for each season and why.",
    category: "Guide",
    date: "January 5, 2025"
  },
  {
    id: 4,
    title: "The History of Perfume Making",
    excerpt: "Explore the fascinating journey of perfume from ancient times to modern luxury.",
    category: "History",
    date: "December 28, 2024"
  },
  {
    id: 5,
    title: "Fragrance Layering Tips",
    excerpt: "Master the art of layering fragrances to create your unique signature scent.",
    category: "Tips",
    date: "December 20, 2024"
  },
  {
    id: 6,
    title: "How to Make Your Perfume Last Longer",
    excerpt: "Expert tips and tricks to maximize the longevity of your favorite fragrances.",
    category: "Tips",
    date: "December 15, 2024"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Fragrance Tips & Insights</h1>
            <p className="text-lg text-muted-foreground">
              Explore our collection of articles about fragrances, perfume tips, and industry insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
