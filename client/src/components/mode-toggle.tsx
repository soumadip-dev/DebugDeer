import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-lg border-border/50 bg-transparent hover:bg-muted hover:border-border"
          style={{ transition: 'background-color 150ms, border-color 150ms' }}
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 dark:scale-0 dark:-rotate-90" 
               style={{ transition: 'transform 200ms, opacity 200ms' }} />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 dark:scale-100 dark:rotate-0" 
                style={{ transition: 'transform 200ms, opacity 200ms' }} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[8rem] bg-background/95 backdrop-blur-xl border-border z-[100]"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <span className="mr-2 h-4 w-4 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
