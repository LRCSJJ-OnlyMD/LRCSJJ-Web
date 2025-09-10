"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/primitives/button";
import { Badge } from "@/components/ui/primitives/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { Navbar } from "@/components/ui/layout/navbar";
import { Footer } from "@/components/ui/layout/footer";
import { trpc } from "@/lib/trpc-client";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Medal,
  MapPin,
  User,
  Star,
  ExternalLink,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch post data
  const {
    data: post,
    isLoading,
    error,
  } = trpc.posts.getById.useQuery({
    id: postId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Chargement de l&apos;article...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Article non trouvé
            </h2>
            <p className="text-muted-foreground mb-6">
              Cet article n&apos;existe pas ou a été supprimé.
            </p>
            <Button asChild>
              <Link href="/posts">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux actualités
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const nextImage = () => {
    if (post.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === post.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (post.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/posts"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Actualités
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/posts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux actualités
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className={`text-sm font-medium ${
                    post.type === "ACHIEVEMENT"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : post.type === "NEWS"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-green/10 text-green border-green/20"
                  }`}
                >
                  {getTypeLabel(post.type)}
                </Badge>

                {post.competitionLevel && (
                  <Badge variant="outline" className="text-sm">
                    {post.competitionLevel === "INTERNATIONAL"
                      ? "🌍 International"
                      : post.competitionLevel === "NATIONAL"
                      ? "🇲🇦 National"
                      : "🏆 Régional"}
                  </Badge>
                )}

                {post.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />À la Une
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                {post.medalType && (
                  <span className="mr-3 text-5xl">
                    {getMedalIcon(post.medalType)}
                  </span>
                )}
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.createdAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </div>

                {post.athleteName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.athleteName}
                  </div>
                )}

                {post.clubName && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {post.clubName}
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            {post.images && post.images.length > 0 && (
              <div className="animate-fade-in">
                <div className="relative group">
                  <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-green/10">
                    <Image
                      src={
                        post.images[currentImageIndex]?.url ||
                        "/placeholder-avatar.svg"
                      }
                      alt={
                        post.images[currentImageIndex]?.caption || post.title
                      }
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Navigation Arrows */}
                    {post.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          title="Image précédente"
                          aria-label="Image précédente"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          title="Image suivante"
                          aria-label="Image suivante"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {post.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {post.images.length}
                      </div>
                    )}
                  </div>

                  {/* Image Caption */}
                  {post.images[currentImageIndex]?.caption && (
                    <p className="text-center text-muted-foreground text-sm mt-3 italic">
                      {post.images[currentImageIndex].caption}
                    </p>
                  )}

                  {/* Image Thumbnails */}
                  {post.images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {post.images.map(
                        (
                          image: {
                            id: string;
                            url: string;
                            caption?: string | null;
                          },
                          index: number
                        ) => (
                          <button
                            key={image.id}
                            title={`Voir l'image ${index + 1}`}
                            aria-label={`Voir l'image ${index + 1}`}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              index === currentImageIndex
                                ? "border-primary shadow-lg"
                                : "border-transparent hover:border-primary/50"
                            }`}
                          >
                            <Image
                              src={image.url}
                              alt={image.caption || `Image ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="animate-fade-in">
              <div className="prose prose-lg max-w-none text-foreground">
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>

            {/* Share Actions */}
            <div className="animate-fade-in">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Partager cet article
                  </h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Championship Details */}
            {post.championship && (
              <div className="animate-fade-in">
                <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="w-5 h-5 text-primary" />
                      Championnat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {post.championship.name}
                      </h4>
                      {post.championship.season && (
                        <p className="text-sm text-muted-foreground">
                          Saison {post.championship.season.name}
                        </p>
                      )}
                    </div>

                    {post.championship.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {post.championship.location}
                        </span>
                      </div>
                    )}

                    {post.championship.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {format(
                            new Date(post.championship.startDate),
                            "dd MMMM yyyy",
                            {
                              locale: fr,
                            }
                          )}
                        </span>
                      </div>
                    )}

                    {post.championship.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.championship.description}
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/championships/${post.championship.id}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir le championnat
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Medal Information */}
            {post.medalType && (
              <div className="animate-fade-in">
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Medal className="w-5 h-5 text-primary" />
                      Récompense
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {getMedalIcon(post.medalType)}
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Médaille{" "}
                        {post.medalType === "GOLD"
                          ? "d'Or"
                          : post.medalType === "SILVER"
                          ? "d'Argent"
                          : post.medalType === "BRONZE"
                          ? "de Bronze"
                          : "de Participation"}
                      </h4>
                      {post.competitionLevel && (
                        <p className="text-sm text-muted-foreground">
                          Niveau{" "}
                          {getCompetitionLevelLabel(post.competitionLevel)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Athlete/Club Info */}
            {(post.athleteName || post.clubName) && (
              <div className="animate-fade-in">
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5 text-primary" />
                      Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {post.athleteName && (
                      <div>
                        <p className="text-sm text-muted-foreground">Athlète</p>
                        <p className="font-medium text-foreground">
                          {post.athleteName}
                        </p>
                      </div>
                    )}
                    {post.clubName && (
                      <div>
                        <p className="text-sm text-muted-foreground">Club</p>
                        <p className="font-medium text-foreground">
                          {post.clubName}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
