import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

interface Recommendation {
  name: string;
  family: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  description: string;
  occasions: string;
  price: number;
}

const FragranceRecommender = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preferences, setPreferences] = useState({
    occasion: "",
    season: "",
    personality: "",
  });

  const handleGetRecommendations = async () => {
    if (!preferences.occasion || !preferences.season || !preferences.personality) {
      toast.error("Please fill in all preferences");
      return;
    }

    setLoading(true);
    console.log("Requesting recommendations with preferences:", preferences);

    try {
      const { data, error } = await supabase.functions.invoke("fragrance-recommender", {
        body: { preferences },
      });

      if (error) throw error;

      console.log("Received recommendations:", data);
      setRecommendations(data.recommendations);
      toast.success("Got your personalized recommendations!");
    } catch (error: any) {
      console.error("Recommendation error:", error);
      toast.error("Failed to get recommendations. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Scent</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Answer a few questions and let our AI recommend fragrances tailored to your unique style
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle>Tell Us About Your Preferences</CardTitle>
            <CardDescription>We'll use AI to find the perfect fragrances for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="occasion">When will you wear it?</Label>
              <Select value={preferences.occasion} onValueChange={(value) => setPreferences({ ...preferences, occasion: value })}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyday">Everyday Wear</SelectItem>
                  <SelectItem value="work">Professional/Work</SelectItem>
                  <SelectItem value="evening">Evening Events</SelectItem>
                  <SelectItem value="special">Special Occasions</SelectItem>
                  <SelectItem value="date">Date Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Favorite Season</Label>
              <Select value={preferences.season} onValueChange={(value) => setPreferences({ ...preferences, season: value })}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall/Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="all">All Seasons</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Your Personality Style</Label>
              <Select value={preferences.personality} onValueChange={(value) => setPreferences({ ...preferences, personality: value })}>
                <SelectTrigger id="personality">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bold">Bold & Confident</SelectItem>
                  <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                  <SelectItem value="fresh">Fresh & Energetic</SelectItem>
                  <SelectItem value="romantic">Romantic & Dreamy</SelectItem>
                  <SelectItem value="mysterious">Mysterious & Seductive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGetRecommendations} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your Personalized Recommendations</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{rec.name}</CardTitle>
                      <Badge>{rec.family}</Badge>
                    </div>
                    <CardDescription className="text-base">{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-primary">Top Notes:</span>
                        <p className="text-muted-foreground">{rec.topNotes}</p>
                      </div>
                      <div>
                        <span className="font-medium text-primary">Heart Notes:</span>
                        <p className="text-muted-foreground">{rec.heartNotes}</p>
                      </div>
                      <div>
                        <span className="font-medium text-primary">Base Notes:</span>
                        <p className="text-muted-foreground">{rec.baseNotes}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Best for:</span> {rec.occasions}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${rec.price}</span>
                        <Button size="sm">Explore Similar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FragranceRecommender;