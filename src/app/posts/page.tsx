"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/primitives/button";
import { Badge } from "@/components/ui/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { Input } from "@/components/ui/primitives/input";
import { Navbar } from "@/components/ui/layout/navbar";
import { Footer } from "@/components/ui/layout/footer";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Star,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  ChevronRight,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  // Fetch posts data
  const { data: postsData } = trpc.posts.getAll.useQuery({
    limit: 50,
    type:
      typeFilter === "ALL"
        ? undefined
        : (typeFilter as "ACHIEVEMENT" | "NEWS" | "CHAMPIONSHIP_RESULT"),
  });

  const { data: featuredPosts } = trpc.posts.getFeatured.useQuery();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPosts = postsData?.posts?.filter((post: any) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.athleteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.clubName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      levelFilter === "ALL" || post.competitionLevel === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const getMedalIcon = (medalType: string) => {
    switch (medalType) {
      case "GOLD":
        return "🥇";
      case "SILVER":
        return "🥈";
      case "BRONZE":
        return "🥉";
      case "PARTICIPATION":
        return "🏅";
      default:
        return "🏆";
    }
  };

  const getCompetitionLevelColor = (level: string) => {
    switch (level) {
      case "INTERNATIONAL":
        return "text-red-600 bg-red-50 border-red-200";
      case "NATIONAL":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "REGIONAL":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ACHIEVEMENT":
        return "Réalisation";
      case "NEWS":
        return "Actualité";
      case "CHAMPIONSHIP_RESULT":
        return "Résultat";
      default:
        return type;
    }
  };

  const getCompetitionLevelLabel = (level: string) => {
    switch (level) {
      case "INTERNATIONAL":
        return "International";
      case "NATIONAL":
        return "National";
      case "REGIONAL":
        return "Régional";
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;Accueil
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Trophy className="h-4 w-4 mr-2" />
            Actualités & Réalisations
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Nos <span className="text-primary">Réalisations</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up animate-stagger-1">
            Découvrez les dernières actualités et réalisations exceptionnelles
            de nos athlètes sur la scène nationale et internationale
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Featured Achievements */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Réalisations à la Une
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nos plus grandes victoires et moments de fierté
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {featuredPosts.slice(0, 3).map((post: any) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-all duration-300 border-2 border-[#d62027]/20 card-smooth animate-fade-in"
                >
                  {post.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={post.images[0].url}
                        alt={post.images[0].caption || post.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#d62027] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />À la une
                        </span>
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.medalType && (
                        <span className="mr-2 text-2xl">
                          {getMedalIcon(post.medalType)}
                        </span>
                      )}
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.competitionLevel && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCompetitionLevelColor(
                              post.competitionLevel
                            )}`}
                          >
                            🌍 {getCompetitionLevelLabel(post.competitionLevel)}
                          </span>
                        )}
                      </div>
                      {post.athleteName && (
                        <div className="flex items-center gap-1 text-xs">
                          <User className="w-3 h-3" />
                          {post.athleteName}
                        </div>
                      )}
                      {post.clubName && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <MapPin className="w-3 h-3" />
                          {post.clubName}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.createdAt), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters Section */}
        <section className="mb-12 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Filtrer les Publications
              </h3>
              <p className="text-muted-foreground">
                Trouvez exactement ce que vous cherchez
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background/50 border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les types</SelectItem>
                  <SelectItem value="ACHIEVEMENT">🏆 Réalisations</SelectItem>
                  <SelectItem value="NEWS">📰 Actualités</SelectItem>
                  <SelectItem value="CHAMPIONSHIP_RESULT">
                    🏅 Résultats
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="bg-background/50 border-border">
                  <Medal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les niveaux</SelectItem>
                  <SelectItem value="INTERNATIONAL">
                    🌍 International
                  </SelectItem>
                  <SelectItem value="NATIONAL">🇲🇦 National</SelectItem>
                  <SelectItem value="REGIONAL">🏆 Régional</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-end bg-background/30 rounded-lg px-4 py-2 border border-border">
                <Trophy className="w-4 h-4 mr-2" />
                {filteredPosts?.length || 0} résultats
              </div>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Toutes les Publications
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez l&apos;ensemble de nos actualités, réalisations et
              résultats
            </p>
          </div>

          {filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {filteredPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block group"
                >
                  <article className="bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
                    {/* Post Image */}
                    {post.images.length > 0 && (
                      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-green/10 overflow-hidden">
                        <Image
                          src={post.images[0].url}
                          alt={post.images[0].caption || post.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Featured Badge */}
                        {post.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs shadow-lg">
                              <Star className="w-3 h-3 mr-1" />À la Une
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="p-6">
                      {/* Type and Level Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium ${
                            post.type === "ACHIEVEMENT"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : post.type === "NEWS"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-green/10 text-green border-green/20"
                          }`}
                        >
                          {post.type === "ACHIEVEMENT" && (
                            <Trophy className="w-3 h-3 mr-1" />
                          )}
                          {post.type === "NEWS" && (
                            <MessageSquare className="w-3 h-3 mr-1" />
                          )}
                          {post.type === "CHAMPIONSHIP_RESULT" && (
                            <Medal className="w-3 h-3 mr-1" />
                          )}
                          {getTypeLabel(post.type)}
                        </Badge>

                        {post.competitionLevel && (
                          <Badge
                            variant="outline"
                            className="text-xs border-border"
                          >
                            {post.competitionLevel === "INTERNATIONAL"
                              ? "🌍 International"
                              : post.competitionLevel === "NATIONAL"
                              ? "🇲🇦 National"
                              : "🏆 Régional"}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xl text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {post.medalType && (
                          <span className="mr-2 text-2xl">
                            {getMedalIcon(post.medalType)}
                          </span>
                        )}
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>

                      {/* Athlete and Club Info */}
                      {(post.athleteName || post.clubName) && (
                        <div className="space-y-2 mb-4">
                          {post.athleteName && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span className="font-medium">
                                {post.athleteName}
                              </span>
                            </div>
                          )}
                          {post.clubName && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span className="font-medium">
                                {post.clubName}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Championship */}
                      {post.championship && (
                        <div className="flex items-center gap-2 mb-4 p-3 bg-background/50 rounded-lg border border-border">
                          <Trophy className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs font-medium text-primary">
                              {post.championship.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.createdAt), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-green/10 rounded-full flex items-center justify-center">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucune publication trouvée
              </h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos critères de recherche ou vérifiez plus
                tard.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("ALL");
                  setLevelFilter("ALL");
                }}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
