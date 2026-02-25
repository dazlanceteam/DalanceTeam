import { useNavigate } from 'react-router-dom';

export default function Success() {
    const navigate = useNavigate();

    // Optional: Auto redirect to home after a few seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigate('/');
    //     }, 8000);
    //     return () => clearTimeout(timer);
    // }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="z-10 text-center max-w-2xl px-10 py-16 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 ring-1 ring-black/5 transform transition-all duration-500 hover:shadow-green-500/10">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 shadow-inner">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6 tracking-tight">
                    You're all set!
                </h1>

                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium mb-10">
                    Thank you for registering. We have received your details and you will receive an email from us soon.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-gray-700 bg-white border-2 border-gray-200 transition-all duration-300 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}
