
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ArrowUp } from 'lucide-react';
import { Problem } from '@/hooks/useProblems';

interface ProblemDetailModalProps {
  problem: Problem | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
}

const ProblemDetailModal = ({ problem, isOpen, onClose, onLike }: ProblemDetailModalProps) => {
  if (!problem) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em andamento';
      case 'resolved':
        return 'Resolvido';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'buraco_na_rua': 'Buraco na rua',
      'lixo_acumulado': 'Lixo acumulado',
      'vandalismo': 'Vandalismo',
      'iluminacao_publica': 'Iluminação pública',
      'sinalizacao_danificada': 'Sinalização danificada',
      'calcada_danificada': 'Calçada danificada',
      'outro': 'Outro'
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log('Problem images in modal:', problem.images);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                  {getTypeDisplayName(problem.type)}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                  {getStatusText(problem.status)}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagens do problema */}
          {problem.images && problem.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Imagens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problem.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.image_url}
                      alt={`Imagem do problema ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', image.image_url);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Imagem carregada com sucesso:', image.image_url);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Localização */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Localização</h3>
            <div className="flex items-start text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{problem.location_address}</span>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Data do relato</h4>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formatDate(problem.created_at)}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Curtidas</h4>
              <button
                onClick={() => onLike(problem.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  problem.user_has_liked 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <ArrowUp className={`w-4 h-4 ${problem.user_has_liked ? 'fill-current' : ''}`} />
                <span className="font-medium">{problem.likes_count}</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDetailModal;
