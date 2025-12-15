import CodeWindow from "./CodeWindow";

export default function Hero() {
  return (
    <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            The essential toolkit for every{" "}
            <br className="hidden lg:block" />
            <span className="text-movement-yellow inline-block">move</span>{" "}
            developer
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
            Lightombo offers tools for developers to create, test, and launch dApps on the Movement network. Generate API keys, access MoveVM data, and streamline user onboarding.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="bg-movement-yellow text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-yellow-400 transition-colors w-full sm:w-auto shadow-[0_0_20px_rgba(250,255,0,0.3)] hover:shadow-[0_0_30px_rgba(250,255,0,0.5)]">
              Start Building
            </button>
            <button className="bg-transparent border border-gray-700 text-white px-8 py-3 rounded-md font-bold text-lg hover:border-white transition-colors w-full sm:w-auto">
              Read Docs
            </button>
          </div>
        </div>

        {/* Right Column: Code Animation */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-[1000px]">
          <div className="relative">
            {/* Glow effect behind the window */}
            <div className="absolute left-0 top-0 right-0 bottom-0 bg-gradient-to-r from-movement-yellow/20 via-movement-yellow/10 to-movement-yellow/20 blur-3xl opacity-30 rounded-full" />
            <CodeWindow />
          </div>
        </div>

      </div>
    </section>
  );
}
