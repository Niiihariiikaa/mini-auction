import { useEffect, useState } from "react"
import API from "../lib/api"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { supabase } from "../lib/supabase"

// format remaining time in days
function formatCountdownDays(ms) {
  if (ms <= 0) return "0 days"
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  return `${days} day${days !== 1 ? "s" : ""}`
}

export default function Auctions() {
  const nav = useNavigate()
  const [list, setList] = useState([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_price: 10,
    bid_increment: 1,
    start_time: "",
    end_time: "",
  })
  const [now, setNow] = useState(Date.now())

  async function load() {
    const res = await API.get("/auctions")
    setList(res.data)
  }

  async function create() {
    const { data: { user } } = await supabase.auth.getUser() // check logged-in user
    if (!user) {
      alert("Please login first to create an auction.")
      nav("/login")
      return
    }

    const s = await API.post("/auctions", form)
    if (s.data?.id) {
      setForm({
        title: "",
        description: "",
        start_price: 10,
        bid_increment: 1,
        start_time: "",
        end_time: "",
      })
      load()
    }
  }

  useEffect(() => {
    load()
  }, [])

  // update "now" every second for countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-6 font-poppins text-white">
      <h2 className="text-4xl font-extrabold mb-10 text-center drop-shadow-md">
        Auctions
      </h2>

      {/* Auction Creation Form */}
      <Card className="max-w-2xl mx-auto mb-12 shadow-2xl rounded-3xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white">
            Create Auction <span className="text-indigo-400">(Sellers)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              placeholder="Auction title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Input
              id="description"
              placeholder="Auction description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_price" className="text-gray-300">Start Price</Label>
              <Input
                id="start_price"
                type="number"
                value={form.start_price}
                onChange={(e) => setForm({ ...form, start_price: e.target.value })}
                className="bg-gray-800 text-white border-gray-700 focus:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bid_increment" className="text-gray-300">Bid Increment</Label>
              <Input
                id="bid_increment"
                type="number"
                value={form.bid_increment}
                onChange={(e) => setForm({ ...form, bid_increment: e.target.value })}
                className="bg-gray-800 text-white border-gray-700 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-gray-300">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="bg-gray-800 text-white border-gray-700 focus:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-gray-300">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className="bg-gray-800 text-white border-gray-700 focus:ring-indigo-400"
              />
            </div>
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
            onClick={create}
          >
            Create Auction
          </Button>
        </CardContent>
      </Card>

      {/* Auction List */}
      <Card className="max-w-3xl mx-auto shadow-xl rounded-3xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white">Active Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-gray-400">No auctions available yet.</p>
          ) : (
            <ul className="space-y-3">
              {list.map((a) => {
                const start = new Date(a.start_time).getTime()
                const end = new Date(a.end_time).getTime()
                const isUpcoming = now < start
                const isOngoing = now >= start && now < end
                const countdown = isUpcoming ? start - now : end - now

                return (
                  <li
                    key={a.id}
                    className="flex justify-between items-center p-4 border border-gray-800 rounded-lg bg-gray-800/40 hover:bg-gray-800/70 transition-all"
                  >
                    <div>
                      <Link
                        to={`/auctions/${a.id}`}
                        className="font-medium text-indigo-400 hover:underline"
                      >
                        {a.title}
                      </Link>
                      <p className="text-sm text-white">{a.description}</p>
                    </div>
                    <div className="text-right">
                      {isUpcoming && (
                        <span className="text-yellow-400 text-sm">
                          Starts in {formatCountdownDays(countdown)}
                        </span>
                      )}
                      {isOngoing && (
                        <span className="text-green-400 text-sm">
                          Ends in {formatCountdownDays(countdown)}
                        </span>
                      )}
                      {!isUpcoming && !isOngoing && (
                        <span className="text-gray-500 text-sm">Ended</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
