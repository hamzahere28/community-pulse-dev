import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The fragrance you're looking for seems to have evaporated. Let's get you back on track.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
