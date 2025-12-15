import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import FunButton from "@/components/FunButton";

export default function Home() {
  const products = [
    {
      title: "API Access",
      description: "Harness the power of Lightombo without the hassle of managing blockchain infrastructure.",
      linkText: "Learn How API Access Works",
      features: [
        "Versatile Access: Generate API keys tailored to various development needs across different networks.",
        "Effortless Integration: Write transactions and retrieve MoveVM data without managing nodes.",
        "Real-Time Insights: Monitor and analyze transaction data with comprehensive metrics."
      ]
    },
    {
      title: "No Code Indexing",
      description: "Build your product, not infra. Access on-chain data instantly and focus on the fun stuff.",
      linkText: "Learn How No Code Indexing Works",
      features: [
        "Instant Data Access: Quickly pull in blockchain data without complex indexing logic.",
        "Web-based Configuration: Easily set up and customize your indexing API using a straightforward web UI.",
        "Managed Infrastructure: Get real-time blockchain data updates with zero maintenance."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-movement-yellow selection:text-black">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="px-6 py-20 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-bold text-movement-yellow tracking-widest uppercase mb-12">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <FeatureCard 
                  key={index}
                  title={product.title}
                  description={product.description}
                  features={product.features}
                  linkText={product.linkText}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-32 bg-gray-900/20 border-y border-gray-900 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Build without <span className="text-movement-yellow">frontiers</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Lightombo gives you the tools to build anything, anywhere, without limits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Real-time transaction streams</h3>
                <p className="text-gray-400">Listen to the Movement blockchain as transactions are processed. Get instant access to transaction data as it happens, powered by our hosted stream service.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Labs-hosted infrastructure</h3>
                <p className="text-gray-400">Skip the complexity of running your own nodes. Access our production-ready transaction stream API and focus on building, not infrastructure management.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Deploy your own instance</h3>
                <p className="text-gray-400">Need full control? Deploy the transaction stream service yourself with our open-source implementation. Complete documentation included.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-32 text-center">
           <h2 className="text-4xl md:text-6xl font-bold mb-8">What will you build?</h2>
           <FunButton />
        </section>

      </main>

      <Footer />
    </div>
  );
}
