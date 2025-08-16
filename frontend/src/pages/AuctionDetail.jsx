import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import API from "../lib/api"
import { io } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AuctionDetail() {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [current, setCurrent] = useState(null)
  const [myBid, setMyBid] = useState("")
  const [loading, setLoading] = useState(false)
  const [bidPlaced, setBidPlaced] = useState(false) // ✅ show confirmation

  // ✅ Initialize socket only once
  const socket = useMemo(() => io(import.meta.env.VITE_API_BASE), [])

  // Load auction details
  async function load() {
    const res = await API.get(`/auctions/${id}`)
    setAuction(res.data.auction)
    setCurrent(res.data.current)
  }

  // Place a bid
  async function placeBid() {
    if (!myBid) return
    const amount = parseFloat(myBid)
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid bid")

    try {
      setLoading(true)
      await API.post("/bids", { auction_id: id, amount })
      setMyBid("")
      setCurrent(amount) // ✅ instantly update UI
      setBidPlaced(true) // ✅ show success message
      setTimeout(() => setBidPlaced(false), 3000) // hide after 3s
    } catch (e) {
      alert(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  // Setup socket for real-time bid updates
  useEffect(() => {
    load()
    socket.emit("join_auction", id)

    socket.on("new_bid", ({ auction_id, amount }) => {
      if (auction_id === id) {
        setCurrent(amount) // ✅ update current bid live
      }
    })

    return () => {
      socket.emit("leave_auction", id)
      socket.off("new_bid")
      socket.disconnect()
    }
    // eslint-disable-next-line
  }, [id])

  if (!auction)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white">
        <p className="text-gray-400">Loading auction...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-6 flex items-center justify-center font-poppins text-white">
      <Card className="w-full max-w-2xl shadow-2xl rounded-3xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-400 drop-shadow-md">
            {auction.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">{auction.description}</p>
          <p className="text-sm text-gray-400">Status: {auction.status}</p>

          {/* Auction pricing details */}
          <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700 space-y-2">
            <p className="text-white">
              Starting Bid:{" "}
              <span className="text-yellow-400 font-semibold">
                {auction.start_price}
              </span>
            </p>
            <p className="text-white">
              Current Bid:{" "}
              <span className="text-green-400 font-bold">
                {current || auction.start_price}
              </span>
            </p>
            {auction.status === "ended" && auction.highest_bid_user && (
              <p className="text-sm text-gray-300">
                Won By:{" "}
                <span className="font-medium text-indigo-400">
                  {auction.highest_bid_user.name}
                </span>
              </p>
            )}
          </div>

          {/* Show bidding input only if auction is active */}
          {auction.status === "active" && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  placeholder="Enter your bid"
                  value={myBid}
                  onChange={(e) => setMyBid(e.target.value)}
                  className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-indigo-400"
                />
                <Button
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  onClick={placeBid}
                >
                  {loading ? "Placing..." : "Place Bid"}
                </Button>
              </div>

              {/* ✅ Bid placed confirmation */}
              {bidPlaced && (
                <p className="text-sm text-green-400 font-medium animate-pulse">
                  ✅ Bid placed successfully!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
