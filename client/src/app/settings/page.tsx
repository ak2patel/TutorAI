'use client';

import { useState } from 'react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your preferences and account settings</p>
      </div>

      <div className={styles.sections}>
        {/* Appearance */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Theme</span>
              <span className={styles.settingDesc}>Choose your preferred theme</span>
            </div>
            <div className={styles.themeToggle}>
              <button 
                className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ Light
              </button>
              <button 
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Push Notifications</span>
              <span className={styles.settingDesc}>Receive notifications about assignment updates</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Preferences */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Preferences</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Auto-save</span>
              <span className={styles.settingDesc}>Automatically save your work</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Account */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Institution</span>
              <span className={styles.settingDesc}>Delhi Public School, Bokaro Steel City</span>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Email</span>
              <span className={styles.settingDesc}>teacher@dps.edu.in</span>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${styles.section} ${styles.dangerSection}`}>
          <h2 className={styles.sectionTitle}>Danger Zone</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Delete Account</span>
              <span className={styles.settingDesc}>Permanently delete your account and all data</span>
            </div>
            <button className={styles.dangerBtn}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
