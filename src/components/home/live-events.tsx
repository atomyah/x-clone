import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LiveEvent } from '@/types/post';

interface LiveEventsProps {
  events: LiveEvent[];
}

export function LiveEvents({ events }: LiveEventsProps) {
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Xでライブ放送する</h2>
      {events.map((event) => (
        <div
          key={event.id}
          className="mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0"
        >
          <div className="flex items-start gap-3">
            <div className="flex -space-x-2">
              {event.participants.map((participant, idx) => (
                <Avatar
                  key={idx}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={participant} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              ))}
              {event.count > 0 && (
                <div className="h-8 w-8 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center border-2 border-background font-bold">
                  +{event.count}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">
                {event.user}
                <span className="text-muted-foreground font-normal">
                  {' '}
                  {event.status}
                </span>
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {event.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

