import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="z-10 text-center max-w-3xl px-8 py-14 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 ring-1 ring-black/5 transition-all duration-500 hover:shadow-blue-500/10 hover:bg-white/80">
                <div className="mb-6 inline-flex p-3 rounded-full bg-blue-50 text-blue-600 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-6 tracking-tight">
                    Welcome to Team Dazlance
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed font-medium">
                    Join our network of elite developers and start working on exciting projects with top clients around the world.
                </p>

                <button
                    onClick={() => navigate('/basicinfo')}
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-56 opacity-10"></span>
                    <span className="relative flex items-center gap-3 text-lg">
                        Register as a Developer
                        <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}
