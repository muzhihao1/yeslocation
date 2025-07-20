/**
 * CMS内容管理Hook
 * 方便在组件中使用CMS内容
 */

import { useState, useEffect, useCallback } from 'react';
import { cmsService } from '../services/cmsService';
import { CMSContent } from '../types/cms';

/**
 * 获取单个内容
 */
export function useCMSContent(key: string) {
  const [content, setContent] = useState<string>(key);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const value = await cmsService.getContent(key);
        setContent(value);
        setError(null);
      } catch (err) {
        setError('加载内容失败');
        console.error('CMS内容加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [key]);

  const updateContent = useCallback(async (newValue: string) => {
    try {
      await cmsService.updateContent(key, newValue);
      setContent(newValue);
      return true;
    } catch (err) {
      setError('更新内容失败');
      console.error('CMS内容更新失败:', err);
      return false;
    }
  }, [key]);

  return { content, loading, error, updateContent };
}

/**
 * 获取多个内容
 */
export function useCMSContents(keys: string[]) {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      try {
        setLoading(true);
        const result: Record<string, string> = {};
        
        await Promise.all(
          keys.map(async (key) => {
            result[key] = await cmsService.getContent(key);
          })
        );
        
        setContents(result);
        setError(null);
      } catch (err) {
        setError('加载内容失败');
        console.error('CMS内容加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    if (keys.length > 0) {
      loadContents();
    }
  }, [keys.join(',')]);

  return { contents, loading, error };
}

/**
 * 获取类别下的所有内容
 */
export function useCMSCategory(category: string) {
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      try {
        setLoading(true);
        const categoryContents = await cmsService.getContentByCategory(category);
        setContents(categoryContents);
        setError(null);
      } catch (err) {
        setError('加载内容失败');
        console.error('CMS类别内容加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, [category]);

  const updateContent = useCallback(async (key: string, value: string) => {
    try {
      const updated = await cmsService.updateContent(key, value);
      setContents(prev => prev.map(c => c.key === key ? updated : c));
      return true;
    } catch (err) {
      setError('更新内容失败');
      console.error('CMS内容更新失败:', err);
      return false;
    }
  }, []);

  return { contents, loading, error, updateContent };
}

/**
 * CMS管理Hook（用于管理页面）
 */
export function useCMSAdmin() {
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllContents = useCallback(async () => {
    try {
      setLoading(true);
      const allContents = await cmsService.getAllContent();
      setContents(allContents);
      setError(null);
    } catch (err) {
      setError('加载内容失败');
      console.error('CMS内容加载失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllContents();
  }, [loadAllContents]);

  const updateContent = useCallback(async (key: string, value: string) => {
    try {
      const updated = await cmsService.updateContent(key, value);
      setContents(prev => prev.map(c => c.key === key ? updated : c));
      return true;
    } catch (err) {
      setError('更新内容失败');
      console.error('CMS内容更新失败:', err);
      return false;
    }
  }, []);

  const batchUpdate = useCallback(async (updates: Record<string, string>) => {
    try {
      const updated = await cmsService.batchUpdateContent(updates);
      await loadAllContents();
      return true;
    } catch (err) {
      setError('批量更新失败');
      console.error('CMS批量更新失败:', err);
      return false;
    }
  }, [loadAllContents]);

  const resetToDefault = useCallback(async (key?: string) => {
    try {
      await cmsService.resetToDefault(key);
      await loadAllContents();
      return true;
    } catch (err) {
      setError('重置失败');
      console.error('CMS重置失败:', err);
      return false;
    }
  }, [loadAllContents]);

  const exportContent = useCallback(async () => {
    try {
      return await cmsService.exportContent();
    } catch (err) {
      setError('导出失败');
      console.error('CMS导出失败:', err);
      return null;
    }
  }, []);

  const importContent = useCallback(async (jsonData: string) => {
    try {
      await cmsService.importContent(jsonData);
      await loadAllContents();
      return true;
    } catch (err) {
      setError('导入失败');
      console.error('CMS导入失败:', err);
      return false;
    }
  }, [loadAllContents]);

  return {
    contents,
    loading,
    error,
    updateContent,
    batchUpdate,
    resetToDefault,
    exportContent,
    importContent,
    refresh: loadAllContents,
  };
}