-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  top_notes TEXT NOT NULL,
  heart_notes TEXT NOT NULL,
  base_notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products
INSERT INTO public.products (id, name, category, price, image, top_notes, heart_notes, base_notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Noir Elegance', 'Oriental', 120.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop', 'Bergamot, Black Pepper', 'Jasmine, Leather', 'Vanilla, Amber'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Citrus Bloom', 'Fresh', 95.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&fit=crop', 'Lemon, Grapefruit', 'Neroli, Green Tea', 'Cedar, Musk'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Velvet Rose', 'Floral', 110.00, 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop', 'Rose, Peony', 'Violet, Peach', 'Sandalwood, Vanilla'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Amber Woods', 'Woody', 135.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop', 'Cardamom, Pink Pepper', 'Amber, Patchouli', 'Cedarwood, Vetiver');