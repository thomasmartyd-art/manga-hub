import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";

const MANGAS = [
  { id: "blue-lock", title: "Blue Lock", genre: "Sport", status: "En cours", volumes: "1–20", description: "Après l'élimination du Japon en Coupe du monde, un programme radical rassemble les meilleurs jeunes attaquants pour créer le buteur ultime.", accent: "#4B8DFF", symbol: "⚽" },
  { id: "chainsaw-man", title: "Chainsaw Man", genre: "Action", status: "En cours", volumes: "1–16", description: "Denji mène une vie difficile jusqu'à sa rencontre avec Pochita. Une histoire déjantée entre démons, action et humour noir.", accent: "#E65D4F", symbol: "🪚" },
  { id: "dan-da-dan", title: "DAN DA DAN", genre: "Surnaturel", status: "En cours", volumes: "1–4", description: "Deux lycéens que tout oppose se retrouvent plongés dans des phénomènes paranormaux complètement imprévisibles.", accent: "#B56CFF", symbol: "👁" },
  { id: "mashle", title: "Mashle", genre: "Fantaisie", status: "Terminé", volumes: "1–13", description: "Dans un monde où la magie fait tout, Mash n'a qu'une arme : sa force physique hors norme.", accent: "#A5C96B", symbol: "✦" },
  { id: "jagaaan", title: "Jagaaan", genre: "Action", status: "Terminé", volumes: "1–12", description: "Un thriller sombre où les désirs les plus enfouis prennent une forme monstrueuse.", accent: "#D5A04D", symbol: "☠" },
  { id: "one-piece", title: "One Piece", genre: "Aventure", status: "En cours", volumes: "1–", description: "Luffy et son équipage prennent la mer à la recherche du légendaire trésor One Piece.", accent: "#E6B94F", symbol: "☠" },
  { id: "frieren", title: "Frieren", genre: "Fantaisie", status: "En cours", volumes: "1–", description: "Après la grande aventure, l'elfe Frieren découvre le temps, les souvenirs et les liens qu'elle a tissés.", accent: "#70B9C9", symbol: "❄" },
  { id: "vinland-saga", title: "Vinland Saga", genre: "Historique", status: "En cours", volumes: "1–", description: "Une fresque historique puissante autour de Thorfinn, de la vengeance et de la quête d'un monde meilleur.", accent: "#C58A59", symbol: "⚔" }
];

const FILTERS = ["Tous", "Action", "Sport", "Fantaisie", "Aventure", "Surnaturel", "Historique"];

