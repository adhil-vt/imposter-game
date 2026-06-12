import { Peer, type DataConnection } from 'peerjs';

export const getDeviceId = (): string => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }
  let id = localStorage.getItem('imposter_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('imposter_device_id', id);
  }
  return id;
};

export interface NetworkPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isAdmin?: boolean;
  isMuted?: boolean;
  isVoiceActive?: boolean;
  isSpectating?: boolean;
}

export type NetworkMessage =
  | { type: 'JOIN'; name: string; avatar: string; playerId: string; deviceId?: string }
  | { type: 'LOBBY_UPDATE'; players: NetworkPlayer[] }
  | { type: 'START_GAME'; myPlayerId: string; players: any[]; playerOrder: string[]; commonWord: string; impostorWord: string; chosenCategory: string; activeWordPairHints: string[]; activePlayerVisualAid: any; gameStartedAt?: number }
  | { type: 'REVEAL_COMPLETE'; playerId: string }
  | { type: 'REVEAL_PROGRESS'; revealedPlayers: string[] }
  | { type: 'TIMER_SYNC'; activeClueIndex: number; timerSeconds: number; timerActive: boolean }
  | { type: 'VOTE_CAST'; voterId: string; votedId: string }
  | { type: 'GAME_OVER'; winner: 'CREWMATES' | 'IMPOSTOR'; voteStats: Record<string, number>; votes: Record<string, string>; impostorId: string }
  | { type: 'PLAY_AGAIN' }
  | { type: 'STATE_CHANGE'; state: string }
  | { type: 'KICKED'; reason?: string; isBan?: boolean }
  | { type: 'VOTE_INITIATED'; targetId: string; targetName: string; voteType: 'KICK' | 'BAN'; initiatorName: string; initiatorId: string }
  | { type: 'GAME_PLAYERS_UPDATE'; players: any[]; playerOrder: string[] }
  | { type: 'CHAT'; message: any }
  | { type: 'ROOM_NOTICE'; text: string }
  | { type: 'SETTINGS_UPDATE'; difficulty: any; selectedCategories: any[]; impostorKnowsRole: boolean; randomizeOrder: boolean; hintsEnabled: boolean; clueTimerLimit: number }
  | { type: 'TRANSFER_HOST'; newAdminId: string }
  | { type: 'KICK_REQUEST'; targetId: string }
  | { type: 'BAN_REQUEST'; targetId: string }
  | { type: 'START_GAME_REQUEST' }
  | { type: 'RESTART_GAME_REQUEST' }
  | { type: 'RENAME_PLAYER'; playerId: string; name: string }
  | { type: 'PLAYER_READY'; playerId: string; isReady: boolean }
  | { type: 'READY_STATUS_UPDATE'; readyPlayers: string[] }
  | { type: 'LEAVE'; playerId: string }
  | { type: 'HOST_LEFT' }
  | { type: 'PING'; timestamp: number }
  | { type: 'PONG'; timestamp: number }
  | { type: 'PING_UPDATE'; pings: Record<string, number> }
  | { type: 'VOTE_KICK_REQUEST'; targetId: string; voterId: string }
  | { type: 'VOTE_BAN_REQUEST'; targetId: string; voterId: string }
  | { type: 'VOTE_KICK_BAN_SYNC'; kickVotes: Record<string, string[]>; banVotes: Record<string, string[]> }
  | { type: 'GAME_IN_PROGRESS'; isStarted: boolean; currentGameState: string }
  | { type: 'VOICE_TOGGLE'; active: boolean };

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

class MultiplayerService {
  private peer: Peer | null = null;
  private connections: Record<string, DataConnection> = {};
  private pendingMessages: Record<string, NetworkMessage[]> = {};
  private onMessageCallback: ((senderId: string, msg: NetworkMessage) => void) | null = null;
  private bannedIds: Set<string> = new Set();
  private bannedDeviceIds: Map<string, string> = new Map();
  private peerToDeviceMap: Map<string, string> = new Map();

  public isHost: boolean = false;
  public roomCode: string = '';
  public myPeerId: string = '';

