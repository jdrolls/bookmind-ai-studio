'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, FileText, RefreshCw } from 'lucide-react'

interface MarketingGeneratorProps {
  projectId: string
}

export default function MarketingGenerator({ projectId }: MarketingGeneratorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('summary')
  const [isGenerating, setIsGenerating] = useState(false)
  const [marketingContent, setMarketingContent] = useState({
    summary: '',
    chapterSummaries: '',
    authorBio: '',
    marketingBlurb: ''
  })

  const generateContent = async (contentType: string) => {
    setIsGenerating(true)
    
    try {
      // In a real implementation, this would call an AI endpoint
      // For now, we'll simulate with sample content based on the project
      
      // Fetch project details
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      
      const data = await response.json()
      const project = data.project
      
      // Simulate AI generating marketing content
      // In a real implementation, this would use OpenRouter to call an LLM
      let generatedContent = ''
      
      switch (contentType) {
        case 'summary':
          generatedContent = `"${project.title}" is a comprehensive guide designed specifically for ${project.target_audience}. This book provides a thorough exploration of ${project.topic}, offering practical insights, strategies, and actionable advice. Drawing from extensive research and real-world examples, the author presents a clear roadmap for readers to understand and implement effective approaches to ${project.topic}. Whether you're new to this field or looking to deepen your expertise, this book delivers valuable knowledge in an accessible format.`
          break
          
        case 'chapterSummaries':
          generatedContent = `Chapter 1: Introduction to ${project.topic}
An overview of the fundamental concepts and the importance of ${project.topic} for ${project.target_audience}.

Chapter 2: Understanding the Landscape
Explores the current state of ${project.topic} and how it affects ${project.target_audience} in today's environment.

Chapter 3: Core Strategies and Methodologies
Presents proven approaches and methodologies for effectively implementing ${project.topic} principles.

Chapter 4: Overcoming Common Challenges
Addresses the typical obstacles faced by ${project.target_audience} and provides practical solutions.

Chapter 5: Case Studies and Success Stories
Real-world examples demonstrating successful application of ${project.topic} principles.

Chapter 6: Future Trends and Developments
Insights into emerging trends and how ${project.target_audience} can prepare for future developments.

Chapter 7: Implementation Guide
Step-by-step instructions for putting the book's teachings into practice.

Chapter 8: Resources and Further Reading
Curated list of additional resources to continue learning about ${project.topic}.`
          break
          
        case 'authorBio':
          generatedContent = `The author is a respected authority on ${project.topic} with extensive experience helping ${project.target_audience} achieve their goals. With a background spanning over a decade in this field, they have consulted for numerous organizations and individuals, delivering transformative results through their expertise. They are known for their ability to communicate complex concepts in accessible ways, making them the perfect guide for readers looking to master ${project.topic}.`
          break
          
        case 'marketingBlurb':
          generatedContent = `Are you a ${project.target_audience} struggling with ${project.topic}? Look no further!

"${project.title}" is the definitive guide you've been waiting for. This groundbreaking book cuts through the confusion and delivers clear, actionable strategies that get results.

✓ Master the fundamentals of ${project.topic}
✓ Implement proven strategies used by industry leaders
✓ Overcome common challenges with confidence
✓ Apply practical techniques that work in real-world situations

Don't waste any more time with trial and error. Transform your approach to ${project.topic} and see immediate improvements in your results.

Order your copy today and take the first step toward mastery!`
          break
      }
      
      // Update the state with the generated content
      setMarketingContent(prev => ({
        ...prev,
        [contentType]: generatedContent
      }))
      
      toast({
        title: 'Content generated',
        description: `Your ${contentType} has been created successfully.`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to generate ${contentType}. Please try again.`,
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleContentChange = (contentType: string, value: string) => {
    setMarketingContent(prev => ({
      ...prev,
      [contentType]: value
    }))
  }

  const downloadContent = () => {
    const content = `# Marketing Content for "${projectId}"

## Book Summary
${marketingContent.summary}

## Chapter Summaries
${marketingContent.chapterSummaries}

## Author Bio
${marketingContent.authorBio}

## Marketing Blurb
${marketingContent.marketingBlurb}
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marketing-content.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Content downloaded',
      description: 'Your marketing content has been downloaded as a markdown file.'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Marketing Content Generator</CardTitle>
        <CardDescription>
          Generate marketing materials to help promote your book.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Book Summary</TabsTrigger>
            <TabsTrigger value="chapterSummaries">Chapter Summaries</TabsTrigger>
            <TabsTrigger value="authorBio">Author Bio</TabsTrigger>
            <TabsTrigger value="marketingBlurb">Marketing Blurb</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Book Summary</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateContent('summary')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </Button>
            </div>
            <Textarea
              value={marketingContent.summary}
              onChange={(e) => handleContentChange('summary', e.target.value)}
              placeholder="Your book summary will appear here after generation..."
              rows={8}
            />
            <p className="text-sm text-muted-foreground">
              A concise summary of your book for use as a description or back cover blurb.
            </p>
          </TabsContent>
          
          <TabsContent value="chapterSummaries" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Chapter Summaries</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateContent('chapterSummaries')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Summaries'
                )}
              </Button>
            </div>
            <Textarea
              value={marketingContent.chapterSummaries}
              onChange={(e) => handleContentChange('chapterSummaries', e.target.value)}
              placeholder="Chapter summaries will appear here after generation..."
              rows={12}
            />
            <p className="text-sm text-muted-foreground">
              Brief summaries of each chapter, useful for marketing materials or a table of contents.
            </p>
          </TabsContent>
          
          <TabsContent value="authorBio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Author Bio</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateContent('authorBio')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Bio'
                )}
              </Button>
            </div>
            <Textarea
              value={marketingContent.authorBio}
              onChange={(e) => handleContentChange('authorBio', e.target.value)}
              placeholder="Your author bio will appear here after generation..."
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              A professional biography for book jackets, websites, or promotional materials.
            </p>
          </TabsContent>
          
          <TabsContent value="marketingBlurb" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Marketing Blurb</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateContent('marketingBlurb')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Blurb'
                )}
              </Button>
            </div>
            <Textarea
              value={marketingContent.marketingBlurb}
              onChange={(e) => handleContentChange('marketingBlurb', e.target.value)}
              placeholder="Marketing copy will appear here after generation..."
              rows={10}
            />
            <p className="text-sm text-muted-foreground">
              Promotional text for social media, email campaigns, or advertisements.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/projects/${projectId}`)}
          >
            Back to Project
          </Button>
          <Button 
            onClick={downloadContent}
            disabled={!marketingContent.summary && !marketingContent.chapterSummaries && !marketingContent.authorBio && !marketingContent.marketingBlurb}
          >
            <Download className="mr-2 h-4 w-4" />
            Download All Content
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
