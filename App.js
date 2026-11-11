import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, TextInput, ScrollView, Pressable, StyleSheet, StatusBar, ActivityIndicator, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = { bg:"#090910", panel:"#151522", panel2:"#211D32", purple:"#9A7BFF", white:"#F8F6FF", muted:"#9B98AD", line:"#2B293A" };
const MANGAS = [
  {id:"blue-lock",title:"Blue Lock",genre:"Sport · Shōnen",status:"En cours",chapters:326,desc:"Trois cents jeunes attaquants sont réunis dans un programme impitoyable pour créer le meilleur buteur du monde.",color:"#254B82",symbol:"⚽"},
  {id:"chainsaw-man",title:"Chainsaw Man",genre:"Action · Surnaturel",status:"En cours",chapters:218,desc:"Denji fusionne avec son démon-tronçonneuse et devient un chasseur de démons.",color:"#8A3E35",symbol:"🪚"},
  {id:"dandadan",title:"DAN DA DAN",genre:"Action · Fantastique",status:"En cours",chapters:220,desc:"Momo et Okarun se retrouvent au cœur d'événements paranormaux qui dépassent tout ce qu'ils imaginaient.",color:"#8055B9",symbol:"👽"},
  {id:"mashle",title:"Mashle",genre:"Comédie · Fantasy",status:"Terminé",chapters:162,desc:"Dans un monde où la magie fait tout, Mash compense son absence de pouvoirs par une force physique absurde.",color:"#587A55",symbol:"💪"},
  {id:"jagaaan",title:"Jagaaan",genre:"Seinen · Action",status:"Terminé",chapters:163,desc:"La vie monotone de Shintarō Jagasaki bascule avec l'apparition de créatures monstrueuses.",color:"#984C55",symbol:"⚡"},
  {id:"one-piece",title:"One Piece",genre:"Aventure · Shōnen",status:"En cours",chapters:1160,desc:"Monkey D. Luffy prend la mer avec son équipage pour trouver le légendaire trésor One Piece.",color:"#A9783D",symbol:"☠️"},
  {id:"frieren",title:"Frieren",genre:"Fantasy · Aventure",status:"En cours",chapters:145,desc:"Après la victoire contre le roi des démons, l'elfe Frieren découvre le temps qui passe et les liens humains.",color:"#548C9A",symbol:"✨"},
  {id:"vinland-saga",title:"Vinland Saga",genre:"Historique · Seinen",status:"Terminé",chapters:220,desc:"Dans l'Europe des Vikings, Thorfinn grandit au milieu de la guerre et de la quête de vengeance.",color:"#826D4D",symbol:"🛡️"}
];
const TABS = [["home","⌂","Accueil"],["catalog","▦","Catalogue"],["library","♡","Bibliothèque"],["legal","↗","Lire légalement"]];

function Cover({m,large=false}) {
  return <View style={[s.cover,{backgroundColor:m.color},large&&s.coverLarge]}><Text style={[s.symbol,large&&{fontSize:54}]}>{m.symbol}</Text><View style={s.coverBand}><Text style={[s.coverName,large&&{fontSize:13}]} numberOfLines={2}>{m.title.toUpperCase()}</Text></View></View>;
}
function Tag({children}) { return <View style={s.tag}><Text style={s.tagText}>{children}</Text></View>; }

