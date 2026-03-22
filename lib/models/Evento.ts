import mongoose, { Document, Model, Schema } from 'mongoose';
import { IFormType } from './FormType';

interface IImagem {
  label?: string;
  url?: string;
}

export interface IEvento extends Document {
  _id: string; // ID customizado
  formTypeId: mongoose.Types.ObjectId | IFormType;
  titulo: string;
  dataEvento: Date;
  dados: Record<string, any>;
  imagens: IImagem[];
  status: 'rascunho' | 'publicado' | 'arquivado';
  criadoPor: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventoSchema = new Schema<IEvento>(
  {
    _id: {
      type: String,
    },
    formTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'FormType',
      required: true,
    },
    titulo: {
      type: String,
      required: [true, 'O título do evento é obrigatório'],
      trim: true,
    },
    dataEvento: {
      type: Date,
      required: [true, 'A data do evento é obrigatória'],
    },
    dados: {
      type: Schema.Types.Mixed,
      default: {},
    },
    imagens: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['rascunho', 'publicado', 'arquivado'],
      default: 'publicado',
    },
    criadoPor: { type: String, default: 'sistema' },
  },
  {
    timestamps: true,
    _id: false, // Desabilita geração automática de ObjectId
  }
);

EventoSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const prefixoData = `${ano}${mes}${dia}`; // Ex: "20260322"

    const EventoModel = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

    const ultimoEventoDoDia = await EventoModel.findOne({ _id: { $regex: `^${prefixoData}` } })
      .sort({ _id: -1 })
      .select('_id')
      .lean();

    let contador = 0;
    if (ultimoEventoDoDia) {
      const ultimoContador = parseInt((ultimoEventoDoDia as any)._id.slice(-2), 10);
      contador = ultimoContador + 1;
    }

    if (contador > 99) {
      return next(new Error('Limite de 100 eventos por dia atingido.'));
    }

    this._id = `${prefixoData}${String(contador).padStart(2, '0')}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

EventoSchema.index({ formTypeId: 1, dataEvento: -1 });
EventoSchema.index({ status: 1 });

const Evento: Model<IEvento> = mongoose.models.Evento || mongoose.model<IEvento>('Evento', EventoSchema);

export default Evento;
