import type { ICommentRepository } from '../ports';
import type { Comment } from '../../domain/types';

export class MockCommentRepository implements ICommentRepository {
  private comments: Comment[] = [
    {
      id: 'c1',
      parentId: null,
      userId: 'esp-1',
      userName: 'Dr. Carlos Mendoza',
      userRole: 'specialist',
      content: 'Excelente técnica de carrera hoy. Mantené la cadencia arriba de 170.',
      createdAt: '2026-06-23T10:15:00Z',
      contextType: 'workout',
      contextId: 'w1'
    },
    {
      id: 'c2',
      parentId: 'c1',
      userId: 'paciente-1',
      userName: 'Nicolás Páez',
      userRole: 'patient',
      content: '¡Gracias Pro! Me costó al final de la cuesta, pero mantuve el ritmo.',
      createdAt: '2026-06-23T11:00:00Z',
      contextType: 'workout',
      contextId: 'w1'
    }
  ];

  async getComments(contextType: string, contextId: string): Promise<Comment[]> {
    return this.comments.filter(c => c.contextType === contextType && c.contextId === contextId);
  }

  async postComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    return newComment;
  }
}
