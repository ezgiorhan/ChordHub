"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection, addDoc, getDocs, deleteDoc,
  query, orderBy, serverTimestamp, doc, where, getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// ============================================================================
// --- SENİN KISMIN BAŞLANGICI: TRANSPOZE ALGORİTMASI VE YARDIMCI FONKSİYONLAR ---
// ============================================================================
const SHARPS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLATS  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

function transposeChord(chord: string, st: number, useFlats: boolean): string {
  if (st === 0) return chord;
  const scale = useFlats ? FLATS : SHARPS;
  const m = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!m) return chord;
  const idx = SHARPS.findIndex(n => n.toLowerCase() === m[1].toLowerCase()) !== -1
    ? SHARPS.findIndex(n => n.toLowerCase() === m[1].toLowerCase())
    : FLATS.findIndex(n => n.toLowerCase() === m[1].toLowerCase());
  if (idx === -1) return chord;
  return scale[((idx + st) % 12 + 12) % 12] + m[2];
}

interface Song { id: string; title: string; artist: string; lyrics: string; chords: string; key: string; youtube?: string; createdByUsername?: string; }
interface Playlist { id: string; name: string; }
interface Note { id: string; content: string; songId: string; }

const CHORD_COLORS: Record<string, string> = {
  m: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  maj: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "7": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  dim: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  sus: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  default: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

function getChordColor(chord: string): string {
  if (/dim/.test(chord)) return CHORD_COLORS.dim;
  if (/sus/.test(chord)) return CHORD_COLORS.sus;
  if (/7|9|11|13/.test(chord)) return CHORD_COLORS["7"];
  if (/maj/.test(chord)) return CHORD_COLORS.maj;
  if (/m/.test(chord.slice(1))) return CHORD_COLORS.m;
  return CHORD_COLORS.default;
}
// ============================================================================
// --- SENİN KISMIN BİTİŞİ ---
// ============================================================================

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const isAdmin = user?.email === "orhanezgihatice@gmail.com";
  const router = useRouter();

  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  
  // ============================================================================
  // --- SENİN KISMIN BAŞLANGICI: STATE'LER ---
  // ============================================================================
  const [semitones, setSemitones] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"songs"|"playlists">("songs");
  const [mobileView, setMobileView] = useState<"list"|"detail">("list");
  // ============================================================================
  // --- SENİN KISMIN BİTİŞİ ---
  // ============================================================================

  // ============================================================================
  // --- ARKADAŞININ KODU İÇİN YER TUTUCU BAŞLANGICI: ARAMA VE FORM STATE'LERİ ---
  // ============================================================================
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", artist:"", lyrics:"", chords:"", key:"Am", youtube:"" });
  // ============================================================================
  // --- ARKADAŞININ KODU İÇİN YER TUTUCU BİTİŞİ ---
  // ============================================================================

  useEffect(() => {
    // ============================================================================
    // --- ARKADAŞININ KODU İÇİN YER TUTUCU: AUTH YÖNLENDİRMESİ BURAYA GELECEK ---
    // ============================================================================
  }, [user, loading, router]);

  useEffect(() => {
    if (user) { loadSongs(); loadPlaylists(); }
  }, [user]);

  useEffect(() => {
    if (selectedSong && user) loadNotes(selectedSong.id);
  }, [selectedSong]);

  // ============================================================================
  // --- ARKADAŞININ KODU İÇİN YER TUTUCU BAŞLANGICI: ŞARKI CRUD FONKSİYONLARI ---
  // ============================================================================
  const loadSongs = async () => { /* Arkadaşın dolduracak */ };
  const addSong = async (e: React.FormEvent) => { e.preventDefault(); /* Arkadaşın dolduracak */ };
  const deleteSong = async (songId: string) => { /* Arkadaşın dolduracak */ };
  const filteredSongs = songs; // Arkadaşın arama mantığını buraya kuracak
  // ============================================================================
  // --- ARKADAŞININ KODU İÇİN YER TUTUCU BİTİŞİ ---
  // ============================================================================

  // ============================================================================
  // --- SENİN KISMIN BAŞLANGICI: ÇALMA LİSTELERİ VE NOT FONKSİYONLARI ---
  // ============================================================================
  const loadPlaylists = async () => {
    if(!user) return;
    const q = query(collection(db, "playlists"), where("createdBy", "==", user.uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPlaylists(snap.docs.map(d => ({ id: d.id, ...d.data() } as Playlist)));
  };

  const addPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim() || !user) return;
    await addDoc(collection(db, "playlists"), {
      name: playlistName, createdBy: user.uid, createdAt: serverTimestamp(), songIds: [],
    });
    setPlaylistName("");
    setShowPlaylistForm(false);
    loadPlaylists();
  };

  const deletePlaylist = async (playlistId: string) => {
    await deleteDoc(doc(db, "playlists", playlistId));
    setSelectedPlaylist(null);
    setPlaylistSongs([]);
    loadPlaylists();
  };

  const loadPlaylistSongs = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    const q = query(collection(db, "playlist_songs"), where("playlistId", "==", playlist.id));
    const snap = await getDocs(q);
    const songIds = snap.docs.map(d => (d.data() as any).songId);
    const allSongsList = [...songs];
    setPlaylistSongs(allSongsList.filter(s => songIds.includes(s.id)));
    setSelectedSong(null);
    setMobileView("detail");
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    await addDoc(collection(db, "playlist_songs"), { playlistId, songId, createdAt: serverTimestamp() });
    setShowAddToPlaylist(false);
  };

  const loadNotes = async (songId: string) => {
    if(!user) return;
    const q = query(collection(db, "notes"), where("songId", "==", songId), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedSong || !user) return;
    await addDoc(collection(db, "notes"), { content: newNote, songId: selectedSong.id, userId: user.uid, createdAt: serverTimestamp() });
    setNewNote("");
    loadNotes(selectedSong.id);
  };

  const deleteNote = async (noteId: string) => {
    await deleteDoc(doc(db, "notes", noteId));
    if (selectedSong) loadNotes(selectedSong.id);
  };

  const currentChords = selectedSong
    ? selectedSong.chords.split(",").map(c => transposeChord(c.trim(), semitones, false))
    : [];

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setSemitones(0);
    setSelectedPlaylist(null);
    setMobileView("detail");
  };

  const handleBack = () => {
    setSelectedSong(null);
    setMobileView("list");
  };
  // ============================================================================
  // --- SENİN KISMIN BİTİŞİ ---
  // ============================================================================

  if (loading) return <div className="text-white text-center py-10">Yükleniyor...</div>;

  const LeftPanel = (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex bg-gray-900 rounded-xl p-1 border border-white/5">
        <button onClick={() => setActiveTab("songs")} className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all ${activeTab === "songs" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>Şarkılar</button>
        <button onClick={() => setActiveTab("playlists")} className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all ${activeTab === "playlists" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>Listelerim</button>
      </div>

      {activeTab === "songs" && (
        <>
          {/* ============================================================================ */}
          {/* --- ARKADAŞININ KODU İÇİN YER TUTUCU: ARAMA ÇUBUĞU VE ŞARKI EKLE BUTONU --- */}
          {/* ============================================================================ */}
          
          <div className="flex flex-col gap-2 overflow-y-auto">
            {filteredSongs.map(song => (
              <button key={song.id} onClick={() => handleSongSelect(song)} className="text-left p-3.5 rounded-xl border bg-gray-900 border-white/5 hover:border-white/10 hover:bg-gray-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-200 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{song.artist}</p>
                  </div>
                  {/* ============================================================================ */}
                  {/* --- ARKADAŞININ KODU İÇİN YER TUTUCU: SİLME BUTONU BURAYA GELECEK --- */}
                  {/* ============================================================================ */}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ============================================================================ */}
      {/* --- SENİN KISMIN BAŞLANGICI: ÇALMA LİSTELERİ ARAYÜZÜ --- */}
      {/* ============================================================================ */}
      {activeTab === "playlists" && (
        <>
          <button onClick={() => setShowPlaylistForm(!showPlaylistForm)} className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400 text-sm transition-all">+ Yeni Liste</button>
          {showPlaylistForm && (
            <form onSubmit={addPlaylist} className="bg-gray-900 rounded-xl border border-white/10 p-4 flex flex-col gap-2">
              <input placeholder="Liste adı" required value={playlistName} onChange={e => setPlaylistName(e.target.value)} className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" />
              <button type="submit" className="bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-500">Oluştur</button>
            </form>
          )}
          <div className="flex flex-col gap-2">
            {playlists.map(pl => (
              <button key={pl.id} onClick={() => loadPlaylistSongs(pl)} className="text-left p-3.5 rounded-xl border bg-gray-900 border-white/5 hover:border-white/10 flex justify-between">
                <p className="font-medium text-sm text-gray-200">{pl.name}</p>
                <span onClick={(e) => { e.stopPropagation(); deletePlaylist(pl.id); }} className="text-gray-600 hover:text-red-400 text-xs">✕</span>
              </button>
            ))}
          </div>
        </>
      )}
      {/* ============================================================================ */}
      {/* --- SENİN KISMIN BİTİŞİ --- */}
      {/* ============================================================================ */}
    </div>
  );

  const RightPanel = (
    <div className="flex-1 min-w-0">
      {selectedPlaylist && !selectedSong ? (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-6">{selectedPlaylist.name}</h2>
          <div className="flex flex-col gap-2">
            {playlistSongs.map(song => (
              <button key={song.id} onClick={() => handleSongSelect(song)} className="text-left p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800">
                <p className="font-medium text-gray-200">{song.title}</p>
              </button>
            ))}
          </div>
        </div>
      ) : selectedSong ? (
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-bold text-gray-100">{selectedSong.title}</h2>
                 <p className="text-gray-400">{selectedSong.artist}</p>
               </div>
               {/* ============================================================================ */}
               {/* --- SENİN KISMIN BAŞLANGICI: LİSTEYE EKLE BUTONU --- */}
               {/* ============================================================================ */}
               <button onClick={() => setShowAddToPlaylist(!showAddToPlaylist)} className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-2 rounded-lg border border-white/10">+ Listeye</button>
             </div>
             {showAddToPlaylist && (
               <div className="mt-4 p-4 bg-gray-800/50 rounded-xl">
                 {playlists.map(pl => (
                   <button key={pl.id} onClick={() => addSongToPlaylist(pl.id, selectedSong.id)} className="block text-sm text-indigo-400 hover:text-indigo-300 py-1">🎵 {pl.name}</button>
                 ))}
               </div>
             )}
             {/* ============================================================================ */}
             {/* --- SENİN KISMIN BİTİŞİ --- */}
             {/* ============================================================================ */}
          </div>
          
          <div className="p-6">
            {/* ============================================================================ */}
            {/* --- SENİN KISMIN BAŞLANGICI: TRANSPOZE ARAYÜZÜ VE AKORLAR --- */}
            {/* ============================================================================ */}
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3 mb-6">
              <span className="text-xs text-gray-500 font-medium">TRANSPOZE</span>
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={() => setSemitones(s => Math.max(s-1, -6))} className="w-7 h-7 rounded-lg bg-gray-700 text-gray-300 font-bold">−</button>
                <span className="font-mono font-bold w-10 text-center text-sm text-indigo-400">{semitones > 0 ? `+${semitones}` : semitones}</span>
                <button onClick={() => setSemitones(s => Math.min(s+1, 6))} className="w-7 h-7 rounded-lg bg-gray-700 text-gray-300 font-bold">+</button>
              </div>
              {semitones !== 0 && <button onClick={() => setSemitones(0)} className="text-xs text-gray-600 hover:text-red-400">Sıfırla</button>}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {currentChords.map((chord, i) => (
                <span key={i} className={`px-4 py-2 rounded-xl text-base font-bold border ${getChordColor(chord)}`}>{chord}</span>
              ))}
            </div>
            {/* ============================================================================ */}
            {/* --- SENİN KISMIN BİTİŞİ --- */}
            {/* ============================================================================ */}
            
            <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap leading-8 mb-10">{selectedSong.lyrics}</pre>

            {/* ============================================================================ */}
            {/* --- SENİN KISMIN BAŞLANGICI: NOTLAR ARAYÜZÜ --- */}
            {/* ============================================================================ */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Kişisel Notlarım</h3>
              <form onSubmit={addNote} className="flex gap-2 mb-4">
                <input placeholder="Not ekle..." value={newNote} onChange={e => setNewNote(e.target.value)} className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50" />
                <button type="submit" className="bg-indigo-600 text-white px-4 rounded-xl text-sm font-medium">Ekle</button>
              </form>
              <div className="flex flex-col gap-2">
                {notes.map(note => (
                  <div key={note.id} className="flex items-start justify-between bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5">
                    <p className="text-sm text-gray-300">{note.content}</p>
                    <button onClick={() => deleteNote(note.id)} className="text-gray-700 hover:text-red-400 ml-3 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
            {/* ============================================================================ */}
            {/* --- SENİN KISMIN BİTİŞİ --- */}
            {/* ============================================================================ */}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Bir şarkı seçin</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 bg-gray-950/80 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-400">ChordHub</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{user?.email}</span>
            <button onClick={() => signOut(auth)} className="text-xs text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/10">Çıkış</button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        <div className="w-72 bg-gray-900/50 p-4 rounded-2xl border border-white/5">{LeftPanel}</div>
        {RightPanel}
      </div>
    </div>
  );
}