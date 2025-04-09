'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { RefreshCw, Wand2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StyleTrainerProps {
  projectId: string
}

export default function StyleTrainer({ projectId }: StyleTrainerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [styleSample, setStyleSample] = useState('')
  const [styleProfile, setStyleProfile] = useState<null | {
    tone: string;
    complexity: string;
    formality: string;
    distinctiveFeatures: string[];
    example: string;
  }>(null)

  const analyzeStyle = async () => {
    if (!styleSample.trim()) {
      toast({
        title: 'Empty sample',
        description: 'Please provide a writing sample to analyze.',
        variant: 'destructive'
      })
      return
    }

    if (styleSample.trim().split(/\s+/).length < 50) {
      toast({
        title: 'Sample too short',
        description: 'Please provide a longer writing sample (at least 50 words) for better analysis.',
        variant: 'destructive'
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      // In a real implementation, this would call an AI endpoint
      // For now, we'll simulate with a sample style analysis
      
      // Simulate AI analyzing the writing style
      // In a real implementation, this would use OpenRouter to call an LLM
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      // Generate a simulated style profile based on the sample
      const simulatedProfile = {
        tone: styleSample.includes('!') ? 'Enthusiastic and energetic' : 'Calm and measured',
        complexity: styleSample.split(/\s+/).length / styleSample.split(/[.!?]+/).length > 15 
          ? 'Complex with long sentences' 
          : 'Straightforward with concise sentences',
        formality: styleSample.includes('I') || styleSample.includes('we') 
          ? 'Conversational with personal pronouns' 
          : 'Formal and objective',
        distinctiveFeatures: [
          'Uses metaphors to explain complex concepts',
          'Employs rhetorical questions to engage readers',
          'Balances technical information with accessible explanations',
          'Incorporates real-world examples to illustrate points'
        ],
        example: `Here's how the AI would write in your style: 

${styleSample.split(' ').slice(0, 20).join(' ')}... [continuing in your distinctive voice and approach]`
      }
      
      setStyleProfile(simulatedProfile)
      
      // Also update the project with this style sample
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            style_sample: styleSample
          })
        })
        
        if (!response.ok) {
          console.error('Failed to save style sample to project')
        }
      } catch (error) {
        console.error('Error saving style sample:', error)
      }
      
      toast({
        title: 'Style analyzed',
        description: 'Your writing style has been analyzed and will be used for content generation.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze writing style. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Style Training</CardTitle>
        <CardDescription>
          Teach the AI your writing style by providing a sample of your writing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="input">
          <TabsList className="mb-4">
            <TabsTrigger value="input">Input Sample</TabsTrigger>
            <TabsTrigger value="profile" disabled={!styleProfile}>Style Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Paste a few paragraphs of your writing that represent the style you want for your book. 
                For best results, use at least 200-300 words.
              </p>
              <Textarea
                value={styleSample}
                onChange={(e) => setStyleSample(e.target.value)}
                placeholder="Paste your writing sample here..."
                rows={10}
              />
            </div>
            
            <Button 
              onClick={analyzeStyle} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Style...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyze My Writing Style
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="profile">
            {styleProfile && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Tone</h3>
                    <p className="text-sm">{styleProfile.tone}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Complexity</h3>
                    <p className="text-sm">{styleProfile.complexity}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Formality</h3>
                    <p className="text-sm">{styleProfile.formality}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Distinctive Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {styleProfile.distinctiveFeatures.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Example</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm italic">{styleProfile.example}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => router.push(`/projects/${projectId}/outline`)}>
                    Continue to Outline
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
