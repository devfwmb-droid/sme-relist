import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICampo {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multi-choice' | 'image-url';
  options?: string[];
  required: boolean;
  placeholder?: string;
  ordem: number;
}

export interface IFormType extends Document {
  nome: string;
  descricao?: string;
  campos: ICampo[];
  cor: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CampoSchema = new Schema<ICampo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'textarea', 'number', 'date', 'select', 'multi-choice', 'image-url'],
      default: 'text',
    },
    options: [{ type: String }],
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    ordem: { type: Number, default: 0 },
  },
  { _id: false }
);

const FormTypeSchema = new Schema<IFormType>(
  {
    nome: {
      type: String,
      required: [true, 'O nome do tipo de formulário é obrigatório'],
      trim: true,
      unique: true,
    },
    descricao: {
      type: String,
      trim: true,
      default: '',
    },
    campos: [CampoSchema],
    cor: {
      type: String,
      default: '#3B82F6',
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Padrão serverless: se o model já existir em `mongoose.models`, usa-o, senão cria um novo
const FormType: Model<IFormType> =
  mongoose.models.FormType || mongoose.model<IFormType>('FormType', FormTypeSchema);

export default FormType;
