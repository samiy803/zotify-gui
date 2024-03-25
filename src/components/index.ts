import dynamic from "next/dynamic";
const Settings = dynamic(() => import("./Settings"));
const Dashboard = dynamic(() => import("./Dashboard"));
const Search = dynamic(() => import("./Search"));
const LikedSongs = dynamic(() => import("./Likes"));
const Playlists = dynamic(() => import("./Playlists"));
const Podcasts = dynamic(() => import("./Podcasts"));
const Artists = dynamic(() => import("./Artists"));
const Albums = dynamic(() => import("./Albums"));

export { Dashboard, Search, LikedSongs, Playlists, Podcasts, Artists, Albums, Settings };