export default function App() {
  const [tab,setTab] = useState("home");
  const [query,setQuery] = useState("");
  const [library,setLibrary] = useState({});
  const [selected,setSelected] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{ AsyncStorage.getItem("mh-library").then(v=>{if(v)setLibrary(JSON.parse(v));}).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  const persist = next => { setLibrary(next); AsyncStorage.setItem("mh-library",JSON.stringify(next)).catch(()=>{}); };
  const filtered = useMemo(()=>MANGAS.filter(m=>(m.title+" "+m.genre).toLowerCase().includes(query.toLowerCase())),[query]);
  const toggle = m => { const next={...library}; if(next[m.id]) delete next[m.id]; else next[m.id]={chapter:0}; persist(next); };
  const step = (m,n) => { const old=library[m.id]||{chapter:0}; persist({...library,[m.id]:{chapter:Math.max(0,Math.min(m.chapters,old.chapter+n))}}); };
  const card = m => <Pressable key={m.id} onPress={()=>setSelected(m)} style={s.card}><Cover m={m}/><View style={s.cardText}><Text style={s.cardTitle}>{m.title}</Text><Text style={s.muted}>{m.genre}</Text><Text style={s.cardMeta}>{m.chapters} chapitres · {m.status}</Text>{library[m.id]&&<Tag>Chap. {library[m.id].chapter} lu(s)</Tag>}</View><Text style={s.arrow}>›</Text></Pressable>;
  if(loading) return <SafeAreaView style={s.safe}><ActivityIndicator color={C.purple} style={{flex:1}}/></SafeAreaView>;
  if(selected) {
    const saved=library[selected.id];
    return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content"/><ScrollView contentContainerStyle={s.page}>
      <Pressable onPress={()=>setSelected(null)} style={s.back}><Text style={s.link}>‹  Retour</Text></Pressable>
      <View style={s.detailHero}><Cover m={selected} large/><View style={{flex:1,gap:9}}><Tag>{selected.status}</Tag><Text style={s.detailTitle}>{selected.title}</Text><Text style={s.muted}>{selected.genre}</Text><Text style={s.muted}>{selected.chapters} chapitres référencés</Text></View></View>
      <Text style={s.section}>Synopsis</Text><Text style={s.body}>{selected.desc}</Text>
      <Pressable onPress={()=>toggle(selected)} style={s.primary}><Text style={s.primaryText}>{saved?"Retirer de ma bibliothèque":"+ Ajouter à ma bibliothèque"}</Text></Pressable>
      <Pressable onPress={()=>{setSelected(null);setTab("legal");}} style={s.secondary}><Text style={s.secondaryText}>Voir les plateformes de lecture légales  →</Text></Pressable>
      <Text style={s.section}>Mon suivi de lecture</Text><View style={s.progressCard}><Text style={s.muted}>Dernier chapitre lu</Text><Text style={s.chapter}>{saved?.chapter||0} <Text style={s.muted}>/ {selected.chapters}</Text></Text><View style={s.track}><View style={[s.fill,{width:((saved?.chapter||0)/selected.chapters*100)+"%"}]}/></View><View style={s.controls}><Pressable style={s.counter} onPress={()=>step(selected,-1)}><Text style={s.counterText}>−</Text></Pressable><Pressable style={s.counter} onPress={()=>step(selected,1)}><Text style={s.counterText}>+</Text></Pressable></View></View>
      <Text style={s.note}>Données de démonstration à vérifier. MANGA HUB n'héberge aucun scan ni chapitre protégé.</Text>
    </ScrollView></SafeAreaView>;
  }
  return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content"/><View style={s.page}>
    <View style={s.header}><View><Text style={s.brand}>MANGA <Text style={{color:C.purple}}>HUB</Text></Text><Text style={s.subtitle}>TON UNIVERS MANGA, AU MÊME ENDROIT</Text></View><View style={s.avatar}><Text style={{color:C.purple,fontWeight:"900"}}>MH</Text></View></View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:24}}>
      {tab==="home"&&<><View style={s.hero}><Text style={s.eyebrow}>BIENVENUE DANS TON HUB</Text><Text style={s.heroTitle}>Toute ta passion,{"\n"}une seule <Text style={{color:C.purple}}>destination.</Text></Text><Text style={s.heroSub}>Retrouve tes séries, suis ta lecture et découvre où lire légalement.</Text><Pressable style={s.heroButton} onPress={()=>setTab("catalog")}><Text style={s.heroButtonText}>Explorer le catalogue  →</Text></Pressable></View><View style={s.sectionRow}><Text style={s.section}>À découvrir</Text><Pressable onPress={()=>setTab("catalog")}><Text style={s.link}>Tout voir</Text></Pressable></View>{MANGAS.slice(0,4).map(card)}<View style={s.info}><Text style={s.infoTitle}>✦  La lecture, bien organisée</Text><Text style={s.muted}>Centralise tes séries et garde une trace de tes chapitres lus. Les liens officiels seront ajoutés après vérification.</Text></View></>}
      {tab==="catalog"&&<><Text style={s.pageTitle}>Catalogue</Text><Text style={s.muted}>Trouve ta prochaine série.</Text><TextInput value={query} onChangeText={setQuery} placeholder="Rechercher un manga ou un genre…" placeholderTextColor={C.muted} style={s.search}/><Text style={s.count}>{filtered.length} SÉRIE(S)</Text>{filtered.map(card)}{!filtered.length&&<Text style={s.empty}>Aucun résultat.</Text>}</>}
      {tab==="library"&&<><Text style={s.pageTitle}>Ma bibliothèque</Text><Text style={s.muted}>Tes séries et ton avancement.</Text>{Object.keys(library).length?MANGAS.filter(m=>library[m.id]).map(card):<View style={s.emptyPanel}><Text style={s.emptyIcon}>♡</Text><Text style={s.emptyTitle}>Ta bibliothèque est vide</Text><Text style={s.muted}>Ajoute des mangas depuis le catalogue pour suivre ta lecture.</Text><Pressable onPress={()=>setTab("catalog")} style={s.primary}><Text style={s.primaryText}>Parcourir le catalogue</Text></Pressable></View>}</>}
      {tab==="legal"&&<><Text style={s.pageTitle}>Lire légalement</Text><Text style={s.muted}>Retrouve les plateformes officielles. La disponibilité de chaque manga dépend des droits, de la langue et du pays.</Text>
        <Pressable onPress={()=>Linking.openURL("https://mangaplus.shueisha.co.jp/")} style={s.platform}><View style={{flex:1}}><Text style={s.platformTitle}>MANGA Plus by SHUEISHA</Text><Text style={s.muted}>Chapitres officiels, notamment des séries Shueisha. Français disponible sur une sélection.</Text></View><Text style={s.arrow}>↗</Text></Pressable>
        <Pressable onPress={()=>Linking.openURL("https://www.mangas.io/")} style={s.platform}><View style={{flex:1}}><Text style={s.platformTitle}>Mangas.io</Text><Text style={s.muted}>Catalogue de mangas en français par abonnement.</Text></View><Text style={s.arrow}>↗</Text></Pressable>
        <Pressable onPress={()=>Linking.openURL("https://www.izneo.com/fr/")} style={s.platform}><View style={{flex:1}}><Text style={s.platformTitle}>izneo</Text><Text style={s.muted}>Achat et lecture numérique de bandes dessinées et mangas.</Text></View><Text style={s.arrow}>↗</Text></Pressable>
        <View style={s.info}><Text style={s.infoTitle}>À savoir</Text><Text style={s.muted}>Ces liens mènent vers les services officiels. MANGA HUB ne stocke ni ne diffuse de scans. Les catalogues changent : vérifie directement sur chaque plateforme si le titre recherché est disponible.</Text></View>
      </>}
    </ScrollView><View style={s.tabs}>{TABS.map(([key,icon,label])=><Pressable key={key} onPress={()=>setTab(key)} style={s.tab}><Text style={[s.tabIcon,tab===key&&s.active]}>{icon}</Text><Text style={[s.tabLabel,tab===key&&s.active]}>{label}</Text></Pressable>)}</View>
  </View></SafeAreaView>;
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},page:{flex:1,paddingHorizontal:20,paddingTop:12},
 header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingBottom:20},
 brand:{color:C.white,fontSize:23,fontWeight:"900",letterSpacing:1.2},subtitle:{color:C.muted,fontSize:8,letterSpacing:1.4,marginTop:3},
 avatar:{width:38,height:38,borderRadius:13,backgroundColor:C.panel2,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:C.line},
 hero:{padding:22,borderRadius:24,backgroundColor:"#171426",borderWidth:1,borderColor:"#302747",marginBottom:22},
 eyebrow:{color:C.purple,fontSize:9,letterSpacing:1.8,fontWeight:"800",marginBottom:13},
 heroTitle:{color:C.white,fontSize:30,fontWeight:"900",lineHeight:36},heroSub:{color:C.muted,fontSize:13,lineHeight:20,marginTop:12},
 heroButton:{alignSelf:"flex-start",backgroundColor:C.purple,paddingHorizontal:16,paddingVertical:12,borderRadius:12,marginTop:20},
 heroButtonText:{color:"#100D1A",fontWeight:"900",fontSize:12},
 sectionRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:9},
 section:{color:C.white,fontSize:18,fontWeight:"800",marginTop:18,marginBottom:12},
 link:{color:C.purple,fontSize:13,fontWeight:"700"},
 card:{flexDirection:"row",alignItems:"center",backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:17,padding:10,marginBottom:10},
 cover:{width:66,height:82,borderRadius:11,overflow:"hidden",alignItems:"center",justifyContent:"center"},
 coverLarge:{width:142,height:190,borderRadius:18},symbol:{fontSize:28},
 coverBand:{position:"absolute",bottom:0,left:0,right:0,padding:5,backgroundColor:"rgba(0,0,0,0.4)"},
 coverName:{color:"#fff",fontSize:8,fontWeight:"900",textAlign:"center"},
 cardText:{flex:1,paddingHorizontal:12,gap:4},cardTitle:{color:C.white,fontSize:15,fontWeight:"800"},
 muted:{color:C.muted,fontSize:11,lineHeight:17},cardMeta:{color:"#C7C3D5",fontSize:10,marginTop:2},arrow:{color:C.muted,fontSize:24,paddingHorizontal:5},
 tag:{alignSelf:"flex-start",backgroundColor:"#27213B",paddingHorizontal:8,paddingVertical:4,borderRadius:7,marginTop:3},
 tagText:{color:"#C6B5FF",fontSize:9,fontWeight:"700"},
 info:{padding:17,borderRadius:16,backgroundColor:C.panel,marginTop:14,borderColor:C.line,borderWidth:1},
 infoTitle:{color:C.white,fontWeight:"800",marginBottom:7},
 pageTitle:{color:C.white,fontSize:28,fontWeight:"900",marginTop:12,marginBottom:3},
 search:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:13,paddingHorizontal:15,paddingVertical:13,color:C.white,marginTop:18,marginBottom:15,fontSize:13},
 count:{color:C.muted,fontSize:9,letterSpacing:1.5,fontWeight:"800",marginBottom:10},
 empty:{color:C.muted,textAlign:"center",marginTop:40},
 emptyPanel:{alignItems:"center",padding:25,backgroundColor:C.panel,borderRadius:20,marginTop:30,borderColor:C.line,borderWidth:1},
 emptyIcon:{color:C.purple,fontSize:42,marginBottom:10},emptyTitle:{color:C.white,fontWeight:"800",fontSize:17,marginBottom:8},
 primary:{backgroundColor:C.purple,borderRadius:12,padding:14,alignItems:"center",marginTop:18},
 primaryText:{color:"#100D1A",fontWeight:"900",fontSize:12},
 secondary:{borderWidth:1,borderColor:C.line,borderRadius:12,padding:14,alignItems:"center",marginTop:10},
 secondaryText:{color:C.purple,fontWeight:"800",fontSize:12},
 platform:{flexDirection:"row",alignItems:"center",backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:16,padding:16,marginTop:12,gap:12},
 platformTitle:{color:C.white,fontSize:15,fontWeight:"800",marginBottom:5},
 back:{paddingVertical:10},detailHero:{flexDirection:"row",gap:17,alignItems:"center",marginTop:12},
 detailTitle:{color:C.white,fontSize:24,fontWeight:"900"},body:{color:"#D0CDDA",fontSize:13,lineHeight:21},
 progressCard:{backgroundColor:C.panel,padding:18,borderRadius:17,borderWidth:1,borderColor:C.line},
 chapter:{color:C.white,fontSize:29,fontWeight:"900",marginTop:8},
 track:{height:6,backgroundColor:C.line,borderRadius:5,marginTop:12,overflow:"hidden"},
 fill:{height:6,backgroundColor:C.purple,borderRadius:5},
 controls:{flexDirection:"row",gap:10,marginTop:15},
 counter:{width:42,height:38,borderRadius:10,backgroundColor:C.panel2,alignItems:"center",justifyContent:"center"},
 counterText:{color:C.white,fontSize:22,fontWeight:"700"},note:{color:C.muted,fontSize:10,lineHeight:16,marginTop:15},
 tabs:{flexDirection:"row",borderTopWidth:1,borderTopColor:C.line,paddingTop:9,paddingBottom:8},
 tab:{flex:1,alignItems:"center",gap:3},tabIcon:{color:C.muted,fontSize:21},tabLabel:{color:C.muted,fontSize:9,fontWeight:"600"},active:{color:C.purple}
});