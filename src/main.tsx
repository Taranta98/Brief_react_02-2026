import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import HomePage from "./features/pages/HomePage"
import NotFoundPage from "./features/pages/NotFoundPage"
import PlayerList from "./features/player/PlayerList"
import TournamentBracket from "./features/tennisMatches/Bracket"
import TournamentList from "./features/tournament/TournamentList"
import "./index.css"
import MainLayout from "./layouts/MainLayout"
import TournamentHistory from "./features/tournamentsPlayers/TournamentHistory"





const router = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children: [
      {
        index:true,
        element:<HomePage/>
      },
     {
      path:'/players',
      element:<PlayerList/>
     },
     {
      path:'/tournaments',
      element: <TournamentList/>
     },
     {
      path:'/tennismatches',
      element:<TournamentBracket/>
     },
     {
      path:'/history',
      element:<TournamentHistory/>
     }
  
  ]
  },
   {
    path:'*',
    element:<NotFoundPage/>
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
