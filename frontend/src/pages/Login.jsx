import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function handleLogin() {
    if (!email || !password) return alert("Please enter email and password")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      localStorage.setItem("isLoggedIn", "true")
      nav("/auctions")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-6 font-poppins">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-white drop-shadow-md">
            Login
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2 text-sm">
            Enter your credentials to access the auctions
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-4">
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
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
