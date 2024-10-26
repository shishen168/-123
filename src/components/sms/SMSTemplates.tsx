// 在现有的 SMSTemplates 组件中添加导入导出功能
import TemplateImportExport from './TemplateImportExport';

// 在组件顶部添加导入导出组件
<div className="mb-6">
  <TemplateImportExport
    templates={templates}
    onImport={(importedTemplates) => {
      const newTemplates = importedTemplates.map(template => ({
        ...template,
        id: Date.now().toString()
      }));
      setTemplates([...templates, ...newTemplates]);
    }}
  />
</div>