function MangaCard({ manga, saved, onPress, onSave }) {
  return (
    <Pressable style={styles.mangaCard} onPress={onPress}>
      <View style={[styles.cover, { backgroundColor: manga.accent }]}>
        <Text style={styles.coverSymbol}>{manga.symbol}</Text>
        <Text style={styles.coverTitle}>{manga.title.toUpperCase()}</Text>
        <Text style={styles.coverSmall}>MANGA HUB • ÉDITION</Text>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeading}>
          <Text style={styles.cardTitle} numberOfLines={1}>{manga.title}</Text>
          <Pressable onPress={onSave} hitSlop={10}>
            <Text style={[styles.bookmark, saved && styles.bookmarkActive]}>{saved ? "♥" : "♡"}</Text>
          </Pressable>
        </View>
        <Text style={styles.muted}>{manga.genre}  •  {manga.status}</Text>
        <Text style={styles.volumeText}>Tomes : {manga.volumes}</Text>
      </View>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState("Accueil");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [saved, setSaved] = useState(["blue-lock", "chainsaw-man"]);
  const [selected, setSelected] = useState(null);

  const visibleMangas = useMemo(() => MANGAS.filter((manga) => {
    const matchesQuery = manga.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Tous" || manga.genre === filter;
    const matchesTab = tab !== "Ma bibliothèque" || saved.includes(manga.id);
    return matchesQuery && matchesFilter && matchesTab;
  }), [query, filter, tab, saved]);

  const toggleSaved = (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const changeTab = (nextTab) => {
    setSelected(null);
    setTab(nextTab);
    setQuery("");
    setFilter("Tous");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MANGA<Text style={styles.brandAccent}> HUB</Text></Text>
          <Text style={styles.tagline}>TON UNIVERS MANGA, AU MÊME ENDROIT</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>MH</Text></View>
      </View>

      {selected ? (
        <ScrollView contentContainerStyle={styles.page}>
          <Pressable onPress={() => setSelected(null)} style={styles.backButton}><Text style={styles.backText}>‹  Retour au catalogue</Text></Pressable>
          <View style={[styles.detailCover, { backgroundColor: selected.accent }]}>
            <Text style={styles.detailSymbol}>{selected.symbol}</Text>
            <Text style={styles.detailCoverTitle}>{selected.title.toUpperCase()}</Text>
            <Text style={styles.coverSmall}>MANGA HUB • FICHE SÉRIE</Text>
          </View>
          <Text style={styles.detailTitle}>{selected.title}</Text>
          <Text style={styles.muted}>{selected.genre}  •  {selected.status}  •  Tomes {selected.volumes}</Text>
          <Text style={styles.sectionTitle}>À PROPOS</Text>
          <Text style={styles.description}>{selected.description}</Text>
          <Pressable style={styles.primaryButton} onPress={() => toggleSaved(selected.id)}>
            <Text style={styles.primaryButtonText}>{saved.includes(selected.id) ? "♥  Dans ma bibliothèque" : "+  Ajouter à ma bibliothèque"}</Text>
          </Pressable>
          <View style={styles.notice}><Text style={styles.noticeTitle}>Où lire cette série ?</Text><Text style={styles.noticeText}>Les liens vers les plateformes de lecture officielles seront ajoutés et vérifiés dans une prochaine étape.</Text></View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          {tab === "Accueil" && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>BIENVENUE DANS TON QG</Text>
                <Text style={styles.heroTitle}>Le prochain chapitre{ "\n" }commence ici.</Text>
                <Text style={styles.heroText}>Retrouve tes séries, explore de nouveaux univers et garde ta lecture à jour.</Text>
                <Pressable style={styles.heroButton} onPress={() => changeTab("Catalogue")}><Text style={styles.heroButtonText}>Explorer les mangas  →</Text></Pressable>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statBox}><Text style={styles.statNumber}>{MANGAS.length}</Text><Text style={styles.statLabel}>SÉRIES</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>{saved.length}</Text><Text style={styles.statLabel}>MA BIBLIOTHÈQUE</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>01</Text><Text style={styles.statLabel}>ESPACE LECTURE</Text></View>
              </View>
              <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>À DÉCOUVRIR</Text><Pressable onPress={() => changeTab("Catalogue")}><Text style={styles.seeAll}>Tout voir →</Text></Pressable></View>
            </>
          )}

          {tab !== "Accueil" && <Text style={styles.pageTitle}>{tab === "Catalogue" ? "Explorer" : "Ma bibliothèque"}</Text>}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un manga..."
            placeholderTextColor="#77758A"
            style={styles.search}
            autoCapitalize="none"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {FILTERS.map((item) => (
              <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
                <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{tab === "Accueil" ? "SÉLECTION MANGA HUB" : "SÉRIES"}</Text><Text style={styles.resultCount}>{visibleMangas.length} résultat(s)</Text></View>
          {visibleMangas.length ? visibleMangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} saved={saved.includes(manga.id)} onPress={() => setSelected(manga)} onSave={() => toggleSaved(manga.id)} />
          )) : <View style={styles.empty}><Text style={styles.emptyTitle}>Aucun manga trouvé</Text><Text style={styles.muted}>Essaie une autre recherche ou un autre filtre.</Text></View>}
          <Text style={styles.footer}>MANGA HUB • VERSION DE DÉMARRAGE</Text>
        </ScrollView>
      )}

      <View style={styles.tabBar}>
        {[["Accueil", "⌂"], ["Catalogue", "▦"], ["Ma bibliothèque", "♡"]].map(([name, icon]) => (
          <Pressable key={name} onPress={() => changeTab(name)} style={styles.tabItem}>
            <Text style={[styles.tabIcon, tab === name && styles.tabSelected]}>{icon}</Text>
            <Text style={[styles.tabLabel, tab === name && styles.tabSelected]}>{name}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0A10" },
  header: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#24212D" },
  brand: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", letterSpacing: 1.4 },
  brandAccent: { color: "#A78BFA" },
  tagline: { color: "#777386", fontSize: 8, letterSpacing: 1.4, marginTop: 3, fontWeight: "700" },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: "#211B32", borderWidth: 1, borderColor: "#59458A", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#C4B5FD", fontWeight: "900", fontSize: 12 },
  page: { padding: 20, paddingBottom: 34 },
  hero: { backgroundColor: "#171323", borderRadius: 22, borderWidth: 1, borderColor: "#44345F", padding: 22, marginBottom: 16 },
  eyebrow: { color: "#B9A1FF", fontSize: 9, letterSpacing: 1.8, fontWeight: "900" },
  heroTitle: { color: "#FFFFFF", fontSize: 29, lineHeight: 35, fontWeight: "900", marginTop: 12 },
  heroText: { color: "#B8B3C5", fontSize: 13, lineHeight: 20, marginTop: 10 },
  heroButton: { backgroundColor: "#8B5CF6", borderRadius: 12, alignSelf: "flex-start", paddingHorizontal: 15, paddingVertical: 12, marginTop: 18 },
  heroButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: "#15131C", borderRadius: 14, borderWidth: 1, borderColor: "#292532", padding: 12 },
  statNumber: { color: "#FFFFFF", fontSize: 21, fontWeight: "900" },
  statLabel: { color: "#858092", fontSize: 7, fontWeight: "800", marginTop: 5, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 12 },
  sectionTitle: { color: "#F2EFFA", fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginTop: 18, marginBottom: 10 },
  seeAll: { color: "#B79BFF", fontSize: 11, fontWeight: "700" },
  search: { height: 46, borderRadius: 13, backgroundColor: "#17151F", borderWidth: 1, borderColor: "#302B3A", paddingHorizontal: 15, color: "#FFFFFF", fontSize: 13, marginBottom: 13 },
  filters: { gap: 8, paddingBottom: 8 },
  filterChip: { borderRadius: 30, borderWidth: 1, borderColor: "#393344", paddingHorizontal: 13, paddingVertical: 8, backgroundColor: "#15131C" },
  filterChipActive: { backgroundColor: "#6D45C3", borderColor: "#9A79F4" },
  filterText: { color: "#A8A2B4", fontSize: 10, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },
  resultCount: { color: "#817B8D", fontSize: 10, marginTop: 18 },
  mangaCard: { flexDirection: "row", backgroundColor: "#15131C", borderRadius: 16, borderWidth: 1, borderColor: "#2B2734", padding: 10, marginBottom: 10, gap: 13 },
  cover: { width: 88, height: 112, borderRadius: 9, alignItems: "center", justifyContent: "center", padding: 6, overflow: "hidden" },
  coverSymbol: { color: "rgba(15,12,20,0.75)", fontSize: 28, fontWeight: "900" },
  coverTitle: { color: "#17121F", fontSize: 11, fontWeight: "900", textAlign: "center", marginTop: 5 },
  coverSmall: { color: "rgba(20,16,26,0.65)", fontSize: 5, letterSpacing: 1, fontWeight: "900", marginTop: 5 },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", flex: 1 },
  bookmark: { color: "#8B8499", fontSize: 25, paddingHorizontal: 4 },
  bookmarkActive: { color: "#C4A7FF" },
  muted: { color: "#928C9E", fontSize: 10, marginTop: 6 },
  volumeText: { color: "#C0BACA", fontSize: 10, marginTop: 10 },
  pageTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", marginBottom: 18 },
  empty: { alignItems: "center", padding: 35, backgroundColor: "#15131C", borderRadius: 15, marginTop: 10 },
  emptyTitle: { color: "#FFFFFF", fontWeight: "800", marginBottom: 6 },
  footer: { color: "#5F5A69", textAlign: "center", fontSize: 8, letterSpacing: 1.2, marginTop: 22 },
  tabBar: { flexDirection: "row", backgroundColor: "#111018", borderTopWidth: 1, borderTopColor: "#2B2734", paddingTop: 10, paddingBottom: 9 },
  tabItem: { flex: 1, alignItems: "center", gap: 3 },
  tabIcon: { color: "#777184", fontSize: 21 },
  tabLabel: { color: "#777184", fontSize: 9, fontWeight: "700" },
  tabSelected: { color: "#B99AFF" },
  backButton: { marginBottom: 16 },
  backText: { color: "#B99AFF", fontSize: 13, fontWeight: "700" },
  detailCover: { height: 205, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  detailSymbol: { color: "rgba(15,12,20,0.7)", fontSize: 52, fontWeight: "900" },
  detailCoverTitle: { color: "#17121F", fontSize: 26, fontWeight: "900", marginTop: 8 },
  detailTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", marginBottom: 3 },
  description: { color: "#C2BDCC", fontSize: 14, lineHeight: 22, marginTop: 5, marginBottom: 18 },
  primaryButton: { backgroundColor: "#8B5CF6", borderRadius: 13, padding: 15, alignItems: "center", marginTop: 5 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  notice: { backgroundColor: "#17151F", borderRadius: 14, borderWidth: 1, borderColor: "#393044", padding: 15, marginTop: 16 },
  noticeTitle: { color: "#EDE7FF", fontWeight: "800", fontSize: 12 },
  noticeText: { color: "#A8A2B4", fontSize: 11, lineHeight: 17, marginTop: 6 }
});