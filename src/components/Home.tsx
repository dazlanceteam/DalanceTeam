import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseForm } from '../hooks/useSupabaseForm';

export default function Home() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const { fetchLatestEntry, isLoading } = useSupabaseForm('Dazlance_basic_Info');

    useEffect(() => {
        const checkRegistration = async () => {
            const sessionId = sessionStorage.getItem('dazlance_form_session_id');
            if (sessionId) {
                const data = await fetchLatestEntry(sessionId);
                if (data) {
                    setUserData(data);
                }
            }
        };
        checkRegistration();
    }, [fetchLatestEntry]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="z-10 w-full max-w-3xl px-8 py-14 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 ring-1 ring-black/5 transition-all duration-500 hover:shadow-blue-500/10 hover:bg-white/80 flex flex-col items-center text-center">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-gray-500 font-medium">Checking profile status...</p>
                    </div>
                ) : userData ? (
                    // Registered View
                    <>
                        <div className="mb-6 inline-flex p-4 rounded-full bg-green-50 text-green-600 shadow-inner">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 mb-4 tracking-tight">
                            Welcome back!
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                            We have your details on file.
                        </p>

                        <div className="w-full max-w-md bg-white/80 p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 text-left space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Name</p>
                                <p className="text-gray-800 font-medium">{userData.Full_name || 'N/A'}</p>
                            </div>
                            <div className="h-px w-full bg-gray-100"></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Role</p>
                                <p className="text-gray-800 font-medium">{userData.Job_title || 'N/A'}</p>
                            </div>
                            <div className="h-px w-full bg-gray-100"></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Email</p>
                                <p className="text-gray-800 font-medium">{userData.Email || 'N/A'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/basicinfo')}
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full hover:from-gray-600 hover:to-gray-800 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 overflow-hidden"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-56 opacity-10"></span>
                            <span className="relative flex items-center gap-3 text-lg">
                                Edit your submitted details
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </span>
                        </button>
                    </>
                ) : (
                    // Unregistered View
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
