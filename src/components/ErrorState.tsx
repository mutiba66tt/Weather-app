import { motion } from 'framer-motion';
import { MapPinOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <MapPinOff className="w-12 h-12 text-destructive" strokeWidth={1.5} />
        </div>
      </motion.div>
      
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Unable to Get Weather
        </h2>
        <p className="text-muted-foreground">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
