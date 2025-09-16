import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface LogEntry {
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  details?: any;
}

interface StatusIndicatorProps {
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ className }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<'success' | 'warning' | 'error'>('success');

  // Monitor console logs
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    const addLog = (level: 'info' | 'warning' | 'error', message: string, details?: any) => {
      setLogs(prev => [...prev.slice(-49), {
        level,
        message,
        timestamp: new Date(),
        details
      }]);
    };

    // Override console methods to capture logs
    console.error = (...args) => {
      originalConsole.error(...args);
      addLog('error', args.join(' '), args);
      setStatus('error');
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      addLog('warning', args.join(' '), args);
      if (status !== 'error') {
        setStatus('warning');
      }
    };

    console.info = (...args) => {
      originalConsole.info(...args);
      addLog('info', args.join(' '), args);
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      addLog('info', args.join(' '), args);
    };

    // Check for React errors via error events
    const handleError = (event: ErrorEvent) => {
      addLog('error', `${event.error?.name || 'Error'}: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
      setStatus('error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addLog('error', `Unhandled Promise Rejection: ${event.reason}`, event.reason);
      setStatus('error');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      // Restore original console methods
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
      
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'error':
        return <XCircle className="h-4 w-4 text-white" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-white" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-white" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-white" />;
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStatus('success');
  };

  const errorCount = logs.filter(log => log.level === 'error').length;
  const warningCount = logs.filter(log => log.level === 'warning').length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`relative flex items-center gap-2 ${className}`}
        >
          {/* Traffic light indicator */}
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
          {getStatusIcon()}
          {(errorCount > 0 || warningCount > 0) && (
            <Badge variant="destructive" className="text-xs min-w-[1.5rem] h-5">
              {errorCount + warningCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Stav systému a chybové hlášení
          </DialogTitle>
          <DialogDescription>
            Přehled systémových zpráv, varování a chyb
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-green-900">Informace</div>
                <div className="text-lg font-bold text-green-700">
                  {logs.filter(log => log.level === 'info').length}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-yellow-900">Varování</div>
                <div className="text-lg font-bold text-yellow-700">{warningCount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-sm font-medium text-red-900">Chyby</div>
                <div className="text-lg font-bold text-red-700">{errorCount}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button onClick={clearLogs} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Vymazat log
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Celkem záznamů: {logs.length}
            </div>
          </div>

          {/* Logs Display */}
          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p>Žádné záznamy k zobrazení</p>
                </div>
              ) : (
                logs.slice().reverse().map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      log.level === 'error'
                        ? 'bg-red-50 border-l-red-500'
                        : log.level === 'warning'
                        ? 'bg-yellow-50 border-l-yellow-500'
                        : 'bg-blue-50 border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        {log.level === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                        {log.level === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {log.level === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        <Badge 
                          variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString('cs-CZ')}
                      </div>
                    </div>
                    <div className="text-sm font-mono bg-white/50 p-2 rounded border">
                      {log.message}
                    </div>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Detaily
                        </summary>
                        <pre className="text-xs bg-white/50 p-2 rounded border mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};