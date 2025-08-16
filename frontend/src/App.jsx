import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-poppins flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
          Mini Auction Platform
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
          A modern platform for transparent, real-time, and competitive auctions. 
          Bid with confidence, anytime and anywhere.
        </p>
        <div className="mt-6 flex gap-4">
        <Link to="/register">
            <Button size="lg" variant="outline" className="border-gray-400 text-black rounded-2xl">
              Get Started
            </Button>
          </Link>
          <Link to="/auctions">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg">
              Explore Auctions
            </Button>
          </Link>
          
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 px-6 bg-gray-900/70 backdrop-blur-md">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Auctions
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="bg-gray-800/80 border border-gray-700 hover:scale-105 transition">
              <CardHeader>
                <CardTitle className="text-stone-50">Item {id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Starting bid: ₹{id * 1000}</p>
                <p className="text-gray-400 text-sm">Ends in: {id} days</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
