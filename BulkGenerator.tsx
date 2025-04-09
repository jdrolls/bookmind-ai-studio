'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react'

interface BulkGeneratorProps {
  projectId: string
}

export default function BulkGenerator({ projectId }: BulkGeneratorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedChapters, setGeneratedChapters] = useState<string[]>([])

  const generateAllChapters = async () => {
    setIsGenerating(true)
    setProgress(0)
    setGeneratedChapters([])
    
    try {
      // In a real implementation, this would call an AI endpoint for each chapter
      // For now, we'll simulate with a progress indicator and sample chapters
      
      // Simulate generating 8 chapters with progress updates
      const totalChapters = 8
      
      for (let i = 1; i <= totalChapters; i++) {
        // Update progress
        setProgress(Math.floor((i - 1) / totalChapters * 100))
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add the chapter to the list
        setGeneratedChapters(prev => [...prev, `Chapter ${i}`])
        
        // Update progress again
        setProgress(Math.floor(i / totalChapters * 100))
      }
      
      toast({
        title: 'Book completed!',
        description: `Successfully generated ${totalChapters} chapters for your book.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate all chapters. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
      setProgress(100)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auto-Complete Book</CardTitle>
        <CardDescription>
          Generate all remaining chapters in one go to complete your book draft quickly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="font-medium mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Bulk Generation
          </h3>
          <p className="text-sm">
            This feature will generate all remaining chapters based on your outline. The AI will use your style sample
            and maintain consistency throughout the book. You can review and edit each chapter afterward.
          </p>
        </div>
        
        {isGenerating || generatedChapters.length > 0 ? (
          <div className="space-y-4">
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              {isGenerating 
                ? `Generating chapters... ${progress}% complete` 
                : `Generation complete! ${generatedChapters.length} chapters created.`}
            </p>
            
            {generatedChapters.length > 0 && (
              <div className="border rounded-md divide-y">
                {generatedChapters.map((chapter, index) => (
                  <div key={index} className="p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{chapter}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/projects/${projectId}/chapters/${index + 1}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {!isGenerating && (
              <div className="flex justify-end">
                <Button onClick={() => router.push(`/projects/${projectId}/chapters`)}>
                  Go to Chapters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">
              Ready to complete your book? Click the button below to generate all remaining chapters.
            </p>
            <Button onClick={generateAllChapters} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Auto-Complete Book'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
