import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import MainLayout from "./layouts/MainLayout"
import PlayerList from "./features/player/PlayerList"
import TournamentList from "./features/tournament/TournamentList"


const router = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children: [
     {
      path:'/players',
      element:<PlayerList/>
     },
     {
      path:'/tournaments',
      element: <TournamentList/>
     }
    ]
  }
])

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router = {router}/>
    </QueryClientProvider>
  </StrictMode>
)
