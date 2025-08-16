import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function handleSignup() {
    if (!name || !email || !password) return alert("Please fill all fields")
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    })
    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("Signup successful! Please login.")
      nav("/login")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-6 font-poppins">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-white drop-shadow-md">
            Register
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2 text-sm">
            Create an account to start bidding or selling
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-4">
          <Input
            placeholder="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
          />

          {/* Role Dropdown */}
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-lg p-2 focus:ring-indigo-400"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <Button
            onClick={handleSignup}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          {/* Already a user link */}
          <p className="text-white text-sm text-center mt-4">
            Already a user?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
