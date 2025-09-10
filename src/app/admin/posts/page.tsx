"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/primitives/dialog";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import {
  ArrowLeft,
  Trophy,
  Plus,
  Search,
  Filter,
  Camera,
  Upload,
  X,
  Star,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

// Type definitions
type PostType = "ACHIEVEMENT" | "NEWS" | "CHAMPIONSHIP_RESULT";
type MedalType = "GOLD" | "SILVER" | "BRONZE" | "PARTICIPATION";
type CompetitionLevel = "REGIONAL" | "NATIONAL" | "INTERNATIONAL";

interface PostImage {
  id: string;
  url: string;
  publicId: string;
  caption: string | null;
}

// Component definition

interface PostFormData {
  title: string;
  content: string;
  type: PostType;
  championshipId: string;
  medalType: MedalType | "";
  competitionLevel: CompetitionLevel | "";
  athleteName: string;
  clubName: string;
  images: Array<{
    url: string;
    publicId: string;
    caption: string;
  }>;
  isPublished: boolean;
  featured: boolean;
}

export default function AdminPostsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    type: "ACHIEVEMENT",
    championshipId: "",
    medalType: "",
    competitionLevel: "",
    athleteName: "",
    clubName: "",
    images: [],
    isPublished: true,
    featured: false,
  });
  const [imageUploading, setImageUploading] = useState(false);

  // State management

  // Fetch data
  const { data: posts, refetch: refetchPosts } = trpc.posts.getAll.useQuery({
    limit: 50,
    type: typeFilter === "ALL" ? undefined : (typeFilter as PostType),
  });

  const { data: championships } = trpc.championships.getAll.useQuery();

  // Mutations
  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Post créé avec succès");
      setShowCreateDialog(false);
      resetForm();
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const updatePostMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success("Post mis à jour avec succès");
      setEditingPost(null);
      resetForm();
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const deletePostMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("Post supprimé avec succès");
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "ACHIEVEMENT",
      championshipId: "",
      medalType: "",
      competitionLevel: "",
      athleteName: "",
      clubName: "",
      images: [],
      isPublished: true,
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const submitData = {
      ...formData,
      medalType: formData.medalType || undefined,
      competitionLevel: formData.competitionLevel || undefined,
      championshipId: formData.championshipId || undefined,
      athleteName: formData.athleteName || undefined,
      clubName: formData.clubName || undefined,
      images: formData.images.length > 0 ? formData.images : undefined,
    };

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost, ...submitData });
    } else {
      createPostMutation.mutate(submitData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Create FormData for Cloudinary upload
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "lrcsjj_posts"); // You need to create this preset in Cloudinary
        formDataUpload.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                url: data.secure_url,
                publicId: data.public_id,
                caption: "",
              },
            ],
          }));
        }
      }
      toast.success("Images téléchargées avec succès");
    } catch (error) {
      logger.error("Image upload failed in admin posts", {
        feature: "admin_posts",
        action: "image_upload_error",
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error("Erreur lors du téléchargement des images");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPosts = posts?.posts?.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.athleteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        return "text-red-600 bg-red-50";
      case "NATIONAL":
        return "text-blue-600 bg-blue-50";
      case "REGIONAL":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Tableau de Bord
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#d62027]" />
            Gestion des Posts et Réalisations
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les actualités, réalisations et résultats de championnats
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#017444] hover:bg-[#017444]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Post
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher dans les posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type de post" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            <SelectItem value="ACHIEVEMENT">Réalisations</SelectItem>
            <SelectItem value="NEWS">Actualités</SelectItem>
            <SelectItem value="CHAMPIONSHIP_RESULT">Résultats</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground flex items-center justify-end">
          Total: {filteredPosts?.length || 0} posts
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {filteredPosts?.map((post: any) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {post.medalType && (
                      <span className="mr-2">
                        {getMedalIcon(post.medalType)}
                      </span>
                    )}
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.type === "ACHIEVEMENT"
                            ? "bg-yellow-100 text-yellow-800"
                            : post.type === "NEWS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {post.type === "ACHIEVEMENT"
                          ? "Réalisation"
                          : post.type === "NEWS"
                          ? "Actualité"
                          : "Résultat"}
                      </span>
                      {post.competitionLevel && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionLevelColor(
                            post.competitionLevel
                          )}`}
                        >
                          {post.competitionLevel}
                        </span>
                      )}
                      {post.featured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Star className="w-3 h-3 inline mr-1" />À la une
                        </span>
                      )}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {post.images.length > 0 && (
                <div className="mb-4">
                  <Image
                    src={post.images[0].url}
                    alt={post.images[0].caption || post.title}
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {post.content}
              </p>

              {(post.athleteName || post.clubName) && (
                <div className="text-xs text-muted-foreground mb-4">
                  {post.athleteName && <div>Athlète: {post.athleteName}</div>}
                  {post.clubName && <div>Club: {post.clubName}</div>}
                </div>
              )}

              <div className="text-xs text-muted-foreground mb-4">
                {format(new Date(post.createdAt), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // View post functionality
                      toast.info(
                        "Fonctionnalité de visualisation à implémenter"
                      );
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPost(post.id);
                      setFormData({
                        title: post.title,
                        content: post.content,
                        type: post.type,
                        championshipId: post.championshipId || "",
                        medalType: post.medalType || "",
                        competitionLevel: post.competitionLevel || "",
                        athleteName: post.athleteName || "",
                        clubName: post.clubName || "",
                        images: post.images.map((img: PostImage) => ({
                          url: img.url,
                          publicId: img.publicId,
                          caption: img.caption || "",
                        })),
                        isPublished: post.isPublished,
                        featured: post.featured,
                      });
                      setShowCreateDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (
                      confirm("Êtes-vous sûr de vouloir supprimer ce post ?")
                    ) {
                      deletePostMutation.mutate({ id: post.id });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Modifier le Post" : "Créer un Nouveau Post"}
            </DialogTitle>
            <DialogDescription>
              Ajoutez des réalisations, actualités ou résultats de championnats
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Titre du post"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de Post *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: PostType) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACHIEVEMENT">🏆 Réalisation</SelectItem>
                    <SelectItem value="NEWS">📰 Actualité</SelectItem>
                    <SelectItem value="CHAMPIONSHIP_RESULT">
                      🏅 Résultat de Championnat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Décrivez la réalisation ou l'actualité..."
                className="w-full min-h-[100px] p-3 border rounded-md"
                required
              />
            </div>

            {formData.type === "ACHIEVEMENT" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medalType">Type de Médaille</Label>
                  <Select
                    value={formData.medalType}
                    onValueChange={(value: MedalType) =>
                      setFormData((prev) => ({ ...prev, medalType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOLD">🥇 Or</SelectItem>
                      <SelectItem value="SILVER">🥈 Argent</SelectItem>
                      <SelectItem value="BRONZE">🥉 Bronze</SelectItem>
                      <SelectItem value="PARTICIPATION">
                        🏅 Participation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitionLevel">
                    Niveau de Compétition
                  </Label>
                  <Select
                    value={formData.competitionLevel}
                    onValueChange={(value: CompetitionLevel) =>
                      setFormData((prev) => ({
                        ...prev,
                        competitionLevel: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGIONAL">🏆 Régional</SelectItem>
                      <SelectItem value="NATIONAL">🇲🇦 National</SelectItem>
                      <SelectItem value="INTERNATIONAL">
                        🌍 International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="athleteName">Nom de l&apos;Athlète</Label>
                <Input
                  id="athleteName"
                  value={formData.athleteName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      athleteName: e.target.value,
                    }))
                  }
                  placeholder="Nom de l'athlète"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clubName">Nom du Club</Label>
                <Input
                  id="clubName"
                  value={formData.clubName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clubName: e.target.value,
                    }))
                  }
                  placeholder="Nom du club"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="championship">Championnat (optionnel)</Label>
              <Select
                value={formData.championshipId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, championshipId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un championnat..." />
                </SelectTrigger>
                <SelectContent>
                  {championships?.map((championship) => (
                    <SelectItem key={championship.id} value={championship.id}>
                      {championship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    {imageUploading ? (
                      <>
                        <Upload className="w-4 h-4 animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Ajouter des images
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url}
                        alt={`Upload ${index + 1}`}
                        width={100}
                        height={80}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Publier immédiatement</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Mettre à la une</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={
                  createPostMutation.isPending ||
                  updatePostMutation.isPending ||
                  imageUploading
                }
                className="bg-[#017444] hover:bg-[#017444]/90"
              >
                {editingPost ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
