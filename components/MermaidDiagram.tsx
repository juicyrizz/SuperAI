
import React, { useEffect, useState, useRef } from 'react';
import type { Theme } from '../types';
import { Theme as ThemeEnum } from '../types';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
    theme: Theme;
}

let idCounter = 0;

const MermaidDiagram: React.FC<MermaidProps> = ({ chart, theme }) => {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState('');
    const idRef = useRef(`mermaid-diagram-${idCounter++}`);
    
    useEffect(() => {
        const renderChart = async () => {
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: theme === ThemeEnum.LIGHT ? 'default' : 'dark',
                    securityLevel: 'loose',
                    fontFamily: 'sans-serif',
                    logLevel: 'fatal',
                    themeVariables: {
                        background: theme === ThemeEnum.LIGHT ? '#f3f4f6' : '#1f2937',
                        primaryColor: theme === ThemeEnum.LIGHT ? '#e5e7eb' : '#374151',
                        primaryTextColor: theme === ThemeEnum.LIGHT ? '#111827' : '#f9fafb',
                        lineColor: theme === ThemeEnum.LIGHT ? '#6b7280' : '#9ca3af',
                        textColor: theme === ThemeEnum.LIGHT ? '#1f2937' : '#d1d5db',
                        fontSize: '14px',
                    }
                });

                const chartString = (typeof chart === 'string' ? chart : String(chart))
                    .trim()
                    .replace(/(\w+)\[\s+"([^"]*)"\s+\]/g, '$1["$2"]'); // Fix common AI syntax error

                if (!chartString) {
                    setSvg('');
                    setError('');
                    return;
                }

                const { svg: renderedSvg } = await mermaid.render(idRef.current, chartString);
                setSvg(renderedSvg);
                setError('');
            } catch (e: any) {
                console.error("Mermaid render error:", e);
                setError(e.str || e.message || 'Invalid diagram syntax.');
                setSvg('');
            }
        };

        const timer = setTimeout(renderChart, 50); // Small delay for DOM
        return () => clearTimeout(timer);

    }, [chart, theme]);

    if (error) {
        const themeClasses = {
            [ThemeEnum.LIGHT]: "bg-red-100 border-red-300 text-red-800",
            [ThemeEnum.DARK]: "bg-red-900/50 border-red-500/50 text-red-200",
            [ThemeEnum.TRANSPARENT]: "bg-red-900/50 border-red-500/50 text-red-200",
        };
        const tc = themeClasses[theme];
        return (
            <div className={`p-2 my-2 border rounded-md text-xs font-mono ${tc}`}>
                <p className="font-sans font-bold mb-1">Diagram Error</p>
                <pre className="p-2 bg-black/30 rounded text-xs whitespace-pre-wrap">{chart}</pre>
            </div>
        );
    }
    
    return <div key={svg} className="mermaid-container my-2 flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidDiagram;
