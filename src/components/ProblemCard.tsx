
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowUp, Clock } from 'lucide-react';

interface Problem {
  id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
  likes: number;
  userHasLiked?: boolean;
  image?: string;
}

interface ProblemCardProps {
  problem: Problem;
  onLike: (id: string) => void;
}

const ProblemCard = ({ problem, onLike }: ProblemCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Há poucos minutos';
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('pt-BR');
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            {problem.type}
          </Badge>
          <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
            {getStatusText(problem.status)}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {problem.description}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{problem.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatDate(problem.date)}</span>
          </div>
          <button
            onClick={() => onLike(problem.id)}
            className={`flex items-center space-x-1 transition-colors ${
              problem.userHasLiked 
                ? 'text-blue-600 hover:text-blue-700' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <ArrowUp className={`w-4 h-4 ${problem.userHasLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{problem.likes}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
