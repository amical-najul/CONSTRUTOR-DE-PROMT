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
