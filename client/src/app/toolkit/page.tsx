'use client';

import Link from 'next/link';
import styles from './toolkit.module.css';

const tools = [
  {
    id: 1,
    title: 'Question Generator',
    description: 'Generate custom questions based on topics and difficulty levels',
    icon: '❓',
    color: '#4BC26D',
    link: '/create'
  },
  {
    id: 2,
    title: 'Lesson Planner',
    description: 'Create structured lesson plans with learning objectives',
    icon: '📚',
    color: '#E56820',
    link: '/'
  },
  {
    id: 3,
    title: 'Rubric Builder',
    description: 'Design assessment rubrics with clear criteria',
    icon: '📊',
    color: '#3B82F6',
    link: '/'
  },
  {
    id: 4,
    title: 'Study Guide Creator',
    description: 'Generate comprehensive study guides for students',
    icon: '📝',
    color: '#8B5CF6',
    link: '/'
  },
  {
    id: 5,
    title: 'Quiz Maker',
    description: 'Create interactive quizzes with instant feedback',
    icon: '🎯',
    color: '#EC4899',
    link: '/'
  },
  {
    id: 6,
    title: 'Worksheet Generator',
    description: 'Design printable worksheets for practice',
    icon: '📄',
    color: '#F59E0B',
    link: '/'
  },
  {
    id: 7,
    title: 'Flashcard Maker',
    description: 'Create digital flashcards for memorization',
    icon: '🎴',
    color: '#10B981',
    link: '/'
  },
  {
    id: 8,
    title: 'Progress Tracker',
    description: 'Monitor student progress and performance',
    icon: '📈',
    color: '#6366F1',
    link: '/'
  },
];

export default function ToolkitPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Teacher's Toolkit</h1>
        <p className={styles.subtitle}>
          Powerful AI-powered tools to enhance your teaching experience
        </p>
      </div>

      <div className={styles.grid}>
        {tools.map((tool) => (
          <Link href={tool.link} key={tool.id} className={styles.card}>
            <div className={styles.iconWrapper} style={{ background: `${tool.color}15` }}>
              <span className={styles.icon}>{tool.icon}</span>
            </div>
            <h3 className={styles.cardTitle}>{tool.title}</h3>
            <p className={styles.cardDesc}>{tool.description}</p>
            <div className={styles.cardFooter}>
              <span className={styles.tryBtn}>Try Now →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>Need a custom tool?</h2>
          <p className={styles.bannerText}>
            Let us know what you need and we'll build it for you
          </p>
          <button className={styles.bannerBtn}>Request a Tool</button>
        </div>
      </div>
    </div>
  );
}
