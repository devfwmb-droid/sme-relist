import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IThemeConfig extends Document {
  singletonKey: string;
  nomeInstituicao: string;
  cores: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    danger: string;
    sidebar: string;
    sidebarText: string;
  };
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeConfigSchema = new Schema<IThemeConfig>(
  {
    singletonKey: {
      type: String,
      default: 'default',
      unique: true,
    },
    nomeInstituicao: {
      type: String,
      default: 'Secretaria Municipal de Educação',
    },
    cores: {
      primary: { type: String, default: '#1D4ED8' },
      primaryHover: { type: String, default: '#1E40AF' },
      secondary: { type: String, default: '#10B981' },
      accent: { type: String, default: '#F59E0B' },
      background: { type: String, default: '#F8FAFC' },
      surface: { type: String, default: '#FFFFFF' },
      text: { type: String, default: '#1E293B' },
      textMuted: { type: String, default: '#64748B' },
      border: { type: String, default: '#E2E8F0' },
      danger: { type: String, default: '#EF4444' },
      sidebar: { type: String, default: '#1E293B' },
      sidebarText: { type: String, default: '#F8FAFC' },
    },
    logoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const ThemeConfig: Model<IThemeConfig> =
  mongoose.models.ThemeConfig || mongoose.model<IThemeConfig>('ThemeConfig', ThemeConfigSchema);

export default ThemeConfig;
