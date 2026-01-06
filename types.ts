
export enum View {
  DASHBOARD = 'DASHBOARD',
  SCRIPT = 'SCRIPT',
  STORYBOARD = 'STORYBOARD',
  VIDEO = 'VIDEO',
  ADVISOR = 'ADVISOR'
}

export interface ScriptScene {
  id: string;
  title: string;
  content: string;
}

export interface StoryboardPanel {
  id: string;
  prompt: string;
  imageUrl: string;
  description: string;
}

export interface ConceptVideo {
  id: string;
  prompt: string;
  videoUrl: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
