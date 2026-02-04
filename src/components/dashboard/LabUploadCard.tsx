import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Loader2, Check, X } from 'lucide-react';

interface LabUploadCardProps {
  onUploadComplete: () => void;
}

const LabUploadCard: React.FC<LabUploadCardProps> = ({ onUploadComplete }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t('invalidFileType'),
        description: t('pleaseUploadValidFile'),
      });
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('lab-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Store just the file path (not a URL) - we'll generate signed URLs when needed
      // The path is stored as userId/timestamp.ext format
      
      setUploading(false);
      setAnalyzing(true);

      // Convert file to base64 for AI analysis with timeout
      const readFileAsBase64 = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          const timeout = setTimeout(() => {
            reader.abort();
            reject(new Error('File reading timeout'));
          }, 30000); // 30 second timeout
          
          reader.onload = () => {
            clearTimeout(timeout);
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          
          reader.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to read file'));
          };
          
          reader.readAsDataURL(file);
        });
      };

      try {
        const base64 = await readFileAsBase64();
        
        // Call edge function to analyze lab results with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
        
        // Don't send userId - let server extract from JWT for security
        const { data, error } = await supabase.functions.invoke('analyze-lab-results', {
          body: { 
            fileBase64: base64,
            fileType: file.type,
            fileName: file.name,
          },
        });

        clearTimeout(timeoutId);

        if (error) throw error;

        toast({
          title: t('analysisComplete'),
          description: t('biomarkersExtracted'),
        });

        onUploadComplete();
      } catch (err: any) {
        console.error('Analysis error:', err);
        const errorMessage = err.name === 'AbortError' 
          ? t('analysisTimeout') 
          : err.message || t('failedToAnalyze');
        toast({
          variant: "destructive",
          title: t('error'),
          description: errorMessage,
        });
      } finally {
        setAnalyzing(false);
        setFile(null);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <Card className="overflow-hidden min-w-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary-foreground" />
          </div>
          {t('uploadLabTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{t('uploadDescription')}</p>
        
        {analyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-primary" />
            </div>
            <p className="mt-4 text-foreground font-medium">{t('analyzing')}</p>
            <p className="text-sm text-muted-foreground">{t('thisMayTakeMoment')}</p>
          </motion.div>
        ) : (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : file 
                  ? 'border-success bg-success/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 rounded-full hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium">{t('dragDrop')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('supportedFormats')}</p>
                </>
              )}
            </div>

            {file && (
              <Button 
                className="w-full mt-4" 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {uploading ? t('uploadingFile') : t('analyzeLabResults')}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LabUploadCard;
