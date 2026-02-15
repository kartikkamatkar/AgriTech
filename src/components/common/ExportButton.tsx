interface ExportButtonProps {
  data: any;
  filename: string;
  format?: 'json' | 'csv';
  label?: string;
}

const ExportButton = ({ 
  data, 
  filename, 
  format = 'json',
  label = 'Export Data' 
}: ExportButtonProps) => {
  const handleExport = () => {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else {
      // Convert to CSV
      const items = Array.isArray(data) ? data : [data];
      if (items.length === 0) return;

      const headers = Object.keys(items[0]);
      const csvRows = [
        headers.join(','),
        ...items.map((item: any) =>
          headers.map(header => JSON.stringify(item[header] || '')).join(',')
        )
      ];
      
      content = csvRows.join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-agri-beige-dark rounded-lg hover:border-agri-green transition shadow-sm hover:shadow-md"
    >
      <span className="text-lg">📥</span>
      <span className="font-semibold text-gray-800">{label}</span>
    </button>
  );
};

export default ExportButton;
