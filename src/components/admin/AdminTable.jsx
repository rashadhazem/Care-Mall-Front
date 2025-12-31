import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const AdminTable = ({ columns, data, actions, onAction, isLoading }) => {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="p-8 text-center text-gray-500">No data available</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((item, rowIdx) => (
                            <tr key={item.id || rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {col.render ? col.render(item) : item[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {actions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            {/* <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-500">Showing 1 to 10 of {data.length} results</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled><ChevronLeft size={16} /></Button>
                    <Button variant="outline" size="sm" disabled><ChevronRight size={16} /></Button>
                </div>
            </div> */}
        </div>
    );
};

export default AdminTable;
