'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Check, Edit, RefreshCw } from 'lucide-react'

interface OutlineGeneratorProps {
  projectId: string
}

interface ChapterItem {
  id: string;
  title: string;
  summary: string;
}

export default function OutlineGenerator({ projectId }: OutlineGeneratorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [chapters, setChapters] = useState<ChapterItem[]>([])

  const generateOutline = async () => {
    setIsGenerating(true)
    
    try {
      // In a real implementation, this would call an AI endpoint
      // For now, we'll simulate with a sample outline based on the project topic
      
      // Fetch project details to get the topic
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      
      const data = await response.json()
      const topic = data.project.topic
      const audience = data.project.target_audience
      
      // Simulate AI generating an outline based on topic and audience
      // In a real implementation, this would use OpenRouter to call an LLM
      const simulatedChapters = [
        {
          id: '1',
          title: `Introduction to ${topic}`,
          summary: `An overview of ${topic} and why it matters to ${audience}. This chapter sets the stage for the rest of the book.`
        },
        {
          id: '2',
          title: `The Fundamentals of ${topic}`,
          summary: `Core concepts and principles of ${topic} that ${audience} need to understand before diving deeper.`
        },
        {
          id: '3',
          title: `Common Challenges in ${topic}`,
          summary: `Typical obstacles and challenges that ${audience} face when dealing with ${topic}, and initial strategies to overcome them.`
        },
        {
          id: '4',
          title: `Advanced Strategies for ${topic}`,
          summary: `More sophisticated approaches to ${topic} that can help ${audience} achieve better results.`
        },
        {
          id: '5',
          title: `Case Studies: ${topic} in Action`,
          summary: `Real-world examples of successful implementation of ${topic} principles by ${audience}.`
        },
        {
          id: '6',
          title: `Tools and Resources for ${topic}`,
          summary: `Essential tools, software, and resources that ${audience} can use to improve their ${topic} efforts.`
        },
        {
          id: '7',
          title: `Future Trends in ${topic}`,
          summary: `Emerging developments and future directions in ${topic} that ${audience} should be aware of.`
        },
        {
          id: '8',
          title: `Conclusion: Mastering ${topic}`,
          summary: `Summary of key takeaways and a roadmap for ${audience} to continue developing their expertise in ${topic}.`
        }
      ]
      
      setChapters(simulatedChapters)
      
      toast({
        title: 'Outline generated',
        description: 'AI has created a book outline based on your topic and audience.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate outline. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChapterEdit = (id: string, field: 'title' | 'summary', value: string) => {
    setChapters(prev => 
      prev.map(chapter => 
        chapter.id === id ? { ...chapter, [field]: value } : chapter
      )
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Outline</CardTitle>
        <CardDescription>
          Generate a comprehensive outline for your book based on your topic and target audience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No outline generated yet. Click the button below to create one.</p>
            <Button onClick={generateOutline} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Outline with AI'
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Chapters</h3>
              <div className="space-x-2">
                <Button variant="outline" onClick={generateOutline} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    'Regenerate'
                  )}
                </Button>
                <Button onClick={() => router.push(`/projects/${projectId}/outline/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Outline
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter) => (
                <Card key={chapter.id} className="border border-muted">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base font-medium">
                      Chapter {chapter.id}: {chapter.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => router.push(`/projects/${projectId}/chapters`)}>
                <Check className="mr-2 h-4 w-4" />
                Accept Outline & Continue
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
