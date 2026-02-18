"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { useSession } from "@/components/auth/SessionProvider";
import { User as UserIcon, Image as ImageIcon, Lock, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileTab from "@/components/dashboard/ProfileTab";
import PhotosTab from "@/components/dashboard/PhotosTab";
import SecurityTab from "@/components/dashboard/SecurityTab";

export default function Dashboard() {
  const { user, loading: sessionLoading } = useSession();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchPerfil();
    }
  }, [user, sessionLoading]);

  useEffect(() => {
    if (!loading && locationInputRef.current && window.google) {
      autocompleteRef.current = new google.maps.places.Autocomplete(locationInputRef.current, {
        componentRestrictions: { country: "br" },
        fields: ["formatted_address", "geometry"],
        types: ["(cities)"]
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          setPerfil((prev: any) => ({
            ...prev,
            localizacao: place.formatted_address,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng()
          }));
          toast.success("Localização atualizada!");
        }
      });
    }
  }, [loading]);

  const fetchPerfil = async () => {
    try {
      if (!user) return;

      let { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("perfis")
          .insert([{ id: user.id, email: user.email, nome: user.user_metadata?.nome || "Nova Profissional" }])
          .select()
          .single();
        if (createError) throw createError;
        data = newProfile;
      }
      setPerfil(data);
    } catch (err) {
      toast.error("Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    const { error } = await supabase.from("perfis").update(perfil).eq("id", perfil.id);
    if (error) toast.error("Erro ao atualizar perfil");
    else toast.success("Perfil atualizado!");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${perfil.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('profiles').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      const updatedFotos = [...(perfil.fotos || []), publicUrl];
      setPerfil({ ...perfil, fotos: updatedFotos });
      toast.success("Foto enviada!");
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const updated = (perfil.fotos || []).filter((_: any, i: number) => i !== index);
    setPerfil({ ...perfil, fotos: updated });
  };

  if (sessionLoading || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Carregando seu painel...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <DashboardHeader role={perfil?.role} isPremium={perfil?.is_premium} />

        <Tabs defaultValue="perfil" className="space-y-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="perfil" className="gap-2"><UserIcon className="w-4 h-4" /> Meu Perfil</TabsTrigger>
            <TabsTrigger value="fotos" className="gap-2"><ImageIcon className="w-4 h-4" /> Galeria</TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2"><Lock className="w-4 h-4" /> Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <ProfileTab 
              perfil={perfil} 
              setPerfil={setPerfil} 
              handleUpdate={handleUpdate} 
              locationInputRef={locationInputRef} 
            />
          </TabsContent>

          <TabsContent value="fotos">
            <PhotosTab 
              perfil={perfil} 
              uploading={uploading} 
              handleFileUpload={handleFileUpload} 
              removePhoto={removePhoto} 
            />
          </TabsContent>

          <TabsContent value="seguranca">
            <SecurityTab perfil={perfil} setPerfil={setPerfil} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}