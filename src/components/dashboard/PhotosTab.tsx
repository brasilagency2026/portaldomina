"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Trash2 } from "lucide-react";

interface PhotosTabProps {
  perfil: any;
  uploading: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

const PhotosTab = ({ perfil, uploading, handleFileUpload, removePhoto }: PhotosTabProps) => {
  const limit = perfil.is_premium ? 20 : 5;
  const fotos = perfil.fotos || [];

  return (
    <Card className="glass-dark">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Galeria de Fotos</CardTitle>
          <Badge variant="outline">
            {fotos.length} / {limit} fotos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 hover:border-primary/50 transition-colors relative">
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Clique ou arraste para enviar</p>
                <p className="text-sm text-muted-foreground">PNG ou JPG (Máx. 5MB)</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fotos.map((url: string, index: number) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
              <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotosTab;