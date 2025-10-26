export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface UploadedFile {
    name: string;
    type: string;
    size: number;
    base64: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  jsonConfig: string;
}

export interface ContextItem {
  id: string;
  name: string;
  type: 'text' | 'file';
  content: string; // For text, this is the text. For file, this is the base64 string.
  fileDetails?: Omit<UploadedFile, 'base64'>; // Store metadata for files
}

export type AppView = 'principal' | 'flujos' | 'configuraciones';
