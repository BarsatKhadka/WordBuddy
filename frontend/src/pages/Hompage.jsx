import React from 'react';

function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-pink-300 to-yellow-200 relative overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500">
          WordBuddy
        </h1>
        <p className="text-4xl md:text-5xl font-bold text-white">
          Miami's Super Fun Word Adventure!
        </p>
      </div>
    </div>
  );
}

export default Homepage;