  public getPeer(): Peer | null {
    return this.peer;
  }

  public playerPings: Record<string, number> = {};
  private onPingCallback: ((pings: Record<string, number>) => void) | null = null;
  private pingIntervalId: any = null;

  // Generate a random 5-digit numeric string for easy lobby entry
  private generateRoomCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  public registerPingCallback(cb: ((pings: Record<string, number>) => void) | null) {
    this.onPingCallback = cb;
  }

  public startPingInterval() {
    if (this.pingIntervalId) return;

    this.pingIntervalId = setInterval(() => {
      const now = Date.now();
      if (this.isHost) {
        Object.entries(this.connections).forEach(([, conn]) => {
          if (conn.open) {
            conn.send({ type: 'PING', timestamp: now });
          }
        });
      } else {
        const hostPeerId = `imposter-${this.roomCode}`;
        const conn = this.connections[hostPeerId];
        if (conn && conn.open) {
          conn.send({ type: 'PING', timestamp: now });
        }
      }
    }, 3000);
  }

  public stopPingInterval() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
    this.playerPings = {};
    this.onPingCallback?.({});
  }

  private sendPingUpdate() {
    this.send({
      type: 'PING_UPDATE',
      pings: this.playerPings
    });
  }

  public initHost(
    onMessage: (senderId: string, msg: NetworkMessage) => void,
    onStatusChange: (status: 'connected' | 'disconnected' | 'error', detail?: string) => void,
    onPlayerJoined: (player: NetworkPlayer) => void,
    onPlayerDisconnected: (playerId: string) => void,
    retryCount = 0
  ): Promise<string> {
    this.isHost = true;
    this.connections = {};
    this.pendingMessages = {};
    this.onMessageCallback = onMessage;

    if (retryCount === 0) {
      this.roomCode = this.generateRoomCode();
    } else {
      this.roomCode = this.generateRoomCode();
      console.log(`Room code collision or unavailable ID. Retrying with new code: ${this.roomCode}`);
    }

    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        this.disconnect();
        reject(new Error('Hosting timed out. PeerJS signaling server is not responding.'));
      }, 10000);

      this.peer = new Peer(`imposter-${this.roomCode}`, {
        debug: 1,
        config: {
          iceServers: ICE_SERVERS
        }
      });

      this.peer.on('open', (id) => {
        clearTimeout(timeoutId);
        this.myPeerId = id;
        onStatusChange('connected');
        this.startPingInterval();
        resolve(this.roomCode);
      });

      this.peer.on('disconnected', () => {
        console.log('Host disconnected from signaling server. Attempting reconnect...');
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      });

      this.peer.on('connection', (conn) => {
        // Reject banned players immediately (by Peer ID if re-connecting via existing WebRTC channel)
        if (this.bannedIds.has(conn.peer)) {
          conn.on('open', () => {
            conn.send({ type: 'KICKED', reason: 'Banned from the room', isBan: true });
            setTimeout(() => conn.close(), 500);
          });
          return;
        }

        // Handle incoming connection from a guest player
        conn.on('open', () => {
          this.connections[conn.peer] = conn;
          this.flushPendingMessages(conn.peer);
        });

        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg.type === 'PING') {
            conn.send({ type: 'PONG', timestamp: msg.timestamp });
          } else if (msg.type === 'PONG') {
            const rtt = Date.now() - msg.timestamp;
            this.playerPings[conn.peer] = rtt;
            this.onPingCallback?.(this.playerPings);
            this.sendPingUpdate();
          } else if (msg.type === 'JOIN') {
            const deviceId = msg.deviceId || `fallback_${conn.peer}`;
            if (this.bannedDeviceIds.has(deviceId)) {
              const reason = this.bannedDeviceIds.get(deviceId);
              conn.send({ type: 'KICKED', reason: reason || 'Banned from the room', isBan: true });
              setTimeout(() => {
                try {
                  conn.close();
                } catch (e) {}
              }, 500);
              return;
            }
            this.peerToDeviceMap.set(conn.peer, deviceId);

            onPlayerJoined({
              id: conn.peer,
              name: msg.name,
              avatar: msg.avatar,
            });
          } else {
            this.onMessageCallback?.(conn.peer, msg);
          }
        });

        conn.on('close', () => {
          delete this.connections[conn.peer];
          delete this.playerPings[conn.peer];
          this.onPingCallback?.(this.playerPings);
          this.sendPingUpdate();
          onPlayerDisconnected(conn.peer);
        });

        conn.on('error', (err) => {
          console.error('Connection error: ', err);
          delete this.connections[conn.peer];
          delete this.playerPings[conn.peer];
          this.onPingCallback?.(this.playerPings);
          this.sendPingUpdate();
          onPlayerDisconnected(conn.peer);
        });
      });

      this.peer.on('error', (err: any) => {
        
        // If ID is taken, retry with a new code (up to 5 times)
        // If ID is taken, retry with a new code (up to 5 times)
        if (err.type === 'unavailable-id' && retryCount < 5) {
          if (this.peer) {
            try {
              this.peer.destroy();
            } catch (e) {}
            this.peer = null;
          }
          this.initHost(onMessage, onStatusChange, onPlayerJoined, onPlayerDisconnected, retryCount + 1)
            .then(resolve)
            .catch(reject);
        } else {
          this.disconnect();
          onStatusChange('error', err.message);
          reject(err);
        }
      });
    });
  }

  public initGuest(
    roomCode: string,
    playerName: string,
    playerAvatar: string,
    onMessage: (senderId: string, msg: NetworkMessage) => void,
    onStatusChange: (status: 'connected' | 'disconnected' | 'error', detail?: string) => void
  ): Promise<void> {
    this.isHost = false;
    this.roomCode = roomCode;
    this.onMessageCallback = onMessage;

    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        this.disconnect();
        reject(new Error('Connection timed out. The host may be offline or unreachable due to network restrictions.'));
      }, 10000);

      this.peer = new Peer({
        debug: 1,
        config: {
          iceServers: ICE_SERVERS
        }
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        
        // Connect to the host's peer ID
        const hostPeerId = `imposter-${roomCode}`;
        let conn: DataConnection;
        try {
          conn = this.peer!.connect(hostPeerId);
        } catch (err: any) {
          clearTimeout(timeoutId);
          this.disconnect();
          reject(new Error('Connection timed out. The host may be offline or unreachable due to network restrictions.'));
          return;
        }

        conn.on('open', () => {
          clearTimeout(timeoutId);
          this.connections[hostPeerId] = conn;
          onStatusChange('connected');
          this.flushPendingMessages(hostPeerId);
          this.startPingInterval();

          // Instantly send JOIN message to host
          conn.send({
            type: 'JOIN',
            name: playerName,
            avatar: playerAvatar,
            playerId: id,
            deviceId: getDeviceId(),
          });
          resolve();
        });

        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg.type === 'PING') {
            conn.send({ type: 'PONG', timestamp: msg.timestamp });
          } else if (msg.type === 'PONG') {
            const rtt = Date.now() - msg.timestamp;
            this.playerPings[hostPeerId] = rtt;
            this.onPingCallback?.(this.playerPings);
          } else if (msg.type === 'PING_UPDATE') {
            const hostPing = this.playerPings[hostPeerId];
            this.playerPings = { ...msg.pings };
            if (hostPing !== undefined) {
              this.playerPings[hostPeerId] = hostPing;
            }
            this.onPingCallback?.(this.playerPings);
          } else {
            this.onMessageCallback?.(hostPeerId, msg);
          }
        });

        conn.on('close', () => {
          onStatusChange('disconnected');
        });

        conn.on('error', (err) => {
          clearTimeout(timeoutId);
          this.disconnect();
          onStatusChange('error', err.message);
          reject(new Error('Connection timed out. The host may be offline or unreachable due to network restrictions.'));
        });
      });

      this.peer.on('disconnected', () => {
        console.log('Guest disconnected from signaling server. Attempting reconnect...');
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      });

      this.peer.on('error', (err: any) => {
        clearTimeout(timeoutId);
        this.disconnect();
        onStatusChange('error', err.message);
        reject(new Error('Connection timed out. The host may be offline or unreachable due to network restrictions.'));
      });
    });
  }

  // Broadcast message to all connected peers (Host only) or send directly to Host (Guest only)
  public send(msg: NetworkMessage) {
    if (this.isHost) {
      Object.entries(this.connections).forEach(([peerId, conn]) => {
        if (conn.open) {
          conn.send(msg);
        } else if (msg.type === 'CHAT') {
          this.queuePendingMessage(peerId, msg);
        }
      });
    } else {
      const hostPeerId = `imposter-${this.roomCode}`;
      const conn = this.connections[hostPeerId];
      if (conn && conn.open) {
        conn.send(msg);
      } else if (msg.type === 'CHAT') {
        this.queuePendingMessage(hostPeerId, msg);
      }
    }
  }

  // Send a targeted message to a single player connection (Host only)
  public sendTo(playerId: string, msg: NetworkMessage) {
    if (this.isHost) {
      const conn = this.connections[playerId];
      if (conn && conn.open) {
        conn.send(msg);
      }
    }
  }

  // Broadcast to all connected peers except one (Host only). Used to notify
  // everyone of an event without echoing it back to the peer that caused it
  // (e.g. a "<name> joined the lobby" banner should not show to the joiner).
  public broadcastExcept(excludePeerId: string, msg: NetworkMessage) {
    if (!this.isHost) return;
    Object.entries(this.connections).forEach(([peerId, conn]) => {
      if (peerId === excludePeerId) return;
      if (conn.open) {
        conn.send(msg);
      } else if (msg.type === 'CHAT') {
        this.queuePendingMessage(peerId, msg);
      }
    });
  }

  public kickPlayer(playerId: string, reason?: string, isBan?: boolean) {
    if (this.isHost) {
      const conn = this.connections[playerId];
      if (conn) {
        if (conn.open) {
          conn.send({ type: 'KICKED', reason, isBan });
        }
        setTimeout(() => {
          try {
            conn.close();
          } catch (e) {}
        }, 500);
        delete this.connections[playerId];
      }
    }
  }

  public closeConnection(playerId: string) {
    if (this.isHost) {
      const conn = this.connections[playerId];
      if (conn) {
        try {
          conn.close();
        } catch (e) {
          console.error('Error closing connection:', e);
        }
        delete this.connections[playerId];
      }
    }
  }

  public banPlayer(playerId: string, reason?: string) {
    if (this.isHost) {
      this.bannedIds.add(playerId);
      const deviceId = this.peerToDeviceMap.get(playerId);
      if (deviceId) {
        this.bannedDeviceIds.set(deviceId, reason || 'Banned by host');
      }
      this.kickPlayer(playerId, reason, true);
    }
  }

  public disconnect() {
    this.stopPingInterval();
    Object.values(this.connections).forEach((conn) => {
      try {
        conn.close();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    });
    this.connections = {};
    this.pendingMessages = {};
    
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {
        console.error('Error destroying peer:', e);
      }
      this.peer = null;
    }
    
    this.bannedIds.clear();
    this.bannedDeviceIds.clear();
    this.peerToDeviceMap.clear();
    this.isHost = false;
    this.roomCode = '';
    this.myPeerId = '';
  }

  private queuePendingMessage(targetId: string, msg: NetworkMessage) {
    if (!this.pendingMessages[targetId]) {
      this.pendingMessages[targetId] = [];
    }
    const bucket = this.pendingMessages[targetId];
    if (msg.type === 'CHAT' && bucket.some(existing => existing.type === 'CHAT' && (existing as any).message?.id === (msg as any).message?.id)) {
      return;
    }
    bucket.push(msg);
  }

  private flushPendingMessages(targetId: string) {
    const queued = this.pendingMessages[targetId];
    const conn = this.connections[targetId];
    if (!queued || !conn || !conn.open) return;

    queued.forEach((msg) => conn.send(msg));
    delete this.pendingMessages[targetId];
  }
}

export const multiplayer = new MultiplayerService();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    multiplayer.disconnect();
  });
}
