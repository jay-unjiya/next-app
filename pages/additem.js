import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Package, DollarSign, Loader2, Send, CheckCircle } from "lucide-react";

export default function AddItems() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    
    // Simulate success animation before redirecting
    if (data.name && data.price) {
      setTimeout(() => setSuccess(true), 600);
      setTimeout(() => {
        axios
          .post("/api/items", data)
          .then((res) => {
            console.log(res.data);
            setTimeout(() => {
              router.replace("/items");
            }, 800);
          })
          .catch((err) => {
            setError(err.response?.data?.message || "An error occurred");
            setLoading(false);
            setSubmitted(false);
            setSuccess(false);
          });
      }, 1200);
    } else {
      setError("Please fill all required fields");
      setLoading(false);
      setSubmitted(false);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div 
        className="absolute w-12 h-12 rounded-full bg-blue-400 opacity-20"
        style={{
          top: '10%',
          left: '10%',
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="absolute w-8 h-8 rounded-full bg-indigo-500 opacity-20"
        style={{
          top: '20%',
          right: '15%',
          animation: 'float 12s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="absolute w-16 h-16 rounded-full bg-purple-400 opacity-20"
        style={{
          bottom: '20%',
          right: '25%',
          animation: 'float 10s ease-in-out infinite'
        }}
      ></div>

      <form 
        className={`max-w-sm mx-auto rounded-xl shadow-xl p-8 bg-white border border-blue-100 
                    backdrop-blur-md backdrop-filter 
                    transition-all duration-700 
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    ${success ? 'scale-105' : submitted ? 'scale-95' : 'scale-100'}`}
        style={{
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8 relative">
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 
                          ${success ? 'scale-110' : ''}`}>
            Add New Item
          </h2>
          <div className={`w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-3 rounded-full transition-all duration-500 
                          ${success ? 'w-28' : focused ? 'w-24' : 'w-20'}`}></div>
        </div>
        
        <div className={`mb-6 transition-all duration-300 transform ${focused === 'name' ? 'translate-y-1' : ''}`}>
          <label 
            htmlFor="name" 
            className="flex items-center mb-2 text-sm font-medium text-gray-700 transition-all duration-300"
          >
            <Package className={`w-4 h-4 mr-2 transition-all duration-300 ${focused === 'name' ? 'text-blue-600' : 'text-blue-500'}`} />
            <span className={`transition-all duration-300 ${focused === 'name' ? 'text-blue-600' : ''}`}>Item Name</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              name="name" 
              onChange={handleChange} 
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              id="name" 
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-3 pl-4
                        transition-all duration-300 
                        ${focused === 'name' ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-gray-300 hover:shadow-sm'}`}
              placeholder="Enter item name"
              required
              disabled={loading || success}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-700 ease-out rounded-b-lg
                          ${focused === 'name' ? 'w-full' : 'w-0'}`}></div>
          </div>
        </div>
        
        <div className={`mb-6 transition-all duration-300 transform ${focused === 'price' ? 'translate-y-1' : ''}`}>
          <label 
            htmlFor="price" 
            className="flex items-center mb-2 text-sm font-medium text-gray-700 transition-all duration-300"
          >
            <DollarSign className={`w-4 h-4 mr-2 transition-all duration-300 ${focused === 'price' ? 'text-blue-600' : 'text-blue-500'}`} />
            <span className={`transition-all duration-300 ${focused === 'price' ? 'text-blue-600' : ''}`}>Price</span>
          </label>
          <div className="relative">
            <input 
              type="number" 
              name="price" 
              onChange={handleChange} 
              onFocus={() => setFocused('price')}
              onBlur={() => setFocused(null)}
              id="price" 
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-3 pl-4
                        transition-all duration-300 
                        ${focused === 'price' ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-gray-300 hover:shadow-sm'}`}
              placeholder="Enter price"
              required
              disabled={loading || success}
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-700 ease-out rounded-b-lg
                          ${focused === 'price' ? 'w-full' : 'w-0'}`}></div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-500 rounded-lg text-sm border border-red-200 relative overflow-hidden">
            <div className="relative z-10">{error}</div>
            <div className="absolute inset-0 bg-red-100 animate-pulse-subtle opacity-50"></div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || success}
          className={`relative text-white font-medium rounded-lg text-sm w-full py-3 overflow-hidden
                    transition-all duration-500`}
          style={{
            background: success ? 'linear-gradient(to right, #10B981, #059669)' : 
                      loading ? '#9CA3AF' : 'linear-gradient(to right, #2563EB, #4F46E5)',
            height: '48px'
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-white opacity-20"
              style={{
                transform: 'skewX(-45deg) translateX(-100%)',
                animation: loading || success ? 'none' : 'shine-button 3s infinite'
              }}
            ></div>
          </div>
          
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                          ${success ? 'opacity-100' : 'opacity-0'}`}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Success!
          </span>
          
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                          ${loading && !success ? 'opacity-100' : 'opacity-0'}`}>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </span>
          
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                          ${!loading && !success ? 'opacity-100' : 'opacity-0'}`}>
            <Send className="w-4 h-4 mr-2 transform -rotate-12" />
            Submit
          </span>
        </button>
        
        {success && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="confetti-container"></div>
            </div>
          </div>
        )}
      </form>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        @keyframes shine-button {
          0% {
            transform: skewX(-45deg) translateX(-150%);
          }
          50%, 100% {
            transform: skewX(-45deg) translateX(150%);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .confetti-container::before,
        .confetti-container::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: confetti 1s ease-out forwards;
        }
        
        .confetti-container::before {
          background-color: #3B82F6;
          left: -20px;
          top: 0;
        }
        
        .confetti-container::after {
          background-color: #8B5CF6;
          left: 20px;
          top: -10px;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}