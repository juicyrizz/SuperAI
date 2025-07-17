export enum Persona {
  GENIUS = 'Genius',
  RESEARCHER = 'Researcher',
  NERD = 'Nerd',
  ARCHITECT = 'Architect',
  TUTOR = 'Tutor',
  CSV_ANALYST = 'CSV Analyst',
  CHEF = 'Chef',
}

export enum GenerationMode {
  FAST = 'Fast',
  BALANCED = 'Balanced',
  THINKING = 'Thinking',
}

export enum Theme {
  DARK = 'Dark',
  LIGHT = 'Light',
  TRANSPARENT = 'Transparent',
}

export interface Attachment {
  url: string; // Data URL for preview
  base64: string; // Base64 data for API
  mimeType: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachment?: Attachment;
  sources?: GroundingSource[];
  isHidden?: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface FineTuningExample {
  userInput: string;
  editedModelOutput: string;
}

export interface ProjectFile {
  path: string;
  code: string;
}

export interface ProjectState {
  isActive: boolean;
  files: ProjectFile[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  persona: Persona;
  generationMode: GenerationMode;
  createdAt: number;
  documentContext?: {
    filename: string;
    content: string;
  };
  projectState?: ProjectState;
}

export interface PersonaDetails {
    id: Persona;
    title: string;
    description: string;
    systemInstruction: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

export interface GenerationModeDetails {
  id: GenerationMode;
  title: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

export interface ThemeDetails {
  id: Theme;
  title: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}