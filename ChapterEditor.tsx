'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Save } from 'lucide-react'

interface ChapterEditorProps {
  projectId: string
  chapterId: string
}

export default function ChapterEditor({ projectId, chapterId }: ChapterEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chapterData, setChapterData] = useState({
    title: 'Chapter Title',
    summary: 'Chapter summary goes here...',
    content: 'Chapter content will appear here after generation...'
  })

  const generateChapterContent = async () => {
    setIsGenerating(true)
    
    try {
      // In a real implementation, this would call an AI endpoint
      // For now, we'll simulate with sample content based on the chapter title and summary
      
      // Simulate AI generating chapter content
      // In a real implementation, this would use OpenRouter to call an LLM
      const simulatedContent = `
# ${chapterData.title}

## Introduction

${chapterData.summary}

## Main Concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.

## Key Points

1. First important point about this topic with detailed explanation and examples.
2. Second key concept that readers should understand with practical applications.
3. Third critical element with case studies and real-world scenarios.

## Practical Applications

When applying these concepts in real-world situations, it's important to consider the context and specific needs of your audience. Here are some examples:

- Example one with detailed explanation
- Example two showing different approach
- Example three demonstrating advanced technique

## Common Challenges

Many people struggle with implementing these ideas because of several common obstacles:

1. **Challenge One**: How to overcome this with specific strategies.
2. **Challenge Two**: Methods for addressing this particular difficulty.
3. **Challenge Three**: Techniques for navigating this complex situation.

## Summary

In this chapter, we've explored the fundamental aspects of ${chapterData.title}. We've seen how these concepts apply to real-world situations and examined strategies for overcoming common challenges. In the next chapter, we'll build on these foundations to explore more advanced techniques.
      `
      
      setChapterData(prev => ({
        ...prev,
        content: simulatedContent
      }))
      
      toast({
        title: 'Chapter generated',
        description: 'AI has created content for this chapter based on the title and summary.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate chapter content. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // In a real implementation, this would save to the database
      // For now, we'll just simulate a successful save
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network request
      
      toast({
        title: 'Chapter saved',
        description: 'Your chapter has been saved successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save chapter. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setChapterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chapter Editor</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/chapters`)}>
            Back to Chapters
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Chapter'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Details</CardTitle>
          <CardDescription>
            Edit the chapter title and summary before generating content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chapter Title</Label>
            <Input
              id="title"
              value={chapterData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Chapter Summary</Label>
            <Textarea
              id="summary"
              value={chapterData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={generateChapterContent} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Content...
              </>
            ) : (
              'Generate Chapter Content with AI'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Content</CardTitle>
          <CardDescription>
            Edit the generated content or write your own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={chapterData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={20}
            className="font-mono"
          />
        </CardContent>
      </Card>
    </div>
  )
}
