'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { PlusCircle, X } from 'lucide-react'

interface KeywordProps {
  projectId: string
}

export default function KeywordGenerator({ projectId }: KeywordProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')

  const generateKeywords = async () => {
    setIsGenerating(true)
    
    try {
      // In a real implementation, this would call an AI endpoint
      // For now, we'll simulate with some sample keywords based on the project topic
      
      // Fetch project details to get the topic
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      
      const data = await response.json()
      const topic = data.project.topic
      
      // Simulate AI generating keywords based on topic
      // In a real implementation, this would use OpenRouter to call an LLM
      const simulatedKeywords = [
        `${topic} fundamentals`,
        `${topic} strategies`,
        `${topic} for beginners`,
        `advanced ${topic}`,
        `${topic} case studies`,
        `${topic} best practices`,
        `${topic} tools`,
        `${topic} future trends`
      ]
      
      // Add the simulated keywords to the existing ones
      setKeywords(prev => [...new Set([...prev, ...simulatedKeywords])])
      
      toast({
        title: 'Keywords generated',
        description: 'AI has suggested keywords based on your book topic.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate keywords. Please try again.',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() === '') return
    
    setKeywords(prev => [...new Set([...prev, newKeyword.trim()])])
    setNewKeyword('')
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords & Key Phrases</CardTitle>
        <CardDescription>
          Generate or add important terms and concepts that your book should cover.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newKeyword" className="sr-only">
              Add Keyword
            </Label>
            <Input
              id="newKeyword"
              placeholder="Add a keyword or phrase..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button onClick={addKeyword} variant="outline">
            Add
          </Button>
          <Button onClick={generateKeywords} disabled={isGenerating}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {keywords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No keywords added yet. Add keywords manually or generate them with AI.</p>
          ) : (
            keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
