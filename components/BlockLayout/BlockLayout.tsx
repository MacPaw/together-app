import React from 'react';
import { Panel } from '@macpaw/macpaw-ui';
import styles from './BlockLayout.module.sass';

interface BlockLayout {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  link: React.ReactElement;
  className?: string;
}

const BlockLayout: React.FC<BlockLayout> = ({ icon, title, subtitle, link, className }) => (
  <Panel className={`${styles.panel} ${className || ''}`}>
    <div className={styles.icon}>{icon}</div>
    <h5 className={styles.title}>{title}</h5>
    <div className={`p3 ${styles.subtitle}`}>{subtitle}</div>
    <div className="p3"><b>{link}</b></div>
  </Panel>
);

export default BlockLayout;
