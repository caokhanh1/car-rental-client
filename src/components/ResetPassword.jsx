import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://car-rental-123.runasp.net/api/auths/pwd-verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            newPassword,
          }),
        }
      );


      if (response.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("API error:", error);
      setError(error.message || "Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-6 m-20">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the code and set your new password.
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-y-4">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Code Input */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="code"
                      name="code"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* New Password Input */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    I accept the Terms and Conditions
                  </label>
                </div>

                {/* Error Message */}
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm ${
                    loading || !acceptedTerms
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[rgb(51,65,85)] hover:bg-[rgb(41,55,70)] focus:ring-[rgb(51,65,85)]"
                  }`}
                  disabled={loading || !acceptedTerms}
                >
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
